<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 面包屑导航区域 -->
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <el-table :data="rightsinfo" border style="width: 100%">
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="等级">
          <template slot-scope="info">
            <el-tag v-if="info.row.level=='0'">一级</el-tag>
            <el-tag v-if="info.row.level=='1'" type="success">二级</el-tag>
            <el-tag v-if="info.row.level=='2'" type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getrightsinfo()
  },
  data() {
    return {
      rightsinfo: []
    }
  },
  methods: {
    async getrightsinfo() {
      const { data: res } = await this.$http.get('rights/list')
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.rightsinfo = res.data
    }
  }
}
</script>

<style lang="less" scoped>
</style>
