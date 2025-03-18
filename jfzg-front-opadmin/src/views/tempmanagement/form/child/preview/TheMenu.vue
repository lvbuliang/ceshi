<template>
    <div>
        <div class="the-menu-box">
            <div class="the-first-menu">
                <img src="@/assets/images/menu-icon.png" class="menu-icon" />
                <span class="menu-sub-title">预览</span>
            </div>
        </div>
        <el-menu @select="handleSelect" class="menu-item-box">
            <div class="module-name-box">
                <span class="module-title">预览菜单</span>
            </div>
            <el-menu-item index="1">
                <span class="menu-item-title">新增预览</span>
            </el-menu-item>
            <el-menu-item index="2">
                <span class="menu-item-title">查看预览</span>
            </el-menu-item>
            <el-menu-item index="3">
                <span class="menu-item-title">审批预览</span>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script>
export default {
	props: ["activeIndex"],
	methods: {
		handleSelect(index) {
			this.$emit("update:activeIndex", index)
		}
	}
};
</script>

<style lang="scss" scoped>
$menu-height: 64px;
$header-background: rgba(25, 118, 255, 0.8);
.the-menu-box {
    width: 80px;
    padding-top: 16px;
    border-right: 1px solid rgba(255, 255, 255, 0.2);
    box-sizing: content-box;
    .the-menu-logo {
        margin: 30px 0 36px 24px;
        height: 40px;

        img {
            width: 40px;
            height: 40px;
        }
    }

    .the-first-menu {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 64px;
        margin: 0 auto;
        &:hover {
            cursor: pointer;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 8px;
        }

        padding: 0;
        height: $menu-height;
        margin-bottom: 10px;

        .menu-icon {
            width: 24px;
        }
        &.active {
            position: relative;
            cursor: pointer;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            color: #fff;

            .menu-item-title {
                font-weight: 500;
                color: #fff;
            }
        }
        .menu-sub-title {
            font-size: 12px;
            line-height: 20px;
            font-weight: 400;
        }
    }
}

.menu-item-box {
    padding: 0 8px;
    width: 216px;
    background: $header-background;
    background-size: 100% 100%;
    border-right: none;
    box-sizing: border-box;
    &.el-menu {
        background-color: transparent;
        > .el-menu-item {
            height: 40px;
            line-height: 40px;
            margin-bottom: 10px;
            padding-left: 25px !important;
            &:hover {
                cursor: pointer;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 8px;
            }
            &:focus {
                cursor: pointer;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 8px;
            }

            &.is-active {
                position: relative;
                cursor: pointer;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 8px;
                color: #fff;

                .menu-item-title {
                    font-weight: 500;
                    color: #fff;
                }
            }
        }
    }

    .el-submenu {
        margin-bottom: 8px;
        .el-menu-item {
            height: 40px;
            line-height: 40px;
            padding: 0 36px !important;
            &:hover {
                cursor: pointer;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 8px;
            }
            &:focus {
                cursor: pointer;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 8px;
            }

            &.is-active {
                position: relative;
                color: #fff;
                cursor: pointer;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 8px;
                .menu-item-title {
                    font-weight: 500;
                    color: #fff;
                }
            }
        }

        ::v-deep .el-submenu__title {
            height: 40px;
            line-height: 40px;

            &:hover {
                background-color: transparent;
            }

            .el-submenu__icon-arrow {
                display: none;
            }
        }

        .menu-item-title {
            margin-left: -1px;
        }
    }

    .module-name-box {
        padding: 24px 8px;
        display: flex;
        align-items: center;
        .el-menu {
            background: $header-background;
        }
        .module-icon {
            width: 24px;
            margin-right: 9px;
        }

        .module-title {
            font-size: 16px;
            font-weight: 500;
            color: #fff;
            line-height: 24px;
        }
    }

    .submenu-title {
        margin-left: -14px;

        img {
            width: 24px;
            margin-right: 4px;
        }

        span {
            font-size: 14px;
            color: #fff;
            font-weight: 400;
            line-height: 22px;
            display: inline-block;
        }
    }

    .menu-item-title {
        font-size: 14px;
        color: #fff;
        margin-left: 9px;
        font-weight: normal;
        line-height: 1;
    }
}
</style>
<style lang="scss">
.el-menu {
    background-color: transparent;
}
</style>