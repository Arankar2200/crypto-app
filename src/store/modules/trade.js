import Vue from "vue";
const WebSocket = require("isomorphic-ws");
import config from "@/config";
const appSocketIO = new WebSocket(config.socketUrl);
const tradingSocket = new WebSocket(config.socketUrl);
export default {
  namespaced: true,
  state: {
    instruments: [],
    quotes: [],
  },
  actions: {
    GET_INSTRUMENTS: async ({ commit }) => {
      try {
        const { data } = await Vue.prototype.$http.get("/instrument/active");
        commit("SET_INSTRUMENTS", data);
      } catch (e) {
        Vue.prototype.$notify({
          group: "app",
          type: "error",
          title: "WARN",
          text: e.response.data.error.message,
        });
      }
    },
    GET_QUOTES: async ({ commit }, symbol) => {
      try {
        const { data } = await Vue.prototype.$http.get(
          `/trade/bucketed?binSize=1m&partial=false&count=100&reverse=true&symbol=${symbol}`
        );
        commit("SET_QUOTES", data);
      } catch (e) {
        Vue.prototype.$notify({
          group: "app",
          type: "error",
          title: "WARN",
          text: e.response.data.error.message,
        });
      }
    },
    SOCKET_INSTRUMENTS: ({ commit }) => {
      appSocketIO.onopen = () => {
        appSocketIO.send(`{"op": "subscribe", "args": "instrument"}`);
      };
      appSocketIO.onmessage = (response) => {
        const res = JSON.parse(response.data);
        commit("INSTRUMENTS_ONMESSAGE", res.data);
      };
    },
    SOCKET_QUOTES: ({ commit }, symbol) => {
      tradingSocket.onopen = () => {
        tradingSocket.send(
          `{"op": "subscribe", "args": "tradeBin1m:${symbol}"}`
        );
      };
      tradingSocket.onmessage = (response) => {
        const newQuotes = JSON.parse(response.data);
        commit("QUOTES_ONMESSAGE", newQuotes);
      };
    },
    CLOSE_QUOTES_SOCKET: (ctx, symbol) => {
      if (tradingSocket.readyState !== tradingSocket.OPEN) return;
      tradingSocket.send(
        `{"op": "unsubscribe", "args": "tradeBin1m:${symbol}"}`
      );
    },
  },
  mutations: {
    SET_INSTRUMENTS(state, instruments) {
      state.instruments = instruments;
    },
    SET_QUOTES(state, quotes) {
      state.quotes = quotes;
    },
    QUOTES_ONMESSAGE(state, event) {
      if (event.data && event.action === "insert") {
        const updatedQuotes = [...event.data, ...state.quotes];
        state.quotes = updatedQuotes.splice(0, 99);
      }
    },
    INSTRUMENTS_ONMESSAGE(state, event) {
      if (event) {
        event.forEach((el) => {
          if (!el.lastPrice) return;
          const i = state.instruments
            .map((item) => item.symbol)
            .indexOf(el.symbol);
          if (i === -1) {
            state.instruments.push(el);
          } else {
            state.instruments[i].lastPrice = el.lastPrice;
          }
        });
      }
    },
  },
  getters: {
    INSTRUMENTS: (state) => state.instruments,
    QUOTES: (state) => state.quotes,
  },
};
