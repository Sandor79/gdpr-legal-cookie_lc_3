import React from "react";
import { Layout, Page, FooterHelp, Link } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react"

const PageTemplate = function ({ title, primaryAction, breadcrumbs, children }) {
    return (
        <Page fullWidth>
            <TitleBar title={ title } primaryAction={ primaryAction } breadcrumbs={ breadcrumbs} />
            <Layout>
                { children }
            </Layout>
            <FooterHelp>
                Learn more about{' '}
                <Link url="https://help.shopify.com/manual/orders/fulfill-orders">
                    fulfilling orders
                </Link>
            </FooterHelp>
        </Page>
    );
}
export default PageTemplate
