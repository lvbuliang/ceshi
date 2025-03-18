<template>
  <div class="aside">
    <menu-item
      :ref="'menuItem' + index"
      v-for="(item, index) in menuData"
      :key="item.id"
      :item="item"
      v-if="!shouldShowItem(item)"
    />
  </div>
</template>

<script>
import MenuItem from "../components/MenuItem.vue";

export default {
  props: ["menuData"],
  name: "MenuTree",
  components: {
    MenuItem,
  },
  data() {
    return {};
  },

  created() {},
  mounted() {},
  methods: {
    shouldShowItem(item) {
      return item.title == "项目信息"; // 根据这个条件来决定是否显示菜单项
    },
    handleRouteChange(val) {
      console.log("handleRouteChange", val);
    },
  },
};
</script>

<style lang="scss" scoped>
.el-menu-vertical-demo.el-menu {
  height: 100% !important;
  .aside {
    margin-top: -25px;
    height: 100%;
    overflow: auto;
  }
}

.titles {
  font-size: 14px !important;
}

.menuText {
  span {
    margin-left: 5px;
  }
}
</style>