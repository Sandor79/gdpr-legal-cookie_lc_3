import {configureStore} from '@reduxjs/toolkit'
import loading from "../features/App_Bridge/Actions/loading";
import MetafieldsReducer from "../features/Metafields/MetafieldsSlice";

if (process.env.NODE_ENV === 'development') {
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
}

export default configureStore({
    reducer: {
        appBridgeActions: loading,
        metafields : MetafieldsReducer
    },
})


