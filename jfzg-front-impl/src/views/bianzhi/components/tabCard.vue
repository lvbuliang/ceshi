<template>
  <div class="tabCardBox">
    <el-tabs v-model="tabActive" type="card" @tab-click="handleClick">
      <el-tab-pane v-for="(item,i) in titleList" :key="i" :label="item.name" :name="item.value"></el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  data() {
    return {
      titleList: [
        { name: "全部人员投入", value: "0" },
        // { name: "分阶段人员投入", value: "1" }
      ],
      tabActive: "0"
    };
  },
  methods: {
    /**
     * 切换
     */
    handleClick(tab) {
      this.$emit("switchTab", this.tabActive);
    },
  }
};
</script>
<style lang="scss" scoped>
.tabCardBox {
  display: flex;
  margin-bottom: 1 0px;
  cursor: pointer;
  .box {
    display: inline-block;
    padding: 5px 14px;
    background: #fff;
    border: 1px solid #d9d9d9;
  }
  .hover {
    color: #1890ff;
    border: 1px solid #1890ff;
  }
}
</style>
<style lang="scss" >
.tabCardBox .el-tabs--card > .el-tabs__header .el-tabs__nav {
  background: #fff;
}
.tabCardBox .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
  border: 1px solid #1890ff;
  border-bottom-color: #1890ff;
}
</style>