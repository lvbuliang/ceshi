<template>
  <div class="peoplel">
    <FSearch :form="search" @queryList="getProjectList(1)"></FSearch>
    <div class="btn" style="margin-bottom: 16px">
      <el-button type="primary" size="small" @click="add">
        <i class="el-icon-circle-plus-outline el-icon--left"></i>新增
      </el-button>
    </div>

    <FTable
      class="tableData"
      :data="table.data"
      :config="table.config"
      :page="table.page"
      @pageChanged="getPageData"
      @sizeChanged="getSizeDate"
    >
    </FTable>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="700px"
      :append-to-body="true"
      class="common-dialog"
    >
      <FForm
        ref="modelMgrRef"
        class="modelMgrRef"
        :config="form.config"
        :form="form.data"
        :rules="form.rules"
        :enums="form.enums"
        :other-config="otherConfig"
        refForm="modelMgrRefForm"
        @eventNotify="eventNotify"
        :column="2"
      >
      </FForm>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import FTable from "@/components/FTable/index.vue";
import FForm from "@/components/FForm/form-add.vue";
import FSearch from "@/components/FSearch/index.vue";
import {
  messageTemplateList,
  addMessageTemplate,
  editMessageTemplate,
  deleteMessageTemplate,
} from "@/api/autotemplatemanagement/autotemplatemanagement.js";
import { listModule } from "@/api/index.js";
export default {
  components: {
    FTable,
    FSearch,
    FForm,
  },
  data() {
    return {
      dialogVisible: false,
      otherConfig: {
        labelNum: 150,
      },
      title: "新增消息模板",
      form: {
        config: [
          {
            col: 24, // 独占一行
            type: "text",
            name: "消息模板名称",
            placeholder: "请输入消息模板名称",
            bind: "templateName",
            trigger: "blur", // 校验时机
            required: "请输入消息模板名称", // 必填需要指定提示信息
          },
          // {
          //   col: 24, // 独占一行
          //   type: "text",
          //   name: "消息模板编号",
          //   placeholder: "请输入消息模板编号",
          //   bind: "messageTemplateCode",
          //   trigger: "blur", // 校验时机
          //   required: "请输入消息模板编号", // 必填需要指定提示信息
          // },
          {
            col: 24, // 独占一行
            type: "text",
            name: "模板编号",
            placeholder: "请输入模板编号",
            bind: "templateCode",
            trigger: "blur", // 校验时机
            required: "请输入消息模板编号", // 必填需要指定提示信息
          },
          {
            col: 24, // 独占一行
            type: "text",
            name: "内容",
            placeholder: "请输入内容",
            bind: "templateContext",
            trigger: "blur", // 校验时机
            required: "请输入内容", // 必填需要指定提示信息
          },
          {
            col: 24, // 独占一行
            type: "select",
            name: "来源",
            placeholder: "请选择来源",
            bind: "platform",
            dataList: "platformList",
            trigger: "blur", // 校验时机
            required: "请选择来源", // 必填需要指定提示信息
          },
          {
            col: 24, // 独占一行
            type: "text",
            name: "期限（天）",
            placeholder: "请输入期限",
            bind: "limitDay",
            trigger: "blur", // 校验时机
            required: "请输入期限", // 必填需要指定提示信息
          },
          {
            col: 24, // 独占一行
            type: "select",
            name: "业务编码",
            placeholder: "请选择业务编码",
            bind: "modelCode",
            dataList: "typeList",
            trigger: "blur", // 校验时机
            required: "请选择业务编码", // 必填需要指定提示信息
          },
          {
            col: 24, // 独占一行
            type: "text",
            name: "单位编码",
            placeholder: "请输入单位编码",
            bind: "buCode",
            trigger: "blur", // 校验时机
            required: "请输入单位编码", // 必填需要指定提示信息
          },
          {
            col: 24, // 独占一行
            type: "text",
            name: "接收角色",
            placeholder: "请输入接收角色",
            bind: "roleCode",
            trigger: "blur", // 校验时机
            // required: "请输入接收角色", // 必填需要指定提示信息
          },
        ],
        data: {
          buCode: "",
          limitDay: "",
          templateName: "",
          modelCode: "",
          roleCode: "",
          platform: "",
          templateCode: "",
          // messageTemplateCode: "",
          templateContext: "",
        },
        enums: {
          typeList: [],
          platformList: [
            {
              dataName: "解放智管",
              dataValue: "JFZG_CLOUD",
            },
            {
              dataName: "深圳智管",
              dataValue: "TEST_CLOUD",
            },
          ],
        },
        rules: {},
      },
      search: {
        textMaxNum: 4, // label 最多几个字默认4个
        showExpand: false, // 是否显示展开收起，默认超过三个显示
        minNum: 3, // 收起显示几个, 默认3个
        config: [
          {
            type: "text",
            name: "消息模板名称",
            placeholder: "请输入消息模板名称",
            bind: "keyWork", // 对应this.search.data对象的field1
          },
        ],

        form: {
          keyWork: "",
        },
      },
      table: {
        data: [], // 表格数据
        config: {
          fixed: "right",
          operationWidth: 150, // 操作列的宽度，不传默认180
          title: "", // 表格标题
          index: "排序",
          header: [
            // 表格列配置
            {
              name: "消息模板名称",
              prop: "templateName",
            },
            {
              name: "消息模板内容",
              prop: "templateContext",
            },
            {
              name: "创建时间",
              prop: "createTime",
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
              name: "删除", // 按钮名称，优先显示icon
              method: "delete", // 点击执行该页面methods中对应的方法
              className: "font-size-20",
            },
          ],
        },
        page: {
          // 分页配置
          total: 12, //总条数
          pages: 2, //总页数
          pageSize: 5, //每页展示多少个
          pageNum: 1, //当前页
        },
      },
      newData: "",
      rowID: "",
    };
  },
  watch: {
    $route: {
      handler(val, oldval) {
        if (val) {
          this.table.page.pageNum = 1;
          this.getProjectList(1);
        }
      },
      // 深度观察监听
      deep: true,
    },
  },
  mounted() {
    this.getMoubleCode()
    this.getProjectList(1);
  },
  methods: {
    getMoubleCode() {
      listModule().then((res) => {
        if (res.msg.code === "0000") {
          let arr = [];
          res.data.forEach((item) => {
            let obj = {};
            if (item.id) {
              obj.dataValue = item.moduleCode;
              obj.dataName = item.moduleName;
              arr.push(obj);
            }
          });
          this.form.enums.typeList = arr;
        }
      });
    },
    cancel() {
      this.dialogVisible = false;
      if (this.$refs["modelMgrRef"]) {
        this.$refs["modelMgrRef"].$refs["modelMgrRefForm"].resetFields();
      }
      Object.keys(this.form.data).map((item) => {
        this.form.data[item] = "";
      });
    },
    add() {
      this.dialogVisible = true;
      if (this.$refs["modelMgrRef"]) {
        this.$refs["modelMgrRef"].$refs["modelMgrRefForm"].resetFields();
      }

      this.rowID = "";

      Object.keys(this.form.data).map((item) => {
        this.form.data[item] = "";
      });
    },
    edit(row) {
      this.dialogVisible = true;
      this.rowID = row.templateId;
      this.$set(this.form, "data", JSON.parse(JSON.stringify(row)));
    },
    // deleteMessageTemplate
    delete(row) {
      this.$SrUtils.showConfirmMessage.call(this, {
        title: "你确定要删除这条数据吗？",
        okFun: () => {
          deleteMessageTemplate({ id: row.templateId }).then((res) => {
            if (res.msg && res.msg.code == "0000") {
              console.log(res);
              this.$message({
                message: "删除成功",
                type: "success",
              });
              this.getProjectList(1);
            }
          });
        },
        cancelFun: () => {
          return false;
        },
      });
    },
    submit() {
      this.$refs["modelMgrRef"].$refs["modelMgrRefForm"].validate((valid) => {
        if (valid) {
          this.submitData();
        }
      });
    },
    // /subplan/#/projectLibrary/projectLibraryWorkView?id=3&&temp=123123&projectCode=QWER
    submitData() {
      let obj = {
        ...this.form.data,
      };
      // editTodoLabel
      if (this.rowID) {
        obj.id = this.rowID;
        editMessageTemplate(obj).then((res) => {
          //console.log(res);
          if (res.msg.code == "0000") {
            if (this.rowID) {
              this.$message({
                type: "success",
                message: "编辑成功!",
              });
            }
            this.getProjectList(1);
            this.dialogVisible = false;
          }
        });
      } else {
        addMessageTemplate(obj).then((res) => {
          if (res.msg.code == "0000") {
            this.$message({
              type: "success",
              message: "新增成功!",
            });
            this.getProjectList(1);
            this.dialogVisible = false;
          }
        });
      }
    },
    getPageData(pageNum) {
      this.table.page.pageNum = pageNum;
      this.getProjectList();
    },
    getSizeDate(pageSize) {
      this.table.page.pageSize = pageSize;
      this.getProjectList(1);
    },
    eventNotify(ref) {
      this.$refs[ref].init();
    },
    // 获取项目列表
    getProjectList(page) {
      if (page) {
        this.table.page.pageNum = page;
      }
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

      messageTemplateList(params).then((res) => {
        console.log(res);
        if (res.msg.message == "SUCCESS") {
          this.$set(this.table, "data", res.data.records);
          this.$set(this.table.page, "total", res.data.total);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.peoplel {
  /deep/ .search {
    .el-form-item {
      .el-form-item__label {
        width: 110px !important;
      }
    }
  }
  /deep/ .page {
    margin-top: 16px !important;
  }
}
</style>
