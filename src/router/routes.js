import IndexLayout from "layouts/MainLayout";
import IndexPage from "pages/IndexPage";
import ErrorPage from "pages/ErrorNotFound.vue";
import DashboardPage from "pages/DashboardPage";
import ClientePage from "pages/ClientePage";

const routes = [
  {
    path: "/",
    component: IndexLayout,
    children: [
      { path: "", component: IndexPage },
      { path: "dashboard", component: DashboardPage },
      { path: "cliente", component: ClientePage },
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
