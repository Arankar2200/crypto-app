<template>
  <div>
    <spinner v-if="orders.length === 0" />
    <v-card v-else>
      <v-simple-table fixed-header height="35vh" dense>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-center">Order ID</th>
              <th class="text-center">Symbol</th>
              <th class="text-center">Quantity</th>
              <th class="text-center">Timestamp</th>
              <th class="text-center">Side type</th>
              <th class="text-center">Price</th>
              <th class="text-center">Order Status</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="{
                orderID,
                symbol,
                orderQty,
                timestamp,
                side,
                price,
                ordStatus,
              } in orders"
              :key="orderID"
            >
              <td>{{ orderID }}</td>
              <td>{{ symbol }}</td>
              <td>{{ orderQty }}</td>
              <td>
                {{ new Date(timestamp) | dateFormat("DD.MM.YYYY HH:mm:ss") }}
              </td>
              <td>{{ side }}</td>
              <td>{{ price }}</td>
              <td>{{ ordStatus }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
  </div>
</template>

<script>
import { authRequest } from "@/services";

export default {
  name: "orderHistory",
  components: {
    spinner: () => import("@/components/shared/LoadingSpinner"),
  },
  data: () => ({
    orders: [],
  }),

  async created() {
    try {
      const res = await authRequest("GET", "/order");
      await this.$set(this, "orders", res.data);
    } catch (e) {
      await this.$notify({
        group: "app",
        type: "error",
        title: "WARN",
        text: e.response.data.error.message,
      });
    }
  },
};
</script>
