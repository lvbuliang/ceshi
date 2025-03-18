<template>
    <div class="preview">
        <el-tabs v-model="activeName">
            <el-tab-pane v-for="item in editableTabs" :key="item.name" :name="item.name">
                <span slot="label">{{item.title}}</span>
                <div class="form_box" v-for="(child, key) in item.formArr" :key="key">
                    <h3 class="form_title">{{child.title}}</h3>
                    <sr-add
                        v-if="child.selectData.formAdd && activeIndex == 1"
                        :config="child.selectData.formAdd.config"
                        :form="child.selectData.formAdd.data"
                        :otherConfig="child.selectData.formAdd.otherConfig"
                        :enums="child.selectData.formAdd.enums"
                    />
                    <sr-view
                        v-if="child.selectData.formView && activeIndex != 1"
                        :formData="child.selectData.formView.config"
                        :ruleForm="ruleForm"
                    ></sr-view>
                </div>
            </el-tab-pane>
        </el-tabs>
        <div class="operate btns" v-if="activeIndex == 1">
            <el-button type="primary" size="small">提交</el-button>
            <el-button size="small">保存</el-button>
        </div>
        <div class="operate approval" v-if="activeIndex == 3">
            <sr-add
                v-if="selectData.formAdd"
                :config="selectData.formAdd.config"
                :form="selectData.formAdd.data"
                :otherConfig="otherConfig"
                :enums="selectData.formAdd.enums"
            />
            <sr-add
                :config="formAdd.config"
                :form="formAdd.data"
                :otherConfig="otherConfig"
                :enums="formAdd.enums"
            />
            <div class="btns">
                <el-button type="primary" size="small">通过</el-button>
                <el-button size="small" type="danger">不通过</el-button>
                <el-button size="small">发起第三方</el-button>
                <el-button size="small">转办</el-button>
                <el-button size="small">授权代理</el-button>
                <el-button size="small">节点跳转</el-button>
                <el-button size="small">补材料</el-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    provide() {
        return {
            baseUrl: "",
            imgBaseUrl: "",
            uploadRequest: "",
            uploadBaseUrl: "",
        };
    },
    props: ["editableTabs", "activeIndex", "selectData"],
    data() {
        return {
            otherConfig: {
                labelNum: 140,
            },
            activeName: null,
            ruleForm: {},
            formAdd: {
                config: [
                    {
                        type: "input",
                        name: "审批人",
                        placeholder: "请输入",
                        bind: "input",
                        col: 6,
                    },
                    {
                        type: "text",
                        name: "审批意见",
                        placeholder: "请输入",
                        bind: "input",
                        col: 6,
                    },
                    {
                        type: "dateSelect",
                        name: "审批时间",
                        placeholder: "请选择",
                        bind: "datetime",
                        trigger: "change",
                        col: 6,
                    },
                    {
                        type: "upload",
                        name: "附件",
                        bind: "upload",
                        fileList: [],
                        tipPopover: true, // hover显示提示  默认外面显示
                        col: 24,
                    },
                ],
                data: {},

                enums: {},
            },
        };
    },
    mounted() {
        console.log(this.selectData);
        if (this.editableTabs.length) {
            this.activeName = this.editableTabs[0].name;
        }
    },
};
</script>

<style lang="scss" scoped>
.preview {
    padding: 20px;
    .form_box {
        .form_title {
            font-size: 14px;
            color: #333;
            font-weight: 500;
            margin-bottom: 8px;
        }
    }
    .operate {
        width: 100%;
        position: absolute;
        left: 0;
        bottom: 0;
        background-color: #fff;
        box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
        .sr-add {
            padding: 0px 24px;
        }
    }
    .approval {
        padding-top: 16px;
    }
    .btns {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 64px;
        border: 1px solid #e6e6e6;
    }
}
</style>