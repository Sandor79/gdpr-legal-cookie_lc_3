<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Shopify\Context;
use Shopify\Utils;

class CspHeader
{
    /**
     * Ensures that the request is setting the appropriate CSP frame-ancestor directive.
     *
     * See https://shopify.dev/apps/store/security/iframe-protection for more information
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $shop = Utils::sanitizeShopDomain($request->query('shop', ''));

        if (Context::$IS_EMBEDDED_APP) {
            $domainHost = $shop ? "https://$shop" : "*.myshopify.com";
            $allowedDomains = "$domainHost https://admin.shopify.com";
        } else {
            $allowedDomains = "'none'";
        }

        /** @var Response $response */
        $response = $next($request);

        $currentHeader = $response->headers->get('Content-Security-Policy');
        if ($currentHeader) {
            $values = preg_split("/;\s*/", $currentHeader);

            // Replace or add the URLs the frame-ancestors directive
            $found = false;
            foreach ($values as $index => $value) {
                if (mb_strpos($value, "frame-ancestors") === 0) {
                    $values[$index] = preg_replace("/^(frame-ancestors)/", "$1 $allowedDomains", $value);
                    $found = true;
                    break;
                }
            }

            if (!$found) {
                $values[] = "frame-ancestors $allowedDomains";
            }

            $headerValue = implode("; ", $values);
        } else {
            $headerValue = "frame-ancestors $allowedDomains;";
        }


        $response->headers->set('frame-ancestors', "block-all-mixed-content; upgrade-insecure-requests; default-src 'self' data: blob: https://* shopify-pos://*; connect-src 'self' blob: wss://* https://* https://bugsnag-mtl.shopifycloud.com:4900/js hcaptcha.com *.hcaptcha.com; style-src 'self' 'unsafe-inline' data: blob: https://*; media-src 'self' data: blob: https://videos.shopifycdn.com https://cdn.shopify.com/videos/ https://cdn.shopify.com/shopifycloud/web/assets/v1/ https://almond-sandpiper-6593.twil.io/assets/ https://*.wistia.com https://*.wistia.net https://embedwistia-a.akamaihd.net; script-src 'self' 'unsafe-inline' 'unsafe-eval' cdn.shopify.com cdn.shopifycdn.net *.shopifycs.com www.google-analytics.com stats.g.doubleclick.net app.shopify.com app.myshopify.com c.paypal.com www.paypal.com appcenter.intuit.com mpsnare.iesnare.com api.stripe.com maps.googleapis.com js.braintreegateway.com songbird.cardinalcommerce.com hcaptcha.com *.hcaptcha.com www.youtube.com s.ytimg.com fast.wistia.com; child-src 'self' https://* shopify-pos://*; frame-src app.shopify.com *.shopifyapps.com *.myshopify.com *.myshopify.com https://* shopify-pos://* hcaptcha.com *.hcaptcha.com blob: http://localhost:*; worker-src 'self' blob:");

        return $response;
    }
}
