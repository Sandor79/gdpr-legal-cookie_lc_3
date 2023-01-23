import {EMPTY_TOAST, INITIAL_STATE, SET_TOAST, SET_TOKEN} from "./_const";
import { ERROR, FAILURE, SUCCSSES, PAGE_LOADING, SET_IS_LOADING } from "./_types";

export const _reducers = function( state = INITIAL_STATE, action ) {

    switch( action.type ) {
        case SET_TOAST :
            const toast = {
                ...EMPTY_TOAST,
                ...action.payload
            }
            return {
            ...state,
            toast: { ...toast }
        }
        case PAGE_LOADING : return {
            ...state,
            pageLoading: action.payload
        }
        case SET_IS_LOADING : return {
            ...state,
            loading: action.payload
        }
        case SET_TOKEN : return {
            ...state,
            token : {
                createdAt: Date.now(),
                key: action.payload.key
            }
        }
        case SUCCSSES : return {
            ...state,
            createdAt: Date.now(),
            ...action.payload
        }
        case ERROR : return {
            ...state,
            errors: [ ...state.errors, { type: action.type, value: { ...action.payload.error } } ]
        }
        case FAILURE :
            const { message, name, type } = action.payload.error
            return {
            ...state,
            errors: [ ...state.errors, { type: action.type, value: { message, name, type } } ]
        }
        default : return state;
    }
}
