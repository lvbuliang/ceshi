<template>
    <div>
        <el-form :model="ruleForm" :rules="rules" label-width="100px" ref="ruleForm">
            <el-form-item label="所属模块" prop="moduleCode">
                <el-select v-model="ruleForm.moduleCode" placeholder="请选择所属模块">
                    <el-option
                        v-for="item in moduleList"
                        :key="item.moduleCode"
                        :label="item.moduleName"
                        :value="item.moduleCode"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="头部类型" prop="headType">
                <el-select v-model="ruleForm.headType" placeholder="请选择头部类型">
                    <el-option label="规划" :value="1"></el-option>
                    <el-option label="项目" :value="2"></el-option>
                    <el-option label="年度项目计划" :value="3"></el-option>

                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button size="small" type="primary" @click="onSubmit">确定</el-button>
                <el-button size="small" @click="$emit('update:visible', false)">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { listModule } from "@/api/index.js";

export default {
	props: {
		visible: Boolean
	},
    data() {
        return {
            ruleForm: {
                moduleCode: null,
                headType: null,
            },
            rules: {
                moduleCode: [
                    {
                        required: true,
                        message: "请选择所属模块",
                        trigger: "change",
                    },
                ],
                headType: [
                    {
                        required: true,
                        message: "请选择头部类型",
                        trigger: "change",
                    },
                ],
            },
            moduleList: [],
        };
    },
    mounted() {
        listModule().then((res) => {
            if (res.msg.code === "0000") {
                this.moduleList = res.data;
            }
        });
    },
    methods: {
        onSubmit() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    let moduleName = ''
                    this.moduleList.forEach(item => {
                        if (item.moduleCode === this.ruleForm.moduleCode) {
                            moduleName = item.moduleName + '-001'
                        }
                    })
                    this.$router.push({
                        name: "temAdd",
                        query: {
                            moduleCode: this.ruleForm.moduleCode,
                            moduleName,
                            headType: this.ruleForm.headType,
                        },
                    });
                }
            });
        },
        
    },
};
</script>

<style>
</style>