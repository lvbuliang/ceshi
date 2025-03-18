<!-- 预研交付申请 -->
<template>
  <div class="common-card">
    <!-- <div class="total-page" style="padding: 20px"> -->
    <!-- <SrSearch
      :search="search"
      :searchExpand="true"
      :showTextBtns="true"
      :hideBtns="false"
      @queryList="pageChanged(1)"
    ></SrSearch> -->
    <div class="searchPage" ref="searchRef">
      <el-form
        size="small"
        :inline="true"
        :model="search.formData"
        class="demo-form-inline"
        ref="searchForm"
      >
        <el-form-item>
          <el-input
            @clear="clearFunc('systemName')"
            clearable
            v-model="search.formData.systemName"
            placeholder="系统名称"
            @blur="inputAntSelectBlur"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            @clear="clearFunc('projectName')"
            clearable
            v-model="search.formData.projectName"
            placeholder="项目名称"
            @blur="inputAntSelectBlur"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            @clear="clearFunc('needDepartmentPersonId')"
            clearable
            v-model="search.formData.needDepartmentPersonId"
            placeholder="请输入需求部门"
            @blur="inputAntSelectBlur"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-select
            v-model="search.formData.yearPlanId"
            clearable
            placeholder="所属年度计划"
            @clear="clearFunc('yearPlanId')"
            @change="inputAntSelectBlur"
          >
            <el-option
              v-for="item in search.enum.yearPlanList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="search.formData.status"
            clearable
            placeholder="选择状态"
            @clear="clearFunc('status')"
            @change="inputAntSelectBlur"
          >
            <el-option
              v-for="item in search.enum.statusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="search.formData.tjPerson"
            clearable
            placeholder="发起人"
            @clear="clearFunc('tjPerson')"
            @change="inputAntSelectBlur"
          >
            <el-option
              v-for="item in search.enum.customerManager"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            class="circle-btn"
            icon="el-icon-search"
            type="primary"
            circle
            @click="searchFn"
          ></el-button>
        </el-form-item>

        <el-form-item>
          <el-button
            class="circle-btn"
            icon="el-icon-refresh"
            circle
            @click="resetForm"
          ></el-button>
        </el-form-item>
      </el-form>
    </div>
    <CustomLoading :visible="isLoading" />
    <SrTable
      @pageChanged="pageChanged"
      :data="table.data"
      :noData="noData"
      @sizeChanged="sizeChanged"
      @sortChange="sortChange"
      :config="table.tableConfig"
      :page="table.page"
      @selected="selected"
      ref="selectTable"
      :extra-tooltip-labels="['项目编码', '需求部门']" 
    >
      <template slot="name3" slot-scope="scope">
        {{ scope.scope.row.constructionProgress }}
        <span v-if="scope.scope.row.constructionProgress">%</span>
      </template>
    </SrTable>
    <!-- </div> -->
  </div>
</template>

<script>
// 获取用户登录后存储的信息
import store from "@/store";
import { api_userSetQuery, api_userSetSave } from "@/api/index.js";
import { api_getList, api_before_thxg } from "@/api/preResearchDelivery/index";
import { getUserByRoleCode } from "@/api/planProject";
import { getCommonTableHeight } from "@/utils/tableHeightUtils.js";
import yearPlanManager from "@/utils/yearPlanUtils";
export default {
  data() {
    return {
      isLoading: false,
      noData: false,
      isTableHeaderId: "",
      centerDialogVisible: false,
      theNew: "",
      userInfo: store.getters.userInfo,
      search: {
        size: "small",
        labelConfig: {
          labelWidth: "90px",
          labelSuffix: ":",
          labelPosition: "right",
        },
        config: [
          {
            type: "text",
            placeholder: "请输入系统名称",
            bind: "systemName", // 对应this.search.data对象的field1
            className: "inputStyle",
          },
          {
            type: "text",
            placeholder: "请输入项目名称",
            bind: "projectName", // 对应this.search.data对象的field1
            className: "inputStyle",
          },
          {
            type: "text",
            placeholder: "请输入需求部门",
            bind: "needDepartmentPersonId", // 对应this.search.data对象的field1
            disabled: false,
            className: "inputStyle",
          },
          {
            type: "select",
            placeholder: "所属年度计划",
            bind: "yearPlanId",
            data: "yearPlanList", // 对应enum中的yearPlanList
            className: "selectStyle",
            disabled: false,
          },
          {
            type: "select",
            placeholder: "选择状态",
            bind: "status",
            data: "statusList", // 对应enum中的stateList
            className: "plan_type",
            // multiple: true,
          },
          {
            type: "select",
            placeholder: "发起人",
            bind: "tjPerson",
            data: "customerManager",
            className: "inputStyle",
            isHave: true,
          },
        ],
        enum: {
          yearPlanList: [], //年度计划
          statusList: [
            {
              value: 0,
              label: "未提交",
            },
            {
              value: 2,
              label: "审批中",
            },
            {
              value: 4,
              label: "不通过",
            },
            {
              value: 5,
              label: "已完成",
            },
            // {
            //   value: 1,
            //   label: "未提交",
            // },
            // {
            //   value: 2,
            //   label: "预研交付评审-待审核",
            // },
            // {
            //   value: 202,
            //   label: "预研交付评审-退回修改",
            // },
            // {
            //   value: 203,
            //   label: "预研交付评审-不通过",
            // },
            // {
            //   value: 301,
            //   label: "通过申请-待审核",
            // },
            // {
            //   value: 302,
            //   label: "通过申请-退回修改",
            // },
            // {
            //   value: 303,
            //   label: "通过申请-不通过",
            // },
            // {
            //   value: 1000,
            //   label: "通过",
            // },
          ], //状态
          customerManager: [],
        },
        formData: {
          projectName: "",
          systemName: "",
          needDepartmentPersonId: "",
          yearPlanId: "",
          status: "",
          tjPerson: "",
        },
      },
      table: {
        data: [],
        tableConfig: {
          rowClassName: this.rowClassName,
          title: "表格的标题", // 表格标题
          highlightCurrentRow: false, // 控制表格是否单选
          maxHeight: 0,
          load: this.load,
          tooltipEffect: "light",
          header: [],
          selectionConfig: {
            display: false,
            width: "40",
          },
          operateConfig: {
            display: true,
            label: "操作",
            width: "156",
            fixed: "right",
            allTableHeader: "",
            saveHeaderList: this.saveHeaderList,
          },

          innerBtn: [
            {
              name: "查看", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "see", // 点击执行该页面methods中对应的方法
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
              validate: this.btnValidate2,
            },
            {
              name: "撤回", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "beforeExamineThxg", // 点击执行该页面methods中对应的方法
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
              validate: this.btnValidate3,
            },
            {
              name: "发起预研交付",
              method: "preresearch", // 点击执行该页面methods中对应的方法
              type: "text",
              size: "small",
              // field: 'status',
              // value: ['4'],
              icon: "el-icon-document",
              // code: "M005_003_002_004", // 按钮的唯一值,用于角色按钮权限控制，不传默认不进行权限控制
              className: "font-size-20",
              validate: this.btnValidate,
            },
          ],
        },
        page: {
          // 分页配置
          total: 0, //总条数
          pages: 0, //总页数
          pageSize: 10, //每页展示多少个
          pageSizes: [10, 20, 30],
          pageNum: 1, //当前页
          background: true,
          // layout: 'total, prev, pager, next, sizes,jumper'
        },
      },
    };
  },
  created() {
    this.search.enum.yearPlanList = yearPlanManager.yearPlanList;
  },
  mounted() {
    this.Query_List();
    this.getTbData();
    this.getTbHeader();
    this.calculateTableHeight();
  },
  methods: {
    calculateTableHeight() {
      // 调用工具函数并传入元素的 ref
      this.$set(
        this.table.tableConfig,
        "maxHeight",
        getCommonTableHeight(this.$refs.searchRef)
      );
    },
    clearFunc(type) {
      sessionStorage.removeItem("searchData");
      switch (type) {
        case "systemName":
          this.search.formData.systemName = "";
          break;
        case "needDepartmentPersonId":
          this.search.formData.needDepartmentPersonId = "";
          break;
        case "yearPlanId":
          this.search.formData.yearPlanId = "";
          break;
        case "tjPerson":
          this.search.formData.tjPerson = "";
          break;
        case "status":
          this.search.formData.status = null;
          break;
        case "projectName":
          this.search.formData.projectName = "";
          break;
      }
    },
    inputAntSelectBlur() {
      sessionStorage.setItem(
        "searchData",
        JSON.stringify({
          ...this.search.formData,
          pageNum: this.table.page.pageNum,
        })
      );
    },
    resetForm() {
      this.search.formData.yearPlanId = "";
      this.search.formData.needDepartmentPersonId = "";
      this.search.formData.projectName = "";
      this.search.formData.systemName = "";
      this.search.formData.status = null;
      this.search.formData.tjPerson = "";
      this.table.page.pageNum = 1;
      this.table.page.pageSize = 10;
      sessionStorage.removeItem("searchData");
      this.getTbData();
    },
    searchFn() {
      this.table.page.pageNum = 1;
      this.getTbData("seek");
    },
    btnValidate2(row, item) {
      if (
        this.userInfo.currentRole.roleCode == "FZGHC_JBRBF" ||
        this.userInfo.currentRole.roleCode == "BM_FZR" ||
        this.userInfo.currentRole.roleCode == "XMFZR" ||
        this.userInfo.currentRole.roleCode == "DSZ" ||
        this.userInfo.currentRole.roleCode == "F_ZJL" ||
        this.userInfo.currentRole.roleCode == "ZJL" ||
        this.userInfo.currentRole.roleCode == "PSXZ_CY" ||
        this.userInfo.currentRole.roleCode == "KHJL"
      ) {
        return true;
      } else {
        return false;
      }
    },
    preresearch(row) {
      if (this.table.page.pageNum !== 1) {
        const {
          systemName,
          projectName,
          needDepartmentPersonId,
          yearPlanId,
          tjPerson,
          status,
        } = this.search.formData;
        if (
          systemName == "" &&
          projectName == "" &&
          needDepartmentPersonId == "" &&
          yearPlanId == "" &&
          tjPerson == "" &&
          status == ""
        ) {
          sessionStorage.setItem(
            "searchData",
            JSON.stringify({
              ...this.search.formData,
              pageNum: this.table.page.pageNum,
            })
          );
        } else {
          sessionStorage.setItem(
            "searchData",
            JSON.stringify({ ...this.search.formData, pageNum: 1 })
          );
        }
      } else {
        const {
          systemName,
          projectName,
          needDepartmentPersonId,
          yearPlanId,
          tjPerson,
          status,
        } = this.search.formData;
        if (
          systemName !== "" ||
          projectName !== "" ||
          needDepartmentPersonId !== "" ||
          yearPlanId !== "" ||
          tjPerson !== "" ||
          status !== ""
        ) {
          sessionStorage.setItem(
            "searchData",
            JSON.stringify({ ...this.search.formData, pageNum: 1 })
          );
        }
      }

      sessionStorage.setItem("preStatus", row.status);
      this.$router.push({
        name: "preResearchDeliveryAdd",
        query: {
          id: row.id,
          preResearchDeliveryId: row.preResearchDeliveryId,
          processId: row.processId,
          statusFlag: row.status,
        },
      });
    },
    see(row) {
      console.log(
        "zzzzzzzzzzzzzzzzzzzzzzzzz",
        this.table.page.pageNum,
        this.search.formData
      );

      if (this.table.page.pageNum !== 1) {
        const {
          systemName,
          projectName,
          needDepartmentPersonId,
          yearPlanId,
          tjPerson,
          status,
        } = this.search.formData;
        if (
          systemName == "" &&
          projectName == "" &&
          needDepartmentPersonId == "" &&
          yearPlanId == "" &&
          tjPerson == "" &&
          status == ""
        ) {
          sessionStorage.setItem(
            "searchData",
            JSON.stringify({
              ...this.search.formData,
              pageNum: this.table.page.pageNum,
            })
          );
        } else {
          sessionStorage.setItem(
            "searchData",
            JSON.stringify({ ...this.search.formData, pageNum: 1 })
          );
        }
      } else {
        const {
          systemName,
          projectName,
          needDepartmentPersonId,
          yearPlanId,
          tjPerson,
          status,
        } = this.search.formData;
        if (
          systemName !== "" ||
          projectName !== "" ||
          needDepartmentPersonId !== "" ||
          yearPlanId !== "" ||
          tjPerson !== "" ||
          status !== ""
        ) {
          sessionStorage.setItem(
            "searchData",
            JSON.stringify({ ...this.search.formData, pageNum: 1 })
          );
        }
      }

      sessionStorage.setItem("preStatus", row.status);

      this.$router.push({
        name: "preResearchDeliveryView",
        query: {
          id: row.id,
          preResearchDeliveryId: row.preResearchDeliveryId,
          processId: row.processId,
          templateId: row.templateId,
          status: row.status,
        },
      });
    },
    workView(row) {
      if (this.table.page.pageNum !== 1) {
        const {
          systemName,
          projectName,
          needDepartmentPersonId,
          yearPlanId,
          tjPerson,
          status,
        } = this.search.formData;
        if (
          systemName == "" &&
          projectName == "" &&
          needDepartmentPersonId == "" &&
          yearPlanId == "" &&
          tjPerson == "" &&
          status == ""
        ) {
          sessionStorage.setItem(
            "searchData",
            JSON.stringify({
              ...this.search.formData,
              pageNum: this.table.page.pageNum,
            })
          );
        } else {
          sessionStorage.setItem(
            "searchData",
            JSON.stringify({ ...this.search.formData, pageNum: 1 })
          );
        }
      } else {
        const {
          systemName,
          projectName,
          needDepartmentPersonId,
          yearPlanId,
          tjPerson,
          status,
        } = this.search.formData;
        if (
          systemName !== "" ||
          projectName !== "" ||
          needDepartmentPersonId !== "" ||
          yearPlanId !== "" ||
          tjPerson !== "" ||
          status !== ""
        ) {
          sessionStorage.setItem(
            "searchData",
            JSON.stringify({ ...this.search.formData, pageNum: 1 })
          );
        }
      }

      sessionStorage.setItem("preStatus", row.status);
      this.$router.push({
        name: "preResearchDeliveryWorkView",
        query: {
          id: row.id,
          processId: row.processId,
          templateId: row.templateId,
          preResearchDeliveryId: row.preResearchDeliveryId,
          status: row.status,
        },
      });
    },
    btnValidate(row, item) {
      // 1-- "未提交" 2=="待审核"
      // 202=="预研申请-退回修改"
      // 203=="预研申情-不通过"
      // 301=="预研通过申请-待审核"
      // 302=="预研通过申请-退回修改"
      // 303=="预研通过申请-不通过"
      // 1000=="通过"
      // item.status !== 2 &&
      // item.status !== 301 &&
      // item.status !== 1000 &&
      // this.userInfo.currentRole.roleCode !== "FZGHC_JBRBF"&&
      if (row.name == "发起预研交付") {
        if (
          (item.status == 1 || item.status == 202 || item.status == 302) &&
          this.userInfo.currentRole.roleCode == "KHJL"
        ) {
          return true;
        } else {
          return false;
        }
      }
    },
    btnValidate3(row, item) {
      // 客户经理并且状态是2并且当前登陆人为发起人 并且isWradw == '0' 的可以撤回
      if (
        item.status == 2 &&
        this.userInfo.currentRole.roleCode == "KHJL" &&
        this.userInfo.fullname == item.tjPerson &&
        item.isWradw == "0"
      ) {
        return true;
      } else {
        return false;
      }
    },
    // 撤回方法
    beforeExamineThxg(row) {
      api_before_thxg({ processId: row.processId }).then((res) => {
        if (res.msg.code == "0000") {
          this.$message.success("撤回成功");
          this.getTbData();
        } else {
          this.$message.error(res.data);
        }
      });
    },
    Query_List() {
      // alert('1')
      let param1 = {
        pageNum: this.table.page.pageNum,
        pageSize: 9999,
      };
      api_getList(param1).then((res1) => {
        //console.log(res1.data.records, "获取的数据");
        let initTjPerson = new Set(
          res1.data.records.map((item) => {
            return item.tjPerson;
          })
        );

        Array.from(initTjPerson).map((tjRes) => {
          if (tjRes !== null) {
            this.search.enum.customerManager.push({
              label: String(tjRes),
              value: String(tjRes),
            });
          }
        });
      });
    },
    getTbData(seek) {
      this.isLoading = true;
      this.noData = false;
      if (sessionStorage.getItem("searchData") !== null) {
        if (
          JSON.parse(sessionStorage.getItem("searchData")).systemName !== ""
        ) {
          this.search.formData.systemName = JSON.parse(
            sessionStorage.getItem("searchData")
          ).systemName;
        }
        if (
          JSON.parse(sessionStorage.getItem("searchData")).projectName !== ""
        ) {
          this.search.formData.projectName = JSON.parse(
            sessionStorage.getItem("searchData")
          ).projectName;
        }
        if (
          JSON.parse(sessionStorage.getItem("searchData"))
            .needDepartmentPersonId !== ""
        ) {
          this.search.formData.needDepartmentPersonId = JSON.parse(
            sessionStorage.getItem("searchData")
          ).needDepartmentPersonId;
        }
        if (
          JSON.parse(sessionStorage.getItem("searchData")).yearPlanId !== ""
        ) {
          this.search.formData.yearPlanId = JSON.parse(
            sessionStorage.getItem("searchData")
          ).yearPlanId;
        }
        if (JSON.parse(sessionStorage.getItem("searchData")).tjPerson !== "") {
          this.search.formData.tjPerson = JSON.parse(
            sessionStorage.getItem("searchData")
          ).tjPerson;
        }
        if (JSON.parse(sessionStorage.getItem("searchData")).status !== "") {
          this.search.formData.status = JSON.parse(
            sessionStorage.getItem("searchData")
          ).status;
        }
        if (seek == "seek") {
          if (JSON.parse(sessionStorage.getItem("searchData")).pageNum !== "") {
            this.table.page.pageNum = JSON.parse(
              sessionStorage.getItem("searchData")
            ).pageNum;
          }
        }
      }
      // this.table.data=[];
      let param = {
        pageNum: this.table.page.pageNum,
        pageSize: this.table.page.pageSize,
        ...this.search.formData,
      };
      //console.log(param, "预研传参数");

      api_getList(param)
        .then((res) => {
          this.table.page.pages = res.data.pages;
          this.table.page.total = res.data.total;
          let { roleCode } = this.userInfo.currentRole;
          let { jfid } = this.userInfo;
          if (res.data.records.length>0) {
            this.isLoading = false;
            res.data.records.forEach((item) => {
              if (item.todo) {
                item.operationBtns = [];
                //按钮筛选  以assignee优先roleCode
                if (item.assignee == jfid) {
                  item.description &&
                    JSON.parse(item.description).map((item1) => {
                      if (item1.operationBtns[0].btnName == "评审小组") {
                        if (item.isShow) {
                          item.operationBtns = [];
                          item1.operationBtns &&
                            item.operationBtns.push(item1.operationBtns[0]);
                        }
                      } else if (item1.operationBtns[0].btnName == "初验申请") {
                        item.operationBtns = [];
                      } else {
                        item1.operationBtns &&
                          item.operationBtns.push(item1.operationBtns[0]);
                      }
                    });
                  item.path = this.workView;
                } else {
                  item.description &&
                    JSON.parse(item.description).map((item1) => {
                      //console.log("item1.operationBtns", item1.operationBtns);

                      if (roleCode == item1.role) {
                        if (item1.operationBtns[0].btnName == "提交") {
                          item.operationBtns = [];
                        } else {
                          item1.operationBtns &&
                            item.operationBtns.push(item1.operationBtns[0]);
                        }
                      }
                    });
                  // 处理建设单位提交,经办人审核后经办人有撤回按钮
                  item.operationBtns.map((item1) => {
                    if (item1.btnName == "撤回" && item.creator != jfid) {
                      item1.btnName = "";
                    }
                  });
                }
                item.path = this.workView;
              }
              if (
                item.operationBtns &&
                [202, 302, 307, 411].includes(item.status)
              ) {
                item.operationBtns = item.operationBtns.filter(
                  (item) => item.name == "提交"
                );
                item.btns = [
                  ...(item.btns ?? []),
                  ...(item.operationBtns ?? []),
                ];
              }
              return item;
            });
            this.table.data = res.data.records;
          } else {
            this.isLoading = false;
            this.noData = true;
          }
        })
        .catch((err) => {
          this.isLoading = false;
          this.noData = true;
        });
    },

    sortChange(column) {
      if (column.order === "ascending") {
        this.search.formData["orderByColumn"] = column.prop;
        this.search.formData["orderBy"] = "ASC";
      } else if (column.order === "descending") {
        this.search.formData["orderByColumn"] = column.prop;
        this.search.formData["orderBy"] = "DESC";
      } else {
        this.search.formData["orderByColumn"] = "";
        this.search.formData["orderBy"] = "";
      }
      this.getTbData();
    },
    // 表头
    getTbHeader() {
      api_userSetQuery({ permissionCode: "M005_020" }).then((res) => {
        this.isTableHeaderId = res.data.id;
        let headerData = JSON.parse(res.data.data).sort(
          (a, b) => a.index - b.index
        );
        this.table.tableConfig.operateConfig.allTableHeader = headerData;
        this.table.tableConfig.header = headerData.filter((item) => {
          /* if (["reported","shouldReport","overdue"].includes(item.prop) ) {
            item.width = "114px";
          } */
          return item.isShow;
        });
      });
      getUserByRoleCode({ roleCode: "KHJL" }).then((res) => {
        //console.log("客户经理", res.data);
        res.data.map((res) => {
          // //console.log(res,'res')
          // this.search.enum.customerManager.push({
          //   label: String(res.fullname),
          //   value: String(res.fullname),
          // });
        });
      });
    },
    //  分页 页数发生变化
    pageChanged(val) {
      sessionStorage.removeItem("searchData");
      this.table.page.pageNum = val;
      this.getTbData();
    },
    sizeChanged(val) {
      sessionStorage.removeItem("searchData");
      this.table.page.pageNum = 1;
      this.table.page.pageSize = val;
      this.getTbData();
    },
    settingHeader() {
      this.dialogVisible = true;
    },
    saveHeaderList(data) {
      api_userSetSave({
        data: JSON.stringify(data),
        permissionCode: "M005_020",
        id: this.isTableHeaderId,
      }).then((res) => {
        if (res.msg.code == "0000") {
          this.getTbData();
          this.getTbHeader();
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.sr_table {
  height: 85% !important;
}

.common-card {
  height: 100%;
}

::v-deep .sr_table th {
  line-height: 48px;
  height: 48px;
  > .cell {
    line-height: 24px !important;
  }
}

::v-deep .sr_table td {
  line-height: 60px;
  height: 60px;
  > .cell {
    line-height: 24px !important;
  }
}

::v-deep .sr_search .inputStyle {
  width: 170px !important;
  .el-input {
    width: 170px !important;
  }
}
::v-deep .sr_search .selectStyle {
  width: 170px !important;
  .el-select {
    width: 170px !important;
  }
}
.button {
  width: 28px;
  height: 28px;
  margin-left: 10px;
  border-radius: 50%;
  border: 1px dashed #1890ff;
  font-size: 24px;
  color: #1890ff;
  display: flex;
  justify-content: center;
  align-items: center;
}

.SrDialogSelect {
  ::v-deep .el-input {
    display: none;
  }
}

.total-page {
  ::v-deep .selectWidthCustom {
    width: 153px !important;
  }

  ::v-deep .rowImgDiv {
    display: flex;
    justify-content: center;

    .colSpan {
      flex-grow: 1;
      display: flex;
      justify-content: center;
      align-items: center;

      .iconImg {
        width: 14px;
        height: 14px;
        vertical-align: middle;
        margin-right: 5px;
      }
    }
  }
}

::v-deep .el-dialog .el-dialog__header {
  text-align: left;
  font-size: 16px;
  font-weight: 700;
}
::v-deep .sr_search .plan_type {
  width: 180px !important;
  .el-select {
    width: 180px !important;
  }
}

.searchPage {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.circle-btn {
  border-radius: 50% !important;
}
</style>
