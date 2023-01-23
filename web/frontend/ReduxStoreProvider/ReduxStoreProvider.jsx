import {Provider} from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import {rootReducer} from "./rootReducer";

if (process.env.NODE_ENV === 'development') {
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
}

export const store = configureStore({
    reducer: rootReducer,
});

export const getState = ( storeKey ) => {
    let _store = store.getState();
    _store = !!storeKey ? _store[ storeKey ] : _store;

    return _store;
}

export const ReduxStoreProvider = function ({children}) {
    return (
        <Provider store={store}>
            {children}
        </ Provider>
    );
};
