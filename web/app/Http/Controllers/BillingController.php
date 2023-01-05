<?php

namespace App\Http\Controllers;

use App\Helpers\Helpers;
use App\Logging\CustomLogger;
use App\Models\Plan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Shopify\Clients\Graphql;
use Shopify\Auth\Session;
use Exception;

class BillingController
{
    private const FREE = "free";
    private const BASID = "basic";
    private const SHOPIFY = "shopify";
    private const SHOPIFY_PLUS = "advanced-shopify";

    public static function checkWebCall(Session $session, Request $request)
    {
        list($hasPayment, $confirmationUrl) = self::checkPlan($session);

        CustomLogger::debug(
            "billing",
            print_r(["checkWebCall", $hasPayment ? "true" : "false", $confirmationUrl], true),
            ["hasPayment", "confirmationUrl", __LINE__, (explode('/web/', __FILE__)[1])]
        );
        return [$hasPayment, $confirmationUrl];
    }

    public static function checkApiCall(Session $session, Request $redirectUrl)
    {
        list($hasPayment, $confirmationUrl) = self::checkPlan($session);
        CustomLogger::debug(
            "billing",
            print_r(["checkApiCall", $hasPayment ? "true" : "false", $confirmationUrl], true),
            ["hasPayment", "confirmationUrl", __LINE__, (explode('/web/', __FILE__)[1])]
        );
        if (!$hasPayment) {
            $redirectUrl = $confirmationUrl;
        }
        return $redirectUrl;
    }

    private static function checkPlan($session): array
    {
        $plan = self::getBillingPlan($session);
        if (is_null($plan)) {
            return [true, null];
        }
        return ApplicationChargeController::check($session, $plan);
    }

    private static function getCurrentShopifyPlan(Session $session)
    {
        $displayName = null;
        $partnerDevelopment = null;
        $shopifyPlus = null;

        try {
            // Create GraphQL client
            $client = new Graphql($session->getShop(), $session->getAccessToken());
            // Abfrage des aktuellen Shop Plan
            $response = $client->query(Config::get("queries.QUERY_SHOP_PLAN"));
            $responseBody = $response->getDecodedBody();

            CustomLogger::debug(
                "billing",
                print_r($responseBody, true),
                ["getCurrentShopifyPlan => responseBody", __LINE__, (explode('/web/', __FILE__)[1])]
            );

            $data = $responseBody["data"];
            CustomLogger::debug(
                "billing",
                print_r(Helpers::isset("shop.plan", $data)  ? "true" : "false", true),
                ["getCurrentShopifyPlan => responseBody", __LINE__, (explode('/web/', __FILE__)[1])]
            );

            if (!is_null($data) && Helpers::isset("shop.plan", $data)) {
                $shopifyPlan = $data["shop"]["plan"];
                $displayName = $shopifyPlan["displayName"];
                $partnerDevelopment = $shopifyPlan["partnerDevelopment"];
                $shopifyPlus = $shopifyPlan["shopifyPlus"];
            }
        } catch (Exception $e) {
            CustomLogger::error(
                "billing",
                $e->getMessage(),
                ["getCurrentShopifyPlan", $session->getShop(), __LINE__, (explode('/web/', __FILE__)[1]) ]
            );
        } finally {
            return [ $displayName, $partnerDevelopment, $shopifyPlus ];
        }
    }

    public static function getBillingPlan($session): ?Plan
    {
        list( $displayName, $partnerDevelopment, $shopifyPlus ) = self::getCurrentShopifyPlan($session);

        if (is_null($displayName) && is_null($partnerDevelopment) && is_null($shopifyPlus)) {
            return null;
        }
        CustomLogger::debug(
            "billing",
            print_r($displayName, true),
            ["displayName", __LINE__, (explode('/web/', __FILE__)[1])]
        );
        CustomLogger::debug(
            "billing",
            print_r($partnerDevelopment, true),
            ["partnerDevelopment", __LINE__, (explode('/web/', __FILE__)[1])]
        );

        $billingPlan = self::SHOPIFY_PLUS;

        if (!!is_null($displayName)) {
            if ($shopifyPlus || !!(bool)env("TEST_BILLING_ENABLED", false)) {
                $billingPlan = self::SHOPIFY_PLUS;
            } elseif ($displayName == "Basic Shopify") {
                $billingPlan = self::BASID;
            } elseif ($displayName == "Pause and Build") {
                $billingPlan = self::FREE;
            } elseif ($displayName == "Developer Preview" || $partnerDevelopment) {
                $billingPlan = self::FREE;
            } else {
                $billingPlan = self::SHOPIFY;
            }
        }
        $plan = Plan::firstWhere("name", $billingPlan);

        CustomLogger::debug(
            "billing",
            print_r($billingPlan, true),
            ["chargeName", __LINE__, (explode('/web/', __FILE__)[1])]
        );
        CustomLogger::debug(
            "billing",
            print_r($plan, true),
            ["getBillingPlan => plan", __LINE__, (explode('/web/', __FILE__)[1])]
        );
        CustomLogger::debug(
            "billing",
            print_r($plan["name"], true),
            ["getBillingPlan", __LINE__, (explode('/web/', __FILE__)[1])]
        );
        return $plan;
    }
}
