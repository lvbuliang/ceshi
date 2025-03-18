<template>
  <div
    class="everydayrisk"
    v-if="
      $route.name == 'everydayriskNew' ||
      $shishiRouterList.includes($route.name)
    "
  >
    <!-- <navBox v-if="!hideSearchBtn" class="navBox" /> -->
    <!-- <div class="conTitle">
      <div class="sys">
        <span class="sysText">系统名称:</span>
        <span class="ml-10">{{ systemName }}</span>
      </div>
      <div class="pro">
        <span class="sysText">项目名称:</span>
        <span class="ml-10">{{ projectName }}</span>
      </div>
    </div> -->
    <SrSearch
      v-if="!hideSearchBtn"
      :search="search"
      :searchExpand="true"
      :showTextBtns="true"
      :hideBtns="false"
      @queryList="pageChanged(1)"
    >
    </SrSearch>
    <SrTable
      @pageChanged="pageChanged"
      :data="table.data"
      @sizeChanged="sizeChanged"
      :config="table.tableConfig"
      :page="table.page"
      @sortChange="sortChange"
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
      <template slot="level" slot-scope="{ scope }">
        <template v-if="scope.item.prop == 'level'">
          <div class="cellSlotbox" v-if="scope.row.level">
            <!-- <img class="iconImg" :src="levelImgFun(scope.row.level)" alt /> -->
            {{ levelFun(scope.row.level) }}
            <!-- {{ scope.row.level }}12 -->
          </div>
          <div v-else>-</div>
        </template>
      </template>
      <template slot="type" slot-scope="{ scope }">
        <template v-if="scope.item.prop == 'type'">
          <div class="cellSlotbox" v-if="scope.row.type">
            <!-- <img class="iconImg" :src="levelImgFun(scope.row.level)" alt /> -->
            {{ typeFun(scope.row.type) }}
            <!-- {{ scope.row.level }}12 -->
          </div>
          <div v-else>-</div>
        </template>
      </template>
      <template slot="status" slot-scope="{ scope }">
        <template v-if="scope.item.prop == 'status'">
          <div class="cellSlotbox" v-if="scope.row.status">
            <!-- <img class="iconImg" :src="levelImgFun(scope.row.level)" alt /> -->
            {{ statusFun(scope.row.status) }}
            <!-- {{ scope.row.level }}12 -->
          </div>
          <div v-else>-</div>
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

  <div v-else>
    <router-view></router-view>
  </div>
</template>
<script>
import store from "@/store";
import { permissionCode, TYPELIST, SOURCELIST, LEVEILIST } from "./const.js";
import navBox from "@/components/navBox.vue";
import BottomBtns from "@/components/BottomBtns.vue";
import { queryByUnitType } from "@/api/bianzhi/index";
import {
  listByTopicAndItem,
  api_userSetQuery,
  api_userSetSave,
} from "@/api/index.js";
import {
  queryRiskPage,
  api_delete,
  exportRiskByName,
} from "@/api/riskAndIssueNew";
import { api_queryStageList } from "@/api/shishi/taskList.js";

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
            type: "select",
            placeholder: "请选择风险类型",
            bind: "type",
            data: "typeList", // 对应enum中的stateList
            class: "selectWidthCustom",
          },
          {
            type: "select",
            placeholder: "请选择风险等级",
            bind: "level",
            data: "everydayriskList", // 对应enum中的stateList
            class: "selectWidthCustom",
          },
          {
            type: "select",
            placeholder: "请选择风险状态",
            bind: "status",
            data: "statusList", // 对应enum中的stateList
            class: "selectWidthCustom",
          },
        ],
        enum: {
          // 搜索项下拉数据
          typeList: [
            {
              label: "内部风险",
              value: "1",
            },
            {
              label: "外部风险",
              value: "2",
            },
            {
              label: "云网风险",
              value: "3",
            },
          ],
          everydayriskList: [
            {
              label: "轻度",
              value: "0",
            },
            {
              label: "中度",
              value: "1",
            },
            {
              label: "高度",
              value: "2",
            },
          ],
          statusList: [
            {
              label: "处理中",
              value: "1",
            },
            {
              label: "已处理",
              value: "2",
            },
            {
              label: "关闭",
              value: "3",
            },
          ],
        },
        btns: [
          {
            name: "新建风险",
            click: this.add,
            type: "primary",
            permissionCode: "M005_010_004",
          },
          {
            name: "导出",
            click: this.exprotByCondition,
            type: "default",
            permissionCode: "M005_010_009",
          },
        ],
        formData: {
          riskName: "",
          level: "",
          status: "",
          projectId: "",
          proposeTime: "",
          type: "",
        },
      },
      table: {
        data: [], // 表格数据
        tableConfig: {
          // rowClassName: this.rowClassName,
          title: "表格的标题", // 表格标题
          highlightCurrentRow: false, // 控制表格是否单选
          // maxLength: 20, // 一行最多显示多少字，超出显示popver
          // load: this.load,
          tooltipEffect: "light",
          header: [],
          selectionConfig: {
            display: false,
            width: "70",
          },
          emptyConfig: {
            // 表格数据为空时默认显示的内容
            display: true,
            emptyNull: "暂无风险",
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
              validate: this.btnValidate,
            },
            {
              name: "编辑",
              method: "edit",
              type: "text",
              size: "small",
              field: "status",
              value: ["4"],
              icon: "el-icon-document",
              // code: "M005_003_002_004", // 按钮的唯一值,用于角色按钮权限控制，不传默认不进行权限控制
              className: "font-size-20",
              validate: this.btnValidate,
            },
            // {
            //   name: "删除",
            //   method: "delete",
            //   type: "text",
            //   size: "medium",
            //   icon: "el-icon-document",
            //   // code: "M005_003_002_005", // 按钮的唯一值,用于角色按钮权限控制，不传默认不进行权限控制
            //   className: "font-size-20",
            //   // validate: this.btnValidate,
            // },
            {
              name: "处理",
              method: "dispose",
              type: "text",
              size: "medium",
              icon: "el-icon-document",
              className: "font-size-20",
              // code: "M005_003_002_006", // 按钮的唯一值,用于角色按钮权限控制，不传默认不进行权限控制
              validate: this.btnValidate,
            },
            // {
            //   name: "关闭",
            //   method: "dispose",
            //   type: "text",
            //   size: "medium",
            //   field: "status",
            //   value: ["4"],
            //   icon: "el-icon-document",
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
          pageNo: 1, //当前页
          background: true,
          // layout: 'total, prev, pager, next, sizes,jumper'
        },
      },
      isTableHeaderId: null,
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
    init() {
      this.getTbHeader();
      this.getTbData();
      this.systemName = this.$route.query.systemName;
      this.projectName = this.$route.query.projectName;
      // this.getListByTopicAndItem();
      // this.stage();
    },
    backToList() {
      this.routeClose();

      this.$router.push({ name: "riskAndIssueNew" });
    },
    routeClose() {
      this.$SrUtils.routeClose.call(this, "subimpl", this.$setState);
    },
    riskSourceFun(val) {
      let arr = SOURCELIST;
      return this.$utils.arrFind(arr, val, "value")?.label;
    },
    riskTypeFun(val) {
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
      let arr = this.search.enum.everydayriskList;
      return this.$utils.arrFind(arr, val, "value")?.label;
    },
    typeFun(val) {
      let arr = this.search.enum.typeList;
      return this.$utils.arrFind(arr, val, "value")?.label;
    },
    // statusFun
    statusFun(val) {
      let arr = this.search.enum.statusList;
      return this.$utils.arrFind(arr, val, "value")?.label;
    },
    /* milestoneFun(val) {
      let arr = this.milestoneList;
      return this.$utils.arrFind(arr, val, "value")?.label;
    }, */
    async stage() {
      // 获取里程碑
      if (this.$route.query.projectId) {
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
      }
    },
    getListByTopicAndItem() {
      // 获取风险等级
      listByTopicAndItem({ topic: "JFZG_PROJECTRISK_LEVEL" }).then((res) => {
        if (res?.data) {
          this.$set(
            this.search.enum,
            "everydayriskList",
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
      // 获取风险类型
      listByTopicAndItem({ topic: "JFZG_PROJECTRISK_TYPE" }).then((res) => {
        if (res?.data) {
          this.$set(
            this.search.enum,
            "typeList",
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
        param.contractId = this.$route.query.contractId;
        param.sectionCount = this.$route.query.sectionCount;
        param.sectionSort = this.$route.query.sectionSort;
      }
      // if (this.hideSearchBtn) {
      //   // 查看对应里程碑的风险
      //   if (this.$route.query.stageId) {
      //     param.stageId = this.$route.query.stageId;
      //   }
      // }
      queryRiskPage(param).then((res) => {
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
        if (res.data) {
          this.isTableHeaderId = res.data.id;
          let headerData = JSON.parse(res.data.data).sort(
            (a, b) => a.index - b.index
          );
          this.table.tableConfig.operateConfig.allTableHeader = headerData;
          this.table.tableConfig.header = headerData.filter((item) => {
            if (
              item.prop == "level" ||
              item.prop == "proposeTime" ||
              item.prop == "updateTime"
            ) {
              item.sortable = "custom";
            }
            return item.isShow;
          });
        }
      });
    },
    workView(val) {
      this.$router.push({
        name: "everydayriskViewNew",
        query: {
          id: val.id,
          projectId: val.projectId,
          processId: val.processId,
          templateId: val.templateId,
          processId: val.processId,
          systemName: this.$route.query.systemName,
          projectName: this.$route.query.projectName,
          contractId: this.$route.query.contractId,
          sectionCount: this.$route.query.sectionCount,
          sectionSort: this.$route.query.sectionSort,
        },
      });
    },
    dispose(val) {
      this.$router.push({
        name: "everydayriskDisposeNew",
        query: {
          id: val.id,
          projectId: val.projectId,
          contractId: this.$route.query.contractId,
          sectionCount: this.$route.query.sectionCount,
          sectionSort: this.$route.query.sectionSort,
          templateId: val.templateId,
          processId: val.processId,
          systemName: this.$route.query.systemName,
          projectName: this.$route.query.projectName,
        },
      });
    },
    see(val) {
      this.$router.push({
        name: "everydayriskViewNew",
        query: {
          id: val.id,
          projectId: val.projectId,
          contractId: this.$route.query.contractId,
          sectionCount: this.$route.query.sectionCount,
          sectionSort: this.$route.query.sectionSort,
          templateId: val.templateId,
          processId: val.processId,
          systemName: this.$route.query.systemName,
          projectName: this.$route.query.projectName,
          // backName: this.backName ? this.backName : null,
        },
      });
    },
    delete(row) {
      this.$SrUtils.showConfirmMessage.call(this, {
        title: "提示",
        content: "此操作将删除此数据, 是否继续?",
        okFun: () => {
          api_delete({ id: row.id }).then((res) => {
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
        name: "everydayriskEditNew",
        query: {
          id: val.id,
          projectId: val.projectId,
          contractId: this.$route.query.contractId,
          sectionCount: this.$route.query.sectionCount,
          sectionSort: this.$route.query.sectionSort,
          templateId: val.templateId,
          systemName: this.$route.query.systemName,
          projectName: this.$route.query.projectName,
          isEdit: true,
        },
      });
    },
    add() {
      // console.log(this.$route.query.projectId ,'w123123');
      if (this.$route.query.projectId) {
        this.$router.push({
          name: "everydayriskAddNew",
          query: {
            projectId: this.$route.query.projectId,
            contractId: this.$route.query.contractId,
            sectionCount: this.$route.query.sectionCount,
            sectionSort: this.$route.query.sectionSort,
            systemName: this.$route.query.systemName,
            projectName: this.$route.query.projectName,
          },
        });
      }
    },
    exprotByCondition() {
      console.log("导出");
      console.log(
        "this.formData, this.page.pageNum, this.page.pageSize",
        this.table.page.pageNum
      );
      let data2 = {
        level: this.search.formData.level,
        projectId: this.$route.query.projectId,
        contractId: this.$route.query.contractId,
        sectionCount: this.$route.query.sectionCount,
        status: this.search.formData.status,
        type: this.search.formData.type,
      };

      exportRiskByName(data2).then((res) => {
        console.log(res);
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
        fileName = "风险管理";
        link.setAttribute("download", decodeURIComponent(fileName)); // 使用URI解码而不是解码
        document.body.appendChild(link);
        link.click(); // 释放URL对象
        window.URL.revokeObjectURL(link.href);
        document.body.removeChild(link);
      });
    },
    pageChanged(val) {
      this.table.page.pageNo = val;
      this.getTbData();
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
    sizeChanged(val) {
      this.table.page.pageNo = 1;
      this.table.page.pageSize = val;
      this.getTbData();
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
        /* console.log(this.userInfo.currentRole.roleCode , item.roleCode,this.userInfo.jfid , item.proposer) */
        if (item.status != "2") {
          if (
            this.userInfo.jfid === item.proposer ||
            this.userInfo.currentRole.roleCode == "XMFZR"
          ) {
            return true;
          }
        }
      } else if (row.name == "处理") {
        if (item.status == "2") {
          return false;
        } else if (
          item.status != "2" &&
          (this.userInfo.jfid == item.processor ||
            this.userInfo.jfid == item.subContractorId)
        ) {
          return true;
        }
      } else if (row.name == "查看") {
        return true;
      }
      return false;
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
.SrDialogSelect {
  ::v-deep .el-input {
    display: none;
  }
}
.conTitle {
  font-size: 16px;
  // height: 100%;
  // width: 100%;
  background-color: rgb(241, 243, 246);
  display: flex;
  // align-items:
  // flex-direction: column;
  margin: 10px 0;
  margin-top: 0;
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
.navBox {
  margin-bottom: 24px;
}
.everydayrisk {
  width: 100%;
  background-color: #fff;
  padding: 20px;
  padding-top: 20px;
  height: 100%;
  overflow: auto;
  ::v-deep .selectWidthCustom {
    width: 153px !important;
  }
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
.texts {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
