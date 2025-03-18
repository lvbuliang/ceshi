<template>
  <div class="accountList">
    <div class="main">
      <FSearch :form="search" @queryList="searchData()"></FSearch>
      <!-- 操作按钮 -->
      <div class="buttonOperation">
        <el-button class="button interval" type="primary" @click="add">
          <i class="el-icon-circle-plus-outline el-icon--left"></i>新增人员
        </el-button>
        <el-popover
          placement="top-start"
          width="200"
          trigger="hover"
          content="从深圳市可信统一身份认证管理平台同步帐号信息"
        >
          <el-button
            class="button interval"
            type="primary"
            @click="infoSync"
            slot="reference"
          >
            <i class="el-icon-sort el-icon--left"></i>信息同步
          </el-button>
        </el-popover>
        <el-button class="button" @click="deleteAll">
          <i class="el-icon-download el-icon--left"></i>导出excel
        </el-button>
        <el-upload
          class="upload-demo"
          action="string"
          :http-request="uploadFile"
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
        >
          <el-button class="button">导入</el-button>
        </el-upload>
        <el-button type="text">
          <i class="el-icon-download"></i>
          <a
            href="/opadmin/xls/审核小组上传示例.xlsx"
            style="color: #1890ff"
            download="审核小组上传模板"
            >下载模板</a
          >
        </el-button>
      </div>
      <FTable
        class="tableData"
        :data="table.data"
        :config="table.config"
        :page="table.page"
        :formatter="tableFormat"
        @selected="onSelect"
        @pageChanged="pageChanged"
        @sortChange="sortChange"
        @sizeChanged="sizeChanged"
      ></FTable>
    </div>
    <!-- 弹框 -->
    <div class="springBox">
      <el-dialog
        class="common-dialog"
        :title="dialog.title"
        :visible.sync="dialog.dialogVisible"
        :width="dialog.width"
        :before-close="bClose"
        append-to-body
      >
        <!-- 重置密码弹框 -->
        <template>
          <FForm
            ref="modelMgrRefPWD"
            :other-config="otherConfigPWD"
            :config="formPWD.config"
            :form="formPWD.data"
            :rules="formPWD.rules"
            :enums="formPWD.enums"
            refForm="modelMgrRefFormPWD"
            :column="2"
          />
          <div slot="footer" class="dialog-footer">
            <el-button
              type="primary"
              size="small"
              @click="springBox_determine()"
              >确定</el-button
            >
            <el-button type size="small" @click="colseDialog()">取消</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
    <accountListDialog
      ref="accountListDialog"
      @refresh="refresh"
    ></accountListDialog>
    <multipleChoiceDialog
      ref="multipleChoiceDialog"
      @refresh="refresh"
    ></multipleChoiceDialog>
  </div>
</template>
<script>
import FForm from "@/components/FForm/form-add";
import FTable from "@/components/FTable/index.vue";
import FSearch from "@/components/FSearch/index.vue";
import config from "@/settings.js";
import accountListDialog from "./components/accountListDialog";
import multipleChoiceDialog from "./components/multipleChoiceDialog";
import {
  api_queryUsersByPage,
  api_delete,
  api_buPropertyList,
  api_enabledUnitMembers,
  api_forbiddenUnitMembers,
  api_exportUserExcel,
  api_excel,
  api_uploadfile,
  api_sysPullTacc,
  api_sysDoneTacc,
} from "@/api/accountManage/accountManage";
import {
  api_deleteUnitMembers,
  api_unitForbidden,
  api_unitEnabled,
  api_unitDelete,
  api_setMemberrUnitUpdate,
  api_resetPwdUnitMembers,
} from "@/api/unitManage/unitManage";
import { getStorageToken } from "@/utils/user-vali";
export default {
  components: {
    FForm,
    FTable,
    FSearch,
    accountListDialog,
    multipleChoiceDialog,
  },
  data() {
    return {
      options: [
        {
          lable: 1,
          value: "承建单位",
          muteStatus: 0,
        },
      ],
      otherConfigPWD: {
        // 其他配置
        labelNum: 120, // label宽度，可选120和150，默认120
      },
      table: {
        data: [{ userName: "1" }], // 表格数据
        config: {
          fixed: "right",
          selection: true, // 是否显示复选框
          multiple: true,
          rowKey: "jfid",
          // expand: true, // 表格扩展
          operationWidth: 350, // 操作列的宽度，不传默认180
          title: "", // 表格标题
          header: [
            // 表格列配置
            {
              name: "姓名",
              prop: "userName",
            },
            {
              name: "手机",
              prop: "mobile",
              width: 150,
            },
            {
              name: "账户",
              prop: "userId",
              width: 150,
            },
            {
              name: "工号",
              prop: "jobId",
              width: 150,
            },
            // {
            //   name: "单位名称",
            //   prop: "buName",
            //   width: 190,
            // },
            // {
            //   name: "单位类型",
            //   prop: "propertyName",
            //   width: 120,
            // },
            // {
            //   name: "角色",
            //   prop: "roleName",
            //   width: 180,
            // },
            // {
            //   name: "职务",
            //   prop: "role",
            // },
            {
              name: "最后登陆时间",
              prop: "lastLoginTime",
              width: 190,
            },
            {
              name: "邮箱",
              prop: "mailbox",
              // width: 190,
            },
            {
              name: "状态",
              prop: "accountStatName",
              haveHTML: true,
              width: 90,
            },
          ],
          innerBtn: [
            // 表格内部操作按钮，不需要操作列的innerBtn 写成false
            {
              name: "编辑", // 按钮名称，优先显示icon
              method: "edit", // 点击执行该页面methods中对应的方法
              className: "font-size-20",
            },
            {
              name: "启用",
              method: "startUsing",
              className: "font-size-20",
              field: "accountStat", // 控制按钮显示隐藏的字段，目前仅支持单一字段，常显的按钮不需要传
              value: [0], // 需要根
            },
            {
              name: "停用",
              method: "blockUp",
              className: "font-size-20",
              field: "accountStat", // 控制按钮显示隐藏的字段，目前仅支持单一字段，常显的按钮不需要传
              value: [4], // 需要根
            },
            // {
            //   name: "删除",
            //   method: "delete",
            //   className: "font-size-20",
            // },
            {
              name: "重置密码",
              method: "resetPWD",
              field: "id",
              value: [],
              className: "font-size-20",
            },
          ],
        },
        page: {
          // 分页配置
          total: 12, //总条数
          pages: 2, //总页数
          pageSize: 10, //每页展示多少个
          pageNum: 1, //当前页
        },
      },
      search: {
        textMaxNum: 4, // label 最多几个字默认4个
        showExpand: true, // 是否显示展开收起，默认超过三个显示
        minNum: 3, // 收起显示几个, 默认3个
        config: [
          {
            type: "text",
            name: "姓名",
            placeholder: "请输入姓名",
            bind: "fullname", // 对应this.search.data对象的field1
            lableWidth: 45,
          },
          {
            type: "text",
            name: "联系方式",
            placeholder: "请输入联系方式",
            bind: "mobile", // 对应this.search.data对象的field1
          },
          {
            type: "select",
            name: "单位类型",
            placeholder: "请选择单位类型",
            bind: "buProperty",
            data: "stateList", // 对应enum中的stateList
          },
          {
            type: "text",
            name: "单位名称",
            placeholder: "单位名称",
            bind: "buName", // 对应this.search.data对象的field1
          },
        ],
        enum: {
          // 搜索项下拉数据
          stateList: [
            {
              dataName: "承建单位",
              dataValue: 1,
            },
            {
              dataName: "承建单位",
              dataValue: 2,
            },
            {
              dataName: "承建单位",
              dataValue: 3,
            },
          ],
        },
        form: {
          buProperty: "",
          buName: "",
          mobile: "",
          fullname: "",
        },
      },
      buids: [],
      dialog: {
        dialogVisible: false,
        width: "",
        title: "",
        type: "",
        id: "",
      },
      formPWD: {
        title: "表单标题",
        config: [
          {
            col: 24,
            type: "radio",
            name: "重置方式",
            bind: "PWDType",
            method: "callFn",
            trigger: "blur", // 校验时机
            required: "请输入部门名称", // 必填需要指定提示信息
            dataList: "radioList",
          },
          {
            col: 24, // 独占一行
            type: "password",
            name: "密码",
            placeholder: "请输入密码",
            bind: "password",
            trigger: "change", // 校验时机
            required: "请输入密码",
            rules: {
              regular_PWD: "只允许设置8-20位数字和字母的密码！",
            },
          },
        ],
        data: {
          PWDType: 1,
          password: "",
        },
        enums: {
          radioList: [
            {
              dataName: "手动输入",
              dataValue: 1,
            },
            // {
            //   dataName: "随机密码",
            //   dataValue: 0,
            // },
          ],
        },
        rules: {},
      },
    };
  },
  computed: {
    themeName() {
      return this.$store.state.permission.theme || "";
    },
  },
  mounted() {
    this.getData();
    this.getBuPropertyList();
    if (this.themeName == "yuhua") {
      this.table.config.header[5].prop = "roleNames";
    }
  },
  methods: {
    // 信息同步
    infoSync() {
      console.log("信息同步");
      api_sysPullTacc().then((res) => {
        console.log("res", res);
        if (res.msg.code == "0000") {
          setTimeout(() => {
            api_sysDoneTacc().then((res2) => {
              console.log("res2", res2);
              if (res2.msg.code == "0000") {
                this.$message({
                  type: "error",
                  message: res2.msg.message,
                });
              }
            });
          }, 3000);
        } else {
          this.$message({
            type: "error",
            message: res.msg.message,
          });
        }
      });
    },
    beforeAvatarUpload(file) {
      console.log(file);
      let testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      const isXLS = testmsg.toUpperCase() == "XLS";
      const isXLSX = testmsg.toUpperCase() == "XLSX";
      const isSize = file.size / 1024 / 1024 < 20;
      if (!isXLS && !isXLSX) {
        this.$message.warning("上传文件只能是xls、xlsx格式!");
        return false;
      }
      if (!isSize) {
        this.$message.warning("上传文件大小不能超过20MB!");
        return false;
      }
    },
    uploadFile(params) {
      let fd = new FormData();
      fd.append("file", params.file);
      console.log(params.file, fd);
      api_uploadfile(fd).then((res) => {
        console.log(res);
        if (res.msg.code == "0000") {
          console.log(res);
          if (res.msg.message == "SUCCESS") {
            // this.getProjectList();
            this.getData();
            this.$message({
              type: "success",
              message: "导入成功",
            });
          } else {
            this.$message({
              type: "warning",
              message: res.msg.message,
            });
          }
        }
      });
    },
    searchData() {
      this.table.page.pageNum = 1;
      this.getData();
    },
    onSelect(row) {
      this.buids = [...row];
    },
    //获取单位类型下拉
    getBuPropertyList() {
      api_buPropertyList()
        .then((res) => {
          // console.log(res);
          if (res.msg && res.msg.code == "0000") {
            let arr = [];
            res.data.forEach((item) => {
              let obj = {};
              if (item.id) {
                obj.dataValue = item.id;
                obj.dataName = item.propertyName;
                arr.push(obj);
              }
            });
            this.$set(this.search.enum, "stateList", arr);
            // console.log(this.search);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    tableFormat(key, val, row) {
      // console.log(row["accountStatName"])
      if (key === "accountStatName") {
        if (row["accountStatName"] == "正常") {
          return "<div class='enabled round-state'>正常</div>";
        } else {
          return "<div class='disabled round-state'>停用</span></div>";
        }
      }
    },
    sortChange(column) {},
    //获取表格数据
    getData() {
      let data = {
        pageSize: this.table.page.pageSize,
        pageNum: this.table.page.pageNum,
        buName: this.search.form.buName,
        buProperty: this.search.form.buProperty,
        fullname: this.search.form.fullname,
        mobile: this.search.form.mobile,
      };
      api_queryUsersByPage(data)
        .then((res) => {
          // console.log(res);
          if (res.msg && res.msg.code == "0000") {
            this.table.page.pages = res.data.pages;
            this.table.page.total = res.data.total;
            this.table.data = res.data.list;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    /**
     * 用于格式化表格数据，
     */
    formatter() {},
    //编辑
    edit(row) {
      row.title = "编辑人员";
      console.log(row);
      if (this.themeName == "yuhua") {
        this.$refs.multipleChoiceDialog.init(row);
      } else {
        this.$refs.accountListDialog.init(row);
      }
    },
    //新增
    add() {
      let data = {
        title: "新增人员",
      };
      if (this.themeName == "yuhua") {
        this.$refs.multipleChoiceDialog.init(data);
      } else {
        this.$refs.accountListDialog.init(data);
      }
    },
    //启用
    startUsing(row) {
      this.$confirm("此操作将启用该账号, 是否继续?", "确认要启用该账号吗？", {
        showClose: false,
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        customClass: "biaozhunhua_confirm changsha_confirm_warning", //
        type: "warning",
      })
        .then(() => {
          let data = {
            jfid: row.jfid,
            accountStat: 0,
          };
          api_enabledUnitMembers(row.jfid).then((res) => {
            if (res.msg && res.msg.code == "0000") {
              this.$message({
                type: "success",
                message: "启用成功!",
              });
              this.getData();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消启用",
          });
        });
    },
    //停用
    blockUp(row) {
      this.$confirm("此操作将停用该账号, 是否继续?", "确认要停用该账号吗？", {
        showClose: false,
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        customClass: "biaozhunhua_confirm changsha_confirm_warning", //
        type: "warning",
      })
        .then(() => {
          let data = {
            jfid: row.jfid,
            accountStat: 4,
          };
          api_forbiddenUnitMembers(row.jfid).then((res) => {
            if (res.msg && res.msg.code == "0000") {
              this.$message({
                type: "success",
                message: "停用成功!",
              });
              this.getData();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消停用",
          });
        });
    },
    //删除
    delete(row) {
      this.$confirm(
        "此操作将永久删除该账号, 是否继续?",
        "确认要删除该账号吗？",
        {
          showClose: false,
          cancelButtonText: "取消",
          confirmButtonText: "确定",
          customClass: "biaozhunhua_confirm changsha_confirm_warning", //
          type: "warning",
        }
      )
        .then(() => {
          let data = {
            jfid: row.jfid,
          };
          api_deleteUnitMembers(row.jfid).then((res) => {
            if (res.msg && res.msg.code == "0000") {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.getData();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 重置密码
    resetPWD(data) {
      this.dialog = {
        dialogVisible: true,
        width: "560px",
        title: "重置密码",
        type: 3,
        id: data.jfid,
      };
      // if (this.formPWD.config.length == 1) {
      //   let data = {
      //     col: 24, // 独占一行
      //     type: "password",
      //     name: "密码",
      //     placeholder: "请输入密码",
      //     bind: "password",
      //     trigger: "change", // 校验时机
      //     required: "请输入密码",
      //     rules: {
      //       regular_PWD: "只允许设置8-20位数字和字母的密码！",
      //     },
      //   };
      //   this.formPWD.config.splice(1, 0, data);
      // }
    },
    // 重置密码切换
    callFn(evt) {
      if (evt == 0) {
        this.formPWD.config.splice(1, 1);
      } else {
        this.formPWD.data.password = "";
        let data = {
          col: 24, // 独占一行
          type: "password",
          name: "密码",
          placeholder: "请输入密码",
          bind: "password",
          trigger: "change", // 校验时机
          required: "请输入密码",
          rules: {
            regular_PWD: "只允许设置8-20位数字和字母的密码！",
          },
        };
        this.formPWD.config.splice(1, 0, data);
      }
    },
    // 弹框确定
    springBox_determine() {
      var parameter = new Promise((resolve, reject) => {
        this.$refs["modelMgrRefPWD"].$refs["modelMgrRefFormPWD"].validate(
          (valid) => {
            if (valid) {
              resolve();
            }
          }
        );
      });
      Promise.all([parameter]).then(() => {
        // if (this.formPWD.data.PWDType == 0) {
        //   api_resetPwdUnitMembers({
        //     jfid: this.dialog.id,
        //   }).then((res) => {
        //     if (res.msg && res.msg.code == "0000") {
        //       this.$confirm("新密码:" + res.data, "该账号的密码重置成功!", {
        //         showClose: false,
        //         showCancelButton: false,
        //         confirmButtonText: "确定",
        //         customClass: "biaozhunhua_confirm changsha_confirm_success", //
        //         type: "success",
        //       }).then(() => {
        //         this.colseDialog();
        //         this.getData();
        //       });
        //     }
        //   });
        // } else {
        let params = {
          jfid: this.dialog.id,
          password: this.formPWD.data.password,
        };
        api_resetPwdUnitMembers(params).then((res) => {
          if (res.msg && res.msg.code == "0000") {
            this.colseDialog();
            // this.$message({
            //   type: "success",
            //   message: "启用成功!",
            // });
            this.getData();
          }
        });
        // }
      });
    },
    // 弹框取消
    colseDialog() {
      this.$refs["modelMgrRefPWD"].$refs["modelMgrRefFormPWD"].resetFields();
      this.dialog.dialogVisible = false;
    },
    // 关闭前回调
    bClose(done) {
      this.$refs["modelMgrRefPWD"].$refs["modelMgrRefFormPWD"].resetFields();
      done();
    },
    //导出
    deleteAll() {
      let access_token = getStorageToken();

      if (this.buids.length > 0) {
        let arr = [];
        this.buids.forEach((item) => {
          if (item.jfid) {
            arr.push(item.jfid);
          }
        });
        window.open(
          `${config.baseUrl}/jfzg/opcenter/user/exportUserExcel?jfids=${arr}&access_token=${access_token}`
        );
        // window.open(
        //   `${
        //   config.baseUrl
        //   }/unit/export/excel/part?buids=${arr.join(",")}`
        // );
      } else {
        let data = {
          buName: this.search.form.buName,
          buProperty: this.search.form.buProperty,
          fullname: this.search.form.fullname,
          mobile: this.search.form.mobile,
        };
        window.open(
          `${config.baseUrl}/jfzg/opcenter/user/exportUserExcel?access_token=${access_token}&buName=${this.search.form.buName}&buProperty=${this.search.form.buProperty}&fullname=${this.search.form.fullname}&mobile=${this.search.form.mobile}`
        );
      }
    },
    refresh() {
      this.getData();
    },
    //前端分页组件
    pageChanged(val) {
      this.table.page.pageNum = val;
      this.getData();
    },
    sizeChanged(val) {
      this.table.page.pageSize = val;
      this.getData();
    },
  },
};
</script>

<style lang="scss" scoped>
.accountList {
  /deep/.search {
    .el-form {
      .el-form-item {
        margin-right: 10px;
        .el-form-item__label {
          width: auto !important;
        }
      }
    }
  }
  .buttonOperation {
    display: flex;
    .upload-demo {
      margin-left: 10px;
    }
    /deep/ .button {
      width: 116px;
      height: 32px;
      border-radius: 16px;
      padding: 0;
    }
    /deep/ .interval {
      margin-right: 10px;
    }
  }
}
</style>
