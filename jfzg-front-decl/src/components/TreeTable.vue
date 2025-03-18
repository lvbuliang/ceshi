<template>
  <div v-if="hideData.showElForm">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      :label-width="otherConfig"
      class="demo-ruleForm"
    >
      <!-- <el-form-item
        label="年度计划:"
        prop="name"
        class="col-8"
        v-if="hideData.showYearPlan"
      >
        <el-select
          v-model="name"
          placeholder="请选择规划内容"
          :options="yearPlanOptions"
          :props="{ multiple: true, checkStrictly: true }"
          clearable
        ></el-select>
      </el-form-item> -->
      <!-- <el-form-item
        label="关联规划："
        prop="name"
        :class="[ruleForm.col ? 'col-' + ruleForm.col : 'col-' + 12]"
        v-if="hideData.showPlan"
      >
        <el-cascader
          v-model="ruleForm.name"
          placeholder="请选择规划内容"
          :options="ruleForm.planOptions"
          :props="{
            multiple: true,
            // checkStrictly: true,
            value: 'id',
            label: 'name',
            children: 'planList',
          }"
          clearable
          collapse-tags
          @change="handleCascaderChange"
        ></el-cascader>
      </el-form-item> -->
      <!-- v-if="hideData.showtreeTable" -->
      <el-form-item
        label="重点任务设置："
        prop="region"
        v-if="hideData.showtreeTable"
        class="col-24"
      >
        <el-button type="primary" size="mini" @click="add" round>
          关联任务
        </el-button>
        <el-button
          type="default"
          size="mini
        "
          @click="deleteBtn"
          round
        >
          删除
        </el-button>
        <!-- deleteParentAndChildren ,deleteSelectedNodes-->
      </el-form-item>
    </el-form>
    <el-table
      @selection-change="handleSelectionChange"
      ref="multipleTable"
      :data="tableData"
      height="242px"
      row-key="id"
      border
      :header-cell-style="{ backgroundColor: '#f7f7f7', color: '#333' }"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column type="selection" width="50" align="center">
        <template slot-scope="scope">
          <el-checkbox
            v-model="scope.row.checked"
            @change="handleNodeCheck(scope.row)"
            :checked="scope.row.checked"
          ></el-checkbox>
        </template>
      </el-table-column>
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
          <img src="../assets/empty.png" class="empty_img" />
          <span class="empty_null"> 暂无内容 </span>
        </div>
      </slot>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "treeTable",
  props: {
    /* addBtn: {
      type: Boolean,
      default() {
        return true;
      },
    },
    deleteBtn: {
      type: Boolean,
      default() {
        return true;
      },
    }, */
    otherConfig: {
      type: String,
      default() {
        return "130px";
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
          showPlan: false,
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
      dialogVisible: false,
      selectData: [],
      tableData: [],
      multipleSelection: [], //选择数据
      readCardStatus: "", //单选值
      msgBoxKey: 0, //用于解决弹框缓存问题
      selectAll: false, //表头复选框状态
      arrFilter: [],
      selectIds: [], //关联规划选择的id
      preDataList: [],
      selectedPlanData: [], //保存处理后的选中规划集合
      lastDataList: [], //编辑时关联规划有删除数据
      beChangedTableData: [], //未表更表格数据
    };
  },
  watch: {
    read_card: {
      handler(v) {
        console.log(v);
      },
      deep: true,
    },
    allPlanDataList: {
      handler(val) {
        console.log("val", val);
        this.arrFilter = val;
        this.arrFilter.map((item) => {
          if (item.name == "ztfzgh") {
            item.name = "总体发展规划";
          } else if (item.name == "zxfzgh") {
            item.name = "专项发展规划";
          } else if (item.name == "bmfzgh") {
            item.name = "部门发展规划";
          } else if (item.name == "zdgcgh") {
            item.name = "重点工程规划";
          }
          // item.id = item.order;
          // delete item.order;
          return item;
        });
        this.ruleForm.planOptions = this.arrFilter;
        console.log("修改后", this.ruleForm.planOptions);
      },
      deep: true,
    },
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
  mounted() {
    console.log("接收到数据", this.allPlanDataList);
    this.arrFilter = this.allPlanDataList;
    this.arrFilter.map((item) => {
      if (item.name == "ztfzgh") {
        item.name = "总体发展规划";
      } else if (item.name == "zxfzgh") {
        item.name = "专项发展规划";
      } else if (item.name == "bmfzgh") {
        item.name = "部门发展规划";
      } else if (item.name == "zdgcgh") {
        item.name = "重点工程规划";
      }
      // item.id = item.order;
      // delete item.order;
      return item;
    });
    this.ruleForm.planOptions = this.arrFilter;
    console.log("修改后", this.ruleForm.planOptions);
    // 合并planList
    this.preDataList = [];
    this.ruleForm.planOptions.forEach((i) => {
      // console.log("i", i.planList);
      this.preDataList.push(...i.planList);
    });
    // console.log("----122235", this.preDataList);
    // 编辑时初始化选项
    const result = this.initSelectPlanItemsList.map((item) => [
      undefined,
      item.planId,
    ]);
    this.ruleForm.name = result;
    console.log("result", result);
  },

  methods: {
    // 递归过滤数据
    filterData(data, delIdsList) {
      console.log("过滤");
      return data.filter((item) => {
        if (delIdsList.includes(item.planId)) {
          return false; // 删除项不返回，即过滤掉
        }

        if (item.children && item.children.length > 0) {
          item.children = this.filterData(item.children, delIdsList); // 递归调用，过滤子级数据
        }

        return true; // 非删除项返回
      });
    },
    handleCascaderChange(selectedItems) {
      console.log("-++++++", this.ruleForm.name);
      console.log("tabledata", this.tableData);
      // 选中选项变更数据
      this.lastDataList = this.ruleForm.name
        .filter((item) => typeof item[1] !== "undefined") // 过滤掉 undefined 值
        .map((item) => item[1]); //只保存第二个元素id
      console.log(this.lastDataList);
      console.log(this.initSelectPlanItemsList);
      // 选中的表格数据
      this.beChangedTableData = this.tableData;
      const n = this.beChangedTableData.map((item) => item.planId);
      const uniqueN = [...new Set(n)];
      const delList = uniqueN.filter((item3) => {
        return !this.lastDataList.some((item2) => item2 == item3);
      });
      console.log("uniqueN", uniqueN);
      console.log("delList", delList);
      // 初始化原选中id
      const firstIdsList = this.initSelectPlanItemsList.map(
        (item) => item.planId
      );
      // 过滤删除id集合
      const delIdsList = firstIdsList
        .filter((item) => {
          return !this.lastDataList.some((item2) => item2 == item);
        })
        .map((item3) => item3);
      console.log("删除id集合", delIdsList);
      console.log("原始Id", firstIdsList);
      console.log("254", this.ruleForm.planOptions);
      this.preDataList = [];
      this.ruleForm.planOptions.forEach((i) => {
        // console.log("i", i.planList);
        this.preDataList.push(...i.planList);
      });
      // console.log("----", this.preDataList);
      //关联规划
      this.selectedPlanData = this.lastDataList.map((itemId) => {
        const item = this.preDataList.find((option) => option.id === itemId);
        return {
          planId: itemId,
          planName: item ? item.name : "",
          planType: item ? item.type : "",
        };
      });
      // 变更表格
      if (delIdsList.length) {
        this.tableData = this.filterData(this.tableData, delIdsList);
        this.$emit("delPreDataList", this.tableData, this.selectedPlanData);
      }
      // 新增时变更数据
      if (delList.length) {
        this.tableData = this.filterData(this.tableData, delList);
        this.$emit("delPreDataList", this.tableData, this.selectedPlanData);
      }
      this.$emit("delPreDataList", this.tableData, this.selectedPlanData);
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    add() {
      /* if (!this.ruleForm.name.length) {
        this.$message.warning("请先选择关联规划！");
        return;
      } */
      console.log(this.ruleForm.name);
      this.selectIds = this.ruleForm.name
        .filter((item) => typeof item[1] !== "undefined") // 过滤掉 undefined 值
        .map((item) => item[1]); //只保存第二个元素id
      console.log(this.selectIds);
      console.log("12", this.preDataList);
      // 根据选中id查找对应planName、planType
      this.selectedPlanData = this.selectIds.map((itemId) => {
        const item = this.preDataList.find((option) => option.id === itemId);
        return {
          planId: itemId,
          planName: item ? item.name : "",
          planType: item ? item.type : "",
        };
      });
      console.log("Selected Items:", this.selectedPlanData);
      //传递选中的id集合
      this.$emit("zdAdd", true, this.selectIds, this.selectedPlanData);
      // this.dialogVisible = true;
    },
    deleteBtn() {
      this.msgBoxKey = Math.random();
      this.readCardStatus = "";
      console.log(this.readCardStatus, "readCardStatus");
      // 若无选中删除任务则不唤起弹框
      if (this.multipleSelection.length == 0) {
        this.$message({
          type: "warning",
          message: "请选择删除任务",
        });
        return;
      }
      const h = this.$createElement;
      this.$msgbox({
        type: "warning",
        title: "确认删除",
        message: h("div", { key: this.msgBoxKey }, [
          "删除后不可恢复，请谨慎操作。",
          h(
            "div",
            {
              style: {
                marginTop: "10px",
                marginBottom: "5px",
              },
            },
            [
              h(
                "input",
                {
                  style: {
                    cursor: "pointer",
                  },
                  attrs: {
                    type: "radio",
                    name: "chooseRadio",
                    value: "1",
                    checked: this.readCardStatus === "1",
                  },
                  on: {
                    change: () => {
                      this.readCardStatus = "1";
                    },
                  },
                },
                []
              ),
              h(
                "span",
                {
                  class: "el-radio__label",
                },
                `只删除选中任务，其子级任务自动上升一级。`
              ),
            ]
          ),

          h("div", null, [
            h(
              "input",
              {
                style: {
                  cursor: "pointer",
                },
                attrs: {
                  type: "radio",
                  name: "chooseRadio",
                  value: "2",
                  checked: this.readCardStatus === "2",
                },
                on: {
                  change: () => {
                    this.readCardStatus = "2";
                  },
                },
              },
              []
            ),
            h(
              "span",
              { class: "el-radio__label" },
              `删除选中任务及其所有子级任务。`
            ),
          ]),
        ]),
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            if (this.readCardStatus !== "") {
              done();
            } else {
              this.$message({
                type: "warning",
                message: "请选择",
              });
            }
          } else {
            done();
          }
        },
      })
        .then((action) => {
          if (this.readCardStatus == "") {
            this.$message({
              type: "warning",
              message: "请选择",
            });
          } else if (this.readCardStatus == "1") {
            this.deleteSelectedNodes();
            this.$message({
              type: "success",
              message: "操作成功",
            });
            this.$emit("zdDelete", this.tableData);
          } else if (this.readCardStatus == "2") {
            this.deleteParentAndChildren();
            this.$message({
              type: "success",
              message: "操作成功",
            });
            this.$emit("zdDelete", this.tableData);
          }
        })
        .catch((e) => {
          this.$message({
            type: "success",
            message: "已取消",
          });
        })
        .finally(() => {
          // 清空单选值缓存
          this.readCardStatus = "";
        });
    },
    // 处理点击父,子节点状态需与父一致
    handleNodeCheck(node) {
      console.log("点击的节点", node);
      if (node.children) {
        node.children.forEach((child) => {
          child.checked = node.checked;
          this.handleNodeCheck(child); // 递归处理子级节点
        });
      }
      this.tableData.splice();
      this.updateSelectedNodes();
      console.log("原数组变了吗", this.tableData);
    },
    // 处理选中的数据
    updateSelectedNodes() {
      const multipleSelection = [];
      const stack = [...this.tableData];
      while (stack.length) {
        // const node = stack.pop();
        const node = stack.pop();
        // console.log("node", node);
        if (node.checked) {
          multipleSelection.push(node);
        }
        if (node.children) {
          stack.push(...node.children);
        }
      }
      this.multipleSelection = multipleSelection;
      console.log(this.multipleSelection, stack);
    },

    // 选中数据(表头复选框全选与取消)
    handleSelectionChange(val) {
      this.selectAll = !this.selectAll;
      this.multipleSelection = val;
      this.tableData.forEach((node) => {
        node.checked = this.selectAll;
        this.handleNodeCheck(node); // 更新子级节点的选中状态
      });
      console.log(val);
    },
    // 处理删除某父级子节点升一级
    deleteSelectedNodes() {
      this.multipleSelection.forEach((node) => {
        const parentNode = this.findParentNode(node);
        if (parentNode) {
          const index = parentNode.children.findIndex(
            (child) => child.id === node.id
          );
          if (index !== -1) {
            if (node.children && node.children.length > 0) {
              parentNode.children.splice(index, 1, ...node.children);
            } else {
              parentNode.children.splice(index, 1);
            }
          }
        } else {
          const index = this.tableData.findIndex((item) => item.id === node.id);
          if (index !== -1) {
            if (node.children && node.children.length > 0) {
              this.tableData.splice(index, 1, ...node.children);
            } else {
              this.tableData.splice(index, 1);
            }
          }
        }
      });
      this.multipleSelection = [];
    },
    findParentNode(node) {
      const stack = [...this.tableData];
      while (stack.length) {
        const currNode = stack.pop();
        if (currNode.children) {
          if (currNode.children.some((child) => child.id === node.id)) {
            return currNode;
          }
          stack.push(...currNode.children);
        }
      }
      return null;
    },
    // 选中父级删除父级以及子数据
    deleteParentAndChildren() {
      this.multipleSelection.forEach((node) => {
        const parentNode = this.findParentNode(node);
        if (parentNode) {
          const index = parentNode.children.findIndex(
            (child) => child.id === node.id
          );
          if (index !== -1) {
            parentNode.children.splice(index, 1);
          }
        } else {
          const index = this.tableData.findIndex((item) => item.id === node.id);
          if (index !== -1) {
            this.tableData.splice(index, 1);
          }
        }
      });
      this.multipleSelection = [];
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
