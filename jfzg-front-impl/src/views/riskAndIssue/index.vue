<!-- 日常管理-风险问题管理 -->
<template>
  <div class="total-page">
    <div v-if="$route.name == 'riskAndIssue'">
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
    this.$router.push({
      name: 'riskAndIssue'
    })
  },
};
</script>

<style scoped >
</style>