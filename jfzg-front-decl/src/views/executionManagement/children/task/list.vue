<template>
  <div class="total-page" style="padding: 20px">
    <div style="padding: 15px; font-weight: 700; font-size: 15px">
      阶段名称:{{ stageNames }}
    </div>
    <!-- <SrSearch
      :search="search"
      :searchExpand="true"
      :showTextBtns="true"
      :hideBtns="false"
      @queryList="pageChanged(1)"
    ></SrSearch> -->
    <SrTable
      @pageChanged="pageChanged"
      :data="table.data"
      @sizeChanged="sizeChanged"
      @sortChange="sortChange"
      :config="table.tableConfig"
      :page="table.page"
    >
      <template slot="name3" slot-scope="scope">
        {{ scope.scope.row.taskProgress }}
        <span v-if="scope.scope.row.taskProgress">%</span>
      </template>
    </SrTable>
    <div
      style="display: flex; justify-content: space-between; margin-top: 10px"
    >
      <div class="btns" @click="addJd">
        <i class="el-icon-plus"></i>
        添加任务
      </div>
      <!-- <el-button plain size="medium" round @click="goback">返回列表</el-button> -->
    </div>
    <div
      class="bottom-btns workflow"
      :style="{ width: `calc(100% - ${widthB})` }"
    >
      <div class="btnss">
        <div class="back-btn">
          <el-button plain size="medium" round @click="goback"
            >返回列表</el-button
          >
        </div>
      </div>
    </div>
    <!-- 填报进度弹框 -->
    <el-dialog
      title="填报进度"
      :visible.sync="centerDialogVisible"
      width="650px"
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
                v-model="form.data.progress"
                placeholder="请输入"
                @input="numValid(form.data.progress)"
              ></el-input>
              <span>%</span>
            </div>
          </template>
        </SrAdd>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveJdRwjd">保 存</el-button>
        <el-button @click="centerDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 添加编辑弹框 -->
    <el-dialog
      title="添加/编辑"
      :visible.sync="centerDialogVisible2"
      width="650px"
    >
      <span>
        <SrAdd
          class="sradd"
          :config="form2.config"
          :enums="form2.enums"
          :form="form2.data"
          :otherConfig="form2.otherConfig"
          ref="add1"
        >
        </SrAdd>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveJdRw">保 存</el-button>
        <el-button @click="cancel">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import store from "@/store";
import { queryProjectLists, exportByIds } from "@/api/ledger";
import { api_userSetQuery } from "@/api/index.js";
import {
  queryTaskList,
  updateTaskName,
  removeTaskById,
  updateTaskProgress,
} from "@/api/executionManagement";

export default {
  data() {
    return {
      centerDialogVisible: false,
      centerDialogVisible2: false,
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
            placeholder: "系统名称",
            bind: "systemName", // 对应this.search.data对象的field1
          },
          {
            type: "text",
            placeholder: "项目名称",
            bind: "projectName", // 对应this.search.data对象的field1
          },
          // {
          //   type: "text",
          //   placeholder: "请输入需求部门关键字",
          //   bind: "applicationUnit", // 对应this.search.data对象的field1
          // },
        ],
        enum: {
          // 搜索项下拉数据
          projectList: [],
          jsdwList: [],
        },
        btns: [
          // {
          //   name: "导入",
          //   click: this.improtByCondition,
          //   type: "default",
          //   // permissionCode: 'M015_M003_M001',
          // },
          // {
          //   name: "导出",
          //   click: this.exprotByCondition,
          //   type: "default",
          //   // permissionCode: 'M015_M003_M001',
          // },
        ],
        formData: {
          projectName: "",
          systemName: "",
          applicationUnit: "",
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
            width: "180",
            fixed: "right",
            allTableHeader: "",
            hideHeaderSetting: true,
          },
          innerBtn: [
            // {
            //   name: "进度",
            //   method: "zxjd",
            //   type: "text",
            //   size: "small",
            //   field: "status",
            //   value: ["4"],
            //   icon: "el-icon-document",
            //   // code: "M005_003_002_004", // 按钮的唯一值,用于角色按钮权限控制，不传默认不进行权限控制
            //   className: "font-size-20",
            //   // validate: this.btnValidate,
            // },
            {
              name: "子任务",
              method: "zxjdu",
              type: "text",
              size: "small",
              field: "status",
              value: ["4"],
              icon: "el-icon-document",
              // code: "M005_003_002_004", // 按钮的唯一值,用于角色按钮权限控制，不传默认不进行权限控制
              className: "font-size-20",
              // validate: this.btnValidate,
            },
            {
              name: "删除",
              method: "jdRwdel",
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
              name: "编辑",
              method: "jdRwedit",
              type: "text",
              size: "small",
              field: "status",
              value: ["4"],
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
      isTableHeaderId: null,
      form: {
        otherConfig: {
          labelNum: 190,
        },
        config: [
          // {
          //   type: "solt",
          //   name: "建设进度",
          //   slotName: "jianshejindu",
          //   bind: "scale",

          //   col: 20,
          //   trigger: "blur",
          //   rules: {
          //     regular_Number3: "只能输入数字",
          //   },
          //   required: "建设进度不能为空",
          // },
          {
            type: "slot",
            slotName: "jianshejindu",
            name: "任务进度",
            // placeholder: "请输入",
            bind: "progress",
            trigger: "blur",
            rules: {
              regular_Number3: "只能输入数字",
            },
            required: "任务进度不能为空",
            maxLength: 16,
            class: "gg",
            col: 16,
          },
        ],
        data: {
          progress: "",
          projectId: 0,
          taskName: "",
          taskId: 0,
        },
        enums: {
          statusList: [],
        },
      },
      form2: {
        otherConfig: {
          labelNum: 190,
        },
        config: [
          {
            type: "input",
            name: "任务名称",
            // slotName: "jianshejindu",
            bind: "taskName",

            col: 20,
            trigger: "blur",
            // rules: {
            //   regular_Number3: "只能输入数字",
            // },
            required: "任务名称不能为空",
          },
          // //   required: "建设进度不能为空",   {
          //   type: "slot",
          //   slotName: "jianshejindu",
          //   name: "阶段进度",
          //   // placeholder: "请输入",
          //   bind: "weeklyPerson",
          //   trigger: "blur",
          //   rules: {
          //     regular_Number3: "只能输入数字",
          //   },
          //   required: "建设进度不能为空",
          //   maxLength: 16,
          //   class: "gg",
          //   col: 16,
          // },
          // },
        ],
        data: {
          taskName: "",
          taskStartTime: "",
          taskEndTime: "",
          taskProgress: "",
        },
        enums: {
          statusList: [],
        },
      },
      projectId: null,
      pids: null,
      isEdit: null,
      taskId: null,
      stageNames: "",
      widthB: "",
    };
  },

  created() {
    this.projectId = this.$route.query.projectId; // 第一阶段传递过来的项目id
    this.pids = this.$route.query.ids; //第二阶段的当前行id
    this.stageNames = this.$route.query.stageNames; //stageName
    this.projectNames = this.$route.query.projectNames; //stageName
    this.systemNames = this.$route.query.systemNames; //stageName
  },

  mounted() {
    this.init();
    this.initResizeObserver();
  },
  beforeDestroy() {
    this.destroyResizeObserver();
  },
  methods: {
    init() {
      this.getTbHeader();
      this.getTbData();
    },

    getTbData() {
      let param = {
        pageNum: this.table.page.pageNum,
        pageSize: this.table.page.pageSize,
        stageId: this.pids,

        contractId: this.$route.query.contractId,
      };
      // const searchForms = this.search.formData;
      // Object.keys(searchForms).map((item) => {
      //   if (this.$utils.isEmpty(searchForms[item])) {
      //     param[item] = searchForms[item];
      //   }
      // });
      queryTaskList(param).then((res) => {
        if (!res?.data?.records) return;
        this.table.page.pages = res.data.pages;
        this.table.page.total = res.data.total;
        this.table.data = res.data.records;
      });
    },
    getTbDataA() {
      let param = {
        pageNum: this.table.page.pageNum,
        pageSize: this.table.page.pageSize,
        stageId: this.projectId,
      };
      // const searchForms = this.search.formData;
      // Object.keys(searchForms).map((item) => {
      //   if (this.$utils.isEmpty(searchForms[item])) {
      //     param[item] = searchForms[item];
      //   }
      // });
      queryTaskList(param).then((res) => {
        if (!res?.data?.records) return;

        this.table.page.pages = res.data.pages;
        this.table.page.total = res.data.total;

        this.table.data = res.data.records;
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
    getTbHeader() {
      api_userSetQuery({ permissionCode: "M005_014" }).then((res) => {
        this.isTableHeaderId = res.data.id;
        let headerData = JSON.parse(res.data.data).sort(
          (a, b) => a.index - b.index
        );

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
    // workView(val) {
    //   this.$router.push({
    //     name: "issueView",
    //     query: {
    //       id: val.id,
    //       projectId: val.projectId,
    //       processId: val.processId,
    //       templateId: val.templateId,
    //       processId: val.processId,
    //     },
    //   });
    // },
    btnValidate(row, item) {
      if (row.name == "删除" && item.isEdit == 1) return true;
      if (row.name == "编辑" && item.isEdit == 1) return true;
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
    // 导出
    exprotByCondition() {
      (this.search.formData.pageNum = this.table.page.pageNum),
        (this.search.formData.pageSize = this.table.page.pageSize);

      exportByIds(this.search.formData).then((res) => {
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
        fileName = "项目台账";
        link.setAttribute("download", decodeURIComponent(fileName)); // 使用URI解码而不是解码
        document.body.appendChild(link);
        link.click(); // 释放URL对象
        window.URL.revokeObjectURL(link.href);
        document.body.removeChild(link);
      });
    },
    // zxjd 进度
    zxjd(row) {
      this.form.data.taskId = row.id;
      this.form.data.progress = row.taskProgress;
      this.centerDialogVisible = true;
    },
    zxck() {
      this.$router.push({ name: "executionManagementView" });
    },
    zxjdu(row) {
      this.$router.push({
        name: "childrenTask",
        query: {
          projectId: this.projectId,
          ids: this.pids,
          rowId: row.id,
          taskNames: row.taskName,
          stageNames: this.stageNames, // 项目stageName
          projectNames: this.projectNames,
          systemNames: this.systemNames,

          contractId: this.$route.query.contractId,

          isSection: this.$route.query.isSection,
          sectionSort: this.$route.query.sectionSort,
          sectionCount: this.$route.query.sectionCount,
        },
      });
    },
    addJd() {
      this.centerDialogVisible2 = true;
    },
    saveJdRwjd() {
      let data = this.$refs["add1"].validate();
      if (data.progress) {
        if (this.form.data.taskId) {
          updateTaskProgress({
            taskId: this.form.data.taskId,
            progress: this.form.data.progress,
          }).then((res) => {
            // this.form.data = res.data;
            if (res.msg.code == "0000") {
              this.$message.success("保存成功");

              this.centerDialogVisible = false;
              this.getTbData();
            }
          });
        }
      }
    },
    saveJdRw() {
      let data = this.$refs["add1"].validate();
      // 添加
      if (data.taskName) {
        if (this.isEdit == 1) {
          updateTaskName({
            taskId: this.form2.data.taskId,
            taskName: this.form2.data.taskName,
          }).then((res) => {
            if (res.msg.code == "0000") {
              this.$message.success("编辑成功");
              this.form2.data.taskName = "";
              this.isEdit = null;
              this.centerDialogVisible2 = false;
              this.getTbData();
            }
          });
        } else {
          updateTaskName({
            stageId: this.pids,
            taskName: this.form2.data.taskName,
          }).then((res) => {
            if (res.msg.code == "0000") {
              this.$message.success("添加成功");
              this.form2.data.taskName = "";
              this.centerDialogVisible2 = false;
              this.getTbData();
            }
          });
          // this.table.data.push(this.form2.data);

          // this.centerDialogVisible2 = false;
        }
      }
      // 编辑
    },
    cancel() {
      this.centerDialogVisible2 = false;
      this.form2.data.taskName = "";
    },
    jdRwedit(row) {
      this.isEdit = row.isEdit;
      this.form2.data.taskId = row.id;
      this.form2.data.taskName = row.taskName;
      this.centerDialogVisible2 = true;
    },
    jdRwdel(row) {
      let find = (ele) => ele == row;
      const index = this.table.data.findIndex(find);
      if (row.id) {
        this.$confirm("是否删除该条数据", "提示", {
          iconClass: "el-icon-question", //自定义图标样式
          confirmButtonText: "确认", //确认按钮文字更换
          cancelButtonText: "取消", //取消按钮文字更换
          showClose: true, //是否显示右上角关闭按钮
          type: "warning", //提示类型  success/info/warning/error
        })
          .then(() => {
            removeTaskById({ taskId: row.id }).then((res) => {
              if (res.msg.code == "0000") {
                this.$message.success("删除成功");
                this.getTbData();
              }
            });
            // this.getTbData();
            //确认操作
          })
          .catch(() => {
            //取消操作
          });

        // this.$message.success("删除成功")
      } else {
        this.table.data.splice(index, 1);
        this.$message.success("删除成功");
      }
    },
    goback() {
      this.$router.push({
        name: "projectPhase",
        query: {
          ids: this.$route.query.ids,
          projectId: this.$route.query.projectId,
          projectNames: this.projectNames,
          systemNames: this.systemNames,
          contractId: this.$route.query.contractId,

          isSection: this.$route.query.isSection,
          sectionSort: this.$route.query.sectionSort,
          sectionCount: this.$route.query.sectionCount,
        },
        // 查看相关逻辑
      });
    },
    numValid(inputContent) {
      var reg = /^(0|([1-9]\d{0,1})|100)$/;
      if (reg.test(inputContent) == false) {
        if (inputContent > 100) {
          this.form.data.progress = 100;
        } else if (inputContent.length > 1 && Number(inputContent) == 0) {
          this.form.data.progress = 0;
        } else {
          this.form.data.progress = "";
        }
      } else {
        this.form.data.progress = inputContent;
      }
    },
    initResizeObserver() {
      this.resizeObserver = new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          this.widthB = entry.contentRect.width + "px";
        });
      });
      this.resizeObserver.observe(document.querySelector(".main-menu-box"));
    },
    destroyResizeObserver() {
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.total-page {
  background: #fff;
  padding: 20px;
  height: 100%;
  overflow: auto;
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
.btns {
  // margin-top: 20px;
  width: 112px;
  text-align: center;
  height: 34px;
  line-height: 34px;
  border-radius: 4px;
  background: rgba(66, 130, 255, 0.1);
  cursor: pointer;
  border: 1px dashed rgba(66, 130, 255, 1);
}
.bottom-btns {
  position: fixed;
  bottom: 0;
  // width: calc(100% - 220px);
  background: #fff;
  z-index: 10;
  right: 0;
  .btnss {
    height: 64px;
    text-align: center;
    padding-top: 16px;
    border-top: 1px solid #e6e6e6;
    position: relative;
    .btnList {
      display: inline-block;
    }
    .back-btn {
      display: inline-block;
      margin-left: 16px;
    }
    button {
      padding: 0px 24px;
      line-height: 32px;
    }
  }
}
::v-deep .el-dialog .el-dialog__header {
  text-align: left;
  font-size: 16px;
  font-weight: 700;
}
</style>
