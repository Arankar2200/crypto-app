<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="3" sm="6">
        <instruments @get-symbol="setSymbol" />
      </v-col>
      <v-col cols="12" md="6" sm="6">
        <trade-quotes :symbol="symbol" v-if="symbol" :key="symbol" />
      </v-col>
      <v-col cols="12" md="3" sm="6">
        <create-order :symbol="symbol" />
      </v-col>
      <v-col cols="12" md="12" sm="6">
        <order-history />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// @ is an alias to /src

export default {
  name: "BitmexMarket",
  data: () => ({
    symbol: null,
  }),
  components: {
    "create-order": () => import("@/components/bitmexMarket/CreateOrder"),
    instruments: () => import("@/components/bitmexMarket/Instruments"),
    "trade-quotes": () => import("@/components/bitmexMarket/TradeQuotes"),
    "order-history": () => import("@/components/bitmexMarket/OrderHistory"),
  },
  methods: {
    setSymbol(e) {
      this.$set(this, "symbol", e);
    },
  },
};
</script>
