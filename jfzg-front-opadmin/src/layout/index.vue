<template>
  <div :class="classObj" class="app-wrapper">
    <section>
      <sidebar class="sidebar-container" />
      <div
        :class="[{hasTagsView:needTagsView } , checkMenu ?  'shrinkWidth':  'upgradeWidth']"
        class="main-container"
      >
        <div :class="{'fixed-header':fixedHeader}">
          <tags-view v-if="needTagsView" />
        </div>
        <app-main />
      </div>
      <!-- 退出 -->
      <FDialog ref="dialog" :config="exitDialog" @confirm="exitFn" />
    </section>
  </div>
</template>
<script>
import { AppMain, Sidebar, TagsView } from "./components";
import { mapState } from "vuex";

import FDialog from "@/components/FDialog";

export default {
  name: "Layout",
  components: {
    AppMain,
    Sidebar,
    TagsView,
    FDialog,
  },
  computed: {
    ...mapState({
      sidebar: (state) => state.app.sidebar,
      device: (state) => state.app.device,
      showSettings: (state) => state.settings.showSettings,
      needTagsView: (state) => state.settings.tagsView,
      fixedHeader: (state) => state.settings.fixedHeader,
    }),
    classObj() {
      return {
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
      };
    },
    checkMenu() {
      return this.$store.state.menu.checkMenu;
    },
  },
  watch: {
    checkMenu(value) {
      console.log(value);
    },
  },
  data() {
    return {
      unReadNum: 0,
      message: {
        visible: false,
        list: [],
        total: 0,
      },
      username: this.$store.state.user.name
        ? this.$store.state.user.name
        : "管理员",
      exitDialog: {
        title: "温馨提示",
        info: "确认执行此操作？退出后将无法浏览相关信息",
      },
    };
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch("app/closeSideBar", {
        withoutAnimation: false,
      });
    },

    set() {
      let route = this.$store.getters.permission_routes[7];
      this.$router.push(route.path);
      this.$store.dispatch("permission/getExtraRoute", route);
    },

    exit() {
      this.$refs["dialog"].isOpen = true;
    },
    exitFn() {
      this.$store.dispatch("user/logout").then(() => {
        location.reload();
      });
    },
  },

  mounted() {},
};
</script>
<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }

  > header {
    position: fixed;
    width: 100%;
    height: $headerHalf;
    background: #659fff;
    // background-image: linear-gradient(90deg, #5C8DF7 0%, #2F54EB 100%);
    box-shadow: 0 1px 4px 0 rgba(0, 21, 41, 0.12);
    overflow: hidden;
    z-index: 1000;

    > div {
      height: $headerHalf;

      &:nth-child(1) {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 20px;
      }
    }

    .logo {
      position: relative;
      z-index: 100;
      font-size: 22px;
      color: #fff;
      margin-right: 30px;
      white-space: nowrap;
      img {
        display: block;
        height: 32px;
      }
    }

    .avatar-container {
      .avatar-wrapper {
        //position: relative;
        display: flex;
        align-items: center;
        min-width: 135px;
        color: #fff;

        .user-avatar {
          cursor: pointer;
          width: 25px;
          height: 25px;
          border-radius: 25px;
          border: 0.5px solid #fff;
        }

        span {
          cursor: pointer;
          padding: 0 8px;
          font-size: 12px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          // position: absolute;
          // right: -20px;
          // top: 25px;
          font-size: 12px;
        }
      }
    }
  }

  > section {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: $headerHalf;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
  box-sizing: content-box;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}

.el-dropdown-menu {
  width: 130px;
  text-align: center;

  &__item {
    padding: 0;
    overflow: hidden;
  }
}

i,
em {
  font-style: normal;
}

.msg-notice {
  display: block;
  list-style: none;
}

.msg-notice > li {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #efefef;
  padding: 15px 0;
}

.msg-notice > li:last-child {
  border-bottom: 0;
}

.msg-notice > li > div {
  font-size: 14px;
}

.msg-notice > li > div:first-child {
  display: flex;
}

.msg-notice > li > div:first-child > div:first-child {
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: #efefef;
}

.msg-notice > li > div:first-child > div:nth-child(2) {
  width: 516px;
  margin-left: 20px;
}

.msg-notice > li > div:first-child > div:nth-child(2) h5 {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
}

.msg-notice > li > div:first-child > div:nth-child(2) p {
  margin-top: 5px;
  line-height: 1.3;
  color: rgba(0, 0, 0, 0.45);
}

.msg-notice > li > div:nth-child(2) {
  color: #c7c7c7;
}
</style>
