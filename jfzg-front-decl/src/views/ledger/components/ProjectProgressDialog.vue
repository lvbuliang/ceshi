<template>
  <!-- 表格设置tableHeight高度 -->
  <el-table :data="tableData" border style="width: 100%" :height="tableHeight">
    <!-- 序号 -->
    <el-table-column
      fixed
      type="index"
      label="序号"
      width="50"
    ></el-table-column>

    <!-- 标段 -->
    <el-table-column prop="contractName" label="标段" fixed> </el-table-column>

    <!-- 立项进展 -->
    <el-table-column label="立项进展">
      <el-table-column prop="lXStatus" label="完成状态"></el-table-column>
      <el-table-column prop="lXEndTime" label="完成时间"></el-table-column>
    </el-table-column>

    <!-- 采购进展 -->
    <el-table-column label="采购进展">
      <el-table-column
        prop="procurementStatus"
        label="采购状态"
      ></el-table-column>
      <el-table-column
        prop="procurementEndTime"
        label="完成时间"
      ></el-table-column>
    </el-table-column>

    <!-- 交底进展 -->
    <el-table-column label="交底进展">
      <el-table-column
        prop="disclosePlanTime"
        label="计划时间"
      ></el-table-column>
      <el-table-column prop="discloseStatus" label="完成状态"></el-table-column>
      <el-table-column
        prop="discloseEndTime"
        label="完成时间"
      ></el-table-column>
    </el-table-column>

    <!-- 启动进展 -->
    <el-table-column label="启动进展">
      <el-table-column
        prop="startPlanTime"
        label="计划完成时间"
      ></el-table-column>
      <el-table-column prop="startStatus" label="启动状态"></el-table-column>
      <el-table-column prop="startEndTime" label="完成时间"></el-table-column>
    </el-table-column>

    <!-- 开发建设进度 -->
    <el-table-column label="开发建设进度">
      <template slot-scope="scope">
        <span style="margin-left: 10px">
          {{ scope.row.developmentConstructionProgress }}
          <span v-if="scope.row.developmentConstructionProgress != null"
            >%</span
          >
        </span>
      </template>
    </el-table-column>

    <!-- 上线试运行申请确认进展 -->
    <el-table-column label="上线试运行申请确认进展">
      <el-table-column
        prop="testPlanTime"
        label="计划完成时间"
      ></el-table-column>
      <el-table-column
        prop="testCompleteStatus"
        label="完成状态"
      ></el-table-column>
      <el-table-column prop="testEndTime" label="完成时间"></el-table-column>
    </el-table-column>

    <!-- 初验进展 -->
    <el-table-column label="初验进展">
      <el-table-column
        prop="initialTestStatus"
        label="完成状态"
      ></el-table-column>
      <el-table-column
        prop="initialTestTime"
        label="完成时间"
      ></el-table-column>
    </el-table-column>

    <!-- 试运行周期 -->
    <el-table-column label="试运行周期">
      <el-table-column
        prop="testRunStartTime"
        label="开始时间"
      ></el-table-column>
      <el-table-column prop="testRunEndTime" label="结束时间"></el-table-column>
    </el-table-column>

    <!-- 符合性评价进展 -->
    <el-table-column label="符合性评价进展">
      <el-table-column
        prop="complianceEvaluationPlanCompleteTime"
        label="计划完成时间"
      ></el-table-column>
      <el-table-column
        prop="complianceEvaluationStatus"
        label="完成状态"
      ></el-table-column>
      <el-table-column
        prop="complianceEvaluationCompleteTime"
        label="完成时间"
      ></el-table-column>
    </el-table-column>

    <!-- 终验进展 -->
    <el-table-column label="终验进展">
      <el-table-column
        prop="finalInspectionStatus"
        label="完成状态"
      ></el-table-column>
      <el-table-column
        prop="finalInspectionCompleteTime"
        label="完成时间"
      ></el-table-column>
    </el-table-column>
  </el-table>
</template>

<script>
import { getCommonTableHeight } from "@/utils/tableHeightUtils.js";
export default {
  name: "ProjectProgressTable",
  props: {
    tableData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      tableHeight: 0,
    };
  },
  created() {
    this.calculateTableHeight();
  },
  mounted() {
    this.calculateTableHeight();
  },
  methods: {
    calculateTableHeight() {
      // 调用工具函数并传入元素的 ref
      // 表头加弹窗高度 226
      this.$set(
        this,
        "tableHeight",
        getCommonTableHeight(this.$refs.searchRef) - 226
      );
    },
    // 单元格样式处理
    handleCellStyle({ row, column }) {
      // 定义需要处理的时间字段映射关系
      const timeFieldMap = {
        // 完成时间字段: 对应计划时间字段
        discloseEndTime: "disclosePlanTime",
        startEndTime: "startPlanTime",
        testEndTime: "testPlanTime",
        complianceEvaluationCompleteTime:
          "complianceEvaluationPlanCompleteTime",
      };

      // 只处理定义的时间字段
      if (timeFieldMap.hasOwnProperty(column.property)) {
        const planTimeField = timeFieldMap[column.property];
        return this.getTimeCellStyle(row[planTimeField], row[column.property]);
      }
      return {};
    },

    // 获取时间单元格样式
    getTimeCellStyle(planTimeStr, compareTimeStr) {
      const planTime = this.parseDate(planTimeStr);
      const compareTime = this.parseDate(compareTimeStr);
      const now = new Date();

      // 有效性检查
      if (!planTime) return {};

      // 判断条件
      const isOverdue =
        (compareTime && compareTime > planTime) || // 比较时间超期
        (!compareTime && now > planTime); // 无比较时间但当前时间已超期

      return isOverdue ? { backgroundColor: "#ff0000", color: "#ffeded" } : {};
    },

    // 安全的日期解析方法
    parseDate(dateStr) {
      if (!dateStr) return null;
      try {
        // 统一处理日期格式（支持YYYY-MM-DD和YYYY/MM/DD）
        const normalized = dateStr.replace(/-/g, "/");
        const timestamp = Date.parse(normalized);
        return isNaN(timestamp) ? null : new Date(timestamp);
      } catch {
        return null;
      }
    },
  },
};
</script>

<style scoped>
/* .el-table {
  height: 100%;
}

.el-table__body-wrapper {
  height: calc(100% - 60px);
  overflow-y: auto;
}
::v-deep.el-table__fixed {
  height: 100% !important;
  background: red;
}

::v-deep.el-table__fixed-body-wrapper {
  height: calc(100% - 60px) !important;
  overflow-y: auto !important;
  background: #000;
} */

/* 强制固定列高度与内容区域一致 */
::v-deep.el-table__fixed,
.el-table__fixed-right {
  height: 100% !important;
}

/* 修复最后一行边框缺失问题 */
::v-deep.el-table__fixed-body-wrapper .el-table__body tr:last-child td {
  border-bottom: 1px solid #ebeef5 !important;
}
</style>
