
<template>
    <div class="unitList" v-if="$route.meta.lv == 2">
        <!-- 搜索  -->
        <!-- <div class="search">
            <FSearch :form="search" @queryList="getTempList(1)"></FSearch>
        </div>-->
        <!-- 操作按钮 -->
        <div class="buttonOperation">
            <el-button class="exportbtnFour" type="primary" @click="add">
                <i class="el-icon-circle-plus-outline el-icon--left"></i>添加
            </el-button>
        </div>
        <!-- 表格 -->
        <div class="table">
            <FTable
                class="tableData"
                :data="table.data"
                :config="table.config"
                :page="table.page"
                @pageChanged="getPageData"
                @sizeChanged="getSizeDate"
            ></FTable>
        </div>
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible">
            <div :is="childName" :moduleCode="moduleCode" :visible.sync="dialogVisible" v-if="dialogVisible"></div>
        </el-dialog>
    </div>
    <router-view v-else></router-view>
</template>

<script>
import FSearch from "@/components/FSearch/index.vue";
import FTable from "@/components/FTable/index.vue";
import FForm from "@/components/FForm/form-add";
import version from "./child/version/index.vue"
import confirm from "./child/confirm/index.vue"
import { listModule, listCustomFormTemplate } from "@/api/index.js";
export default {
    components: {
        FSearch,
        FTable,
        FForm,
        version,
        confirm
    },
    data() {
        return {
            moduleCode: null,
            dialogVisible: false,
            dialogTitle: '',
            childName: 'version',

            search: {
                textMaxNum: 5, // label 最多几个字默认4个
                showExpand: false, // 是否显示展开收起，默认超过三个显示
                minNum: 4, // 收起显示几个, 默认3个
                config: [
                    {
                        type: "text",
                        name: "模版名称",
                        placeholder: "请输入模版名称",
                        bind: "templateName",
                    },
                    {
                        type: "select",
                        name: "所属模块",
                        placeholder: "请选择所属模块",
                        bind: "moduleCode",
                        data: "moduleList", // 对应enum中的stateList
                        label: "moduleName",
                        value: "moduleCode",
                    },
                ],
                form: {
                    templateName: "",
                    moduleCode: "",
                },
                enum: {
                    moduleList: [],
                },
            },
            table: {
                data: [],
                config: {
                    operationWidth: 150, // 操作列的宽度，不传默认180
                    title: "表格的标题", // 表格标题
                    index: "", // 是否显示序号
                    selection: false,
                    multiple: true,
                    rowKey: "buid",
                    header: [
                        // 表格列配置
                        { name: "模块号", prop: "id", width: 220 },
                        { name: "模块名称", prop: "moduleName" },
                    ],
                    innerBtn: [
                        {
                            name: "版本列表",
                            field: "id",
                            method: "getVersionList",
                        },
                    ],
                },
                page: {
                    // 分页配置
                    total: 0, //总条数
                    pages: "", //总页数
                    pageSize: 5, //每页展示多少个
                    pageNum: 1, //当前页
                },
            }
        };
    },
    mounted() {
        // this.getTempList();
        listModule().then((res) => {
            if (res.msg.code === "0000") {
                this.search.enum.moduleList = res.data;
                this.$set(this.table, "data", res.data);
            }
        });
    },
    methods: {
        // 新增模版
        add() {
            this.dialogVisible = true;
            this.dialogTitle = '提示'
            this.childName = 'confirm'
        },
        
        // 获取版本列表
        getVersionList(row) {
            this.moduleCode = row.moduleCode
            this.dialogVisible = true
            this.dialogTitle = '版本列表'
            this.childName = 'version'
        },

        getPageData(val) {
            this.table.page.pageNum = val;
            this.getTempList();
        },
        getSizeDate(val) {
            this.table.page.pageSize = val;
            this.getTempList();
        },
        // 获取模块列表
        getTempList(page) {
            let params = {
                pageNum: this.table.page.pageNum,
                pageSize: this.table.page.pageSize,
            };
            const searchForms = this.search.form;
            Object.keys(searchForms).map((item) => {
                if (searchForms[item]) {
                    params[item] = searchForms[item];
                }
            });
            if (page) {
                params.pageNum = page;
            }
            listCustomFormTemplate(params).then((res) => {
                if (res.msg.message == "SUCCESS") {
                    this.$set(this.table, "data", res.data.list);
                    this.$set(this.table.page, "pageNum", res.data.pageNum);
                    this.$set(this.table.page, "pageSize", res.data.pageSize);
                    this.$set(this.table.page, "total", res.data.total);
                }
            });
        },
    },
};
</script>
