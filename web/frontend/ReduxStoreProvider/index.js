import { _AppActions} from "./AppActions";
import { _DataActions } from "./FetchProvider/DataActions";

const AppActions = {
    ..._AppActions,
    DataActions: { ..._DataActions }
}

export { AppActions }
export { ReduxStoreProvider } from "./ReduxStoreProvider"
export { AppProvider } from "./AppProvider"
export { AppActionsProvider } from "./AppActions/";
