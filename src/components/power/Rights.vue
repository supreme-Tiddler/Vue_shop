<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <el-table  border :data="rightsList" stripe style="width: 100%">
        <el-table-column prop=""  type="index"  label=""></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level==='0'">一级权限</el-tag>
            <el-tag type="success" v-else-if="scope.row.level==='1'">二级权限</el-tag>
            <el-tag type="warning" v-else-if="scope.row.level==='2'">三级权限</el-tag>
          </template>
        </el-table-column>
      </el-table>

    </el-card>

  </div>
</template>
<script>
export default {
  data () {
    return {
      // 数组格式的权限列表____
      rightsList: []
    }
  },
  // 当组件实例化时____,就来获取权限列表
  created () {
    this.getRights()
  },
  methods: {
    // 权限列表____
    async getRights () {
      const { data: res } = await this.$http.get('rights/list')
      // console.log(res)
      // 如果失败,弹出获取权限失败
      if (res.meta.status !== 200) return this.$message.error('获取权限列表失败')
      // 如果成功,将数组存起来
      this.rightsList = res.data
      // console.log(this.rightsList)
    }
  }
}
</script>
