<template>
  <section class="search">
    <div class="container">
      <div
        class="search-cont relative"
        :class="{ multiple: form.multipleCol || false }"
      >
        <el-form
          :inline="true"
          :ref="form.name || 'form'"
          :model="form.form"
          label-suffix="："
        >
          <el-form-item
            v-for="(item, index) in form.config"
            :key="item.bind"
            :label="item.name"
            :prop="item.bind"
            :class="[
              { none: !((index < (form.minNum || 3) && !expand) || expand) },
              item.class,
              { search_date: item.type.includes('date') },
            ]"
          >
            <!-- input -->
            <el-input
              :class="item.class || 'default_text'"
              v-if="item.type == 'text'"
              size="medium"
              :readonly="item.readonly || false"
              v-model.trim="form.form[item.bind]"
              :placeholder="item.placeholder"
              :maxlength="item.maxlength"
              clearable
            ></el-input>
            <!-- select -->
            <el-select
              :class="item.class || 'default_select'"
              v-if="item.type == 'select'"
              @change="
                (res) => {
                  callSuccessFn(item.select, res);
                }
              "
              size="medium"
              v-model="form.form[item.bind]"
              :placeholder="item.placeholder"
              clearable
              :filterable="item.isHave"
            >
              <el-option
                v-for="(op, opindex) in form.enum[item.data]"
                :key="'op_' + opindex"
                :label="item.label ? op[item.label] : op.dataName"
                :value="item.value ? op[item.value] : op.dataValue"
              ></el-option>
            </el-select>
            <!-- selectCity -->
            <el-cascader
              v-else-if="item.type == 'selectCity'"
              :props="selectCityConfig"
              :value="form.form[item.bind]"
              @change="form.form[item.bind] = $event[1]"
            ></el-cascader>
            <!-- data -->
            <el-date-picker
              :class="item.class || 'default_date_picker'"
              v-if="item.type == 'date'"
              size="medium"
              v-model="form.form[item.bind]"
              :type="item.showType || 'date'"
              :placeholder="item.placeholder"
              :format="item.format || 'yyyy-MM-dd'"
              :value-format="item.format || 'yyyy-MM-dd'"
              :clearable="true"
            ></el-date-picker>
            <el-date-picker
              :class="item.class || 'default_date_picker'"
              v-if="item.type == 'datetime'"
              size="medium"
              v-model="form.form[item.bind]"
              type="datetime"
              :placeholder="item.placeholder"
              :format="item.format || 'yyyy-MM-dd HH:mm:ss'"
              :value-format="item.format || 'yyyy-MM-dd HH:mm:ss'"
              :clearable="true"
            ></el-date-picker>
            <el-date-picker
              :class="item.class || 'default_date_picker'"
              v-if="item.type == 'daterange'"
              size="medium"
              :start-placeholder="item.startPlaceholder"
              :end-placeholder="item.endPlaceholder"
              v-model="form.form[item.bind]"
              type="daterange"
              :placeholder="item.placeholder"
              :format="item.format || 'yyyy-MM-dd'"
              :value-format="item.format || 'yyyy-MM-dd'"
              :clearable="true"
            ></el-date-picker>
            <el-date-picker
              :class="item.class || 'default_date_picker'"
              v-if="item.type == 'datetimerange'"
              size="medium"
              :start-placeholder="item.startPlaceholder"
              :end-placeholder="item.endPlaceholder"
              v-model="form.form[item.bind]"
              type="datetimerange"
              :placeholder="item.placeholder"
              :format="item.format || 'yyyy-MM-dd HH:mm:ss'"
              :value-format="item.format || 'yyyy-MM-dd HH:mm:ss'"
              :clearable="true"
            ></el-date-picker>
            <el-cascader
              v-if="item.type == 'cascader'"
              :ref="item.ref"
              style="width: 100%"
              :placeholder="item.placeholder"
              :options="form.enum[item.data]"
              v-model="form.form[item.bind]"
              :props="getCascaderProp(item)"
              filterable
              size="medium"
              clearable
              @change="
                (res) => {
                  callSuccessFn(item.select, res);
                }
              "
              :show-all-levels="false"
            ></el-cascader>
            <el-cascader
              v-if="item.type == 'projectTypeCascader'"
              style="width: 100%"
              :options="
                item.dataList ? form.enum[item.dataList] : form.enum[item.data]
              "
              v-model="form.form[item.bind]"
              filterable
              @change="
                (val) => {
                  item.change && item.change(val, item);
                }
              "
              v-bind="item"
            ></el-cascader>
          </el-form-item>
        </el-form>
        <div class="btns">
          <el-button size="medium" type="primary" @click="searchFn"
            >查询</el-button
          >
          <el-button size="medium" @click="resetForm" class="resetBtn"
            >重置</el-button
          >
        </div>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  props: {
    form: {
      type: Object,
    },
    showTitle: {
      type: [Boolean],
      default() {
        return true;
      },
    },
    title: {
      type: String,
      default: "查询条件",
    },
  },
  data() {
    return {
      expand: true,
      selectCityConfig: {
        lazy: true,
        lazyLoad(node, resolve) {
          const { level, value } = node;
          if (level === 0) {
            api_queryListJfDictcode({
              jsonStr: { levelcode: "1", typeCode: "LOC" },
            }).then((res) => {
              let nodes = [];
              res.data.list.forEach((item) => {
                nodes.push({
                  value: item.code,
                  label: item.cnname,
                  leaf: false,
                });
              });
              resolve(nodes);
            });
          } else if (level === 1) {
            api_queryListJfDictcode({
              jsonStr: {
                levelcode: "2",
                typeCode: "LOC",
                parentCode: value,
              },
            }).then((res) => {
              let nodes = [];
              res.data.list.forEach((item) => {
                nodes.push({
                  value: item.code,
                  label: item.cnname,
                  leaf: true,
                });
              });
              resolve(nodes);
            });
          }
        },
      },
    };
  },
  computed: {
    iconName() {
      return this.expand ? "darrow-up" : "darrow-down";
    },
  },
  methods: {
    /**
     * 区域切换
     */
    regionChange(row, item) {
      this.form.form[item.bind] = row.dataValue;
      (item.change || (() => {}))(row, item);
    },
    callSuccessFn(handle, res) {
      //上传成功回调父组件方法
      console.log(handle, res, this.$parent);
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
    searchFn() {
      this.$emit("queryList");
    },
    resetForm() {
      this.$refs[this.form.name || "form"].resetFields();
      Object.keys(this.form.form).map((item) => {
        this.form.form[item] = "";
      });
      this.searchFn();
    },
  },
};
</script>
<style lang="scss">
.search {
  .el-form-item__label {
    padding-right: 0;
    color: #555 !important;
    font-size: 14px;
  }
}
</style>
<style lang="scss" scoped>
@import "./form-search.scss";
</style>
