<template>
  <div class="quillEditor">
    <quill-editor
      class="editor ql-editor"
      ref="quillEditor"
      :value="value"
      :options="editorOption"
      @blur="onEditorBlur($event)"
      @focus="onEditorFocus($event)"
      @ready="onEditorReady($event)"
      @change="onEditorChange($event)"
      @input="change($event)"
    >
      <div slot="toolbar" v-if="showBtn">
        <quillUpload :upload-item="uploadItem" @uploadSuccess="uploadSuccess" class="quill-upload" />
      </div>
    </quill-editor>
    <div slot="maxlength" v-if="maxlength > 0" class="maxlength">
      <span>{{ (contentTxt.length - 1 || 0) + "/" + maxlength }}</span>
    </div>
  </div>
</template>
<script>
import config from "@/settings.js";
import Quill from "quill";
import quillUpload from "../Upload/upload.vue";
const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  //   ['blockquote', 'code-block'],

  //   [{'header': 1}, {'header': 2}],               // custom button values
  //   [{'list': 'ordered'}, {'list': 'bullet'}],
  //   [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction

  [{ size: ["10px", "14px", "18px", "32px"] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  //   [{'font': []}],
  [{ align: [] }],
  ["clean"], // remove formatting button
];
export default {
  components: {
    quillUpload,
  },
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
    contentT: [Number, String],
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
        return 0;
      },
    },
  },
  watch: {
    contentT: {
      handler(val) {
        if (val) {
          this.$set(this, "content", val);
        }
      },
      deep: true,
    },
  },
  data() {
    return {
      uploadItem: {
        fileList: [],
        hideFile: true,
        normal: true,
        btn: "上传图片",
        type: "text",
      },
      content: null,
      contentTxt: 0,
      editorOption: {
        modules: {
          toolbar: {
            container: toolbarOptions, // 工具栏
            // handlers: {
            //   image: function(value) {
            //     if (value) {
            //       alert("自定义图片");
            //     } else {
            //       this.quill.format("image", false);
            //     }
            //   },
            // },
          },
        },
        placeholder: this.placeholder, //提示
        readOnly: this.readyOnly, //是否只读
        theme: "snow", //主题 snow/bubble
        syntax: true, //语法检测
      },
    };
  },
  methods: {
    // 失去焦点
    onEditorBlur(editor) {
      this.$emit("onEditorBlur");
    },

    // 获得焦点
    onEditorFocus(editor) {
      if (this.type == "see") {
        editor.enable(false);
      } else {
        editor.enable(true);
      }
    },
    // 开始
    onEditorReady(editor) {
      editor.enable(false);
    },
    // 值发生变化
    onEditorChange(editor) {
      this.contentTxt = editor.text;
      this.content = editor.html;
      if (this.content) {
        this.$emit("onEditorChange");
      }
      if (this.maxlength > 0 && this.content.length >= this.maxlength) {
        editor.quill.deleteText(this.maxlength, 4);
      }
    },
    uploadSuccess(res) {
      //   console.log(this.uploadItem, "s上传");
      let url = this.uploadItem.fileList.pop();
      url = config.getEncryUrl(url.id);
      // res为图片服务器返回的数据
      // 获取富文本组件实例
      let quill = this.$refs.quillEditor.quill;
      // 如果上传成功
      let l = quill.getLength();
      // 获取光标所在位置
      let select = quill.getSelection();
      let length = (select && select.index) || l - 1;
      // 插入图片  res.url为服务器返回的图片地址
      quill.insertEmbed(length, "image", url);
      // 调整光标到最后
      quill.setSelection(length + 1);

      // loading动画消失
      this.quillUpdateImg = false;
    },
    change(value) {
      this.$emit("change", value);
    },
  },
  computed: {},
  mounted() {
    this.$refs.quillEditor.quill.enable(false);
    var Size = Quill.import("attributors/style/size");
    Size.whitelist = ["10px", "14px", "18px", "32px"];
    Quill.register(Size, true);
    if (this.contentT) {
      this.content = this.contentT;
      this.contentTxt = this.contentT;
    }
    setTimeout(() => {
      this.$refs.quillEditor.quill.enable(true);
    }, 1000);
  },
};
</script>
<style lang="scss">
.quill-upload {
  position: absolute;
  right: 20px;
  line-height: 40px;
}
.ql-editor {
  padding: 0;
  min-height: 300px;
  max-height: 600px;
}
.editor {
  line-height: normal !important;
  scrollbar-color: transparent transparent;
  white-space: pre-wrap;
  overflow: hidden;
}
.ql-snow .ql-tooltip[data-mode="link"]::before {
  content: "请输入链接地址:";
}
.ql-snow::after {
  display: none !important;
}
.ql-snow .ql-formats::after {
  display: none;
}
.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
  border-right: 0px;
  content: "保存";
  padding-right: 0px;
}

.ql-snow .ql-tooltip[data-mode="video"]::before {
  content: "请输入视频地址:";
}

.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: "14px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="10px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="10px"]::before {
  content: "10px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="18px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="18px"]::before {
  content: "18px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="32px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="32px"]::before {
  content: "32px";
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: "文本";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
  content: "标题1";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
  content: "标题2";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
  content: "标题3";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
  content: "标题4";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
  content: "标题5";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
  content: "标题6";
}

.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
  content: "标准字体";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before {
  content: "衬线字体";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before {
  content: "等宽字体";
}
.ql-editor.ql-blank::before {
  font-style: normal;
  left: 10px;
  right: 10px;
}
.ql-container .ql-editor {
  padding: 10px;
  max-height: 300px;
}
.quillEditor {
  position: relative;
  .maxlength {
    position: absolute;
    bottom: -15px;
    right: 5px;
    font-size: 12px;
    color: #ccc;
    line-height: 1;
  }
}
</style>
