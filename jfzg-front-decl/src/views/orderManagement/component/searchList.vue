<template>
  <div class="top">
    <!-- 订单管理 - 搜索 -->
    <el-form
      :inline="true"
      :model="searchForm"
      ref="searchForm"
      class="demo-form-inline"
    >
      <el-form-item prop="serviceType">
        <el-select
          v-model="searchForm.serviceType"
          placeholder="请输入服务类别"
          clearable
          @clear="refresh"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="frameworkContract">
        <el-input
          v-model="searchForm.frameworkContract"
          placeholder="请输入框架合同名称"
          clearable
          @clear="refresh"
        ></el-input>
      </el-form-item>
      <el-form-item prop="winningBidder">
        <el-input
          v-model="searchForm.winningBidder"
          placeholder="请输入中标单位"
          clearable
          @clear="refresh"
        ></el-input>
      </el-form-item>
      <el-form-item prop="startTimeA">
        <el-date-picker
          v-model="searchForm.startTimeA"
          type="date"
          placeholder="选择合同开始日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :picker-options="expireTimeOPtionOne"
          clearable
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="endTimeA">
        <el-date-picker
          v-model="searchForm.endTimeA"
          type="date"
          placeholder="选择合同结束日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :picker-options="expireTimeOPtionTwo"
          clearable
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-tooltip class="item" effect="light" content="搜索" placement="top">
          <el-button
            type="primary"
            icon="el-icon-search"
            size="small"
            @click="search"
          ></el-button>
        </el-tooltip>
      </el-form-item>
      <el-form-item>
        <el-tooltip class="item" effect="light" content="重置" placement="top">
          <el-button
            icon="el-icon-refresh"
            size="small"
            @click="refresh"
          ></el-button>
        </el-tooltip>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  computed: {
    // 选择时间限制
    expireTimeOPtionOne() {
      let _this = this;
      return {
        disabledDate(time) {
          let isDis =
            time.getTime() > new Date(_this.searchForm.endTimeA).getTime();
          return isDis;
        },
      };
    },
    expireTimeOPtionTwo() {
      let _this = this;
      return {
        disabledDate(time) {
          let isDis =
            time.getTime() < new Date(_this.searchForm.startTimeA).getTime();
          return isDis;
        },
      };
    },
  },
  data() {
    return {
      searchForm: {
        // 服务名称
        serviceType: "",
        // 、 中标单位
        winningBidder: "",
        // 框架合同名称
        frameworkContract: "",
        startTimeA: "",
        endTimeA: "",
      },
      options: [
        {
          label: "监理",
          value: "4",
        },
        {
          label: "等保",
          value: "1",
        },
        {
          label: "密评",
          value: "2",
        },
        {
          label: "三方测评",
          value: "5",
        },
        {
          label: "其他",
          value: "3",
        },
      ],
    };
  },

  methods: {
    search() {
      // 搜索
      if (
        ["", null, "null"].includes(this.searchForm.startTimeA) &&
        !["", null, "null"].includes(this.searchForm.endTimeA)
      ) {
        this.$message.warning("请选择合同开始时间");
      } else {
        this.$emit("search", this.searchForm);
      }
    },
    refresh() {
      // 重置
      this.$refs["searchForm"].resetFields();
      
      this.$emit("refresh");
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-button {
  width: 32px;
  height: 32px;
  margin: 0;
  padding: 0;
  border-radius: 50% !important;
}
::v-deep .el-form-item {
  margin-bottom: 0;
}
.top {
  padding-top: 20px;
}
</style>
