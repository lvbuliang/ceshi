<template>
  <div class="total-page">
    <div class="project-info">
      <div
        v-for="item in displayItems"
        :key="item.key"
        class="info-item"
        :class="{ 'has-special': item.isSpecial }"
      >
        <span class="info-label">{{ item.label }}</span>
        <span v-if="!item.isSpecial">{{ item.value }}</span>
      </div>
    </div>
    <SearchBar
      :hasConstructionPermission="hasConstructionPermission"
      :isFromWorkBench="isFromWorkBench"
      :clicked="clicked"
      :showActionGroup="true"
      @goback="goback"
      @save-top-level-node="saveTopLevelNode"
      @back-work-bench="backWorkBench"
      @batch-save="batchSave"
      @skip-gantt="skipGantt"
      @add-subtask="addSubtask"
    />
    <div class="container">
      <StageMaintenance
        :treeData="treeData"
        :activeIndex="activeIndex"
        :hasConstructionPermission="hasConstructionPermission"
        :userInfo="userInfo"
        @node-click="handleNodeClick"
        @edit-node="editFl"
        @add-node="handleAddNode"
        @delete-node="handleDeleteNode"
        @empty-delete="emptyDeleteNode"
      />
      <div class="container-right">
        <!-- 右侧表格 -->
        <el-table
          height="100%"
          :data="table.data"
          :row-key="get_row_key"
          @cell-click="cell_click"
          :row-class-name="table_row_class_name"
          cell-class-name="table-cell-center"
          show-overflow-tooltip
        >
          <!-- <el-table-column type="index" width="50" /> -->
          <el-table-column
            type="index"
            :index="1"
            label="序号"
            min-width="40"
            fixed="left"
          />
          <el-table-column prop="subTaskName" min-width="200">
            <template slot="header">
              <span
                >子任务名称<span type="danger" class="header_star"
                  >*</span
                ></span
              >
            </template>
            <template slot-scope="scope">
              <span
                v-if="!scope.row.setingFlag"
                @click="handleEdit(scope.row)"
                >{{ scope.row.subTaskName }}</span
              >
              <div v-else>
                <el-input
                  v-model="scope.row.subTaskName"
                  @blur="handleBlur(scope.row)"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                ></el-input>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="planStartTime" min-width="150">
            <template slot="header">
              <span
                >计划开始时间<span type="danger" class="header_star"
                  >*</span
                ></span
              >
            </template>
            <template slot-scope="scope">
              <span
                v-if="!scope.row.setingFlag"
                @click="handleEdit(scope.row)"
                >{{ scope.row.planStartTime }}</span
              >
              <div v-else>
                <el-date-picker
                  v-model="scope.row.planStartTime"
                  type="date"
                  value-format="yyyy-MM-dd"
                  style="width: 140px"
                >
                </el-date-picker>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="planEndTime" min-width="150">
            <template slot="header">
              <span
                >计划结束时间<span type="danger" class="header_star"
                  >*</span
                ></span
              >
            </template>
            <template slot-scope="scope">
              <span
                v-if="!scope.row.setingFlag"
                @click="handleEdit(scope.row)"
                >{{ scope.row.planEndTime }}</span
              >
              <div v-else>
                <el-date-picker
                  v-model="scope.row.planEndTime"
                  type="date"
                  value-format="yyyy-MM-dd"
                  style="width: 140px"
                >
                </el-date-picker>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="actualStartTime"
            label="实际开始时间"
            min-width="150"
          >
            <template slot-scope="scope">
              <span
                v-if="!scope.row.setingFlag"
                @click="handleEdit(scope.row)"
                >{{ scope.row.actualStartTime }}</span
              >

              <div v-else>
                <el-date-picker
                  v-model="scope.row.actualStartTime"
                  type="date"
                  value-format="yyyy-MM-dd"
                  style="width: 140px"
                >
                </el-date-picker>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="actualEndTime"
            label="实际结束时间"
            min-width="150"
          >
            <template slot-scope="scope">
              <span
                v-if="!scope.row.setingFlag"
                @click="handleEdit(scope.row)"
                >{{ scope.row.actualEndTime }}</span
              >

              <div v-else>
                <el-date-picker
                  v-model="scope.row.actualEndTime"
                  type="date"
                  value-format="yyyy-MM-dd"
                  style="width: 140px"
                >
                </el-date-picker>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="subTaskProgress"
            label="子任务进度"
            min-width="250"
          >
            <template slot-scope="scope">
              <!-- <span v-if="!scope.row.setingFlag" @click="handleEdit(scope.row)">
                <progress-bar
                  :value="
                    scope.row.subTaskProgress == null
                      ? 0
                      : scope.row.subTaskProgress
                  "
                ></progress-bar>
              </span> -->
              <span v-if="!scope.row.setingFlag" @click="handleEdit(scope.row)">
                <!-- <task-progress-bar :total-progress="scope.row.subTaskProgress"></task-progress-bar> -->
                <!-- <scroll-progress-bar :value="scope.row.subTaskProgress" /> -->
                <progress-bar
                  :value="
                    scope.row.subTaskProgress == null
                      ? 0
                      : scope.row.subTaskProgress
                  "
                ></progress-bar>
              </span>

              <div v-else>
                <el-input
                  v-model="scope.row.subTaskProgress"
                  @blur="handleBlur(scope.row)"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                ></el-input>
              </div>
            </template>

            <!-- 操作 -->
          </el-table-column>

          <el-table-column fixed="right" label="操作" min-width="220">
            <template slot-scope="scope">
              <div style='display: flex;'>

           
              <el-button
                type="text"
                size="small"
                @click="handleEdit1(scope.row)"
                v-if="hasConstructionPermission"
              >
                <span v-if="scope.row.newList != 0"> 编辑 </span>
                <span v-else>
                  <span
                    v-if="
                      userInfo.fullname == JSON.parse(scope.row.currentFounder)
                    "
                  >
                    编辑
                  </span>
                </span>
              </el-button>
              <el-button
                type="text"
                size="small"
                @click="conserve(scope.row)"
                v-if="hasConstructionPermission"
              >
                <span v-if="scope.row.newList != 0"> 保存 </span>
                <span v-else>
                  <span
                    v-if="
                      userInfo.fullname == JSON.parse(scope.row.currentFounder)
                    "
                  >
                    保存
                  </span>
                </span>
              </el-button>
              <el-button
                type="text"
                size="small"
                @click="jdRwdel(scope.row)"
                v-if="hasConstructionPermission"
              >
                <!-- isDeleteSub; -->
                <span
                  v-if="scope.row.newList != 0 && scope.row.isDeleteSub != 0"
                >
                  删除
                </span>
                <span v-else>
                  <span
                    v-if="
                      userInfo.fullname == JSON.parse(scope.row.currentFounder)
                    "
                  >
                    删除
                  </span>
                </span>
              </el-button>
              <el-button
                type="text"
                size="small"
                @click="uploadLook(scope.row)"
              >
                查看
              </el-button>

              <span
                class="uploading_span"
                @click="uploading(scope.row, scope.$index)"
                v-if="hasConstructionPermission"
              >
                <!-- 上传 -->

                <SrAdd
                  :config="form7.config"
                  :form="form7.data"
                  :enums="form7.enums"
                  :otherConfig="form7.otherConfig"
                  ref="add"
                  class="add"
                  @upload-complete="handleUploadComplete"
                >
                </SrAdd>
              </span>
            </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 交付物弹框 -->
    <DeliveryDialog
      :dialogVisible="dialogVisible"
      :deliverableName="deliverableName"
      :SynchronousName="SynchronousName"
      :previewForm="previewForm"
      :Synchronous="Synchronous"
      :hasConstructionPermission="hasConstructionPermission"
      @preview="handlePreview"
      @download="handleDownload"
      @delete="handleDeletePlease"
    />
  </div>
</template>
<script>
import store from "@/store";
// 上传工具包
import config from "@/settings.js";
import upload from "@/utils/upload";

import ProgressBar from "./components/ScrollProgressBar.vue";

import { uploadTemporarily, newuploadTemporarily } from "@/api/planProject";
import { getCommonTableHeight } from "@/utils/commonTableHeight.js";
import { api_userSetQuery } from "@/api/index.js";

import {
  updateStageName,
  removeStageById,
  newupdateStageName,
  queryExecutionLists,
} from "@/api/executionManagement";
import draggable from "vuedraggable";

import {
  newqueryTaskList,
  updateSubTaskName,
  newupdateSubTaskName,
  removeSubTaskById,
  updateSubTaskProgress,
  queryDeliveryList,
  updateDeliveryInfo,
  newDeleteSubTaskName,
} from "@/api/executionManagement";

import SearchBar from "./components/SearchBar.vue";
import StageMaintenance from "./components/StageMaintenance.vue";
import DeliveryDialog from "./components/DeliveryDialog.vue";
export default {
  provide() {
    return {
      baseUrl: config.uploadBaseUrl,
      imgBaseUrl: config.imgBaseUrl,
      uploadRequest: upload,
      uploadBaseUrl: config.uploadBaseUrl,
      // srtracetrackRequest: srtracetrack,
    };
  },
  components: {
    draggable,
    ProgressBar,
    SearchBar,
    StageMaintenance,
    DeliveryDialog,
  },

  data() {
    return {
      Synchronous: [], //同步过来的交付物存储
      isFromWorkBench: false, // 是否从工作台进入
      isEdit: "",
      resetProgress: false, // 控制进度条是否重置
      dialogVisible: false,
      CurrentIndex: null,
      clicked: false,
      timer: null,
      uploadDialog: false,

      isEditing: {},
      flag: true,
      activeIndex: 0,
      firstFlag: true,
      showSubtask: false,
      formIndex1: 0,

      newForm: {
        id: 2,
        label: "新增一级节点",
      },
      defaultProps: {
        children: "children",
        label: "label",
      },
      expandedKeys: [], // 展开节点
      highlighColor: {
        color: "#FFAE0D",
        bgColor: "rgba(255, 174, 13, .1)",
      },
      showBtnGroup: true,

      cell_click_index: null, // 点击的单元格
      cell_click_label: "", // 当前点击的列名

      baseUrl: config.uploadBaseUrl,
      userInfo: store.getters.userInfo,
      currentNodeKey: null,

      treeData: [],
      centerDialogVisible3: false,
      centerDialogVisible4: false,
      theNew: "",
      table: {
        data: [], // 表格数据
        tableConfig: {
          // rowClassName: this.rowClassName,
          title: "表格的标题", // 表格标题
          highlightCurrentRow: false, // 控制表格是否单选
          // maxLength: 20, // 一行最多显示多少字，超出显示popver
          load: this.load,
          tooltipEffect: "light",
          maxHeight: "600",
          header: [],
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
      rules: {
        subTaskName: [
          {
            required: true,
            message: "请选择计价方式",
            trigger: ["blur", "change"],
          },
        ],
      },
      table2: {
        data: [], // 表格数据
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
            limit: 10,
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

      previewForm: {
        otherConfig: {
          labelNum: 140,
        },
        config: [
          {
            span: 24,
            type: "slot",
            slotName: "uploadFiles",
          },
        ],

        data: {
          uploadFiles: [], // 文件
        },
      },
      form7: {
        otherConfig: {
          labelNum: 120,
        },
        config: [
          {
            type: "upload",
            name: "",
            bind: "accessoryList",
            fileList: [],
            fileSize: 500,
            limit: 20,
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
      form2_jd: {
        otherConfig: {
          labelNum: 190,
        },
        config: [
          {
            type: "input",
            name: "阶段名称",
            // slotName: "jianshejindu",
            bind: "stageName",

            col: 20,
            trigger: "blur",
            // rules: {
            //   regular_Number3: "只能输入数字",
            // },
            required: "阶段名称不能为空",
          },
        ],
        data: {
          stageName: "",
          stageStartTime: "",
          stageEndTime: "",
          stageProgress: "",
        },
        enums: {
          statusList: [],
        },
      },
      projectId: null, //项目id
      rowID: null,
      isEdit: null,
      stageId: null,
      projectNames: "",
      systemNames: "",
      widthB: "",

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
      form8: {
        otherConfig: {
          labelNum: 120,
        },
        config: [
          {
            type: "upload",
            name: "",
            bind: "accessoryList",
            fileList: [],
            fileSize: 500,
            limit: 10,
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
        discloseId: null,
      },
      deliverableName: "",
      SynchronousName: "",
    };
  },
  computed: {
    displayItems() {
      return [
        {
          key: "system",
          label: "系统名称：",
          value: this.$route.query.systemNames,
          show: true,
        },
        {
          key: "project",
          label: "项目名称：",
          value: this.$route.query.projectNames,
          show: true,
        },
        {
          key: "section",
          label: `标段${this.$route.query.sectionSort}`,
          show: !!this.$route.query.sectionSort,
          isSpecial: true,
        },
      ].filter((item) => item.show);
    },
    userName() {
      return JSON.parse(sessionStorage.getItem("data"));
    },
    hasSynchronous() {
      return this.Synchronous && this.Synchronous.length > 0;
    },
    hasConstructionPermission() {
      return this.checkPermission(["CJDW_XMJL", "XMFZR", "JLGCS"]);
    },
    isAllTasksValid() {
      return this.table.data.every((task) => {
        return task.subTaskName && task.planStartTime && task.planEndTime;
      });
    },
  },
  created() {
    this.projectId = this.$route.query.projectId; //projectId

    this.contractId = this.$route.query.contractId; //contractId
    this.isSection = this.$route.query.isSection; //isSection
    this.sectionSort = this.$route.query.sectionSort; //contractId
    this.sectionCount = this.$route.query.sectionCount; //contractId

    this.pids = this.$route.query.ids; // stateId
    this.projectNames = this.$route.query.projectNames; // projectName
    this.systemNames = this.$route.query.systemNames; // systemName

    this.formIndex1 = Number(localStorage.getItem("formIndex1")) || 0;
    // this.handleNodeClick();
  },
  mounted() {
    if (
      this.$route.query.activeName == "待办" ||
      this.$route.query.activeName == "执行进度" ||
      this.$route.query.activeName == "已办"
    ) {
      this.isFromWorkBench = true;
    }
    this.init();
    this.initResizeObserver();
  },
  beforeDestroy() {
    this.destroyResizeObserver();
  },
  watch: {
    formIndex1(newVal) {
      localStorage.setItem("formIndex1", newVal);
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
    checkPermission(roles) {
      try {
        const currentRole = this.userInfo.currentRole.roleCode;
        return Array.isArray(roles)
          ? roles.includes(currentRole)
          : roles === currentRole;
      } catch (e) {
        console.error("权限校验失败:", e);
        return false;
      }
    },
    handleUploadComplete(uploadResult) {
      // 这里处理上传完成后的逻辑
      console.log("参数上传完成", uploadResult);

      // uploadResult.fileList.map((item)=>{
      //   console.log(item,'hahahahahah')
      // })
      console.log(this.deliveryId, "this.deliveryId");
      let data = {
        deliveries: uploadResult.fileList,
        subTaskId: this.deliveryId,
      };

      newuploadTemporarily(data).then((res) => {
        if (res.msg.code == "0000") {
          this.form7.data.accessoryList = [];
          // this.$message.success("保存成功");
          this.refreshList();
          this.getTreeData();
          this.uploadDialog = false;
          this.form7 = JSON.parse(JSON.stringify(this.form4));
        }
      });
      // alert('1')
      // 可以访问子组件实例：this.$refs.add
    },
    backWorkBench() {
      this.$router.go(-1);
    },

    handleEnter() {
      // 在这里处理回车键按下的逻辑
    },
    editFl(data, index) {
      data.newList = 1;

      // this.$set(data.newList, index, 1);
    },
    doneEditing(data, index) {
      data.newList = 1;
      this.saveTopLevelNode();
    },
    input() {
      this.flag = true;
    },
    refreshList() {
      const data1 = JSON.parse(sessionStorage.getItem("data")).id;
      let param = {
        pageNum: this.table.page.pageNum,
        pageSize: this.table.page.pageSize,
        projectId: this.projectId,
        contractId: this.$route.query.contractId,
        isSection: this.isSection,
        sectionSort: this.sectionSort,
        sectionCount: this.sectionCount,
      };
      newqueryTaskList(param).then((res) => {
        this.treeData = res.data.records;
        res.data.records.forEach((item) => {
          if (item.id == data1) {
            item.projectExecutionSubTaskVos.forEach((subTask) => {
              // 如果 subTaskProgress 为 null、undefined 或空字符串，则赋值为 0
              if (
                subTask.subTaskProgress == null ||
                subTask.subTaskProgress === ""
              ) {
                subTask.subTaskProgress = 0;
              }
            });

            this.table.data = item.projectExecutionSubTaskVos;
          }
        });
      });
    },
    editNode(data) {
      this.$prompt("请输入节点名称", "提示", {
        confirmButtonText: "确定",
        inputValue: data.label,
        cancelButtonText: "取消",
      }).then(({ value }) => {
        updateStageName({
          stageId: data.id,
          stageName: value,
        }).then((res) => {
          if (res.msg.code == "0000") {
            this.$message.success("编辑成功");
            this.form2_jd.data.stageName = "";
            this.isEdit = null;
            this.getTreeData();
          }
        });
        // this.$set(data, "label", value);
      });
    },
    // 添加节点
    handleAddNode(data, index) {
      const newItem = {
        stageName: "",
        currentFounder: JSON.stringify(this.userInfo.fullname),
        newList: 1,
        emplyFlag: true,
      };
      this.treeData.splice(index + 1, 0, newItem);
      this.treeData.map((item, index) => {
        item.displaySort = index * 100;
      });
    },
    emptyDeleteNode(data, index) {
      // 清空节点
      this.treeData.splice(index, 1);
    },
    // 删除节点
    handleDeleteNode(data) {
      this.$confirm(`确定删除'${data.stageName}'节点, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          removeStageById({ stageId: data.id }).then((res) => {
            if (res.msg.code == "0000") {
              this.$message.success("删除成功");
              this.getTreeData();
            }
          });
          //确认操作
        })
        .catch(() => {});
    },

    addTopLevelNode() {
      let stagParams = [
        {
          stageName: this.form2_jd.data.stageName,
          displaySort: 20000,
        },
      ];

      newupdateStageName({
        projectId: this.$route.query.projectId,
        contractId: this.$route.query.contractId,
        stageEntities: this.treeData,
        stageEntities: stagParams,
        sectionCount: this.$route.query.sectionCount,
      }).then((res) => {
        if (res.msg.code == "0000") {
          this.$message.success("添加成功");
          this.form2_jd.data.stageName = "";
          this.getTreeData();
        }
      });
    },
    saveTopLevelNode() {
      let saveFlag = true;
      this.treeData.map((item, index) => {
        item.displaySort = index * 100;
        if (Object.keys(item.stageName).length === 0) {
          saveFlag = false;
        }
        if (saveFlag) {
          item.newList = 0;
        }
      });

      if (saveFlag == false) {
        this.$message("阶段任务为空，请先填写在保存");
      } else {
        newupdateStageName({
          projectId: this.$route.query.projectId,
          contractId: this.$route.query.contractId,
          stageEntities: this.treeData,
          sectionCount: this.$route.query.sectionCount,
          // stageEntities: stagParams,
        }).then((res) => {
          if (res.msg.code == "0000") {
            this.$message.success("保存成功");
            this.getTreeData();
          }
        });
        Object.keys(this.isEditing).forEach((key) => {
          this.$set(this.isEditing, key, false);
        });
      }
    },
    skipGantt() {
      const param1 = {
        pageNo: this.table.page.pageNum,
        pageSize: 9999,
        projectId: this.$route.query.projectId,
      };

      queryExecutionLists(param1)
        .then((res) => {
          let startTimes = null;
          let endTimes = null;
          // 获取甘特图开始时间和结束时间
          const GantList = res.data.records;
          console.log(GantList, "当前的数据");
          if (GantList.length >= 1) {
            console.log(
              GantList[0].sectionCount != null,
              "GantList[0].sectionCount != null"
            );
            console.log(
              GantList[0].sectionCount >= 2,
              "GantList[0].sectionCount >= 2"
            );

            if (
              // GantList[0].sectionCount != null ||
              GantList[0].sectionCount >= 2
            ) {
              // 多标段逻辑
              GantList.forEach((item) => {
                item.contractVos.forEach((contract) => {
                  console.log(item, "为true的执行");
                  if (this.sectionSort === contract.sectionSort) {
                    startTimes = contract.ganttStartTime;
                    endTimes = contract.ganttEndTime;
                  }
                  console.log(startTimes, "第一步的开始时间");
                  console.log(endTimes, "第一步的结束时间");
                });
              });
            } else {
              // 单标段逻辑
              GantList.forEach((item) => {
                startTimes = item.ganttStartTime;
                endTimes = item.ganttEndTime;
              });
              console.log(startTimes, "第二步的开始时间");
              console.log(endTimes, "第二步的结束时间");
            }
          }
          console.log(endTimes, "甘特图结束时间");
          console.log(startTimes, "甘特图开始时间");
          // 检查时间是否为空
          if (endTimes != null) {
            this.$router.push({
              name: "executionManagementView",
              query: {
                contractId: this.$route.query.contractId,
                isSection: this.$route.query.isSection,
                sectionSort: this.$route.query.sectionSort,
                sectionCount: this.$route.query.sectionCount,
                ganttEndTime: endTimes,
                ganttStartTime: startTimes,
                projectId: this.$route.query.projectId,
                // 系统名称 项目名称
                systemNames: this.$route.query.systemNames,
                projectNames: this.$route.query.projectNames,
              },
            });
          } else {
            this.$message.error("子任务时间为空，请填写后再试");
          }
        })
        .catch((error) => {
          console.error("Error fetching execution lists:", error);
          this.$message.error("获取任务时间失败，请稍后再试");
        });
    },
    batchSave() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.clicked = true;
      this.timer = setTimeout(() => {
        this.clicked = false;
      }, 3000);
      if (this.isAllTasksValid) {
        newupdateSubTaskName({
          projectId: this.projectId,
          contractId: this.contractId,
          sectionCount: this.sectionCount,
          stageId: sessionStorage.getItem("rowId"),
          projectStageSubTasks: this.table.data,
        }).then((res) => {
          if (res.msg.code == "0000") {
            this.table.data.forEach((item) => {
              item.setingFlag = false;
            });
            this.$message.success("批量保存成功");
            this.refreshList();
          }
        });
      } else {
        this.table.data.forEach((item) => {
          this.$set(item, "setingFlag", true);
        });
        this.$message.error("请填写子任务和时间信息的必填字段");
      }
    },
    addSubtask() {
      this.formIndex1 += 1;
      this.table.data.push({
        actualEndTime: "",
        actualStartTime: "",
        assignee: "",
        creator: "",
        curDesc: "",
        description: "",
        id: null,
        isActiveEdit: "",
        isEdit: "",
        planEndTime: "",
        planStartTime: "",
        processId: "",
        status: "",
        subTaskName: "",
        subTaskProgress: "",
        taskId: "",
        taskName: "",
        taskNode: "",
        templateId: "",
        todo: "",
        setingFlag: true,
        newFlag: true,
        currentFounder: JSON.stringify(this.userInfo.fullname),
        newList: 0,
      });
    },

    handleEdit1(row) {
      this.$set(row, "setingFlag", true);
    },
    pageChanged(val) {
      this.table2.page.pageNum = val;
    },
    sizeChanged(val) {
      this.table2.page.pageNum = 1;
      this.table2.page.pageSize = val;
    },
    validateSubTask(row) {
      // 验证子任务名称和时间信息
      if (!row.subTaskName || !row.planStartTime || !row.planEndTime) {
        this.$message.error("请填写子任务名称和时间信息");
        return false;
      }

      // 验证进度是否为有效数字
      const progress = parseFloat(row.subTaskProgress || 0);
      if (isNaN(progress)) {
        this.$message.error("进度只能为数字格式");
        return false;
      }

      // 验证进度范围
      if (progress < 0) {
        this.$message.error("进度不能小于0");
        return false;
      } else if (progress > 100) {
        this.$message.error("进度不能大于100");
        return false;
      }

      // 更新进度值
      row.subTaskProgress = progress;
      return true;
    },
    validateSubTask(row) {
      // 当需要填写实际结束时间或开发进度为100%时，需要填写实际开始时间
      if (row.subTaskProgress === 100 && !row.actualStartTime) {
        this.$message.error(
          "当填写实际结束时间和开发进度为100%时，需要填写实际开始时间"
        );
        return false;
      }
      // 验证子任务名称和时间信息
      if (!row.subTaskName || !row.planStartTime || !row.planEndTime) {
        this.$message.error("请填写子任务名称和时间信息");
        return false;
      }

      // 验证进度是否为有效数字
      const progress = parseFloat(row.subTaskProgress || 0);
      if (isNaN(progress)) {
        this.$message.error("进度只能为数字格式");
        return false;
      }

      // 验证进度范围
      if (progress < 0) {
        this.$message.error("进度不能小于0");
        return false;
      } else if (progress > 100) {
        this.$message.error("进度不能大于100");
        return false;
      }

      // 更新进度值
      row.subTaskProgress = progress;
      return true;
    },
    conserve(row) {
      if (!this.validateSubTask(row)) {
        return; // 如果验证失败，终止后续操作
      }
      let conserveArr = [row];
      newupdateSubTaskName({
        projectId: this.projectId,
        contractId: this.contractId,
        sectionCount: this.sectionCount,
        stageId: sessionStorage.getItem("rowId"),

        projectStageSubTasks: conserveArr,
      }).then((res) => {
        if (res.msg.code == "0000") {
          row.setingFlag = false;
          this.$message.success("保存成功");
        }
      });
    },
    handleInputConfirm(row) {
      // row.setingFlag = false;
    },
    handleBlur(row) {
      // row.setingFlag = false;
    },
    init() {
      this.getTbHeader();
      this.getTbHeaderJFW();
      this.getTreeData();
    },

    handleNodeClick(data, index) {
      // 点击节点时触发
      this.activeIndex = index;
      this.resetProgress = true;
      this.showSubtask = true;
      this.getTreeData();
      this.table.data = data.projectExecutionSubTaskVos;
      this.$nextTick(() => {
        // 确保 DOM 更新完成后，重新从后端获取进度值
        // this.fetchProgress();
        this.refreshList();
        this.getTreeData();
      });
      sessionStorage.setItem("rowId", data.id - 0);
      sessionStorage.setItem("data", JSON.stringify(data));
    },
    resetDone() {
      // 重置完成后恢复状态
      this.resetProgress = false;
    },
    remove(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex((d) => d.id === data.id);
      children.splice(index, 1);
    },
    getTreeData() {
      let param = {
        pageNum: this.table.page.pageNum,
        pageSize: this.table.page.pageSize,
        projectId: this.projectId,
        contractId: this.$route.query.contractId,
        isSection: this.isSection,
        sectionSort: this.sectionSort,
        sectionCount: this.sectionCount,
      };
      newqueryTaskList(param).then((res) => {
        this.treeData = res.data.records;

        this.treeData.forEach((item) => {
          item.EditFlag = false;
        });

        if (this.firstFlag) {
          this.table.data = res.data.records[0].projectExecutionSubTaskVos;

          sessionStorage.setItem("rowId", res.data.records[0].id - 0);

          sessionStorage.setItem("data", JSON.stringify(res.data.records[0]));
          this.firstFlag = false;
        }
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
      this.getTreeData();
    },
    getTbHeader() {
      // 子任务列表表头
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
      });
    },

    // 阶段编辑

    // 返回列表
    goback() {
      this.$router.push({ name: "executionManagement" });
      // this.$router.go(-1); // 返回上一级路由
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

    zxjdu(row) {
      if (row.id == null) {
        this.$message.error("请先保存子任务");
      } else {
        this.subId = row.id;
        this.centerDialogVisible4 = true;
        this.$forceUpdate();
      }
      // alert("阶段页面");
      // this.$router.push({ name: "childrenTask" });
    },

    quxiao() {
      // alert('1')
      this.centerDialogVisible4 = false;
      this.$forceUpdate();
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
              // this.getTreeData();

              // this.$forceUpdate();
              if (res.msg.code == "0000") {
                this.refreshList();

                this.$message.success("删除成功");
              }
            });
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

    // 上传
    uploading(row, index) {
      console.log(row, index);
      this.deliveryId = row.id;
      this.$set(this.form7.data, "accessoryList", row.deliveries);
      // this.uploadDialog = true;
    },
    uploadLook(row) {
      console.log(row, "row");
      console.log(row.subTaskName);

      this.deliveryId = row.id;
      this.deliverableName = "(" + row.subTaskName + ")交付物附件";

      this.dialogVisible = true;
      // row.deliveries 自己上传的交付物
      this.previewForm.data.uploadFiles = row.deliveries;
      // row.syncDeliveries 同步过来的交付物
      this.Synchronous = row.syncDeliveries;
      console.log(this.Synchronous, "syncDeliveries");
      // 如果是开工阶段那么名称为：项目启动流程-开工申请环节交付物
      // 如果是初步验收阶段那么名称为：项目初验流程-初验申请环节交付物
      // 如果是终验阶段那么名称为：项目终验流程-终验申请环节交付物
      console.log(this.userName.stageName, "data.stageNamedata.stageName");
      if (this.userName.stageName == "开工阶段") {
        this.SynchronousName = "项目启动流程-开工申请环节交付物";
      } else if (this.userName.stageName == "初步验收阶段") {
        this.SynchronousName = "项目初验流程-初验申请环节交付物";
      } else if (this.userName.stageName == "终验阶段") {
        this.SynchronousName = "项目终验流程-终验申请环节交付物";
      }
    },
    getSize(size) {
      if (typeof size == "string") return size;
      return (parseFloat(size) / 1024 / 1024).toFixed(2) + "mb";
    },
    CloseuploadDialog() {
      this.uploadDialog = false;
    },
    // 保存提交
    uploadingJfw() {
      const files = [];
      this.form7.data.accessoryList.map((item) => {
        files.push({
          id: item.id,
          name: item.name,
          size: this.getSize(item.size),
        });
      });
      let data = {
        deliveries: files,
        subTaskId: this.deliveryId,
      };

      newuploadTemporarily(data).then((res) => {
        if (res.msg.code == "0000") {
          this.form7.data.accessoryList = [];
          this.$message.success("保存成功");
          this.refreshList();
          this.getTreeData();
          this.uploadDialog = false;
          this.form7 = JSON.parse(JSON.stringify(this.form4));
        }
      });
    },

    // 保存提交

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
        updateDeliveryInfo({ deliverys: tables }).then((res) => {
          if (res.msg.code == "0000") {
            this.$message.success("保存成功");
            this.centerDialogVisible4 = false;
            this.$forceUpdate();
          }
        });
      }
    },
    // 附件预览
    handlePreview(file) {
      console.log(file, "hahhahahah");
      let token = sessionStorage.getItem("token");
      if (
        ["doc", "docx", "txt", "html", "pdf", "ppt", "pptx", "html"].includes(
          file.name.split(".").pop()
        )
      ) {
        window.open(`${this.baseUrl}/viewPdf?id=${file.id}`);
      } else if (
        [
          "bmp",
          "jpg",
          "jpeg",
          "gif",
          "png",
          "zip",
          "rar",
          "xls",
          "xlsx",
        ].includes(file.name.split(".").pop())
      ) {
        window.open(
          `${this.baseUrl}/jfzg/file/api/file/download?key=${file.id}&access_token=${token}`
        );
      }
    },

    // 附件下载
    handleDownload(file) {
      let token = sessionStorage.getItem("token");
      window.open(
        `${this.baseUrl}/jfzg/file/api/file/download?key=${file.id}&access_token=${token}`
      );
    },
    // 附件删除
    handleDeletePlease(file, index) {
      this.$confirm("是否删除当前的交付物", "提示", {
        iconClass: "el-icon-question",
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        showClose: true,
        type: "warning",
      }).then(() => {
        this.previewForm.data.uploadFiles.splice(index, 1);
        let data = {
          deliveries: this.previewForm.data.uploadFiles,
          subTaskId: this.deliveryId,
        };

        newuploadTemporarily(data).then((res) => {
          if (res.msg.code == "0000") {
            this.form7.data.accessoryList = [];
            this.$message.success("交付物删除成功");
            this.refreshList();
            this.getTreeData();
            this.uploadDialog = false;
            this.form7 = JSON.parse(JSON.stringify(this.form4));
          }
        });
      });
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

      this.$forceUpdate();
    },
    // 添加其他交付物
    addQtJd() {
      this.formIndex += 1;

      this.table2.data.push({
        name: "其他交付物",
        fileContext: null,
        fileName: null,
        fileSize: null,
        // id: null,
        isMustUpload: 0,
        isUpload: null,
        milestoneId: null,
        stageSubTaskId: this.subId,
        uploadPerson: null,
        uploadTime: null,
      });

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
        // this.$message({
        //   message: `【${arr.join(",")}】不能为空，请上传文件`,
        //   type: "warning",
        // });
      } else {
        updateDeliveryInfo({ deliverys: tables }).then((res) => {
          if (res.msg.code == "0000") {
            this.$forceUpdate();
          }
        });
      }
    },
    deleteRow(row) {
      this.$confirm("是否删除该条数据", "提示", {
        iconClass: "el-icon-question",
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        showClose: true,
        type: "warning",
      }).then(() => {
        let find = (ele) => ele == row;
        const index = this.table2.data.findIndex(find);
        if (row.isMustUpload == 0) {
          if (row.id) {
            // this.$message.success("删除成功")
            // this.$message.success("删除成功");
            // alert('1')
            newDeleteSubTaskName({ id: row.id }).then((res) => {
              if (res.msg.code == "0000") {
                this.$message.success("删除成功");
                this.table2.data.splice(index, 1);
              }
            });
            this.$forceUpdate();
          } else {
            newDeleteSubTaskName({ id: row.id }).then((res) => {
              if (res.msg.code == "0000") {
                this.table2.data.splice(index, 1);
              }
            });

            // alert('3')
            // this.$message.success("删除成功");

            this.$forceUpdate();
          }
        } else if (row.isMustUpload == 1) {
          this.$message.error("不可删除");
        } else if (row.isMustUpload == null) {
        }
      });
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
        // this.form.data.progress = inputContent;
      }
    },
    // 把每一行的索引放进row
    table_row_class_name({ row, rowIndex }) {
      row.index = rowIndex;
    },
    // 单元格点击事件
    cell_click(row, column, cell, event) {
      this.cell_click_index = row.index;
      this.cell_click_label = column.label;
    },
    // 确定修改
    determine_modify(row) {},
  },
  // 点击取消
  cancel(status) {
    switch (status) {
      case "cancel_edit":
        this.cell_click_index = null;
        this.cell_click_label = "";
        break;
      default:
        break;
    }
  },
};
</script>

<style lang="scss" scoped>
.total-page {
  background: #fff;
  // height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
}
.container {
  display: flex;
  flex: 1 1 auto; /* 伸缩占据剩余空间 */
  overflow: hidden;
}

.container-header {
  display: flex;
  width: 100%;
  text-align: center;
  align-items: center;
  justify-content: center;
  // background-color: #f0f0f0; /* 为了视觉效果 */
  // border-bottom: solid 1px #f0f0f0;

  // margin: 20px;
  margin-bottom: 10px;
  div {
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
  }
  color: rgba(51, 51, 51, 1);
}

.container-left {
  width: 230px;
  height: calc(100% - 30px);
  // border-right: #e6e6e6 solid 11px;
  overflow-y: auto;

  .container_list {
    height: 600px;
    overflow: auto;
  }
}
.container-right {
  background: #f1f1f1;
  padding: 15px;
  flex: 1;
  line-height: 30px;
  // border: 1px solid #ccc;
  overflow: hidden;
  overflow-y: auto;
  /*文本超出隐藏*/
  // text-overflow: ellipsis;
  /*文本超出显示省略号*/
  // white-space: nowrap;
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
.search {
  display: flex;
  justify-content: space-between;
  margin: 10px;
}
.btns {
  // margin-top: 20px;
  width: 30px;
  text-align: center;
  height: 30px;
  line-height: 30px;
  border-radius: 22px;
  background: rgba(66, 130, 255, 0.1);
  cursor: pointer;
  border: 1px dashed rgba(66, 130, 255, 1);
  color: #ccc;
}
.btns_rw {
  // margin-top: 20px;
  width: 112px;
  text-align: center;
  height: 34px;
  line-height: 34px;
  border-radius: 4px;
  background: rgba(66, 130, 255, 0.1);
  cursor: pointer;
  border: 1px dashed rgba(66, 130, 255, 1);
  float: right;
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

.el-table__body-wrapper {
  overflow-x: hidden !important ;
}
.el-table {
  width: 100%;
}
.table-container {
  overflow: hidden;
  white-space: nowrap;
}

.el-table__body-wrapper {
  cursor: grab;
}

.el-table__body-wrapper:active {
  cursor: grabbing;
}

::v-deep .el-table__body-wrapper::-webkit-scrollbar {
  height: 3px !important; /* 横向滚动条 必写 */
}

::v-deep .el-table__body-wrapper::-webkit-scrollbar-thumb {
  //  设置滚动条哑颜色，根据自己选择设置
  border-radius: 3px;
}



.stage_button {
  position: absolute;
  bottom: 20px;
}

.custom-tree-node {
  display: flex;
}
.container-left {
  overflow: auto; /* 保持可滚动 */
  scrollbar-width: none; /* 对于 Firefox 隐藏滚动条 */
}
.container-left::-webkit-scrollbar {
  overflow: hidden;
  display: none; /* 对于 Chrome, Safari 和 Opera 隐藏滚动条 */
}
.custom-container {
  top: 8px;
  width: 220px;
  height: 36px;
  opacity: 1;
  display: flex;
  // justify-content: flex-start;
  align-items: center;
  padding: 8px 16px 8px 0px;
  div {
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0px;
    line-height: 20px;
    color: rgba(51, 51, 51, 1);
    text-align: left;
    vertical-align: top;
    font-weight: 800;
  }
}

.custom_tree {
  // 236，243，251
  border-left: 2px solid rgb(104, 137, 204);

  // background: linear-gradient(to left, rgb(104, 137, 204), skyblue) repeat;
  // background: rgb(236, 243, 251);
  background: #f1f1f1;

  // background: linear-gradient(to left, rgb(70, 130, 246), rgb(255, 255, 255)) repeat;
}
.highlighted {
  left: 0px;
  top: 8px;
  width: 102px;
  height: 20px;
  opacity: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  line-height: 20px;

  // background: #000;
  // border-left: 2px solid rgba(1, 118, 255, 1);
  font-weight: 800;
  // background: linear-gradient(to left, rgb(70, 130, 246), rgb(75, 130, 245));
  color: #fff !important;

  div {
    left: 0px;
    top: 8px;
    width: 102px;
    height: 20px;
    font-weight: 800;
    opacity: 1;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    line-height: 20px;
    // color: rgba(1, 118, 255, 1) !important;
    color: #3794ff;

    margin-left: 10px;
    // min-width: 120px;
    // max-width: 120px;
    // overflow: hidden;
    // text-overflow: ellipsis;
    // white-space: nowrap;
    // display: block;
    // font-size: 12px;
  }
}

.bold-table-header th {
  color: #ff0000; /* 红色字体 */
}

::v-deep.el-table th {
  // background: #000;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0px;
  line-height: 40px;
  color: rgba(29, 33, 41, 1);
  text-align: center;
  vertical-align: top;
  background: rgba(246, 248, 250, 1);
  // background-color: #a7c0dc !important; /* 你想要的颜色 */
}
.elIcon {
  width: 110px;
  display: flex;
  margin-right: 0px;

  // margin-left: 100px;
  span {
    padding-left: 8px;
    line-height: 40px;
    // font-size: 16px;
  }
}

::v-deep .table-cell-center {
  text-align: center;
  vertical-align: middle;
  height: 30px;
  // border-bottom: #3794ff solid 1px;
}
.stageList {
  margin-left: 10px;
  min-width: 120px;
  cursor: pointer;
  // max-width: 120px;
  // overflow: hidden;
  // text-overflow: ellipsis;
  // white-space: nowrap;
  // display: block;
}
.element {
  background-color: white; /* 默认背景色为白色 */
  padding-bottom: 10px;
  transition: background-color 0.3s; /* 平滑过渡背景色变化 */
}

/* 当鼠标悬停时，元素的背景色变为蓝色 */
.element:hover {
  font-weight: 800;
  color: rgba(1, 118, 255, 1) !important;
}
.placeholder_custom {
  height: 65px;
  // text-align: center;
  margin-left: 10px;
  line-height: 65px;
  font-size: 18px;
  font-weight: 800;
}
.header_star {
  color: red;
  margin-left: 3px;
  margin-bottom: 2px;
}

.section {
  border: 1px solid rgb(214, 217, 229);
  padding: 5px;
  margin-left: 5px;
  background: linear-gradient(to right, rgb(230, 241, 255), rgb(255, 255, 255));
  color: rgba(66, 130, 255, 1) !important;
}

.value_box {
  min-height: 44px;
  display: flex;
  align-items: center;
  width: 100%;
  border-bottom: none;
  .itm_label {
    height: 100%;
    width: 50%;
    background-color: #f7f7f7;
    padding: 10px 0 12px 12px;
    display: flex;
    align-items: center;
  }
  .itm_content {
    height: 100%;
    width: 50%;
    padding-left: 12px;
    display: flex;

    align-items: center;
    .file_name {
      overflow: hidden; //隐藏文字
      text-overflow: ellipsis; //显示...
      white-space: nowrap; //不换行
      flex: 1;
      height: 100%;
      line-height: 44px;
    }
    .icon-view {
      font-size: 24px;
      margin-right: 10px;
    }
    .icon-download {
      width: 30px;
      height: 100%;
      line-height: 44px;
      font-size: 26px;
      padding-right: 10px;
    }
  }
  .itm_value {
    width: 50%;
    height: 100%;
    padding: 9px 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-left: 1px solid #dedddd;
    .v {
      flex: 1;
      display: inline-block;
      margin-right: 5%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .more {
      width: 30px;
      cursor: pointer;
      color: #1890ff;
    }
  }
  .itm_content_File {
    width: 50%;
    .files-item-content {
      display: flex;
      align-items: center;
      line-height: 22px;
      border-bottom: 2px solid #eee;
      border-left: 1px solid #dedddd;
      padding: 0 10px;
      cursor: pointer;
      &:last-child {
        border-bottom: 0;
      }
      &:hover {
        background-color: #f5f5f5;
      }
      .file_name {
        text-decoration: underline;
        overflow: hidden; //隐藏文字
        text-overflow: ellipsis; //显示...
        white-space: nowrap; //不换行
        flex: 1;
        height: 100%;
        line-height: 44px;
        padding-left: 20px;
      }
      .icon-view {
        font-size: 24px;
        margin-right: 10px;
        &:hover {
          font-size: 26px;
        }
      }
      .icon-download {
        width: 30px;
        height: 100%;
        line-height: 44px;
        font-size: 26px;
        padding-right: 10px;
        &:hover {
          font-size: 28px;
        }
      }
    }
  }
  .primary {
    color: #1890ff;
    cursor: pointer;
  }
}

.el-table__body-wrapper::-webkit-scrollbar {
  display: none !important;
  /* 对于Webkit浏览器 */
}

.el-table__body-wrapper {
  -ms-overflow-style: none !important;
  /* 对于IE和Edge */
  scrollbar-width: none !important;
  /* 对于Firefox */
}

.el-scrollbar {
  // 横向滚动条
  .el-scrollbar__thumb {
    opacity: 0; // 默认滚动条自带透明度
    height: 8px; // 横向滑块的宽度
    border-radius: 0px; // 圆角度数
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.15); // 滑块阴影
  }

  // 纵向滚动条
  .el-scrollbar__thumb {
    opacity: 0;
    width: 0px; // 纵向滑块的宽度
    border-radius: 2px;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.15);
  }
}

// 滚动条
.container-right::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 0px;
}
.container-right::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 5px;
  // -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #fff;
}
.container-right::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  // -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background: #ffffff;
}

.project-info {
  margin: 0 auto;
  display: flex;
  align-items: center;
  font-size: 14px;
  .info-item {
    margin-right: 20px;
    font-weight: 900;
    .info-label {
      font-weight: 900;
      font-size: 16px;
    }
  }
  .has-special .info-label {
    // border: 1px solid #409EFF;
    padding: 5px;
    background: linear-gradient(#00b4db, #0083b0);
    color: white;
  }
}
// class="el-table_1_column_2   table-cell-center"

::v-deep .sr-add .el-form-item__label {
  display: none !important;
}

::v-deep .more_file {
  display: none !important;
}
::v-deep .sr-big-upload .uploadDiv > .uploader-file-info {
  display: none !important;
}

::v-deep .el-form-item__content {
  margin-left: 10px !important;
  // background:  #000 !important;
}
// ::v-deep.file-name{
//   display: none !important;
// }

::v-deep .sr-big-upload .uploader-btn .btn {
  height: 30px;
  position: relative !important;
  overflow: hidden !important;
  visibility: hidden !important; /* 隐藏原始文字 */
}
::v-deep .sr-big-upload .uploader-btn .btn::after {
  content: "上传";
  position: absolute;
  top: 12px;
  left: 0;
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #3794ff;
  visibility: visible; /* 确保伪元素文字可见 */
}

::v-deep .uploader-list {
  display: none !important;
}

.attachment-list {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;

  .attachment-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 20px;
    margin: 8px 0;
    background: #f8f9fa;
    border-radius: 8px;
    transition: all 0.3s ease;
    border: 1px solid #e9ecef;

    &:hover {
      background: #fff;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    .file-info {
      display: flex;
      flex: 1;
      min-width: 0;

      .original-name {
        font-weight: 500;
        color: #2c3e50;
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .upload-name {
        font-size: 12px;
        color: #6c757d;
        margin-top: 4px;
      }
    }

    .actions {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-left: 20px;

      i {
        font-size: 18px;
        color: #6c757d;
        cursor: pointer;
        transition: color 0.3s ease;

        &:hover {
          color: #409eff;
        }
      }

      .el-icon-delete:hover {
        color: #f56c6c;
      }
    }
  }
}

.no-attachments {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px dashed #e9ecef;

  .empty-state {
    text-align: center;
    padding: 40px;

    .empty-icon {
      font-size: 64px;
      color: #ced4da;
      margin-bottom: 16px;
    }

    .empty-text {
      color: #6c757d;
      font-size: 16px;
      margin: 0;
      letter-spacing: 0.5px;
    }
  }
}

::v-deep .el-table .cell {
}
.uploading_span {
  font-size: 12px !important;
}


.deliverable-column {
  // width: 48%;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 10px;
  background-color: #fff;
}

.column-header {
  // margin-bottom: 10px;
  padding: 10px;

  border-bottom: 1px solid #ebeef5;
}

.attachment-list {
  max-height: 400px;
  overflow-y: auto;
}

.attachment-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px dashed #ebeef5;
}

.file-info {
  flex: 1;
}

.original-name {
  font-weight: bold;
  margin-bottom: 4px;
}

.upload-name {
  color: #999;
  font-size: 12px;
}

.actions {
  display: flex;
  gap: 10px;
}

.no-attachments {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
}

.empty-state {
  text-align: center;
}

.empty-icon {
  font-size: 40px;
  color: #ddd;
  margin-bottom: 10px;
}

.empty-text {
  color: #999;
}

.deliverable-container {
  transition: all 0.3s;
}

.columns-layout {
  display: flex;
  gap: 24px; /* 添加列间距 */
}

.main-column {
  border: 1px solid #ebeef5;
  flex: 1;
}

.full-width {
  border: 1px solid #ebeef5;
  width: 100%;
}

.sync-column {
  border: 1px solid #ebeef5;
  flex: 1;
  max-width: 50%; /* 限制右侧最大宽度 */
}

.column-header {
  margin-bottom: 1px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.attachment-list {
  min-height: 200px;
}
</style>
