<template>
  <el-table
    :data="riskAndProblemsTable"
    size="mini"
    max-height="300"
    class="tableList"
  >
    <el-table-column
      prop="projectName"
      label="项目名称"
      align="left"
      width="125"
      :show-overflow-tooltip="true"
    >
    </el-table-column>
    <el-table-column
      v-for="(item1, index1) in tableColData"
      :key="index1"
      align="center"
      prop=""
      :label="item1.label"
    >
      <el-table-column
        v-for="(item2, index2) in item1.children"
        :key="index2"
        :prop="item2.prop"
        :label="item2.label"
        align="center"
      >
      </el-table-column>
    </el-table-column>
  </el-table>
</template>
<script>
export default {
  props: {
    riskAndProblemsTable: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      //表头数据
      tableColData: [],
    };
  },
  watch: {
    riskAndProblemsTable: {
      handler(v) {
        this.getRoomType();
      },
    },
  },
  mounted() {
    this.getRoomType();
  },
  methods: {
    getRoomType() {
      this.tableColData = [];
      let typeName = [
        {
          type: "高",
        },
        {
          type: "中",
        },
        {
          type: "低",
        },
      ];
      /* this.riskAndProblemsTable.forEach((item) => {
        item.countData.forEach((citem) => {
          const index = typeName.findIndex((i) => i.type == citem.type);
          if (index == -1) {
            //去重，==-1找不到，就push进去
            typeName.push(citem);
          }
        });
      }); */
      //   添加表头数据
      typeName.forEach((item, index) => {
        this.tableColData.push({
          label: `${item.type}`,
          children: [
            {
              prop: "risk" + index,
              label: "风险",
            },
            {
              prop: "problm" + index,
              label: "问题",
            },
            /* {
              prop: "liveDays" + index,
              label: "入住天数",
            }, */
          ],
        });
      });
      console.log("tableColData", this.tableColData);
      // 添加表数据
      this.riskAndProblemsTable.forEach((data) => {
        data.countData.forEach((item) => {
          typeName.forEach((citem, cindex) => {
            if (item.type == citem.type) {
              data["risk" + cindex] = item.risk;
              data["problm" + cindex] = item.problm;
            }
          });
        });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.tableList {
  ::v-deep .el-table__body-wrapper {
    background-color: #f1f1f1;
  }
  ::v-deep .el-table__body-wrapper::-webkit-scrollbar {
    width: 10px !important;
    height: 10px !important;
  }
  ::v-deep .el-table__body-wrapper::-webkit-scrollbar-thumb {
    background-color: #bbb;
    // border-radius: 5px;
  }
  ::v-deep .el-table__empty-block {
    background-color: #fff;
    height: 220px !important;
  }
}
</style>
