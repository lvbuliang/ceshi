<template>
  <div>
    <div class="step-two-active-list no-active-wrap" style="margin-top: 16px">
      <!-- 手动抽取结果 -->
      <SrTable
        :data="table.data"
        :config="table.tableConfig"
        :page="table.page"
        @select="selected"
        @selectAll="selectAll"
        ref="manuaLZhuanjiaTableRef"
        v-if="ruleType == 1"
      >
        <template slot="cellSlot" slot-scope="scope">
          {{ scope.scope.row.statusName }}
        </template>
      </SrTable>
      <!-- 混合抽取、随机抽取 -->
      <el-row v-if="ruleType != 1">
        <el-col :span="12">
          <span class="tree_extract_title"
            >专家列表({{ canhuizhuanjiaTable.data.length }})</span
          >
        </el-col>
        <el-col :span="12">
          <div style="color: transparent">占位</div>
        </el-col>
      </el-row>
      <SrTable
        :data="canhuizhuanjiaTable.data"
        :config="canhuizhuanjiaTable.tableConfig"
        :page="canhuizhuanjiaTable.page"
        @select="selected2"
        @selectAll="selectAll2"
        ref="canhuizhuanjiaTableRef"
        v-if="ruleType != 1"
      >
        <template slot="cellSlot" slot-scope="scope">
          {{ scope.scope.row.statusName }}
        </template>
      </SrTable>
      <el-row v-if="ruleType != 1">
        <el-col :span="12">
          <span class="tree_extract_title"
            >备选列表({{ beixuanzhuanjiaTable.data.length }})</span
          >
        </el-col>
        <el-col :span="12">
          <div style="color: transparent">占位</div>
        </el-col>
      </el-row>
      <SrTable
        :data="beixuanzhuanjiaTable.data"
        :config="beixuanzhuanjiaTable.tableConfig"
        :page="beixuanzhuanjiaTable.page"
        @select="selected3"
        @selectAll="selectAll3"
        ref="beixuanzhuanjiaTableRef"
        v-if="ruleType != 1"
      >
        <template slot="cellSlot" slot-scope="scope">
          {{ scope.scope.row.statusName }}
        </template></SrTable
      >
    </div>
  </div>
</template>
  
  <script>
import {
  queryExtract,
  queryByReviewId,
  autoExtract,
  queryDetail,
} from "@/api/planProject";
export default {
  name: "",
  components: {},
  props: {
    expertList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    reviewId: {
      type: Number,
      default: null,
    },
    isInSystem: {
      type: Number,
      default: null,
    },
    ruleType: {
      type: Number,
      default: null,
    },
  },

  data() {
    return {
      canhuizhuanjiaTable: {
        data: [], // 表格数据
        tableConfig: {
          rowClassName: this.rowClassName,
          title: "表格的标题", // 表格标题
          highlightCurrentRow: true, // 控制表格是否单选
          // maxLength: 20, // 一行最多显示多少字，超出显示popver

          tooltipEffect: "light",
          header: [
            {
              label: "姓名",
              prop: "expertName",
            },
            {
              label: "技术方向",
              prop: "jsName",
            },
            {
              label: "行业领域",
              prop: "hyName",
            },
            {
              label: "评审次数",
              prop: "reviewTimes",
              width: 80,
            },
          ],
          selectionConfig: {
            display: true,
            width: "40",
          },
          operateConfig: {
            display: false,
            label: "操作",
            width: "156",
            fixed: "right",
            hideHeaderSetting: true,
            hideHeaderexport: true,
          },
          innerBtn: [
            {
              name: "发送邀请",
              method: "yaoqing",
              type: "text",
              size: "medium",
              icon: "el-icon-document",
              className: "font-size-20",
              validate: this.btnValidate, //自定义判断是否展示按钮权限
            },
          ],
        },
        page: {
          // 分页配置
          total: 0, //总条数
          pages: 0, //总页数
          pageSize: 10, //每页展示多少个
          pageSizes: [10, 20, 30],
          pageNum: 1, //当前页
          background: true,
          // layout: 'total, prev, pager, next, sizes,jumper'
        },
      },
      beixuanzhuanjiaTable: {
        data: [], // 表格数据
        tableConfig: {
          rowClassName: this.rowClassName,
          title: "表格的标题", // 表格标题
          highlightCurrentRow: true, // 控制表格是否单选
          // maxLength: 20, // 一行最多显示多少字，超出显示popver
          tooltipEffect: "light",
          header: [
            {
              label: "姓名",
              prop: "expertName",
            },
            {
              label: "技术方向",
              prop: "jsName",
            },
            {
              label: "行业领域",
              prop: "hyName",
            },
            {
              label: "评审次数",
              prop: "reviewTimes",
              width: 80,
            },
          ],
          selectionConfig: {
            display: true,
            width: "40",
          },
          operateConfig: {
            display: false,
            label: "操作",
            width: "156",
            fixed: "right",
            hideHeaderSetting: true,
            hideHeaderexport: true,
          },
          innerBtn: [
            {
              name: "发送邀请",
              method: "yaoqing",
              type: "text",
              size: "medium",
              icon: "el-icon-document",
              className: "font-size-20",
              validate: this.btnValidate, //自定义判断是否展示按钮权限
            },
          ],
        },
        page: {
          // 分页配置
          total: 0, //总条数
          pages: 0, //总页数
          pageSize: 10, //每页展示多少个
          pageSizes: [10, 20, 30],
          pageNum: 1, //当前页
          background: true,
          // layout: 'total, prev, pager, next, sizes,jumper'
        },
      },
      // 手动抽取
      table: {
        data: [], // 表格数据
        tableConfig: {
          rowClassName: this.rowClassName,
          title: "表格的标题", // 表格标题
          highlightCurrentRow: true, // 控制表格是否单选
          // maxLength: 20, // 一行最多显示多少字，超出显示popver
          selectionConfig: {
            display: true,
            width: "70",
            selectable: this.selectable,
          },
          tooltipEffect: "light",
          header: [
            {
              label: "姓名",
              prop: "name",
            },
            {
              label: "行业领域",
              prop: "hyName",
            },
            {
              label: "评审次数",
              prop: "time",
            },
            {
              label: "评审平均分",
              prop: "avgScore",
            },
          ],
        },
        // page: {
        //   // 分页配置
        //   total: 0, //总条数
        //   pages: 0, //总页数
        //   pageSize: 10, //每页展示多少个
        //   pageSizes: [10, 20, 30],
        //   pageNum: 1, //当前页
        //   background: true,
        //   // layout: 'total, prev, pager, next, sizes,jumper'
        // },
      },
      // 临时
      form: {
        config: [
          {
            name: "指定专家",
            type: "selectPeople",
            bind: "zhidingList",
            col: 24,
            className: "selectPeople",
            isHide: true,
          },
          {
            name: "参会专家",
            type: "selectPeople",
            bind: "canhuiList",
            col: 24,
            className: "selectPeople",
            delPeople: "delPeople",
          },
          {
            name: "备选专家",
            type: "selectPeople",
            bind: "beixuanList",
            col: 24,
            className: "selectPeople",
            delPeople: "delPeople",
          },
        ],
        data: {
          zhidingList: [],
          canhuiList: [],
          beixuanList: [],
        },
      },
    };
  },
  watch: {},

  created() {
    console.log(this.reviewId, this.isInSystem, this.ruleType);
  },
  mounted() {
    console.log("11", this.ruleType);
    if (this.ruleType == 1) {
      //手动抽取
      console.log("手动抽取", this.ruleType);
      this.getQueryByReviewId();
      this.getZhuanJiaQueryExtract();
    } else if (this.ruleType == 2) {
      // 自动抽取
      console.log("自动抽取", this.ruleType);
      this.getQueryByReviewId(true);
    } else if (this.ruleType == 3) {
      // 混合抽取
      console.log("混合抽取", this.ruleType);
      this.getEvadeExpert();
      this.getQueryByReviewId(true);
    }
  },
  methods: {
    // 手动抽取手动选择
    selected(val) {
      console.log("手动val", val);
      this.$emit("sumitExpert", val);
    },
    // 手动抽取全选
    selectAll(val) {
      this.$emit("sumitExpert", val);
    },
    // 指定专家
    selected2(val) {
      console.log("指定val", val);
      this.$emit("assignExpert", val);
    },
    // 指定专家全选
    selectAll2(val) {
      this.$emit("assignExpert", val);
    },
    // 备选专家
    selected3(val) {
      console.log("备选val", val);
      this.$emit("standbyExpert", val);
    },
    // 备选专家全选
    selectAll3(val) {
      this.$emit("standbyExpert", val);
    },
    getEvadeExpert() {
      queryDetail({ reviewId: this.reviewId }).then(({ data }) => {
        if (
          data.zdExpertId &&
          data.zdExpertId.length &&
          data.zdExpertIdList &&
          data.zdExpertIdList.length
        ) {
          data.zdExpertIdList.forEach((res) => {
            res.isDel = true;
          });
          console.log("指定专家", data.zdExpertIdList);
          this.$emit("zhiding", data.zdExpertIdList);
        }
      });
    },
    //手动抽取
    getQueryExtract(num, jfids = []) {
      if (num) {
        console.log(num);
        // this.table.page.pageNum = num;
      }
      this.loading = true;
      let param = {
        pageNum: 1,
        pageSize: 9999,
        reviewId: this.reviewId,
        jfids: jfids,
        // ...this.search.formData,
      };
      console.log(param);
      queryExtract(param).then((res) => {
        console.log("wwww", res);
        this.table.data = res.data.records.map((item) => {
          if (!this.hasChildrenFlag) {
            item.hasChildren = false;
          }
          return item;
        });

        this.table.page.total = res.data.total;
        this.loading = false;
      });
    },
    getZhuanJiaQueryExtract(num = 1) {
      // let canhuiIds = this.form.data.canhuiList.map(({ id }) => id);
      // let beixuanIds = this.form.data.beixuanList.map(({ id }) => id);
      // this.getQueryExtract(num, [...canhuiIds, ...beixuanIds]);
      this.getQueryExtract(num);
      // this.$refs.oneSearch.$refs.SrTable.clearSelection();
    },

    getQueryByReviewId(isSuiji = false) {
      console.log("isSuiji", isSuiji);
      console.log("参数", this.reviewId);
      queryByReviewId({ reviewId: this.reviewId, status: 4 }).then((res) => {
        console.log("数据", res);
        if (res.msg.code === "0000") {
          if (res.data[0] && JSON.stringify(res.data[0]) != "{}") {
            res.data[0].forEach((res) => {
              res.isDel = true;
            });
          } else if (res.data[1] && JSON.stringify(res.data[1]) != "{}") {
            res.data[1].forEach((res) => {
              res.isDel = true;
            });
          } else if (res.data[2] && JSON.stringify(res.data[2]) != "{}") {
            res.data[2].forEach((res) => {
              res.isDel = true;
            });
          }
          console.log("随机false", res.data[0]);
          console.log("随机false", res.data[1]);
          // debugger;
          this.$set(this.form.data, "canhuiList", res.data[0] || []);
          this.$set(this.form.data, "beixuanList", res.data[1] || []);
        }
        if (isSuiji) {
          console.log("isSuiji", isSuiji);
          autoExtract({ reviewId: this.reviewId }).then(({ data, msg }) => {
            console.log("随机true", data);
            // debugger;
            // console.log(this.form.data);
            if (data.bx && data.bx.length) {
              data.bx.forEach((res) => {
                res.isDel = true;
              });
              this.$set(this.beixuanzhuanjiaTable, "data", [
                ...data.bx,
                ...this.form.data.beixuanList,
              ]);
            }
            if (data.ch && data.ch.length) {
              data.ch.forEach((res) => {
                res.isDel = true;
              });
              this.$set(this.canhuizhuanjiaTable, "data", [
                ...data.ch,
                ...this.form.data.canhuiList,
              ]);
            }
            this.$set(this.form.data, "canhuiList", [
              ...data.ch,
              ...this.form.data.canhuiList,
            ]);
            this.$set(this.form.data, "beixuanList", [
              ...data.bx,
              ...this.form.data.beixuanList,
            ]);
          });
          console.log("this.beixuanzhuanjiaTable", this.beixuanzhuanjiaTable);
          console.log("this.canhuizhuanjiaTable", this.canhuizhuanjiaTable);
          console.log("canhuiList", this.form.data.canhuiList);
          console.log("beixuanList", this.form.data.beixuanList);
          this.loading = false;
        }
      });
    },
  },
};
</script>
  
  <style lang="scss" scoped>
.step-two-btn {
  margin: 14px 8px 14px 24px;
  display: flex;
  justify-content: flex-end;

  .el-button {
    // width: 76px;
    height: 28px;
    /* background: $--color-primary; */
    border-radius: 16px;
    padding: 5px 14px;
  }
}
.step-two-active-list {
  margin: 0px 8px 0px 24px;
  padding: 8px;
  padding-top: 0;
  // height: 294px;
  height: 510px;
  overflow-y: auto;
  overflow-x: hidden;
}
.no-active-wrap {
  // height: 400px;
  // height: 575px;
  height: 470px;
}
.el-collapse {
  // width: 100%;
  border-top: none;
  border-bottom: none;
}
.el-collapse-item {
  padding: 4px 0px;
}
::v-deep .el-collapse-item__header:hover {
  background-color: #f7f7f7;
}
::v-deep .el-collapse-item__content {
  margin-bottom: 0;
}
::v-deep .el-collapse-item__header {
  font-size: 14px;
  border: none;
  height: 32px;
  // border-radius: 8px 8px 0px 0px !important;
  border-radius: 8px 8px 8px 8px !important;
  // text-overflow: ellipsis; /* 溢出显示省略号 */
  // overflow: hidden; /* 溢出隐藏 */
  // white-space: nowrap; /* 强制不换行 */
}
.item-wrap {
  .el-collapse-item__header {
    span {
      padding-left: 10px;
    }
  }
}
.collapse-title {
  text-overflow: ellipsis; /* 溢出显示省略号 */
  overflow: hidden; /* 溢出隐藏 */
  white-space: nowrap; /* 强制不换行 */
}
.el-collapse-item__content {
  font-size: 14px;
}
::v-deep .el-collapse-item__wrap {
  border-bottom: none;
  padding: 0px 16px;
}
.collapse-item-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  //   flex-direction: column;
}
.tree_extract_title {
  font-size: 14px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #333333;
  display: inline-block;
  margin: 8px 0;
}
</style>
  