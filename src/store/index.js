import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    instruments: [],
    bucket: [],
    history: [],
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
    pushBucket(state, bucket) {
      state.bucket.unshift(bucket)
    },
    INSTRUMENTS_ONMESSAGE(state, data) {
      if (data) {
        data.forEach((el) => {
          if (!el.lastPrice) return;
          const i = state.instruments
            .map((item) => item.symbol)
            .indexOf(el.symbol);
          if (i === -1) {
            state.instruments.push(el);
          } else {
            state.instruments[i].lastPrice = el.lastPrice;
          }
        });
      }
    },
  },
})
