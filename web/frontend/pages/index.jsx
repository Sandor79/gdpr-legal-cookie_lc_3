import React,{ lazy, Suspense } from "react";
import {getPageInfo} from "../routes/WebRoutes";
import {SkeletonPageDashboard} from "../components/app/Dashboard/SkeletonDashboard";

const PageTemplate = lazy(() => import( "../components/app/Templates/PageTemplate" ));
const Dashboard = lazy(() => import( "../components/app/Dashboard" ));

export default function Index () {
    return (
        <Suspense fallback={(<SkeletonPageDashboard />)}>
            <PageTemplate { ...getPageInfo( "dashboard" ) }>
                <Dashboard />
            </PageTemplate>
        </Suspense>
    )
};
