import store from "../../../store/configureStore";
import {AppBridge} from "./actionTypes";
import loading from "./loading";
import {createAction} from "@reduxjs/toolkit";

const ACTIONS = createAction()

export const Actions = {
    IS_LOADING : () => store.dispatch( { type: AppBridge.Actions.IS_LOADING } ),
    TOGGLE_LOADING : () => {
        console.log( 'TOGGLE_LOADING', { store } )
        store.dispatch( () => loading( null, { type: AppBridge.Actions.TOGGLE_LOADING }) )
    }
}
