import {
    GET_METAFIELDS_FETCH_INIT,
    GET_METAFIELDS_FETCH_REQUEST,
    GET_METAFIELDS_FETCH_SUCCSSES,
    GET_METAFIELDS_FETCH_FAILURE,
    GET_METAFIELDS_UPDATE_FIELD
} from "./metafieldsTypes";

import {Failure, Request, Succsses} from "./metafieldsActions";

const initialState = {
    step: 0,
    loading: false,
    metafields: {},
    error: null,
    src: null
}

export const metafieldsSchema = {
    getState: store => store.metafields,
    url: null,
    actionTypes: {
        FETCH_INIT : GET_METAFIELDS_FETCH_INIT,
        FETCH_REQUEST : GET_METAFIELDS_FETCH_REQUEST,
    },
    request: Request,
    succsses : Succsses,
    failure : Failure
}

const getMetafieldKey = function ( { namespace, key } ) {
    return `${ namespace } / ${ key };`
}

export const metafieldsReducer = ( state = initialState, action ) => {

    switch ( action.type ) {
        case "SET_STEP" : return {
            ...state,
            step: action.payload
        }
        case GET_METAFIELDS_UPDATE_FIELD : return {
            ...state,
            [ getMetafieldKey(action.payload)]: {
                ...state[ getMetafieldKey(action.payload) ],
                [action.payload.field]: action.payload.value,
            }
        }
        case GET_METAFIELDS_FETCH_INIT : return {
            ...state,
            src: action.payload,
            loading: false,
            init: true
        }
        case GET_METAFIELDS_FETCH_REQUEST : return {
            ...state,
            loading: true
        }
        case GET_METAFIELDS_FETCH_SUCCSSES : return {
            ...state,
            loading: false,
            init: false,
            [ getMetafieldKey(action.payload) ] : action.payload,
            src: null,
            error: null
        }
        case GET_METAFIELDS_FETCH_FAILURE : return {
            ...state,
            loading: false,
            init: false,
            [ getMetafieldKey(action.payload) ]: {},
            src: null,
            error: action.payload
        }
        default : return state;
    }
}
