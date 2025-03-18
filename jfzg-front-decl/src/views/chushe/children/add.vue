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
          :slotList="['基本信息', '可研信息']"
        >
          <ProjectBaseMessage
            slot="基本信息"
            :projectId="$route.query.projectId"
            @projectInit="projectInit"
          />
          <KeyanMessage slot="可研信息" :projectId="$route.query.projectId" />
          <div :slot="slotName" slot-scope="{ form }" class="fundPlan">
            <span class="sumTitle">总计：</span>
            {{ sumFun(form) }}
          </div>
        </TestFormAdd>
        <sr-work-flow
          :hideFrom="true"
          :clickMethods="clickmethods"
          :buttonList="buttonList"
          backName="chushe"
          ref="work_flow"
          :workFlowLoading="workFlowLoading"
        ></sr-work-flow>
      </div>
      <div v-else>
        <SuccessMsg name="初设及概算申报" />
      </div>
    </div>
  </div>
</template>

<script>
import SuccessMsg from "@/components/success_msg.vue";
import { mapGetters } from "vuex";
import { setSession, getSession, removeSession } from "@/core/session.js";
import { setState } from "@/utils/app-store";

import { moduleCode } from "../const.js";
import TestFormAdd from "@/components/srFormAdd.vue";
import ProjectBaseMessage from "@/components/projectBaseMessage";
import KeyanMessage from "../components/keyanMessage";
import config from "@/settings.js";
import upload from "@/utils/upload";
import {
  api_getCustomFormTemplate,
  api_getAllDesignCompanyList,
  api_getAllDesignerList,
} from "@/api/index";
import {
  api_cs_save,
  api_cs_update,
  api_cs_getDetailById,
  api_cs_draft_noLoading,
} from "@/api/chushe";
export default {
  components: {
    TestFormAdd,
    ProjectBaseMessage,
    KeyanMessage,
    SuccessMsg,
  },

  provide() {
    return {
      baseUrl: config.uploadBaseUrl,
      imgBaseUrl: config.imgBaseUrl,
      uploadRequest: upload,
      uploadBaseUrl: config.uploadBaseUrl,
    };
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
      if (to.name == "chusheAdd") {
        this.createdfunc();
      }
    },
  },
  data() {
    return {
      projectId: this.$route.query.projectId,
      id: this.$route.query.id,
      workFlowLoading: false,
      slotName: "",
      projectObj: {},
      detail: {},
      editableTabs: [],
      fromData: {},
      activeName: "0",
      templateId: this.$route.query.templateId,
      clickmethods: { saveForm: this.saveForm, saveNoCheck: this.saveNoCheck },
      buttonList: [
        {
          role: "",
          btns: [
            {
              btnName: "提交",
              btnValue: "saveForm",
              btnType: "default",
              btnEventType: "saveForm",
            },
            {
              btnValue: "saveNoCheck",
              btnName: "保存",
              btnType: "primary",
              btnEventType: "saveNoCheck",
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
      // 自动化新增参数集
      timer: "",
      isNew: false,
      get_success: false,
      /************************************************/
      designList: [], // 设计人
      designUnitsList: [], // 设计公司
      addTaskForm: "",
    };
  },
  methods: {
    /*
     * 自动化新增方法集
     */
    routeUpdata() {
      var routerBase = "/subshenbao";
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
      this.$SrUtils.routeClose.call(
        this,
        "subshenbao",
        this.$setState,
        timeout
      );
    },
    createdfunc() {
      clearInterval(this.timer);
      this.isNew = false;
      this.get_success = false;

      if (this.$route.query.id) {
        this.init(this.$route.query.id);
      } else if (
        getSession("infoId_chushe" + this.$route.query.projectId) &&
        getSession("infoId_chushe" + this.$route.query.projectId) != "null"
      ) {
        this.init(getSession("infoId_chushe" + this.$route.query.projectId));
        this.timer = setInterval(
          this.getsetInterval,
          this.$SrUtils.autoSaving()
        );
      } else {
        api_getCustomFormTemplate({
          moduleCode: moduleCode,
          // templateId: this.templateId,
        }).then((res) => {
          if (res.data && res.msg.code == "0000") {
            this.editableTabs =
              typeof res.data.templateDetail == "string" &&
              JSON.parse(res.data.templateDetail);
            this.templateId = res.data.id;
            this.chuli();
          }
        });
        this.timer = setInterval(
          this.getsetInterval,
          this.$SrUtils.autoSaving()
        );
      }
    },
    chuli() {
      this.editableTabs.forEach((item) => {
        try {
          this.$set(item, "formArr", JSON.parse(item.formArr));
        } catch (e) {
          this.$set(item, "formArr", item.formArr);
        }
        let zjName = this.$utils.arrFind(item.formArr, "资金使用计划", "title");
        this.$set(this, "slotName", zjName.title);
        this.addTaskForm = item.formArr[0].selectData.formAdd;
        this.designUnitsFun(this.addTaskForm);
        if (!this.addTaskForm.enums.designerList.length && this.addTaskForm.data.designUnits) {
          this.getDesignerByCompanyId(this.addTaskForm.data.designUnits);
        }
      });
    },
    designUnitsFun(form) {
      //设计单位处理
      let index = this.$utils.getArrIndex(form.config, "designUnits", "bind");
      if (index > -1) {
        form.config[index].change = this.designUnitChange;
      }
      this.initDesignerFun();
      if (!form.enums.designUnitsList.length) {
        this.initCompany(form);
        // .then((res) => {
      
        // });
      }
    },
    async initCompany(form) {
      // 设计单位接口
      let res = await api_getAllDesignCompanyList({
        pageNum: 1,
        pageSize: 9999999,
      });
      if (res && res.data && res.data.records) {
        this.designUnitsList = res.data.records;
        this.$set(
          form.enums,
          "designUnitsList",
          this.$utils.enumsDataNameValue(res.data.records, "companyName", "id")
        );
      }
    },
    async getDesignerByCompanyId(companyId) {
      // 根据公司id获取
      let res = await api_getAllDesignerList({
        pageNum: 1,
        pageSize: 9999999,
        companyId,
      });
      if (res && res.data && res.data.records) {
        this.designList = res.data.records;
        this.$set(
          this.addTaskForm.enums,
          "designerList",
          this.$utils.enumsDataNameValue(this.designList, "name", "id")
        );
      }
    },
    async designUnitChange(companyId) {
      this.getDesignerByCompanyId(companyId)
      this.$set(this.addTaskForm.data, "designer", '');
      this.$set(this.addTaskForm.data, "designerPhone", '');
    },
    initDesignerFun() {
      //设计人处理
      let index = this.$utils.getArrIndex(this.addTaskForm.config, "designer", "bind");
      if (index > -1) {
        this.addTaskForm.config[index].change = this.designerPhoneChange;
      }
    },
    designerPhoneChange(id) {
      let obj = this.$utils.arrFind(this.designList, id, "id");
      if (id) {
        this.$set(this.addTaskForm.data, "designerPhone", obj.contactMobile);
      } else {
        this.$set(this.addTaskForm.data, "designerPhone", "");
      }
    },
    getsetInterval() {
      this.btg("linshi_current");
    },
    /********************************************************************/

    projectInit(val) {
      // 项目信息
      this.$set(this, "projectObj", val);
    },
    handleClick(tab, event) {},
    // 提交
    async saveForm() {
      let data = this.$refs["formAdd"]?.validateFun();
      if (!data) return;
      let obj = data.data
        ? this.$utils.resultObject(JSON.parse(data.data))
        : {};
      let designList = this.$refs.formAdd.designList;
      let designUnitsList = this.$refs.formAdd.designUnitsList;
      let { designUnits, designer, applyFile, researchFile, otherFile } = obj;
      let designObj = this.$utils.arrFind(designList, designer, "id");
      let designUnitsObj = this.$utils.arrFind(
        designUnitsList,
        designUnits,
        "id"
      );
      let params = {
        ...data,
        ...obj,
        status: 2, // 1-已提交(草稿) 2-已提审（走流程） 3-已发布
        projectId: this.projectId,
        templateId: this.templateId,
        projectName: this.projectObj.projectName,
        projectCode: this.projectObj.projectCode,
        designUnitsName: designUnits && designUnitsObj?.companyName, // 设计公司中文
        designerName: designer && designObj?.name, // 设计人中文
        applyFile: Array.isArray(applyFile) && JSON.stringify(applyFile),
        researchFile:
          Array.isArray(researchFile) && JSON.stringify(researchFile),
        otherFile: Array.isArray(otherFile) && JSON.stringify(otherFile),
        annexes: JSON.stringify(
          this.disposeFile([applyFile, researchFile, otherFile])
        ),
      };
      if (this.$route.query.id) {
        params.id = this.$route.query.id;
      } else if (
        getSession("infoId_chushe" + this.$route.query.projectId) &&
        getSession("infoId_chushe" + this.$route.query.projectId) != "null"
      ) {
        params.id = getSession("infoId_chushe" + this.$route.query.projectId);
      }
      if (params.id) {
        let res = await api_cs_update(params);
        if (res.msg.code == "0000") {
          removeSession("infoId_chushe" + this.$route.query.projectId);
          clearInterval(this.timer);
          if (!this.$route.query.id) {
            this.get_success = true;
          } else {
            this.$message.success("修改成功");
            this.routeClose();

            this.$router.push({ name: "chushe" });
          }
        }
      } else {
        let res2 = await api_cs_save(params);

        if (res2.msg.code == "0000") {
          removeSession("infoId_chushe" + this.$route.query.projectId);
          clearInterval(this.timer);
          if (!this.$route.query.id) {
            this.get_success = true;
          } else {
            this.$message.success("新增成功");
            this.routeClose();

            this.$router.push({ name: "chushe" });
          }
        }
      }
    },
    // 保存
    async saveNoCheck(str) {
      if (!this.$refs["formAdd"]) return;
      let data = this.$refs["formAdd"].validate();
      let obj = data.data
        ? this.$utils.resultObject(JSON.parse(data.data))
        : {};
      let designList = this.$refs.formAdd.designList;
      let designUnitsList = this.$refs.formAdd.designUnitsList;
      let { designUnits, designer } = data;
      let { applyFile, researchFile, otherFile } = obj;

      let designObj = this.$utils.arrFind(designList, designer, "id");
      let designUnitsObj = this.$utils.arrFind(
        designUnitsList,
        designUnits,
        "id"
      );

      let { status } = this.detail;
      let params = {
        ...data,
        ...obj,
        projectId: this.projectId,
        templateId: this.templateId,
        projectName: this.projectObj.projectName,
        projectCode: this.projectObj.projectCode,
        designUnitsName: designUnits && designUnitsObj?.companyName, // 设计公司中文
        designerName: designer && designObj?.name, // 设计人中文
        status: status == 5 ? 5 : 1, // 1-已提交(草稿) 2-已提审（走流程） 3-已发布
        applyFile: Array.isArray(applyFile) && JSON.stringify(applyFile),
        researchFile:
          Array.isArray(researchFile) && JSON.stringify(researchFile),
        otherFile: Array.isArray(otherFile) && JSON.stringify(otherFile),
      };

      if (this.$route.query.id) {
        params.id = this.$route.query.id;
      }

      if (str == "linshi_current") {
        // 是否是自动保存的数据
        params.delFlag = 1;
      }
      if (
        getSession("infoId_chushe" + this.$route.query.projectId) &&
        getSession("infoId_chushe" + this.$route.query.projectId) != "null"
      ) {
        // 自动保存拿到的id
        params.id = getSession("infoId_chushe" + this.$route.query.projectId);
      }
      if (params.id) {
        let res = await api_cs_update(params);
        if (res.msg.code == "0000") {
          removeSession("infoId_chushe" + this.$route.query.projectId);
          clearInterval(this.timer);
          if (!this.$route.query.id) {
            this.get_success = true;
          } else {
            this.$message.success("修改成功");
            this.routeClose();

            this.$router.push({ name: "chushe" });
          }
        }
      } else {
        let res2 = await api_cs_save(params);

        if (res2.msg.code == "0000") {
          removeSession("infoId_chushe" + this.$route.query.projectId);
          clearInterval(this.timer);
          if (!this.$route.query.id) {
            this.get_success = true;
          } else {
            this.$message.success("新增成功");
            this.routeClose();

            this.$router.push({ name: "chushe" });
          }
        }
      }
    },
    // 草稿
    async btg(str) {
      if (!this.$refs["formAdd"]) return;

      let data = this.$refs["formAdd"].validate();
      let obj = data.data
        ? this.$utils.resultObject(JSON.parse(data.data))
        : {};
      let designList = this.$refs.formAdd.designList;
      let designUnitsList = this.$refs.formAdd.designUnitsList;
      let { designUnits, designer } = data;
      let designObj = this.$utils.arrFind(designList, designer, "id");
      let designUnitsObj = this.$utils.arrFind(
        designUnitsList,
        designUnits,
        "id"
      );

      let { status } = this.detail;
      let params = {
        ...data,
        ...obj,
        projectId: this.projectId,
        templateId: this.templateId,
        projectName: this.projectObj.projectName,
        projectCode: this.projectObj.projectCode,
        designUnitsName: designUnits && designUnitsObj?.companyName, // 设计公司中文
        designerName: designer && designObj?.name, // 设计人中文
        status: status == 5 ? 5 : 1, // 1-已提交(草稿) 2-已提审（走流程） 3-已发布
        applyFile:
          Array.isArray(obj.applyFile) && JSON.stringify(obj.applyFile),
        researchFile:
          Array.isArray(obj.researchFile) && JSON.stringify(obj.researchFile),
        otherFile:
          Array.isArray(obj.otherFile) && JSON.stringify(obj.otherFile),
      };
      if (this.$route.query.id) {
        params.id = this.$route.query.id;
      }

      if (str == "linshi_current") {
        // 是否是自动保存的数据
        params.delFlag = 1;
      }
      if (
        getSession("infoId_chushe" + this.$route.query.projectId) &&
        getSession("infoId_chushe" + this.$route.query.projectId) != "null"
      ) {
        // 自动保存拿到的id
        params.id = getSession("infoId_chushe" + this.$route.query.projectId);
      }
      this.workFlowLoading = true;
      let res = await api_cs_draft_noLoading(params);
      if (res.msg.code == "0000") {
        this.btgFun(str, res.data);
        this.workFlowLoading = false;
      }
    },
    btgFun(str, data) {
      if (str == "linshi_current") {
        setSession("infoId_chushe" + this.$route.query.projectId, data);
      } else if (str == "close") {
        removeSession("infoId_chushe" + this.$route.query.projectId);
        this.$message.success("保存成功");
      } else {
        clearInterval(this.timer);
        this.$message.success("保存成功");
        removeSession("infoId_chushe" + this.$route.query.projectId);
        if (!this.$route.query.id) {
          this.get_success = true;
        } else {
          this.routeClose();

          this.$router.push({ name: "chushe" });
        }
      }
    },
    disposeFile(arr) {
      // 多个附件数组和并成一个
      let tempArr = [];
      for (const item of arr) {
        if (item) {
          let newArr = [];
          if (typeof item == "string") {
            newArr = JSON.parse(item);
          } else if (typeof item == "object") {
            newArr = item;
          }
          tempArr.push(...newArr);
        }
      }
      return tempArr;
    },
    sumFun(obj) {
      let sum = 0;
      for (const key in obj) {
        if (obj[key]) {
          sum = this.$utils.addNum(sum, obj[key]);
        }
      }
      return sum;
    },
    async init(id) {
      let res = await api_cs_getDetailById({ id });
      if (res.data) {
        let { applyFile, researchFile, otherFile } = res.data;
        res.data.applyFile = applyFile && JSON.parse(applyFile);
        res.data.researchFile = researchFile && JSON.parse(researchFile);
        res.data.otherFile = otherFile && JSON.parse(otherFile);
        this.detail = res.data;
        this.getTemplate(res.data);
      }
    },
    //  获取模板
    getTemplate(Data) {
      api_getCustomFormTemplate({
        moduleCode: moduleCode,
        // templateId: this.templateId,
      }).then((res) => {
        this.editableTabs =
          typeof res.data.templateDetail == "string" &&
          JSON.parse(res.data.templateDetail);
        let formArr =
          this.editableTabs && JSON.parse(this.editableTabs[0].formArr);
        let zjName = this.$utils.arrFind(formArr, "资金使用计划", "title");
        this.$set(this, "slotName", zjName.title);
    
        this.templateId = res.data.id;
    
        this.editableTabs.forEach((item) => {
          this.$set(item, "formArr", JSON.parse(item.formArr));
          item.formArr.forEach((item1, index) => {
            let configArr = item1.selectData.formAdd.config;
            let configBind =
              this.getConfigBind(configArr, "bind") &&
              this.getConfigBind(configArr, "bind").join(",");
            let itemData = this.forInItem(Data, configBind);
            item.formArr[index].selectData.formAdd.data = itemData ?
              itemData :
              {};
          });
        });
        this.chuli();
      });
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
  },
  created() {
    // this.getTemplate();
    this.createdfunc();
  },
  beforeRouteLeave(to, form, next) {
    if (this.$refs.work_flow) {
      this.$refs.work_flow.$el.style.display = "none";
    }
    clearInterval(this.timer);
    getSession("infoId_chushe" + this.$route.query.projectId);

    next();
  },
  beforeDestroy() {
    clearInterval(this.timer);
    getSession("infoId_chushe" + this.$route.query.projectId);
  },
};
</script>
<style lang="scss" scoped>
.searchPage {
  display: flex;
  justify-content: space-between;
}
::v-deep .fundPlan {
  .sumTitle {
    display: inline-block;
    width: 190px;
    text-align: right;
  }
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