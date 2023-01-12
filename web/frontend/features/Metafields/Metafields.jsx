import React from "react"
import { useSelector } from "react-redux";

export const Metafields = function ( namespace, key ) {
    const metafields = useSelector( state => state.metafields );

    const metafield = metafields.find( metafield => metafield.namespace === namespace && metafield.key === key )

    return metafield
}
