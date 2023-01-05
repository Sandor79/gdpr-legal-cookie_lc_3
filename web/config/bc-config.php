<?php

use App\Http\Controllers\ApplicationChargeController;

return [
    'webhooks' => ['APP_UNINSTALL','APP_UNINSTALLED','APP_SUBSCRIPTIONS_UPDATE','SHOP_UPDATE'],
    'banner-settings' => [
        /*
        |-----------------------------------------------------------------------
        |   Define path to basic files and basic data for Banner
        |-----------------------------------------------------------------------
        */
        'base' => [
            'dir' => '..' . DIRECTORY_SEPARATOR . 'resources' . DIRECTORY_SEPARATOR . 'data' . DIRECTORY_SEPARATOR ,
            'base' => 'banner-basic.json',
            'css' => 'banner-css.css',
            'html' => 'banner-html.html',
            'context' => 'banner-context.json',
            'context_de' => 'banner-context-de.json',
            'context_en' => 'banner-context-en.json',
            'context_fr' => 'banner-context-fr.json',
            'context_es' => 'banner-context-es.json',
            'liquid' => 'bc_banner.liquid',
            'js' => 'proceed.liquid',
            'load-metafields' => 'load-metafields.liquid',
            'zload-metafields' => 'zload-metafields.liquid',
            'cookie_list' => 'cookie-list.json',
            'bc_tag_manager' => 'bc_tag_manager.json',
            'settings' => 'settings.json'
        ],
        'host_file_data' => [
            //'proceed' => 'https://bc-kekse.beeclever.app/js/proceed.js',
            //'proceed' => 'https://gdpr-legal-cookie.beeclever.app/get-script',
            'proceed' => env('APP_HOST') . '/get-script',
            'proceed_php' => env('APP_HOST') . '/get-script.php'
        ],
        /*
        |-----------------------------------------------------------------------
        |   Define namespace for use shop meta fields
        |-----------------------------------------------------------------------
        */
        'namespace' => [
            'cookie_banner' => 'bc_cookie',
            'backend_settings' => 'gdpr_backend'
        ],

        /*
        |-----------------------------------------------------------------------
        |   Define key for use shop meta fields
        |-----------------------------------------------------------------------
        */

        /**
         * todo: can use private metafields?
         *
         * Ja es können bis zu 10 Private Metafields pro App erstellt werden.
         * - Zugriff jedoch nur über GraphQL möglich
         * - keine Ausgabe über Liquid möglich
         * - Werden mit dem deinstallieren der App gelöscht
         * - Erstellung mit privateMetafieldUpsertMutation
         * - Alternative zu CRSF Token?
         */
        'key' =>[
            /* 'base' contain css data for cookie banner, editor data (json object) */
            'base' => 'bc_cookie_banner_settings',

            /* 'css' contain css data for cookie banner, output for theme.liquid (string) */
            'css' => 'bc_cookie_banner_css',

            /* 'html' contain html data for cookie banner, output for theme.liquid (string) */
            'html' => 'bc_cookie_banner_html',

            /* 'header' contain header text for cookie banner (string) */
            'header' => 'bc_cookie_banner_header',

            /* 'main' contain main context for cookie banner (json object) */
            'main' => 'bc_cookie_banner_main',

            /* 'footer' contain footer context for cookie banner (json object) */
            'footer' => 'bc_cookie_banner_footer',

            /* 'cookie' contain a cookie list for whitelist and proceed-script */
            'cookie' => 'bc_cookie_list',

            /* bc_tagManager contain a google id's and facebookpixel id */
            'bc_tag_manager' => 'bc_tag_manager',

            /* backend settings */
            'settings' => 'settings',

            /* language settings */
            'languageSettings' => 'languageSettings'
        ]
    ],
    'global' => [
        'graph_version' => env('SHOPIFY_API_VERSION'),
        'version' => env('APP_VERSION'),
        'host' => env('APP_HOST'),
    ],
    'session-variable' => [
        /* hold all Metafields Data | hold 'last-get', 'last-update', 'metafields-data' */
        'all-metafields' => 'allMetafields',
        'backend-metafields' => 'backendData'
    ],

    'plans' => [
        'free' => [
            "chargeName" => "free",
            "amount" => 0.01,
            "capped_amount" => 29.98,
            "terms" => "The monthly app-fee is calculated based on your store's current shopify-plan and our pricelist.

                        Once you upgrade your shopify-plan we will adjust the charges according to our price-list.

                        If you downgrade to a shopify-plan lower than the one at the point of installing our app, you can re-install the app to get the app plan associated to your new downgraded shopify plan.

                        development-plan: free |
                        shopify basic: 2.99$/Month |
                        shopify & advanced: 7.99$/Month |
                        shopify plus: 14.99$/Month",
            "trial_days" => 7,
            "interval" => ApplicationChargeController::INTERVAL_EVERY_30_DAYS,
            "currencyCode" => "USD"
        ],
        'plan-1' => [
            "chargeName" => "basic-shopify",
            "amount" => 2.99,
            "capped_amount" => 29.98,
            "terms" => "The monthly app-fee is calculated based on your store's current shopify-plan and our pricelist.

                        Once you upgrade your shopify-plan we will adjust the charges according to our price-list.

                        If you downgrade to a shopify-plan lower than the one at the point of installing our app, you can re-install the app to get the app plan associated to your new downgraded shopify plan.

                        development-plan: free |
                        shopify basic: 2.99$/Month |
                        shopify & advanced: 7.99$/Month |
                        shopify plus: 14.99$/Month",
            "trial_days" => 7,
            "interval" => ApplicationChargeController::INTERVAL_EVERY_30_DAYS,
            "currencyCode" => "USD"
        ],
        'plan-2' => [
            "chargeName" => "shopify",
            "amount" => 6.99,
            "capped_amount" => 29.98,
            "terms" => "The monthly app-fee is calculated based on your store's current shopify-plan and our pricelist.

                        Once you upgrade your shopify-plan we will adjust the charges according to our price-list.

                        If you downgrade to a shopify-plan lower than the one at the point of installing our app, you can re-install the app to get the app plan associated to your new downgraded shopify plan.

                        development-plan: free |
                        shopify basic: 2.99$/Month |
                        shopify & advanced: 7.99$/Month |
                        shopify plus: 14.99$/Month",
            "trial_days" => 7,
            "interval" => ApplicationChargeController::INTERVAL_EVERY_30_DAYS,
            "currencyCode" => "USD"
        ],
        'plan-3' => [
            "chargeName" => "advanced-shopify",
            "amount" => 14.99,
            "capped_amount" => 29.98,
            "terms" => "The monthly app-fee is calculated based on your store's current shopify-plan and our pricelist.

                        Once you upgrade your shopify-plan we will adjust the charges according to our price-list.

                        If you downgrade to a shopify-plan lower than the one at the point of installing our app, you can re-install the app to get the app plan associated to your new downgraded shopify plan.

                        development-plan: free |
                        shopify basic: 2.99$/Month |
                        shopify & advanced: 7.99$/Month |
                        shopify plus: 14.99$/Month",
            "trial_days" => 7,
            "interval" => ApplicationChargeController::INTERVAL_EVERY_30_DAYS,
            "currencyCode" => "USD"
        ]
    ],
    "displayName" => [
        "Developer Preview",
        "Pause and Build",
        "Basic Shopify",
        "Shopify",
        "Advanced Shopify"
    ],
    "shopify_plane_name" => [
        "development" => "Development",

    ],
    "default_plan" => "shopify-basic",

    "planDefinition" => [
        "cancelled" => null,
        "fraudulent" => null,


        "affiliate" => "free",
        "trial" => "free",
        "frozen" => "free",
        "singtel_trial" => "free",
        "sales_training" => "free",
        "partner_test" => "free",
		"open_learning" => "free",

        "dormant" => "basic-shopify",
        "starter" => "basic-shopify",
        "comped" => "basic-shopify",
        "shopify_alumni" => "basic-shopify",
        "advanced" => "basic-shopify",
        "staff" => "basic-shopify",
        "custom" => "basic-shopify",
        "basic" => "basic-shopify",
        "staff_business" => "basic-shopify",
        "npo_lite" => "basic-shopify",
        "singtel_starter" => "basic-shopify",


        "professional" => "shopify",
        "singtel_basic" => "shopify",
        "uafrica_basic" => "shopify",
        "unlimited" => "shopify",


        "shopify_plus" => "advanced-shopify",
        "singtel_unlimited" => "advanced-shopify",
        "singtel_professional" => "advanced-shopify",
        "npo_full" => "advanced-shopify",
        "business" => "advanced-shopify",
        "uafrica_professional" => "advanced-shopify",
        "enterprise" => "advanced-shopify"

    ],
    "languages" => [
        "en" => "English",
        "de" => "Deutsch",
        "fr" => "Francais",
        "es" => "Español",
        'nl' => 'Nederlandse'
    ],
    "partner" => [
        "IT-Rechtskanzlei" => [
            "name" => "IT-Rechtskanzlei",
//            "hash" => hash('sha256', 'IT-Rechtskanzlei-28.01.2020'),        /* Rückgabe vom Hash-Wert mit Datum der Eintragung */
            "hash" => "6e90c1aa90fad767aa7f9dfef95295853ba74f90beae341eb8ba00788a5b6132",        /* Rückgabe vom Hash-Wert mit Datum der Eintragung */
            /* HASH-Wert : 6e90c1aa90fad767aa7f9dfef95295853ba74f90beae341eb8ba00788a5b6132 */
            "isActiv" => true,
            "trial_days" => 60,
            "terms" => "(IT-Rechtskanzlei discount)"
        ],
        "Haendlerbund" => [
            "name" => "Haendlerbund",
//            "hash" => hash('sha256', 'Haendlerbund-10.02.2020'),        /* Rückgabe vom Hash-Wert mit Datum der Eintragung */
            "hash" => "bda16b8694750b7cdf772ec4354aabef8afd05d72ead7cde24ed3a718dac9c24",        /* Rückgabe vom Hash-Wert mit Datum der Eintragung */
            /* HASH-Wert : bda16b8694750b7cdf772ec4354aabef8afd05d72ead7cde24ed3a718dac9c24 */
            "isActiv" => true,
            "trial_days" => 60,
            "terms" => "(Haendlerbund discount)"
        ],
        "especial" => [
            "name" => "especial",
//            "hash" => hash('sha256', 'especial-25.02.2020'),        /* Rückgabe vom Hash-Wert mit Datum der Eintragung */
            "hash" => "42222693269a29a5b0958eb60fd9798c4bb4c8806d3fa4c31b8e715e3d78c180",        /* Rückgabe vom Hash-Wert mit Datum der Eintragung */
            /* HASH-Wert : 42222693269a29a5b0958eb60fd9798c4bb4c8806d3fa4c31b8e715e3d78c180 */
            "isActiv" => true,
            "trial_days" => 30,
            "terms" => "(especial discount)"
        ],
        "netshake" => [
            "name" => "netshake",
//            "hash" => hash('sha256', 'netshake-25.02.2020'),        /* Rückgabe vom Hash-Wert mit Datum der Eintragung */
            "hash" => "4b622ac3968009c812e4187482c397402b0ea64d60eab8e90c6146f1caf95a1c",        /* Rückgabe vom Hash-Wert mit Datum der Eintragung */
            /* HASH-Wert : 4b622ac3968009c812e4187482c397402b0ea64d60eab8e90c6146f1caf95a1c */
            "isActiv" => true,
            "trial_days" => 30,
            "terms" => "(netshake discount)"
        ],
        "westpoint-digital" => [
            "name" => "westpoint-digital",
//            "hash" => hash('sha256', 'westpoint-digital-25.02.2020'),        /* Rückgabe vom Hash-Wert mit Datum der Eintragung */
            "hash" => "8de8ba63fcd1995597d0751fb0ab9fcef1784af4b28d535f1a6838b1f16ba924",        /* Rückgabe vom Hash-Wert mit Datum der Eintragung */
            /* HASH-Wert : 8de8ba63fcd1995597d0751fb0ab9fcef1784af4b28d535f1a6838b1f16ba924 */
            "isActiv" => true,
            "trial_days" => 30,
            "terms" => "(westpoint-digital discount)"
        ],
        "eshopguide" => [
            "name" => "eshopguide",
//            "hash" => hash('sha256', 'eshopguide-25.02.2020'),        /* Rückgabe vom Hash-Wert mit Datum der Eintragung */
            "hash" => "139377d74d16580d640f7aa3e60e4aaeea9b5d4fa3a7af9b1db6750d7238e83f",        /* Rückgabe vom Hash-Wert mit Datum der Eintragung */
            /* HASH-Wert : 139377d74d16580d640f7aa3e60e4aaeea9b5d4fa3a7af9b1db6750d7238e83f */
            "isActiv" => true,
            "trial_days" => 30,
            "terms" => "(eshopguide discount)"
        ],
        "movingprimates" => [
            "name" => "movingprimates",
//            "hash" => hash('sha256', 'movingprimates-25.02.2020'),        /* Rückgabe vom Hash-Wert mit Datum der Eintragung */
            "hash" => "2ce3a13160348f524c8cc9257d74100f4bfbdf8bf06ab041ca64337f0baf0981",        /* Rückgabe vom Hash-Wert mit Datum der Eintragung */
            /* HASH-Wert : 2ce3a13160348f524c8cc9257d74100f4bfbdf8bf06ab041ca64337f0baf0981 */
            "isActiv" => true,
            "trial_days" => 30,
            "terms" => "(moving primates discount)"
        ],
        "latrini" => [
            "name" => "latrini",
//            "hash" => hash('sha256', 'dagmar-von-latrini-25.02.2020'),        /* Rückgabe vom Hash-Wert mit Datum der Eintragung */
            "hash" => "7b49680f20cf1a4415f16722e403be278eb3eb2593bb6b3a7a3d05bccf9048aa",        /* Rückgabe vom Hash-Wert mit Datum der Eintragung */
            /* HASH-Wert : 7b49680f20cf1a4415f16722e403be278eb3eb2593bb6b3a7a3d05bccf9048aa */
            "isActiv" => true,
            "trial_days" => 30,
            "terms" => "(latori discount)"
        ],
        "tante-e" => [
            "name" => "tante-e",
//            "hash" => hash('sha256', 'tante-e-25.02.2020'),        /* Rückgabe vom Hash-Wert mit Datum der Eintragung */
            "hash" => "cb9d4f69485f2abaeb6b54e3600898baaccf9fdbabd2c111baf5836fb87e741f",        /* Rückgabe vom Hash-Wert mit Datum der Eintragung */
            /* HASH-Wert : cb9d4f69485f2abaeb6b54e3600898baaccf9fdbabd2c111baf5836fb87e741f */
            "isActiv" => true,
            "trial_days" => 30,
            "terms" => "(tante-e discount)"
        ],

        "EHI-Retail-Institute" => [
            "name" => "EHI Retail Institute",
            "hash" => "3b1eccd1c0da11bf45e63e6a4ffe1580a33eee0e7f3e6527cfcf568202f808eb",
            "isActiv" => true,
            "trial_days" => 60,
            "terms" => "(EHI Retail Institute)"
        ]
    ]
];
