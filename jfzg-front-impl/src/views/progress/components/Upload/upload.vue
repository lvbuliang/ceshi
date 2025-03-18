<template>
    <div
        class="flex flex-row"
        :class="
      [!uploadItem.normal?(uploadItem.fileList.length == 0
        ? 'noFile flex-center upload-wrap'
        : 'hasFile flex-start upload-wrap'):'',{'normal-upload':uploadItem.normal}]
    "
    >
        <sr-upload
            :item="{
				uploadListOFF: true,
				limit: uploadItem.limit || 100
			}"
            @uploadSuccess="uploadSuccess"
            :fileList="uploadItem.fileList"
            ref="srUpload"
        >
            <div v-if="!offUpload">
                <i class="el-icon-upload el-icon--right"></i>
                {{uploadItem.btn || "点击上传"}}
            </div>
            <div v-else-if="huiyiBtn" style="font-size: 20px;color: #007AFF;padding-right: 10px;">
                <el-tooltip
                    class="item"
                    effect="dark"
                    :hide-after="500"
                    content="上传"
                    placement="top"
                >
                    <i class="el-icon-upload huiyiBtn"></i>
                </el-tooltip>
            </div>
        </sr-upload>
        <div
            class="file-list text-left"
            v-if="!uploadItem.hideFile"
            v-show="uploadItem.fileList.length > 0"
        >
            <upload-list
                :uploadItem="uploadItem"
                @delFile="delFile"
                :expand="expand"
                :isOff="isOff"
            ></upload-list>
        </div>
        <div
            class="expand text-right"
            @click="expand = !expand"
            v-show="
        uploadItem.showExpand &&
          uploadItem.fileList.length > (uploadItem.colNum || 3)
      "
        >
            <span v-show="!expand">展开</span>
            <span v-show="expand">收起</span>
            <img v-show="expand" src="@/assets/upload/showless.png" />
            <img v-show="!expand" src="@/assets/upload/showmore.png" />
        </div>
    </div>
</template>
<script>
import uploadList from "./uploadList";
import SrUpload from "../SrUpload/upload";

export default {
    props: {
        uploadItem: {
            type: Object,
            default() {
                return {
                    colNum: 3,
                    maxFeild: 15,
                    showExpand: true,
                    fileList: [],
                    maxSize: 50, // 限定最大可上传多少M的文件
                };
            },
        },
        isOff: Boolean,
        offUpload: Boolean, // 是否关闭上传按钮 true：关闭 ， false：开启
        huiyiBtn: {
            type: Boolean,
            default() {
                return false;
            },
        },
    },
    components: {
        uploadList,
        SrUpload,
    },
    data() {
        return {
            expand: false,
            loading: null,
            ifupload: null,
        };
    },
    methods: {
        /**
         * 删除附件
         * @param {Number} num 要删除的文件下标
         */
        delFile(num) {
            this.uploadItem.fileList.splice(num, 1);
        },
        /**
         * 上传成功
         */
        uploadSuccess(fileList) {
            this.uploadItem.fileList = fileList;
            this.$emit("uploadSuccess", {
                item: this.uploadItem,
                file: this.uploadItem.fileList,
            });
        }
    },
};
</script>
<style lang="scss" scoped>
::v-deep .uploader-btn {
	height: 36px;
	line-height: 36px;
    // background-color: transparent;
    // border: none !important;
    // .el-icon-upload {
    //     color: #007aff;
    // }
    // &:hover {
    //     background-color: transparent;
    // }
}
.upload-wrap {
    border: 1px dotted #d1e1ec;
    padding: 12px 12px 12px 20px;
    background-color: #fafafa;
    text-align: center;
    position: relative;
    .file-list {
        width: calc(100% - 200px);
    }
    &.hasFile {
        .upload-demo {
            display: inline-block;
            padding-right: 12px;
            .huiyiBtn {
                font-size: 20px;
                color: #007aff;
                padding-right: 10px;
            }
        }
    }
    .expand {
        display: flex;
        align-items: flex-start;
        font-size: 14px;
        color: #007aff;
        cursor: pointer;
        position: absolute;
        right: 12px;
    }
    &.noFile {
        .el-upload {
            .el-button {
                background: inherit;
                border-width: 0;
                color: #666;
                font-size: 14px;
                i {
                    color: #46a6ff;
                }
            }
        }
    }
    .el-tag {
        margin-bottom: 0px;
        &:nth-of-type(n + 5) {
            margin-top: 12px;
        }
    }
}
</style>
