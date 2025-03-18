<template>
  <div>
    <el-dialog
      class="my-dialog"
      title="温馨提示"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      :close-on-click-modal="false"
      :append-to-body="true"
      width="500px"
    >
      <div class="content">
        <div class="tip_item fz-22">系统检测到当前标段下</div>
        <div class="tip_item">
          <span class="primary_tip">合同金额</span> 与
          <span class="primary_tip">付款节点的付款比例和金额信息</span> 不一致
        </div>
        <div>是否需要系统自动进行调整?</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          :disabled="isLoading"
          size="small"
          type="primary"
          @click="saveForm"
          >确 定</el-button
        >
        <el-button size="small" @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      timer: null,
      isLoading: false, // 是否加载中
      index: null,
    };
  },
  beforeDestroy() {
    clearTimeout(this.timer);
  },
  methods: {
    open(index) {
      this.index = index;
      this.dialogVisible = true;
    },
    saveForm() {
      this.$message.info("系统正在计算中...");
      this.isLoading = true;

      this.timer = setTimeout(() => {
        this.$message.success("计算完成");
        this.dialogVisible = false;
        this.isLoading = false;
        if (this.index !== null) {
          this.$emit("callbackFunc", this.index);
        } else {
          this.$emit("callbackFunc");
        }
      }, 2000);
    },
    handleClose() {
      clearTimeout(this.timer);
      this.index = null;
      this.dialogVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.tip_item {
  margin-bottom: 10px;
  .primary_tip {
    color: #1890ff;
  }
}

.fz-22 {
  font-size: 18px;
  font-weight: bold;
}

.mb-10 {
  margin-bottom: 10px;
}
</style>
