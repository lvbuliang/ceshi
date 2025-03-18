<template>
    <div class="absenceApplyWorkView">
        <sr-view :formData="form.config" :ruleForm="form.data"></sr-view>
        <sr-work-flow
            :hideFrom="true"
            :buttonList="buttonList"
            backName="absenceApply"
            ref="work_flow"
            :taskId="taskId"
            v-if="buttonList.length"
        ></sr-work-flow>
    </div>
</template>

<script>
import config from "@/settings.js";
import store from "@/store";
import { api_activititodo } from "@/api/index";
import { expertLeaveDetail } from "@/api/expert";
import { getList, srtraceTrackImage } from "@/api/srtracetrack";

export default {
    provide() {
        return {
            baseUrl: config.baseUrl,
            imgBaseUrl: config.imgBaseUrl,
        };
    },
    data() {
        return {
            userInfo: store.getters.userInfo,
            buttonList: [],
            trackData: [],
            imgUrl: "",
            form: {
                config: [
                    {
                        type: "value",
                        value: "expertName",
                        label: "请假人",
                        span: 8,
                    },
                    {
                        type: "value",
                        value: "leaveDate",
                        label: "请假时间",
                        span: 8,
                    },
                    {
                        type: "value",
                        value: "leaveCause",
                        label: "请假事由",
                        span: 8,
                    },
                    {
                        value: "leaveFile",
                        label: "附件",
                        span: 24,
                        type: "uploader",
                        colNum: 3, // 一行几个附件
                        maxFeild: 15, // 单个附件显示几个字
                        showIcon: true,
                        showExpand: true, // 是否需要展开收起功能
                        labelWidth: 249,
                    },
                ],
                data: {},
            },
        };
    },
    computed: {
        id() {
            return this.$route.query.id;
        },
        processId() {
            return this.$route.query.processId;
        },
    },
    mounted() {
        this.getTodo();
        this.getDetail();
        if (this.processId) {
            this.getTraceTrack();
        }
    },
    methods: {
        getTodo() {
            let { roleCode } = this.userInfo.currentRole;
            let { jfid } = this.userInfo;

            let param = {
                owner: jfid,
                role: roleCode,
                processId: this.$route.query.processId,
            };

            api_activititodo(param).then((res) => {
                let assignee = res.data[0].assignee;
                this.buttonList = JSON.parse(res.data[0].description).filter(
                    (item) => {
                        item.assignee = assignee;
                        //按钮筛选  以assignee优先roleCode
                        if (assignee == jfid) {
                            return true;
                        } else if (roleCode == item.role) {
                            return true;
                        }
                    }
                );
                console.log(this.buttonList, 11111)
                this.taskId = res.data[0].taskId;
            });
        },
        //留痕轨迹
        getTraceTrack() {
            getList({ busiId: this.id, busiType: "SPECIALIST_HOLIDAYS" }).then(
                (data) => {
                    this.trackData = data.data;
                }
            );
            //留痕轨迹图片
            srtraceTrackImage({ processId: this.processId }).then((res) => {
                this.imgUrl = res.data;
            });
        },
        // 获取专家请假详情
        getDetail() {
            expertLeaveDetail({ id: this.id }).then((res) => {
                if (res.msg.code === '0000') {
                    res.data.leaveDate = `${res.data.leaveStartDate}~${res.data.leaveEndDate}`
                    if (res.data.leaveFile) {
                        res.data.leaveFile = JSON.parse(res.data.leaveFile)
                    }
                    this.$set(this.form, 'data', res.data)
                    
                }
            });
        },
    },
};
</script>

<style lang="scss" scoped>
</style>