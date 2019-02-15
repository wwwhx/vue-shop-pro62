<template>
  <div id="login-container">
    <!-- 登录盒子 -->
    <div id="login-box">
      <!-- 登录的图标 -->
      <div id="login-img">
        <img src="../assets/img/logo.png" alt>
      </div>
      <!-- 登录表单 -->
      <el-form :rules="rules" ref="loginFormRef" :model="loginForm">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username">
            <i slot="prefix" class="iconfont icon-user"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password">
            <i slot="prefix" class="iconfont icon-3702mima"></i>
          </el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-row>
          <el-col :offset="15">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="chongzhi">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 实现登录功能
    login() {
      // 对登录的form表单进行整体校验
      this.$refs.loginFormRef.validate(async valid => {
        if (valid === true) {
          // 用户真实性校验
          const { data: res } = await this.$http.post('/login', this.loginForm)
          //   console.log(res)
          if (res.meta.status !== 200) {
            return this.$message.error('用户名或密码不存在')
          }

          // 通过浏览器的sessionstrorage记录服务器返回的token信息
          window.sessionStorage.setItem('token', res.data.token)

          // 点击登录后将页面重定向到后台主页面
          this.$router.push('./home')
        }
      })
    },
    chongzhi() {
      this.$refs.loginFormRef.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
#login-container {
  height: 100%;
  overflow: hidden;
  background-color: #2b4b6b;
  #login-box {
    width: 450px;
    height: 304px;
    background-color: #ffffff;
    border-radius: 4px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    #login-img {
      width: 140px;
      height: 140px;
      border-radius: 50%;
      background-color: #ffffff;
      border: 1px solid #eee;
      padding: 8px;
      box-shadow: 0 0 10px #eee;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      box-sizing: border-box;
      img {
        width: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
    .el-form {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 20px;
      box-sizing: border-box;
    }
  }
}
</style>
