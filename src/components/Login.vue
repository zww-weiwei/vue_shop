<template>
  <div id="login">
    <div class="login_box">
      <!-- logo -->
      <div class="logo">
        <img src="./../assets/logo.png" alt="">
      </div>
      <!-- 登录表单 -->
      <el-form :model="loginForm" ref="loginFormRef" :rules="loginFormRules" label-width="0px" class="login_form">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" clearable prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" clearable show-password prefix-icon="iconfont icon-3702mima"></el-input>
        </el-form-item>
        <el-form-item class="login_btns">
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
      // 登陆表单数据绑定
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 登陆表单验证规则
      loginFormRules: {
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置登录表单
    resetLoginForm () {
      // console.log(this) this指向当前组件
      this.$refs.loginFormRef.resetFields()
    },
    // 登录
    login () {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        // console.log(res)
        if (res.meta.status !== 200) return this.$message.error('登录失败!')
        this.$message.success('登录成功')
        // 1.将登录成功之后的token，保存到客户端的sessionStorage中
        // 1.1项目中除了登录之外的其他API接口，必须在登陆之后才能访问
        // 1.2token只应在当前网站打开期间生效，所以将token保存在sessionStorage中
        window.sessionStorage.setItem('token', res.data.token)
        // 2.通过编程式导航跳转到后台主页，路由地址是/home
        this.$router.push('/home')
      })
    }
  }
}
</script>
<style lang="less" scoped>
#login{
  background-color: #2b4b6b;
  height: 100%;
  position: relative;
    .login_box{
    width: 600px;
    height: 300px;
    background: #fff;
    border-radius: 10px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
      .logo{
      width: 130px;
      height: 130px;
      background: #fff;
      border: 1px solid #eee;
      box-shadow: 0 0 5px #eee;
      border-radius: 50%;
      padding: 10px;
      position: absolute;
      left: 50%;
      transform: translate(-50%,-50%);
        img{
        border-radius: 50%;
        width: 100%;
        height: 100%;
        background: #eee;
      }
    }
    .login_form{
      position: absolute;
      bottom: 0px;
      width: 100%;
      padding: 20px;
      box-sizing: border-box;
    }
    .login_btns{
      display: flex;
      justify-content: center;
    }
  }
}
</style>
