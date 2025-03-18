<template>
	<div class="Tabs" v-if="trajectoryData.length || orderList.length || (isShowFlow && instanceId)">
		<el-link v-if="operateFlag" @click="operateClick()" class="operate" type="text">
			收起
			<i class="el-icon-arrow-up el-icon--right"></i>
		</el-link>
		<el-link v-else class="operate" @click="operateClick()" type="text">
			展开
			<i class="el-icon-arrow-down el-icon--right"></i>
		</el-link>

		<el-tabs
			class="busCardTabs"
			:class="{ operateLog: true, resizeHight: !operateFlag, }"
			type="card"
			v-model="activeName"
		>
			<el-tab-pane
				:class="{ hid: !operateFlag }"
				label="留痕轨迹"
				name="trace"
				v-if="trajectoryData.length > 0">
				<el-timeline>
					<el-timeline-item
						v-for="(activity, index) in trajectoryData"
						:key=" activity.busiType+index"
						:type="index == 0 ? 'primary' : null"
						:color="activity.color === 'FAIL'?'#F5222D':''"
						:size="activity.size"
					>
						<div class="title">{{ activity.name }}</div>
						<slot name="log" :scope="activity"></slot>
						<div v-if="!userSlot.log" class="clearfix tabDiv">
							<div
								v-for="(child, index) in activity.list"
								:key="index"
								class="tag left"
								:class="{'width-100':child.fileList} "
							>
								<div v-if="!child.fileList">
									<span>{{ child.name }}：</span>
									<i :class="calculateColor(child)" v-html="child.value">
									</i>
								</div>

								<div class="fujian" style="width: 100%" v-else>
									附件：
									<ul class="fileList">
										<li class="fileItem" v-for="(item, index) in child.fileList" :key="index">
											<svg-icon icon-class="icon_fujian" />
											<span
												style="cursor: pointer"
												@click="seeclick(item)"
												class="fileName"
												:title="item.name"
											>{{ item.name }}</span>
											<svg-icon @click="seeclick(item)" icon-class="watch" class="uploader_class" />
											<svg-icon @click="download(item)" icon-class="icon_down" class="uploadImg_class" />
										</li>
									</ul>
								</div>
							</div>
						</div>
					</el-timeline-item>
				</el-timeline>
			</el-tab-pane>
			<!-- <el-tab-pane
				:class="{ hid: !operateFlag }"
				label="流程图"
				name="flow"
				v-if="isShowFlow && instanceId">
				<img class="process_img" src="defaultImg" alt v-if="defaultImg == ''" />
				<div v-if="defaultImg == ''">暂无流程图</div>
				<img class="process_img" :src="'data:image/png;base64,'+ defaultImg" v-else />
			</el-tab-pane>
			<el-tab-pane
				:class="{ hid: !operateFlag }"
				label="工单动态"
				name="order"
				v-if="orderList && orderList.length">
				<el-timeline>
					<el-timeline-item
						v-for="(activity, index) in orderList"
						:key="index"
						:type="index == 0 ? 'primary' : null"
						:color="activity.color"
						:size="activity.size"
					>
						<slot name="order" :scope="activity"></slot>
						<div class="orderList" v-if="!userSlot.order">
							<h4 class="taskName">{{activity.taskName}}</h4>
							<ul class="tag cpointer">
								<li>
									<span>操作人：</span>
									<i :title="activity.assignee">{{ activity.assignee }}</i>
								</li>
								<li>
									<span>操作时间：</span>
									<i>{{ activity.createTime }}</i>
								</li>
							</ul>
						</div>
					</el-timeline-item>
				</el-timeline>
			</el-tab-pane>
			<el-tab-pane :class="{ hid: !operateFlag }" label="留言" name="message" v-if="messageList">
				<el-form ref="form" :model="form" label-width="80px">
					<el-form-item>
						<el-input type="textarea" v-model="form.remark" placeholder="请说点什么吧"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="clickdemo">提交</el-button>
					</el-form-item>
				</el-form>
			</el-tab-pane> -->
		</el-tabs>
	</div>
</template>

<script>
/* eslint-disable */
// import {
// 	requestData,
// 	getImage,
// 	hiDynamic
// } from "@/api/work-flow-mark/index.js";
// import uploadList from "../Upload/uploadList.vue";
import config from "@/settings.js";
import moment from "moment";

export default {
	components: {
		// uploadList
	},
	props: {
		trajectoryData: {
			type: Array,
			default() {
				return [];
			}
		}, // 留痕轨迹
		userSlot: {
			type: Object,
			default() {
				return { log: false, order: false };
			}
		},
		showDefaultImg: {
			type: Boolean,
			default() {
				return false;
			}
		},
		messageList: {
			type: Boolean,
			default() {
				return false;
			}
		},
		workId: String,
		defid: String,
		isShowFlow: {
			type: Boolean,
			default: true
		},
		sendOrder: {
			type: Boolean,
			default: false
		},
		ticketType: Number,
		processInstanceId: [String,Number]
	},
	data() {
		return {
			form: {
				remark: ""
			},
			moment,
			operateFlag: true,
			orderList: [],
			// defaultImg: require("../../assets/btn-login.png")
		};
	},
	computed: {
		activeName: {
			get() {
				if (this.trajectoryData && this.trajectoryData.length) {
					return "trace";
				} else if (this.isShowFlow && this.instanceId) {
					return "flow";
				} else if (this.orderList && this.orderList.length) {
					return "order";
				} else {
					return "message";
				}
			},
			set() {}
		},
		id() {
			return this.$route.query.id;
		},
		instanceId() {
			return this.$route.query.instanceId || this.showDefaultImg ? 1 : "";
		},
		calculate(color) {
			return function(color) {
				let textVal = "";
				switch (color) {
					case "NORMAL":
						textVal = "正常";
						break;
					case "SUCCESS":
						textVal = "通过";
						break;
					case "FAIL":
						textVal = "驳回";
						break;
				}

				return textVal;
			};
		}
	},
	watch: {
		workId(ne, ol) {
			this.workId = ne;
			// this.getImageData();
		},
		processInstanceId(n, o) {
			// this.getList();
		}
	},
	mounted() {
		if (this.processInstanceId) {
			// this.getList();
		}
		// this.getImageData();
	},
	methods: {
		calculateColor(child) {
			let textColor = "";
			if (
				child.value &&
				child.value.indexOf("通过") != -1 &&
				child.name &&
				child.name.indexOf("结果") != -1
			) {
				textColor = "successColor";
				return textColor;
			}
			switch (child.value) {
				case "正常":
					textColor = "normalColor";
					break;
				case "驳回":
					textColor = "errColor";
					break;
				default:
					textColor = "";
			}
			return textColor;
		},
		clickdemo() {
			this.$emit("clickdemo", this.form.remark);
			this.form.remark = "";
		},
		toDetail(info) {
			window.location.href = info.detailUrl;
		},
		// getList() {
		// 	hiDynamic({
		// 		processInstanceId: String(this.processInstanceId)
		// 	}).then(res => {
		// 		if (res.msg.code == "0000") {
		// 			this.orderList = res.data;
		// 		}
		// 	});
		// },
		operateClick() {
			this.operateFlag = !this.operateFlag;
		},
		// 下载
		download(item) {
			window.open(
				`${config.baseUrl}/csportalsite/api/file/download?id=${item.id}`
			);
		},
		// 预览
		seeclick(item) {
			if (["zip", "rar"].includes(item.name.split(".").pop())) {
				window.open(
					`${config.baseUrl}/csportalsite/api/file/download?id=${item.id}`
				);
			} else {
				window.open(
					`${config.baseUrl}/csportalsite/api/file/docapi/view/?fileId=${item.id}`
				);
			}
		},
		// getImageData() {
		// 	let params = {
		// 		workflowId: this.workId
		// 	};
		// 	getImage(params).then(res => {
		// 		if (Object.keys(res.data).length > 0) {
		// 			this.defaultImg = res.data;
		// 		} else {
		// 			this.defaultImg = "";
		// 		}
		// 	});
		// }
	}
};
</script>

<style lang="scss" scoped>
@import "~@/styles/blue.scss";

.Tabs {
	margin-bottom: 20px;
	position: relative;
	/deep/ .el-timeline {
		font-size: 16px;
	}
	/deep/ .el-timeline-item__tail {
		border-left: 2px dashed #999;
	}
	/deep/ .el-timeline-item__node {
		// background-color: #1890ff !important;
		border: 3px solid rgba(236, 242, 252, 1);
		box-sizing: content-box;
		left: -4px;
		top: -3px;
	}
	.title {
		font-size: 16px;
		font-weight: bold;
		// color: #1890ff;
	}

	.tabDiv {
		width: 100%;
	}
	.width-100 {
		width: 100% !important;
	}
	.tag {
		display: flex;
		width: 50%;
		color: #999;
		margin-top: 8px;
		line-height: 26px;
		i {
			font-style: initial;
			color: #333;
		}

		li {
			display: flex;
			height: 36px;
			align-items: center;
		}
		.el-button--small {
			padding: 0;
		}
		.success {
			color: #009900;
		}

		.error {
			color: #ff1313;
		}
	}
	.fileList {
		display: inline-block;
		.fileItem {
			margin-top: 8px;
			display: flex;
			min-width: 242px;
			max-width: 242px;
			align-items: center;
			border-radius: 2px;
			background-color: #fcfcfc;
			border: 1px solid #ececec;
			padding: 8px 12px;
			.fileName {
				color: #333;
				flex-grow: 1;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				margin-right: 13px;
				margin-left: 9px;
				font-size: 14px;
			}
			.uploader_class {
				margin-right: 16px;
			}
			.uploadImg_class,
			.uploader_class {
				cursor: pointer;
			}
			.svg-icon {
				font-size: 18px;
			}
		}
	}
	.successColor {
		color: #009900 !important;
	}
	.normalColor {
		color: $executeColor !important;
	}
	.errColor {
		color: $riskColor !important;
	}
	.process_img {
		width: 100%;
	}
}
.operate {
	position: absolute;
	right: 30px;
	top: 10px;
	z-index: 999;
	// color: #007aff;
}

.hid {
	display: none;
}
.orderList {
	.taskName {
		color: #1890ff;
		font-size: 16px;
		font-weight: bold;
	}
}
.cpointer {
	li {
		margin-right: 16px;
		width: 250px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		i {
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}
}
</style>
<style lang="scss">
.Tabs {
	.operateLog {
		.el-tabs__content {
			max-height: 650px;
			overflow-y: scroll;
			&::-webkit-scrollbar {
				display: none;
				/* Chrome Safari */
			}
			scrollbar-width: none;
			/* 火狐 */
			-ms-overflow-style: none;
			/* IE */
		}
	}

	.resizeHight {
		.el-tabs__content {
			height: 0;
			overflow-y: scroll;
		}
	}
}
</style>
