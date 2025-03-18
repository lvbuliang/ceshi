<template v-for="(item, index) in menuData">
  <div class="everyLi">
    <el-submenu
      :key="item.permissionId"
      :index="item.permissionId"
      v-if="item.children && item.children.length > 0"
    >
      <template slot="title">
        <div class="menuText">
          <!-- <img
            v-if="item.icon"
            :src="`${config.baseUrl}/front-res/images/menu/${
              isCurrent ? item.icon.split('/')[1] : item.icon.split('/')[0]
            }`"
            alt=""
          /> -->
          <img
            v-if="item.icon"
            :src="`${config.baseUrl}/front-res/images/menu/${
              item.icon.split('/')[0]
            }`"
            alt=""
          />
          <span v-if="!item.icon" class="icon"></span>
          <span class="level">
            {{ item.title }}
          </span>
        </div>
      </template>
      <menu-item
        v-for="child in item.children"
        :key="child.url"
        :item="child"
      />
    </el-submenu>
    <el-menu-item
      :key="item.url"
      :index="item.url"
      @click="goRouter(item)"
      v-if="!item.children || item.children.length == 0"
    >
      <template>
        <img
          v-if="item.icon"
          :src="`${config.baseUrl}/front-res/images/menu/${
            isCurrent ? item.icon.split('/')[1] : item.icon.split('/')[0]
          }`"
          alt=""
        />
        <!-- <img
            v-if="item.icon"
            :src="`${config.baseUrl}/front-res/images/menu/${
             item.icon.split('/')[0] 
            }`"
            alt=""
          /> -->
        <span v-if="!item.icon" class="icon"></span>
        <span :class="[!item.icon ? 'secondary' : 'titles']" slot="title">{{
          item.title
        }}</span>
      </template>
    </el-menu-item>
  </div>
</template>

<script>
import config from "@/setting.js";
import { mapState } from "vuex";
import { routerGo } from "@/utils/utils.js"; // 引入跨应用路由跳转
const existInChildren = function (item, url) {
  return (
    item.url == url ||
    (item.children &&
      item.children.some((child) => existInChildren(child, url)))
  );
};
export default {
  name: "MenuItem",
  props: ["item", "menuData"],
  data() {
    return {
      config,
      htmlData: "项目信息",
    };
  },
  watch: {
    "$route.path": {
      handler(newVal, title) {
        this.goRouter();
      },
      immediate: true,
    },
  },
  computed: {
    isCurrent() {
      const url = this.$route.fullPath;
      return existInChildren(this.item, url);
    },
  },
  methods: {

    goRouter(val) {
      // console.log(val,'val')
      // debugger
      if (val) {
        sessionStorage.removeItem('searchData')
        if (val.title != "工作台" || val.title != "数据看板") {
          this.htmlData = `${val.title}`;
          this.$store.state.menu.menu.forEach((ele) => {
            if (ele.children && ele.children.length > 0) {
              ele.children.forEach((item) => {
                if (item == val) {
                  this.htmlData = `${ele.title}/${val.title}`;
                }
              });
            }
          });
          sessionStorage.setItem("htmlData", this.htmlData);
          this.$store.commit("menu/HTMLData", this.htmlData);
        }
        this.$store.commit("menu/VALID", val.permissionId);
        // routerGo(val.url);
        this.$router.push(val.url);
        
      } else {
        // alert('1')
        let newData = sessionStorage.getItem("htmlData"); //其他页面跳转携带
        if (newData) {
          this.$store.commit("menu/HTMLData", newData); //其他页面跳转携带
        } else {
          this.$store.commit("menu/HTMLData", this.htmlData);  //登录默认
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.everyLi{
  padding:5px 10px
}
.everyLi li {
   width: 200px;

}

::v-deep .el-menu-item.is-active {
  background-color: #0176ff !important;
  border: 1px solid #0176ff;
  border-radius: 10px;
  width: 100%;
}
::v-deep .el-menu-item.is-active::before {
  content: '';
  position: absolute;
  right: -8px; /* 根据需要调整位置 */
  top: 0;
  bottom: 0;
  width: 2px; /* 竖线的宽度 */
  background-color: #0176ff; /* 竖线的颜色 */
}

::v-deep .el-menu-item:hover{
  background-color: #9fc2eb !important;
  border: 1px solid #9fc2eb;
  border-radius: 10px;
}
::v-deep .el-submenu.el-menu-item {
width: auto  !important;
padding: 0px;
}
.el-menu-vertical-demo.el-menu {
  height: 100% !important;
}
.titles {
  font-weight: bold;
}
.secondary {
  font-weight: normal;
}

.menuText {
  font-size: 14px;
  font-weight: bold;
}
.icon {
  display: inline-block;
  width: 5px;
  height: 5px;
  background-color: gray;
  border: 1px solid;
  border-radius: 50%;
  margin-right: 10px;
}
.imgAddTetx {
  display: flex;
  align-items: center;
}
img {
  width: 25px;
  height: 25px;
  margin-right: 5px;
}
</style>
