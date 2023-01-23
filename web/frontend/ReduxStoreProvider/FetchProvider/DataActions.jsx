import {store} from "../ReduxStoreProvider";
import {
    metafieldsDataCreate, metafieldsDataDelete, metafieldsDataSave,
    metafieldsDataSelect,
    metafieldsDataUpdate,
    _saveOwnerId, themesDataCreate, themesDataDelete, themesDataSave, themesDataSelect, themesDataUpdate
} from "./_actions";

/**
 * @type FetchProviderActions
 */
export const _DataActions = {
    /**
     * @param {{owner, id}} value
     * @returns {{payload: {owner, id}, type: string}}
     */
    saveOwnerId : value => {
        console.log( { value } )
        store.dispatch( _saveOwnerId( value ) )
    },
    METAFIELDS : {
        /**
         * @param { Metafield } value
         * @returns {{ payload: Metafield, type: string }}
         */
        create : value => {
            store.dispatch(metafieldsDataCreate(value))
        },
        /**
         * @param { Metafield } value
         * @returns {{ payload: Metafield, type: string }}
         */
        update : value => {
            store.dispatch(metafieldsDataUpdate(value))
        },
        /**
         * @param { Metafield } value
         * @returns {{ payload: Metafield, type: string }}
         */
        select : value => {
            store.dispatch(metafieldsDataSelect(value))
        },
        /**
         * @param { Metafield } value
         * @returns {{ payload: Metafield, type: string }}
         */
        delete : value => {
            store.dispatch(metafieldsDataDelete(value))
        },
        /**
         * @param { Metafield } value
         * @returns {{ payload: Metafield, type: string }}
         */
        save : value => {
            store.dispatch(metafieldsDataSave(value))
        }
    },
    THEMES : {
        /**
         * @param { Theme } value
         * @returns {{ payload: Theme, type: string }}
         */
        create : value => {
            store.dispatch(themesDataCreate(value))
        },
        /**
         * @param { Theme } value
         * @returns {{ payload: Theme, type: string }}
         */
        update : value => {
            store.dispatch(themesDataUpdate(value))
        },
        /**
         * @param { Theme } value
         * @returns {{ payload: Theme, type: string }}
         */
        select : value => {
            store.dispatch(themesDataSelect(value))
        },
        /**
         * @param { Theme } value
         * @returns {{ payload: Theme, type: string }}
         */
        delete : value => {
            store.dispatch(themesDataDelete(value))
        },
        /**
         * @param { Theme } value
         * @returns {{ payload: Theme, type: string }}
         */
        save : value => {
            store.dispatch(themesDataSave(value))
        }
    }
}
