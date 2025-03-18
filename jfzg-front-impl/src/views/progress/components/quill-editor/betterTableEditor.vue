<template>
  <keep-alive>
    <div class="table-editor">
      <div class="editor"></div>
      <div slot="maxlength" v-if="maxlength > 0" class="maxlength">
        <span>{{ (contentLength - 1 || 0) + "/" + maxlength }}</span>
      </div>
    </div>
  </keep-alive>
</template>

<script>
import Quill from "quill";
import quillBetterTable from "quill-better-table";
import "quill-better-table/dist/quill-better-table.css";
Quill.register({ "modules/better-table": quillBetterTable }, true);

const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction
  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ align: [] }],
  ["image"],
  ["clean"], // remove formatting button
  [{ table: "TD" }],
];

const titleConfig = {
  "ql-bold": "加粗",
  "ql-italic": "斜体",
  "ql-underline": "下划线",
  "ql-strike": "删除线",
  "ql-indent": "缩进",
  "ql-direction": "文本方向",
  "ql-clean": "清除字体样式",
  "ql-table": "插入表格",
  "ql-color": "颜色",
  "ql-font": "字体",
  "ql-code": "插入代码",
  "ql-link": "添加链接",
  "ql-background": "颜色",
  "ql-size": "字体大小",
  "ql-script": "上标/下标",
  "ql-blockquote": "引用",
  "ql-header": "标题",
  "ql-list": "列表",
  "ql-align": "文本对齐",
  "ql-code-block": "代码块",
  "ql-formula": "公式",
  "ql-image": "图片",
  "ql-video": "视频",
  "ql-upload": "文件",
};

export default {
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    placeholder: {
      type: [Number, String],
      default() {
        return "请输入内容";
      },
    },
    contentT: {
      type: [Number, String],
      default() {
        return "";
      },
    },
    type: {
      type: String,
      default() {
        return "add";
      },
    },
    readyOnly: {
      type: Boolean,
      default() {
        return false;
      },
    },
    showBtn: {
      type: Boolean,
      default() {
        return false;
      },
    },
    value: [String, Number],
    maxlength: {
      type: Number,
      default() {
        return 500;
      },
    },
  },
  data() {
    return {
      quill: null,
      content: null,
      contentLength: 1,
      options: {
        theme: "snow",
        modules: {
          table: false,
          toolbar: {
            container: toolbarOptions,
            handlers: {
              table: function (val) {
                this.quill.getModule("better-table").insertTable(3, 3);
              },
            },
          },
          "better-table": {
            operationMenu: {
              items: {
                insertColumnRight: {
                  text: "右侧插入列",
                },
                insertColumnLeft: {
                  text: "左侧插入列",
                },
                insertRowUp: {
                  text: "顶部插入行",
                },
                insertRowDown: {
                  text: "底部插入行",
                },
                deleteColumn: {
                  text: "删除列",
                },
                deleteRow: {
                  text: "删除行",
                },
                deleteTable: {
                  text: "删除表格",
                },
                mergeCells: false,
                unmergeCells: false,
              },
            },
          },
          keyboard: {
            bindings: quillBetterTable.keyboardBindings,
          },
        },
        placeholder: this.placeholder, //提示
        readOnly: this.readyOnly, //是否只读
        theme: "snow", //主题 snow/bubble
        syntax: true, //语法检测
      },
    };
  },
  mounted() {
    const dom = this.$el.querySelector(".editor");
    this.quill = new Quill(dom, this.options);
    if (this.value) {
      this.quill.root.innerHTML = this.value;
    } else if (this.contentT) {
      this.quill.root.innerHTML = this.contentT;
    }
    this.quill.on("text-change", (delta, oldDelta, source) => {
      this.content = this.quill.root.innerHTML;
      this.contentLength = this.quill.getLength();
      this.$emit("change", this.content);
    });
    this.addQuillTitle();
  },
  methods: {
    addQuillTitle() {
      const oToolBar = document.querySelector(".ql-toolbar");
      const aButton = oToolBar.querySelectorAll("button");
      const aSelect = oToolBar.querySelectorAll("select");
      aButton.forEach(function (item) {
        if (item.className === "ql-script") {
          item.value === "sub" ? (item.title = "下标") : (item.title = "上标");
        } else if (item.className === "ql-indent") {
          item.value === "+1"
            ? (item.title = "向右缩进")
            : (item.title = "向左缩进");
        } else {
          item.title = titleConfig[item.classList[0]];
        }
      });
      aSelect.forEach(function (item) {
        item.parentNode.title = titleConfig[item.classList[0]];
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.table-editor {
  position: relative;
  .maxlength {
    position: absolute;
    bottom: 4px;
    right: 4px;
    font-size: 12px;
    color: #ccc;
  }
}
</style>
<style lang="scss">
.qlbt-operation-menu {
  z-index: 999;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  font-size: 14px;
  overflow: hidden;
  .qlbt-operation-menu-item {
    display: flex;
    align-items: center;
    padding: 10px 16px;
    background-color: #fff;
    cursor: pointer;
    color: #595959;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.table-editor {
  .ql-toolbar {
    line-height: initial;
  }
  .ql-snow .ql-picker {
    line-height: 24px !important;
  }
}
</style>
