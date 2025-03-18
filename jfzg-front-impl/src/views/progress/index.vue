<template>
  <div class="total-page">
    <div v-if="$route.name == 'progress' ||$route.name == 'contract'">
      <list></list>
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<!-- 实施进度跟踪 -->
<script>
import list from "./children/list.vue";
export default {
  components: { list },
  props: {},
  data() {
    return {};
  },
};
</script>

<style scoped >
</style>