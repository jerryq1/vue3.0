<template>
  <div class="login">
    <div class="tag">
      <ul>
        <li v-for="(item,index) in tags" :key="index" :class="{'active':item.switch}"
            @click="switchLogin(item)">{{item.label}}
        </li>
      </ul>
    </div>

    <el-form :model="ruleForm" label-position="top" status-icon :rules="rules" ref="ruleForm" label-width="140px"
             class="demo-ruleForm">
      <el-form-item label="邮箱" prop="username">
        <el-input type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input type="password" v-model="ruleForm.pass" autocomplete="off" minlength="6"
                  maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass" v-if="tags[1].switch">
        <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="code">
        <el-row :gutter="10" class="flex">
          <el-col :span="14">
            <el-input v-model="ruleForm.code"></el-input>
          </el-col>
          <el-col :span="10">
            <el-button type="success" class="block" size="mini">获取验证码</el-button>
          </el-col>
        </el-row>

      </el-form-item>
      <el-form-item>
        <el-button type="danger" class="block mt20" @click="submitForm('ruleForm')">{{tags[1].switch? '注册':'登录'}}
        </el-button>
      </el-form-item>
    </el-form>


    <img :src="imgs.imgs[0]" alt="">
    <img :src="imgs.imgs[1]" alt="">
  </div>
</template>

<script>
  // import {validateUsername,validatePass,validateCode} from '@/utils/validate'
import imgs from '../imgs'
  export default {
    components: {
      // 子组件引入
    },
    props: {
      // 供父组件使用属性
    },
    data() {
      // 页面全局属性
      var validatePass2 = (rule, value, callback) => {
        if (this.tags[1].switch) {
          if (value === '') {
            callback(new Error('请再次输入密码'));
          } else if (value !== this.ruleForm.pass) {
            callback(new Error('两次输入密码不一致!'));
          } else {
            callback();
          }
        } else {
          callback();
        }
      }
      //邮箱
      var validateUsername = (rule, value, callback) => {
        let reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
        if (value === '') {
          callback(new Error('请输入用户名'));
        } else if (!reg.test(value)) {
          callback(new Error('用户名格式不对'));
        } else {
          callback();
        }
      };

//密码
      var validatePass = (rule, value, callback) => {
        let reg = /^(?=.*?[a-z)(?=.*>[A-Z])(?=.*?[0-9])[a-zA_Z0-9]{6,10}$/
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if (!reg.test(value)) {
          callback(new Error('密码格式不对'));
        } else {
          callback();
        }
      };

//6位纯数字
      var validateCode = (rule, value, callback) => {
        let reg = /^[a-z0-9]{6}$/
        if (value === '') {
          callback(new Error('验证码不能为空'));
        } else if (!reg.test(value)) {
          callback(new Error('验证码格式不正确'));
        } else {
          callback();
        }
      };
      return {
        imgs,
        tags: [
          {
            label: '登录',
            switch: true
          },
          {
            label: '注册',
            switch: false
          }
        ],
        ruleForm: {
          username: '',
          pass: '',
          checkPass: '',
          code: ''
        },
        rules: {
          username: [
            {validator: validateUsername, trigger: 'blur'}
          ],
          pass: [
            {validator: validatePass, trigger: 'blur'}
          ],
          code: [
            {validator: validateCode, trigger: 'blur'}
          ],
          checkPass: [
            {validator: validatePass2, trigger: 'blur'}
          ]
        }
      };
    },
    created
      () {
      // 页面已生产
    }
    ,
    updated() {
      // 页面已更新
    }
    ,
    mounted() {
      // 页面已渲染完成
      console.log(imgs);

    }
    ,
    destroyed() {
      // 页面已退出
    }
    ,
    methods: {
      // 自定义函数

      /**
       * @Description 选择登录还是注册
       * @param {}
       * @return {}
       * @author Jerry
       * @date 2020-07-22
       */
      switchLogin(info) {
        this.tags.forEach(item => item.switch = false)
        info.switch = true
        // alert(1)
      }
      ,

      submitForm(formName) {
        console.log('进来了');
        console.log(this.$refs[formName]);
        this.$refs[formName].validate((valid) => {
          console.log(valid);
          if (valid) {
            // console.log('23123sadsadasd');
            if (this.tags[1].switch) {
              alert('注册')
            } else {
              alert('登录')
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  .login {
    background-color: yellow;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    /*background-image: url("../../assets/4a4dd6f9fa130c8e12dfdad8317b650f.jpg");*/
    /*background-size: cover;*/

    .tag {
      ul {
        display: flex;

        li {
          display: inline-flex;
          padding: 10px 30px;
          box-sizing: border-box;
          color: #fff;
          cursor: pointer;
          border-radius: 5px;

          &.active {
            background-color: rgba(0, 0, 0, .1);
          }
        }
      }
    }

    .demo-ruleForm {
      width: 280px;

      /deep/ .el-form-item__label {
        color: #fff;
      }

      .block {
        display: block;
        width: 100%;

        &.mt20 {
          margin-top: 20px;
        }
      }

      .flex {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

  }

</style>
