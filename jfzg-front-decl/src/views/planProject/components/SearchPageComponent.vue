<template>
  <div class="searchPage" ref="searchForm">
    <el-form
      size="small"
      :inline="true"
      :model="formData"
      class="demo-form-inline"
      ref="searchForm1"
    >
      <el-form-item v-for="item in formItems" :key="item.prop">
        <!-- {{ [item] }} -->
        <el-input
          v-if="item.type === 'input'"
          :placeholder="item.label"
          v-model="formData[item.prop]"
          clearable
          @clear="clearFunc(item.prop)"
          @blur="inputAntSelectBlur"
        ></el-input>

        <el-select
          v-else-if="item.type === 'select'"
          v-model="formData[item.prop]"
          :placeholder="item.label"
          clearable
          @clear="clearFunc(item.prop)"
          @change="inputAntSelectBlur"
        >
          <el-option
            v-for="option in item.options"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button
          class="circle-btn"
          icon="el-icon-search"
          type="primary"
          circle
          @click="handleSearch"
        ></el-button>
      </el-form-item>

      <el-form-item>
        <el-button
          class="circle-btn"
          icon="el-icon-refresh"
          circle
          @click="handleReset"
        ></el-button>
      </el-form-item>
    </el-form>

    <div class="other-btns">
      <slot name="buttons"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchPageComponent",
  props: {
    formData: {
      type: Object,
      required: true,
    },
    formItems: {
      type: Array,
      required: true,
    },
    selectOptions: {
      type: Object,
      default: () => ({}),
    },
  },
  mounted() {
    this.$nextTick(() => {
      // console.log(this.$refs.searchForm.$el.offsetHeight, "111111");

      // console.log(this.$refs.SrRef.offsetHeight, "338338338");

      const height = this.$refs.searchForm.offsetHeight;
      // 如果height第一次获取的值不为0，则传递第一个值，第二次获取的值为0，则获取第一次的值
      if (height !== 0) {
        this.$emit("height-changed", height);
      }
    });
  },
  methods: {
    clearFunc(prop) {
      this.$emit("clear", prop);
    },
    inputAntSelectBlur() {
      this.$emit("blur");
    },
    handleSearch() {
      this.$emit("search");
    },
    handleReset() {
      this.$refs.searchForm1.resetFields();
      this.$emit("reset");
    },
  },
};
</script>

<style lang="scss" scoped>
.searchPage {
  height: 100%;
  margin-bottom: 20px;
  .demo-form-inline {
    width: 100%;
  }

  .other-btns {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
  }
}
</style>
