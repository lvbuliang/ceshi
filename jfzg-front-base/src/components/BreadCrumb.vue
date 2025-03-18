<template>
  <div>
    <el-tabs
      v-model="tabValue"
      type="border-card"
      closable
      @tab-remove="remove"
      @tab-click="change(tabValue)"
      :class="{ navTabs: true, hideBtnTab: tag.length == 1 }"
    >
      <el-tab-pane
        :key="item.id"
        v-for="item in tag"
        :label="item.title"
        :name="item.id"
      >
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { routerGo } from "@/utils/utils.js"; // 引入跨应用路由跳转
import { mapGetters } from "vuex"; // 引入状态共享
import store from "@/store";
export default {
  data() {
    return {
      breadList: [],
      inout: "12312",
      tabValue: "",
    };
  },
  computed: {
    // 导入vuex菜单数据，菜单折叠状态
    ...mapGetters(["bread", "activeTag", "tag"]),
  },
  editableTabsValue: "",
  watch: {
    tag: {
      handler(newVal) {
        console.log("BreadCrumb.watch.tag", newVal);
      },
      deep: true,
    },
    activeTag: {
      handler(newVal) {
        console.log("BreadCrumb.watch.activeTag", newVal);
        this.tabValue = newVal.id;
      },
    },
  },
  mounted() {
    if (this.activeTag && JSON.stringify(this.activeTag) != "{}") {
      console.log(this.activeTag, "this.activeTag");
      this.tabValue = this.activeTag.id;
    }
  },
  methods: {
    handleLink(item) {
      console.log("handleLink", item.url);
      routerGo(item.url, item.title);
    },
    remove(id) {
      if (this.tag.length) {
        let index = this.tag.indexOf(this.tag.filter((d) => d.id == id)[0]);
        this.tag.splice(index, 1);
        sessionStorage.setItem("tag", JSON.stringify(this.tag));
        console.log(this.activeTag.id , 'this.activeTag.id');
        console.log(id , 'removeId');
        if (this.tabValue == id) {
          console.log(this.tag);
          this.tabValue = this.tag[this.tag.length - 1].id;
          console.log(this.tabValue, "this.tabValue");

          // this.activeTag = this.tag[this.tag.length - 1];
          store.dispatch("tag/setActiveTag", this.activeTag);
          sessionStorage.setItem(
            "activeTag",
            JSON.stringify(this.tag[this.tag.length - 1])
          );
        }
      }
    },
    change(id) {
      let link;
      this.tag.map((item) => {
        console.log(item);
        if (item.id == id) {
          link = item;
        }
      });
      console.log(link, "link");
      if (link) {
        this.handleLink(link);
      }
    },
  },
};
</script>
<style lang="scss">
.navTabs {
  border: none;
  box-shadow: none;
  background: transparent;
  .el-tabs__header {
    border: none;
    background: transparent;
    .el-tabs__nav-wrap {
      background-color: transparent;
      .el-tabs__item {
        background: #7f91a7;
        border-radius: 8px 8px 0px 0px;
        color: #fff;
        height: 32px;
        line-height: 32px;
        &:hover {
          color: #fff;
        }
      }
      .is-active {
        background-color: #fff;
        color: #333;
        &:hover {
          color: #333;
        }
      }
    }
  }
  .el-tabs__content {
    padding: 0 !important;
  }
}
.hideBtnTab {
  .el-tabs__nav {
    .el-icon-close {
      display: none;
    }
  }
}
</style>
