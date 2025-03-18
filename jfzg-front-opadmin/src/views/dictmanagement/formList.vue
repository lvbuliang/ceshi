<template>
	<div>
		<el-table :data="tableData" style="width: 100%">
			<el-table-column prop="id" label="数据id" width="180"></el-table-column>
			<el-table-column prop="moduleName" label="所属模块"></el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-dialog title="编辑" :visible.sync="dialogVisible" width="40%">
			<vue-json-editor v-model="tableColumn" :showBtns="false" mode="code" lang="zh"></vue-json-editor>
			<span slot="footer" class="dialog-footer">
				<el-button size="small" @click="dialogVisible = false">取 消</el-button>
				<el-button size="small" type="primary" @click="onSubmit">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import vueJsonEditor from "vue-json-editor";
	import {
		listModuleTableByModuleCode,
		updateModuleTableTemplate,
	} from "@/api/index.js";

	export default {
		components: {
			vueJsonEditor
		},
		data() {
			return {
				tableData: [],
				tableColumn: "",
				dialogVisible: false,
				id: null,
			};
		},
		mounted() {
			this.getList();
		},
		methods: {
			getList() {
				listModuleTableByModuleCode().then((res) => {
					if (res.msg.code === "0000") {
						this.tableData = res.data;
					}
				});
			},
			handleEdit(row) {
				this.id = row.id;
				this.tableColumn = JSON.parse(row.tableColumn);
				this.dialogVisible = true;
			},
			onSubmit() {
				let params = {
					id: this.id,
					tableColumn: JSON.stringify(this.tableColumn)
				};
				updateModuleTableTemplate(params).then((res) => {
					if (res.msg.code === "0000") {
						this.$message({
							message: "编辑成功",
							type: "success",
						});
						this.dialogVisible = false
						this.getList();
					}
				});
			},
		},
	};
</script>

<style>
</style>
