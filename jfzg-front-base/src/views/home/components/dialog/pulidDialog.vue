<template>
  <div>
    <el-dialog :title="isEdit" :visible.sync="dialogVisible" width="60%">
      <!-- 通知类 -->
      <span>
        <!-- 预览 -->
        <SrAdd
          v-if="this.isEdit == '预览'"
          class="sradd"
          :config="form2.config"
          :enums="form2.enums"
          :form="form2.data"
          :otherConfig="form2.otherConfig"
          ref="knowledgeForm"
        >
          <!-- knowledgeName  -->
          <!-- 类型 -->
          <template slot="notificationType">
            <el-form-item style="width: 100%" prop="notificationType">
              <el-select
                clearable
                collapse-tags
                v-model="form2.data.notificationType"
                placeholder="请选择类型"
                :disabled="true"
              >
                <el-option
                  v-for="item in fileTypeList"
                  :key="item.dataValue"
                  :label="item.dataName"
                  :value="item.dataValue"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </template>

          <!-- 可查看范围 -->
          <template slot="viewScope">
            <el-form-item style="width: 100%; height: 100px">
              <el-select
                clearable
                multiple
                v-model="form2.data.viewScope"
                placeholder="请选择角色"
                @change="viewScopeChange"
                :disabled="true"
              >
                <el-option
                  v-for="item in viewScopeList"
                  :key="item.dataValue"
                  :label="item.dataName"
                  :value="item.dataValue"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </template>
          <!-- 可查看范围 -->
          <!-- 按照部门发布 -->
          <!-- <template slot="departScope">
            <el-input
              v-model="form.data.departScope"
              :disabled="disabledSelect2"
              clearable
            >
            </el-input>
          </template> -->
          <!-- 按照人员发布 -->
          <!-- <template slot="staffScope">
            <el-select
              :disabled="disabledSelect3"
              clearable
              multiple
              collapse-tags
              v-model="form.data.staffScope"
              placeholder="请选择"
              @change="viewScopeChange"
            >
              <el-option
                v-for="item in staffScopeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </template> -->

          <!-- 有效时间 -->
          <template slot="validTime">
            <!-- <el-form-item label="日期选择" prop="date" :rules="{ required: true, message: '请选择日期', trigger: 'change' }"> 
  <el-date-picker v-model="form.date" type="date" placeholder="选择日期"></el-date-picker>  -->
            <el-form-item style="width: 30%" prop="createTime">
              <el-date-picker
                v-model="form2.data.createTime"
                type="date"
                placeholder="年/月/日"
                value-format="yyyy-MM-dd"
                @change="startTimeChange"
                :disabled="true"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <span style="color: #ccc">&nbsp;——&nbsp;</span>
            </el-form-item>
            <el-form-item style="width: 30%">
              <el-date-picker
                v-model="form2.data.endTime"
                type="date"
                placeholder="年/月/日"
                :picker-options="endPickerOptions()"
                value-format="yyyy-MM-dd"
                @change="endTimeChange"
                :disabled="true"
              >
              </el-date-picker>
            </el-form-item>
            <span class="hint">此项不填则永久有效，可手动终止</span>
          </template>
      
          <template slot="remarks">
            <!-- <quill-editor
              style="height: 170px"
              placeholder="请输入文本..."
              v-model="form2.data.remarks"
              :options="editorOption" :disabled="true"
            >
            </quill-editor> -->

            <vue-editor
              style="height: 170px;border: none;"
             
              v-model="form2.data.remarks"
              :disabled="true"
            ></vue-editor>
          </template>
          <!-- uploadFiles -->
          <template slot="uploadFiles">
            <!-- <el-col class="value_box" > -->
              <div class="value_box">
                
              <div
                class="itm_content_File"
                v-if="form2.data.uploadFiles == null"
                style="color: black;" 
              >
                &nbsp;&nbsp;&nbsp;暂无附件
              </div>
              <div v-else class="itm_content_File primary">
                <div
                  class="files-item-content"
                  v-for="(c, cIndex) in form2.data.uploadFiles"
                  :key="cIndex"
                >
                  <el-tooltip effect="light" placement="top" content="预览">
                    <el-button
                      class="icon-view"
                      size="mini"
                      type="text"
                      @click="seeclick(c)"
                      icon="el-icon-view"
                    ></el-button
                  ></el-tooltip>

                  <el-tooltip
                    effect="light"
                    placement="top-start"
                    :content="c.name"
                    ><div class="file_name">
                      {{ c.name }}
                    </div></el-tooltip
                  >
                  <el-tooltip effect="light" placement="top" content="下载">
                    <i @click="download(c)" class="icon-download"></i>
                  </el-tooltip>
                </div>
              </div>
            </div>
            <!-- </el-col> -->
          </template>
        </SrAdd>

        <!-- 新增 编辑 -->
        <SrAdd
          v-else
          class="sradd"
          :config="form.config"
          :enums="form.enums"
          :form="form.data"
          :otherConfig="form.otherConfig"
          ref="knowledgeForm"
        >
          <!-- 类型 -->
          <template slot="notificationType">
            <el-form-item
              style="width: 100%"
              prop="notificationType"
              :rules="{
                required: true,
                message: '请选择通知类型',
                trigger: 'change',
              }"
            >
              <el-select
                clearable
                collapse-tags
                v-model="form.data.notificationType"
                placeholder="请选择类型"
              >
                <el-option
                  v-for="item in fileTypeList"
                  :key="item.dataValue"
                  :label="item.dataName"
                  :value="item.dataValue"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </template>

          <!-- 可查看范围 -->
          <template slot="viewScope">
            <el-form-item style="width: 100%; height: 100%">
              <el-select
                clearable
                multiple
                v-model="form.data.viewScope"
                placeholder="请选择角色"
                @change="viewScopeChange"
              >
                <el-option
                  v-for="item in viewScopeList"
                  :key="item.dataValue"
                  :label="item.dataName"
                  :value="item.dataValue"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </template>
          <!-- 可查看范围 -->
          <!-- 按照部门发布 -->
          <!-- <template slot="departScope">
            <el-input
              v-model="form.data.departScope"
              :disabled="disabledSelect2"
              clearable
            >
            </el-input>
          </template> -->
          <!-- 按照人员发布 -->
          <!-- <template slot="staffScope">
            <el-select
              :disabled="disabledSelect3"
              clearable
              multiple
              collapse-tags
              v-model="form.data.staffScope"
              placeholder="请选择"
              @change="viewScopeChange"
            >
              <el-option
                v-for="item in staffScopeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </template> -->

          <!-- 有效时间 -->
          <template slot="validTime">
            <!-- <el-form-item label="日期选择" prop="date" :rules="{ required: true, message: '请选择日期', trigger: 'change' }"> 
  <el-date-picker v-model="form.date" type="date" placeholder="选择日期"></el-date-picker>  -->
            <el-form-item
              style="width: 30%"
              prop="createTime"
              :rules="{
                required: true,
                message: '请选择日期',
                trigger: 'change',
              }"
            >
              <el-date-picker
                v-model="form.data.createTime"
                type="date"
                placeholder="年/月/日"
                value-format="yyyy-MM-dd"
                @change="startTimeChange"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <span style="color: #ccc">&nbsp;——&nbsp;</span>
            </el-form-item>
            <el-form-item style="width: 30%">
              <el-date-picker
                v-model="form.data.endTime"
                type="date"
                placeholder="年/月/日"
                :picker-options="endPickerOptions()"
                value-format="yyyy-MM-dd"
                @change="endTimeChange"
              >
              </el-date-picker>
            </el-form-item>
            <span class="hint">此项不填则永久有效，可手动终止</span>
          </template>
          <!-- 附件 -->

          <!-- 备注 remarks -->
          <!-- <template slot="remarks">
            <el-input
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 5 }"
              placeholder="请输入内容"
              maxlength="200"
              show-word-limit
              v-model="form.data.remarks"
            >
            </el-input>
          </template> -->
          <template slot="remarks">
            <!-- <quill-editor
              style="height: 170px"
              placeholder="请输入文本..."
              v-model="form.data.remarks"
              ref="myQuillEditor"
              :options="editorOption"
            >
            </quill-editor> -->
          </template>
        </SrAdd>
      </span>
    </el-dialog>

    <!-- <MoreDialog ref="moreDialog"></MoreDialog> -->
  </div>
</template>

<script>
import MoreDialog from "./moreDialog";
import store from "@/store";
import config from "@/settings.js";
import upload from "@/utils/upload";
import {
  api_add_knowLedge,
  api_query_getRoleCodeAndNames,
  api_detail_getRoleCodeAndNames,
  getUserByRoleCode,
} from "@/api/knowLedge/index.js";

// import { quillEditor } from "vue-quill-editor";
import moreDiaLog from "./moreDialog.vue";
import { VueEditor } from "vue2-editor";
// import 'quill/dist/quill.snow.css'; // 引入主题样式

const typeMap = {
  // 0: "通知类",
  // 1: "统建政策类",
  // 2: "项目管理类",
  // 3: "安全运维类",
  // 4: "其他类",

  0: "通知",
  1: "通告",
  2: "命令",
  3: "决定",
  4: "公告",
  5: "通报",
  6: "议案",
  7: "意见",
  8: "会议纪要",
  // { dataName: "通知", dataValue: "0" },
  //       { dataName: "通告", dataValue: "1" },
  //       { dataName: "命令", dataValue: "2" },
  //       { dataName: "决定", dataValue: "3" },
  //       { dataName: "公告", dataValue: "4" },
  //       { dataName: "通报", dataValue: "5" },
  //       { dataName: "议案", dataValue: "6" },
  //       { dataName: "意见", dataValue: "7" },
  //       { dataName: "会议纪要", dataValue: "8" },
};
// 附件上传限制类型
const FILE_TYPES =
  "doc,docx,xls,xlsx, ppt, pptx,pdf, txt,jpg,jpeg,jpe, pngrar zip";
// 文档类型
const DOC_TYPES = ["doc", "docx", "txt", "html", "pdf", "ppt", "pptx", "html"];
// 图片类型
const IMG_TYPES = [
  "bmp",
  "jpg",
  "jpeg",
  "gif",
  "png",
  "zip",
  "rar",
  "xls",
  "xlsx",
];
const toolbarOptions = [
  [
    {
      header: 1,
    },
  ],
  [
    {
      direction: "rtl",
    },
  ],
  [
    {
      color: [],
    },
    {
      background: [],
    },
  ],
  ["bold", "italic", "underline"],
  [
    {
      list: "ordered",
    },
    {
      list: "bullet",
    },
  ],
  [
    {
      indent: "-1",
    },
    {
      indent: "+1",
    },
  ],
  [
    {
      align: [],
    },
  ],
  ["clean"],
];
export default {
  components: {
    MoreDialog,
    moreDiaLog,
    // quillEditor,
    VueEditor,
  },
  provide() {
    return {
      baseUrl: config.baseUrl,
      imgBaseUrl: config.imgBaseUrl,
      uploadRequest: upload,
      uploadBaseUrl: config.uploadBaseUrl,
      uploadFileUrl: config.uploadFileUrl,
      previewUrl: config.previewUrl,
    };
  },
  computed: {
    viewScopeLength() {
      return (
        this.previewForm.data.viewScope &&
        this.previewForm.data.viewScope.length > 10
      );
    },
    remarksLength() {
      return this.previewForm.data.remarks.length > 20;
    },

    // disabledSelect1() {
    //   return this.isAnySelectActive(["departScope", "staffScope"]);
    // },
    // disabledSelect2() {
    //   return this.isAnySelectActive(["viewScope", "staffScope"]);
    // },
    // disabledSelect3() {
    //   return this.isAnySelectActive(["viewScope", "departScope"]);
    // },
  },
  data() {
    return {
      editorOption: {
        placeholder: "请输入内容...",
        modules: {
          toolbar: {
            container: toolbarOptions,
          },
        },
      },
      endPickerOptions: () => {
        let that = this;
        return {
          disabledDate(time) {
            return (
              time.getTime() <
              new Date(that.form.data.createTime).getTime() -
                8.64e7 +
                1 * 24 * 60 * 60 * 1000
            );
          },
        };
      },
      userInfo: store.getters.userInfo,
      baseUrl: config.baseUrl,
      dialogVisible: false,
      isEdit: "", //新增 编辑
      rowId: "", // 行id
      fileTypeList: [
        // 类型
        { dataName: "通知", dataValue: "0" },
        { dataName: "通告", dataValue: "1" },
        { dataName: "命令", dataValue: "2" },
        { dataName: "决定", dataValue: "3" },
        { dataName: "公告", dataValue: "4" },
        { dataName: "通报", dataValue: "5" },
        { dataName: "议案", dataValue: "6" },
        { dataName: "意见", dataValue: "7" },
        { dataName: "会议纪要", dataValue: "8" },
      ],
      viewScopeList: [{ dataName: "全部", dataValue: "all" }], //可查看范围
      staffScopeList: [], // 人员
      departScopeList: [], // 部门
      broadcastList: [
        // 是否播报
        { dataName: "是", dataValue: 0 },
        { dataName: "否", dataValue: 1 },
      ],
      form: {
        otherConfig: {
          labelNum: 140,
        },
        config: [
          {
            type: "input",
            name: "标题",
            placeholder: "请输入",
            bind: "knowledgeName",
            col: 24,
            required: "名称必填",
          },
          {
            type: "slot",
            slotName: "notificationType",
            name: "通知类型",
            placeholder: "请选择",
            col: 24,
            class: "customClass",
          },
          // {
          //   type: "slot",
          //   slotName: "departScope",
          //   name: "按部门发布",
          //   placeholder: "请选择",
          //   col: 12,
          //   class: "customClass",
          // },
          // {
          //   type: "slot",
          //   slotName: "staffScope",
          //   name: "按人员发布",
          //   placeholder: "请选择",
          //   col: 12,
          //   class: "customClass",
          // },
          {
            type: "slot",
            slotName: "viewScope",
            name: "按角色发布",
            placeholder: "请选择",
            col: 24,
            class: "customClass",
          },

          {
            type: "slot",
            slotName: "validTime",
            name: "有效时间",
            placeholder: "请选择",
            col: 24,
            class: "customClass",
            required: "有效时间必填",
          },
          // {
          //   type: "slot",
          //   slotName: "remarks",
          //   name: "备注",
          //   col: 24,
          // },
          {
            slotName: "remarks",
            type: "slot",
            name: "正文",
            placeholder: "请输入正文",
            bind: "remarks",
            col: 24,
            maxlength: 1000,
            trigger: "blur",
            minHeight: 150,
            resize: "none",
            required: "正文不能为空",
            items: [
              "formatblock",
              // "fontname",
              "fontsize",
              "|",
              "forecolor", // 文字颜色
              "hilitecolor", // 背景颜色
              "bold", // 加粗
              "italic", // 斜体
              "underline", // 下划线
              // "strikethrough", // 删除线
              "lineheight", // 行距
              "|",
              "justifyleft",
              "justifycenter",
              "justifyright",
              "justifyfull",
              "insertorderedlist",
              "insertunorderedlist",
              "indent",
              "outdent",
            ],
          },
          {
            type: "upload",
            name: "相关附件",
            bind: "uploadFiles",
            fileList: [],
            fileSize: 500,
            fileType: FILE_TYPES,
            fileTip: `仅支持上传${FILE_TYPES}格式文件!`,
            limit: 10,
            tipPopover: true, // hover显示提示  默认外面显示
            col: 24,
            //required: "请上传附件",
          },
        ],
        data: {
          knowledgeName: "",
          notificationType: "0",
          // departScope: null, // 按部门发布
          // staffScope: null, // 按人员发布
          viewScope: null,
          remarks: "",
          uploadFiles: [], // 文件上传

          createTime: "", // 起始时间
          endTime: "", // 结束时间
        },
        enums: {},
      },
      form1: {
        otherConfig: {
          labelNum: 140,
        },
        config: [
          {
            type: "input",
            name: "标题",
            placeholder: "请输入",
            bind: "knowledgeName",
            col: 24,
            required: "名称必填",
          },
          {
            type: "slot",
            slotName: "notificationType",
            name: "通知类型",
            placeholder: "请选择",
            col: 24,
            class: "customClass",
          },
          // {
          //   type: "slot",
          //   slotName: "departScope",
          //   name: "按部门发布",
          //   placeholder: "请选择",
          //   col: 12,
          //   class: "customClass",
          // },
          // {
          //   type: "slot",
          //   slotName: "staffScope",
          //   name: "按人员发布",
          //   placeholder: "请选择",
          //   col: 12,
          //   class: "customClass",
          // },
          {
            type: "slot",
            slotName: "viewScope",
            name: "按角色发布",
            placeholder: "请选择",
            col: 24,
            class: "customClass",
          },

          {
            type: "slot",
            slotName: "validTime",
            name: "有效时间",
            placeholder: "请选择",
            col: 24,
            class: "customClass",
            required: "有效时间必填",
          },
          // {
          //   type: "slot",
          //   slotName: "remarks",
          //   name: "备注",
          //   col: 24,
          // },
          {
            slotName: "remarks",
            type: "slot",
            name: "正文",
            placeholder: "请输入正文",
            bind: "remarks",
            col: 24,
            maxlength: 1000,
            trigger: "blur",
            minHeight: 150,
            resize: "none",
            required: "正文不能为空",
            items: [
              "formatblock",
              // "fontname",
              "fontsize",
              "|",
              "forecolor", // 文字颜色
              "hilitecolor", // 背景颜色
              "bold", // 加粗
              "italic", // 斜体
              "underline", // 下划线
              // "strikethrough", // 删除线
              "lineheight", // 行距
              "|",
              "justifyleft",
              "justifycenter",
              "justifyright",
              "justifyfull",
              "insertorderedlist",
              "insertunorderedlist",
              "indent",
              "outdent",
            ],
          },
          {
            type: "upload",
            name: "相关附件",
            bind: "uploadFiles",
            fileList: [],
            fileSize: 500,
            fileType: FILE_TYPES,
            fileTip: `仅支持上传${FILE_TYPES}格式文件!`,
            limit: 10,
            tipPopover: true, // hover显示提示  默认外面显示
            col: 24,
            // required: "请上传附件",
          },
        ],
        data: {
          knowledgeName: "",
          notificationType: "0",
          // departScope: null, // 按部门发布
          // staffScope: null, // 按人员发布
          viewScope: null,
          remarks: "",
          uploadFiles: [], // 文件上传

          createTime: "", // 起始时间
          endTime: "", // 结束时间
        },
        enums: {},
      },

      form2: {
        otherConfig: {
          labelNum: 140,
        },
        config: [
          {
            type: "input",
            name: "标题",
            placeholder: "请输入",
            bind: "knowledgeName",
            col: 24,
            required: "名称必填",
            disabled: "true",
          },
          {
            type: "slot",
            slotName: "notificationType",
            name: "通知类型",
            placeholder: "请选择",
            col: 24,
            class: "customClass",
          },
          // {
          //   type: "slot",
          //   slotName: "departScope",
          //   name: "按部门发布",
          //   placeholder: "请选择",
          //   col: 12,
          //   class: "customClass",
          // },
          // {
          //   type: "slot",
          //   slotName: "staffScope",
          //   name: "按人员发布",
          //   placeholder: "请选择",
          //   col: 12,
          //   class: "customClass",
          // },
          {
            type: "slot",
            slotName: "viewScope",
            name: "按角色发布",
            placeholder: "请选择",
            col: 24,
            class: "customClass",
          },

          {
            type: "slot",
            slotName: "validTime",
            name: "有效时间",
            placeholder: "请选择",
            col: 24,
            class: "customClass",
            required: "有效时间必填",
          },
          // {
          //   type: "slot",
          //   slotName: "remarks",
          //   name: "备注",
          //   col: 24,
          // },
          {
            slotName: "remarks",
            type: "slot",
            name: "正文",
            placeholder: "请输入正文",
            bind: "remarks",
            col: 24,
            maxlength: 1000,
            trigger: "blur",
            minHeight: 150,
            resize: "none",
            required: "正文不能为空",
            items: [
              "formatblock",
              // "fontname",
              "fontsize",
              "|",
              "forecolor", // 文字颜色
              "hilitecolor", // 背景颜色
              "bold", // 加粗
              "italic", // 斜体
              "underline", // 下划线
              // "strikethrough", // 删除线
              "lineheight", // 行距
              "|",
              "justifyleft",
              "justifycenter",
              "justifyright",
              "justifyfull",
              "insertorderedlist",
              "insertunorderedlist",
              "indent",
              "outdent",
            ],
          },
          {
            name: "相关附件",
            span: 24,
            type: "slot",
            slotName: "uploadFiles",
          },
          // {
          //   type: "upload",
          //   name: "相关附件",
          //   bind: "uploadFiles",
          //   fileList: [],
          //   fileSize: 500,
          //   fileType: FILE_TYPES,
          //   fileTip: `仅支持上传${FILE_TYPES}格式文件!`,
          //   limit: 10,
          //   tipPopover: true, // hover显示提示  默认外面显示
          //   col: 24,
          //   // required: "请上传附件",
          //    disabled:"true"
          // },
        ],
        data: {
          knowledgeName: "",
          notificationType: "0",
          // departScope: null, // 按部门发布
          // staffScope: null, // 按人员发布
          viewScope: null,
          remarks: "",
          uploadFiles: [], // 文件上传

          createTime: "", // 起始时间
          endTime: "", // 结束时间
        },
        enums: {},
      },
      previewForm: {
        otherConfig: {
          labelNum: 140,
        },
        config: [
          {
            label: "标题",
            value: "knowledgeName",
            col: 12,
            type: "value",
          },
          {
            value: "notificationType",
            label: "通知类型",
            span: 12,
            type: "value",
          },

          // // 可查看部门范围
          // {
          //   // value: "departScope",
          //   label: "可查看部门范围",
          //   type: "slot",
          //   slotName: "departScope",
          //   span: 12,
          // },
          // // 按照人员
          // {
          //   // value: "viewScope",
          //   label: "可查看人员范围",
          //   type: "slot",
          //   slotName: "staffScope",
          //   span: 12,
          // },

          {
            // value: "viewScope",
            label: "按角色发布",
            type: "slot",
            slotName: "viewScope",
            span: 12,
          },
          {
            span: 12,
            type: "slot",
            slotName: "uploadFiles",
          },

          {
            type: "slot",
            slotName: "validTime",
            name: "有效时间",
            placeholder: "请选择",
            col: 24,
            class: "customClass",
            required: "有效时间必填",
          },

          // {
          //   label: "有效时间",
          //   type: "slot",
          //   slotName: "validTime",
          //   span: 24,
          // },
          // {
          //   // value: "remarks",
          //   label: "正文",
          //   type: "slot",
          //   slotName: "remarks",
          //   span: 12,
          //   //type: "value",
          // },

          {
            slotName: "remarks",
            type: "slot",
            name: "正文",
            placeholder: "请输入正文",
            bind: "remarks",
            col: 12,
            maxlength: 1000,
            trigger: "blur",
            minHeight: 150,
            resize: "none",
            required: "正文不能为空",
            items: [
              "formatblock",
              // "fontname",
              "fontsize",
              "|",
              "forecolor", // 文字颜色
              "hilitecolor", // 背景颜色
              "bold", // 加粗
              "italic", // 斜体
              "underline", // 下划线
              // "strikethrough", // 删除线
              "lineheight", // 行距
              "|",
              "justifyleft",
              "justifycenter",
              "justifyright",
              "justifyfull",
              "insertorderedlist",
              "insertunorderedlist",
              "indent",
              "outdent",
            ],
          },
        ],

        data: {
          knowledgeName: "", // 名称
          notificationType: "0", // 类型
          // departScope: "", // 按部门发布
          // staffScope: "", // 按人员发布
          viewScope: "", // 可查看范围
          remarks: "", // 备注
          uploadFiles: [], // 文件
          createTime: "", // 起始时间
          endTime: "", // 结束时间
        },
      },
    };
  },
  mounted() {
    // this.getUserByRoleCodes();
    // this.$nextTick(() => {
    //   const dialogEl = this.$refs.knowledgeForm.$el; // 获取对话框元素引用
    //   console.log(dialogEl, "knowledgeForm");
    //   dialogEl.style.removeProperty("height"); // 移除height属性
    //   // 如果有特定的类设置了高度，也可以移除该类：dialogEl.classList.remove('some-height-class');
    // });
  },
  methods: {
    removeHtmlTags(htmlString) {
      const tempDiv = document.createElement("p");
      tempDiv.innerHTML = htmlString;
      return tempDiv.textContent || tempDiv.innerText || "";
    },
    getUserByRoleCodes() {
      getUserByRoleCode({ roleCode: "XMFZR" }).then((res) => {
        console.log("当前拿到的角色---", res.data);
        res.data.forEach((item) => {
          this.staffScopeList.push({
            label: String(item.fullname),
            value: item.jfid,
          });
        });
        console.log(this.staffScopeList);
      });
    },
    // 部门 角色 人员互斥方法
    // isAnySelectActive(selectKeys) {
    //   console.log(selectKeys, "selected");
    //   return selectKeys.some(
    //     (key) =>
    //       this.form.data[key] !== null &&
    //       this.form.data[key] !== "" &&
    //       this.form.data[key].length != 0
    //   );
    // },
    /******************************************************     业务类函数           ***************************************************/
    //新增打开弹框
    openAdd(type) {
      this.resetForm();
      this.queryRoleCodeAndName();
      this.isEdit = type;
      this.dialogVisible = true;
      this.rowId = "";
    },

    // 编辑 | 预览 打开弹框
    open(type, row) {
      this.queryRoleCodeAndName();
      this.dialogVisible = true;
      this.isEdit = type;
      this.rowId = row.id;

      this.getDetailById(row.id);
    },

    // 重置表单
    resetForm() {
      this.form.data = {
        knowledgeName: "",
        notificationType: "0",
        // viewScope: ["all"],

        viewScope: null,
        // departScope: null, // 按部门发布
        // staffScope: null, // 按人员发布
        remarks: "",
        uploadFiles: [],
        createTime: "", // 起始时间
        endTime: "", // 结束时间
      };

      // this.$set(this.form.data, "uploadFiles", []);
      // this.$set(this.form.config[5], "fileList", []);
    },

    // 查询可查看范围下拉选数据
    queryRoleCodeAndName() {
      api_query_getRoleCodeAndNames().then((res) => {
        let list = [{ dataName: "全部", dataValue: "all" }];
        res.data.map((item) => {
          list.push({
            dataName: item.roleName,
            dataValue: item.roleCode,
          });
        });
        this.viewScopeList = list;
      });
    },

    moreClick(content, type) {
      this.$nextTick(() => {
        this.$refs.moreDialog.open(content, type);
      });
    },

    // 可查看范围change事件 全部和其他角色不能同时存在
    viewScopeChange(list) {
      if (list.includes("all") && list.length > 1) {
        this.$message.warning("全部无法和其他选项同时存在");
        // 移除 "all"
        list = list.filter((item) => item !== "all");
        this.form.data.viewScope = list;
      }
    },
    getDisplayName(value) {
      console.log(value, "valuegetDisplayName");
      const item = this.fileTypeList.find(
        (item) => Number(item.dataValue) === value
      );
      console.log(item, "item");

      return item ? item.dataName : "未知";
    },
    // 类型change事件
    getDisplayValue(value) {
      console.log(value, "value");
      const item = this.fileTypeList.find((item) => item.dataName === value);

      return item ? item.dataValue : "未知";
    },
    // 处理公共数据
    fillFormData(data, targetForm) {
      console.log(data, "获取的数据");
      console.log(targetForm, "当前的数据");
      const {
        knowledgeName,
        remarks,
        notificationType,
        uploadFile,
        createTime,
        content,
      } = data;

      // notificationType
      console.log(notificationType, "notificationType");

      targetForm.data.knowledgeName = knowledgeName;
      targetForm.data.notificationType = this.getDisplayName(notificationType);
      // remarks
      if (this.isEdit == "预览") {
        const cleanText = this.removeHtmlTags(content);
        console.log(cleanText, "cleanText");
        targetForm.data.remarks = cleanText;
      } else {
        targetForm.data.remarks = content;
      }

      targetForm.data.uploadFiles = JSON.parse(uploadFile);
      // createTime
      targetForm.data.createTime = createTime;
      console.log(
        targetForm.data.knowledgeName,
        "targetForm.data.knowledgeName"
      );
      console.log(
        targetForm.data.notificationType,
        "targetForm.data.notificationType"
      );
    },

    // 查询详情
    getDetailById(id) {
      api_detail_getRoleCodeAndNames({ id: id })
        .then((res) => {
          if (res.msg.code == "0000") {
            if (this.isEdit == "编辑") {
              console.log(this.form, "this.form");
              console.log(res.data, "res.data");

              this.fillFormData(res.data, this.form);

              console.log(res.data.viewScope, "res.data.viewScope");
              console.log(res.data.viewScope == "");

              if (res.data.viewScope == "") {
                this.form.data.viewScope = [];
              } else {
                this.form.data.viewScope = res.data.viewScope.split(",");
              }
            } else {
              this.fillFormData(res.data, this.form2);

              console.log(res.data.viewScope, "res.data.viewScope");
              console.log(res.data.viewScope == "");

              if (res.data.viewScope == "") {
                this.form2.data.viewScope = [];
              } else {
                this.form2.data.viewScope = res.data.viewScope.split(",");
              }

              // 预览
              // const formattedData = { ...res.data };

              // // formattedData.notificationType = this.typeFilter(
              // //   formattedData.notificationType
              // // );
              // const cleanText = this.removeHtmlTags(res.data.content);
              // console.log(cleanText, "cleanText");
              // formattedData.remarks = cleanText;

              // this.fillFormData(formattedData, this.previewForm);

              // this.previewForm.data.viewScope = formattedData.viewScopeName;
              // // this.previewForm.data.viewScope = this.roleCodeFilter(
              // //   formattedData.viewScope
              // // );
              // console.log(formattedData.viewScope, " formattedData.viewScope");
            }
          } else {
            this.$message.error("获取详情失败");
          }
        })
        .catch(() => {
          this.$message.error("网络请求失败");
        });
    },

    // 保存
    saveFunc(issue) {
      console.log(issue);
      this.$confirm("确认?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const formValid = this.$refs.knowledgeForm.validate();

          console.log(formValid, "formValid");
          if (formValid) {
            const {
              knowledgeName,
              notificationType,
              remarks,
              viewScope,
              uploadFiles,
              createTime,
              endTime,
              // staffScope,
            } = this.form.data;

            console.log(this.form.data, "参数");
            const files = [];
            uploadFiles &&
              uploadFiles.map((item) => {
                files.push({
                  id: item.id,
                  name: item.name,
                  size: this.getSize(item.size),
                });
              });

            let arr = null;
            if (this.isEdit == "编辑") {
              console.log(notificationType, "notificationType转换前");
              arr = this.getDisplayValue(notificationType);
              console.log(notificationType, "编辑后的参数");
            }

            console.log(arr, "转换后");
            let payLoad = {
              knowledgeName,
              notificationType,
              content: remarks,
              viewScope: viewScope.join(","),
              uploadFiles: files,
              id: this.isEdit == "新增" ? null : this.rowId,
              // jfId: staffScope[0], // 按人员发布
              // buId: "", // 按部门发布
              expirationStartTime: createTime, // 有效开始时间
              expirationEndTime: endTime, // 有效结束时间
              saveStatus: issue === "issue" ? 0 : 1, //保存或者发布状态 0为发布 1为保存
              type: 0, //0是通知类 1是知识库"
            };
            if (this.isEdit == "编辑") {
              payLoad.notificationType = arr;
              console.log(payLoad);
            }
            console.log(payLoad, "参数");
            api_add_knowLedge(payLoad).then((res) => {
              if (res.msg.code == "0000") {
                if (issue == "issue") {
                  this.$message({
                    type: "success",
                    message: "发布成功!",
                  });
                } else {
                  this.$message({
                    type: "success",
                    message: "保存成功!",
                  });
                }
                this.dialogVisible = false;
                this.form = JSON.parse(JSON.stringify(this.form1));
                this.$emit("callback");
                //
              } else {
              }
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },

    // 返回列表
    backList() {
      this.dialogVisible = false;
      this.$refs.knowledgeForm.resetFields();
    },

    /*************************************************      工具类函数          **********************************************************/

    //把文件大小变更成.mb
    getSize(size) {
      if (typeof size == "string") return size;
      return (parseFloat(size) / 1024 / 1024).toFixed(2) + "mb";
    },

    // 类型根据value选择name
    typeFilter(type) {
      return typeMap[type] || "未知类型";
    },

    // 可查看范围根据value选name
    roleCodeFilter(type) {
      console.log(type, "type");
      let typeName = "";
      if (type == "all") {
        typeName = "全部";
      } else {
        let list = type.split(",");

        let result = [];
        for (let index = 0; index < this.viewScopeList.length; index++) {
          for (let idx = 0; idx < list.length; idx++) {
            if (this.viewScopeList[index].dataValue == list[idx]) {
              result.push(this.viewScopeList[index].dataName);
            }
          }
        }
        typeName = result.join(",");
      }
      return typeName;
    },

    // 附件预览
    seeclick(file) {
      const token = sessionStorage.getItem("token");
      const fileExtension = file.name.split(".").pop().toLowerCase();

      if (DOC_TYPES.includes(fileExtension)) {
        // 文档类型
        window.open(`${this.baseUrl}/viewPdf?id=${file.id}`);
      } else if (IMG_TYPES.includes(fileExtension)) {
        // 图片类型
        window.open(
          `${this.baseUrl}/jfzg/file/api/file/download?key=${file.id}&access_token=${token}`
        );
      } else {
        // 其他类型或未知类型
        console.warn(`Unsupported file type: ${fileExtension}`);
      }
    },

    // 附件下载
    download(file) {
      let token = sessionStorage.getItem("token");
      window.open(
        `${this.baseUrl}/jfzg/file/api/file/download?key=${file.id}&access_token=${token}`
      );
    },
    startTimeChange(time) {
      // 处理开始时间变化逻辑
      // this.$emit("startTimeChange", time);
      this.form.data.createTime = time;
      if (
        (this.form.data.endTime &&
          this.form.data.createTime > this.form.data.endTime) ||
        this.form.data.startTime == null
      ) {
        this.form.data.endTime = null;
      }
    },
    // 结束时间选择
    endTimeChange(time) {
      // this.$emit("endTimeChange", time);
      if (!this.form.data.createTime) {
        this.$message.warning("请先选择开始日期");
        this.form.data.endTime = null;
      } else {
        this.form.data.endTime = time;
      }
    },
  },
};
</script>

<style lang="scss" scoped>

// el-form-item is-required col-24 relative border-box

// el-form-item__label
::v-deep .el-form .border-box:last-child {
  color: red !important;
  // background: #000 !important;
  /* 在这里添加你的样式 */
  margin-top: 250px !important;
}

// el-form-item

::v-deep .el-form-item:nth-child(4) .el-form-item__label::before {
  content: "*";
  color: red;
  margin-left: 5px; /* 根据需要调整间距 */
}
::v-deep .el-form-item:nth-child(2) .el-form-item__label::before {
  content: "*";
  color: red;
  margin-left: 5px; /* 根据需要调整间距 */
}

::v-deep .el-form {
  line-height: 56px;
}
// .el-form-item
.customClass {
  background: #000 !important;
}
::v-deep .el-form-item {
  height: 30px !important;
}
.hint {
  width: 200px;
  overflow: hidden;
  font-size: 12px;
  color: red;
  font-weight: 600;
  align-items: center;
}
.hint1 {
  width: 200px;
  font-size: 12px;
  color: red;
  font-weight: 600;
  align-items: center;
  line-height: 50px;
}
.value_box {
  min-height: 44px;
  height: 44px;
  display: flex;
  // align-items: center;
  width: 200px;
  border-bottom: none;
  .itm_label {
    height: 100%;
    width: 50%;
    background-color: #f7f7f7;
    padding: 10px 0 12px 12px;
    display: flex;
    align-items: center;
  }


  .itm_content_File {
    width: 1000px;


    .files-item-content {
     
      display: flex;
      align-items: center;
      line-height: 22px;

      // border-bottom: 2px solid #eee;
      // border-left: 1px solid #dedddd;
      // padding: 0 10px;
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
    color: #ccc;
    cursor: pointer;
  }
}
::v-deep .sr-add .el-input__inner {
  height: 32px !important;
}
::v-deep .ql-container.ql-snow{
  border: none !important;
}
::v-deep .ql-editor{
  border: 1px solid #ccc;
}
</style>
