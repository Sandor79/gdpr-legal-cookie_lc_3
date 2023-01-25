import {Card, DataTable, Filters, ChoiceList, ResourceItem, Button, Stack, TextField, Modal, ActionList, Text, InlineCode, useBreakpoints, ResourceList} from '@shopify/polaris';
import {useState, useCallback, useEffect} from 'react';
import {useAppQuery} from "../../../../hooks";
import {Toast} from "@shopify/app-bridge-react";

import LOGGER from "../../Helpers/Logger"
import {AppActions} from "../../../../ReduxStoreProvider";

export default function CookieDefinitions() {
    const sort = function (items, index, direction) {
        const copyOfItems = [...items];

        return copyOfItems.sort((rowA, rowB) => {
            if (rowA[index].toLowerCase() < rowB[index].toLowerCase()) return direction === 'descending' ? -1 : +1
            if (rowA[index].toLowerCase() > rowB[index].toLowerCase()) return direction === 'descending' ? +1 : -1
            else return 0
        });
    }
    const getList = function (key) {
        const keys = [];
        const list = [];
        const index = headings.indexOf(key);
        rows.forEach(row => {
            const key = row[index];
            if (!keys.includes(key)) {
                keys.push(key)
                list.push({label: key, value: key})
            }
        })
        console.log(key, {list} )
        return list;
    }
    const disambiguateLabel = function (key, value) {
        switch (key) {
            case 'Provider':
                return value;
            case 'Type':
                return value;
            default:
                return value;
        }
    }
    const isEmpty = function (value) {
        if (Array.isArray(value)) {
            return value.length === 0;
        } else {
            return value === '' || value == null;
        }
    }
    const appendFilter = function ( type, labels ) {
        console.log( { labels } )
        if ( !!labels ) {
            const filters = []
            labels.forEach( label => {
                const key = `${ type }_${ label }`

                filters.push({
                    type,
                    key,
                    label: disambiguateLabel( type, label ),
                    onRemove: handleProviderValueRemove,
                });
            })
            setAppliedFilters([...filters])
            console.log( { filters } )
        }
    }
    const columnDefinitions = [
        {type: 'text', heading: 'Name', sortable: true},
        {type: 'text', heading: 'Description', sortable: true},
        {type: 'text', heading: 'Path', sortable: false},
        {type: 'text', heading: 'Domain', sortable: false},
        {type: 'text', heading: 'Provider', sortable: true},
        {type: 'text', heading: 'Expires', sortable: false},
        {type: 'text', heading: 'Type', sortable: true}
    ];
    const headings = columnDefinitions.map(defition => defition.heading);
    const types = columnDefinitions.map(defition => defition.type);


    const [isLoading, setIsLoading] = useState(true);
    const [sortedRows, setSortedRows] = useState([] );
    const [cookieList, setCookieList] = useState( [] )
    const [rows, setRows] = useState( sortedRows );

    const [cookieObjectList, setCookieObjectList] = useState([]);

    const handleSort = useCallback(
        (index, direction) => setSortedRows( sort(rows, index, direction) ),
        [rows],
    );
    const {lgDown} = useBreakpoints();

    const [providers, setProviders] = useState(null)
    const [cookietypes, setCookieTypes] = useState(null);

    useEffect(() => setProviders( getList('Provider') ) && setCookieTypes( getList( "Type") ),[ rows ])
    useEffect(() =>{
        AppActions.DataActions.METAFIELDS.select({
            namespace: 'bc_cookie',
            key: "bc_cookie_list"
        } ).then( data => {
            const metafieldData = JSON.parse( data.value || data.VALUE );
            const cookieArray = [];
            const cookieObjects = [];

            if (Object.prototype.toString.call(metafieldData) === '[object Object]') {
                for (const [name, value] of Object.entries( metafieldData )) {
                    value["name"] = name;
                    const arr = [];

                    headings.forEach(heading => {
                        const newValue = { ...value }
                        heading = heading.toLowerCase();

                        if( heading === "description" ){
                            const shortDescription = newValue[ heading ].length < 30 ? newValue[ heading ] : newValue[ heading ].slice(0,30) + "...";
                            newValue[heading] = shortDescription;
                        }
                        arr.push(newValue[ heading ])
                    })

                    cookieArray.push(arr);
                    cookieObjects.push(value)
                }
            }

            const initialSortedList = sort( cookieArray, 0, 'descending');

            setCookieList( [...initialSortedList] );
            setProviders( getList('Provider') );
            setCookieTypes( getList( "Type") )
            setRows( [...initialSortedList] )
            setSortedRows( [...initialSortedList] )
            setCookieObjectList( cookieObjects );
            setIsLoading(false);
            LOGGER.LOG( 121, {cookieObjects} )
        } )
    },[])


    const [provider, setProvider] = useState(null);
    const [cookietype, setCookieType] = useState(null);
    const [queryValue, setQueryValue] = useState('');

    const handleProviderChange = useCallback( value => setProvider(value), [] )
    const handleCookieTypeChange = useCallback( value => setCookieType(value), [] )

    const filters = [
        {
            key: 'Provider',
            label: 'Provider',
            filter: (
                <ChoiceList
                    title="Provider"
                    titleHidden
                    choices={providers}
                    selected={provider || []}
                    onChange={handleProviderChange}
                    allowMultiple
                />
            ),
            shortcut: true,
        },
        {
            key: 'Type',
            label: 'Type',
            filter: (
                <ChoiceList
                    title="Type"
                    titleHidden
                    choices={cookietypes}
                    selected={cookietype || []}
                    onChange={handleCookieTypeChange}
                    allowMultiple
                />
            ),
        }
    ];

    const handleFilterQueryChange = useCallback((value) => setQueryValue(value), [])
    const handleQueryValueRemove = useCallback(() => setQueryValue(''), [])
    const handleProviderValueRemove = useCallback(() => setProvider(null), [])
    const handleCookieTypeValueRemove = useCallback(() => setCookieType(null), [])


    const handleFiltersClearAll = useCallback(() => {
        handleProviderValueRemove();
        handleCookieTypeValueRemove();
    }, [])

    const [appliedFilters, setAppliedFilters ] = useState([]);

    useEffect(() => appendFilter( "Provider", provider ),[ provider ])
    useEffect(() => appendFilter( "Type", cookietype ),[ cookietype ])
    useEffect(() => {
        let list = [];

        if (appliedFilters.length > 0) {
            const filters = [ ...appliedFilters ];

            filters.forEach(filter => {
                const index = headings.indexOf( filter.type );
                LOGGER.LOG( 239, index, filter );

                cookieList.forEach( row => {
                    if (row[index] === filter.label) {
                        console.log( { row, label: filter.label } )
                        list.push(row)
                    }
                })
            });
            setSortedRows(list)
        }
    }, [appliedFilters])

    const [editCookie, setEditCookie] = useState( null );
    const [obenModalEditCookie, setObenModalEditCookie] = useState(false)

    const handleChangeModalEditCookie = useCallback(()=> setObenModalEditCookie( !obenModalEditCookie), [obenModalEditCookie]);
    const handleCloseModalEditCookie = function ( action ) {
        handleChangeModalEditCookie()
        if ( action === "save" ) {
            handleUpdateAndSave([
                editCookie, nameModalInput,
                descriptionModalInput,
                pathModalInput,
                domainModalInput,
                providerModalInput
            ])
        }
    }
    const [nameModalInput, setNameModalInput] = useState(null)
    const [descriptionModalInput, setDescription] = useState(null)
    const [pathModalInput, setPahtModalInput] = useState(null)
    const [domainModalInput, seDomainModalInput] = useState(null)
    const [providerModalInput, setProviderModalInput] = useState(null)
    const handleNameModalInputChange = useCallback( newValue => setNameModalInput( newValue ), [])
    const handleDescriptionChange = useCallback( newValue => setDescription( newValue ), [])
    const handlePahtModalInputChange = useCallback( newValue => setPahtModalInput( newValue ), [])
    const handleDomainModalInputChange = useCallback( newValue => seDomainModalInput( newValue ), [])
    const handleProviderModalInputChange = useCallback( newValue => setProviderModalInput( newValue ), [])
    const l = {
        name: nameModalInput,
        description: descriptionModalInput,
        paht: pathModalInput,
        domain: domainModalInput,
        provider: providerModalInput,
        "deletable": "false",
        "expires": "31536000",
        "type": "type_0",
        "recommendation": "0",
        "editable": "false",
        "set": "0"
    }



    const handleUpdateAndSave = useCallback(
        () => {

            LOGGER.LOG(308, {
                editCookie,
                nameModalInput,
                descriptionModalInput,
                pathModalInput,
                domainModalInput,
                providerModalInput
            });
            let hasChanges = false;
            const copy = JSON.parse( JSON.stringify( cookieObjectList ))
            const metafieldData = {};

            LOGGER.LOG( 320, editCookie.name, nameModalInput )

            if ( editCookie.name !== nameModalInput ||
                editCookie.description !== descriptionModalInput ||
                editCookie.path !== pathModalInput ||
                editCookie.domain !== domainModalInput ||
                editCookie.provider !== providerModalInput
            ) {
                hasChanges = true;
            }

            if ( hasChanges ) {
                const index = copy.findIndex( cookieDef => cookieDef.name === editCookie.name );
                //const cleanedObjectList = copy.slice( index, 1 );
                const cleanedObjectList = copy.filter( cookie => cookie.name !== editCookie.name );

                cleanedObjectList.push({
                    name: nameModalInput,
                    description: descriptionModalInput,
                    paht: pathModalInput,
                    domain: domainModalInput,
                    provider: providerModalInput,
                    "deletable": "false",
                    "expires": "31536000",
                    "type": "type_0",
                    "recommendation": "0",
                    "editable": "false",
                    "set": "0"
                });

                // create metafieldValue
                cleanedObjectList.forEach( cookie => {
                    metafieldData[ cookie.name ] = cookie;
                })
                setCookieObjectList( cleanedObjectList );
            }
            LOGGER.LOG( 356, cookieObjectList )

        }, [editCookie, nameModalInput,
            descriptionModalInput,
            pathModalInput,
            domainModalInput,
            providerModalInput]
    )

    const handleEditCookie = function ( name ) {
        LOGGER.LOG( 366, {name} )
        handleChangeModalEditCookie()
        const cookie = cookieObjectList.filter( cookie => cookie.name === name )[0];
        setEditCookie( cookie )
        setNameModalInput(cookie.name)
        setDescription(cookie.description)
        setPahtModalInput(cookie.path)
        seDomainModalInput(cookie.domain)
        setProviderModalInput(cookie.provider)
    }

    const cookieEditMarkup = obenModalEditCookie && editCookie && (
        <Modal
            open={obenModalEditCookie}
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
                            value={ nameModalInput }
                            onChange={handleNameModalInputChange}
                            autoComplete="off"
                        />
                        <TextField
                            label="Description"
                            value={ descriptionModalInput }
                            onChange={handleDescriptionChange}
                            autoComplete="off"
                            multiline={4}
                        />
                        <TextField
                            label="Paht"
                            value={ pathModalInput }
                            onChange={handlePahtModalInputChange}
                            autoComplete="off"
                        />
                        <TextField
                            label="Domain"
                            value={ domainModalInput }
                            onChange={handleDomainModalInputChange}
                            autoComplete="off"
                        />
                        <TextField
                            label="Provider"
                            value={ providerModalInput }
                            onChange={handleProviderModalInputChange}
                            autoComplete="off"
                        />
                    </Stack.Item>
                </Stack>
            </Modal.Section>
        </Modal>
    );

    if (isLoading) {
        return (
            <Card
                sectioned
                primaryFooterAction={{
                    content: "",
                    loading: isLoading,
                }}
            />
        )
    }

    return (
        <>
            <Card>
            {cookieEditMarkup}
                <Card.Section>
                    <Filters
                        queryValue={queryValue}
                        filters={filters}
                        appliedFilters={appliedFilters}
                        onQueryChange={handleFilterQueryChange}
                        onQueryClear={handleQueryValueRemove}
                        onClearAll={handleFiltersClearAll}
                    />
                </Card.Section>
                <Card.Section>
                    <DataTable
                        columnContentTypes={types}
                        headings={headings}
                        rows={ sortedRows }
                        sortable={() => columnDefinitions.map(definition => definition.sortable)}
                        defaultSortDirection="descending"
                        initialSortColumnIndex={0}
                        onSort={handleSort}
                        footerContent={ `Showing ${rows.length} of ${rows.length} results` }
                        hasZebraStripingOnData
                        increasedTableDensity
                        stickyHeader
                        fixedFirstColumns={ lgDown ? 2 : 0 }
                    />

                </Card.Section>
            </Card>
        </>
    );
}
