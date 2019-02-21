<template>
  <!-- 122行有一个警告 -->
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <el-button type="primary" @click="rolesdialogVisible = true">添加角色</el-button>
      <!-- 表格区域 -->
      <el-table :data="rolestableData" border style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="info">
            <!-- 一级权限展示 -->
            <el-row
              v-for="(item,k) in info.row.children"
              :key="item.id"
              :style="k===0?'border-top:1px solid #EBEEF5;border-bottom:1px solid #EBEEF5;'
              :'border-bottom:1px solid #EBEEF5;'"
            >
              <el-col :span="5">
                <el-tag @close="delquanxian(info.row,item.id)" closable>{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <!-- 二级权限展示 -->
                <el-row
                  v-for="(item2,k2) in item.children"
                  :key="item2.id"
                  :style="k2!==0?'border-top:1px solid #EBEEF5;':''"
                >
                  <el-col :span="6">
                    <el-tag
                      @close="delquanxian(info.row,item2.id)"
                      closable
                      type="success"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      closable
                      @close="delquanxian(info.row,item3.id)"
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column prop="address" label="操作" width="300">
          <template slot-scope="info">
            <el-button
              @click="showeditinfos(info.row.id)"
              icon="el-icon-edit"
              type="primary"
              size="mini"
            >编辑</el-button>
            <el-button
              @click="delroles(info.row.id)"
              icon="el-icon-delete"
              type="danger"
              size="mini"
            >删除</el-button>
            <el-button
              class="el-icon-setting"
              type="warning"
              size="mini"
              @click="showfpqx(info.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 表格区域结束 -->
      <!-- 添加角色弹出框开始 -->
      <el-dialog title="添加角色" :visible.sync="rolesdialogVisible" width="50%" @close="rolesclose">
        <el-form :rules="rolesrules" ref="rolesformrefs" :model="rolesform" label-width="80px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="rolesform.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="rolesform.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="rolesdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addroles">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 添加角色弹出框结束 -->
      <!-- 修改角色对话框开始 -->
      <el-dialog title="修改角色" :visible.sync="showeditdialogVisible" width="50%">
        <el-form
          :rules="showeditrules"
          ref="showeditformrefs"
          :model="showeditform"
          label-width="80px"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="showeditform.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="showeditform.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showeditdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="czeditroles">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 给角色分配权限对话框 -->
      <el-dialog title="分配权限" :visible.sync="fpqx" width="50%">
        <el-form ref="fpqxrefs" :model="fpqxmodel" label-width="100px">
          <el-form-item label="当前的角色: ">{{fpqxmodel.roleName}}</el-form-item>
          <el-form-item label="分配的权限: ">
            <el-tree
              ref="treeref"
              :data="rightlist"
              show-checkbox
              default-expand-all
              node-key="id"
              :props="rightlistprops"
              :default-checked-keys="defaultCheckedKeys"
            ></el-tree>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="fpqx = false">取 消</el-button>
          <el-button type="primary" @click="shouquan">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getrolesinfos()
  },
  data() {
    return {
      // 分配权限开始 fpqx
      fpqx: false,
      // fpqxmodel里有如下成员
      // 当前角色roleName,角色id id
      // 角色描述roleDesc ,和一个拥有的权限数组
      fpqxmodel: {
        userName: '',
        id: 0
      },
      // 权限树状列表
      // 树状列表中的数据
      rightlist: [],
      // 树状列表中的属性,设置显示的名称
      rightlistprops: {
        label: 'authName',
        children: 'children'
      },
      // 收集默认的权限id
      defaultCheckedKeys: [],
      // 分配权限结束
      // 修改角色开始
      showeditdialogVisible: false,
      // 修改用户表单信息
      showeditform: {
        roleName: '',
        roleDesc: ''
      },
      // 修改角色验证规则
      showeditrules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      },
      // 添加角色开始
      rolesdialogVisible: false,
      //   添加角色表单信息
      rolesform: {
        roleName: '',
        roleDesc: ''
      },
      //   添加角色表单验证规则
      rolesrules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      },
      // 角色列表信息
      rolestableData: []
    }
  },
  methods: {
    // 分配权限开始
    async showfpqx(role) {
      this.fpqx = true
      this.fpqxmodel = role
      // 把树状列表的权限获取到
      const { data: res } = await this.$http.get('rights/tree')
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.rightlist = res.data
      var arrid = []
      this.getHaveRight(role, arrid)
      this.defaultCheckedKeys = arrid
    },
    getHaveRight(node, keys) {
      if (!node.children) {
        return keys.push(node.id)
      }
      node.children.forEach(item => {
        return this.getHaveRight(item, keys)
      })
    },
    // 授权给角色权限
    async shouquan() {
      // 把全选的节点获取到用数组返回
      var ids1 = this.$refs.treeref.getCheckedKeys()
      // 把半选的节点获取到用数组返回
      var ids2 = this.$refs.treeref.getHalfCheckedKeys()
      // 将全选和半选组合到一起成一个数组
      var alliids = [...ids1, ...ids2].join(',')
      // console.log(ids1)
      // console.log(ids2)
      // console.log(alliids)
      const { data: res } = await this.$http.post(
        'roles/' + this.fpqxmodel.id + '/rights',
        { rids: alliids }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.fpqx = false
      this.$message.success(res.meta.msg)
      this.getrolesinfos()
    },
    // 分配权限结束
    // 删除角色权限 下拉框里的小图标
    delquanxian(roleId, rightId) {
      console.log(this.rolestableData)
      this.$confirm('确定要取消该权限吗?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `roles/${roleId.id}/rights/${rightId}`
          )
          console.log(res)
          if (res.meta.status !== 200) {
            return this.message.error(res.meta.msg)
          }
          this.$message.success(res.meta.msg)
          this.getrolesinfos()
        })
        .catch(() => {})
    },
    // 删除单个角色
    delroles(id) {
      this.$confirm('确定要删除吗?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete('roles/' + id)
          if (res.meta.status !== 200) {
            return this.message.error(res.meta.msg)
          }
          this.$message.success(res.meta.msg)
          this.getrolesinfos()
        })
        .catch(() => {})
    },
    // 修改角色开始
    // 修改角色对话框中的默认数据
    async showeditinfos(id) {
      const { data: res } = await this.$http.get('roles/' + id)
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 打开修改对话框
      this.showeditdialogVisible = true
      this.showeditform = res.data
    },
    // 点击确定将修改的数据从存储入库
    czeditroles() {
      // console.log(this.showeditform)
      this.$refs.showeditformrefs.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.put(
            'roles/' + this.showeditform.roleId,
            this.showeditform
          )
          // console.log(res)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          // 关闭修改对话框
          this.showeditdialogVisible = false
          // 显示修改成功信息
          this.$message.success(res.meta.msg)
          // 重新渲染数据
          this.getrolesinfos()
        }
      })
    },

    // 添加角色开始
    // 点击确定收集添加的信息
    addroles() {
      // 表单校验
      this.$refs.rolesformrefs.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.post('/roles', this.rolesform)
          // console.log(res)
          if (res.meta.status !== 201) {
            return this.$message.error(res.meta.msg)
          }
          // 关闭添加用户弹框
          this.rolesdialogVisible = false
          // 提示添加成功
          this.$message.success(res.meta.msg)
          // 重新渲染数据
          this.getrolesinfos()
        }
      })
    },
    // 关闭添加角色对话框重置表单
    rolesclose() {
      this.$refs.rolesformrefs.resetFields()
    },
    //   获取角色列表信息
    async getrolesinfos() {
      const { data: res } = await this.$http.get('/roles')
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.rolestableData = res.data
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 10px 5px;
}
.el-row {
  display: flex;
  align-items: center;
}
</style>
