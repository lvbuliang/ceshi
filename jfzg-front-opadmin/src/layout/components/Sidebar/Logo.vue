<template>
  <div
    :class="[{'collapse':collapse} , checkMenu ? 'shrink' : 'unfold' , 'sidebar-logo-container' , 'logo']"
  >
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo" />
        <h1 v-else class="sidebar-title">{{ title }}</h1>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <!-- <img v-if="logo" :src="logo" class="sidebar-logo" /> -->
        <h1 class="sidebar-title">{{ title }}</h1>
      </router-link>
    </transition>
  </div>
</template>

<script>
export default {
  name: "SidebarLogo",
  props: {
    collapse: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      title: "豫信河南项目管理系统",
      logo: require("../../../assets/header_logo.png"),
    };
  },
  computed: {
    checkMenu() {
      return this.$store.state.menu.checkMenu;
    },
  },
};
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 64px;
  line-height: 64px;
  background: rgba(0, 33, 64, 1);
  text-align: center;
  overflow: hidden;
  padding-left: 24px;
  > a {
    text-align: left;
  }
  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 38px;
      height: auto;
      vertical-align: middle;
      margin-right: 0px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      line-height: 50px;
      vertical-align: middle;
      font-size: 20px;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      // padding-left: 12px;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
.shrink {
  padding-left: 15px;
  transition: padding 0.5s ease;
}
.unfold {
  // padding-left: 30px;
  transition: padding 0.5s ease;
}
</style>
