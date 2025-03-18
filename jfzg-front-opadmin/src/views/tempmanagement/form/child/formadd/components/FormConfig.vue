<template>
  <div class="form-config-container">
    <el-form label-position="top" :label-suffix="'：'">
      <!-- <el-form-item label="标签对齐方式">
        <el-radio-group v-model="data.labelPosition">
          <el-radio-button label="left">左对齐</el-radio-button>
          <el-radio-button label="right">右对齐</el-radio-button>
          <el-radio-button label="top">顶部对齐</el-radio-button>
        </el-radio-group>
      </el-form-item> -->

      <el-form-item label="标签宽度">
        <el-input-number
          class="sr-number"
          controls-position="right"
          v-model="data.labelNum"
          :min="0"
          :max="250"
          :step="10"
        ></el-input-number>
      </el-form-item>

      <!-- <el-form-item label="组件尺寸">
        <el-radio-group v-model="data.size">
          <el-radio-button label="medium">medium</el-radio-button>
          <el-radio-button label="small">small</el-radio-button>
          <el-radio-button label="mini">mini</el-radio-button>
        </el-radio-group>
      </el-form-item> -->
    </el-form>
  </div>
</template>

<script>
export default {
  props: ["data"],
};
</script>
<style lang="scss" scoped>
.form-config-container {
  ::v-deep .el-form {
    .el-form-item {
      display: flex;
      justify-content: center;
      align-content: center;
      .el-form-item__label {
        display: inline-block;
        width: 114px;
        text-align: right;
      }
      .el-form-item__content {
        display: inline-block;
        width: 112px;
        .el-input-number {
          width: 112px;
        }
      }
    }
  }
}
</style>
