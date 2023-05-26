import IndexLayout from "layouts/MainLayout";
import IndexPage from "pages/IndexPage";
import ErrorPage from "pages/ErrorNotFound.vue";
import DashboardPage from "pages/DashboardPage";
import ClientePage from "pages/ClientePage";
import CreditsPage from "pages/CreditsPage";
import AsesorPage from "pages/AsesorPage";
import PruebaPage from "pages/PruebaPage";

const routes = [
  {
    path: "/",
    component: IndexLayout,
    children: [
      { path: "", name: "home", component: IndexPage },
      { path: "dashboard", name: "dashboard", component: DashboardPage },
      { path: "cliente", name: "cliente", component: ClientePage },
      { path: "pruebas", name: "pruebas", component: PruebaPage },
      { path: "credits", name: "credits", component: CreditsPage },
      {
        path: "asesor",
        name: "asesor",
        component: AsesorPage,
        props: true,
        // props: (route) => ({ id: route.query.id }),
      },
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
