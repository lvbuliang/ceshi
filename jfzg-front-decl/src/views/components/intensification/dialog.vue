<template>
  <div class="sr-dialog-select">
    <el-dialog
      class="intensificationDialog"
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      append-to-body
      width="800px"
      center
      custom-class="dialog_select"
      v-if="dialogVisible"
    >
      <div class="content">
        <el-checkbox-group v-model="active" @change="handleChange">
          <!-- 字典表禁用 item.memo  0 禁用 1 未禁用-->
          <el-checkbox
            v-for="item in arr"
            :label="item.itemCode"
            :key="item.itemCode"
            :disabled="item.memo == '0'"
          >{{item.chName}}</el-checkbox>
        </el-checkbox-group>
      </div>
      <slot v-if="!isButton" class="el-dialog__footer" name="footer" slot="footer">
        <el-button size="small" round type="primary" @click="confirm">确定</el-button>
        <el-button size="small" round @click="dialogVisible = false">取消</el-button>
      </slot>
    </el-dialog>
  </div>
</template>
<script>
import { listByTopicAndItem } from "@/api/index";
export default {
  name: "SrDialogSelect",
  props: {
    isButton: Boolean,
    dialogTitle: {
      type: String,
      default: "集约化比对",
    },
  },
  data() {
    return {
      dialogVisible: false,
      active: [],
      activeT: "全文比对", // 默认选中
      arr: [],
    };
  },
  mounted() {
    this.dictionaries();
  },
  methods: {
    dictionaries() {
      // 字典表获取（集约化比对）
      listByTopicAndItem({ topic: "JFZG_INTENSIVE_COMPARISON_TYPE" }).then(
        (res) => {
          if (res.msg.code == "0000" && res.data) {
            res.data.map((item) => {
              if (item.itemCode && typeof item.itemCode == "number") {
                item.codeId.toString();
              }

              if (item.chName && typeof item.chName == "number") {
                item.chName.toString();
              }
            });

            let itemCode = this.$utils.arrFind(
              res.data,
              this.activeT,
              "chName"
            )?.itemCode;
            if (itemCode) {
              this.$set(this, "active", [itemCode]);
            }

            this.$set(this, "arr", res.data);
          }
        }
      );
    },
    // 确认选中
    confirm() {
      this.$emit("confirm", this.active);
    },
    handleChange() {},
  },
};
</script>
<style lang="scss" scoped>
.intensificationDialog {
  .content {
    padding-top: 27px;
    padding-bottom: 20px;
    display: flex;
    justify-content: center;
  }
}
</style>
