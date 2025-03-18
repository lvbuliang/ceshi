<template>
  <div class="total-page" style="padding: 20px">
    <div style="padding: 15px; font-weight: 700; font-size: 15px">
      任务名称:{{ taskNames }}
    </div>
    <!-- <SrSearch
      :search="search"
      :searchExpand="true"
      :showTextBtns="true"
      :hideBtns="false"
      @queryList="pageChanged(1)"
    ></SrSearch> -->

    <div
      style="display: flex; justify-content: space-between; margin-top: 10px"
    >
      <div class="btns" @click="addJd">
        <!--  v-if="showflag" -->
        <i class="el-icon-plus"></i>
        添加子任务
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
          ref="add3"
        >
          <template slot="shijikaishishijian">
            <div>
              <el-date-picker
                v-model="form.data.actualStartTime"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                :picker-options="expireTimeOPtion"
              />
            </div>
          </template>
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
          <template slot="shijijiesshushijian">
            <div>
              <el-date-picker
                v-model="form.data.actualEndTime"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                :picker-options="expireTimeOPtion"
              />
            </div>
          </template>
        </SrAdd>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveZrwJd">保 存</el-button>
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
        <el-button type="primary" @click="saveJdZrw">保 存</el-button>
        <el-button @click="cancel">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 计划填报 -->
    <el-dialog
      title="计划填报"
      :visible.sync="centerDialogVisible3"
      width="650px"
    >
      <span>
        <SrAdd
          class="sradd"
          :config="form3.config"
          :enums="form3.enums"
          :form="form3.data"
          :otherConfig="form3.otherConfig"
          ref="add1"
        >
        </SrAdd>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="goExamine">提 交</el-button>
        <el-button @click="centerDialogVisible3 = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 交付物弹框 -->
    <el-dialog
      title="上传交付物"
      :visible.sync="centerDialogVisible4"
      width="750px"
      left
    >
      <span>
        <SrTable
          @pageChanged="pageChanged"
          :data="table2.data"
          @sizeChanged="sizeChanged"
          @sortChange="sortChange"
          :config="table2.tableConfig"
          :page="table2.page"
          @selected="selected"
          :status="selectStatus"
          ref="selectTable"
          @clickRow="clickRow"
        >
          <template slot="cellSlot" slot-scope="scope"> 上传....</template>
          <template slot="name" slot-scope="scope">
            <span v-if="scope.scope.row.isMustUpload == 1" style="color: red"
              >*</span
            >
            {{ scope.scope.row.name }}
          </template>
        </SrTable>
      </span>

      <div class="btns" @click="addQtJd">
        <i class="el-icon-plus"></i>
        添加其他交付物
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium" round @click="submit"
          >保 存</el-button
        >
        <el-button
          plain
          size="medium"
          round
          @click="centerDialogVisible4 = false"
          >取 消</el-button
        >
      </span>
    </el-dialog>
    <!-- 交付物上传弹框 -->
    <el-dialog
      title="上传交付物"
      :visible.sync="centerDialogVisible5"
      width="750px"
      left
    >
      <span>
        <SrAdd
          :config="form4.config"
          :form="form4.data"
          :enums="form4.enums"
          :otherConfig="form4.otherConfig"
          ref="add"
          class="add"
        ></SrAdd>
        <span
          >仅支持上传doc, docx, xls, xlsx, ppt, pptx, pdf, txt, jpg, jpeg, jpe,
          png, rar, zip格式文件</span
        >
      </span>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium" round @click="saveJfw"
          >保 存</el-button
        >
        <el-button
          plain
          size="medium"
          round
          @click="centerDialogVisible5 = false"
          >取 消</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import store from "@/store";
// 上传工具包
import config from "@/settings.js";
import upload from "@/utils/upload";
import { queryProjectLists, exportByIds } from "@/api/ledger";
import { api_userSetQuery } from "@/api/index.js";
import {
  querySubTaskList,
  updateSubTaskName,
  removeSubTaskById,
  updateSubTaskPlan,
  updateSubTaskProgress,
  queryDeliveryList,
  updateDeliveryInfo,
} from "@/api/executionManagement";
// api
// import { api_activititodo } from "@/api/executionManagement/index.js";
export default {
  data() {
    return {
      baseUrl: config.uploadBaseUrl,
      userInfo: store.getters.userInfo,
      deliveryId: "", //交付物id
      centerDialogVisible: false,
      centerDialogVisible2: false,
      centerDialogVisible3: false,
      centerDialogVisible4: false,
      centerDialogVisible5: false,
      showflag: false,
      theNew: "",
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
            width: "156",
            fixed: "right",
            allTableHeader: "",
            hideHeaderSetting: true,
          },
          innerBtn: [
            {
              name: "计划",
              method: "zjhtb",
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
              name: "交付物",
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

      table2: {
        data: [], // 表格数据
        tableConfig: {
          rowClassName: this.rowClassName,
          title: "表格的标题", // 表格标题
          highlightCurrentRow: false, // 控制表格是否单选
          // maxLength: 20, // 一行最多显示多少字，超出显示popver
          load: this.load,
          tooltipEffect: "light",
          header: [],
          selectionConfig: {
            display: false,
            width: "40",
          },
          operateConfig: {
            display: true,
            label: "操作",
            width: "200",
            fixed: "right",
            allTableHeader: "",
            saveHeaderList: this.saveHeaderList,
            hideHeaderSetting: true,
            // export: this.exprotByCondition,
            // exportPermissionCode: "M015_M003_M003", //导出
          },
          innerBtn: [
            // 表格内部操作按钮，不需要操作列的innerBtn 写成false
            {
              name: "预览", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "openPicture", // 点击执行该页面methods中对应的方法
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
              validate: this.btnValidate2, //自定义判断是否展示按钮权限
            },
            {
              name: "上传",
              method: "setLabelJfw",
              type: "text",
              size: "small",
              icon: "el-icon-document",
              className: "font-size-20",
              validate: this.btnValidate2, //自定义判断是否展示按钮权限
            },
            {
              name: "下载",
              method: "onDownload",
              type: "text",
              size: "small",
              icon: "el-icon-document",
              className: "font-size-20",
              disabled: true,
              validate: this.btnValidate2, //自定义判断是否展示按钮权限
            },
            {
              name: "删除",
              method: "deleteRow",
              type: "text",
              size: "small",
              icon: "el-icon-document",
              className: "font-size-20",
              validate: this.btnValidate2, //自定义判断是否展示按钮权限
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
          {
            type: "slot",
            name: "实际开始时间",
            slotName: "shijikaishishijian",
            bind: "actualStartTime",
            timeType: "date",
            format: "yyyy-MM-dd",
            col: 20,
            trigger: "blur",
            // rules: {
            //   regular_Number3: "只能输入数字",
            // },
            required: "实际开始时间不能为空",
          },
          {
            type: "slot",
            name: "实际结束时间",
            slotName: "shijijiesshushijian",
            bind: "actualEndTime",
            // timeType: "date",
            // format: "yyyy-MM-dd",
            col: 20,
            // trigger: "blur",
            // rules: {
            //   regular_Number3: "只能输入数字",
            // },
            // required: "实际结束时间不能为空",
          },
          {
            type: "slot",
            slotName: "jianshejindu",
            name: "子任务进度",
            // placeholder: "请输入",
            bind: "progress",
            trigger: "blur",
            // rules: {
            //   regular_Number3: "只能输入数字",
            // },
            required: "任务进度不能为空",
            maxLength: 16,
            class: "gg",
            col: 16,
          },
        ],
        data: {
          actualEndTime: "",
          actualStartTime: "",
          progress: null,
          subTaskId: null,
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
            name: "子任务名称",
            // slotName: "jianshejindu",
            bind: "subTaskName",
            col: 20,
            trigger: "blur",
            // rules: {
            //   regular_Number3: "只能输入数字",
            // },
            required: "任务名称不能为空",
          },
        ],
        data: {
          subTaskName: "",
          subTaskId: null,
        },
        enums: {
          statusList: [],
        },
      },
      form3: {
        otherConfig: {
          labelNum: 190,
        },
        config: [
          {
            type: "dateSelect",
            name: "计划开始时间",
            timeType: "date",
            // slotName: "jianshejindu",
            bind: "planStartTime",
            format: "yyyy-MM-dd",
            col: 20,
            // trigger: "blur",
            // rules: {
            //   regular_Number3: "只能输入数字",
            // },
            required: "计划时间不能为空",
          },
          {
            type: "dateSelect",
            name: "计划结束时间",
            timeType: "date",
            // slotName: "jianshejindu",
            bind: "planEndTime",

            format: "yyyy-MM-dd",
            col: 20,
            // trigger: "blur",
            // rules: {
            //   regular_Number3: "只能输入数字",
            // },
            required: "计划时间不能为空",
          },
        ],
        data: {
          planStartTime: "",
          planEndTime: "",
          subTaskId: null,
        },
        enums: {
          statusList: [],
        },
      },
      form4: {
        otherConfig: {
          labelNum: 120,
        },
        config: [
          {
            type: "upload",
            name: "交付物附件",
            bind: "accessoryList",
            fileList: [],
            fileSize: 500,
            limit: 0,
            fileTip:
              "仅支持上传doc, docx, xls, xlsx, ppt, pptx, pdf, txt, jpg, jpeg, jpe, png, rar, zip格式文件!",
            fileType:
              "doc,docx,xls,xlsx,ppt,pptx,pdf,txt,jpg,jpeg,jpe,png,rar,zip",
            tipPopover: true, // hover显示提示  默认外面显示
            col: 24,
          },
        ],
        enums: {},
        data: {
          accessoryList: [],
        },
      },
      form5: {},
      pid: null,
      rowId: null,
      subId: null,
      testId: null,
      expireTimeOPtion: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6; //如果没有后面的-8.64e6就是不可以选择今天的
        },
      },
      agencyId: "",
      agencyNextrole: "",
      nextBuCode: "",
      processInstanceId: "",
      vars: "",
      workflowTaskId: "",
      taskNames: "",
      stageNames: "",
      projectNames: "",
      systemNames: "",
      widthB: "",
    };
  },
  created() {
    this.pid = this.$route.query.id;
    this.rowId = this.$route.query.rowId;
    this.testId = this.$route.query.projectId;
    this.taskNames = this.$route.query.taskNames;
    this.stageNames = this.$route.query.stageNames; // 项目stageName
    this.projectNames = this.$route.query.projectNames;
    this.systemNames = this.$route.query.systemNames;
  },
  provide() {
    return {
      baseUrl: config.uploadBaseUrl,
      imgBaseUrl: config.imgBaseUrl,
      uploadRequest: upload,
      uploadBaseUrl: config.uploadBaseUrl,
      // srtracetrackRequest: srtracetrack,
    };
  },
  mounted() {
    this.init();
    this.form5 = JSON.parse(JSON.stringify(this.form4));
    this.initResizeObserver();
  },
  beforeDestroy() {
    this.destroyResizeObserver();
  },
  watch: {
    "search.formData.status": {
      handler(v) {
        this.getTbData();
      },
    },
    "form4.data.specialClassFile": {
      handler(newVal, old) {
        // specialClassFile
        // 调用update方法
        if (newVal != old) {
          newVal = JSON.stringify(newVal);
          UpdateProjectDetail({
            specialClassFile: newVal,
            projectId: this.testId,
          }).then((res) => {
            if (res.msg.code == "0000") {
            }
          });
        }
      },
      deep: true,
    },
  },
  methods: {
    init() {
      this.getTbHeader();
      this.getTbHeaderJFW();
      this.getTbData();
      this.getTbDataJFW();
    },

    getTbData() {
      let param = {
        pageNum: this.table.page.pageNum,
        pageSize: this.table.page.pageSize,
        ztaskId: this.rowId - 0,
        roleCode: this.userInfo.currentRole.roleCode,
      };
      // const searchForms = this.search.formData;
      // Object.keys(searchForms).map((item) => {
      //   if (this.$utils.isEmpty(searchForms[item])) {
      //     param[item] = searchForms[item];
      //   }
      // });
      querySubTaskList(param).then((res) => {
        if (!res?.data?.records) return;

        this.table.page.pages = res.data.pages;
        this.table.page.total = res.data.total;

        // let { roleCode } = this.userInfo.currentRole;
        // let { jfid } = this.userInfo;
        // res.data.records.forEach((item) => {
        //   if (item.todo) {
        //     item.operationBtns = [];
        //     //按钮筛选  以assignee优先roleCode
        //     if (item.assignee == jfid) {
        //       item.description &&
        //         JSON.parse(item.description).map((item1) => {
        //           if (item1.operationBtns) {
        //             item.operationBtns.push(item1.operationBtns[0]);
        //           }
        //         });
        //       item.path = this.workView;
        //     } else {
        //       item.description &&
        //         JSON.parse(item.description).map((item1) => {
        //           if (roleCode == item1.role) {
        //             if (item1.operationBtns) {
        //               item.operationBtns.push(item1.operationBtns[0]);
        //             }
        //           }
        //         });
        //       item.path = this.workView;
        //     }
        //   }
        // });
        this.table.data = res.data.records;
      });
    },
    getTbDataJFW() {
      let param = {
        pageNum: this.table2.page.pageNum,
        pageSize: this.table2.page.pageSize,
        subTaskId: this.subId,
      };
      queryDeliveryList(param).then((res) => {
        if (!res?.data?.records) return;

        this.table2.page.pages = res.data.pages;
        this.table2.page.total = res.data.total;

        this.table2.data = res.data.records;
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
      api_userSetQuery({ permissionCode: "M005_015" }).then((res) => {
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
    getTbHeaderJFW() {
      api_userSetQuery({ permissionCode: "M005_016" }).then((res) => {
        this.isTableHeaderId = res.data.id;
        let headerData = JSON.parse(res.data.data).sort(
          (a, b) => a.index - b.index
        );

        this.table2.tableConfig.header = headerData.filter((item) => {
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
    workView(row) {
      this.$router.push({
        name: "executionManagementWorkView",
        query: {
          id: row.id,
          processId: row.processId,
          templateId: row.templateId,
          rowData: row,
          projectId: this.$route.query.projectId,
          ids: this.$route.query.ids,
          rowId: this.rowId,
        },
      });
    },
    btnValidate(row, item) {
      if (row.name == "删除" && item.isEdit == 1) return true;

      if (row.name == "编辑" && item.isEdit == 1) {
        if (
          this.userInfo.currentRole.roleCode == "CJDW_XMJL" ||
          this.userInfo.currentRole.roleCode == "FZGHC_JBRBF"
        ) {
          this.showflag = true;
          return true;
        }
        return false;
      }
      if (row.name == "进度") {
        if (
          this.userInfo.currentRole.roleCode == "CJDW_XMJL" ||
          this.userInfo.currentRole.roleCode == "FZGHC_JBRBF"
        ) {
          return true;
        }
        return false;
      }
      console.log(item.isActiveEdit);
      console.log(item.isActiveEdit == 0, "item.isActiveEdit == 0");

      if (row.name == "计划") {
        if (
          this.userInfo.currentRole.roleCode == "CJDW_XMJL" ||
          this.userInfo.currentRole.roleCode == "FZGHC_JBRBF"
        ) {
          return true;
        }
        return false;
      }
      if (row.name == "交付物") {
        if (
          this.userInfo.currentRole.roleCode == "CJDW_XMJL" ||
          this.userInfo.currentRole.roleCode == "FZGHC_JBRBF"
        ) {
          return true;
        }
        return false;
      }
    },
    btnValidate2(row, item) {
      if (row.name == "上传") {
        return true;
      }

      if (row.name == "预览" && item.fileName) {
        return true;
      }
      if (row.name == "下载" && item.fileName) {
        return true;
      }

      if (row.name == "删除" && item.id && item.isEdit == 0) {
        return false;
      }
      return false;
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

    // zxjd 进度
    zxjd(row) {
      this.form.data.subTaskId = row.id;
      this.form.data.actualStartTime = row.actualStartTime;
      this.form.data.actualEndTime = row.actualEndTime;
      this.form.data.progress = row.subTaskProgress;
      this.centerDialogVisible = true;
    },
    zxck() {
      this.$router.push({ name: "executionManagementView" });
    },
    zxjdu(row) {
      // alert("阶段页面");
      // this.$router.push({ name: "childrenTask" });
      this.subId = row.id;

      this.getTbDataJFW();
      this.centerDialogVisible4 = true;
      this.$forceUpdate();
    },

    addJd() {
      this.centerDialogVisible2 = true;
    },
    zjhtb(row) {
      this.form3.data.subTaskId = row.id;
      this.form3.data.planStartTime = row.planStartTime;
      this.form3.data.planEndTime = row.planEndTime;
      this.centerDialogVisible3 = true;
      this.workflowTaskId = row.taskId;
      this.processInstanceId = row.processId;
      // this.getToDo(row)
    },
    // getToDo(row) {
    //   let { roleCode } = this.userInfo.currentRole;
    //   // let { jfid } = this.userInfo;
    //   let param = {
    //     owner: row.creator,
    //     role: roleCode,
    //     processId: row.processId,
    //   };

    //   api_activititodo(param).then((res) => {
    //     console.log(res);
    //     if (res.msg.code == "0000") {
    //       if (!res.data[0]) return false;
    //       const { description, processInstanceId } = res.data[0];
    //       let descriptionRes = JSON.parse(description);
    //       console.log(descriptionRes[0].btns[0], res.data);

    //       this.agencyId = descriptionRes[0].btns[0].agencyId;
    //       this.agencyNextrole = descriptionRes[0].btns[0].agencyNextrole;
    //       this.nextBuCode = descriptionRes[0].btns[0].nextBuCode;
    //       this.processInstanceId = processInstanceId;
    //       this.vars = descriptionRes[0].btns[0].btnValue;
    //     }
    //   });
    // },
    // 去往审批页面
    goExamine() {
      let data = this.$refs["add1"].validate();
      // if (data.planEndTime) {
      if (this.form3.data.planEndTime) {
        updateSubTaskPlan({
          planStartTime: this.form3.data.planStartTime,
          planEndTime: this.form3.data.planEndTime,
          subTaskId: this.form3.data.subTaskId,
          accessory: [],
          accessoryList: [], // 必传
          actualEndTime: "",
          actualStartTime: "",
          agencyId: this.agencyId, // 必传
          agencyNextrole: this.agencyNextrole, // 必传
          assignee: "",
          auditOpinion: "",
          auditTime: "",
          auditUserName: "",
          beAssigner: "",
          beAssignerName: "",
          beAssignerRole: "",
          btnName: "",
          buId: 0,
          messageId: "",
          nextBuCode: this.nextBuCode, // 必传
          processInstanceId: this.processInstanceId, // 必传
          progress: "",
          status: "",
          taskId: this.workflowTaskId, // 必传
          roleCode: this.userInfo.currentRole.roleCode,
          vars: this.vars, // 必传

          sectionCount: this.$route.query.sectionCount, //必传
        }).then((res) => {
          // this.form.data = res.data;
          if (res.msg.code == "0000") {
            this.$message.success("保存成功");

            this.centerDialogVisible3 = false;
            this.getTbData();
            // 工作流页面
            // this.$router.push({
            //   name: "executionManagementWorkView",
            //   query: {
            //     rowData: JSON.stringify(this.subTaskRowData),
            //     projectId: this.$route.query.projectId,
            //     ids: this.$route.query.ids,
            //     id: this.form3.data.subTaskId,
            //     processId: this.subTaskRowData.processId,
            //     templateId: this.subTaskRowData.templateId,
            //   },
            // });
          }
        });
      }
      // }
    },
    saveJdZrw() {
      let data = this.$refs["add1"].validate();
      // 添加
      if (data.subTaskName) {
        if (this.isEdit == 1) {
          updateSubTaskName({
            subTaskId: this.form2.data.subTaskId,
            subTaskName: this.form2.data.subTaskName,
          }).then((res) => {
            if (res.msg.code == "0000") {
              this.$message.success("编辑成功");
              this.form2.data.subTaskName = "";
              this.isEdit = null;
              this.centerDialogVisible2 = false;
              this.getTbData();
            }
          });
        } else {
          updateSubTaskName({
            taskId: this.rowId,
            subTaskName: this.form2.data.subTaskName,
          }).then((res) => {
            if (res.msg.code == "0000") {
              this.$message.success("添加成功");
              this.form2.data.subTaskName = "";
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
    jdRwedit(row) {
      this.isEdit = row.isEdit;
      this.form2.data.subTaskId = row.id;
      this.form2.data.subTaskName = row.subTaskName;
      this.centerDialogVisible2 = true;
    },
    jdRwdel(row) {
      let find = (ele) => ele == row;
      const index = this.table.data.findIndex(find);
      if (row.id) {
        this.$confirm("是否删除该条数据", "提示", {
          iconClass: "el-icon-question",
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          showClose: true,
          type: "warning",
        })
          .then(() => {
            removeSubTaskById({ subTaskId: row.id }).then((res) => {
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
    saveZrwJd() {
      let data = this.$refs["add3"].validate();
      if (data.progress) {
        updateSubTaskProgress({
          actualStartTime: this.form.data.actualStartTime,
          actualEndTime: this.form.data.actualEndTime,
          progress: this.form.data.progress,
          subTaskId: this.form.data.subTaskId,
        }).then((res) => {
          if (res.msg.code == "0000") {
            this.$message.success("添加成功");
            this.form.data.actualStartTime = "";
            this.form.data.actualEndTime = "";
            this.form.data.progress = "";
            this.centerDialogVisible = false;
            this.getTbData();
          }
        });
      }
    },
    setLabelJfw(row) {
      this.deliveryId = row.id;
      this.form4 = JSON.parse(JSON.stringify(this.form5));
      this.centerDialogVisible5 = true;
    },
    // 保存提交
    saveJfw() {
      let { name, id, size, createTime } = this.form4.data.accessoryList[0];
      size = (size / 1024 / 1024).toFixed(2);
      this.table2.data.map((item) => {
        if (item.id == this.deliveryId) {
          item.uploadTime = createTime;
          item.fileContext = id;
          // id: fileData.id,
          // item.name = '交付物'
          item.fileName = name;
          item.fileSize = size + "mb";

          item.uploadPerson = this.userInfo.fullname;
          this.centerDialogVisible5 = false;
        }
      });

      // this.table.data[]
      uploadTemporarily({
        name,
        id,
        size,
        deliveryId: this.deliveryId,
        fileContext,
      }).then((res) => {
        if (res.msg.code == "0000") {
          this.$message.success("保存成功");
          this.centerDialogVisible5 = false;
          this.form4.data.accessoryList = [];
        }
      });
    },

    submit() {
      const tables = this.table2.data.map((item) => {
        const { btns, ...rest } = item;
        return rest;
      });
      const isUpload = tables.filter(
        (item) => item.isMustUpload === 1 && item.fileName === null
      );

      if (isUpload.length > 0) {
        const arr = [];
        isUpload.forEach((item) => {
          arr.push(item.name);
        });
        this.$message({
          message: `【${arr.join(",")}】不能为空，请上传文件`,
          type: "warning",
        });
      } else {
        this.$confirm("是否保存", "提示", {
          iconClass: "el-icon-question",
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          showClose: true,
          type: "warning",
        })
          .then(() => {
            //确认操作
            updateDeliveryInfo({ deliverys: tables }).then((res) => {
              if (res.msg.code == "0000") {
                this.$message.success("保存成功");
                this.getTbDataJFW();
                // location.reload();
              }
            });
          })
          .catch(() => {
            //取消操作
          });
      }
    },
    // 预览
    openPicture(row) {
      let token = sessionStorage.getItem("token");
      window.open(`${this.baseUrl}/viewPdf?id=${row.fileContext}`);
    },
    onDownload(row) {
      this.baseUrl = "";
      let token = sessionStorage.getItem("token");
      window.open(
        `${this.baseUrl}/jfzg/file/api/file/download?key=${row.fileContext}&access_token=${token}`
      );
    },
    cancel() {
      this.centerDialogVisible2 = false;
      this.form2.data.subTaskName = "";
    },
    goback() {
      this.$router.push({
        name: "task",
        query: {
          ids: this.$route.query.ids,
          projectId: this.$route.query.projectId,
          taskName: this.$route.query.taskName,
          stageNames: this.stageNames,
          systemNames: this.systemNames,
          projectNames: this.projectNames,

          contractId: this.$route.query.contractId,

          isSection: this.$route.query.isSection,
          sectionSort: this.$route.query.sectionSort,
          sectionCount: this.$route.query.sectionCount,
        },
        // 查看相关逻辑
      });
    },
    // 添加其他交付物
    addQtJd() {
      this.table2.data.push({
        name: "其他交付物",
        fileContext: null,
        fileName: null,
        fileSize: null,
        // id: 5,
        isMustUpload: 0,
        isUpload: null,
        milestoneId: null,
        stageSubTaskId: this.subId,
        uploadPerson: null,
        uploadTime: null,
      });
    },
    deleteRow(row) {
      let find = (ele) => ele == row;
      const index = this.table2.data.findIndex(find);
      if (row.isMustUpload == 0) {
        if (row.id) {
          // this.$message.success("删除成功")
          this.table2.data.splice(index, 1);
          this.$message.success("删除成功");
        } else {
          this.table2.data.splice(index, 1);
          this.$message.success("删除成功");
        }
      } else if (row.isMustUpload == 1) {
        this.$message.error("不可删除");
      } else if (row.isMustUpload == null) {
        this.table2.data.splice(index, 1);
        this.$message.success("删除成功");
      }
    },
    fileUpload(fileData, scope) {
      this.table2.data.push({
        uploadTime: fileData.createTime,
        id: fileData.id,
        name: "交付物",
        fileName: fileData.name,
        fileSize: fileData.size,
        uploadPerson: this.userInfo.fullname,
      });
      /* scope.reviewAppendix = JSON.stringify(scope.reviewAppendix); */
    },
    // 开始上传
    BigFileStartUpload(file, item) {},
    // 上传过程
    fileProgress(rootFile, file, chunk, item) {},
    // 上传成功
    BigFileUploadSuccess(fileList, item) {
      console.log("上传成功", fileList, item);
    },
    numValid(inputContent) {
      // ^(0(\.\d*)?|([1-9]\d?|100)(\.\d*)?)$ 小数
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
  margin-top: 20px;
  width: 124px;
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
  border-left: 2px solid rgb(230, 230, 230);
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
::v-deep .el-dialog .el-dialog__header .el-dialog__title {
  font-weight: 700;
}
</style>
