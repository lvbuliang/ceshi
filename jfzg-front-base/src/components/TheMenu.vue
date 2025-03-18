<template>
  <!-- v-clickoutside.esc="handleClose" -->
  <div v-clickoutside="handleClose">
    <NavMenu @showSideMenu="showMenu"></NavMenu>
    <SideMenu v-show="isShow" @hideSideMenu="handleClose"></SideMenu>
  </div>
</template>

<script>
  import NavMenu from './NavMenu.vue'
  import SideMenu from './SideMenu.vue'
  import { Storage } from "wl-core"
  export default {
    components:{
      NavMenu,
      SideMenu
    },
    data() {
      return {
        isShow: false
      }
    },
    mounted() {
      // console.log('TheMenu.mounted')
      this.isShow = Storage.get("sideMenuShow", "session")
    },
    methods:{
      showMenu() {
        this.isShow = true
        Storage.set("sideMenuShow", true, "session")
        // console.log('TheMenu.showMenu', this.isShow)
      },
      handleClose() {
        this.isShow = false
        Storage.set("sideMenuShow", false, "session")
        // console.log('TheMenu.handleClose', this.isShow)
      }
    }
  }
</script>

<style>
</style>
