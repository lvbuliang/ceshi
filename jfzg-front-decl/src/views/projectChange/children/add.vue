<template>
  <div class="total-page">
    <div v-if="editableTabs.length > 0">
      <div v-if="!get_success">
        <sr-nav-page :type="2" :project="projectObj"></sr-nav-page>
        <TestFormAdd
          v-if="!id || fromData"
          ref="formAdd"
          :fromData="fromData"
          :editableTabs="editableTabs"
          :slotList="['基本信息']"
        >
          <ProjectBaseMessage
            slot="基本信息"
            :projectId="$route.query.projectId"
            @projectInit="projectInit"
          />
        </TestFormAdd>
        <sr-work-flow
          :hideFrom="true"
          :clickMethods="clickmethods"
          :buttonList="buttonList"
          ref="work_flow"
          backName="projectChange"
          :workFlowLoading="workFlowLoading"
        ></sr-work-flow>
      </div>
      <div v-else>
        <SuccessMsg name="项目变更申请" />
      </div>
    </div>
  </div>
</template>

<script>
import { api_getlist_in_add, api_getlist_in_view } from "@/api/shenbao/index";
import { moduleCode } from "../const.js";
import SuccessMsg from "@/components/success_msg.vue";
import TestFormAdd from "@/components/srFormAdd.vue";
import WorkFlow from "@/components/SrWorkFlow";
import ProjectBaseMessage from "@/components/projectBaseMessage";
import config from "@/settings.js";
import upload from "@/utils/upload";
import srtracetrack from "@/utils/srtracetrack";
import workflows from "@/utils/workflow";
import { mapGetters } from "vuex";
import { setSession, getSession, removeSession } from "@/core/session.js";
import { setState } from "@/utils/app-store";
import { setIntervaltime } from "@/utils/common";
import {
  api_getbiangengDetailById,
  api_saveNew,
  api_draft,
  getChengjianUnit,
  getUnitMembers,
  getContractAmountByProjectId,
  getMainContractAmountByProjectId,
} from "@/api/biangeng/index";
import { api_getDetailById } from "@/api/projectLibrary/index";
import {
  api_getCustomFormTemplate,
  api_specialDetail,
  api_getSpecialSave,
  api_getSpecialUpdate,
  queryUnitMembersBy,
} from "@/api/index";
export default {
  components: {
    TestFormAdd,
    WorkFlow,
    ProjectBaseMessage,
    SuccessMsg,
  },
  computed: {
    ...mapGetters(["msg"]),
  },
  watch: {
    msg: function (n, o, y) {
      if (n == "主应用请求保存表单") {
        this.btg("close");
      }
    },
    get_success: function (n) {
      this.routeUpdata();
    },
    $route(to) {
      this.$set(this, "editableTabs", []);
      if (to.name == "projectChangeAdd") {
        this.createdfunc();
      }
    },
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
      workFlowLoading: false,
      oteherRes: {},
      oteherRes2: {},
      timer: "",
      isNew: false,
      get_success: false,
      projectId: this.$route.query.projectId,
      id: this.$route.query.id,
      editableTabs: [],
      fromData: {},
      activeName: "0",
      templateId: this.$route.query.templateId,
      clickmethods: { tg: this.tg, btg: this.btg },
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
          ],
          nodes: [
            {
              dataName: "",
              dataValue: "节点值0",
            },
          ],
        },
      ],
      supervisorLeader: "",
      supplyerLeader: "",
      projectObj: {},
    };
  },
  methods: {
    projectInit(val) {
      // 项目信息
      this.$set(this, "projectObj", val);
    },
    // 获取单位列表
    getChengjianUnit(Datas) {
      // let data = {
      //   buPropertyEnum: "JLDW",
      // };
      // getChengjianUnit(data).then((res) => {
      //   let type_list = [];
      //   res.data.forEach((item) => {
      //     let emunObj = {};
      //     emunObj.label = item.buName;
      //     emunObj.value = Number(item.buid);
      //     type_list.push(emunObj);
      //   });
      //   type_list.push({
      //     "label":"无监理单位",
      //     "value":""
      //   })
      //   this.editableTabs[0].formArr[0].selectData.formAdd.enums.supervisorNameList = type_list
      // });
      // getChengjianUnit({ buPropertyEnum: "CJDW" }).then((res) => {
      //   let type_list = [];
      //   res.data.forEach((item) => {
      //     let emunObj = {};
      //     emunObj.label = item.buName;
      //     emunObj.value = Number(item.buid);
      //     type_list.push(emunObj);
      //   });
      //   type_list.push({
      //     "label":"无承建单位",
      //     "value":""
      //   })
      //   this.editableTabs[0].formArr[0].selectData.formAdd.enums.changeSupplyerNameList = type_list
      // });
      if (Datas && Datas.cjdwBuld) {
        queryUnitMembersBy({ roleCode: "CJDW_JBR", buid: Datas.cjdwBuld }).then(
          (res) => {
            var cjdwjbrlist = res.data.map((item) => {
              let emunObj = {};
              emunObj.label = item.fullname;
              emunObj.value = item.jfid;
              return emunObj;
            });
            this.editableTabs[0].formArr[0].selectData.formAdd.enums.supplyerLeaderList =
              cjdwjbrlist;
          }
        );
      }

      if (Datas && Datas.cldwBuld) {
        queryUnitMembersBy({ roleCode: "JLDW_JBR", buid: Datas.cldwBuld }).then(
          (res) => {
            var jldwjbrlist = res.data.map((item) => {
              let emunObj = {};
              emunObj.label = item.fullname;
              emunObj.value = item.jfid;
              return emunObj;
            });
            this.editableTabs[0].formArr[0].selectData.formAdd.enums.supervisorLeaderList =
              jldwjbrlist;
          }
        );
      }
    },
    routeUpdata() {
      var routerBase = "/projectChange";
      setState({
        ignore: "upDataAddTab",
        msg: {
          title: this.$route.meta.title,
          url: `${routerBase}/#${this.$route.fullPath}`,
          meta: { ...this.$route.meta, isSave: true },
        },
      });
    },
    routeClose(timeout) {
      /* this.$SrUtils.routeClose.call(
        this,
        "subshenbao",
        this.$setState,
        timeout
      ); */
      this.$SrUtils.routeClose.call(this, "subdecl", this.$setState, timeout);
    },

    handleClick(tab, event) {},
    tg() {
      let data = this.$refs["formAdd"].validateFun();
      console.log("data", data);
      if (!data) return;
      data.projectId = this.$route.query.projectId || this.projectId;
      data.status = 2;
      data.annexes = [
        ...(data.changeReportFile || []), //变更报告
        ...(data.changeApplyFile || []), //变更申请函
        ...(data.changeDesignFile || []), //变更设计方案
        ...(data.originDesignFile || []), //项目原设计方案
        ...(data.originContractFile || []), //项目合同
        ...(data.otherFile || []), //其他附件
      ];
      var enums = this.editableTabs[0].formArr[0].selectData.formAdd.enums;
      // 监理单位
      if (data.supervisorName) {
        for (var i = 0; i < enums.supervisorNameList.length; i++) {
          if (data.supervisorName == enums.supervisorNameList[i].value) {
            data.changeJldwName = enums.supervisorNameList[i].label;
            break;
          }
        }
      } else {
        data.changeJldwName = "";
      }
      if (data.supervisorLeader) {
        for (var i = 0; i < enums.supervisorLeaderList.length; i++) {
          if (data.supervisorLeader == enums.supervisorLeaderList[i].value) {
            data.changeJldwLeaderName = enums.supervisorLeaderList[i].label;
            break;
          }
        }
      } else {
        data.changeJldwLeaderName = "";
      }
      // 承建单位
      if (data.changeSupplyerName) {
        for (var i = 0; i < enums.changeSupplyerNameList.length; i++) {
          if (
            data.changeSupplyerName == enums.changeSupplyerNameList[i].value
          ) {
            data.changeCjdwName = enums.changeSupplyerNameList[i].label;
            break;
          }
        }
      } else {
        data.changeCjdwName = "";
      }
      if (data.supplyerLeader) {
        for (var i = 0; i < enums.supplyerLeaderList.length; i++) {
          if (data.supplyerLeader == enums.supplyerLeaderList[i].value) {
            data.changeCjdwLeaderName = enums.supplyerLeaderList[i].label;
            break;
          }
        }
      } else {
        data.changeCjdwLeaderName = "";
      }
      //变更报告
      if (data.changeReportFile && data.changeReportFile.length > 0) {
        data.changeReportFile = JSON.stringify(data.changeReportFile);
      } else {
        data.changeReportFile = "";
      }
      // 变更申请函
      if (data.changeApplyFile && data.changeApplyFile.length > 0) {
        data.changeApplyFile = JSON.stringify(data.changeApplyFile);
      } else {
        data.changeApplyFile = "";
      }
      // 变更设计方案
      if (data.changeDesignFile && data.changeDesignFile.length > 0) {
        data.changeDesignFile = JSON.stringify(data.changeDesignFile);
      } else {
        data.changeDesignFile = "";
      }
      // 项目原设计方案
      if (data.originDesignFile && data.originDesignFile.length > 0) {
        data.originDesignFile = JSON.stringify(data.originDesignFile);
      } else {
        data.originDesignFile = "";
      }
      // 项目合同
      if (data.originContractFile && data.originContractFile.length > 0) {
        data.originContractFile = JSON.stringify(data.originContractFile);
      } else {
        data.originContractFile = "";
      }
      // 其他附件
      if (data.otherFile && data.otherFile.length > 0) {
        data.otherFile = JSON.stringify(data.otherFile);
      } else {
        data.otherFile = "";
      }
      if (data.annexes.length > 0) {
        data.annexes = JSON.stringify(data.annexes);
      } else {
        data.annexes = "";
      }

      data.templateId = this.templateId;
      if (this.$route.query.id) {
        data.id = this.$route.query.id;
      }
      // if(getSession("infoId_projectChange"+this.$route.query.projectId)&&getSession("infoId_projectChange"+this.$route.query.projectId) !="null"){
      // data.id = getSession("infoId_projectChange"+this.$route.query.projectId)
      // }
      if (this.oteherRes.data) {
        data.cjdwName = this.oteherRes.data.contractUnitFullName;
        data.cjdwBuld = this.oteherRes.data.contractUnit;
        data.cldwName = this.oteherRes.data.controlUnitFullName;
        data.cldwBuld = this.oteherRes.data.controlUnit;
      }
      if (this.oteherRes2.data) {
        data.amount = this.oteherRes2.data.contractAmount || "";
      }

      api_saveNew(data).then((res) => {
        if (res.msg.code == "0000") {
          removeSession("infoId_projectChange" + this.$route.query.projectId);
          this.$message.success("提交成功");
          clearInterval(this.timer);
          if (!this.$route.query.id) {
            this.get_success = true;
          } else {
            this.routeClose();
            this.$router.push({ name: "projectChange" });
          }
        }
      });
    },
    btg(str) {
      if (this.$refs["formAdd"]) {
        let data = this.$refs["formAdd"].validate();
        data.status = "1";
        data.platfrom = "";
        data.projectId = this.$route.query.projectId || this.projectId;
        data.templateId = this.templateId;
        if (this.$route.query.id) {
          data.id = this.$route.query.id;
        }
        var enums = this.editableTabs[0].formArr[0].selectData.formAdd.enums;
        if (data.supervisorName) {
          for (var i = 0; i < enums.supervisorNameList.length; i++) {
            if (data.supervisorName == enums.supervisorNameList[i].value) {
              data.changeJldwName = enums.supervisorNameList[i].label;
              break;
            }
          }
        } else {
          data.changeJldwName = "";
        }
        if (data.supervisorLeader) {
          for (var i = 0; i < enums.supervisorLeaderList.length; i++) {
            if (data.supervisorLeader == enums.supervisorLeaderList[i].value) {
              data.changeJldwLeaderName = enums.supervisorLeaderList[i].label;
              break;
            }
          }
        } else {
          data.changeJldwLeaderName = "";
        }
        if (data.changeSupplyerName) {
          for (var i = 0; i < enums.changeSupplyerNameList.length; i++) {
            if (
              data.changeSupplyerName == enums.changeSupplyerNameList[i].value
            ) {
              data.changeCjdwName = enums.changeSupplyerNameList[i].label;
              break;
            }
          }
        } else {
          data.changeCjdwName = "";
        }
        if (data.supplyerLeader) {
          for (var i = 0; i < enums.supplyerLeaderList.length; i++) {
            if (data.supplyerLeader == enums.supplyerLeaderList[i].value) {
              data.changeCjdwLeaderName = enums.supplyerLeaderList[i].label;
              break;
            }
          }
        } else {
          data.changeCjdwLeaderName = "";
        }
        if (data.changeReportFile && data.changeReportFile.length > 0) {
          data.changeReportFile = JSON.stringify(data.changeReportFile);
        } else {
          data.changeReportFile = "";
        }
        if (data.changeApplyFile && data.changeApplyFile.length > 0) {
          data.changeApplyFile = JSON.stringify(data.changeApplyFile);
        } else {
          data.changeApplyFile = "";
        }
        if (data.changeDesignFile && data.changeDesignFile.length > 0) {
          data.changeDesignFile = JSON.stringify(data.changeDesignFile);
        } else {
          data.changeDesignFile = "";
        }
        if (data.originDesignFile && data.originDesignFile.length > 0) {
          data.originDesignFile = JSON.stringify(data.originDesignFile);
        } else {
          data.originDesignFile = "";
        }
        if (data.originContractFile && data.originContractFile.length > 0) {
          data.originContractFile = JSON.stringify(data.originContractFile);
        } else {
          data.originContractFile = "";
        }
        if (data.otherFile && data.otherFile.length > 0) {
          data.otherFile = JSON.stringify(data.otherFile);
        } else {
          data.otherFile = "";
        }
        if (this.oteherRes.data) {
          data.cjdwName = this.oteherRes.data.contractUnitFullName;
          data.cjdwBuld = this.oteherRes.data.contractUnit;
          data.cldwName = this.oteherRes.data.controlUnitFullName;
          data.cldwBuld = this.oteherRes.data.controlUnit;
        }
        if (this.oteherRes2.data) {
          data.amount = this.oteherRes2.data.contractAmount || "";
        }
        api_saveNew(data).then((res) => {
          if (res.msg.code == "0000") {
            if (str == "linshi_current") {
              setSession(
                "infoId_projectChange" + this.$route.query.projectId,
                res.data
              );
            } else if (str == "close") {
              removeSession(
                "infoId_projectChange" + this.$route.query.projectId
              );
              this.$message.success("保存成功");
            } else {
              clearInterval(this.timer);
              this.$message.success("保存成功");
              removeSession(
                "infoId_projectChange" + this.$route.query.projectId
              );
              if (!this.$route.query.id) {
                this.get_success = true;
              } else {
                this.routeClose();
                this.$router.push({ name: "projectChange" });
              }
            }
          }
        });
      }
    },
    getConfigBind(arr, key) {
      // 获取数组里对应键的值
      return Array.isArray(arr) && arr.map((item) => item[key]);
    },
    forInItem(obj, val) {
      // 根据对应字段获取对象里对应的键和值
      if (typeof obj != "object" && typeof val != "string") return false;
      let newObj = {};
      for (const key in obj) {
        if (val.includes(key)) {
          newObj[key] = obj[key];
        }
      }
      return newObj;
    },
    async init(id, str) {
      if (str == "add") {
        let oteherRes = await api_getDetailById({
          id: this.$route.query.projectId,
        });
        let oteherRes2 = await getMainContractAmountByProjectId({
          projectId: this.$route.query.projectId,
        });
        console.log("oteherRes", oteherRes);
        console.log("oteherRes2", oteherRes2);
        oteherRes.data.SupplyerName = oteherRes.data.contractUnitFullName;
        oteherRes.data.supervisorName_1 = oteherRes.data.controlUnitFullName;
        oteherRes.data.cjdwBuld = oteherRes.data.contractUnit;
        oteherRes.data.cldwBuld = oteherRes.data.controlUnit;
        if (oteherRes2.data) {
          oteherRes.data.contractAmount = oteherRes2.data.contractAmount || "";
        }
        this.oteherRes = oteherRes;
        this.oteherRes2 = oteherRes2;
        this.projectId = this.$route.query.projectId;
        this.getTemplate(oteherRes.data);
      } else {
        let res = await api_getbiangengDetailById({ id: id });
        let oteherRes = await api_getDetailById({
          id: this.$route.query.projectId,
        });
        res.data.SupplyerName = oteherRes.data.contractUnitFullName;
        res.data.supervisorName_1 = oteherRes.data.controlUnitFullName;
        oteherRes.data.cjdwBuld = oteherRes.data.contractUnit;
        oteherRes.data.cldwBuld = oteherRes.data.controlUnit;
        if (res.data) {
          res.data.supervisorName = res.data.supervisorName
            ? Number(res.data.supervisorName)
            : "";
          res.data.supervisorLeader = res.data.supervisorLeader
            ? Number(res.data.supervisorLeader)
            : "";
          res.data.changeSupplyerName = res.data.changeSupplyerName
            ? Number(res.data.changeSupplyerName)
            : "";
          res.data.supplyerLeader = res.data.supplyerLeader
            ? Number(res.data.supplyerLeader)
            : "";
          if (
            res.data.changeReportFile &&
            res.data.changeReportFile.length > 0
          ) {
            res.data.changeReportFile = JSON.parse(res.data.changeReportFile);
          } else {
            res.data.changeReportFile = "";
          }
          if (res.data.changeApplyFile && res.data.changeApplyFile.length > 0) {
            res.data.changeApplyFile = JSON.parse(res.data.changeApplyFile);
          } else {
            res.data.changeApplyFile = "";
          }
          if (
            res.data.changeDesignFile &&
            res.data.changeDesignFile.length > 0
          ) {
            res.data.changeDesignFile = JSON.parse(res.data.changeDesignFile);
          } else {
            res.data.changeDesignFile = "";
          }
          if (
            res.data.originDesignFile &&
            res.data.originDesignFile.length > 0
          ) {
            res.data.originDesignFile = JSON.parse(res.data.originDesignFile);
          } else {
            res.data.originDesignFile = "";
          }
          if (
            res.data.originContractFile &&
            res.data.originContractFile.length > 0
          ) {
            res.data.originContractFile = JSON.parse(
              res.data.originContractFile
            );
          } else {
            res.data.originContractFile = "";
          }
          if (res.data.otherFile && res.data.otherFile.length > 0) {
            res.data.otherFile = JSON.parse(res.data.otherFile);
          } else {
            res.data.otherFile = "";
          }
          if (res.data.projectNature) {
            res.data.projectNature = JSON.stringify(res.data.projectNature);
          }
          this.projectId = res.data.projectId;
          this.getTemplate(res.data);
        }
      }
    },

    //  获取模板
    async getTemplate(Data) {
      await api_getCustomFormTemplate({
        moduleCode: moduleCode,
        // templateId: this.templateId,
      }).then((res) => {
        this.editableTabs =
          typeof res.data.templateDetail == "string" &&
          JSON.parse(res.data.templateDetail);

        let formArr =
          this.editableTabs && JSON.parse(this.editableTabs[0].formArr);
        this.templateId = res.data.id;
        this.editableTabs.forEach((item) => {
          this.$set(item, "formArr", JSON.parse(item.formArr));
          item.formArr.forEach((item1, index) => {
            let configArr = item1.selectData.formAdd.config;
            // 其他附件文件大小不能大于500MB
            if (item1.selectData.formAdd.config.length > 0) {
              configArr.forEach((item2) => {
                if (item2.bind == "otherFile") {
                  item2.fileSize = 500;
                }
              });
            }
            let configBind =
              this.getConfigBind(configArr, "bind") &&
              this.getConfigBind(configArr, "bind").join(",");
            let itemData = this.forInItem(Data, configBind);
            item.formArr[index].selectData.formAdd.data = itemData
              ? itemData
              : {};
          });
        });
      });
      this.getChengjianUnit(Data);
    },
    getsetInterval() {
      this.draft("linshi_current");
    },
    draft(str) {
      if (this.$refs["formAdd"]) {
        let data = this.$refs["formAdd"].validate();
        data.status = "1";
        // data.workOrderId = "1"
        data.platfrom = "";
        data.projectId = this.$route.query.projectId || this.projectId;
        data.templateId = this.templateId;
        var enums = this.editableTabs[0].formArr[0].selectData.formAdd.enums;
        if (data.supervisorName) {
          for (var i = 0; i < enums.supervisorNameList.length; i++) {
            if (data.supervisorName == enums.supervisorNameList[i].value) {
              data.changeJldwName = enums.supervisorNameList[i].label;
              break;
            }
          }
        } else {
          data.changeJldwName = "";
        }
        if (data.supervisorLeader) {
          for (var i = 0; i < enums.supervisorLeaderList.length; i++) {
            if (data.supervisorLeader == enums.supervisorLeaderList[i].value) {
              data.changeJldwLeaderName = enums.supervisorLeaderList[i].label;
              break;
            }
          }
        } else {
          data.changeJldwLeaderName = "";
        }
        if (data.changeSupplyerName) {
          for (var i = 0; i < enums.changeSupplyerNameList.length; i++) {
            if (
              data.changeSupplyerName == enums.changeSupplyerNameList[i].value
            ) {
              data.changeCjdwName = enums.changeSupplyerNameList[i].label;
              break;
            }
          }
        } else {
          data.changeCjdwName = "";
        }
        if (data.supplyerLeader) {
          for (var i = 0; i < enums.supplyerLeaderList.length; i++) {
            if (data.supplyerLeader == enums.supplyerLeaderList[i].value) {
              data.changeCjdwLeaderName = enums.supplyerLeaderList[i].label;
              break;
            }
          }
        } else {
          data.changeCjdwLeaderName = "";
        }
        if (this.$route.query.id) {
          data.id = this.$route.query.id;
        } else if (
          getSession("infoId_projectChange" + this.$route.query.projectId) &&
          getSession("infoId_projectChange" + this.$route.query.projectId) !=
            "null"
        ) {
          data.id = getSession(
            "infoId_projectChange" + this.$route.query.projectId
          );
          this.isNew = true;
        } else {
          this.isNew = true;
        }
        if (data.changeReportFile && data.changeReportFile.length > 0) {
          data.changeReportFile = JSON.stringify(data.changeReportFile);
        } else {
          data.changeReportFile = "";
        }
        if (data.changeApplyFile && data.changeApplyFile.length > 0) {
          data.changeApplyFile = JSON.stringify(data.changeApplyFile);
        } else {
          data.changeApplyFile = "";
        }
        if (data.changeDesignFile && data.changeDesignFile.length > 0) {
          data.changeDesignFile = JSON.stringify(data.changeDesignFile);
        } else {
          data.changeDesignFile = "";
        }
        if (data.originDesignFile && data.originDesignFile.length > 0) {
          data.originDesignFile = JSON.stringify(data.originDesignFile);
        } else {
          data.originDesignFile = "";
        }
        if (data.originContractFile && data.originContractFile.length > 0) {
          data.originContractFile = JSON.stringify(data.originContractFile);
        } else {
          data.originContractFile = "";
        }
        if (data.otherFile && data.otherFile.length > 0) {
          data.otherFile = JSON.stringify(data.otherFile);
        } else {
          data.otherFile = "";
        }
        this.workFlowLoading = true;
        api_draft(data).then((res) => {
          if (res.msg.code == "0000") {
            if (str == "linshi_current") {
              setSession(
                "infoId_projectChange" + this.$route.query.projectId,
                res.data
              );
            } else if (str == "close") {
              removeSession(
                "infoId_projectChange" + this.$route.query.projectId
              );
              this.$message.success("保存成功");
            } else {
              clearInterval(this.timer);
              this.$message.success("保存成功");
              removeSession(
                "infoId_projectChange" + this.$route.query.projectId
              );
              if (this.isNew == true) {
                this.get_success = true;
              } else {
                this.$router.push({ name: "projectChange" });
              }
            }
            this.workFlowLoading = false;
          }
        });
      }
    },
    createdfunc() {
      clearInterval(this.timer);
      this.isNew = false;
      this.get_success = false;

      if (this.$route.query.id) {
        this.init(this.$route.query.id, "edit");
      } else if (
        getSession("infoId_projectChange" + this.$route.query.projectId) &&
        getSession("infoId_projectChange" + this.$route.query.projectId) !=
          "null"
      ) {
        this.init(
          getSession("infoId_projectChange" + this.$route.query.projectId),
          "edit"
        );
        this.timer = setInterval(
          this.getsetInterval,
          this.$SrUtils.autoSaving()
        );
      } else {
        // api_getCustomFormTemplate({
        //   moduleCode: moduleCode,
        //   // templateId: this.templateId,
        // }).then((res) => {
        //   this.editableTabs = JSON.parse(res.data.templateDetail);
        //   this.templateId = res.data.id;
        // })
        this.getChengjianUnit();
        this.$nextTick(() => {
          this.init(null, "add");
        });
        /*   this.timer = setInterval(
          this.getsetInterval,
          this.$SrUtils.autoSaving()
        ); */
      }
    },
  },
  created() {
    this.createdfunc();
  },
  beforeRouteLeave(to, form, next) {
    if (this.$refs.work_flow) {
      this.$refs.work_flow.$el.style.display = "none";
    }
    clearInterval(this.timer);
    next();
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
};
</script>
<style lang="scss" scoped>
.searchPage {
  display: flex;
  justify-content: space-between;
}
.searchRightBtn {
  display: inline-block;
  button {
    width: 76px;
    height: 32px;
    border-radius: 16px;
    padding: 5px 24px;
  }
}
.tabsLabel {
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #333333;
  line-height: 24px;
  i {
    margin-right: 4px;
  }
}
::v-deep .el-tabs__header {
  margin-bottom: 8px;
}
.tabsDataTitle {
  margin-top: 8px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #333333;
  line-height: 22px;
}
</style>