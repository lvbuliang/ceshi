<template>
  <div class="tabCardBox1">
    <el-tabs v-model="tabActive" type="card" @tab-click="handleClick">
      <el-tab-pane
        v-for="(item, i) in titleList"
        :key="i"
        :label="item.name"
        :name="item.value"
      ></el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  props: {
    titleList: {
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      tabActive: '0',
    }
  },
  methods: {
    /**
     * 切换
     */
    handleClick(tab) {
      this.tabActive = tab.name.toString()
      this.$emit('switchTab', this.tabActive)
    },
  },
  created() {
    // console.log(this.titleList);
  },
}
</script>
<style lang="scss" scoped>
.tabCardBox1 {
  display: flex;
  margin-bottom: 1 0px;
  cursor: pointer;
  .box {
    display: inline-block;
    padding: 5px 14px;
    background: #fff;
  }
  .hover {
    color: #1890ff;
    // border: 1px solid #1890ff;
  }
}
</style>
<style lang="scss">
.tabCardBox1 .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
  border: none;
  // border-color: transparent;
  border-left: 1px solid #dfe4ed;
  border-radius: 2px;
}
.el-tabs--card > .el-tabs__header {
  border-bottom: 1px solid #e6e6e6;
}
.tabCardBox1 {
  .el-tabs__nav {
    width: 100%;
  }
  .el-tabs {
    width: 100%;
  }
}

.tabCardBox1 .el-tabs__item {
  width: 50%;
  height: 40px;
  line-height: 40px;
}
</style>
