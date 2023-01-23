import { Layout, EmptyState, Spinner } from '@shopify/polaris';

export default function SkeletonDesigner() {

    return (
        <Layout>
            <EmptyState image="">
                <div
                    style={{
                        position: "fixed",
                        top: "45%",
                        left: "50%",
                        transform: "translate(-50%, -45%)"
                    }}
                >
                    <Spinner
                        accessibilityLabel="Loading..."
                        size="large"
                        color="teal"
                    />
                </div>
            </EmptyState>
        </Layout>
    )
}
