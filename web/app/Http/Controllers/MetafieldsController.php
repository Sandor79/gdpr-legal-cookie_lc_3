<?php

namespace App\Http\Controllers;

use App\Logging\CustomLogger;
use Illuminate\Http\Request;
use Shopify\Clients\Graphql;

class MetafieldsController extends Controller
{
    public static function get(Request $request, $namespace, $key)
    {
        try {
            $session = $request->get('shopifySession');

            // Create GraphQL client
            $client = new Graphql($session->getShop(), $session->getAccessToken());
            // Use `query` method and pass your query as `data`
            $queryString = "query {
                      shop {
                        metafield(namespace:\"" . $namespace . "\", key:\"" . $key . "\") {
                          id
                          key
                          value
                          type
                        }
                      }
                    }";

            $response = $client->query($queryString);
            $responseBody = $response->getDecodedBody();

            CustomLogger::debug(
                "metafields",
                print_r($responseBody, true),
                ["responseBody", __FILE__]
            );

            if (!is_null($responseBody["data"]["shop"]["metafield"])) {
                return response($responseBody["data"]["shop"]["metafield"], 200);
            } else {
                throw new \Error("Metafield with Namespace: " . $namespace . " and Key: " . $key . " not exists.");
            }
        } catch (\Exception $e) {
            CustomLogger::debug(
                "metafields",
                $e
            );
        }
        return response("{}");
    }

    public static function ownerId(Request $request)
    {
        try {
            $session = $request->get('shopifySession');

            // Create GraphQL client
            $client = new Graphql($session->getShop(), $session->getAccessToken());
            // Use `query` method and pass your query as `data`
            $queryString = "query {
                      shop {
                        id
                      }
                    }";

            $response = $client->query($queryString);
            $responseBody = $response->getDecodedBody();

            CustomLogger::debug(
                "metafields",
                print_r($responseBody, true),
                ["responseBody", __FILE__]
            );

            if (!is_null($responseBody["data"]["shop"]["id"])) {
                return response($responseBody["data"]["shop"], 200);
            } else {
                throw new \Error("Owner id cannot loading");
            }
        } catch (\Exception $e) {
            CustomLogger::debug(
                "metafields",
                $e
            );
        }
        return response("{}");
    }
    public static function save(Request $request)
    {
        $data = $request->post();
    }
}
