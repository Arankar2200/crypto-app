import { authRequest } from "@/services";
import Vue from "vue";
export default {
  namespaced: true,
  state: {
    orders: [],
    orderSides: ["Buy", "Sell"],
  },
  actions: {
    CREATE_ORDER: async (ctx, form) => {
      try {
        await authRequest("POST", "/order", form);
        Vue.prototype.$notify({
          group: "app",
          type: "success",
          title: "SUCCESS",
          text: "Jobs done",
        });
      } catch (e) {
        Vue.prototype.$notify({
          group: "app",
          type: "error",
          title: "WARN",
          text: e.response.data.error.message,
        });
      }
    },
    GET_ORDERS: async ({ commit }) => {
      try {
        const { data } = await authRequest("GET", "/order");
        commit("SET_ORDERS", data);
      } catch (e) {
        Vue.prototype.$notify({
          group: "app",
          type: "error",
          title: "WARN",
          text: e.response.data.error.message,
        });
      }
    },
  },

  mutations: {
    SET_ORDERS: (state, orders) => {
      state.orders = orders;
    },
  },
  getters: {
    ORDERS: (state) => state.orders,
    ORDER_SIDES: (state) => state.orderSides,
  },
};
