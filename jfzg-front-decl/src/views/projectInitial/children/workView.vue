<template>
    <div class="basic-container">
        <div class="basic-info">
            <div class="basic-title">基本信息</div>
            <SrView :formData="basicForm.config" :ruleForm="basicForm.data" :ref="`form`">
                <template slot="name3" slot-scope="scope">
                    <el-col style='display: flex;'>
                      <label
                        class="label-item ellipsis"
                        title="项目名称"
                        style="width: 50%"
                        >项目名称
                      </label>
                  
                      <el-tooltip
                        :content="basicForm.data.projectName"
                        placement="top"
                        effect="light"
                      >
                        <button
                          style="
                            border: none;
                            float: left;
                            background: #fff;
                            margin-left: 10px;
                            line-height: 40px;
                          "
                          @click="chakan(scope.scope)"
                        >
                          <div :class="buName.includes('豫信') ? 'table_unitName' : 'p_unitName'">
                            {{ basicForm.data.projectName }}
                          </div>
                        </button>
                      </el-tooltip>
                    </el-col>
                </template>
            </SrView>
        </div>


        <div class="file_list">
            <div class="basic-title"> {{ getDeliverable }}</div>
        </div>

        <WorkFlow1 :currentStatus="currentStatus" :hideFrom="true" :buttonList="buttonList" :taskId="taskId" ref="work_flow" backName="projectInitial">
        </WorkFlow1>
    </div>
</template>
  
<script>
import config from "@/settings.js";
import upload from "@/utils/upload";
import workflow from "@/utils/workflow";
import WorkFlow1 from "../components/workflow.vue";
import srtracetrack from "@/utils/srtracetrack";

import store from "@/store";
import { api_getDetail } from "@/api/projectInitial/index.js";
import { api_activititodo } from "@/api/index.js";
export default {
    components: {
        WorkFlow1,
    },
    name: 'project_workView',
    provide() {
        return {
            baseUrl: config.uploadBaseUrl,
            imgBaseUrl: config.imgBaseUrl,
            uploadRequest: upload,
            uploadBaseUrl: config.uploadBaseUrl,
            srtracetrackRequest: srtracetrack,
            workflowRequest: workflow,
        };
    },
    data() {
        return {
            userInfo: store.getters.userInfo,
            buName: store.getters.userInfo.currentBizunit.buName,
            taskId: "",
            basicForm: {
                otherConfig: {
                    labelNum: 160,
                },
                config: [
                    {
                        type: "value",
                        label: "系统名称",
                        value: "systemName",
                        col: 12,
                    },
                    // {
                    //     type: "value",
                    //     label: "项目名称",
                    //     value: "projectName",
                    //     col: 12,
                    // },
                    {
                      type: "slot",

                      slotName: "name3",
                      span: 12,
                    },
                    {
                        type: "value",
                        label: "项目编码",
                        value: "projectCode",
                        col: 12,
                    },
                    {
                        type: "value",
                        label: "项目负责人",
                        value: "contactName",
                        col: 12,
                    },
                    {
                        type: "value",
                        label: "方案经理",
                        value: "programManagerName",
                        col: 12,
                    },
                    {
                        type: "value",
                        label: "采购经理",
                        value: "procurementManagerName",
                        col: 12,
                    },
                    {
                        type: "value",
                        label: "客户经理",
                        value: "clientManagerName",
                        col: 12,
                    },
                ],
                data: {
                    systemName: '', //系统名称
                    projectName: '', //项目名称
                    projectCode: '', //项目编码
                    contactName: '', // 项目负责人,
                    programManagerName: '', // 方案经理,
                    procurementManagerName: '', // 采购经理
                    clientManagerName: '', // 客户经理
                    projectId: '',
                    projectInitialId: '',
                    workflowId: ''
                }
            },
            buttonList: [
                {
                    role: "",
                    btns: [
                        {
                            btnName: "提交",
                            btnValue: "tg00",
                            btnType: "primary",
                            btnEventType: "tg",
                        },
                        {
                            btnValue: "btg",
                            btnName: "保存",
                            btnType: "primary",
                            btnEventType: "btg",
                        },
                    ],
                    nodes: [
                        {
                            dataName: "",
                            dataValue: "节点值0",
                        },
                    ],
                    showForm: true,
                },
            ],
            currentStatus: null, //当前状态
        };
    },
    computed: {
        getDeliverable() {
              if ([1, 2, 202, 203].includes(this.currentStatus)) {
                return '监理工程师审核'
              }else if([204,301, 302, 303].includes(this.currentStatus)) {
                return '项目负责人审核'
              }else if([304,305,306,307].includes(this.currentStatus)) {
                 return '评审小组审核'
              }else if([308,309, 410, 411].includes(this.currentStatus)) {
                return '通过初验'
              }
            // if (this.userInfo.currentRole.roleCode == 'XMFZR') {
            //    if ([308, 309, 410, 411, 1000].includes(this.currentStatus)) {
            //      // 通过初验
            //      return '通过初验'
            //    } else {
            //      // 项目负责人审核
            //      return '项目负责人审核'
            //    }
            // } else {
            //   if ([1, 2, 202, 203].includes(this.currentStatus)) {
            //     return '监理工程师审核'
            //   } else {
            //     return '评审小组审核'
            //   }
            // }
        }
    },
    mounted() {
        if (this.$route.query.status) {
            this.currentStatus = Number(this.$route.query.status);
        }
        this.getDetail();
        this.initTodo();
    },
    methods: {
        getDetail() {
            let newFlag = [203, 303, 306, 410].includes(this.$route.query.status);
            api_getDetail({ id: this.$route.query.id, newFlag, contractId: this.$route.query.contractId == 'null' ? null : Number(this.$route.query.contractId) }).then((res) => {
                if (res.data) {
                    //回显数据
                    var newObj = {}
                    for (var key in res.data) {
                        newObj[key] = res.data[key]
                    }
                    this.basicForm.data = newObj;
                    // this.currentStatus = res.data.status;
                }
            });
        },
        initTodo() {
            let { roleCode } = this.userInfo.currentRole;
            let { jfid } = this.userInfo;
            let { buid } = this.userInfo.currentBizunit;
            let param = {
                owner: jfid,
                role: roleCode,
                processId: this.$route.query.processId,
                // btnValue: this.$route.query.flog || btnValue,
                // type: this.$route.query.type ? this.$route.query.type : 0,
            };
            api_activititodo(param).then((res) => {
                if (res.data.length > 0) {
                    let assignee = res.data[0].assignee;
                    this.taskId = res.data[0].taskId;
                    this.buttonList = JSON.parse(res.data[0].description).filter(
                        (item) => {
                          console.log(item,'之后')
                            item.assignee = assignee;
                            if (assignee == jfid) {
                                return true;
                            } else if (roleCode == item.role) {
                                return true;
                            }
                        }
                    );
                }
            });
        },
        chakan(row) {
            if(this.buName.includes('豫信')) {
              this.$router.push({
                name: "planProjectView",
                query: {
                  id: this.$route.query.id,
                  processId: this.$route.query.processId,
                  // templateId: row.templateId,
                  spanaActive: this.spanaActive,
                  testId2: 1,
                  lookName:"初验"
                },
                // 查看相关逻辑
              });
            }
        },
    },
};
</script>
<style lang="scss" scoped>
.basic-container {
    padding: 20px;
    height: 100%;
}


.basic-info {
    padding: 20px 40px 14px 40px;

    .basic-title {
        font-weight: bold;
        font-size: 20px;
        margin-bottom: 20px;
        
    }

    .label-item {
        border-left: none !important;
        border-right: none !important;
    }
}

.file_list {
    margin-bottom: 20px;

    .basic-title {
        font-weight: bold;
        font-size: 20px;
        margin-bottom: 20px;
        padding-left: 40px;
        padding-top: 20px;
    }
}
.table_unitName {
  color: rgba(66, 130, 255, 1);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

:hover .table_unitName {
  cursor: pointer;
}
.p_unitName {
  color: #666;
}
</style>
  