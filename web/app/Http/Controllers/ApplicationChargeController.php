<?php

namespace App\Http\Controllers;

use App\Exceptions\ShopifyBillingException;
use App\Helpers\Helpers;
use App\Logging\CustomLogger;
use App\Models\Charge;
use App\Models\Plan;
use Illuminate\Support\Facades\Log;
use Shopify\Auth\Session;
use Shopify\Clients\Graphql;
use Shopify\Context;

class ApplicationChargeController
{
    public const CAPPED_AMOUNT = "capped_amount";
    public const USAGE_CHARGE = "recurring_application_charge_id";

    public const INTERVAL_ONE_TIME = "ONE_TIME";
    public const INTERVAL_EVERY_30_DAYS = "EVERY_30_DAYS";
    public const INTERVAL_ANNUAL = "ANNUAL";


    /**
     * Check if the given session has an active payment based on the configs.
     *
     * @param Session $session The current session to check
     * @param ?Plan   $plan  Associative array that accepts keys:
     *                         - "chargeName": string, the name of the charge
     *                         - "amount": float
     *                         - "currencyCode": string
     *                         - "interval": one of the INTERVAL_* consts
     *
     * @return array Array containing
     * - hasPayment: bool
     * - confirmationUrl: string|null
     */
    public static function check(Session $session, ?Plan $plan): array
    {
        $hasPayment = false;
        $confirmationUrl = null;
        try {
            if (self::hasActivePayment($session, $plan)) {
                $hasPayment = true;
            } else {
                $hasPayment = false;
                $confirmationUrl = self::requestPayment($session, $plan);
            }
        } catch (ShopifyBillingException $e) {
            Log::error(
                print_r([$e->getMessage(), $e->errorData], true),
                ["check", $session->getShop(), __LINE__, (explode('/web/', __FILE__)[1]) ]
            );
            $hasPayment = true;
        } finally {
            CustomLogger::debug(
                "billing",
                print_r([$hasPayment ? "true" : "false", $confirmationUrl], true),
                ["hasPayment", "confirmationUrl", __LINE__, (explode('/web/', __FILE__)[1])]
            );
            return [$hasPayment, $confirmationUrl];
        }
    }

    private static function hasActivePayment(Session $session, Plan $plan): bool
    {
        if (self::isRecurring($plan)) {
            return self::hasSubscription($session, $plan);
        } else {
            return self::hasOneTimePayment($session, $plan);
        }
    }

    private static function hasSubscription(Session $session, Plan $plan): bool
    {
        $result = false;
        try {
            $responseBody = self::queryOrException($session, self::RECURRING_PURCHASES_QUERY);
            CustomLogger::debug(
                "billing",
                print_r($responseBody, true),
                ["hasSubscription => responseBody", __LINE__, (explode('/web/', __FILE__)[1])]
            );

            if (Helpers::isset("data.currentAppInstallation.activeSubscriptions", $responseBody)) {
                $subscriptions = $responseBody["data"]["currentAppInstallation"]["activeSubscriptions"];

                foreach ($subscriptions as $subscription) {
                    CustomLogger::debug(
                        "billing",
                        print_r([
                            "subscription['status']" => $subscription["status"],
                            "subscription['name']" => $subscription["name"],
                            "!subscription['test']" => (!$subscription["test"] ? "true" : "false"),
                            "plan['name']" => $plan["name"],
                            "!self::isProd()" => (!self::isProd() ? "true" : "false")
                        ], true),
                        ["hasSubscription => subscription", __LINE__, (explode('/web/', __FILE__)[1])]
                    );
                    if (
                        $subscription["name"] === $plan["name"] &&
                        (!self::isProd() || !$subscription["test"]) &&
                        $subscription["status"] === "ACTIVE"
                    ) {
                        $result = true;
                        break;
                    }
                }
            }
            CustomLogger::debug(
                "billing",
                $result ? "true" : "false",
                ["hasSubscription => result", __LINE__, (explode('/web/', __FILE__)[1])]
            );
            return $result;
        } catch (ShopifyBillingException $e) {
            Log::error(
                print_r([$e->getMessage(), $e->errorData], true),
                ["hasSubscription", $session->getShop(), __LINE__, (explode('/web/', __FILE__)[1]) ]
            );
            $result = true;
        } finally {
            return $result;
        }
    }

    private static function hasOneTimePayment(Session $session, Plan $plan): bool
    {
        $result = false;
        try {
            $purchases = null;
            $endCursor = null;
            do {
                $responseBody = self::queryOrException(
                    $session,
                    [
                        "query" => self::ONE_TIME_PURCHASES_QUERY,
                        "variables" => ["endCursor" => $endCursor]
                    ]
                );
                $purchases = $responseBody["data"]["currentAppInstallation"]["oneTimePurchases"];

                foreach ($purchases["edges"] as $purchase) {
                    $node = $purchase["node"];
                    if (
                        $node["name"] === $plan["chargeName"] &&
                        (!self::isProd() || !$node["test"]) &&
                        $node["status"] === "ACTIVE"
                    ) {
                        $result = true;
                    }
                }

                $endCursor = $purchases["pageInfo"]["endCursor"];
            } while ($purchases["pageInfo"]["hasNextPage"]);
        } catch (ShopifyBillingException $e) {
            Log::error(
                print_r([$e->getMessage(), $e->errorData], true),
                ["hasSubscription", $session->getShop(), __LINE__, (explode('/web/', __FILE__)[1]) ]
            );
            $result = true;
        } finally {
            return $result;
        }
    }

    private static function isRecurring(Plan $plan): bool
    {
        return $plan->isRecurring();
    }

    private static function requestPayment(Session $session, Plan $plan)
    {
        $date = null;
        $hostName = Context::$HOST_NAME;
        $shop = $session->getShop();
        $host = base64_encode("$shop/admin");
        $returnUrl = "https://$hostName?shop={$shop}&host=$host";

        if (self::isRecurring($plan)) {
            if (self::withCappedAmount($plan)) {
                $data = self::requestRecurringCappedAmountPayment($session, $plan, $returnUrl);

                $charge = new Charge($data);
                CustomLogger::debug(
                    "billing",
                    print_r($charge, true),
                    ["requestRecurringCappedAmountPayment response", __LINE__, (explode('/web/', __FILE__)[1])]
                );
                $charge->save();

                $data = $data["data"]["appSubscriptionCreate"];
            } else {
                $data = self::requestRecurringPayment($session, $plan, $returnUrl);
                $data = $data["data"]["appSubscriptionCreate"];
            }
        } else {
            $data = self::requestOneTimePayment($session, $plan, $returnUrl);
            $data = $data["data"]["appPurchaseOneTimeCreate"];
        }

        if (!empty($data["userErrors"])) {
            throw new ShopifyBillingException("Error while billing the store", $data["userErrors"]);
        }
        CustomLogger::debug(
            "billing",
            print_r($data, true),
            ["requestPayment => data", __LINE__, (explode('/web/', __FILE__)[1])]
        );
        return [$date["appSubscription"]["id"], $data["confirmationUrl"]];
    }

    private static function withCappedAmount(Plan $plan): bool
    {
        return isset($plan[self::CAPPED_AMOUNT]) && $plan[self::CAPPED_AMOUNT] > 0;
    }

    private static function requestRecurringCappedAmountPayment(Session $session, Plan $plan, string $returnUrl): array
    {
        return self::queryOrException(
            $session,
            [
                "query" => self::RECURRING_CAPPED_AMOUNT_MUTATION,
                "variables" => [
                    "name" => "" . $plan["name"],
                    "returnUrl" => "" . $returnUrl,
                    "trialDays" => $plan["trial_days"],
                    "lineItems" => [
                        [
                            "plan" => [
                                "appRecurringPricingDetails" => [
                                    "interval" => self::INTERVAL_EVERY_30_DAYS,
                                    "price" => [
                                        "amount" => $plan["price"],
                                        "currencyCode" => $plan->getCurrencyCode()
                                    ]
                                ],
                            ]
                        ],
                        [
                            "plan" => [
                                "appUsagePricingDetails" => [
                                    "cappedAmount" => [
                                        "amount" => $plan["capped_amount"],
                                        "currencyCode" => $plan->getCurrencyCode()
                                    ],
                                    "terms" => $plan["terms"]
                                ]
                            ]
                        ],
                    ],
                    "test" => !self::isProd(),
                ],
            ]
        );
    }

    private static function requestRecurringPayment(Session $session, Plan $plan, string $returnUrl): array
    {
        return self::queryOrException(
            $session,
            [
                "query" => self::RECURRING_PURCHASE_MUTATION,
                "variables" => [
                    "name" => $plan["chargeName"],
                    "lineItems" => [
                        "plan" => [
                            "appRecurringPricingDetails" => [
                                "interval" => $plan["interval"],
                                "price" => ["amount" => $plan["amount"], "currencyCode" => $plan["currencyCode"]],
                            ],
                        ],
                    ],
                    "returnUrl" => $returnUrl,
                    "test" => !self::isProd(),
                ],
            ]
        );
    }

    private static function requestOneTimePayment(Session $session, Plan $plan, string $returnUrl): array
    {
        return self::queryOrException(
            $session,
            [
                "query" => self::ONE_TIME_PURCHASE_MUTATION,
                "variables" => [
                    "name" => $plan["chargeName"],
                    "price" => ["amount" => $plan["amount"], "currencyCode" => $plan["currencyCode"]],
                    "returnUrl" => $returnUrl,
                    "test" => !self::isProd(),
                ],
            ]
        );
    }

    private static function isProd()
    {
        return app()->environment() === 'production';
    }

    /**
     * @param string|array $query
     */
    private static function queryOrException(Session $session, $query): array
    {
        $client = new Graphql($session->getShop(), $session->getAccessToken());

        $response = $client->query($query);
        $responseBody = $response->getDecodedBody();

        if (!empty($responseBody["errors"])) {
            throw new ShopifyBillingException("Error while billing the store", (array)$responseBody["errors"]);
        }

        return $responseBody;
    }

    private const RECURRING_PURCHASES_QUERY = <<<'QUERY'
    query appSubscription {
        currentAppInstallation {
            activeSubscriptions {
                name
                status
                test
            }
        }
    }
    QUERY;
    private const ONE_TIME_PURCHASES_QUERY = <<<'QUERY'
    query appPurchases($endCursor: String) {
        currentAppInstallation {
            oneTimePurchases(first: 250, sortKey: CREATED_AT, after: $endCursor) {
                edges {
                    node {
                        name, test, status
                    }
                }
                pageInfo {
                    hasNextPage, endCursor
                }
            }
        }
    }
    QUERY;
    private const RECURRING_PURCHASE_MUTATION = <<<'QUERY'
    mutation createPaymentMutation(
        $name: String!
        $lineItems: [AppSubscriptionLineItemInput!]!
        $returnUrl: URL!
        $test: Boolean
    ) {
        appSubscriptionCreate(
            name: $name
            lineItems: $lineItems
            returnUrl: $returnUrl
            test: $test
        ) {
            confirmationUrl
            userErrors {
                field, message
            }
        }
    }
    QUERY;
    private const ONE_TIME_PURCHASE_MUTATION = <<<'QUERY'
    mutation createPaymentMutation(
        $name: String!
        $price: MoneyInput!
        $returnUrl: URL!
        $test: Boolean
    ) {
        appPurchaseOneTimeCreate(
            name: $name
            price: $price
            returnUrl: $returnUrl
            test: $test
        ) {
            confirmationUrl
            userErrors {
                field, message
            }
        }
    }
    QUERY;
    private const RECURRING_CAPPED_AMOUNT_MUTATION = <<<'QUERY'
        mutation createPaymentMutation(
            $name: String!
            $lineItems: [AppSubscriptionLineItemInput!]!
            $returnUrl: URL!
            $test: Boolean
        ) {
            appSubscriptionCreate(
                name: $name
                lineItems: $lineItems
                returnUrl: $returnUrl
                test: $test
            ) {
                userErrors {
                  field
                  message
                }
                appSubscription {
                  id
                  lineItems {
                    id
                    plan {
                      pricingDetails {
                        __typename
                      }
                    }
                  }
                  createdAt
                  currentPeriodEnd
                  name
                  status
                  test
                  trialDays
                }
                confirmationUrl
            }
        }
    QUERY;
}
