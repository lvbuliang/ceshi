<template>
  <div class="task-detail-page">
    <TaskInfo :info="srNavPageObj" v-if="srNavPageObj"></TaskInfo>
    <template v-if="isDispose">
      <TestFormView
        v-if="editableTabs.length"
        :editableTabs="editableTabs"
        :fromData="fromData"
        :slotList="['任务处理']"
        activeNameT="任务处理"
      >
      <div slot="任务处理" class="pt-8">
        <SrAdd
          :config="taskDisposeForm.config"
          :otherConfig="taskDisposeForm.otherConfig"
          :form="taskDisposeForm.data"
          ref="taskDisposeForm"
        ></SrAdd>
      </div>
      </TestFormView>
    </template>
    <template v-else>
      <TestFormView
        v-if="editableTabs.length"
        :editableTabs="editableTabs"
        :fromData="fromData"
        :slotList="['任务处理', '任务检查']"
        activeNameT="任务检查"
      >
      <div slot="任务处理" class="pt-8">
        <SrView
          v-if="taskDisposeView.data.taskProgress"
          :formData="taskDisposeView.config"
          :ruleForm="taskDisposeView.data"
        ></SrView>
      </div>
      <div slot="任务检查" class="pt-8">
        <SrAdd
          :config="taskCheckForm.config"
          :otherConfig="taskCheckForm.otherConfig"
          :form="taskCheckForm.data"
          ref="taskCheckForm"
        ></SrAdd>
      </div>
      </TestFormView>
    </template>
    <BottomBtns :isShowBack="false" v-if="isDispose">
      <div slot="btnList">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button type="default" @click="onBackClick">取消</el-button>
      </div>
    </BottomBtns>
    <BottomBtns :isShowBack="true" v-else @onBackClick="onBackClick">
      <div slot="btnList" class="btnList">
        <el-button type="primary" @click="save(true)">通过</el-button>
        <el-button type="danger" @click="save(false)">驳回</el-button>
      </div>
    </BottomBtns>
  </div>
</template>

<script>
import TestFormView from "@/components/srFormView.vue";
import BottomBtns from "@/components/BottomBtns.vue";
import TaskInfo from '../components/TaskInfo.vue';
import { api_getCustomFormTemplate } from "@/api/index";
import { api_getTaskDetail, api_disposeTask } from "@/api/shishi/taskList.js";

import config from '@/settings.js';
import upload from "@/utils/upload";
import { moduleCode,priorityMap } from "../const.js";
export default {
  components: {
    TestFormView,
    BottomBtns,
    TaskInfo
  },
  provide() {
    return {
      baseUrl: config.uploadBaseUrl,
      imgBaseUrl: config.imgBaseUrl,
      uploadRequest: upload,
      uploadBaseUrl: config.uploadBaseUrl,
    };
  },
  data() {
    return {
      projectId: '',
      srNavPageObj: {
        taskName: '',
        statusName: '',
        className: ''
      },
      editableTabs: [],
      fromData: {},
      buttonList: [
        {
          role: "",
          btns: [],
          nodes: [],
        },
      ],
      taskDisposeView: {
        "config": [{
          "className": "",
          "isHide": false,
          "value": "taskProgress",
          "label": "任务完成进度（%）",
          "span": 24,
          "type": "value",
          "key": "1626156238000_82251"
        }, {
          "className": "",
          "isHide": false,
          "value": "disposeRemark",
          "label": "任务说明",
          "span": 24,
          "type": "value",
          "key": "1626156299000_42082"
        }, {
          "className": "",
          "isHide": false,
          "colNum": 3,
          "maxFeild": 15,
          "showExpand": true,
          "labelWidth": 150,
          "value": "disposeAttach",
          "label": "附件",
          "span": 24,
          "type": "uploader",
          "key": "1626156325000_86753"
        }],
        "data": {
          "taskProgress": "",
          "disposeRemark": "",
          "disposeAttach": ""
        }
      },
      taskDisposeForm: {
        "config": [{
          "type": "number",
          "bind": "taskProgress",
          "name": "任务完成进度（%）",
          "col": 8,
          "className": "",
          "isHide": false,
          "isHideView": false,
          "disabled": false,
          "placeholder": "请输入",
          "min": 1,
          "max": 100,
          "controls-position": "",
          "trigger": "blur",
          "rules": []
        }, {
          "type": "textarea",
          "bind": "disposeRemark",
          "name": "任务说明",
          "col": 24,
          "className": "",
          "isHide": false,
          "isHideView": false,
          "placeholder": "请输入任务说明",
          "maxlength": 500,
          "row": 3,
          "disabled": false,
          "readonly": false,
          "resize": "none",
          "trigger": "blur",
          "rules": []
        }, {
          "type": "upload",
          "bind": "disposeAttach",
          "name": "附件",
          "col": 24,
          "className": "",
          "isHide": false,
          "isHideView": false,
          "fileList": [],
          "fileTip": "",
          "limit": 10,
          "fileType": "",
          "trigger": "blur",
          "rules": []
        }],
        "data": {
          "taskProgress": "",
          "disposeRemark": "",
          "disposeAttach": ""
        },
        "otherConfig": {
          "labelNum": 170
        },
        "enums": {}
      },
      taskCheckForm: {
        "config": [{
          "type": "textarea",
          "bind": "disposeRemark",
          "name": "检查意见",
          "col": 24,
          "className": "",
          "isHide": false,
          "isHideView": false,
          "placeholder": "请输入检查意见",
          "maxlength": 500,
          "row": 3,
          "disabled": false,
          "readonly": false,
          "resize": "none",
          "trigger": "blur",
          "rules": []
        }, {
          "type": "upload",
          "bind": "disposeAttach",
          "name": "附件",
          "col": 24,
          "className": "",
          "isHide": false,
          "isHideView": false,
          "fileList": [],
          "fileTip": "",
          "limit": 10,
          "fileType": "",
          "trigger": "blur",
          "rules": []
        }],
        "data": {
          "disposeRemark": "",
          "disposeAttach": ""
        },
        "otherConfig": {
          "labelNum": 170
        },
        "enums": {}
      }
    }
  },
  computed:{
    taskId() {
      return this.$route.query.taskId
    },
    isDispose() {
      return this.$route.name == 'taskDispose'
    }
  },
  created() {
    this.getTaskDetail()
  },
  methods: {
    save(isPass) {
      if (this.isDispose) {
        // 任务处理逻辑
        this.doTaskDispose()
      } else {
        // 任务检查
        this.doTaskCheck(isPass)
      }
    },
    doTaskCheck(isPass) {
      let validateResult = this.$refs.taskCheckForm.validate();
      if (validateResult) {
        // 验证成功，组装数据提交到后台
        let data = this.taskCheckForm.data
        let params = {
          taskId: this.taskId,
          disposeType: 'CHECK',
          disposeRemark: data.disposeRemark,
          pass: isPass
        }
        if (data.disposeAttach) {
          params['disposeAttach'] = JSON.stringify(data.disposeAttach)
        }
        api_disposeTask(params).then(res => {
          if (res && res.success) {
            this.onBackClick()
          }
        })
      }
    },
    doTaskDispose() {
      let validateResult = this.$refs.taskDisposeForm.validate();
      if (validateResult) {
        // 验证成功，组装数据提交到后台
        let data = this.taskDisposeForm.data
        let params = {
          taskId: this.taskId,
          disposeType: 'DISPOSE',
          taskProgress: data.taskProgress,
          disposeRemark: data.disposeRemark
        }
        if (data.disposeAttach) {
          params['disposeAttach'] = JSON.stringify(data.disposeAttach)
        }
        api_disposeTask(params).then(res => {
          if (res && res.success) {
            this.$message.success("任务处理成功");
            this.onBackClick()
          }
        })
      }
    },
    onBackClick() {
      this.$router.push({
        name: 'taskList',
        query:{
          projectId: this.projectId
        }
      })
    },
    getTaskDetail() {
      api_getTaskDetail({taskId: this.taskId}).then((res) => {
        if (res && res.success) {
          this.projectId = res.data.projectId
          if (res.data.taskAttach && typeof res.data.taskAttach == "string") {
            res.data.taskAttach = JSON.parse(res.data.taskAttach);
          }
          if (res.data.priorityLevel) {
            res.data.priorityLevel = priorityMap[res.data.priorityLevel + '']
          }
          if (res.data.checkName) {
            res.data.isChecked = '是'
          } else {
            res.data.isChecked = '否'
          }
          // 权重
          // if (res.data.taskProportion) {
          //   res.data.taskProportion += '%'
          // }
          // 检查人显示中文而不是值
          res.data.old_checkJfid = res.data.checkJfid
          res.data.checkJfid = res.data.checkName
          // 负责人显示中文而不是值
          res.data.old_responsibleJfid = res.data.responsibleJfid
          res.data.responsibleJfid = res.data.responsibleName
          // 里程碑显示中文而不是值
          res.data.old_stageId = res.data.stageId
          res.data.stageId = res.data.stageName
          this.srNavPageObj.taskName = res.data.taskName
          this.srNavPageObj.statusName = res.data.statusName
          // 待处理、待检查、已驳回、待评价、已完成
          if (res.data.statusName == '已驳回') {
            this.srNavPageObj.className = 'danger-label'
          } else if (res.data.statusName == '已完成') {
            this.srNavPageObj.className = 'success-label'
          } else {
            this.srNavPageObj.className = 'warning-label'
          }
          // 任务处理页签回显
          if (res.data.taskFlowDataVoList && res.data.taskFlowDataVoList.length>0) {
            res.data.taskFlowDataVoList.map(item => {
              // 任务处理表单数据
              if (item.disposeType == 10) {
                if (typeof item.disposeAttach == "string" && item.disposeAttach !='') {
                  item.disposeAttach = JSON.parse(item.disposeAttach);
                }
                if (this.isDispose) {
                  this.taskDisposeForm.data.taskProgress = item.taskProgress
                  this.taskDisposeForm.data.disposeRemark = item.disposeRemark
                  this.taskDisposeForm.data.disposeAttach = item.disposeAttach
                } else {
                  this.taskDisposeView.data.taskProgress = item.taskProgress // + '%'
                  this.taskDisposeView.data.disposeRemark = item.disposeRemark
                  this.taskDisposeView.data.disposeAttach = item.disposeAttach
                }
              }
            })
          }
          this.getTemplate(res.data)
        }
      });
    },
    getTemplate(Data) {
      api_getCustomFormTemplate({
        moduleCode: moduleCode,
      }).then((res1) => {
        this.editableTabs = JSON.parse(res1.data.templateDetail);
        this.editableTabs.forEach((item) => {
          if (typeof item.formArr == "string") {
            item.formArr = JSON.parse(item.formArr);
          } else {
            item.formArr = item.formArr;
          }
          item.formArr.forEach((item1, index) => {
            let viewConfig = item.formArr[index].selectData.formView.config
            if (index == 0 && viewConfig && viewConfig.length>0) {
              for(let i = 0, len = viewConfig.length; i < len-3; i++) {
                // 除了多行文本，附件，其他字段新增配的是一行2个字段，查看一行3个字段，所以需要特殊处理
                viewConfig[i]['span'] = 8
              }
            }
            item.formArr[index].selectData.formView.data = Data;
          });
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
  .task-detail-page{
    .pt-8{
      padding-top: 12px;
    }
  }
</style>
