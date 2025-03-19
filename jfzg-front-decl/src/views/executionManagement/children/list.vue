<template>
  <div class="common-card">
    <div class="searchPage" ref="searchRef">
      <SrSearch
        :search="search"
        :searchExpand="true"
        :showTextBtns="true"
        :hideBtns="false"
        @queryList="pageChanged(1)"
      >
      </SrSearch>
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
      ref="multipleTable"
      :extra-tooltip-labels="['项目编码', '需求部门']"
    >
      <!-- 系统名称 systemName -->
      <template slot="systemName" slot-scope="{ scope }">
        <div v-if="scope.item.prop == 'systemName'">
          <div
            class="systemNameContract"
            v-if="
              scope.row.contractVos &&
              scope.row.contractVos.length >= 1 &&
              scope.row.sectionCount != 1
            "
          >
            <!-- + - 按钮 -->
            <div class="addClick" @click="clickVos(scope.row)">
              <i
                style="font-weight: bolder"
                :class="
                  scope.row.moreVos == 1 ||
                  !rProject.includes(scope.row.projectId)
                    ? 'el-icon-plus'
                    : 'el-icon-minus'
                "
              >
              </i>
            </div>
            <div class="text-ellipsis">{{ scope.row.systemName }}</div>
          </div>

          <div v-else :class="scope.row.sectionCount ? 'section' : ''">
            <span
              v-if="
                scope.row.sectionCount !== null && scope.row.sectionCount !== 1
              "
            >
              <span class="count"> 标段{{ scope.row.sectionSort }} </span>
            </span>

            <span>
              <span v-if="scope.row.sectionSort"></span>
              <span v-else>
                <div class="text-ellipsis">
                  {{ scope.row.systemName }}
                </div>
              </span>
            </span>
          </div>
        </div>
      </template>

      <!-- 合同名称 contractName -->
      <template slot="contractName" slot-scope="scope">
        <div
          class="table_unitName"
          v-if="
            scope.scope.row.contractName &&
            scope.scope.row.contractName != '' &&
            scope.scope.row.contractName != null
          "
        >
          {{ scope.scope.row.contractName }}
        </div>

        <div v-else>/</div>
      </template>

      <!-- 进度 constructionProgress -->
      <template slot="constructionProgress" slot-scope="scope">
        <div style="display: flex">
          {{ scope.scope.row.constructionProgress }}
          <div v-if="scope.scope.row.constructionProgress == null">-</div>
          <div v-else>
            <div
              v-if="
                scope.scope.row.constructionProgress == null ||
                scope.scope.row.constructionProgress == undefined ||
                scope.scope.row.constructionProgress == '' ||
                scope.scope.row.constructionProgress == '-'
              "
            ></div>
            <div v-else>%</div>
          </div>
        </div>
      </template>
      <!-- 开始时间 -->
      <template slot="projectByCreateTime" slot-scope="{ scope }">
        <div v-if="scope.item.prop == 'projectByCreateTime'">
          <!-- {{ scope.row.projectByCreateTime }} -->
          <div
            v-if="
              scope.row.contractVos &&
              scope.row.contractVos.length >= 1 &&
              scope.row.sectionCount != 1
            "
          >
            {{
              scope.row.projectByCreateTime == null
                ? "-"
                : scope.row.projectByCreateTime
            }}
          </div>
          <div v-else>
            {{
              scope.row.projectByCreateTime == null
                ? "-"
                : scope.row.projectByCreateTime
            }}
          </div>
        </div>
      </template>
      <!-- 结束时间 projectEndTime -->
      <template slot="projectEndTime" slot-scope="{ scope }">
        <div v-if="scope.item.prop == 'projectEndTime'">
          <div
            v-if="
              scope.row.contractVos &&
              scope.row.contractVos.length >= 1 &&
              scope.row.sectionCount != 1
            "
          >
            {{
              scope.row.projectEndTime == null ? "-" : scope.row.projectEndTime
            }}
          </div>
          <div v-else>
            {{
              scope.row.projectEndTime == null ? "-" : scope.row.projectEndTime
            }}
          </div>
        </div>
      </template>
      <!-- 任务逾期进行中 -->
      <template slot="subTaskYQCount" slot-scope="{ scope }">
        <div v-if="scope.item.prop == 'subTaskYQCount'">
          <div
            v-if="
              scope.row.contractVos &&
              scope.row.contractVos.length >= 1 &&
              scope.row.sectionCount != 1
            "
          >
            /
            <!-- {{
              scope.row.subTaskYQCount == null ? "-" : scope.row.subTaskYQCount
            }} -->
          </div>
          <div v-else>
            {{
              scope.row.subTaskYQCount == null ? "-" : scope.row.subTaskYQCount
            }}
          </div>
        </div>
      </template>

      <!-- 状态 -->
      <template slot="statusName" slot-scope="{ scope }">
        <div v-if="scope.item.prop == 'statusName'">
          <div
            v-if="
              scope.row.contractVos &&
              scope.row.contractVos.length >= 1 &&
              scope.row.sectionCount != 1
            "
          >
            -
          </div>
          <div v-else>
            <div v-if="scope.row.statusName == ''">
              {{ scope.row.statusName == "" ? "未提交" : scope.row.statusName }}
            </div>
            <div v-else>
              {{
                scope.row.statusName == null ? "未提交" : scope.row.statusName
              }}
            </div>
          </div>
        </div>
      </template>
      <!-- 发起人 contractorFqrName -->
      <template slot="contractorFqrName" slot-scope="{ scope }">
        <div v-if="scope.item.prop == 'contractorFqrName'">
          <div
            v-if="
              scope.row.contractVos &&
              scope.row.contractVos.length >= 1 &&
              scope.row.sectionCount != 1
            "
          >
            -
          </div>

          <div v-else>
            {{
              scope.row.contractorFqrName == null
                ? "-"
                : scope.row.contractorFqrName
            }}
          </div>
        </div>
      </template>

      <template slot="cellSlot" slot-scope="{ scope }">
        <div v-if="scope.item.prop == 'status'">
          {{ returnStatusNameByValue(scope.row.status) }}
        </div>
      </template>
    </SrTable>
    <!-- 填报进度弹框 -->
    <el-dialog
      title="填报进度"
      :visible.sync="centerDialogVisible"
      width="650px"
      @closed="closed"
    >
      <span>
        <SrAdd
          class="sradd"
          :config="form.config"
          :enums="form.enums"
          :form="form.data"
          :otherConfig="form.otherConfig"
          ref="add1"
        >
          <template slot="jianshejindu">
            <div class="jianshejindu" style="display: flex">
              <el-input
                v-model="form.data.constructionProgress"
                placeholder="请输入"
                @input="numValid(form.data.constructionProgress)"
              ></el-input>
              <span>%</span>
            </div>
          </template>
        </SrAdd>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" round type="primary" @click="savezhixing"
          >保 存</el-button
        >
        <el-button
          plain
          size="medium"
          round
          @click="centerDialogVisible = false"
          >取 消</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="导入"
      :visible.sync="importDiaVis"
      width="650px"
      center
      :before-close="handleDialogClose"
    >
      <!-- <span> 导入正在开发中。。。。 </span> -->
      <el-upload
        class="upload-demo"
        action="string"
        ref="elUpload"
        :http-request="uploadFile"
        :show-file-list="true"
        :before-upload="beforeAvatarUpload"
      >
        <div style="display: flex; align-items: center">
          <div style="font-size: 18px">文件导入:</div>
          <div class="button">点击上传</div>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer-imp">
        <el-button @click="cancelImport">取 消</el-button>
        <el-button type="primary" @click="upRefalsh">下一步</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import store from "@/store";
import { getCommonTableHeight } from "@/utils/tableHeightUtils.js";
import {
  queryExecutionLists,
  updateConstruction,
  // 导出阶段接口
  exportGanttApi,
  // 导入阶段接口
  importManagementApi,
  executionManagementDetail,
  api_startStageUrlOfPost,
  api_approveOfPost,
} from "@/api/executionManagement";
import { api_userSetQuery, api_userSetSave } from "@/api/index.js";
import { returnStatusNameByValue } from "../components/status";
import { getStatusListByRoleCode } from "../components/status";

export default {
  data() {
    return {
      // 用于记录哪些行的内容被展开

      isLoading: false,
      noData: false,
      returnStatusNameByValue,
      ApprovalAuthorityShow: false,
      centerDialogVisible: false,
      theNew: "",
      userInfo: store.getters.userInfo,
      executionDetail: null,
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
            placeholder: "系统名称",
            bind: "systemName", // 对应this.search.data对象的field1
          },
          {
            type: "text",
            placeholder: "项目名称",
            bind: "projectName", // 对应this.search.data对象的field1
          },
          {
            type: "select",
            placeholder: "发起人",
            bind: "contractor",
            data: "customerManager",
            className: "inputStyle",
            isHave: true,
          },
        ],
        enum: {
          // 搜索项下拉数据
          projectList: [],
          jsdwList: [],
          statusList: [
            {
              value: 1,
              label: "未提交",
            },
            {
              value: 3,
              label: "已提交",
            },
            {
              value: 2,
              label: "监理工程师-待审核",
            },
            {
              value: 202,
              label: "监理工程师-退回修改",
            },
            {
              value: 203,
              label: "监理工程师-不通过",
            },
            {
              value: 204,
              label: "监理工程师-通过",
            },
            {
              value: 301,
              label: "项目负责人-待审核",
            },
            {
              value: 302,
              label: "项目负责人-退回修改",
            },
            {
              value: 303,
              label: "项目负责人-不通过",
            },
            {
              value: 1000,
              label: "通过",
            },
          ],

          customerManager: [],
        },
        btns: [
          // {
          //   name: "计划审批",
          //   click: this.examinationAndapproval,
          //   type: "default",
          //   permissionCode: "M0713_M002_001",
          // },
          {
            name: "导入",
            click: this.improtByCondition,
            type: "default",
            permissionCode: "M0713_M002_002",
          },
          {
            name: "导出",
            click: this.exprotByCondition,
            type: "default",
            permissionCode: "M0713_M002_003",
          },
        ],
        formData: {
          projectName: "",
          systemName: "",
          status: "", //状态
          contractor: "", //发起人
          orderByColumn: "", // 基于哪个字段排序
          orderBy: "", // DESC降序, ASC升序
        },
      },
      table: {
        data: [], // 表格数据
        tableConfig: {
          rowClassName: this.rowClassName,
          title: "表格的标题", // 表格标题
          highlightCurrentRow: false, // 控制表格是否单选
          maxHeight: 0, // 一行最多显示多少字，超出显示popver
          load: this.load,
          tooltipEffect: "light",
          header: [],
          cellClassName: this.cellClassNameFn,
          selectionConfig: {
            display: true, //display: true,
            width: "40",
            selectable: this.selectable,
          },
          operateConfig: {
            display: true,
            label: "操作",
            width: "200",
            fixed: "right",
            allTableHeader: "",
            saveHeaderList: this.saveHeaderList,
            // hideHeaderSetting: true,
          },

          innerBtn: [
            {
              name: "进度",
              method: "zxjd",
              type: "text",
              size: "small",
              field: "status",
              value: ["4"],
              icon: "el-icon-document",
              // code: "M005_003_002_004", // 按钮的唯一值,用于角色按钮权限控制，不传默认不进行权限控制
              className: "font-size-20",
              validate: this.btnValidate,
            },
            {
              name: "查看",
              method: "zxck",
              type: "text",
              size: "small",
              field: "status",
              value: ["4"],
              icon: "el-icon-document",
              // code: "M005_003_002_004", // 按钮的唯一值,用于角色按钮权限控制，不传默认不进行权限控制
              className: "font-size-20",
              validate: this.btnValidate,
            },
            {
              name: "编辑任务",
              method: "zxjdu",
              type: "text",
              size: "small",
              field: "status",
              value: ["4"],
              icon: "el-icon-document",
              // code: "M005_003_002_004", // 按钮的唯一值,用于角色按钮权限控制，不传默认不进行权限控制
              className: "font-size-20",
              validate: this.btnValidate,
            },
            {
              name: "处理",
              method: "goToExamin",
              type: "text",
              size: "medium",
              icon: "el-icon-document",
              className: "font-size-20",
              validate: this.btnValidate, //自定义判断是否展示按钮权限
            },
            // {
            //   name: "查看审批",
            //   method: "lookExamin",
            //   type: "text",
            //   size: "small",
            //   field: "status",
            //   value: ["4"],
            //   icon: "el-icon-document",
            //   // code: "M005_003_002_004", // 按钮的唯一值,用于角色按钮权限控制，不传默认不进行权限控制
            //   className: "font-size-20",
            //   validate: this.btnValidate,
            // },
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
      isTableHeaderId: null,
      form: {
        otherConfig: {
          labelNum: 190,
        },
        config: [
          {
            type: "slot",
            slotName: "jianshejindu",
            name: "建设进度",
            // placeholder: "请输入",
            bind: "constructionProgress",
            trigger: "blur",
            rules: {
              regular_Number3: "请输入0-100的数字",
            },
            required: "建设进度不能为空",
            maxLength: 16,
            class: "gg",
            col: 16,
          },
        ],
        data: {
          constructionProgress: "",
        },
        enums: {},
      },
      testRowId: null,
      conID: null,
      testsectionCount: null,
      testsectionSort: null,
      testisSection: null,
      ganttEndTime: null,
      ganttStartTime: null,
      testprocessId: null,
      testStatus: null,
      projectExecutionId: null,
      importDiaVis: false,
      pilIds: [],
      selectData: [],
      projectDetails: [], //选中数据
      contractIDs: null,
      sectionCount: null,
      formData: null,
      selectedRows: [],
      currentRow: null,
      // 展开多标段projecID
      rProject: [],
      // 系统名称
      systemName: null,
      // 项目名称
      projectName: null,
      // 合同名称
      contractName: null,
    };
  },
  created() {
    this.init();
    this.getStatusList();
  },
  watch: {
    // 监听表格数据变化，重新检查内容是否超出
  },
  mounted() {
    this.$nextTick(() => {
      // 假设表格数据已经加载完成
      this.table.data.forEach((row) => {
        this.checkContentOverflow(row, "projectName");
      });
    });

    this.query_List();
    this.calculateTableHeight();
  },
  methods: {
    // 检查内容是否超出 80% 宽度

    calculateTableHeight() {
      // 调用工具函数并传入元素的 ref
      this.$set(
        this.table.tableConfig,
        "maxHeight",
        getCommonTableHeight(this.$refs.searchRef)
      );
    },
    init() {
      this.getTbHeader();
      this.getTbData();
      this.btnValidate1();
    },
    getStatusList() {
      let list = getStatusListByRoleCode(this.userInfo.currentRole.roleCode);
      this.search.enum.statusList = list;
    },
    examinationShow() {
      if (
        this.userInfo.currentRole.roleCode == "CJDW_XMJL" ||
        this.userInfo.currentRole.roleCode == "JLGCS"
      ) {
        return (this.ApprovalAuthorityShow = true);
      } else {
        return (this.ApprovalAuthorityShow = false);
      }
    },
    getTbData() {
      this.isLoading = true;
      this.noData = false;
      // 返回
      let param = {
        pageNo: this.table.page.pageNum,
        pageSize: this.table.page.pageSize,
        projectId: this.$route.query.projectId,
        projectName: this.search.formData.projectName,
        systemName: this.search.formData.systemName,
        status: this.search.formData.status,
        contractorName: this.search.formData.contractor || "",
        orderByColumn: this.search.formData.orderByColumn,
        orderBy: this.search.formData.orderBy,
      };
      queryExecutionLists(param)
        .then((res) => {
          let { roleCode } = this.userInfo.currentRole;
          let { jfid } = this.userInfo;
          // if (!res?.data?.records) return;
          if (res.data.records.length > 0) {
            this.isLoading = false;
            this.table.page.pages = res.data.pages;
            this.table.page.total = res.data.total;
            res.data.records.forEach((item) => {
              if (item.todo) {
                item.operationBtns = [];
                //按钮筛选  以assignee优先roleCode
                if (item.assignee == jfid) {
                  item.description &&
                    JSON.parse(item.description).map((item1) => {
                      if (item1.operationBtns[0].btnName == "处理") {
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
                      if (roleCode == item1.role) {
                      }
                    });
                }
                item.path = this.workView;
              }
              if (
                item.operationBtns &&
                (item.status == 202 || item.status == 302)
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
            this.table.data.forEach((item) => {
              // 如果有多标段
              // if (item.contractVos && item.contractVos.length > 1) {

              if (item.sectionCount != 1) {
                // &&item.sectionCount==1
                item.moreVos = 1;
                // item.projectByCreateTime = "/";
                // item.projectEndTime = "/";
              }
              // 若是只有单个标段的合同名称
              if (
                item.contractVos &&
                item.contractVos.length == 1 &&
                item.sectionCount == 1
              ) {
                item.contractName = item.contractVos[0].contractName; //名称
                item.contractId = item.contractVos[0].contractId; //合同id
                item.statusName = item.statusName; //状态
                item.status = item.status;
                item.contractorFqrName = item.contractorFqrName;
                item.constructionProgress = item.constructionProgress; //进度
                item.projectEndTime =
                  item.projectEndTime != null ? item.projectEndTime : "-";
                item.projectByCreateTime =
                  item.projectByCreateTime != null
                    ? item.projectByCreateTime
                    : "-";
                item.projectExecutionId =
                  item.projectExecutionId != null
                    ? item.projectExecutionId
                    : "-";
                item.subTaskYQCount = item.subTaskYQCount;
              }

              if (item.contractVos.length == 0) {
                item.projectByCreateTime = item.projectByCreateTime
                  ? item.projectByCreateTime
                  : "-";
                item.projectEndTime = item.projectEndTime
                  ? item.projectEndTime
                  : "-";
              }
            });
          } else {
            this.isLoading = false;
            this.noData = true;
            this.table.data = [];
            this.table.page.pages = res.data.pages;
            this.table.page.total = res.data.total;
          }
        })
        .catch(() => {
          this.isLoading = false;
          this.noData = true;
        });
    },

    query_List() {
      let param1 = {
        pageNo: this.table.page.pageNum,
        pageSize: 9999,
      };
      queryExecutionLists(param1).then((res1) => {
        let initTjPerson = new Set(
          res1.data.records.map((item) => {
            return item.contractorFqrName;
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
    saveHeaderList(data) {
      api_userSetSave({
        data: JSON.stringify(data),
        permissionCode: "M005_012",
        id: this.isTableHeaderId,
      }).then((res) => {
        if (res.msg.code == "0000") {
          this.getTbHeader();
          this.getTbData();
        }
      });
    },
    getTbHeader() {
      api_userSetQuery({ permissionCode: "M005_012" }).then((res) => {
        this.isTableHeaderId = res.data.id;
        let headerData = JSON.parse(res.data.data).sort(
          (a, b) => a.index - b.index
        );

        this.table.tableConfig.operateConfig.allTableHeader = headerData;
        this.table.tableConfig.header = headerData.filter((item) => {
          if (item.prop == "num") {
            item.width = "80px";
          }
          if (item.prop == "beginDate") {
            item.sortable = "custom";
            // 上下翻转箭头
            item.width = "110px";
          }
          if (item.prop == "totalInvestmentAmount") {
            item.sortable = "custom";
            item.width = "160px";
          }
          return item.isShow;
        });
      });
    },
    btnValidate1(row, item) {
      if (this.userInfo.currentRole.roleCode == "XMFZR") {
        return false;
      } else {
        return true;
      }
    },
    btnValidate(row, item) {
      // 1-- "未提交" 2=="待审核"
      // 202=="监理工程师-退回修改"
      // 203=="监理工程师-不通过"
      // 204=="监理工程师-通过"
      // 301=="项目负责人-待审核"
      // 302=="项目负责人-退回修改"
      // 303=="项目负责人-不通过"
      // 401=="同意开工-待审核"
      // 402=="同意开工-退回修改"
      // 403=="同意开工-不通过"
      // 1000=="通过"
      if (row.name == "处理") {
        if (
          (item.status == 2 && this.userInfo.currentRole.roleCode == "JLGCS") ||
          item.status == 204 ||
          (item.status == 301 && this.userInfo.currentRole.roleCode == "XMFZR")
        ) {
          // return true;

          if (item.contractVos.length >= 1 && item.sectionCount != 1) {
            return false;
          } else {
            return false;
          }
        } else {
          // return false;
        }
        if (
          item.contractVos.forEach((it) => {
            it.status == 2 || item.status == 301 || item.status == 204;
          })
        ) {
          return true;
        }
      }
      if (row.name == "进度") {
        if (
          this.userInfo.currentRole.roleCode == "CJDW_XMJL" ||
          this.userInfo.currentRole.roleCode == "XMFZR"
        ) {
          if (item.contractVos.length >= 1 && item.sectionCount != 1) {
            return false;
          } else {
            return true;
          }
          // return true;
        }
        return false;
      }

      if (row.name == "查看") {
        // if (item.ganttStartTime == null) {
        //   return false;
        // } else
        {
          // if (this.userInfo.currentRole.roleCode == "JLGCS") {
          //   return false;
          // } else {
          if (
            item.contractVos &&
            item.contractVos.length >= 1 &&
            item.sectionCount != 1
          ) {
            return false;
          } else {
            return true;
          }
          // }
        }
      }
      if (row.name == "查看审批") {
        // return true;
        if (
          item.contractVos &&
          item.contractVos.length >= 1 &&
          item.sectionCount != 1
        ) {
          return false;
        } else {
          return true;
        }
      }

      if (row.name == "编辑任务") {
        // return true;
        if (
          item.contractVos &&
          item.contractVos.length >= 1 &&
          item.sectionCount != 1
        ) {
          return false;
        } else {
          return true;
        }
      }
    },
    pageChanged(val) {
      this.table.page.pageNum = val;

      this.getTbData();
    },
    sizeChanged(val) {
      this.table.page.pageNum = 1;
      this.table.page.pageSize = val;
      this.getTbData();
    },
    handleSelect(val) {
      if (val.id) {
        this.$router.push({
          name: `${
            this.theNew == "风险" ? "everydayriskAdd" : "everydaytroubleAdd"
          }`,
          query: { projectId: val.id, routeName: this.$route.name },
        });
      }
    },
    // 计划审批
    examinationAndapproval() {
      if (this.pilIds.length == 0) {
        this.$message.info("请选择要审批的项目");
      } else if (this.pilIds.length > 1) {
        this.$message.info("只支持审批一个项目");
      } else {
        // if (this.selectData[0].contractVos.length > 1) {
        if (false) {
          this.$message({
            type: "warning", // success error warning
            message: "此项目下有多个标段,请选择您要开启的合同标段",
          });
        } else {
          this.$confirm("是否确定开启审批流", "提示", {
            iconClass: "el-icon-question", //自定义图标样式
            confirmButtonText: "确认", //确认按钮文字更换
            cancelButtonText: "取消", //取消按钮文字更换
            showClose: true, //是否显示右上角关闭按钮
            type: "info", //提示类型  success/info/warning/error
          }).then(() => {
            let params = {};
            if (this.contractIDs === undefined) {
              params = {
                projectId: this.pilIds[0],
                contractId: this.contractIDs,
                // sectionCount: this.sectionCount,
              };
            } else {
              params = {
                projectId: this.pilIds[0],
                contractId: this.contractIDs,
                sectionCount: this.sectionCount,
              };
            }
            api_startStageUrlOfPost(params).then((res) => {
              // this.$message({
              //   type: "success", // success error warning
              //   message: "开启审批",
              // });
              if (res.msg.code == "0000") {
                this.$message({
                  type: "success", // success error warning
                  message: "发起成功",
                });
              }
            });
            executionManagementDetail(params).then((res) => {
              if (res.msg.code === "0000") {
                this.executionDetail = res.data;
              }
              this.workView(this.executionDetail);
            });
          });
        }
      }
    },
    workView(val) {
      let sourceData = null;
      if (val.source === 0) {
        sourceData = "统建类项目";
      } else if (val.source === 1) {
        sourceData = "实施管理";
      } else if (val.source === 2) {
        sourceData = "项目备案";
      } else if (val.source === 3) {
        sourceData = "计划项目";
      } else if (val.source === 4) {
        sourceData = "政府投资类项目";
      }
    },
    // 导出
    exprotByCondition() {
      if (this.pilIds.length == 0) {
        this.$message.info("请选择要导出的数据");
      } else if (this.pilIds.length > 1) {
        this.$message.info("只支持导出一条数据");
      } else {
        exportGanttApi({
          projectId: this.pilIds[0],
          contractId: this.contractIDs,
          sectionCount: this.sectionCount,
        }).then((res) => {
          // 创建a标签，并处理二进制数据
          const link = document.createElement("a");
          const blob = new Blob([res.data], {
            type: "application/vnd.ms-excel",
          });
          const pat = new RegExp("filename=([^;]+\\.[^\\.;]+)"); // 设置下载文件名称
          let contentDisposition;
          if (res.headers["content-disposition"])
            contentDisposition = res.headers["content-disposition"];
          if (res.headers["Content-Disposition"])
            contentDisposition = res.headers["Content-Disposition"];
          const result = pat.exec(contentDisposition);
          let fileName = result && result[1]; // 生成下载链接
          const URL = window.URL || window.webkitURL;
          link.href = URL.createObjectURL(blob); // 如果Content-Disposition没有提供文件名，则使用默认名称
          fileName = "执行管理导出数据.xlsx";
          link.setAttribute("download", decodeURIComponent(fileName)); // 使用URI解码而不是解码
          document.body.appendChild(link);
          link.click(); // 释放URL对象
          window.URL.revokeObjectURL(link.href);
          document.body.removeChild(link);
        });
      }
    },
    beforeAvatarUpload(file) {
      let testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      const isXLS = testmsg.toUpperCase() == "XLS";
      const isXLSX = testmsg.toUpperCase() == "XLSX";
      const isSize = file.size / 1024 / 1024 < 20;
      if (!isXLS && !isXLSX) {
        this.$message.warning("上传文件只能是xls、xlsx格式!");
        return false;
      }
      if (!isSize) {
        this.$message.warning("上传文件大小不能超过20MB!");
        return false;
      }
    },
    // 导入
    improtByCondition() {
      if (this.pilIds.length == 0) {
        this.$message.info("请选择要导入的数据");
      } else if (this.pilIds.length > 1) {
        this.$message.info("只支持导入一条数据");
      } else {
        this.importDiaVis = true;
      }
    },
    uploadFile(params) {
      this.formData = new FormData();
      this.formData.append("file", params.file);
      this.formData.append("projectId", Number(this.pilIds[0]));
      if (this.contractIDs) {
        this.formData.append("contractId", Number(this.contractIDs));
      }
      if (this.sectionCount) {
        this.formData.append("sectionCount", Number(this.sectionCount));
      }
    },
    upRefalsh() {
      if (this.formData) {
        importManagementApi(this.formData).then((res) => {
          if (res.msg.code == "0000") {
            if (res.data[0].code == "1") {
              this.$message({
                type: "success",
                message: res.data[0].result,
              });
              this.importDiaVis = false;
              this.$refs.elUpload.clearFiles();
              this.getTbData();
              this.$refs.multipleTable.$refs.SrTable.clearSelection();
            } else if (res.data[0].code == "0") {
              this.$message({
                type: "error",
                message: res.data[0].result,
              });
            }
          }
        });
      } else {
        this.$message.warning("请先上传文件");
      }
    },
    // 取消
    cancelImport() {
      this.importDiaVis = false;
      this.$refs.elUpload.clearFiles();
    },
    handleDialogClose() {
      this.importDiaVis = false;
      this.$refs.elUpload.clearFiles();
    },
    // zxjd 进度
    zxjd(row) {
      if (row.contractVos.length == 1 && row.sectionCount == 1) {
        this.testRowId = row.projectId;
        this.centerDialogVisible = true;
        this.form.data.constructionProgress = row.constructionProgress;
        this.conID = row.contractVos[0].contractId;
        this.testisSection = row.contractVos[0].isSection;
        this.testsectionSort = row.contractVos[0].sectionSort;
        this.testsectionCount = row.contractVos[0].sectionCount;
      } else {
        this.testRowId = row.projectId;
        this.centerDialogVisible = true;
        this.form.data.constructionProgress = row.constructionProgress;
        this.conID = row.contractId;

        this.testisSection = row.isSection;
        this.testsectionSort = row.sectionSort;
        this.testsectionCount =
          row.contractId == undefined ? "" : row.sectionCount;
      }
    },
    savezhixing(row) {
      let data = this.$refs["add1"].validate();

      console.log(data, "data.constructionProgress");
      // 进度大于100给出提示不予执行
      if (data.constructionProgress > 100) {
        this.$message.warning("进度不能大于100");
        return;
      }
      if (data.constructionProgress) {
        if (this.testRowId) {
          updateConstruction({
            constructionProgress: this.form.data.constructionProgress,
            projectId: this.testRowId,
            contractId: this.conID,
            isSection: this.testisSection,
            sectionSort: this.testsectionSort,
            sectionCount: this.testsectionCount,
          }).then((res) => {
            if (res.msg.code == "0000") {
              this.$message.success("保存成功");
              this.centerDialogVisible = false;
              this.getTbData();
            }
          });
        }
      }
    },

    zxck(row) {
      console.log(row.contractVos);
      console.log(row.contractVos.length == 1, "row.contractVos.length == 1");
      if (row.contractVos.length == 1 && row.sectionCount == 1) {
        // 系统名称 业务应用名称 合同名称
        this.systemNames = row.systemName;
        this.projectNames = row.projectName;
        this.contractName = row.contractName;

        this.testRowId = row.projectId;
        this.form.data.constructionProgress = row.constructionProgress;
        this.conID = row.contractVos[0].contractId;
        this.testisSection = row.contractVos[0].isSection;
        this.testsectionSort = row.contractVos[0].sectionSort;
        this.testsectionCount = row.contractVos[0].sectionCount;

        this.ganttEndTime = row.ganttEndTime;
        this.ganttStartTime = row.ganttStartTime;
      } else {
        this.testRowId = row.projectId;
        this.form.data.constructionProgress = row.constructionProgress;
        this.conID = row.contractId;
        this.testisSection = row.isSection;
        this.testsectionSort = row.sectionSort;
        this.testsectionCount = row.sectionCount;
        this.ganttEndTime = row.ganttEndTime;
        this.ganttStartTime = row.ganttStartTime;

        this.systemNames = row.systemName;
        this.projectNames = row.projectName;
        this.contractName = row.contractName;
      }

      // const currentProjectStartTime = row.projectByCreateTime;
      // const v1StartTime = row.projectByCreateTimeV1;
      // this.ganttStartTime =
      //   currentProjectStartTime > v1StartTime
      //     ? v1StartTime
      //     : currentProjectStartTime;

      this.$router.push({
        name: "executionManagementView",
        query: {
          contractId: this.conID,
          isSection: this.testisSection,
          sectionSort: this.testsectionSort,
          sectionCount: this.testsectionCount,
          ganttEndTime: this.ganttEndTime,
          ganttStartTime: this.ganttStartTime,
          projectId: this.testRowId,

          systemNames: row.systemName,
          projectNames: row.projectName,
          contractName: row.contractName,
        },
      });
    },
    zxjdu(row) {
      // projectByCreateTime  开始时间
      // projectEndTime   结束时间
      // 判断当前点击的项目的开始时间projectByCreateTime是否大于row.projectByCreateTimeV1的值，如果大于则取row.projectByCreateTimeV1给ganttStartTime
      if (row.contractVos.length == 1 && row.sectionCount == 1) {
        this.testRowId = row.projectId;
        this.form.data.constructionProgress = row.constructionProgress;
        this.conID = row.contractVos[0].contractId;
        this.testisSection = row.contractVos[0].isSection;
        this.testsectionSort = row.contractVos[0].sectionSort;
        this.testsectionCount = row.contractVos[0].sectionCount;
        this.ganttEndTime = row.ganttEndTime;
        this.ganttStartTime = row.ganttStartTime;
      } else {
        this.testRowId = row.projectId;
        this.form.data.constructionProgress = row.constructionProgress;
        this.conID = row.contractId;
        this.testisSection = row.isSection;
        this.testsectionSort = row.sectionSort;
        this.testsectionCount =
          row.contractId == undefined ? "" : row.sectionCount;
          // projectByCreateTimeV1
        // this.ganttEndTime = row.ganttEndTime;
        // this.ganttStartTime = row.ganttStartTime;


        this.ganttEndTime = row.projectByCreateTimeV1;
        this.ganttStartTime = row.projectEndTimeV1;
      }
      // const currentProjectStartTime = row.projectByCreateTime;
      // const v1StartTime = row.projectByCreateTimeV1;
      // this.ganttStartTime =
      //   currentProjectStartTime > v1StartTime
      //     ? v1StartTime
      //     : currentProjectStartTime;

      // const currentProjectEndtTime = row.ganttEndTime;
      // const v1EndTime = row.projectEndTimeV1;
      // this.ganttEndTime =
      //   currentProjectEndtTime > v1EndTime ? v1EndTime : currentProjectEndtTime;

      // console.log(this.ganttStartTime, "ganttStartTime");
      // console.log(this.ganttEndTime, "ganttEndTime");

      //       console.log(row.projectByCreateTimeV1,'row.projectByCreateTimeV1')
      // 在设置 ganttStartTime 前添加逻辑

      this.$router.push({
        name: "projectPhase",
        query: {
          contractId: this.conID,
          isSection: this.testisSection,
          sectionSort: this.testsectionSort,
          sectionCount: this.testsectionCount,
          projectNames: row.projectName,
          projectId: this.testRowId,
          ganttEndTime: this.ganttEndTime,
          ganttStartTime: this.ganttStartTime,
          systemNames: row.systemName,
        },
      });
    },
    // 多选操作
    selected(projectList) {
      this.pilIds = [];
      projectList.map((item) => {
        this.pilIds.push(item.projectId);
        this.projectDetails.push(item);
        this.contractIDs = item.contractId;
        this.sectionCount = item.sectionCount;
      });
      this.selectData = projectList;
    },
    cellClassNameFn(row) {
      if (
        row.columnIndex == 0 &&
        row.row.contractVos.length >= 1 &&
        row.row.sectionCount != 1
      ) {
        // 第一列且状态为 1 通过自定义样式隐藏复选框
        return "table-column-hidden";
      }
    },

    numValid(inputContent) {
      // var reg = /^(0|([1-9]\d{0,1})|100)$/;
      var reg = /^(100|[1-9]?[0-9])$/;

      console.log(reg.test(inputContent), "reg.test(inputContent)");
      // this.form.data.constructionProgress = inputContent;
      if (reg.test(inputContent) == false) {
        if (inputContent > 100) {
          // this.form.data.constructionProgress = 100;
          // 进度大于100给出提示不能大于100
          // this.$message({
          //   type: "error",
          //   message: "进度不能大于100",
          // })
          return false;
        } else if (inputContent.length > 1 && Number(inputContent) == 0) {
          this.form.data.constructionProgress = 0;
        } else {
          this.form.data.constructionProgress = "";
        }
      } else {
        console.log(inputContent, "inputContent");
        this.form.data.constructionProgress = inputContent;
      }
    },
    clickVos(e) {
      if (e.moreVos) {
        this.rProject.push(e.projectId);

        this.table.data.forEach((item, index) => {
          if (
            this.rProject.includes(item.projectId) &&
            item.projectId == e.projectId
          ) {
            if (
              item.contractVos &&
              item.contractVos.length >= 1 &&
              item.sectionCount != 1
            ) {
              item.contractVos.forEach((ele, elIndex) => {
                this.table.data.splice(index + elIndex + 1, 0, {
                  btns: item.btns,
                  projectId: item.projectId,
                  contractVos: [],
                  contractId: ele.contractId,
                  // contractName 合同名称
                  contractName: ele.contractName,
                  // 任务逾期进行中
                  subTaskYQCount: ele.subTaskYQCount,
                  // 业务应用名称
                  projectName: item.projectName,
                  // 系统名称
                  systemName: item.systemName,

                  sectionCount: ele.sectionCount,
                  sectionSort: ele.sectionSort,
                  // 建设进度
                  constructionProgress: ele.constructionProgress
                    ? ele.constructionProgress
                    : "",
                  // 开始时间
                  projectByCreateTime: ele.projectByCreateTime
                    ? ele.projectByCreateTime
                    : "-",
                  // 结束时间
                  projectEndTime: ele.projectEndTime ? ele.projectEndTime : "-",
                  // 审批状态
                  statusName:
                    ele.status == null ? ele.statusName : ele.statusName,
                  // 发起人
                  contractorFqrName: ele.contractorFqrName
                    ? ele.contractorFqrName
                    : "-",
                  processId: ele.processId ? ele.processId : "-",
                  status: ele.status ? ele.status : "1",
                  projectExecutionId: ele.projectExecutionId
                    ? ele.projectExecutionId
                    : "-",

                  ganttEndTime: ele.ganttEndTime ? ele.ganttEndTime : null,
                  ganttStartTime: ele.ganttStartTime
                    ? ele.ganttStartTime
                    : null,
                  projectByCreateTimeV1: ele.projectByCreateTimeV1
                    ? ele.projectByCreateTimeV1
                    : null,
                  projectEndTimeV1: ele.projectEndTimeV1
                    ? ele.projectEndTimeV1
                    : null,
                });
              });
            }
            index = index + 1;
            item.moreVos = 0;
          }
        });
      } else {
        this.table.data.forEach((item, index) => {
          if (item.projectId == e.projectId) {
            if (item.moreVos == 0) {
              this.table.data.splice(index + 1, item.contractVos.length);
              index = index + 1;
            }
            item.moreVos = 1;
            this.rProject.forEach((item, index) => {
              if (item == e.projectId) {
                this.rProject.splice(index, 1);
              }
            });
          }
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.common-card {
  height: 100%;
}

.sr_table {
  height: 89%;
}

::v-deep .sr_table th {
  line-height: 48px;
  height: 48px;
  > .cell {
    line-height: 24px !important;
    button {
      top: -5px !important;
    }
  }
}

::v-deep .sr_table td {
  line-height: 60px;
  height: 60px;
  > .cell {
    line-height: 24px !important;
  }
}

.button {
  height: 28px;
  line-height: 18px;
  text-align: center;
  margin-left: 10px;
  padding: 5px 10px;
  border-radius: 4px;
  border: 1px solid #1890ff;
  font-size: 14px;
  color: #1890ff;
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

::v-deep .sr_search .el-col-5 {
  width: 30%;
  div {
    width: 100%;
    flex-wrap: wrap;
    display: flex;
    // justify-content: space-around;
    justify-content: flex-end;

    .el-button {
      margin-top: 10px;
    }
  }
}

::v-deep .sr_search .el-col-19 {
  width: 70% !important;
  // background: red;
}

::v-deep .el-dialog .el-dialog__header {
  text-align: left !important;
}

.dialog-footer-imp {
  display: flex !important;
  justify-content: flex-end;
  align-items: center;
  // padding: 0 10px;
  .link-box {
    width: 100px;
    height: 50px;
    /* background-color: red; */
    display: block;
    font-size: 12px;
    line-height: 50px;
  }
  .el-button {
    height: 32px;
    border-radius: 4px;
    padding: 0 20px !important;
  }
}

.upload-box {
  display: flex;
  justify-content: space-between;

  .upload-box-right {
    .el-select {
      margin-left: 5px;
    }
  }
}

.systemNameContract {
  display: flex;
  align-items: center;
  .addClick {
    width: 16px;
    height: 15px;
    /* background: #000; */
    color: #000;
    text-align: center;
    line-height: 15px;
    border-radius: 2px;
    font-size: 12px;
    font-weight: bolder;
    margin-right: 14px;
    border: 1px solid rgb(201, 205, 212);
    cursor: pointer;
  }
}

.overflow-text {
  display: inline-block;
  max-width: 80%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
  line-height: 1.4;
}

.section {
  display: flex;
  flex-direction: column;
  // height: 60px;
  .count {
    display: inline-block;
    width: 53px;
    height: 24px;
    background: rgb(1, 118, 255);
    color: rgba(1, 118, 255, 1);
    font-size: 14px;
    font-weight: 400;
    line-height: 24px;
    text-align: center;
    border-radius: 2px;
    background: rgba(66, 130, 255, 0.1);
    border: 1px solid rgba(1, 118, 255, 1);
  }
  // .name {
  //   // color: rgb(153, 153, 153);
  // }
}
.table_unitName {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
:hover .table_unitName {
  cursor: pointer;
}
::v-deep .table-column-hidden .el-checkbox__input {
  display: none !important;
}

.text-ellipsis {
  // width: 200px; /* 定义容器宽度 */
  white-space: nowrap; /* 确保文本不换行 */
  overflow: hidden; /* 隐藏超出容器的内容 */
  text-overflow: ellipsis; /* 使用省略号表示被截断的文本 */
}
</style>
