import {getState} from "../ReduxStoreProvider";
import {createSelector} from "@reduxjs/toolkit";
import {connect} from "react-redux";



const selectItems = state => state.items
const selectItemId = (state, itemId) => itemId

const selectItemById = createSelector(
    [selectItems, selectItemId],
    (items, itemId) => items[itemId]
)

const designerSelector = () => createSelector(
    [ getState("designer"), type, args ],
    ( state, type, args ) => {

} )
const mapSelectors = () => {}

export default connect()
