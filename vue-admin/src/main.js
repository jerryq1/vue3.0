import 'element-ui/lib/theme-chalk/index.css'
import Vue from "vue";
import router from "./router";
import App from "./App.vue"
// import store from "./store";
import ElementUI from 'element-ui';
import axios from 'axios'
import 'babel-polyfill'
import Es6Promise from 'es6-promise'
require('es6-promise').polyfill()
import (/*webpackPreload:true*/"./styles/main.scss")

Es6Promise.polyfill()

Vue.prototype.$axios = axios
Vue.use(ElementUI,{size: 'small'});


Vue.config.productionTip = false;

new Vue({
  router,
  // store,
  render: h => h(App)
}).$mount("#app");
