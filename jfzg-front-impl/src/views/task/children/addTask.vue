<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="800px"
    :title="title"
    append-to-body
    class="add-task-dialog"
    @close="handleClose"
  >
    <div class="dialog-body" v-if="editableTabs.length > 0">
      <FormAdd
        v-if="!id || fromData"
        :isShowTab="false"
        ref="formAdd"
        :fromData="fromData"
        :editableTabs="editableTabs"
        :project_Id="project_Id"
      >
      </FormAdd>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        v-debounce="[() => onConfirmClick(), config.deTime]"
        size="small"
        >确定</el-button
      >
      <el-button @click="dialogVisible = false" size="small">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { moduleCode } from "../const.js";
import config from "@/settings.js";
import FormAdd from "@/components/srFormAdd.vue";
import { api_getCustomFormTemplate } from "@/api/index";
import {
  api_queryStageList,
  api_queryAllMembers,
  api_addTask,
  api_getTaskDetail,
  api_updateTask
} from "@/api/shishi/taskList.js";
import { queryByUnitType, getDetailById } from "@/api/bianzhi/index.js";

export default {
  components: {
    FormAdd
  },
  data() {
    return {
      config,
      project_Id: "",
      dialogVisible: false,
      editableTabs: [],
      fromData: {},
      templateId: "",
      id: "",
      addTaskForm: {},
      taskId: "",
      parentId: ""
    };
  },
  computed: {
    title() {
      if (this.taskId) {
        return "编辑任务";
      } else if (this.parentId) {
        return "创建子任务";
      }
      return "创建任务";
    }
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
            item => item.bind == "taskAttach"
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
    }
  },
  mounted() {
    // this.getCustomFormTemplate()
  },
  methods: {
    handleClose() {
      Object.assign(this.$data, this.$options.data());
    },
    init(taskId, isCreateSub) {
      if (isCreateSub) {
        if (taskId) {
          this.parentId = taskId;
        }
      } else {
        if (taskId) {
          this.taskId = taskId;
          this.getTaskDetail();
        }
      }
      this.project_Id = this.$route.query.projectId;
      this.getCustomFormTemplate();
      this.dialogVisible = true;
    },
    inits(projectId) {
      if (this.$refs["formAdd"]&&this.$refs["formAdd"].resetForm) {
          this.$refs["formAdd"].resetForm()
        }
      this.editableTabs = [];
      this.project_Id = projectId;
      this.getCustomFormTemplate();
      this.dialogVisible = true;
    },
    getTaskDetail() {
      api_getTaskDetail({ taskId: this.taskId }).then(res => {
        if (res.data.taskAttach) {
          res.data.taskAttach = JSON.parse(res.data.taskAttach);
        }
        if (res.data.priorityLevel) {
          res.data.priorityLevel = res.data.priorityLevel + "";
        }
        if (res.data.isChecked) {
          res.data.isChecked = "1";
        } else {
          res.data.isChecked = "2";
        }
        this.resetChecker(res.data.isChecked);
        this.fromData = res.data;
      });
    },
    onConfirmClick() {
      let data = this.$refs["formAdd"].validateFun();
      if (data) {
        let params = {
          projectId: this.project_Id,
          ...data
        };
        params.isChecked = params.isChecked == "1" ? true : false;
        // 检查人
        if (data.checkJfid) {
          let checkers = this.addTaskForm.enums.checkerList.filter(
            item => item.dataValue == data.checkJfid
          );
          if (checkers && checkers.length > 0) {
            let checkName = checkers[0]["dataName"];
            params["checkName"] = checkName;
          }
        }
        // 负责人
        if (data.responsibleJfid) {
          let responsibles = this.addTaskForm.enums.responsibleList.filter(
            item => item.dataValue == data.responsibleJfid
          );
          if (responsibles && responsibles.length > 0) {
            let responsibleName = responsibles[0]["dataName"];
            params["responsibleName"] = responsibleName;
          }
        }
        if (data.taskAttach) {
          params["taskAttach"] = JSON.stringify(data.taskAttach);
        }
        if (params.data) {
          delete params.data;
        }
        if (this.taskId) {
          params["taskId"] = this.taskId;
          api_updateTask(params).then(res => {
            if (res && res.success) {
              this.$message.success("编辑成功");
              this.dialogVisible = false;
              if (this.fromData && this.fromData.parentId) {
                this.$emit("refreshList", this.fromData.parentId);
              } else {
                this.$emit("refreshList");
              }
            }
          });
        } else {
          if (this.parentId) {
            params["parentId"] = this.parentId;
          }
          api_addTask(params).then(res => {
            if (res && res.success) {
              this.$message.success("创建成功");
              this.dialogVisible = false;
              if (this.parentId) {
                this.$emit("refreshList", this.parentId);
              } else {
                this.$emit("refreshList");
              }
            }
          });
        }
      }
    },
    getStageList() {
      // 获取项目里程碑列表
      api_queryStageList(this.project_Id).then(res => {
        if (res && res.success && res.data.length > 0) {
          // 里程碑列表
          this.addTaskForm.enums.stageList = this.$utils.enumsDataNameValue(
            res.data,
            "stageName",
            "stageId"
          );
        }
      });
    },

    getAllMemberList() {
      var params = {
        projectId: this.project_Id
      };
      queryByUnitType(params).then(res => {
        var allmember = [
          ...res.data["JSDW"].members,
          ...res.data["JSDW"].principals,
          ...res.data["CJDW"].members,
          ...res.data["CJDW"].principals,
          ...res.data["JLDW"].members,
          ...res.data["JLDW"].principals
        ];

        var Fzr_data = [];
        for (var i = 0; i < allmember.length; i++) {
          var map = {
            fullname: allmember[i].fullname,
            mobile: allmember[i].mobile,
            jfid: allmember[i].jfid,
            dataName: allmember[i].fullname,
            dataValue: allmember[i].jfid
          };
          var cannotadd = false;
          for (var j = 0; j < Fzr_data.length; j++) {
            if (Fzr_data[j].jfid == allmember[i].jfid) {
              cannotadd = true;
              break;
            }
          }
          if (!cannotadd) {
            Fzr_data.push(map);
          }
        }
        // 检查人列表
        this.addTaskForm.enums.checkerList = Fzr_data;
        // 责任人列表
        this.addTaskForm.enums.responsibleList = Fzr_data;
      });
    },
    onRadioChange(val, item) {
      // 是否需要检查人的值切换
      if (item.bind == "isChecked") {
        this.resetChecker(val);
      }
    },
    resetChecker(val) {
      // val:1 显示， 2 隐藏 检查人下拉框
      if (val == 2) {
        this.addTaskForm.config.map(configItem => {
          if (configItem && configItem.bind == "checkJfid") {
            configItem["isHide"] = true;
          }
        });
      } else {
        this.addTaskForm.config.map(configItem => {
          if (configItem && configItem.bind == "checkJfid") {
            configItem["isHide"] = false;
          }
        });
      }
    },
    getCustomFormTemplate() {
      api_getCustomFormTemplate({
        moduleCode
      }).then(res => {
        if (res && res.data && res.data.templateDetail) {
          this.editableTabs = JSON.parse(res.data.templateDetail);
          this.templateId = res.data.id;
          this.editableTabs.map((item, index) => {
            if (typeof item.formArr == "string") {
              item.formArr = JSON.parse(item.formArr);
            } else {
              item.formArr = item.formArr;
            }
            if (index == 0 && item.formArr.length > 0) {
              this.addTaskForm = item.formArr[0].selectData.formAdd;
              this.addTaskForm.config.map(configItem => {
                if (configItem && configItem.type == "radio") {
                  configItem["change"] = this.onRadioChange;
                }
                if (configItem && configItem.bind == "startTime") {
                  configItem["picker-options"] = {
                    disabledDate: time => {
                      if (this.taskId) {
                        if (this.fromData.endTime) {
                          return (
                            time.getTime() >=
                            new Date(this.fromData.endTime).getTime()
                          );
                        }
                      } else {
                        if (this.addTaskForm.data.endTime) {
                          return (
                            time.getTime() >=
                            new Date(this.addTaskForm.data.endTime).getTime()
                          );
                        }
                      }
                    }
                  };
                }
                if (configItem && configItem.bind == "endTime") {
                  configItem["picker-options"] = {
                    disabledDate: time => {
                      if (this.taskId) {
                        if (this.fromData.startTime) {
                          return (
                            time.getTime() <=
                            new Date(this.fromData.startTime).getTime()
                          );
                        }
                      } else {
                        if (this.addTaskForm.data.startTime) {
                          return (
                            time.getTime() <=
                            new Date(this.addTaskForm.data.startTime).getTime()
                          );
                        }
                      }
                    }
                  };
                }
              });
            }
            return item;
          });
          this.getStageList();
          this.getAllMemberList();
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.add-task-dialog {
  ::v-deep {
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
