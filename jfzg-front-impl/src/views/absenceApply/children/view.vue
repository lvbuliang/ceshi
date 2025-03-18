<template>
    <div class="absenceApplyView">
        <sr-view :formData="form.config" :ruleForm="form.data"></sr-view>
        <sr-work-flow
            :hideFrom="true"
            :buttonList="buttonList"
            backName="absenceApply"
            ref="work_flow"
        ></sr-work-flow>
    </div>
</template>

<script>
import config from "@/settings.js";
import { expertLeaveDetail } from "@/api/expert";

export default {
    provide() {
        return {
            baseUrl: config.baseUrl,
            imgBaseUrl: config.imgBaseUrl,
        };
    },
    computed: {
        id() {
            return this.$route.query.id;
        },
    },
    data() {
        return {
            buttonList: [
                {
                    role: "",
                    btns: [],
                    nodes: [],
                },
            ],
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
    mounted() {
        this.getDetail();
    },
    methods: {
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