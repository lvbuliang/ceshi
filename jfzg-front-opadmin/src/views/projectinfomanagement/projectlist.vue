<template>
  <div class="peoplel" v-if="$route.meta.lv == 2">
    <FSearch :form="search" @queryList="getProjectList(1)"></FSearch>
    <FTable
      class="tableData"
      :data="table.data"
      :config="table.config"
      :page="table.page"
      @pageChanged="getPageData"
      @sizeChanged="getSizeDate"
    >
      <div slot="cellSlot" slot-scope="scope">
        <div class="table_unitName" v-if="scope.scope.row.beginDate">
          {{
            scope.scope.row.beginDate.substring(
              0,
              scope.scope.row.beginDate.length - 8
            ) +
            " - " +
            scope.scope.row.endDate.substring(
              0,
              scope.scope.row.endDate.length - 8
            )
          }}
        </div>
      </div>
    </FTable>
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
        <div slot="footer" class="dialog-footer">
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
import FTable from "@/components/FTable/index.vue";
import FForm from "@/components/FForm/form-add.vue";
import FSearch from "@/components/FSearch/index.vue";
import {
  api_queryProjectList, //获取项目列表
  api_editProjectInfo, //编辑项目信息
  api_queryMemberList, //项目成员列表
  api_removeMember, //移除项目成员
  api_addMember, //新增项目成员
  api_canAddMemberList, //可添加成员列表
  api_saveOrUpdate, // 里程碑到期提醒接口
} from "@/api/projectManage/projectManage";
export default {
  components: {
    FTable,
    FSearch,
    FForm,
  },
  data() {
    return {
      form: {
        title: "表单标题",
        config: [
          {
            col: 24,
            type: "text",
            name: "项目名称",
            placeholder: "请输入项目名称",
            bind: "projectName",
            trigger: "blur", // 校验时机
            // required: "请输入项目名称", // 必填需要指定提示信息
          },
          {
            col: 24,
            type: "text",
            name: "项目编号",
            placeholder: "请输入项目编号",
            bind: "projectCode",
          },
          {
            col: 12,
            type: "text",
            name: "项目联系人",
            placeholder: "请输入项目联系人",
            bind: "contactName",
          },
          {
            col: 12,
            type: "text",
            name: "项目联系人电话",
            placeholder: "请输入联系电话",
            bind: "contactMobile",
          },
          {
            col: 24,
            type: "text",
            name: "联系人邮箱",
            placeholder: "请输入联系人邮箱",
            bind: "contactEmail",
          },
          // {
          //   col: 24,
          //   type: "text",
          //   name: "承建单位项目经理",
          //   placeholder: "请输入承建单位项目经理",
          //   bind: "people",
          // },
          {
            col: 24,
            type: "radio",
            name: "是否为重点项目",
            bind: "isImport",
            dataList: "importList",
          },
          {
            col: 24,
            type: "number2",
            name: "里程碑提醒时间",
            bind: "days",
            placeholder: "请输入天数",
            isHide: true,
          },
          {
            col: 24,
            type: "textarea",
            name: "建设内容",
            placeholder: "请输入建设内容",
            bind: "content",
          },
        ],
        data: {
          projectName: "",
          projectCode: "",
          contactName: "",
          contactMobile: "",
          contactEmail: "",
          people: "",
          isImport: "",
          days: "",
          content: "",
        },
        enums: {
          stateList: [
            {
              dataName: "统筹单位",
              dataValue: "1",
            },
            {
              dataName: "建设单位",
              dataValue: "2",
            },
            {
              dataName: "承建单位",
              dataValue: "3",
            },
            {
              dataName: "监理单位",
              dataValue: "4",
            },
            {
              dataName: "第三方服务机构",
              dataValue: "5",
            },
            {
              dataName: "业务单位",
              dataValue: "6",
            },
            {
              dataName: "设计单位",
              dataValue: "7",
            },
            {
              dataName: "云服务商",
              dataValue: "8",
            },
          ],
          importList: [
            {
              dataName: "是",
              dataValue: true,
            },
            {
              dataName: "否",
              dataValue: false,
            },
          ],
        },
        rules: {},
      },
      //registerId
      table: {
        data: [], // 表格数据
        config: {
          fixed: "right",
          operationWidth: 250, // 操作列的宽度，不传默认180
          title: "", // 表格标题
          header: [
            // 表格列配置
            {
              name: "项目名称",
              prop: "projectName",
              width: 200,
            },
            {
              name: "项目编号",
              prop: "projectCode",
              width: 200,
            },
            {
              name: "项目周期",
              prop: "projectlife",
              cellSlot: true,
              width: 200,
            },
            {
              name: "建设单位",
              prop: "buildUnitName",
              width: 200,
            },
            {
              name: "承建单位",
              prop: "supplyerUnitName",
              width: 150,
            },
            {
              name: "监理单位",
              prop: "supervisorUnitName",
              width: 150,
            },
          ],
          innerBtn: [
            // 表格内部操作按钮，不需要操作列的innerBtn 写成false
            {
              name: "编辑项目信息", // 按钮名称，优先显示icon
              method: "edit", // 点击执行该页面methods中对应的方法
              className: "font-size-20",
            },
            {
              name: "设置成员",
              method: "setpeople",
              className: "font-size-20",
              field: "registerId", // 控制按钮显示隐藏的字段，目前仅支持单一字段，常显的按钮不需要传
              value: [null], // 需要根
            },
          ],
        },
        page: {
          // 分页配置
          total: 12, //总条数
          pages: 2, //总页数
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
      search: {
        textMaxNum: 4, // label 最多几个字默认4个
        showExpand: false, // 是否显示展开收起，默认超过三个显示
        minNum: 3, // 收起显示几个, 默认3个
        config: [
          {
            type: "text",
            name: "项目名称",
            placeholder: "请输入项目名称",
            bind: "projectName", // 对应this.search.data对象的field1
          },
          {
            type: "text",
            name: "单位名称",
            placeholder: "请输入单位名称",
            bind: "buName", // 对应this.search.data对象的field1
          },
          {
            type: "text",
            name: "项目编号",
            placeholder: "请输入项目编号",
            bind: "projectCode", // 对应this.search.data对象的field1
          },
        ],

        form: {
          projectName: "",
          buName: "",
          projectCode: "",
        },
      },
      newData: "",
    };
  },
  watch: {
    $route: {
      handler(val, oldval) {
        this.search.form = {
          projectName: "",
          buName: "",
          projectCode: "",
        };
        this.init();
      },
      // 深度观察监听
      deep: true,
    },
  },
  mounted() {
    this.init();
    let urlData = window.location.href.split("?")[1];
    this.newData = urlData.split("#")[0];
    if (this.newData == "sys=whportalsite") {
      this.$set(this.form.config[this.form.config.length - 2], "isHide", false);
    }
  },
  methods: {
    init() {
      this.getProjectList();
    },
    // 获取项目列表
    getProjectList(page) {
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
      api_queryProjectList(params).then((res) => {
        console.log(res);
        if (res.msg.message == "SUCCESS") {
          this.$set(this.table, "data", res.data.list);
          this.$set(this.table.page, "pageNum", res.data.pageNum);
          this.$set(this.table.page, "pageSize", res.data.pageSize);
          this.$set(this.table.page, "total", res.data.total);
        }
      });
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
        // 编辑操作
        if (type == 1) {
          let data = {
            ...this.form.data,
          };
          let data1 = {
            projectId: this.form.data.projectId,
            days: this.form.data.days,
            projectName: this.form.data.projectName,
          };
          console.log(data1);
          api_editProjectInfo(data).then((res) => {
            try {
              if (res.msg.code == "0000") {
                if (this.newData == "sys=whportalsite") {
                  api_saveOrUpdate(data1).then((res) => {
                    if (res.msg.code == "0000") {
                    }
                  });
                }
                this.$message({
                  type: "success",
                  message: "编辑成功!",
                });
                this.colseDialog();
                this.getProjectList();
              } else {
                this.$message.error("编辑失败");
              }
            } catch (error) {
              console.log(error);
            }
          });
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
    //   编辑
    edit(row) {
      // console.log(row);
      this.dialog = {
        dialogVisible: true,
        width: "660px",
        title: "编辑项目信息",
        type: 1,
      };
      this.form.data = {
        projectId: row.projectId,
        projectName: row.projectName,
        projectCode: row.projectCode,
        contactName: row.contactName,
        contactMobile: row.contactMobile,
        contactEmail: row.contactEmail,
        isImport: row.isImport,
        content: row.content,
      };
    },
    getPageData(pageNum) {
      this.table.page.pageNum = pageNum;
      this.getProjectList();
    },
    getSizeDate(pageSize) {
      this.table.page.pageSize = pageSize;
      this.getProjectList();
    },
    eventNotify(ref) {
      this.$refs[ref].init();
    },
    setpeople(row) {
      this.$router.push({
        name: "peoplemanage",
        query: {
          buid: row.supplyerId,
          projectId: row.projectId,
          projectName: row.projectName,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.peoplel {
  /deep/.search {
    .container {
      padding: 0px 0px 18px 0px;
    }
  }
}
</style>