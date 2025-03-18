<template>
  <div class="task-list-page">
    <div class="nav-box" v-if="!hideSearchBtn">
      <sr-nav-page
        :project="srNavPageObj"
        :type="2"
        v-if="srNavPageObj"
      ></sr-nav-page>
    </div>
    <div class="searchPage" v-if="!hideSearchBtn">
      <SrSearch
        :search="search"
        :searchExpand="true"
        :showTextBtns="true"
        :hideBtns="false"
        @queryList="pageChanged(1)"
      ></SrSearch>
    </div>
    <SrTable
      ref="SrTable"
      @pageChanged="pageChanged"
      :data="table.data"
      @sizeChanged="sizeChanged"
      @sortChange="sortChange"
      :config="table.tableConfig"
      :page="table.page"
    >
      <template slot="cellSlot" slot-scope="scope">
        <div class="prioritybox" v-if="scope.scope.item.prop == 'priorityLevel'">
          <img
            class="priority-icon"
            v-if="scope.scope.row.priorityLevel == '特急'"
            src="@/assets/riskTrouble/high.png"
          />
          <img
            class="priority-icon"
            v-else-if="scope.scope.row.priorityLevel == '紧急'"
            src="@/assets/riskTrouble/middle.png"
          />
          <img
            class="priority-icon"
            v-else
            src="@/assets/riskTrouble/low.png"
          />
          <span>{{ scope.scope.row.priorityLevel }}</span>
        </div>
        <div v-else-if="scope.scope.item.prop == 'evaluateName'">
          <el-popover
            v-if="scope.scope.row.evaluateName == '已评价'"
            placement="top-start"
            width="418"
            trigger="hover"
          >
            <TaskRateView
              :rateInfo="scope.scope.row.evaluateContent"
            ></TaskRateView>
            <span class="pointer" slot="reference">{{
              scope.scope.row.evaluateName
            }}</span>
          </el-popover>
          <span v-else>{{ scope.scope.row.evaluateName }}</span>
        </div>
      </template>
      <!-- <div slot="leftBottomSlot" v-if="!hideSearchBtn" class="back-btn" @click="backToList">
        <i class="base-iconfont icon-return1"></i><span>返回列表</span>
      </div> -->
    </SrTable>
    <BottomBtns v-if="!hideSearchBtn" @onBackClick="backToList"></BottomBtns>
    <AddTaskDialog ref="addTask" @refreshList="onAddSucc"></AddTaskDialog>
    <TaskRate ref="rateTask" @refreshList="onAddSucc"></TaskRate>
  </div>
</template>

<script>
import {
  queryBizunitsByProperty,
  listByTopicAndItem,
  api_userSetQuery,
  api_userSetSave,
} from "@/api/index.js";
import { taskListPCode, priorityMap } from "../const.js";
import BottomBtns from "@/components/BottomBtns.vue";
import {
  api_getTaskList,
  api_querySubTask,
  api_deleteTask,
} from "@/api/shishi/taskList.js";
import { getDetailById } from "@/api/projectLibrary/index";
import AddTaskDialog from "./addTask.vue";
import TaskRateView from "../components/TaskRateView.vue";
import TaskRate from "../components/TaskRate.vue";
export default {
  props: {
    hideSearchBtn: Boolean,
  },
  components: {
    AddTaskDialog,
    TaskRate,
    TaskRateView,
    BottomBtns
  },
  watch: {
  },
  computed:{
    projectId() {
      return this.$route.query.projectId
    }
  },
  data() {
    return {
      maps: new Map(),
      isTableHeaderId: "",
      srNavPageObj: null,
      table: {
        data: [], // 表格数据
        tableConfig: {
          rowClassName: this.rowClassName,
          title: "表格的标题", // 表格标题
          rowKey: "taskId",
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
          innerBtn: [
            // 表格内部操作按钮，不需要操作列的innerBtn 写成false
            {
              name: "查看", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "see", // 点击执行该页面methods中对应的方法
            },
            {
              name: "子任务",
              method: "createChildTask",
              type: "text",
              size: "small",
              icon: "el-icon-document",
              className: "font-size-20",
              validate: this.btnValidate, //自定义判断是否展示按钮权限
            },
            {
              name: "编辑",
              method: "edit",
              type: "text",
              size: "small",
              icon: "el-icon-document",
              className: "font-size-20",
              validate: this.btnValidate, //自定义判断是否展示按钮权限
            },
            {
              name: "处理",
              method: "dispose",
              type: "text",
              size: "small",
              icon: "el-icon-document",
              className: "font-size-20",
              validate: this.btnValidate, //自定义判断是否展示按钮权限
            },
            {
              name: "检查",
              method: "check",
              type: "text",
              size: "small",
              icon: "el-icon-document",
              className: "font-size-20",
              validate: this.btnValidate, //自定义判断是否展示按钮权限
            },
            {
              name: "评价",
              method: "evaluate",
              type: "text",
              size: "small",
              icon: "el-icon-document",
              className: "font-size-20",
              validate: this.btnValidate, //自定义判断是否展示按钮权限
            },
            {
              name: "删除",
              method: "delete",
              type: "text",
              size: "medium",
              icon: "el-icon-document",
              className: "font-size-20",
              validate: this.btnValidate, //自定义判断是否展示按钮权限
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
            placeholder: "责任人",
            bind: "responsibleName", // 对应this.search.data对象的field1
            disabled: false,
            class: "txt_responsibleName",
          },
          {
            type: "text",
            placeholder: "请输入任务名称",
            bind: "taskName", // 对应this.search.data对象的field1
            disabled: false,
            class: "txt_taskName",
          },
        ],
        enum: {},
        btns: [
          {
            name: "创建任务",
            click: this.add,
            type: "primary",
            permissionCode: "M005_003_001_001",
          },
        ],
        formData: {
          taskName: "",
          responsibleName: "",
          orderByColumn: "", // 基于哪个字段排序
          orderBy: ""// DESC降序, ASC升序
        },
      },
    };
  },
  methods: {
    backToList() {
      this.$router.push({name: 'taskProjectList'})
    },
    refreshChildList(parentId) {
      if (parentId && this.maps.has(parentId)) {
        this.$refs.SrTable.clearLazyTreeNodeMap(parentId);
        const { tree, treeNode, resolve } = this.maps.get(parentId);
        this.load(tree, treeNode, resolve);
      }
    },
    onAddSucc(parentId) {
      if (parentId) {
        this.refreshChildList(parentId);
      }
      this.pageChanged(1);
    },
    getProjectDetail() {
      getDetailById({ id: this.projectId }).then((res) => {
        if (res && res.success) {
          this.srNavPageObj = res.data;
        }
      });
    },
    getTbHeader() {
      api_userSetQuery({ permissionCode: taskListPCode }).then((res) => {
        this.isTableHeaderId = res.data.id;
        let headerData = JSON.parse(res.data.data).sort(
          (a, b) => a.index - b.index
        );
        this.table.tableConfig.operateConfig.allTableHeader = headerData;
        this.table.tableConfig.header = headerData.filter((item) => {
          if (item.prop == "num") {
            item.width = "80px";
          }
          if (item.prop == "priorityLevel") {
            item.cellSlot = true;
          }
          if (item.prop == "evaluateName") {
            item.cellSlot = true;
          }
          if (item.prop == "taskProportion" ||item.prop == "priorityLevel"||item.prop =="startTime" ||item.prop =="taskProgress") {
            item.sortable = 'custom';
          }

          return item.isShow;
        });
        
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
    sortChange(column) {
      if (column.order === "ascending") {
        this.search.formData['orderByColumn'] = column.prop
        this.search.formData['orderBy'] = 'ASC'
      } else if (column.order === "descending") {
        this.search.formData['orderByColumn'] = column.prop
        this.search.formData['orderBy'] = 'DESC'
      } else {
        this.search.formData['orderByColumn'] = ''
        this.search.formData['orderBy'] = ''
      }
      this.getTbData()
    },
    getTbData() {
      let param = {
        pageNum: this.table.page.pageNum,
        pageSize: this.table.page.pageSize,
        projectId: this.projectId,
        ...this.search.formData,
      };
      if (this.hideSearchBtn) {
        // 嵌套在里程碑审查
        if (this.$route.query.stageId) {
          param['stageId'] = this.$route.query.stageId
        }
      }
      if (param.orderByColumn == '') {
        delete param.orderByColumn
      }
      if (param.orderBy == '') {
        delete param.orderBy
      }
      api_getTaskList(param).then((res) => {
        if (res) {
          this.table.page.pages = res.data.pages;
          this.table.page.total = res.data.total;
          if (res.data.records && res.data.records.length > 0) {
            res.data.records.map((item) => {
              item.priorityLevel = priorityMap[item.priorityLevel];
              // if (item.taskProportion) {
              //   item.taskProportion += "%";
              // }
            });
          }
          this.table.data = res.data.records;
        } else {
          this.table.data = [];
        }
      });
    },
    saveHeaderList(data) {
      api_userSetSave({
        data: JSON.stringify(data),
        permissionCode: taskListPCode,
        id: this.isTableHeaderId,
      }).then((res) => {
        if (res.msg.code == "0000") {
          this.getTbData();
          this.getTbHeader();
        }
      });
    },
    see(row) {
      this.$router.push({
        name: "taskView",
        query: { taskId: row.taskId },
      });
    },
    add() {
      this.$refs.addTask.init();
    },
    btnValidate(row, item) {
      if (item.operations) {
        if (row.name == "子任务" && item.operations.canCreateSubtask) {
          return true;
        }
        if (row.name == "编辑" && item.operations.canUpdate) {
          return true;
        }
        if (row.name == "处理" && item.operations.canDispose) {
          return true;
        }
        if (row.name == "检查" && item.operations.canCheck) {
          return true;
        }
        if (row.name == "评价" && item.operations.canEvaluate) {
          return true;
        }
        if (row.name == "删除" && item.operations.canDelete) {
          return true;
        }
      } else {
        return false;
      }
    },
    createChildTask(row) {
      this.$refs.addTask.init(row.taskId, true);
    },
    edit(row) {
      this.$refs.addTask.init(row.taskId);
    },
    dispose(row) {
      this.$router.push({
        name: "taskDispose",
        query: { taskId: row.taskId },
      });
    },
    check(row) {
      this.$router.push({
        name: "taskCheck",
        query: { taskId: row.taskId },
      });
    },
    evaluate(row) {
      this.$refs["rateTask"].init(row);
    },
    delete(row) {
      this.$SrUtils.showConfirmMessage.call(this, {
        title: '提示',
        content: '此操作将删除此任务, 是否继续?',
        okFun: () => {
          api_deleteTask({ taskId: row.taskId }).then((res) => {
            if (res && res.success) {
              this.$message({
                type: "success",
                message: "删除成功",
              });
              if (this.table.data.length == 1) {
                this.table.page.pageNum = this.table.page.pageNum - 1;
              }
              if (row.parentId) {
                this.refreshChildList(row.parentId);
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
        }
      })
    },
    load(tree, treeNode, resolve) {
      let param = {
        taskId: tree.taskId,
      };
      let pid = tree.taskId;
      this.maps.set(pid, { tree, treeNode, resolve });
      api_querySubTask(param).then((res) => {
        if (res && res.success) {
          let list = [];
          list = res.data.map((item) => {
            item.num = tree.num + "." + item.num;
            item.priorityLevel = priorityMap[item.priorityLevel];
            // if (item.taskProportion) {
            //   item.taskProportion += "%";
            // }
            if (!this.hideSearchBtn) {
              item.btns = [
                {
                  name: "查看", // 按钮名称，优先显示icon
                  type: "text",
                  size: "small",
                  method: "see",
                },
              ];
              if (item.operations) {
                if (item.operations.canUpdate) {
                  item.btns.push({
                    name: "编辑",
                    method: "edit",
                    type: "text",
                    size: "small",
                    icon: "el-icon-document",
                    className: "font-size-20",
                  });
                }
                if (item.operations.canDispose) {
                  item.btns.push({
                    name: "处理",
                    method: "dispose",
                    type: "text",
                    size: "medium",
                    icon: "el-icon-document",
                    className: "font-size-20",
                  });
                }
                if (item.operations.canCheck) {
                  item.btns.push({
                    name: "检查",
                    method: "check",
                    type: "text",
                    size: "medium",
                    icon: "el-icon-document",
                    className: "font-size-20",
                  });
                }
                if (item.operations.canEvaluate) {
                  item.btns.push({
                    name: "评价",
                    method: "evaluate",
                    type: "text",
                    size: "medium",
                    icon: "el-icon-document",
                    className: "font-size-20",
                  });
                }
                if (item.operations.canDelete) {
                  item.btns.push({
                    name: "删除",
                    method: "delete",
                    type: "text",
                    size: "medium",
                    icon: "el-icon-document",
                    className: "font-size-20",
                  });
                }
              }
            } else {
              item.btns = [];
            }

            return item;
          });
          resolve(list);
        }
      });
    },
  },
  created() {
    if (this.hideSearchBtn) {
      this.$set(this.table.tableConfig.operateConfig, "display", false);
    }
    this.getTbHeader();
    this.getTbData();
    this.getProjectDetail();
  },
};
</script>
<style lang="scss" scoped>
.searchPage {
  ::v-deep {
    .txt_responsibleName {
      width: 112px !important;
    }
    .txt_taskName {
      width: 240px !important;
    }
  }
}
.task-list-page {
  .nav-box {
    margin-bottom: 24px;
  }
}
.prioritybox{
  display: flex;
  align-items: center;
}
.priority-icon {
  width: 14px;
  margin-right: 6px;
  vertical-align: middle;
}
.pointer {
  cursor: pointer;
}
</style>
