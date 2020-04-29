<template>
  <el-container class="home_container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="./../assets/logo.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 左侧区域 -->
      <el-aside :width="isCollapse ? '64px':'200px'">
        <!-- 折叠与展开按钮 -->
          <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 左侧导航区域 -->
        <el-menu router :collapse="isCollapse" :collapse-transition="false" unique-opened :default-active="activePath" background-color="#333744" text-color="#fff" active-text-color="rgb(64, 158, 255)">
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="menuIconList[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index=" '/' + subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/' + subItem.path)">
              <i class="el-icon-menu"></i>
              <span>{{subItem.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主体区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  name: 'home',
  data () {
    return {
      // 左侧菜单
      menuList: [],
      // 左侧菜单图标
      menuIconList: {
        125: 'iconfont icon-users',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      // 左侧导航是否展开
      isCollapse: false,
      // 当前激活菜单的地址
      activePath: ''
    }
  },
  created () {
    this.getMunuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    // 退出
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取左侧菜单数据
    async getMunuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
      // console.log(res)
    },
    // 左侧导航的切换与展开
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    // 保存当前激活菜单的地址
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>
<style lang="less" scoped>
.home_container{
  height: 100%;
}
.el-header{
  background: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  >div{
    display: flex;
    align-items: center;
    >img{
      width: 50px;
      height: 50px;
      border: 1px solid #eee;
      background: #fff;
      border-radius: 50%;
    }
    >span{
      font-size: 20px;
      color: #fff;
      padding-left: 10px;
    }
  }
}
.el-aside{
  background: #333744;
  .el-menu{
    border-right: 0px;
  }
}
.el-main{
  background: #eaedf1;
}
.iconfont{
  margin-right: 8px;
}
// 折叠与展开按钮
.toggle-button{
  background: #4a5064;
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: #fff;
  letter-spacing: 2px;
  cursor: pointer;
}
</style>
