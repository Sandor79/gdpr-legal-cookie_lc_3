import { store } from "../ReduxStoreProvider";
import { GET_SHOP_DOMAIN, SET_SHOP_DOMAIN } from "./_types";
import {createSelector} from "@reduxjs/toolkit";
import {selectors} from "./_selectors";

const initialState = {
    shopDomain: null
}

export const designerReducer = function ( state = initialState, action ) {

    switch ( action.type ) {
        case SET_SHOP_DOMAIN : return {
            ...state,
            shopDomain: action.payload
        }
    }
}


const selectors = ( state = initialState, action ) => {
    switch ( action.type ) {
        case GET_SHOP_DOMAIN : return state.shopDomain.valueOf();
    }
}

export const designerSelector = createSelector( [ args, state = store.getState() ] , ( args, state ) =>{

} )
