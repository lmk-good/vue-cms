/* eslint-disable vue/no-unused-vars */
<template>
  <div class="User">
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 页面卡片 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
            <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 数据列表 -->
      <el-table :data="userlist" stripe border>
          <el-table-column type="index"></el-table-column>
          <el-table-column label="姓名" prop="username"></el-table-column>
          <el-table-column label="邮箱" prop="email"></el-table-column>
          <el-table-column label="电话" prop="mobile"></el-table-column>
          <el-table-column label="角色" prop="role_name"></el-table-column>
          <el-table-column label="状态" prop="mg_state">
              <template slot-scope="scope">
                <el-switch v-model="scope.row.mg_state">
                </el-switch>
              </template>
          </el-table-column>
          <el-table-column label="操作" width="180px">
              <template slot-scope = "scope" width="180px">
                  <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUser(scope.row.id)"></el-button>
                  <el-button type="danger" icon="el-icon-delete" size="mini" @click="delectUser(scope.row.id)"></el-button>
                  <el-tooltip class="item" effect="dark" content="分配角色" placement="top-start" :enterable='false'>
                    <el-button type="warning" icon="el-icon-setting" size="mini" @click="setUser(scope.row)"></el-button>
                 </el-tooltip>
              </template>
          </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 4, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
   <el-dialog
    title="添加用户"
    :visible.sync="addDialogVisible"
     width="50%"
     @close="addDialogClosed"
    >
    <!-- 内容主题区域 -->
    <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username">
         <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
         <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
         <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
         <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
    </el-form>
     <!-- 底部按钮区域 -->
    <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
    </span>
</el-dialog>

   <!-- 修改对话框 -->
   <el-dialog
     title="修改用户信息"
     :visible.sync="editdialogVisible"
      width="50%" @close="editDialogClosed">
      <!-- 修改内容区域 -->
  <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
  <el-form-item label="用户名">
    <el-input v-model="editForm.username" disabled></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop="email">
    <el-input v-model="editForm.email"></el-input>
  </el-form-item>
  <el-form-item label="电话" prop="mobile">
    <el-input v-model="editForm.mobile"></el-input>
  </el-form-item>
  </el-form>
  <!-- 修改按钮区域 -->
  <span slot="footer" class="dialog-footer">
    <el-button @click="editdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUserInfo">确 定</el-button>
  </span>
</el-dialog>
  <!-- 分配角色对话框 -->
  <el-dialog
  title="分配角色"
  :visible.sync="setRoleDialogVisible"
  width="50%"
  @close="setRoleDialogClosed">
  <div>
    <p>当前的用户:{{userInfo.username}}</p>
    <p>当前的角色:{{userInfo.role_name}}</p>
    <p>分配新角色:
      <el-select v-model="selectedRoleId" placeholder="请选择">
        <el-option
         v-for="item in rolesList"
        :key="item.id"
        :label="item.roleName"
        :value="item.id">
      </el-option>
      </el-select>
    </p>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setRoleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    // 手机验证规则
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }
    return {
      queryInfo: {
        query: '',
        // 当前页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2
      },
      userlist: [],
      total: 0,
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加表单验证的规则对象
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', tigger: 'blur' },
          { min: 3, max: 10, message: '用户名的长度在3-10字符之间', tigger: blur }
        ],
        password: [
          { required: true, message: '请输入密码', tigger: 'blur' },
          { min: 6, max: 15, message: '用户名的长度在6-15字符之间', tigger: blur }
        ],
        email: [
          { required: true, message: '请输入邮箱', tigger: 'blur' },
          { validator: checkEmail, tigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', tigger: 'blur' },
          { validator: checkMobile, tigger: 'blur' }
        ]
      },
      // 编辑对话框默认值
      editdialogVisible: false,
      // 查询到的用户信息对象
      editForm: {
        username: '',
        email: '',
        mobile: ''
      },
      // 修改用户表单验证的规则对象
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', tigger: 'blur' },
          { validator: checkEmail, tigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', tigger: 'blur' },
          { validator: checkMobile, tigger: 'blur' }
        ]
      },
      // 分配角色对话框的隐藏值
      setRoleDialogVisible: false,
      // 需要被分配的角色信息
      userInfo: {},
      // 所有角色的数据列表
      rolesList: [],
      // 已选中的角色id值
      selectedRoleId: ''
    }
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取用户列表失败')
      this.userlist = res.data.users
      this.total = res.data.total
      console.log(res)
    },
    // 监听pagesize的改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听页码值的改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 重置表单
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮，添加新用户
    addUser () {
      this.$refs.addFormRef.validate(async valid => {
        // eslint-disable-next-line no-useless-return
        if (!valid) return false
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败')
        }
        this.$message.success('添加用户成功')
        this.addDialogVisible = false
        this.getUserList()
      })
    },
    // 修改用户信息
    async editUser(id) {
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        this.$message.error('查询用户信息失败')
      }
      this.editForm = res.data
      console.log(this.editForm)
      this.editdialogVisible = true
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息并提交
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('users/' + this.editForm.id, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        if (res.meta.status !== 200) {
          this.$message.error('修改失败')
        }
        this.editdialogVisible = false
        this.getUserList()
        this.$message.success('修改成功')
      })
    },
    // 删除用户
    async delectUser(id) {
      const result = await this.$confirm('是否删除该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => {
        return err
      })
      if (result !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败')
      }
      this.$message.success('成功删除用户')
      this.getUserList()
    },
    // 分配角色
    async setUser(userInfo) {
      this.userInfo = userInfo
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        this.$message.error('获取角色列表失败')
      }
      this.rolesList = res.data
      this.setRoleDialogVisible = true
    },
    // 点击确定按钮分配角色
    async saveRoleInfo() {
      if (!this.selectedRoleId) {
        return this.$message.error('请选择要分配的角色')
      }
      const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`, { rid: this.selectedRoleId })
      if (res.meta.status !== 200) {
        this.$message.error('更新角色失败')
      }
      this.getUserList()
      this.setRoleDialogVisible = false
    },
    setRoleDialogClosed() {
      this.selectedRoleId = ''
      this.userInfo = {}
    }
    // async handleUserSwitch(userinfo) {
    //   console.log(userinfo)
    //   const { data: res } = await this.$http.put(
    //     `users/${userinfo.id}/state/${userinfo.mg_state}`
    //   )
    //   if (res.meta.status !== 200) {
    //     userinfo.mg_state = !userinfo.mg_state
    //     return this.$message.error('更新用户状态失败！')
    //   }
    //   this.$message.success('更新用户状态成功！')
    // }
  },
  created() {
    this.getUserList()
  }
}
</script>

<style lang="less" scoped>
</style>
