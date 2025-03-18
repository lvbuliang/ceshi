<template>
  <div class="task-list-page-bianzhi">
    <div class="searchPage">
      <SrSearch
        :search="search"
        :searchExpand="true"
        :showTextBtns="true"
        :hideBtns="false"
        @queryList="pageChanged(1)"
      ></SrSearch>
      <span class="title">任务设置</span>
    </div>
    <SrTable
      @pageChanged="pageChanged"
      :data="table.data"
      @sizeChanged="sizeChanged"
   
      :config="table.tableConfig"
      :page="table.page"
    >
    <template slot="cellSlot" slot-scope="scope">
        <div v-if="scope.scope.item.prop == 'priorityLevel'">
          <img
            class="priority-icon"
            v-if="scope.scope.row.priorityLevelName == '特急'"
            src="@/assets/riskTrouble/high.png"
          />
          <img
            class="priority-icon"
            v-else-if="scope.scope.row.priorityLevelName == '紧急'"
            src="@/assets/riskTrouble/middle.png"
          />
          <img
            class="priority-icon"
            v-else
            src="@/assets/riskTrouble/low.png"
          />
          <span>{{ scope.scope.row.priorityLevelName }}</span>
        </div>
      </template></SrTable>
    <AddTaskDialog ref="addTask" @refreshList="pageChanged(1)"></AddTaskDialog>
  </div>
</template>

<script>
import {
  queryBizunitsByProperty,
  listByTopicAndItem,
  api_userSetQuery,
  api_userSetSave,
} from "@/api/index.js";
import { taskListPCode } from "../../task/const.js";
import {
  api_getTaskList,
  api_querySubTask,
  api_deleteTask,
} from "@/api/shishi/taskList.js";
import { getRWlist, deleteRWlist } from "@/api/bianzhi/index.js";
import { priorityMap } from "../const.js";

import { getDetailById } from "@/api/projectLibrary/index";
import AddTaskDialog from "../components/addTask.vue";
export default {
  components: {
    AddTaskDialog,
  },
  watch: {
    "table.data": {
      handler(val) {},
    },
  },
  data() {
    return {
      isTableHeaderId: "",
      loading: false,
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
            display: this.$route.name == "bianzhiInitiateDetail" ? true : false,
            label: "操作",
            width: "156",
            fixed: "right",
            allTableHeader: "",
            saveHeaderList: this.saveHeaderList,
          },
          innerBtn:
            this.$route.name == "bianzhiInitiateDetail"
              ? [
                  {
                    name: "编辑",
                    method: "edit",
                    type: "text",
                    size: "small",
                    icon: "el-icon-document",
                    className: "font-size-20",
                  },
                  {
                    name: "删除",
                    method: "delete",
                    type: "text",
                    size: "medium",
                    icon: "el-icon-document",
                    className: "font-size-20",
                  },
                ]
              : [],
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
        nosearch: true,
        size: "small",
        labelConfig: {
          labelWidth: "90px",
          labelSuffix: ":",
          labelPosition: "right",
        },
        config: [],
        enum: {},
        btns:
          this.$route.name == "bianzhiInitiateDetail"
            ? [
                {
                  name: "创建任务",
                  click: this.add,
                  type: "primary",
                  permissionCode: "M005_003_001_001",
                },
              ]
            : [],
        formData: {
          taskName: "",
          responsibleName: "",
        },
      },
    };
  },
  methods: {
    getProjectDetail() {
      getDetailById({ id: this.$route.query.id }).then((res) => {
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
        var indexdata = 0;
        for(var i=0;i<headerData.length;i++){
          if(headerData[i].prop =='evaluateName'){
            indexdata = i;
            break
          }
        }
        headerData.splice(indexdata,1)
        this.table.tableConfig.operateConfig.allTableHeader = headerData;
        this.table.tableConfig.header = headerData.filter((item) => {
          if (item.prop == "num") {
            item.width = "80px";
          }
          if (item.prop == "priorityLevel") {
            item.cellSlot = true;
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
    getTbData() {
      let param = {
        projectId: this.$route.query.id,
      };
      this.loading = true;
      getRWlist(param).then((res) => {
        if (res) {
          for (var i = 0; i < res.data.length; i++) {
            res.data[i].num = i + 1;
            res.data[i].statusName = '待处理';
            res.data[i].priorityLevelName = priorityMap[res.data[i].priorityLevel];
          }
          
          this.table.data = res.data;
        } else {
          this.table.data = [];
        }

        this.loading = false;
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
    // createChildTask(row) {
    //   this.$refs.addTask.init(row.id, true)
    // },
    edit(row) {
      this.$refs.addTask.init(row);
    },

    evaluate() {
      alert("evaluate");
    },
    delete(row) {
      this.$SrUtils.showConfirmMessage.call(this, {
        title: "提示",
        content: "此操作将删除此任务, 是否继续?",
        okFun: () => {
          deleteRWlist({ taskId: row.id }).then((res) => {
            if (res && res.success) {
              this.$message({
                type: "success",
                message: "删除成功",
              });
              if (this.table.data.length == 1) {
                this.table.page.pageNum = this.table.page.pageNum - 1;
              }
              this.table.data = [];
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
    load(tree, treeNode, resolve) {
      console.log(resolve);
      let param = {
        taskId: tree.taskId,
      };
      api_querySubTask(param).then((res) => {
        if (res && res.success) {
          let list = res.data.map((item) => {
            item.num = tree.num + "." + item.num;
            return item;
          });
          resolve(list);
        }
      });
    },
  },
  created() {
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
.task-list-page-bianzhi {
  .searchPage {
    position: relative;
    margin-bottom: 46px;
    .title {
      position: absolute;
      top: 5px;
      height: 22px;
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 700;
      color: #333333;
      line-height: 22px;
    }
    ::v-deep .sr_search .search-btn{
      padding-bottom: 0px!important;
    }
  }
  .nav-box {
    margin-bottom: 24px;
  }
}
</style>
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
.priority-icon {
  width: 14px;
  margin-right: 6px;
  vertical-align: middle;
}
.pointer {
  cursor: pointer;
}
</style>
