<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 警告框 -->
      <el-alert
        title="注意:只允许为第三级的分类设置参数"
        type="warning"
        show-icon
        :closable="false">
      </el-alert>
    </el-card>
    <el-row>
      <el-col>
        <span>选择商品分类 : </span>
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
        :options="cateList"
        :props="cascaderProps"
        change-on-select
        clearable
        @change="parentCatChange"
        ></el-cascader>
      </el-col>
    </el-row>
    <!-- 标签页组件 -->
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="动态参数" name="many">
        <!-- 按钮 -->
        <el-button type="primary" :disabled="isButtonDisabled">添加参数</el-button>
        <!-- 表格 -->
        <el-table  border="" :data="mangTableData" stripe style="width: 100%">
            <el-table-column type="index"  label=""></el-table-column>
            <el-table-column type="expand"  label=""></el-table-column>
            <el-table-column prop="attr_vals" label="参数名称"></el-table-column>
            <el-table-column label="操作"></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态属性" name="only">
        <!-- 按钮 -->
        <el-button type="primary" :disabled="isButtonDisabled">添加属性</el-button>
        <!-- 表格 -->
        <el-table  border="" :data="onlyTableData" stripe style="width: 100%">
            <el-table-column type="index"  label=""></el-table-column>
            <el-table-column type="expand"  label=""></el-table-column>
            <el-table-column prop="attr_name" label="属性名称"></el-table-column>
            <el-table-column label="操作"></el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>
<script>
export default {
  data () {
    return {
      selectedKeys: [],
      cateList: [],
      cascaderProps: {
        // 当这一项被选中时,放入selectedKeys数组中的值
        value: 'cat_id',
        // 页面级联选择器显示的值
        label: 'cat_name',
        // 子级
        children: 'children',
        // 如何触发
        expandTrigger: 'hover'
      },
      // 默认激活的tabs页
      activeName: 'many',
      mangTableData: [],
      onlyTableData: []
    }
  },
  created () {
    // 当vue实例创建的时候就获取所有分类
    this.getcateList()
  },
  methods: {
    async getcateList () {
      const { data: res } = await this.$http.get(this.$api.cateApi)
      if (res.meta.status !== 200) return this.$message.error('获取分类数据失败')
      this.cateList = res.data
    },
    // 当选择后触发
    parentCatChange () {
      // 调用获取参数的函数
      this.getParamsData()
    },
    // 这个函数专门用来获取参数__
    async getParamsData () {
      // 只允许在三级分类下添加,显示参数
      // console.log(this.selectedKeys)
      if (this.selectedKeys.length !== 3) {
        this.$message.error('一定要选择3级分类')
        this.selectedKeys = []
        return false
      }
      // 向服务器发送请求,获取改三级分类下的动态静态参数
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })
      if (res.meta.status !== 200) return this.$message.error('获取参数列数据表失败')
      // 成功
      // console.log(res.data)
      if (this.activeName === 'many') {
        this.mangTableData = res.data
        console.log(this.mangTableData)
      } else {
        this.onlyTableData = res.data
      }
    },
    // tabs切换的事件 可以让在切换的时候得到参数
    handleClick () {
      this.getParamsData()
    }
  },
  // 计算属性____
  computed: {
    // 根据选择项,计算出该按钮可不可以显示
    isButtonDisabled () {
      // 如果selectedKeys元素是1或者2 那么代表不是选择3级分类,那么返回true
      // 如果selectedKeys里面的个数是3 那么就是false 按钮不能用
      return this.selectedKeys.length !== 3
    },
    // 计算这个级联选择器的最后一个id
    cateId () {
      if (this.selectedKeys.length === 3) {
        // 直接返回第三个元素
        return this.selectedKeys[this.selectedKeys.length - 1]
      }
      return null
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-row{
    margin-top: 15px;
  }
</style>
