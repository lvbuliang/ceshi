<template>
  <div class="extract-page">
    <div class="extract">
      <el-steps :active="active" class="extractStep">
        <!-- <el-step title="创建分组"></el-step> -->
        <el-step title="抽取条件"></el-step>
        <el-step title="专家抽取"></el-step>
        <el-step title="抽取确认"></el-step>
      </el-steps>
    </div>
    <!-- <preStep v-if="active == 1" ref="preStep"></preStep>
    <one v-if="active == 2" ref="one"></one>
    <two v-if="active == 3" ref="two"></two>
    <tree v-if="active == 4" @disabled="stepIsDisabled" ref="tree"></tree> -->
    <one v-if="active == 1" ref="one"></one>
    <two v-if="active == 2" ref="two"></two>
    <tree v-if="active == 3" @disabled="stepIsDisabled" ref="tree"></tree>
    <sr-work-flow
      :hideFrom="true"
      :clickMethods="clickmethods"
      :buttonList="buttonList"
      backName="activityList"
      ref="work_flow"
    ></sr-work-flow>
    <el-dialog
      class="extract_dialog"
      title="专家数量不足"
      :visible.sync="dialogVisible"
      width="498px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <template>
        <sr-alert
          :showIcon="false"
          :closable="false"
          type="warning"
          title="温馨提示：当前抽取的专家人数不足，请点击以下按钮进行选择。"
        ></sr-alert>
        <el-button
          type="primary"
          round
          v-debounce="[() => dialog_next(), config.deTime]"
          v-if="stepOneParms.jxcq"
          >继续抽取</el-button
        >
        <el-button round v-debounce="[() => dialog_close(), config.deTime]"
          >重新编辑抽取条件</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<!--
  功能：功能描述
  汪振涛
  时间：2021年07月12日 17:37:26
  版本：v1.0
-->
<script>
import one from "./extract/one.vue";
import two from "./extract/two.vue";
import tree from "./extract/tree.vue";
// import preStep from "./extract/preStep.vue";
import config from "@/settings.js";
import {
  save,
  expertAspirationSave,
  queryIsVisible,
  confirm,
} from "@/api/activityList";

export default {
  components: {
    one,
    two,
    tree,
    // preStep
  },
  computed: {
    reviewId() {
      return this.$route.query.id;
    },
    needExpertNum() {
      return this.$route.query.extractNum;
    },
  },
  watch: {
    active(value) {
      console.log(value, "value");
      let arr = [];
      if (value == 1) {
        this.buttonList[0].btns = [
          {
            btnValue: "next",
            btnName: "下一步",
            btnType: "primary",
            btnEventType: "next",
          },
        ];
      } else if (value == 2) {
        this.buttonList[0].btns = [
          {
            btnName: "上一步",
            btnValue: "last",
            btnType: "default",
            btnEventType: "last",
          },
          {
            btnValue: "next",
            btnName: "下一步",
            btnType: "primary",
            btnEventType: "next",
          },
        ];
      } else if (value == 3) {
        //   this.buttonList[0].btns = [
        //     {
        //       btnName: "上一步",
        //       btnValue: "last",
        //       btnType: "default",
        //       btnEventType: "last",
        //     },
        //     {
        //       btnValue: "next",
        //       btnName: "下一步",
        //       btnType: "primary",
        //       btnEventType: "next",
        //     },
        //   ];
        // } else if (value == 4) {
        if (this.$route.query.status == 1) {
          if (this.previous) {
            this.buttonList[0].btns = [
              {
                btnName: "上一步",
                btnValue: "last",
                btnType: "default",
                btnEventType: "last",
              },
              {
                btnName: "确认",
                btnValue: "tg",
                btnType: "primary",
                btnEventType: "tg",
              },
            ];
          } else if (!this.previous) {
            this.buttonList[0].btns = [
              {
                btnName: "确认",
                btnValue: "tg",
                btnType: "primary",
                btnEventType: "tg",
                disabled: true,
              },
            ];
          }
        } else {
          this.buttonList[0].btns = [];
        }
      }
    },
    // immediate设置为true，就是在首次加载时触发watch
    immediate: true,
  },
  props: {},
  mounted() {
    this.$route.query.active = this.active;
  },
  data() {
    return {
      config,
      active: 1,
      radio: 1,
      buttonList: [
        {
          role: "",
          btns: [
            {
              btnValue: "next",
              btnName: "下一步",
              btnType: "primary",
              btnEventType: "next",
            },
          ],
          nodes: [],
        },
      ],
      clickmethods: {
        tg: this.tg,
        last: this.last,
        next: this.next,
      },
      dialogVisible: false,
      previous: null,
      stepOneParms: {},
    };
  },
  created() {
    this.getQueryIsVisible();
  },
  methods: {
    dialog_next() {
      this.active++;
      this.$route.query.active = this.active;
      this.dialogVisible = false;
    },
    dialog_close() {
      this.dialogVisible = false;
    },
    //下一步 吧当前步骤索引放入query里面
    next() {
      console.log(this.active, "this.active");
      if (this.active == 1) {
        //   console.log("创建分组");
        //   this.active++;
        //   this.$route.query.active = this.active;
        // } else if (this.active == 2) {
        let params = this.$refs.one.verification();
        if (params) {
          this.$store.commit("extract/UPDATE_ONE_PARAMS", params);
          delete params.evadeExpertList;
          delete params.zdExpertIdList;
          save({
            id: params.id,
            data: JSON.stringify(params),
            reviewId: this.reviewId,
          }).then(({ msg, data }) => {
            this.stepOneParms = data; // 这个参数主要判断字段里面是否有jxcq这个字段 如果有 flag 为flase时打开的弹框里面则显示继续抽取得按钮
            if (data && data.flag) {
              this.active++;
              this.$route.query.active = this.active;
            } else {
              this.dialogVisible = true; //flag为false时 代表抽取条件不足 显示弹框
            }
          });
        }
        // } else if (this.active == 3) {
      } else if (this.active == 2) {
        let params = this.$refs.two.submit();
        console.log(params);
        expertAspirationSave({ jfids: params, reviewId: this.reviewId }).then(
          ({ msg, data }) => {
            if (data) {
              this.active++;
              this.$route.query.active = this.active;
            }
          }
        );
      }
    },
    //上一步 吧当前步骤索引放入query里面
    last() {
      this.active--;
      this.$route.query.active = this.active;
    },
    //判断是否直接跳到第三步
    getQueryIsVisible() {
      queryIsVisible({ reviewId: this.reviewId }).then(({ data, msg }) => {
        if (msg.code === "0000") {
          this.previous = data;
          if (!data) {
            // this.active = 4;
            this.active = 3;
          }
        }
      });
    },

    //判断是否需要disabled
    stepIsDisabled(flag) {
      console.log(flag, "flag");
      this.$set(this.buttonList[0].btns[0], "disabled", flag);
      console.log(this.buttonList[0]);
    },
    tg() {
      confirm({ reviewId: this.reviewId }).then(({ data, msg }) => {
        if (data) {
          this.$router.push({ name: "activityList" });
        }
      });
    },
  },
};
</script>

<style  lang="scss">
.extract-page {
  .radioLabel {
    width: 170px;
    display: inline-block;
    text-align: right;
    line-height: 32px;
  }
  .addTep {
    margin-top: 16px;
  }
}
.extract {
  margin-bottom: 40px;
  .el-steps {
    width: 70%;
    margin: 0 auto;
    margin-top: 14px;
    .el-step {
      .el-step__head {
        .el-step__line {
          border-top: 1px dashed #ccd1de;
          height: 0;
          background-color: transparent;
          top: 15px;
          width: 85%;
          left: 40px;
          .el-step__line-inner {
            display: none;
          }
        }
        .el-step__icon {
          width: 32px;
          height: 32px;
          background: #1890ff;
          border: 3px solid #fff !important;
          .el-step__icon-inner {
            color: #fff;
            font-weight: 500;
          }
        }
      }
      .is-process {
        .el-step__icon {
          border: none;
          background: #cccccc;
        }
      }
      .is-wait {
        .el-step__icon {
          border: none;
          background: #cccccc;
        }
      }
      .is-finish {
        .el-step__icon {
          width: 32px;
          height: 32px;
          border: 6px solid rgba(24, 144, 255, 0.2);
        }
      }
      .is-finish + .el-step__main {
        color: #1890ff;
      }
      .el-step__main {
        .el-step__title {
          margin-left: -15px;
          font-weight: 500;
          color: #333;
        }
      }
    }
  }
}
.extract_dialog {
  .el-dialog {
    .el-dialog__body {
      .el-button {
        display: block;
        width: 100%;
        margin: 0;
        margin-top: 16px;
      }
    }
  }
}
</style>
