import {
    SUCCSSES, ERROR, FAILURE,
    PAGE_LOADING
} from "./_types";
import {SET_TOKEN} from "./_const";

/**
 *
 * @param value
 * @returns {{payload, type: string}}
 * @constructor
 */
export const Succsses = value => ({
    type : SUCCSSES,
    payload : value
})

export const Error = value => ({
    type : ERROR,
    payload : value
})

export const Failure = value => ({
    type : FAILURE,
    payload : value
})
/**
 * @param {boolean} value
 * @returns {{payload: boolean, type: string}}
 */
export const setPageLoading = value => ({
    type : PAGE_LOADING,
    payload : value
})
/**
 * @param value
 * @returns {{payload, type: string}}
 */
export const setToken = value => ({
    type : SET_TOKEN,
    payload : value
})
