import Vue from 'vue'
import App from './App.vue'
import store from './store'
import makeRequest from './plugins/rest'
import 'bootstrap/dist/css/bootstrap.min.css'

//STYLES
import "./assets/less/style.less"

Vue.use(makeRequest)
Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
