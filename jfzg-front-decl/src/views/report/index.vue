<template>
  <div class="total-page outTotal">
    <div class='main' v-if="$route.name == 'reportList'">
        <list ></list>
    </div>

    <div v-else>
        <router-view></router-view>
    </div>
    <!-- <keep-alive include="reportList">
      <div class="main">
        <router-view></router-view>
      </div>
    </keep-alive> -->
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
  mounted() {
  },
  methods: {
  },
};
</script>

<style lang='scss' scoped>
  .outTotal {
    overflow: auto;
    .main {
      height: 100%;
      padding: 20px;
    }
  }
// }
</style>
