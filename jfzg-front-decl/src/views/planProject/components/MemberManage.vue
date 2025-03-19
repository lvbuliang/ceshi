<template>
  <div>
    <!-- 总表 -->
    <el-dialog
      :visible.sync="dialogVisible"
      width="1050px"
      :before-close="handleClose"
      :close-on-click-modal="false"
      :append-to-body="true"
      :showClose="false"
      class="bzhTableHeader"
    >
      <div class="content_box" :style="{ opacity: isLoading ? 0.1 : 1 }">
        <div class="content_title">成员管理</div>
        <div class="conTitle">
          <div class="sys">
            <span class="sysText">系统名称:</span>
            <span class="ml-10">{{ title.systenName }}</span>
          </div>
          <div class="pro">
            <span class="sysText">项目名称:</span>
            <span class="ml-10">{{ title.projectName }}</span>
          </div>
        </div>
        <SrAdd
          class="sradd"
          :config="form.config"
          :enums="form.enums"
          :form="form.data"
          :otherConfig="form.otherConfig"
          ref="add1"
        >
          <template #reportWriter>
            <div class="reportWriter">
              <el-input
                v-model="form.data.weeklyPerson"
                placeholder="请输入内容"
                :disabled="true"
              ></el-input>
              <div class="btn" @click="addReport">
                <i class="el-icon-plus"></i>
              </div>
            </div>
          </template>
        </SrAdd>

        <!-- 多标段 -->
        <div class="content" v-if="sectionSorts > 1">
          <div
            class="content-item"
            v-for="(item, index) in result"
            :key="index"
          >
            <div class="item-sort">标段{{ index + 1 }}</div>
            <div>
              <SrAdd
                class="sradd"
                :config="cjdwConfig.config"
                :enums="cjdwConfig.enums"
                :form="cjdwConfig.data"
                :otherConfig="cjdwConfig.otherConfig"
                ref="add2"
              >
                <!-- 承建单位 -->
                <template #contractUnit>
                  <el-select
                    @clear="clearA(index)"
                    clearable
                    v-model="contractUnit[index]"
                    placeholder="请选择"
                    @change="changeA(index, $event, 'change')"
                  >
                    <el-option
                      v-for="item in options1"
                      :key="item.dataValue"
                      :label="item.dataName"
                      :value="item.dataValue"
                    ></el-option>
                  </el-select>
                </template>
                <!-- 承建单位项目经理 -->
                <template #contractor>
                  <el-select
                    @clear="clearB(index)"
                    clearable
                    v-model="contractor[index]"
                    placeholder="请选择"
                    @change="changeB(index, $event)"
                  >
                    <el-option
                      v-for="item in options2"
                      :key="item.mobile"
                      :label="item.dataName"
                      :value="item.dataValue"
                    ></el-option>
                  </el-select>
                </template>
                <!-- 承建单位项目经理电话 -->
                <template #contractorPhoneNumber>
                  <el-input
                    v-model="contractorPhoneNumber[index]"
                    placeholder="请输入内容"
                    :disabled="true"
                  ></el-input>
                </template>
                <!-- 周报审批人 -->
                <template #reportWriter>
                  <div class="reportWriter">
                    <el-input
                      v-model="weeklyPerson[index]"
                      placeholder="请输入内容"
                      :disabled="true"
                    ></el-input>
                    <div class="btn" @click="addReportItem('others', index)">
                      <i class="el-icon-plus"></i>
                    </div>
                  </div>
                </template>
              </SrAdd>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button
          type="primary"
          @click="sectionSorts > 1 ? saveHeader2() : saveHeader()"
        >
          保存
        </el-button>
      </div>
    </el-dialog>
    <DialogT
      :openType="openType"
      :index="value4Index"
      :data="dataCopy"
      :dialogVisible="reportDialog"
      @close="reportDialogClose"
      @saveSelectData="reportDialogSave"
      @saveSelectDataItem="reportDialogSaveItem"
    />
  </div>
</template>

<script>
import vuedraggable from "vuedraggable";
import { getListByPage } from "@/api/projectLibrary";
import {
  getQueryBizunitsByProperty,
  getProjectDetail,
  getUserByRoleCode,
  queryUsersByBuProperty,
  getSectionCount,
} from "@/api/planProject";
import { api_getCustomFormTemplate } from "@/api/index";
import DialogT from "./DialogT.vue";
import { cjdwConfig } from "./const";

export default {
  name: "SrSettingTable",
  components: { vuedraggable, DialogT },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    babaData: {
      type: Number,
    },
    // 成员管理批量选择ids
    pilIds: {
      type: Array,
      default: () => [],
    },
    // 成员管理批量or行间
    memberManageText: {
      type: String,
    },
    data: {
      type: Array,
      default: () => [],
    },
    dataTwo: {
      type: Array,
      default: () => [],
    },
    dataThree: {
      type: Array,
      default: () => [],
    },
  },
  updated() {
    // console.log("已选择数据", this.selectdata);
  },
  data() {
    return {
      isLoading: false, // 新增加载状态
      openType: null,
      cjdwConfig,
      result: [],
      contractUnit: [], // 承建单位id数据数组
      contractUnitFullName: [], // 承建单位名称数据数组
      contractor: [], // 承建单位项目经理id数组
      contractorName: [], // 承建单位项目经理名称数组
      contractorPhoneNumber: [], // 承建单位项目经理电话
      weeklyPerson: [], // 周报审批人名称
      weeklyPersonId: [], // 周报审批人id
      options1: [],
      options2: [],
      value1Index: 0,
      value4Index: 0,
      datazb1: [],
      datazb2: [],
      datazb3: [],
      datazbAll: [],
      dataCopy: [],
      reportDialog: false,
      fromData: {},
      editableTabs: [],
      form: {
        otherConfig: {
          labelNum: 155,
        },
        config: [
          {
            type: "select",
            name: "项目负责人",
            placeholder: "请选择",
            bind: "contactId",
            dataList: "xmfzrList",
            col: 8,
            filterable: true,
          },
          {
            type: "select",
            name: "方案经理",
            placeholder: "请选择",
            bind: "programManagerId",
            dataList: "programManagerList",
            col: 8,
            filterable: true,
          },
          {
            type: "select",
            name: "客户经理",
            placeholder: "请选择",
            bind: "clientManagerId",
            dataList: "clientManagerList",
            col: 8,
            filterable: true,
          },
          {
            type: "select",
            name: "采购经理",
            placeholder: "请选择",
            bind: "procurementManagerId",
            dataList: "procurementManagerNameList",
            maxLength: 8,
            class: "gg",
            col: 8,
            filterable: true,
          },
          {
            type: "select",
            name: "监理单位",
            placeholder: "请选择",
            bind: "controlUnit",
            dataList: "jlList",
            trigger: "change",
            col: 8,
            change: this.selectJL,
            filterable: true,
          },
          {
            type: "select",
            name: "监理工程师",
            placeholder: "请选择",
            bind: "controlJfid",
            dataList: "controlNameList",
            maxLength: 20,
            col: 8,
            filterable: true,
            trigger: "change",
            change: this.selectJLGCS,
          },
          {
            type: "input",
            name: "监理工程师联系方式",
            placeholder: "请输入",
            bind: "controlorPhoneNumber",
            maxLength: 20,
            col: 8,
          },
          {
            type: "slot",
            slotName: "reportWriter",
            name: "周报填报人",
            placeholder: "请选择",
            bind: "weeklyPerson",
            maxLength: 16,
            class: "gg",
            col: 16,
          },
          {
            type: "select",
            name: "承建单位",
            placeholder: "请选择",
            bind: "contractUnit",
            dataList: "contractUnitFullName",
            trigger: "change",
            change: this.selectCJ,
            col: 8,
            filterable: true,
          },
          {
            type: "select",
            name: "承建单位项目经理",
            placeholder: "请选择",
            bind: "contractor",
            dataList: "contractorNameList",
            maxLength: 20,
            col: 8,
            filterable: true,
            trigger: "change",
            change: this.selectCJJL,
          },
          {
            type: "input",
            name: "承建单位项目经理电话",
            placeholder: "请输入",
            bind: "contractorPhoneNumber",
            maxLength: 20,
            col: 8,
          },
        ],
        data: {
          contactName: "",
          programManagerName: "",
          clientManagerName: "",
          procurementManagerName: "",
          contractUnitFullName: "",
          contractorName: "",
          contractorPhoneNumber: "",
          controlUnitFullName: "",
          controlName: "",
          controlJfid: "",
          controlorPhoneNumber: "",
          weeklyPerson: "",
          weeklyPersonId: "",
          contactId: "",
          programManagerId: "",
          clientManagerId: "",
          procurementManagerId: "",
          contractUnit: "",
          contractor: "",
          controlUnit: "",
        },
        enums: {
          xmfzrList: [],
          contactNameList: [],
          programManagerList: [],
          clientManagerList: [],
          procurementManagerNameList: [],
          contractUnitFullName: [],
          controlUnitFullName: [],
          contractorNameList: [],
          controlNameList: [],
          jlList: [],
        },
      },
      templateId: this.$route.query.templateId,
      // 标题
      title: {
        systenName: "",
        projectName: "",
      },
      sectionSorts: 0,
    };
  },
  watch: {
    "form.data.contractUnit": {
      handler(newVal) {
        if (newVal === "") {
          this.form.enums.contractorNameList = [];
          this.form.data.contractorPhoneNumber = "";
        } else {
          this.getContractorNameList(newVal);
        }
      },
      deep: true,
      immediate: true,
    },
    "form.data.controlUnit": {
      handler(newVal) {
        if (newVal === "") {
          this.form.enums.controlNameList = [];
          this.form.data.controlorPhoneNumber = "";
        } else {
          this.getControlNameList(newVal);
        }
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    this.initData();
  },
  mounted() {},
  methods: {
    async initData() {
      await Promise.all([
        this.getQueryBizunitsByPropertyA("CJDW"),
        this.getQueryBizunitsByPropertyA("JLDW"),
        this.getProjectDetailA(),
        this.getUserByRoleCodeA(),
        this.queryUsersByBuPropertyA(),
      ]);
    },
    searchSection(row) {
      getSectionCount({ projectId: row.id }).then((res) => {
        if (res.msg.code === "0000") {
          this.sectionSorts = res.data;

          if (this.sectionSorts > 1) {
            for (let index = 0; index < res.data; index++) {
              this.result.push({ ...this.cjdwConfig });
            }
            this.$set(this.form.config[7], "name", "周报审批人");
            this.form.config = this.form.config.slice(
              0,
              this.form.config.length - 3
            );
          }
        }
      });
    },
    handleClose() {
      this.$emit("close");
    },
    async queryUsersByBuPropertyA() {
      const [res1, res2, res3] = await Promise.all([
        queryUsersByBuProperty(3),
        queryUsersByBuProperty(40),
        queryUsersByBuProperty(4),
      ]);
      this.datazbAll = [...res1.data, ...res2.data, ...res3.data].map(
        (item) => {
          const { buid, buName, buUniqueCode } = item;
          const userBaseInfoVos = [
            {
              jfid: item.jfid,
              roleCode: item.roleCode,
              buid,
              buName,
              roleName: item.roleName,
              fullname: item.fullname,
              buUniqueCode,
            },
          ];
          return {
            buid,
            buName,
            buUniqueCode,
            userBaseInfoVos,
          };
        }
      );

      this.dataCopy = this.datazbAll.reduce((acc, current) => {
        const existingIndex = acc.findIndex(
          (item) => item.buid === current.buid
        );
        if (existingIndex !== -1) {
          acc[existingIndex].userBaseInfoVos.push(...current.userBaseInfoVos);
        } else {
          acc.push(current);
        }
        return acc;
      }, []);
    },
    getQueryBizunitsByPropertyA(d) {
      getQueryBizunitsByProperty({ buPropertyEnum: d }).then((res) => {
        if (d === "CJDW") {
          this.form.enums.contractUnitFullName = res.data.map((element) => ({
            dataName: String(element.buName),
            dataValue: String(element.buid),
          }));
          this.options1 = this.form.enums.contractUnitFullName;
        } else {
          this.form.enums.jlList = res.data.map((element) => ({
            dataName: String(element.buName),
            dataValue: String(element.buid),
          }));
        }
      });
    },
    changeA(index, val, type) {
      this.value1Index = index;
      console.log(
        "index:",
        index,
        "value1Index:",
        this.value1Index,
        "承建单位:",
        this.contractUnit,
        this.options1
      );

      if (type === "change") {
        this.contractor[index] = "";
        this.contractorName[index] = "";
        this.contractorPhoneNumber[index] = "";
      }
      const idx = this.options1.findIndex(
        (item) => item.dataValue === String(val)
      );
      console.log(idx, "idxidx");

      getUserByRoleCode({
        roleCode: "CJDW_XMJL",
        buid: this.contractUnit[index],
      }).then((res) => {
        if (res.data) {
          this.options2 = res.data
            .filter((element) => element.fullname)
            .map((element) => ({
              dataName: String(element.fullname),
              dataValue: String(element.jfid),
              mobile: String(element.mobile),
            }));
        }
      });

      this.contractUnitFullName[index] = this.options1[idx].dataName;
    },
    clearA(index) {
      this.contractUnit[index] = "";
      this.contractUnitFullName[index] = "";
      this.contractor[index] = "";
      this.contractorName[index] = "";
      this.contractorPhoneNumber[index] = "";
    },
    changeB(index, val) {
      const idx = this.options2.findIndex(
        (item) => item.dataValue === String(val)
      );
      this.contractorName[index] = this.options2[idx].dataName;
      this.contractorPhoneNumber[index] = this.options2[idx].mobile;
    },
    clearB(index) {
      this.contractor[index] = "";
      this.contractorName[index] = "";
      this.contractorPhoneNumber[index] = "";
    },
    saveHeader() {
      const data = this.$refs["add1"].validate();
      console.log(
        "成员管理保存的数据",
        this.contractUnit,
        this.contractor,
        this.contractorPhoneNumber,
        this.weeklyPerson,
        this.weeklyPersonId
      );

      this.fillDataNames(data);
      this.$emit("saveLabelList", data);
    },
    // 多标段数据保存
    saveHeader2() {
      const data = this.$refs["add1"].validate();
      this.fillDataNames(data);

      if (this.contractor[0] === "") {
        this.contractor = [];
        this.contractorName = [];
      }
      if (this.contractUnit[0] === "") {
        this.contractUnit = [];
        this.contractUnitFullName = [];
      }
      if (this.contractorPhoneNumber[0] === "") {
        this.contractorPhoneNumber = [];
      }

      const newArr = Array.from({ length: this.result.length }, (_, index) => ({
        contractUnit: "",
        contractUnitFullName: "",
        contractor: "",
        contractorName: "",
        contractorPhoneNumber: "",
        fieldNo: index + 1,
        weeklyPerson: "",
        weeklyPersonId: "",
        projectId: "",
      }));

      const newArr2 = newArr.map((item, index) => ({
        contractUnit: this.contractUnit[index] || "",
        contractUnitFullName: this.contractUnitFullName[index] || "",
        contractor: this.contractor[index] || "",
        contractorName: this.contractorName[index] || "",
        contractorPhoneNumber: this.contractorPhoneNumber[index] || "",
        weeklyPerson: this.weeklyPerson[index] || "",
        weeklyPersonId: this.weeklyPersonId[index] || "",
        projectId: item.projectId,
        fieldNo: item.fieldNo,
      }));

      data.memberFieldInfoDtos = newArr2;
      this.$emit("saveLabelList2", data);
    },
    // 成员管理回显数据
    getMemberManage(babaData) {
      getProjectDetail({ id: babaData }).then((res) => {
        console.log(res.data, "成员管理回显数据---------");
        console.log(res.data.contractUnit, "res.data.contractUnit");

        this.fillFormData(res.data);
        this.title.systenName = res.data.systemName;
        this.title.projectName = res.data.projectName;

        if (
          res.data.menberFieldInfoList &&
          res.data.menberFieldInfoList.length > 0
        ) {
          this.resetMultiSectionData();
          res.data.menberFieldInfoList.forEach((item, index) => {
            this.contractUnit.push(String(item.contractUnit));
            this.contractUnitFullName.push(item.contractUnitFullName);
            this.changeA(index, String(item.contractUnit), "huixian");
            this.contractor.push(String(item.contractor));
            this.contractorName.push(item.contractorName);
            this.contractorPhoneNumber.push(item.contractorPhoneNumber);
            this.weeklyPerson.push(item.weeklyPerson);
            this.weeklyPersonId.push(item.weeklyPersonId);
          });
        }
        setTimeout(() => {
          this.isLoading = false;
        }, 500);
      });
    },
    getProjectDetailA() {
      if (this.memberManageText === "成员管理内") {
        this.getMemberManage(this.babaData);
      } else if (
        this.memberManageText === "成员管理外" &&
        this.pilIds.length === 1
      ) {
        this.getMemberManage(this.pilIds[0]);
      }
    },
    getAllId(list, id) {
      const element = list.find((element) => element.dataValue === id);
      return element ? element.dataName : "";
    },
    // 根据code  拿到角色信息
    async getUserByRoleCodeA() {
      const roleCodes = ["XMFZR", "FAJL", "KHJL", "CGJL"];
      const requests = roleCodes.map((roleCode) =>
        getUserByRoleCode({ roleCode })
      );
      const responses = await Promise.all(requests);

      const roleMap = {
        XMFZR: "xmfzrList",
        FAJL: "programManagerList",
        KHJL: "clientManagerList",
        CGJL: "procurementManagerNameList",
      };

      responses.forEach((res, index) => {
        const roleList = roleMap[roleCodes[index]];
        this.form.enums[roleList] = res.data
          .filter((element) => element.fullname)
          .map((element) => ({
            dataName: String(element.fullname),
            dataValue: String(element.jfid),
          }));
      });
    },
    // 获取承建单位项目经理下拉框
    getContractorNameList(val) {
      getUserByRoleCode({
        roleCode: "CJDW_XMJL",
        buid: val,
      }).then((res) => {
        this.form.enums.contractorNameList = res.data
          .filter((element) => element.fullname)
          .map((element) => ({
            dataName: String(element.fullname),
            dataValue: String(element.jfid),
            mobile: String(element.mobile),
          }));
      });
    },
    // 获取监理经理下拉框
    getControlNameList(val) {
      getUserByRoleCode({
        roleCode: "JLGCS",
        buid: val,
      }).then((res) => {
        this.form.enums.controlNameList = res.data
          .filter((element) => element.fullname)
          .map((element) => ({
            dataName: String(element.fullname),
            dataValue: String(element.jfid),
            mobile: String(element.mobile),
          }));
      });
    },
    addReport() {
      this.reportDialog = true;
    },
    addReportItem(type, index) {
      this.value4Index = index;
      this.openType = type;
      this.reportDialog = true;
    },
    reportDialogClose() {
      this.reportDialog = false;
    },
    reportDialogSave(all) {
      this.reportDialog = false;
      this.form.data.weeklyPerson = all[0].data[0].fullname;
      this.form.data.weeklyPersonId = all[0].data[0].jfid;
    },
    reportDialogSaveItem({ data, index }) {
      this.weeklyPerson[index] = data[0].data[0].fullname;
      this.weeklyPersonId[index] = data[0].data[0].jfid;
      this.reportDialog = false;
    },
    // 监理
    selectJL(val) {
      this.form.data.controlJfid = "";
    },
    // 承建
    selectCJ(val) {
      this.form.data.contractor = "";
    },
    // 承建经理
    selectCJJL(val) {
      if (val) {
        const item = this.form.enums.contractorNameList.find(
          (item) => String(val) === item.dataValue
        );
        this.form.data.contractorPhoneNumber = item ? item.mobile : "";
      } else {
        this.form.data.contractorPhoneNumber = "";
      }
    },
    // 监理工程师
    selectJLGCS(val) {
      if (val) {
        const item = this.form.enums.controlNameList.find(
          (item) => String(val) === item.dataValue
        );
        this.form.data.controlorPhoneNumber = item ? item.mobile : "";
      } else {
        this.form.data.controlorPhoneNumber = "";
      }
    },
    fillDataNames(data) {
      const fields = [
        { idField: "contactId", nameField: "contactName", list: "xmfzrList" },
        {
          idField: "programManagerId",
          nameField: "programManagerName",
          list: "programManagerList",
        },
        {
          idField: "clientManagerId",
          nameField: "clientManagerName",
          list: "clientManagerList",
        },
        {
          idField: "procurementManagerId",
          nameField: "procurementManagerName",
          list: "procurementManagerNameList",
        },
        {
          idField: "contractUnit",
          nameField: "contractUnitFullName",
          list: "contractUnitFullName",
        },
        {
          idField: "contractor",
          nameField: "contractorName",
          list: "contractorNameList",
        },
        {
          idField: "controlUnit",
          nameField: "controlUnitFullName",
          list: "jlList",
        },
        {
          idField: "controlJfid",
          nameField: "controlName",
          list: "controlNameList",
        },
      ];

      fields.forEach(({ idField, nameField, list }) => {
        data[nameField] = this.getAllId(this.form.enums[list], data[idField]);
      });
    },
    fillFormData(data) {
      const fields = [
        "contactName",
        "contactId",
        "programManagerName",
        "programManagerId",
        "clientManagerName",
        "clientManagerId",
        "procurementManagerName",
        "procurementManagerId",
        "contractUnitFullName",
        "contractUnit",
        "contractor",
        "contractorName",
        "contractorPhoneNumber",
        "controlUnit",
        "controlUnitFullName",
        "controlName",
        "controlJfid",
        "controlorPhoneNumber",
        "weeklyPerson",
        "weeklyPersonId",
      ];

      fields.forEach((field) => {
        this.form.data[field] = data[field] ? String(data[field]) : "";
      });
    },
    resetMultiSectionData() {
      this.contractUnit = [];
      this.contractUnitFullName = [];
      this.contractor = [];
      this.contractorName = [];
      this.contractorPhoneNumber = [];
      this.weeklyPerson = [];
      this.weeklyPersonId = [];
    },
  },
};
</script>

<style lang="scss" scoped>
.sradd {
  padding: 20px;
}

.content {
  height: 200px;
  overflow-y: scroll;
}

.item-sort {
  padding-left: 45px;
  font-size: 20px;
  font-weight: bold;
}

.reportWriter {
  display: flex;

  ::v-deep .el-input {
    width: 34%;
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

.conTitle {
  font-size: 16px;
  height: 100%;
  width: 96%;
  background-color: rgb(241, 243, 246);
  display: flex;
  margin: 14px 0 0 16px;
  padding: 14px;
  justify-content: flex-start;
  font-size: 16px;
  font-weight: 500;
  color: rgba(29, 33, 41, 1);

  .white {
    color: #fff;
  }

  .sys {
    letter-spacing: 0.05em;
    margin-right: 120px;
    margin-bottom: 3px;

    .sysText {
      font-weight: 600;
    }

    .ml-10 {
      margin-left: 10px;
    }
  }

  .pro {
    letter-spacing: 0.05em;
    margin-right: 10px;

    .sysText {
      font-weight: 600;
    }

    .ml-10 {
      margin-left: 10px;
    }
  }
}
.content_box {
  transition: opacity 0.3s;
}
.bzhTableHeader .el-dialog__body .content_box .content_title {
  height: 56px;
  padding-left: 16px;
  text-align: left;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  border-bottom: 1px solid #e8e8e8;
  font-size: 16px;
  font-weight: 500;
}

::v-deep .sr-add .el-input__inner {
  border-radius: 4px !important;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;

  .el-button {
    border-radius: 4px !important;
  }
}

/* 加载动画样式 */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-spinner {
  text-align: center;
}

.loading-spinner i {
  font-size: 40px;
  color: #409eff;
  animation: rotating 2s linear infinite;
}

.loading-spinner p {
  margin-top: 10px;
  color: #606266;
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
