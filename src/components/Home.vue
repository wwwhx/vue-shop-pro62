<template>
  <el-container>
    <!-- 头部部分 -->
    <el-header>
      <div id="logo-box">
        <img src="../assets/img/heima.png" alt>
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 左侧部分 -->
    <el-container>
      <el-aside :width="menushow ? '65px' : '200px'">
        <div id="gang" @click="menushow=!menushow">|||</div>
        <el-menu
          :unique-opened="true"
          :collapse="menushow"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          :style="menushow ? '65px' : '200px'"
          :collapse-transition="false"
        >
          <el-submenu :index="item.id+''" v-for="(item,k) in menuList" :key="item.id">
            <template slot="title">
              <i :class="'iconfont icon-' + menuicon[k]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item
              :index="item.id + '-' + item2.id"
              v-for="item2 in item.children"
              :key="item2.id"
            >
              <i class="el-icon-menu"></i>
              <span>{{item2.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created() {
    this.getMenuList()
  },
  data() {
    return {
      menushow: false,
      // 用于接收左侧的列表信息
      menuList: [],
      // 图标集合
      menuicon: ['users', 'tijikongjian', 'shangpin', 'danju', 'baobiao']
    }
  },
  methods: {
    // 退出登录
    logout() {
      // 确认退出
      // 清除token
      // 跳转页面
      this.$confirm('确定要退出吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          window.sessionStorage.removeItem('token')
          this.$router.push('/login')
        })
        .catch(() => {})
    },
    // 获取左侧信息
    async getMenuList() {
      const { data: res } = await this.$http.get('/menus')
      console.log(res)
      // 判断status是否正确
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 然后将res中的data赋值给menuList
      this.menuList = res.data
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
  .el-header {
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 20px;
    user-select: none;
    background-color: #373d41;
    height: 60px;
    #logo-box {
      color: #ffffff;
      display: flex;
      align-items: center;
      font-size: 22px;
      img {
        width: 50px;
        height: 50px;
        margin-right: 10px;
      }
    }
  }
  .el-aside {
    background-color: #333744;
    #gang {
      height: 25px;
      background-color: rgb(74, 80, 100);
      line-height: 25px;
      font-size: 12px;
      text-align: center;
      color: #ffffff;
      letter-spacing: 0.1em;
      cursor: pointer;
    }
  }
  .el-main {
    background-color: #eaedf1;
  }
}
</style>
