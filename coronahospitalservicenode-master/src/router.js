import {createRouter, createWebHashHistory} from 'vue-router';

const routes = [
    {
        path: "/",
        name: "login",
        component: () => import("./components/login")
    },
    {
        path: "/index",
        name: "index",
        component: () => import("./components/index")
    },
    {
        path: "/impress",
        name: "impress",
        component: () => import("./components/impress")
    },
    {
        path: "/patienten-erfassung",
        name: "patienten-erfassung",
        component: () => import("./components/patienten-erfassung")
    },
    {
        path: "/betten-zuweisung",
        name: "betten-zuweisung",
        component: () => import("./components/betten-zuweisung")
    },
    {
        path: "/leave-hospitalization",
        name: "leave-hospitalization",
        component: () => import("./components/leave-hospitalization")
    },
    {
        path: "/auslastung",
        name: "auslastung",
        component: () => import("./components/auslastung")
    },
    {
        path: "/patienten-archiv",
        name: "patienten-archiv",
        component: () => import("./components/patienten-archiv")
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;