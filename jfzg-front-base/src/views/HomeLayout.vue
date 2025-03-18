<template>
  <div id="masterRoot">
    <div class="main-container">
      <!-- 登陆后视图 -->
      <template v-if="hasToken">
        <!-- 右侧视图 -->
        <div class="main-container-content">
          <!-- 上部导航区 -->
          <the-nav />
          <div class="container">
            <!-- 左侧菜单区 -->
            <the-menu class="main-menu-box" />

            <!-- 子应用渲染区 -->
            <div
              :class="{ hasTagsView: needTagsView }"
              class="main-container-view"
            >
           
              <div v-if="$route.fullPath !== '/base/home'">
                <tags-view  />
          </div>
              <div
                class="wl-scroll"
                :class="{ sandTable_layout: $route.name === 'sandTable' }"
              >
                <div class="app-view-box">
                  <router-view></router-view>
                </div>
              </div>
            </div>
            <FixedBtns />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import TheMenu from "@/components/TheMenu.vue";
import TheNav from "@/components/TheNav.vue";
import TagsView from "@/components/Tabs.vue";
// import TagsView from "@/components/BreadCrumb.vue";
import { start } from "qiankun";
import FixedBtns from "./FixedBtns";

export default {
  name: "rootView",
  components: {
    TheMenu,
    TheNav,
    TagsView,
    FixedBtns,
    // BreadCrumb,
  },
  data() {
    return {
      needTagsView: true,
      boxHeight: "",
    };
  },
  computed: {
    appViewBoxHeight() {
      return this.$store.getters.appViewBoxHeight || 100;
    },
    hasToken() {
      return !!this.$store.getters.token;
    },
  },
  watch: {
    $route: {
      handler(val) {
        this.getWorkflowHeight();
      },
    },
  },

  mounted() {
    if (!window.qiankunStarted) {
      this.$nextTick(() => {
        window.qiankunStarted = true;
        start();
//         start({
//   sandbox: {
//     experimentalStyleIsolation: true, // 必须开启
//     strictStyleIsolation: true
//   },
//   prefetch: false,
//   excludeAssetFilter: url => {
//     // 过滤动态加载的全局样式
//     return url.includes('global.css');
//   }
// });
      });
    }
    this.getWorkflowHeight();
  },
  beforeDestroy() {},
  methods: {
    getWorkflowHeight() {
      this.$nextTick(() => {
        let workflowHeight = 20;
        // let workflowHeight = 88;
        this.boxHeight =
          window.innerHeight -
          document.querySelector(".the-nav").offsetHeight -
          workflowHeight;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.main-container {
  .main-menu-box {
    position: relative;
    display: flex;
    background: $header-background;
    color: #ffffff;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
  }
}
#masterRoot {
  height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f0f2f5;
  color: #2c3e50;
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
  // background: url('../assets/images/bg/h-bg.png') right top no-repeat;
  .container {
    display: flex;
    height: calc(100% - 66px) !important;
    // background: url('../assets/images/bg/c1-bg.png') left bottom no-repeat;
    .fixedBtns {
      position: fixed;
      right: 0;
      top: 50%;
      margin-top: -25px;
      .knowledgeBaseDialog {
        width: 454px;
        height: 128px;
        background: #ffffff;
        box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        position: absolute;
        padding: 20px;
        left: -460px;
        top: 12px;
        ::v-deep {
          .el-input {
          }
          .el-input-group__append {
            padding: 0 8px 0 8px;

            width: 40px;
            height: 40px;
            background: #ffffff;
            border-radius: 0px 8px 8px 0px;
            border: 1px solid #e5e5e5;
            border-left: none;
          }
          .el-input__inner {
            height: 40px;
            line-height: 40px;
          }
        }
        header {
          display: flex;
          align-items: center;
          margin-bottom: 14px;
          img {
            width: 22px;
          }
          h3 {
            font-size: 18px;
            font-weight: 600;
            color: #333333;
            margin-left: 6px;
          }
        }
      }
      ul {
        li {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 50px;
          height: 50px;
          background: #1890ff;
          cursor: pointer;
          position: relative;
          img {
            width: 28px;
          }
          &:nth-of-type(1) {
            border-radius: 8px 0px 0px 0px;
          }
          &:nth-last-of-type(1) {
            border-radius: 0px 0px 0px 8px;
          }
          &:hover::after {
            position: absolute;
            top: 0;
            left: 0;
            content: "";
            width: 50px;
            height: 50px;
            background: #ffffff;
            opacity: 0.2;
          }
        }
      }
    }
  }
  .main-container-view {
    padding: 10px 10px 10px 10px;
    width: calc(100% - 220px);
    height: 100%;
    box-sizing: border-box;
    > .wl-scroll {
    height: 100%;
      width: 100%;
      border-radius: 0px 8px 8px 8px;
      // height: 100%;
      // height: calc(100% - 36px);
      // background: #fff;
      overflow-x: hidden;
      overflow-y: hidden;
      // padding: 24px;
    }
    .app-view-box {
      // width: 100%;
      height: 100%;
      // position: relative;
      // box-sizing: border-box;
    }
    .sandTable_layout {
      padding: 0;
    }
  }
}
</style>
