<template>
    <div class="todo-box">
        <ul class="ul_box">
            <li
                v-for="(item, index) in tabsArr"
                :key="index"
                :class="{'active': active === item.num}"
                @click="changeActive(item.num)"
            >
                <span class="number">{{index+1}}</span>
                <div class="line"></div>
                <div class="census">
                    <span class="title">{{item.title}}</span>
                    <img class='baseimg ' :src="item.pictodo" alt="" v-if='active == item.num'>
                    <img class='baseimg ' :src="item.pictodonostart" alt="" v-if='item.num >active'>
                    <img class='baseimg ' :src="item.pictodoisend" alt=""  v-if='item.num < active'>
                </div>
                 <img class='baseimg1 ' :src="isstart" alt="" v-if='active == item.num'>
                 <img class='baseimg1 ' :src="nostart" alt="" v-if='item.num >active'>
                 <img class='baseimg1 ' :src="started" alt=""  v-if='item.num < active'>
            </li>
        </ul>

    </div>
</template>

<script>

import nostart from "@/assets/shishi/home/nostart.png";
import isstart from "@/assets/shishi/home/isstart.png";
import started from "@/assets/shishi/home/started.png";


import pictodo11 from "@/assets/shishi/home/pic_todo.png11.svg";
import pictodo22 from "@/assets/shishi/home/pic_todo.png22.svg";
import pictodo33 from "@/assets/shishi/home/pic_todo.png33.svg";
import pictodo44 from "@/assets/shishi/home/pic_todo.png44.svg";
import pictodo55 from "@/assets/shishi/home/pic_todo.png55.svg";
import pictodo111 from "@/assets/shishi/home/pic_todo.png111.svg";
import pictodo222 from "@/assets/shishi/home/pic_todo.png222.svg";
import pictodo333 from "@/assets/shishi/home/pic_todo.png333.svg";
import pictodo444 from "@/assets/shishi/home/pic_todo.png444.svg";
import pictodo555 from "@/assets/shishi/home/pic_todo.png555.svg";
import pictodo1 from "@/assets/shishi/home/pic_todo.png1.svg";
import pictodo2 from "@/assets/shishi/home/pic_todo.png2.svg";
import pictodo3 from "@/assets/shishi/home/pic_todo.png3.svg";
import pictodo4 from "@/assets/shishi/home/pic_todo.png4.svg";
import pictodo5 from "@/assets/shishi/home/pic_todo.png5.svg";
let tabTimer = null;
export default {
    components: {
    },
    data() {
        return {
            nostart:nostart,
            isstart:isstart,
            started:started,
            pictodo1:pictodo1,
            pictodo2:pictodo2,
            pictodo3:pictodo3,
            pictodo4:pictodo4,
            pictodo5:pictodo5,
            pictodo11:pictodo11,
            pictodo22:pictodo22,
            pictodo33:pictodo33,
            pictodo44:pictodo44,
            pictodo55:pictodo55,
            pictodo111:pictodo111,
            pictodo222:pictodo222,
            pictodo333:pictodo333,
            pictodo444:pictodo444,
            pictodo555:pictodo555,
            // 分页数据
            pageData: {
                pageNum: 1,
                pageSize: 10,
                total: 0,
            },
            isTop: null,
            active: 0, // 工作台状态字段
            tagTypeCode: null, // tag标签字段
            tagObj: {
                backlogList: [],
                backlogCount: 0, //待办总数
                haveDoneCount: 0, //已办总数
                allCount: 0,
            },
            tabsArr: [
                {
                    title: "项目成员登记",
                    key: "backlogCount",
                    num: 0,
                    pictodo:pictodo1,
                    pictodoisend:pictodo11,
                    pictodonostart:pictodo111,
                    icon: "icon-daiban",
                },
                {
                    title: "里程碑设置",
                    key: "haveDoneCount",
                    num: 1,
                    pictodo:pictodo2,
                    pictodoisend:pictodo22,
                    pictodonostart:pictodo222,
                    icon: "icon-yiban",
                },
                {
                    title: "交付物设置",
                    key: "allCount",
                    num: 2,
                    pictodo:pictodo3,
                    pictodoisend:pictodo33,
                    pictodonostart:pictodo333,
                    icon: "icon-quanbu",
                },{
                    title: "任务设置",
                    key: "allCount",
                    num: 3,
                    pictodo:pictodo4,
                    pictodoisend:pictodo44,
                    pictodonostart:pictodo444,
                    icon: "icon-quanbu",
                },{
                    title: "实施方案上传",
                    key: "allCount",
                    num: 4,
                    pictodo:pictodo5,
                    pictodoisend:pictodo55,
                    pictodonostart:pictodo555,
                    icon: "icon-quanbu",
                },
            ],

        };
    },
    computed: {
    },
    methods: {
        changeActive(num){
            if(this.$route.name !="bianzhiInitiateDetail"){
                this.$parent.$parent.$parent.$parent.changeActive(num);
                this.active=num
            }
            
        },
        editactive(str){
            if(str =='add'){
                this.active ++
            }else if(str =='down'){
                this.active --
            }   
        },
        isIE() {
            if (!!window.ActiveXObject || "ActiveXObject" in window) {
                this.isTop = -5;
            }
        },
        prev() {
            this.swiper.slidePrev();
        },
        next() {
            this.swiper.slideNext();
        },
    },
    created() {
        this.isIE();
    },
    mounted() {},
};
</script>

<style lang="scss">
* {
    touch-action: pan-y;
}
.todo-box {
    margin-top:15px;
    .swiperTodo {
        border-bottom: 1px solid #eeeeee;
        margin-top: -4px;
        width: 100%;
        .swiper-container {
            overflow-y: inherit;
        }
        .swiper-button-next:after,
        .swiper-container-rtl .swiper-button-prev:after {
            font-size: 0px;
            color: #999;
        }
        [class^="el-icon-"],
        [class*=" el-icon-"] {
            line-height: 1;
        }
        .swiper-button-prev::after,
        .swiper-container-rtl .swiper-button-next::after {
            content: "";
        }
        .swiper-button-next::after,
        .swiper-container-rtl .swiper-button-prev::after {
            content: "";
        }
        .swiper-button-prev:after,
        .swiper-button-next:after {
            font-size: 16px;
            color: #999 !important;
            margin-top: -5px;
        }
        .swiper-button-prev {
            left: 0 !important;
        }
        .swiper-button-next,
        .swiper-button-prev {
            display: none;
            font-size: 16px;
            font-weight: bold;
            color: #999 !important;
            width: 24px;
            height: 24px;
            background: #ffffff;
            box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.12);
            border-radius: 20px;
            margin-top: 0;
            transform: translateY(-58%);
        }
        .swiper-button-next {
            right: 0 !important;
        }
        &:hover {
            .swiper-button-next,
            .swiper-button-prev {
                display: flex;
            }
        }
    }
    .wrap {
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
    }
    .swiperTodoItem {
        height: 40px;
        width: auto !important;
        padding-right: 32px;
        color: #333;
        -moz-user-select: none;
        -o-user-select: none;
        -khtml-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none;
        cursor: pointer;
        > div {
            display: flex;
            align-items: center;
            height: 40px;
        }
        b {
            font-weight: normal;
        }
    }
    .hitColor {
        color: #1890ff;
        font-weight: 500;
        position: relative;

        &::after {
            content: "";
            width: 100%;
            height: 2px;
            position: absolute;
            bottom: 0;
            z-index: 99;
            left: 0;
            background-color: #1890ff;
        }
    }
}
</style>
<style lang="scss" scoped>
$normalColor: #007aff;
$buttonColor: #1890ff;
::v-deep.el-tooltip__popper {
    width: 500px;
    line-height: 22px;
}
.todo-box {
    font-size: 14px;
    display: flex;
    height: 100%;
    .ul_box {
        width: 100%;
        display: flex;
        justify-content: space-between;
        li {
            margin-left: 8px;
            flex-grow: 1;
            min-width: 128px;
            height: 92px;
            padding-left: 14px;
            background: #fff;
            border: 1px solid #eeeeee;
            border-radius: 8px;
            display: flex;
            justify-content: center;
            position: relative;
            cursor: pointer;
            color: #666;
            flex-direction: column;
            font-size: 18px;
            .line {
                width: 20px;
                height: 2px;
                background-color: rgba(0, 0, 0, 0.2);
                margin-bottom: 4px;
            }
            // .census{
            //     // position: relative;
            // }
            .en {
                font-size: 12px;
            }
            .number {
                font-size: 18px;
                font-weight: 700;
                color: #000;
            }
            .number,.title {
                font-family: 'lanting';
            }
            .baseimg {
                position: absolute;
                right: 24px;
                top: 30px;
                width: 32px;
                height: 32px;
                color: #1890ff;
                &:hover {
                    color: rgb(54, 183, 254);
                }
            }
            .baseimg1{
                width:auto!important
            }
            img {
                width: 87px;
                height: 100%;
                position: absolute;
                right: 0px;
                bottom: 0px;
            }
            &.active {
                border: none;
                background: linear-gradient(
                    47deg,
                    #3577fe 0%,
                    rgba(101, 175, 255, 0.9) 100%
                );
                color: #fff;
                &::after {
                    content: "";
                    width: 0px;
                    height: 0px;
                    border: 10px solid transparent;
                    border-top: 10px solid #76aeff;
                    position: absolute;
                    right: 50%;
                    bottom: -20px;
                }
                .line {
                    background-color: rgba(255, 255, 255, 0.4);
                }
                .base-iconfont {
                    color: rgba($color: #fff, $alpha: .7) !important;
                }
                .number {
                    color: #fff;
                }
            }
            // &:last-of-num {
            //     margin-bottom: 0;
            // }
        }
        li:first-child{
            margin-left: 0px;
        }
    }
    .content_box {
        width: calc(100% - 152px);
        display: flex;
        flex-direction: column;
        .search_head {
            display: flex;
            height: 40px;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 2px;
            .search {
                display: flex;
                .el-input {
                    width: 240px;
                    margin-right: 8px;
                }
            }
            .switch_box {
                width: 124px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #fff;
                cursor: pointer;
                background: linear-gradient(
                    270deg,
                    #ffa922 0%,
                    #ff7d22 100%,
                    #ff7d22 100%
                );
                border-radius: 100px 32px 32px 100px;
                i {
                    margin-right: 3px;
                }
            }
        }
    }

    .tabsNum_x {
        color: $buttonColor;
    }
    .tabsNum_y {
        color: #ccc;
    }
    .liang {
        background: $normalColor;
        width: 200px;
        height: 40px;
        font-weight: 500;
    }
    .is-plain {
        width: 200px;
        height: 40px;
        font-weight: 500;
    }
    .wrap {
        height: calc(100% - 80px);
        .el-pagination {
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: flex-end;
        }
        .infinite-list {
            width: 100%;
            padding-right: 30px;
            height: calc(100% - 60px);
            overflow-y: scroll !important;
            .infinite-list-item {
                height: 55px;
                border-bottom: 1px dashed rgba(0, 0, 0, 0.08);
                position: relative;
                .icon-email {
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                }
                .time {
                    color: #999;
                    margin-left: 22px;
                    width: 82px !important;
                }
                &.done {
                    .content {
                        color: #999;
                    }
                }
                .content {
                    margin-left: 10px;
                    width: 780px;
                    flex-grow: 1;
                    line-height: 1.4;
                    color: #666666;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    font-size: 14px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                }
                .countdown1,
                .countdown2 {
                    color: #ff6600;
                    margin-left: 70px;
                    font-size: 12px;
                    display: flex;
                    width: 92px;
                    height: 28px;
                    line-height: 28px;
                    padding-left: 28px;
                    align-items: center;
                    background: url("../../../assets/shishi/home/djs-bg1.png") 0 0 no-repeat;
                    background-size: 92px 28px;
                }
                .countdown2 {
                    color: #ff0000;
                    background-image: url("../../../assets/shishi/home/djs-bg2.png");
                }

                .handle {
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    right: 0;
                }
                &.pause {
                    .content {
                        color: #cccccc;
                    }
                    .handle {
                        color: #cccccc;
                        cursor: default;
                    }
                }
            }
        }
    }
}
</style>
