<template>
  <div>
    <!-- <el-row class="row_box" v-if="hideData.showPlan">
      <el-col :key="index" :span="24" :class="['value_box']">
        <label class="label-item ellipsis" :title="formList.label">
          {{ formList.label }}
        </label>
        <span :class="['overflow', 'context']">
          <div v-if="!formList.length > 0">-</div>
          <div v-else v-showMoreBtn class="btn-more-wrapper">
            <el-button
              type="text"
              class="btn-more"
              @click="showDialog(formList)"
            >
              更多
            </el-button>
            <span :title="formatContext(formList)" class="text-more">
              {{ formatContext(formList) }}
            </span>
          </div>
        </span>
      </el-col>
    </el-row> -->
    <el-table
      ref="multipleTable"
      :data="tableData"
      row-key="id"
      max-height="260"
      border
      :header-cell-style="{ backgroundColor: '#fafafa', color: '#666' }"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="taskName" label="重点任务名称" width="290">
      </el-table-column>
      <el-table-column prop="sourceName" label="任务来源"> </el-table-column>
      <el-table-column prop="needProjectSupport" label="是否需要项目支撑">
        <template slot-scope="scope">
          <span>{{
            scope.row.needProjectSupport == 1
              ? "否"
              : scope.row.needProjectSupport == 0
              ? "是"
              : "-"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="leadUnit" label="牵头单位"></el-table-column>
      <el-table-column
        prop="reponsibilityUnit"
        label="责任单位"
      ></el-table-column>
      <el-table-column
        prop="planName"
        label="所属规划名称"
        v-if="hideData.ghmc"
      >
      </el-table-column>
      <el-table-column
        v-if="hideData.ghlx"
        prop="planTypeName"
        label="所属规划类型"
      ></el-table-column>
      <slot name="empty" slot="empty">
        <div class="table_empty">
          <img src="./../assets/empty.png" class="empty_img" />
          <span class="empty_null"> 暂无内容 </span>
        </div>
      </slot>
    </el-table>
    <el-dialog
      v-if="valueDialog.visible"
      :title="valueDialog.title"
      :visible.sync="valueDialog.visible"
      width="800px"
      center
      class="value-dialog"
      append-to-body
    >
      <div class="value-dialog-content">
        <div v-if="valueDialog.isHtml" v-html="valueDialog.content"></div>
        <div v-else>{{ valueDialog.content }}</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import emptyImg from "../assets/empty.png";
export default {
  name: "ThreeTableView",
  directives: {
    showMoreBtn: {
      inserted(el) {
        const btnMore = el.querySelector(".btn-more");
        const textMore = el.querySelector(".text-more");
        if (btnMore && textMore) {
          btnMore.style.display =
            textMore.scrollWidth > textMore.offsetWidth ? "block" : "none";
          textMore.style.marginRight =
            textMore.scrollWidth > textMore.offsetWidth ? "32px" : 0;
        }
      },
      componentUpdated(el) {
        const btnMore = el.querySelector(".btn-more");
        const textMore = el.querySelector(".text-more");
        if (btnMore && textMore) {
          btnMore.style.display =
            textMore.scrollWidth > textMore.offsetWidth ? "block" : "none";
          textMore.style.marginRight =
            textMore.scrollWidth > textMore.offsetWidth ? "32px" : 0;
        }
      },
    },
  },
  props: {
    tableData: {
      type: Array,
      default() {
        return [];
      },
    },
    form: {
      type: Array,
      default() {
        return [];
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
  },
  data() {
    return {
      formList: {
        label: "关联规划",
        value: "11111",
      },
      tableData: [],
      valueDialog: {
        visible: false,
        title: "",
        content: "",
      },
    };
  },
  created() {},
  mounted() {
    console.log("form数据", this.form);
    this.formList = this.form;

    this.formList.label = "关联规划";
  },
  watch: {},
  methods: {
    formatContext(item) {
      return item.map((item2) => item2.planName).join(",");
    },
    showDialog(item) {
      // console.log(item);
      // console.log({ label, value });
      let type = "html";
      this.valueDialog.visible = true;
      this.valueDialog.title = item.label;
      this.valueDialog.content = this.formatContext(item);
      this.valueDialog.isHtml = type === "html";
    },
  },
};
</script>

<style lang="scss" scoped>
.el-col-24 {
  .label-item {
    width: 16.666665%;
  }

  .overflow,
  .context {
    width: 83.333335%;
  }
}

.el-col-16 {
  .label-item {
    width: 25%;
  }

  .overflow,
  .context {
    width: 75%;
  }
}

.overflow {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
/* .el-table {
  width: 1000px;
  height: 250px;
} */
.value_box,
.html_box {
  display: flex;
}

.value_box {
  // justify-content: center;
}

.label-item {
  padding: 10px 12px;
  color: #666;
  width: 50%;
  display: inline-block;
  background: #fafafa;
  // border: 1px solid $border-color-center;
  border-right: 1px solid #efefef;
  border-left: 1px solid #efefef;
  border-top: 1px solid #efefef;
  box-sizing: border-box;
  font-size: 14px;
  float: left;
}

.context,
.SrTxt_Box {
  background: #ffffff;
  border-top: 1px solid #efefef;
  border-right: 1px solid #efefef;
  // border-bottom: 1px solid $border-color-center;
  font-size: 14px;
  display: inline-block;
  color: #666;
  width: 50%;
  padding: 9px 12px;
  box-sizing: border-box;
  float: left;
  min-height: 40px;
  word-break: break-all;
  // position: relative;
  // z-index: -1;
  .btn-more-wrapper {
    position: relative;
  }
  .btn-more {
    position: absolute;
    right: 0;
    top: 2px;
    padding: 0;
    background-color: #fff;
  }
  .btn-more ~ span {
    display: block;
    margin-right: 32px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
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
.el-table {
  border-radius: 8px;
}
::v-deep .el-table td {
  padding: 9.5px 0 !important;
}
::v-deep .el-table th {
  padding: 9.5px 0 !important;
}
</style>
