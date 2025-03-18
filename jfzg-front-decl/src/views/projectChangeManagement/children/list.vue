<template>
  <div class="common-card">
    <div ref="searchRef">
      <searchFrom
        :search="search"
        @child-event="resetForm"
        @child-searchFn="searchFn"
        @child-add="add"
      >
      </searchFrom>
    </div>
    <CustomLoading :visible="isLoading" />
    <SrTable
      :row-class-name="getRowClassName"
      :data="table.data"
      :noData="noData"
      @pageChanged="handlePageChange"
      @sizeChanged="handleSizeChange"
      :config="table.config"
      :page="table.page"
      @sortChange="sortChange"
      @row-click="rowClick"
      :extra-tooltip-labels="['项目负责人', '变更发起人']" 
    >
      <!-- <template slot="systemName" slot-scope="scope">
        <div v-if="scope.scope.row.todo" style="color: red" class="text-ellipsis">
          {{ scope.scope.row.systemName }}
        </div>
        <div v-else class="text-ellipsis">
          {{ scope.scope.row.systemName }}
        </div>
      </template>
      <template slot="projectName" slot-scope="scope">
        <div v-if="scope.scope.row.todo" style="color: red">
          {{ scope.scope.row.projectName }}
        </div>
        <div v-else>
          {{ scope.scope.row.projectName }}
        </div>
      </template>

      <template slot="contractName" slot-scope="scope">
        <div v-if="scope.scope.row.todo" style="color: red">
          {{ scope.scope.row.contractName }}
        </div>
        <div v-else>
          {{ scope.scope.row.contractName }}
        </div>
      </template>
      <template slot="contactName" slot-scope="scope">
        <div v-if="scope.scope.row.todo" style="color: red">
          {{ scope.scope.row.contactName }}
        </div>
        <div v-else>
          {{ scope.scope.row.contactName }}
        </div>
      </template>
      <template slot="tjPerson" slot-scope="scope">
        <div v-if="scope.scope.row.todo" style="color: red">
          {{ scope.scope.row.tjPerson }}
        </div>
        <div v-else>
          {{ scope.scope.row.tjPerson }}
        </div>
      </template>
      <template slot="tjTime" slot-scope="scope">
        <div v-if="scope.scope.row.todo" style="color: red">
          {{ scope.scope.row.tjTime }}
        </div>
        <div v-else>
          {{ scope.scope.row.tjTime }}
        </div>
      </template>
      <template slot="statusName" slot-scope="scope">
        <div v-if="scope.scope.row.todo" style="color: red">
          {{ scope.scope.row.statusName }}
        </div>
        <div v-else>
          {{ scope.scope.row.statusName }}
        </div>
      </template> -->
    </SrTable>

    <el-dialog
      width="60%"
      title="选择项目"
      :visible.sync="dialogTableVisible"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      :modal-append-to-body="false"
    >
      <SrSearch
        :search="search1"
        :searchExpand="true"
        :showTextBtns="true"
        @queryList="pageChanged(1)"
      ></SrSearch>
      <SrTable
        @pageChanged="pageChanged"
        :data="table1.data"
        @sizeChanged="sizeChanged"
        :config="table1.config"
        :page="table1.page"
        @selected="selected"
        ref="multipleTable1"
      >
      </SrTable>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="IdentifyChanges">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import store from "@/store";

import searchFrom from "../components/searchfrom.vue";
import { getCommonTableHeight } from "@/utils/tableHeightUtils.js";
import { api_userSetQuery, api_userSetSave } from "@/api/index.js";
import { permissionCode } from "../const.js";
import config from "@/settings.js";
import {
  api_changeProjectList,
  api_presssbtoDosth,
} from "@/api/projectChangeManagement";
import { getStatusListByRoleCode } from "../components/status";
import { api_getLibraryNumber } from "@/api/projectLibrary";
import upload from "@/utils/upload";
import { api_getChangeList } from "@/api/projectChangeManagement";

export default {
  provide() {
    return {
      baseUrl: config.baseUrl,
      imgBaseUrl: config.imgBaseUrl,
      uploadRequest: upload,
      uploadBaseUrl: config.uploadBaseUrl,
      uploadFileUrl: config.uploadFileUrl,
      previewUrl: config.previewUrl,
    };
  },
  components: {
    searchFrom,
  },
  props: {
    // 是否是项目变更审批
    ifHideAddBtn: {
      type: Boolean,
      default: false,
    },
    yearPlanId: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      isLoading: false,
      noData: false,
      dialogTableVisible: false,
      userInfo: store.getters.userInfo,
      tableList: {
        header: [],
      },
      header: [
        {
          label: "项目名称",
          prop: "projectName",
        },
        {
          label: "合同名称",
          prop: "projectName",
        },
      ],

      selectionConfig: {
        display: true,
        width: "46",
      },
      markVisible: true,
      dialogVisible: false,
      table1: {
        data: [],
        config: {
          rowClassName: this.rowClassName,
          title: "表格的标题", // 表格标题
          highlightCurrentRow: false, // 控制表格是否单选
          // maxLength: 20, // 一行最多显示多少字，超出显示popver
          tooltipEffect: "light",
          header: [
            {
              label: "项目名称",
              prop: "projectName",
            },
            {
              label: "合同名称",
              // prop: "systemName",
              prop: "contractName",
            },
          ],
          indexConfig: {
            display: false,
          },
          selectionConfig: {
            display: true,
            width: "40",
          },
        },
        page: {
          // 分页配置
          total: 0, //总条数
          pages: 0, //总页数
          pageSize: 10, //每页展示多少个
          pageSizes: [10, 15, 20],
          pageNum: 1, //当前页
          background: true,
          // layout: 'total, prev, pager, next, sizes,jumper'
        },
      },
      table: {
        data: [],
        config: {
          rowClassName: this.rowClassName,
          title: "表格的标题", // 表格标题
          highlightCurrentRow: false, // 控制表格是否单选
          maxHeight: 0,
          // maxLength: 20, // 一行最多显示多少字，超出显示popver
          load: this.load,
          tooltipEffect: "light",
          header: [],
          selectionConfig: {
            display: false,
            width: "70",
          },
          operateConfig: {
            display: true,
            label: "操作",
            width: "180",
            fixed: "right",
            allTableHeader: "",
            saveHeaderList: this.saveHeaderList,
            hideHeaderSetting: true,
          },
          innerBtn: [
            // 表格内部操作按钮，不需要操作列的innerBtn 写成false
            {
              name: "查看", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "see", // 点击执行该页面methods中对应的方法
              // field: "id", // 控制按钮显示隐藏的字段，目前仅支持单一字段，常显的按钮不需要传
              // value: [1, 2], // 需要根据字段控制按钮显示隐藏，当state值不等于该数组的任何一个值的时候显示。逻辑this.table.data的某条数据state!=1&&state!=2时显示该行的这个按钮
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
              validate: this.btnValidate,
            },
            {
              name: "编辑", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "editor", // 点击执行该页面methods中对应的方法
              // field: "id", // 控制按钮显示隐藏的字段，目前仅支持单一字段，常显的按钮不需要传
              // value: [1, 2], // 需要根据字段控制按钮显示隐藏，当state值不等于该数组的任何一个值的时候显示。逻辑this.table.data的某条数据state!=1&&state!=2时显示该行的这个按钮
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
              validate: this.btnValidate,
            },
            {
              name: "提交", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "submit",
              // method: "examine", // 点击执行该页面methods中对应的方法
              // field: "id", // 控制按钮显示隐藏的字段，目前仅支持单一字段，常显的按钮不需要传
              // value: [1, 2], // 需要根据字段控制按钮显示隐藏，当state值不等于该数组的任何一个值的时候显示。逻辑this.table.data的某条数据state!=1&&state!=2时显示该行的这个按钮
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
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
      search1: {
        // nosearch: true,
        size: "small",
        labelConfig: {
          labelWidth: "90px",
          labelSuffix: ":",
          labelPosition: "right",
        },
        config: [
          {
            type: "text",
            placeholder: "项目名称",
            bind: "projectName", // 对应this.search.data对象的field1
          },
        ],
        formData: {
          projectName: "", //项目名称
          orderByColumn: "", // 基于哪个字段排序
          orderBy: "", // DESC降序, ASC升序
        },
      },
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
            bind: "systemName",
            disabled: false,
            className: "inputStyle",
          },
          {
            type: "text",
            placeholder: "请输入项目名称",
            bind: "projectName",
            className: "inputStyle",
          },
          // {
          //   type: "text",
          //   placeholder: "请输入合同名称",
          //   bind: "contractName", // 对应this.search.data对象的field1
          //   disabled: false,
          //   className: "inputStyle",
          // },
          {
            type: "select",
            placeholder: "请输入当前状态",
            bind: "status",
            data: "statusList",
            className: "inputStyle",
            isHave: true,
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
        btns: [
          {
            name: "",
            // click: this.add,
            type: "primary",
            permissionCode: "M1_1865_102",
          },
        ],
        enum: {
          statusList: [], //状态
          customerManager: [], //发起人
        },
        formData: {
          systemName: "",
          projectName: "",
          contractName: "",
          yearPlanName: "",
          status: null,
          tjPerson: "",
        },
      },
      params: {
        ids: "",
        keyWords: "",
        // isSubproject: 0,
        status: 1000,
        activationStatus: 1,
        isArchive: 0,
      },

      pilIds: [],
      projectDetails: [], //选中数据
    };
  },
  watch: {
    // $route
    "search.formData.status": {
      handler(v) {
        this.queryTableData();
      },
    },
  },
  created() {
    if (
      Object.keys(this.$store.state.sotreQueryParams.auditQuery).length === 0
    ) {
      this.queryParams = {
        pageNum: this.table.page.pageNum,
        pageSize: this.table.page.pageSize,
        ...this.search.formData,
      };
    } else {
      this.queryParams = JSON.parse(
        JSON.stringify(this.$store.state.sotreQueryParams.auditQuery)
      );
    }

    if (this.userInfo.currentRole.roleCode == "CJDW_XMJL") {
      this.getTableData();
    }
    this.getHeaderOptions();
    this.queryTableData();
    this.getStatusList();
    this.query_list();
  },
  mounted() {
    this.calculateTableHeight();
  },
  methods: {
    calculateTableHeight() {
      // 调用工具函数并传入元素的 ref
      this.$set(
        this.table.config,
        "maxHeight",
        getCommonTableHeight(this.$refs.searchRef)
      );
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
    clearFunc(type) {
      sessionStorage.removeItem("searchData");
      switch (type) {
        case "systemName":
          this.search.formData.systemName = "";
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
    // 获取变更弹窗数据
    getStatusList() {
      let list = getStatusListByRoleCode(this.userInfo.currentRole.roleCode);
      list.map((item) => {
        this.search.enum.statusList.push({
          label: String(item.label),
          value: String(item.value),
        });
      });
      // this.search.enum.statusList = list;
    },
    // 新增弹窗打开关闭
    dailogClose() {
      this.$set(this.params, "keyWords", "");
    },
    dailogRefresh() {
      this.$set(this.params, "keyWords", "");
      setTimeout(() => {
        this.$refs.SrDialogSelect.queryList();
      }, 100);
    },
    add() {
      // this.$refs.SrDialogSelect.dialogVisible = true;
      // this.$refs.SrDialogSelect.refresh();
      this.pageChanged(1);
      this.dialogTableVisible = true;
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
      this.queryTableData();
      this.getTableData();
    },
    // 获取表头设置
    getHeaderOptions() {
      api_userSetQuery({ permissionCode: permissionCode }).then((res) => {
        this.isTableHeaderId = res.data.id;
        let headerData = JSON.parse(res.data.data).sort(
          (a, b) => a.index - b.index
        );
        this.table.config.operateConfig.allTableHeader = headerData;
        this.table.config.header = headerData.filter((item) => {
          return item.isShow;
        });
      });
    },
    btnValidate(row, item) {
      if (row.name == "提交") {
        if (
          [202, 302, , 307, 411].includes(item.status) &&
          this.userInfo.currentRole.roleCode == "CJDW_XMJL"
        ) {
          return true;
        } else {
          return false;
        }
      }
      if (row.name == "查看") {
        return true;
      }
      // 承建单位项目经理进行暂存操作后，可再次进行编辑，点击“编辑”页面，跳转进入编辑页面，对申请信息进行编辑修改，可修改信息：发起时间、项目变更报审表、变更方案；
      if (row.name == "编辑") {
        if (
          [1].includes(item.status) &&
          this.userInfo.currentRole.roleCode == "CJDW_XMJL"
        ) {
          return true;
        } else {
          return false;
        }
      }
      if (row.name == "催办") {
        if (
          [2].includes(item.status) &&
          this.userInfo.currentRole.roleCode == "CJDW_XMJL"
        ) {
          return true;
        } else {
          return false;
        }
      }
      // 审批
      if (row.name == "审批") {
        if (
          // [1].includes(item.status) &&
          this.userInfo.currentRole.roleCode == "XMFZR"
        ) {
          return true;
        } else {
          return false;
        }
      }
      return false;
    },
    eventNotify(ref) {
      this.$refs[ref].init();
    },
    //页数发生改变
    handlePageChange(val) {
      sessionStorage.removeItem("searchData");
      this.table.page.pageNum = val;
      this.queryTableData();
    },
    handleSizeChange(val) {
      sessionStorage.removeItem("searchData");
      this.table.page.pageNum = 1;
      this.table.page.pageSize = val;
      this.queryTableData();
    },
    pageChanged(val) {
      this.table1.page.pageNum = val;
      this.getTableData();
    },
    sizeChanged(val) {
      this.table1.page.pageNum = val;
      this.table1.page.pageSize = val;
      this.getTableData();
    },
    getTableData() {
      let param = {
        pageNum: this.table1.page.pageNum,
        pageSize: this.table1.page.pageSize,
        ...this.search1.formData,
      };
      api_getChangeList(param).then((res) => {
        if (res.msg.code == "0000") {
          this.table1.page.pages = res.data.pages;
          this.table1.page.total = res.data.total;
          this.table1.data = res.data.records;
        }
      });
    },
    // 获取表格数据
    queryTableData() {
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
        if (JSON.parse(sessionStorage.getItem("searchData")).tjPerson !== "") {
          this.search.formData.tjPerson = JSON.parse(
            sessionStorage.getItem("searchData")
          ).tjPerson;
        }
        if (JSON.parse(sessionStorage.getItem("searchData")).status !== null) {
          this.search.formData.status = JSON.parse(
            sessionStorage.getItem("searchData")
          ).status;
        }
        if (JSON.parse(sessionStorage.getItem("searchData")).pageNum !== "") {
          this.table.page.pageNum = JSON.parse(
            sessionStorage.getItem("searchData")
          ).pageNum;
        }
      }
      this.table.data = [];
      if (sessionStorage.getItem("searchData") !== null) {
        // if(JSON.parse(sessionStorage.getItem("searchData")).systemName !== ""){
        //   alert('1')
        this.search.formData.systemName = JSON.parse(
          sessionStorage.getItem("searchData")
        ).systemName;
        // }else if (JSON.parse(sessionStorage.getItem("searchData")).projectName !== "") {
        //   alert('2')
        this.search.formData.projectName = JSON.parse(
          sessionStorage.getItem("searchData")
        ).projectName;
        // }else if (JSON.parse(sessionStorage.getItem("searchData")).status !== null) {
        //   alert('3')
        this.search.formData.status = JSON.parse(
          sessionStorage.getItem("searchData")
        ).status;

        // }else if (JSON.parse(sessionStorage.getItem("searchData")).tjPerson !== null) {
        this.search.formData.tjPerson = JSON.parse(
          sessionStorage.getItem("searchData")
        ).tjPerson;
        // }else {
        // }
        // this.search.formData=JSON.parse(sessionStorage.getItem("searchData"));

        this.table.page.pageNum = JSON.parse(
          sessionStorage.getItem("searchData")
        ).pageNum;
      }
      let param = {
        pageNum: this.table.page.pageNum,
        pageSize: this.table.page.pageSize,
        ...this.search.formData,
      };

      api_changeProjectList(param)
        .then((res) => {
          let { roleCode } = this.userInfo.currentRole;
          let { jfid } = this.userInfo;
          if (res.data?.records) {
            this.isLoading = false;
            this.table.page.pageNum = res.data.current;
            this.table.page.pageSize = res.data.size;
            this.table.page.total = res.data.total;
            sessionStorage.removeItem("searchData");

            res.data.records.forEach((item) => {
              if (item.todo) {
                item.operationBtns = [];
                //按钮筛选  以assignee优先roleCode
                if (item.assignee == jfid) {
                  item.description &&
                    JSON.parse(item.description).map((item1) => {
                      if (item1.operationBtns[0].btnName == "评审小组审核") {
                        if (item.isShow) {
                          item1.operationBtns &&
                            item.operationBtns.push(item1.operationBtns[0]);
                        }
                      }
                    });
                  item.path = this.workView;
                } else {
                  item.description &&
                    JSON.parse(item.description).map((item1) => {
                      if (roleCode == item1.role) {
                        if (item1.operationBtns[0].btnName == "评审小组审核") {
                          if (item.isShow || item.isShow == null) {
                            item1.operationBtns &&
                              item.operationBtns.push(item1.operationBtns[0]);
                          } else {
                            item.operationBtns = [];
                          }
                        } else {
                          item1.operationBtns &&
                            item.operationBtns.push(item1.operationBtns[0]);
                        }
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
            this.table.data = [];
          }
          this.table.data.sort((a, b) => {
            if (a.todo && !b.todo) {
              return -1;
            }
            if (!a.todo && b.todo) {
              return 1;
            }
            return 0;
          });
        })
        .catch(() => {
          this.isLoading = false;
          this.noData = true;
        });
    },
    resetForm() {
      this.search.formData.status = "";
      this.search.formData.tjPerson = "";
      this.search.formData.projectName = "";
      this.search.formData.systemName = "";

      this.table.page.pageNum = 1;
      this.table.page.pageSize = 10;
      sessionStorage.removeItem("searchData");
      this.queryTableData();
    },
    searchFn() {
      this.table.page.pageNum = 1;
      this.queryTableData();
    },
    query_list() {
      let param1 = {
        pageNum: 1,
        pageSize: 9999,
      };
      api_changeProjectList(param1).then((res1) => {
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
    saveHeaderList(data) {
      api_userSetSave({
        data: JSON.parse(data),
        permissionCode: permissionCode,
        id: this.isTableHeaderId,
      }).then((res) => {
        if (res.msg.code == "0000") {
          this.queryTableData();
          this.getHeaderOptions();
          this.getTableData();
        }
      });
    },
    workView(row) {
      if (this.table.page.pageNum !== 1) {
        const { systemName, projectName, tjPerson, status } =
          this.search.formData;
        if (
          systemName == "" &&
          projectName == "" &&
          tjPerson == "" &&
          status == null
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
        const { systemName, projectName, tjPerson, status } =
          this.search.formData;
        if (
          systemName !== "" ||
          projectName !== "" ||
          tjPerson !== "" ||
          status !== null
        ) {
          sessionStorage.setItem(
            "searchData",
            JSON.stringify({ ...this.search.formData, pageNum: 1 })
          );
        }
      }
      this.$router.push({
        name: "projectChangeManagementworkView",
        query: {
          id: row.id,
          processId: row.processId,
          status: row.status || "",
          contractId: row.contractId,
          changeId: row.changeId,
          type: 1,
        },
      });
    },
    submit(row) {
      if (this.table.page.pageNum !== 1) {
        const { systemName, projectName, tjPerson, status } =
          this.search.formData;
        if (
          systemName == "" &&
          projectName == "" &&
          tjPerson == "" &&
          status == null
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
        const { systemName, projectName, tjPerson, status } =
          this.search.formData;
        if (
          systemName !== "" ||
          projectName !== "" ||
          tjPerson !== "" ||
          status !== null
        ) {
          sessionStorage.setItem(
            "searchData",
            JSON.stringify({ ...this.search.formData, pageNum: 1 })
          );
        }
      }
      this.$router.push({
        name: "projectChangeManagementEdit",
        query: {
          id: row.projectId,
          projectId: row.projectId,
          processId: row.processId || "",
          status: row.status || "",
          fullname: this.userInfo.fullname,
          changeId: row.changeId,
          contractId: row.contractId,
          type: 1,
        },
      });
    },
    // 审批
    examine(row) {
      if (this.table.page.pageNum !== 1) {
        const { systemName, projectName, tjPerson, status } =
          this.search.formData;
        if (
          systemName == "" &&
          projectName == "" &&
          tjPerson == "" &&
          status == null
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
        const { systemName, projectName, tjPerson, status } =
          this.search.formData;
        if (
          systemName !== "" ||
          projectName !== "" ||
          tjPerson !== "" ||
          status !== null
        ) {
          sessionStorage.setItem(
            "searchData",
            JSON.stringify({ ...this.search.formData, pageNum: 1 })
          );
        }
      }
      this.$router.push({
        name: "projectChangeManagementworkView",
        query: {
          id: row.projectId,
          processId: row.processId,
          templateId: row.templateId,
          projectInitalId: row.projectInitalId || "",
          status: row.status || "",
          contractId: row.contractId,
        },
      });
    },
    // 查看
    see(row) {
      if (this.table.page.pageNum !== 1) {
        const { systemName, projectName, tjPerson, status } =
          this.search.formData;
        if (
          systemName == "" &&
          projectName == "" &&
          tjPerson == "" &&
          status == null
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
        const { systemName, projectName, tjPerson, status } =
          this.search.formData;
        if (
          systemName !== "" ||
          projectName !== "" ||
          tjPerson !== "" ||
          status !== null
        ) {
          sessionStorage.setItem(
            "searchData",
            JSON.stringify({ ...this.search.formData, pageNum: 1 })
          );
        }
      }
      let param = {
        pageNum: this.table.page.pageNum,
        pageSize: this.table.page.pageSize,
        ...this.search.formData,
      };

      sessionStorage.setItem(
        "searchData",
        JSON.stringify({
          pageNum: this.table.page.pageNum,
          pageSize: this.table.page.pageSize,
          ...this.search.formData,
        })
      );
      this.$router.push({
        name: "projectChangeManagementView",
        query: {
          id: row.projectId,
          projectId: row.projectId || "",
          processId: row.processId || "",
          status: row.status || "",
          changeId: row.changeId || "",
          contractId: row.contractId,
          type: 1,
        },
      });
    },
    press(row) {
      let params = {
        workflowId: row.workflowId,
        status: row.status,
      };
      api_presssbtoDosth(params).then((res) => {});
    },
    editor(row) {
      if (this.table.page.pageNum !== 1) {
        const { systemName, projectName, tjPerson, status } =
          this.search.formData;
        if (
          systemName == "" &&
          projectName == "" &&
          tjPerson == "" &&
          status == null
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
        const { systemName, projectName, tjPerson, status } =
          this.search.formData;
        if (
          systemName !== "" ||
          projectName !== "" ||
          tjPerson !== "" ||
          status !== null
        ) {
          sessionStorage.setItem(
            "searchData",
            JSON.stringify({ ...this.search.formData, pageNum: 1 })
          );
        }
      }
      this.$router.push({
        name: "projectChangeManagementEdit",
        query: {
          id: row.projectId,
          projectId: row.projectId,
          processId: row.processId || "",
          status: row.status || "",

          fullname: this.userInfo.fullname,
          changeId: row.changeId,
          contractId: row.contractId,
          type: 1,
        },
      });
    },
    rowClick(row) {},
    // 选择变更
    selected(projectList) {
      this.pilIds = [];
      projectList.map((item) => {
        this.pilIds.push(item.projectId);
        this.projectDetails.push(item);
      });
    },
    IdentifyChanges(row) {
      if (this.pilIds.length == 0) {
        this.$message({
          message: "请选择要变更的项目",
          type: "info",
          duration: 1500, // 显示时间，单位为毫秒
          showConfirmButton: true, // 显示确认按钮
        });
        // this.$message.info("请选择要变更的项目");
      } else if (this.pilIds.length > 1) {
        this.$message({
          message: "同时只能变更一个项目",
          type: "info",
          duration: 1500, // 显示时间，单位为毫秒
          showConfirmButton: true, // 显示确认按钮
        });
        // this.$message.info("同时只能变更一个项目");
      } else {
        this.$confirm("是否确定要变更此项目", "提示", {
          iconClass: "el-icon-question", //自定义图标样式
          confirmButtonText: "确认", //确认按钮文字更换
          cancelButtonText: "取消", //取消按钮文字更换
          showClose: true, //是否显示右上角关闭按钮
          type: "info", //提示类型  success/info/warning/error
        }).then((res) => {
          this.dialogTableVisible = false;
          this.$router.push({
            name: "projectChangeApplication",
            query: {
              id: this.pilIds[0],
              fullname: this.userInfo.fullname,
              // contractName:this.projectDetails[0].contractName,
              contractId: this.projectDetails[0].contractId,
              type: 0,
            },
          });
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
[v-clock] {
  display: none;
}
.common-card {
  height: 100%;
}
.SrDialogSelect {
  ::v-deep .el-input {
    display: none;
  }
}
.sr_table {
  height: 95%;
}
::v-deep .sr_table th {
  line-height: 48px;
  height: 48px;
  > .cell {
    line-height: 24px !important;
  }
}

::v-deep .sr_table td {
  line-height: 80px;
  height: 80px;
  > .cell {
    line-height: 24px !important;
  }
}
.SrDialogSelect {
  ::v-deep .el-input {
    display: none;
  }
}
// .searchPage {
//   ::v-deep .getyearclass {
//     width: 240px !important;
//   }
//   ::v-deep .selectWidthCustom {
//     width: 153px !important;
//   }
// }
.searchRightBtn {
  display: inline-block;
  button {
    width: 76px;
    height: 32px;
    border-radius: 16px;
    padding: 5px 24px;
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
::v-deep .sr-dialog-select {
  display: none;
}
// ::v-deep .el-dialog {
//   // width: 30%;
//   height: 500px !important;
// }

.common-card {
  // height: 90%;

  // overflow-y: auto;
}
// 滚动条
.common-card::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 0px;
}
.common-card::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 5px;
  // -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #fff;
}
.common-card::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  // -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background: #ffffff;
}

.searchPage {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.circle-btn {
  border-radius: 50% !important;
}

::v-deep .sr_table th {
  line-height: 20px !important;
  height: 20px !important;
  > .cell {
    line-height: 20px !important;
    button {
      top: -5px !important;
    }
  }
}

::v-deep .el-dialog .sr_table td {
  line-height: 25px;
  height: 25px;
  > .cell {
    line-height: 20px !important;
  }
}

.text-ellipsis {
  // width: 200px; /* 定义容器宽度 */
  white-space: nowrap;
  /* 确保文本不换行 */
  overflow: hidden;
  /* 隐藏超出容器的内容 */
  text-overflow: ellipsis;
  /* 使用省略号表示被截断的文本 */
}
</style>
