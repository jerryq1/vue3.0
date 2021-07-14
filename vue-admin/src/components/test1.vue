<template>
  <div @click="changeParent">
    我是测试组件{{bbc}}
  </div>
</template>

<script>
  import(
    /*webpackPreload:true*/
    /*webpackPrefetch:true*/
    /*webpackChunkName:'dev'*/
    '../views/dev/index'
    )
  export default {
    name:'test',

    components: {
      // 子组件引入
    },
    props: {
      // 供父组件使用属性
      bbc:{
        type:Number,
      }
    },
    data() {
      // 页面全局属性
      return {}
    },
    created() {
      // 页面已生产
    },
    updated() {
      // 页面已更新
    },
    mounted() {
      // 页面已渲染完成
      console.log('我是子组件');
    },
    destroyed() {
      // 页面已退出
    },
    methods: {
      // 自定义函数
      testMethod(){
        console.log('子组件方法');
      },
      changeParent(){
        this.$emit('update:bbc',3333)
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
