import {isLoading, toggle} from "./Loading/index"
import {connect} from "react-redux";
import { bindActionCreators } from "@reduxjs/toolkit"

const mapDispatchToProps = (dispatch) => {
    return {
        increment: () => dispatch(increment()),
        decrement: () => dispatch(decrement()),
        reset: () => dispatch(reset()),
        dispatch,
    }
}

const mapDispatchToProps = function (dispatch) {
    return {
        dispatch,
        ...bindActionCreators({ isLoading, toggle }, dispatch),
    }
}

const APP_BRIDGE = function ( props ) {}

export default  connect(null, mapDispatchToProps)( APP_BRIDGE )



/*
export const APP_BRIDGE = {
    ACTIONS : {
        LOADING : {
            IS_LOADING : {
                TYPE : "APP_BRIDGE::ACTIONS::LOADING::IS_LOADING",
                DISPATCH_FUNCTION : Loading.IS_LOADING,
                ACTION : null,
            },
            TOGGLE_LOADING : {
                TYPE : "APP_BRIDGE::ACTIONS::LOADING::TOGGLE_LOADING",
                DISPATCH_FUNCTION : Loading.TOGGLE_LOADING,
                ACTION : null,
            }
        }
    }
}

const findePropertyObject = function ( obj = {} ) {
    const objKeys = Object.keys( obj );
    let objKeysLength = objKeys.length;

    for ( ; --objKeysLength > 0; ) {
        const key = objKeys[ objKeysLength ];
        if ( Object.prototype.toString.call( obj[ key ] ) === "[object Object]" ) {
            findePropertyObject( obj[ key ] );
        } else {
            return obj
        }
    }
    return null;
}

const mapActions = function () {
    const propertyObject = findePropertyObject( APP_BRIDGE );
    if ( !!propertyObject ) {
        const action = createAction( propertyObject.TYPE );
        propertyObject.ACTION = () => dispatch( propertyObject.ty );
    }
}

mapActions();
*/
