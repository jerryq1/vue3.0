<template>
  <div class="product">
    我是生产页111
    <Test :bbc.sync="aaaa"></Test>
  </div>
</template>

<script>
  import Test from 'components/test1.vue'
  export default {
    name:'product',
    components: {
      // 子组件引入
      Test
    },
    props: {
      // 供父组件使用属性
    },
    data() {
      // 页面全局属性
      return {
        aaaa:1111111
      }
    },
    created() {
      // 页面已生产
    },
    updated() {
      // 页面已更新
    },
    mounted() {
      // 页面已渲染完成
      console.log(this.$children,'我是父组件');
    },
    destroyed() {
      // 页面已退出
    },
    methods: {
      // 自定义函数
    }
  }
</script>

<style lang="scss" scoped>
.product{
  background-color: red;
}
</style>
