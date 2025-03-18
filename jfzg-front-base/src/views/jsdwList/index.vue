<template>
  <div class="total-page">
    <div class="searchPage">
      <SrSearch
        :search="search"
        :searchExpand="true"
        :showTextBtns="true"
        @queryList="pageChanged(1)"
        v-if="search.config.length"
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
  </div>
</template>

<script>
import store from "@/store";
import { constructionUnitList, getChengjianUnit  } from "@/api/standTable.js";

export default {
  props: {},
  components: {},
  data() {
    return {
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
            type: "select",
            placeholder: "请选择单位",
            bind: "buid",
            data: "dwList", // 对应enum中的stateList
            class: "selectWidthCustom",
          },
        ],
        enum: {
          // 搜索项下拉数据
          dwList: [],
        },
        btns: [],
        formData: {
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
            { label: "单位", prop: "buName" },
            { label: "负责人", prop: "contactName" },
            { label: "负责人手机号", prop: "contactPhone" },
            { label: "总投资金额（万元）", prop: "totalInvesAmount" },
            { label: "项目数量（个）", prop: "projectNum" },
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
          return this.$route.query.year || '2021'
      }
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
    this.getTbData(1);
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
      let param = {
        pageNum: this.table.page.pageNum,
        pageSize: this.table.page.pageSize,
        year: this.year,
        ...this.search.formData,
      };
      // this.search.enum.designUnitsList.forEach((item) => {
      //   if (param.responsibilityName == item.value) {
      //     param.responsibilityName = item.label;
      //   }
      // });
      constructionUnitList(param).then((res) => {
        if (!res?.data?.records) return;
        this.table.page.pages = res.data.pages;
        this.table.page.total = res.data.total;
        this.table.data = res.data.records;
       
      });
    },
    getJSDW() {
      getChengjianUnit({ buPropertyEnum: "JSDW" }).then((res) => {
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
