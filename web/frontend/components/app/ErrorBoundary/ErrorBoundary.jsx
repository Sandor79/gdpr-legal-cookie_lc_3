import React from "react";
import {AppActions} from "../../../ReduxStoreProvider/";

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { error: null };
    }

    componentDidCatch( error, errorInfo) {
        this.setState({
            message: {
                message: error.message,
                errorInfo: { ...errorInfo }
            },
            type: error.type,
            name: error.name
        });
    }

    render() {
        const {error} = this.state;
        if (error) {
            AppActions.Modal.Error( error )
        }
        return <>{this.props.children}</>;
    }
}
