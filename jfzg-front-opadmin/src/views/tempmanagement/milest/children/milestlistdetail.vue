
<template>
  <div class="unitList">
    <!-- 搜索  -->
    <div class="search">
      <FSearch :form="search" @queryList="getUnitList(1)"></FSearch>
    </div>
    <!-- 操作按钮 -->
    <div class="buttonOperation">
      <!-- <el-button type="primary" size="small" @click="add"><i class="el-icon-circle-plus-outline el-icon--left"></i>新增单位</el-button> -->
      <el-button class="exportbtnFour" type="primary" @click="add">
        <i class="el-icon-circle-plus-outline el-icon--left"></i>添加</el-button
      >
    </div>
    <!-- 表格 -->
    <div class="table">
      <FTable
        :data="table.data"
        :config="table.config"
        :page="table.page"
        @pageChanged="getPageData"
        @sizeChanged="getSizeDate"
        :formatter="formatter"
      ></FTable>
    </div>
    <!-- 弹框 -->
    <div class="springBox">
      <el-dialog
        class="common-dialog"
        :title="dialog.title"
        :visible.sync="dialog.dialogVisible"
        :width="dialog.width"
        :before-close="bClose"
        append-to-body
      >
        <div class="springBox_form">
          <FForm
            ref="modelMgrRef"
            :config="form.config"
            :form="form.data"
            :rules="form.rules"
            :enums="form.enums"
            refForm="modelMgrRefForm"
            @eventNotify="eventNotify"
            :column="2"
          ></FForm>
        </div>
        <div slot="footer" class="dialog-footer" style="text-align: center">
          <el-button
            type="primary"
            size="small"
            style="width: 80px; height: 32px"
            @click="springBox_determine(dialog.type)"
            >确定</el-button
          >
          <el-button
            type
            size="small"
            style="width: 80px; height: 32px"
            @click="colseDialog"
            >取消</el-button
          >
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import FSearch from "@/components/FSearch/index.vue";
import FTable from "@/components/FTable/index.vue";
import FForm from "@/components/FForm/form-add";
import {
  api_getMilepostList,
  api_addIdList,
  api_addLcbList,
  api_addMilepostList,
  api_removeMilepostList,
} from "@/api/tempmanagement/tempmanagement";
// import { delete } from 'vue/types/umd';
export default {
  components: {
    FSearch,
    FTable,
    FForm,
  },
  data() {
    return {
      search: {
        textMaxNum: 10, // label 最多几个字默认4个
        showExpand: false, // 是否显示展开收起，默认超过三个显示
        minNum: 4, // 收起显示几个, 默认3个
        config: [
          {
            type: "text",
            name: "里程碑节点名称",
            placeholder: "请输入模板名称",
            bind: "stageName", // 对应this.search.data对象的field1
          },
        ],
        form: {
          templName: "",
        },
        enum: {
          stateList: [
            {
              dataName: "待审核",
              dataValue: "1",
            },
            {
              dataName: "未通过",
              dataValue: "2",
            },
            {
              dataName: "已通过",
              dataValue: "3",
            },
          ],
        },
      },
      table: {
        data: [],
        config: {
          operationWidth: 150, // 操作列的宽度，不传默认180
          title: "表格的标题", // 表格标题
          index: "", // 是否显示序号
          header: [
            // 表格列配置
            {
              name: "里程碑节点名称",
              prop: "stageName",
              width: 150,
              cellSlot: false,
            },
            { name: "排序", prop: "sort", width: 70 },
            { name: "权重", prop: "stageWeight", width: 70 },
            { name: "阶段完成标志", prop: "stageCompleteDesc" },
            { name: "里程碑类型", prop: "flag", haveHTML: true },
            { name: "创建时间", prop: "createTime", width: 150 },
            { name: "创建人", prop: "createrName", width: 150 },
          ],
          outerBtn: [], // 外部按钮
          innerBtn: [
            {
              name: "编辑",
              method: "edit",
              field: "id",
            },
            {
              name: "删除",
              method: "remove",
              field: "id",
            },
          ],
        },
        page: {
          // 分页配置
          total: 12, //总条数
          pages: "", //总页数
          pageSize: 5, //每页展示多少个
          pageNum: 1, //当前页
        },
      },
      dialog: {
        dialogVisible: false,
        width: "",
        title: "",
        type: "",
        buid: "",
      },
      form: {
        title: "表单标题",
        config: [
          {
            col: 24,
            type: "text",
            name: "节点名称",
            placeholder: "请输入节点名称",
            bind: "stageName",
            trigger: "blur", // 校验时机
            required: "请输入节点名称", // 必填需要指定提示信息
          },
          {
            col: 24,
            type: "number2",
            name: "排序",
            bind: "sort",
            required: "请选择排序",
          },
          {
            col: 24,
            type: "number2",
            name: "权重",
            bind: "stageWeight",
            required: "请选择权重",
          },
          {
            col: 24,
            type: "radio",
            name: "里程碑类型",
            bind: "flag",
            required: "请选择里程碑类型",
            dataList: "stateList",
          },
          {
            col: 24,
            type: "textarea",
            name: "完成标志",
            placeholder: "请输入完成标志",
            bind: "stageCompleteDesc",
            required: "请输入完成标志",
            maxlength: 200,
          },
        ],
        data: {
          stageWeight: "",
          stageCompleteDesc: "",
          flag: "",
          sort: "",
          stageName: "",
        },
        enums: {
          stateList: [
            {
              dataName: "普通",
              dataValue: "0",
            },
            {
              dataName: "初验",
              dataValue: "1",
            },
            {
              dataName: "试运行",
              dataValue: "2",
            },
            {
              dataName: "竣工验收",
              dataValue: "3",
            },
            {
              dataName: "终验",
              dataValue: "4",
            },
          ],
        },
        rules: {},
      },
      active: "停用",
      select: [],
    };
  },
  mounted() {
    // if(this.$route.query.priceType == '1'){
    //   this.form.enums.stateList[3].dataName = '终验'
    // }else{
    //   this.form.enums.stateList[3].dataName = '竣工验收'
    // }
    this.init();
  },
  methods: {
    init() {
      this.getUnitList();
      // this.getBuPropertyList()
    },
    remove(row) {
      this.$confirm(
        "此操作将永久删除该数据, 是否继续?",
        "确认要删除此条数据吗？",
        {
          showClose: false,
          showCancelButton: true, // 是否显示取消按钮
          showConfirmButton: true, // 是否显示确认按钮
          confirmButtonText: "确定", // 确定按钮名字
          cancelButtonText: "取消", // 取消按钮名字
          customClass: "changsha_confirm changsha_confirm_success", //  类名必传支持三种样式
          type: "warning",
        }
      )
        .then(() => {
          let data = {
            stageId: row.id,
          };
          if (this.table.data.length == 1) {
            api_removeMilepostList(data).then((res) => {
              if (res.msg.code == "0000") {
                this.getUnitList(1);
              }
            });
          } else {
            api_removeMilepostList(data).then((res) => {
              if (res.msg.code == "0000") {
                this.getUnitList();
              }
            });
          }
        })
        .catch(() => {});
    },
    getUnitList(page) {
      let params = {
        pageNum: this.table.page.pageNum,
        pageSize: this.table.page.pageSize,
        templId: this.$route.query.templId,
      };
      if (page) {
        params.pageNum = page;
        const searchForms = this.search.form;
        Object.keys(searchForms).map((item) => {
          if (searchForms[item]) {
            params[item] = searchForms[item];
          }
        });
      }
      api_getMilepostList(params).then((res) => {
        if (res.msg.message == "SUCCESS") {
          if (res.data) {
            this.$set(this.table, "data", res.data.list);
            this.$set(this.table.page, "pageNum", res.data.pageNum);
            this.$set(this.table.page, "pageSize", res.data.pageSize);
            this.$set(this.table.page, "total", res.data.total);
          } else {
            this.$set(this.table, "data", []);
            this.$set(this.table.page, "pageNum", 0);
            this.$set(this.table.page, "pageSize", 0);
            this.$set(this.table.page, "total", 0);
          }
        }
      });
    },
    // 新增
    add() {
      this.dialog = {
        dialogVisible: true,
        width: "800px",
        title: "添加里程碑节点",
        type: 0,
        buid: "",
      };
      this.form.data.stageName = "";
      this.form.data.sort = "";
      this.form.data.flag = "";
      this.form.data.stageCompleteDesc = "";
    },
    // 编辑
    edit(row) {
      this.dialog = {
        dialogVisible: true,
        width: "800px",
        title: "编辑里程碑节点",
        type: 1,
        buid: row.id,
      };
      console.log(row);
      this.form.data.stageName = row.stageName;
      this.form.data.stageWeight = +row.stageWeight;
      this.form.data.sort = row.sort;
      if (row.flag == null) {
        this.form.data.flag = "0";
      } else {
        this.form.data.flag = row.flag + "";
      }
      this.form.data.stageCompleteDesc = row.stageCompleteDesc;
    },

    // 弹框确定
    springBox_determine(type) {
      var parameter = new Promise((resolve, reject) => {
        this.$refs["modelMgrRef"].$refs["modelMgrRefForm"].validate((valid) => {
          if (valid) {
            resolve();
          }
        });
      });
      Promise.all([parameter]).then(() => {
        let data = {
          templId: this.$route.query.templId,
          stageWeight: this.form.data.stageWeight,
          stageCompleteDesc: this.form.data.stageCompleteDesc,
          sort: this.form.data.sort,
          flag: this.form.data.flag,
          id: this.dialog.buid,
          stageName: this.form.data.stageName,
        };
        if (type == 0) {
          delete data.id;
        }
        if (data.flag == "0") {
          data.flag = null;
        }
        api_addMilepostList(data).then((res) => {
          if (res.msg.message == "SUCCESS") {
            this.$message({
              message: "添加成功",
              type: "success",
            });
            this.dialog.dialogVisible = false;
            this.getUnitList(1);
          }
        });
      });
    },
    formatter(key, val, row) {
      if (key === "flag") {
        if (row["flag"] == null) {
          return "<div>普通</div>";
        } else if (row["flag"] == "1") {
          return "<div>初验</div>";
        } else if (row["flag"] == "2") {
          return "<div>试运行</div>";
        } else if (row["flag"] == "3") {
          return "<div>竣工验收</div>";
        } else if (row["flag"] == "4") {
          return "<div>终验</div>";
        }
      }
    },
    // 弹框取消
    colseDialog() {
      this.$refs["modelMgrRef"].$refs["modelMgrRefForm"].resetFields();
      this.dialog.dialogVisible = false;
    },
    // 弹框关闭前回调
    bClose(done) {
      done();
    },
    getPageData(pageNum) {
      this.table.page.pageNum = pageNum;
      this.getUnitList();
    },
    getSizeDate(pageSize) {
      this.table.page.pageSize = pageSize;
      this.getUnitList();
    },
    eventNotify(ref) {
      this.$refs[ref].init();
    },
  },
};
</script>
<style lang="scss" scoped>
.unitList {
  /deep/ .search {
    .el-form-item {
      .el-form-item__label {
        width: 130px !important;
      }
    }
  }
}
.tc {
  margin-bottom: 20px;
  /deep/ .el-form-item {
    width: 380px !important;
  }
}
</style>
