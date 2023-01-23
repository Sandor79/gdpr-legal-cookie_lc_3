import {combineReducers} from "redux";

import { APP_STORE_KEY, appReducers } from "./AppProvider";
import { FETCH_PROVIDER_STORE_KEY, fetchProviderReducers } from "./FetchProvider"

export const rootReducer = combineReducers({
    [ APP_STORE_KEY ]: appReducers,
    [ FETCH_PROVIDER_STORE_KEY ]: fetchProviderReducers
});
