<template>
  <div class="list-pairs">
    <table class="table table-bordered ">
      <thead>
        <th>#</th>
        <th>Timestamp</th>
        <th>Open</th>
        <th>High</th>
        <th>Low</th>
        <th>Close</th>
        <th>Gross</th>
      </thead>
      <tbody>
        <tr v-for="(el, i) in bucket" :key="i">
          <td><b>{{i + 1}}</b></td>
          <td>{{time(el.timestamp)}}</td>
          <td>{{el.open}}</td>
          <td>{{el.high}}</td>
          <td>{{el.low}}</td>
          <td>{{el.close}}</td>
          <td>{{el.trades}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  name: "ListPairs",
  computed: {
    ...mapState(['bucket', 'instruments', 'connection', 'pairName']),
  },
  methods: {
    time(date) {
      date = new Date(date)
      return date.toLocaleTimeString()
    }
  },
}
</script>

<style scoped>
  table {
    table-layout: fixed;
  }
</style>