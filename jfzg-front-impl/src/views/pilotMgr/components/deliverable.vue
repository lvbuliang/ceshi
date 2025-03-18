<template>
  <div class="deliverable">
    <DeliverList :onlyShow="true" />
  </div>
</template>
<script>
import DeliverList from "@/views/deliver/children/view";
export default {
  components: { DeliverList },
  watch: {},
  computed: {},
  data() {
    return {};
  },
  methods: {},
  mounted() {},
};
</script>
<style lang="scss" scoped>
.deliverable {
  // padding-top: 16px;
}
</style>
