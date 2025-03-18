<template>
  <el-select :value="value" @change="change($event)" :no-data-text="nodatatext">
    <el-option
      v-for="(item,index) in list"
      :key="index"
      :label="config.label?item[config.label]:item"
      :value="config.value?item[config.value]:item"
    ></el-option>
    
  </el-select>
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
  props: {
    value: String,
    nodatatext: {
      type: String,
      default() {
        return "无数据";
      }
    },
    list: {
      type: Array,
      default() {
        return [];
      }
    },
    config: {
      type: Object,
      default() {
        return {
          label: "label",
          value: "value"
        };
      }
    }
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
