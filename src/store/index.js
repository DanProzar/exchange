import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    instrumentData: [],
    bucketedData: [],
    historyData: [],
    connection: new WebSocket(process.env.VUE_APP_WS_URL),
    pairName: '',
  },
  mutations:{
    setData(state, [field, data]) {
      state[field] = data
    },
    setPairName(state, name) {
      state.pairName = name
    },
    pushBucket(state, data) {
      state.bucketedData.unshift(data)
    },
    update(state, {index, price}) {
      Vue.set(state.instrumentData, index, {
        ...state.instrumentData[index],
        lastPrice: price
      })
    }
  },
  actions: {
  },
  modules: {
  },
  getters: {
    // pairName: state => state.instrumentData[0]
  }
})
