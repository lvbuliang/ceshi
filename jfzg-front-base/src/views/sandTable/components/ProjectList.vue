<template>
    <div class="project_list">
        <div class="project_head">
            <div class="project_title">
                <i
                    class="base-iconfont icon-right-arrow"
                    @click="getChild"
                    v-if="!childList.length && $attrs.isHaveChild"
                ></i>
                <i
                    class="base-iconfont icon-down-arrow"
                    @click="childList = []"
                    v-if="childList.length && $attrs.isHaveChild"
                ></i>
                <div class="title" @click="toSingleProject">
                    {{ $attrs.projectName }}
                </div>
                <span class="tag" v-if="$attrs.projectTypeName">{{
                    $attrs.projectTypeName
                }}</span>
            </div>
            <div class="project_code">
                <div class="code">项目编号：{{ $attrs.projectCode }}</div>
                <span class="line">|</span>
                <div class="price">
                    总投资：{{ $attrs.totalInvestmentAmount }}万元
                </div>
            </div>
        </div>
        <project-accordion
            @showCharts="riskAndQuestionshowCharts"
            mode="white"
            v-bind="$attrs"
        ></project-accordion>
        <risk-and-question
            ref="riskAndQuestion"
            class="riskAndQuestion"
        ></risk-and-question>
        <keyan-and-budgetary
            ref="keyanAndBudgetary"
            class="keyanAndBudgetary"
        ></keyan-and-budgetary>
        <childProjectList
            ref="projectList"
            class="projectList"
        ></childProjectList>
        <div
            class="project_child"
            v-for="(item, index) in childList"
            :key="'cp_'+index"
        >
            <div class="project_head">
                <div class="project_title" @click="toSingleProjectById(item)">
                    <i class="base-iconfont icon-return-btn"></i>
                    <div class="title">{{ item.projectName }}</div>
                    <span class="tag" v-if="item.projectTypeName">{{
                        item.projectTypeName
                    }}</span>
                </div>
                <div class="project_code">
                    <div class="code">项目编号：{{ item.projectCode }}</div>
                    <span class="line">|</span>
                    <div class="price">
                        总投资：{{ item.totalInvestmentAmount }}万元
                    </div>
                </div>
            </div>
            <project-accordion
                @showCharts="childProjectShowCharts"
                v-bind="item"
            ></project-accordion>
            <template v-if="item.id === activeId">
                <risk-and-question
                    ref="riskAndQuestionChild"
                    class="riskAndQuestion"
                ></risk-and-question>
                <keyan-and-budgetary
                    ref="keyanAndBudgetaryChild"
                    class="keyanAndBudgetary"
                ></keyan-and-budgetary>
                <childProjectList
                    ref="projectListChild"
                    class="projectList"
                ></childProjectList>
            </template>
        </div>
    </div>
</template>

<script>
import ProjectAccordion from "./ProjectAccordion.vue";
import riskAndQuestion from "./riskAndQuestion.vue"; //风险问题详情
import childProjectList from "./childProjectList.vue"; //实施详情
import { getProjectBasciInfoList } from "@/api/home";
import keyanAndBudgetary from "./keyanAndBudgetary.vue"; //可研概算详情
export default {
    components: {
        ProjectAccordion,
        riskAndQuestion,
        childProjectList,
        keyanAndBudgetary,
    },
    props: {},
    data() {
        return {
            childList: [],
            activeId: null,
            isEnd: null
        };
    },
    methods: {
        // 点击点头展开子项目
        getChild() {
            getProjectBasciInfoList({ projectId: this.$attrs.id }).then(
                (res) => {
                    if (res.msg.code === "0000") {
                        if (
                            res.data.jfzgProjectLibraryList &&
                            res.data.jfzgProjectLibraryList.length
                        ) {
                            this.childList = res.data.jfzgProjectLibraryList;
                        } else {
                            this.$message({
                                message: "暂无子项目",
                                type: "warning",
                            });
                        }
                    }
                }
            );
        },
        // 查看图标
        riskAndQuestionshowCharts(item, flag) {
            if (flag) {
                this.$refs.riskAndQuestion.close();
                this.$refs.projectList.close();
                this.$refs.keyanAndBudgetary.close();
                if (item.nodeDetail.itemName === "调度管理") {
                    this.$refs.riskAndQuestion.open(item.projectDetail);
                } else if (item.nodeDetail.itemName === "实施管理") {
                    this.$refs.projectList.open(item.projectDetail);
                } else {
                    this.$refs.keyanAndBudgetary.open(
                        item.projectDetail,
                        item.nodeDetail.itemId
                    );
                }
            } else {
                this.$refs.riskAndQuestion.close();
                this.$refs.projectList.close();
                this.$refs.keyanAndBudgetary.close();
            }
        },
        // 点击项目名称查看单项目沙盘
        toSingleProject() {
            this.$router.push({
                name: "singleProject",
                query: { projectId: this.$attrs.id },
            });
        },
        // 点击项目名称查看单项目沙盘
        toSingleProjectById(item) {
            this.$router.push({
                name: "singleProject",
                query: { projectId: item.id },
            });
        },
        childProjectShowCharts(item, flag) {
            this.activeId = item.projectDetail.id;
            this.$nextTick(() => {
                if (flag) {
                    this.$refs.riskAndQuestionChild[0].close();
                    this.$refs.projectListChild[0].close();
                    this.$refs.keyanAndBudgetaryChild[0].close();
                    if (item.nodeDetail.itemName === "调度管理") {
                        this.$refs.riskAndQuestionChild[0].open(
                            item.projectDetail
                        );
                    } else if (item.nodeDetail.itemName === "实施管理") {
                        this.$refs.projectListChild[0].open(item.projectDetail);
                    } else {
                        this.$refs.keyanAndBudgetaryChild[0].open(
                            item.projectDetail,
                            item.nodeDetail.itemId
                        );
                    }
                } else {
					if (this.$refs.riskAndQuestionChild[0]) {
						this.$refs.riskAndQuestionChild[0].close();
						this.$refs.projectListChild[0].close();
						this.$refs.keyanAndBudgetaryChild[0].close();
					}
                }
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.project_list {
    width: 100%;
    border-radius: 8px;
    border: 1px solid #e5e5e5;
    margin-bottom: 16px;
    position: relative;
    .project_head {
        height: 60px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 24px 0 16px;
        .project_title,
        .project_code {
            display: flex;
            align-items: center;
            .title {
                font-size: 20px;
                color: #333;
                font-weight: 500;
                cursor: pointer;
            }
            .tag {
                height: 24px;
                line-height: 24px;
                background-color: #e6f7ff;
                border-radius: 12px;
                padding: 0px 8px;
                color: #1890ff;
                font-size: 12px;
                margin-left: 8px;
            }
            i {
                cursor: pointer;
            }
        }
        .project_code {
            color: #999;
            font-size: 14px;
            .line {
                margin: 0 16px;
            }
        }
    }
    .project_child {
		position: relative;
        .project_head {
            height: 36px;
            padding-left: 39px;
            background-color: #fafafa;
            .title {
                font-size: 16px !important;
            }
            .icon-return-btn {
                color: #666;
            }
        }
		::v-deep .keyanAndBudgetary, .child_project, .riskAndQuestion{
			top: 155px;
		}
    }
}
</style>