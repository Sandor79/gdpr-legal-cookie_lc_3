import {ResourceList, ResourceItem, SkeletonBodyText} from "@shopify/polaris";

const RessourcesCookieListSkeleton = function ({ elements } ) {
    let idCounter = 0;
    const skeletonElements = new Array( Number(elements) ).fill( <SkeletonBodyText lines="6"/> );

    const renderSkeleton = function ( children ) {
        const key = `skeleton_${ idCounter++ }`;
        return (
            <ResourceItem
                id={ key }
                verticalAlignment="trailing"
            >
                {children}
                </ResourceItem>
        );
    }

    return (
        <ResourceList
            resourceName={{singular: 'Cookie', plural: 'Cookies'}}
            renderItem={ renderSkeleton }
            loading={ true }
            items={skeletonElements}/>
    )
}

export default RessourcesCookieListSkeleton;
