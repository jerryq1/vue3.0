<template>
  <div class="marqueePage">
    <div class="marqueeXu" ref="marqueeXu" :style="{width:`${widthPre}%` }">
      <div class="marqueenContent">
        {{text}}
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    components: {
      // 子组件引入
    },
    props: {
      // 供父组件使用属性
      widthPre:{
        type:Number,
        default:80
      },
      text:{
        type:String,
        default: '我就是测试分支'
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
    },
    destroyed() {
      // 页面已退出
    },
    methods: {
      // 自定义函数
      /**
       * @Description 监听文字内容盒子是否超过容器
       * @param {}
       * @return {}
       * @author Jerry
       * @date 2021-02-25
       */
      checkTextOverFlow(){

      }
    }
  }
</script>

<style lang="scss" scoped>
  .marqueePage{
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .marqueeXu {
      background-color: yellow;
      .marqueenContent{
        background-color: green;
        /*width: auto;*/
      }
    }
  }
</style>
