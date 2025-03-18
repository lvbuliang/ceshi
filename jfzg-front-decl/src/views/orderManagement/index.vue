<template>
  <div class="total-page outTotal">
    <!-- 订单管理 -->
    <div class="main">
      <keep-alive>
        <list v-if="$route.meta.keepAlive"></list>
      </keep-alive>
      <div>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import list from "./children/list.vue";

export default {
  components: { list },
  data() {
    return {
    };
  },
  created() {},
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
    padding: 0px 20px;
  }
}
</style>
