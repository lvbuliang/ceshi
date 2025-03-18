<template>
  <div class="total-page outTotal">
    <div class='main' v-if="$route.name == 'projectManagement'">
        <list :ifHideAddBtn="$route.name == 'projectManagement'"></list>
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
    padding: 20px;
  }
}
</style>
