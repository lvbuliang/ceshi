<template>
  <el-form
    size="small"
    :inline="true"
    :model="search"
    class="demo-form-inline"
    ref="searchForm"
  >
    <el-form-item>
      <el-input
        v-model="search.knowledgeName"
        placeholder="请输入文件名称"
      ></el-input>
    </el-form-item>

    <!-- 类型 -->
    <!-- notificationType -->

    <el-form-item v-if='publishFlag'> 
      <el-select
        v-model="search.notificationType"
        clearable
        placeholder="请选择类型"
      >
        <el-option
          v-for="item in publishTypeList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <!-- 适用范围 -->
    <!-- contextType -->
    <el-form-item v-if='!publishFlag'>
      <el-select
        v-model="search.contextType"
        clearable
        placeholder="请选择类型"
      >
        <el-option
          v-for="item in fileTypeList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>

    <el-form-item>
      <el-date-picker
        v-model="search.createTime"
        type="date"
        placeholder="年/月/日"
        value-format="yyyy-MM-dd"
        @change="startTimeChange"
      >
      </el-date-picker>
    </el-form-item>
    <el-form-item> 至 </el-form-item>
    <el-form-item>
      <el-date-picker
        v-model="search.endTime"
        type="date"
        placeholder="年/月/日"
        :picker-options="endPickerOptions()"
        value-format="yyyy-MM-dd"
        @change="endTimeChange"
      >
      </el-date-picker>
    </el-form-item>

    <!-- 发布状态 -->
    <el-form-item>
      <el-select
        v-model="search.saveStatus"
        clearable
        placeholder="请选择发布状态"
      >
        <el-option
          v-for="item in publishList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button
        class="circle-btn"
        icon="el-icon-search"
        type="primary"
        circle
        @click="searchFn"
      ></el-button>
    </el-form-item>

    <el-form-item>
      <el-button
        class="circle-btn"
        icon="el-icon-refresh"
        circle
        @click="resetForm"
      ></el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "search-form",
  props: {
    search: {
      type: Object,
      default: () => {
        return {
          knowledgeName: "",
          contextType: "",
          createTime: "",
          endTime: "",
          saveStatus:"",
          notificationType:"",
        };
      },
    },
    fileTypeList: {
      type: Array,
      default: () => [],
    },
    publishList: {
      type: Array,
      default: () => [],
    },
    publishTypeList: {
      type: Array,
      default: () => [],
    },
    publishFlag: {
      type: Boolean,
      default: false,
    }

  },
  data() {
    return {
      // fileTypeList: [
      //   { label: "全部", value: "" },
      //   { label: "通知类", value: "0" },
      //   { label: "统建政策类", value: "1" },
      //   { label: "项目管理类", value: "2" },
      //   { label: "安全运维类", value: "3" },
      //   { label: "其他类", value: "4" },
      // ],
      endPickerOptions: () => {
      let that = this;
      return {
        disabledDate(time) {
          return (
            time.getTime() <
            new Date(that.search.createTime).getTime() -
              8.64e7 +
              1 * 24 * 60 * 60 * 1000
          );
        },
      };
    },
    };
  },
  methods: {
    startTimeChange(time) {
      // 处理开始时间变化逻辑
      this.$emit("startTimeChange", time);
      
    },
    // 结束时间选择
    endTimeChange(time) {
        this.$emit("endTimeChange", time);
    },
    searchFn() {
      // 处理搜索逻辑
      this.$emit("search", this.search);
    },
    resetForm() {
      // 处理重置表单逻辑
      this.$refs.searchForm.resetFields();
      this.$emit("reset");
    },
  },
};
</script>

<style scoped>
.circle-btn {
  border-radius: 50% !important;
}
/* ::v-deep .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
  margin-bottom: 10px !important
} */
</style>
