<!-- 日常管理-风险问题管理 -->
<template>
  <div class="total-page outTotal">
    <div class="main" v-if="$route.name == 'executionManagement'">
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
    return {
    };
  },
  created() {
    // this.$router.push({
    //   name: "executionManagement",
    // });
  },
  watch: {
  },
  mounted() {
  },
  methods: {
  },
};
</script>

<style lang="scss" scoped>
  .outTotal {
  border-radius: 0 10px 10px 10px;
  // padding: 20px;
  background-color: white;
  .main {
    height: 100%;
    padding: 20px;
  }
}
</style>
