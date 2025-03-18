<template>
    <div>
        <el-tabs
            type="border-card"
			v-model="activeName"
            closable
            class="navTabs hideBtnTab"
        >
            <el-tab-pane label="预览" name="预览"></el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
export default {
	data() {
		return {
			activeName: '预览'
		}
	}
}
</script>
<style lang="scss">
.navTabs {
    border: none;
    box-shadow: none;
    background: transparent;
    .el-tabs__header {
        border: none;
        background: transparent;
        .el-tabs__nav-wrap {
            background-color: transparent;
            .el-tabs__item {
                background: #7f91a7;
                border-radius: 8px 8px 0px 0px;
                color: #fff;
                height: 32px;
                line-height: 32px;
                &:hover {
                    color: #fff;
                }
            }
            .is-active {
                background-color: #fff;
                color: #333;
                &:hover {
                    color: #333;
                }
            }
        }
    }
    .el-tabs__content {
        padding: 0 !important;
    }
}
.hideBtnTab {
    .el-tabs__nav {
        .el-icon-close {
            display: none;
        }
    }
}
</style>
