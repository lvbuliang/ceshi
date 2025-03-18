<template>
  <div class="tabLine">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-for="(item,i) in tabLineList" :key="i" :label="item.label" :name="item.name"></el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  props: {
    tabLineList: {
      type: Array,
      default() {
        return [];
      }
    },
    type: {
      type: String,
      default: "first"
    }
  },
  data() {
    return {
      activeName: ""
    };
  },
  methods: {
    handleClick(tab, event) {
      this.$emit("showTab", tab.name);
    }
  },
  created() {
    this.activeName = this.type;
  }
};
</script>