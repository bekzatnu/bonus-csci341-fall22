import { createApp } from "vue";
import { createWebHistory, createRouter } from "vue-router";

// styles

import "@/../dist/output.css";

// mouting point for the whole app

import App from "@/App.vue";

// layouts

import Index from "@/layouts/AdminLayout.vue";

import DataTable       from "@/components/DataTable.vue";

// routes
const routes = [
  {
    path: "/",
    component: Index,
    children: [
      {
        path: "/data",
        component: DataTable,
      },
    ],
  },
  { path: "/:pathMatch(.*)*", redirect: "/" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

createApp(App).use(router).mount("#app");
