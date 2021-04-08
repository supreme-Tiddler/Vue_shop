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
           <el-input placeholder="请输入内容" class="input-with-select">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-table  border="" :data="userList" stripe style="width: 100%">
      <el-table-column prop="email"  type="index"  label="序号"></el-table-column>
      <el-table-column prop="username" label="姓名"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column prop="role_name" label="角色"></el-table-column>
      <el-table-column  label="状态">
        <!-- 作用域插槽 -->
        <template slot-scope="scope">
          <!-- scope.row  一行的数据 -->
          <!-- {{scope.row}} -->
          <el-switch v-model="scope.row.mg_state">
          </el-switch>
        </template>
      </el-table-column>
      <!-- 文字提示组件 -->
      <!-- :enterable="false"  鼠标无法移入-->
      <el-table-column prop="" label="操作" width="180px">
        <el-tooltip class="item" effect="dark" content="修改" placement="top" :enterable="false">
          <el-button  size="mini" type="primary" icon="el-icon-edit"></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
          <el-button  size="mini" type="warning" icon="el-icon-delete"></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="设置" placement="top" :enterable="false">
          <el-button  size="mini" type="danger" icon="el-icon-s-tools"></el-button>
        </el-tooltip>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  name: 'Users',
  data () {
    return {
      // 获取用户信息的参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      // 放置结果的数组
      userList: [],
      // 总计
      total: 0
    }
  },
  // 当组件实例被创建时
  created () {
    this.getUserList()
  },
  methods: {
    // 获取所有的用户
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
    }
  }
}
</script>
<style lang="scss">

</style>
