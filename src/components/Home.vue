<template>
  <div>
    <el-button type="info" @click="loginout">退出</el-button>
  </div>
</template>
<script>
export default {
  name: 'Hoem',
  // 登出 清空 token 后跳转到登录页
  methods: {
    loginout () {
      // 清空 token?
      window.sessionStorage.clear()
      // 跳转到登录页
      this.$router.push('/login')
      this.$message.success('退出成功')
    }
  }
}
</script>
<style lang="scss">

</style>
