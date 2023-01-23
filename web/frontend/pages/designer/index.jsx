import React,{ lazy, Suspense } from "react";
import {getPageInfo} from "../../routes/WebRoutes";
import SkeletonDesigner from "../../components/app/Designer/SkeletonDesigner";

const PageTemplate = lazy(() => import( "../../components/app/Templates/PageTemplate" ));
const Designer = lazy(() => import( "../../components/app/Designer/designer" ));



export default function Index () {
    return (
        <Suspense fallback={(<SkeletonDesigner />)}>
            <PageTemplate { ...getPageInfo( "designer" ) }>
                <Designer />
            </PageTemplate>
        </Suspense>
    )
};
