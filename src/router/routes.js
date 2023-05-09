import IndexLayout from "layouts/MainLayout";
import IndexPage from "pages/IndexPage";
import ErrorPage from "pages/ErrorNotFound.vue";
import DashboardPage from "pages/DashboardPage";
import DashboardPageLocal from "pages/DashboardLocal";

const routes = [
  {
    path: "/",
    component: IndexLayout,
    children: [
      { path: "", component: IndexPage },
      { path: "dashboard", component: DashboardPage },
      { path: "dashboardLocal", component: DashboardPageLocal },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: ErrorPage,
  },
];

export default routes;
