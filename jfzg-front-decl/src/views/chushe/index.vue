<template>
  <div class="total-page">
    <div v-if="$route.name == 'chushe' || $route.name == 'chusheAudit'">
      <list></list>
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<script>
import list from "./children/list.vue";
export default {
  components: { list },
  props: {},
  data() {
    return {};
  },
  created() {
  },
};
</script>

<style scoped >
</style>
