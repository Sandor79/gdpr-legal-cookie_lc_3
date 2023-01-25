import {
    INITIAL_STATE,
    KEY,
    METAFIELD_TEMPLATE,
    METAFIELDS_DATA_CREATE, METAFIELDS_DATA_SAVE, METAFIELDS_DATA_SELECT, METAFIELDS_DATA_UPDATE,
    NAMESPACE, SAVE_OWNER_ID
} from "./_const";
import {AppActions} from "../";


/**
 * @param { FetchProviderState } state
 * @param action
 * @returns FetchProviderState
 * @private
 */
export const _reducers = function ( state = INITIAL_STATE, action ) {

    if ( action.type === SAVE_OWNER_ID ){
        const oldState = { ...state }
        const owner = oldState.OWNER_IDS.find( owner => owner.id === action.payload.id )
        if ( !owner ){
            const newOwner = {
                owner: action.payload.owner,
                id: action.payload.id
            }
            return {
                ...state,
                OWNER_IDS : [ ...oldState.OWNER_IDS, newOwner ]
            }
        }
        return state;

    } else if ( action.type === METAFIELDS_DATA_CREATE ) {
        const { id, namespace, key, value, type } = action.payload;
        const oldState = { ...state };
        const originMetafield = oldState.METAFIELDS.find( metafield => metafield[ NAMESPACE ] === namespace && metafield[ KEY ] === key );

        if ( !!originMetafield ) {
            AppActions.Toast.Error( { content: "Metafield exists, can not create" } );
            return oldState
        }
        const newMetafield_create = METAFIELD_TEMPLATE( action.payload );
        AppActions.Toast.Message( { content: "New Metafield created" } );
        return {
            ...oldState,
            METAFIELDS : [ ...oldState.METAFIELDS, { ...newMetafield_create } ]
        }


    } else if ( action.type === METAFIELDS_DATA_UPDATE ) {
        const {id, namespace, key, value, type} = action.payload;
        const oldState = {...state};
        const originMetafield = oldState.METAFIELDS.find(metafield => metafield[NAMESPACE] === namespace && metafield[KEY] === key);

        if (!originMetafield) {
            AppActions.Toast.Error({ content: "Metafield not exists, can not update" });
            return oldState
        }

        const newMetafield_update = {
            ...originMetafield,
            ...METAFIELD_TEMPLATE(action.payload)
        };

        const newMetafieldsState = oldState.METAFIELDS.filter(metafield => metafield[NAMESPACE] !== namespace && metafield[KEY] !== key)
        AppActions.Toast.Message({ content: "Metafield updated successful" });
        return {
            ...oldState,
            METAFIELDS: [...newMetafieldsState, {...newMetafield_update}]
        }

    } else if ( action.type === METAFIELDS_DATA_SAVE ) {


    } else {
        return state;
    }

}
