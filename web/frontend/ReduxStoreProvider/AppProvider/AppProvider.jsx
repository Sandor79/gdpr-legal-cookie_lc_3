import {useSelector} from "react-redux";
import {useAppBridge, Loading} from "@shopify/app-bridge-react";

import {getSessionToken} from "@shopify/app-bridge-utils";
import { Modal, TextContainer} from '@shopify/polaris';

import { AppActions, AppActionsProvider } from "../";
import {ErrorBoundary} from "../../components/app/ErrorBoundary/ErrorBoundary";

let mode =  import.meta.env.MODE;

let oldAppState;

export const AppProvider = function ( { children } ) {
    const app = useAppBridge();
    const appErrors = [];

    !!app && app.error((data) => {
        if ( !!data ) {
            // type will be the error type
            // action will contain the original action including its id
            // message will contain additional hints on how to fix the error
            const {type, action, message} = data;
            AppActions.Modal.Error( { error : data } )
            appErrors.push( data );
            // Handle all errors here
            /*
            switch (type) {
                case Error.Action.INVALID_PAYLOAD:
                    //Do something with the error
                    break;
            }

             */
        }
    });

    const modal = appErrors.length > 0 ? (
        <Modal
            open={true}
            onClose={()=>{}}
            title="Action errors"
        >
            <Modal.Section>
                {
                    appErrors.map( ({ type, action, message }) => (
                        <TextContainer>
                            <p>Type: { type }</p>
                            <p>Action: { action }</p>
                            <p>Message: { message }</p>
                        </TextContainer>
                    ))
                }
            </Modal.Section>
        </Modal>
    ) : null;


    const storeToken = useSelector( state => state.APP.token )
    const storeError = useSelector( state => state.APP.error )
    const loading = useSelector( state => state.APP.loading )

    const loadingComponent = !!loading ? (<Loading/>) : null

    if ( !!app && app !== oldAppState ) {
        oldAppState = app;

        if ( !storeToken.key && !storeError ) {

            getSessionToken(app)
                .then( async (token) => {
                    if ( mode !== "Production" ) {
                        app.getState().then((state) => {
                            console.info('App State: %o', state);
                        });
                    }
                    AppActions.Page.setToken( { key: token } )
                    AppActions.Toast.Dev.Message( { content : "App token loaded" } )
                })
                .catch( error => {
                    AppActions.Toast.Dev.Error( { content : error.message } )
                })
        }
    }

    return (
        <ErrorBoundary>
            <AppActionsProvider/>
            { children }
            { modal }
            { loadingComponent }
        </ErrorBoundary>
    )
}
