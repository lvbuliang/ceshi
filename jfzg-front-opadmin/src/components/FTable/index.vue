<template>
  <section class="table-components">
    <slot name="search"></slot>
    <el-table
      ref="table"
      :data="data"
      @select="selectData"
      :show-summary="config.showSummary"
      :highlight-current-row="config.highlightCurrentRow || false"
      @current-change="handleCurrentChange"
      @select-all="selectDataAll"
      @selection-change="selectChange"
      @row-click="rowClick"
      @sort-change="sortChange"
      :row-key="config.rowKey || 'id'"
      border
      :lazy="config.lazy || true"
      :default-expand-all="config.expandAll || false"
      :load="config.loadChildren || (() => {})"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      :max-height="maxHeight"
      tooltip-effect="light"
      tooltip-placement="top-start"
    >
      <!-- :row-class-name="tableRowClassName" -->
      <el-table-column
        v-if="config.selection"
        :selectable="selectable"
        align="left"
        type="selection"
        width="60"
        :resizable="false"
      ></el-table-column>
      <el-table-column type="expand" v-if="config.expand">
        <template slot-scope="scope">
          <slot name="expand" :scope="scope"></slot>
        </template>
      </el-table-column>
      <el-table-column
        v-if="config.index"
        align="left"
        type="index"
        width="60"
        :label="config.index"
        :resizable="false"
      ></el-table-column>

      <el-table-column
        v-for="(item, index) in config.header"
        :key="item.name + index"
        :label="item.name"
        :prop="item.prop"
        align="left"
        :show-overflow-tooltip="!item.selectConfig"
        :sortable="item.sortable || false"
        :width="item.width || 'auto'"
        :class-name="index == 0 ? 'tree-col' : ''"
        :resizable="false"
      >
        <template slot-scope="scope">
          <slot
            name="cellSlot"
            v-if="item.cellSlot"
            :scope="{ row: scope.row, item: item, index: item.index }"
          ></slot>
          <!-- slelect -->
          <div v-else-if="item.selectConfig">
            <el-select
              v-model="scope.row[item.prop]"
              :placeholder="item.selectConfig.placeholder"
            >
              <el-option
                v-for="em in item.selectConfig.options"
                :key="em.value"
                :label="em.label"
                :value="em.value"
              ></el-option>
            </el-select>
          </div>
          <div
            v-else-if="item.name.includes('元') && !isNaN(scope.row[item.prop])"
          >
            {{ format(scope.row[item.prop]) }}
          </div>
          <div v-else-if="!item.haveHTML" class="hid">
            {{ scope.row[item.prop] || "-" }}
          </div>
          <div
            class="hid"
            v-else
            v-html="fmt(scope.row, item.prop, scope.row[item.prop])"
          ></div>
        </template>
      </el-table-column>

      <el-table-column
        v-if="config.innerBtn"
        :label="tableLabelName"
        align="left"
        :width="config.operationWidth || 'auto'"
        :fixed="config.fixed || false"
        :resizable="false"
      >
        <template slot-scope="scope">
          <div v-if="btnSelect.length">
            <template v-for="(item, index) in config.innerBtn">
              <el-button
                v-if="!item.bind || scope.row[item.bind] != item.value"
                :key="item.name + index"
                v-show="btnSelect[scope.$index][index]"
                type="text"
                size="mini"
                @click="callFn(item, scope.row, item.name)"
                >{{ item.name }}</el-button
              >
            </template>
          </div>
          <div v-else>
            <!-- 编辑与查看不能共存，启用下没有删除 -->
            <template v-for="(item, index) in config.innerBtn">
              <el-popover
                placement="top-start"
                class="tab_btn"
                trigger="hover"
                v-if="item.icon && isShowBtn(item, scope.row)"
                :key="index"
                :style="{ width: '100px' }"
              >
                <div @click="callFn(item, scope.row, item.name, scope.$index)">
                  <div class="title">{{ item.name }}</div>
                </div>
                <span
                  class="iconfont ts"
                  slot="reference"
                  :class="[
                    item.icon,
                    item.className ? item.className : '',
                    item.color ? item.color : 'font-color-operation-btn',
                  ]"
                  @click="callFn(item, scope.row, item.name, scope.$index)"
                ></span>
              </el-popover>
              <el-button
                v-else-if="isShowBtn(item, scope.row)"
                :key="index"
                type="text"
                size="mini"
                @click="callFn(item, scope.row, item.name)"
              >
                <el-divider v-if="index != 0" direction="vertical"></el-divider>
                {{ item.getBtnInfo ? getBtnInfo(item, scope.row) : item.name }}
              </el-button>
            </template>
          </div>
        </template>
      </el-table-column>
      <!-- 表格操作 -->
      <el-table-column
        v-if="config.innerBtnsec"
        :label="tableLabelNamesec"
        align="left"
        :width="config.operationWidth || 'auto'"
        :fixed="config.fixed || false"
        :resizable="false"
      >
        <template slot-scope="scope">
          <div>
            <template v-for="(item, index) in config.innerBtnsec">
              <el-popover
                placement="top-start"
                trigger="hover"
                v-if="item.icon && isShowBtn(item, scope.row)"
                :key="index"
                :style="{ width: '100px' }"
              >
                <div @click="callFn(item, scope.row)">
                  <div class="title">{{ item.name }}</div>
                </div>
                <span
                  class="iconfont ts"
                  slot="reference"
                  :class="[
                    item.icon,
                    item.color ? item.color : 'font-color-operation-btn',
                  ]"
                  @click="callFn(item, scope.row, item.name)"
                ></span>
              </el-popover>
              <el-button
                v-else-if="isShowBtn(item, scope.row)"
                :key="index"
                :type="item.btntype ? item.btntype : ''"
                size="mini"
                @click="callFn(item, scope.row, item.name)"
              >
                <el-divider
                  v-if="index !== 0"
                  direction="vertical"
                ></el-divider>
                {{ item.getBtnInfo ? getBtnInfo(item, scope.row) : item.name }}
              </el-button>
            </template>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div
      class="page"
      v-if="!config.noPage && page.total && page.total > 5 && showPagination"
    >
      <div class="pageBox">
        <div class="pageR">
          <el-pagination
            @current-change="handleChange"
            :page-size="page.pageSize"
            :page-sizes="[5, 10, 20, 30]"
            :current-page="page.pageNum"
            background
            layout="prev, pager, next,sizes,jumper"
            @size-change="handleSizeChange"
            :total="page.total"
          ></el-pagination>
        </div>
      </div>
    </div>
    <div v-else></div>
  </section>
</template>
<script>
export default {
  computed: {
    rolesMenu () {
      return this.$store.state.user.btns;
    },
  },
  data () {
    return {
      options: [],
    };
  },
  props: {
    maxHeight: {
      type: [String, Number],
      default () {
        return 1000;
      },
    },
    data: {
      type: Array,
      default () {
        return [];
      },
    },
    page: {
      type: Object,
      default () {
        return {
          total: 0,
          pageSize: 5,
          pageNum: 1,
        };
      },
    },
    config: {
      type: Object,
      default () {
        return {};
      },
    },
    formatter: {
      type: Function,
    },
    dataLists: {
      type: Object,
      default () {
        return {};
      },
    },
    btnSelect: {
      type: Array,
      default () {
        return [];
      },
    },
    tableLabelName: {
      type: String,
      default: "操作",
    },
    tableLabelNamesec: {
      type: String,
      default: "审核",
    },
    showPagination: {
      tyep: Boolean,
      default: true,
    },
  },

  methods: {
    /**
     * 获取按钮信息
     */
    getBtnInfo (item, row) {
      let obj = item.getBtnInfo ? item.getBtnInfo(item, row) : false;
      return (obj && obj.label) || "";
    },
    /**
     * 设置勾选
     */
    setSelect (row) {
      if (!row) {
        this.$refs.table.clearSelection();
      } else {
        this.$refs.table.clearSelection();
        this.$refs.table.toggleRowSelection(row, true);
      }
    },
    /**
     * 是否显示按钮
     */
    isShowBtn (item, row) {
      // let role = this.roleBtn(item.code || ""); // &&
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
    format (num) {
      var reg = /\d{1,3}(?=(\d{3})+$)/g;
      return (num + "").replace(reg, "$&,");
    },
    fmt (row, column, value) {
      if (this.formatter) {
        let key = column.property ? column.property : column;
        let v = this.formatter(key, value, row, this.dataLists);
        if (v) {
          return v;
        }
      }
      return value;
    },
    /**
     * 点击全选复选框
     */
    selectDataAll () {
      if (!this.config.multiple) {
        this.$refs.table.clearSelection();
        this.$emit("selected", []);
      }
    },
    /**
     * 点击复选框
     */
    selectData (arr) {
      let res = [];
      if (!this.config.multiple) {
        this.$refs.table.clearSelection();
        if (arr.length > 0) {
          res = [arr[arr.length - 1]];
          this.$refs.table.toggleRowSelection(res[0], true);
        }
        this.$emit("selected", res);
      }
    },
    handleCurrentChange (val) {
      // console.log(val);
    },
    /**
     * 用户选取数据改变时，仅多选模式传递数据
     */
    selectChange (val) {
      if (this.config.multiple) {
        this.$emit("selected", val);
      }
    },
    //复选框禁用判断
    selectable (row, index) {
      if (this.$parent.selectable) {
        return this.$parent.selectable.call(this, row);
      }
      return true;
    },
    /**
     * 点击事件
     */
    rowClick (item) {
      this.$emit("clickRow", item);
    },
    /**
     * 点击排序事件
     */
    sortChange (column) {
      this.$emit("sortChange", column);
    },
    //操作事件
    callFn (item, row, name, index) {
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
    // 递归找method
    getDeepMethod (parent, method, sum, limit) {
      sum++;
      if (!parent) {
        console.log("父组件没有写此方法");
        return {};
      } else if (sum == limit) {
        console.log("父组件没有写此方法");
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
    //下一页
    handleChange (page) {
      this.$emit("pageChanged", page);
    },
    /**
     * 分页大小
     */
    handleSizeChange (size) {
      this.$emit("sizeChanged", size);
    },
  },
  mounted () {
    // console.log(this.page);
    this.$nextTick(() => {
      this.$refs.table.doLayout(); //解决表格错位
    });
  },
};
</script>
<style scoped>
/* 强制改变样式居中 */
.el-divider--vertical {
  margin-right: 8px !important;
  margin-left: 0 !important;
}
</style>
<style lang="scss" scope>
.pageBox{
    display: flex;
    flex-direction: row-reverse;
    margin-top: 24px;
}
.tab_btn {
  cursor: pointer;
  .ts {
    font-size: 22px;
  }
}
.tab_btn + .tab_btn {
  .ts {
    margin-left: 10px;
  }
}
.el-button--text {
  font-size: 14px;
}
</style>
