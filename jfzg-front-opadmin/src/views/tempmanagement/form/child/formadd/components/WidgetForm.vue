<template>
    <div class="widget-form-container">
        <div v-if="data.list.length == 0" class="form-empty">
           <img :src="imgUrl" alt="">
            <p>从左侧拖拽来添加组件</p>
            </div>
        <el-form label-suffix=":" :label-width="data.config.labelNum + 'px'">
            <draggable
                class
                v-model="data.list"
                v-bind="{group:'people', ghostClass: 'ghost',animation: 200, handle: '.drag-widget'}"
                @add="handleWidgetAdd"
            >
                <transition-group name="fade" tag="div" class="widget-form-list">
                    <template v-for="(element, index) in data.list">
                        <WidgetFormItem
                            v-if="element && element.key"
                            :key="element.key"
                            :element="element"
                            :select.sync="selectWidget"
                            :index="index"
                            :data="data"
                        />
                    </template>
                </transition-group>
            </draggable>
        </el-form>
    </div>
</template>

<script>
import Draggable from "vuedraggable";
import WidgetFormItem from "./WidgetFormItem.vue";
export default {
    components: {
        Draggable,
        WidgetFormItem,
    },
    props: ["data", "select"],
    data() {
        return {
            imgUrl:require("@/assets/form_emty.png"),
            selectWidget: this.select,
        };
    },
    mounted() {
        document.body.ondrop = function (event) {
            let isFirefox =
                navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
            if (isFirefox) {
                event.preventDefault();
                event.stopPropagation();
            }
        };
    },
    methods: {
        handleSelectWidget(index) {
            this.selectWidget = this.data.list[index];
        },
        handleWidgetAdd(evt) {
            const newIndex = evt.newIndex;

            //为拖拽到容器的元素添加唯一 key
            const key =
                Date.parse(new Date()) + "_" + Math.ceil(Math.random() * 99999);
                console.log(this.data.list[newIndex])
            if (this.data.list[newIndex].options["dataList"] !== undefined) {
                this.data.list[newIndex].options["dataList"] = "dl_" + key;
                this.data.list[newIndex].options["options"] = [
                    {
                        dataValue: "1",
                        dataName: "选项标签1",
                        disabled: false,
                    },
                    {
                        dataValue: "2",
                        dataName: "选项标签2",
                        disabled: false,
                    },
                ];
            }
            if (this.data.list[newIndex].type === "dateRelevancy") {
                this.data.list[newIndex].options["startname"] = "start_" + key;
                this.data.list[newIndex].options["endname"] = "end_" + key;
            }
            this.$set(this.data.list, newIndex, {
                ...this.data.list[newIndex],
                options: {
                    // 绑定键值
                    bind: this.data.list[newIndex].type + "_" + key,
                    ...this.data.list[newIndex].options,
                },
                key,
                rule: {
                    required: false,
                    trigger: "blur",
                    list: [],
                },
            });

            this.selectWidget = this.data.list[newIndex];
        },
    },
    watch: {
        select(val) {
            console.log(val);
            this.selectWidget = val;
        },
        selectWidget: {
            handler(val) {
                this.$emit("update:select", val);
            },
            deep: true,
        },
        "data.list": {
            handler(val) {},
            deep: true,
        },
    },
};
</script>
<style lang="scss">
.fm-add-style {
    .widget-form-container {
        .sr-input.el-input {
            width: auto;
        }
        .el-rate {
            height: 32px;
            line-height: 32px;
            .el-rate__item {
                vertical-align: baseline;
            }
        }
    }
}
</style>