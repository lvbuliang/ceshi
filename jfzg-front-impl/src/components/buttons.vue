<template>
  <div class="common-btns">
    <!-- 保存 -->
    <el-button
      :loading="saveLoad"
      type="primary"
      @click="save"
      v-if="saveConfig.saveTitle"
      >{{ saveConfig.saveTitle }}</el-button
    >
    <!-- 提交 -->
    <el-button
      :loading="submitLoad"
      type="primary"
      @click="submit"
      v-if="loadConfig.submitCode && $checkBtnCode(loadConfig.submitCode)"
      >{{ loadConfig.submitTitle }}</el-button
    >
    <el-button
      :loading="rejectLoad"
      @click="reject"
      v-if="loadConfig.rejectCode && $checkBtnCode(loadConfig.rejectCode)"
      >{{ loadConfig.rejectTitle }}</el-button
    >
  </div>
</template>

<script>
export default {
  props: {
    loadConfig: {
      type: Object,
      default() {
        return {
          submitTitle: "通过",
          submitCode: "",
          rejectTitle: "驳回",
          rejectCode: "",
        };
      },
    },
    saveConfig: {
      type: Object,
      default() {
        return {
          saveTitle: "",
          saveCode: "",
        };
      },
    },
  },
  data() {
    return {
      saveLoad: false,
      submitLoad: false,
      rejectLoad: false,
    };
  },
  mounted() {},
  methods: {
    save() {
      // this.saveLoad = true;
      this.$emit("save", "");
    },
    submit() {
      // this.submitLoad = true;
      this.$emit("submit", "");
    },
    reject() {
      // this.rejectLoad = true;
      this.$emit("reject", "");
    },
    stopLoading() {
      this.saveLoad = false;
      this.submitLoad = false;
      this.rejectLoad = false;
    },
  },
};
</script>

<style lang='scss' scoped>
.common-btns {
  text-align: center;
  // margin-top: 20px;
  >>> .el-button {
    width: 130px;
  }
}
</style>