<template>
  <div
    class="everydaytrouble"
    v-if="
      $route.name == 'everydaytrouble' ||
        $shishiRouterList.includes($route.name)
    "
  >
    <navBox v-if="!hideSearchBtn" class="navBox" />
    <SrSearch
      v-if="!hideSearchBtn"
      :search="search"
      :searchExpand="true"
      :showTextBtns="true"
      :hideBtns="false"
      @queryList="pageChanged(1)"
    ></SrSearch>
    <SrTable
      @pageChanged="pageChanged"
      :data="table.data"
      @sizeChanged="sizeChanged"
      :config="table.tableConfig"
      @sortChange="sortChange"
      :page="table.page"
    >
      <template slot="cellSlot" slot-scope="{ scope }">
        <template v-if="scope.item.prop == 'levelName'">
          <div class="cellSlotbox" v-if="scope.row.problemLevel">
            <img
              class="iconImg"
              :src="levelImgFun(scope.row.problemLevel)"
              alt
            />
            {{ levelFun(scope.row.problemLevel) }}
          </div>
          <div v-else>
            -
          </div>
        </template>
        <template v-if="scope.item.prop == 'milestone'">
          <div v-if="scope.row.milestone">
            {{ milestoneFun(scope.row.milestone) }}
          </div>
          <div v-else>
            -
          </div>
        </template>
        <template v-if="scope.item.prop == 'problemSource'">
          <div v-if="scope.row.problemSource">
            {{ problemSourceFun(scope.row.problemSource) }}
          </div>
          <div v-else>
            -
          </div>
        </template>
        <template v-if="scope.item.prop == 'problemType'">
          <div v-if="scope.row.problemType">
            {{ problemTypeFun(scope.row.problemType) }}
          </div>
          <div v-else>
            -
          </div>
        </template>
      </template>
      <!-- <div
        slot="leftBottomSlot"
        v-if="!hideSearchBtn"
        class="back-btn"
        @click="backToList"
      >
        <i class="base-iconfont icon-return1"></i>
        <span>返回列表</span>
      </div> -->
    </SrTable>
    <BottomBtns v-if="!hideSearchBtn" @onBackClick="backToList"></BottomBtns>
  </div>
  <router-view v-else></router-view>
</template>
<script>
import store from "@/store";
import {
  listByTopicAndItem,
  api_userSetQuery,
  api_userSetSave,
} from "@/api/index.js";
import BottomBtns from "@/components/BottomBtns.vue";
import navBox from "@/components/navBox.vue";
import { permissionCode, TYPELIST, SOURCELIST } from "./const.js";
import { api_getPage, api_delelteProblemById } from "@/api/riskAndIssue";
import { api_queryStageList } from "@/api/shishi/taskList.js";
import { queryByUnitType } from "@/api/bianzhi/index";
export default {
  components: {
    navBox,
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
            type: "text",
            placeholder: "请输入问题关键词",
            bind: "problemName", // 对应this.search.data对象的field1
          },
          {
            type: "select",
            placeholder: "请选择问题级别",
            bind: "problemLevel",
            data: "everydaytroubleList", // 对应enum中的stateList
            class: "selectWidthCustom",
          },
          {
            type: "select",
            placeholder: "请选择提出人",
            bind: "proposer",
            data: "proposerNameList", // 对应enum中的stateList
            class: "selectWidthCustom",
          },
        ],
        enum: {
          // 搜索项下拉数据
          everydaytroubleList: [],
        },
        btns: [
          {
            name: "新建问题",
            click: this.add,
            type: "primary",
            permissionCode: "M005_003_002_007",
          },
        ],
        formData: {
          problemName: "",
          problemLevel: "",
          proposer: "",
        },
      },
      table: {
        data: [], // 表格数据
        tableConfig: {
          // rowClassName: this.rowClassName,
          title: "表格的标题", // 表格标题
          highlightCurrentRow: false, // 控制表格是否单选
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
              name: "查看", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "see", // 点击执行该页面methods中对应的方法
              // field: "id", // 控制按钮显示隐藏的字段，目前仅支持单一字段，常显的按钮不需要传
              // value: [1, 2], // 需要根据字段控制按钮显示隐藏，当state值不等于该数组的任何一个值的时候显示。逻辑this.table.data的某条数据state!=1&&state!=2时显示该行的这个按钮
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
              // code: "2334455", // 按钮的唯一值,用于角色按钮权限控制，不传默认不进行权限控制
            },
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
              code: "M005_003_002_008", // 按钮的唯一值,用于角色按钮权限控制，不传默认不进行权限控制
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
              code: "M005_003_002_009", // 按钮的唯一值,用于角色按钮权限控制，不传默认不进行权限控制
              reverse: true,
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
              code: "M005_003_002_010", // 按钮的唯一值,用于角色按钮权限控制，不传默认不进行权限控制
              validate: this.btnValidate,
            },
            {
              name: "关闭",
              method: "dispose",
              type: "text",
              size: "medium",
              // field: "status",
              // value: ["1",'2'],
              reverse: true,
              icon: "el-icon-document",
              className: "font-size-20",
              code: "M005_003_002_010", // 按钮的唯一值,用于角色按钮权限控制，不传默认不进行权限控制
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
          pageNo: 1, //当前页
          background: true,
          // layout: 'total, prev, pager, next, sizes,jumper'
        },
      },
      isTableHeaderId: null,
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
      this.getListByTopicAndItem();
      this.stage();
      this.projectMember();
    },
    async projectMember() {
      queryByUnitType({ projectId: this.$route.query.projectId }).then(
        (res) => {
          if (res.msg.code == "0000") {
            let allmember = [
              ...res.data["JSDW"].members,
              ...res.data["JSDW"].principals,
              ...res.data["CJDW"].members,
              ...res.data["CJDW"].principals,
              ...res.data["JLDW"].members,
              ...res.data["JLDW"].principals,
            ];
            let Fzr_data = [];
            for (let i = 0; i < allmember.length; i++) {
              var map = {
                fullname: allmember[i].fullname,
                mobile: allmember[i].mobile,
                jfid: allmember[i].jfid,
                dataName: allmember[i].fullname,
                dataValue: allmember[i].jfid,
              };
              var cannotadd = false;
              for (var j = 0; j < Fzr_data.length; j++) {
                if (Fzr_data[j].jfid == allmember[i].jfid) {
                  cannotadd = true;
                  break;
                }
              }
              if (!cannotadd) {
                Fzr_data.push(map);
              }
            }
            // 提出人
            this.$set(
              this.search.enum,
              "proposerNameList",
              this.$utils.enumsDataNameValue(
                Fzr_data,
                "fullname",
                "jfid",
                "label",
                "value"
              )
            );
          }
        }
      );
    },
    backToList() {
      this.routeClose();

      this.$router.push({ name: "riskAndIssue" });
    },
    problemSourceFun(val) {
      let arr = SOURCELIST;
      return this.$utils.arrFind(arr, val, "value")?.label;
    },
    problemTypeFun(val) {
      let arr = TYPELIST;
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
        pageNo: this.table.page.pageNo,
        pageSize: this.table.page.pageSize,
      };
      const searchForms = this.search.formData;
      Object.keys(searchForms).map((item) => {
        if (this.$utils.isEmpty(searchForms[item])) {
          param[item] = searchForms[item];
        }
      });

      if (this.viewProjectId) {
        param.projectId = this.viewProjectId;
      }

      if (this.$route.query.projectId) {
        param.projectId = this.$route.query.projectId;
      }
      if (this.hideSearchBtn) {
        // 查看对应里程碑的风险
        if (this.$route.query.stageId) {
          param.milestone = this.$route.query.stageId;
        }
      }
      api_getPage(param).then((res) => {
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
            this.table.tableConfig.header = headerData.filter(
              (item) => item.isShow
            );
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
          templateId: val.templateId,
          processId: val.processId,
        },
      });
    },
    dispose(val) {
      this.$router.push({
        name: "everydaytroubleDispose",
        query: {
          id: val.id,
          projectId: val.projectId,
          templateId: val.templateId,
          processId: val.processId,
        },
      });
    },
    see(val) {
      this.$router.push({
        name: "everydaytroubleView",
        query: {
          id: val.id,
          projectId: val.projectId,
          templateId: val.templateId,
          processId: val.processId,
          backName: this.backName ? this.backName : null,
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
                this.table.page.pageNo = this.table.page.pageNo - 1;
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
        name: "everydaytroubleEdit",
        query: {
          id: val.id,
          projectId: val.projectId,
          templateId: val.templateId,
        },
      });
    },
    pageChanged(val) {
      this.table.page.pageNo = val;
      this.getTbData();
    },
    sizeChanged(val) {
      this.table.page.pageNo = 1;
      this.table.page.pageSize = val;
      this.getTbData();
    },
    routeClose() {
      this.$SrUtils.routeClose.call(this, "subimpl", this.$setState);
    },
    add() {
      if (this.$route.query.projectId) {
        this.$router.push({
          name: "everydaytroubleAdd",
          query: { projectId: this.$route.query.projectId },
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
    btnValidate(row, item) {
      if (
        row.name == "编辑" &&
        this.$utils.checkCodeInArr(row.code) &&
        !this.hideSearchBtn &&
        item.projectProblemOperationVo.canUpdate
      ) {
        return true;
      }

      if (
        row.name == "删除" &&
        this.$utils.checkCodeInArr(row.code) &&
        !this.hideSearchBtn &&
        item.projectProblemOperationVo.canDelete
      ) {
        return true;
      }

      if (
        row.name == "处理" &&
        this.$utils.checkCodeInArr(row.code) &&
        !this.hideSearchBtn &&
        item.projectProblemOperationVo.canHandle &&
        item.statusName == "待处理"
      ) {
        return true;
      }
      if (
        row.name == "关闭" &&
        this.$utils.checkCodeInArr(row.code) &&
        !this.hideSearchBtn &&
        item.projectProblemOperationVo.canHandle &&
        item.statusName == "已处理"
      ) {
        return true;
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
.everydaytrouble {
  width: 100%;
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
</style>
