<template>
    <div :class="{'the-nav': true, complex: isComplex}">
        <div class="logo-image-box">
            <img class="logo-image-0" src="@/assets/images/header/logo-0.png" width="32px" alt />
            <div class="logo-box">
                <img class="logo-image-1" src="@/assets/images/header/logo-1.png" alt="解放智管" />
                <img
                    class="logo-image-2"
                    src="@/assets/images/header/logo-2.png"
                    alt="项目全生命周期管理 护航智慧城市建设"
                />
            </div>
        </div>
        <div class="click-area" @click="isComplex = !isComplex"></div>
        <!-- 右侧操作区 -->
        <div class="nav-handle-box">
            <!--用户-->
            <div class="use-info-box">
                <div class="nav-user-name">{{ userInfo && userInfo.userName }}</div>
                <el-dropdown @command="handleCommand" trigger="click">
                    <span class="el-dropdown-link">
                        <span>
                            {{
                            userInfo && userInfo.roleName
                            }}
                        </span>
                        <i class="el-icon-arrow-down el-icon--right"></i>
                        &nbsp;&nbsp;
                    </span>
                    <el-dropdown-menu slot="dropdown" v-if="roleList && roleList.length">
                        <el-dropdown-item
                            :command="item.roleName"
                            v-for="item in roleList"
                            :key="item.roleId"
                        >{{ item.roleName }}</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <!-- 通知 -->
            <div class="icon-control">
                <img src="@/assets/images/header/tips.png" alt />
            </div>
            <!-- 消息按钮 -->
            <div class="icon-control">
                <img src="@/assets/images/header/setting.png" alt />
            </div>
            <div class="icon-control" title="关闭">
                <img src="@/assets/images/header/exit.png" @click="logOut()" alt />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "theNav",
    data() {
        return {
            userInfo: null, // 名称 // 用户信息
            isComplex: false,
            roleList: [],
        };
    },
    computed: {
        getTimeState() {
            // 获取当前时间
            let timeNow = new Date();
            // 获取当前小时
            let hours = timeNow.getHours();
            // 设置默认文字
            let state = ``;
            // 判断当前时间段
            if (hours >= 0 && hours <= 10) {
                state = `早上好，`;
            } else if (hours > 10 && hours <= 14) {
                state = `中午好，`;
            } else if (hours > 14 && hours <= 18) {
                state = `下午好，`;
            } else if (hours > 18 && hours <= 24) {
                state = `晚上好，`;
            }
            return state;
        },
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.roleList = [
                {
                    roleId: "1",
                    roleName: "建设单位负责人",
                    isSelected: true,
                },
                {
                    roleId: "2",
                    roleName: "承建单位经办人",
                    isSelected: false,
                },
            ];
            let role = this.roleList.filter((item) => item.isSelected)[0];
            this.userInfo = {
                userName: "张三丰",
                roleName: role.roleName,
            };
        },
        
        // 退出登录
        logOut() {
            sessionStorage.removeItem('menus')
			this.$emit('close')
        },
        // 切换身份事件
        handleCommand(command) {
            this.userInfo.roleName = command;
        },
    },
};
</script>

<style lang="scss">
$header-background: rgba(25,118,255,.8);
$header-color: #2a3f54;
$header-padding: 0 18px;
.the-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 1;
    height: 64px;
    line-height: 64px;
    padding: $header-padding;
    background: $header-background;
    color: $header-color;
    box-sizing: border-box;
    &.complex {
        height: 112px;
        flex-shrink: 0;
        .logo-image-box {
            .logo-image-0 {
                width: 42px;
            }
            .logo-box {
                margin-left: 10px;
                align-items: flex-start;
                flex-direction: column;
                .logo-image-1 {
                    width: 144px;
                    margin: 0 0px 8px 0px;
                }
            }
        }
    }

    .click-area {
        flex-grow: 1;
        height: 100%;
        cursor: pointer;
    }
    .nav-handle-box {
        display: flex;
        justify-content: center;
        align-items: center;
        .icon-control {
            padding: 0 12px;
            img {
                width: 24px;
                height: 24px;
                cursor: pointer;
                vertical-align: middle;
            }
        }
        .use-info-box {
            line-height: 1;
            margin-right: 32px;
            .nav-user-name {
                font-size: 14px;
                color: #fff;
                line-height: 20px;
                margin-bottom: 0px;
                font-weight: 400;
            }
            .el-dropdown {
                color: #fff;
                font-size: 12px;
                font-weight: 400;
                .el-dropdown-link {
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    line-height: 20px;
                }
            }
        }
    }
    .nav-handle-item + .nav-handle-item {
        margin-left: 12px;
    }

    .logo-image-box {
        display: flex;
        align-items: center;
        .logo-image-0 {
            width: 32px;
        }
        .logo-image-1 {
            width: 128px;
        }
        .logo-image-2 {
            width: 350px;
        }
        .logo-box {
            display: flex;
            align-items: center;
            .logo-image-1 {
                margin: 0 20px 0 5px;
            }
        }
    }
}
</style>