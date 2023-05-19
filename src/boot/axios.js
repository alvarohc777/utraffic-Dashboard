import { boot } from "quasar/wrappers";
import axios from "axios";

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({ baseURL: "http://localhost:3000/" });
const apiCliente = axios.create({ baseURL: "http://192.168.1.18:1337/api/" });

// export default boot(({ app }) => {
//   // for use inside Vue files (Options API) through this.$axios and this.$api

//   app.config.globalProperties.$axios = axios;
//   // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
//   //       so you won't necessarily have to import axios in each vue file

//   app.config.globalProperties.$api = api;
//   // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
//   //       so you can easily perform requests against your app's API
// });

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios;
  // app.config.globalProperties.$api = api;
  app.config.globalProperties.$api = apiCliente;

  const apiInterceptor = (apiGenerico) => {
    apiGenerico.interceptors.request.use(function (config) {
      config.headers["Authorization"] = `Bearer ${
        sessionStorage.getItem("finansofttoken").split("|")[1]
      }`;
      return config;
    });
  };

  // apiInterceptor(api);
  apiInterceptor(apiCliente);
});

export { api, apiCliente };
