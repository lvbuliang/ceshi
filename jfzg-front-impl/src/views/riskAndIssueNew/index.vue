<template>
  <div class="all">
    <div class="issue">
      <div class="topSearch">
        <div class="leftSearch" ref="searchRef">
          <SrSearch :search="search" :searchExpand="true" :showTextBtns="true" :hideBtns="false"
            @queryList="pageChanged(1, 'search')" class="SrSearch">

          </SrSearch>
        </div>
        <div class="allExport">
          <el-collapse v-model="activeNames" v-if="checkCodeInArr('M005_0020_001')" class="oneExport">
            <el-collapse-item name="0">
              <template slot="title"> 批量导出 </template>
              <div>
                <el-button @click="exportProblems" :disabled="exportBtn.problemBtn">导出问题</el-button>
              </div>
              <div>
                <el-button @click="exportRisks" :disabled="exportBtn.riskBtn">导出风险</el-button>
              </div>
            </el-collapse-item>
          </el-collapse>
          <el-collapse v-model="activeNametwo" v-if="checkCodeInArr('M005_0020_001')">
            <el-collapse-item name="0">
              <template slot="title"> 一键导出 </template>
              <div>
                <el-button @click="exportProblemsTwo" :disabled="exportBtn.allProblemBtn">导出问题</el-button>
              </div>
              <div>
                <el-button @click="exportRisksTwo" :disabled="exportBtn.allRiskBtn">导出风险</el-button>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>

      <CustomLoading :visible="isLoading" />
      <SrTable :noData="noData" @pageChanged="pageChanged" :data="table.data" @sizeChanged="sizeChanged"
        @sortChange="sortChange" :config="table.tableConfig" :page="table.page" @selected="selected"
        :status="table.status" class="srtable" :extra-tooltip-labels="['项目负责人']">
        <!-- 项目负责人 -->
        <template slot="contactId" slot-scope="{ scope }">
          <span v-if="scope.item.prop == 'contactId'">
            {{ setContactName(scope.row.contactId) }}
          </span>
        </template>
        <!-- 问题数 -->
        <template slot="problemSumCount" slot-scope="{ scope }">
          <span v-if="scope.item.prop == 'problemSumCount'">
            {{
              scope.row.problemSumCount == 0 ? "-" : scope.row.problemSumCount
            }}
          </span>
        </template>
        <!-- 风险数 -->
        <template slot="riskSumCount" slot-scope="{ scope }">
          <template v-if="scope.item.prop == 'riskSumCount'">
            <span>
              {{ scope.row.riskSumCount == 0 ? "-" : scope.row.riskSumCount }}
            </span>
          </template>
        </template>
        <!-- 已解决问题 -->
        <template slot="completeProblem" slot-scope="{ scope }">
          <template v-if="scope.item.prop == 'completeProblem'">
            <span>
              {{
                scope.row.completeProblem == 0 ? "-" : scope.row.completeProblem
              }}
            </span>
          </template>
        </template>

        <!-- 未解决问题数 -->
        <template slot="problemHandle" slot-scope="{ scope }">
          <template v-if="scope.item.prop == 'problemHandle'">
            <span>
              {{ scope.row.problemHandle == 0 ? "-" : scope.row.problemHandle }}
            </span>
          </template>
        </template>

        <!-- 已解决风险 -->
        <template slot="completeRisk" slot-scope="{ scope }">
          <template v-if="scope.item.prop == 'completeRisk'">
            <span>
              {{ scope.row.completeRisk == 0 ? "-" : scope.row.completeRisk }}
            </span>
          </template>
        </template>

        <!-- 未解决风险 -->
        <template slot="riskHandler" slot-scope="{ scope }">
          <template v-if="scope.item.prop == 'riskHandler'">
            <span>
              {{ scope.row.riskHandler == 0 ? "-" : scope.row.riskHandler }}
            </span>
          </template>
        </template>

        <!-- 系统名称 -->

        <template slot="systemName" slot-scope="{ scope }">
          <div v-if="scope.item.prop == 'systemName'">
            <div class="systemNameContract" v-if="scope.row.contractVos && scope.row.contractVos.length > 1">
              <!-- + - 按钮 -->
              <div class="addClick" @click="clickVos(scope.row)">
                <i style="font-weight: bolder" :class="scope.row.moreVos == 1 ||
                  !rProject.includes(scope.row.projectId)
                  ? 'el-icon-plus'
                  : 'el-icon-minus'
                  ">
                </i>
              </div>
              <div class="text-ellipsis">{{ scope.row.systemName }}</div>
            </div>
            <div v-else :class="scope.row.sectionCount ? 'section' : ''">
              <span v-if="scope.row.sectionCount" style="display: flex; justify-content: center">
                <div class="count">标段{{ scope.row.sectionSort }}</div>
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

        <!-- 项目名称 -->
        <template slot="projectName" slot-scope="{ scope }">
          <span v-if="scope.row.projectName">
            <span class="sr_list">
              {{ scope.row.projectName }}
            </span>
          </span>
          <span v-else>-</span>
        </template>

        <!-- 合同名称 -->

        <template slot="cellSlot" slot-scope="{ scope }">
          <span v-if="scope.row.contractName">
            <span class="sr_list">
              {{ scope.row.contractName }}
            </span>
          </span>
          <span v-else>-</span>
        </template>
      </SrTable>
    </div>
  </div>
</template>
<script>
import store from "@/store";
import { getCommonTableHeight } from "@/utils/tableHeightUtils.js";
import { permissionCode } from "./children/const";
import { api_userSetQuery, api_userSetSave } from "@/api/index.js";
import {
  api_queryProjectNotInIds,
  api_getLibraryNumber,
} from "@/api/projectLibrary";
import {
  api_project_list,
  api_project_list_new,
  api_searchRoleCode,
  exportAllProblom,
  exportAllRisk,
} from "@/api/riskAndIssueNew";
import exportFile from "@/views/riskAndIssueNew/components/exportFile.js";
export default {
  name: "riskAndIssueNew",
  data() {
    return {
      isLoading: false,
      noData: false,
      theNew: "",
      activeNames: ["1"],
      activeNametwo: ["1"],
      userInfo: store.getters.userInfo,
      getList: api_queryProjectNotInIds,
      getNumber: api_getLibraryNumber, //弹框新增接口
      params: {
        status: 1000, // 审批完成
        activationStatus: 1, // 非暂停的项目
        isArchive: 0,
        // isXMBA: 1, //查询新增项目
      },
      search: {
        size: "small",
        labelConfig: {
          labelWidth: "50px",
          labelSuffix: ":",
          labelPosition: "right",
        },
        config: [
          {
            type: "text",
            placeholder: "系统名称关键字",
            bind: "systemName", // 对应this.search.data对象的field1
          },
          {
            type: "text",
            placeholder: "项目名称关键字",
            bind: "projectName", // 对应this.search.data对象的field1
          },
          {
            type: "select",
            placeholder: "项目负责人",
            bind: "contactId",
            data: "jsdwList", // 对应enum中的stateList
            class: "selectWidthCustom",
            isHave: true,
          },
        ],
        btns: [
          // {
          //   slot: "searchBtn",
          //   name: "批量导出风险",
          //   click: this.exportRisks,
          //   type: "default",
          //   permissionCode: "M005_0020_001",
          //   class: "exportBtn",
          // },
          // {
          //   name: "批量导出问题",
          //   click: this.exportProblems,
          //   type: "primary",
          //   permissionCode: "M005_0020_002",
          // },
        ],
        enum: {
          // 搜索项下拉数据
          projectList: [],
          jsdwList: [],
        },
        formData: {
          projectName: "",
          sysName: "",
          unitId: "",
          contactId: "",
          orderByColumn: "", // 基于哪个字段排序
          orderBy: "", // DESC降序, ASC升序
        },
      },
      table: {
        data: [], // 表格数据
        tableConfig: {
          // rowClassName: this.rowClassName,
          title: "表格的标题", // 表格标题
          highlightCurrentRow: true, // 控制表格是否单选
          maxHeight: 0,
          tooltipEffect: "light",
          header: [],
          status: [0],
          cellClassName: this.cellClassNameFn,
          indexConfig: {
            display: true,
          },
          expandConfig: {
            display: false,
          },
          selectionConfig: {
            display: true, //display: true,
            width: "40",
            selectable: this.selectable,
          },
          operateConfig: {
            display: true,
            label: "操作",
            width: "156",
            // fixed: "right",
            allTableHeader: "",
            saveHeaderList: this.saveHeaderList,
          },
          innerBtn: [
            {
              name: "风险管理", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "everydayrisk", // 点击执行该页面methods中对应的方法
              // field: "id", // 控制按钮显示隐藏的字段，目前仅支持单一字段，常显的按钮不需要传
              // value: [1, 2], // 需要根据字段控制按钮显示隐藏，当state值不等于该数组的任何一个值的时候显示。逻辑this.table.data的某条数据state!=1&&state!=2时显示该行的这个按钮
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
              code: "M005_010_001", // 按钮的唯一值,用于角色按钮权限控制，不传默认不进行权限控制
              validate: this.btnValidate,
            },
            // 表格内部操作按钮，不需要操作列的innerBtn 写成false
            {
              name: "问题管理", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "everydaytrouble", // 点击执行该页面methods中对应的方法
              // field: "id", // 控制按钮显示隐藏的字段，目前仅支持单一字段，常显的按钮不需要传
              // value: [1, 2], // 需要根据字段控制按钮显示隐藏，当state值不等于该数组的任何一个值的时候显示。逻辑this.table.data的某条数据state!=1&&state!=2时显示该行的这个按钮
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
              code: "M005_010_002", // 按钮的唯一值,用于角色按钮权限控制，不传默认不进行权限控制
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
      isTableHeaderId: null,
      projectLists: [],
      // 一键导出参数
      exportTwoPro: [],
      // 导出按钮禁用
      exportBtn: {
        problemBtn: false,
        riskBtn: false,
        allProblemBtn: false,
        allRiskBtn: false,
      },
      // 展开多标段projecID
      rProject: [],
      num: 1,
      XMFZRList: [],
    };
  },

  created() {
    this.getcontented();
    this.init();
  },
  mounted() {

  },

  methods: {
    calculateTableHeight() {
      // 调用工具函数并传入元素的 ref
      let height = getCommonTableHeight(this.$refs.searchRef);
      this.$set(this.table.tableConfig, "height", height);
    },
    setContactName(val) {
      for (var i = 0; i < this.XMFZRList.length; i++) {
        if (this.XMFZRList[i].jfid == val) {
          return this.XMFZRList[i].fullname;
        }
      }
    },
    btnValidate(row, item) {
      const { roleCode } = this.userInfo.currentRole;
      if (row.name == "问题管理" || row.name == "风险管理") {
        if (roleCode == "CJDW_XMJL") {
          if (item.contractVos && item.contractVos.length > 1) {
            return false;
          } else {
            return true;
          }
        } else {
          return true;
        }
      }
    },
    checkCodeInArr(code, arr) {
      arr = arr || sessionStorage.getItem("permission_btns") || [];
      if (!code) {
        return true;
      }
      arr = typeof arr == "string" ? JSON.parse(arr) : arr;
      let flag = false;
      for (let k = 0; k < arr.length; k++) {
        if (arr[k].permissionCode == code) {
          flag = true;
          break;
        }
      }

      return flag;
    },
    init() {
      this.getTbHeader();
      this.getTbData();
    },
    // 批量导出风险
    exportRisks() {
      console.log(exportFile, "exportFile");
      if (this.projectLists.length == 0) {
        this.$message.warning("请选择项目导出");
      } else {
        this.exportBtn.riskBtn = true;
        this.$set(this.exportBtn, "riskBtn", true);
        exportAllRisk({
          projectIds: this.projectLists,
        }).then((res) => {
          if (res) {
            this.exportBtn.riskBtn = false;
            exportFile(res, "批量风险管理数据");
            // this.projectLists = [];
          } else {
            this.exportBtn.riskBtn = false;
            // this.projectLists = [];
          }
        });
      }
    },
    // 批量导出问题
    exportProblems() {
      if (this.projectLists.length == 0) {
        this.$message.warning("请选择项目导出");
      } else {
        this.exportBtn.problemBtn = true;
        this.$set(this.exportBtn, "problemBtn", true);
        exportAllProblom({ projectIds: this.projectLists }).then((res) => {
          if (res) {
            this.exportBtn.problemBtn = false;
            exportFile(res, "批量问题管理数据");
            // this.projectLists = [];
          } else {
            this.exportBtn.problemBtn = true;
            // this.projectLists = [];
          }
        });
      }
    },
    // 一键导出风险
    exportRisksTwo() {
      exportAllRisk({
        projectIds: this.exportTwoPro,
      }).then((res) => {
        exportFile(res, "所有风险管理数据");
        // this.projectLists = [];
      });
    },
    // 一键导出问题
    exportProblemsTwo() {
      exportAllProblom({ projectIds: this.exportTwoPro }).then((res) => {
        exportFile(res, "所有问题管理数据");
        // this.projectLists = [];
      });
    },
    // 多选操作
    selected(projectList) {
      this.projectLists = [];
      projectList.forEach((item) => {
        this.projectLists.push(item.projectId);
      });
    },

    getcontented() {
      let params = {
        roleCode: "XMFZR",
      };
      api_searchRoleCode(params).then((res) => {
        res.data.map((element) => {
          if (element.fullname) {
            this.search.enum.jsdwList.push({
              label: String(element.fullname),
              value: String(element.jfid),
            });
            this.XMFZRList.push({
              fullname: String(element.fullname),
              jfid: String(element.jfid),
            });
          }
        });
      });
    },
    getTbData(valw) {
      this.isLoading = true;
      this.noData = false;
      if (this.$route.query.isNew) {
        api_project_list_new({
          contactId: "",
          pageNo: "",
          pageSize: "",
          projectName: "",
          systemName: "",
          statusSolve: this.$route.query.statusSolve,
          typePr: this.$route.query.typePr,
        })
          .then((res) => {
            if (res.data) {
              this.isLoading = false;
              this.table.data = res.data.records;

              this.calculateTableHeight();

              this.table.data.forEach((item, index) => {
                if (item.contractVos && item.contractVos.length > 1) {
                  item.moreVos = 1;
                }
                if (item.contractVos && item.contractVos.length == 1) {
                  item.contractName = item.contractVos[0].contractName;
                }
              });
              // this.table.page.pages = res.data.pages;
              // this.table.page.total = res.data.total;
            } else {
              this.table.data = [];
              this.isLoading = false;
              this.noData = true;
            }
          })
          .catch(() => {
            this.isLoading = false;
            this.noData = true;
          });
      } else {
        let param = {
          contactId: "",
          pageNo: this.table.page.pageNum,
          pageSize: this.table.page.pageSize,
          projectName: "",
          systemName: "",
        };
        const searchForms = this.search.formData;
        Object.keys(searchForms).map((item) => {
          if (this.$utils.isEmpty(searchForms[item])) {
            param[item] = searchForms[item];
          }
        });
        api_project_list(param)
          .then((res) => {
            if (res.data) {
              this.table.page.pages = res.data.pages;
              this.table.page.total = res.data.total;

              this.calculateTableHeight();

              this.isLoading = false;
              if (res.data.total && !valw) {
                this.getTbDataAll(res.data.total);
              }
              let { roleCode } = this.userInfo?.currentRole;
              let { jfid } = this.userInfo;
              res.data.records.forEach((item) => {
                if (item.todo) {
                  item.operationBtns = [];
                  //按钮筛选  以assignee优先roleCode
                  if (item.assignee == jfid) {
                    item.description &&
                      JSON.parse(item.description).map((item1) => {
                        if (item1.operationBtns && item1.role == "assignee") {
                          item.operationBtns.push(item1.operationBtns[0]);
                        }
                      });
                    item.path = this.workView;
                  } else {
                    item.description &&
                      JSON.parse(item.description).map((item1) => {
                        if (roleCode == item1.role) {
                          if (item1.operationBtns) {
                            item.operationBtns.push(item1.operationBtns[0]);
                          }
                        }
                      });
                    item.path = this.workView;
                  }
                }
              });
              this.table.data = res.data.records;

              this.table.data.forEach((item, index) => {
                item.status = 1;
                if (item.contractVos && item.contractVos.length > 1) {
                  item.moreVos = 1;
                }
                if (item.contractVos && item.contractVos.length == 1) {
                  item.contractName = item.contractVos[0].contractName;
                }
              });
            } else {
              this.table.data = [];
              this.isLoading = false;
              this.noData = true;
            }
          })
          .catch(() => {
            this.isLoading = false;
            this.noData = true;
          });
      }
    },
    getTbDataAll(val) {
      if (this.$route.query.isNew) {
        api_project_list_new({
          contactId: "",
          pageNo: "",
          pageSize: "",
          projectName: "",
          systemName: "",
          statusSolve: this.$route.query.statusSolve,
          typePr: this.$route.query.typePr,
        }).then((res) => {
          if (res.data) {
            res.data.records.forEach((item) => {
              if (item.projectId) {
                this.exportTwoPro.push(item.projectId);
              }
            });
          }
        });
      } else {
        let param = {
          contactId: "",
          pageNo: "",
          pageSize: val,
          projectName: "",
          systemName: "",
        };
        api_project_list(param).then((res) => {
          if (res.data) {
            res.data.records.forEach((item) => {
              if (item.projectId) {
                this.exportTwoPro.push(item.projectId);
              }
            });
          }
        });
      }
    },
    sortChange(column) {
      //   this.search.formData["orderByColumn"] = column.prop;
      // column.order === "descending" ? this.search.formData["orderBy"] = "ASC" : this.search.formData["orderBy"] = "DESC";
      // console.log(column, "column");
      // // console.log(column.prop, "propproppropproppropproppropprop");
      if (column.order === "ascending") {
        // 问题总数
        if (column.prop == "problemSumCount") {
          this.search.formData["orderByColumn"] = "problemSumCount";
          this.search.formData["orderBy"] = "ASC";
        }
        // 风险数
        else if (column.prop == "riskSumCount") {
          this.search.formData["orderByColumn"] = "riskSumCount";
          this.search.formData["orderBy"] = "ASC";
        }
        // 问题已处理
        else if (column.prop == "completeProblem") {
          this.search.formData["orderByColumn"] = "problemComplete";
          this.search.formData["orderBy"] = "ASC";
        }
        // 问题未处理
        else if (column.prop == "problemHandle") {
          this.search.formData["orderByColumn"] = "problemHandler";
          this.search.formData["orderBy"] = "ASC";
        }
        // 已解决风险数
        else if (column.prop == "completeRisk") {
          this.search.formData["orderByColumn"] = "riskComplete";
          this.search.formData["orderBy"] = "ASC";
        }
        //       // 未解决风险数
        else if (column.prop == "riskHandler") {
          this.search.formData["orderByColumn"] = "riskHandler";
          this.search.formData["orderBy"] = "ASC";
        }
      } else if (column.order === "descending") {
        // this.search.formData["orderByColumn"] = column.prop;
        // this.search.formData["orderBy"] = "DESC";
        // 问题总数
        if (column.prop == "problemSumCount") {
          this.search.formData["orderByColumn"] = "problemSumCount";
          this.search.formData["orderBy"] = "DESC";
        }
        // 风险数
        else if (column.prop == "riskSumCount") {
          this.search.formData["orderByColumn"] = "riskSumCount";
          this.search.formData["orderBy"] = "DESC";
        }
        // 问题已处理
        else if (column.prop == "completeProblem") {
          this.search.formData["orderByColumn"] = "problemComplete";
          this.search.formData["orderBy"] = "DESC";
        }
        // 问题未处理
        else if (column.prop == "problemHandle") {
          this.search.formData["orderByColumn"] = "problemHandler";
          this.search.formData["orderBy"] = "DESC";
        }
        // 已解决风险数
        else if (column.prop == "completeRisk") {
          this.search.formData["orderByColumn"] = "riskComplete";
          this.search.formData["orderBy"] = "DESC";
        }
        // 未解决风险数
        else if (column.prop == "riskHandler") {
          this.search.formData["orderByColumn"] = "riskHandler";
          this.search.formData["orderBy"] = "DESC";
        }
      } else {
        this.search.formData["orderByColumn"] = "";
        this.search.formData["orderBy"] = "";
      }
      this.getTbData();
    },
    getTbHeader() {
      api_userSetQuery({ permissionCode: permissionCode }).then((res) => {
        this.isTableHeaderId = res.data.id;
        let headerData = JSON.parse(res.data.data).sort(
          (a, b) => a.index - b.index
        );
        this.table.tableConfig.operateConfig.allTableHeader = headerData;
        this.table.tableConfig.header = headerData.filter((item) => {
          // if (
          //   item.prop == "beginDate" ||
          //   item.prop == "endDate" ||
          //   item.prop == "problemCountDesc" ||
          //   item.prop == "riskCountDesc"
          // ) {
          //   item.sortable = "custom";
          // }
          return item.isShow;
        });
      });
    },
    workView(val) {
      this.$router.push({
        name: "issueView",
        query: {
          id: val.id,
          projectId: val.projectId,
          processId: val.processId,
          templateId: val.templateId,
          processId: val.processId,
        },
      });
    },
    everydayrisk(val) {
      this.$router.push({
        name: "everydayriskNew",
        query: {
          projectId: val.projectId,
          systemName: val.systemName,
          projectName: val.projectName,
          isNew: this.$route.query.isNew,
          contractId: val.contractId,
          sectionCount: val.sectionCount,
          sectionSort: val.sectionSort,
        },
      });
    },
    everydaytrouble(val) {
      this.$router.push({
        name: "everydaytroubleNew",
        query: {
          projectId: val.projectId,
          systemName: val.systemName,
          projectName: val.projectName,
          isNew: this.$route.query.isNew,
          contractId: val.contractId,
          sectionCount: val.sectionCount,
          sectionSort: val.sectionSort,
        },
      });
    },
    pageChanged(val, vals) {
      this.table.page.pageNum = val;
      if (vals) {
        this.getTbData();
      } else {
        this.getTbData("page");
      }
    },
    sizeChanged(val) {
      this.table.page.pageNum = 1;
      this.table.page.pageSize = val;
      this.getTbData("page");
    },
    addRisk() {
      let { buName, buid } = this.userInfo?.bizunitInfos[0];
      this.theNew = "风险";
      // if (buName == "承建单位") {
      //   this.params.contractUnit = buid;
      // } else if (buName == "建设单位") {
      //   this.params.constructionUnit = buid;
      // }

      this.$refs.SrDialogSelect.dialogVisible = true;
      this.$refs.SrDialogSelect.search();
    },
    addTrouble() {
      let { buName, buid } = this.userInfo?.bizunitInfos[0];
      this.theNew = "问题";
      // if (buName == "承建单位") {
      //   this.params.contractUnit = buid;
      // } else if (buName == "建设单位") {
      //   this.params.constructionUnit = buid;
      // }
      this.$refs.SrDialogSelect.dialogVisible = true;
      this.$refs.SrDialogSelect.search();
    },
    handleSelect(val) {
      if (val.id) {
        this.$router.push({
          name: `${this.theNew == "风险" ? "everydayriskAdd" : "everydaytroubleAdd"
            }`,
          query: { projectId: val.id, routeName: this.$route.name },
        });
      }
    },
    saveHeaderList(data) {
      api_userSetSave({
        data: JSON.stringify(data),
        permissionCode: permissionCode,
        id: this.isTableHeaderId,
      }).then((res) => {
        if (res.msg.code == "0000") {
          this.init();
        }
      });
    },

    // 展开
    clickVos(e) {
      if (e.moreVos == 1) {
        this.rProject.push(e.projectId);
        this.table.data.forEach((item, index) => {
          if (
            this.rProject.includes(item.projectId) &&
            item.projectId == e.projectId
          ) {
            if (item.contractVos && item.contractVos.length > 1) {
              item.contractVos.forEach((ele, elen) => {
                this.table.data.splice(index + elen + 1, 0, {
                  btns: item.btns,
                  projectId: item.projectId,
                  contractVos: null,
                  contractId: ele.contractId,
                  contractName: ele.contractName,
                  projectName: item.projectName,
                  systemName: item.systemName,
                  sectionCount: ele.sectionCount,
                  sectionSort: ele.sectionSort,
                  // 问题数
                  problemSumCount: ele.problemSumCount,
                  // 已解决问题
                  completeProblem: ele.completeProblem,
                  // 未解决问题
                  problemHandle: ele.problemHandle,
                  // 风险数
                  riskSumCount: ele.riskSumCount,
                  // 已解决风险
                  completeRisk: ele.completeRisk,
                  // 未解决风险
                  riskHandler: ele.riskHandler,
                  isDuo: 0,
                });
              });
            }

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
    //通过自定义样式隐藏复选框
    cellClassNameFn(row) {
      if (row.columnIndex == 0 && !row.row.contractVos) {
        return "table-column-hidden";
      }
    },

    getProblemCountDesc(e) {
      let number = null;
      if (e.completeProblem) {
        if (e.problemHandle) {
          number = Number(
            (Number(e.completeProblem) ? Number(e.completeProblem) : 0) +
            (Number(e.problemHandle) ? Number(e.problemHandle) : 0)
          )
            ? (Number(e.completeProblem) ? Number(e.completeProblem) : 0) +
            (Number(e.problemHandle) ? Number(e.problemHandle) : 0)
            : "-";
          return number;
        }
      }
    },
    getRiskCountDesc(e) {
      let number = null;
      if (e.completeRisk) {
        if (e.riskHandler) {
          number = Number(
            (Number(e.completeRisk) ? Number(e.completeRisk) : 0) +
            (Number(e.riskHandler) ? Number(e.riskHandler) : 0)
          )
            ? (Number(e.completeRisk) ? Number(e.completeRisk) : 0) +
            (Number(e.riskHandler) ? Number(e.riskHandler) : 0)
            : "-";
          return number;
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.SrDialogSelect {
  ::v-deep .el-input {
    display: none;
  }
}

.all {
  height: 100%;

  .issue {
    background-color: #fff;
    padding: 20px 20px;

    // border: 1px solid #f7f7f7;
    // -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    // box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    // border-radius: 4px
    .topSearch {
      display: flex;
      justify-content: space-between;

      .leftSearch {
        width: 80%;
      }
    }
  }
}

::v-deep .el-collapse {
  width: 100px !important;
  // height: 25px;
  border: none !important;
}

::v-deep .el-collapse-item__header {
  background-color: #1890ff;
  color: #fff;
  font-size: 16px;
  text-align: center;
  width: 100%;
  height: auto !important;
  line-height: normal;
  padding: 5px;
  border-radius: 0;
  padding-left: 17%;
}

::v-deep .el-collapse-item__arrow {
  display: none;
}

::v-deep .el-collapse-item__content {
  width: 100px !important;
  padding: 0 !important;

  .el-button {
    background: none;
    width: 100px;
    border-radius: 0;
  }
}

.allExport {
  flex: 1;
  display: flex;
  justify-content: end;

  .oneExport {
    margin-right: 10px;
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
    // margin-right: 5px;
  }

  // .name {
  //   // color: rgb(153, 153, 153);
  // }
}

// .table_unitName {
//   overflow: hidden;
//   white-space: nowrap;
//   text-overflow: ellipsis;
// }

// :hover .table_unitName {
//   cursor: pointer;
// }

::v-deep .table-column-hidden .el-checkbox__input {
  display: none !important;
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
