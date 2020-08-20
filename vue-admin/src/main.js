import 'element-ui/lib/theme-chalk/index.css'
import Vue from "vue";
import router from "./router";
import App from "./App.vue"
import store from "./store";

import ElementUI from 'element-ui';

Vue.use(ElementUI,{size: 'small'});


Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
