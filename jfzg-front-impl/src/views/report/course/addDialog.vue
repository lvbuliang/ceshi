<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="800px"
    :title="title"
    append-to-body
    class="add-task-dialog"
  >
    <div class="dialog-body" v-if="editableTabs.length > 0">
      <sr-nav-page :type="2" :project="srNavPageObj"></sr-nav-page>
      <FormAdd
        v-if="!id || fromData"
        :isShowTab="false"
        ref="formAdd"
        :fromData="fromData"
        :editableTabs="editableTabs"
        :otherConfig="otherConfig"
      ></FormAdd>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false" size="small">取消</el-button>
      <el-button type="primary" v-debounce="[() => onConfirmClick(), config.deTime]" size="small">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { moduleCode } from "./const.js";
import config from "@/settings.js";
import FormAdd from "@/components/srFormAdd.vue";
import { api_getCustomFormTemplate } from "@/api/index";
import { api_save, api_update, api_detail } from "@/api/course";

export default {
  components: {
    FormAdd,
  },
  props: {
    srNavPageObj: Object,
  },
  data() {
    return {
      config,
      otherConfig: {
        labelNum: 100,
      },
      dialogVisible: false,
      editableTabs: [],
      fromData: {},
      templateId: "",
      id: "",
      addTaskForm: {},
      taskId: "",
      parentId: "",
    };
  },
  computed: {
    title() {
      return "过程文档报备";
    },
  },
  watch: {
    dialogVisible(val) {
      if (!val) {
        // 重置表单
        this.taskId = "";
        this.parentId = "";
        if (this.$refs["formAdd"].resetForm) {
          this.$refs["formAdd"].resetForm();
        }
        // console.log('this.fromData',this.fromData)
        // console.log('this.addTaskForm',this.addTaskForm)
        if (
          this.fromData &&
          this.fromData.taskAttach &&
          this.fromData.taskAttach.length > 0
        ) {
          this.fromData.taskAttach = undefined;
        }
        if (
          this.addTaskForm &&
          this.addTaskForm.data &&
          this.addTaskForm.data.taskAttach &&
          this.addTaskForm.data.taskAttach.length > 0
        ) {
          this.addTaskForm.data.taskAttach = undefined;
        }
        if (
          this.addTaskForm &&
          this.addTaskForm.config &&
          this.addTaskForm.config.length > 0
        ) {
          let taskAttachConfig = this.addTaskForm.config.filter(
            (item) => item.bind == "taskAttach"
          );
          if (taskAttachConfig && taskAttachConfig.length > 0) {
            if (
              taskAttachConfig[0]["fileList"] &&
              taskAttachConfig[0]["fileList"].length > 0
            ) {
              taskAttachConfig[0]["fileList"] = [];
            }
          }
        }
      }
    },
  },
  created() {
    this.getCustomFormTemplate();
  },
  methods: {
    async init() {
      this.dialogVisible = true;

      let formArr =
        this.editableTabs[0]?.formArr &&
        typeof this.editableTabs[0]?.formArr == "string"
          ? JSON.parse(this.editableTabs[0]?.formArr)
          : this.editableTabs[0]?.formArr;
      let formAdd = formArr[0]?.selectData?.formAdd;

      if (formAdd) {
        let index = this.$utils.getArrIndex(formAdd.config, "file", "bind");

        if (index > -1) {
          formAdd.config[index].fileList = [];
          formAdd.data.file = "";
        }
      }
    },
    async onConfirmClick() {
      let data = this.$refs["formAdd"]?.validateFun();
      if (!data) return;
      let params = {
        ...data,
        projectId: this.srNavPageObj.projectId
          ? this.srNavPageObj.projectId
          : this.srNavPageObj.id,
        templateId: this.templateId,
        projectName: this.srNavPageObj.projectName,
        projectCode: this.srNavPageObj.projectCode,
        editable: false,
        file: Array.isArray(data.file) ? JSON.stringify(data.file) : "",
      };

      if (params.data == "[]") {
        delete params.data;
      }
      if (this.id) {
        params.id = this.id;
      }

      if (params.id) {
        let res = await api_update(params);
        if (res.msg.code == "0000") {
          this.$message.success("修改成功");
          this.dialogVisible = false;
        }
      } else {
        let res2 = await api_save(params);

        if (res2.msg.code == "0000") {
          this.$message.success("新增成功");
          this.dialogVisible = false;
        }
      }

      this.$emit("refreshList");
    },

    getCustomFormTemplate() {
      api_getCustomFormTemplate({
        moduleCode,
      }).then((res) => {
        if (res.data && res.msg.code == "0000") {
          this.editableTabs =
            typeof res.data.templateDetail == "string" &&
            JSON.parse(res.data.templateDetail);
          this.templateId = res.data.id;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.add-task-dialog {
  ::v-deep {
    .tabsDataTitle {
      display: none;
    }
    .el-dialog {
      .el-dialog__body {
        overflow-x: hidden;
        overflow-y: auto;
        padding-top: 10px;
      }
      .el-dialog__header {
        text-align: center;
        padding: 14px ​24px;
      }
      .el-dialog__footer {
        padding: 11px 24px;
      }
    }
  }
  .dialog-footer {
    text-align: center;
    button {
      border-radius: 16px;
      min-width: 76px;
      font-size: 14px;
    }
  }
}
</style>