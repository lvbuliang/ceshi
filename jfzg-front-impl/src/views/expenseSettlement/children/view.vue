<template>
  <div class="total-page">
    <!-- <sr-nav-page :project="srNavPageObj" :type="2"></sr-nav-page> -->
    <TestFormView
      :editableTabs="[]"
      :slotList="['专家费用']"
      activeNameT="专家费用"
    >
      <div slot="专家费用">
        <BorderLine :title="'专家费用逐月明细'" :isLine="true">
          <div class="search-wrap">
            <el-date-picker
              v-model="value1"
              type="month"
              placeholder="请选择评审活动时间"
              format="yyyy-MM"
              value-format="yyyy-MM"
              @change="dateChange"
            >
            </el-date-picker>
            <el-button
              icon="el-icon-search"
              size="small"
              type="primary"
              name="搜索"
              circle
              style="margin-left: 10px"
              @click="handleSearh"
            ></el-button>
            <el-button
              icon="el-icon-refresh"
              size="small"
              class="resetBtn"
              name="重置"
              circle
              @click="resetData()"
            ></el-button>
          </div>

          <el-table
            style="width: 100%"
            :data="getValues"
            :show-header="false"
            :cell-style="cellStyle"
            :header-cell-style="{ background: '#f7f7f7', color: '#333' }"
            border
            class="sr_table table-top"
            :row-class-name="tableRowClassName"
          >
            <el-table-column
              v-for="(item, index) in getHeaders"
              :key="index"
              :prop="item"
              :width="columnWidth(item, index)"
            >
            </el-table-column>
          </el-table>
        </BorderLine>
        <BorderLine :title="'专家费用结算详情'" :isLine="true">
          <SrTable
            @pageChanged="pageChanged"
            :data="table.data"
            @sizeChanged="sizeChanged"
            :config="table.tableConfig"
            :page="table.page"
            align="left"
          ></SrTable>
        </BorderLine>
      </div>
    </TestFormView>
    <sr-work-flow
      ref="work_flow"
      :hideFrom="true"
      :buttonList="buttonList"
      :clickMethods="clickmethods"
      backName="expenseSettlement"
    ></sr-work-flow>
  </div>
</template>
  
<script>
import BorderLine from "@/components/borderLine";
import TestFormView from "@/components/srFormView";
import {
  queryYearMonthListApi,
  queryDetail,
} from "@/api/expenseSettlement/index.js";
export default {
  components: { BorderLine, TestFormView },
  computed: {
    templateId() {
      return this.$route.query.templateId;
    },
    getHeaders() {
      return this.tableData.reduce(
        (pre, cur, index) => pre.concat(`value${index}`),
        ["title"]
      );
    },
    getValues() {
      return this.headers.map((item) => {
        return this.tableData.reduce(
          (pre, cur, index) =>
            Object.assign(pre, { ["value" + index]: cur[item.prop] }),
          { title: item.label }
        );
      });
    },
  },
  provide() {
    return {
      baseUrl: "",
      imgBaseUrl: "",
      uploadRequest: "",
      uploadBaseUrl: "",
    };
  },
  data() {
    return {
      editableTabs: [],
      activeName: "0",
      srNavPageObj: {},
      fromData: {},
      buttonList: [
        {
          role: "",
          btns: [],
          nodes: [],
        },
      ],
      table: {
        data: [], // 表格数据
        tableConfig: {
          rowClassName: this.rowClassName,
          title: "表格的标题", // 表格标题
          highlightCurrentRow: false, // 控制表格是否单选
          // maxLength: 20, // 一行最多显示多少字，超出显示popver
          load: this.load,
          tooltipEffect: "light",
          header: [
            {
              index: 1,
              label: "评审活动名称",
              prop: "reviewActivitiesName",
            },
            {
              index: 2,
              label: "活动类型",
              prop: "reviewActivitiesType",
            },
            {
              index: 3,
              label: "次数",
              prop: "reviewTimes",
            },
            {
              index: 4,
              label: "会议时长",
              prop: "meetingLength",
            },
            {
              index: 5,
              label: "会议开始时间",
              prop: "startTime",
            },
            {
              index: 6,
              label: "评审项目",
              prop: "projectNames",
            },
            {
              index: 7,
              label: "评审项目规模（万）",
              prop: "projectPriceTotal",
            },
            {
              index: 8,
              label: "劳务费计算比例",
              prop: "feePercentage",
            },
            {
              index: 9,
              label: "税后劳务费（元）",
              prop: "fee",
            },
          ],
          selectionConfig: {
            display: false,
            width: "70",
          },
          operateConfig: {
            display: false,
            label: "操作",
            width: "170",
            fixed: "right",
            allTableHeader: "",
            saveHeaderList: this.saveHeaderList,
            export: this.export,
            exportPermissionCode: "M005_001_004",
          },
          indexConfig: {
            display: true,
            label: "序号",
            width: "50",
          },
          innerBtn: [],
        },
        page: {
          // 分页配置
          total: 100, //总条数
          pages: 10, //总页数
          pageSize: 10, //每页展示多少个
          pageSizes: [10, 20, 30],
          pageNum: 1, //当前页
          background: true,
          // layout: 'total, prev, pager, next, sizes,jumper'
        },
      },
      headers: [
        {
          prop: "date",
          label: "费用项",
        },
        {
          prop: "feeWithoutTax",
          label: "税后劳务费（元）",
        },
        {
          prop: "feeWithTax",
          label: "税前劳务费（元）",
        },
        {
          prop: "tax",
          label: "税额（元）",
        },
      ],
      tableData: [],
      value1: "",
    };
  },

  methods: {
    // 评审时间change事件
    dateChange(val) {
      console.log("val", val);
      if (val) {
        this.queryDetailList();
        this.queryYearMonthList();
      }
    },
    tableRowClassName({ row, rowIndex }) {
      console.log("row", row, rowIndex);
      if (row.title == "费用项") {
        return "default-row";
      }
      return "";
    },
    // 重置
    resetData() {
      this.value1 = "";
      this.queryDetailList();
      this.queryYearMonthList();
    },
    handleSearh() {
      this.queryDetailList();
      this.queryYearMonthList();
    },
    // 表头width
    columnWidth(item, index) {
      // 根据列index返回不同的列宽度
      if (index == 0) {
        return "140px"; // 设置特定列的宽度
      }
    },
    // 第一列样式
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return "text-align: left;";
      }
    },
    // 查询专家费用详细
    queryDetailList() {
      console.log("有", this.value1);
      const year = this.value1 ? this.value1.split("-")[0] : null;
      const month = this.value1 ? this.value1.split("-")[1] : null;
      let params = {
        expertId: this.$route.query.id,
        month: month,
        year: year,
        pageNum: this.table.page.pageNum,
        pageSize: this.table.page.pageSize,
      };
      queryDetail(params).then((res) => {
        console.log("查询专家费用", res);
        this.table.data = res.data.records.filter((item) => item);
        // this.table.page.total = this.table2.data.length;
        this.table.page.pages = res.data.pages;
        this.table.page.total = res.data.total;
        this.table.data.forEach((item2) => {
          item2.meetingLength =
            item2.meetingLength == "0"
              ? "4小时以下"
              : item2.meetingLength == "1"
              ? "4小时以上"
              : "";
          item2.reviewActivitiesType =
            item2.reviewActivitiesType == "0"
              ? "函评"
              : item2.reviewActivitiesType == "1"
              ? "现场评审"
              : "";
          item2.feePercentage = item2.feePercentage
            ? item2.feePercentage + "%"
            : "";
        });
        console.log(this.table.data);
      });
    },
    queryYearMonthList() {
      let params = {
        expertId: this.$route.query.id,
      };
      queryYearMonthListApi(params).then((res) => {
        console.log(res);
        this.tableData = res.data;
        console.log("sj", this.tableData);
        this.tableData.forEach((item) => {
          console.log("每项", item);
          item.date = `${item.year}年${item.month}月`;
        });
        if (this.tableData.length > 0 && this.value1) {
          const year = this.value1 ? this.value1.split("-")[0] : null;
          const month = this.value1 ? this.value1.split("-")[1] : null;
          this.tableData.map((item2) => {
            if (item2.year == year && item2.month == month) {
              this.tableData.unshift(item2);
            }
          });
        }
      });
    },
    load(tree, treeNode, resolve) {
      setTimeout(() => {
        resolve([
          {
            date: "2016-05-02",
            tax: 50,
            feeWithTax: 150,
            feeWithoutTax: 100,
            year: 2023,
            month: 6,
          },
        ]);
      }, 1000);
    },
    pageChanged(val) {
      this.table.page.pageNum = val;
      this.queryDetailList();
    },
    sizeChanged(val) {
      this.table.page.pageNum = 1;
      this.table.page.pageSize = val;
      this.queryDetailList();
    },
  },

  created() {},
  mounted() {
    this.queryYearMonthList();
    this.queryDetailList();
  },
  beforeRouteLeave(to, form, next) {
    if (this.$refs.work_flow) {
      this.$refs.work_flow.$el.style.display = "none";
    }
    next();
  },
};
</script>
<style lang="scss" scoped>
.search-wrap {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
}
.table-top {
  border-radius: 8px;
}
::v-deep .default-row {
  height: 54px;
  background: #f7f7f7 !important;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: bold;
  padding: 9px 10px !important;
  line-height: 35px !important;
}
</style>