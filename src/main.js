import Vue from "vue";
import App from "./App.vue";
import router from "./router";

import config from "./config";
import axios from "axios";
import vuetify from "@/plugins/vuetify";
import VueFilterDateFormat from "vue-filter-date-format";
import Notifications from "vue-notification";
Vue.use(VueFilterDateFormat);
Vue.use(Notifications);

Vue.config.productionTip = false;

Vue.prototype.$http = axios.create({
  baseURL: config.apiUrl,
  headers: { "Access-Control-Allow-Origin": "*" },
});
new Vue({
  router,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
