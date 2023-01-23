export const STORE_KEY = "DATA"
export const GET = "GET"
export const POST = "POST"
export const UPDATE = "UPDATE"
export const DELETE = "DELETE"

export const SAVE_OWNER_ID = "SAVE_OWNER_ID"
export const THEMES = "THEMES"
export const METAFIELDS = "METAFIELDS"

export const FOLDERS = "FOLDERS"
export const FILES = "FILES"
export const CONTENT = "CONTENT"

export const ID = "ID"
export const NAMESPACE = "NAMESPACE"
export const KEY = "KEY"
export const VALUE = "VALUE"

export const DATA_CREATE = "DATA_CREATE"
export const DATA_UPDATE = "DATA_UPDATE"
export const DATA_SELECT = "DATA_SELECT"
export const DATA_DELETE = "DATA_DELETE"
export const DATA_SAVE = "DATA_SAVE"

export const METAFIELDS_DATA_CREATE = `${ METAFIELDS }/${ DATA_CREATE }`
export const METAFIELDS_DATA_UPDATE = `${ METAFIELDS }/${ DATA_UPDATE }`
export const METAFIELDS_DATA_SELECT = `${ METAFIELDS }/${ DATA_SELECT }`
export const METAFIELDS_DATA_DELETE = `${ METAFIELDS }/${ DATA_DELETE }`
export const METAFIELDS_DATA_SAVE = `${ METAFIELDS }/${ DATA_SAVE }`

export const THEMES_DATA_CREATE = `${ THEMES }/${ DATA_CREATE }`
export const THEMES_DATA_UPDATE = `${ THEMES }/${ DATA_UPDATE }`
export const THEMES_DATA_SELECT = `${ THEMES }/${ DATA_SELECT }`
export const THEMES_DATA_DELETE = `${ THEMES }/${ DATA_DELETE }`
export const THEMES_DATA_SAVE = `${ THEMES }/${ DATA_SAVE }`

/**
 * @param {Metafield} metafieldData
 * @returns {{NAMESPACE, ID, VALUE, TYPE, KEY}}
 */
export const METAFIELD_TEMPLATE = function ( metafieldData ) {
    const { id, namespace, key, value, type } = metafieldData;
    return {
        ID : id,
        NAMESPACE : namespace,
        KEY : key,
        VALUE : value,
        TYPE : type
    }
}

/**
 * @param {Theme} themeData
 * @returns {{FOLDERS: [{}], ID}}
 * @constructor
 */
export const THEME_TEMPLATE = function ( themeData ) {
    const { id, folder, file, content } = themeData
    return {
        ID : id,
        FOLDERS : [
            {
                [ folder ] : [
                    {
                        FILES : [ file ],
                        CONTENT : content
                    }
                ]
            }
        ]
    }
}

/**
 * @type FetchProviderState
 */
export const INITIAL_STATE = {
    OWNER_IDS : [],
    THEMES : [],
    METAFIELDS : []
}
