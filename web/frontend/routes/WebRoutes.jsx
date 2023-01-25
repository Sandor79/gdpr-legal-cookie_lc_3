
export const appName = "GDPR Legal Cookie"

export const getPageInfo = function ( id ) {
    return WebRoutes.find( elem => elem.id === id )
}
/**
 * Angaben der Routen gemäß der Ordner Struktur von App/web/frontend/pages/ wobei der Ordner Pages als
 * root Ordner gesehen werden kann.
 */
const WebRoutes = [
    {
        id: "dashboard",
        title: "Dashboard",
        breadcrumbs: [{ content : "", url : "/"}],
        label: "Dashboard",
        destination: "/",
    },
    {
        id: "pagename",
        title: "",
        breadcrumbs: [{ content : "Dashboard", url : "/"}],
        label: "Pagename",
        destination: "/pagename",
    },
    {
        id: "designer",
        title: "Banner editor",
        breadcrumbs: [{ content : "Dashboard", url : "/"}],
        label: "Banner-Editor",
        destination: "/designer",
    },
    {
        id: "settings",
        title: "Settings",
        breadcrumbs: [{ content : "Dashboard", url : "/"}],
        label: "Settings",
        destination: "/settings"
    },
    {
        id: "cookie-policy",
        title: "Cookie policy",
        breadcrumbs: [{ content : "Dashboard", url : "/"}],
        label: "Cookie-Policy",
        destination: "/cookie-policy",
    },
]

export default WebRoutes;
