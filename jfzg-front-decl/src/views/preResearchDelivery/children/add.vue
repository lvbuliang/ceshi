<template>
  <div :class="['InitiateDetail_class', onlyShow ? 'noPadding' : '']">
    <h3 class="InitiateDetail_class_title">基本信息</h3>
    <div class="InitiateDetail_class_sradd">
      <SrView :formData="form.config" :ruleForm="form.data">
        <template slot="name3" slot-scope="scope">
          <el-col style="display: flex">
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
                <div
                  :class="
                    buName.includes('豫信') ? 'table_unitName' : 'p_unitName'
                  "
                >
                  {{ form.data.projectName }}
                </div>
              </button>
            </el-tooltip>
          </el-col>
        </template>
      </SrView>
    </div>
    <h3 class="InitiateDetail_class_title">预研交付申请</h3>
    <div class="InitiateDetail_class_Application">
      <SrAdd
        class="sradd"
        :config="form2.config"
        :enums="form2.enums"
        :form="form2.data"
        :otherConfig="form2.otherConfig"
        ref="add"
      >
        <div slot="group" class="group">
          <el-tag
            v-for="(item, index) in form2.data.fixedGroupMembers"
            :key="index"
            >{{ item.fullName }}</el-tag
          >
        </div>
      </SrAdd>
    </div>
    <!-- :style="{ width: `calc(100% - ${widthB}) !important` }" -->
    <WorkFlow1
      :hideFrom="true"
      :clickMethods="clickmethods"
      :buttonList="buttonList"
      ref="work_flow"
      backName="preResearchDelivery"
      :workFlowLoading="workFlowLoading"
    ></WorkFlow1>
  </div>
</template>

<script>
import store from "@/store";
import config from "@/settings.js";
import upload from "@/utils/upload";
import WorkFlow1 from "../component/workflow.vue";
import srtracetrack from "@/utils/srtracetrack";
import {
  api_getDetail,
  api_getFixedGroupMembers,
  getAddedGroupMembers,
  api_saveOrUpdate,
} from "@/api/preResearchDelivery/index.js";
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
      form2: {
        otherConfig: {
          labelNum: 180,
        },
        config: [
          {
            type: "upload",
            name: "预研交付可行性报告",
            bind: "preResearchDeliveryFeasibilityReport",
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
            type: "slot",
            slotName: "group",
            name: "评审小组",
            placeholder: "请选择",
            bind: "fixedGroupMembers",
            maxLength: 16,
            class: "gg",
            col: 16,
          },
          {
            type: "select",
            name: "添加评审人员",
            placeholder: "请选择",
            bind: "additionalGroupMembers",
            dataList: "additionalGroupMembersList",
            col: 24,
            class: "customClass",
            multiple: true,
            collapseTags: true,
            // required: "评审小组必填",
          },
          {
            type: "upload",
            name: "其他附件",
            bind: "applyForOtherDelivery",
            fileList: [],
            fileSize: 500,
            limit: 10,
            fileTip:
              "仅支持上传pdf、ofd、doc、docx、xls、xlsx、jpg、jpeg、rar、zip格式文件!",
            fileType: "pdf,ofd,doc,docx,xls,xlsx,jpg,jpeg,rar,zip",
            tipPopover: true, // hover显示提示  默认外面显示
            col: 24,
          },
        ],
        data: {
          additionalGroupMembers: [],
          preResearchDeliveryFeasibilityReport: [],
          fixedGroupMembers: [],
          applyForOtherDelivery: [],
        },
        enums: {
          additionalGroupMembersList: [], //额外小组成员
        },
      },
      list: [
        // {
        //   dataName: "",
        //   dataValue: "",
        // },
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
      selectMembersDialogVisible: false, //评审小组弹框
      // 评审小组弹框相关传递参数
      title: {
        label: "",
        value: null,
      },
      // 评审小组人员
      selectMemberData: [],
      datazbAll: [],
      preResearchDeliveryId: null,
      baseMembersList: [], //额外小组成员
      filterMembersList: [], //对应额外小组完整参数
      widthB: "",
    };
  },
  created() {
    this.init();
    this.getBaseMembers();
    this.getUserByCode();
  },
  mounted() {
    this.initResizeObserver();
  },
  beforeDestroy() {
    this.destroyResizeObserver();
  },
  methods: {
    // 根据code  拿到角色信息
    getUserByCode() {
      api_getFixedGroupMembers({ type: 2 }).then((res) => {
        //console.log("额外成员", res.data);
        res.data.map((element) => {
          this.baseMembersList = res.data;
          this.form2.enums.additionalGroupMembersList.push({
            dataName: String(element.fullName),
            dataValue: element.jfid,
          });
        });
      });
    },
    getBaseMembers() {
      api_getFixedGroupMembers({ type: 1 }).then((res) => {
        //console.log("res", res);
        this.form2.data.fixedGroupMembers = res.data;
        // res.data.map(item => {
        //   this.form2.data.fixedGroupMembers.push({
        //     fullname: String(item.fullName)
        //   })
        // })
        //console.log("xxx", this.form2.data.fixedGroupMembers);
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
          this.preResearchDeliveryId = res.data.preResearchDeliveryId;
          if (res.data.preResearchDeliveryFeasibilityReport) {
            this.form2.data.preResearchDeliveryFeasibilityReport = JSON.parse(
              res.data.preResearchDeliveryFeasibilityReport
            );
          }
          if (res.data.applyForOtherDelivery) {
            this.form2.data.applyForOtherDelivery = JSON.parse(
              res.data.applyForOtherDelivery
            );
          }
          if (res.data?.additionalGroupMembers?.length > 0) {
            let addInfo = res.data.additionalGroupMembers.map((item) => {
              return item.jfid;
            });
            this.$set(this.form2.data, "additionalGroupMembers", addInfo);
            //console.log("add", addInfo);
          }
        }
      });
    },
    saveSelectData(val) {
      //console.log("确定数据", val);
      this.closeSelectMembersDialog = false;
    },
    // 关闭选择评审小组
    closeSelectMembersDialog() {
      this.selectMembersDialogVisible = false;
    },
    // 添加评审小组人员
    addGroupMembers() {
      this.selectMembersDialogVisible = true;
      this.title = {
        label: "选择评审小组",
        value: "Group",
      };
    },
    goBack() {
      this.$router.push({
        name: "preResearchDelivery",
      });
    },
    tg() {
      let data = this.$refs.add.validate();
      //console.log("data", data, this.form2);
      if (data) {
        data.status = 2;
        data.preResearchDeliveryFeasibilityReport =
          Array.isArray(data.preResearchDeliveryFeasibilityReport) &&
          JSON.stringify(data.preResearchDeliveryFeasibilityReport);
        data.applyForOtherDelivery =
          Array.isArray(data.applyForOtherDelivery) &&
          JSON.stringify(data.applyForOtherDelivery);
        if (this.$route.query.id) {
          data.projectId = this.$route.query.id;
        }
        if (this.preResearchDeliveryId) {
          data.preResearchDeliveryId = this.preResearchDeliveryId;
        }

        if (this.form2.data.additionalGroupMembers?.length > 0) {
          this.filterMembersList = [];
          this.form2.data.additionalGroupMembers
            .map((item2) => {
              //console.log("item2", item2);
              let result = this.baseMembersList.find(
                (item) => item.jfid == item2
              );
              //console.log("aaaa", result);
              this.filterMembersList.push({
                first: 0,
                buid: result.userInfoVos[0].buid,
                buName: result.userInfoVos[0].buName,
                roleCode: result.userInfoVos[0].roleCode,
                userName: result.userInfoVos[0].roleName,
                fullname: result.userInfoVos[0].fullName,
                ...result,
              });
            })
            .filter(Boolean);

          //console.log("fil", this.filterMembersList);
        }
        this.form2.data.fixedGroupMembers.forEach((item) => {
          item.first = 1;
          item.buid = item.userInfoVos[0].buid;
          item.buName = item.userInfoVos[0].buName;
          item.roleCode = item.userInfoVos[0].roleCode;
          item.userName = item.userInfoVos[0].roleName;
          item.fullname = item.userInfoVos[0].fullName;
        });
        data.fixedGroupMembers = this.form2.data.fixedGroupMembers;
        data.additionalGroupMembers = this.filterMembersList;
        // console.log("参数", data, data.projectId);
        // debugger;
        api_saveOrUpdate(data, data.projectId).then((res) => {
          if (res.msg.code == "0000") {
            sessionStorage.removeItem('preStatus')
            this.$message.success("操作成功");
            this.$router.push({ name: "preResearchDelivery" });
          }
        });
      }
    },
    btg() {
      let data = this.form2.data;
      //console.log("data", data);
      data.status = 1;
      data.preResearchDeliveryFeasibilityReport =
        Array.isArray(data.preResearchDeliveryFeasibilityReport) &&
        JSON.stringify(data.preResearchDeliveryFeasibilityReport);
      data.applyForOtherDelivery =
        Array.isArray(data.applyForOtherDelivery) &&
        JSON.stringify(data.applyForOtherDelivery);
      if (this.$route.query.id) {
        data.projectId = this.$route.query.id;
      }
      if (this.preResearchDeliveryId) {
        data.preResearchDeliveryId = this.preResearchDeliveryId;
      }
      if (this.form2.data.additionalGroupMembers?.length > 0) {
        this.filterMembersList = [];
        this.form2.data.additionalGroupMembers
          .map((item2) => {
            //console.log("item2", item2);
            let result = this.baseMembersList.find(
              (item) => item.jfid == item2
            );
            this.filterMembersList.push({
              first: 0,
              buid: result.userInfoVos[0].buid,
              buName: result.userInfoVos[0].buName,
              roleCode: result.userInfoVos[0].roleCode,
              userName: result.userInfoVos[0].roleName,
              ...result,
            });
          })
          .filter(Boolean);
        //console.log("fil", this.filterMembersList);
      }
      this.form2.data.fixedGroupMembers.forEach((item) => {
        item.first = 1;
        item.buid = item.userInfoVos[0].buid;
        item.buName = item.userInfoVos[0].buName;
        item.roleCode = item.userInfoVos[0].roleCode;
        item.userName = item.userInfoVos[0].roleName;
      });
      data.additionalGroupMembers = this.filterMembersList;
      // console.log("参数", data, data.projectId);
      // debugger;
      api_saveOrUpdate(data, data.projectId).then((res) => {
        if (res.msg.code == "0000") {
          sessionStorage.removeItem('preStatus')
          this.$message.success("操作成功");
          this.$router.push({ name: "preResearchDelivery" });
        }
      });
    },
    initResizeObserver() {
      this.resizeObserver = new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          this.widthB = entry.contentRect.width + "px";
        });
      });
      this.resizeObserver.observe(document.querySelector(".main-menu-box"));
    },
    destroyResizeObserver() {
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
      }
    },
    chakan(row) {
      if (this.buName.includes("豫信")) {
        this.$router.push({
          name: "planProjectView",
          query: {
            id: this.$route.query.id,
            processId: this.$route.query.processId,
            // templateId: row.templateId,
            spanaActive: this.spanaActive,
            testId2: 1,
            lookName: "预研",
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
  padding: 20px;
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
.group {
  .el-tag {
    border-radius: 16px;
    margin-right: 10px;
  }
}
::v-deep .customClass.el-select {
  width: 250px !important;
}
.reportWriter {
  display: flex;

  // ::v-deep .el-input {
  //   width: 25%;
  // }
  ::v-deep .el-select {
    width: 250px;
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
.select-box {
  ::v-deep .el-select {
    width: 250px;
  }
  ::v-deep .el-input {
    width: 250px;
  }
  > div {
    margin-right: 20px;
  }
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
