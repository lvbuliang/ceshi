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

        <WorkFlow1 :hideFrom="true" ref="work_flow" :buttonList="buttonList" backName="projectInitial"></WorkFlow1>

    </div>
</template>

<script>
// 基本信息组件

import WorkFlow1 from "../components/workflow.vue";
import srtracetrack from "@/api/executionManagement/strack.js";
import {
    api_getDetail
} from "@/api/projectInitial/index.js";
import store from "@/store";
export default {
    name: 'project_initialView',
    components: { WorkFlow1 },
    provide() {
        return {
            baseUrl: '',
            imgBaseUrl: '',
            uploadRequest: '',
            uploadBaseUrl: '',
            srtracetrackRequest: srtracetrack,
        };
    },
    data() {
        return {
            userInfo: store.getters.userInfo,
            buName: store.getters.userInfo.currentBizunit.buName,
            buttonList: [
                {
                    role: "",
                    btns: [],
                    nodes: [],
                },
            ],
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
                    {
                        type: "value",
                        label: "合同名称",
                        value: "contractName",
                        col: 12,
                    },
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
                    contractName: '', // 合同名称
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

        }
    },
    created() {
        this.getDetailById()
    },
    methods: {
        // 根据id获取详情
        getDetailById() {
            let newFlag = this.$route.query.status && (this.$route.query.status == "203" || this.$route.query.status == "303");
            api_getDetail({ id: this.$route.query.id,  contractId: this.$route.query.contractId == "null"
            ? 'null'
            : Number(this.$route.query.contractId), newFlag }).then((res) => {
                if (res.data) {
                    //回显数据
                    var newObj = {}
                    for (var key in res.data) {
                        newObj[key] = res.data[key]
                    }
                    this.basicForm.data = newObj;

                }
            })
        },
        chakan(row) {
            // 查看项目详情
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
    }
}

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