/**
 * @typedef State
 * @property { AppState } APP
 * @property { DataState } DATA
 */

/**
 * @typedef DataState
 * @property { Object } OWNER_IDS
 */

/**
 * @typedef AppState
 * @property { boolean } pageLoading
 * @property { boolean } loading
 * @property { Toast } toast
 * @property { null } shopDomain
 * @property { Object: { createdAt: int, key: null } } token
 * @property { array } errors
 * @property { array } failure
 */

/**
 * @typedef {Object} FetchProviderState
 * @property { array } OWNER_IDS
 * @property { array } THEMES
 * @property { array } METAFIELDS
 */

/**
 * @typedef {Object} FetchProviderActions
 * @property {(function({ owner, id }): { payload: { owner, id } })} saveOwnerId
 * @property THEMES: ThemesObject
 * @property METAFIELDS: MetafieldsObject
 */

/**
 * @typedef ThemesObject
 * @property {(function(Theme): {payload: Theme, type: string})} themesDataCreate
 * @property {(function(Theme): {payload: Theme, type: string})} themesDataUpdate
 * @property {(function(Theme): {payload: Theme, type: string})} themesDataSelect
 * @property {(function(Theme): {payload: Theme, type: string})} themesDataDelete
 * @property {(function(Theme): {payload: Theme, type: string})} themesDataSave
 */

/**
 * @typedef MetafieldsObject
 * @property {(function(Metafield): {payload: Metafield, type: string})} metafieldsDataCreate
 * @property {(function(Metafield): {payload: Metafield, type: string})} metafieldsDataUpdate
 * @property {(function(Metafield): {payload: Metafield, type: string})} metafieldsDataSelect
 * @property {(function(Metafield): {payload: Metafield, type: string})} metafieldsDataDelete
 * @property {(function(Metafield): {payload: Metafield, type: string})} metafieldsDataSave
 */

/**
 * @typedef {Object} ToastObject
 * @property {(function( Toast ): void)|Toast} Message
 * @property {function} Error
 * @property {Object: DevObject} Dev
 */

/**
 * @typedef {Object} DevObject
 * @property {function} Message
 * @property {function} Error
 */

/**
 * @typedef {Object} ModalObject
 * @property {(function( { error: message } ): void)|error} Error
 */

/**
 * @typedef {Object} PageObject
 * @property {function} setPageLoading
 * @property {(function( { key: token } ) : void)|{ key: token} } setToken
 */

/**
 * @typedef {{
    Page: PageObject,
    Toast: ToastObject,
    Modal: ModalObject,
    DataActions: FetchProviderActions,
    }} AppActionsObject
 */

/**
 * TypeDefinition Toast
 * @typedef {{
        content: string|null,
        isError?: boolean|null,
        duration?: int|5000,
        onDismiss?: function|null,
        action?: function|null
    }} Toast
 */

/**
 * @typedef {Object} Metafield
 * @property {string} id
 * @property {string} namespace
 * @property {string} key
 * @property {string} value
 * @property {string} type
 */

/**
 * @typedef {Object} Theme
 * @property {string} id
 * @property {string} folder
 * @property {string} file
 * @property {string} content
 */
