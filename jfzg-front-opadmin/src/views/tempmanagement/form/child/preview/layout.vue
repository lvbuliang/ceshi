<template>
  <div id="root" class="main-container">
    <div class="main-container-content">
      <!-- 上部导航区 -->
      <the-nav v-on="$listeners" />
      <div class="container">
        <!-- 左侧菜单区 -->
        <the-menu :activeIndex.sync="activeIndex" class="main-menu-box" />

        <!-- 子应用渲染区 -->
        <div class="main-container-view">
          <BreadCrumb></BreadCrumb>
          <div class="content">
            <preview v-bind="$attrs" :activeIndex="activeIndex" />
          </div>
          <!-- <el-scrollbar class="wl-scroll">
                    </el-scrollbar>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TheMenu from './TheMenu.vue'
import TheNav from './TheNav.vue'
import BreadCrumb from './BreadCrumb.vue'
import preview from './preview.vue'
export default {
  name: 'rootView',
  components: {
    TheMenu,
    TheNav,
    BreadCrumb,
    preview,
  },
  data() {
    return {
      activeIndex: 1,
    }
  },
}
</script>

<style lang="scss" scoped>
$header-background: rgba(25, 118, 255, 0.8);
.main-container {
  .main-menu-box {
    display: flex;
    background: $header-background;
    color: #ffffff;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
  }
}
</style>
<style lang="scss" scoped>
$header-background: rgba(25, 118, 255, 0.8);
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
}
.main-container {
  display: flex;
  width: 100%;
  height: 100%;
}
.main-container-content {
  flex-grow: 1;
  display: flex;
  flex-flow: column;
  overflow: hidden;
  background: url('~@/assets/images/bg/h-bg.png') right top no-repeat;
  .container {
    display: flex;
    height: 100%;
    background: url('~@/assets/images/bg/c1-bg.png') left bottom no-repeat;
  }
  .main-container-view {
    padding: 10px 24px;
    width: 100%;
    height: 100%;
    // background: $main-base-color;
    box-sizing: border-box;
    position: relative;
    .content {
      background-color: #fff;
      height: calc(100% - 100px);
      overflow-y: scroll;
    }
    > .wl-scroll {
      width: 100%;
      height: calc(100% - 24px);
      border-radius: 0px 8px 8px 8px;
      // background: #fff;
      .el-scrollbar__wrap {
        overflow-x: hidden;
      }
    }

    .app-view-box {
      width: 100%;
      padding: 12px;
      box-sizing: border-box;
    }
  }
}
</style>
