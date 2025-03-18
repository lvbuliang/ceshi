<template>
    <div class="riskAndQuestion" v-if="show">
        <div class="child_project_head">
            <template v-if="type == 'riskQuestion'">
                <div class="left">
                    <el-button
                        v-for="(item, index) in buts"
                        :key="index"
                        size="mini"
                        round
                        @click="toMeum(item)"
                        >{{ item.permissionName }}</el-button
                    >
                </div>
                <div class="right">
                    <i class="el-icon-close" @click="close"></i>
                </div>
            </template>
        </div>
        <div class="child_project_content">
            <template v-if="type == 'riskQuestion'">
                <el-row>
                    <el-col :span="12" class="risk">
                        <div class="title">风险情况</div>
                        <div class="riskDetail_list">
                            <div
                                class="riskDetail_list_box"
                                v-for="(item, index) in riskDetail"
                                :key="index"
                            >
                                <el-progress
                                    type="circle"
                                    :width="52"
                                    :percentage="
                                        item.round && Number(item.round)
                                    "
                                    :format="
                                        (percentage) => {
                                            return format(percentage, item);
                                        }
                                    "
                                    :color="item.color"
                                ></el-progress>

                                <div class="riskDetail_list_type">
                                    <template v-if="index == 0">
                                        <img
                                            src="./../../../assets/images/sendTableChildren/high.png"
                                            width="11px"
                                            height="auto"
                                            alt=""
                                        />
                                    </template>
                                    <template v-if="index == 1">
                                        <img
                                            src="./../../../assets/images/sendTableChildren/middle.png"
                                            width="11px"
                                            height="auto"
                                            alt=""
                                        />
                                    </template>
                                    <template v-if="index == 2">
                                        <img
                                            src="./../../../assets/images/sendTableChildren/low.png"
                                            width="11px"
                                            height="auto"
                                            alt=""
                                        />
                                    </template>
                                    <span>{{
                                        item.riskLevel == 2
                                            ? "高"
                                            : item.riskLevel == 1
                                            ? "中"
                                            : "低"
                                    }}</span>
                                </div>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="12" class="question">
                        <div class="title">问题情况</div>
                        <div class="questionDetail_list">
                            <div
                                class="questionDetail_list_box"
                                v-for="(item, index) in questionDetail"
                                :key="index"
                            >
                                <div class="questionDetail_list_type">
                                    <template v-if="item.riskLevel == 2">
                                        <img
                                            src="./../../../assets/images/sendTableChildren/high.png"
                                            width="11px"
                                            height="auto"
                                            alt=""
                                        />
                                    </template>
                                    <template v-if="item.riskLevel == 1">
                                        <img
                                            src="./../../../assets/images/sendTableChildren/middle.png"
                                            width="11px"
                                            height="auto"
                                            alt=""
                                        />
                                    </template>
                                    <template v-if="item.riskLevel == 0">
                                        <img
                                            src="./../../../assets/images/sendTableChildren/low.png"
                                            width="11px"
                                            height="auto"
                                            alt=""
                                        />
                                    </template>
                                    <span>{{
                                        item.riskLevel == 2
                                            ? "高"
                                            : item.riskLevel == 1
                                            ? "中"
                                            : "低"
                                    }}</span>
                                </div>
                                <el-progress
                                    :width="52"
                                    :percentage="item.round"
                                    :color="item.color"
                                ></el-progress>
                                <div class="questionDetail_list_num">
                                    <span>{{ item.amount }}</span>
                                </div>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </template>
        </div>
    </div>
</template>

<!--
  功能：沙盘子功能 风险以及问题
  汪振涛
  时间：2021年07月22日 10:00:05
  版本：v1.0
-->
<script>
import { dispatchStaticInfo, getOperatorNameAndDetailUrl } from "@/api/home";
export default {
    components: {},
    props: {},
    data() {
        return {
            type: "riskQuestion",
            buts: [],
            riskDetail: [
                {
                    amount: 0,
                    riskLevel: 2,
                    color: "#F9495A",
                    totalAmount: 0,
                },
                {
                    amount: 0,
                    riskLevel: 1,
                    color: "#F8A71C",
                    totalAmount: 0,
                },
                {
                    amount: 0,
                    riskLevel: 0,
                    totalAmount: 0,
                },
            ],
            questionDetail: [
                {
                    amount: 0,
                    riskLevel: 2,
                    color: "#F9495A",
                    totalAmount: 0,
                },
                {
                    amount: 0,
                    riskLevel: 1,
                    color: "#F8A71C",
                    totalAmount: 0,
                },
                {
                    amount: 0,
                    riskLevel: 0,
                    totalAmount: 0,
                },
            ],
            show: false,
        };
    },
    methods: {
        format(percentage, item) {
            return `${item.amount}`;
        },
        getDispatchStaticInfo(projectId) {
            dispatchStaticInfo({ projectId: projectId }).then(
                ({ data, msg }) => {
                    this.result = data;
                    this.questionDetail = this.getLevelAmount(
                        this.questionDetail,
                        data.questionAmountOfLevel
                    );
                    this.riskDetail = this.getLevelAmount(
                        this.riskDetail,
                        data.riskAmountOfLevel
                    );
                }
            );
        },
        getQueryOperatorNameAndDetailUrl(projectId) {
            getOperatorNameAndDetailUrl({
                projectId: projectId,
                itemId: 5,
            }).then(
                ({
                    data,
                    msg,
                    data: {
                        studyAndPreliminaryNameAndDetailUrlList, //菜单信息
                        implementAnddeliveryNameAndDetailUrlList, // btn信息
                    },
                }) => {
                    if (
                        studyAndPreliminaryNameAndDetailUrlList &&
                        studyAndPreliminaryNameAndDetailUrlList.length
                    ) {
                    } else if (
                        implementAnddeliveryNameAndDetailUrlList &&
                        implementAnddeliveryNameAndDetailUrlList.length
                    ) {
                        this.buts = implementAnddeliveryNameAndDetailUrlList;
                    }
                }
            );
        },
        //数组填充 倒序
        getLevelAmount(paramsList = [], resultParams = []) {
            paramsList = paramsList.map((item) => {
                const arrs = resultParams.find(
                    (i) => item.riskLevel == i.riskLevel
                );

                return {
                    ...item,
                    ...arrs,
                };
            });
            paramsList.sort((a, b) => {
                return b.riskLevel - a.riskLevel;
            });
            paramsList.forEach((item) => {
                if (item.totalAmount != 0) {
                    item.round = Math.round(
                        (Number(item.amount) / Number(item.totalAmount)) * 100
                    );
                } else {
                    item.round = 0;
                }
            });
            return paramsList;
        },
        open(projectDetail) {
            this.show = true;
            this.getDispatchStaticInfo(projectDetail.id);
            this.getQueryOperatorNameAndDetailUrl(projectDetail.id);
        },
        close() {
            this.show = false;
            this.$emit("close", this.show);
        },
        toMeum(item) {
            this.$router.push({
                path: item.url,
            });
            let element = {
                url: item.url,
                title: item.permissionName,
            };
            // 更新tabs页签
            this.$store.commit("tabs/UPDATE_TABS_LIST", element);
            this.$store.commit("tabs/UPDATE_CURRENT_PAGE", element.url);
        },
    },
};
</script>

<style lang="scss" >
.riskAndQuestion {
    height: 188px;
    overflow: hidden;
    width: calc(100% + 2px);
    box-shadow: 0px 2px 20px 0px rgba(0, 0, 0, 0.11);
    position: absolute;
    background: #fff;
    z-index: 100;
    border: none;
    overflow: hidden;
    right: -1px;
    top: 180px;
    border-radius: 0 0 8px 8px;
    .child_project_head {
        border-bottom: 1px solid #efefef;
        height: 40px;
        padding: 0 16px;
        display: flex;
        align-items: center;
        .left {
			flex-grow: 1;
			height: 100%;
			display: flex;
			align-items: center;
            .el-button {
                padding: 5px 12px;
                border: 1px solid #e5e5e5;
                color: #333333;
            }
            .el-button + .el-button {
                margin-left: 6px;
            }
        }
        .right {
            > i {
                cursor: pointer;
            }
        }
    }
    .child_project_content {
        height: calc(100% - 40px);

        .el-row {
            height: 100%;

            .el-col {
                height: 100%;
                padding: 16px;
                .title {
                    font-weight: 400;
                    color: #999999;
                    line-height: 17px;
                    margin-bottom: 23px;
                    font-size: 12px;
                }
            }
            .risk {
                border-right: 1px solid #efefef;
                .riskDetail_list {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 24px 0 12px;
                    .riskDetail_list_box {
                        .riskDetail_list_type {
                            display: inline-block;
                            vertical-align: top;
                            height: 52px;
                            line-height: 52px;
                        }
                        &:nth-child(1) {
                            .riskDetail_list_type {
                                img {
                                    margin: 0 4px 0 13px;
                                }
                                span {
                                    color: #f5222d;
                                }
                            }
                        }
                        &:nth-child(2) {
                            .riskDetail_list_type {
                                img {
                                    margin: 0 4px 0 13px;
                                }
                                span {
                                    color: #ffaa22;
                                }
                            }
                        }
                        &:nth-child(3) {
                            .riskDetail_list_type {
                                img {
                                    margin: 0 4px 0 13px;
                                }
                                span {
                                    color: #1890ff;
                                }
                            }
                        }
                    }
                }
            }
            .question {
                .questionDetail_list {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    .questionDetail_list_box {
                        width: 33.333%;
                        .el-progress-bar {
                            .el-progress-bar__outer {
                                height: 8px !important;
                            }
                        }
                        .el-progress__text {
                            visibility: hidden;
                            display: none;
                        }
                        .questionDetail_list_type {
                            line-height: 15px;
                            margin: 5px 0 4px 0;
                        }
                        &:nth-child(1) {
                            .questionDetail_list_type {
                                img {
                                    margin-right: 4px;
                                }
                                span {
                                    color: #f5222d;
                                }
                            }
                            .el-progress {
                                .el-progress-bar {
                                    .el-progress-bar__outer {
                                        background: rgba(245, 34, 45, 0.11);
                                    }
                                }
                            }
                        }
                        &:nth-child(2) {
                            .questionDetail_list_type {
                                img {
                                    margin-right: 4px;
                                }
                                span {
                                    color: #ffaa22;
                                }
                            }
                            .el-progress {
                                .el-progress-bar {
                                    .el-progress-bar__outer {
                                        background: rgba(246, 175, 46, 0.11);
                                    }
                                }
                            }
                        }
                        &:nth-child(3) {
                            .questionDetail_list_type {
                                img {
                                    margin-right: 4px;
                                }
                                span {
                                    color: #1890ff;
                                }
                            }
                            .el-progress {
                                .el-progress-bar {
                                    .el-progress-bar__outer {
                                        background: rgba(24, 144, 255, 0.11);
                                    }
                                }
                            }
                        }
                        .questionDetail_list_num {
                            line-height: 17px;
                            margin-top: 3px;
                            font-weight: 400;
                            color: #000000;
                        }
                    }
                }
            }
        }
    }
}
</style>
