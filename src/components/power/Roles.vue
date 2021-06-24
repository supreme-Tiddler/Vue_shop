<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片上图 -->
    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table  border :data="rolesList" stripe style="width: 100%">
        <!-- 可以展开的列____ -->
         <el-table-column type="expand">
           <template slot-scope="scope">
             <!-- {{scope.row}} 这一行的数据 -->
             <el-row :class="['bdbottom',index==0?'bdtop':'','vcenter']" v-for="(item, index) in scope.row.children" :key="item.id">
               <!-- 渲染一级权限 -->
               <el-col :span="5">
                 <el-tag closable @close="removeRightById(scope.row,item.id)">{{item.authName}}</el-tag>
                 <!-- 小箭头图标 -->
                 <i class="el-icon-caret-right"></i>
               </el-col>
               <!-- 渲染二级三级权限___ -->
               <el-col :span="19">
                  <el-row :class="[index2==0?'':'bdtop','vcenter']"  v-for="(item2,index2) in item.children" :key="item2.id">
                    <!-- 渲染二级权限___ -->
                    <el-col :span="6">
                      <el-tag closable  @close="removeRightById(scope.row,item2.id)" type="success">{{item2.authName}}</el-tag>
                       <i class="el-icon-caret-right"></i>
                    </el-col>
                    <!-- 渲染三级权限___ -->
                    <el-col :span="18" >
                      <el-tag closable  @close="removeRightById(scope.row,item3.id)" type="warning" v-for="item3 in item2.children" :key="item3.id">
                        {{item3.authName}}
                      </el-tag>
                    </el-col>
                  </el-row>
               </el-col>
             </el-row>
           </template>
         </el-table-column>
        <el-table-column type="index"  label=""></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
                <el-button  size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row)">
                  编辑
                </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
              <el-button  size="mini" type="warning" icon="el-icon-delete" @click="deleteUser(scope.row)">
                删除
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="设置权限" placement="top" :enterable="false">
              <el-button @click="showSetRightDialog(scope.row)" size="mini" type="danger" icon="el-icon-s-tools">分配权限</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限的对话框_____ -->
    <el-dialog
     title="分配权限"
     width="50%"
     @close="setRightDialogClose()"
     :visible.sync="setRightDialogVisible">
     <!-- @close="editDianeClosed" -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        default-expand-all
        show-checkbox
        node-key="id"
        :default-checked-keys="defkeys"
        ref="treeRef">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allToRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      rolesList: [],
      // 默认设置权限对话框隐藏
      setRightDialogVisible: false,
      // 权限树列表
      rightsList: [],
      // 配置树形结构
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的数组
      defkeys: [],
      // 分配权限的角色id
      roleId: ''
    }
  },
  created () {
    this.getrRolesList()
  },
  methods: {
    async getrRolesList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('角色列表获取失败')
      // console.log(res)
      this.rolesList = res.data
      // this.$message.success('角色列表获取')
    },
    // 删除角色指定权限____
    async removeRightById (role, rightID) {
      // console.log(rightID)____
      const confirResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // console.log(confirResult)
      if (confirResult !== 'confirm') {
        return this.$message.info('已经取消删除')
      }
      // 如果确定要删除___
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightID}`)
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error('删除角色权限失败')
      this.$message.success('删除成功')
      // 重新刷新数据
      role.children = res.data
      // 这里不用这个是因为 不让表格重新刷新
      // this.getrRolesList()
    },
    // 显示设置分配权限的对话框____
    async showSetRightDialog (role) {
      // 保存操作的角色id
      this.roleId = role.id
      this.setRightDialogVisible = true
      // 从服务器获取所有的权限 树状结构
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error('权限列表获取失败')
      this.rightsList = res.data
      // console.log(this.rightsList)
      // 设置默认选中权限的数组  将选中的id
      this.getLeafkeys(role, this.defkeys)
    },
    getLeafkeys (node, arr) {
      // 如果node.children没有 那么就结束 并将每一个节点id放进arr里面
      if (!node.children) return arr.push(node.id)
      node.children.forEach(item => this.getLeafkeys(item, arr))
    },
    // 为了避免下一次分配权限的时候有上一次残留的设置
    setRightDialogClose () {
      this.defkeys = []
    },
    async allToRights () {
      // 将所有选中节点的值,变为一个数组
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // 拼接成字符串 以,号隔开
      const idStr = keys.join(',')
      // console.log(idStr)
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error('分配角色权限失败')
      this.$message.success('分配角色权限成功')
      this.getrRolesList()
      // 关闭对话框
      this.setRightDialogVisible = false
    }
  }
}
</script>
<style lang="scss">
.el-tag{
  margin: 7px;
}
.bdtop{
  border-top: 1px solid #eee;
}
.bdbottom{
  border-bottom: 1px solid #eee;
}
.vcenter{
  display: flex;
  align-items: center;
}

</style>
