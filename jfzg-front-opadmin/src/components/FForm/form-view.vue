<template>
    <div class="basicInfo">
        <el-row>
            <div v-for="(item,index) in formDataCopy" :key="index">
                <el-col v-if="item.type == 'title'" :span="item.span">
                    <div class="title">{{item.value}}</div>
                </el-col>
                <el-col
                    :span="item.span"
                    v-if="!item.type"
                    v-show="!item.hidden"
                    :style="item.bgColor?'background:'+item.bgColor:'background:'+(bgArr[index]||'')"
                >
                    <label class="label-item ellipsis">{{item.label}}：</label>
                    <span
                        class="overflow context"
                        v-if="ruleForm[item.value] && ruleForm[item.value].length > 156"
                    >
                        <span
                            v-if="!item.operateFlag"
                        >{{ruleForm[item.value].slice(0, 150) + '...'}}</span>
                        <span v-else>{{ruleForm[item.value]}}</span>

                        <el-link
                            v-if="item.operateFlag"
                            @click="operateClick(item)"
                            class="operate"
                            type="text"
                        >
                            收起
                            <i class="el-icon-arrow-up el-icon--right"></i>
                        </el-link>
                        <el-link v-else class="operate" @click="operateClick(item)" type="text">
                            展开
                            <i class="el-icon-arrow-down el-icon--right"></i>
                        </el-link>
                    </span>
                    <template v-else>
                        <el-tooltip
                            popper-class="selfTip"
                            v-if="item.showTip"
                            class="item"
                            effect="dark"
                            :content="formatContext(item)"
                            placement="bottom"
                        >
                            <span class="context">{{formatContext(item)}}</span>
                        </el-tooltip>

                        <el-tooltip
                            popper-class="selfTip"
                            v-else-if="formatContext(item).length > 24"
                            class="item"
                            effect="dark"
                            :content="formatContext(item)"
                            placement="bottom"
                        >
                            <span class="context">{{formatContext(item)}}</span>
                        </el-tooltip>
                        <span class="context" v-else>{{formatContext(item)}}</span>
                    </template>
                </el-col>

                <el-col
                    :span="24"
                    v-else-if="item.type === 'image'"
                    :style="item.bgColor?'background:'+item.bgColor:'background:'+(bgArr[index]||'')"
                >
                    <label class="label-item ellipsis">{{item.label}}：</label>
                    <div class="imgBox">
                        <img v-if="ruleForm[item.value]" :src="item.baseUrl+ ruleForm[item.value]" />
                        <span v-else>-</span>
                    </div>
                </el-col>

                <el-col
                    :span="24"
                    v-else-if="item.type === 'images'"
                    :style="item.bgColor?'background:'+item.bgColor:'background:'+(bgArr[index]||'')"
                >
                    <label class="label-item ellipsis">{{item.label}}：</label>
                    <div class="imagesBox" v-if="ruleForm[item.value]">
                        <div
                            class="imgsBox"
                            :style="'flex:'+(1/ruleForm[item.value].length)"
                            v-for="(em, index) in ruleForm[item.value]"
                            :key="index"
                        >
                            <img v-if="ruleForm[item.value]" :src="em" />
                        </div>
                    </div>
                </el-col>

                <el-col
                    :span="24"
                    v-else-if="item.type === 'uploader'"
                    :style="item.bgColor?'background:'+item.bgColor:'background:'+(bgArr[index]||'')"
                >
                    <!-- <UploaderView
                        :data-up="item"
                        :view-data="disposeNull(ruleForm[item.value])"
                        :label-width="220"
                    ></UploaderView> -->
                </el-col>

                <el-col
                    :span="item.span"
                    v-else-if="item.type === 'star'"
                    :style="item.bgColor?'background:'+item.bgColor:'background:'+(bgArr[index]||'')"
                >
                    <label class="label-item ellipsis">{{item.label}}：</label>
                    <div class="imgBox" @click="sendEvent(item.eventName)">
                        <el-rate
                            :value="ruleForm[item.value]"
                            disabled="disabled"
                            :show-score="false"
                            text-color="#ff9900"
                        ></el-rate>
                    </div>
                </el-col>
                <el-col
                    :span="item.span"
                    v-else-if="item.type === 'switch'"
                    :style="item.bgColor?'background:'+item.bgColor:'background:'+(bgArr[index]||'')"
                >
                    <label class="label-item ellipsis">{{item.label}}：</label>
                    <div class="imgBox">
                        <el-switch :value="ruleForm[item.value]"></el-switch>
                    </div>
                </el-col>

                <el-col
                    :span="item.span"
                    v-else-if="item.type === 'select'"
                    :style="item.bgColor?'background:'+item.bgColor:'background:'+(bgArr[index]||'')"
                >
                    <label class="label-item ellipsis">{{item.label}}：</label>
                    <span
                        v-if="item.dataList && item.value"
                        class="overflow context"
                    >{{$getLabel(ruleForm[item.value], item.dataList)}}</span>
                </el-col>
                <el-col
                    :span="item.span"
                    v-else-if="item.type === 'checkbox'"
                    :style="item.bgColor?'background:'+item.bgColor:'background:'+(bgArr[index]||'')"
                >
                    <label class="label-item ellipsis">{{item.label}}：</label>

                    <el-checkbox-group v-model="ruleForm[item.value]">
                        <el-checkbox
                            v-for="op in enums[item.dataList]"
                            :disabled="item.disabled"
                            :label="op.dataValue"
                            :key="op.dataValue"
                        >{{ op.dataName }}</el-checkbox>
                    </el-checkbox-group>
                </el-col>
            </div>
        </el-row>
        <el-row v-if="button && button.length" style="width:100%;text-align:center;">
            <el-col :span="24">
                <el-button
                    v-for="(btn, index) in button"
                    :key="index"
                    :type="btn.type ? btn.type : ''"
                    size="small"
                    @click="callFn(btn)"
                >{{ btn.name }}</el-button>
            </el-col>
        </el-row>

    </div>
</template>

<script>
import config from "@/settings.js";
export default {
    props: {
        formData: {
            type: Array,
            default: () => {
                return [];
            }
        },
        namedata: {
            type: Array,
            default: () => {
                return ["低级", "中级", "高级"];
            }
        },
        ruleForm: {
            type: Object,
            default: () => {
                return {};
            }
        },
        button: {
            type: Array
        },
        enums: Object
    },

    components: {
    },
    data() {
        return {
            operateFlag: false,
            bgArr: [],
            expand: false,
            formDataCopy: this.formData
        };
    },
    mounted() {
        this.computedBgColor();
    },
    computed: {
        // 处理返回null问题
        disposeNull(val) {
            return function(val) {
                return !val ? [] : val;
            };
        },
        getlabels() {
            return function(item, list) {
                return this.$getLabel(item, list);
            };
        }
    },
    methods: {
        /**
         * 计算背景颜色
         */
        computedBgColor() {
            let row = 0;
            let bgArr = [];
            let bgColor1 = "#ECF2FC";
            let bgColor2 = "#fff";
            this.formDataCopy.map((res, index) => {
                this.$set(res, "operateFlag", false);
                // 每两行一个周期，
                row += res.span - 0;
                if (row == 12) {
                    bgArr.push(bgColor1);
                } else if (row == 24) {
                    bgArr.push(bgColor1);
                } else if (row == 36) {
                    // 白色
                    if (res.span == 24) {
                        // 重新计数 [12,24]
                        row = 0;
                    }
                    bgArr.push(bgColor2);
                } else if (row == 48) {
                    // 白色[12,24]在上一步重置为0
                    // 重新计数[24,24][12,12,24][12,12,12,12]
                    row = 0;
                    bgArr.push(bgColor2);
                } else if (row == 60) {
                    // [24,12,24] [12,12,12,24]
                    bgArr.push(bgColor1);
                    row = 24;
                }
            });
            this.$set(this, "bgArr", bgArr);
        },
        seeclick(url) {
            this.pdfUrl = config.baseUrl + url;
        },
        /**
         * 附件下载
         */
        upclick(data) {
            window.open(
                `${config.baseUrl}/csportalsite/api/file/download?id=${data}`
            );
        },
        /**
         * 附件名称截取
         * @param {String}  文件名
         */
        fieldSubStr(name, maxFeild) {
            return name.length > (maxFeild || 15)
                ? name.substr(0, maxFeild || 15) + "..."
                : name;
        },

        /**
         * 点击
         */
        sendEvent(eventName) {
            this.$emit("eventNotify", eventName);
        },
        // 关闭PDF 预览
        fulScreenFun() {
            this.pdfUrl = "";
        },
        format(num) {
            var reg = /\d{1,3}(?=(\d{3})+$)/g;
            return (num + "").replace(reg, "$&,");
        },
        formatContext(item) {
            if (item.label && item.label.includes("元")) {
                this.ruleForm[item.value] = this.format(
                    this.ruleForm[item.value]
                );
            }
            return this.ruleForm[item.value] ? this.ruleForm[item.value] : "-";
        },
        operateClick(item) {
            item.operateFlag = !item.operateFlag;
        },
        callFn(btn) {
            //操作事件
            if (this[btn.method]) {
                this[btn.method].call(this);
            }
            if (this.$parent[btn.method]) {
                this.$parent[btn.method].call(this.$parent, this.form);
                return;
            }
            if (this.$parent.$parent[btn.method]) {
                this.$parent.$parent[btn.method].call(
                    this.$parent.$parent,
                    this.form
                );
                return;
            }
            if (this.$parent.$parent.$parent[btn.method]) {
                this.$parent.$parent.$parent[btn.method].call(
                    this.$parent.$parent.$parent,
                    this.form
                );
            } else {
                console.log("没有写此方法111");
            }
        }
    }
};
</script>


