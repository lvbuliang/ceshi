
<template>
  <div class="unitList" v-if="$route.meta.lv == 2">
    <!-- 搜索  -->
    <div class="search">
      <FSearch :form="search" @queryList="getUnitList(1)"></FSearch>
    </div>
    <!-- 操作按钮 -->
    <div class="buttonOperation">
      <!-- <el-button type="primary" size="small" @click="add"><i class="el-icon-circle-plus-outline el-icon--left"></i>新增单位</el-button> -->
      <el-button class="exportbtnFour" type="primary" @click="add">
        <i class="el-icon-circle-plus-outline el-icon--left"></i>创建新模型
      </el-button>
    </div>
    <!-- 表格 -->
    <div class="table">
      <FTable
        class="tableData"
        :data="table.data"
        :config="table.config"
        :page="table.page"
        @pageChanged="getPageData"
        @sizeChanged="getSizeDate"
      >
        <!-- <div slot="cellSlot" slot-scope="scope">
                    <div v-if="scope.scope.row.isCheck == 0">{{'否'}}</div>
                    <div v-if="scope.scope.row.isCheck == 1">{{ '是'  }}</div>
        </div>-->
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
  <router-view v-else></router-view>
</template>

<script>
import FSearch from "@/components/FSearch/index.vue";
import FTable from "@/components/FTable/index.vue";
import FForm from "@/components/FForm/form-add";
import config from "@/settings.js";
import {
  api_flowList,
  api_addFlowList,
  api_exportFlowList,
  api_deployFlowList,
  api_removeFlowList,
} from "@/api/work/work";
export default {
  components: {
    FSearch,
    FTable,
    FForm,
  },
  data() {
    return {
      search: {
        textMaxNum: 5, // label 最多几个字默认4个
        showExpand: false, // 是否显示展开收起，默认超过三个显示
        minNum: 4, // 收起显示几个, 默认3个
        config: [
          {
            type: "text",
            name: "key",
            placeholder: "请输入key",
            bind: "key", // 对应this.search.data对象的field1
          },
          {
            type: "text",
            name: "名称",
            placeholder: "请输入名称",
            bind: "name",
          },
        ],
        form: {
          name: "",
          key: "",
        },
        enum: {},
      },
      table: {
        data: [],
        config: {
          fixed: "right",
          operationWidth: 280, // 操作列的宽度，不传默认180
          title: "表格的标题", // 表格标题
          index: "序号", // 是否显示序号
          selection: false,
          multiple: true,
          // rowKey: "buid",
          header: [
            // 表格列配置
            { name: "id", prop: "id", width: 110 },
            { name: "key", prop: "key", width: 100 },
            { name: "名称", prop: "name", width: 150 },
            { name: "版本", prop: "version", width: 120 },
            { name: "创建时间", prop: "createTime", width: 200 },
            { name: "最后更新时间", prop: "lastUpdateTime", width: 200 },
            { name: "元数据", prop: "metaInfo", haveHTML: true, width: 330 },
          ],
          outerBtn: [], // 外部按钮
          innerBtn: [
            {
              name: "编辑",
              method: "edit",
              field: "id",
            },
            {
              name: "删除",
              method: "delate",
              field: "id",
            },
            {
              name: "部署",
              method: "deploy",
              field: "id",
            },
            {
              name: "导出",
              method: "export",
              field: "id",
            },
            {
              name: "配置",
              method: "repair",
              field: "id",
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
        title: "添加流程模型",
        config: [
          {
            col: 24,
            type: "text",
            name: "名称",
            placeholder: "请输入名称",
            bind: "name",
            trigger: "blur", // 校验时机
            required: "请输入名称", // 必填需要指定提示信息
          },
          {
            col: 24,
            type: "text",
            name: "key",
            placeholder: "请输入key",
            bind: "key",
            required: "请输入key", // 必填需要指定提示信息
          },
          {
            col: 24,
            type: "textarea",
            name: "描述",

            placeholder: "请输入描述",
            bind: "description",
          },
        ],
        data: {
          name: "",
          key: "",
          description: "",
        },
        enums: {},
        rules: {},
      },
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    // 配置
    repair(row) {
      this.$router.push({
        name: "config",
        query: {
          id: row.id,
        },
      });
    },
    init() {
      this.getUnitList();
    },
    export(row) {
      window.open(
        `${config.baseUrl}/jfzg/opcenter/activiti/modeler/export?id=${row.id}`
      );
    },
    deploy(row) {
      let data = { id: row.id };
      api_deployFlowList(data).then((res) => {
        if (res.msg.code == "0000") {
          this.$message({
            type: "success",
            message: "部署成功!",
          });
          this.getUnitList();
        }
      });
    },
    delate(row) {
      this.$confirm(
        "此操作将永久删除该数据, 是否继续?",
        "确认要删除此条数据吗？",
        {
          showClose: false,
          showCancelButton: true, // 是否显示取消按钮
          showConfirmButton: true, // 是否显示确认按钮
          confirmButtonText: "确定", // 确定按钮名字
          cancelButtonText: "取消", // 取消按钮名字
          customClass: "biaozhunhua_confirm changsha_confirm_success", //  类名必传支持三种样式
          type: "warning",
        }
      )
        .then(() => {
          let params = {
            id: row.id,
          };
          api_removeFlowList(params).then((res) => {
            if (res.msg.code == "0000") {
              this.getUnitList();
            }
          });
        })
        .catch(() => {});
    },
    // 获取单位管理列表
    async getUnitList(page) {
      let params = {
        pageSize: this.table.page.pageSize,
        pageNum: this.table.page.pageNum,
      };
      if (page) {
        params.pageNum = page;
        const searchForms = this.search.form;
        Object.keys(searchForms).map((item) => {
          if (searchForms[item]) {
            params[item] = searchForms[item];
          }
        });
      }
      let res = await api_flowList(params);
      if (res.msg.code == "0000") {
        res.data.rows = res.data.rows.map((item) => ({
          ...item,
          lastUpdateTime:item.lastUpdateTime.substring(0,10) + ' ' +item.lastUpdateTime.substring(11,19),
          createTime:item.createTime.substring(0,10) + ' ' +item.createTime.substring(11,19),
          mateInfo: item.persistentState.mateInfo,
        }));
        this.$set(this.table, "data", res.data.rows);
        // this.$set(this.table.page, "pageNum", res.data.pageNum);
        // this.$set(this.table.page, "pageSize", res.data.pageSize);
        this.$set(this.table.page, "total", res.data.total);
      }
    },
    // 新增单位
    add() {
      for (let key in this.form.data) {
        if (key == "templFileId") {
          this.form.data[key] = [];
        } else {
          this.form.data[key] = "";
        }
      }
      this.dialog = {
        dialogVisible: true,
        width: "700px",
        title: "新增流程模型",
        type: 0,
      };
    },
    // 编辑
    edit(row) {
      window.open(
        `${config.baseUrl}/opadmin/modeler/modeler.html?modelId=${row.id}`
      );
      // this.$router.push('/work/workEdit?id=' + row.id)
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
        api_addFlowList(params).then((res) => {
          console.log(res);
          if (res.msg.code == "0000") {
            this.colseDialog();
            this.getUnitList();
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