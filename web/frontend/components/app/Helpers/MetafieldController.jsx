import LOGGER from "./Logger";
import {useEffect, useState} from "react";
import {useAppQuery} from "../../../hooks";

export default function MetafieldController ( configData ) {
    const { namespace, key, callback } = configData;
    const [ isLoading, setIsLoading ] = useState( true )
    const [ id, setId ] = useState()
    const [ metafield, setMetafield ] = useState()
    const [ config ] = useState( configData )

    const getMetafield = function () {
        LOGGER.LOG("getMetafield", { metafield })
        return metafield;
    }
    const saveMetafield = function ( oldMetafield, value ) {
        if ( !!value ) {
            let metafieldValue;

            if (oldMetafield.type === "json_string") {
                metafieldValue = JSON.stringify(value);
            } else {
                metafieldValue = value;
            }
            const newMetafield = {
                id,
                key: oldMetafield.key,
                value: metafieldValue,
                type: oldMetafield.type
            };
            setMetafield( newMetafield );
            LOGGER.LOG("saveMetafield", { newMetafield })
            return newMetafield;
        }
    }

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
                LOGGER.LOG("useAppQuery")
            },
        },
    });

    useEffect(()=>{
        if ( !isLoading && !!data ) {
            setMetafield( data )
            setId( data.id )

            LOGGER.LOG("useEffect metafield",{ metafield, isLoading })
            LOGGER.LOG("useEffect data",{ data, isLoading })
            config.callback( data )
        }
    }, [ isLoading ])

    return {
        getMetafield,
        saveMetafield
    };
}
