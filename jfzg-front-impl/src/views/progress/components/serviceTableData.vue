<template>
  <div class="service serviceTable_class" v-if="serviceFirstList.length>0">
    <el-table
      :data="table"
      style="width: 100%;"
      max-height="375px"
      :cell-style="cellStyle"
      :header-cell-style="getRowClass"
    >
      <el-table-column
        prop="projectName"
        label="项目名称"
        fixed
        class="jsdw_table"
        width="180px"
        :show-overflow-tooltip="true"
        align="left"
      ></el-table-column>
      <el-table-column
        v-for="(item,index) in serviceFirstList"
        :key="index"
        :label="item.dataName"
        align="center"
      >
        <el-table-column
          v-for="(item1,i) in item.list"
          :key="i"
          :label="item1.name"
          width="140px"
          :prop="item1.id.toString()"
          align="center"
        >
          <template class="123qew" slot-scope="scope" v-if="scope.row[item1.id]">
            <img class="icon_is_current" src="../assets/components/icon_is_current.png" />
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>

    <pagination
      :page="tableparams.pages"
      class="rg"
      style="margin-top:10px"
      @currentChange="currentChange"
      @sizeChange="handleSizeChange"
    ></pagination>
    <div class="title">
      <img class="tips" src="../assets/components/tips.png" />
      <div class="title_tip">
        当前共
        <span class="num_1">{{tableparams.pages.total}}</span>个项目，
        <span class="num_1">{{serviceNumber}}</span>种服务能力
      </div>
    </div>
  </div>
</template>
<script>
import FTable from "@/components/FTable";
import pagination from "@/components/FPagination/pagination1";

import {
  api_statistics,
  api_serviceListHead,
  api_getnewdata,
} from "@/api/diaodu/service";
import { queryDict } from "@/api/user";
export default {
  components: {
    FTable,
    pagination,
  },
  data() {
    return {
      tableparams: {
        pageNum: 1,
        pageSize: 5,
        pages: {
          pageNum: 1,
          pageSize: 5,
          pages: 1,
          num: 6,
          total: 1,
          pageSizes: [5, 10, 15],
          laylout: "prev, pager, next", //简单功能
        },
      },
      serviceNumber: 0,
      lastIdList: "",
      tableData: [],
      serviceFirstList: [],
      serviceSecondList: [],
      topicList: [],
      table: [],
    };
  },
  created() {
    this.queryDictList();
  },
  mounted() {
    // this.getTableData()
    this.api_getnewdata();
  },
  methods: {
    /**切换 */
    currentChange(data) {
      this.tableparams.pageNum = data;
      this.api_getnewdata();
    },
    /**改变页数 */
    handleSizeChange(val) {
      this.tableparams.pageNum = 1;
      this.tableparams.pageSize = val;
      this.api_getnewdata();
    },
    // 获取一级表头
    queryDictList() {
      api_serviceListHead().then((res) => {
        if (res.msg.code == "0000") {
          var lastIdList = "";
          res.data.map((item) => {
            if (item.tags.length > 0) {
              let obj = {
                dataValue: item.id,
                dataName: item.name,
                list: item.tags,
              };
              if (item.tags && item.tags.length > 0) {
                lastIdList += "," + item.tags[item.tags.length - 1].id;
                this.serviceNumber += item.tags.length;
              }

              this.serviceFirstList.push(obj);
            }
          });
          this.$set(this, "lastIdList", lastIdList);
        }
      });
    },
    api_getnewdata() {
      var param = {
        pageNum: this.tableparams.pageNum,
        pageSize: this.tableparams.pageSize,
      };
      api_getnewdata(param).then((res) => {
        if (res.msg.code == "0000") {
          this.tableparams.pages = {
            pageNum: this.tableparams.pageNum,
            pageSize: this.tableparams.pageSize,
            pages: res.data.pages,
            num: 5,
            total: res.data.total,
            pageSizes: [5, 10, 15],
            laylout: "prev, pager, next",
          };
          var data = [];
          res.data.records.map((item) => {
            let obj = {
              projectName: item.projectName,
            };
            item.codes.map((child) => {
              obj[child] = 1;
            });
            data.push(obj);
          });
          if (data.length < 5) {
            var datalength = Number(data.length);
            for (var i = 0; i < 5 - datalength; i++) {
              data.push({});
            }
          }
          this.$set(this, "table", data);
        }
      });
    },
    getSummaries(row, columns) {},

    tbFormat() {},
    cellStyle(row, column, rowIndex, columnIndex) {
      if (row.column.label == "总计") {
        return "color: #007AFF";
      }
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 1 && this.lastIdList.indexOf(column.property) > -1) {
        return "border-right:1px solid #D6E4EE";
      } else {
        return "";
      }
    },
  },
};
</script>

<style lang="scss" >
.service .el-tooltip__popper,
.el-tooltip__popper.is-dark {
  background: #ffffff !important;
  color: #303133 !important;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1) !important;
}
.zjtcBox1 .inner {
  padding-top: 55px !important;
  height: 456px;
}
.serviceTable_class .rg .pageBox {
  padding: 0px;
  display: inline-block;
  float: right;
  margin-right: 20px;
}
.serviceTable_class {
  .tips {
    height: 14px;
    width: 14px;
    position: relative;
    top: 2px;
  }
  .title_tip {
    margin-left: 8px;
    display: inline-block;
    font-size: 12px;
    font-weight: 400;
    color: #666666;
    .num_1 {
      font-size: 13px;
      font-weight: 700;
      color: #333333;
    }
  }
}
/*.serviceTable_class{
  height: 385px;
  overflow: scroll;
}*/
</style>
<style lang="scss" scoped>
.icon_is_current {
  height: 22px;
  width: 22px;
}
::v-deep .el-table .cell.el-tooltip {
  padding-left: 15px !important;
}
::v-deep .el-table thead.is-group th {
  background: #fbfdff;
  color: #333333;
  height: 36px;
  border-top: 1px solid #d6e4ee;
  padding-bottom: 12px;
  padding-top: 0px;
}
::v-deep.el-table th > .cell {
  color: #333333;
  height: 20px;
  font-size: 13px;
  font-weight: 400;
}

::v-deep .el-table tr:first-child th .cell {
  min-width: 92px;
  width: 34%;
  height: 26px;
  background: rgba(0, 122, 255, 0.1);
  border-radius: 0px 0px 4px 4px;
  position: relative;
  font-size: 12px;
  font-weight: 700;
  line-height: 26px;
  color: #007aff;
  /*top: -12px;*/
}

::v-deep .el-table tr:nth-child(1) th {
  /*   border-top: 0;
    border-right: 0px;*/
  border-left: 0px;
}
::v-deep .el-table tr:nth-child(1) th:nth-child(1) {
  /*   border-top: 0;
    border-right: 0px;*/
  /*border-right: 1px solid #D6E4EE;*/
}
::v-deep .el-table tr:nth-child(2) th {
  border-top: 0;
  border-right: 0px;
  border-left: 0px;
  border-bottom: 1px solid #d6e4ee;
}
::v-deep .el-table tr:first-child th:first-child .cell {
  position: relative;
  top: 22px;
  left: 5px;
  background: transparent;
  font-size: 14px;
  color: #333333;
  font-weight: 700;
}

::v-deep .el-table__fixed {
  font-weight: 500;
  color: #333333;
  box-shadow: 0 0 10px #d6e4ee;
  border-left: 1px solid #d6e4ee;
  width: 175px !important;
}

::v-deep .el-table__fixed-body-wrapper {
  font-weight: 500;
  color: #333333;
}
::v-deep.el-table--striped .el-table__body tr.el-table__row--striped td {
  background: #ecf2fc;
}
::v-deep .el-table__body-wrapper::-webkit-scrollbar-thumb {
  background-color: #5e94b8;
  border-radius: 3px;
}
::v-deep .el-table__body-wrapper::-webkit-scrollbar {
  background: #d1e1ec;
}
::v-deep .el-table--border th {
  border-right: 1px solid #d6e4ee;
  border-left: 1px solid #d6e4ee;
}
::v-deep .el-table--border td {
  border-right: 1px dashed #d6e4ee;
  /*border-left: 1px dashed #D6E4EE;*/
}
::v-deep .el-table th.is-leaf {
  border-bottom: 1px solid #d6e4ee;
}

::v-deep .el-table td {
  border-bottom: 1px dashed #d6e4ee;
  /*border-top: 1px dashed  #D6E4EE;*/
  color: #333333;
  font-weight: 700;
  height: 52px;
}
</style>