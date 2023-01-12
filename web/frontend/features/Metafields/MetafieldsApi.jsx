import {useAppQuery, useAuthenticatedFetch} from "../../hooks";
import LOGGER from "../../components/app/Helpers/Logger";
import {useEffect, useState} from "react";

export function loadMetafield ( namespace, key ) {
    const [ isLoading, setIsLoading ] = useState( true )

    return new Promise( async (resolve) => {

        const { data } = useAppQuery({
            url: `/api/metafield/namespace/${ namespace }/key/${ key }`,
            fetchInit: {
                method: 'GET',
                mode: 'cors',
                cache: 'default',
            },
            reactQueryOptions: {
                onSuccess: () => {
                    setIsLoading( !isLoading );
                    LOGGER.LOG("metafieldApi")
                },
            },
        });

        useEffect(()=>{
            if ( !isLoading && !!data ) {
                resolve( data )
            }
        }, [ isLoading ])
    })
}
