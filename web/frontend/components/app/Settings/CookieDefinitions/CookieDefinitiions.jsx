import {Card, DataTable, Filters, ChoiceList, ResourceItem, Button, Stack, TextField, Modal, ActionList, Text, InlineCode, useBreakpoints, ResourceList} from '@shopify/polaris';
import {useState, useCallback, useEffect} from 'react';
import {useAppQuery} from "../../../../hooks";
import {Toast} from "@shopify/app-bridge-react";

import LOGGER from "../../Helpers/Logger"


export default function CookieDefinitions() {

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

    const sort = function (items, index, direction) {
        return [...items].sort((rowA, rowB) => {
            if (rowA[index].toLowerCase() < rowB[index].toLowerCase()) return direction === 'descending' ? -1 : +1
            if (rowA[index].toLowerCase() > rowB[index].toLowerCase()) return direction === 'descending' ? +1 : -1
            else return 0
        });
    }

    const [sortedRows, setSortedRows] = useState(null);

    const [isLoading, setIsLoading] = useState(true);
    const emptyToastProps = {content: null};
    const [toastProps, setToastProps] = useState(emptyToastProps);
    const toastMarkup = toastProps.content && (
        <Toast {...toastProps} onDismiss={() => setToastProps(emptyToastProps)}/>
    );

    useAppQuery({
        url: "/api/metafield/namespace/bc_cookie/key/bc_cookie_list",
        reactQueryOptions: {
            onSuccess: ( data ) => {
                LOGGER.LOG("onSuccess", {data} )

                const metafieldData = JSON.parse( data.value );

                const cookieArray = [];
                const cookieObjects = [];
                if (Object.prototype.toString.call(metafieldData) === '[object Object]') {
                    for (const [name, value] of Object.entries( metafieldData )) {
                        value["name"] = name;
                        const arr = [];
                        headings.forEach(heading => arr.push(value[heading.toLowerCase()]))
                        cookieArray.push(arr);
                        cookieObjects.push(value)
                    }
                }
                const sortedList = sort( cookieArray, 0, 'descending');

                setCookieList({sortedList} );
                setProviders( getList('Provider') );
                setCookieTypes( getList( "Type") )
                setRows( sortedList )
                setCookieObjectList( cookieObjects );
                setIsLoading(false);
                LOGGER.LOG({cookieObjects} )
            }
        },
    });

    const [cookieList, setCookieList] = useState( [] )
    /*
    const [cookieList, setCookieList] = useState(() => {
        const cookieArray = [];
        if (Object.prototype.toString.call(cookieData) === '[object Object]') {
            for (const [name, value] of Object.entries(cookieData)) {
                value["name"] = name;
                const arr = [];
                headings.forEach(heading => arr.push(value[heading.toLowerCase()]))
                cookieArray.push(arr);
            }
        } else {
            return sort(cookieList, 0, 'descending');
        }
        return sort(cookieArray, 0, 'descending');
    })
    */

    const [rows, setRows] = useState(()=>{
        return sortedRows ? sortedRows : cookieList
    });

    const [cookieObjectList, setCookieObjectList] = useState([]);

    const handleCookiesLoaded = function ( data ){
        LOGGER.LOG( data )
        const metafieldData = JSON.parse( data.value );

        const cookieArray = [];
        const cookieObjects = [];
        if (Object.prototype.toString.call(metafieldData) === '[object Object]') {
            for (const [name, value] of Object.entries( metafieldData )) {
                value["name"] = name;
                const arr = [];
                headings.forEach(heading => arr.push(value[heading.toLowerCase()]))
                cookieArray.push(arr);
                cookieObjects.push(value)
            }
        }
        const sortedList = sort( cookieArray, 0, 'descending');

        setCookieList({sortedList} );
        setProviders( getList('Provider') );
        setCookieTypes( getList( "Type") )
        setRows( sortedList )
        setCookieObjectList( cookieObjects );
        setIsLoading(false);
        LOGGER.LOG({cookieObjects} )
    }


    const handleSort = useCallback(
        (index, direction) => setSortedRows(sort(rows, index, direction)),
        [rows],
    );
    const {lgDown} = useBreakpoints();

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
        return list;
    }
    const [providers, setProviders] = useState(null)
    const [provider, setProvider] = useState(null);
    const [cookietypes, setCookieTypes] = useState(null);
    const [cookietype, setCookieType] = useState(null);
    const [queryValue, setQueryValue] = useState('');

    const handleProviderChange = useCallback(
        (value) => setProvider(value),
        []
    )
    const handleCookieTypeChange = useCallback(
        (value) => setCookieType(value),
        []
    )

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

    function disambiguateLabel(key, value) {
        LOGGER.LOG({key, value})
        switch (key) {
            case 'Provider':
                return value;
            case 'Type':
                return value;
            default:
                return value;
        }
    }

    function isEmpty(value) {
        if (Array.isArray(value)) {
            return value.length === 0;
        } else {
            return value === '' || value == null;
        }
    }

    const handleFilterQueryChange = useCallback((value) => setQueryValue(value), [])
    const handleQueryValueRemove = useCallback(() => setQueryValue(''), [])
    const handleProviderValueRemove = useCallback(() => setProvider(null), [])
    const handleCookieTypeValueRemove = useCallback(() => setCookieType(null), [])


    const handleFiltersClearAll = useCallback(() => {
        handleProviderValueRemove();
        handleProviderValueRemove();
        handleCookieTypeValueRemove();
    }, [])

    const appliedFilters = [];

    useEffect(() => {
        if (!isEmpty(provider)) {
            const key = 'Provider';
            appliedFilters.push({
                key,
                label: disambiguateLabel(key, provider),
                onRemove: handleProviderValueRemove,
            });
        }
    }, [provider])

    useEffect(() => {
        if (!isEmpty(cookietype)) {
            const key = 'Type';
            appliedFilters.push({
                key,
                label: disambiguateLabel(key, cookietype),
                onRemove: handleCookieTypeValueRemove,
            });
        }
    }, [cookietype])

    useEffect(() => {
        let list = [];

        if (appliedFilters.length > 0) {
            appliedFilters.forEach(filter => {
                const index = headings.indexOf(filter.key);
                LOGGER.LOG(index);
                filter.label.forEach(label => {
                    LOGGER.LOG(label)
                    cookieList.forEach(row => {
                        if (row[index] === label) {
                            list.push(row)
                        }
                    })
                });
            });
            setSortedRows(list)
        } else {
            sortedRows ? setSortedRows(null) : null
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

            LOGGER.LOG({
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

            LOGGER.LOG( editCookie.name, nameModalInput )

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
            LOGGER.LOG( cookieObjectList )

        }, [editCookie, nameModalInput,
            descriptionModalInput,
            pathModalInput,
            domainModalInput,
            providerModalInput]
    )

    const handleEditCookie = function ( name ) {
        LOGGER.LOG( {name} )
        handleChangeModalEditCookie()
        const cookie = cookieObjectList.filter( cookie => cookie.name === name )[0];
        setEditCookie( cookie )
        setNameModalInput(cookie.name)
        setDescription(cookie.description)
        setPahtModalInput(cookie.path)
        seDomainModalInput(cookie.domain)
        setProviderModalInput(cookie.provider)
    }

    const renderCookieItems = function (item) {
        const {name, description, provider} = item;
        return (
            <ResourceItem
                id={name}
                url={'url'}
                accessibilityLabel={`Edit ${name}`}
                name={name}
                verticalAlignment="trailing"
            >
                <div style={{
                    display : "flex"
                }}>
                    <div>
                        <Text variant="bodyMd" fontWeight="bold" as="h3">
                            {name}
                        </Text>
                        <Text variant="bodyMd" as="p" alignment="left">
                            { description }
                        </Text>
                    </div>
                    <div style={{
                        display: "flex",
                        width: "min-content",
                        margin: "auto 0 auto auto",
                    }}>
                        <Button
                            primary={false}
                            onClick={()=> handleEditCookie( name )}
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
        );
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
            {toastMarkup}
            {cookieEditMarkup}
            <Card>
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
                    <ResourceList
                        resourceName={{singular: 'sale', plural: 'sales'}}
                        items={ cookieObjectList }
                        renderItem={renderCookieItems}
                    />
                    <DataTable
                        columnContentTypes={types}
                        headings={headings}
                        rows={rows}
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
