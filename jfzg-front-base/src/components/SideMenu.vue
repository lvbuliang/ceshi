<template>
    <div class="side-menu" v-if="subMenu && subMenu.length > 0">
        <el-menu
            class="menu-item-box"
            :default-openeds="menuDefaultOpeneds"
            :default-active="getDefaultId(subMenu)"
        >
            <template v-for="item_of_sub_children of subMenu">
                <template
                    v-if="
            item_of_sub_children.children &&
            item_of_sub_children.children.length > 0
          "
                >
                    <!--有3级菜单-->
                    <el-submenu
                        :key="item_of_sub_children.permissionId + ''"
                        :index="item_of_sub_children.permissionId + ''"
                    >
                        <div slot="title" class="submenu-title">
                            <img src="@/assets/images/bag-icon.png" class="module-icon" />
                            <span>{{ item_of_sub_children.title }}</span>
                        </div>
                        <el-menu-item
                            v-for="item_of_sub_children_children of item_of_sub_children.children"
                            :key="item_of_sub_children_children.permissionId + ''"
                            :index="item_of_sub_children_children.permissionId + ''"
                            @click="
                goto(
                  item_of_sub_children.module,
                  item_of_sub_children_children.url,
                  item_of_sub_children_children,
                )
              "
                        >
                            <span class="menu-item-title">
                                {{
                                item_of_sub_children_children.title
                                }}
                            </span>
                        </el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <!--只有2级-->
                    <el-menu-item
                        :key="item_of_sub_children.permissionId + ''"
                        :index="item_of_sub_children.permissionId + ''"
                        @click="
              goto(subMenu.module, item_of_sub_children.url, item_of_sub_children)
            "
                    >
                        <div class="submenu-title">
                            <img src="@/assets/images/bag-icon.png" class="module-icon" />
                            <span>{{ item_of_sub_children.title }}</span>
                        </div>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import { mapState } from "vuex";
import { routerGo } from "@/utils/utils.js"; // 引入跨应用路由跳转
export default {
    data() {
        return {
            currentMenuItem: null,
        };
    },
    computed: {
        ...mapState({
            currentModule: (state) => state.menu.currentModule,
            subMenu: (state) => state.menu.subMenu,
            currentPage: (state) => state.tabs.currentPage,
        }),
        // 左侧菜单默认展开
        menuDefaultOpeneds() {
            let arr = [];
            this.subMenu.map((menuItem) => {
                arr.push(menuItem.permissionId + "");
            });
            return arr;
        },
    },
    watch: {
        currentMenuItem: {
            handler(newVal) {
                if (newVal) {
                    this.$store.commit("tabs/UPDATE_TABS_LIST", newVal);
                    this.$store.commit("tabs/UPDATE_CURRENT_PAGE", newVal.url);
                }
            },
        },
    },
    methods: {
        getDefaultId(menu) {
            this.filterMenus(this.$route.fullPath, menu);
            if (this.currentMenuItem) {
                return this.currentMenuItem.permissionId + "";
            } else {
                return "";
            }
        },
        goto(title, href, item) {
            this.$emit("hideSideMenu");
            let openNewTag = true;
            let newUrl = "";
            let tabList = JSON.parse(sessionStorage.getItem("tabsList"))||[];
            tabList.forEach((res) => {
                if (res.url.startsWith(`${href}/`)) {
                    openNewTag = false;
                    newUrl = res.url;
                }
            });
           
            if (openNewTag) {
                this.$store.commit("tabs/UPDATE_TABS_LIST", item);
                this.$store.commit("tabs/UPDATE_CURRENT_PAGE", item.url);
                this.currentMenuItem = item
				routerGo(href, title);
            } else {
                routerGo(newUrl, title);
			}
        },
        filterMenus(menuUrl, menu) {
            let result = null;
            if (menuUrl) {
                for (let i = 0, len = menu.length; i < len; i++) {
                    let menuItem = menu[i];
                    if (!menuItem.children || menuItem.children.length == 0) {
                        if (
                            menuItem.url == menuUrl ||
                            menuItem.url + "/" == menuUrl
                        ) {
                            result = menuItem;
                            break;
                        }
                    } else {
                        result = this.filterMenus(menuUrl, menuItem.children);
                    }
                }
            }
            if (result) {
                this.currentMenuItem = result;
            }
        },
    },
};
</script>


<style lang="scss" scoped>
.side-menu {
    padding: 16px 8px;
    width: 216px;
    position: absolute;
    height: calc(100% + 1px);
    left: 80px;
    border-left: 1px solid rgba(255, 255, 255, 0.2);
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(49, 133, 255, 0.9);
    top: -1px;
    z-index: 200;
    box-shadow: 12px 8px 10px 0px rgba(0, 0, 0, 0.1);
}
.module-name-box {
    padding: 24px 8px;
    display: flex;
    align-items: center;

    .module-title {
        font-size: 16px;
        font-weight: 500;
        color: #fff;
        line-height: 24px;
    }
}
.menu-item-box {
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
        padding-left: -6px;
        ::v-deep .el-menu {
            background-color: transparent;
            .el-menu-item {
                margin-top: 8px;
            }
        }

        .el-menu-item {
            height: 40px;
            line-height: 40px;
            padding: 0 42px !important;
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
            .submenu-title {
                margin-left: -8px;
            }
        }

        .menu-item-title {
            margin-left: -1px;
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
            line-height: 26px;
            height: 24px;
            display: inline-block;
        }
    }

    .menu-item-title {
        font-size: 14px;
        color: #fff;
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
