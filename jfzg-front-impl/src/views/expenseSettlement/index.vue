<template>
  <div class="total-page">
    <div v-if="$route.name == 'expenseSettlement'">
      <list></list>
    </div>
    <router-view v-else></router-view>
  </div>
</template>
  
  <!--
    功能：功能描述
    汪振涛
    时间：2021年06月16日 15:03:38
    版本：v1.0
  -->
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