<template>
  <el-container class="home-container">
  <el-header>
      <div class="info">
        商品后台管理系统
      </div>
      <el-button type="info" @click="logout">退出</el-button>
  </el-header>
  <el-container>
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCol">|||</div>
        <!-- 侧边栏菜单区域 -->
    <el-menu
      class="el-menu-vertical-demo"
      background-color="#333744"
      text-color="#fff"
      active-text-color="#409bff"
      unique-opened
      :collapse='isCollapse'
      :collapse-transition ="false"
      :default-active="activePath"
      router
      >
      <!-- 一级菜单的模板区域 -->
      <el-submenu :index="item.id+''" v-for ="item in menulist" :key="item.id">
        <template slot="title">
          <!-- 图标 -->
          <i :class="iconsObj[item.id]"></i>
          <!-- 文本  -->
          <span>{{item.authName}}</span>
        </template>
        <!-- 二级菜单 -->
          <el-menu-item :index="'/'+subitem.path" v-for="subitem in item.children" :key="subitem.id" @click="_handlePath('/'+subitem.path)">
            <template slot="title">
          <!-- 图标 -->
          <i class="el-icon-menu"></i>
          <!-- 文本  -->
          <span>{{subitem.authName}}</span>
            </template>
          </el-menu-item>
      </el-submenu>
    </el-menu>
    </el-aside>
    <el-main>
        <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      menulist: [],
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      // 是否折叠
      isCollapse: false,
      // 被激活的链接地址
      activePath: ''
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('./Login')
    },
    // 请求menu数据
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
      console.log(res)
    },
    // 点击处理折叠
    toggleCol() {
      this.isCollapse = !this.isCollapse
    },
    // 处理连接地址
    _handlePath(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang='less' scoped>
.home-container{
    height: 100%;
}
.info{
    font-size: 26px;
    color: white;
    font-weight: bold;
    line-height: 60px;
}
.el-header{
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
}
.el-aside{
    background-color: #333744;
    .el-menu{
        border-right:none
    }
}
.el-main{
     background-color:#eaedf1
}
.iconfont{
   margin-right: 10px;
}
.toggle-button{
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
}
</style>
