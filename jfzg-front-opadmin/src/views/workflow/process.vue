<template>
  <div class="peoplel">
    <FSearch :form="search" @queryList="getProjectList(1)"></FSearch>
    <div class="btn">
      <el-upload class="upload-demo" action="string" :http-request="UploadImage">
        <el-button size="small" type="primary">导入模型</el-button>
      </el-upload>
      <!-- <el-button type="primary" size="small" @click="importModel">导入模型</el-button> -->
    </div>
    <FTable
      class="tableData"
      :data="table.data"
      :config="table.config"
      :page="table.page"
      :formatter="formatter"
      @pageChanged="getPageData"
      @sizeChanged="getSizeDate"
    >
      <div slot="cellSlot" slot-scope="scope">
        <div
          class="table_unitName"
          @click="unitDetails(scope.scope.row)"
        >{{ scope.scope.row.resourceName }}</div>
      </div>
      <div slot="cellSlot" slot-scope="scope">
        <div
          class="table_unitName"
          @click="unitDetails(scope.scope.row)"
        >{{ scope.scope.row.diagramResourceName }}</div>
      </div>
    </FTable>
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
        <div class="springBox_form">
          <FForm
            ref="modelMgrRef"
            :config="form.config"
            :form="form.data"
            :rules="form.rules"
            :enums="form.enums"
            refForm="modelMgrRefForm"
            @eventNotify="eventNotify"
            :column="2"
          ></FForm>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button
            type="primary"
            size="small"
            style="width:80px;height:32px;"
            @click="springBox_determine(dialog.type)"
          >确定</el-button>
          <el-button type size="small" style="width:80px;height:32px;" @click="colseDialog">取消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import FTable from "@/components/FTable/index.vue";
import FForm from "@/components/FForm/form-add.vue";
import FSearch from "@/components/FSearch/index.vue";
import config from "@/settings.js";
import {
  api_activateProgress, //激活流程
  api_hangProgress, //挂起流程
  api_queryProgressList, //流程列表
  api_readProgressData, //读取流程图资源
  api_removeProgress, //删除流程
  api_progressToModel, //流程转模型
  api_deployFlows, //导入模型
} from "@/api/progressManage/progressManage";
export default {
  components: {
    FTable,
    FSearch,
    FForm,
  },
  data() {
    return {
      baseUrl: config.baseUrl,
      form: {
        title: "表单标题",
        config: [
          {
            col: 24,
            type: "text",
            name: "项目名称",
            placeholder: "请输入项目名称",
            bind: "projectName",
            trigger: "blur", // 校验时机
            // required: "请输入项目名称", // 必填需要指定提示信息
          },
          {
            col: 24,
            type: "text",
            name: "项目编号",
            placeholder: "请输入项目编号",
            bind: "projectCode",
          },
          {
            col: 12,
            type: "text",
            name: "项目联系人",
            placeholder: "请输入项目联系人",
            bind: "contactName",
          },
          {
            col: 12,
            type: "text",
            name: "项目联系人电话",
            placeholder: "请输入联系电话",
            bind: "contactMobile",
          },
          {
            col: 24,
            type: "text",
            name: "联系人邮箱",
            placeholder: "请选择承建单位",
            bind: "contactEmail",
          },
          {
            col: 24,
            type: "text",
            name: "承建单位项目经理",
            placeholder: "请输入承建单位项目经理",
            bind: "people",
          },
          {
            col: 24,
            type: "textarea",
            name: "建设内容",
            placeholder: "请输入建设内容",
            bind: "content",
          },
        ],
        data: {
          projectName: "",
          projectCode: "",
          contactName: "",
          contactMobile: "",
          contactEmail: "",
          people: "",
          content: "",
        },
        enums: {
          stateList: [
            {
              dataName: "统筹单位",
              dataValue: "1",
            },
            {
              dataName: "建设单位",
              dataValue: "2",
            },
            {
              dataName: "承建单位",
              dataValue: "3",
            },
            {
              dataName: "监理单位",
              dataValue: "4",
            },
            {
              dataName: "第三方服务机构",
              dataValue: "5",
            },
            {
              dataName: "业务单位",
              dataValue: "6",
            },
            {
              dataName: "设计单位",
              dataValue: "7",
            },
            {
              dataName: "云服务商",
              dataValue: "8",
            },
          ],
        },
        rules: {},
      },
      table: {
        data: [], // 表格数据
        config: {
          fixed: "right",
          operationWidth: 250,
          // selection: true, // 是否显示复选框
          // multiple: true,
          // rowKey: "", // 操作列的宽度，不传默认180
          // title: "", // 表格标题
          header: [
            // 表格列配置
            {
              name: "流程ID",
              prop: "id",
              width: 220,
            },
            {
              name: "流程KEY",
              prop: "key",
              width: 220,
            },
            {
              name: "流程名称",
              prop: "name",
              width: 150,
            },
            {
              name: "版本",
              prop: "version",
            },
            {
              name: "流程描述",
              prop: "description",
              width: 250,
            },
            {
              name: "所属分类",
              prop: "category",
              width: 220,
            },
            {
              name: "部署时间",
              prop: "deploymentTime",
              width: 220,
            },
            {
              name: "流程定义",
              prop: "resourceName",
              cellSlot: true,
              width: 250,
            },
            {
              name: "流程图",
              prop: "diagramResourceName",
              cellSlot: true,
              width: 250,
            },
            {
              name: "流程定义状态",
              prop: "suspendState",
              haveHTML: true,
              width: 120,
            },
          ],
          outerBtn: [
            {
              name: "新增", // 按钮中文名称
              method: "add", // 按钮点击执行的函数，需要在本页methods定义add方法
              icon: "el-icon-circle-plus-outline", // 按钮图标
              type: "primary", // 按钮风格
            },
          ],
          innerBtn: [
            // 表格内部操作按钮，不需要操作列的innerBtn 写成false
            {
              name: "挂起", // 按钮名称，优先显示icon
              method: "hangHandle", // 点击执行该页面methods中对应的方法
              className: "font-size-20",
              field: "suspendState",
              value: [2],
            },
            {
              name: "激活",
              method: "startHandle",
              className: "font-size-20",
              field: "suspendState",
              value: [1],
            },
            {
              name: "转模型",
              method: "toModel",
              className: "font-size-20",
            },
            {
              name: "删除",
              method: "delete",
              className: "font-size-20",
            },
          ],
        },
        page: {
          // 分页配置
          total: 12, //总条数
          pages: 1, //总页数
          pageSize: 5, //每页展示多少个
          pageNum: 1, //当前页
        },
      },
      dialog: {
        dialogVisible: false,
        width: "",
        title: "",
        type: "",
        buid: "",
      },
      search: {
        textMaxNum: 8, // label 最多几个字默认4个
        showExpand: false, // 是否显示展开收起，默认超过三个显示
        minNum: 3, // 收起显示几个, 默认3个
        config: [
          {
            type: "text",
            name: "流程KEY",
            placeholder: "请输入流程KEY",
            bind: "key", // 对应this.search.data对象的field1
          },
          {
            type: "text",
            name: "名称",
            placeholder: "请输入名称",
            bind: "name", // 对应this.search.data对象的field1
          },
          {
            type: "text",
            name: "所属分类",
            placeholder: "请输入所属分类",
            bind: "category", // 对应this.search.data对象的field1
          },
        ],

        form: {
          projectName: "",
          buName: "",
          projectCode: "",
          name:''
        },
        total: 0,
        pageNum: 0,
        pageSize: 0,
      },
    };
  },
  mounted() {
    this.getProjectList();
  },
  methods: {
    //导入模型
    UploadImage(param) {
      let fd = new FormData()
      fd.append("file", param.file);
      api_deployFlows(fd).then((res) => {
        if (res.msg.reasonPhrase == "SUCCESS" || res.msg.code == "0000") {
          console.log(res);
          if (res.msg.message == "SUCCESS") {
            this.getProjectList();
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

    // 获取项目列表
    getProjectList(page) {
      let params = {
        pageNum: this.table.page.pageNum,
        pageSize: this.table.page.pageSize,
      };

      const searchForms = this.search.form;
      Object.keys(searchForms).map((item) => {
        if (searchForms[item]) {
          params[item] = searchForms[item];
        }
      });
      if (page) {
        params.pageNum = page;
      }
      api_queryProgressList(params).then((res) => {
        //console.log(res);
        if (res.msg.message == "SUCCESS") {
          this.total = res.data.total;
          this.$set(this.table, "data", res.data.rows);
          this.$set(this.table.page, "pageNum", this.table.page.pageNum);
          this.$set(this.table.page, "pageSize", this.table.page.pageSize);
          this.$set(this.table.page, "total", res.data.total);
        }
      });
    },
    unitDetails(row) {},
    // 弹框确定
    springBox_determine(type) {
      var parameter = new Promise((resolve, reject) => {
        this.$refs["modelMgrRef"].$refs["modelMgrRefForm"].validate((valid) => {
          if (valid) {
            resolve();
          }
        });
      });
      Promise.all([parameter]).then(() => {
        // 编辑操作
        if (type == 1) {
          let data = this.form.data;
          api_editProjectInfo(data).then((res) => {
            //console.log(res);
            if (res.msg.code == "0000") {
              this.colseDialog();
              this.getProjectList();
            }
          });
        }
      });
    },
    // 弹框取消
    colseDialog() {
      this.$refs["modelMgrRef"].$refs["modelMgrRefForm"].resetFields();
      this.dialog.dialogVisible = false;
    },
    // 弹框关闭前回调
    bClose(done) {
      this.$refs["modelMgrRef"].$refs["modelMgrRefForm"].resetFields();
      done();
    },
    // 挂起
    hangHandle(row) {
      let data = {
        id: row.id,
      };
      api_hangProgress(data).then((res) => {
        //console.log(res);
        if (res.msg.code == "0000") {
          this.$message({
            message: "挂起成功",
            type: "success",
          });

          this.getProjectList();
        } else {
          this.$message.error("挂起失败");
        }
      });
    },
    // 激活
    startHandle(row) {
      let data = {
        id: row.id,
      };
      api_activateProgress(data).then((res) => {
        //console.log(res);
        if (res.msg.code == "0000") {
          this.$message({
            message: "激活成功",
            type: "success",
          });
          this.getProjectList();
        } else {
          this.$message.error("激活失败");
        }
      });
    },
    // 转模型
    toModel(row) {
      let data = {
        id: row.id,
      };
      api_progressToModel(data).then((res) => {
        //console.log(res);
        if (res.msg.code == "0000") {
          this.$message({
            message: "转模型成功",
            type: "success",
          });
          this.getProjectList();
        } else {
          this.$message.error("转模型失败");
        }
      });
    },
    // 删除
    delete(row) {
      this.$confirm("此操作将删除该流程, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let data = {
            id: row.deploymentId,
          };
          api_removeProgress(data).then((res) => {
            //console.log(res);
            if (res.msg && res.msg.code == "0000") {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.$set(this.table.page, "pageNum", 1);
              this.$set(this.table.page, "pageSize", 5);
              this.getProjectList();
            } else {
              this.$message.error("删除失败");
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
    getPageData(pageNum) {
      this.table.page.pageNum = pageNum;
      this.getProjectList();
    },
    getSizeDate(pageSize) {
      this.table.page.pageSize = pageSize;
      this.getProjectList();
    },
    eventNotify(ref) {
      this.$refs[ref].init();
    },
    formatter(key, val, row) {
      if (key === "suspendState") {
        if (row["suspendState"] == "1") {
          return "<div class='enabled round-state'>已激活</div>";
        } else if (row["suspendState"] == "2") {
          return "<div class='wait round-state'>已挂起</div>";
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.peoplel {
  /deep/ .btn {
    .upload-demo {
      .el-upload-list {
        display: none;
      }
    }
  }

  .tableData {
    padding-top: 24px;
    .table_unitName {
      font-size: 14px;
      color: rgba(0, 122, 255, 1);
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    :hover .table_unitName {
      cursor: pointer;
    }
  }
}
</style>