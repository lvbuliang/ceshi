<template>
  <div class="task-detail-page">
    <sr-nav-page
      :project="srNavPageObj"
      :type="2"
      v-if="srNavPageObj"
    ></sr-nav-page>
    <!-- 实施方案编制 -->
    <TestFormView
      :activeNameT="
        $route.query.active == 1
          ? '成员管理'
          : $route.query.active == 2
          ? '基本信息'
          : '实施方案编制'
      "
      :editableTabs="[]"
      :hideTrackIcon="false"
      :slotList="['基本信息', '实施方案编制', '成员管理']"
    >
      <ProjectBaseMessage slot="基本信息" :projectId="$route.query.id" />
      <div class="InitiateDetail_class" slot="实施方案编制">
        <div class="box">
          <div title="实施方案编制"></div>
          <Todo ref="todo" class="todo_x" :style="styleObject"></Todo>
          <div>
            <div v-if="num == 0" class="wenjian mgt30">
              <div slot="content">
                <newwenjian
                  :CJDWbuid="Number(CJDWbuid)"
                  :danwei="danwei"
                ></newwenjian>
              </div>
            </div>
          </div>
          <div>
            <div class="mgt20" v-if="num == 1">
              <div slot="content">
                <liCen ref="modelLCB" class="mgt20"></liCen>
              </div>
            </div>
          </div>
          <div>
            <div class="mgt20" v-if="num == 2">
              <div slot="content">
                <JiaoFu ref="modelJFW"></JiaoFu>
              </div>
            </div>
          </div>
          <div>
            <div class="mgt20" v-if="num == 3">
              <div slot="content">
                <RenWu ref="taskson"></RenWu>
              </div>
            </div>
          </div>

          <div class="">
            <div class="mgt20" v-if="num == 4">
              <div slot="content">
                <Bianzhi ref="bianzhi"></Bianzhi>
              </div>
            </div>
          </div>
          <div class="mgt20" v-if="$route.name == 'bianzhiInitiateDetail'">
            <div class="postBtn">
              <el-button
                type="info"
                class="up_button"
                v-if="num != 0"
                @click="up_button('up')"
                >上一步</el-button
              >
              <el-button
                type="info"
                class="down_button"
                v-if="num != 4"
                @click="up_button('down')"
                >下一步</el-button
              >
              <el-button
                type="primary"
                v-if="num == 4"
                @click="up_button('fangan')"
                >提交</el-button
              >
            </div>
          </div>

          <WorkFlow
            ref="work_flow"
            :taskId="taskId"
            :buttonList="buttonList"
            :hideFrom="true"
            backName="bianzhi"
          ></WorkFlow>
        </div>
        <div style="height: 1px"></div>
      </div>
      <div
        slot="成员管理"
        v-if="
          editableTabs2.length > 0 && $route.name == 'bianzhiInitiateMemberSee'
        "
        class="projectmemberclass"
      >
        <TestFormAdd
          ref="formAdd"
          :fromData="fromData2"
          :editableTabs="editableTabs2"
        >
        </TestFormAdd>
        <sr-work-flow
          ref="work_flow"
          :hideFrom="true"
          :buttonList="buttonList2"
          :clickMethods="clickmethods"
          backName="bianzhi"
        ></sr-work-flow>
      </div>
      <!-- :slotList="['成员管理']" 去掉成员管理界面-->
      <div slot="成员管理" class="projectmemberclass" v-else>
        <TestFormView
          v-if="editableTabs3.length"
          :editableTabs="editableTabs3"
          :hideTrackIcon="true"
          :fromData="fromData"
          :slotList="['成员管理']"
        >
        </TestFormView>
        <sr-work-flow
          ref="work_flow"
          :hideFrom="true"
          :buttonList="buttonList"
          :clickMethods="clickmethods"
          backName="bianzhi"
        ></sr-work-flow>
      </div>
    </TestFormView>
    <!-- <div>
        <newwenjian></newwenjian>
      </div> -->
  </div>
</template>

<script>
import TestFormView from "@/components/srFormView.vue";
import ProjectBaseMessage from "@/components/projectBaseMessage";
import TestFormAdd from "../../../components/srFormAdd.vue";

import WorkFlow from "@/components/SrWorkFlow";
import {
  api_activititodo,
  api_getCustomFormTemplate,
  queryBizunitsByProperty,
  queryUnitMembersBy,
} from "@/api/index";
import {
  api_getDetailById,
  api_queryChildExist,
  queryUpdate,
} from "@/api/projectLibrary";
import { formatTime, formatNumber, formatNum } from "@/utils/utils";
import Todo from "../components/todo.vue";
import liCen from "./licenbei.vue";
import JiaoFu from "./jiaofu.vue";
import RenWu from "./taskList.vue";
import Bianzhi from "./bianzhifile.vue";

import wenjian from "../components/wenjian.vue";
import newwenjian from "../components/newwenjian.vue";

import {
  getstageList,
  setdeliveryList,
  getinfo,
  getmemberList,
  getbaseInfo,
  projectsubmit,
} from "@/api/shishi/implement";
import { queryBasicMessage } from "@/api/shishi/message";
import { supplyerSubmitAjax, getWithOutTask } from "@/api/shishi/taskList";
import {
  queryByUnitType,
  getDetailById,
  addlichengbeilist,
  saveJFWlist,
  submitBianzhi,
  saveBianzhi,
} from "@/api/bianzhi/index.js";
import config from "@/settings.js";
import upload from "@/utils/upload";
import workflows from "@/utils/workflow";
import srtracetrack from "@/utils/srtracetrack";
import store from "@/store";
export default {
  components: {
    TestFormView,
    ProjectBaseMessage,
    wenjian,
    newwenjian, //成员管理
    liCen, //里程碑管理
    JiaoFu, //交付物管理
    RenWu, //任务管理
    Bianzhi, //编制附件上传
    WorkFlow,
    Todo,
    TestFormAdd,
  },
  provide() {
    return {
      baseUrl: config.uploadBaseUrl,
      imgBaseUrl: config.imgBaseUrl,
      uploadRequest: upload,
      uploadBaseUrl: config.uploadBaseUrl,
      srtracetrackRequest: srtracetrack,
      workflowRequest: workflows,
    };
  },
  data() {
    return {
      srNavPageObj: null,
      styleObject: {
        width: "100%",
      },
      processId: "",
      beginDate: "",
      endDate: "",
      contractAmount: "",
      notcanLevel: false,
      CJDWbuid: "",
      projectTypeCode: "",
      memberdatas: {}, //承建单位
      elsteps: {
        data: 0,
      },
      danwei: "",
      ruleForm: {
        belongPlanType: "",
        cityPlanName: "", //城市规划名称
        mediumlongProjectName: "", //项目名称
        mediumlongProjectNo: "",
        mediumlongProjectName: "",
        responsibilityBuName: "",
        totalInvestment: "",
        constructionSite: "",
        industryNo: "", //行动方向
        projectTypeName: "", //项目类型
        beginDate: "", //计划开始日期
        endDate: "", //计划结束日期
        contactName: "", //项目联系人
        contactMobile: "", //联系人电话
        contactEmail: "", //联系联系人邮箱
        responsibilityBuid: "", //'责任单位id
        background: "", //建设背景
        objective: "", //建设目标
        content: "", //建设内容

        approvalTime: "", //批复时间
        approvalOpinion: "", //批复意见

        industryCode: "", //国标行业编码
        industryName: "",
        developmentFlag: "", //是否开发区 0-否 1-是
        developmentName: "",
        industrialStructureCode: "", //产业结构编码
        industrialStructureName: "",
        administrativeDivisionCode: "", //行政区划编码
        administrativeDivisionName: "", //
        projectClassificationCode: "", //工程分类编码
        projectClassificationName: " ",
        approvalCode: "", //立项类型编码
        approvalName: "", //立项类型名称
        fundAttributeCode: "", //'项目资金属性编码
        fundAttributeName: "",
        constructionNatureCode: "", //项目建设性质编码
        constructionNatureName: "",
        itemCategoryCode: "", //项目类别编码
        itemCategoryName: "", //项目类别编码
      },
      dialogVisible: false,
      form: {
        config: [
          {
            type: "upload",
            name: "实施方案",
            col: 24,
            placeholder: "请输入上传附件",
            bind: "contentFileRule",
            required: "请至少添加一个实施方案附件",
            limit: 10, //最大上传数量
            fileTip:
              "只能上传doc/docx/xls/xlsx/ppt/pptx/pdf/txt/jpg/jpeg/jpe/png/rar/zip格式文件，文件不能超过500MB", //提示
            fileType:
              "doc,docx,xls,xlsx,ppt,pptx,pdf,txt,jpg,jpeg,jpe,png,rar,zip", //校验
          },
          {
            type: "upload",
            name: "附件",
            col: 24,
            placeholder: "请输入上传附件",
            bind: "accessoryFiles",
            limit: 10, //最大上传数量
            fileTip:
              "只能上传doc/docx/xls/xlsx/ppt/pptx/pdf/txt/jpg/jpeg/jpe/png/rar/zip格式文件，文件不能超过500MB", //提示
            fileType:
              "doc,docx,xls,xlsx,ppt,pptx,pdf,txt,jpg,jpeg,jpe,png,rar,zip", //校验
          },
        ],
        data: {
          contentFileRule: "",
          accessoryFiles: "",
        },
        enums: {},
        rules: {},
      },
      id: "",
      num: 0,
      buttonList: [
        {
          role: "",
          btns: [],
          nodes: [],
        },
      ],
      // 成员管理
      buttonList2: [
        {
          role: "",
          btns: [
            {
              btnValue: "btg",
              btnName: "保存成员",
              btnType: "primary",
              btnEventType: "btg",
            },
          ],
          nodes: [],
        },
      ],
      editableTabs2: [],
      editableTabs3: [],
      fromData2: {},
      fromData3: {},
      addTaskForm: "",
      templateId2: null,
      jsdwlist: [],
      jsdwjbrlist: [],
      cjdwlist: [],
      cjdwjbrlist: [],
      jldwlist: [],
      jldwjbrlist: [],
      clickmethods: { btg: this.btg },
      // addTaskForm: "",
      userInfo: store.getters.userInfo,
      cjdwjbrIncludesTelList: [], //承建单位经办人信息包含联系方式
      jldwjbrIncludesTelList: [], //监理单位经办人信息包含联系方式
      jsdwjbrIncluedsList: [], //建设单位经办人信息包含联系方式
    };
  },
  provite() {
    return {
      Num: this.num,
    };
  },
  async created() {
    this.id = this.$route.query.id;
    this.getinfo();
    this.getInfodata();
    // this.add_Member();
    let res = await api_getDetailById({ id: this.id });
    let data = res.data;
    console.log("详情", res);
    api_getCustomFormTemplate({
      moduleCode: "17001",
      // templateId: this.templateId,
    }).then((res1) => {
      this.editableTabs3 = JSON.parse(res1.data.templateDetail);
      this.editableTabs3.forEach((item) => {
        item.formArr = JSON.parse(item.formArr);
        res.data.constructUnitFullName = res.data.constructUnitFullName; //建设单位
        res.data.constructor1 = res.data.constructFullName; //建设单位经办人
        res.data.contractUnit = res.data.contractUnitFullName; //承建单位
        res.data.contractor = res.data.contractFullName; //承建单位经办人
        res.data.controlUnit = res.data.controlUnitFullName; //监理单位
        res.data.controlJfid = res.data.controlFullName; //监理单位经办人
        item.formArr[0].selectData.formView.data = res.data;

        if (data) {
          JSON.parse(data).forEach((item1, index) => {
            console.log(item1);
            item.formArr[index + 1].selectData.formView.data = item1;
          });
        }
      });
    });
    if (this.$route.name == "bianzhiInitiateMemberSee") {
      this.add_Member();
      console.log(this.editableTabs2);
      console.log(this.fromData2);
    }
  },
  methods: {
    // 建设单位、承建单位、监理单位经办人onChange事件
    selectOnChange(value, val) {
      console.log("value", value, val);
      this.editableTabs2.forEach((item) => {
        item.formArr.forEach((item2) => {
          console.log(item2.selectData.formAdd.config);
          for (let i = 0; i < item2.selectData.formAdd.config.length; i++) {
            if (item2.selectData.formAdd.config[i].bind == "constructor1") {
              if (!value && val.bind == "constructor1") {
                item2.selectData.formAdd.data.constructorPhoneNumber = "";
                return;
              }
              const result = this.jsdwjbrIncluedsList.find(
                (item) => item.jfid == value
              );
              if (result) {
                console.log(result.mobile);
                item2.selectData.formAdd.data.constructorPhoneNumber =
                  result.mobile;
              }
            } else if (
              item2.selectData.formAdd.config[i].bind == "contractor"
            ) {
              if (!value && val.bind == "contractor") {
                item2.selectData.formAdd.data.contractorPhoneNumber = "";
                return;
              }
              const result = this.cjdwjbrIncludesTelList.find(
                (item) => item.jfid == value
              );
              if (result) {
                console.log(result.mobile);
                item2.selectData.formAdd.data.contractorPhoneNumber =
                  result.mobile;
              }
            } else if (
              item2.selectData.formAdd.config[i].bind == "controlJfid"
            ) {
              if (!value && val.bind == "controlJfid") {
                item2.selectData.formAdd.data.controlorPhoneNumber = "";
                return;
              }
              const result = this.jldwjbrIncludesTelList.find(
                (item) => item.jfid == value
              );
              if (result) {
                console.log(result.mobile);
                item2.selectData.formAdd.data.controlorPhoneNumber =
                  result.mobile;
              }
            }
          }
        });
      });
    },
    changeActive(num) {
      this.num = num;
      this.$set(this.elsteps, "data", this.num);
    },
    getinfo() {
      let { roleCode } = this.userInfo.currentRole;
      let { jfid } = this.userInfo;

      let param = {
        owner: jfid,
        role: roleCode,
        processId: this.$route.query.processId,
      };
      if (this.$route.query.processId) {
        api_activititodo(param).then((res) => {
          console.log(res);
          let assignee = res.data[0] ? res.data[0].assignee : "";
          this.taskId = res.data[0] ? res.data[0].taskId : "";
        });
      }
    },

    getInfodata() {
      var that = this;
      //liyufei mock
      getDetailById({ id: this.$route.query.id }).then((res) => {
        this.srNavPageObj = {
          projectName: res.data.projectName,
          projectCode: res.data.projectCode,
        };
        res.data.contractUnit = res.data.contractUnit;
        res.data.supplyerName = res.data.contractUnitFullName;
        var assignOObj = Object.assign({}, that.ruleForm, res.data);
        that.$set(that, "ruleForm", assignOObj);
        this.CJDWbuid = res.data.contractUnit;
        this.danwei = res.data.contractUnitFullName || "承建单位";
      });
    },
    on_click(e) {
      this.num = e;
      this.$set(this.elsteps, "data", e);
    },
    aa() {
      var data = this.$refs.bianzhi.form.data;
      var params = {
        projectId: this.$route.query.id,
        scheme: JSON.stringify(data.scheme), //方案
        accessory: JSON.stringify(data.accessory), //附件
      };
      submitBianzhi(params).then((res) => {
        this.$router.push({ name: "bianzhi" });
      });
    },
    dolist(str) {
      if (this.num == 1) {
        this.savestageList(str);
      } else if (this.num == 2) {
        this.saveJFWList(str);
      } else if (this.num == 0) {
        this.getInfodata(str);
        if (!this.notcanLevel) {
          if (str == "down") {
            this.num++;
            this.$refs.todo.editactive("add");
            this.$set(this.elsteps, "data", this.num);
          } else if (str == "up") {
            this.num--;
            this.$refs.todo.editactive("down");
            this.$set(this.elsteps, "data", this.num);
          }
        }
      } else if (this.num == 3) {
        if (!this.notcanLevel) {
          if (str == "down") {
            this.num++;
            this.$refs.todo.editactive("add");
            this.$set(this.elsteps, "data", this.num);
          } else if (str == "up") {
            this.num--;
            this.$refs.todo.editactive("down");
            this.$set(this.elsteps, "data", this.num);
          }
        }
      } else if (this.num == 4) {
        if (str == "up") {
          this.num--;
          this.$refs.todo.editactive("down");
          this.$set(this.elsteps, "data", this.num);
        } else if (str == "fangan") {
          this.aa();
        }
      }
    },
    up_button(str) {
      this.dolist(str);
      // if (!this.notcanLevel) {
      //   if (str == "fangan") {
      //     this.getWithOutTask();
      //   }
      // }
    },
    getWithOutTask() {
      this.aa();
      // getWithOutTask({ "projectId": this.$route.query.id }).then(res => {
      //   if (res.msg.code == '0000') {
      //     var titleerror = [];
      //     var errordata = "生成实施方案前，里程碑阶段下的：";
      //     for (var i = 0; i < res.data.length; i++) {
      //       if (i == 0) {
      //         errordata += res.data[i].stageName;
      //       } else {
      //         errordata = errordata + ',' + res.data[i].stageName;
      //       }
      //       titleerror.push(res.data[i].stageName);
      //     }

      //     if (titleerror && titleerror.length > 0) {
      //       errordata += '需要先创建任务';
      //       this.$confirm(errordata, "错误提示", {
      //         cancelButtonText: "取消",
      //         customClass: "changsha_confirm changsha_confirm_error" //
      //       })
      //         .then(() => {

      //         })
      //     } else {
      //       this.aa();
      //     }

      //   }
      // })
    },

    goback() {
      this.dialogVisible = false;
    },
    savestageList(str) {
      var params = {
        projectId: this.$route.query.id,
        stages: [],
      };
      var baseStageData = this.$refs.modelLCB.table.data;
      var notime = false;
      var noname = false;
      var errormsg = "";
      for (var i = 0; i < baseStageData.length; i++) {
        var map = {
          stageName: baseStageData[i].stageName,
          // stageCompleteDesc: baseStageData[i].stageCompleteDesc,
          stageWeight: baseStageData[i].stageWeight, //权重
          dueStartTime: baseStageData[i].dueStartTime || "", //开始时间
          dueEndTime: baseStageData[i].dueEndTime || "", //结束时间
          // flag: baseStageData[i].flag || "", //由里程碑模板带出,
          sort: i, //排序
        };
        if (!map.dueStartTime || !map.dueEndTime) {
          notime = true;
        }
        if (!baseStageData[i].stageName.trim()) {
          noname = true;
        }
        //判断固定值的结束时间是否晚于前一个固定值的结束时间
        // if (!errormsg && map.dueEndTime && i != 0 && map.flag && baseStageData[i - 1].flag) {
        //   var map0 = baseStageData[i - 1].dueEndTime ? baseStageData[i - 1].dueEndTime : '';
        //   if (map0 && map.dueEndTime <= map0) {
        //     errormsg = map.stageName + '的结束时间必须晚于' + baseStageData[i - 1].stageName + '的结束时间';
        //   }
        // }
        if (baseStageData[i].tmplId) {
          map.tmplId = baseStageData[i].tmplId;
        }
        //存在baseStageData[i].stageId为编辑状态数据
        if (baseStageData[i].stageId) {
          map.stageId = baseStageData[i].stageId;
        }
        params.stages.push(map);
      }
      if (baseStageData.length == 0 && str == "down") {
        this.$message({
          message: "请至少添加一条里程碑",
          type: "error",
        });
        this.notcanLevel = true;
      } else if (notime && str == "down") {
        this.$message({
          message: "请为里程碑添加时间",
          type: "error",
        });
        this.notcanLevel = true;
      } else if (noname && str == "down") {
        this.$message({
          message: "里程碑节点不能为空",
          type: "error",
        });
        this.notcanLevel = true;
      } else if (errormsg && str == "down") {
        this.$message({
          message: errormsg,
          type: "error",
        });
        this.notcanLevel = true;
      } else {
        this.notcanLevel = false;
        addlichengbeilist(params).then((res) => {
          if (!this.notcanLevel) {
            if (str == "down") {
              this.num++;
              this.$refs.todo.editactive("add");
            } else if (str == "up") {
              this.num--;
              this.$refs.todo.editactive("down");
            }
          }
        });
      }
    },

    saveJFWList(str) {
      var params = [];
      var eletab = this.$refs.modelJFW.eletab;
      var errormsg = "里程碑";
      var nook = false;
      for (var i = 0; i < eletab.length; i++) {
        if (eletab[i].deliverys && eletab[i].deliverys.length == 0) {
          if (nook) {
            errormsg += " 、 " + eletab[i].oldstageName;
          } else {
            errormsg += eletab[i].oldstageName;
          }
          nook = false;
        }
      }
      if (nook && str == "down") {
        this.$message({
          message: errormsg + "下存没有添加交付物，无法进行下一步",
          type: "warning",
        });
      } else {
        for (var i = 0; i < eletab.length; i++) {
          var datas = { delivery: [] };
          for (var j = 0; j < eletab[i].deliverys.length; j++) {
            var map = {
              name: eletab[i].deliverys[j].name,
              isChecked: eletab[i].deliverys[j].isChecked || 0, //0 不校验，1 校验
            };
            if (eletab[i].tmplId) {
              map.tmplId = eletab[i].tmplId;
            }
            if (
              eletab[i].deliverys[j].templates &&
              eletab[i].deliverys[j].templates.length > 0
            ) {
              map.templates = eletab[i].deliverys[j].templates;
            }
            datas.delivery.push(map);
          }
          datas.stageId = eletab[i].tagTypeId;
          params.push(datas);
        }
        saveJFWlist(params, this.$route.query.id).then((res) => {
          if (!this.notcanLevel) {
            if (str == "down") {
              this.num++;
              this.$refs.todo.editactive("add");
            } else if (str == "up") {
              this.num--;
              this.$refs.todo.editactive("down");
            }
          }
        });
      }
    },
    add_Member() {
      api_getCustomFormTemplate({
        moduleCode: "17001",
        // moduleCode: "3001",
        // templateId: this.templateId,
      }).then((res) => {
        console.log(res);
        this.editableTabs2 = JSON.parse(res.data.templateDetail);
        console.log(this.editableTabs2);
        this.editableTabs2.forEach((item) => {
          this.$set(item, "formArr", JSON.parse(item.formArr));
          item.formArr.forEach((item1, index) => {
            for (let k = 0; k < item1.selectData.formAdd.config.length; k++) {
              if (
                item1.selectData.formAdd.config[k].bind == "contractUnit" ||
                item1.selectData.formAdd.config[k].bind == "controlUnit"
              ) {
                item1.selectData.formAdd.config[k]["change"] =
                  this.onRadioChange;
              }
              if (
                item1.selectData.formAdd.config[k].bind == "constructor1" ||
                item1.selectData.formAdd.config[k].bind == "contractor" ||
                item1.selectData.formAdd.config[k].bind == "controlJfid"
              ) {
                console.log("添加事件");
                item1.selectData.formAdd.config[k]["change"] =
                  this.selectOnChange;
              }
            }
          });
          this.addTaskForm = item.formArr[0].selectData.formAdd;
        });

        this.templateId2 = res.data.id;
        var constructUnitFullName =
          this.$store.state.userinfo.userInfo.currentBizunit.buName;
        var constructionUnit =
          this.$store.state.userinfo.userInfo.currentBizunit.buid;
        this.fromData2 = {
          constructUnitFullName: constructUnitFullName,
          constructionUnit: constructionUnit,
          constructor1: "",
          contractUnit: "",
          contractor: "",
          controlUnit: "",
          controlJfid: "",
        };
        this.getData(this.fromData2);
      });
    },
    getData(fromData2) {
      queryBizunitsByProperty({ buPropertyEnum: "JSDW" }).then((res) => {
        console.log("1", res);
        this.jsdwlist = res.data.map((item) => {
          let emunObj = {};
          emunObj.dataName = item.buName;
          emunObj.dataValue = item.buid;
          return emunObj;
        });
        queryBizunitsByProperty({ buPropertyEnum: "CJDW" }).then((res) => {
          console.log("2", res);
          this.cjdwlist = res.data.map((item) => {
            let emunObj = {};
            emunObj.dataName = item.buName;
            emunObj.dataValue = item.buid;
            return emunObj;
          });
          queryBizunitsByProperty({ buPropertyEnum: "JLDW" }).then((res) => {
            console.log("3", res);
            this.jldwlist = res.data.map((item) => {
              let emunObj = {};
              emunObj.dataName = item.buName;
              emunObj.dataValue = item.buid;
              return emunObj;
            });
            queryUnitMembersBy({
              buid: this.$store.state.userinfo.userInfo.currentBizunit.buid,
              // roleCode:
              //   this.$store.state.userinfo.userInfo.currentRole.roleCode,
            }).then((res) => {
              console.log("4", res);
              this.jsdwjbrlist = res.data.map((item) => {
                let emunObj = {};
                emunObj.dataName = item.fullname;
                emunObj.dataValue = item.jfid;
                return emunObj;
              });
              this.jsdwjbrIncluedsList = res.data;
              this.editableTabs2.forEach((item) => {
                if (typeof item.formArr == "string") {
                  this.$set(item, "formArr", JSON.parse(item.formArr));
                }
                item.formArr.forEach((item1, index) => {
                  let configArr = item1.selectData.formAdd.config;
                  item1.selectData.formAdd.enums["jsdwlist"] = this.jsdwlist;
                  item1.selectData.formAdd.enums["cjdwlist"] = this.cjdwlist;
                  item1.selectData.formAdd.enums["jldwlist"] = this.jldwlist;
                  item1.selectData.formAdd.enums["jsdwjbrlist"] =
                    this.jsdwjbrlist;
                  let configBind =
                    this.getConfigBind(configArr, "bind") &&
                    this.getConfigBind(configArr, "bind").join(",");
                  let itemData = this.fromData2;
                  item.formArr[index].selectData.formAdd.data = itemData
                    ? itemData
                    : {};
                });
              });
            });
          });
        });
      });
    },
    getConfigBind(arr, key) {
      // 获取数组里对应键的值
      return Array.isArray(arr) && arr.map((item) => item[key]);
    },
    onRadioChange(val, item, k) {
      // 是否需要检查人的值切换
      if (item.bind == "contractUnit") {
        this.resetChecker(val, k);
      } else if (item.bind == "controlUnit") {
        this.resetChecker2(val, k);
      }
    },
    resetChecker(val, k) {
      this.$set(this.addTaskForm.data, "contractor", ""); //清空承建单位经办人
      this.getmember("CJDW_JBR", val);
    },
    resetChecker2(val, k) {
      this.$set(this.addTaskForm.data, "controlJfid", ""); //清空承建单位经办人
      this.getmember("JLDW_JBR", val);
    },
    getmember(roleCode, buid) {
      queryUnitMembersBy({ roleCode: roleCode, buid: buid }).then((res) => {
        if (roleCode == "CJDW_JBR") {
          console.log("承建单位经办人", res);
          this.cjdwjbrlist = res.data.map((item) => {
            let emunObj = {};
            emunObj.dataName = item.fullname;
            emunObj.dataValue = item.jfid;
            return emunObj;
          });
          this.cjdwjbrIncludesTelList = res.data;
          console.log("承建单位经办人", this.cjdwjbrlist);
          this.$set(this.addTaskForm.enums, "cjdwjbrlist", this.cjdwjbrlist); //承建单位经办人可选列表
        } else if (roleCode == "JLDW_JBR") {
          console.log("监理单位经办人", res);

          this.jldwjbrlist = res.data.map((item) => {
            let emunObj = {};
            emunObj.dataName = item.fullname;
            emunObj.dataValue = item.jfid;
            return emunObj;
          });
          this.jldwjbrIncludesTelList = res.data;
          console.log("监理单位经办人", this.jldwjbrlist);
          this.$set(this.addTaskForm.enums, "jldwjbrlist", this.jldwjbrlist); //监理单位经办人可选列表
        }
      }, roleCode);
    },
    btg() {
      var data = this.$refs["formAdd"].validate();
      this.$refs["formAdd"].$refs["add0"][0].validate((valid) => {
        if (valid) {
          delete data.data;
          data.memberStatus = 1;
          data.constructor = data.constructor1;
          data.id = this.$route.query.id;
          for (var i = 0; i < this.cjdwlist.length; i++) {
            if (this.cjdwlist[i].dataValue == data.contractUnit) {
              data.contractUnitFullName =
                this.cjdwlist[i].dataName; /**承建单位姓名*/
            }
          }
          for (var i = 0; i < this.jsdwlist.length; i++) {
            if (this.jsdwlist[i].dataValue == data.constructionUnit) {
              data.constructUnitFullName =
                this.jsdwlist[i].dataName; /**建设单位姓名*/
            }
          }
          for (var i = 0; i < this.jldwlist.length; i++) {
            if (this.jldwlist[i].dataValue == data.controlUnit) {
              data.controlUnitFullName =
                this.jldwlist[i].dataName; /**监理单位姓名*/
            }
          }
          queryUpdate(data).then((res) => {
            if (res.msg.code == "0000") {
              this.$message.success("保存成功");
              this.$router.push({ name: "bianzhi" });
            }
          });
        }
      });
    },
  },
};
</script>
<style lang="scss">
.tablecenter {
  text-align: center;
}
.InitiateDetail_class {
  .mgt20 {
    margin-top: 20px;
    .el-step {
      cursor: pointer;
    }
  }
  .mgt30 {
    margin-top: 30px;
  }
  .mgt70 {
    margin-top: 73px;
  }
  ::v-deep.el-steps {
    width: 654px;
    margin: 0 auto;
    cursor: auto !important;
  }
  .up_button {
    width: 100px;
    height: 40px;
    background: rgba(163, 187, 210, 1);
    box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    font-size: 14px;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    line-height: 16px;
  }
  .down_button {
    width: 100px;
    height: 40px;
    background: rgba(24, 144, 255, 1);
    box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    font-size: 14px;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    line-height: 16px;
  }
}
</style>
<style lang="scss" scoped>
.InitiateDetail_class {
  .box {
    background: white;
    min-height: 700px;
  }
  .mgt40 {
    margin-top: 40px;
  }
  ::v-deep .Tabs {
    margin: 20px 20px;
  }
  .mgt20 {
    margin-top: 20px;
    .el-step {
      margin: 30px 0 20px;
      cursor: pointer;
    }
  }
  ::v-deep .table-components {
    padding: 0;
  }
  ::v-deep .el-step__icon {
    width: 30px;
    height: 30px;
    border-width: 6px;
  }
  ::v-deep .wrap .inner .title {
    z-index: 1;
  }
  // ::v-deep .wenjian {
  //   // width: 818px;
  // }
  .el-header {
    color: #333;
    text-align: center;
  }
  .postBtn {
    padding-bottom: 50px;
    text-align: center;
  }
  ::v-deep.unitName {
    width: 100%;
  }
  ::v-deep.selectUser {
    position: absolute;
    padding: 0 !important;
    width: 302px;
    top: -116px;
    right: -332px;
  }
}
.projectmemberclass {
  ::v-deep .el-tabs__header {
    display: none;
  }
}
</style>
