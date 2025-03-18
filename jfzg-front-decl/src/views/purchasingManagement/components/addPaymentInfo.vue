<template>
  <div>
    <el-dialog
      class="my-dialog"
      title="付款信息"
      :visible.sync="dialogFormVisible"
      :before-close="handleClose"
      :close-on-click-modal="false"
      :append-to-body="true"
      width="600px"
    >
      <SrAdd
        :config="paymentForm.config"
        :otherConfig="paymentForm.otherConfig"
        :form="paymentForm.data"
        ref="paymentForm"
        class="add"
      >
        <template slot="description">
          <el-input
            placeholder="请输入描述信息"
            class="w80"
            v-model="paymentForm.data.description"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            maxlength="1000"
            show-word-limit
          ></el-input>
        </template>

        <!-- 付款点比例 -->
        <template slot="scale">
          <el-input
            placeholder="请输入付款比例"
            class="mr-10 w80"
            v-model="paymentForm.data.scale"
            @input="scaleValid(paymentForm.data.scale)"
          ></el-input>
          <i slot="suffix">%</i>
          <!-- el-icon-question -->
        </template>

        <!-- 付款点金额 -->
        <template slot="amount">
          <el-input
            placeholder="请输入付款金额"
            class="mr-10 w80"
            v-model="paymentForm.data.amount"
            @input="amountValid(paymentForm.data.amount)"
          ></el-input>
          <i slot="suffix">万元</i>
        </template>

        <!-- 实际付款点金额 -->
        <!-- <template slot="actualAmount">
          <el-input
            placeholder="请输入实际付款金额"
            class="mr-10 w80"
            v-model="paymentForm.data.actualAmount"
            @input="actualAmountValid(paymentForm.data.actualAmount)"
          ></el-input>
          <i slot="suffix">万元</i>
        </template> -->

        <!-- 付款状态 -->
        <!-- <template slot="status">
          <el-select style="width: 249px;" v-model="paymentForm.data.status" placeholder="请选择付款点状态">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </template> -->

        <template slot="remark">
          <el-input
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 5 }"
            placeholder="请输入备注"
            class="w80"
            v-model="paymentForm.data.remark"
          ></el-input>
        </template>
      </SrAdd>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="saveForm"
          >保存</el-button
        >
        <el-button size="small" @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "paymentInfo_dialog",
  props: {
    // 是否为多标段
    isMutiple: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      dialogFormVisible: false,
      cIndex: 0,
      options: [
        { label: "已支付", value: "0" },
        { label: "未支付", value: "1" },
      ],
      paymentForm: {
        otherConfig: {
          labelNum: 140,
        },
        config: [
          {
            type: "slot",
            slotName: "description",
            collapseTags: true,
            name: "付款点描述",
            required: "请输入付款点描述",
            placeholder: "请输入",
            bind: "description",
            trigger: "blur",
            col: 24,
          },
          {
            type: "slot",
            slotName: "scale",
            collapseTags: true,
            name: "付款点比例",
            required: "请输入付款点比例",
            placeholder: "请输入",
            bind: "scale",
            trigger: "blur",
            col: 24,
          },
          {
            type: "slot",
            slotName: "amount",
            collapseTags: true,
            name: "付款点金额",
            required: "请输入付款点金额",
            placeholder: "请输入",
            bind: "amount",
            trigger: "blur",
            col: 24,
          },
          {
            type: "slot",
            slotName: "remark",
            collapseTags: true,
            name: "备注",
            placeholder: "请输入",
            bind: "remark",
            trigger: "blur",
            col: 24,
          },
          // {
          //   type: "slot",
          //   slotName: "actualAmount",
          //   collapseTags: true,
          //   name: "付款点金额",
          //   required: "请输入付款点金额",
          //   placeholder: "请输入",
          //   bind: "actualAmount",
          //   trigger: "blur",
          //   col: 24,
          // },
          // {
          //   type: "slot",
          //   slotName: "status",
          //   collapseTags: true,
          //   name: "付款点状态",
          //   required: "请选择付款点状态",
          //   placeholder: "请选择",
          //   bind: "status",
          //   trigger: "change",
          //   col: 24,
          // },
        ],
        data: {
          description: "", // 付款点描述
          scale: "", //付款点比例
          amount: "", // 付款点金额
          remark: "", // 备注
          actualAmount: "", // 实际付款点金额
          status: null,
        },
      },
      currentTableData: [], //当前标段下付款节点表格数据
      currentContractAmount: "", //当前标段下合同金额
    };
  },
  methods: {
    // 打开弹框
    open(index, tableData, contractAmount) {
      this.currentTableData = tableData; //当前标段下付款节点表格数据
      this.currentContractAmount = contractAmount; //当前标段下合同金额
      index == null ? (this.cIndex = 0) : (this.cIndex = index);
      this.dialogFormVisible = true;
      this.resetForm();
    },

    // 关闭弹框
    handleClose() {
      this.dialogFormVisible = false;

      this.paymentForm.data = {
        description: "", // 付款点描述
        scale: "", //付款点比例
        amount: "", // 付款点金额
        remark: "", // 备注
        actualAmount: "",
        status: null,
      };
    },

    // 重置表单信息
    resetForm() {
      this?.$refs["paymentForm"].$refs["refForm"].resetFields();
    },

    // 付款点比例输入限制
    scaleValid(value) {
      var reg = /^([1-9]\d{0,1}|0|100)$/;
      if (reg.test(value) == false) {
        this.paymentForm.data.scale = "";
      } else {
        // 计算出当前标段下付款节点已经统计的比例总数
        let totalScale = this.currentTableData.reduce((pre, cur) => {
          return pre + Number(cur.scale);
        }, 0);
        // 计算出 100 - 当前标段下付款节点已经统计的比例总数 = 剩余用户可输入的最大比例数
        let restScale = 100 - Number(totalScale);
        if (value > restScale) {
          this.$notify({
            title: "提示",
            type: "warning",
            dangerouslyUseHTMLString: true,
            message: `
          <div>当前标段下付款比例统计 <span style="color: #1890FF;font-weight: bold;margin-left: 8px;">${
            (totalScale / 100) * 100
          }%</span></div>
          <div>您此次可设置的最大付款比例为 <span style="color: #1890FF;font-weight: bold;margin-left: 8px;">${restScale}%</span></div>
          <div style="color: #fa2">请重新调整后再提交</div>`,
            duration: 0,
          });
          value = "";
          this.paymentForm.data.scale = "";
        } else {
          this.paymentForm.data.amount = parseFloat(
            ((this.currentContractAmount * value) / 100).toFixed(6)
          );
          this.paymentForm.data.scale = value;
        }
      }
    },

    // 付款点金额输入限制
    amountValid(value) {
      var reg = /^(\d{1,8}(\.\d{0,6})?)?$/;
      if (reg.test(value) == false) {
        this.paymentForm.data.amount = "";
      } else {
        // 计算出当前标段下付款节点已经统计的比例总数
        let totalAmount = this.currentTableData.reduce((pre, cur) => {
          return pre + Number(cur.amount);
        }, 0);
        // 计算出 合同金额 - 当前标段下付款节点已经统计的付款总数 = 剩余用户可输入的最大金额数
        let restAmount =
          Number(this.currentContractAmount) - Number(totalAmount);
        if (value > this.currentContractAmount) {
          this.$notify({
            title: "提示",
            type: "warning",
            dangerouslyUseHTMLString: true,
            message: `
          <div>当前标段下合同金额为 <span style="color: #1890FF;font-weight: bold;margin-left: 5px;">${this.currentContractAmount}万元</span></div>
          <div>您此次设置的付款金额已超过可设置的最大金额</div>
          <div style="color: #fa2">请重新调整后再提交</div>`,
            duration: 0,
          });
          value = "";
          this.paymentForm.data.amount = "";
        } else if (value > restAmount) {
          if (Number(restAmount) == Number(this.currentContractAmount)) {
            this.$notify({
              title: "提示",
              type: "warning",
              dangerouslyUseHTMLString: true,
              message: `
          <div>您此次可设置的最大付款金额为 <span style="color: #1890FF;font-weight: bold;margin-left: 5px;">${this.currentContractAmount}万元</span></div>
          <div style="color: #fa2">请重新调整后再提交</div>`,
              duration: 0,
            });
          } else {
            this.$notify({
              title: "提示",
              type: "warning",
              dangerouslyUseHTMLString: true,
              message: `
          <div>当前标段下付款金额统计 <span style="color: #1890FF;font-weight: bold;margin-left: 5px;">${totalAmount}万元</span></div>
          <div>您此次可设置的最大付款金额为 <span style="color: #1890FF;font-weight: bold;margin-left: 5px;">${restAmount}万元</span></div>
          <div style="color: #fa2">请重新调整后再提交</div>`,
              duration: 0,
            });
          }

          value = "";
          this.paymentForm.data.amount = "";
        } else {
          this.paymentForm.data.amount = value;
        }
      }
    },
    actualAmountValid(value) {
      var reg = /^(\d{1,8}(\.\d{0,2})?)?$/;
      if (reg.test(value) == false) {
        this.paymentForm.data.actualAmount = "";
      } else {
        this.paymentForm.data.actualAmount = value;
      }
    },

    // 保存
    saveForm() {
      const form1Valid = this.$refs.paymentForm.validate();
      if (form1Valid) {
        if (this.isMutiple) {
          this.$emit("saveCallBack", {
            data: this.paymentForm.data,
            index: this.cIndex,
          });
          this.handleClose();
        } else {
          this.$emit("saveCallBack", { data: this.paymentForm.data });
          this.handleClose();
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.slot-item {
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.mr-10 {
  margin-right: 10px;
}

.w80 {
  width: 80%;
}

.el-dialog__header {
  text-align: left !important;
}

</style>
