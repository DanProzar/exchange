<template>
  <div class="trading-pairs">
    <table class="table table-bordered table-hover ">
      <thead>
        <th>#</th>
        <th>Name</th>
        <th>Price</th>
      </thead>
      <tbody id="tbody" ref="tbody">
        <tr @click="getBucket(i, $event)" v-for="(pair, i) in instruments" :key="i" :class="i == 0 ? 'active' : ''">
          <td><b>{{i + 1}}</b></td>
          <td>{{pair.symbol}}</td>
          <td>{{pair.lastPrice}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    name: 'TradingPrice',
    computed: mapState(['instruments', 'connection']),
    watch: {
    },
    methods: {
      async getBucket(i, event) {
        this.$refs.tbody.children.forEach(item => {
          item.classList.remove('active')
        })
        event.target.parentNode.classList.add('active')

        let bucket = await this.$makeRequest('GET', `trade/bucketed`, {
          binSize: '1m',
          partial: false,
          count: 100,
          reverse: true,
          symbol: this.instruments[i].symbol
        })

        this.$store.commit('setPairName', this.instruments[i].symbol)
        this.$store.commit('setData', ['bucket', bucket])
      },
    },
  }
</script>

<style lang="less" scoped>
  table tbody tr {
    cursor: pointer;
    &.active {
      background: rgba(83, 83, 83, 0.226);
    }
  }
</style>