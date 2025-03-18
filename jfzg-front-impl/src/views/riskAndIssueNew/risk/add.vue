<template>
  <!-- <section class="form-config sr-qiankun-add"> -->
  <div class="total-page" :style="{ height: boxHeight + 'px' }">
    <el-tabs v-model="activeName">
      <el-tab-pane
        v-for="item in tabList"
        :disabled="true"
        :key="item.code"
        :name="item.code"
      >
        <template slot="label" class="tabsLabel">
          <img
            style="vertical-align: middle"
            src="@/assets/barrage_fill@2x.png"
            width="24px"
            height="auto"
            alt=""
          />
          <span style="color: #333; vertical-align: middle; padding-left: 4px">
            {{ item.title }}
          </span>
        </template>
        <SrAdd
          class="sradd"
          :config="form.config"
          :enums="form.enums"
          :form="form.data"
          :otherConfig="form.otherConfig"
          ref="add1"
        >
          <template slot="departName">
            <div>
              <el-input
                v-model="form.data.departName"
                placeholder="请输入内容"
                autosize
                maxlength="200"
                show-word-limit
              ></el-input>
            </div>
          </template>
          <template slot="processorName">
            <div class="reportWriter">
              <el-input
                v-model="form.data.processorName"
                placeholder="请输入内容"
                readonly="true"
                :disabled="true"
              ></el-input>
              <div class="btn" @click="addProcessorName">
                <i class="el-icon-plus"></i>
              </div>
            </div>
          </template>
          <template slot="liablerName">
            <div class="reportWriter">
              <el-input
                v-model="form.data.liablerName"
                placeholder="请输入内容"
                autosize
                maxlength="200"
                show-word-limit
              ></el-input>
              <!-- <div class="btn" @click="addLiablerName">
                <i class="el-icon-plus"></i>
              </div> -->
            </div>
          </template>
          <template slot="description">
            <div class="reportWriter">
              <el-input
                v-model="form.data.description"
                placeholder="请输入风险描述"
                type="textarea"
                :autosize="{minRows: 2,maxRows: 4}"
                maxlength="1000"
                show-word-limit
              ></el-input>
            </div>
          </template>
        </SrAdd>
      </el-tab-pane>

      <sr-work-flow
        :style="{ width: `calc(100% - ${widthB}) !important` }"
        :hideFrom="true"
        :clickMethods="clickmethods"
        :buttonList="buttonList"
        ref="work_flow"
        :backName="
          $route.query.routeName ? $route.query.routeName : 'everydayriskNew'
        "
        :params="{
          projectId: this.$route.query.projectId,
          systemName: this.$route.query.systemName,
          projectName: this.$route.query.projectName,
          contractId: this.$route.query.contractId,
          sectionCount: this.$route.query.sectionCount,
          sectionSort: this.$route.query.sectionSort,
        }"
      ></sr-work-flow>
      <DialogT
        :data="dataCopy"
        :title="title"
        :dialogVisible="commonDialog"
        @close="commonDialogClose"
        @saveSelectData="commonDialogSave"
        ref="commonDialog"
      />
    </el-tabs>
  </div>

  <!-- </section> -->
</template>
<script>
import {
  queryRiskDetailById,
  updateInfo,
  api_getServiceTypeList,
  saveRisk,
  queryUsersByBuProperty,
} from "@/api/riskAndIssueNew/index";
import config from "@/settings.js";
import upload from "@/utils/upload";
import { listByTopicAndItem } from "@/api/index.js";
import { LEVEIIMGLIST, TYPELIST } from "./const";
import DialogT from "./component/DialogT.vue";
import store from "@/store";
export default {
  name: "riskAdd",
  components: { DialogT },
  provide() {
    return {
      baseUrl: config.uploadBaseUrl,
      imgBaseUrl: config.imgBaseUrl,
      uploadRequest: upload,
      uploadBaseUrl: config.uploadBaseUrl,
    };
  },
  props: {},
  watch: {
    "form.data.description": {
      handler(newVal) {
        this.form.data.description = this.replaceCode(newVal);
      },
      immediate: true,
    }
  },
  updated() {},
  data() {
    return {
      boxHeight: "700",
      canClick: true,
      activeName: "1",
      active: "跟进",
      tabList: [{ title: "风险基本信息", code: "1" }],
      templateId: this.$route.query.templateId,
      clickmethods: { save: this.save },
      textarea2: "",
      value1: "",
      text1: "",
      buttonList: [
        {
          role: "",
          btns: [
            {
              btnValue: "save",
              btnName: "保存",
              btnType: "primary",
              btnEventType: "save",
              disabled: false,
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
            name: "系统名称",
            bind: "systemName",
            col: 12,
            maxLength: 1000,
            disabled: true,
          },
          {
            type: "input",
            name: "项目名称",
            bind: "projectName",
            col: 12,
            maxLength: 1000,
            disabled: true,
          },
          {
            type: "input",
            name: "标段",
            bind: "sectionSort",
            col: 24,
            maxLength: 1000,
            disabled: true,
          },
          {
            type: "slot",
            slotName: "description",
            name: "风险描述",
            placeholder: "请输入风险描述",
            bind: "description",
            col: 24,
            maxLength: 1000,
            trigger: "blur",
            required: "风险描述不能为空",
          },
          {
            type: "select",
            name: "风险类型",
            placeholder: "请选择风险类型",
            bind: "type",
            dataList: "typeList",
            trigger: "change",
            col: 8,
            required: "风险类型不能为空",
          },
          {
            type: "select",
            name: "风险等级",
            placeholder: "请选择风险等级",
            bind: "level",
            dataList: "levelList",
            trigger: "change",
            col: 8,
            required: "风险等级不能为空",
          },
          {
            type: "input",
            name: "提出人",
            placeholder: "请输入提出人",
            bind: "proposerName",
            col: 8,
            disabled: true,
            required: "提出人不能为空",
          },
          {
            type: "slot",
            slotName: "processorName",
            name: "风险处理人",
            placeholder: "请选择风险处理人",
            bind: "processorName",
            dataList: "processorNameList",
            trigger: "change",
            col: 8,
            required: "风险处理人不能为空",
          },
          {
            type: "slot",
            slotName: "departName",
            name: "责任处室/部门",
            placeholder: "请输入责任处室/部门",
            bind: "departName",
            col: 8,
            // required: "责任处室/部门不能为空",
          },
          {
            type: "slot",
            slotName: "liablerName",
            name: "责任人",
            placeholder: "请选择责任人",
            bind: "liablerName",
            dataList: "liablerNameList",
            trigger: "change",
            col: 8,
            // required: "责任人不能为空",
          },
        ],
        data: {
          contactId: 0,
          contactName: "",
          departId: 0,
          departName: "",
          description: "",
          isDraft: 0,
          level: "",
          liabler: 0,
          liablerName: "",
          processor: 0,
          processorName: "",
          projectId: 0,
          contractId: 0,
          sectionCount: 0,
          sectionSort: 0,
          proposer: 0,
          proposerName: "",
          type: "",
          systemName: this.$route.query.systemName,
          projectName: this.$route.query.projectName,
          sectionSort: this.$route.query.sectionSort,
          processorRoleCode: "",
          processorBuid: "",
        },

        enums: {
          processorNameList: [], //风险处理人
          liablerNameList: {}, //责任人
          typeList: [
            {
              dataName: "内部风险",
              dataValue: "1",
            },
            {
              dataName: "外部风险",
              dataValue: "2",
            },
            {
              dataName: "云网风险",
              dataValue: "3",
            },
          ], //风险类型
          levelList: [
            {
              dataName: "轻度",
              dataValue: "0",
            },
            {
              dataName: "中度",
              dataValue: "1",
            },
            {
              dataName: "高度",
              dataValue: "2",
            },
          ], //风险等级
        },
      },
      commonDialog: false,
      datazb1: [],
      datazb2: [],
      datazb3: [],
      datazbAll: [],
      dataCopy: [],
      title: {},
      userInfo: store.getters.userInfo,
      widthB: "",
    };
  },
  created() {
    let { fullname, jfid } = this.userInfo;
    this.$set(this.form.data, "proposerName", fullname);
    this.$set(this.form.data, "proposer", jfid);
    console.log(this.$route.query, "this.$route.query");
    // if (this.$route.query.isReadonly) {
    //   this.$set(this.form.config[0], "disabled", true);
    //   this.$set(this.form.config[1], "disabled", true);
    //   this.$set(this.form.config[2], "disabled", true);
    //   this.$set(this.form.config[3], "disabled", true);
    // }
    this.form.data.projectId = this.$route.query.projectId;
    this.form.data.contractId = this.$route.query.contractId;
    this.form.data.sectionCount = this.$route.query.sectionCount;
    this.form.data.sectionSort = this.$route.query.sectionSort;
    /* this.getEnums("JFZG_PROJECTRISK_LEVEL", this.form.enums.levelList);
    this.getEnums("JFZG_PROJECTRISK_TYPE", this.form.enums.typeList); */
    this.queryUsersByBuProperty();
  },
  mounted() {
    this.getWorkflowHeight();
    if (this.$route.query.isEdit) {
      this.getTableDate();
    }
    this.initResizeObserver();
  },
  beforeDestroy() {
    this.destroyResizeObserver();
  },
  methods: {
    replaceCode(inputString) {
      return inputString.replace(/"/g, "“"); // 使用中文双引号“”
    },
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
    async queryUsersByBuProperty() {
      const res1 = await queryUsersByBuProperty(3);
      const res2 = await queryUsersByBuProperty(40);
      const res3 = await queryUsersByBuProperty(4);
      this.datazbAll.push(...res1.data);
      this.datazbAll.push(...res2.data);
      this.datazbAll.push(...res3.data);
      this.datazbAll = this.datazbAll.map((item, index) => {
        const buid = item.buid;
        const buName = item.buName;
        const buUniqueCode = item.buUniqueCode;
        const userBaseInfoVos = [];
        userBaseInfoVos.push({
          jfid: item.jfid,
          roleCode: item.roleCode,
          buid: item.buid,
          buName: item.buName,
          roleName: item.roleName,
          fullname: item.fullname,
          buUniqueCode: item.buUniqueCode,
        });
        return {
          buid,
          buName,
          buUniqueCode,
          userBaseInfoVos,
        };
      });
      this.dataCopy = this.datazbAll;
      let len = this.dataCopy.length;
      for (let i = 0; i < len; i++) {
        for (let j = i + 1; j < len; j++) {
          if (this.dataCopy[i].buid == this.dataCopy[j].buid) {
            this.dataCopy[i].userBaseInfoVos.push(
              ...this.dataCopy[j].userBaseInfoVos
            );
            this.dataCopy.splice(j, 1);
            len--;
            j--;
          }
        }
      }
      console.log(this.dataCopy, "this.dataCopy");
    },
    addProcessorName() {
      this.title = { label: "风险处理人", value: "1" };
      this.commonDialog = true;
    },
    addLiablerName() {
      this.title = { label: "责任人", value: "2" };
      this.commonDialog = true;
    },
    commonDialogClose() {
      this.commonDialog = false;
    },
    commonDialogSave(select, val) {
      console.log(select, val);
      if (val == 1) {
        // 风险处理人
        this.form.data.processor = select[0].data[0].jfid;
        this.form.data.processorName = select[0].data[0].fullname;
        this.form.data.processorRoleCode = select[0].data[0].roleCode;
        this.form.data.processorBuid = select[0].data[0].buid;
      } else if (val == 2) {
        // 责任人
        this.form.data.liabler = select[0].data[0].jfid;
        this.form.data.liablerName = select[0].data[0].fullname;
        this.form.data.processorRoleCode = select[0].data[0].roleCode;
        this.form.data.processorBuid = select[0].data[0].buid;
      }
      console.log(this.form.data, this.$refs.commonDialog);
      this.$refs.commonDialog.selectdata = [];
      // this.$refs.commonDialog.data = [];
      this.$refs.commonDialog.radio = "";
      this.commonDialog = false;
    },
    getTableDate() {
      queryRiskDetailById(this.$route.query.id).then((res) => {
        this.form.data = res.data;
      });
    },
    getEnums(topic, list) {
      api_getServiceTypeList({ topic }).then((res) => {
        res.data.map((item) => {
          list.push({
            dataName: String(item.chName),
            dataValue: String(item.itemCode),
          });
        });
      });
    },
    save() {
      console.log(this.canClick);
      console.log("执行");
      if (!this.canClick) return;
      let data = this.$refs["add1"][0].validate();
      this.$refs["add1"][0].validate((valid) => {
        if (valid) {
          let params = {
            ...data,
          };
          if (this.$route.query.id) {
            params.id = this.$route.query.id;
          } else {
            params.id = "";
          }
          console.log(params, "res");
          if (params.id) {
            this.buttonList[0].btns[0].disabled = true;
            updateInfo(params).then((res) => {
              if (res.msg.code == "0000") {
                this.$message.success("保存成功");
                this.buttonList[0].btns[0].disabled = false;
                this.$router.push({
                  name: "everydayriskNew",
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
                this.buttonList[0].btns[0].disabled = false;
              }
            });
          } else {
            this.buttonList[0].btns[0].disabled = true;
            saveRisk(params).then((res) => {
              if (res.msg.code == "0000") {
                this.$message.success("保存成功");
                this.buttonList[0].btns[0].disabled = false;
                this.$router.push({
                  name: "everydayriskNew",
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
                this.buttonList[0].btns[0].disabled = false;
              }
            });
          }
        }
      });

      this.canClick = false;
      setTimeout(() => {
        this.canClick = true;
      }, 5000);
    },
    back() {
      this.$router.push({
        name: "everydayriskNew",
        query: {
          projectId: this.$route.query.projectId,
          contractId: this.$route.query.contractId,
          sectionCount: this.$route.query.sectionCount,
          sectionSort: this.$route.query.sectionSort,
          systemName: this.$route.query.systemName,
          projectName: this.$route.query.projectName,
        },
      });
    },

    //页数发生改变
    pageChanged(val) {
      this.table.page.pageNum = val;
      this.getTbData();
    },
    sizeChanged(val) {
      this.table.page.pageNum = 1;
      this.table.page.pageSize = val;
      this.getTbData();
    },
    handleClose() {
      this.$emit("close");
    },

    getQueryBizunitsByPropertyA(d) {
      getQueryBizunitsByProperty({ buPropertyEnum: d }).then((res) => {
        if (d == "CJDW") {
          console.log("sdadadad", res.data);
          res.data.map((element) => {
            console.log("elemenememe", element.buName);
            this.form.enums.contractUnitFullName.push({
              dataName: String(element.buName),
              dataValue: String(element.buid),
            });
          });
          console.log("ioioioi", this.form.enums.contractUnitFullName);
        } else {
          // this.controlUnitFullName = res.data
          res.data.map((element) => {
            console.log("elemenememe", element.buName);
            this.form.enums.controlUnitFullName.push({
              dataName: String(element.buName),
              dataValue: String(element.buid),
            });
          });
        }
      });
    },

    openDialog() {
      console.log("121332");
      this.XZdDialogDis = true;
    },
    cancelXZDis() {
      this.XZdDialogDis = false;
    },
    //存在问题--- 删除
    delQue(row) {
      console.log(row);
    },
    //新增问题-- 编辑
    editQue(row) {
      console.log(row);
    },
    //新增问题-- 删除
    delQue2(row) {
      console.log(row);
    },
    selected() {
      console.log("选择");
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
  },
};
</script>
<style lang="scss" scoped>
// 文本域
::v-deep .el-textarea .el-input__count {
  line-height: 20px;
  bottom: 2px;
}
.tableDown {
  .el-row {
    display: flex;
    margin: 0 0 15px 0;
    span {
      margin-right: 15px;
      // line-height: 60px;
      // display: inline-block;
    }

    ::v-deep .el-radio-button {
      margin-right: 32px;
      height: 34px;
      // width: 88px;
      span {
        padding: 9px 32px;
        background: rgba(242, 243, 245, 1);

        border: 1px solid rgba(201, 205, 212, 1);
      }
    }
    ::v-deep .is-active {
      span {
        background: rgba(66, 130, 255, 1) !important;
        border: 1px solid rgba(66, 130, 255, 1) !important;
      }
    }
    .el-textarea {
      width: 513px;
      // height: 120px;
    }
    .spanOther {
      margin-left: -16px;
    }
    .el-input {
      width: 250px;
      height: 32px;
    }
  }
}

.total-page {
  background: #fff;
  overflow-y: scroll;
}
.sradd {
  padding: 20px;
  padding-bottom: 40px;
}
::v-deep .sr-add .el-form-item {
  padding-bottom: 20px;
}
::v-deep .el-tabs__header {
  padding: 20px !important;
  padding-bottom: 0 !important;
}
.btns {
  width: 80px;
  text-align: center;
  height: 34px;
  font-size: 12px;
  line-height: 34px;
  border-radius: 4px;
  color: rgba(66, 130, 255, 1);
  background: rgba(66, 130, 255, 0.1);
  cursor: pointer;
  border: 1px dashed rgba(66, 130, 255, 1);
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
.reportWriter {
  display: flex;
  ::v-deep .el-input {
    width: 100%;
  }
  .btn {
    // margin-left: 5px;
    // width: 30px;
    // height: 30px;
    // opacity: 1;
    // color: rgba(66, 130, 255, 1);
    // border-radius: 50%;
    // text-align: center;
    // line-height: 30px;
    // cursor: pointer;
    // border: 1px dashed rgba(66, 130, 255, 1);

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
::v-deep .workflow {
  // width: calc(100% - 220px) !important;
  border-left: 2px solid rgb(230, 230, 230) !important;
  .el-button {
    border-radius: 4px !important;
  }
}
::v-deep .step {
  height: 340px !important;
  display: flex !important;
  justify-content: flex-start !important;
  margin-left: 40px !important;
  margin-bottom: 70px;
}
</style>
