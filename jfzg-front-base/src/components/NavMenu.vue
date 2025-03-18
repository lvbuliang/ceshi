<template>
  <el-menu
    :default-active="defaultActiveIndex"
    class="el-menu-vertical-demo"
    ref="menu"
    @open="openMenu"
    :unique-opened="uniqueOpened"
    :collapse="isCollapse"
    active-text-color="white"
    background-color="#fff"
    text-color="#696969"
  >
    >
    <menuInfo :menuData="displayMenuList" ref="menuInfoRef"></menuInfo>
  </el-menu>
</template>

<script>
import store from "@/store";
import { mapState } from "vuex";
import { getUserDraftBox } from "@/api/user";
import draftListSkipIndex from "@/utils/draftListSkipIndex.js";
import config from "@/setting.js";
import { routerGo } from "@/utils/utils.js"; // 引入跨应用路由跳转
import menuInfo from "./SideItem.vue";
export default {
  components: { menuInfo },
  data() {
    return {
      draftBoxList: [],
      uniqueOpened: false, //之保持一个菜单打开
      visible: false,
      menuPopVisible: false,
      menuBoxHeight: 0, // 一级菜单容器的高度
      displayMenuCount: 0, // 可以显示的下的一级菜单个数，包括更多按钮
      displayMenuList: [], // 显示的一级菜单
      hideMenuList: [], // 隐藏在浮框的一级菜单
      timer: null,
      isShow: false,
      userInfo: store.getters.userInfo,
      isReduce: false,
      config,
      defaultActiveIndex: "",
      isCollapse: false,
    };
  },

  props: {
    type: {
      type: Number,
      default: 1,
    },
    setFirstOpen: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    "$route.path": {
      handler(newVal) {  
        this.defaultActiveIndex = this.$route.fullPath.split('?')[0];
      },
      immediate: true,
    },
    menus: {
      handler() {
        this.filterMenus();
      },
    },
    //监视teb页更新草稿箱
    tabsList: {
      handler: function (params) {
        if (params) {
          //防抖
          if (this.timer) {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
              this.draftBox();
            }, 200);
          } else {
            this.timer = setTimeout(() => {
              this.draftBox();
            }, 200);
          }
        }
      },
    },
  },
  computed: {
    ...mapState({
      currentModuleName: (state) => state.menu.currentModuleName,
      menus: (state) => state.menu.menu,
      tabsList: (state) => state.tabs.tabsList,
      valId: (state) => state.menu.valId,
      routerVal: (state) => state.menu.routerVal,
      // foldVal: (state) => state.menu.foldVal,
    }),
    draftList() {
      if (this.draftBoxList && this.draftBoxList.length > 0) {
        return this.draftBoxList.length > 99 ? "99+" : this.draftBoxList.length;
      } else {
        return 0;
      }
    },
    currentPage() {
      return sessionStorage.getItem("CURRENT_PAGE");
    },
  },
  mounted() {
    this.getContainerHeight();
    this.filterMenus();
    this.draftBox();
    if (this.userInfo) {
    }
  },
  methods: {
    openMenu(key,indexpath){
      console.log('12121',key);
      sessionStorage.setItem('keys',key)
      this.$store.state.menu.menu.forEach((ele)=>{
        // console.log('12222222222',key,ele.permissionId);
        if(key==ele.permissionId){
          sessionStorage.setItem('isSame',ele.title)
        }
        
      })
      //  console.log('122112',key,indexpath);
       
    },
    // 菜单选择事件
    selectMenu(id) {
      this.$emit("getData", id);
    },
    getContainerHeight() {
      // 顶部菜单的高度
      const theNavHeight = document.querySelector(".the-nav").offsetHeight;
      // 单个一级菜单的高度
      const menuItemHeight = 74;
      // this.menuBoxHeight = window.innerHeight - theNavHeight - 168;
      this.menuBoxHeight = window.innerHeight - theNavHeight;
      // console.log('this.menuBoxHeight = ', this.menuBoxHeight)
      // console.log('this.menuBoxHeight / menuItemHeight = ', (this.menuBoxHeight / menuItemHeight))
      this.displayMenuCount = parseInt(this.menuBoxHeight / menuItemHeight);
    },
    draftListSkip(item) {
      if (draftListSkipIndex[item.permissionCode]) {
        let url = "";
        // 规划
        // if (item.type === 1) {
        url =
          draftListSkipIndex[item.permissionCode] +
          item.id +
          "&projectId=" +
          item.projectId +
          "&templateId=" +
          item.templateId;
        // }
        // // 申报
        // else if (item.type === 2) {

        // }
        let element = {
          url: url,
          title: item.typeName,
        };
        this.$store.commit("tabs/UPDATE_TABS_LIST", element);
        this.$store.commit("tabs/UPDATE_CURRENT_PAGE", element.url);
        this.$router.push({
          path: url,
        });
      }
    },
    isActive(item) {
      if (item.children.length) {
        if (
          item.children
            .map((res) => {
              return this.isActive(res);
            })
            .includes(true)
        ) {
          return true;
        }
      } else {
        if (item.url) {
          if (this.$route.fullPath.startsWith(item.url)) {
            return true;
          } else {
            return false;
          }
        } else {
          return this.$route.fullPath.startsWith(item.routerBase);
        }
      }
    },
    filterMenus(valuse, menuItem) {
      if (!valuse) {
        valuse = this.$route.fullPath;
      }
      if (valuse) {
        for (let i = 0, len = this.menus.length; i < len; i++) {
          let element = this.menus[i];
          if (element.permissionCode === "M001") {
            /* element.url = sessionStorage.getItem("DEFAULT_MENU");
            element.title =
              sessionStorage.getItem("DEFAULT_MENU") === "/base/sandTable"
                ? "沙盘"
                : "工作台"; */
            element.url = "/base/home";
            element.title = "工作台";
          }
          if (menuItem && menuItem.permissionCode) {
            if (menuItem.permissionCode == element.permissionCode) {
              this.$store.commit("menu/UPDATE_MENU_STATE", {
                key: "currentModule",
                value: element,
              });
              if (element.children && element.children.length > 0) {
                this.$store.commit("menu/UPDATE_MENU_STATE", {
                  key: "subMenu",
                  value: element.children,
                });
              } else {
                this.$store.commit("menu/UPDATE_MENU_STATE", {
                  key: "subMenu",
                  value: [],
                });
              }
              break;
            }
          } else {
            if (valuse.startsWith(element.routerBase)) {
              this.$store.commit("menu/UPDATE_MENU_STATE", {
                key: "currentModule",
                value: element,
              });
              if (element.children && element.children.length > 0) {
                this.$store.commit("menu/UPDATE_MENU_STATE", {
                  key: "subMenu",
                  value: element.children,
                });
              } else {
                this.$store.commit("menu/UPDATE_MENU_STATE", {
                  key: "subMenu",
                  value: [],
                });
              }
              break;
            }
          }
        }
      }
      if (this.menus && this.menus.length > 0) {
        // 根据后端返回的tag=1，放到主菜单里，其他的放更多，放不下的时候也在更多
        this.displayMenuList = this.menus.filter((item) => item.tag == 1);
        this.hideMenuList = this.menus.filter(
          (item) => item.tag == 0 || !item.tag
        );

        if (!this.isReduce) {
          if (this.hideMenuList && this.hideMenuList.length > 0) {
            // 有更多按钮，需要把可显示菜单数-1
            this.displayMenuCount -= 1;
            this.isReduce = true;
          }
        }

        // if (this.displayMenuList.length > this.displayMenuCount) {
        //   // 展示的下的主一级菜单
        //   let newDisplayMenuList = this.displayMenuList.slice(
        //     0,
        //     this.displayMenuCount - 1
        //   );
        //   // // 展示不下的主一级菜单
        //   // let moreDisplayMenuList = this.displayMenuList.slice(
        //   //   this.displayMenuCount - 1
        //   // );
        //   this.displayMenuList = newDisplayMenuList;
        //   // this.hideMenuList = moreDisplayMenuList.concat(this.hideMenuList);
        // }
      }
    },
    handleSelect(item) {
      if (item.permissionCode == "M014") {
        // 驾驶舱特殊处理
        window.open(config.baseUrl + "/pmreport/#/all");
        return;
      }
      this.filterMenus(item.routerBase, item);
      let routePath = this.getFirstLeafNode(item);
      if (routePath != "") {
        if (routePath.startsWith("/sub")) {
          // 子系统里的一级菜单
          this.goto(item.module, item.url, item);
        } else {
          this.$router.push(routePath);
        }
      } else {
        this.$emit("showSideMenu");
      }
    },
    goto(title, href, item) {
      // 微服务路由跳转
      let openNewTag = true;
      let newUrl = "";
      let riskAndPro_url = "/subimpl/#/riskAndIssueNew";
      let tabList = JSON.parse(sessionStorage.getItem("tabsList")) || [];
      tabList.forEach((res) => {
        if (res.url.startsWith(`${href}`)) {
          if (href == riskAndPro_url) {
            let obj = tabList.findIndex((item) =>
              item.url.includes(riskAndPro_url)
            );
            if (obj < 0) return;
            let element = {
              url: riskAndPro_url,
              title: "风险问题管理",
            };
            tabList.splice(obj, 1, element);
            sessionStorage.setItem("tabsList", JSON.stringify(tabList));
            newUrl = element.url;
          } else {
            newUrl = res.url;
          }
          openNewTag = false;
        }
      });
      if (openNewTag) {
        this.$store.commit("tabs/UPDATE_TABS_LIST", item);
        this.$store.commit("tabs/UPDATE_CURRENT_PAGE", item.url);
        routerGo(href, title);
      } else {
        routerGo(newUrl, title);
      }
    },
    onClickHideMenu(item) {
      this.menuPopVisible = false;
      this.handleSelect(item);
    },
    getFirstLeafNode(item) {
      if (item.children && item.children.length > 0) {
        return "";
      } else {
        return item.url;
      }
    },
    draftBox() {
      getUserDraftBox().then((res) => {
        if (res && res.success) {
          this.draftBoxList = res.data;
        }
      });
    },
  },
};
</script>
<style scoped lang="scss">
.el-menu-vertical-demo.el-menu {
  height: 100% !important;
}


</style>
