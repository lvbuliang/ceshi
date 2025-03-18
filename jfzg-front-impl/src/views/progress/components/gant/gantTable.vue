<template>
  <div class="gantTable">
    <el-table :data="table.data" style="width: 100%">
      <el-table-column type="index" label="序号" width="70" v-if="table.config.index"></el-table-column>
      <el-table-column
        v-for="(item,index) in table.config.header"
        :key="item.name+index"
        :prop="item.prop"
        :label="item.name"
        :width="item.width"
      >
        <template slot-scope="scope">
          <!-- 并不是每个都提示；超出范围提示 -->
          <div v-if="!item.maxlength">
            <span
              slot="reference"
              v-if="item.haveHTML"
              v-html="fmt(scope.row, item.prop, scope.row[item.prop])"
            ></span>
            <span v-else>{{scope.row[item.prop]}}{{item.span}}</span>
          </div>
          <el-popover
            v-else
            placement="top"
            trigger="hover"
            :content="scope.row[item.prop].toString()"
          >
            <span
              slot="reference"
              v-if="item.haveHTML"
              v-html="fmt(scope.row, item.prop, scope.row[item.prop])"
            ></span>
            <span slot="reference" v-else>{{formatTxt(scope.row[item.prop],item.maxlength)}}</span>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  props: {
    table: [Object],
    formatter: {
      type: Function,
    },
  },
  data() {
    return {};
  },
  methods: {
    formatTxt(txt, max) {
      //格式化表格字段过长
      if (txt) {
        if (txt.length <= max) {
          return txt;
        } else {
          return txt.toString().substring(0, max) + "...";
        }
      } else {
        return txt;
      }
    },
    fmt(row, key, value) {
      if (this.formatter) {
        // console.log("key", key);
        // console.log("row", row);
        // console.log("value", value);
        let v = this.formatter(key, value, row);
        if (v) {
          return v;
        }
      }

      return value;
    },
  },
  created() {},
};
</script>
<style lang="scss" scoped>
.gantTable {
  overflow-x: scroll !important;
  width: 500px;
  -ms-overflow-style: auto;
  .el-table th > .cell {
    padding: 0 !important;
  }
}
</style>
<style lang="scss">
.gantTable {
  .el-table__header-wrapper {
    height: 54px !important;
  }
  .el-table th > .cell {
    color: #333;
  }
  .el-table .cell {
    padding: 0;
    text-align: center;
  }
  .el-table__body-wrapper {
    border-top: 6px solid #fff;
    border-bottom: 0;
  }
  .el-table__header-wrapper th {
    height: 54px !important;
    border-bottom: 1px solid #c5dcf1;
    background: #fafafa;
  }
}
</style>