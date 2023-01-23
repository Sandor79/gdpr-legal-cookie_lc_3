import {useAppQuery} from "../../hooks";
import {AppActions} from "../";
import {useEffect, useState} from "react";

export const FetchProvider = function () {
    const [ ownerIdLoaded, setOwnerIdLoaded ] = useState( false )

    const {data} = useAppQuery({
        url: `/api/metafield/owner-id/shop`,
        reactQueryOptions: {
            onSuccess() {
                setOwnerIdLoaded( true );
            }
        }
    });

    useEffect(() => {
        if ( !!data && !!data.id ) {
            AppActions.Toast.Dev.Message({content: "owner id loaded"})
            AppActions.DataActions.saveOwnerId({owner: "shop", id: data.id})
        }
    }, [ ownerIdLoaded ])

    return (
        <></>
    )
}
