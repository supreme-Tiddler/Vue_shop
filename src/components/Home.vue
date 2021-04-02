<template>
  <el-container class="home_container">
    <!-- 头部区域 -->
    <el-header>
      <!-- 标题 -->
      <span>电商后台管理系统</span>
      <el-button type="info" @click="loginout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse?'64px':'200px'">
        <!-- 收缩导航的按钮 -->
        <div class="toggle_button" @click="toggleCollapse">| | |</div>
        <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        background-color="rgb(49,53,65)"
        text-color="#fff"
        unique-opened
        :collapse="isCollapse"
        active-text-color="rgb(64,158,255)">
          <!-- 一级菜单 -->
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <!-- 一级菜单模板 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
              <!-- 二级菜单 -->
              <el-menu-item :index="subItem.id+''" v-for="subItem in item.children" :key="subItem.id">
                 <!-- 二级菜单模板 -->
                 <template slot="title">
                    <!-- 二级图标 -->
                    <i class="el-icon-menu"></i>
                    <!--二级 文本 -->
                    <span>{{subItem.authName}}</span>
                  </template>
              </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主题 -->
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  name: 'Hoem',
  data () {
    return {
      menuList: null,
      iconsObj: {
        125: 'el-icon-s-custom',
        103: 'el-icon-mouse',
        101: 'el-icon-wallet',
        102: 'el-icon-postcard',
        145: 'el-icon-pie-chart'
      },
      // 默认打开侧边菜单栏
      isCollapse: false
    }
  },
  // 当vue实例已经创建后
  created () {
    this.getMenuList()
  },
  // 登出 清空 token 后跳转到登录页
  methods: {
    loginout () {
      // 清空 token?
      window.sessionStorage.clear()
      // 跳转到登录页
      this.$router.push('/login')
      this.$message.success('退出成功')
    },
    // 当vue实例已经创建后 需要调用的函数 获取菜单数据
    async getMenuList () {
      // 获取数据并解构
      // 解构对象 得到data 变量 并且使用别名 res
      const { data: res } = await this.$http.get('menus')
      // console.log(res)//后台请求过来的数据
      // 如果获取列表失败,直接结束函数,并且提示错误
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据失败')
      }
      // 将数据存储,用于刷新页面
      this.menuList = res.data
      console.log(this.menuList)
    },
    // 收缩侧边栏
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>
<style lang="scss">
  .home_container{
    height: 100%;
  }
  .el-header{
    background-color: rgb(55,61,65);
    color: #fff;
    font-size: 20px;
    display: flex;
    justify-content: space-between;// 两端对齐
    align-items: center;
  }
  .el-aside{
    background-color: rgb(49,53,65);
    .el-menu{
      border-right: none;
    }
  }
  .el-main{
    background-color: rgb(234, 237, 241);
  }
  .toggle_button{
    background-color: rgb(74 , 80, 100);
    text-align: center;
    padding: 5px 0;
    color: #fff;
    cursor: pointer;
  }
</style>
