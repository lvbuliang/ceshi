<template>
  <!-- :style="{ height: boxHeight + 'px' }" -->
  <div class="total-page">
    <div  v-if="$route.name == 'planProject'" class='main'>
        <list :isSpanActive="isSpanActive"></list>
    </div>
    <div v-else>
        <router-view></router-view>
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
      isSpanActive: "",
      boxHeight: "",
    };
  },
  watch: {
    // // 处理从那个节点进入返回那个节点
    $route: {
      handler: function (val, oldVal) {
        console.log(".........路由返回返回", val, oldVal);
        this.isSpanActive = oldVal.query.spanaActive;
      },
      // 深度观察监听
      deep: true,
    },
  },
  mounted() {
  },
  methods: {
  },
};
</script>

<style >
.total-page {
  background-color: rgb(240, 242, 245);
  height: 100%;
}

</style>
