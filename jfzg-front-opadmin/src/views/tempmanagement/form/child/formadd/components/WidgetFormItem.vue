<template>
    <el-form-item
        class="widget-view sr-add"
        v-if="element && element.key"
        :class="classObj"
        :label="element.options.name"
        @click.native.stop="handleSelectWidget(index)"
    >
        <template v-if="element.type == 'input'">
            <SrInput v-model.trim="element.options.defaultValue" :item="element.options"></SrInput>
        </template>
        <template v-else-if="element.type=='switch'">
            <SrSwitch v-model="element.options.defaultValue" :item="element.options"></SrSwitch>
        </template>
        <template v-else-if="element.type == 'radio' && element.options.options">
            <SrRadio
                v-model="element.options.defaultValue"
                :list="element.options.options"
                :item="element.options"
                :value="element.options.defaultValue"
            ></SrRadio>
        </template>
        <template v-else-if="element.type == 'checkbox' && element.options.options">
            <SrCheckbox
                v-model="element.options.defaultValue"
                :list="element.options.options"
                :item="element.options"
            ></SrCheckbox>
        </template>
        <template v-else-if="element.type == 'number'">
            <el-input-number
                v-bind="element.options"
                v-model.number="element.options.defaultValue"
            ></el-input-number>
        </template>
        <template v-else-if="element.type == 'select'">
            <SrSelect
                v-model="element.options.defaultValue"
                :list="element.options.options"
                :item="element.options"
            ></SrSelect>
        </template>
        <template v-else-if="element.type == 'dialogSelect'">
            <SrDialogSelect :params="element.options.params"></SrDialogSelect>
        </template>
        <template v-else-if="element.type == 'textarea'">
            <SrTextarea v-model.trim="element.options.defaultValue" :item="element.options"></SrTextarea>
        </template>
        <template v-else-if="element.type == 'editor'">
            <SrEditor
                :maxlength="element.options.maxlength ? element.options.maxlength : 500"
                :showBtn="element.options.showBtn"
                :type="element.options.readonly"
                ref="SrEditor"
                :item="element.options"
                :placeholder="element.options.placeholder"
                v-model="element.options.defaultValue"
                :contentT="element.options.defaultValue"
            />
        </template>
        <template v-else-if="element.type == 'dateSelect'">
            <SrDatetime v-model="element.options.defaultValue" :item="element.options"></SrDatetime>
        </template>
        <template v-else-if="element.type == 'dateRelevancy'">
            <SrDatePicker
                class="relation"
                v-model="element.options.defaultValue"
                :startname="element.options.startname"
                :endname="element.options.endname"
                :item="element.options"
            ></SrDatePicker>
        </template>
        <template v-if="element.type=='upload'">
            <SrBigUpload
                ref="srUpload"
                :item="element.options"
                :fileList="element.options.fileList"
            ></SrBigUpload>
        </template>
        <template v-if="element.type == 'star'">
            <el-rate
                v-model="element.options.defaultValue"
                :disabled="element.options.disabled"
                :show-score="element.options.showScore || false"
                :score-template="element.options.defaultValue + '分'"
                text-color="#ff9900"
            ></el-rate>
        </template>
        <template v-if="element.type == 'duration'">
            <sr-duration v-model="element.options.defaultValue"></sr-duration>
        </template>
        <template v-if="element.type == 'tag'">
            <sr-tag v-model="element.options.defaultValue"></sr-tag>
        </template>

        <template v-if="element.type == 'color'">
            <el-color-picker
                v-model="element.options.defaultValue"
                :disabled="element.options.disabled"
                :show-alpha="element.options.showAlpha"
            ></el-color-picker>
        </template>
        <div class="widget-view-action topRight" v-if="selectWidget.key == element.key">
            <i
                class="moduleiconfont icon-clone"
                v-if="!hideClone"
                @click.stop="handleWidgetClone(index)"
            ></i>
            <i class="moduleiconfont icon-trash" @click.stop="handleWidgetDelete(index)"></i>
        </div>

        <div class="widget-view-drag topLeft" v-if="selectWidget.key == element.key">
            <i class="moduleiconfont icon-drag drag-widget"></i>
        </div>
    </el-form-item>
</template>

<script>
import config from "@/settings";
import upload from "@/utils/upload";
export default {
    props: ["element", "select", "index", "data", "hideClone"],
    components: {
        // FmUpload,
    },
    provide() {
        return {
            baseUrl: config.baseUrl,
            imgBaseUrl: config.imgBaseUrl,
            uploadRequest: upload,
            uploadBaseUrl: config.uploadBaseUrl,
        };
    },
    data() {
        return {
            selectWidget: this.select,
        };
    },
    computed: {
        classObj() {
            let temp = {
                active: this.selectWidget.key == this.element.key,
                is_req: this.element.rule && this.element.rule.required,
            };
            temp[
                "col-" +
                    (this.element.options.col ? this.element.options.col : 12)
            ] = true;
            return temp;
        },
    },
    methods: {
        handleSelectWidget(index) {
            this.selectWidget = this.data.list[index];
        },
        handleWidgetDelete(index) {
            if (this.data.list.length - 1 === index) {
                if (index === 0) {
                    this.selectWidget = {};
                } else {
                    this.selectWidget = this.data.list[index - 1];
                }
            } else {
                this.selectWidget = this.data.list[index + 1];
            }

            this.$nextTick(() => {
                this.data.list.splice(index, 1);
            });
        },
        handleWidgetClone(index) {
            const key =
                Date.parse(new Date().toString()) +
                "_" +
                Math.ceil(Math.random() * 99999);
            let cloneData = {
                ...this.data.list[index],
                options: {
                    ...this.data.list[index].options,
                },
                key,
                bind: this.data.list[index].type + "_" + key,
                rules: this.data.list[index].rules || [],
            };

            if (
                this.data.list[index].type === "radio" ||
                this.data.list[index].type === "checkbox" ||
                this.data.list[index].type === "select"
            ) {
                cloneData = {
                    ...cloneData,
                    options: {
                        ...cloneData.options,
                        options: cloneData.options.options.map((item) => ({
                            ...item,
                        })),
                    },
                };
            }

            this.data.list.splice(index, 0, cloneData);

            this.$nextTick(() => {
                this.selectWidget = this.data.list[index + 1];
            });
        },
    },
    watch: {
        select(val) {
            this.selectWidget = val;
        },
        selectWidget: {
            handler(val) {
                this.$emit("update:select", val);
            },
            deep: true,
        },
    },
};
</script>
