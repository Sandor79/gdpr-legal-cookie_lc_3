import {store} from "../ReduxStoreProvider";
import { Failure, setPageLoading as _setPageLoading, setToken as _setToken } from "../AppProvider/_actions";
import { useAppBridge, useToast } from "@shopify/app-bridge-react";

const getToast = function ( toastProps, isError ) {
    let newToast;
    const toast = {
        content: null,
        isError: null,
        duration: null,
        onDismiss: null,
        action: null
    }

    if ( Object.prototype.toString.call( toastProps) === "[object String]"){
        newToast = {
            ...toast,
            content: toastProps,
            isError
        }
    } else {
        newToast = { ...toast, toastProps, isError }
    }
    return newToast;
}

/**
 * @type AppActionsObject
 */
export const _AppActions = {
    /**
     * @type PageObject
     */

    Page : {
        /**
         * @param {boolean} value
         */
        setPageLoading : value => {
            const state = store.getState()
            if ( state.APP.pageLoading !== value ) {
                store.dispatch( _setPageLoading( value ) )
            }
        },
        setToken : value => store.dispatch( _setToken( value ) )
    },
    /**
     * @type ToastObject
     */
    Toast : {
        /**
         * @param {Toast} toastProps
         * @returns {{payload: Toast, type: string}}
         */
        Message : toastProps => {
            setToastMessage( getToast( toastProps) );
        },
        /**
         * @param {Toast} toastProps
         * @returns {{payload: Toast, type: string}}
         */
        Error : toastProps => {
            setToastMessage( getToast( toastProps, true ) );
        },
        Dev : {
            /**
             * @param {Toast} toastProps
             * @returns {{payload: Toast, type: string}}
             */
            Message : toastProps => {
                if ( mode !== "Production" ) {
                    setToastMessage( getToast( toastProps) );
                }
            },
            /**
             * @param {Toast} toastProps
             * @returns {{payload: Toast, type: string}}
             */
            Error : toastProps => {
                if ( mode !== "Production" ) {
                    setToastMessage( getToast( toastProps, true ) );
                }
            }
        }
    },
    Modal : {
        /**
         * @param error
         */
        Error : error => {
            const state = store.getState()
            const errors = state.errors
            console.log( errors )

            store.dispatch( Failure( error ) )
        }
    }
}

const mode =  import.meta.env.MODE;
let toastMessageMarkup;

/**
 * @param app
 * @param show
 * @returns {(function( Toast ): void)|Toast}
 */
const setToastMessageMarkup = function ( app, show ) {
    return ( toastMessage ) => {
        const {content, isError, duration, onDismiss, action} = {...toastMessage};
        toastMessageMarkup = !!content && (show(content, {isError, duration, onDismiss, action}))
    }
}

let setToastMessage = function () {};

/**
 * @param children
 * @returns {JSX.Element}
 * @constructor
 */
export const AppActionsProvider = function ( { children } ) {
    const app = useAppBridge();
    const { show } = useToast();

    if ( !!app ) {
        setToastMessage = setToastMessageMarkup( app, show );
    }

    return (
        <>
            { toastMessageMarkup }
            { children }
        </>
    )
}
