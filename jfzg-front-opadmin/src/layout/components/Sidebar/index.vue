<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" class="logo" :collapse="checkMenu" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="checkMenu"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="true"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="true"
        @select="select"
        class="el-menu"
      >
        <sidebar-item
          v-for="route in permission_routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import variables from "@/styles/variables.scss";

export default {
  data() {
    return {
      isCollapse: true,
    };
  },
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters(["permission_routes", "sidebar", "child"]),
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    checkMenu() {
      return this.$store.state.menu.checkMenu;
    },
  },
  mounted() {
  },
  methods: {
    select() {},
  }
};
</script>