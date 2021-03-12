import Vue from "vue";
import Vuex from "vuex";
import orders from "./modules/orders";
import trade from "./modules/trade";
Vue.use(Vuex);

const store = new Vuex.Store({
  strict: true,
  modules: {
    orders,
    trade,
  },
});
export default store;
