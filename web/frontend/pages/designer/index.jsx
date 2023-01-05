import Designer from "../../components/app/Designer/designer";
import { Page} from "@shopify/polaris";
import React from "react";
import {TitleBar} from "@shopify/app-bridge-react";

export default function Index () {
    return (
        <Page fullWidth>
            <TitleBar title="Designer" primaryAction={null}
                      breadcrumbs={ [{ content : "Dashboard", url : "/"}]}
            />
            <Designer/>
        </Page>
    )
};
