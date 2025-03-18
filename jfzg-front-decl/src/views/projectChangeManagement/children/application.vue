<template>
  <div
    class="container content_right_body"
    :style="{ height: pageHeight + 'px' }"
  >
    <el-tabs v-model="activeName">
      <el-tab-pane
        v-for="item in tabList"
        :disabled="true"
        :key="item.code"
        :name="item.code"
      >
        <template slot="label">
          <img
            style="vertical-align: middle"
            src="@/assets/barrage_fill@2x.png"
            width="24px"
            height="auto"
            alt=""
          />
          <span style="color: #333; vertical-align: middle; padding-left: 4px">
            {{ item.title }}
          </span>
        </template>
      </el-tab-pane>
      <SrAdd
        class="sradd"
        :config="form.config"
        :enums="form.enums"
        :form="form.data"
        :otherConfig="form.otherConfig"
        ref="add1"
      >
      </SrAdd>
      <div class="btns" @click="addJfw">
        <i class="el-icon-plus"></i>
        添加文件
      </div>
      <el-table
        :data="table.data"
        border
        @header-click="headerclick"
        style="width: 96%; right: -20px; top: 8px; cursor: pointer; z-index: 2"
      >
        <el-table-column type="index" label="序号"> </el-table-column>
        <el-table-column prop="deliveryName" align="center" label="交付物名称">
          <template slot-scope="scope">
            <span v-if="!scope.row.setingFlag" @click="handleEdit(scope.row)">{{
              scope.row.deliveryName
            }}</span>

            <div v-else>
              <el-input
                v-model="scope.row.powerFactor"
                @blur="handleBlur(scope.row)"
                @keyup.enter.native="handleInputConfirm(scope.row)"
              ></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name" align="center" label="文件名称">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="setLabel(scope.$index, scope.row)"
              >上传</el-button
            >
            <el-button
              type="text"
              size="small"
              @click="deleteRow(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <el-dialog
        title="上传交付物"
        :visible.sync="centerDialogVisible"
        width="650px"
        center
      >
        <span>
          <SrAdd
            :config="form3.config"
            :form="form3.data"
            :enums="form3.enums"
            :otherConfig="form3.otherConfig"
            ref="add"
            class="add"
          ></SrAdd>
          <span
            >仅支持上传doc, docx, xls, xlsx, ppt, pptx, pdf, txt, jpg, jpeg,
            jpe, png, rar, zip格式文件</span
          >
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveJfw">确 定</el-button>
        </span>
      </el-dialog>
    </el-tabs>
    <div class="container_bottom_btns">
      <el-button size="small" type="primary" @click="zg"> 暂存 </el-button>
      <el-button size="small" type="primary" @click="tg"> 提交 </el-button>
      <el-button class="goBackCss" size="small" @click="goBackList">
        返回列表
      </el-button>
      <el-button  v-if=isFromWorkBench type='success' size="small" @click="backWorkBench">前往工作台</el-button>
    </div>
  </div>
</template>

<script>
import config from "@/settings.js";
import upload from "@/utils/upload";
import {
  api_changeprojectUpdate,
  api_getDetail,
} from "@/api/projectChangeManagement";

export default {
  name: "projectChange_application",
  components: {},
  provide() {
    return {
      baseUrl: config.uploadBaseUrl,
      imgBaseUrl: config.imgBaseUrl,
      uploadRequest: upload,
      uploadBaseUrl: config.uploadBaseUrl,
    };
  },
  data() {
    return {
      isFromWorkBench: false,//是否从工作台进入
      pageHeight: window.innerHeight - 180,
      contentHeight: 0,
      CurrentIndex: null,
      accessoryList: [],
      formIndex: 0,
      centerDialogVisible: false,
      deliveryId: "", //交付物id
      table: {
        data: [], // 表格数据
        tableConfig: {
          rowClassName: this.rowClassName,
          title: "表格的标题", // 表格标题
          highlightCurrentRow: false, // 控制表格是否单选
          load: this.load,
          tooltipEffect: "light",
          header: [
            {
              slotName: "deliveryName",
              label: "交付物名称",
              prop: "deliveryName",
              index: 11,
            },
            {
              label: "文件名称",
              prop: "name",
            },
          ],
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
            exportPermissionCode: "M015_M003_M003", //导出
          },
          innerBtn: [
            // 表格内部操作按钮，不需要操作列的innerBtn 写成false
            {
              name: "上传",
              method: "setLabel",
              type: "text",
              size: "small",
              icon: "el-icon-document",
              className: "font-size-20",
              validate: this.btnValidate, //自定义判断是否展示按钮权限
            },
            {
              name: "删除",
              method: "deleteRow",
              type: "text",
              size: "small",
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
          // layout: 'total, prev, pager, next, sizes,jumper'
        },
      },
      fileList: [],
      i: 0,
      formInline: {
        user: "",
        region: "",
      },
      itemLable: "123",
      activeName: 1,
      tabList: [{ title: "申请变更", code: "1" }],
      clickmethods: { zg: this.zg, tg: this.tg },
      buttonList: [
        {
          role: "",
          btns: [
            {
              btnName: "暂存",
              btnValue: "zg",
              btnType: "primary",
              btnEventType: "zg",
            },
            {
              btnValue: "btg",
              btnName: "提交",
              btnType: "tg",
              btnEventType: "tg",
            },
          ],
          nodes: [
            {
              dataName: "",
              dataValue: "节点值0",
            },
          ],
        },
      ],
      form1: {
        otherConfig: {
          labelNum: 140,
        },
        config: [],
        data: {
          weeklyFile: "", //附件
        },
      },
      form: {
        otherConfig: {
          labelNum: 140,
        },
        config: [
          {
            type: "input",
            name: "发起人",
            placeholder: "请选择项目发起人",
            bind: "tjPerson",
            dataList: "sponsorNameList",
            trigger: "change",
            col: 12,
            filterable: true,
            disabled: true,
            required: "系统名称不能为空",
          },
          {
            type: "dateSelect",
            timeType: "date",
            name: "发起时间",
            placeholder: "请选择项目发起时间",
            bind: "sponsorTime",
            required: "请选择项目发起时间",
            format: "yyyy-MM-dd",
            maxLength: 20,
            col: 12,
          },
          {
            type: "select",
            name: "项目名称",
            placeholder: "请选择项目负责人",
            bind: "projectName",
            dataList: "projectNameList",
            trigger: "change",
            col: 12,
            filterable: true,
            disabled: true,
          },
          {
            type: "select",
            name: "合同名称",
            placeholder: "请输入合同名称",
            bind: "contractName",
            dataList: "contractNameList",
            trigger: "change",
            col: 12,
            isHave: true,
            disabled: true,
          },
          {
            type: "textarea",
            name: "备注",
            placeholder: "备注",
            bind: "opinionInfo",
            col: 24,
            maxlength: 1000,
            row: 15,
            resize: "none",
            // required: "备注信息不能为空",
          },
          {
            type: "upload",
            name: "项目变更报表",
            className: "fujian",
            disabled: true,
            bind: "weeklyFile",
            fileList: [],
            fileTip:
              "支持扩展名:.doc.docx.pdf.xls.xlsx.ppt.jpg.png，最多上传5个文件，每个文件大小不超过20MB",
            fileType: "doc,docx,pdf,xls,xlsx,ppt,jpg,png",
            tipPopover: true, // hover显示提示  默认外面显示
            col: 24,
            required: "请上传项目变更报表",
            fileSize: 500,
            limit: 10,
          },
          {
            type: "upload",
            name: "变更方案",
            className: "fujian",
            bind: "changeSchemes",
            fileList: [],
            fileTip:
              "支持扩展名:.doc.docx.pdf.xls.xlsx.ppt.jpg.png，最多上传5个文件，每个文件大小不超过20MB",
            fileType: "doc,docx,pdf,xls,xlsx,ppt,jpg,png",
            tipPopover: true, // hover显示提示  默认外面显示
            col: 24,
            fileSize: 500,
            required: "请上传变更方案",
            limit: 10,
          },
        ],
        data: {
          tjPerson: "", //发起人
          sponsorTime: "", //发起周期
          projectName: "", //项目名称
          contractName: "", //合同名称
          opinionInfo: "", //备注
          weeklyFile: [], //附件
          changeSchemes: [], //变更方案
          accessoryList: [],
        },
        enums: {
          contactNameList: [], //项目负责人
          projectNameList: [], //项目名称
          contractNameList: [],
        },
      },
      formEcho: {
        accessoryList: [],
        changeId: null, //0,项目变更基本表ID
        opinionInfo: "", // 备注
        status: null, // 状态 1保存 2提交
        workflowId: null, //  流程实例id
      },
      form3: {
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
        discloseId: null,
      },
    };
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
  },
  watch: {
    formIndex(newVal) {
      localStorage.setItem("formIndex", newVal);
    },
  },
  computed: {
    projectId() {
      return this.$route.query.projectId;
    },
    changeId() {
      return this.$route.query.changeId;
    },
    id() {
      return this.$route.query.id;
    },
  },
  created() {
    this.init();
    this.$refs.dialogTableVisible = false;
    this.formIndex = Number(localStorage.getItem("formIndex")) || 0;
  },
  mounted() {
    if(this.$route.query.activeName=='待办'||this.$route.query.activeName=='已办'){ 
      this.isFromWorkBench = true
    }
    this.form4 = JSON.parse(JSON.stringify(this.form3));
    window.addEventListener("resize", this.handleResize);
  },

  methods: {
    backWorkBench(){
    this.$router.go(-1)
    },
    init() {
      api_getDetail({
        contractId: this.$route.query.contractId,
        changeId: this.changeId == "undefined" ? "" : this.changeId,
        projectId: this.$route.query.id,
        type: this.$route.query.type,
      }).then((res) => {
        if (res.data) {
          var newObj = {};
          if (Object.keys(this.form.data.tjPerson).length == 0) {
            this.form.data.tjPerson = this.$route.query.fullname;
            this.form.data.sponsorTime = this.getNowTime();
            this.form.data.projectName = res.data.projectName;
            this.form.data.contractName = res.data.contractName;
          } else {
            for (var key in res.data) {
              newObj[key] = res.data[key];
            }
            this.form.data = newObj;
          }
          if (res.data.initialSpectFilesEntityList) {
            res.data.initialSpectFilesEntityList.forEach((item) => {
              if (item.deliveryName == "项目变更报审表") {
                this.form.data.weeklyFile.push({
                  id: item.fileContext,
                  name: item.fileName,
                  size: item.fileSize,
                  fileId: item.id,
                  deliveryName: item.deliveryName,
                });
              } else if (item.deliveryName == "变更方案") {
                this.form.data.changeSchemes.push({
                  id: item.fileContext,
                  name: item.fileName,
                  size: item.fileSize,
                  fileId: item.id,
                  deliveryName: item.deliveryName,
                });
              } else if (item.isOthers == 1 || item.isOthers == 0) {
                this.table.data.push({
                  id: item.fileContext,
                  name: item.fileName,
                  size: item.fileSize,
                  fileId: item.id,
                  deliveryName: item.deliveryName,
                });
              }
            });
          }
          // this.form.data.opinionInfo =
          //   res.data.opinionEntityList[0].opinionInfo;
        }
      });
    },
    getNowTime() {
      var date = new Date();
      var seperator1 = "-";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var hour = date.getHours();
      var minutes = date.getMinutes();
      var seconds = date.getSeconds();
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate =
        year +
        seperator1 +
        month +
        seperator1 +
        strDate +
        " " +
        hour +
        ":" +
        minutes +
        ":" +
        seconds;
      return currentdate;
    },
    handleEdit(row) {
      this.$set(row, "setingFlag", true);
    },
    handleBlur(row) {
      row.setingFlag = false;
      if (
        row.powerFactor == undefined ||
        row.powerFactor == undefined ||
        row.powerFactor == ""
      ) {
      } else {
        this.$set((row.deliveryName = row.powerFactor));
      }
    },
    handleInputConfirm(row, column, cell, event) {
      row.setingFlag = false;
    },
    // 表格上传方法
    setLabel(index, row) {
      this.form3 = JSON.parse(JSON.stringify(this.form4));

      this.deliveryId = row.id;
      this.centerDialogVisible = true;
      this.CurrentIndex = index;
    },
    // 保存提交
    saveJfw() {
      let { name, id, size, createTime } = this.form3.data.accessoryList[0];
      size = (size / 1024 / 1024).toFixed(2);
      this.$set(this.table.data[this.CurrentIndex], "createTime", createTime);
      this.$set(this.table.data[this.CurrentIndex], "id", id);
      this.$set(this.table.data[this.CurrentIndex], "size", size);
      this.$set(this.table.data[this.CurrentIndex], "name", name);
      this.centerDialogVisible = false;
      this.form3.data.accessoryList = [];
    },

    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    addJfw() {
      this.formIndex += 1;
      this.table.data.push({
        deliveryName: "其他", //交付物名称
        name: null, //文件名称
        id: this.formIndex,
        isOthers: 1,
        isMustUpload: this.formIndex,
      });
    },
    deleteRow(row) {
      let find = (ele) => ele == row;
      const index = this.table.data.findIndex(find);
      this.$confirm("您确定要删除此文件吗?", "温馨提示")
        .then(() => {
          this.table.data.splice(row, 1);
          if (row.isMustUpload == 0 || row.isMustUpload == nul) {
            this.$message.success("删除成功");
          } else if (row.isMustUpload == 1) {
            this.$message.error("不可删除");
          }
        })
        .catch(() => {});
    },
    zg() {
      let data = this.form.data;
      let formNew = this.formEcho;
      formNew.status = 1;
      if (Array.isArray(this.table.data)) {
        this.table.data.map((res) => {
          formNew.accessoryList.push(res);
        });
      } else {
        formNew.accessoryList = [];
      }
      if (Array.isArray(data.weeklyFile)) {
        data.weeklyFile.forEach((item) => {
          item.deliveryName = "项目变更报审表";
          item.isOthers = 3;
        });
        data.weeklyFile.map((res) => {
          formNew.accessoryList.push(res);
        });
      } else {
        formNew.accessoryList = [];
      }
      if (Array.isArray(data.changeSchemes)) {
        data.changeSchemes.forEach((item) => {
          item.isOthers = 3;
          item.deliveryName = "变更方案";
        });
        data.changeSchemes.map((res) => {
          formNew.accessoryList.push(res);
        });
      } else {
        formNew.accessoryList = [];
      }
      formNew.opinionInfo = data.opinionInfo;
      formNew.contractId = this.$route.query.contractId;
      if (this.$route.query.id) {
        formNew.projectId = this.$route.query.id;
      }
      if (this.$route.query.changeId) {
        formNew.changeId = this.$route.query.changeId;
      }
      this.$confirm("确认暂存变更申请?", "提示", {
        iconClass: "el-icon-question", //自定义图标样式
        confirmButtonText: "确认", //确认按钮文字更换
        cancelButtonText: "取消", //取消按钮文字更换
        showClose: true, //是否显示右上角关闭按钮
        type: "warning", //提示类型  success/info/warning/error
      })
        .then(() => {
          api_changeprojectUpdate(formNew).then((res) => {
            if (res.msg.code == "0000") {
              this.$message.success("暂存成功");
              this.$router.push({
                name: "projectChangeManagement",
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    tg() {
      let data = this.$refs["add1"].validate();
      let formNew = this.formEcho;
      const isUpload = this.table.data.filter((item) => item.name === null);
      if (isUpload.length > 0) {
        const arr = [];
        isUpload.forEach((item) => {
          arr.push(item.deliveryName);
        });
        this.$message({
          message: `【${arr.join(",")}】不能为空，请上传文件`,
          type: "warning",
        });
      } else {
        this.$confirm("是否变更项目?", "温馨提示", {
          iconClass: "el-icon-question", //自定义图标样式
          confirmButtonText: "确认", //确认按钮文字更换
          cancelButtonText: "取消", //取消按钮文字更换
          showClose: true, //是否显示右上角关闭按钮
          type: "warning", //提示类型  success/info/warning/error
        })
          .then(() => {
            if (data) {
              formNew.status = 2;
              if (Array.isArray(data.weeklyFile)) {
                data.weeklyFile.forEach((item) => {
                  item.deliveryName = "项目变更报审表";
                });
                data.weeklyFile.map((res) => {
                  formNew.accessoryList.push(res);
                });
              } else {
                formNew.accessoryList = [];
              }

              if (Array.isArray(data.changeSchemes)) {
                data.changeSchemes.forEach((item) => {
                  item.deliveryName = "变更方案";
                });
                data.changeSchemes.map((res) => {
                  formNew.accessoryList.push(res);
                });
              } else {
                formNew.accessoryList = [];
              }

              formNew.opinionInfo = data.opinionInfo;
              // 带出合同contractId
              formNew.contractId = this.$route.query.contractId;
              if (this.$route.query.id) {
                formNew.projectId = this.$route.query.id;
              }
              if (this.$route.query.changeId) {
                formNew.changeId = this.$route.query.changeId;
              }

              if (Array.isArray(this.table.data)) {
                this.table.data.map((res) => {
                  formNew.accessoryList.push(res);
                });
              } else {
                formNew.accessoryList = [];
              }
              api_changeprojectUpdate(formNew).then((res) => {
                if (res.msg.code == "0000") {
                  this.$message.success("提交成功");
                  this.$router.push({
                    name: "projectChangeManagement",
                  });
                }
              });
            }
          })
          .catch(() => {});
      }
    },
    handleResize() {
      this.pageHeight = window.innerHeight - 185;
    },
    goBackList() {
      this.$router.push({ path: "/projectChangeManagement" });
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 80%;
  background: #fff;
}
.sradd {
  padding: 20px;
  padding-top: 0;
}
::v-deep .el-tabs__header {
  padding: 20px !important;
  padding-bottom: 0 !important;
}
::v-deep .workflow_button .el-button {
  left: 0px;
  top: 0px;
  width: 88px;
  height: 34px;
  opacity: 1;
  border-radius: 4px;
  // background: rgba(66, 130, 255, 1);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 32px 8px 32px;
}

.btns {
  width: 80px;
  text-align: center;
  height: 34px;
  font-size: 12px;
  line-height: 34px;
  border-radius: 4px;
  color: rgba(66, 130, 255, 1);
  background: rgba(66, 130, 255, 0.1);
  cursor: pointer;
  margin-left: 20px;
  border: 1px dashed rgba(66, 130, 255, 1);
}
::v-deep .sr_table {
  margin-bottom: 16px;
}
.workflow {
  width: calc(100% - 220px);
  z-index: 0;
}
.container {
  position: relative;
  padding: 20px;
  height: calc(100% - 70px);
  overflow-y: auto;
}

.container_bottom_btns {
  position: fixed;
  bottom: 0;
  width: calc(100% - 190px);
  background: #fff;
  z-index: 10;
  right: 0;
  padding: 20px 0;
  text-align: center;
  border-top: 1px solid #e6e6e6;
  .goBackCss {
    display: inline-block;
    margin-left: 20px;
  }
  .workflow_button {
    box-sizing: border-box;
    display: inline-block;
    margin: 0 4px;
    button {
      padding: 0px 24px;
      line-height: 32px;
      border-radius: 16px;
    }
  }
}
// ::v-deep .container::-webkit-scrollbar-thumb {
//   width: 0px !important;
//   display: none !important;
//   /* 隐藏滚动条宽度 */
// }

.content_right_body {
  // height: 90%;
  // height: 750px;
  overflow-y: auto;
}
// 滚动条
.content_right_body::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 0px;
}
.content_right_body::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 5px;
  // -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #fff;
}
.content_right_body::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  // -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background: #ffffff;
}

.el-popup-parent--hidden > .el-overlay {
  display: none; /* 这会直接移除遮罩层 */
}
</style>
