export const STORE_KEY = "APP"
export const SUCCSSES = "SUCCSSES"
export const FAILURE = "FAILURE"
export const ERROR = "ERROR"
export const PAGE_LOADING = "PAGE_LOADING"
export const BEARER_TOKEN_LOAD = "BEARER_TOKEN_LOAD"
export const SET_IS_LOADING = "SET_IS_LOADING"
export const SET_TOAST = "SET_TOAST"
export const SET_TOKEN = "SET_TOKEN"


/**
 * @type {Toast}
 */
export const EMPTY_TOAST = {
    content : null,
    isError : false,
    duration : 5000,
    onDismiss : null,
    action: null
}

/**
 * @type AppState
 */
export const INITIAL_STATE = {
    pageLoading: true,
    loading: false,
    toast: EMPTY_TOAST,
    shopDomain: null,
    token: {
        key: null,
        createdAt: 0,
    },
    errors: [],
    failure: []
}
