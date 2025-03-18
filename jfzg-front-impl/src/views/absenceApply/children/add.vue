<template>
    <div class="experts_leava">
        
        <SrAdd
            :config="form.config"
            :form="form.data"
            :enums="form.enums"
            :otherConfig="otherConfig"
            ref="add"
        ></SrAdd>
    </div>
</template>

<script>
import { expertLeaveSave } from "@/api/expert";
import config from "@/settings.js";
import upload from "@/utils/upload";
export default {
    provide() {
        return {
            baseUrl: config.baseUrl,
            imgBaseUrl: config.imgBaseUrl,
            uploadRequest: upload,
            uploadBaseUrl: config.uploadBaseUrl,
        };
    },
    props: {
        formData: {
            type: Object,
            default: () => {
                return {};
            },
        },
        visible: {
            type: Boolean,
            default: () => {
                return false
            }
        }
    },
    data() {
        return {
            otherConfig: {
                labelNum: 100,
            },
            form: {
                config: [
                    {
                        type: "input",
                        name: "请假人",
                        bind: "expertName",
                        col: 24,
                        required: "必填",
                        disabled: true,
                    },
                    {
                        type: "dateSelect",
                        timeType: "daterange",
                        name: "请假时间",
                        bind: "leaveDate",
                        col: 24,
                        required: "请选择请假时间",
                        trigger: "change",
                        format: "yyyy-MM-dd",
                    },
                    {
                        type: "textarea",
                        name: "请假事由",
                        placeholder: "请输入请假事由",
                        required: "请输入请假事由",
                        bind: "leaveCause",
                        col: 24,
                    },
                    {
                        type: "upload",
                        name: "附件",
                        bind: "leaveFile",
                        fileList: [],
                        col: 24,
                        trigger: "change",
                    },
                ],
                data: {
                    leaveFile: []
                },
                enums: {},
            },
        };
    },
    mounted() {
        this.form.data = this.formData;
    },
    methods: {
        submit() {
            this.$refs.add.validate((res) => {
                if (res) {
                    if (this.form.data.leaveFile && this.form.data.leaveFile.length) {
                        this.form.data.leaveFile = JSON.stringify(this.form.data.leaveFile)
                    }
                    this.form.data.leaveStartDate = this.form.data.leaveDate[0];
                    this.form.data.leaveEndDate = this.form.data.leaveDate[1];
                    expertLeaveSave(this.form.data).then((res) => {
                        if (res.msg.code === "0000") {
                            this.$message({
                                message: "新增成功",
                                type: "success",
                            });
                            this.$emit('refresh')
                        }
                    });
                }
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.experts_leava {
}
</style>