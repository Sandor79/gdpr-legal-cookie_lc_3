import {useAppQuery} from "../../../hooks";
import LOGGER from "../Helpers/Logger";
import {useState} from "react";
import {TextStyle} from "@shopify/polaris";

export default function () {
    const [webhookRegistryLoaded, setWebhookRegistryLoaded] = useState(true)

    setWebhookRegistryLoaded( !webhookRegistryLoaded );
    const {data} = useAppQuery({
        url: `/api/webhooks/check-registry`,
        fetchInit: {
            method: 'GET',
            mode: 'cors',
            cache: 'default',
        },
        reactQueryOptions: {
            onSuccess: () => {
                setWebhookRegistryLoaded(!webhookRegistryLoaded);
                LOGGER.LOG("useAppQuery")
            },
        },
    });
    console.log(data)
    return (
        <div>
            <TextStyle variation="strong">
                {webhookRegistryLoaded ? "-" : data}
            </TextStyle>
        </div>
    );
}
