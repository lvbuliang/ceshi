<template>
  <div class="total-page">
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
          <span style="color: #333; vertical-align: middle; padding-left: 4px">
            问题基本信息
          </span>
        </template>
      </el-tab-pane>
    </el-tabs>
    <!-- <div style="display:block;font-size: 16px;font-weight: 800; color: #000;">问题基本信息</div> -->
    <el-form
      :inline="true"
      :model="formInline"
      ref="ruleForm"
      :rules="formRules"
      label-width="120px"
      label-position="right"
      class="demo-form-inline"
    >
      <el-row>
        <el-col :span="24">
          <div class="elItem">
            <el-form-item
              label="问题描述"
              prop="wtms"
              :disabled="true"
              style="width: 100%"
            >
              <el-input
                v-model="formInline.wtms"
                placeholder="问题描述"
                style="width: 100%"
                :disabled="true"
              ></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="问题类型" :disabled="true" prop="wtlx">
            <el-select
              v-model="formInline.wtlx"
              placeholder="问题类型"
              :disabled="true"
            >
              <el-option label="外部问题" value="2"></el-option>
              <el-option label="内部问题" value="1"></el-option>
              <el-option label="云网问题" value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="问题等级" :disabled="true" prop="wtdj">
            <el-select
              v-model="formInline.wtdj"
              placeholder="问题等级"
              :disabled="true"
            >
              <el-option label="严重" value="2"></el-option>
              <el-option label="一般" value="1"></el-option>
              <el-option label="轻微" value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="提出人" :disabled="true" prop="tcr">
            <el-input
              v-model="formInline.tcr"
              placeholder="提出人"
              :disabled="true"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="问题处理人" prop="wtclr">
            <div style="display: flex; align-items: center">
              <el-input
                v-model="formInline.wtclr"
                placeholder="问题处理人"
                :disabled="true"
                style="width: 100%"
              ></el-input>
              <el-button
                circle
                @click="selectclr()"
                class="btns"
                style="margin-bottom: 0"
                ><i class="el-icon-plus icon"></i
              ></el-button>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="责任处室/部门">
            <el-input
              v-model="formInline.zrcs"
              placeholder="责任处室/部门"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="责任人">
            <div style="display: flex; align-items: center">
              <el-input
                v-model="formInline.zrr"
                placeholder="责任人"
                style="width: 100%"
              ></el-input>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <BottomBtns
      :isShowBack="showDis"
      @onBackClick="backToList"
      :saveBtn="saveBtn"
      @onSubmit="onSubmit('ruleForm')"
    ></BottomBtns>
    <Dialogone
      :dialogVisible="changeZRRlog"
      @close="handleZRRClose"
      @saveSelectZRR="saveSelectZRR"
    ></Dialogone>
    <Dialogtwo
      :dialogVisible="changeWTCLRlog"
      @close="handleWTCLRClose"
      @saveSelectTCR="saveSelectTCR"
    ></Dialogtwo>
  </div>
</template>
<script>
import store from "@/store";
import Dialogone from "@/views/riskAndIssueNew/children/dialogone.vue";
import Dialogtwo from "@/views/riskAndIssueNew/children/dialogtwo.vue";
import {
  api_trouble_detail,
  api_trouble_assign,
} from "@/api/riskAndIssueNew/index.js";
import config from "@/settings.js";
import upload from "@/utils/upload";
import BottomBtns from "@/views/riskAndIssueNew/components/buttomBtn.vue";

export default {
  name: "everydaytroubleAssignNew",
  components: { Dialogone, Dialogtwo, BottomBtns },
  provide() {
    return {
      baseUrl: config.uploadBaseUrl,
      imgBaseUrl: config.imgBaseUrl,
      uploadRequest: upload,
      uploadBaseUrl: config.uploadBaseUrl,
    };
  },
  props: {},
  data() {
    return {
      saveBtn: false,
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
      ruleForm: {
        wtms: null,
        wtlx: null,
        wtdj: null,
        tcr: null,
        wtclr: null,
        zrcs: null,
        zrr: null,
      },
      formRules: {
        wtms: [{ required: true, message: "请填写问题描述", trigger: "blur" }],
        wtlx: [
          { required: true, message: "请选择问题类型", trigger: "change" },
        ],
        wtdj: [
          { required: true, message: "请选择问题等级", trigger: "change" },
        ],
        tcr: [{ required: true, message: "请填写提出人", trigger: "change" }],
        wtclr: [
          { required: true, message: "请选择问题处理人", trigger: "change" },
        ],
        zrcs: [
          { required: true, message: "请填写责任处室/部门", trigger: "change" },
        ],
        zrr: [{ required: true, message: "请填写责任人", trigger: "blur" }],
      },
      dialog: {
        title: "",
        dialogDis: false,
      },
      changeZRRlog: false,
      changeWTCLRlog: false,
      templateId: this.$route.query.templateId,
      clickmethods: {},
      tabList: [{ title: "问题基本信息", code: "1" }],
      buttonList: [
        {
          role: "",
          btns: [
            {
              btnValue: "btg",
              btnName: "保存",
              btnType: "primary",
              btnEventType: "btg",
            },
          ],
          nodes: [
            {
              dataName: "",
              dataValue: "节点值0",
            },
          ],
        },
      ],
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
      userInfo: store.getters.userInfo,
      // projectProcessRoleCode:  store.getters.userInfo.currentRole.roleCode,
      // roleId:  store.getters.userInfo.currentRole.roleId,
      // // 部门ID 数组
      // userRoleFrontShowInfos: store.getters.userInfo.userRoleFrontShowInfos,
      showDis: true,
    };
  },
  created() {},
  mounted() {
    // this.formInline.tcr = this.userInfo.fullname
    this.formInline.tcrId = this.userInfo.jfid;
    if (this.$route.query.id) {
      this.getTroubleDetail();
    }
  },
  methods: {
    selectclr() {
      this.changeWTCLRlog = true;
    },
    selectzrr() {
      this.changeZRRlog = true;
    },
    backToList() {
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
        this.formInline.wtms = res.data.description;
        this.formInline.wtlx = res.data.type;
        this.formInline.wtdj = res.data.level;
        this.formInline.tcr = res.data.proposerName;
        this.formInline.wtclr = res.data.processorName;
        this.formInline.zrcs = res.data.departName;
        this.formInline.zrr = res.data.liablerName;
      }
    },
    handleZRRClose() {
      this.changeZRRlog = false;
    },
    handleWTCLRClose() {
      this.changeWTCLRlog = false;
    },
    onSubmit(formName) {
      // this.userRoleFrontShowInfos.forEach(item => {
      //   if(this.roleId == item.roleId) {
      //     this.projectProcessBuid = item.buid
      //   }
      // })
      let params = {
        description: this.formInline.wtms,
        type: this.formInline.wtlx,
        level: this.formInline.wtdj,
        processor: this.formInline.wtclrId,
        processorName: this.formInline.wtclr,
        proposer: this.formInline.tcrId,
        proposerName: this.formInline.tcr,
        departName: this.formInline.zrcs,
        liabler: this.formInline.zrrId,
        liablerName: this.formInline.zrr,
        projectId: this.$route.query.projectId,
        projectName: this.$route.query.projectName,
        systemName: this.$route.query.systemName,
        contractId: this.$route.query.contractId,
        sectionCount: this.$route.query.sectionCount,
        id: this.$route.query.id,
        contactName: this.$route.query.contactName,
        //部门id projectProcessBuid
        //角色   projectProcessRoleCode
        // projectProcessRoleCode: this.projectProcessRoleCode,
        // projectProcessBuid: String(this.projectProcessBuid)
      };

      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.saveBtn = true;
          const res = await api_trouble_assign(params);
          if (res.msg.code == "0000") {
            this.$message.success("保存成功");
            this.saveBtn = false;
            this.$router.back();
          } else {
            this.saveBtn = false;
          }
        } else {
          this.$message.error("输入数据");
          return false;
        }
      });
    },
    saveSelectZRR(val2) {
      this.formInline.zrr = val2[0].data[0].fullname;
      this.formInline.zrrId = val2[0].data[0].jfid;
      this.changeZRRlog = false;
    },
    saveSelectTCR(val2) {
      this.formInline.wtclr = val2[0].data[0].fullname;
      this.formInline.wtclrId = val2[0].data[0].jfid;
      this.changeWTCLRlog = false;
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
  },
};
</script>
<style lang="scss" scoped>
.all {
  background-color: #fff;
  padding: 40px 40px;
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
  background: #fff;
}
.el-form {
  padding-left: 4vw;
  padding-top: 1vw;
  padding-bottom: 5vw;
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
  padding: 20px !important;
  padding-bottom: 0 !important;
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
::v-deep.el-dialog__header {
  text-align: center !important;
}
::v-deep .el-form--inline .el-form-item__content {
  width: 70% !important;
}
::v-deep.el-form--inline .el-form-item {
  width: 100%;
}
::v-deep.el-select {
  width: 100%;
}
.elItem ::v-deep.el-form-item__content {
  width: 90% !important;
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
  .icon {
    color: rgba(66, 130, 255, 1);
  }
}
</style>
