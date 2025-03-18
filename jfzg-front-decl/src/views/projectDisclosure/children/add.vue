<template>
  <div :class="['InitiateDetail_class', onlyShow ? 'noPadding' : '']">
    <h3 class="InitiateDetail_class_title">基本信息</h3>
    <div class="InitiateDetail_class_sradd">
      <SrView :formData="form.config" :ruleForm="form.data">
        <template slot="name3" slot-scope="scope">
          <el-col style='display: flex;'>
            <label
              class="label-item ellipsis"
              title="项目名称"
              style="width: 50%"
              >项目名称
            </label>

            <el-tooltip
              :content="form.data.projectName"
              placement="top"
              effect="light"
            >
              <button
                style="
                  border: none;
                  float: left;
                  background: #fff;
                  margin-left: 10px;
                  line-height: 40px;
                "
                @click="chakan(scope.scope)"
              >
                <div :class="buName.includes('豫信') ? 'table_unitName' : 'p_unitName'">
                  {{ form.data.projectName }}
                </div>
              </button>
            </el-tooltip>
          </el-col>
        </template>
      </SrView>
    </div>
    <h3 class="InitiateDetail_class_title">交底申请</h3>
    <div class="InitiateDetail_class_Application">
      <SrAdd
        class="sradd"
        :config="form2.config"
        :enums="form2.enums"
        :form="form2.data"
        :otherConfig="form2.otherConfig"
        ref="add"
      >
      </SrAdd>
    </div>
    <WorkFlow1
      :hideFrom="true"
      :clickMethods="clickmethods"
      :buttonList="buttonList"
      ref="work_flow"
      backName="projectDisclosure"
      :workFlowLoading="workFlowLoading"
      :currentStatus="currentStatus"
    ></WorkFlow1>
  </div>
</template>

<script>
import store from "@/store";

import config from "@/settings.js";
import upload from "@/utils/upload";
import WorkFlow1 from "../component/workflow.vue";
import srtracetrack from "@/utils/srtracetrack";
import { setSession, getSession, removeSession } from "@/core/session.js";
import {
  api_saveOrUpdate,
  api_getDetail,
  getUserByRoleCode,
} from "@/api/projectDisclosure/index.js";
export default {
  components: {
    WorkFlow1,
  },
  provide() {
    return {
      baseUrl: config.uploadBaseUrl,
      imgBaseUrl: config.imgBaseUrl,
      uploadRequest: upload,
      uploadBaseUrl: config.uploadBaseUrl,
      srtracetrackRequest: srtracetrack,
    };
  },
  props: {
    onlyShow: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  data() {
    return {
      buName: store.getters.userInfo.currentBizunit.buName,

      form2: {
        otherConfig: {
          labelNum: 130,
        },
        config: [
          {
            type: "upload",
            name: "交底清单",
            bind: "disclosureChecklist",
            fileList: [],
            fileSize: 500,
            limit: 10,
            fileTip:
              "仅支持上传pdf、ofd、doc、docx、xls、xlsx、jpg、jpeg、rar、zip格式文件!",
            fileType: "pdf,ofd,doc,docx,xls,xlsx,jpg,jpeg,rar,zip",
            tipPopover: true, // hover显示提示  默认外面显示
            col: 24,
            required: "预研交付可行性报告必填",
          },
          {
            type: "upload",
            name: "交底资料",
            bind: "disclosureMaterials",
            fileList: [],
            fileSize: 500,
            limit: 10,
            fileTip:
              "仅支持上传pdf、ofd、doc、docx、xls、xlsx、jpg、jpeg、rar、zip格式文件!",
            fileType: "pdf,ofd,doc,docx,xls,xlsx,jpg,jpeg,rar,zip",
            tipPopover: true, // hover显示提示  默认外面显示
            col: 24,
          },
          // 终验附件
          {
            type: "upload",
            name: "其他附件",
            bind: "otherListOne",
            fileList: [],
            fileSize: 500,
            limit: 10,
            fileTip:
              "仅支持上传pdf、ofd、doc、docx、xls、xlsx、jpg、jpeg、rar、zip格式文件!",
            fileType: "pdf,ofd,doc,docx,xls,xlsx,jpg,jpeg,rar,zip",
            tipPopover: true, // hover显示提示  默认外面显示
            col: 24,
          },
          {
            type: "select",
            name: "项目负责人",
            placeholder: "请选择",
            bind: "contactId",
            dataList: "xmfzrList",
            col: 24,
            // filterable: true,
            required: "项目负责人不能为空",
            class: "customClass",
          },
          {
            type: "select",
            name: "方案经理",
            placeholder: "请选择",
            bind: "programManagerId",
            dataList: "programManagerList",
            col: 24,
            // filterable: true,
            required: "方案经理不能为空",
            class: "customClass",
          },
        ],
        data: {
          programManagerId: "",
          contactId: "",
          disclosureChecklist: [],
          disclosureMaterials: [],
          // // 终验附件
          otherListOne: [],
        },
        enums: {
          programManagerList: [],
          xmfzrList: [],
        },
      },
      form: {
        otherConfig: {
          labelNum: 140,
        },
        config: [
          {
            value: "systemName",
            label: "系统名称",
            span: 12,
          },
          // {
          //   value: "projectName",
          //   label: "项目名称",
          //   span: 12,
          // },
          {
            type: "slot",

            slotName: "name3",
            span: 12,
          },
          {
            value: "projectCode",
            label: "项目编号",
            span: 12,
          },
          {
            value: "contactName",
            label: "项目负责人",
            span: 12,
          },
          {
            value: "programManagerName",
            label: "方案经理",
            span: 12,
          },
          {
            value: "procurementManagerName",
            label: "采购经理",
            span: 12,
          },
          {
            value: "clientManagerName",
            label: "客户经理",
            span: 12,
          },
        ],
        data: {
          systemName: "",
          projectName: "",
          projectCode: "",
          contactName: "",
          programManagerName: "",
          procurementManagerName: "",
          projectMaturity: "",
          clientManagerName: "",
        },
        enums: {},
      },
      list: [
        {
          dataName: "222",
          dataValue: "122",
        },
      ],
      value: "",
      value2: "",
      value3: "",
      clickmethods: { tg: this.tg, btg: this.btg },
      buttonList: [
        {
          role: "",
          btns: [
            {
              btnName: "提交",
              btnValue: "tg00",
              btnType: "primary",
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
      discloseId: null,
      programManagerList: [], //方案经理
      xmfzrList: [], //项目负责人
    };
  },
  created() {
    this.init();
    this.getUserByCode();
  },
  methods: {
    // 根据code  拿到角色信息
    getUserByCode() {
      getUserByRoleCode({ roleCode: "FAJL" }).then((res) => {
        //console.log("方案经理", res.data);
        this.programManagerList = res.data;
        res.data.map((element) => {
          this.form2.enums.programManagerList.push({
            dataName: String(element.fullname),
            dataValue: String(element.jfid),
          });
        });
      });
      getUserByRoleCode({ roleCode: "XMFZR" }).then((res) => {
        //console.log("项目负责人", res.data);
        this.xmfzrList = res.data;
        res.data.map((element) => {
          this.form2.enums.xmfzrList.push({
            dataName: String(element.fullname),
            dataValue: String(element.jfid),
          });
        });
      });
    },
    init() {
      let newFlag =
        this.$route.query.statusFlag &&
        (this.$route.query.statusFlag == "203" ||
          this.$route.query.statusFlag == "303");
      //console.log("flag", newFlag);
      api_getDetail({ id: this.$route.query.id, newFlag }).then((res) => {
        //console.log("详情", res);
        if (res.data) {
          this.form.data = res.data;
          this.discloseId = res.data.discloseId;
          if (res.data.disclosureChecklist) {
            this.form2.data.disclosureChecklist = JSON.parse(
              res.data.disclosureChecklist
            );
          }
          if (res.data.disclosureMaterials) {
            this.form2.data.disclosureMaterials = JSON.parse(
              res.data.disclosureMaterials
            );
          }
          // 终验附件
          // // 其他附件
          if (res.data.applyForOtherDelivery) {
            this.form2.data.otherListOne = JSON.parse(
              res.data.applyForOtherDelivery
            );
          }
          if (res.data.contactId) {
            this.form2.data.contactId = String(res.data.contactId);
          }
          if (res.data.programManagerId) {
            this.form2.data.programManagerId = String(
              res.data.programManagerId
            );
          }
        }
      });
    },
    // 提交
    tg() {
      let data = this.$refs.add.validate();
      //console.log("提交", data);
      if (data) {
        data.status = 2;
        if (Array.isArray(data.disclosureChecklist)) {
          data.disclosureChecklist.forEach((item) => {
            item.deliveryName = "交底清单";
          });
          data.disclosureChecklist = JSON.stringify(data.disclosureChecklist);
        } else {
          data.disclosureChecklist = "[]";
        }
        if (Array.isArray(data.disclosureMaterials)) {
          data.disclosureMaterials.forEach((item) => {
            item.deliveryName = "交底资料";
          });
          data.disclosureMaterials = JSON.stringify(data.disclosureMaterials);
        } else {
          data.disclosureMaterials = "[]";
        }
        // 终验附件
        if (Array.isArray(data.otherListOne)) {
          data.otherListOne.forEach((item) => {
            item.deliveryName = "其他附件";
          });
          data.applyForOtherDelivery = JSON.stringify(data.otherListOne);
        } else {
          data.applyForOtherDelivery = "[]";
        }
        if (this.$route.query.id) {
          data.projectId = this.$route.query.id;
        }
        if (this.discloseId) {
          data.discloseId = this.discloseId;
        }
        // 传buId、fullname--查对应信息
        let filterItems = this.programManagerList.filter((item) => {
          return item.jfid == data.programManagerId;
        });
        let filterItems2 = this.xmfzrList.filter((item) => {
          return item.jfid == data.contactId;
        });
        if (filterItems.length > 0) {
          data.programManagerBuid = filterItems[0].buid;
          data.programManagerName = filterItems[0].fullname;
        }
        if (filterItems2.length > 0) {
          data.contactBuid = filterItems2[0].buid;
          data.contactName = filterItems2[0].fullname;
        }
        //console.log("参数", data, data.projectId, filterItems, filterItems2);
        // debugger;
        api_saveOrUpdate(data, data.projectId).then((res) => {
          if (res.msg.code == "0000") {
            this.$message.success("操作成功");
            this.$router.push({ name: "projectDisclosure" });
          }
        });
      }
    },
    btg() {
      let data = this.form2.data;
      //console.log("保存", this.form2.data);
      data.status = 1;
      if (Array.isArray(data.disclosureChecklist)) {
        data.disclosureChecklist.forEach((item) => {
          item.deliveryName = "交底清单";
        });
        data.disclosureChecklist = JSON.stringify(data.disclosureChecklist);
      } else {
        data.disclosureChecklist = "[]";
      }
      if (Array.isArray(data.disclosureMaterials)) {
        data.disclosureMaterials.forEach((item) => {
          item.deliveryName = "交底资料";
        });
        data.disclosureMaterials = JSON.stringify(data.disclosureMaterials);
      } else {
        data.disclosureMaterials = "[]";
      }
      // 终验附件
      if (Array.isArray(data.otherListOne)) {
          data.otherListOne.forEach((item) => {
            item.deliveryName = "其他交付物(附件)";
          });
          data.applyForOtherDelivery = JSON.stringify(data.otherListOne);
        } else {
          data.applyForOtherDelivery = "[]";
        }
      if (this.$route.query.id) {
        data.projectId = this.$route.query.id;
      }
      if (this.discloseId) {
        data.discloseId = this.discloseId;
      }
      // 传buId、fullname--查对应信息
      let filterItems = this.programManagerList.filter((item) => {
        return item.jfid == data.programManagerId;
      });
      let filterItems2 = this.xmfzrList.filter((item) => {
        return item.jfid == data.contactId;
      });
      if (filterItems.length > 0) {
        data.programManagerBuid = filterItems[0].buid;
        data.programManagerName = filterItems[0].fullname;
      }
      if (filterItems2.length > 0) {
        data.contactBuid = filterItems2[0].buid;
        data.contactName = filterItems2[0].fullname;
      }
      //console.log("参数", data, data.projectId);
      // debugger;
      api_saveOrUpdate(data, data.projectId).then((res) => {
        if (res.msg.code == "0000") {
          this.$message.success("操作成功");
          this.$router.push({ name: "projectDisclosure" });
        }
      });
    },
    goBack() {
      this.$router.push({
        name: "preResearchDelivery",
      });
    },
    chakan(row) {
      if(this.buName.includes('豫信')) {
        this.$router.push({
          name: "planProjectView",
          query: {
            id: this.$route.query.id,
            processId: this.$route.query.processId,
            // templateId: row.templateId,
            spanaActive: this.spanaActive,
            testId2: 1,
            lookName:"交底"
          },
          // 查看相关逻辑
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.InitiateDetail_class {
  padding: 24px;
  height: 100%;
  // padding-bottom: 40px;
  .InitiateDetail_class_title {
    font-size: 16px;
    font-weight: bold;
    color: #000;
    padding: 10px 0 5px 10px;
  }
  .title_box {
    display: flex;
    align-items: center;
    margin: 24px 0 14px 0;
    justify-content: space-between;
    .title {
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
    }
    .btns {
      .el-button {
        width: 118px;
        height: 32px;
        border-radius: 16px;
        padding: 0 !important;
      }
    }
  }
  .bottom {
    position: fixed;
    bottom: 0;
    left: 81px;
    width: 100%;
    height: 63px;
    background: #ffffff;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    border: 1px solid #e6e6e6;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    .el-button {
      width: 104px;
      height: 32px;
      padding: 0;
      border-radius: 16px;
    }
  }
}
.reportWriter {
  display: flex;

  ::v-deep .el-input {
    width: 25%;
  }
  .btn {
    margin-left: 5px;
    width: 30px;
    height: 30px;
    opacity: 1;
    color: rgba(66, 130, 255, 1);
    border-radius: 50%;
    text-align: center;
    line-height: 30px;
    cursor: pointer;
    border: 1px dashed rgba(66, 130, 255, 1);
  }
}
::v-deep .customClass.el-select {
  width: 250px !important;
}

.InitiateDetail_class_Application {
  // margin-left: 55px;
}
.noPadding {
  padding-bottom: 0px;
}
.dialog-footer {
  margin-left: 900px;
}
.InitiateDetail_class_sradd {
  // width: 1300px;
  // display: flex;
  // justify-content: flex-start;
}
.table_unitName {
  color: rgba(66, 130, 255, 1);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

:hover .table_unitName {
  cursor: pointer;
}
.p_unitName {
  color: #666;
}
</style>
