<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="800px"
    :title="title"
    append-to-body
    class="add-task-dialog"
  >
    <div class="dialog-body" v-if="editableTabs.length > 0">
      <FormAdd
        v-if="!id || fromData"
        :isShowTab="false"
        ref="formAdd"
        :fromData="fromData"
        :editableTabs="editableTabs"
      >
      </FormAdd>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        v-debounce="[() => onConfirmClick(), config.deTime]"
        size="small"
        ><span style="font-size: 14px;"> 确定</span></el-button
      >
      <el-button @click="dialogVisible = false" size="small"
        ><span style="font-size: 14px;"> 取消</span></el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import { getRWlist, saveRWlist, editRWlist } from "@/api/bianzhi/index.js";
import config from "@/settings.js";
import FormAdd from "@/components/srFormAdd.vue";
import { api_getCustomFormTemplate } from "@/api/index";
import {
  api_queryStageList,
  api_queryAllMembers,
  api_addTask,
  api_getTaskDetail
} from "@/api/shishi/taskList.js";
import { queryByUnitType, getDetailById } from "@/api/bianzhi/index.js";

export default {
  components: {
    FormAdd
  },
  props: {},
  data() {
    return {
      config,
      moduleCode: 21001,
      dialogVisible: false,
      editableTabs: [],
      fromData: {},
      templateId: "",
      id: "",
      addTaskForm: {},
      taskId: "",
      parentId: "",
      resetTaskFormData: {}
    };
  },
  computed: {
    projectId() {
      return this.$route.query.id;
    },
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
        // else {
        //   this.addTaskForm.data = deepCopy(this.resetTaskFormData)
        // }
      }
    }
  },
  created() {
    this.getCustomFormTemplate();
  },
  methods: {
    init(row, isCreateSub) {
      if (row) {
        this.taskId = row.id;
        this.getTaskDetail(JSON.parse(JSON.stringify(row)));
      } else {
        this.$set(this, "fromData", {});
        if (this.$refs["formAdd"]) {
          this.$refs["formAdd"].resetForm();
        }
        this.$set(
          this.editableTabs[0].formArr[0].selectData.formAdd.config[
            this.editableTabs[0].formArr[0].selectData.formAdd.config.length - 1
          ],
          "fileList",
          []
        );
        this.$set(
          this.editableTabs[0].formArr[0].selectData.formAdd.data,
          "taskAttach",
          []
        );
        this.$set(
          this.editableTabs[0].formArr[0].selectData.formAdd.data,
          "checkJfid",
          ""
        );
      }
      this.dialogVisible = true;
    },
    getTaskDetail(row) {
      if (row.taskAttach) {
        row.taskAttach = JSON.parse(row.taskAttach);
      }
      if (row.priorityLevel) {
        row.priorityLevel = row.priorityLevel + "";
      }
      if (row.checkJfid) {
        row.isChecked = "1";
      } else {
        row.isChecked = "2";
      }
      this.resetChecker(row.isChecked);
      this.fromData = JSON.parse(JSON.stringify(row));
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
    onConfirmClick() {
      let data = this.$refs["formAdd"].validateFun();
      if (data) {
        let params = {
          projectId: this.projectId,
          ...data
        };
        params.isChecked = params.isChecked == "1" ? true : false;
        // 检查人
        if (params.isChecked) {
          let checkers = this.addTaskForm.enums.checkerList.filter(
            item => item.dataValue == data.checkJfid
          );
          if (checkers && checkers.length > 0) {
            let checkName = checkers[0]["dataName"];
            params["checkName"] = checkName;
          }
        } else {
          params["checkName"] = "";
          params["checkJfid"] = "";
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
        // 里程碑名称
        if (data.stageId) {
          let stageIdresponsibles = this.addTaskForm.enums.stageList.filter(
            item => item.dataValue == data.stageId
          );
          if (stageIdresponsibles && stageIdresponsibles.length > 0) {
            let responsibleName = stageIdresponsibles[0]["dataName"];
            params["stageName"] = responsibleName;
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
          editRWlist(params).then(res => {
            if (res && res.success) {
              this.$message.success("编辑成功");
              this.dialogVisible = false;
              this.$emit("refreshList");
            }
          });
        } else {
          if (this.parentId) {
            params["parentId"] = this.parentId;
          }
          saveRWlist(params).then(res => {
            if (res && res.success) {
              this.$message.success("创建成功");
              this.dialogVisible = false;
              this.$emit("refreshList");
            }
          });
        }
      }
    },
    getStageList() {
      // 获取项目里程碑列表
      api_queryStageList(this.$route.query.id).then(res => {
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
        projectId: this.$route.query.id
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

    getCustomFormTemplate() {
      api_getCustomFormTemplate({ moduleCode: this.moduleCode }).then(res => {
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
              // this.resetTaskFormData = deepCopy(this.addTaskForm.data)
            }
            return item;
          });
          var indexdata = 0;
          var that = this;
          this.editableTabs[0].formArr[0].selectData.formAdd.config.forEach(
            (item, index) => {
              if (item && item.type == "radio") {
                  item["change"] = this.onRadioChange;
                }
              if (item.bind == "startTime") {
                item["picker-options"] = {
                  disabledDate(time) {
                    var beginDate = "2000-01-01";
                    beginDate = beginDate.substring(0, 10);
                    beginDate = beginDate.replace(/-/g, "/");
                    var beginDatestamp = new Date(beginDate).getTime();

                    var endDate =
                      that.editableTabs[0].formArr[0].selectData.formAdd.data
                        .endTime || "2099-12-31";
                    endDate = endDate.substring(0, 10);
                    endDate = endDate.replace(/-/g, "/");
                    var endDatestamp = new Date(endDate).getTime();
                    return (
                      time < new Date(beginDatestamp) ||
                      time > new Date(endDatestamp)
                    );
                  }
                };
              }
              if (item.bind == "endTime") {
                item["picker-options"] = {
                  disabledDate(time) {
                    var beginDate =
                      that.editableTabs[0].formArr[0].selectData.formAdd.data
                        .startTime || "2000-01-01";
                    beginDate = beginDate.substring(0, 10);
                    beginDate = beginDate.replace(/-/g, "/");
                    var beginDatestamp = new Date(beginDate).getTime();

                    var endDate = "2099-12-31";
                    endDate = endDate.substring(0, 10);
                    endDate = endDate.replace(/-/g, "/");
                    var endDatestamp = new Date(endDate).getTime();
                    return (
                      time < new Date(beginDatestamp) ||
                      time > new Date(endDatestamp)
                    );
                  }
                };
              }
            }
          );
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
        overflow: hidden;
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
