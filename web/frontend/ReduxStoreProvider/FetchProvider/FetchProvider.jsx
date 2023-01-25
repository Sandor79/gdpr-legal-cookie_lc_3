import {useAppQuery, useAuthenticatedFetch} from "../../hooks";
import {AppActions} from "../";
import {useEffect, useState} from "react";

export const FetchProvider = function () {
    const [ loading, setLoading ] = useState( false )

    const {data} = useAppQuery({
        url: `/api/metafield/owner-id/shop`,
        reactQueryOptions: {
            onSuccess() {
                setLoading( true );
            }
        }
    });

    useEffect(() => {
        if ( !!data && !!data.id ) {
            AppActions.Toast.Dev.Message({content: "owner id loaded"})
            AppActions.DataActions.saveOwnerId({owner: "shop", id: data.id})
        }
    }, [ loading ])

    const fetch = useAuthenticatedFetch();
    AppActions.DataActions.Fetch = async function ( url, type = "GET", postData ) {

        let options, response;

        if ( type === "POST" && !!postData ) {
            options = {
                method: type,
                body: JSON.stringify( postData )
            }
        }
        response = await fetch( url, options )

        if ( response.ok ) {
            const data = await response.json()
            return [ data, null ]
        } else {
            const error = await response.error()
            return [ null, error ]
        }
    }

    return (
        <></>
    )
}
