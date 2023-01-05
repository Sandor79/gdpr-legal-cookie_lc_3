<?php

use App\Http\Controllers\AuthController;
use App\Exceptions\ShopifyProductCreatorException;
use App\Http\Controllers\MetafieldsController;
use App\Http\Controllers\ThemeController;
use App\Http\Controllers\WebhookRegistryController;
use App\Lib\ProductCreator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Shopify\Auth\Session as AuthSession;
use Shopify\Clients\Rest;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('/', function () {
    return "Hello API";
});

Route::prefix('auth')->controller(AuthController::class)->group(function () {
    Route::get('/', "authRedirection");
    Route::get('/callback', "callback");
});


Route::group([ 'middleware' => ["shopify.auth"]], function () {
    Route::get('/products/count', function (Request $request) {
        try {
            /** @var AuthSession */
            $session = $request->get('shopifySession'); // Provided by the shopify.auth middleware, guaranteed to be active

            $client = new Rest($session->getShop(), $session->getAccessToken());
            $result = $client->get('products/count');

            return response($result->getDecodedBody());
        } catch (Exception $e) {
            Log::error($e);
        }
        return null;
    });

    Route::get('/products/create', function (Request $request) {
        /** @var AuthSession */
        $session = $request->get('shopifySession'); // Provided by the shopify.auth middleware, guaranteed to be active

        $success = $code = $error = null;
        try {
            ProductCreator::call($session, 5);
            $success = true;
            $code = 200;
            $error = null;
        } catch (\Exception $e) {
            $success = false;

            if ($e instanceof ShopifyProductCreatorException) {
                $code = $e->response->getStatusCode();
                $error = $e->response->getDecodedBody();
                if (array_key_exists("errors", $error)) {
                    $error = $error["errors"];
                }
            } else {
                $code = 500;
                $error = $e->getMessage();
            }

            Log::error("Failed to create products: $error");
        } finally {
            return response()->json(["success" => $success, "error" => $error], $code);
        }
    });

    Route::prefix('metafield')->controller(MetafieldsController::class)->group(function () {
        Route::get('/namespace/{namespace}/key/{key}', "get");
        Route::post('/save/', "save");
    });

    Route::prefix('themes')->controller(ThemeController::class)->group(function () {
        Route::get('/get-all', "getAll");
        Route::post('/save', "post");
    });

    Route::prefix('webhooks')->controller(WebhookRegistryController::class)->group(function () {
        Route::post('/', 'processIncomingWebhook');
        Route::get('/check-registry', "register");
    });
});
