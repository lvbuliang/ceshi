<!-- 预研交付页面 -->

<template>
  <div class="total-page outTotal" :style="{ height: boxHeight + 'px' }">
    <div class="main" v-if="$route.name == 'preResearchDelivery'">
      <List :ifHideAddBtn="$route.name == 'preResearchDelivery'"></List>
    </div>
    <div v-else>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import List from "./children/list.vue";
export default {
  components: { List },
  props: {},
  data() {
    return {
      boxHeight: "",
    };
  },
  watch: {
    $route: {
      handler(val) {
        this.getWorkflowHeight();
      },
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.getWorkflowHeight();
    });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.getWorkflowHeight);
  },
  methods: {
    getWorkflowHeight() {
      let workflowHeight = 0;
      let container = document.querySelector(".workflow");
      if (container) {
        workflowHeight = "";
      }
      workflowHeight += 66;
      this.boxHeight =
        window.innerHeight -
        document.querySelector(".the-nav").offsetHeight -
        workflowHeight;
    },
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
