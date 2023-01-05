<?php

return [
    "QUERY_SHOP_PLAN" => <<<Query
        query {
            shop {
                plan {
                    displayName
                    partnerDevelopment
                    shopifyPlus
                }
            }
        }
    Query

];
