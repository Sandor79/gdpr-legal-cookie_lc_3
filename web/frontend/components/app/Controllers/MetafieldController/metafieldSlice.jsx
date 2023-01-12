import { createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    metafields: [],
    status: 'idle',
    error: null
}

export const metafieldSlice = createSlice({
    name: "metafields",
    initialState,
    reducers: {
        getMetafield: {
            reducer( state, action) {
                const { namespace, key } = action.payload;
                return state.metafields.metafields.find( metafield => metafield.namespace === namespace && metafield.key === key );
            }
        }
    }
})
export default metafieldSlice.reducer;

export const { getMetafield } = metafieldSlice.actions

export const getAllMetafields = state => state.metafields;

export const selectByNamespaceKey = ( state, namespace, key ) => state.metafields.find( metafield => metafield.namespace === namespace && metafield.key === key )

export const fetchMetafields = ({ namespace, key } ) => {

    return async() => {
        const response = await fetch(`/api/metafield/namespace/${ namespace }/key/${ key }`);
        return response.json();
    };
}
