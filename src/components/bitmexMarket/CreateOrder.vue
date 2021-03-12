<template>
  <v-card>
    <v-card-title class="success--text ">Create Order</v-card-title>
    <v-form @submit.prevent="CREATE_ORDER(form)">
      <v-col>
        <v-select :items="ORDER_SIDES" v-model="form.side" required />
        <v-text-field :value="symbol" label="Symbol" readonly />
        <v-text-field
          type="number"
          v-model="form.orderQty"
          label="Quantity"
          min="1"
          step="1"
          required
        />
      </v-col>
      <v-btn block :color="btnColor" type="submit">
        {{ form.side === "Buy" ? "Buy" : "Sell" }}
      </v-btn>
    </v-form>
  </v-card>
</template>
<script>
import { createNamespacedHelpers } from "vuex";
const { mapActions, mapGetters } = createNamespacedHelpers("orders");
export default {
  props: {
    symbol: {
      type: String,
      default: null,
    },
  },
  data: () => ({
    form: {
      ordType: "Market",
      symbol: null,
      orderQty: 1,
      side: "Buy",
    },
  }),
  computed: {
    ...mapGetters(["ORDER_SIDES"]),
    btnColor() {
      return this.form.side === "Buy" ? "success" : "error";
    },
  },
  methods: mapActions(["CREATE_ORDER"]),
  watch: {
    symbol: {
      handler() {
        this.$set(this.form, "symbol", this.symbol);
      },
      immediate: true,
    },
  },
};
</script>
