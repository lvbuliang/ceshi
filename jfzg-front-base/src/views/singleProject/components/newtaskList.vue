<template>
  <div class="task-list-page">
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
        <div class="prioritybox"  v-if="scope.scope.item.prop == 'priorityLevel'">
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
    </SrTable>
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
import {
  api_getTaskList,
  api_querySubTask,
  api_deleteTask,
} from "@/api/shishi/taskList.js";
import { getDetailById } from "@/api/projectLibrary/index";
import TaskRateView from "./TaskRateView.vue";
export default {
  props: {
    hideSearchBtn: Boolean,
  },
  components: {
    TaskRateView,
  },
  watch: {
    "table.data": {
      handler(val) {
        console.log("table.data.val", val);
      },
    },
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
            }
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
    getTbHeader() {
      api_userSetQuery({ permissionCode: taskListPCode }).then((res) => {
        this.isTableHeaderId = res.data.id;
        let headerData = JSON.parse(res.data.data).sort(
          (a, b) => a.index - b.index
        );
        this.table.tableConfig.operateConfig.allTableHeader = headerData;
        
        this.table.tableConfig.header = headerData.filter((item) => {
          console.log(item);
          if (item.prop == "num") {
            item.width = "80px";
          }
          if (item.prop == "taskName") {
            item.width = "200px";
          }
          if (item.prop == "responsibleName") {
            item.width = "80px";
          }
          if (item.prop == "priorityLevel") {
            item.cellSlot = true;
            item.sortable = 'custom';
          }
          if (item.prop == "evaluateName") {
            item.cellSlot = true;
          }
          return item.isShow;
        });
        console.log("表头",this.table.tableConfig.header)
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
    getTbData() {
      let param = {
        pageNum: this.table.page.pageNum,
        pageSize: this.table.page.pageSize,
        projectId: this.projectId,
      };
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
        path: "/subimpl/#/taskmgr/taskView",
        query: { taskId: row.taskId },
      });
    },
    add() {
      this.$refs.addTask.init();
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
      console.log(resolve);
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
            if (item.taskProportion) {
              item.taskProportion += "%";
            }
              item.btns = [];
            return item;
          });
          resolve(list);
        }
      });
    },
  },
  created() {
    this.$set(this.table.tableConfig.operateConfig, "display", false);
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
    /deep/ .sr_table {
    .sr_table_bottom {
      display: none !important;
    }
  }
  .nav-box {
    margin-bottom: 24px;
  }
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
