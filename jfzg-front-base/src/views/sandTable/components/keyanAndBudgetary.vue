<template>
    <div class="keyanAndBudgetary" v-cloak v-if="show">
        <div class="keyanAndBudgetary_head">
            <div class="keyanAndBudgetary_head_box" v-if="btns && btns.length && ([1,2,7].includes(itemId))">
                <el-button
                    v-for="(item, index) in btns"
                    :key="index"
                    size="mini"
                    round
                    @click="toMeum(item)"
                    >{{ item.btnName }}</el-button
                >
            </div>
            <div class="keyanAndBudgetary_head_box" v-else-if="itemId === 4 || itemId === 6">
                <el-button
                    v-for="(item, index) in btns"
                    :key="index"
                    size="mini"
                    round
                    @click="toProjectPath(item)"
                    >{{ item.permissionName }}</el-button
                >
            </div>
            <div class="empty" v-else-if="isEnd">
                <i class="base-iconfont icon-warning1"></i>
                {{isEnd}}
            </div>
        </div>
    </div>
</template>

<script>
import { getOperatorNameAndDetailUrl } from "@/api/home";
export default {
    components: {},
    props: {
        index: {
            type: Number,
            default: () => {
                return null;
            },
        }
    },
    data() {
        return {
            show: false,
            btns: [],
            isEnd: null,
            itemId: null
        };
    },
    methods: {
        close() {
            this.show = false;
        },
        open(projectDetail, itemId) {
            this.show = true;
            this.itemId = itemId
            getOperatorNameAndDetailUrl({
                projectId: projectDetail.id,
                itemId,
            }).then((res) => {
                if (res.msg.code === "0000") {
                    if ([1,2,7].includes(itemId)) {
                        // 可研、概算操作按钮
                        let status = {
                            '1': '未开始',
                            '2': '审批中',
                            '3': '已结束'
                        }
                        this.isEnd = `该阶段${status[res.data.status]}`
                        this.btns = res.data.studyAndPreliminaryNameAndDetailUrlList;
                    } else {
                        // 验收、后评价菜单按钮
                        this.btns = res.data.implementAnddeliveryNameAndDetailUrlList;
                    }
                    
                }
            });
        },
        toMeum(item) {
            this.$router.push({
                path: item.detailUrl,
            });
            let element = {
                url: item.detailUrl,
                title: item.btnName,
            };
            // 更新tabs页签
            this.$store.commit("tabs/UPDATE_TABS_LIST", element);
            this.$store.commit("tabs/UPDATE_CURRENT_PAGE", element.url);
        },
        toProjectPath(item) {
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
        }
    },
};
</script>

<style lang="scss" scoped >
.keyanAndBudgetary {
    width: calc(100% + 2px);
    box-shadow: 0px 2px 20px 0px rgba(0, 0, 0, 0.11);
    border-radius: 0px 0px 8px 8px;
    height: 40px;
    position: absolute;
    z-index: 800;
    background: #fff;
    top: 180px;
    left: -1px;
    .keyanAndBudgetary_head_box {
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 16px;
    }
    .empty {
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #333;
        font-size: 14px;
        i {
            color: #FFAA22;
            margin-right: 7px;
        }
    }
}
</style>
