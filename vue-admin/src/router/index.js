import Vue from "vue";
import VueRouter from "vue-router";
// import Login from /*webpackPreload:true*/"../views/login/index";
// import Product from "../views/product/index";
const Login = () => import(/*webpackChunkName:'adminChunk'*/'../views/login/index')
const Product = () => import(/*webpackChunkName:'adminChunk'*/'../views/login/index')

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/login"
  },
  {
    path: "/login",
    component: Login
  },
  {
    path: "/product",
    component: Product
  }
];

const router = new VueRouter({
  routes
});

export default router;
