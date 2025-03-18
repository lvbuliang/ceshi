<template>
  <div>
    <el-dialog :title="isEdit" :visible.sync="dialogVisible" width="60%">
      <span>
        <!-- 预览 -->
        <SrView
          v-if="isEdit == '预览'"
          class="ml-60"
          :formData="previewForm.config"
          :ruleForm="previewForm.data"
        >
          <!-- 按角色发布 -->
          <template slot="viewScope">
            <el-col
              class="value_box"
              v-if="userInfo.currentRole.roleCode == 'FZGHC_JBRBF'"
            >
              <label for="" class="itm_label">按角色发布</label>
              <div class="itm_value">
                <el-tooltip
                  effect="light"
                  placement="top"
                  :content="previewForm.data.viewScope"
                >
                  <span class="v">{{ previewForm.data.viewScope }}</span>
                </el-tooltip>

                <span
                  v-if="viewScopeLength"
                  class="more"
                  @click="moreClick(previewForm.data.viewScope, '按角色发布')"
                  >更多</span
                >
              </div>
            </el-col>
          </template>
          <!-- 备注 -->
          <template slot="remarks">
            <el-col class="value_box">
              <label for="" class="itm_label">备注</label>
              <div class="itm_value">
                <el-tooltip
                  effect="light"
                  placement="top"
                  :content="previewForm.data.remarks"
                >
                  <span class="v">{{ previewForm.data.remarks }}</span>
                </el-tooltip>

                <span
                  v-if="remarksLength"
                  class="more"
                  @click="moreClick(previewForm.data.remarks, '备注')"
                  >更多</span
                >
              </div>
            </el-col>
          </template>
          <!-- 附件 -->
          <template slot="uploadFiles">
            <el-col class="value_box">
              <label for="" class="itm_label">相关附件</label>
              <div
                class="itm_content_File"
                v-if="!previewForm.data.uploadFiles"
              >
                暂无附件
              </div>
              <div v-else class="itm_content_File primary">
                <div
                  class="files-item-content"
                  v-for="(c, cIndex) in previewForm.data.uploadFiles"
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
            </el-col>
          </template>
        </SrView>
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
          <template slot="contextType">
            <el-select v-model="form.data.contextType" placeholder="请选择类型">
              <el-option
                v-for="item in fileTypeList"
                :key="item.dataValue"
                :label="item.dataName"
                :value="item.dataValue"
              >
              </el-option>
            </el-select>
          </template>

          <!-- 按角色发布 -->
          <template slot="viewScope">
            <el-select
              clearable
              multiple
              v-model="form.data.viewScope"
              placeholder="请选择"
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
          </template>
          <!-- 按照部门发布 -->
          <!-- <template slot="departScope"> -->
          <!-- <el-input
              v-model="form.data.departScope"
              :disabled="disabledSelect2"
              clearable
            >
            </el-input> -->
          <!-- <el-select
              clearable
              multiple
              collapse-tags
              v-model="form.data.departScope"
              placeholder="请选择"
              @change="viewScopeChange"
            >
              <el-option
                v-for="item in viewScopeList"
                :key="item.dataValue"
                :label="item.dataName"
                :value="item.dataValue"
              >
              </el-option>
            </el-select> -->
          <!-- </template> -->

          <!-- 按照人员发布 -->
          <!-- <template slot="staffScope"> -->
          <!-- <el-input
              v-model="form.data.staffScope"
              :disabled="disabledSelect3"
              clearable
            >
            </el-input> -->
          <!-- <el-select
              clearable
              multiple
              collapse-tags
              v-model="form.data.staffScope"
              placeholder="请选择"
              @change="viewScopeChange"
            >
              <el-option
                v-for="item in viewScopeList"
                :key="item.dataValue"
                :label="item.dataName"
                :value="item.dataValue"
              >
              </el-option>
            </el-select> -->
          <!-- </template> -->

          <!-- 备注 remarks -->
          <template slot="remarks">
            <el-input
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 5 }"
              placeholder="请输入内容"
              maxlength="200"
              show-word-limit
              v-model="form.data.remarks"
            >
            </el-input>
          </template>
        </SrAdd>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button
          v-if="isEdit !== '预览'"
          size="small"
          @click="saveFunc('save')"
          >保 存</el-button
        >
        <el-button
          v-if="isEdit !== '预览'"
          size="small"
          @click="saveFunc('issue')"
          type="primary"
          >发 布</el-button
        >
        <el-button size="small" @click="backList">返回列表</el-button>
      </span>
    </el-dialog>

    <MoreDialog ref="moreDialog"></MoreDialog>
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
} from "@/api/knowLedge/index.js";

import moreDiaLog from "./moreDialog.vue";
import { clearStorageToken } from "../../../../../jfzg-front-h5/utils/userVali";
const typeMap = {
  0: "通知类",
  1: "统建政策类",
  2: "项目管理类",
  3: "安全运维类",
  4: "其他类",
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
export default {
  components: {
    MoreDialog,
    moreDiaLog,
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
      return this.previewForm.data.viewScope.length > 10;
    },
    remarksLength() {
      return (
        this.previewForm.data.remarks &&
        this.previewForm.data.remarks.length > 20
      );
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
      userInfo: store.getters.userInfo,
      baseUrl: config.baseUrl,
      dialogVisible: false,
      isEdit: "", //新增 编辑
      rowId: "", // 行id
      fileTypeList: [
        // 类型
        { dataName: "通知类", dataValue: "0" },
        { dataName: "统建政策类", dataValue: "1" },
        { dataName: "项目管理类", dataValue: "2" },
        { dataName: "安全运维类", dataValue: "3" },
        { dataName: "其他类", dataValue: "4" },
      ],
      viewScopeList: [{ dataName: "全部", dataValue: "all" }], //按角色发布
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
            name: "名称",
            placeholder: "请输入",
            bind: "knowledgeName",
            col: 24,
            required: "名称必填",
          },
          {
            type: "slot",
            slotName: "contextType",
            name: "类型",
            placeholder: "请选择",
            col: 24,
            class: "customClass",
            required: "类型必填",
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
            slotName: "remarks",
            name: "备注",
            col: 24,
          },
          {
            type: "upload",
            name: "相关附件",
            bind: "uploadFiles",
            required: "请上传相关附件",
            fileList: [],
            fileSize: 500,
            fileType: FILE_TYPES,
            fileTip: `仅支持上传${FILE_TYPES}格式文件!`,
            limit: 10,
            tipPopover: true, // hover显示提示  默认外面显示
            col: 24,
          },
        ],
        data: {
          knowledgeName: "",
          contextType: "0",
          // departScope: null, // 按部门发布
          // staffScope: null, // 按人员发布
          viewScope: null,
          // viewScope: ["all"],
          remarks: "",
          uploadFiles: [], // 相关附件
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
            name: "名称",
            placeholder: "请输入",
            bind: "knowledgeName",
            col: 24,
            required: "名称必填",
          },
          {
            type: "slot",
            slotName: "contextType",
            name: "类型",
            placeholder: "请选择",
            col: 24,
            class: "customClass",
            required: "类型必填",
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
            slotName: "remarks",
            name: "备注",
            col: 24,
          },
          {
            type: "upload",
            name: "相关附件",
            bind: "uploadFiles",
            required: "请上传相关附件",
            fileList: [],
            fileSize: 500,
            fileType: FILE_TYPES,
            fileTip: `仅支持上传${FILE_TYPES}格式文件!`,
            limit: 10,
            tipPopover: true, // hover显示提示  默认外面显示
            col: 24,
          },
        ],
        data: {
          knowledgeName: "",
          contextType: "0",
          // departScope: null, // 按部门发布
          // staffScope: null, // 按人员发布
          viewScope: null,
          // viewScope: ["all"],
          remarks: "",
          uploadFiles: [], // 相关附件
        },
        enums: {},
      },
      previewForm: {
        otherConfig: {
          labelNum: 140,
        },
        config: [
          {
            label: "名称",
            value: "knowledgeName",
            col: 12,
            type: "value",
          },
          {
            value: "contextType",
            label: "类型",
            span: 12,
            type: "value",
          },

          // {
          //   // value: "departScope",
          //   label: "可查看部门",
          //   type: "slot",
          //   slotName: "departScope",
          //   span: 12,
          // },
          // 人员
          // {
          //   // value: "viewScope",
          //   label: "可查看人员",
          //   type: "slot",
          //   slotName: "staffScope",
          //   span: 12,
          // },
          // 部门
          {
            // value: "viewScope",
            label: "按角色发布",
            type: "slot",
            slotName: "viewScope",
            span: 12,
          },
          {
            // value: "remarks",
            label: "备注",
            type: "slot",
            slotName: "remarks",
            span: 12,
            //type: "value",
          },
          {
            span: 24,
            type: "slot",
            slotName: "uploadFiles",
          },
        ],

        data: {
          knowledgeName: "", // 名称
          contextType: "", // 类型
          // departScope: "", // 按部门发布
          // staffScope: "", // 按人员发布
          viewScope: "", // 按角色发布
          remarks: "", // 备注
          uploadFiles: [], // 文件
        },
      },
    };
  },
  methods: {
    // isAnySelectActive(selectKeys) {
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
        contextType: "0",
        // viewScope: ["all"],

        viewScope: null,
        // departScope: null, // 按部门发布
        // staffScope: null, // 按人员发布
        remarks: "",
        uploadFiles: [],
      };

      // this.$set(this.form.data, "uploadFiles", []);
      // this.$set(this.form.config[5], "fileList", []);
    },

    // 查询按角色发布下拉选数据
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

    // 按角色发布change事件 全部和其他角色不能同时存在
    viewScopeChange(list) {
      if (list.includes("all") && list.length > 1) {
        this.$message.warning("全部无法和其他选项同时存在");
        // 移除 "all"
        list = list.filter((item) => item !== "all");
      }

      this.form.data.viewScope = list;
    },
    // 处理公共数据
    fillFormData(data, targetForm) {
      const { knowledgeName, remarks, contextType, uploadFile } = data;
      targetForm.data.knowledgeName = knowledgeName;
      if (this.isEdit == "预览") {
        targetForm.data.contextType = contextType;
      } else {
        targetForm.data.contextType = this.typeFilter(contextType) || "0";
      }
      targetForm.data.remarks = remarks;
      targetForm.data.uploadFiles = JSON.parse(uploadFile);
    },

    // 查询详情
    getDetailById(id) {
      api_detail_getRoleCodeAndNames({ id: id })
        .then((res) => {
          if (res.msg.code == "0000") {
            if (this.isEdit == "编辑") {
              this.fillFormData(res.data, this.form);

              // this.form.data.viewScope = res.data.viewScope.split(",");
              if (res.data.viewScope == "") {
                this.form.data.viewScope = [];
              } else {
                this.form.data.viewScope = res.data.viewScope.split(",");
              }
            } else {
              // 预览
              const formattedData = { ...res.data };
              formattedData.contextType = this.typeFilter(
                formattedData.contextType
              );
              this.fillFormData(formattedData, this.previewForm);
              this.previewForm.data.viewScope = this.roleCodeFilter(
                formattedData.viewScope
              );
            }
          } else {
            this.$message.error("获取详情失败");
          }
        })
        .catch(() => {
          this.$message.error("网络请求失败");
        });
    },

    getDisplayValue(value) {
      const item = this.fileTypeList.find((item) => item.dataName === value);

      return item ? item.dataValue : "未知";
    },
    // 保存
    saveFunc(issue) {
      this.$confirm("确认保存?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const formValid = this.$refs.knowledgeForm.validate();
          // if(formValid.knowledgeName==''){
          //   this.$message.error('名称不能为空')
          // }
          // if(formValid.contextType==''){
          //   this.$message.error('类型不能为空')
          // }
          // if(formValid.remarks==''){
          //   this.$message.error('备注不能为空')
          // }

          if (formValid.knowledgeName != "" && formValid.contextType != "") {
            const {
              knowledgeName,
              contextType,
              remarks,
              viewScope,
              uploadFiles,
            } = this.form.data;

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
              arr = this.getDisplayValue(contextType);
            }

            let payLoad = {
              knowledgeName,
              contextType,
              remarks,
              viewScope: viewScope.join(","),
              uploadFiles: files,
              id: this.isEdit == "新增" ? null : this.rowId,
              jfId: "5516",
              buId: "",
              saveStatus: issue === "issue" ? 0 : 1,
              type: 1,
            };
            if (this.isEdit == "编辑") {
              payLoad.contextType = arr;
            }
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

    // 按角色发布根据value选name
    roleCodeFilter(type) {
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
  },
};
</script>

<style lang="scss" scoped>
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

::v-deep .el-form {
  line-height: 66px;
}
::v-deep .el-form-item:nth-child(2) .el-form-item__label::before {
  content: "*";
  color: red;
  margin-left: 5px; /* 根据需要调整间距 */
}

// ::v-deep .el-form-item:nth-child(4) .el-form-item__label::before {
//   content: "*";
//   color: red;
//   margin-left: 5px; /* 根据需要调整间距 */
// }
</style>
