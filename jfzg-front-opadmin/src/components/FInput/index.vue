<template>
  <div>
    <el-input :value="value" @input="change($event)"></el-input>
  </div>
</template>

<!--
  功能：下拉框组件
  汪振涛
  时间：2020年07月01日 17:09:02
  版本：v1.0
-->
<script>
export default {
  model: {
    prop: "value",
    event: "change"
  },
  components: {},
  props: {
    value: String
  },
  data() {
    return {};
  },
  methods: {
    change(value) {
      this.$emit("change", value);
    }
  }
};
</script>

<style scoped >
</style>
