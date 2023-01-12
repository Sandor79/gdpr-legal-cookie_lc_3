import store from "../../../store/configureStore";
import {AppBridge} from "./actionTypes";
import loading from "./loading";
import {createAction, createSlice} from "@reduxjs/toolkit";


const initialState = {
    isLoading : true,
    value : true
};

export const Loading = {
    name : "LOADING",
    initialState,
    data : [
        {
            type: "APP_BRIDGE::ACTIONS::LOADING::IS_LOADING",
            selectors : {
                IS_LOADING : (state) => state.isLoading
            }
        },
        {
            type: "APP_BRIDGE::ACTIONS::LOADING::TOGGLE_LOADING",
            reducers : {
                TOGGLE_LOADING: {
                    reducer( state ) {
                        const { isLoading } = { ...state }
                        return  {
                            ...state,
                            isLoading : !isLoading
                        }
                    }
                }
            }
        }
    ]
}

export const counterSlice = function ( state : initialState, { type, payload } ) {
    switch ( type ) {
        case "APP_BRIDGE::ACTIONS::LOADING::TOGGLE_LOADING" : {

            const oldState = { ...state };
            state.value = ( !oldState.value );

            console.log("value", { value : state.value })
            //appBridgeLoading.dispatch( Loading.Action[ ( state.value ? "START" : "STOP") ]);
            return {
                ...state,
                value : state.value
            }
        }
    }
}
