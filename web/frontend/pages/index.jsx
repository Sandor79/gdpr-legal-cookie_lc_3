import {
  Card,
  Page,
  Layout,
  TextContainer,
  Image,
  Stack,
  Link,
  Heading,
} from "@shopify/polaris";
import {TitleBar, useAppBridge} from "@shopify/app-bridge-react";
import {Loading} from "@shopify/app-bridge/actions";

import { trophyImage } from "../assets";

import { ProductsCard } from "../components";
import {useEffect, useState} from "react";
import {useAppQuery} from "../hooks";
import LOGGER from "../components/app/Helpers/Logger";

export default function HomePage() {
    const app = useAppBridge();
    const loading = Loading.create( app );

    const [webhookRegistryLoaded, setWebhookRegistryLoaded] = useState(false)

    const apiCallInstall = function () {

    }

    const stopLoading = function () {
        loading.dispatch( Loading.Action.STOP);
    }
    useEffect(() => stopLoading(),[] );

    useEffect(()=>{
        console.log( loading );

        if ( !!loading ) {
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
        }
    }, [loading])



  return (
    <Page narrowWidth>
      <TitleBar title="App name" primaryAction={null} />
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Stack
              wrap={false}
              spacing="extraTight"
              distribution="trailing"
              alignment="center"
            >
              <Stack.Item fill>
                <TextContainer spacing="loose">
                  <Heading>Nice work on building a Shopify app 🎉</Heading>
                  <p>
                    Your app is ready to explore! It contains everything you
                    need to get started including the{" "}
                    <Link url="https://polaris.shopify.com/" external>
                      Polaris design system
                    </Link>
                    ,{" "}
                    <Link url="https://shopify.dev/api/admin-graphql" external>
                      Shopify Admin API
                    </Link>
                    , and{" "}
                    <Link
                      url="https://shopify.dev/apps/tools/app-bridge"
                      external
                    >
                      App Bridge
                    </Link>{" "}
                    UI library and components.
                  </p>
                  <p>
                    Ready to go? Start populating your app with some sample
                    products to view and test in your store.{" "}
                  </p>
                  <p>
                    Learn more about building out your app in{" "}
                    <Link
                      url="https://shopify.dev/apps/getting-started/add-functionality"
                      external
                    >
                      this Shopify tutorial
                    </Link>{" "}
                    📚{" "}
                  </p>
                </TextContainer>
              </Stack.Item>
              <Stack.Item>
                <div style={{ padding: "0 20px" }}>
                  <Image
                    source={trophyImage}
                    alt="Nice work on building a Shopify app"
                    width={120}
                  />
                </div>
              </Stack.Item>
            </Stack>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <ProductsCard />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
