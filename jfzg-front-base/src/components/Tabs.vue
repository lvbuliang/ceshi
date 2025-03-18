<template>
  <div class="tabs_box" v-if="$store.state.menu.htmlData !== '数据看板'">
    <div>
      {{ $store.state.menu.htmlData }}
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { routerGo } from "@/utils/utils.js"; // 引入跨应用路由跳转

export default {
  data() {
    return {

    };
  },
  computed: {
    ...mapState({
      menus: (state) => state.menu.menu,
      htmlData: (state) => state.menu.menu,
      tabsList: (state) => state.tabs.tabsList,
      userInfo: (state) => state.app.userInfo,
    }),
    currentPage: {
      get() {
        return this.$store.state.tabs.currentPage;
      },
      set() {},
    },
  },
  created() {},
  mounted() {
    

    if (sessionStorage.getItem("tabsList")) {
      this.$store.commit(
        "tabs/CHANGE_TABS_LIST",
        JSON.parse(sessionStorage.getItem("tabsList"))
      );
    }
    if (sessionStorage.getItem("CURRENT_PAGE")) {
      this.$store.commit(
        "tabs/UPDATE_CURRENT_PAGE",
        sessionStorage.getItem("CURRENT_PAGE")
      );
    }
  },

  methods: {

    isEqualCurrentPage(item) {
      return item.url == this.currentPage || item.url + "/" == this.currentPage;
    },
    // 获取元素数组下标
    getArrayIndex(arr, obj) {
      for (let index = 0; index < arr.length; index++) {
        const item = arr[index];
        if (item.url === obj) {
          return index;
        }
      }
      return -1;
    },
    tabClick(item) {
      if (this.isEqualCurrentPage({ url: item.name })) {
        return false;
      } else {
        this.goto(item.label, item.name, {
          title: item.label,
          url: item.name,
        });
      }
    },
    // 跳转tabs标签
    handleClick(item) {
      if (this.isEqualCurrentPage(item)) {
        return false;
      } else {
        this.goto(item.title, item.url, item);
      }
    },
    goto(title, href, tagParam) {
      this.$store.commit("tabs/UPDATE_TABS_LIST", tagParam);
      this.$store.commit("tabs/UPDATE_CURRENT_PAGE", tagParam.url);
      routerGo(href, title);
    },
    // 删除tabs标签
    removeTab(item) {
      // 获取当前要删除的tabs的位置
      let indexOf = this.getArrayIndex(this.tabsList, item);
      if (
        this.tabsList[indexOf].meta &&
        this.tabsList[indexOf].meta.type == "add" &&
        !this.tabsList[indexOf].meta.isSave
      ) {
        this.$SrUtils.showConfirmMessage.call(this, {
          title: "提示",
          content: "您要保存当前编辑的数据吗？如果不保存，这些数据将会丢失",
          okFun: () => {
            setGlobalState({
              ignore: "SaveForm",
              msg: "主应用请求保存表单",
            });
            this.delTab(item, indexOf);
          },
          cancelFun: () => {
            this.delTab(item, indexOf);
          },
        });
      } else {
        this.delTab(item, indexOf);
      }
    },
    delTab(item, indexOf) {
      if (this.isEqualCurrentPage({ url: item })) {
        // 如果删的是当前页
        if (indexOf == this.tabsList.length - 1) {
          // 要删除的是最后一项
          this.$store.dispatch("tabs/REMOVE_LAST_TAB", {
            indexOf,
          });
        } else {
          this.$store.dispatch("tabs/REMOVE_ANY_TAB", {
            indexOf,
          });
        }
      } else {
        this.$store.dispatch("tabs/REMOVE_NOT_CURRENT_TAB", {
          indexOf,
        });
      }
    },
    closeOther() {
      let tabsList = this.tabsList.filter((res) => {
        return res.url === this.currentPage;
      });
      this.$store.commit("tabs/CHANGE_TABS_LIST", tabsList);
    },
  },
  watch: {
    tabsList(n) {
      sessionStorage.setItem("tabsList", JSON.stringify(n));
    },
  },
};
</script>
<style lang="scss" scoped>
.tabs_box {
  display: flex;
  align-items: flex-end;
  margin-bottom: 1px;
  height: 35px;
  line-height: 35px;
  background: white;
  font-weight: bold;
  font-size: 14px;
  padding-left: 20px;
  .el-tabs {
    width: calc(100% - 32px);
  }
  .more_popover {
    height: 32px;
    width: 24px;
    line-height: 32px;
    display: inline-block;
    margin-left: 8px;
  }

  .tabs_title {
    width: 120px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  ::v-deep .el-tabs__content {
    padding: 0 !important;
  }
}
// 悬浮框里的样式
.popover_container {
  .close_tabs {
    display: inline-block;
    width: 100%;
    height: 45px;
    line-height: 45px;
    padding: 0 20px;
    color: #333333;
    cursor: pointer;
    border-top: 1px solid #efefef;
  }

  .infinite-list {
    max-height: 356px;
    overflow-y: auto;
  }

  .infinite-list-item {
    height: 34px;
    line-height: 34px;
    padding: 0 20px;
    cursor: pointer;
    &:hover {
      background: #f7f7f7;
    }
  }
}

// tabs页签样式
.el-tabs {
  ::v-deep .el-tabs__header {
    margin: 0 !important;
    border-bottom: none;
    .el-tabs__nav {
      display: flex;
      align-items: flex-end;
    }
    .el-tabs__nav-wrap.is-scrollable {
      padding: 0 !important;
    }
    .el-tabs__item {
      height: 32px;
      line-height: 32px;
      width: 160px;
      background: #dfe8f4;
      border-radius: 8px 8px 0px 0px;
      color: #333333;
      flex-grow: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      padding: 0 !important;
      font-weight: 400;
      border: none;
      &.is-active {
        background-color: #fff;
        height: 40px;
        box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.1);
        &::before {
          content: "";
          width: 8px;
          height: 8px;
          background: url("../assets/images/tab/l-bg@2x.png");
          background-size: 100% 100%;
          position: absolute;
          left: -8px;
          bottom: -1px;
          z-index: 100;
          opacity: 1;
        }

        &::after {
          content: "";
          width: 8px;
          height: 8px;
          background: url("../assets/images/tab/r-bg@2x.png");
          background-size: 100% 100%;
          position: absolute;
          right: -8px;
          left: inherit;
          bottom: -1px;
          z-index: 100;
          opacity: 1;
          display: inline-block !important;
        }

        & + .el-tabs__item {
          &::after {
            display: none;
          }
        }
      }
      &::after {
        content: "";
        width: 1px;
        height: 12px;
        background-color: #000;
        opacity: 0.2;
        position: absolute;
        left: 0px;
      }
      &:first-of-type {
        &::after {
          display: none;
        }
      }

      .el-icon-close {
        position: absolute;
        width: 14px;
        right: 10px !important;
        top: 50%;
        transform: translateY(-50%);
        color: #999;
        font-size: 16px;
        display: none;
        background-color: transparent;
      }
      &:hover {
        .el-icon-close {
          display: inline-block;
        }
      }
      &:only-of-type {
        .el-icon-close {
          display: none;
        }
      }
    }
    .el-tabs__nav {
      border: none;
    }
  }
}
</style>

<style lang="scss">
.tabs_popover {
  padding: 0 !important;
}
.yeqian_popover {
  padding: 6px 8px !important;
  border-radius: 4px !important;
}
</style>
