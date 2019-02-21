<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 面包屑导航区域 -->
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <!-- 搜索框 -->
        <el-col :span="8">
          <el-input
            :clearable="true"
            @keyup.enter.native="getUserInfos"
            @clear="getUserInfos"
            v-model="querycdt.query"
            placeholder="请输入搜索内容"
            class="input-with-select"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserInfos"></el-button>
          </el-input>
        </el-col>
        <!-- 搜索框 -->
        <!-- 按钮 -->
        <el-col :span="7">
          <el-button type="primary" @click="adddialogVisible = true">添加用户</el-button>
        </el-col>
        <!-- 按钮 -->
      </el-row>
      <!-- table区域 -->
      <el-table :data="useInfos" border style="width: 100%">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="mobile" label="手机号码" width="110"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="120"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="160"></el-table-column>
        <el-table-column prop="mg_state" label="状态" width="70">
          <el-switch
            @change="changestate(info.row.id,info.row.mg_state)"
            v-model="info.row.mg_state"
            slot-scope="info"
          ></el-switch>
        </el-table-column>
        <el-table-column label="操作" width="230">
          <template slot-scope="info">
            <el-button
              @click="showeditdialogVisible(info.row.id)"
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deluser(info.row.id)"
            ></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              :enterable="false"
              placement="top-start"
            >
              <el-button
                @click="fenpeishowser(info.row.id)"
                type="warning"
                icon="el-icon-setting"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- table区域 -->
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querycdt.pagenum"
        :page-sizes="[2, 4, 6, 8]"
        :page-size="querycdt.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="querycdt.tot"
      ></el-pagination>
      <!-- 分页区域 -->
      <!-- 添加用户对话框 -->
      <el-dialog title="添加用户" :visible.sync="adddialogVisible" width="50%" @close="addclose">
        <!-- 添加用户表单区域 -->
        <el-form
          :model="addfrom"
          status-icon
          :rules="addrules"
          ref="addfromref"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="用户名" prop="username">
            <el-input type="username" v-model="addfrom.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="addfrom.password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input type="email" v-model="addfrom.email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input type="mobile" v-model="addfrom.mobile" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addusers">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改用户对话框 -->
      <el-dialog @close="editclose" title="修改用户" :visible.sync="editdialogVisible" width="50%">
        <el-form
          :model="editfrom"
          status-icon
          :rules="editrules"
          ref="editfromref"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="用户名" prop="username">
            <el-input
              :disabled="true"
              type="username"
              v-model="editfrom.username"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input type="email" v-model="editfrom.email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input type="mobile" v-model="editfrom.mobile" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editusers">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 给用户分配角色对话框 -->
      <el-dialog @close="fenpeicz" title="用户分配角色" :visible.sync="fenpeidialogVisible" width="50%">
        <el-form ref="fenpeiformref" :rules="fenpeiform" :model="fenpeiform" label-width="120px">
          <el-form-item label="当前用户: ">{{fenpeiform.username}}</el-form-item>
          <el-form-item label="分配新角色: ">
            <el-select v-model="fenpeiform.rid" placeholder="请选择">
              <el-option
                v-for="item in getjueseinfo"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="fenpeidialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editjuese">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    var checkmobile = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号码不能为空'))
      }
      if (!/^1[34578]\d{9}$/.test(value)) {
        return callback(new Error('号码格式错误'))
      } else {
        callback()
      }
    }
    return {
      // 分配角色开始
      fenpeidialogVisible: false,
      // 用于接收所有的角色名
      getjueseinfo: [],
      // 用于接收角色的信息
      // 有成员email id mobile rid username
      fenpeiform: {
        username: '',
        id: 0,
        rid: 0
      },
      // 分配角色验证规则
      fenpeiform: {
        // rid: [{ required: true, message: '角色必选', trigger: 'change' }]
      },
      // 分配角色结束
      // 修改用户开始
      editdialogVisible: false,
      // 修改用户的数据
      editfrom: {
        username: '',
        email: '',
        mobile: ''
      },
      // 修改用户的验证规则
      editrules: {
        mobile: [
          { required: true, message: '手机号码必填', trigger: 'blur' },
          { validator: checkmobile, trigger: 'blur' }
        ]
      },
      // 添加用户开始
      adddialogVisible: false,
      // 用户信息
      addfrom: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 验证规则
      addrules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
        mobile: [{ validator: checkmobile, trigger: 'blur' }]
      },

      // 用户获取设置的参数
      querycdt: {
        // 关键词查询
        query: '',
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 2,
        // 总条数
        tot: 0
      },
      // 接收来自服务器真正的数据
      useInfos: []
    }
  },
  methods: {
    // 分配角色开始
    // 重置分配表单
    fenpeicz() {
      this.$refs.fenpeiformref.resetFields()
    },
    // 展示分配角色的信息数据
    async fenpeishowser(id) {
      const { data: res } = await this.$http.get('users/' + id)
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 打开分配角色对话框
      this.fenpeidialogVisible = true
      // 将用户信息赋予给分配角色fenpeiform中
      this.fenpeiform = res.data

      // 获取到角色列表
      const { data: res2 } = await this.$http.get('/roles')
      if (res2.meta.status !== 200) {
        return this.$message.error(res2.meta.msg)
      }
      // console.log(res2)
      this.getjueseinfo = res2.data
      // console.log(this.getjueseinfo)
    },
    // 重新分配角色
    async editjuese() {
      // this.$refs.fenpeiformref.validate(async valid => {
      // if (valid) {
      // console.log(this.fenpeiform)
      const { data: res } = await this.$http.put(
        'users/' + this.fenpeiform.id + '/role',
        this.fenpeiform
      )
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 关闭对话框
      this.fenpeidialogVisible = false
      // 显示修改成功
      this.$message.success(res.meta.msg)
      // 重新渲染数据
      this.getUserInfos()
      console.log(111)
      // }
      // })
    },
    // 分配角色结束
    // 修改用户信息
    async showeditdialogVisible(id) {
      this.editdialogVisible = true
      // 根据id获得呗修改的用户信息
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.editfrom = res.data
    },
    editclose() {
      this.$refs.editfromref.resetFields()
    },
    // 修改用户信息
    editusers() {
      // 校验表单
      this.$refs.editfromref.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.put(
            'users/' + this.editfrom.id,
            this.editfrom
          )
          // console.log(res)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          // 关闭修改框
          this.editdialogVisible = false
          // 重新渲染数据
          this.getUserInfos()
        }
      })
    },
    // 删除用户
    deluser(id) {
      this.$confirm('确定要删除吗?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete('users/' + id)
          if (res.meta.status !== 200) {
            return this.message.error(res.meta.msg)
          }
          this.$message.success(res.meta.msg)
          this.getUserInfos()
        })
        .catch(() => {})
    },
    // 添加用户对话框相关
    addclose() {
      // 关闭对话框并重置表单
      this.$refs.addfromref.resetFields()
    },

    // 添加用户到数据库
    addusers() {
      this.$refs.addfromref.validate(async valid => {
        // 表示校验成功
        if (valid) {
          const { data: res } = await this.$http.post('users', this.addfrom)
          // console.log(res)
          if (res.meta.status !== 201) {
            this.$message.error(res.meta.msg)
          }
          // 关闭添加框
          this.adddialogVisible = false
          // 重新渲染数据
          this.getUserInfos()
        }
      })
    },

    // 改变用户的状态
    async changestate(uid, state) {
      const { data: res } = await this.$http.put(
        'users/' + uid + '/state/' + state
      )
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
    },
    // 当每页条数发生变化时,重新调用列表展示的事件
    handleSizeChange(arg) {
      this.querycdt.pagesize = arg
      this.getUserInfos()
    },
    // 当显示第几页时重新展示数据
    handleCurrentChange(arg) {
      this.querycdt.pagenum = arg
      this.getUserInfos()
    },
    // 获取到用户列表的真是数据
    async getUserInfos() {
      const { data: res } = await this.$http.get('users', {
        params: this.querycdt
      })

      if (res.meta.status !== 200) {
        return this.$message.console.error(res.meta.msg)
      }
      // console.log(res)
      this.useInfos = res.data.users
      this.querycdt.tot = res.data.total
    }
  },
  // 生命周期
  created() {
    this.getUserInfos()
  }
}
</script>

<style lang="less" scoped>
</style>
