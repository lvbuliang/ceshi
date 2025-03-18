<template>
  <div v-if="hideData.showElForm">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      :label-width="otherConfig"
      class="demo-ruleForm"
    >
      <el-form-item
        label="评审活动所属阶段："
        prop="name"
        :class="[ruleForm.col ? 'col-' + ruleForm.col : 'col-' + 12]"
        v-if="hideData.showPlan"
      >
        <el-cascader
          v-model="value"
          placeholder="请选择评审活动所属阶段"
          :options="options"
          :props="{
            checkStrictly: false,
          }"
          clearable
          collapse-tags
          @change="handleCascaderChange"
        ></el-cascader>
        <!-- :props="{
            multiple: true,
            // checkStrictly: true,
            value: 'id',
            label: 'name',
            children: 'planList',
          }" -->
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "treeTable",
  props: {
    otherConfig: {
      type: String,
      default() {
        return "140px";
      },
    },
    ruleForm: {
      type: Object,
      default() {
        return {
          name: [],
          planOptions: [],
          yearPlanOptions: [],
          col: 12,
        };
      },
    },
    hideData: {
      type: Object,
      default() {
        return {
          showElForm: true,
          showYearPlan: true,
          showPlan: true,
          showtreeTable: true,
          source: true,
          zrdw: true,
          ghmc: true,
          ghlx: true,
        };
      },
    },
    tableData: {
      type: Array,
      default() {
        return [];
      },
    },
    allPlanDataList: {
      type: Array,
      default() {
        return [];
      },
    },
    initSelectPlanItemsList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      ruleForm: {
        name: [],
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
      },
      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        region: [
          { required: true, message: "请选择活动区域", trigger: "change" },
        ],
      },
      selectData: [],
      tableData: [],
      selectIds: [], //关联规划选择的id
      preDataList: [],
      options: [
        {
          value: 0,
          label: "清单审核",
          children: [
            {
              value: 3,
              label: "分组初审",
            },
            {
              value: 4,
              label: "联合会审",
            },
            {
              value: 5,
              label: "专家评审",
            },
          ],
        },
        {
          value: 1,
          label: "方案审核",
          children: [
            {
              value: 3,
              label: "专家评审",
            },
            {
              value: 4,
              label: "资金初审",
            },
            {
              value: 5,
              label: "立项审核",
            },
          ],
        },
      ],
      value: [],
    };
  },
  watch: {
    // 选中数据长度为0清空tableData
    "ruleForm.name": {
      handler: function (newVal, oldVal) {
        const newLen = newVal.length;
        const oldLen = oldVal.length;
        console.log("new", newLen, "old", oldLen);
        if (newLen == 0) {
          this.$emit("delPreDataList", []);
        }
      },
      deep: true,
    },
  },
  mounted() {},

  methods: {
    handleCascaderChange(selectedItems) {
      console.log("selectedItems", selectedItems);
      if (selectedItems && selectedItems.length > 1) {
        const sign = selectedItems[0];
        const node = selectedItems[1];
        console.log("sign", sign, "node", node);
        this.$emit("selectData", sign, node);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.col-24 {
  width: 100%;
  margin-right: 0 !important;
}
.el-select,
.el-cascader {
  width: 100%;
}
.el-form-item {
  margin-bottom: 8px !important;
}
.col-12 {
  width: 50%;
  margin-right: 0 !important;
}

.col-16 {
  width: 66.66666%;
  margin-right: 0 !important;
}

.col-6 {
  width: 25%;
  margin-right: 0 !important;
}

.col-8 {
  width: 33.333%;
  margin-right: 0 !important;
}

.col-18 {
  width: 75%;
  margin-right: 0 !important;
}
.el-table {
  width: 98.8% !important;
  margin: 0 auto;
  margin-bottom: 20px;
  margin-left: 20px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
}
.el-form-item {
  margin-right: 0;
}
.el-form-item__label,
.el-form-item__content {
  line-height: 32px;
}
.el-form-item {
  padding-left: 0 !important;
  margin-bottom: 16px;
  display: inline-block;
  vertical-align: top;
}

::v-deep .el-form-item__label {
  // width: 190px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  padding: 0px;
}
.el-table {
}
.table_empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: initial;
  padding: 60px 0;

  .empty_img {
    width: 80px;
    height: 60px;
  }

  .empty_null {
    margin: 8px 0;
    color: #666;
  }

  .empty_btn {
    color: #1890ff;
    cursor: pointer;
  }
}
</style>
