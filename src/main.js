/* eslint-disable */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/styles/normalized.css'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/styles/global.css'
import axios from 'axios'
import ZkTable from 'vue-table-with-tree-grid'

Vue.config.productionTip = false

axios.interceptors.request.use(config => {
	config.headers.Authorization = window.sessionStorage.token
	return config
})
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios

Vue.component('tree-table', ZkTable)

new Vue({
	router,
  render: h => h(App)
}).$mount('#app')
