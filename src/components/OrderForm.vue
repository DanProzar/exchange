<template>
  <div class="order-form">
    <form class="mt-5">
      <div class="row">
        <div class="col-12">
          <label for="amount">Количество</label>
          <input type="number" name="amount" id="amount" v-model="data.orderQty" min="1" max="50000" class="form-control">
        </div>
        <div class="col-md-6 mt-3">
          <button @click.prevent="order(pairName, 'Sell')" id="sell" class="btn btn-danger w-100">Продать</button>
        </div>
        <div class="col-md-6 mt-3">
          <button @click.prevent="order(pairName, 'Buy')" id="buy" class="btn btn-success w-100">Купить</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  name: 'OrderForm',
  data() {
    return {
      data: {
        ordType: "Market",
        symbol: null,
        orderQty: 1,
        side: null,
      }
    }
  },
  computed: mapState(['pairName']),
  methods: {
    async order(name, type) {
      this.data.side = type
      this.data.symbol = name

      await this.$makeRequest('POST', 'order', this.data)
      .then(data => console.log(data))
      .catch(err => {
        alert(err.message)
      })
    },
  },
  watch: { 
    pairName: function(newVal, oldVal) {
      this.data.symbol = newVal
    }
  }
}
</script>