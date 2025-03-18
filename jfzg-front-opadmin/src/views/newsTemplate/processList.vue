<template>
  <div class="unitList">
   
    <!-- 表格 -->
    <div class="table">
       <FSearch :form="search" @queryList="getUnitList(1)"></FSearch>
      <FTable
        class="tableData"
        :data="table.data"
        :config="table.config"
        :page="table.page"
        @pageChanged="getPageData"
        @sizeChanged="getSizeDate"
      >
        <div slot="cellSlot" slot-scope="scope">
          <div v-if="scope.scope.row.status == 0">{{ "是" }}</div>
          <div v-if="scope.scope.row.status == 1">{{ "否" }}</div>
        </div>
      </FTable>
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
        <div slot="footer" class="dialog-footer" style="text-align: center">
          <el-button
            type="primary"
            size="small"
            style="width: 80px; height: 32px"
            @click="springBox_determine(dialog.type)"
            >确定</el-button
          >
          <el-button
            type
            size="small"
            style="width: 80px; height: 32px"
            @click="colseDialog"
            >取消</el-button
          >
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import FTable from "@/components/FTable/index.vue";
import FSearch from "@/components/FSearch/index.vue";
import FForm from "@/components/FForm/form-add";
import config from "@/settings.js";
import {
  api_getFileList,
  api_addOrSave,
  api_getDetail,
} from "@/api/newsTemplate/processList.js";
import upload from "@/utils/upload";
export default {
  components: {
    FTable,
    FSearch,
    FForm,
  },
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
      search: {
        textMaxNum: 4, // label 最多几个字默认4个
        showExpand: false, // 是否显示展开收起，默认超过三个显示
        minNum: 3, // 收起显示几个, 默认3个
        config: [
          {
            type: "text",
            name: "关键字",
            placeholder: "请输入文件名称",
            bind: "fileName", // 对应this.search.data对象的field1
          },
        ],

        form: {
          fileName: "",
        },
      },
      table: {
        data: [],
        config: {
          fixed: "right",
          operationWidth: 180, // 操作列的宽度，不传默认180
          title: "表格的标题", // 表格标题
          index: "序号", // 是否显示序号
          selection: false,
          multiple: true,
          // rowKey: "buid",
          header: [
            // 表格列配置
            { name: "文件名称", prop: "fileName", width: 180 },
            { name: "业务模块", prop: "model", width: 180 },
            { name: "说明", prop: "remark" },
            { name: "是否启用", prop: "status", cellSlot: true, width: 120 },
            { name: "附件个数", prop: "fileNum" },
            { name: "创建时间", prop: "createTime" },
          ],
          outerBtn: [], // 外部按钮
          innerBtn: [
            {
              name: "编辑",
              method: "edit",
              field: "id",
            },
            {
              name: "启用",
              method: "start",
              // field: "id",
              className: "font-size-20",
              validate: this.btnValidate,
            },
            {
              name: "停用",
              method: "start",
              className: "font-size-20",
              validate: this.btnValidate,
            },
          ],
        },
        page: {
          // 分页配置
          total: 0, //总条数
          pages: "", //总页数
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
      form: {
        title: "新增交付物模板",
        config: [
          {
            col: 24,
            type: "text",
            name: "文件名称",
            // placeholder: "请输入名称",
            bind: "fileName",
            disabled: true,
            trigger: "blur", // 校验时机
            required: "请输入文件名称", // 必填需要指定提示信息
          },
          {
            col: 24,
            type: "text",
            name: "业务模块",
            placeholder: "请输入业务模块",
            bind: "model",
            disabled: true,
            // required: "请输入业务模块", // 必填需要指定提示信息
          },
          {
            col: 24,
            type: "text",
            name: "说明",
            placeholder: "请输入说明",
            bind: "remark",
          },
          {
            col: 16,
            type: "select",
            name: "是否启用",
            // placeholder: "请输入说明",
            bind: "status",
            dataList: "statusList", // 定义在this.form.enums中的typeList
          },
          {
            type: "bigUpload",
            name: "文件",
            fileList: [],
            bind: "file",
            col: 24,
            limit: 10, // 上传数量
            fileTip:
              "温馨提示：支持扩展名为 doc/docx/xls/xlsx/ppt/pptx/pdf/txt/jpg/jpeg/jpe/png/rar/zip 大小不超过500M", //提示
            fileType:
              "doc,docx,xls,xlsx,ppt,pptx,pdf,txt,jpg,jpeg,jpe,png,rar,zip", //校验
          },
        ],
        data: {
          fileName: "",
          model: "",
          remark: "",
          status: "",
          file: [],
        },
        enums: {
          statusList: [
            {
              dataName: "启用",
              dataValue: 0,
            },
            {
              dataName: "停用",
              dataValue: 1,
            },
          ],
        },
        rules: {},
      },
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.getUnitList();
    },

    // 获取业务文件列表
    async getUnitList(page) {
      let data = {
        pageSize: this.table.page.pageSize,
        pageNum: this.table.page.pageNum,
      };
      if (page) {
        data.pageNum = page;
        const searchForms = this.search.form;
        Object.keys(searchForms).map(item => {
          if (searchForms[item]) {
            data[item] = searchForms[item];
          }
        });
      }
      let res = await api_getFileList(data);
      if (res.msg.code == "0000") {
        res.data.records.forEach((item) => {
          if (!item.fileNum) {
            item.fileNum = "0";
          }
        });
        this.$set(this.table, "data", res.data.records);
        this.$set(this.table.page, "pages", res.data.pages);
        this.$set(this.table.page, "pageSize", res.data.size);
        this.$set(this.table.page, "total", res.data.total);
      }
    },

    // 编辑
    edit(row, data) {
      api_getDetail({ id: row.id }).then((res) => {
        console.log(res);
        if (res.msg.code == "0000") {
          this.form.data = res.data;
          this.form.data.file = JSON.parse(res.data.file);
        }
      });

      this.dialog = {
        dialogVisible: true,
        width: "700px",
        title: "新增业务文件模板",
        type: 0,
      };
    },

    // 启用停用
    start(row) {
      if (row.status == 0) {
        // 启用状态
        let params = {
          id: row.id,
          status: 1,
        };

        api_addOrSave(params).then((res) => {
          console.log(res);
          if (res.msg.code == "0000") {
            this.$message({
              type: "success",
              message: "停用成功!",
            });
            this.init();
          }
        });
      }
      if (row.status == 1) {
        // 停用状态
        let params = {
          id: row.id,
          status: 0,
        };

        api_addOrSave(params).then((res) => {
          console.log(res);
          if (res.msg.code == "0000") {
            this.$message({
              type: "success",
              message: "启用成功!",
            });
            this.init();
          }
        });
      }
    },

    // 按钮校验
    btnValidate(item, row) {
      if (item.name == "启用" && row.status == 1) {
        return true;
      }
      if (item.name == "停用" && row.status == 0) {
        return true;
      }
      return false;
    },

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
        let params = this.form.data;
        params.fileNum = this.form.data.file.length;
        params.file = JSON.stringify(params.file);
        api_addOrSave(params).then((res) => {
          console.log(res);
          if (res.msg.code == "0000") {
            this.$message({
              type: "success",
              message: "编辑成功!",
            });
            this.colseDialog();
            this.init();
          }
        });
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
    getPageData(pageNum) {
      this.table.page.pageNum = pageNum;
      this.getUnitList();
    },
    getSizeDate(pageSize) {
      this.table.page.pageSize = pageSize;
      this.getUnitList();
    },
    eventNotify(ref) {
      this.$refs[ref].init();
    },
  },
};
</script>
