<template>
  <div id="app">
    <div id="app-content">
      <aside>
        <el-menu
          :router="true"
          :collapse="isCollapse"
          class="my-style-el-menu"
          default-active="/home"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">
          <el-menu-item index="/home">
            <i class="el-icon-menu"></i>
            <span slot="title">首页</span>
          </el-menu-item>
        </el-menu>
      </aside>
      <div class="right-aside">
        <header>
          <i @click="isCollapse = !isCollapse" style="cursor: pointer" class="el-icon-s-operation"/>
          <el-avatar icon="el-icon-user-solid" size="medium" />
        </header>
        <section class="main-app-content">
          <router-view/>
        </section>
      </div>
    </div>
    <div id="login"></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isCollapse: false
    }
  }
}
</script>
<style lang="scss">
  body, html, ul, li {
    margin: 0;
    padding: 0;
  }

  div, aside, section, nav, header {
    box-sizing: border-box;
  }

  #app{
    height: 100vh;
    overflow-y: hidden;
  }
  #app-content {
    display: flex;

    aside {
      height: 100vh;
      background-color: #545c64;

      .my-style-el-menu {
        &:not(.el-menu--collapse) {
          width: 200px;
        }
        border-right: 0
      }
    }

    .right-aside {
      flex-grow: 1;
      width: 0;

      header {
        padding: 0 20px 0 5px;
        align-items: center;
        height: 40px;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #D8D8EF;
      }

      section.main-app-content {
        height: calc(100vh - 40px);
        padding: 20px;
        background-color: #F1F6F9;
        overflow: auto;
      }
    }
  }
</style>
