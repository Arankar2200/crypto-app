<template>
  <div>
    <spinner v-if="QUOTES.length === 0" />
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
              i) in QUOTES"
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
import { createNamespacedHelpers } from "vuex";
const { mapActions, mapGetters } = createNamespacedHelpers("trade");
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
  computed: mapGetters(["QUOTES"]),
  methods: {
    ...mapActions(["GET_QUOTES", "SOCKET_QUOTES", "CLOSE_QUOTES_SOCKET"]),
  },
  created() {
    this.GET_QUOTES(this.symbol);
  },
  mounted() {
    this.SOCKET_QUOTES(this.symbol);
  },
  beforeDestroy() {
    this.CLOSE_QUOTES_SOCKET(this.symbol);
  },
};
</script>
