import {useCallback, useEffect, useMemo, useState} from "react";
import {Button, Card, ResourceList, ResourceItem, Text, Modal, Stack, TextField, Select} from "@shopify/polaris";
import LOGGER from "../../Helpers/Logger";
import {Toast} from "@shopify/app-bridge-react";
import MetafieldController from "../../Helpers/MetafieldController";
import sort from "../../Helpers/sort";
import { cookieSchema } from "./cookieDataSchema";
import RessourcesCookieListSkeleton from "./RessourcesCookieListSkeleton";
import {useDispatch} from "react-redux";
import {AppActions} from "../../../../ReduxStoreProvider";

export default function Cookies () {

    const [ queryLoading, setQueryLoading ] = useState( true );
    const [ ressourcesCookiesList, setRessourcesCookiesList ] = useState( [] );
    const [ ressourcesCookiesListSorted, setRessourcesCookiesListSorted ] = useState( [] );
    const [ ressourcesCookiesMetafield, setRessourcesCookiesMetafield ] = useState();
    const [ ressourcesProviderList, setRessourcesProviderList ] = useState( [] );
    const [ ressourcesTypeList, setRessourcesTypeList ] = useState( [] );
    const [ modalOpenEditCookie, setModalOpenEditCookie ] = useState( false );
    const [ modalEditCookie, setModalEditCookie ] = useState();
    const [ modalNameCookie, setModalNameCookie ] = useState();
    const [ modalDescriptionCookie, setModalDescriptionCookie ] = useState();
    const [ modalPathCookie, setModalPathCookie ] = useState("/");
    const [ modalDomainCookie, setModalDomainCookie ] = useState("/");
    const [ modalProviderCookie, setModalProviderCookie ] = useState("/");

    /**
     * Expire Definitionen
     * @type {[{label: string, value: number}, {label: string, value: number}, {label: string, value: number}, {label: string, value: number}, {label: string, value: number}, null, null, null, null, null, null, null]}
     */
    const Expires = [
        {value: "0",        label: 'Session'},
        {value: "60",       label: '1 Minute'},
        {value: "1800",     label: '30 Minuten'},
        {value: "3600",     label: '1 Stunde'},
        {value: "86400",    label: '1 Tag'},
        {value: "604800",   label: '7 Tage'},
        {value: "1209600",  label: '14 Tage'},
        {value: "2592000",  label: '30 Tage'},
        {value: "5184000",  label: '2 Monate'},
        {value: "7776000",  label: '3 Monate'},
        {value: "31536000", label: '1 Jahr'},
        {value: "63072000", label: '2 Jahre'}
    ];
    /**
     * CookieType Definitionen
     */
    const CookieTypes = [
        {value: "type_0", label: "Essentiell"},
        {value: "type_1", label: "Statistic"},
        {value: "type_2", label: "Marketing"}
    ]
    /**
     * Cookie Data Schema
     */
    const cookieDataSchema = cookieSchema( ressourcesProviderList, Expires, CookieTypes );

    const getDataList = function ( cookieList, key) {
        const propValues = [];
        const list = [];
        const schema = cookieDataSchema.filter( s => s.propertyName === key )[0];
        if ( !!schema ) {

            cookieList.forEach( cookieDefinition => {
                const propValue = cookieDefinition[ key ];

                if (!propValues.includes(propValue)) {
                    propValues.push(propValue)
                    list.push({ label: schema.label, value: propValue } )
                }
            })
        }
        return list;
    }

    const RenderTextNodes = function ({ cookieData } ) {

        return(
            <div>
                { cookieDataSchema.map( schema => {
                    if ( schema.visible ) {

                        const { label, tagType, propertyName, selectValues, sortable } = schema;

                        switch ( tagType ) {
                            case "h3" :
                                return (
                                    <Text variant="bodyMd" key={ `id_${ cookieData.name }_${ propertyName }` } data-property={ propertyName } data-sortable={ sortable } fontWeight="bold" as="h3">
                                        { cookieData[ propertyName ] }
                                    </Text>
                                )

                            default :
                                let value = null;

                                if ( !!selectValues && Object.prototype.toString.call( selectValues ) === "[object Function]" ) {
                                    const values = selectValues();
                                    const data = values.filter( data => data.value === cookieData[ propertyName ] );

                                    if ( data.length > 0 ) {
                                        value = `${ propertyName }: ${ data[0].label }`;
                                    }

                                } else if ( !!cookieData[ propertyName ] ) {
                                    value = `${ label }: ${ cookieData[ propertyName ]}`;
                                }

                                return (
                                    <Text key={ `id_${ cookieData.name }_${ propertyName }` } variant="bodyMd" data-property={ propertyName } data-sortable={ sortable } alignment="left" as="p">
                                        { !!value ? value : "" }
                                    </Text>
                                )
                        }
                    }
                })}
            </div>
        )
    }
    const renderResourceList = function (cookieData) {

        return (
            <ResourceItem
                id={ cookieData.name }
                url={'url'}
                accessibilityLabel={`Edit ${ cookieData.name }`}
                name={ cookieData.name }
                verticalAlignment="trailing"
                loading={true}
            >
                <div style={{
                    display : "flex"
                }}>
                    <RenderTextNodes key={ `key_${ cookieData.name }` } cookieData={ cookieData } />
                    <div style={{
                        display: "flex",
                        width: "min-content",
                        margin: "auto 0 auto auto",
                    }}>
                        <Button
                            primary={false}
                            onClick={()=> handleEditCookie( cookieData.name )}
                            connectedDisclosure={{
                                accessibilityLabel: 'Delete cookie definition',
                                actions: [
                                    {
                                        content: 'Delete definition',
                                        destructive: true,
                                        plain: false
                                    }
                                ],
                            }}
                        >
                            Edit
                        </Button>
                    </div>
                </div>
            </ResourceItem>
        )
    }

    const [ metafieldObject, setMetafieldObject ] = useState();

    const createCookieList = function ( data ) {
        if ( !!data ) {
            setMetafieldObject( data )

            AppActions.Toast.Dev.Message( "Metafield loaded!" )

            const value = data.VALUE || data.value;
            const metafieldData = JSON.parse( value );
            const ressourceList = [];

            for (const [name, value] of Object.entries( metafieldData )) {
                value["name"] = name;
                ressourceList.push(value)
            }

            setRessourcesCookiesList( ressourceList );
            setRessourcesCookiesMetafield( data );
            setQueryLoading( !queryLoading );
        }
    }

    useMemo(() => {
        const sortedList = sort( ressourcesCookiesList, "name" );
        setRessourcesProviderList( getDataList( sortedList.map( cookie => cookie ), "provider" ) );
        setRessourcesTypeList( getDataList( sortedList.map( cookie => cookie ), "type" ) );
        setRessourcesCookiesListSorted( sortedList.map( cookie => cookie ) );
    }, [ ressourcesCookiesList ])

    useEffect(() =>{
        AppActions.DataActions.METAFIELDS.select({
            namespace: 'bc_cookie',
            key: "bc_cookie_list"
        } ).then( metafieldData => createCookieList( metafieldData ) )
    },[])

    /*
    useAppQuery({
        url: "/api/metafield/namespace/bc_cookie/key/bc_cookie_list",
        reactQueryOptions: {
            onSuccess: ( data ) => {

                const metafieldData = JSON.parse( data.value );
                const ressourceListCookies = [];

                LOGGER.LOG({ metafieldData } )

                for (const [name, value] of Object.entries( metafieldData )) {
                    value["name"] = name;
                    ressourceListCookies.push(value)
                }

                const sortedList = sort( ressourceListCookies, "name", 'descending');
                LOGGER.LOG({ sortedList } )

                setState("ressources", "setCookiesMetafield", sortedList );
                LOGGER.LOG({ cookiesMetafield : STATE["ressources"]["cookiesMetafield"] } );

                setState("ressources", "setCookiesListSorted", sortedList );
                LOGGER.LOG({ cookiesListSorted : STATE["ressources"]["cookiesListSorted"] } );

                setState("ressources", "setCookiesObject", metafieldData );
                LOGGER.LOG({ cookiesObject : STATE["ressources"]["cookiesObject"] } );

                setState("ressources", "setCookiesList", ressourceListCookies );
                LOGGER.LOG({ cookiesObject : STATE["ressources"]["cookiesList"] } );

                setState("ressources", "setProviderList", getDataList( "provider" ) );
                LOGGER.LOG({ providerList : STATE["ressources"]["providerList"] } );

                setState("ressources", "setTypeList", getDataList( "type" ) );
                LOGGER.LOG({ typeList : STATE["ressources"]["typeList"] } );

                setState("query", "setQueryLoading", false );
                LOGGER.LOG({ queryLoading : STATE["query"]["queryLoading"] } );
            }
        },
    });
    */

    //const dispatch = useDispatch();

    const handleNameModalInputChange = useCallback( newValue => setModalNameCookie( newValue ), [])
    const handleDescriptionChange = useCallback( newValue => setModalDescriptionCookie( newValue ), [])
    const handlePahtModalInputChange = useCallback( newValue => setModalPathCookie( newValue ), [])
    const handleDomainModalInputChange = useCallback( newValue => setModalDomainCookie( newValue ), [])
    const handleProviderModalInputChange = useCallback( newValue => setModalProviderCookie( newValue ), [])
    const handleChangeModalEditCookie = useCallback(() => setModalOpenEditCookie( !modalOpenEditCookie ), [ modalOpenEditCookie ]);
    const handleUpdateAndSave = () => {
        LOGGER.LOG(402, {modalOpenEditCookie})
        if ( !modalOpenEditCookie ) {
            let hasChanges = false;
            const copy = JSON.parse(JSON.stringify( ressourcesCookiesList ))
            const metafieldValue = {};

            LOGGER.LOG(modalEditCookie.name, modalNameCookie)

            if (modalEditCookie.name !== modalNameCookie ||
                modalEditCookie.description !== modalDescriptionCookie ||
                modalEditCookie.path !== modalPathCookie ||
                modalEditCookie.domain !== modalDomainCookie ||
                modalEditCookie.provider !== modalProviderCookie
            ) {
                hasChanges = true;
            }

            if (hasChanges) {
                const cleanedCookiesList = copy.filter(cookie => cookie.name !== modalEditCookie.name);

                cleanedCookiesList.push({
                    name: modalNameCookie,
                    description: modalDescriptionCookie,
                    paht: modalPathCookie,
                    domain: modalDomainCookie,
                    provider: modalProviderCookie,
                    "deletable": "false",
                    "expires": "31536000",
                    "type": "type_0",
                    "recommendation": "0",
                    "editable": "false",
                    "set": "0"
                });

                // create metafieldValue
                cleanedCookiesList.forEach(cookie => {
                    metafieldValue[cookie.name] = cookie;
                });
                const newMetafieldData = cookieMetafield.saveMetafield(ressourcesCookiesMetafield, metafieldValue);
                setRessourcesCookiesMetafield(newMetafieldData);

                setRessourcesCookiesList(cleanedCookiesList);
                setRessourcesCookiesListSorted(sort(cleanedCookiesList, 'name'));
            }
        }
    }
    const handleEditCookie = function ( name ) {
        LOGGER.LOG( {name} )
        handleChangeModalEditCookie()
        const cookie = ressourcesCookiesList.filter( cookie => cookie.name === name )[0];
        setModalEditCookie( cookie )
        setModalNameCookie( cookie.name )
        setModalDescriptionCookie( cookie.description )
        setModalPathCookie( cookie.path )
        setModalDomainCookie( cookie.domain )
        setModalProviderCookie( cookie.provider )
    }
    const handleCloseModalEditCookie = function ( action ) {
        //handleChangeModalEditCookie()
        setModalOpenEditCookie( false );
        if ( action === "save" ) {
            handleUpdateAndSave()
        }
    }

    const cookieEditMarkup = modalOpenEditCookie && !!modalEditCookie && (
        <Modal
            open={ modalOpenEditCookie }
            onClose={() => handleCloseModalEditCookie( "cancel" )}
            title="Edit Cookie: "
            primaryAction={{
                content: "save",
                onAction: () => handleCloseModalEditCookie( "save" )
            }}
            secondaryActions={{
                content: "cancel",
                onAction: () => handleCloseModalEditCookie( "cancel" )
            }}
        >
            <Modal.Section>
                <Stack vertical>
                    <Stack.Item>
                        <TextField
                            label="Name"
                            value={ modalNameCookie }
                            onChange={ handleNameModalInputChange }
                            autoComplete="off"
                        />
                        <TextField
                            label="Description"
                            value={ modalDescriptionCookie }
                            onChange={handleDescriptionChange}
                            autoComplete="off"
                            multiline={4}
                        />
                        <TextField
                            label="Paht"
                            value={ modalPathCookie }
                            onChange={handlePahtModalInputChange}
                            autoComplete="off"
                        />
                        <TextField
                            label="Domain"
                            value={ modalDomainCookie }
                            onChange={handleDomainModalInputChange}
                            autoComplete="off"
                        />
                        <Select
                            options={ ressourcesProviderList }
                            label="Provider"
                            value={ () => ressourcesProviderList.map( provider => modalProviderCookie === provider.value )[0] }
                            onChange={handleProviderModalInputChange}
                            autoComplete="off"

                        />
                    </Stack.Item>
                </Stack>
            </Modal.Section>
        </Modal>
    );

    if ( queryLoading ) {
        return (
            <>
                <Card >
                    <Card.Section>
                        <RessourcesCookieListSkeleton elements="10" />
                    </Card.Section>
                </Card>
            </>
        )
    }

    return (
        <>
            {cookieEditMarkup}
            <Card>
                <Card.Section>
                    <ResourceList
                        resourceName={{singular: 'Cookie', plural: 'Cookies'}}
                        items={ ressourcesCookiesListSorted }
                        renderItem={ renderResourceList }
                        loading={ queryLoading }
                    />
                </Card.Section>
            </Card>
        </>
    );
}
