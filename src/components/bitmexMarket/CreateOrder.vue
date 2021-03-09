<template>
  <v-card>
    <v-card-title class="success--text ">Create Order</v-card-title>
    <v-form @submit.prevent="createOrder">
      <v-col>
        <v-select :items="requestTypes" v-model="form.side" required />
        <v-text-field :value="symbol" label="Symbol" readonly />
        <v-text-field
          type="number"
          v-model="form.orderQty"
          label="Quantity"
          min="1"
          required
        />
      </v-col>
      <v-btn block :color="btnColor" type="submit" :loading="btnLoading">
        {{ form.side === "Buy" ? "Buy" : "Sell" }}
      </v-btn>
    </v-form>
  </v-card>
</template>
<script>
import { authRequest } from "@/services";
export default {
  props: {
    symbol: {
      type: String,
      default: null,
    },
  },
  data: () => ({
    requestTypes: ["Buy", "Sell"],
    btnLoading: false,
    form: {
      ordType: "Market",
      symbol: null,
      orderQty: 1,
      side: "Buy",
    },
  }),
  computed: {
    btnColor() {
      return this.form.side === "Buy" ? "success" : "red";
    },
  },
  created() {
    this.$set(this.form, "symbol", this.symbol);
  },
  watch: {
    symbol() {
      this.$set(this.form, "symbol", this.symbol);
    },
  },
  methods: {
    async createOrder() {
      this.btnLoading = true;
      try {
        await authRequest("POST", "/order", this.form);
        await this.$notify({
          group: "app",
          type: "success",
          title: "SUCCESS",
          text: "Jobs done",
        });
        this.btnLoading = false;
      } catch (e) {
        await this.$notify({
          group: "app",
          type: "error",
          title: "WARN",
          text: e.response.data.error.message,
        });
        this.btnLoading = false;
      }
    },
  },
};
</script>
