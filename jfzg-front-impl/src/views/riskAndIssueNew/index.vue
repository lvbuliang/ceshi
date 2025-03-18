<!-- 风险问题管理 -->
<template>
  <div class="total-page outTotal">
    <div class="main" v-if="$route.name == 'riskAndIssueNew'">
      <keep-alive>
        <list v-if="$route.meta.keepAlive"></list>
      </keep-alive>
    </div>

    <div class="main" v-else>
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
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
    //   name: "riskAndIssueNew",
    // });
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
  }
}
</style>
