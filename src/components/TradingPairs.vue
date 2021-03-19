<template>
  <div class="trading-pairs">
    <table class="table table-bordered table-hover ">
      <thead>
        <th>#</th>
        <th>Name</th>
        <th>Price</th>
      </thead>
      <tbody id="tbody" ref="tbody">
        <tr @click="getBucket(i, $event)" v-for="(pair, i) in instrumentData" :key="i" :class="i == 0 ? 'active' : ''">
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
    computed: mapState(['instrumentData', 'connection']),
    methods: {
      async getBucket(i, event) {
        this.$refs.tbody.children.forEach(item => {
          item.classList.remove('active')
        })
        event.target.parentNode.classList.add('active')

        let bucketedData = await this.$makeRequest('GET', `trade/bucketed`, {
          binSize: '1m',
          partial: false,
          count: 100,
          reverse: true,
          symbol: this.instrumentData[i].symbol
        })

        this.$store.commit('setPairName', this.instrumentData[i].symbol)
        this.$store.commit('setData', ['bucketedData', bucketedData])
      },
    },
  }
</script>

<style lang="less" scoped>
  @keyframes changed {
    0% {
      background-color: rgba(48, 238, 0, 0.5);
    }

    100% {
      background-color: rgba(48, 238, 0, 0);
    }
  }

  table tbody tr {
    cursor: pointer;
    &.active {
      background: rgba(83, 83, 83, 0.226);
    }

    td.changed {
      animation-name: changed;
      animation-duration: 1000ms;
      animation-iteration-count: 1;
      animation-timing-function: linear;
    }
  }
</style>