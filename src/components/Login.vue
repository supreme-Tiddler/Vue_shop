<template>
  <div class='login_container'>
    <!-- 登录盒子 -->
      <div class="login_box">
        <!-- 头像盒子 -->
        <div class='avatar_box'>
          <img src="../assets/logo.png" alt="">
        </div>
        <!-- 登录表单 -->
        <!-- 表单验证:rules="loginFormRules" -->
        <!-- 提交表单 ref="LoginFormRef"  ref引用一个组件实例 后续使用 vue实例 $refs 来使用-->
        <el-form ref="LoginFormRef" :rules="loginFormRules" :model="loginForm" label-width="0" class="login_form">
          <!-- 输入框正则校验字段: prop="username" -->
          <el-form-item prop="username">
            <el-input v-model="loginForm.username">
               <i slot="prefix" class="el-input__icon el-icon-s-custom"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" v-model="loginForm.password">
              <i slot="prefix" class="el-input__icon el-icon-unlock"></i>
            </el-input>
          </el-form-item>
          <el-form-item  class="btns">
              <el-button type="primary" @click="login">登录</el-button>
              <el-button type="info" @click="resetLoginForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
</template>
<script>
export default {
  name: 'login',
  data () {
    return {
      // 这里的loginForm拿到表单里面的 :model="loginForm"
      // username 给到用户名输入框
      // userpassword给到密码输入框
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单验证规则
      loginFormRules: {
        // 表单正则校验  prop="username"
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名长度在3到10个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 15, message: '用户密码长度在6到15个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLoginForm () {
      // element ui提供的表单置空resetFields()
      // console.log(this.$refs)  $refs 提交保单的表单组件 ref="LoginFormRef"
      // 获取所有应用表单的组件中的表单,进行重置
      // 回到最初的状态
      this.$refs.LoginFormRef.resetFields()
    },
    // 登录
    login () {
      // validate() 对整个表单进行校验的方法  对loginFormRules的校验
      this.$refs.LoginFormRef.validate(async valid => {
        // valid 是一个布尔值,代表校验是否通过
        // console.log(valid)
        // 如果为false, 代表校验失败, 那么后续的登录操作不进行,直接结束函数
        if (!valid) {
          return false
        }
        // 代码到这里 , 代表前端校验通过 发起请求
        // 开始使用 axios 发起请求
        // this.loginForm 后台需要传递的参数 {username:'',password:""}
        // 异步 需要加 await  函数需要加 async
        const { data } = await this.$http.post('login', this.loginForm)
        console.log(data)
        if (data.meta.status !== 200) {
          // console.log('登录失败')
          // 引用element的消息提示框 报错 , 以及成功
          this.$message.error('登录失败')
          return false
        }
        // 代码到这里就是成功
        // console.log('登录成功')
        this.$message.success('登录成功')
        // 登录成功 保存token 以后每次登录都会带上这个token  当前对象的 data下的 token
        window.sessionStorage.setItem('token', data.data.token)
        // 登录成功后跳转到 home 页面  拿到当前的路由对象
        this.$router.push('/home')
        return false
      })
    }
  }
}
</script>
<style lang='scss'>
.login_container {
  background-color: #2b5b6b;
  height: 100%;
  position: relative;
  .login_box{
    width: 450px;
    height: 300px;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    background-color: #fff;
    .avatar_box {
      width: 130px;
      height: 130px;
      border: 1px solid #eee;
      position: absolute;
      left: 50%;
      border-radius: 50%;
      background-color: #fff;
      transform: translate(-50%,-50%);
      box-shadow: 0 0 10px #ddd;
      padding: 10px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
    .login_form {
      padding: 0 20px;
      position: absolute;
      bottom: 0;
      width: 100%;
      box-sizing: border-box;
      .btns {
        display: flex;
        justify-content: center;  //放在主轴的后面
      }
    }
  }
}
</style>
