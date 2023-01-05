import {useAppQuery} from "../../../hooks";
import LOGGER from "../Helpers/Logger";


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
                setIsLoading( !isLoading );
                LOGGER.LOG("useAppQuery")
            },
        },
    });
}
