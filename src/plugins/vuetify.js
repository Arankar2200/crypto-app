import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";

Vue.use(Vuetify);

const opts = {
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      dark: {
        background: "#303030",
      },
    },
    dark: true,
  },
};

export default new Vuetify(opts);
