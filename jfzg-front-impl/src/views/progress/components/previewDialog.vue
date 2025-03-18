<template>
  <el-dialog
    width="1000px"
    class="preview"
    :title="title"
    :visible.sync="isOpen"
    :append-to-body="true"
  >
    <div v-html="text"></div>
    <section slot="footer" class="flex flex-center">
      <el-button type="primary" size="medium" @click="open">关 闭</el-button>
    </section>
  </el-dialog>
</template>

<script>
import { getDetail } from "@/api/progress";
export default {
  props: {
    obj: Object,
    content: String,
  },
  data() {
    return {
      title: "预览",
      text: "",
      isOpen: false,
    };
  },
  watch: {
    obj: {
      handler(newValue, oldValue) {
        if (newValue) {
          this.title = "查看";
          this.Detail(newValue);
        }
      },
      deep: true,
    },
    content(val) {
      if (val != "") {
        this.title = "预览";
        this.text = val;
      }
    },
  },
  methods: {
    Detail(val) {
      let data = val;
      getDetail(data).then((res) => {
        if (res.msg.code == "0000") {
          let content = res.data.content ? res.data.content : "";
          this.text =
            "<div class='richBox' style='width:583px;margin:0 auto;'>" +
            "<h2 style='text-align:center;font-size:24px;'>" +
            res.data.topic +
            "</h2>" +
            "<div style='text-align:center;margin:15px 0 30px;'>" +
            "发布时间：" +
            "<span style='color:#737373;'>" +
            res.data.createTime +
            "</span>" +
            "<span style='margin-left:40px; color:#737373'>" +
            "预览次数：" +
            "<span style='color:#737373;'>" +
            res.data.readNum +
            "次" +
            "<span style='color:#737373;'>" +
            "</span>" +
            "</div>" +
            content +
            "</div>";
        }
      });
    },
    open() {
      this.isOpen = !this.isOpen;
    },
  },
};
</script>

<style lang="scss">
.preview {
  .el-dialog__body {
    max-height: 600px;
    min-height: 384px;
    overflow-y: scroll;
    overflow-x: hidden;
  }
  .el-dialog {
    min-height: 500px;
    max-height: 716px;
    color: rgba(0, 0, 0, 0.85);
    &__header {
      border-bottom: 0.5px solid rgba(0, 0, 0, 0.15);
      padding: 15px 20px;
      background-color: #edf2fc;
    }
    &__title {
      font-size: 16px;
    }
    &__body {
      padding: 15px 20px;
    }
    .dialog-footer {
      padding-bottom: 25px;
      text-align: center;
    }
  }
}
</style>
<style lang="scss" scoped>
.box {
  // width:530px;
  // height:196px;
  background: rgba(250, 250, 250, 1);
  border-radius: 4px;
}
::v-deep .el-dialog__body {
  padding: 15px 20px;
  color: #606266;
  font-size: 14px;
  word-break: break-all;
}
.richBox p > img {
  width: 100%;
  margin: 10px 0;
  height: auto;
}
</style>