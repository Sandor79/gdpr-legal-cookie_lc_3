import LOGGER from "../../Helpers/Logger";
import {useEffect, useState} from "react";
import {useAppQuery} from "../../../../hooks";
import {useDispatch, useSelector} from 'react-redux';
import { getAllMetafields, selectByNamespaceKey } from "./metafieldSlice";
import {getMetafield} from "../../../../features/Metafields/MetafieldsSlice";
//import { fetchMetafields } from "./metafieldSlice";

export default function MetafieldController ( configData ) {
    const { namespace, key, callback } = configData;
    const [ isLoading, setIsLoading ] = useState( true )
    const [ id, setId ] = useState()
    const [ metafield, setMetafield ] = useState()
    const [ config ] = useState( configData )

//    const metafields = useSelector( getAllMetafields );
//    console.log({metafields} )

//    const singleMetafield = ( namespace, key ) => {
//        const metafield = useSelector( state => selectByNamespaceKey( state, namespace, key ) )

//        console.log({metafield} )
//    }
//    singleMetafield("bc_cookie", "bc_cookie_list")


/*
    const getMetafield = function () {
        LOGGER.LOG("getMetafield", { metafield })
        return metafield;
    }
*/
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
