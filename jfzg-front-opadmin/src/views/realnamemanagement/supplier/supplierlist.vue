<template>
  <div class="unitList" v-if="$route.meta.lv == 2">
    <!-- 搜索  -->
    <div class="search">
      <FSearch :form="search" @queryList="getSupplierList(1)"></FSearch>
    </div>
    <!-- 操作按钮 -->
    <div class="buttonOperation">
      <!-- <el-button type="primary" size="small" @click="add"><i class="el-icon-circle-plus-outline el-icon--left"></i>新增单位</el-button> -->
      <el-button class="exportbtn" type="primary" @click="ExportExel" size="small">
        <i class="el-icon-download el-icon--left"></i>导出excel
      </el-button>
    </div>
    <!-- 表格 -->
    <div class="table">
      <FTable
        :data="table.data"
        :config="table.config"
        :page="table.page"
        :formatter="formatter"
        @selected="onSelect"
        @pageChanged="getPageData"
        @sizeChanged="getSizeDate"
      ></FTable>
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
  api_querySupplierList, //获取供应商列表
  api_supplierAuthInfo, //供应商认证信息
  api_supplierCheckPass, //供应商审核通过
  api_supplierCheckReject, //供应商审核不通过
} from "@/api/realnameManage/realnameManage";
export default {
  components: {
    FSearch,
    FTable,
    FForm,
  },
  data() {
    return {
      search: {
        textMaxNum: 4, // label 最多几个字默认4个
        showExpand: false, // 是否显示展开收起，默认超过三个显示
        minNum: 4, // 收起显示几个, 默认3个
        config: [
          {
            type: "text",
            name: "姓名",
            placeholder: "请输入姓名",
            bind: "contact", // 对应this.search.data对象的field1
          },
          {
            type: "text",
            name: "联系方式",
            placeholder: "请输入联系方式",
            bind: "contacttel",
            // data: "stateList" // 对应enum中的stateList
          },
          {
            type: "select",
            name: "审核状态",
            placeholder: "请选择审核状态",
            bind: "status",
            data: "stateList", // 对应enum中的stateList
          },
          {
            type: "text",
            name: "单位名称",
            placeholder: "请输入单位名称",
            bind: "buName",
            // data: "stateList" // 对应enum中的stateList
          },
        ],
        form: {
          contact: "",
          contacttel: "",
          status: "",
          buName: "",
        },
        enum: {
          stateList: [
            {
              dataName: "认证中",
              dataValue: "0",
            },
            {
              dataName: "已认证",
              dataValue: "1",
            },
            {
              dataName: "未通过",
              dataValue: "-1",
            },
          ],
        },
      },
      table: {
        data: [],
        config: {
          operationWidth: 150, // 操作列的宽度，不传默认180
          title: "表格的标题", // 表格标题
             fixed: "right",
          selection: true,
          multiple: true,
          rowKey: "buid",
          header: [
            // 表格列配置
            { name: "企业名称", prop: "buName",width: 150 },
            { name: "账户", prop: "userId",width: 150  },
            { name: "申请人联系方式", prop: "contacttel", width: 200 },
            { name: "身份证号", prop: "idencode", width: 200 },
            { name: "提交时间", prop: "subimtTime",width: 200 },
            { name: "审核状态", prop: "status", haveHTML: true,width: 120 },
            { name: "审核时间", prop: "checktime", width: 200 },
            { name: "备注", prop: "result",width: 150 },
          ],
          outerBtn: [], // 外部按钮
          innerBtn: [
            {
              name: "查看审核资料",
              method: "view",
              field: "status",
              value: [0],
            },
            {
              name: "审核",
              method: "check",
              field: "status",
              value: [1,-1],
              // value: [0]
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
      dialog: {
        dialogVisible: false,
        width: "",
        title: "",
        type: "",
        buid: "",
      },
      buids: null,
    };
  },
  watch: {
    $route: {
      handler(val, oldval) {
        this.search.form = {
          contact: "",
          contacttel: "",
          status: "",
          buName: "",
        };
        this.init();
      },
      // 深度观察监听
      deep: true,
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.getSupplierList();
    },
    // 获取供应商列表
    getSupplierList(page) {
      let params = {
        page: this.table.page.pageNum,
        size: this.table.page.pageSize,
      };

      const searchForms = this.search.form;
      Object.keys(searchForms).map((item) => {
        if (searchForms[item]) {
          params[item] = searchForms[item];
        }
      });
      if (page) {
        params.page = page;
      }
      api_querySupplierList(params).then((res) => {
        //console.log(res);
        if (res.msg.message == "SUCCESS") {
          this.$set(this.table, "data", res.data.list);
          this.$set(this.table.page, "pageNum", res.data.pageNum);
          this.$set(this.table.page, "pageSize", res.data.pageSize);
          this.$set(this.table.page, "total", res.data.total);
        }
      });
    },
    // 审核
    check(row) {
      this.$router.push({
        name: "supdetailcheck",
        query: {
          buid: row.buid,
        },
      });
    },
    // 查看审核资料
    view(row) {
      this.$router.push({
        name: "supdetailview",
        query: {
          buid: row.buid,
        },
      });
    },
    // 表格多选框方法
    onSelect(row) {
      //console.log(row);
      let buids = row.map((item) => {
        return item.buid;
      });

      this.buids = buids.join(",");
      //console.log(this.buids);
    },
    //导出
    ExportExel() {
      if (this.buids) {
        window.open(
          `${config.baseUrl}/iden/unit/list/excel/part?ids=${this.buids}`
        );
      } else {
        window.open(
          `${config.baseUrl}/iden/unit/list/excel?page=${this.table.page.pageNum}&size=${this.table.page.pageSize}&contact=${this.search.form.contact}&contacttel=${this.search.form.contacttel}&status=${this.search.form.status}&buName=${this.search.form.buName}`
        );
      }
    },
    getPageData(pageNum) {
      this.table.page.pageNum = pageNum;
      this.getSupplierList();
    },
    getSizeDate(pageSize) {
      this.table.page.pageSize = pageSize;
      this.getSupplierList();
    },

    formatter(key, val, row) {
      if (key === "status") {
        if (row["status"] == 0) {
          return "<div class='wait round-state'>认证中</div>";
        } else if (row["status"] == 1) {
          return "<div class='enabled round-state'>已认证</div>";
        } else if (row["status"] == -1) {
          return "<div class='enabled round-state'>未通过</div>";
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.unitList {
  /deep/.el-table table td .cell span div {
    display: none;
  }
  /deep/ .buttonOperation {
    .el-button {
      width: 116px !important;
      height: 32px !important;
    }
  }
}
</style>