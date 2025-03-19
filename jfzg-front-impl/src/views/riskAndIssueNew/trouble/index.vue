<template>
  <div
    class="everydaytrouble"
    v-if="
      $route.name == 'everydaytroubleNew' ||
      $shishiRouterList.includes($route.name)
    "
  >
    <!-- <keep-alive> -->
    <div class="all">
      <!-- <div class="conTitle" v-show="false">
          <div class="sys">
            <span class="sysText">系统名称:</span>
            <span class="ml-10">{{ systemName }}</span>
          </div>
          <div class="pro">
            <span class="sysText">项目名称:</span>
            <span class="ml-10">{{ projectName }}</span>
          </div>
        </div> -->

      <div class="searchDiv">
        <SrSearch
          :search="search"
          :searchExpand="true"
          :showTextBtns="true"
          :hideBtns="false"
          @queryList="pageChanged(1)"
          class="Srsearch"
        ></SrSearch>
      </div>
      <SrTable
        @pageChanged="pageChanged"
        :data="table.data"
        @sizeChanged="sizeChanged"
        :config="table.tableConfig"
        @sortChange="sortChange"
        :page="table.page"
        class="SrTable"
      >
        <template slot="description" slot-scope="scope">
          <div v-if="scope.scope.row.description">
            <el-tooltip
              :content="scope.scope.row.description"
              placement="top-start"
              effect="light"
            >
              <div class="texts">
                {{ scope.scope.row.description }}
              </div>
            </el-tooltip>
          </div>
          <div v-else>-</div>
        </template>
        <template slot="suggestion" slot-scope="scope">
          <div v-if="scope.scope.row.suggestion">
            <el-tooltip
              :content="scope.scope.row.suggestion"
              placement="top-start"
              effect="light"
            >
              <div class="texts">
                {{ scope.scope.row.suggestion }}
              </div>
            </el-tooltip>
          </div>
          <div v-else>-</div>
        </template>
        <template slot="level" slot-scope="scope">
          <template v-if="scope.scope.item.prop == 'level'">
            <div class="cellSlotbox" v-if="scope.scope.row.level">
              {{ problemLevelFun(scope.scope.row.level) }}
            </div>
            <div v-else>-</div>
          </template>
        </template>
        <template slot="status" slot-scope="scope">
          <template v-if="scope.scope.item.prop == 'status'">
            <div class="cellSlotbox" v-if="scope.scope.row.status">
              {{ problemStatusFun(scope.scope.row.status) }}
            </div>
            <div v-else>-</div>
          </template>
        </template>
        <template slot="proposer" slot-scope="scope">
          <template v-if="scope.scope.item.prop == 'proposer'">
            <div class="cellSlotbox" v-if="scope.scope.row.proposer">
              {{ scope.scope.row.proposerName }}
            </div>
            <div v-else>-</div>
          </template>
        </template>
      </SrTable>

      <BottomBtns v-if="!hideSearchBtn" @onBackClick="backToList"></BottomBtns>
      <div></div>
    </div>
  </div>

  <div v-else>
    <router-view></router-view>
  </div>
</template>
<script>
import store from "@/store";
// import {
//   listByTopicAndItem,
//   api_userSetQuery,
//   api_userSetSave,
// } from "@/api/index.js";
import { api_userSetQuery } from "@/api/index.js";
import BottomBtns from "@/components/BottomBtns.vue";
import { permissionCode } from "../trouble/const.js";
// import { permissionCode, TYPELIST, SOURCELIST, TROUBLETYPE } from "./const.js";
import {
  api_trouble_list,
  exportProblemByName,
} from "@/api/riskAndIssueNew/index.js";
// import { api_queryStageList } from "@/api/shishi/taskList.js";
// import { queryByUnitType } from "@/api/bianzhi/index";

export default {
  name: "everydaytroubleNew",
  components: {
    // navBox,
    BottomBtns,
  },
  props: {
    hideSearchBtn: Boolean, // 默认false 为true隐藏搜索栏，操作按钮
    viewProjectId: [String, Number], // 实施中查看组件项目id传参
    backName: String, //实施中组件返回列表参数
  },
  data() {
    return {
      userInfo: store.getters.userInfo,
      dwList: ["YYJSC_FZR", "YYJSC_JBR", "JSDW_JBR", "JSDW_FZR"],
      milestoneList: [], // 里程碑
      search: {
        size: "small",
        labelConfig: {
          labelWidth: "90px",
          labelSuffix: ":",
          labelPosition: "right",
        },
        config: [
          {
            type: "select",
            placeholder: "问题类型",
            bind: "type", // 对应this.search.data对象的field1
            width: "100px",
            data: "troubleType", // 对应enum中的stateList
            class: "selectWidthCustom",
          },
          {
            type: "select",
            placeholder: "问题等级",
            bind: "level",
            data: "everydaytroubleList", // 对应enum中的stateList
            class: "selectWidthCustom",
          },
          {
            type: "select",
            placeholder: "问题状态",
            bind: "status",
            data: "proposerNameList", // 对应enum中的stateList
            class: "selectWidthCustom",
          },
        ],
        enum: {
          troubleType: [
            { label: "内部问题", value: "1" },
            { label: "外部问题", value: "2" },
            { label: "云网问题", value: "3" },
          ],
          // 搜索项下拉数据
          everydaytroubleList: [
            { label: "轻微", value: "0" },
            { label: "一般", value: "1" },
            { label: "严重", value: "2" },
          ],
          proposerNameList: [
            { label: "处理中", value: "1" },
            { label: "已解决", value: "2" },
          ],
        },
        btns: [
          {
            name: "新建问题",
            click: this.XZZP,
            type: "primary",
            permissionCode: "M005_010_003",
          },
          {
            name: "导出",
            click: this.exprotByCondition,
            type: "default",
            permissionCode: "M005_010_009",
          },
        ],
        formData: {
          type: "",
          level: "",
          status: "",
          projectId: "",
          contractId: "",
          sectionCount: "",
        },
      },
      table: {
        data: [], // 表格数据
        tableConfig: {
          // rowClassName: this.rowClassName,
          title: "表格的标题", // 表格标题
          highlightCurrentRow: false,
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
            width: "156",
            fixed: "right",
            allTableHeader: "",
            saveHeaderList: this.saveHeaderList,
          },
          emptyConfig: {
            // 表格数据为空时默认显示的内容
            display: true,
            emptyNull: "暂无问题",
          },
          innerBtn: [
            // 表格内部操作按钮，不需要操作列的innerBtn 写成false
            {
              name: "编辑",
              method: "edit",
              type: "text",
              size: "small",
              // field: "status",
              // value: [1,2],
              icon: "el-icon-document",
              className: "font-size-20",
              reverse: true,
              validate: this.btnValidate,
              // code: "M005_003_002_008", // 按钮的唯一值,用于角色按钮权限控制，不传默认不进行权限控制
            },
            {
              name: "删除",
              method: "delete",
              type: "text",
              size: "medium",
              // field: "status",
              // value: ["1", "2"],
              icon: "el-icon-document",
              className: "font-size-20",
              // code: "M005_003_002_009", // 按钮的唯一值,用于角色按钮权限控制，不传默认不进行权限控制
              reverse: true,
              validate: this.btnValidate,
            },
            {
              name: "指派处理人",
              method: "assign",
              type: "text",
              size: "medium",
              // field: "status",
              // value: ["1",'2'],
              reverse: true,
              icon: "el-icon-document",
              className: "font-size-20",
              // code: "M005_008_001", // 按钮的唯一值,用于角色按钮权限控制，不传默认不进行权限控制
              validate: this.btnValidate,
            },
            {
              name: "查看", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "see", // 点击执行该页面methods中对应的方法
              // field: "id", // 控制按钮显示隐藏的字段，目前仅支持单一字段，常显的按钮不需要传
              // value: [1, 2], // 需要根据字段控制按钮显示隐藏，当state值不等于该数组的任何一个值的时候显示。逻辑this.table.data的某条数据state!=1&&state!=2时显示该行的这个按钮
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
              // code: "M005_008_001", // 按钮的唯一值,用于角色按钮权限控制，不传默认不进行权限控制
              validate: this.btnValidate,
            },
            {
              name: "处理",
              method: "dispose",
              type: "text",
              size: "medium",
              // field: "status",
              // value: ["1",'2'],
              reverse: true,
              icon: "el-icon-document",
              className: "font-size-20",
              // code: "M005_003_002_010", // 按钮的唯一值,用于角色按钮权限控制，不传默认不进行权限控制
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
          pageNu: 1, //当前页
          background: true,
          // layout: 'total, prev, pager, next, sizes,jumper'
        },
      },
      isTableHeaderId: null,
      XZdDialogDis: false,
      systemName: "",
      projectName: "",
    };
  },
  watch: {
    $route(val) {
      if (val) {
        this.init();
      }
    },
  },
  created() {
    this.init();
  },
  methods: {
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
    init() {
      this.getTbHeader();
      this.getTbData();
      // this.getListByTopicAndItem();
      // this.stage();
      // this.projectMember();
      this.systemName = this.$route.query.systemName;
      this.projectName = this.$route.query.projectName;
    },
    // async projectMember() {
    //   queryByUnitType({ projectId: this.$route.query.projectId }).then(
    //     (res) => {
    //       if (res.msg.code == "0000") {
    //         let allmember = [
    //           ...res.data["JSDW"].members,
    //           ...res.data["JSDW"].principals,
    //           ...res.data["CJDW"].members,
    //           ...res.data["CJDW"].principals,
    //           ...res.data["JLDW"].members,
    //           ...res.data["JLDW"].principals,
    //         ];
    //         let Fzr_data = [];
    //         for (let i = 0; i < allmember.length; i++) {
    //           var map = {
    //             fullname: allmember[i].fullname,
    //             mobile: allmember[i].mobile,
    //             jfid: allmember[i].jfid,
    //             dataName: allmember[i].fullname,
    //             dataValue: allmember[i].jfid,
    //           };
    //           var cannotadd = false;
    //           for (var j = 0; j < Fzr_data.length; j++) {
    //             if (Fzr_data[j].jfid == allmember[i].jfid) {
    //               cannotadd = true;
    //               break;
    //             }
    //           }
    //           if (!cannotadd) {
    //             Fzr_data.push(map);
    //           }
    //         }
    //         // 提出人
    //         this.$set(
    //           this.search.enum,
    //           "proposerNameList",
    //           this.$utils.enumsDataNameValue(
    //             Fzr_data,
    //             "fullname",
    //             "jfid",
    //             "label",
    //             "value"
    //           )
    //         );
    //       }
    //     }
    //   );
    // },
    backToList() {
      this.routeClose();

      this.$router.push({ name: "riskAndIssueNew" });
    },
    problemSourceFun(val) {
      let arr = SOURCELIST;
      return this.$utils.arrFind(arr, val, "value")?.label;
    },
    problemTypeFun(val) {
      // 类型
      let arr = [
        { label: "内部问题", value: "1" },
        { label: "外部问题", value: "2" },
        { label: "云网问题", value: "3" },
      ];
      return this.$utils.arrFind(arr, val, "value")?.label;
    },
    problemLevelFun(val) {
      // 等级
      let arr = [
        { label: "轻微", value: "0" },
        { label: "一般", value: "1" },
        { label: "严重", value: "2" },
      ];
      return this.$utils.arrFind(arr, val, "value")?.label;
    },
    problemStatusFun(val) {
      let arr = [
        // 状态
        { label: "处理中", value: "1" },
        { label: "已解决", value: "2" },
      ];
      return this.$utils.arrFind(arr, val, "value")?.label;
    },
    levelImgFun(val) {
      if (val) val = val - 1;
      let imgArr = [
        require("@/assets/riskTrouble/low.png"),
        require("@/assets/riskTrouble/middle.png"),
        require("@/assets/riskTrouble/high.png"),
      ];
      return typeof val == "string" || typeof val == "number"
        ? imgArr[val]
        : "";
    },
    levelFun(val) {
      let arr = this.search.enum.everydaytroubleList;
      return this.$utils.arrFind(arr, val, "value")?.label;
    },
    milestoneFun(val) {
      let arr = this.milestoneList;
      return this.$utils.arrFind(arr, val, "value")?.label;
    },
    async stage() {
      // 获取里程碑
      let res = await api_queryStageList(this.$route.query.projectId);
      if (res?.data && res.msg.code == "0000") {
        this.$set(
          this,
          "milestoneList",
          this.$utils.enumsDataNameValue(
            res.data,
            "stageName",
            "stageId",
            "label",
            "value"
          )
        );
      }
    },
    getListByTopicAndItem() {
      // 获取问题级别
      listByTopicAndItem({ topic: "JFZG_PROJECTRISK_LEVEL" }).then((res) => {
        if (res?.data) {
          this.$set(
            this.search.enum,
            "everydaytroubleList",
            this.$utils.enumsDataNameValue(
              res.data,
              "chName",
              "itemCode",
              "label",
              "value"
            )
          );
        }
      });
    },
    getTbData() {
      let param = {
        isDraft: 1,
        level: "",
        pageNu: this.table.page.pageNu,
        pageSize: this.table.page.pageSize,
        projectId: this.$route.query.projectId,
        contractId: this.$route.query.contractId,
        sectionCount: this.$route.query.sectionCount,
        sectionSort: this.$route.query.sectionSort,
        proposeTime: "",
        status: "",
        type: "",
      };
      const searchForms = this.search.formData;
      Object.keys(searchForms).map((item) => {
        if (this.$utils.isEmpty(searchForms[item])) {
          param[item] = searchForms[item];
        }
      });

      if (this.$route.query.projectId) {
        param.projectId = this.$route.query.projectId;
        param.contractId = this.$route.query.contractId;
      }
      // if (this.hideSearchBtn) {
      //   // 查看对应里程碑的风险
      //   if (this.$route.query.stageId) {
      //     param.milestone = this.$route.query.stageId;
      //   }
      // }
      api_trouble_list(param).then((res) => {
        if (!res?.data?.records) return;

        this.table.page.pages = res.data.pages;
        this.table.page.total = res.data.total;
        let { roleCode } = this.userInfo?.currentRole;
        let { jfid } = this.userInfo;
        if (!this.hideSearchBtn) {
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
        }
        this.table.data = res.data.records;
      });
    },
    getTbHeader() {
      api_userSetQuery({ permissionCode: permissionCode }).then((res) => {
        this.isTableHeaderId = res.data.id;
        if (res.data.data) {
          let headerData = JSON.parse(res.data.data).sort(
            (a, b) => a.index - b.index
          );
          if (headerData && headerData.length > 0) {
            headerData.map((item) => {
              if (item.prop == "levelName") {
                item.cellSlot = true;
              }
              if (
                item.prop == "levelName" ||
                item.prop == "proposeTime" ||
                item.prop == "updateTime"
              ) {
                item.sortable = "custom";
              }
            });
            this.table.tableConfig.operateConfig.allTableHeader = headerData;

            this.table.tableConfig.header = headerData.filter((item) => {
              if (item.prop == "description") {
                item.width = "230px";
              }
              if (item.prop == "suggestion") {
                item.width = "200px";
              }
              return item.isShow;
            });
          }
        }
      });
    },
    workView(val) {
      this.$router.push({
        name: "everydaytroubleView",
        query: {
          id: val.id,
          projectId: val.projectId,
          processId: val.processId,
        },
      });
    },
    assign(val) {
      this.$router.push({
        name: "everydaytroubleAssignNew",
        query: {
          assign: true,
          code: 1,
          id: val.id,
          projectId: val.projectId,
          contractId: this.$route.query.contractId,
          projectName: this.$route.query.projectName,
          systemName: this.$route.query.systemName,
          sectionCount: this.$route.query.sectionCount,
          sectionSort: this.$route.query.sectionSort,
        },
      });
    },
    see(val) {
      this.$router.push({
        name: "everydaytroubleEditNew",
        query: {
          see: true,
          code: "see",
          id: val.id,
          projectId: val.projectId,
          contractId: this.$route.query.contractId,
          projectName: this.$route.query.projectName,
          systemName: this.$route.query.systemName,
          sectionCount: this.$route.query.sectionCount,
          sectionSort: this.$route.query.sectionSort,
        },
      });
    },
    delete(row) {
      this.$SrUtils.showConfirmMessage.call(this, {
        title: "提示",
        content: "此操作将删除此数据, 是否继续?",
        okFun: () => {
          api_delelteProblemById({ id: row.id }).then((res) => {
            if (res.msg.code == "0000") {
              this.$message({
                type: "success",
                message: "删除成功",
              });
              if (this.table.data.length == 1) {
                this.table.page.pageNu = this.table.page.pageNu - 1;
              }
              this.getTbData();
            }
          });
        },
        cancelFun: () => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        },
      });
    },
    edit(val) {
      this.$router.push({
        name: "everydaytroubleEditNew",
        query: {
          id: val.id,
          projectId: val.projectId,
          contractId: this.$route.query.contractId,
          code: "edit",
          projectName: this.$route.query.projectName,
          systemName: this.$route.query.systemName,
          sectionCount: this.$route.query.sectionCount,
          sectionSort: this.$route.query.sectionSort,
        },
      });
    },
    pageChanged(val) {
      this.table.page.pageNu = val;
      this.getTbData();
    },
    sizeChanged(val) {
      this.table.page.pageNu = 1;
      this.table.page.pageSize = val;
      this.getTbData();
    },
    routeClose() {
      this.$SrUtils.routeClose.call(this, "subimpl", this.$setState);
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
    btnValidate(row, item) {
      if (row.name == "编辑") {
        if (item.status != "2") {
          console.log(item.proposer, "item.proposer");
          if (
            this.userInfo.jfid === item.proposer ||
            this.userInfo.currentRole.roleCode == "XMFZR"
          ) {
            if (
              [
                "DSZ",
                "ZJL",
                "F_ZJL",
                "BM_FZR",
                "PSXZ_CY",
                "FZGHC_JBRBF",
                "XMGLB",
              ].includes(this.userInfo.currentRole.roleCode)
            ) {
              return false;
            } else {
              return true;
            }
            // return true;
          }
        }
        // }
      }
      if (row.name == "查看") {
        return true;
      }
      if (row.name == "指派处理人") {
        if (
          this.userInfo.currentRole.roleCode == "XMFZR" &&
          !item.processorName
        ) {
          return true;
        }
      }
      if (row.name == "处理") {
        if (item.status == "2") {
          return false;
        } else if (
          item.status != "2" &&
          (this.userInfo.jfid == item.processor ||
            this.userInfo.jfid == item.subContractorId)
        ) {
          return true;
        }
        // }
      }
      return false;
    },

    // XZZP: debounce(function(val) {
    //   // 实际处理数据的逻辑
    //   console.log('数据更新');
    //   this.$router.push({
    //     name: "everydaytroubleEditNew",
    //     query: {
    //       projectId: this.$route.query.projectId,
    //       projectName: this.$route.query.projectName,
    //       systemName: this.$route.query.systemName,
    //       contactId: this.$route.query.contactId,
    //       contactName: this.$route.query.contactName,
    //       code: "new",
    //       id: val.id,
    //     },
    //   });
    // }, 1500),

    XZZP(val) {
      this.$router.push({
        name: "everydaytroubleEditNew",
        query: {
          projectId: this.$route.query.projectId,
          projectName: this.$route.query.projectName,
          systemName: this.$route.query.systemName,
          contactId: this.$route.query.contactId,
          contractId: this.$route.query.contractId,
          contactName: this.$route.query.contactName,
          sectionCount: this.$route.query.sectionCount,
          sectionSort: this.$route.query.sectionSort,
          code: "new",
          id: val.id,
        },
      });
    },

    // 风险问题导出
    exprotByCondition() {
      console.log("diaojiekou");
      this.search.formData.projectId = this.$route.query.projectId;
      this.search.formData.sectionCount = this.$route.query.sectionCount;
      this.search.formData.contractId = this.$route.query.contractId;
      exportProblemByName(this.search.formData).then((res) => {
        console.log("问题管理导出的数据", res);
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
        console.log(blob, URL);
        link.href = URL.createObjectURL(blob); // 如果Content-Disposition没有提供文件名，则使用默认名称
        fileName = "问题管理";
        link.setAttribute("download", decodeURIComponent(fileName)); // 使用URI解码而不是解码
        document.body.appendChild(link);
        link.click(); // 释放URL对象
        window.URL.revokeObjectURL(link.href);
        document.body.removeChild(link);
      });
    },

    dispose(val) {
      this.$router.push({
        name: "everydaytroubleDisposeNew",
        query: {
          projectId: this.$route.query.projectId,
          contractId: this.$route.query.contractId,
          projectName: this.$route.query.projectName,
          systemName: this.$route.query.systemName,
          contactId: this.$route.query.contactId,
          contactName: this.$route.query.contactName,
          sectionCount: this.$route.query.sectionCount,
          sectionSort: this.$route.query.sectionSort,
          id: val.id,
        },
      });
    },
    cancelXZDis() {
      this.XZdDialogDis = !this.XZdDialogDis;
    },
    change(activeNames) {
      console.log(activeNames, "activeNames");
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-button {
  margin-bottom: 10px;
  border-radius: 4px !important;
}
::v-deep .sr_search .search_right_button .el-button {
  border-radius: 50% !important;
}
.all {
  width: 100%;
  background-color: #fff;
  .conTitle {
    font-size: 16px;
    height: 100%;
    // width: 100%;
    background-color: rgb(241, 243, 246);
    display: flex;
    // align-items:
    // flex-direction: column;
    margin: 10px 20px;
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
  .searchDiv {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 20px 0 20px;
    .Srsearch {
      width: 100%;
    }
    .el-button {
      height: 34px;
      width: 80px;
      text-align: center;
      padding: 0;
      font-size: 12px;
    }
  }
  .SrTable {
    padding: 0 20px 20px 20px;
  }
  ::v-deep .dialog .el-dialog__body {
    padding: 0 0 20px 0;
  }
  .dialog {
    display: flexbox;
    .el-dialog {
      .el-dialog__body {
        padding: none;
        .cen {
          display: flex;
          border-bottom: 1px solid rgba(229, 230, 235, 1);
          .left {
            width: 44%;
            display: block;
            padding: 10px 20px 34px;
            border-right: 1px solid rgba(229, 230, 235, 1);
          }
          .right {
            width: calc(100% - 55%);
            flex: 1;
            display: block;
            padding: 0 20px;
          }
        }
        .btn {
          margin-top: 20px;
          display: flex;
          justify-content: center;
          .el-button {
            width: 88px;
            height: 34px;
            line-height: 34px;
            padding: 0;
            font-size: 15px;
            font-weight: 400;
          }
        }
      }
    }
  }
}
::v-deep.el-collapse {
  background-color: rgb(247, 248, 250) !important;
}
::v-deep.el-collapse,
.el-collapse-item__wrap {
  background-color: rgb(247, 248, 250) !important;
}
::v-deep .el-collapse-item__header {
  color: #000;
  background-color: rgb(247, 248, 250) !important;
}
::v-deep .el-collapse-item__content {
  color: #000;
  background-color: rgb(247, 248, 250) !important;
}
.SrDialogSelect {
  ::v-deep .el-input {
    display: none;
  }
}
.everydaytrouble {
  width: 100%;
  height: 100%;
  padding: 20px;
  padding-top: 0;
  background-color: #fff;
  overflow: auto;
  ::v-deep .selectWidthCustom {
    width: 153px !important;
  }
}
.navBox {
  margin-bottom: 24px;
}
.cellSlotbox {
  display: flex;
  align-items: center;
}
::v-deep.sr_table .iconImg {
  width: 14px;
  height: 14px;
  margin-right: 4px;
  vertical-align: middle;
}
::v-deep.sr_search .el-select {
  width: 100% !important;
}
.content_left_list1 {
  width: 230px;
  margin-left: 16px;
  border-radius: 8px;
  color: rgba(0, 0, 0, 0.85);
  position: relative;
  // 信创小组左
  .listItem1 {
    width: 100%;
    height: 32px;
    margin-right: 10px;
    padding-left: 10px;
    padding-right: 10px;
    position: relative;
    line-height: 32px;
    border-radius: 8px;
    &:hover {
      background-color: #f7f7f7;
    }
    .label {
      position: absolute;
      display: inline-block;
      width: 170px;
      line-height: 22px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .el-radio {
      width: 100%;
      text-align: right;
      ::v-deep .el-radio__inner {
        border-radius: 50%;
      }
    }
  }
}
.el-collapse {
  border: none;
  background-color: #f7f7f7;
  border-radius: 8px;
  .el-collapse-item {
    ::v-deep .el-collapse-item__header {
      border: none;
      height: 32px;
      line-height: 32px;
      margin-bottom: 8px;
      background-color: #f7f7f7;
      padding-left: 5px;
      border-radius: 8px;
    }
    ::v-deep .el-collapse-item__content {
      padding-bottom: 0;
      background-color: #f7f7f7;
      margin-bottom: 8px;
      border-radius: 0 0 8px 8px;
    }
    ::v-deep .el-collapse-item__wrap {
      border: none;
    }
    // 处室左
    .listItem {
      /* display: flex;
      justify-content: space-between; */
      width: 100%;
      height: 32px;
      margin-right: 10px;
      margin-left: 5px;
      padding-left: 5px;
      padding-right: 20px;
      position: relative;
      .label {
        z-index: 100;
        position: absolute;
        display: inline-block;
        width: 170px;
        line-height: 22px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .el-radio {
        width: 100%;
        text-align: right;
        ::v-deep .el-radio__inner {
          border-radius: 50%;
        }
      }
    }
  }
}
// 右边公共多选框样式
.content_right_list1 {
  width: 230px;
  margin-left: 16px;
  border-radius: 8px;
  color: rgba(0, 0, 0, 0.85);
  position: relative;
  .el-radio {
    ::v-deep .el-radio__inner {
      border-radius: 50%;
    }
  }
}
.content_right_yx {
  height: 260px;
  overflow-y: auto;
}
.content_right_zq {
  // padding-top: 20px;
  height: 100px;
  overflow-y: auto;
}
.content_left {
  height: 450px !important;
}
.content_left_lists {
  height: 400px !important;
}
.content_left_kx {
  // width: 230px;
  height: 340px;
  overflow-y: auto;
}
.content_right_yx::-webkit-scrollbar {
  width: 2px;
  height: 9px;
  background-color: #969696;
}
.content_right_yx::-webkit-scrollbar-track {
  background: #e2e2e2;
  border-radius: 2px;
}
.content_right_yx::-webkit-scrollbar-thumb {
  background: #969696;
  border-radius: 8px;
}
.content_right_yx::-webkit-scrollbar-thumb:hover {
  background: #a5a5a5;
}
.content_right_yx::-webkit-scrollbar-corner {
  background: #969696;
}
.content_right_zq::-webkit-scrollbar {
  width: 2px;
  height: 9px;
  background-color: #969696;
}
.content_right_zq::-webkit-scrollbar-track {
  background: #e2e2e2;
  border-radius: 2px;
}
.content_right_zq::-webkit-scrollbar-thumb {
  background: #969696;
  border-radius: 8px;
}
.content_right_zq::-webkit-scrollbar-thumb:hover {
  background: #a5a5a5;
}
.content_right_zq::-webkit-scrollbar-corner {
  background: #969696;
}
.content_left_kx::-webkit-scrollbar {
  width: 2px;
  height: 9px;
  background-color: #969696;
}
.content_left_kx::-webkit-scrollbar-track {
  background: #e2e2e2;
  border-radius: 2px;
}
.content_left_kx::-webkit-scrollbar-thumb {
  background: #969696;
  border-radius: 8px;
}
.content_left_kx::-webkit-scrollbar-thumb:hover {
  background: #a5a5a5;
}
.content_left_kx::-webkit-scrollbar-corner {
  background: #969696;
}
.content_right_list1:hover .el-icon-close {
  display: inline-block;
}
.el-icon-close {
  float: right;
  background: #999;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  padding-left: 2px;
  padding-top: 2px;
  color: #fff;
  font-size: 12px;
  display: none;
  margin-top: 4px;
  &:hover {
    // display: block;
    background: #1890ff;
  }
}
.texts {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
