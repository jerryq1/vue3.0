<template>
  <div class="product">
    <marquee-Xu></marquee-Xu>
  </div>
</template>

<script>
  import marqueeXu from '@/component/marquee'

  export default {
    components: {
      // 子组件引入
      marqueeXu
    },
    props: {
      // 供父组件使用属性
    },
    data() {
      // 页面全局属性
      return {};
    },
    created() {
      // 页面已生产
    },
    updated() {
      // 页面已更新
    },
    mounted() {
      // 页面已渲染完成
    },
    destroyed() {
      // 页面已退出
    },
    methods: {
      // 自定义函数
    }
  };
</script>

<style lang="scss" scoped>
  .product {

  }
</style>
