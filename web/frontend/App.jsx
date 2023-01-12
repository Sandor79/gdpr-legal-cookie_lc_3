import {Provider} from "react-redux";
import store from "./store/configureStore";
import {BrowserRouter} from "react-router-dom";
import { NavigationMenu} from "@shopify/app-bridge-react";
import {Routes, WebRoutes} from "./Routes";
import "@shopify/polaris/build/esm/styles.css";

import {
    AppBridgeProvider,
    QueryProvider,
    PolarisProvider,
} from "./components";


export default function App() {
    const pages = import.meta.globEager("./pages/**/!(*.test.[jt]sx)*.([jt]sx)");

    return (
        <Provider store={store}>
            <BrowserRouter>
                <AppBridgeProvider>
                    <PolarisProvider>
                        <QueryProvider>
                            <NavigationMenu
                                navigationLinks={
                                    WebRoutes
                                }
                            />
                            <Routes pages={pages}/>
                        </QueryProvider>
                    </PolarisProvider>
                </AppBridgeProvider>
            </BrowserRouter>
        </Provider>
    );
}
