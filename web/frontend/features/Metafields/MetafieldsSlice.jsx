import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {useAppQuery, useAuthenticatedFetch} from "../../hooks";
import LOGGER from "../../components/app/Helpers/Logger";
import {loadMetafield} from "./MetafieldsApi";
import {useDispatch, useSelector} from "react-redux";

const initialState = {
    metafields : [],
    status : "idle"
};

const metafieldLoadAsync = createAsyncThunk(
    "metafield/load",

    async ( { namespace, key } ) => {
        const response = await loadMetafield( namespace, key );
        return response.payload;
    }
)

const MetafieldsSlice = createSlice({
    name : "metafields",
    initialState,
    reducers: {
        get_Metafield : ( state , action ) => {
            if ( !!action.payload ) {

            }
        }
    },
    extraReducers : builder => {
        builder
            .addCase( metafieldLoadAsync.pending, state => {
                state.status = "loading"
            } )
            .addCase( metafieldLoadAsync.fulfilled, (state, action ) => {
                state.status = "idle";
                state.metafields.push( action.payload )
            } )
    }
});

export const getMetafield = async ({ namespace, key }) => {
    const state = useSelector( state => state.metafields );
    const metafield = state.metafields.find(metafield => metafield.namespace === namespace && metafield.key === key)
    if (!!metafield) return metafield;
    else {
        const dispatch = useDispatch();
        const metafield = await dispatch(metafieldLoadAsync({namespace, key}));
        console.log({metafield} )
        state.metafields.push( metafield )
        return metafield;
    }
};

export const { get_Metafield } = MetafieldsSlice.actions;

export default MetafieldsSlice.reducer;
