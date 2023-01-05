<?php

namespace App\Http\Controllers;

use Exception;
use App\Logging\CustomLogger;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Log;
use Shopify\Exception\MissingWebhookHandlerException;
use Shopify\Webhooks\Registry;
use Shopify\Clients\HttpHeaders;
use Shopify\Exception\InvalidWebhookException;

class WebhookRegistryController extends Controller
{
    public static function register(Request $request): JsonResponse
    {
        $session = $request->get('shopifySession');
        $shop = $session->getShop();
        $errors = array();

        $webhooks = Config::get('bc-config.webhooks');
        $reflectionTopics = new \ReflectionClass("Shopify\Webhooks\Topics");

        foreach ($webhooks as $webhook) {
            try {
                $topic = $reflectionTopics->getStaticPropertyValue($webhook);

                if (!is_null($topic)) {
                    $response = Registry::register('/api/webhooks', $topic, $shop, $session->getAccessToken());
                    if ($response->isSuccess()) {
                        Log::debug("Registered $topic webhook for shop $shop");
                    } else {
                        throw new Exception("Registry $webhook webhook for shop $shop failed.");
                    }
                } else {
                    throw new Exception("Webhook '$webhook' not exists. Registry failed for shop $shop.");
                }
            } catch (InvalidWebhookException | MissingWebhookHandlerException | Exception $e) {
                array_push($errors, $e->getMessage());
            }
        }
        if (sizeof($errors) > 0) {
            CustomLogger::error(
                "webhooks",
                print_r($errors)
            );
            return response()->json(['message' => "Webhook regitry failed", "errors" => $errors], 500);
        }
        return response()->json(['message' => "Registred all webhooks."], 200);
    }

    public static function processIncomingWebhook(Request $request)
    {
        try {
            $topic = $request->header(HttpHeaders::X_SHOPIFY_TOPIC, '');

            CustomLogger::debug(
                "webhooks",
                print_r([$request->header(), $request->getContent(), $topic], true),
                ["webhooks", __LINE__, __FILE__]
            );

            $response = Registry::process($request->header(), $request->getContent());
            if (!$response->isSuccess()) {
                CustomLogger::error(
                    "webhooks",
                    "Failed to process '$topic' webhook: {$response->getErrorMessage()}"
                );
                return response()->json(['message' => "Failed to process '$topic' webhook"], 500);
            }
        } catch (InvalidWebhookException $e) {
            CustomLogger::error(
                "webhooks",
                "Got invalid webhook request for topic '$topic': {$e->getMessage()}"
            );
            return response()->json(['message' => "Got invalid webhook request for topic '$topic'"], 401);
        } catch (\Exception $e) {
            CustomLogger::error(
                "webhooks",
                "Got an exception when handling '$topic' webhook: {$e->getMessage()}"
            );
            return response()->json(['message' => "Got an exception when handling '$topic' webhook"], 500);
        }
    }
}
