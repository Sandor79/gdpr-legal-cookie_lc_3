import {getState} from "../ReduxStoreProvider";
import { STORE_KEY } from "./_const";

export const selectorLoading = function ( state = getState( STORE_KEY ) ) {
    return state.loading
}
export const selectorToken = function ( state = getState( STORE_KEY ) ) {
    return state.token;
}
export const selectorToastProps = function ( state = getState( STORE_KEY ) ) {
    return state.toast
}
