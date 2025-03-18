<template>
  <div
    class="relative width-100 uploaderview"
    :style="
      'padding-left:' +
      (dataUp.label || label ? dataUp.labelWidth || labelWidth || 120 : 0) +
      'px'
    "
  >
    <label
      class="label-item ellipsis"
      v-if="(dataUp.label && dataUp.label.length <= 11) || (label && label.length <= 11)"
      :style="
        'width:' +
        (dataUp.label || label ? dataUp.labelWidth || labelWidth || 120 : 0) +
        'px'
      "
      >{{ dataUp.label || label }}：</label
    >
    <template v-else-if="dataUp.label || label">
      <el-tooltip
        popper-class="selfTip"
        effect="light"
        :content="dataUp.label || label"
        placement="top"
      >
        <label
          class="label-item ellipsis"
          :style="
            'width:' +
            (dataUp.label || label ? dataUp.labelWidth || labelWidth || 120 : 0) +
            'px'
          "
          >{{ dataUp.label || label }}：</label
        >
      </el-tooltip>
    </template>
    <div class="widthUp" v-if="viewData.length">
      <div
        class="expand text-right more_less pointer"
        @click="expand = !expand"
        v-show="dataUp.showExpand && viewData.length > (dataUp.colNum || 3)"
      >
        <span class="expand_class" v-show="!expand">展开</span>
        <span class="expand_class" v-show="expand">收起</span>
        <i class="el-icon-arrow-down el-icon--right" v-show="!expand"></i>

        <i class="el-icon-arrow-up el-icon--right" v-show="expand"></i>
      </div>
      <span
        class="uploader"
        v-for="(item, index) in viewDataS"
        :key="index"
        v-show="index < (dataUp.colNum || 3) || expand || !dataUp.showExpand"
      >
        <!-- <svg-icon icon-class="icon_fujian" />
        <span class="uploader_title" :title="item.name || item.fileName">{{
          item.name || item.fileName
        }}</span>
        <svg-icon
          v-if="!item.size || item.size <= 102400000 || item.size"
          @click.stop="seeclick(item)"
          icon-class="watch"
          class="uploader_class"
        />
        <svg-icon
          @click.stop="upclick(item, dataUp)"
          icon-class="icon_down"
          class="uploadImg_class"
        /> -->
      </span>
    </div>
    <span class="none" v-else>-</span>
  </div>
</template>
<script>
import config from "@/settings.js";
export default {
  data() {
    return {
      linkImg: require("@/assets/upload/link.png"),
      seeImg: require("@/assets/upload/see.png"),
      uploadImg: require("@/assets/upload/upload.png"),
      expand: false,
      viewDataS: [],
    };
  },
  props: {
    labelWidth: {
      type: [String, Number],
      default: () => {
        return 120;
      },
    },
    dataUp: {
      type: Object,
      default: () => {
        return {};
      },
    },
    viewData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    label: String,
  },
  watch: {
    viewData: {
      handler(newName, oldName) {
        this.viewDataS = newName;
      },
      // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法
      deep: true,
    },
  },
  methods: {
    seeclick(item) {
      item.id = item.fileId ? item.fileId : item.id;
      item.name = item.fileName ? item.fileName : item.name;
      if (["zip", "rar"].includes(item.name.split(".").pop())) {
        this.$utils.exportFile(
          `${config.baseUrl}/whportalsite/api/file/download?id=${item.id}`
        );
      } else {
        window.open(`${config.imgBaseUrl}${item.id}`);
      }
    },
    /**
     * 附件下载
     */
    upclick(item, dataUp) {
      item.id = item.fileId ? item.fileId : item.id;
      item.name = item.fileName ? item.fileName : item.name;
      // ;
      if (item.name && this.$utils.judgeTrail(item.name) == "html") {
        this.$utils.exportFile(
          `${config.baseUrl}/whportalsite/word/downloadWord?id=${item.id}`
        );
      } else {
        if (dataUp.isPDF) {
          this.$utils.exportFile(`${config.baseUrl}${dataUp.isPDF}?id=${item.id}`);
        } else {
          this.$utils.exportFile(
            `${config.baseUrl}/whportalsite/api/file/download?id=${item.id}`
          );
        }
      }
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
  },
  created() {
    this.viewDataS = this.viewData;
  },
};
</script>
<style lang="scss" scoped>
.uploaderview {
  box-sizing: border-box;
  min-height: 50px;
}
.label-item {
  line-height: 50px;
  display: inline-block;
  width: 150px;
  font-size: 14px;
  text-align: right;
  color: #007aff;
  margin-bottom: 0;
  font-weight: normal;
  position: absolute;
  left: 0px;
}
.uploader {
  min-width: 25%;
  max-width: 30%;
  padding: 0 12px;
  margin-right: 15px;
  color: #4c6dd1;
  cursor: pointer;
  height: 36px;
  background: rgba(255, 255, 255, 1);
  border-radius: 2px;
  border: 1px solid rgba(236, 236, 236, 1);
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  margin-bottom: 10px;
  .svg-icon {
    font-size: 16px;
    color: #007aff;
  }
  &:hover {
    border: 1px solid #007aff;
  }
}
.uploader_class {
  display: inline-block;
  margin-right: 14px;
}

.uploader_title {
  display: inline-block;
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 12px;
  margin-left: 8px;
}
.widthUp {
  width: 100%;
  position: relative;
  display: flex;
  padding-top: 10px;
  align-items: center;
  flex-wrap: wrap;
  // padding-right: 80px;
}

.expand_class {
  width: 28px;
  height: 22px;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: rgba(0, 122, 255, 1);
  line-height: 22px;
}
.more_less {
  position: absolute;
  right: 0;
  padding-left: 20px;
  top: 10px;
  color: #007aff;
}
.none {
  display: flex;
  align-items: center;
  height: 100%;
  color: #333;
  font-size: 14px;
}
</style>
