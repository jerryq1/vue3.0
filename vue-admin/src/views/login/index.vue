<template>
  <div class="login">
      我是登录页

    <el-input v-model="input" placeholder="请输入内容"></el-input>

  </div>
</template>

<script>
  export default {
    components: {
      // 子组件引入
    },
    props: {
      // 供父组件使用属性
    },
    data() {
      // 页面全局属性
      return {
        input: ''
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
  .login{
    background-color: #ff22dd;
    width: 100%;
    height: 100%;
  }

</style>
