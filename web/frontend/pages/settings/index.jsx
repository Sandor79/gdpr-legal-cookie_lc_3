import React, {lazy, Suspense} from "react"
import {getPageInfo} from "../../routes/WebRoutes";

const PageTemplate = lazy(() => import( "../../components/app/Templates/PageTemplate" ));
const SettingsTemplate = lazy(() => import( "../../components/app/Settings" ));

export default function Settings () {
    const pageInfo = getPageInfo( "settings" )

    return (
        <Suspense fallback={(<div>Loading...</div>)}>
            <PageTemplate { ...pageInfo }>
                <SettingsTemplate/>
            </PageTemplate>
        </Suspense>
    )
}
