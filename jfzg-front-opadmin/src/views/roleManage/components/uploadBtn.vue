<template>
  <div id="uploadBtn">
    <el-upload
      :on-success="res => callSuccessFn(res)"
      :on-error="(err,file,fileList) => callErrorFn(err,file,fileList)"
      :before-upload="res => callBeforeUpLoad( res)"
      :action="actionUrl"
      :accept="config.fileType"
      :disabled="config.disabled"
      multiple
      :show-file-list="false"
    >
      <div class="slotContent">
        <slot></slot>
      </div>
    </el-upload>
  </div>
</template>

<script>
import config from "@/settings.js";

export default {
  name: "uploadBtn",
  props: {
    // actionUrl: {
    //   type: String,
    //   default: config.baseUrl + this.fileUrl,
    // },
    config: {
      type: Object,
      default() {
        return {
          fileType: "xls,xlsx",
          disabled: false,
          fileSize: 5000,
        };
      },
    },
    isSource: {
      type:String,
      default() {
        return 'changsha'
      }
    }
  },
  computed: {
    themeName () {
      return this.$store.state.permission.theme || ""
    },
  },
  data() {
    return {
      actionUrl:''
    };
  },
  mounted(){
    console.log(this.themeName)
    if (this.themeName == 'changsha') {
      this.actionUrl = config.baseUrl+'/api/role/importPermissionFile'
    } else if (this.themeName == 'yuhua') {
      this.actionUrl = config.baseUrl+'/api/role/importPermissionYHFile'
    } else {
      // this.actionUrl = '解放号网络科技有限公司'
    }
    
  },
  methods: {
    callSuccessFn(res) {
      console.log(res)
      // this.$emit("update:loading", false);
      if (res && res.data) {
        this.$emit("getFileInfo", res.data);
      } else {
        this.$message.warning("导入文件模板不正确！");
      }
    },
    callBeforeUpLoad(res) {
      // this.$emit("update:loading", true);
      const fileType = res.name.split(".")[1];
      const extension = this.config.fileType.indexOf(fileType) !== -1;
      const isSize = res.size / 1024 / 1024 < this.config.fileSize;
      if (!extension) {
        this.$message.warning(`上传文件只能是${this.config.fileType}格式!`);
        // this.$emit("update:loading", false);
      }
      if (!isSize) {
        this.$message.warning(
          `上传文件大小不能超过 ${this.config.fileSize}MB!`
        );
        // this.$emit("update:loading", false);
      }
      return extension && isSize;
    },
    callErrorFn(err, file, fileList) {
      this.$message.error(err || "上传文件失败！");
      // this.$emit("update:loading", false);
    },
  },
};
</script>

<style lang="scss" scoped>
#uploadBtn {
  .slotContent {
    cursor: pointer;
  }
}
</style>