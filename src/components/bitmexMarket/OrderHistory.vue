<template>
  <div>
    <spinner v-if="ORDERS.length === 0" />
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
              } in ORDERS"
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
import { createNamespacedHelpers } from "vuex";
const { mapActions, mapGetters } = createNamespacedHelpers("orders");
export default {
  name: "orderHistory",
  components: {
    spinner: () => import("@/components/shared/LoadingSpinner"),
  },
  methods: mapActions(["GET_ORDERS"]),
  computed: mapGetters(["ORDERS"]),
  created() {
    this.GET_ORDERS();
  },
};
</script>
