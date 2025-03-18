<template>
  <div class="relative width-100 uploaderview">
    <label
      class="label-item ellipsis"
      v-if="
        (dataUp.label && dataUp.label.length <= 11) ||
        (label && label.length <= 11)
      "
      :style="
        'width:' +
        (dataUp.label || label ? dataUp.labelWidth || labelWidth || 120 : 0) +
        'px'
      "
      >{{ dataUp.label || label }}：</label
    >
    <template v-else>
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
            (dataUp.label || label
              ? dataUp.labelWidth || labelWidth || 120
              : 0) +
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
      <div class="uploaderList">
        <div
          class="uploader"
          v-for="(item, index) in viewDataS"
          :key="index"
          v-show="index < (dataUp.colNum || 3) || expand || !dataUp.showExpand"
        >
          <i class="el-icon-paperclip"></i>
          <span class="uploader_title" :title="item.name || item.fileName">{{
            item.name || item.fileName
          }}</span>
          <div
            v-if="!item.size || item.size <= 102400000 || item.size"
            @click.stop="seeclick(item)"
            icon-class="watch"
            class="uploader_class"
          >
            <i v-if="dataUp.showIcon" class="el-icon-view"></i>
            <span v-else> 预览</span>
          </div>
          <div
            @click.stop="upclick(item, dataUp)"
            icon-class="icon_down"
            class="uploadImg_class"
          >
            <i v-if="dataUp.showIcon" class="el-icon-download"></i>
            <span v-else> 下载</span>
          </div>
        </div>
      </div>
    </div>
    <span class="none" v-else>{{emptyPlacehoder}}</span>
  </div>
</template>
<script>
export default {
  inject: ["baseUrl","imgBaseUrl"],
  data() {
    return {
      expand: false,
      viewDataS: [],
      portalsite:'cqportalsite',
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
    emptyPlacehoder: {
      type: String,
      default: () => { // 是否隐藏为空时，显示的占位- -
        return '- -';
      }
    }
  },
  computed: {
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
        this.exportFile(
          `${this.baseUrl}/${this.portalsite}/api/file/download?id=${item.id}`
        );
      } else {
        window.open(
          `${this.baseUrl}/${this.portalsite}/api/file/docapi/view?fileId=${item.id}`
        );
      }
    },
    /**
     * 附件下载
     */
    upclick(item, dataUp) {
      item.id = item.fileId ? item.fileId : item.id;
      item.name = item.fileName ? item.fileName : item.name;
      if (item.name && this.judgeTrail(item.name) == "html") {
        this.exportFile(
          `${this.baseUrl}/${this.portalsite}/word/downloadWord?id=${item.id}`
        );
      } else {
        if (dataUp.isPDF) {
          console.log("我下载了Pdf");
          this.exportFile(`${this.baseUrl}${dataUp.isPDF}?id=${item.id}`);
        } else {
          console.log("我下载了其他");
          this.exportFile(
            `${this.baseUrl}/${this.portalsite}/api/file/download?id=${item.id}`
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
    // 判断文件后缀
    judgeTrail(filePath) {
      if (!filePath) return false;
      let index = filePath.lastIndexOf(".");
      //获取后缀
      let ext = filePath.substr(index + 1);
      //输出结果
      return ext;
    },
    //无闪烁跳转
    exportFile(url) {
      let a = document.createElement("a");
      a.href = url;
      a.click();
    },
  },
  created() {
    if(this.imgBaseUrl){
        this.portalsite = this.imgBaseUrl.split('/')[3]
    }
    this.viewDataS = this.viewData;
  },
};
</script>
<style lang="scss" scoped>
</style>
