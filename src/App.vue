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
        <div class="col-12">
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
  computed: mapState(['connection', 'msg', 'instruments', 'pairName']),
  destroyed() {
    this.connection.close()
  },
  async created() {
    let instruments = await this.$makeRequest('GET', 'instrument/active');
    instruments = instruments.map(item => {
      const {symbol, lastPrice} = item
      return {symbol, lastPrice}
    })

    let bucket = await this.$makeRequest('GET', `trade/bucketed`, {
      binSize: '1m',
      partial: false,
      count: 100,
      reverse: true,
      symbol: instruments[0].symbol
    })

    let history = await this.$makeRequest('GET', `order`, {
      reverse: true
    }) 
    
    this.$store.commit('setData', ['pairName', instruments[0].symbol])
    this.$store.commit('setData', ['instruments', instruments])
    this.$store.commit('setData', ['bucket', bucket])
    this.$store.commit('setData', ['history', history])

    this.connection.onopen = () => console.log('Connesscsstion opened')
    this.connection.onclose = reason => console.log('Connesscsstion closed')

    this.connection.onmessage = event => {
      const {table, action, data} = JSON.parse(event.data)
      switch(table) {
        case 'tradeBin1m': {
          if (action == 'insert') {
            data.map(bucket => {
              this.$store.commit('pushBucket', bucket)
            })
          }
        } break;
        case 'instrument': {
          if (data && action == 'update') {
            this.$store.commit('INSTRUMENTS_ONMESSAGE', data)
          }
        } break
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
    margin-top: 70px;
    .col-12 {
      max-height: 33vh;
    }
  }
  table {
    th, td { 
      text-align: center;
      vertical-align: middle !important;
    }
  }
</style>
