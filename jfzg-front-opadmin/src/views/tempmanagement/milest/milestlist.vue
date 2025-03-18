
<template>
  <div class="unitList" v-if="$route.meta.lv == 2">
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
      >
      </FTable>
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
          >
          </FForm>
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
  <router-view v-else></router-view>
</template>

<script>
import FSearch from "@/components/FSearch/index.vue";
import FTable from "@/components/FTable/index.vue";
import FForm from "@/components/FForm/form-add";
import {
  api_qtDeliverable,
  api_addMilestoneList,
  api_editMilestoneList,
  api_removeMilestoneList,
  api_getMilestoneList,
  api_getDictcodeList,
} from "@/api/tempmanagement/tempmanagement";
export default {
  components: {
    FSearch,
    FTable,
    FForm,
  },
  data() {
    return {
      search: {
        textMaxNum: 4, // label 最多几个字默认4个
        showExpand: false, // 是否显示展开收起，默认超过三个显示
        minNum: 4, // 收起显示几个, 默认3个
        config: [
          {
            type: "text",
            name: "模板名称",
            placeholder: "请输入模板名称",
            bind: "templName",
          },
          {
            type: "projectTypeCascader",
            name: "项目类型",
            placeholder: "请选择项目类型",
            bind: "projectTypeList",
            data: "stateList", // 对应enum中的stateList
          },
        ],
        form: {
          templName: "",
          projectTypeList: [],
        },
        enum: {
          stateList: [],
        },
      },
      table: {
        data: [],
        config: {
          fixed: "right",
          operationWidth: 300, // 操作列的宽度，不传默认180
          title: "表格的标题", // 表格标题
          // index: "序号", // 是否显示序号
          selection: false,
          multiple: true,
          // rowKey: "buid",
          header: [
            // 表格列配置
            {
              name: "里程碑模板名称",
              prop: "templName",
              width: 200,
              cellSlot: false,
            },
            { name: "节点数量", prop: "nodeCount", width: 100, haveHTML: true },
            { name: "项目类型", prop: "projectTypeName", width: 200 },
            // { name: "金额", prop: "priceType", width: 200, haveHTML: true },
            { name: "排序", prop: "sort", haveHTML: true },
            { name: "说明", prop: "templDesc", width: 400 },
            { name: "创建时间", prop: "createTime", width: 170 },
          ],
          outerBtn: [], // 外部按钮
          innerBtn: [
            {
              name: "设置里程碑阶段",
              method: "setmiest",
              field: "i",
            },
            {
              name: "编辑",
              method: "edit",
              field: "id",
            },
            {
              name: "删除",
              method: "delete",
              field: "id",
              validate: this.btnValidate,
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
            name: "模板名称",
            placeholder: "请输入模板名称",
            bind: "templName",
            trigger: "blur", // 校验时机
            required: "请输入模板名称", // 必填需要指定提示信息
          },
          {
            col: 24,
            type: "projectTypeCascader",
            name: "项目类型",
            placeholder: "请选择项目类型",
            bind: "projectTypeList",
            required: "请输入项目名称",
            dataList: "stateList",
          },
          /*   {
            col: 24,
            type: "select",
            name: "项目类型",
            placeholder: "请选择项目类型",
            bind: "projectType",
            required: "请输入项目名称",
            dataList:"stateList"
          }, */
          {
            col: 24,
            type: "number2",
            name: "排序",
            placeholder: "",
            bind: "sort",
            required: "请输入项目名称",
          },
          // {
          //   col: 24,
          //   type: "select",
          //   name: "金额",
          //   placeholder: "请选择金额",
          //   bind: "priceType",
          //   dataList:"money",
          //   required: "请选择金额"
          // },
          {
            col: 24,
            type: "textarea",
            maxlength: 200,
            name: "说明",
            placeholder: "请输入相关说明",
            bind: "templDesc",
            required: "请输入相关说明",
          },
        ],
        data: {
          // nodeCount: '',
          templName: "",
          // projectType: "",
          projectTypeList: [],
          createTime: "",
          templDesc: "",
        },
        enums: {
          // money:[
          //   {
          //     dataValue:0,
          //     dataName:'一百万以上'
          //   },
          //   {
          //     dataValue:1,
          //     dataName:'一百万以下'
          //   }
          // ],
          stateList: [],
        },
        rules: {},
      },
      params: {
        pageSize: 10,
        pageNum: 1,
      },
      active: "停用",
    };
  },
  watch: {
    $route() {
      this.search.form.templName = "";
      // this.search.form.projectType = "";
      this.search.form.projectTypeList = [];
      this.init();
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    btnValidate(item, row) {
      console.log(item, row);
      if (item.name == "删除" && row.canDelete) {
        //canDelete标准模版不能删除
        return false;
      } else {
        return true;
      }
    },
    // 获取项目类型
    async getPeojectList() {
      let res = await api_getDictcodeList();
      console.log("项目类型", res.data);
      /* let NewArr = res.data.map(({ itemCode, chName }) => ({
        dataValue: itemCode,
        dataName: chName,
      }));
      console.log(NewArr); */
      this.$set(this.search.enum, "stateList", res.data);
      this.$set(this.form.enums, "stateList", res.data);
    },
    init() {
      this.getUnitList();
      // this.select();
      this.getPeojectList();
    },
    // 项目类型
    async select() {
      let NewList = { topic: "JFZG_XMKGL_TYPE" };
      let res1 = await api_qtDeliverable(NewList);
      let NewArr = res1.data.map(({ itemCode, chName }) => ({
        dataValue: itemCode,
        dataName: chName,
      }));
      this.$set(this.search.enum, "stateList", NewArr);
      this.$set(this.form.enums, "stateList", NewArr);
    },
    // 设置里程碑阶段
    setmiest(row) {
      console.log(row);
      this.$router.push({
        name: "milestlistDetail",
        query: {
          templId: row.templId,
          priceType: row.priceType,
        },
      });
    },
    // 获取列表
    getUnitList(page) {
      let params = {
        page: this.table.page.pageNum,
        size: this.table.page.pageSize,
      };
      const searchForms = this.search.form;
      Object.keys(searchForms).map((item) => {
        if (searchForms[item]) {
          params[item] = searchForms[item];
        }
      });
      if (page) {
        params.page = page;
      }
      console.log("22", params);
      api_getMilestoneList(params).then((res) => {
        console.log(res);
        if (res.msg.message == "SUCCESS") {
          res.data.list.forEach((item0) => {
            this.form.enums.stateList.forEach((item) => {
              let result = item.children.find(
                (item2) => item2.codeId == item0.projectType
              );
              if (result) {
                item0.projectTypeName = item.label + "-" + result.chName;
              }
            });
          });
          this.$set(this.table, "data", res.data.list);
          this.$set(this.table.page, "pageNum", res.data.pageNum);
          this.$set(this.table.page, "pageSize", res.data.pageSize);
          this.$set(this.table.page, "total", res.data.total);
        }
      });
    },
    // 新增单位
    add() {
      for (let key in this.form.data) {
        this.form.data[key] = "";
      }
      this.dialog = {
        dialogVisible: true,
        width: "700px",
        title: "新增里程碑模板",
        type: 0,
        buid: "",
      };
    },
    // 编辑
    edit(row) {
      this.dialog = {
        dialogVisible: true,
        width: "700px",
        title: "编辑里程碑模板",
        type: 1,
        buid: row.templId,
      };
      console.log("行", row, this.form.enums.stateList);
      this.form.enums.stateList.forEach((item) => {
        let result = item.children.find(
          (item2) => item2.codeId == row.projectType
        );
        if (result) {
          this.form.data.projectTypeList = [item.value, String(result.codeId)];
        }
      });
      this.form.data.triceType = row.triceType;
      // this.form.data.projectTypeList = row.projectTypeList;
      this.form.data.templName = row.templName;
      this.form.data.sort = row.sort;
      this.form.data.templDesc = row.templDesc;
    },
    // 删除
    delete(row) {
      this.$confirm(
        "此操作将永久删除该数据, 是否继续?",
        "确认要删除此条数据吗？",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          api_removeMilestoneList(row.templId).then((res) => {
            if (res.msg.message == "SUCCESS") {
              this.$message({
                message: "删除成功",
                type: "success",
              });
              this.getUnitList(1);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    // 弹框确定
    springBox_determine(type) {
      console.log("type", type);
      var parameter = new Promise((resolve, reject) => {
        this.$refs["modelMgrRef"].$refs["modelMgrRefForm"].validate((valid) => {
          if (valid) {
            resolve();
          }
        });
      });
      Promise.all([parameter]).then(() => {
        // let params = this.form.data;
        let params = Object.assign({}, this.form.data);
        console.log("params", params);
        // debugger;
        if (type == 0) {
          console.log("11");
          console.log("ssss", params);
          this.addUnit(params);
        } else {
          params.templId = this.dialog.buid;
          this.updateUnit(params);
        }
      });
    },
    // 弹框取消
    colseDialog() {
      this.$refs["modelMgrRef"].$refs["modelMgrRefForm"].resetFields();
      this.dialog.dialogVisible = false;
    },
    // 弹框关闭前回调
    bClose(done) {
      this.$refs["modelMgrRef"].$refs["modelMgrRefForm"].resetFields();
      done();
    },
    // 新增单位
    addUnit(data) {
      console.log("data", data);
      debugger;
      api_addMilestoneList(data).then((res) => {
        if (res.msg.code == "0000") {
          this.$message({
            message: "新建成功",
            type: "success",
          });
          this.getUnitList(1);
          this.dialog.dialogVisible = false;
        } else {
          this.$message({
            message: res.msg.message,
            type: "warning",
          });
        }
      });
    },
    // 编辑单位
    updateUnit(data) {
      api_editMilestoneList(data).then((res) => {
        if (res.msg.message == "SUCCESS") {
          this.$message({
            message: "编辑成功",
            type: "success",
          });
          this.getUnitList(1);
          this.dialog.dialogVisible = false;
        }
      });
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
    formatter(key, val, row) {
      if (key === "priceType") {
        if (row["priceType"] == 0) {
          return "<div>一百万以下</div>";
        } else if (row["priceType"] == 1) {
          return "<div>一百万以上</div>";
        }
      }
    },
  },
};
</script>
