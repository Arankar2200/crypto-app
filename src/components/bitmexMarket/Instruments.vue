<template>
  <div>
    <spinner v-if="instruments.length === 0" />
    <v-card v-else>
      <v-simple-table fixed-header height="60vh" dense>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-center">Symbol</th>
              <th class="text-center">Last Price</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="{ symbol, lastPrice } in instruments"
              :key="symbol"
              @click="getSymbol(symbol)"
              :class="{ active: symbol === activeRow }"
            >
              <td>{{ symbol }}</td>
              <td>{{ lastPrice }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
  </div>
</template>

<script>
const WebSocket = require("isomorphic-ws");
import config from "@/config";

export default {
  name: "Instruments",
  components: {
    spinner: () => import("@/components/shared/LoadingSpinner"),
  },
  data: () => ({
    instruments: [],
    activeRow: "",
  }),
  methods: {
    getSymbol(e) {
      this.$emit("get-symbol", e);
      this.$set(this, "activeRow", e);
    },
    getIndex(e) {
      return this.instruments.map((item) => item.symbol).indexOf(e);
    },
  },
  async created() {
    try {
      const res = await this.$http.get("/instrument/active");
      await this.$set(this, "instruments", res.data);
      this.$nextTick(() => {
        this.getSymbol(this.instruments[0].symbol);
      });
    } catch (error) {
      await this.$notify({
        group: "app",
        type: "error",
        title: "WARN",
        text: error.response.data.error.message,
      });
    }
  },

  beforeMount() {
    //get realtime data;
    const appSocketIO = new WebSocket(config.socketUrl);
    appSocketIO.onopen = () => {
      appSocketIO.send(`{"op": "subscribe", "args": "instrument"}`);
    };
    appSocketIO.onmessage = (response) => {
      const res = JSON.parse(response.data);
      if (res.data) {
        res.data.forEach((el) => {
          if (!el.lastPrice) return;
          const i = this.getIndex(el.symbol);
          if (i === -1) {
            this.instruments.push(el);
          } else {
            this.instruments[i].lastPrice = el.lastPrice;
          }
        });
      }
    };
  },
};
</script>
