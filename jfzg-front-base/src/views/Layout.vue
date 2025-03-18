<template>
  <div id="masterRoot">
    <div class="main-container">
      <!-- 登陆后视图 -->
      <template>
        <!-- 右侧视图 -->
        <div class="main-container-content">
          <!-- 上部导航区 -->
          <!-- {{ $route.fullPath }} -->
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
                <tags-view />
              </div>

              <div
                :class="
                  $route.fullPath.includes('View') ||
                  ($route.fullPath.includes('Add') &&
                    !$route.fullPath.includes('planProjectView'))
                    ? 'wl-scroll scrollY'
                    : 'wl-scroll'
                "
                :style="{ height: boxHeight + 'px' }"
              >
                <div class="app-view-box" id="subapp-viewport"></div>
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
import { start } from "qiankun";
import FixedBtns from "./FixedBtns";

export default {
  name: "rootView",
  components: {
    TheMenu,
    TheNav,
    TagsView,
    FixedBtns,
  },
  data() {
    return {
      needTagsView: true,
      boxHeight: "",
      loadMask: null,
      subApp: [
        "plan",
        "shenbao",
        "decl",
        "impl",
        "check",
        "dis",
        "expert",
        "final",
        "service",
        "radial",
      ],
    };
  },
  computed: {
    appViewBoxHeight() {
      return this.$store.getters.appViewBoxHeight || 100;
    },
    isLoadApp() {
      return this.$store.state.app.isLoadApp;
    },
    isNotLoadRequest() {
      return this.$store.state.app.loading == 0;
    },
  },
  watch: {
    $route: {
      handler(val) {
        // this.getWorkflowHeight(val);
      },
    },
    isLoadApp: function (n) {
      // console.log('isLoadApp = ', n)
      if (n && this.isNotLoadRequest) {
        this.loadMask = this.$loading({
          lock: true,
          target: "masterRoot",
        });
      } else {
        if (this.loadMask) {
          this.loadMask.close();
        }
      }
    },
    isNotLoadRequest: function (n) {
      // console.log('isNotLoadRequest = ', n)
      if (n && this.isLoadApp) {
        this.loadMask = this.$loading({
          lock: true,
          target: "masterRoot",
        });
      } else {
        if (this.loadMask) {
          this.loadMask.close();
        }
      }
    },
  },
  mounted() {
    if (!window.qiankunStarted) {
      this.$nextTick(() => {
        window.qiankunStarted = true;
        start();
        // start({
        //   sandbox: {
        //     experimentalStyleIsolation: true, // 必须开启
        //     strictStyleIsolation: true,
        //   },
        //   prefetch: false,
        //   excludeAssetFilter: (url) => {
        //     // 过滤动态加载的全局样式
        //     return url.includes("global.css");
        //   },
        // });
      });
    }
    // this.getWorkflowHeight();
  },
  methods: {
    getWorkflowHeight(val) {
      this.$nextTick(() => {
        setTimeout(() => {
          let workflowHeight = 0;
          let container = document.querySelector(".workflow");
          let other = document.querySelector(".workflow.flow");
          if (container) {
            workflowHeight = container.offsetHeight;
          }
          if (other) {
            workflowHeight = 0;
          }
          if (
            val.fullPath.includes("planProjectEdit") ||
            val.fullPath.includes("planProjectView")
          ) {
            workflowHeight += 0;
          } else {
            workflowHeight += 18;
          }
          this.boxHeight =
            window.innerHeight -
            document.querySelector(".the-nav").offsetHeight -
            document.querySelector(".tabs_box").offsetHeight -
            workflowHeight;
        }, 50);
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
  }

  .main-container-view {
    padding: 10px 10px 10px 10px;
    width: calc(100% - 220px);
    height: 100%;
    box-sizing: border-box;

    > .wl-scroll {
      width: 100%;
      height: calc(100% - 36px);
      //height: 100%;
      border-radius: 0px 8px 8px 8px;
      // background: #fff;
      // overflow-x: hidden;
      background-color: #fff;
      // overflow-y: hidden;
      overflow: auto;
      // padding: 24px 0;
      // margin: 24px 0;
    }
    > .scrollY {
      overflow-y: scroll !important;
    }

    .app-view-box {
      height: 100%;
      width: 100%;
      box-sizing: border-box;
    }
  }
}
</style>
