<template>
  <section class="task_detail bgColor">
    <el-tabs
      v-model="activeName"
      @tab-click="handleClick"
      class="tabList"
      style="padding: 0 20px"
    >
      <el-tab-pane
        v-for="item in projectPhase"
        :key="item.stageId"
        :label="item.stageName"
        :name="item.stageId"
      ></el-tab-pane>
    </el-tabs>
    <div class="jiaofuwu collapse_title">
      <div class="el-collapse">
        <div
          class="el-collapse-item"
          v-for="(item, index) in data.slice(0, count)"
          :key="item.id"
          :name="index"
        >
          <div class="title-item">
            <el-row>
              <el-col :span="16">
                <span class="title jiaofuwuTitle" v-if="index > 8"
                  >{{ index + 1 }} {{ item.name }}</span
                >
                <span class="title jiaofuwuTitle" v-else
                  >{{ "0" + (index + 1) }} {{ item.name }}</span
                >
                <span class="title_isChecked">{{
                  item.isChecked == "0" ? "无验收需求" : "有验收需求"
                }}</span>
                <uploaderView
                  :view-data="item.modelData"
                  v-show="item.modelData != ''"
                ></uploaderView>
                <span
                  v-if="item.status == '0' && $checkBtnCode('M005_004_003_008')"
                  @click="isSureAdd(item.id)"
                  class="shenhe"
                >
                  <span class="dot yellow"></span>待审核
                </span>
              </el-col>
              <el-col :span="4">
                <span class="textBox">{{
                  "文件数量: " + item.data.length
                }}</span>
              </el-col>
              <el-col
                :span="2"
                v-show="item.status == '3' && $checkBtnCode('M005_004_003_007')"
                :class="
                  item.status == '3' && $checkBtnCode('M005_004_003_007')
                    ? ''
                    : 'delete-btn'
                "
              >
                <el-button type="text" @click="deleteJFW(item.id, item.status)">
                  <i class="icon el-icon-delete"></i>
                </el-button>
              </el-col>
              <el-col :span="2">
                <span class="operate-btn">
                  <el-link
                    v-if="item.expand"
                    @click="operateClick(item, index)"
                    class="operate"
                    type="text"
                    :underline="false"
                  >
                    收起
                    <i class="el-icon-arrow-up el-icon--right"></i>
                  </el-link>
                  <el-link
                    v-else
                    class="operate"
                    @click="operateClick(item, index)"
                    type="text"
                    :underline="false"
                  >
                    展开
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </el-link>
                </span>
              </el-col>
            </el-row>
          </div>
          <!-- 删除交付物审核弹框 -->
          <el-dialog
            :title="JFWTitle"
            :visible.sync="dialogFormDelete"
            append-to-body
            width="800px"
            class="common-dialog"
          >
            <FormView
              class="form-temp"
              :formData="agreeView.config"
              :ruleForm="agreeView.data"
            />
            <div slot="footer" class="dialog-footer" style="text-align: center">
              <el-button type="primary" @click="agreeDelete(item.id)"
                >同 意</el-button
              >
              <el-button @click="noAgreeAdd(item.id)">不同意</el-button>
            </div>
          </el-dialog>
          <div v-if="item.expand">
            <FTable
              :data="item.data"
              :config="table.config"
              :formatter="tableFormatter"
            >
              <template slot="cellSlot" slot-scope="{ scope }">
                <!-- 文件名称 -->
                <template v-if="scope.item.prop == 'fileName'">
                  <i class="iconfont iconfujian"></i>
                  {{ scope.row.fileName }}
                </template>
                <!-- 是否是盖章件 -->
                <template v-if="scope.item.prop == 'sourceIsSeal'">
                  <div v-if="item.status == '3'">
                    <span v-if="scope.row.sourceIsSeal == 1">是</span>
                    <div v-else>
                      <el-checkbox
                        v-model="scope.row.isSelect"
                        @change="changeRadioValue(scope.row)"
                        :disabled="
                          scope.row.sourceStatus == '4' ||
                          scope.row.sourceStatus == '2'
                            ? false
                            : true
                        "
                        >是</el-checkbox
                      >
                      <!--  -->
                    </div>
                  </div>
                </template>
                <!-- 状态 -->
                <template v-if="scope.item.prop == 'sourceStatus'">
                  <span
                    class="dot"
                    :class="
                      scope.row.sourceStatus == 1 ||
                      scope.row.sourceStatus == '0'
                        ? 'yellow'
                        : scope.row.sourceStatus == 2 ||
                          scope.row.sourceStatus == 4
                        ? 'green'
                        : 'red'
                    "
                  ></span>
                  <span v-if="scope.row.sourceStatus == '4'">已通过</span>
                  <span v-else>{{
                    scope.row.sourceStatus == "1" ||
                    scope.row.sourceStatus == "0"
                      ? "待审核"
                      : scope.row.sourceStatus == "2"
                      ? "已通过"
                      : "未通过"
                  }}</span>
                </template>
                <!-- 大小 -->
                <template v-if="scope.item.prop == 'size'">{{
                  scope.row.size
                }}</template>
                <!-- 操作 -->
                <template
                  v-if="
                    scope.item.prop == 'operating' || scope.item.prop == 'dept'
                  "
                >
                  <el-tooltip
                    content="预览"
                    placement="bottom"
                    v-if="item.status != '1'"
                  >
                    <el-button type="text" @click="seeclick(scope.row)">
                      <i class="icon el-icon-view"></i>
                    </el-button>
                  </el-tooltip>
                  <div
                    style="display: inline"
                    v-if="item.status != '1' && scope.row.dept == true"
                  >
                    <el-upload
                      v-if="!item.showHide"
                      style="display: inline"
                      class="upload-file"
                      :action="itemurl"
                      :accept="item.fileType"
                      :on-success="
                        (res) => {
                          return successFile(
                            item,
                            res,
                            item,
                            item.id,
                            scope.row
                          );
                        }
                      "
                    >
                      <el-tooltip content="更新" placement="bottom">
                        <el-button type="text">
                          <i class="icon el-icon-refresh"></i>
                        </el-button>
                      </el-tooltip>
                    </el-upload>
                  </div>
                  <el-tooltip
                    content="下载"
                    placement="bottom"
                    v-if="item.status != '1'"
                  >
                    <el-button type="text" @click="upclick(scope.row)">
                      <i class="icon el-icon-download"></i>
                    </el-button>
                  </el-tooltip>
                  <el-tooltip
                    content="历史版本"
                    placement="bottom"
                    style="margin-left: 15px"
                    v-if="item.status != '1'"
                  >
                    <el-button type="text" @click="historyVerdion(scope.row)">
                      <i class="icon el-icon-chat-round"></i>
                    </el-button>
                  </el-tooltip>
                  <el-tooltip
                    content="删除"
                    placement="bottom"
                    style="margin-left: 15px"
                    v-if="
                      item.status != '1' &&
                        $checkBtnCode('M005_004_003_004') &&
                        scope.row.dept == true
                    "
                  >
                    <el-button type="text" @click="deleteFile(scope.row)">
                      <i class="icon el-icon-delete"></i>
                    </el-button>
                  </el-tooltip>
                </template>
                <!--审核 -->
                <template class="shBtn" v-if="scope.item.prop == 'audit'">
                  <div v-if="item.status == '3'">
                    <div v-if="shenheBtn || $checkBtnCode('M005_004_003_001')">
                      <el-button
                        @click="auditDialog(scope, scope.row)"
                        size="mini"
                        v-if="
                          scope.row.sourceStatus == '1' ||
                            scope.row.sourceStatus == '0'
                        "
                        >审核</el-button
                      >
                    </div>
                    <div v-if="$checkBtnCode('M005_004_003_002')">
                      <el-button
                        @click="auditDialog(scope, scope.row)"
                        size="mini"
                        v-if="
                          scope.row.sourceStatus == '3' ||
                            scope.row.sourceStatus == '2'
                        "
                        >查看审核结果</el-button
                      >
                    </div>
                  </div>
                </template>
              </template>
            </FTable>
            <!-- 上传文件 -->
            <div
              v-if="item.status == '3' && $checkBtnCode('M005_004_003_003')"
              class="upload-type"
            >
              <el-upload
                class="upload-file"
                :action="itemurl"
                :accept="item.fileType"
                :before-upload="
                  (res) => {
                    return callBeforeUpLoad(item, res);
                  }
                "
                :on-success="
                  (res) => {
                    callSuccessFn(item, res, item, item.id);
                  }
                "
                :on-error="
                  (res) => {
                    callSuccessFn(item.errorFn, res);
                  }
                "
                :on-remove="
                  (res) => {
                    callRemoveFn(item, res);
                  }
                "
                :limit="item.limit"
              >
                <el-button class="upload-before_tip" v-if="!item.isshow">
                  <img :src="upImg" alt class="uploadImg_before" />
                  <span class="upload_title">上传本地文件</span>
                </el-button>
                <div
                  slot="tip"
                  class="el-upload__tip tip_all"
                  v-if="item.fileTip"
                ></div>
              </el-upload>
              <img :src="tipImg" alt class="uploadImg_class" />
              <span class="up_tip" style="color: #999999">{{ fileTip }}</span>
            </div>
            <div class="deleteType">
              <span class="text" v-if="item.status == '1'">
                <span v-if="supervisorName1"
                  >该交付物类型及文件已经删除，待({{
                    buildName + "/" + supervisorName1
                  }})确认是否删除</span
                >
                <span v-else
                  >该交付物类型及文件已经删除，待({{
                    buildName
                  }})确认是否删除</span
                >
                <span
                  @click="isDeleteJFW(item.id)"
                  class="btn"
                  v-if="item.status == '1' && $checkBtnCode('M005_004_003_008')"
                  >去确认 >></span
                >
              </span>
            </div>
          </div>
        </div>
        <auditDialog
          ref="auditDialog"
          @selectBcttt="deliveryAuditSubmit"
        ></auditDialog>
      </div>
      <!-- 加载更多 -->
      <div class="getall" v-if="data.length > 20">
        <span @click="getAll" v-if="btnBlock" style="cursor: pointer">
          展开更多
          <i class="el-icon-arrow-down"></i>
        </span>
        <span @click="putAway" v-if="!btnBlock" style="cursor: pointer">
          收起更多
          <i class="el-icon-arrow-up"></i>
        </span>
      </div>
    </div>
    <div>
      <div class="footerBtn">
        <el-button @click="addTemplate" v-if="$checkBtnCode('M005_004_003_006')"
          >从模板添加</el-button
        >
        <el-button
          @click="handleAddDeliverables"
          v-if="$checkBtnCode('M005_004_003_005')"
          >增加交付物</el-button
        >
      </div>
      <!-- 从模板中添加 -->
      <el-dialog
        title="模板中添加"
        :visible.sync="dialogTableVisible"
        append-to-body
        width="800px"
        class="common-dialog"
      >
        <el-tabs @tab-click="handleClicktemple" v-model="activeName2">
          <el-tab-pane
            v-for="item in mobanStageData"
            :key="item.id"
            :label="item.stageName"
            :name="item.id"
          ></el-tab-pane>
        </el-tabs>
        <FTable
          :data="tableData.data"
          :config="tableData.config"
          :page="tableData.page"
          @pageChanged="getPageData"
          @sizeChanged="getSizeDate"
          :formatter="formatter"
          @selected="selectTable"
          v-if="dialogTableVisible"
        >
          <template slot="cellSlot" slot-scope="{ scope }">
            <el-select v-model="scope.row.isCheck" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
        </FTable>
        <div slot="footer" class="dialog-footer" style="text-align: center">
          <el-button type="primary" @click="addTemplateSure">确 定</el-button>
          <el-button @click="dialogTableVisible = false">取 消</el-button>
        </div>
      </el-dialog>
      <!-- 增加交付物 -->
      <el-dialog
        :title="title"
        :visible.sync="dialogFormVisible"
        append-to-body
        width="850px"
        @close="closeDialog"
        class="common-dialog"
      >
        <el-tabs v-model="activeName" @tab-click="handleClick" class="tabList">
          <el-tab-pane
            v-for="item in projectPhaseList"
            :key="item.stageId"
            :label="item.stageName"
            :name="item.stageId"
          ></el-tab-pane>
        </el-tabs>
        <FForm
          ref="modelBsInfo"
          :config="form.config"
          :form="form.data"
          :rules="form.rules"
          :enums="form.enums"
          refForm="modelBsInfoForm"
          :column="2"
          v-if="dialogFormVisible"
        />
        <div slot="footer" class="dialog-footer" style="text-align: center">
          <el-button type="primary" @click="handAddSubmit">确 定</el-button>
          <el-button @click="dialogFormVisible = false">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </section>
</template>
<script>
import config from "@/settings.js";
import FFieldset from "@/components/FHeader/FFieldset.vue";
import FTable from "@/components/FTable/index.vue";
import auditDialog from "./auditDialog";
import pagination from "@/views/shishi/components/pagination.vue";
import { deliverDeliInfo } from "@/api/shishi/report";
import uploaderView from "@/components/FForm/uploaderView.vue";
import FormView from "@/components/FForm/form-view";
import FForm from "@/components/FForm/form-add";
import infoTip from "@/components/Tips/tip-info.vue";
import { api_updateVersion, api_deleteJFW } from "@/api/shishi/taskList.js";
import { queryMessageSave, queryBasicMessage } from "@/api/shishi/message";
import {
  api_JFWgetProjectDeliInfo,
  api_lcbFileInfo,
  api_uploadJFWFile,
  api_uploadJFWFileYH,
  api_template,
  api_deleteAllVersion,
  api_deleteAllVersionYH,
  api_addNewdelivery,
  api_addNewdeliveryYH,
  insertFileReview,
  insertFileReviewYH,
  uploadVersion, // 更新版本
  uploadVersionYH,
  deletedDelivery, // 删除整个交付物
  deletedDeliveryYH,
  getJFWDetails, // 获取交付物的详细信息
  updateDeliStatusYH, // 改变交付物的状态
  updateDeliStatus,
  updateSourcrIsSeal, // 修改是否为盖章件
  getProjectInfoById,
} from "@/api/shishi/delivery";
import {
  getmobanLCBAjax,
  getqueryListTemplStageDeliver,
} from "@/api/shishi/implement";
import { upload } from "@/api/zhuanjia/checkList";

export default {
  components: {
    FFieldset,
    FTable,
    uploaderView,
    pagination,
    FormView,
    auditDialog,
    FForm,
  },
  props: ["supervisorName"],
  data() {
    return {
      templId: "",
      supervisorName1: "",
      buildName: "",
      btnBlock: true,
      isSelect: 1,
      count: 20,
      JFWTitle: "删除交付物",
      flag: false,
      dialogFormDelete: false, // 删除交付物审核弹框
      options: [
        { id: 1, value: 0, label: "否" },
        { id: 2, value: 1, label: "是" },
      ],
      title: "从模板中添加",
      activeName2: "",
      activeName1: "",
      dialogTableVisible: false, // 从模板中添加弹框
      dialogFormVisible: false,
      stageId: "",
      itemurl: config.baseUrl + "/zuul/csopenapi/docapi/uploadBigFile",
      linkImg: require("@/assets/upload/link.png"),
      seeImg: require("@/assets/upload/see.png"),
      upImg: require("@/assets/upload/up_before.png"),
      tipImg: require("@/assets/upload/tip.png"),
      uploadImg: require("@/assets/upload/upload.png"),
      alldata: [],
      data: [],
      activeName: "",
      projectPhase: [],
      projectPhaseList: [],
      projectP: [],
      dialogVisible: false,
      tableData: {
        // 表格数据
        config: {
          header: [
            {
              name: "交付物名称",
              prop: "deliverName",
            },
            {
              name: "是否是验收项",
              prop: "isCheck",
              cellSlot: true,
            },
            {
              name: "模板",
              prop: "templFileId",
              haveHTML: true,
            },
          ],
          innerBtn: [
            {
              name: "添加",
              field: "statusOperat",
              method: "addDeliverables",
              value: [],
              icon: "icontianjia1",
            },
          ],
          // index: "序号", // 是否显示序号
          selection: true, // 是否显示复选框
          multiple: true,
          rowkey: "id",
        },
        data: [],
        page: {
          pageNum: 1,
          pageSize: 5,
          pages: 0,
          total: 0,
        },
      },
      form: {
        config: [
          {
            type: "text",
            name: "交付物名称",
            placeholder: "请输入交付物名称",
            bind: "name",
            col: 24,
            required: "请输入交付物名称",
          },
          {
            type: "select",
            name: "是否为验收项",
            placeholder: "是否为验收项",
            bind: "isChecked",
            dataList: "taskLevelList",
            col: 24,
            required: "请选择是否为验收项",
            trigger: "change",
          },
          {
            type: "upload",
            name: "文档模板",
            col: 24,
            bind: "multipartFiles",
            fileList: [],
            limit: 1, //最大上传数量
            fileTip:
              "温馨提示:支持不超过50MB的doc,docx,xls,xlsx,ppt,pptx,pdf,txt,jpg,jpeg,jpe,png,rar,zip格式文件,最多可上传1个。", //提示
            fileType:
              "doc,docx,xls,xlsx,ppt,pptx,pdf,txt,jpg,jpeg,jpe,png,rar,zip", //校验
          },
        ],
        data: {
          multipartFiles: [],
        },
        enums: {
          taskLevelList: [
            {
              dataName: "是",
              dataValue: 1,
            },
            {
              dataName: "否",
              dataValue: 0,
            },
          ],
          // multipartFiles:[]
        },
        rules: {},
      },
      table: {
        data: [], // 表格数据
        config: {
          hideHeader: true,
          btnAlign: "right",
          fixed: "right",
          header: [
            { name: "文件名称", prop: "fileName", cellSlot: true },
            { name: "提交人", prop: "userName" },
            { name: "是否盖章件", prop: "sourceIsSeal", cellSlot: true },
            { name: "大小", prop: "size", cellSlot: true },
            { name: "上传时间", prop: "createTime" },
            { name: "状态", prop: "sourceStatus", cellSlot: true, width: 100 },
            { name: "当前处理单位", prop: "handleBuildName", width: 120 },
            { name: "操作", prop: "operating", cellSlot: true, width: 200 },
            { name: "审核", prop: "audit", cellSlot: true, width: 150 },
          ],
          // index: "序号" // 是否显示序号
        },
        page: {
          // 分页配置
          total: 0, //总条数
          pages: 0, //总页数
          pageSize: 5, //每页展示多少个
          pageNum: 1, //当前页
        },
      },
      result: [],
      activeNames: [],
      sourceId: "",
      fileIdList: [],
      templateList: [],
      mobanStageData: [],
      baseStageData: [],
      selectData: [],
      agreeView: {
        config: [
          {
            label: "交付物名称",
            span: 12,
            value: "name",
          },
          {
            label: "是否为验收项",
            span: 12,
            value: "isChecked",
          },
          {
            label: "文档模板",
            span: 24,
            value: "taskFile",
            type: "uploader",
            colNum: 3, // 一行几个附件
            maxFeild: 15, // 单个附件显示几个字
            labelWidth: 220,
          },
        ],
        data: {
          taskFile: [],
        },
      },
      JFWid: "", // 交付物ID
      fileTip:
        "温馨提示:支持不超过50MB的doc,docx,xls,xlsx,ppt,pptx,pdf,txt,jpg,jpeg,jpe,png,rar,zip格式文件。",
      idEntity: "",
      buProperty: "",
      shenheBtn: false,
      currentLoginName: "",
    };
  },
  watch: {
    milepostSDData: {
      handler: function(value, old) {
        if (value) {
          if (value.resultList.data) {
            this.result.push(value.resultList);
          }
        }
      },
    },
    supervisorName: {
      handler: function(value, old) {
        if (value) {
          this.supervisorName = value;
        }
      },
    },
  },
  computed: {
    themeName() {
      return sessionStorage.getItem("themeName");
    },
  },
  created() {
    this.queryId = this.$route.query.id;
    this.$set(this, "idEntity", this.$store.state.user.userInfo.idEntity);
    this.$set(this, "buProperty", this.$store.state.user.userInfo.buProperty);
    if (this.idEntity == "101" && this.buProperty == "2") {
      this.shenheBtn = true;
    } else if (this.idEntity == "101" && this.buProperty == "4") {
      this.shenheBtn = true;
    }
    this.getTemplId();
  },
  mounted() {
    this.getTableJFWDetailInfo();
    this.getTemplateFile();
    this.getProjectDanwei();
    this.currentLoginName = this.$store.state.user.userInfo.fullName;
  },
  methods: {
    getTemplId() {
      queryMessageSave({ projectId: Number(this.$route.query.projectId) }).then(
        (res) => {
          // this.templId = res.data.templId
          this.$set(this, "templId", res.data.templId);
          console.log(this.templId);
        }
      );
    },
    operateClick(item, index) {
      item.expand = !item.expand;
      const temp = [...this.data];
      temp[index] = item;
      this.$set(this, "data", temp);
    },
    // 获取项目单位
    getProjectDanwei() {
      getProjectInfoById({ projectId: this.$route.query.projectId }).then(
        (res) => {
          // console.log(res)
          this.buildName = res.data.buildName;
          this.supervisorName1 = res.data.supervisorName;
        }
      );
    },
    // 点击加载更多
    getAll() {
      this.count += 100;
      this.btnBlock = false;
    },
    // 收起更多
    putAway() {
      this.count = 20;
      this.btnBlock = true;
    },
    // 是否是盖章件改变
    changeRadioValue(row) {
      this.$SrUtils.showConfirmMessage.call(this, {
        title: "提示",
        content: "是否确定改为盖章件, 是否继续?",
        okFun: () => {
          let params = {
            fileId: row.fileId,
            sourceIsSeal: 1,
          };
          updateSourcrIsSeal(params).then((res) => {
            if (res.msg.code == "0000") {
              this.$message({
                type: "success",
                message: "修改成功!",
              });
              this.getTableJFWDetailInfo();
            }
          });
        },
        cancelFun: () => {
          row.isSelect = false;
        },
      });
    },
    // 删除交付物审核
    isDeleteJFW(id) {
      this.JFWTitle = "删除交付物";
      this.JFWid = id;
      this.dialogFormDelete = true;
      let params = {
        deliId: id,
        sourceType: "DELIVERY_FILES",
      };
      getJFWDetails(params).then((res) => {
        if (res.msg.code == "0000") {
          this.$set(this.agreeView, "data", res.data);
          if (res.data.isChecked == 1) {
            res.data.isChecked = "是";
          } else {
            res.data.isChecked = "否";
          }
          res.data.data.map((item) => {
            this.agreeView.data.taskFile = [
              {
                id: item.fileId,
                name: item.fileName,
              },
            ];
          });
        }
      });
    },
    // 审核同意
    agreeDelete(id) {
      if (this.JFWTitle == "删除交付物") {
        let api_getFlag;
        if (this.themeName == "yuhua") {
          api_getFlag = deletedDeliveryYH;
        } else {
          api_getFlag = deletedDelivery;
        }
        api_getFlag({ deliId: this.JFWid }).then((res) => {
          if (res.msg.code == "0000") {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getTableJFWDetailInfo();
            this.dialogFormDelete = false;
          }
        });
      } else if (this.JFWTitle == "新增交付物") {
        let params = {
          id: this.JFWid,
          status: 3,
        };
        let api_getFlag;
        if (this.themeName == "yuhua") {
          api_getFlag = updateDeliStatusYH;
        } else {
          api_getFlag = updateDeliStatus;
        }
        api_getFlag(params).then((res) => {
          if (res.msg.code == "0000") {
            this.$message({
              type: "success",
              message: "新增成功",
            });
            this.getTableJFWDetailInfo();
            this.dialogFormDelete = false;
          }
        });
      }
    },
    // 新增交付物审核
    isSureAdd(id) {
      this.JFWTitle = "新增交付物";
      this.JFWid = id;
      this.dialogFormDelete = true;
      getJFWDetails({ deliId: id }).then((res) => {
        if (res.msg.code == "0000") {
          this.$set(this.agreeView, "data", res.data);
          if (res.data.isChecked == 1) {
            res.data.isChecked = "是";
          } else {
            res.data.isChecked = "否";
          }
          res.data.data.map((item) => {
            this.agreeView.data.taskFile = [
              {
                id: item.fileId,
                name: item.fileName,
              },
            ];
          });
        }
      });
    },
    // 新增交付物审核不同意
    noAgreeAdd() {
      if (this.JFWTitle == "新增交付物") {
        let api_getFlag;
        if (this.themeName == "yuhua") {
          api_getFlag = deletedDeliveryYH;
        } else {
          api_getFlag = deletedDelivery;
        }
        api_getFlag({ deliId: this.JFWid }).then((res) => {
          if (res.msg.code == "0000") {
            this.getTableJFWDetailInfo();
            this.dialogFormDelete = false;
          }
        });
      } else {
        let params = {
          id: this.JFWid,
          status: 3,
        };
        let api_getFlag;
        if (this.themeName == "yuhua") {
          api_getFlag = updateDeliStatusYH;
        } else {
          api_getFlag = updateDeliStatus;
        }
        api_getFlag(params).then((res) => {
          if (res.msg.code == "0000") {
            this.getTableJFWDetailInfo();
            this.dialogFormDelete = false;
          }
        });
      }
    },
    closeDialog() {
      this.$set(this.form.config[this.form.config.length - 1], "fileList", []);
      this.$refs["modelBsInfo"].$refs["modelBsInfoForm"].resetFields();
    },
    /**
     * 上传文件之前验证大小和文件类型
     */
    callBeforeUpLoad(item, file) {
      //验证大小,格式
      //fileType是字符串
      item.fileType =
        item.fileType ||
        "doc,docx,xls,xlsx,ppt,pptx,pdf,txt,jpg,jpeg,jpe,png,rar,zip";
      item.fileSize = item.fileSize || 50 * 1024 * 1024;
      var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      let type = item.fileType.split(",");
      let index = type.indexOf(testmsg);
      if (type.indexOf(testmsg) != -1) {
        const extension = testmsg === type[index];
        const isLt2M = file.size / 1024 / 1024 < item.fileSize;
        if (!extension) {
          this.$message({
            message: `上传文件只能是${item.fileType}格式!`,
            type: "warning",
          });
        }
        if (!isLt2M) {
          this.$message({
            message: "上传文件大小不能超过 50MB!",
            type: "warning",
          });
        }
        return extension && isLt2M;
      } else {
        this.$message({
          message: `上传文件只能是${item.fileType}格式!`,
          type: "warning",
        });
        return false;
      }
    },
    /**
     * 上传成功时调用
     */
    callSuccessFn(updata, r, item, id) {
      upload(r.data).then((res) => {
        this.fileIdList = [];
        this.fileIdList.push(res.data.fileInfo.id);
        let params = {
          fileIds: this.fileIdList,
          projectId: this.$route.query.projectId,
          sourceId: id,
          sourceType: "DELIVERY",
        };
        if (this.themeName == "yuhua") {
          api_uploadJFWFileYH(params).then((res) => {
            if (res.msg.code == "0000") {
              this.getTableJFWDetailInfo();
            }
          });
        } else {
          api_uploadJFWFile(params).then((res) => {
            if (res.msg.code == "0000") {
              this.getTableJFWDetailInfo();
            }
          });
        }
      });
    },
    selectTable(val) {
      this.selectData = val;
    },
    // 从模板中添加
    addTemplate() {
      this.dialogTableVisible = true;
      let params = {
        pageNum: 1,
        pageSize: 100,
        templTag: "CSRJKF",
        templCode: "A0",
        templId: this.templId,
      };
      getmobanLCBAjax(params).then((res) => {
        if (res.msg.code == "0000") {
          this.activeName2 = res.data.list[0].id.toString();
          // console.log(this.activeName2)
          res.data.list.map((item) => {
            item.id = item.id.toString();
            // this.activeName2 = item.id
          });
          this.$set(this, "mobanStageData", res.data.list);
          let params1 = {
            pageNum: 1,
            pageSize: 100,
            stageId: Number(this.activeName2),
          };
          getqueryListTemplStageDeliver(params1).then((res) => {
            if (res.msg.code == "0000") {
              this.$set(this.tableData, "data", res.data.list);
            }
          });
        }
      });
    },
    // 确认添加
    addTemplateSure() {
      let params = [];
      if (this.selectData.length >= 2) {
        this.selectData.map((item) => {
          params.push({
            name: item.deliverName,
            isChecked: item.isCheck,
            milestoneId: Number(this.activeName),
            projectId: this.$route.query.projectId,
          });
        });
      } else {
        this.selectData.map((item) => {
          params = [
            {
              name: item.deliverName,
              isChecked: item.isCheck,
              milestoneId: Number(this.activeName),
              projectId: this.$route.query.projectId,
            },
          ];
        });
      }
      let api_getFlag;
      if (this.themeName == "yuhua") {
        api_getFlag = api_addNewdeliveryYH;
      } else {
        api_getFlag = api_addNewdelivery;
      }
      api_getFlag(params).then((res) => {
        if (res.msg.code == "0000") {
          this.getTableJFWDetailInfo();
          this.dialogTableVisible = false;
        }
      });
    },
    // 添加
    addDeliverables(row) {
      let api_getFlag;
      if (this.themeName == "yuhua") {
        api_getFlag = api_addNewdeliveryYH;
      } else {
        api_getFlag = api_addNewdelivery;
      }
      let params = [];
      params = [
        {
          name: row.deliverName,
          isChecked: row.isCheck,
          milestoneId: this.activeName,
          projectId: this.$route.query.projectId,
        },
      ];
      api_getFlag(params).then((res) => {
        if (res.msg.code == "0000") {
          this.getTableJFWDetailInfo();
          this.dialogTableVisible = false;
        }
      });
      this.dialogFormVisible = false;
    },
    // 增加交付物
    handleAddDeliverables() {
      this.dialogFormVisible = true;
      this.title = "新增交付物";
      this.getDeliveryLCB();
    },
    // 新增交付物确认提交
    handAddSubmit() {
      var p1 = new Promise((resolve, reject) => {
        this.$refs["modelBsInfo"].validate((valid) => {
          if (valid) {
            resolve();
          }
        });
      });
      Promise.all([p1]).then(() => {
        let params;
        if (this.form.data.multipartFiles.length > 0) {
          params = [
            {
              isChecked: this.form.data.isChecked,
              name: this.form.data.name,
              milestoneId: Number(this.activeName),
              projectId: this.$route.query.projectId,
              data: this.form.data.multipartFiles[0].id,
            },
          ];
        } else {
          params = [
            {
              isChecked: this.form.data.isChecked,
              name: this.form.data.name,
              milestoneId: Number(this.activeName),
              projectId: this.$route.query.projectId,
            },
          ];
        }
        let api_getFlag;
        if (this.themeName == "yuhua") {
          api_getFlag = api_addNewdeliveryYH;
        } else {
          api_getFlag = api_addNewdelivery;
        }
        api_getFlag(params).then((res) => {
          if (res.msg.code == "0000") {
            this.getTableJFWDetailInfo();
            this.form.config[2].fileList = [];
          } else {
            return;
          }
          this.dialogFormVisible = false;
        });
      });
    },
    handleClicktemple(val, item) {
      let params = {
        pageNum: 1,
        pageSize: 100,
        stageId: Number(val.name),
      };
      getqueryListTemplStageDeliver(params).then((res) => {
        for (var i = 0; i < res.data.list.length; i++) {
          if (res.data.list[i].isCheck == 1) {
            res.data.list[i].isChecked = "是";
          } else {
            res.data.list[i].isChecked = "否";
          }
        }
        this.$set(this.tableData, "data", res.data.list);
      });
    },
    // 预览
    seeclick(row) {
      let type = "";
      if (row.fileName) {
        type = row.fileName.split(".").pop();
      } else {
        type = row.name.split(".").pop();
      }
      if (["zip", "rar"].includes(type)) {
        window.open(
          `${config.baseUrl}/whportalsite/api/file/download?id=${row.fileId}`
        );
      } else {
        window.open(
          `${config.baseUrl}/whportalsite/api/file/docapi/view/?fileId=${row.fileId}`
        );
      }
    },
    // 更新
    successFile(updata, r, item, id, row) {
      upload(r.data).then((res) => {
        let params = {
          sourceId: row.sourceId,
          sourceType: "DELIVERY",
          fileId: res.data.fileInfo.id,
          fileNo: row.fileNo,
        };
        let api_getFlag;
        if (this.themeName == "yuhua") {
          api_getFlag = uploadVersionYH;
        } else {
          api_getFlag = uploadVersion;
        }
        api_getFlag(params).then((res) => {
          if (res.msg.code == "0000") {
            this.getTableJFWDetailInfo();
            this.$message({
              type: "success",
              message: "更新成功",
            });
          }
        });
      });
    },
    // 下载
    upclick(row) {
      this.$utils.exportFile(
        `${config.baseUrl}/whportalsite/api/file/download?id=${row.fileId}`
      );
    },
    // 历史版本
    historyVerdion(row) {
      var code = "deliverDetail";
      this.routeFun(code, {
        fileNo: row.fileNo,
        fileId: row.fileId,
        projectId: this.$route.query.projectId,
        fullName: row.userName,
        dept: row.dept,
      });
    },
    routeFun(name, query) {
      this.$router.push({
        name,
        query,
      });
    },
    // 删除文件
    deleteFile(row) {
      let api_getFlag;
      if (this.themeName == "yuhua") {
        api_getFlag = api_deleteAllVersionYH;
      } else {
        api_getFlag = api_deleteAllVersion;
      }
      this.$SrUtils.showConfirmMessage.call(this, {
        title: "提示",
        content: "此操作将删除该文件, 是否继续?",
        okFun: () => {
          api_getFlag({ fileNo: row.fileNo, sourceType: "DELIVERY" }).then(
            (res) => {
              if (res.msg.code == "0000") {
                this.$message({
                  type: "success",
                  message: "删除成功!",
                });
                this.getTableJFWDetailInfo();
              }
            }
          );
        },
        cancelFun: () => {},
      });
    },
    // 提交删除整个交付物
    deleteJFW(id, status) {
      let params = {
        id: id,
        status: 1,
      };
      this.$SrUtils.showConfirmMessage.call(this, {
        title: "提示",
        content: "此操作将删除交付物类型及交付物文件，是否继续?",
        okFun: () => {
          let api_getFlag;
          if (this.themeName == "yuhua") {
            api_getFlag = updateDeliStatusYH;
          } else {
            api_getFlag = updateDeliStatus;
          }
          api_getFlag(params).then((res) => {
            if (res.msg.code == "0000") {
              this.$message({
                type: "success",
                message: "删除成功",
              });
              this.getTableJFWDetailInfo();
            }
          });
        },
        cancelFun: () => {},
      });
    },
    //交付物审核提交
    deliveryAuditSubmit(data) {
      let api_getFlag;
      if (this.themeName == "yuhua") {
        api_getFlag = insertFileReviewYH;
      } else {
        api_getFlag = insertFileReview;
      }
      api_getFlag(data).then((res) => {
        if (res.msg.code == "0000") {
          this.$message({
            message: "审核提交成功！",
            type: "success",
          });
          data.flag = true;
          this.$refs.auditDialog.goBack();
          this.getTableJFWDetailInfo();
        }
      });
    },
    auditDialog(item, row) {
      if (row.sourceStatus == "2" || row.sourceStatus == "3") {
        this.$refs.auditDialog.init("查看", item);
      } else if (
        row.sourceStatus == null ||
        row.sourceStatus == "1" ||
        row.sourceStatus == "0"
      ) {
        this.$refs.auditDialog.init("待审核", item);
      }
    },
    /**
     * 用于格式化表格数据，
     */
    tableFormatter(key, val, row) {},
    formatter(key, val, row) {},
    //前端分页组件
    pageChanged(val) {
      this.table.page.pageNum = val;
      this.getTableJFWDetailInfo();
    },
    sizeChanged(val) {
      this.table.page.pageSize = val;
      this.getTableJFWDetailInfo();
    },
    // 获取里程碑
    getTableJFWDetailInfo(val) {
      let params = {
        projectId: this.$route.query.projectId,
        // projectId:2
      };
      //初始化
      api_JFWgetProjectDeliInfo(params).then((res) => {
        if (res.msg.code == "0000") {
          this.alldata = res.data;
          if (this.activeName != "0") {
            this.activeName = this.activeName;
          } else {
            this.activeName = res.data[0].stageId.toString();
          }
          this.projectPhase = [];
          res.data.map((item) => {
            this.stageId = item.stageId;
            item.stageId = item.stageId.toString();
            item.stageName = item.stageName + "(" + item.data.length + ")";
            this.projectPhase.push(item);
          });
          for (var i = 0; i < res.data.length; i++) {
            if (this.activeName == res.data[i].stageId) {
              this.data = res.data[i].data;
            }
          }
          this.data.map((item) => {
            item.expand = true;
          });
          // this.activeNames = this.data.map((item, key) => {
          //   return key;
          // });
        }
      });
    },
    // 获取交付物的模板文件
    getTemplateFile() {},
    // 获取添加交付物里面的里程碑
    getDeliveryLCB() {
      let params = {
        projectId: this.$route.query.projectId,
      };
      api_JFWgetProjectDeliInfo(params).then((res) => {
        if (res.msg.code == "0000") {
          this.alldata = res.data;
          this.projectPhaseList = [];
          res.data.map((item) => {
            this.stageId = item.stageId;
            item.stageId = item.stageId.toString();
            this.projectPhaseList.push(item);
          });
        }
      });
    },

    handleClick(tab, event) {
      this.activeName = tab.name;
      this.$emit("uploadStageId", this.projectPhase);
      for (var i = 0; i < this.alldata.length; i++) {
        if (this.alldata[i].stageId == tab.name) {
          this.data = this.alldata[i].data;
          this.data.map((item) => {
            item.expand = true;
          });
        }
      }
    },
    getPageData(pageNum) {
      this.tableData.page.pageNum = pageNum;
      this.addTemplate();
    },
    getSizeDate(pageSize) {
      this.tableData.page.pageSize = pageSize;
      this.addTemplate();
    },
  },
};
</script>
<style lang="scss" scoped>
@import "~@/views/shishi/shishi.scss";
@import "~@/styles/blue.scss";
::v-deep .el-tabs__item.is-active {
  font-size: 14px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(24, 144, 255, 1);
}
::v-deep .el-tabs__item {
  padding: 0 30px;
  height: 40px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  line-height: 40px;
  display: inline-block;
  list-style: none;
  position: relative;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.65);
}
.delete-btn {
  display: initial !important;
  visibility: hidden;
}
.upload-type {
  margin-left: 20px;
  margin-top: 10px;
  .upload-file {
    display: inline-block;
  }
  .uploadImg_before {
    vertical-align: middle;
  }
  .uploadImg_class {
    margin-left: 20px;
    vertical-align: middle;
  }
  .up_tip {
    font-size: 13px;
  }
}
.operate-btn {
  cursor: pointer;
  color: #1890ff;
}
.deleteType {
  margin: 10px 20px;
  .text {
    color: rgb(255, 155, 22);
    font-size: 13px;
  }
  .btn {
    color: #1890ff;
    margin-left: 5px;
    cursor: pointer;
  }
}
.el-collapse {
  border: none;
  .el-collapse-item {
    border: 1px solid rgba(113, 168, 228, 1);
    margin-bottom: 15px;
    .title-item {
      height: 50px;
      line-height: 50px;
    }
    ::v-deep .widthUp {
      width: 600px;
    }
    ::v-deep .uploaderview {
      display: inline-block;
      width: 50%;
      margin-left: 40px;
    }
  }
}
::v-deep .table-components {
  padding: 0;
  margin-top: 10px;
  .el-table {
    border-bottom: 1px dashed #ededed;
  }
}
::v-deep .el-tabs__nav-wrap::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 1px;
  background-color: #ededed;
  z-index: 1;
}
::v-deep .el-dialog__body {
  padding: 20px 20px;
}
.deleteType {
  margin-top: 10px;
  margin-left: 20px;
  .text {
    color: rgb(255, 155, 22);
  }
  .btn {
    color: #1890ff;
    margin-left: 5px;
    cursor: pointer;
  }
}
.getall {
  text-align: center;
  margin-top: 20px;
  color: #1890ff;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
}
.iconfujian {
  margin-right: 5px;
  color: rgb(124, 198, 255);
}
.dot {
  width: 6px;
  height: 6px;
  border-radius: 100%;
  display: inline-block;
  margin-right: 5px;
}
.shenhe {
  margin-left: 10px;
  cursor: pointer;
  z-index: 99999;
  position: relative;
  top: -3px;
}
.red {
  background-color: red;
}
.green {
  background-color: #009900;
}
.yellow {
  background-color: #f7a900;
}
.title {
  font-size: 20px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: rgba(51, 51, 51, 1);
}
.title_isChecked {
  color: #555555;
  font-family: PingFangSC-Regular, PingFang SC;
  padding-left: 15px;
  font-weight: 400;
  font-size: 14px;
}
.textBox {
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
}
.collapse_title {
  .el-col {
    padding: 0 20px;
  }
}
.result {
  margin-top: 15px;
}
.task_detail {
  .publice-title {
    height: 80px;
    margin-top: 24px;
    font-size: 22px;
    line-height: 80px;
    font-weight: 600;
    padding-left: 30px;
    background: rgba(0, 144, 255, 0.08);
    .connetTitle {
      display: inline-block;
      vertical-align: middle;
      font-size: 22px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #0090ff;
      line-height: 30px;
      margin-left: 20px;
    }
    .state {
      padding: 4px 16px;
      height: 22px;
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(0, 144, 255, 1);
      line-height: 22px;
      border-radius: 2px;
      margin-left: 10px;
      border: 1px solid rgba(0, 144, 255, 1);
    }
    .description {
      position: absolute;
      left: 15px;
      top: 0px;
      width: 30px;
      height: 30px;
      > img {
        width: 100%;
        height: 100%;
        vertical-align: middle;
      }
    }
    .button {
      float: right;
      margin-right: 30px;
      button:nth-child(1) {
        margin-right: 20px;
      }
    }
  }
  .taskInfo {
    margin-top: 25px;
    .rate-left {
      display: inline-block;
      width: 411px;
      .rate-publice {
        height: 22px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        margin-left: 15px;
        margin-top: 27px;
        .el-rate {
          display: inline-block;
          margin-left: 12px;
        }
      }
    }
    .rate-right {
      display: inline-block;
      vertical-align: top;
      min-width: 500px;
      .rate-automatic {
        margin-top: 27px;
      }
    }
  }
  .taskButton {
    text-align: center;
    padding: 30px 0px;
  }
  .speedProgress {
    margin-top: 30px;
  }
}
/deep/ .upload-file .el-upload-list {
  display: none !important;
  height: 0px;
}
.uploader_title {
  display: inline-block;
  max-width: 133px;
  min-width: 92px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 12px;
  margin-left: 8px;
}
::v-deep.uploader {
  min-width: 38%;
}
.footerBtn {
  text-align: center;
  padding-bottom: 20px;
  button {
    border: 1px solid #007aff;
    color: #007aff;
  }
}
</style>
<style lang="scss" scoped>
.task_detail {
  .el-textarea__inner {
    min-height: 92px !important;
  }
  /deep/ .tabList {
    padding: 0px 20px;
    margin-top: 10px;
    box-sizing: border-box;
    .el-tabs__item {
      // padding: 0px 30px;
      color: #999999;
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
    }
    .is-active {
      color: #0090ff;
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
    }
  }
}
.box {
  margin: 29px 20px 0;
}
.jiaofuwu {
  padding: 10px 20px;
  .shBtn {
    button {
      border: 1px solid #007aff;
      color: #007aff;
    }
  }
}
.upload-file {
  padding: 0 12px;
  .up_name {
    width: 70px;
    height: 20px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 122, 255, 1);
    line-height: 20px;
  }
  .up_tip {
    margin-left: 8px;
    position: relative;
    // top: 1px;
  }
  .el-upload-list__item {
    display: inline-block;
    margin-right: 8px;
    height: 36px;
    background: #e6f7ff;
    border-radius: 2px;
    border: 1px solid #d4f0ff;
    width: auto;
    line-height: 36px;
    max-width: 300px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .el-icon-document {
    font-family: "iconfont" !important;
    font-size: 16px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .el-icon-close {
    font-family: "iconfont" !important;
    font-size: 10px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .el-icon-document:before {
    content: "\e636";
  }
  .el-icon-close:before {
    content: "\e624";
    position: relative;
    // top: 8px;
  }
}
</style>
