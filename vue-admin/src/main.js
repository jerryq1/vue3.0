// import 'element-ui/lib/theme-chalk/index.css'
// import Vue from "vue";
import router from "./router";
import App from "./App.vue"
// import {
//   Input,
//   Button,
//   Form,
//   FormItem,
//   Row,
//   Col,
// } from 'element-ui';
// import ElementUI from 'element-ui'


console.log(Vue.config);

import axios from 'axios'
import 'babel-polyfill'
import Es6Promise from 'es6-promise'
import imgs from './views/imgs'

require('es6-promise').polyfill()

Es6Promise.polyfill()

Vue.prototype.$axios = axios
// Vue.use(Input)
//   .use(Button)
//   .use(Form)
//   .use(FormItem)
//   .use(Row)
//   .use(Col)
// Vue.use(ElementUI)
console.log(imgs);

console.log(Promise);
const imgPreloader = url => {
  return new Promise((resolve, reject) => {
    let image = new Image();
    image.src = url;
    image.onload = () => {
      resolve();
    };
    image.onerror = () => {
      // reject();
    };
  });
};
const imgsPreloader = imgs => {
  let promiseArr = [];
  imgs.forEach(element => {
    promiseArr.push(imgPreloader(element));
  });
  console.log('图片预加载完毕');
  return promiseArr;
};


(async () => {
  await imgsPreloader(imgs.imgs);
  //关闭加载弹框
  new Vue({
    router,
    // store,
    render: h => h(App)
  }).$mount("#app");
})();


