<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片上图 -->
    <el-card class="box-card">
      <!-- 添加分类的按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 分类的表格 -->
      <!--
        data : 数据源
        columns : 每行数据 有两个参数
                label : 表头名称
                prop : 数据
        selection-type : 是否为多选表格
        expand-type : 是否为展开行类型
        show-index : 是否显示数据索引
       -->
      <tree-table class="treeTable"
      :data='categoriesList'
      :columns='columns'
      :selection-type="false"
      :expand-type="false"
      :show-index="true"
      border>
        <template slot="isok" slot-scope="scope">
          <i v-if="scope.row.cat_deleted==false" class="el-icon-success" style="color:lightgreen"></i>
          <i v-else class="el-icon-error" style="color:red"></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level===1" type="success">二级</el-tag>
          <el-tag v-else type="warning">三级</el-tag>
        </template>
        <template slot="opt" slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteCate(scope.row.cat_id)">删除</el-button>
        </template >
      </tree-table>
        <!-- 分页器 -->
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
          :page-sizes="[ 5, 10, 15, 20]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
         <!-- 添加分类的对话框_____ -->
        <el-dialog
        title="添加分类"
        width="50%"
        @close="addCateDialogClose()"
        :visible.sync="addCateDialogVisible">
          <el-form ref="addCateFormRef"
          :model="addCateForm"
          :rules="addCateFormRules"
          label-width="80px">
            <el-form-item label="分类名称" prop="cat_name">
              <el-input v-model="addCateForm.cat_name"></el-input>
            </el-form-item>
            <el-form-item label="父级分类">
              <!-- 级联选择器 -->
              <!--
                v-model  绑定选中的级联选择器
                options  级联选择器的数据源
                @change  当级联选择器选择完毕是触发
                props    配置数据显示规则
                change-on-select  可以选择一级
                clearable  有一个x图标 可以一键清空
               -->
              <el-cascader
              v-model="selectedKeys"
              :options="parentCateList"
              :props="cascaderProps"
              change-on-select
              clearable
              @change="parentCatChange"
             ></el-cascader>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addCateDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addCate">确 定</el-button>
          </span>
        </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      categoriesList: [],
      // 分类数据查询
      queryInfo: {
        type: 3, // 获取所有分类
        pagenum: 1, // 页数
        pagesize: 5 // 每页个数
      },
      // 获取参数列表的所有个数
      total: 0,
      columns: [
        { label: '分类名称', prop: 'cat_name' },
        // template 将该列设置为模板列
        // isok 该模板的名字将isok
        { label: '是否有效', type: 'template', template: 'isok' },
        { label: '排序', type: 'template', template: 'order' },
        { label: '操作', type: 'template', template: 'opt' }
      ],
      // 添加分类的对话框
      addCateDialogVisible: false,
      // 添加分类的表单
      addCateForm: {
        // 分类名称
        cat_name: '',
        // 分类的ID
        cat_pid: 0,
        // 分类的层级
        cat_level: ''
      },
      // 添加分类的表单规则校验
      addCateFormRules: {
        cat_name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      },
      // 一级,二级的商品分类列表
      parentCateList: [],
      selectedKeys: {},
      cascaderProps: {
        // 当这一项被选中时,放入selectedKeys数组中的值
        value: 'cat_id',
        // 页面级联选择器显示的值
        label: 'cat_name',
        // 子级
        children: 'children',
        // 如何触发
        expandTrigger: 'hover'
      }
    }
  },
  created () {
    // 当vue实例创建的时候就获取所有分类
    this.getAllCategories()
  },
  methods: {
    async getAllCategories () {
      const { data: res } = await this.$http('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取商品分类失败')
      this.categoriesList = res.data.result
      // 保存总参数个数
      this.total = res.data.total
      // console.log(res)
    },
    // 当分页器中每页的个数发生变化时
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      // 重新请求数据 刷新页面
      this.getAllCategories()
    },
    handleCurrentChange (current) {
      this.queryInfo.pagenum = current
      // 重新请求数据 刷新页面
      this.getAllCategories()
    },
    // 添加分类
    showAddCateDialog () {
      this.addCateDialogVisible = true
      // 获取一级分类和二级分类
      this.getParentCateList()
    },
    async getParentCateList () {
      // 获取一级分类和二级分类  不需要三级
      const { data: res } = await this.$http('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) return this.$message.error('获取商品分类列表数据失败')
      // 保存一级二级的分类
      this.parentCateList = res.data
      // console.log(this.parentCateList)
    },
    // 当对话框关闭
    addCateDialogClose () {
      // 重置表单
      this.$refs.addCateFormRef.resetFields()
      // 清空记录选择框
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    // 级联选择框,选择了的元素
    parentCatChange () {
      // 选择了的元素会添加到v-model中
      // console.log(this.selectedKeys)
      // 如果用户选择了分类 代表二级或者三级分类
      if (this.selectedKeys.length > 0) {
        // 设置分类的父id  就是这个元素的最后一个元素
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys - 1]
        // 设置分类的级
        // 如果这个数组的长度为1 那么代表添加的是2及分类
        // 如果这个数组的长度为2 那么代表添加的是3级分类
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        // 如果数组为空那么添加的就是一级分类
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 添加分类按钮
    async addCate () {
      // 需要提交到服务器的就是addCateForm
      // console.log(this.addCateForm)
      // 校验__
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请输入分类')
        // 发起请求
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        // console.log(res)
        if (res.meta.status !== 201) return this.$message.error('添加分类失败')
        this.$message.success('添加分类成功')
        // 重新获取分类列表
        this.getAllCategories()
        // 关闭对话框
        this.addCateDialogVisible = false
      })
    },
    // 删除分类按钮
    async deleteCate (id) {
      console.log(id)
      const { data: res } = await this.$http.delete(`categories/:${id}`)
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error('删除分类失败')
      this.$message.success('删除分类成功')
      // 重新获取分类列表
      this.getAllCategories()
    }
  }
}
</script>
