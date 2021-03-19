<template>
  <div class="history-wrapper">
    <table class="table table-hover table-bordered">
      <thead>
        <th># </th>
        <th>OrderID</th>
        <th>Symbol</th>
        <th>OrderQty</th>
        <th>Timestamp</th>
        <th>Side</th>
        <th>Price</th>
        <th>OrdStatus</th>
      </thead>
      <tbody>
        <tr v-for="(item, i) in history" :key="i">
          <td><b>{{i + 1}}</b></td>
          <td>{{item.orderID}}</td>
          <td>{{item.symbol}}</td>
          <td>{{item.orderQty}}</td>
          <td>{{new Date(item.timestamp).toLocaleString()}}</td>
          <td>{{item.side}}</td>
          <td>{{item.price}}</td>
          <td>{{item.ordStatus}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  name: "History",
  computed: mapState(['history']),
}
</script>
