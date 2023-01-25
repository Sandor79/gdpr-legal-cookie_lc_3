import {
    Card,
    Heading,
    TextContainer,
    DisplayText,
    TextStyle,
} from "@shopify/polaris";
import {useAppQuery, useAuthenticatedFetch} from "../hooks";
import { useSelector} from "react-redux";
import {AppActions} from "../ReduxStoreProvider/";

export function ProductsCard() {
    const fetch = useAuthenticatedFetch();
    const loading = useSelector( state => state.APP.loading )

    const {
        data,
        refetch: refetchProductCount,
        isLoading: isLoadingCount,
    } = useAppQuery({
        url: "/api/products/count",
        reactQueryOptions: {
            onSuccess: () => {
                AppActions.Page.setPageLoading( false )
            },
        },
    });

    const handlePopulate = async () => {
        AppActions.Page.setPageLoading( true )

        const response = await fetch("/api/products/create");

        if (response.ok) {
            console.log({response})
            AppActions.Page.setPageLoading( false )
            await refetchProductCount();
            AppActions.Toast.Message( {content: "5 products created!"} )
        } else {
            AppActions.Page.setPageLoading( false )
            AppActions.Toast.Error({ content: "There was an error creating products" });
        }
    };

    return (
        <>
            <Card
                title="Product Counter"
                sectioned
                primaryFooterAction={{
                    content: "Populate 5 products",
                    onAction: handlePopulate,
                    loading,
                }}
            >
                <TextContainer spacing="loose">
                    <p>
                        Sample products are created with a default title and price. You can
                        remove them at any time.
                    </p>
                    <Heading element="h4">
                        TOTAL PRODUCTS
                        <DisplayText size="medium">
                            <TextStyle variation="strong">
                                {isLoadingCount ? "-" : data.count}
                            </TextStyle>
                        </DisplayText>
                    </Heading>
                </TextContainer>
            </Card>
        </>
    );
}
