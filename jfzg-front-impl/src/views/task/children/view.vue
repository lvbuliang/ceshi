<template>
  <div class="task-detail-page">
    <TaskInfo :info="srNavPageObj" v-if="srNavPageObj"></TaskInfo>
    <TestFormView
      v-if="editableTabs.length"
      :editableTabs="editableTabs"
      :fromData="fromData"
      :slotList="slotList"
    >
      <div slot="任务处理" class="pt-8">
        <SrView
          :formData="taskDisposeView.config"
          :ruleForm="taskDisposeView.data"
        ></SrView>
      </div>
      <div slot="任务检查" class="pt-8">
        <SrView
          :formData="taskCheckView.config"
          :ruleForm="taskCheckView.data"
        ></SrView>
      </div>
    </TestFormView>
    <BottomBtns @onBackClick="onBackClick"></BottomBtns>
  </div>
</template>

<script>
import TestFormView from "@/components/srFormView.vue";
import BottomBtns from "@/components/BottomBtns.vue";
import TaskInfo from '../components/TaskInfo.vue';
import { api_getCustomFormTemplate } from "@/api/index";
import { api_getTaskDetail } from "@/api/shishi/taskList.js";

import { moduleCode,priorityMap } from "../const.js";
export default {
  components: {
    TestFormView,
    BottomBtns,
    TaskInfo
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
      slotList: [],
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
      taskCheckView: {
        "config": [{
          "className": "",
          "isHide": false,
          "value": "disposeResultName",
          "label": "检查结果",
          "span": 24,
          "type": "value",
          "key": "1626156238000_82251"
        }, {
          "className": "",
          "isHide": false,
          "value": "disposeRemark",
          "label": "检查意见",
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
          "disposeResultName": "",
          "disposeRemark": "",
          "disposeAttach": ""
        }
      }
    };
  },
  computed:{
    taskId() {
      return this.$route.query.taskId
    }
  },
  created() {
    this.getTaskDetail()
  },
  methods: {
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
          // 附件
          if (res.data.taskAttach && typeof res.data.taskAttach == "string") {
            res.data.taskAttach = JSON.parse(res.data.taskAttach);
          }
          // 优先级
          if (res.data.priorityLevel) {
            res.data.priorityLevel = priorityMap[res.data.priorityLevel + '']
          }
          // 是否需要检查
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
              if (item.disposeType == 10) {
                this.slotList.push('任务处理')
                // 任务处理表单数据
                this.taskDisposeView.data.taskProgress = item.taskProgress // + '%'
                this.taskDisposeView.data.disposeRemark = item.disposeRemark
                if (typeof item.disposeAttach == "string" && item.disposeAttach !='') {
                  item.disposeAttach = JSON.parse(item.disposeAttach);
                }
                this.taskDisposeView.data.disposeAttach = item.disposeAttach
              } else if (item.disposeType == 20) {
                this.slotList.push('任务检查')
                // 任务检查表单数据
                this.taskCheckView.data.disposeResultName = item.disposeResultName
                this.taskCheckView.data.disposeRemark = item.disposeRemark
                if (typeof item.disposeAttach == "string" && item.disposeAttach !='') {
                  item.disposeAttach = JSON.parse(item.disposeAttach);
                }
                this.taskCheckView.data.disposeAttach = item.disposeAttach
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
