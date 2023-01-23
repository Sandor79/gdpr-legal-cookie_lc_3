import {
    SAVE_OWNER_ID,
    METAFIELDS_DATA_CREATE,
    METAFIELDS_DATA_DELETE,
    METAFIELDS_DATA_SAVE,
    METAFIELDS_DATA_SELECT,
    METAFIELDS_DATA_UPDATE,
    THEMES_DATA_CREATE,
    THEMES_DATA_DELETE,
    THEMES_DATA_SAVE,
    THEMES_DATA_SELECT,
    THEMES_DATA_UPDATE
} from "./_const";


export const _saveOwnerId = value => ({
   type: SAVE_OWNER_ID,
   payload: value
});
/**
 * @param {Metafield} value
 * @returns {{ payload: Metafield, type: string }}
 */
export const metafieldsDataCreate = value => ({
    type: METAFIELDS_DATA_CREATE,
    payload: value
});
/**
 * @param {Metafield} value
 * @returns {{ payload: Metafield, type: string }}
 */
export const metafieldsDataUpdate = value => ({
    type: METAFIELDS_DATA_UPDATE,
    payload: value
});
/**
 * @param {Metafield} value
 * @returns {{ payload: Metafield, type: string }}
 */
export const metafieldsDataSelect = value => ({
    type: METAFIELDS_DATA_SELECT,
    payload: value
});
/**
 * @param {Metafield} value
 * @returns {{ payload: Metafield, type: string }}
 */
export const metafieldsDataDelete = value => ({
    type: METAFIELDS_DATA_DELETE,
    payload: value
});
/**
 * @param {Metafield} value
 * @returns {{ payload: Metafield, type: string }}
 */
export const metafieldsDataSave = value => ({
    type: METAFIELDS_DATA_SAVE,
    payload: value
});

/**
 * @param { Theme } value
 * @returns {{ payload: Theme, type: string }}
 */
export const themesDataCreate = value => ({
    type: THEMES_DATA_CREATE,
    payload: value
});
/**
 * @param { Theme } value
 * @returns {{ payload: Theme, type: string }}
 */
export const themesDataUpdate = value => ({
    type: THEMES_DATA_UPDATE,
    payload: value
});
/**
 * @param { Theme } value
 * @returns {{ payload: Theme, type: string }}
 */
export const themesDataSelect = value => ({
    type: THEMES_DATA_SELECT,
    payload: value
});
/**
 * @param { Theme } value
 * @returns {{ payload: Theme, type: string }}
 */
export const themesDataDelete = value => ({
    type: THEMES_DATA_DELETE,
    payload: value
});
/**
 * @param { Theme } value
 * @returns {{ payload: Theme, type: string }}
 */
export const themesDataSave = value => ({
        type: THEMES_DATA_SAVE,
        payload: value
});
