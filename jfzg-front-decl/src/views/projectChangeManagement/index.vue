<template>
  <div class="total-page outTotal">
    <div class="main">
      <div v-if="$route.name == 'projectChangeManagement'">
        <list></list>
      </div>
      <div v-else>
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
  watch: {},
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
    padding: 20px;
  }
}
</style>
