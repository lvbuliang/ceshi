<template>
  <section class="batchUpload" :style="'text-align:' + textAlign">
    <sr-upload
      class="upload-demo"
      :item="item"
      :file-list="item.fileList"
      @uploadSuccess="
        (data) => {
          uploadCallSuccessFn(data, item);
        }
      "
    ></sr-upload>
  </section>
</template>
<script>
import FForm from "@/components/FForm/form-add";

export default {
  components: {
    FForm,
  },
  props: {
    textAlign: {
      // 按钮位置 默认：右对齐
      type: String,
      default: "right",
    },
    key1: {
      type: String,
      default: "name",
    },
    key2: {
      type: String,
      default: "pingjia",
    },
    key3: {
      type: String,
      default: "uploadItem",
    },
    key3_list: {
      type: String,
      default: "fileList",
    },
  },
  data() {
    return {
      item: {
        ref: "batchUpload",
        required: "请上传附件",
        bind: "accessoryile",
        limit: 10,
        col: 24,
        type: "upload",
        fileList: [],
        multiple: true,
        uploadListOFF: true, // 关闭列表展示
        btnName: "批量上传", // 按钮名字
        iconClass: "icon_upload_white",
        fileType: "doc,docx,xls,xlsx,ppt,pptx,pdf,txt,jpg,jpeg,jpe,png,rar,zip",
      },
    };
  },
  methods: {
    uploadCallSuccessFn(newArr, oldItem) {
      this.shujuChuli(newArr);
    },
    shujuChuli(arr) {
      if (!arr) return;

      let tempArr = [];
      arr.forEach((item) => {
        let obj = { [this.key3]: { [this.key3_list]: [] } };
        obj[this.key1] = this.$utilsIndex.delSuffix(item.name);
        obj[this.key3][this.key3_list] = [item];
        tempArr.push(obj);
      });
      this.$emit("batchEmit", tempArr);
    },
  },
};
</script>
<style lang="scss" scoped>
.batchUpload {
  ::v-deep .upload-tip {
    display: flex;
    justify-content: flex-end;
    .uploader-btn {
      margin-right: 0;
      width: 96px;
      height: 32px;
      line-height: 32px;
      padding: 0 10px;
      background: #007aff;
      color: #fff !important;
      border-radius: 2px;
      text-align: center;
      .svg-icon {
        display: none;
      }
    }
  }
}
</style>