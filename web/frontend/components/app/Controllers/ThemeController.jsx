import {useAppQuery} from "../../../hooks";
import LOGGER from "../Helpers/Logger";
import {AppActions} from "../../../ReduxStoreProvider";


export default function ThemeController () {

    const { data } = useAppQuery({
        url: `/api/themes/get-all`,
        fetchInit: {
            method: 'GET',
            mode: 'cors',
            cache: 'default',
        },
        reactQueryOptions: {
            onSuccess: () => {
                AppActions.Page.setPageLoading( !isLoading );
                LOGGER.LOG("useAppQuery")
            },
        },
    });
}
