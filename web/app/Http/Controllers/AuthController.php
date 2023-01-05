<?php

namespace App\Http\Controllers;

use App\Lib\AuthRedirection;
use App\Logging\CustomLogger;
use App\Models\Session;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Log;
use Shopify\Auth\OAuth;
use Shopify\Utils;
use Shopify\Webhooks\Registry;
use Shopify\Webhooks\Topics;

class AuthController extends Controller
{
    public function authRedirection(Request $request)
    {
        $shop = Utils::sanitizeShopDomain($request->query('shop'));

        // Delete any previously created OAuth sessions that were not completed (don't have an access token)
        Session::where('shop', $shop)->where('access_token', null)->delete();

        return AuthRedirection::redirect($request);
    }

    public function callback(Request $request)
    {
        $session = OAuth::callback(
            $request->cookie(),
            $request->query(),
            ['App\Lib\CookieHandler', 'saveShopifyCookie'],
        );

        $host = $request->query('host');

        WebhookRegistryController::register($request);

        $redirectUrl = Utils::getEmbeddedAppUrl($host);

        if (Config::get('shopify.billing.required')) {
            $redirectUrl = BillingController::checkApiCall($session, $redirectUrl);
        }

        return redirect($redirectUrl);
    }
}
