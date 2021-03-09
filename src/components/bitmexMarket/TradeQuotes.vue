<template>
  <div>
    <spinner v-if="quotes.length === 0" />
    <v-card v-else>
      <v-simple-table fixed-header height="60vh" dense>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-center">Time</th>
              <th class="text-center">Open</th>
              <th class="text-center">High</th>
              <th class="text-center">Low</th>
              <th class="text-center">Close</th>
              <th class="text-center">Gross Value</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="({ open, high, low, close, volume, symbol, timestamp },
              i) in quotes"
              :key="i"
            >
              <td>
                {{ new Date(timestamp) | dateFormat("DD.MM.YYYY HH:mm:ss") }}
              </td>
              <td>{{ open }}</td>
              <td>{{ high }}</td>
              <td>{{ low }}</td>
              <td>{{ close }}</td>
              <td>{{ volume }}</td>
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
  name: "trade",
  components: {
    spinner: () => import("@/components/shared/LoadingSpinner"),
  },
  props: {
    symbol: {
      type: String,
      default: null,
    },
  },
  data: () => ({
    quotes: [],
    tradingSocket: new WebSocket(config.socketUrl),
  }),
  methods: {
    isWsOpen(ws) {
      return ws.readyState === ws.OPEN;
    },
  },
  async created() {
    try {
      const URL = `/trade/bucketed?binSize=1m&partial=false&count=100&reverse=true&symbol=${this.symbol}`;
      const res = await this.$http.get(URL);
      this.quotes = await res.data;
    } catch (e) {
      this.$notify({
        group: "app",
        type: "error",
        title: "WARN",
        text: e.response.data.error.message,
      });
    }
  },
  mounted() {
    this.tradingSocket.onopen = () => {
      this.tradingSocket.send(
        `{"op": "subscribe", "args": "tradeBin1m:${this.symbol}"}`
      );
    };

    this.tradingSocket.onmessage = (response) => {
      const newQuotes = JSON.parse(response.data);
      if (newQuotes.data && newQuotes.action === "insert") {
        const updatedQuotes = [...newQuotes.data, ...this.quotes];
        this.quotes = updatedQuotes.splice(0, 99);
      }
    };
  },
  beforeDestroy() {
    if (!this.isWsOpen(this.tradingSocket)) return;

    this.tradingSocket.send(
      `{"op": "unsubscribe", "args": "tradeBin1m:${this.symbol}"}`
    );
  },
};
</script>
