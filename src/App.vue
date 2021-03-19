<template>
  <div id="app">
    <div class="container-fluid">
      <div class="row main-content">
        <div class="col-lg-3 h-100">
          <h4>Список котировок</h4>
          <TradingPairs class="column" />
        </div>
        <div class="col-lg-6 h-100">
          <h4>Истории котировок для <b>{{pairName}}</b></h4>
          <ListPairs class="column"/>
        </div>
         <div class="col-lg-3 h-100"> <!--justify-content-center align-items-center d-flex -->
          <h4>Создания ордера</h4>
          <OrderForm />
        </div>
        
      </div>
      <div class="row history">
        <div class="col-12 h-100">
          <h4>История ордеров</h4>
          <History class="column"/>
        </div>
      </div>
    </div>
    <!-- <button @click='sendData(`{"op": "subscribe", "args": "instrument"}`)'>Get Instrument Data</button> -->
  </div>
</template>

<script>
import TradingPairs from './components/TradingPairs'
import ListPairs from './components/ListPairs'
import OrderForm from './components/OrderForm'
import History from './components/History'
import {mapState} from 'vuex'

export default {
  name: 'App',
  components: {
    TradingPairs,
    ListPairs,
    OrderForm,
    History
  },
  computed: mapState(['connection', 'msg', 'instrumentData', 'pairName']),
  destroyed() {
    this.connection.close()
  },
  async created() {
    let instrumentData = await this.$makeRequest('GET', 'instrument/active');
    instrumentData = instrumentData.map(item => {
      const {symbol, lastPrice} = item
      return {symbol, lastPrice}
    })

    let bucketedData = await this.$makeRequest('GET', `trade/bucketed`, {
      binSize: '1m',
      partial: false,
      count: 100,
      reverse: true,
      symbol: instrumentData[0].symbol
    })

    let historyData = await this.$makeRequest('GET', `order`, {
      reverse: true
    }) 
    
    this.$store.commit('setData', ['pairName', instrumentData[0].symbol])
    this.$store.commit('setData', ['instrumentData', instrumentData])
    this.$store.commit('setData', ['bucketedData', bucketedData])
    this.$store.commit('setData', ['historyData', historyData])

    this.connection.onopen = () => console.log('Connection opened')
    this.connection.onclose = reason => console.log(`Connection closed: ${reason.message}`)

    this.connection.onmessage = event => {
      const {table, action, data} = JSON.parse(event.data)
      if (table == 'tradeBin1m') {
        if (action == 'insert')
        data.map(bucket => {
          this.$store.commit('pushBucket', bucket)
        })
      } else if (table == 'instrument') {
        if (data && action == 'update') {
          data.map(item => {
            if (item.symbol[0] !== '.') {
              const {lastPrice, symbol} = item
              const index = this.instrumentData.findIndex(el => el.symbol == symbol.slice(1, symbol.length - 1))
              if (lastPrice && index !== -1) {
                this.$store.commit('update', {price: lastPrice, index}) 
              }
            }
            // item.symbol == this.msg.symbol && this.msg.lastPrice ? data[i].lastPrice = this.msg.lastPrice : null
          })
        }
      }
    }

    this.connection.send(`{"op": "subscribe", "args": "instrument"}`)
  }
}
</script>

<style lang="less">
  .main-content {
    max-height: 60vh;
    height: 55vh;
  }
  .column {
    overflow-y: scroll;
    max-height: 100%;
  }
  .history {
    max-height: 35vh;
    margin-top: 70px;
    overflow-y: scroll;
  }
  table {
    th, td { 
      text-align: center;
      vertical-align: middle !important;
    }
  }
</style>
