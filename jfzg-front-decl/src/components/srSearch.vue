<template>
  <div class="sr_search search-cont relative">
    <el-form
      :inline="true"
      :ref="search.name || 'form'"
      :model="search.formData"
      :label-position="search.labelConfig.labelPosition"
      :label-suffix="search.labelConfig.labelSuffix"
      :label-width="search.labelConfig.labelWidth"
    >
      <el-row>
        <el-col :span="search.contentCol ? search.contentCol : 19">
          <div ref="search_config" class="search-config">
            <el-form-item
              v-for="(item, index) in search.config"
              :key="item.bind"
              :label="item.name"
              :prop="item.bind"
              :class="`${(index + 1) % 3 == 0 ? 'thirdItem' : ''} ${
                !((index < (search.minNum || 2) && !expand) || expand)
                  ? 'none'
                  : ''
              } ${item.className ? item.className : ''}`"
            >
              <!-- input -->
              <el-input
                :class="item.class || 'default_text'"
                v-if="item.type == 'text'"
                :size="search.size || 'small'"
                :readonly="item.readonly || false"
                v-model.trim="search.formData[item.bind]"
                :placeholder="item.placeholder"
                :maxlength="item.maxlength"
                :prefix-icon="!item.hideLeftIcon ? '' : 'el-icon-search'"
                :suffix-icon="item.hideRightIcom ? '' : 'el-icon-search'"
                clearable
              >
                <el-button
                  @click="searchFn"
                  :slot="item.slot ? 'append' : false"
                  icon="el-icon-search"
                ></el-button>
              </el-input>
              <!-- select -->
              <el-select
                :class="item.class || 'default_select'"
                v-if="item.type == 'select'"
                @change="
                  (res) => {
                    callSuccessFn(item.select, res);
                  }
                "
                :size="search.size || 'small'"
                v-model="search.formData[item.bind]"
                :placeholder="item.placeholder"
                clearable
                :filterable="item.isHave"
              >
                <el-option
                  v-for="(op, opindex) in search.enum[item.data]"
                  :key="'op_' + opindex"
                  :label="item.label ? op[item.label] : op.label"
                  :value="item.value ? op[item.value] : op.value"
                ></el-option>
              </el-select>
              <!-- data -->
              <el-date-picker
                :class="item.class || 'default_date_picker'"
                v-if="item.type == 'date'"
                :size="search.size || 'small'"
                v-model="search.formData[item.bind]"
                :type="item.showType || 'date'"
                :placeholder="item.placeholder"
                :format="item.format || 'yyyy-MM-dd'"
                :value-format="item.format || 'yyyy-MM-dd'"
              ></el-date-picker>
              <el-date-picker
                :class="item.class || 'default_date_picker'"
                v-if="item.type == 'datetime'"
                :size="search.size || 'small'"
                v-model="search.formData[item.bind]"
                type="datetime"
                :placeholder="item.placeholder"
                :format="item.format || 'yyyy-MM-dd HH:mm:ss'"
                :value-format="item.format || 'yyyy-MM-dd HH:mm:ss'"
              ></el-date-picker>
              <el-date-picker
                :class="item.class || 'default_date_picker'"
                v-if="item.type == 'daterange'"
                :size="search.size || 'small'"
                :start-placeholder="item.startPlaceholder"
                :end-placeholder="item.endPlaceholder"
                v-model="search.formData[item.bind]"
                type="daterange"
                :placeholder="item.placeholder"
                :format="item.format || 'yyyy-MM-dd'"
                :value-format="item.format || 'yyyy-MM-dd'"
              ></el-date-picker>
              <el-date-picker
                :class="item.class || 'default_date_picker'"
                v-if="item.type == 'datetimerange'"
                :size="search.size || 'small'"
                :start-placeholder="item.startPlaceholder"
                :end-placeholder="item.endPlaceholder"
                v-model="search.formData[item.bind]"
                type="datetimerange"
                :placeholder="item.placeholder"
                :format="item.format || 'yyyy-MM-dd HH:mm:ss'"
                :value-format="item.format || 'yyyy-MM-dd HH:mm:ss'"
              ></el-date-picker>
              <el-cascader
                v-if="item.type == 'cascader'"
                :ref="item.ref"
                style="width: 100%"
                :placeholder="item.placeholder"
                :options="search.enum[item.data]"
                v-model="search.formData[item.bind]"
                :props="getCascaderProp(item)"
                filterable
                :size="search.size || 'small'"
                @change="
                  (res) => {
                    callSuccessFn(item.select, res);
                  }
                "
                :show-all-levels="false"
              ></el-cascader>
              <div
                v-if="item.type == 'numberArea'"
                :class="item.class || 'default_number_area'"
              >
                <el-input
                  v-model="search.formData[item.startBind]"
                  type="number"
                  :max="item.startMax"
                  :min="item.startMin"
                  :size="search.size || 'small'"
                  :placeholder="item.startPlaceholder"
                  @change="handleStartInput"
                ></el-input>
                <span class="interval">-</span>
                <el-input
                  v-model="search.formData[item.endBind]"
                  type="number"
                  :max="item.endMax"
                  :min="item.endMin"
                  :size="search.size || 'small'"
                  :placeholder="item.endPlaceholder"
                  @change="handleEndChange"
                ></el-input>
              </div>
            </el-form-item>
            <el-form-item>
              <sr-popover content="搜素">
                <el-button
                  icon="el-icon-search"
                  :size="search.size || 'small'"
                  type="primary"
                  @click="searchFn"
                  circle
                ></el-button>
              </sr-popover>
              <sr-popover content="重置">
                <el-button
                  icon="el-icon-refresh"
                  :size="search.size || 'small'"
                  class="resetBtn"
                  @click="resetForm"
                  circle
                ></el-button>
              </sr-popover>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="search.btnCol ? search.btnCol : 5">
          <div
            ref="search_btn"
            class="search-btn"
            :style="{ height: searchConfigHeight }"
          >
            <div>
              <template v-for="(item, index) in search.btns">
                <sr-popover :content="item.name" :key="item.name + index">
                  <el-button
                    style="margin-left: 8px"
                    :key="item.name + index"
                    size="small"
                    :type="item.type"
                    round
                    @click="
                      (val) => {
                        item.click && item.click();
                      }
                    "
                    >{{ item.name }}</el-button
                  >
                </sr-popover>
              </template>
              <slot name="searchBtn"></slot>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "SrSearch",
  props: {
    // 搜索组件配置项
    search: {
      type: Object,
    },
    hideBtns: {
      type: Boolean,
      default: true,
    },
    showTextBtns: {
      type: Boolean,
      default: false,
    },
    searchBtns: {
      type: Boolean,
      default: false,
    },
    searchExpand: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      expand: false,
      searchConfigHeight: "",
    };
  },
  created() {
    const keys = Object.keys(this.search.formData);
    if (keys.length < 1) {
      this.search.config.forEach((item) => {
        this.$set(this.search.formData, item.bind, "");
      });
    }
    this.expand = this.searchExpand;
  },
  mounted() {
    this.getSearchConfigHeight();
  },
  destroyed() {
    this.search.formData = {};
  },
  methods: {
    callSuccessFn(handle, res) {
      //上传成功回调父组件方法
      if (this.$parent[handle]) {
        this.$parent[handle].call(this.$parent, res);
        return;
      }

      if (this.$parent.$parent[handle]) {
        this.$parent.$parent[handle].call(this.$parent.$parent, res);
        return;
      }
      if (this.$parent.$parent.$parent[handle]) {
        this.$parent.$parent.$parent[handle].call(
          this.$parent.$parent.$parent,
          res
        );
      } else {
        console.log("没有写此方法");
      }
    },
    getCascaderProp(item) {
      if (item.props && !item.props.emitPath && !item.props.value) {
        item.props.value = "svalue";
        return item.props;
      }
      return item.props || {};
    },
    handleStartInput() {
      this.numberAreaCheck(1);
    },
    handleEndChange() {
      this.numberAreaCheck(2);
    },
    numberAreaCheck(val) {
      // 数字区间校验
      let { startBind, endBind } = this.getBind(
        this.search.config,
        "numberArea"
      )
        ? this.getBind(this.search.config, "numberArea")
        : {};
      let start = this.search.formData[startBind];
      let end = this.search.formData[endBind];
      const isEmpty = null || undefined || "";
      if (isEmpty != start && isEmpty != end && Number(start) > Number(end)) {
        if (val == 1) {
          this.search.formData[endBind] = Number(start);
        } else {
          this.search.formData[startBind] = Number(end);
        }
      }
    },
    getBind(arr, name, key = "type") {
      return arr.find((item) => item[key] == name);
    },
    searchFn(e) {
      this.$emit("queryList");
    },

    resetForm() {
      this.$refs[this.search.name || "form"].resetFields();
      this.search.config.forEach((item) => {
        if (item.type == "numberArea") {
          this.search.formData[item.startBind] = "";
          this.search.formData[item.endBind] = "";
        }
      });
      this.searchFn();
    },
    getSearchConfigHeight() {
      this.searchConfigHeight = this.$refs.search_config.offsetHeight + "px";
    },
  },
};
</script>
<style lang="scss" scoped>
.sr_search {
  .default_number_area {
    display: flex;
    .interval {
      padding: 0 10px;
    }
  }
}
</style>
