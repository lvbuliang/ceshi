<template>
  <div class="total-page">
    <div v-if="$route.name == 'planedProject' ||$route.name == 'planedProjectAudit'">
      <list :ifHideAddBtn="$route.name == 'planedProjectAudit'"></list>
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<script>
import list from "./children/list.vue";

export default {
  components: { list },
  data() {
    return {};
  },

  created() {
    this.$store.dispatch("userinfo/getUserInfo");
  },
};
</script>
<style lang="scss" scoped>
</style>