import Vue from "vue";
import VueRouter from "vue-router";
import BitmexMarket from "../views/BitmexMarket.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "BitmexMarket",
    component: BitmexMarket,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
