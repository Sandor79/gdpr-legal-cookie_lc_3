import React,{ lazy, Suspense } from "react";
import {getPageInfo} from "../../routes/WebRoutes";
import {SkeletonCookiePolicy} from "../../components/app/CookiePolicy/SkeletonCookiePolicy";

const PageTemplate = lazy(() => import( "../../components/app/Templates/PageTemplate" ));
const CookiePolicy = lazy(() => import( "../../components/app/CookiePolicy" ));

export default function Index () {
    return (
        <Suspense fallback={(<SkeletonCookiePolicy />)}>
            <PageTemplate { ...getPageInfo( "cookie-policy" ) }>
                <CookiePolicy />
            </PageTemplate>
        </Suspense>
    )
};
