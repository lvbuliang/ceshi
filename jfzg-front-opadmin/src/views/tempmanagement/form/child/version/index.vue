<template>
    <div>
        <el-table :data="versionData">
            <el-table-column property="id" label="版本号" width="100px"></el-table-column>
            <el-table-column property="templateName" label="模版名称"></el-table-column>
            <el-table-column property="moduleName" label="所属模块" width="150px"></el-table-column>
            <el-table-column property="createTime" label="创建时间" width="200px"></el-table-column>

            <el-table-column property="moduleName" label="状态" width="80px">
                <template slot-scope="scope">
                    <el-switch @change="handleChange(scope.row)" active-value="1" inactive-value="0" :disabled="scope.row.version != 0" v-model="scope.row.version" active-color="#13ce66"></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="80px">
                <template slot-scope="scope">
                    <el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            background
            layout="prev, pager, next"
            @current-change="handleCurrentChange"
            :page-size="pageData.pageSize"
            :total="pageData.total"
        ></el-pagination>
    </div>
</template>

<script>
import { listCustomFormTemplate, updateDefaultTemplate } from "@/api/index.js";

export default {
    props: ["moduleCode"],
    data() {
        return {
            versionData: [],
            pageData: {
                pageNum: 1,
                pageSize: 5,
                total: 0,
            },
        };
    },
    mounted() {
        this.getTemList();
    },
    methods: {
        getTemList() {
            listCustomFormTemplate({
                moduleCode: this.moduleCode,
                pageNum: this.pageData.pageNum,
                pageSize: 5,
            }).then((res) => {
                this.versionData = res.data.list;
                this.pageData.total = res.data.total;
            });
        },
        handleCurrentChange(val) {
            this.pageData.pageNum = val;
            this.getTemList();
        },
        handleEdit(row) {
            this.$router.push({
                name: "temAdd",
                query: {
                    moduleCode: row.moduleCode,
                    templateId: row.id,
                    tableId:row.tableId,
                    total:this.pageData.total
                },
            });
        },
        handleChange(row) {
            console.log(row)
            updateDefaultTemplate({templateId: row.id, moduleCode: row.moduleCode}).then(res => {
                if (res.msg.code === '0000') {
                    this.$message({
                        message: "设置成功",
                        type: "success",
                    });
                    this.getTemList()
                } else {
                    row.version = '0'
                }
            })
        }
    },
};
</script>

<style lang="scss" scoped>
</style>