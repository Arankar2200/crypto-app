<template>
  <div>
    <spinner v-if="INSTRUMENTS.length === 0" />
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
              v-for="{ symbol, lastPrice } in INSTRUMENTS"
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
import { createNamespacedHelpers } from "vuex";
const { mapActions, mapGetters } = createNamespacedHelpers("trade");
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
    ...mapActions(["SOCKET_INSTRUMENTS", "GET_INSTRUMENTS"]),
    getSymbol(e) {
      this.$emit("get-symbol", e);
      this.$set(this, "activeRow", e);
    },
  },
  computed: mapGetters(["INSTRUMENTS"]),
  async created() {
    await this.GET_INSTRUMENTS();
    this.getSymbol(this.INSTRUMENTS[0].symbol);
  },
  beforeMount() {
    this.SOCKET_INSTRUMENTS();
  },
};
</script>
