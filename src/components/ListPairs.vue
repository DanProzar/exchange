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
        <tr v-for="(bucket, i) in bucket" :key="i">
          <td><b>{{i + 1}}</b></td>
          <td>{{time(bucket.timestamp)}}</td>
          <td>{{bucket.open}}</td>
          <td>{{bucket.high}}</td>
          <td>{{bucket.low}}</td>
          <td>{{bucket.close}}</td>
          <td>{{bucket.trades}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  name: "ListPairs",
  data() {
    return {
      dataToInsert: null
    }
  },
  computed: {
    ...mapState(['bucket', 'instruments', 'connection', 'pairName']),
  },
  methods: {
    time(date) {
      date = new Date(date)
      return date.toLocaleTimeString()
    }
  },
  watch: {
    bucket: function (newVal, oldVal) {
      if (newVal.length == 100) {
        if (oldVal.length >= 100) {
          this.connection.send(`{"op": "unsubscribe", "args": "tradeBin1m:${oldVal[0].symbol}"}`)
        }
        this.connection.send(`{"op": "subscribe", "args": "tradeBin1m:${this.pairName}"}`)
      } 
    },
  },
}
</script>

<style scoped>
  table {
    table-layout: fixed;
  }
</style>