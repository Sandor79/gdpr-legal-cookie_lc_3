import { Card, Tabs } from "@shopify/polaris";
import {useCallback, useState} from "react";
import CookieDefinitions from "./CookieDefinitions/CookieDefinitiions";
import Cookies from "./Cookies/Cookies";

export default function SettingsTemplate() {

    const [selected, setSelected] = useState(0);

    const handleTabChange = useCallback( selectedTabIndex => {
        setSelected( selectedTabIndex )
    }, [] );

    const tabs = [
        {
            id: "main-settings",
            content: "Main settings",
            panelId: "main-settings"
        },
        {
            id: "cookie-definitions",
            content: "Cookie Definitions",
            panelId: "cookie-definitions"
        },
        {
            id: "cookies",
            content: "Cookies",
            panelId: "cookies"
        }
    ];

    return (
        <Card>
            <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange} >
                <Card.Section title={tabs[selected].title}>
                    {selected === 1 ? <CookieDefinitions/> : null}
                    {selected === 2 ? <Cookies/> : null}
                </Card.Section>
            </Tabs>
        </Card>
    );
}
