<template>
  <div class="Dialog">
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="500px"
      :append-to-body="true"
      @open="openHandle"
      class="common-dialog-style"
    >
      <template v-if="type == 'form'">
        <FForm
          ref="modelMgrRef"
          class="modelMgrRef"
          :config="form.config"
          :form="form.data"
          :rules="form.rules"
          :enums="form.enums"
          :other-config="otherConfig"
          refForm="modelMgrRefForm"
          :column="2"
          @eventNotify="eventNotify"
        >
          <div slot="Config" class="ConfigStyle">
            <div v-for="(item, index) in formStr.nodes" :key="index">
              <section class="Input">
                <el-input v-model="item.dataName"></el-input>
                <el-input v-model="item.dataValue"></el-input>
              </section>
              <section class="Opera">
                <i
                  @click="handleAddNode"
                  class="el-icon-circle-plus-outline"
                ></i>
                <i
                  @click="handleNodeRemove(index)"
                  class="el-icon-remove-outline"
                ></i>
              </section>
            </div>
          </div>
        </FForm>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submit">确 定</el-button>
          <el-button @click="dialogVisible = false">取 消</el-button>
        </span>
      </template>
      <template v-else>
        <MonacoEditor
          ref="jsonEditor"
          :readOnly="false"
          :content-body.sync="jsonEg"
        >
        </MonacoEditor>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submit">复 制</el-button>
          <el-button @click="dialogVisible = false">取 消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import MonacoEditor from "@/components/MonacoEditor.vue";
import FForm from "@/components/FForm/form-add.vue";
export default {
  components: {
    FForm,
    MonacoEditor,
  },
  props: {
    title: {
      type: String,
      default: () => {
        return "新增配置按钮";
      },
    },
    type: {
      type: String,
      default: () => {
        return "form";
      },
    },
    codeStr: {
      type: String,
      default: () => {
        return "";
      },
    },
  },
  data() {
    return {
      jsonEg: "",
      otherConfig: {
        labelNum: 150,
      },
      formStr: {
        role: "",
        checkOwner: false,
        showForm: true,
        btns: [
          {
            btnName: "按钮名0",
            btnValue: "按钮值0",
            btnType: "",
            btnEventType: "",
            btnUrl: "",
            examineState: "",
            agencyId: "",
            agencyNextrole: "",
            nextBuCode: "",
            messageId: "",
          },
        ],
        operationBtns: [
          {
            btnName: "按钮名0",
            btnValue: "按钮值0",
          },
        ],
        nodes: [
          {
            dataName: "节点名0",
            dataValue: "节点值0",
          },
        ],
      },
      form: {
        config: [
          {
            col: 24, // 独占一行
            type: "text",
            name: "按钮名称",
            placeholder: "请输入按钮名称",
            bind: "tagTypeName",
            trigger: "blur", // 校验时机
            required: "请输入按钮名称", // 必填需要指定提示信息
          },
          {
            col: 24, // 独占一行
            type: "text",
            name: "按钮值",
            placeholder: "请输入按钮值",
            bind: "remark",
            trigger: "blur", // 校验时机
            required: "请输入按钮值", // 必填需要指定提示信息
          },
          {
            col: 24, // 独占一行
            type: "select",
            name: "按钮类型",
            placeholder: "请选择按钮类型",
            bind: "platform",
            dataList: "platformList",
            trigger: "blur", // 校验时机
            required: "请选择按钮类型", // 必填需要指定提示信息
          },
          {
            col: 24, // 独占一行
            type: "select",
            name: "按钮性质",
            placeholder: "请选择按钮性质",
            bind: "platform",
            dataList: "platformList",
            trigger: "blur", // 校验时机
            required: "请选择按钮性质", // 必填需要指定提示信息
          },
          {
            col: 24, // 独占一行
            type: "text",
            name: "按钮接口url",
            placeholder: "请输入按钮接口url",
            bind: "remark",
            trigger: "blur", // 校验时机
            required: "请输入按钮接口url", // 必填需要指定提示信息
          },
          {
            col: 24, // 独占一行
            type: "text",
            name: "评审状态",
            placeholder: "请输入评审状态",
            bind: "remark",
            trigger: "blur", // 校验时机
            required: "请输入评审状态", // 必填需要指定提示信息
          },
          {
            col: 24, // 独占一行
            type: "text",
            name: "代办id",
            placeholder: "请输入代办id",
            bind: "remark",
            trigger: "blur", // 校验时机
            required: "请输入代办id", // 必填需要指定提示信息
          },
          {
            col: 24, // 独占一行
            type: "text",
            name: "下个代办角色",
            placeholder: "请输入下个代办角色",
            bind: "remark",
            trigger: "blur", // 校验时机
            required: "请输入下个代办角色", // 必填需要指定提示信息
          },
          {
            col: 24, // 独占一行
            type: "text",
            name: "下个企业编号",
            placeholder: "请输入下个企业编号",
            bind: "remark",
            trigger: "blur", // 校验时机
            required: "请输入下个企业编号", // 必填需要指定提示信息
          },
          {
            col: 24, // 独占一行
            type: "text",
            name: "消息推送id",
            placeholder: "请输入消息推送id",
            bind: "remark",
            trigger: "blur", // 校验时机
            required: "请输入消息推送id", // 必填需要指定提示信息
          },
          {
            col: 24,
            type: "slot",
            slotName: "Config",
            name: "跳转节点配置",
            bind: "status",
          },
          //   {
          //     type: "switch",
          //     name: "代办配置",
          //     bind: "switch1",
          //     col: 12,
          //     eventName: "switchHandleTode",
          //   },
          //   {
          //     type: "switch",
          //     name: "消息配置",
          //     bind: "switch2",
          //     col: 12,
          //     eventName: "switchHandleMessage",
          //   },
        ],
        data: {
          tagTypeName: "",
          remark: "",
        },
        enums: {},

        rules: {},
      },
      dialogVisible: false,
      switchHandleTode: false,
      switchHandleMessage: false,
    };
  },
  methods: {
    eventNotify(ref) {
      console.log(ref);
      //   let arr = [
      //     {
      //       col: 24, // 独占一行
      //       type: "select",
      //       name: "模板名称",
      //       placeholder: "请选择模板",
      //       bind: "platform",
      //       dataList: "platformList",
      //       trigger: "blur", // 校验时机
      //       required: "请选择模板", // 必填需要指定提示信息
      //     },
      //     {
      //       col: 24, // 独占一行
      //       type: "select",
      //       name: "接收角色",
      //       placeholder: "请选择接收角色",
      //       bind: "platform",
      //       dataList: "platformList",
      //       trigger: "blur", // 校验时机
      //       required: "请选择接收角色", // 必填需要指定提示信息
      //     },
      //     {
      //       col: 24, // 独占一行
      //       type: "select",
      //       name: "接收人",
      //       placeholder: "请选择接收人",
      //       bind: "platform",
      //       dataList: "platformList",
      //       trigger: "blur", // 校验时机
      //       required: "请选择接收人", // 必填需要指定提示信息
      //     },
      //   ];

      //   if (ref == "switchHandleTode") {
      //     this.switchHandleTode = !this.switchHandleTode;
      //   } else if (ref == "switchHandleMessage") {
      //     this.switchHandleMessage = !this.switchHandleMessage;
      //   }
    },
    openHandle() {
      this.$nextTick(() => {
        if (this.$refs.jsonEditor != undefined) {
          console.log(this.codeStr);
          this.$refs.jsonEditor.setValue(this.codeStr);
        }
      });
    },

    submit() {},
    handleAddBtns() {
      let index = this.formStr["operationBtns"].length;
      this.formStr["operationBtns"].push({
        btnValue: "按钮值" + index,
        btnName: "按钮名" + index,
      });
    },
    handleNodeRemove(index) {
      if (this.formStr["nodes"].length > 1) {
        this.formStr["nodes"].splice(index, 1);
      }
    },
    handleAddNode() {
      let index = this.formStr["nodes"].length;
      this.formStr["nodes"].push({
        dataValue: "节点值" + index,
        dataName: "节点名" + index,
      });
    },
    handleAddBtn() {
      let index = this.formStr["btns"].length;
      this.formStr["btns"].push({
        btnValue: "按钮值" + index,
        btnName: "按钮名" + index,
        btnType: "",
        btnEventType: "",
        btnUrl: "",
        examineState: "",
        agencyId: "",
        agencyNextrole: "",
        nextBuCode: "",
      });
    },
  },
};
</script>

<style lang="scss">
.el-dialog {
  .el-dialog__body {
    height: 550px!important;
    .el-form {
      .el-form-item {
        .ConfigStyle {
          div {
            display: flex;
            align-items: center;
            .Input {
              display: flex;
              align-items: center;
              .el-input {
                width: 175px !important;
              }
            }
            .Opera {
              i {
                cursor: pointer;
              }
            }
          }
        }
      }
    }
  }
}
</style>