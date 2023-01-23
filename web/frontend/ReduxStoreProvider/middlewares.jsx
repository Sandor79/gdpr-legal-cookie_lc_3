import logger from "redux-logger";

import { isRejectedWithValue } from '@reduxjs/toolkit'
import {AppActions} from "./";

/**
 * Log a warning and show a toast!
 */
const rtkQueryErrorLogger = (api) => (next) => (action) => {
    // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
    if (isRejectedWithValue(action)) {
        console.warn('We got a rejected action!')
        AppActions.Toast.Dev.Error( { content: action.error.data.message } )
    }

    return next(action)
}

const middlewares = function ( appFetch ) {
    return [
        rtkQueryErrorLogger( appFetch ),
        logger
    ];
}

export default middlewares;
