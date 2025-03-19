<template>
  <div class="total-page" :style="{ height: boxHeight + 'px' }">
    <el-tabs v-model="activeName">
      <el-tab-pane
        v-for="item in tabList"
        :disabled="true"
        :key="item.code"
        :name="item.code"
      >
        <template slot="label">
          <img
            style="vertical-align: middle"
            src="@/assets/barrage_fill@2x.png"
            width="24px"
            height="auto"
            alt=""
          />
          <span style="color: #333; vertical-align: middle">
            问题基本信息
          </span>
        </template>
      </el-tab-pane>
    </el-tabs>
    <div class="padd">
      <!-- <div style="display:block;font-size: 16px;font-weight: 800; color: #000;">问题基本信息</div> -->
      <SrView
        :formData="forms.config"
        :ruleForm="forms.data"
        :ref="`form`"
      ></SrView>
    </div>
    <div>
      <div class="padd">
        <span>处理结果：</span>
        <el-button :type="btn == 1 ? 'primary' : ''" @click="genjin"
          >跟进</el-button
        >
        <el-button :type="btn == 2 ? 'primary' : ''" @click="zhuanban"
          >转办</el-button
        >
        <el-button :type="btn == 3 ? 'primary' : ''" @click="guanbi"
          >关闭</el-button
        >
      </div>
      <div class="padd genjin" v-show="genjinddis">
        <span> 跟进选择日期： </span>
        <el-date-picker
          v-model="genjinData.chuliriqi"
          type="date"
          placeholder="选择日期"
        >
        </el-date-picker>
      </div>
      <div class="padd genjin" v-show="genjinddis">
        <span>跟进处理意见：</span>
        <el-input
          type="textarea"
          v-model="genjinData.chulitext"
          :autosize="{minRows: 2,maxRows: 4}"
          maxlength="1000"
          show-word-limit
        ></el-input>
      </div>

      <div class="padd zhuanban" v-show="zhuanbandis">
        <span class="editClass"> 操作人:</span>
        <el-input
          v-model="zhuanbanData.editName"
          :disabled="true"
          placeholder="操作人"
          style="width: 80%"
        ></el-input>
      </div>
      <div class="padd zhuanban" v-show="zhuanbandis">
        <span class="editClass zeditClass"> 被转办人： </span>
        <!-- <span class="editClass"> 选择转办人： </span> -->
        <el-input
          v-model="zhuanbanData.processorName"
          :disabled="true"
          placeholder="选择转办人"
          style="width: 77%"
        ></el-input>
        <!-- <el-button type="text" ><i class="el-icon-circle-plus el-icon--right"></i></el-button> -->
        <div class="btns" style="margin-bottom: 0" @click="selectclr()">
          <i class="el-icon-plus"></i>
        </div>
      </div>
      <div class="padd genjin" v-show="zhuanbandis">
        <span class="editClass">转办处理意见：</span>
        <el-input
          type="textarea"
          v-model="zhuanbanData.chulitext"
          :autosize="{minRows: 2,maxRows: 4}"
          maxlength="1000"
          show-word-limit
        ></el-input>
      </div>
      <!-- <div class="padd" v-show="zhuanbandis">
        <span>
          转办选择日期：
        </span>
        <el-date-picker
                v-model="zhuanbanData.chuliriqi"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
      </div> -->

      <div class="padd genjin" v-show="guanbidis">
        <span> 关闭选择日期： </span>
        <el-date-picker
          v-model="guanbiData.chuliriqi"
          type="date"
          placeholder="选择日期"
        >
        </el-date-picker>
      </div>
      <div class="padd genjin" v-show="guanbidis">
        <span>关闭处理意见：</span>
        <el-input
          type="textarea"
          v-model="guanbiData.chulitext"
          :autosize="{minRows: 2,maxRows: 4}"
          maxlength="1000"
          show-word-limit
        ></el-input>
      </div>


      <BottomBtns
        :isShowBack="showDis"
        :saveBtn="saveBtn"
        :btns="btn"
        @onBackClick="onCancel"
        @onSubmit="onSubmit"
      ></BottomBtns>
    </div>
    <Dialogone
      :dialogVisible="changeZRRlog"
      @close="handleZRRClose"
      @saveSelectZRR="saveSelectZRR"
    ></Dialogone>
    <!-- 处理过程 -->
    <div>
      <el-tabs v-model="activeName">
        <el-tab-pane
          v-for="item in tabList"
          :disabled="true"
          :key="item.code"
          :name="item.code"
        >
          <template slot="label">
            <img
              style="vertical-align: middle"
              src="@/assets/barrage_fill@2x.png"
              width="24px"
              height="auto"
              alt=""
            />
            <span
              style="color: #333; vertical-align: middle; padding-left: 4px"
            >
              过程记录
            </span>
          </template>
        </el-tab-pane>
      </el-tabs>
      <RTSteps
        :srTraceArr="arr"
        :srTraceActive="arr.length"
        :show="false"
        :direction="'vertical'"
      ></RTSteps>
    </div>
  </div>
</template>
<script>
import store from "@/store";
import Dialogone from "@/views/riskAndIssueNew/children/dialogone.vue";
import {
  api_trouble_detail,
  api_trouble_dispose,
  api_queryProblemHistory,
} from "@/api/riskAndIssueNew/index.js";
import config from "@/settings.js";
import BottomBtns from "@/views/riskAndIssueNew/components/buttomBtn.vue";
import RTSteps from "@/components/riskAndTroubleSteps.vue";
export default {
  name: "everydaytroubleDisposeNew",
  components: { Dialogone, BottomBtns, RTSteps },
  provide() {
    return {
      baseUrl: config.uploadBaseUrl,
      imgBaseUrl: config.imgBaseUrl,
      uploadBaseUrl: config.uploadBaseUrl,
    };
  },
  props: {},
  updated() {},
  data() {
    return {
      boxHeight: "700",
      userInfo: store.getters.userInfo,
      saveBtn: false,
      arr: [],
      activeName: "1",
      tabList: [{ title: "问题基本信息", code: "1" }],
      editId: null,
      formInline: {
        wtms: null,
        wtlx: null,
        wtdj: null,
        tcr: null,
        tcrId: null,
        wtclr: null,
        wtclrId: null,
        zrcs: null,
        // zrcsId: null,
        zrr: null,
        zrrId: null,
      },
      // 处理意见
      chulitext: "",
      // 处理日期
      chuliriqi: "",
      dialog: {
        title: "",
        dialogDis: false,
      },
      changeZRRlog: false,
      changeWTCLRlog: false,
      templateId: this.$route.query.templateId,
      // 新增周报
      form: {
        otherConfig: {
          labelNum: 140,
        },
        config: [
          {
            type: "input",
            name: "问题描述",
            placeholder: "请输入",
            bind: "systemName",
            dataList: "systemNameList",
            trigger: "change",
            col: 24,
            required: "问题描述不能为空",
          },
          {
            type: "select",
            name: "问题类型",
            placeholder: "请选择",
            bind: "systemName",
            dataList: "systemNameList",
            trigger: "change",
            col: 12,
            required: "问题类型不能为空",
          },
          {
            type: "select",
            name: "问题等级",
            placeholder: "请选择",
            bind: "projectName",
            dataList: "projectNameList",
            trigger: "change",
            col: 12,
            required: "问题等级不能为空",
          },
          {
            type: "input",
            name: "提出人",
            placeholder: "请输入",
            bind: "contactName",
            trigger: "change",
            col: 12,
            // required: "项目负责人不能为空",
          },
          {
            type: "select",
            name: "问题处理人",
            placeholder: "请选择",
            bind: "programManagerName",
            dataList: "contactNameList",
            // trigger: "change",
            col: 12,
            // required: "所属阶段不能为空",
          },
          {
            type: "input",
            name: "责任处室/部门",
            placeholder: "请输入",
            bind: "clientManagerName",
            col: 12,
            // required: "周报期别不能为空",
            // trigger: "blur",
            // rules: {
            //   regular_Number3: "只能输入数字",
            // },
          },
          {
            type: "select",
            name: "责任人",
            placeholder: "请输入",
            bind: "clientManagerName",
            col: 12,
            // required: "周报期别不能为空",
            // trigger: "blur",
            // rules: {
            //   regular_Number3: "只能输入数字",
            // },
          },
        ],
        data: {
          contactName: "",
          programManagerId: "",
          contactName1: "",
          programManagerName: "",
          jhxmExpert: [],
          clientManagerName: "",
          clientManagerName1: "",
          clientManagerName2: "",
          preliminaryExaminationAnnex: "",
        },
        enums: {
          contactNameList: [], //项目负责人
          systemNameList: [], //系统名称
          projectNameList: [], //项目名称
        },
      },
      forms: {
        otherConfig: {
          labelNum: 140,
        },
        config: [
          {
            label: "问题描述",
            value: "description",
            col: 24,
            type: "value",
          },
          {
            value: "type",
            label: "问题类型",
            span: 8,
            type: "value",
          },
          {
            value: "level",
            label: "问题等级",
            span: 8,
            type: "value",
          },
          {
            value: "proposerName",
            label: "提出人",
            span: 8,
            type: "value",
          },
          {
            value: "processorName",
            label: "问题处理人",
            span: 8,
            type: "value",
          },
          {
            value: "departName",
            label: "责任处室/部门",
            span: 8,
            type: "value",
          },
          {
            value: "liablerName",
            label: "责任人",
            span: 8,
            type: "value",
          },
        ],
        data: {
          description: "",
          type: "",
          level: "",
          proposerName: "",
          processorName: "",
          departName: "",
          liablerName: "",
        },

        enums: {
          processorNameList: [], //风险处理人
          liablerNameList: {}, //责任人
          typeList: [], //风险类型
          levelList: [], //风险等级
        },
      },
      btn: 1,
      showDis: true,
      genjinddis: true,
      zhuanbandis: false,
      guanbidis: false,
      genjinData: {
        chulitext: "",
        chuliriqi: "",
      },
      zhuanbanData: {
        processorName: "",
        processorId: "",
        chulitext: "",
        chuliriqi: "",
        subContractorBuid: "",
        subContractorRoleCode: "",
        editName: store.getters.userInfo.fullname,
      },
      guanbiData: {
        chulitext: "",
        chuliriqi: "",
      },
      systemName: "",
      projectName: "",
    };
  },
  watch: {
    $route: {
      handler(val) {
        if (val) {
          this.getSuggestion(val);
        }
      },
      immediate: true,
      deep: true,
    },
  },
  created() {},
  mounted() {
    this.getWorkflowHeight();
    this.formInline.tcr = this.userInfo.fullname;
    this.formInline.tcrId = this.userInfo.jfid;
    if (this.$route.query.id) {
      this.getTroubleDetail();
    }
  },
  methods: {
    getWorkflowHeight() {
      this.$nextTick(() => {
        setTimeout(() => {
          let workflowHeight = 0;
          let container = document.querySelector(".workflow");
          let btns = document.querySelector(".btns");
          if (container) {
            workflowHeight = container.offsetHeight;
          }
          workflowHeight += 66;
          this.boxHeight =
            window.innerHeight -
            document.querySelector(".tabs_box").offsetHeight -
            workflowHeight;
        }, 50);
      });
    },
    getSuggestion(route) {
      let data = {
        problemId: "",
        riskId: "",
      };
      if (route.fullPath.includes("trouble")) {
        data.problemId = route.query.id;
      }
      api_queryProblemHistory(data).then((res) => {
        console.log(res, "123");
        if (res.data != []) {
          this.arr = res.data.map((item) => {
            let description = "";
            let title1 =
              item.typeName == "转办"
                ? item.subSuggestion
                  ? item.subSuggestion
                  : ""
                : item.typeName == "关闭"
                ? item.closeSuggestion
                  ? item.closeSuggestion
                  : ""
                : item.typeName == "跟进"
                ? item.followUpSuggestion
                  ? item.followUpSuggestion
                  : ""
                : "";
            let x =
              item.typeName == "转办"
                ? "转办处理意见:"
                : item.typeName == "关闭"
                ? "关闭处理意见:"
                : item.typeName == "跟进"
                ? "跟进处理意见:"
                : "";
            description =
              "操作人:" +
              item.operatorName +
              "<span>&emsp;&emsp;&emsp;&emsp;</span>" +
              "操作时间:" +
              item.operatorTime +
              "<span>&emsp;&emsp;&emsp;&emsp;</span>" +
              (item.subContractor
                ? "被转办人:" + item.subContractor + "&emsp;&emsp;&emsp;"
                : "") +
              "<br/><br/>" +
              x +
              "&emsp;" +
              title1;
            return {
              description,
              title: item.typeName,
              per: item.operatorName,
              time: item.operatorTime,
            };
          });
        }
      });
    },
    selectclr() {
      this.changeZRRlog = true;
    },
    saveSelectZRR(val2) {
      this.zhuanbanData.processorName = val2[0].data[0].fullname;
      this.zhuanbanData.processorId = val2[0].data[0].jfid;
      this.zhuanbanData.subContractorRoleCode = val2[0].data[0].roleCode;
      this.zhuanbanData.subContractorBuid = val2[0].data[0].buid;
      this.changeZRRlog = false;
    },
    onCancel() {
      this.$router.push({
        name: "everydaytroubleNew",
        query: {
          projectId: this.$route.query.projectId,
          systemName: this.$route.query.systemName,
          projectName: this.$route.query.projectName,
          contractId: this.$route.query.contractId,
          sectionCount: this.$route.query.sectionCount,
          sectionSort: this.$route.query.sectionSort,
        },
      });
    },
    async getTroubleDetail() {
      const res = await api_trouble_detail(this.$route.query.id);
      if (res.msg.code == "0000") {
        this.forms.data.description = res.data.description;
        this.forms.data.type =
          res.data.type == "1"
            ? "内部问题"
            : res.data.type == "2"
            ? "外部问题"
            : res.data.type == "3"
            ? "云网问题"
            : "";
        this.forms.data.level =
          res.data.level == "0"
            ? "轻微"
            : res.data.level == "1"
            ? "一般"
            : res.data.level == "2"
            ? "严重"
            : "";
        this.forms.data.proposerName = res.data.proposerName;
        this.forms.data.processorName = res.data.processorName;
        this.forms.data.departName = res.data.departName;
        this.forms.data.liablerName = res.data.liablerName;
        this.systemName = res.data.systemName;
        this.projectName = res.data.projectName;
      }
    },
    handleZRRClose() {
      this.changeZRRlog = false;
    },
    handleWTCLRClose() {
      this.changeWTCLRlog = false;
    },
    formatDate(timestamp) {
      let date = new Date(timestamp);
      let year = date.getFullYear();
      let month = date.getMonth() + 1; // getMonth返回的月份是从0开始的
      let day = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      } else {
        month = "" + month;
      }
      if (day >= 0 && day <= 9) {
        day = "0" + day;
      } else {
        day = "" + day;
      }
      return year + "-" + month.substring(-2) + "-" + day.substring(-2);
    },
    async onSubmit() {
      if (
        this.btn == 2 &&
        (this.zhuanbanData.processorName == "" ||
          this.zhuanbanData.processorName == null)
      ) {
        this.$message.warning("请选择转办人");
      } else {
        let params = {
          id: this.$route.query.id,
          result: this.btn - 1,
          handleIdea: this.genjinData.chulitext,
          handleTime: this.genjinData.chuliriqi,
          subContractorId: this.zhuanbanData.processorId,
          subContractor: this.zhuanbanData.processorName,
          subContractorRoleCode: this.zhuanbanData.subContractorRoleCode,
          subContractorBuid: this.zhuanbanData.subContractorBuid,
          projectId: this.$route.query.projectId,
          contractId: this.$route.query.contractId,
          sectionCount: this.$route.query.sectionCount,
          sectionSort: this.$route.query.sectionSort,
        };
        if (this.btn == 1) {
          params.handleIdea = this.genjinData.chulitext;
          params.handleTime = this.genjinData.chuliriqi;
        } else if (this.btn == 2) {
          params.handleIdea = this.zhuanbanData.chulitext;
          params.handleTime = this.zhuanbanData.chuliriqi;
        } else if (this.btn == 3) {
          params.handleIdea = this.guanbiData.chulitext;
          params.handleTime = this.guanbiData.chuliriqi;
        }
        if (params.handleTime !== "") {
          let date = new Date(params.handleTime).valueOf();
          const dateone = this.formatDate(date);
          params.handleTime = dateone;
        }
        this.saveBtn = true;
        const res = await api_trouble_dispose(params);
        if (res.msg.code == "0000") {
          this.$message.success("保存成功");
          this.saveBtn = false;
          this.$router.push({
            name: "everydaytroubleNew",
            query: {
              projectId: this.$route.query.projectId,
              contractId: this.$route.query.contractId,
              sectionCount: this.$route.query.sectionCount,
              sectionSort: this.$route.query.sectionSort,
              systemName: this.$route.query.systemName,
              projectName: this.$route.query.projectName,
            },
          });
        } else {
          this.saveBtn = false;
        }
      }
    },
    getWTLX(val) {
      if (val == "1") {
        return "内部问题";
      } else if (val == "2") {
        return "外部问题";
      } else if (val == "3") {
        return "云网问题";
      }
    },
    getWTDJ(val) {
      if (val == "0") {
        return "轻微";
      } else if (val == "1") {
        return "一般";
      } else if (val == "2") {
        return "严重";
      }
    },
    genjin() {
      this.genjinddis = true;
      this.zhuanbandis = false;
      this.guanbidis = false;
      this.btn = 1;
      this.zhuanbanData.processorId = "";
      this.zhuanbanData.processorName = "";
      this.zhuanbanData.chulitext = "";
      this.zhuanbanData.chuliriqi = "";
      this.guanbiData.chulitext = "";
      this.guanbiData.chuliriqi = "";
    },
    zhuanban() {
      this.genjinddis = false;
      this.zhuanbandis = true;
      this.guanbidis = false;
      this.btn = 2;
      this.genjinData.chulitext = "";
      this.genjinData.chuliriqi = "";
      this.guanbiData.chulitext = "";
      this.guanbiData.chuliriqi = "";
    },
    guanbi() {
      this.genjinddis = false;
      this.zhuanbandis = false;
      this.guanbidis = true;
      this.genjinData.chulitext = "";
      this.genjinData.chuliriqi = "";
      this.zhuanbanData.processorId = "";
      this.zhuanbanData.processorName = "";
      this.zhuanbanData.chulitext = "";
      this.zhuanbanData.chuliriqi = "";
      this.btn = 3;
    },
  },
};
</script>
<style lang="scss" scoped>
// 文本域
::v-deep .el-textarea .el-input__count {
  line-height: 20px;
  bottom: 2px;
}
.all {
  background-color: #fff;
  // padding: 40px 40px;
  .ott {
    margin: 32px;
    width: 40vw;
    height: 15vh;
    border: 1px solid rgba(229, 230, 235, 1);
    border-radius: 5px;
    // display: flex;
    .one {
      width: 100%;
      height: 30%;
      display: flex;
      align-items: center;
      justify-content: space-around;
    }
    .two {
      width: 100%;
      display: flex;
      height: 30%;
      align-items: center;
    }
    .three {
      width: 100%;
      display: flex;
      height: 30%;
      align-items: center;
    }
  }
}
.total-page {
  padding: 0 20px;
  background: #fff;
  padding-top: 0 !important;
  // overflow-y: scroll;
  overflow-x: hidden;
}
.el-form {
  padding-left: 5vw;
  padding-top: 1vw;
  padding-bottom: 4vw;
}
.el-form--inline .el-form-item {
  margin-bottom: 20px;
}
.sradd {
  margin-top: 40px;
  padding: 80px;
  padding-top: 0;
}
::v-deep .el-tabs__header {
  padding-top: 10px !important;
}
.btns {
  border: 1px dashed rgba(66, 130, 255, 1);
  border-radius: 50% !important;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 5px;
  i {
    color: rgba(66, 130, 255, 1);
  }
}
::v-deep .sr_table {
  margin-bottom: 16px;
}
::v-deep .el-dialog .el-dialog__header {
  height: 56px;
  margin: 0 24px;
  padding: 16px 0;
  text-align: left;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  line-height: 24px;
  border-bottom: 1px solid #e8e8e8;
  .el-dialog__title {
    font-size: 14px;
  }
}
::v-deep .el-dialog__footer {
  height: 66px;
  .el-button {
    padding: 9px 27px;
  }
}
.padd {
  padding: 20px;
  padding-top: 0;
}
.zhuanban {
  display: flex;
  .editClass {
    display: inline-block;
    width: 98px;
  }
  .zeditClass:before {
    content: "*";
    color: #f5222d;
    margin-right: 2px;
  }
}
.genjin {
  display: flex;
}
::v-deep.el-dialog__header {
  text-align: center !important;
}
.el-textarea {
  width: 80% !important;
}
::v-deep .el-input.is-disabled .el-input__inner {
  color: black !important;
}
::v-deep .el-date-editor.el-input {
  width: 50% !important;
}
::v-deep .step {
  // height: 340px !important;
  display: flex !important;
  justify-content: flex-start !important;
  margin-left: 40px !important;
  margin-bottom: 20px;
}
::v-deep .el-step__line {
  width: 1px !important;
}
::v-deep .el-step.is-vertical {
  flex-basis: 35% !important;
}
::v-deep .el-step__description {
  margin-bottom: 20px !important;
}
::v-deep .el-date-editor.el-input {
  width: 80% !important;
}
</style>
