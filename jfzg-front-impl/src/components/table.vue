<template>
  <div class="sr_table" :class="{ noData: data && data.length == 0 }">
    <el-table
      ref="SrTable"
      @select-all="selectAll"
      @selection-change="selectChange"
      @row-click="rowClick"
      @sort-change="sortChange"
      :highlight-current-row="config.highlightCurrentRow"
      :data="data"
      :height="config.height"
      :max-height="config.maxHeight"
      :show-summary="config.showSummary"
      :sum-text="config.sumText || '合计（万元）'"
      :row-key="config.rowKey || 'id'"
      :lazy="config.lazy || true"
      :default-expand-all="config.expandAll || false"
      :load="config.load || (() => {})"
      :tree-props="
        config.treeProps || { children: 'children', hasChildren: 'hasChildren' }
      "
      :row-class-name="config.rowClassName"
      :cell-class-name="config.cellClassName"
      tooltip-effect="light"
      tooltip-placement="top-start"
    >
      <el-table-column
        v-if="config.selectionConfig && config.selectionConfig.display"
        align="left"
        type="selection"
        :selectable="config.selectionConfig.selectable"
        :reserve-selection="true"
        :width="config.selectionConfig.width || 50"
      ></el-table-column>
      <el-table-column
        :label="config.indexConfig.label"
        type="index"
        :width="config.indexConfig.width || 52"
        v-if="config.indexConfig && config.indexConfig.display"
      ></el-table-column>
      <el-table-column
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        :min-width="item.minWidth"
        :sortable="item.sortable || false"
        v-for="(item, index) in config.header"
        :key="index"
        :show-overflow-tooltip="true"
      >
        <!-- item.tooltip -->
        <template slot-scope="scope">
          <slot
            name="cellSlot"
            v-if="item.cellSlot"
            :scope="{ row: scope.row, item: item, index: item.index }"
          ></slot>
          <span
            :class="item.className"
            v-else-if="item.hidPopover && item.filter"
            >{{ filters[item.filter](scope.row[item.prop]) }}</span
          >
          <span
            class="cell-box"
            :class="item.className"
            v-else-if="item.hidPopover && !item.fileter"
            >{{ scope.row[item.prop] }}</span
          >
          <div v-else-if="item.filter">
            {{ filters[item.filter](scope.row[item.prop]) }}
            {{ item }}
          </div>
          <div v-else class="hid" :class="item.className">
            {{ scope.row[item.prop] }}
          </div>
          <!-- <el-popover
            :popper-class="item.popoverClass || 'table_popover'"
            placement="top-start"
            trigger="hover"
            :width="item.popoverWidth"
            :content="filters[item.filter](scope.row[item.prop])"
            v-else-if="item.filter"
          >
            <span slot="reference" :class="item.className">
              {{ filters[item.filter](scope.row[item.prop]) }}
              {{ item }}
            </span>
          </el-popover>
          <el-popover
            :popper-class="item.popoverClass || 'table_popover'"
            v-else
            placement="top-start"
            trigger="hover"
            :width="item.popoverWidth"
            :content="scope.row[item.prop] + ''"
          >
            <div
              style="width: 40px"
              :class="item.className"
              v-if="item.label == '序号' || item.label == '序列'"
              slot="reference"
            >
              <span>{{ scope.row[item.prop] }}</span>
            </div>
            <div v-else :class="item.className" slot="reference">
              {{ scope.row[item.prop] }}
            </div>
                    </el-popover>-->
        </template>
      </el-table-column>
      <el-table-column
        v-if="config.operateConfig && config.operateConfig.display"
        :fixed="config.operateConfig.fixed"
        :label="config.operateConfig.label"
        :width="config.operateConfig.width || 156"
        class="operate"
      >
        <template slot="header">
          <div style="height: 100%">
            {{ config.operateConfig.label }}
            <el-button
              class="el-icon-setting"
              size="mini"
              type="text"
              @click="settingHeader"
            ></el-button>
          </div>
        </template>
        <template slot-scope="scope">
          <template v-for="(item, index) in config.innerBtn">
            <el-button
              :key="index"
              v-if="isShowBtn(item, scope.row)"
              @click.stop="callFn(item, scope.row, item.name)"
              :type="item.type"
              size="medium"
              >{{ item.name }}</el-button
            >
          </template>
          <el-button
            v-for="(item, index) in scope.row.operationBtns"
            :key="String(index)"
            @click="goPath(scope.row.path, scope.row)"
            type="text"
            size="medium"
            >{{ item.btnName }}</el-button
          >
        </template>
      </el-table-column>
      <slot name="empty" slot="empty">
        <div
          class="table_empty"
          v-if="config.emptyConfig && config.emptyConfig.display"
        >
          <!-- <img :src="emptyImg" class="empty_img" /> -->
          <span class="empty_null">{{ config.emptyConfig.emptyNull }}</span>
          <div class="empty_tip">
            {{ config.emptyConfig.emptyTip }}
            <span class="empty_btn" @click="emptyClick">{{
              config.emptyConfig.emptyBtn
            }}</span>
          </div>
        </div>
      </slot>
    </el-table>

    <el-pagination
      class="pagination"
      v-if="page.total > (page.minSize || 10)"
      @size-change="handleSizeChange"
      @current-change="handleChange"
      :current-page="page.pageNum || 1"
      :layout="page.layout || 'total, sizes, prev, pager, next, jumper'"
      :total="page.total"
      :page-size="page.pageSize || 10"
      :page-sizes="page.pageSizes || [10, 20, 30]"
    ></el-pagination>
    <settingTable
      :data="config.operateConfig.allTableHeader"
      @close="() => (dialogVisible = false)"
      :dialogVisible="dialogVisible"
      @saveHeaderList="saveHeaderList"
      v-if="
        config.operateConfig &&
        config.operateConfig.allTableHeader &&
        config.operateConfig.allTableHeader.length
      "
    ></settingTable>
  </div>
</template>

<script>
// import emptyImg from "./empty.png";
import settingTable from "./tableDialog.vue";
export default {
  components: { settingTable },
  name: "SrTable",
  props: {
    filters: Object,
    maxHeight: {
      type: [String, Number],
      default() {
        return 1000;
      },
    },
    data: {
      type: Array,
      default() {
        return [];
      },
    },
    page: {
      type: Object,
      default() {
        return {
          total: 0,
          pageSize: 5,
          pageSizes: [5, 10, 20, 30],
          pageNum: 1,
        };
      },
    },
    config: {
      type: Object,
      default() {
        return {};
      },
    },
    showPagination: {
      tyep: Boolean,
      default: true,
    },
  },
  data() {
    return {
      dialogVisible: false,
    //   emptyImg: emptyImg,
    };
  },
  mounted() {},
  methods: {
    goPath(goWorkFlow, row) {
      goWorkFlow(row);
    },
    //操作事件
    callFn(item, row, name, index) {
      if (item.method && item.method.constructor == Function) {
        // 兼容以前，扩展传入fn方式
        item.method(item, row, name, index);
        return;
      }
      let sum = 0;
      let obj = this.getDeepMethod(this.$parent, item.method, sum, 10);
      if (obj.parent && obj.method) {
        obj.method.call(obj.parent, row, name, index);
      }
    },
    saveHeaderList(data) {
      this.dialogVisible = false;
      this.config.operateConfig &&
        this.config.operateConfig.saveHeaderList(data);
    },
    settingHeader() {
      this.dialogVisible = true;
    },
    // 递归找method
    getDeepMethod(parent, method, sum, limit) {
      sum++;
      if (!parent) {
        return {};
      } else if (sum == limit) {
        return {};
      } else if (parent[method]) {
        return {
          parent,
          method: parent[method],
        };
      } else {
        return this.getDeepMethod(parent.$parent, method);
      }
    },
    isShowBtn(item, row) {
      // let role = this.roleBtn(item.code || "");
      let field = true;
      let arr =
        item.value == undefined
          ? []
          : item.value.constructor == Array
          ? item.value
          : item.value
          ? [item.value]
          : [];
      if (item.reverse) {
        // 是否反向判断
        field = false;
        arr.map((res) => {
          if (row[item.field] == res) {
            // 找到一个
            field = true;
          }
        });
      } else {
        arr.map((res) => {
          if (row[item.field] == res) {
            // 找到一个
            field = false;
          }
        });
      }
      let validate = true;
      if (item.validate) {
        // 自定义校验方法
        validate = item.validate(item, row);
      }
      return (!item.field || field) && validate;
    },
    //下一页
    handleChange(page) {
      this.$emit("pageChanged", page);
    },
    // 分页大小
    handleSizeChange(size) {
      this.$emit("sizeChanged", size);
    },
    // 多选操作
    selectChange(val) {
      this.$emit("selected", val);
    },
    // 单行点击事件
    rowClick(row) {
      this.$emit("clickRow", row);
    },
    // 点击排序事件
    sortChange(column) {
      this.$emit("sortChange", column);
    },
    // 点击全选框
    selectAll(selection) {
      this.$emit("selectAll", selection);
    },
    emptyClick() {
      this.$emit("emptyClick");
    },
  },
};
</script>

<style lang="scss">
</style>
