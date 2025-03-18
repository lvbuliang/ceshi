<template>
  <div class="total-page relative">
    <amountStandTable :amounts="amounts" ></amountStandTable>
    <!-- <Steps :defaultIndex="2"></Steps> -->
    <div class="searchPage">
      <SrSearch
        :search="search"
        :searchExpand="true"
        :showTextBtns="true"
        @queryList="pageChanged(1)"
      ></SrSearch>
    </div>
    <SrTable
      @pageChanged="pageChanged"
      :data="table.data"
      @sizeChanged="sizeChanged"
    
      :config="table.tableConfig"
      :page="table.page"
    >
      <div slot="leftBottomSlot" class="back-btn" @click="backToList">
        <i class="base-iconfont icon-return1"></i><span>返回列表</span>
      </div>
    </SrTable>
    <Dialog class="dialog" :flag="flag"></Dialog>
  </div>
</template>

<script>
import store from "@/store";
import {
  amountProjectList,
  listByTopicAndItem,
  getChengjianUnit,
  amountTotal,
} from "@/api/standTable.js";
import {queryBizunitsByProperties} from '@/api/index.js'
import amountStandTable from "@/components/amountCard";

import Dialog from "@/components/DepartmentDialog";
import Steps from "@/components/steps"

export default {
  props: {},
  components: {
    amountStandTable,
    Dialog,
    Steps,
  },
  data() {
    return {
      flag: false,
      amounts: {},
      userInfo: store.getters.userInfo,
      search: {
        size: "small",
        labelConfig: {
          labelWidth: "90px",
          labelSuffix: ":",
          labelPosition: "right",
        },
        config: [
          {
            type: "text",
            placeholder: "请输入项目名称",
            bind: "projectName", // 对应this.search.data对象的field1
          },
          // {
          //   type: "select",
          //   placeholder: "请选择项目类型",
          //   bind: "projectType",
          //   data: "xmlxList", // 对应enum中的stateList
          //   class: "selectWidthCustom",
          // },
          {
            type: "select",
            placeholder: "请选择单位",
            bind: "buid",
            data: "dwList", // 对应enum中的stateList
            class: "selectWidthCustom",
          },
        ],
        enum: {
          // 搜索项下拉数据
          xmlxList: [],
          dwList: [],
        },
        btns: [],
        formData: {
          projectName: "",
          projectType: "",
          buid: "",
        },
      },
      table: {
        data: [], // 表格数据
        tableConfig: {
          // rowClassName: this.rowClassName,
          title: "表格的标题", // 表格标题
          highlightCurrentRow: false, // 控制表格是否单选
          // maxLength: 20, // 一行最多显示多少字，超出显示popver
          load: this.load,
          tooltipEffect: "light",
          header: [
            { label: "项目名称", prop: "projectName" },
            { label: "总计划金额（万元）", prop: "totalInvesAmount" },
            // { label: "估算/概算金额（万元）", prop: "budgetInvesAmount" },
            { label: "核减金额（万元）", prop: "reduceAmount" },
            // { label: "中标金额（万元）", prop: "outbidAmount" },
            { label: "本次付款金额（万元）", prop: "currMonthAmount" },
            { label: "累计付款金额（万元）", prop: "totalPayAmount" },
          ],
          selectionConfig: {
            display: false,
            width: "70",
          },
          operateConfig: {
            display: false,
            hideHeaderSetting: true,
            hideHeaderexport: true,
          },
          innerBtn: [],
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
    
      isTableHeaderId: null,
    };
  },
  computed: {
    year() {
      return this.$route.query.year || 2021;
    },
    
  },
  created() {
    
    if (this.userInfo && this.userInfo.currentBizunit) {
        let buProperty = this.userInfo.currentBizunit.buProperty
        if (buProperty == 2) {
          // 建设单位
          this.search.config.pop()
          this.search.formData.buid = this.userInfo.currentBizunit.buid
          
        }
    }
    this.getJSDW();
    this.getProjectType();
    this.getTbData(1);
    this.getAmountTotal();
  },
  mounted() {},
  methods: {
    backToList() {
      this.routeClose();
      this.$router.push({ name: "sandTable" });
    },
    routeClose() {
      this.$SrUtils.routeClose.call(this, "subimpl", this.$setState);
    },
    getTbData() {
      // this.flag = !this.flag;
      let param = {
        pageNum: this.table.page.pageNum,
        pageSize: this.table.page.pageSize,
        year: this.year,
        ...this.search.formData,
      };

      amountProjectList(param).then((res) => {
        if (!res?.data?.records) return;

        this.table.page.pages = res.data.pages;
        this.table.page.total = res.data.total;
        this.table.data = res.data.records;
        
      });
    },
    getAmountTotal() {
      amountTotal({ year: this.year }).then((res) => {
        this.amounts = res.data;
      });
    },
    //获取项目类型
    getProjectType() {
      listByTopicAndItem({ topic: "JFZG_XMKGL_TYPE" }).then((res) => {
        if (res.msg.code == "0000") {
          let list = res.data.map((item) => {
            return {
              label: item.chName,
              value: item.itemCode,
            };
          });
          this.$set(this.search.enum, "xmlxList", list);
        }
      });
    },
    getJSDW() {
      // getChengjianUnit({ buPropertyEnum: "JSDW" }).then((res) => {
      //   let type_list = [];
      //   res.data.forEach((item) => {
      //     let emunObj = {};
      //     emunObj.label = item.buName;
      //     emunObj.value = item.buid;
      //     type_list.push(emunObj);
      //   });
      //   this.$set(this.search.enum, "dwList", type_list);
      // });
      queryBizunitsByProperties([
        { buPropertyEnum: "JSDW" },
        { buPropertyEnum: "TCDW" },
      ]).then((res) => {
        let type_list = [];
        res.data.forEach((item) => {
          let emunObj = {};
          emunObj.label = item.buName;
          emunObj.value = item.buid;
          type_list.push(emunObj);
        });
        this.$set(this.search.enum, "dwList", type_list);
      });
    },
    pageChanged(val) {
      this.table.page.pageNum = val;
      this.getTbData();
    },
    sizeChanged(val) {
      this.table.page.pageNum = 1;
      this.table.page.pageSize = val;
      this.getTbData();
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep {
  .sr_search {
    margin-top: 8px;
  }
}
.relative {
  position: relative;
  .dialog {
    top: 260px;
  }
}
.SrDialogSelect {
  ::v-deep .el-input {
    display: none;
  }
}
.searchPage {
  ::v-deep .selectWidthCustom {
    width: 153px !important;
  }
}
</style>
