<template>
  <div class="task-detail-page">
    <sr-nav-page
      :project="srNavPageObj"
      :type="2"
      v-if="srNavPageObj"
    ></sr-nav-page>
    <TestFormView
      activeNameT="实施方案编制"
      :editableTabs="[]"
      :hideTrackIcon="true"
      :slotList="['基本信息', '实施方案编制']"
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
                <liCen
                  ref="modelLCB"
                  :projectType="projectType"
                  v-if="isgetDetail"
                ></liCen>
              </div>
            </div>
          </div>
          <div>
            <div class="mgt20" v-if="num == 2">
              <div slot="content">
                <JiaoFu
                  ref="modelJFW"
                  :projectType="projectType"
                  v-if="isgetDetail"
                ></JiaoFu>
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
            <div class="mgt70" v-if="num == 4">
              <div slot="content">
                <Bianzhi ref="bianzhi"></Bianzhi>
              </div>
            </div>
          </div>
          <!-- <div class="mgt20" v-if='$route.name =="bianzhiInitiateDetail"'>
        <div class="postBtn">
          <el-button type="info"
            class='up_button'
            v-if="num!=0"
            @click="up_button('up')">上一步</el-button>
          <el-button type="info"
            class='down_button'
            v-if="num!=4"
            @click="up_button('down')">下一步</el-button>
          <el-button type="primary"
            v-if="num==4"
            @click="up_button('fangan')">提交</el-button>
            
        </div>
      </div> -->

          <WorkFlow
            ref="work_flow"
            :taskId="taskId"
            :clickMethods="clickmethods"
            :buttonList="buttonList"
            :hideFrom="true"
            backName="bianzhi"
          ></WorkFlow>
        </div>
        <div style="height: 1px"></div>
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

import WorkFlow from "@/components/SrWorkFlow";
import { api_activititodo } from "@/api/index";
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
  watch: {
    num: function (n) {
      if (n == 0) {
        var button = JSON.parse(JSON.stringify(this.buttonList[0].allbutton));
        button.splice(2, 1);
        button.splice(0, 2);
        this.$set(this.buttonList[0], "btns", button);
      } else if (n == 4) {
        var button = JSON.parse(JSON.stringify(this.buttonList[0].allbutton));
        button.splice(3, 1);
        this.$set(this.buttonList[0], "btns", button);
      } else {
        var button = JSON.parse(JSON.stringify(this.buttonList[0].allbutton));
        button.splice(0, 2);
        this.$set(this.buttonList[0], "btns", button);
      }
    },
  },
  data() {
    return {
      isgetDetail: false,
      projectType: null,
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
      danwei: "",
      projectTypeCode: "",
      memberdatas: {}, //承建单位
      elsteps: {
        data: 0,
      },
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
      num: null,
      clickmethods: {
        tg: this.aa,
        btg: this.save,
        up_button: this.up_button,
        down_button: this.down_button,
      },
      buttonList: [
        {
          role: "",
          btns: [
            {
              btnName: "提交",
              btnValue: "tg",
              btnType: "default",
              btnEventType: "tg",
            },
            {
              btnValue: "btg",
              btnName: "保存",
              btnType: "primary",
              btnEventType: "btg",
            },
            {
              btnName: "上一步",
              btnValue: "up_button",
              btnType: "default",
              btnEventType: "up_button",
            },
            {
              btnValue: "down_button",
              btnName: "下一步",
              btnType: "primary",
              btnEventType: "down_button",
            },
          ],
          allbutton: [
            {
              btnName: "提交",
              btnValue: "tg",
              btnType: "default",
              btnEventType: "tg",
            },
            {
              btnValue: "btg",
              btnName: "保存",
              btnType: "primary",
              btnEventType: "btg",
            },
            {
              btnName: "上一步",
              btnValue: "up_button",
              btnType: "default",
              btnEventType: "up_button",
            },
            {
              btnValue: "down_button",
              btnName: "下一步",
              btnType: "primary",
              btnEventType: "down_button",
            },
          ],
          nodes: [],
        },
      ],
      taskId: "",
      userInfo: store.getters.userInfo,
    };
  },
  provite() {
    return {
      Num: this.num,
    };
  },
  created() {
    this.num = 0;
    this.id = this.$route.query.id;
    // if(this.$route.query.processId){
    //   this.getinfo();
    // }

    this.getInfodata();
  },
  methods: {
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
      api_activititodo(param).then((res) => {
        let assignee = res.data[0] ? res.data[0].assignee : "";
        res.data[0]
          ? (this.buttonList = JSON.parse(res.data[0].description).filter(
              (item) => {
                //按钮筛选  以assignee优先roleCode
                item.assignee = assignee;
                if (assignee == jfid) {
                  return true;
                } else if (roleCode == item.role) {
                  return true;
                }
              }
            ))
          : (this.buttonList = []);
        // this.taskId = res.data[0]?res.data[0].taskId:'';
      });
    },

    getInfodata() {
      var that = this;
      //liyufei mock
      getDetailById({ id: this.$route.query.id }).then((res) => {
        this.srNavPageObj = {
          projectName: res.data.projectName,
          projectCode: res.data.projectCode,
        };
        this.projectType = res.data.projectType;
        this.isgetDetail = true;
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
    save() {
      this.$refs.bianzhi.$refs["form"].validate((valid) => {
        if (valid) {
          var data = this.$refs.bianzhi.form.data;
          var params = {
            projectId: this.$route.query.id,
            scheme: data.scheme ? JSON.stringify(data.scheme) : "", //方案
            accessory: data.accessory ? JSON.stringify(data.accessory) : "", //附件
          };
          saveBianzhi(params).then((res) => {
            this.$router.push({ name: "bianzhi" });
          });
        }
      });
    },
    aa() {
      this.$refs.bianzhi.$refs["form"].validate((valid) => {
        if (valid) {
          var data = this.$refs.bianzhi.form.data;
          if (data.scheme && data.scheme.length > 0) {
            var params = {
              projectId: this.$route.query.id,
              scheme: JSON.stringify(data.scheme), //方案
              accessory: data.accessory ? JSON.stringify(data.accessory) : "", //附件
            };
            submitBianzhi(params).then((res) => {
              this.$router.push({ name: "bianzhi" });
            });
          } else {
            this.$SrUtils.showConfirmMessage.call(this, {
              title: "错误提示",
              content: "请先上传编制方案文件",
              okFun: () => {},
              cancelFun: () => {},
            });

            return false;
          }
        }
      });
    },
    dolist(str) {
      console.log(str, this.num);

      if (this.num == 1) {
        console.log("1");
        // debugger;
        this.savestageList(str);
      } else if (this.num == 2) {
        console.log("2");
        // debugger;
        this.saveJFWList(str);
      } else if (this.num == 0) {
        console.log("0");
        // debugger;
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
        console.log("3");
        // debugger;
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
        console.log("4");
        // debugger;
        if (str == "up") {
          this.num--;
          this.$refs.todo.editactive("down");
          this.$set(this.elsteps, "data", this.num);
        } else if (str == "fangan") {
          this.aa();
        }
      }
    },
    up_button() {
      this.dolist("up");
    },
    down_button() {
      this.dolist("down");
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
      console.log("jichu", baseStageData);
      // debugger;
      var notime = false;
      var noname = false;
      var errormsg = "";
      for (var i = 0; i < baseStageData.length; i++) {
        var map = {
          stageName: baseStageData[i].stageName,
          stageCompleteDesc: baseStageData[i].stageCompleteDesc,
          stageWeight: baseStageData[i].stageWeight, //权重
          dueStartTime: baseStageData[i].dueStartTime || "", //开始时间
          dueEndTime: baseStageData[i].dueEndTime || "", //结束时间
          flag: baseStageData[i].flag || "", //由里程碑模板带出,
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
        if (baseStageData[i].tempId) {
          map.tempId = baseStageData[i].tempId;
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
  },
};
</script>
<style lang="scss"  scoped>
::v-deep .el-row .el-col-5 {
  width: 32.83333% !important;
}
::v-deep .el-row .el-col-19 {
  width: 67.16667% !important;
}
</style>
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
</style>