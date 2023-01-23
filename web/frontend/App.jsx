import { ReduxStoreProvider, AppProvider } from "./ReduxStoreProvider/";
import {BrowserRouter} from "react-router-dom";
import {NavigationMenu} from "@shopify/app-bridge-react";
import {Routes, WebRoutes} from "./Routes";
import "@shopify/polaris/build/esm/styles.css";

import {
    AppBridgeProvider,
    QueryProvider,
    PolarisProvider,
} from "./components";

import * as React from "react";
import {FetchProvider} from "./ReduxStoreProvider/FetchProvider";

const pages = import.meta.globEager("./pages/**/!(*.test.[jt]sx)*.([jt]sx)");

export default function App() {
    return (
        <ReduxStoreProvider>
            <PolarisProvider>
                <BrowserRouter>
                    <AppBridgeProvider>
                        <AppProvider>
                            <QueryProvider>
                                <NavigationMenu navigationLinks={ WebRoutes }/>
                                <Routes pages={pages}/>

                                <FetchProvider/>
                            </QueryProvider>
                        </AppProvider>
                    </AppBridgeProvider>
                </BrowserRouter>
            </PolarisProvider>
        </ReduxStoreProvider>
    );
};
