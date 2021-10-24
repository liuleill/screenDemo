import Vue from 'vue'
import App from './App.vue'
import './index.css'

import scroll from 'vue-seamless-scroll'
Vue.use(scroll)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
