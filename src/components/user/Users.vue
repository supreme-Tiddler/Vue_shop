<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- element ui 的栅格系统   共24份 -->
      <!-- :gutter="20"  每个列之间的间隙 -->
      <!-- :span="7"  第一个7份 -->
      <!-- :span="4"  一个4份 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <!-- 带搜索按钮的输入框 -->
           <!-- v-model="queryInfo.query" 查询参数的条件 -->
           <!-- clearable  可清空的搜索框 -->
           <!-- @clear="getUserList"输入框清空时 重新发起请求 -->
           <el-input placeholder="请输入内容" class="input-with-select"
           v-model="queryInfo.query"
           clearable
           @clear="getUserList"
           >
              <!-- 当点击搜索时重新从接口获取数据 -->
              <el-button @click="getUserList" slot="append" icon="el-icon-search"></el-button>
            </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table  border="" :data="userList" stripe style="width: 100%">
        <el-table-column prop="email"  type="index"  label=""></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column  label="状态">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <!-- scope.row  一行的数据 -->
            <!-- {{scope.row}} -->
            <el-switch v-model="scope.row.mg_state" @change="userStatusChanged(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <!-- 文字提示组件 -->
        <!-- :enterable="false"  鼠标无法移入-->
        <el-table-column prop="" label="操作" width="180px">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="修改" placement="top" :enterable="false">
                <el-button  size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row)">
                </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
              <el-button  size="mini" type="warning" icon="el-icon-delete" @click="deleteUser(scope.row)">
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="设置用户角色" placement="top" :enterable="false">
              <el-button  size="mini" type="danger" icon="el-icon-s-tools" @click="setRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页导航区域 -->
      <!--
        @size-change  当page-size发生改变时
        @current-change  当页码发生改变时触发
        :current-page 当前页码
        :page-sizes  每页显示个数选择器
        :page-size   每页显示的条数
        layout   显示那些项目
        :total  总条数
       -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[ 2, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
    <!-- 添加用户的对话框 __  -->
    <!-- :visible.sync 是否显示对话框-->
    <!-- @close 当对话框消失触发的事件 -->
    <el-dialog
     title="添加用户"
     width="50%"
     :visible.sync="addDialogVisible"
     @close="addDianeClosed">
      <!-- prop   所需要的校验字段  -->
      <el-form ref="addFormRef"
       :model="addForm"
        :rules="addFormRules"
         label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
         <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
         <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
         <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户的对话框_____ -->
    <el-dialog
     title="修改用户"
     width="50%"
     :visible.sync="editDialogVisible"
     @close="editDianeClosed">
      <!-- prop   所需要的校验字段  -->
      <el-form ref="editFormRef"
       :model="editForm"
        :rules="editFormRules"
         label-width="80px">
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
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框____ -->
    <el-dialog
     title="设置用户角色"
     width="50%"
     :visible.sync="setRolesDialogVisible"
     @close="setRolesDialogClosed">
      <div>
        <p>当前用户  :  {{userInfo.username}}</p>
        <p>当前角色  :  {{userInfo.role_name}}</p>
        <p>分配新角色   :
          <el-select v-model="selectRoleId" placeholder="请选择角色">
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
        <el-button @click="setRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'Users',
  data () {
    // 自定义校验邮箱
    var checkEmail = (rule, value, cb) => {
      // 使用正则表达式,校验邮箱
      const regEmail = /^\w+@\w+(\.\w+)+$/
      // 校验___
      if (regEmail.test(value)) {
        return cb()
      }
      // 校验失败 前面没有执行 return 那么代表失败
      cb(new Error('请输入合法的邮箱'))
    }
    // 自定义校验电话
    var checkMobile = (rule, value, cb) => {
      // 使用正则表达式,校验邮箱
      const regEmail = /^1[1-9]\d{9}$/
      // 校验___
      if (regEmail.test(value)) {
        return cb()
      }
      // 校验失败 前面没有执行 return 那么代表失败
      cb(new Error('请输入合法的手机号'))
    }
    return {
      // 获取用户信息的参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      // 放置结果的数组
      userList: [],
      // 总计
      total: 0,
      // 添加用户的对话框 默认不显示
      addDialogVisible: false,
      // 添加用户的数据模型
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加用户的规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '用户名在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '密码在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur', message: '邮箱格式不正确,请重新输入' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur', message: '手机号格式不正确,请重新输入' }
        ]
      },
      // 修改用户的对话框
      editDialogVisible: false,
      // 修改用户的表单数据
      editForm: {
        username: '',
        email: '',
        mobile: ''
      },
      // 校验修改用户的表单
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur', message: '邮箱格式不正确,请重新输入' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur', message: '手机号格式不正确,请重新输入' }
        ]
      },
      // 设置角色的对话框
      setRolesDialogVisible: false,
      // 用户的所有信息
      userInfo: {},
      // 选择的角色id
      selectRoleId: '',
      // 角色列表
      rolesList: []
    }
  },
  // 当组件实例被创建时____
  created () {
    this.getUserList()
  },
  methods: {
    // 获取所有的用户并渲染____
    async getUserList () {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      // console.log(res)
      // 如果失败,提示错误
      if (res.meta.status !== 200) return this.$message.error('获取用户列表失败')
      // 如果成功 放入 userList 中
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 分页器____
    handleSizeChange (newSize) {
      // 当每页条数发生变化时,将这个条数,设置到请求参数中
      this.queryInfo.pagesize = newSize
      // 重新发起请求
      this.getUserList()
    },
    // 设置页码时____
    handleCurrentChange (current) {
      // 当页码发生变化时,将这个页码设置到请求参数中
      this.queryInfo.pagenum = current
      // 重新发起请求
      this.getUserList()
    },
    // 修改用户状态____
    async userStatusChanged (row) {
      // console.log(row) // 开关这一行的数据
      // 发起修改用户的请求
      const { data: res } = await this.$http.put(`users/${row.id}/state/${row.mg_state}`)
      if (res.meta.status !== 200) {
        // 如果修改失败 那么需要返回修改前的状态
        row.mg_state = !row.mg_state
        return this.$message.error('修改状态失败')
      }
      // 修改状态成功
      this.$message.success(res.meta.msg)
      // console.log(res)
    },
    // 当对话框关闭后,重置表单校验____
    addDianeClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 实现添加用户____
    addUser () {
      // 在 发送请求到服务器前 需要校验一次
      this.$refs.addFormRef.validate(async valid => {
        // vaild 校验结果, 如果不通过就是false
        if (!valid) {
          return this.$message.error('请填写完整的用户信息')
        }
        // 校验通过 __
        const { data: res } = await this.$http.post('users', this.addForm)
        // console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error('添加用户失败')
        }
        this.$message.success(res.meta.msg)
        // 关闭对话框
        this.addDialogVisible = false
        // 重新刷新数据
        this.getUserList()
      })
    },
    // 获取用户信息____
    async showEditDialog (row) {
      // 发起请求到后台服务器,获取用户的id
      const { data: res } = await this.$http.get(`users/${row.id}`)
      if (res.meta.status !== 200) return this.$message.error('获取用户信息失败')
      this.editForm = res.data
      // 显示修改用户的对话框
      this.editDialogVisible = true
    },
    // 当对话框修改用户关闭后,重置表单校验____
    editDianeClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 获取信息后信息用户信息____
    editUser () {
      // 在 发送请求到服务器前 需要校验一次
      this.$refs.editFormRef.validate(async valid => {
        // vaild 校验结果, 如果不通过就是false
        if (!valid) {
          return this.$message.error('请填写完整的用户信息')
        }
        // 校验通过 __
        const { data: res } = await this.$http.put('users/' + this.editForm.id)
        // console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('修改用户失败')
        }
        this.$message.success('修改用户成功')
        // 关闭对话框
        this.editDialogVisible = false
        // 重新刷新数据
        this.getUserList()
      })
    },
    // 删除用户_____
    async deleteUser (row) {
      const confirResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // console.log(confirResult)
      if (confirResult !== 'confirm') {
        this.$message.info('已经取消删除')
      }
      if (confirResult === 'confirm') {
        const { data: res } = await this.$http.delete(`users/${row.id}`)
        if (res.meta.status !== 200) return this.$message.error('删除用户失败')
        this.$message.success('删除成功')
        // 重新刷新数据
        this.getUserList()
      }
    },
    async setRole (userInfo) {
      // 打开对话框
      this.setRolesDialogVisible = true
      // 保存用户信息
      this.userInfo = userInfo
      // 想服务器发送信息,获得存在的角色
      const { data: res } = await this.$http.get('roles')
      // console.log(this.rolesList)
      if (res.meta.status !== 200) return this.$message.error('获取用户角色失败')
      this.rolesList = res.data
      // console.log(this.rolesList)
    },
    async saveRoleInfo () {
      // 实现要判断下拉框是否有值
      if (!this.selectRoleId) return this.$message.error('请选择需要分配的角色!!')
      const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`, { rid: this.selectRoleId })
      if (res.meta.status !== 200) return this.$message.error('分配角色失败')
      this.$message.success('分配角色成功')
      this.getUserList()
      this.setRolesDialogVisible = false
      // 关闭对话框
    },
    setRolesDialogClosed () {
      this.selectRoleId = ''
      this.userInfo = {}
    }
  }
}
</script>
<style lang="scss">

</style>
