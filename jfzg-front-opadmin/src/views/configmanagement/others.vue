<template>
  <div class="config_m">
    <div class="list">
      <label>项目备案金额：</label>
      <el-input-number :min="0" v-model="task_num" controls-position="right"></el-input-number>
    </div>
    <div class="list">
      <label>发起可研申报金额：</label>
      <el-input-number :min="0" v-model="task_num" controls-position="right"></el-input-number>
    </div>
    <div class="list">
      <label>发起初设概算金额：</label>
      <el-input-number :min="0" v-model="task_num" controls-position="right"></el-input-number>
    </div>
    <div class="list">
      <label>监理金额：</label>
      <el-input-number :min="0" v-model="task_num" controls-position="right"></el-input-number>
    </div>
    <div class="list">
      <label>发起初验金额：</label>
      <el-input-number :min="0" v-model="task_num" controls-position="right"></el-input-number>
    </div>
    <div class="list">
      <label>发起竣工验收金额：</label>
      <el-input-number :min="0" v-model="task_num" controls-position="right"></el-input-number>
    </div>
    <div class="list">
      <el-button type="primary" @click="saveAndUpdate">保存</el-button>
      <el-button type @click="cencleHandle">取消</el-button>      
    </div>
  </div>
</template>

<script>
import {} from "@/api/configManage/configManage";
export default {
  data() {
    return {
      task_num: "",
    };
  },
  mounted() {},
  methods: {
    // 保存更改
    saveAndUpdate() {},
    // 取消
    cencleHandle() {},
  },
};
</script>

<style lang="scss" scoped>
.config_m /deep/ {
  width: 800px;
  height: 650px;
  overflow: hidden;
  margin-left: 300px;

  .list:nth-last-child(1) {
    text-align: center;
  }
  .list {
    .el-select {
      margin-right: 10px;
      width: 450px;
    }
    .el-date-editor {
      margin-right: 10px;
    }
    .el-input-number {
      width: 450px;
    }
    .el-date-editor.el-input {
      width: 450px;
    }
    label {
      margin-right: 20px;
      display: inline-block;
      width: 180px;
      text-align: right;
      font-size: 14px;
      color: #000000;
    }
    margin: 32px;
  }
}
</style>