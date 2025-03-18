<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="430px"
    :title="title"
    append-to-body
    class="task-rate-dialog"
  >
    <div class="task-rate">
      <SrAdd
        :config="pfForm.config"
        :otherConfig="{ labelNum: 126 }"
        :form="pfForm.data"
        :enums="pfForm.enums"
        class="pfForm"
        ref="addpfForm"
      ></SrAdd>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="pfSumbit" size="small">确定</el-button>
      <el-button @click="dialogVisible = false" size="small">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import config from "@/settings.js";
import upload from "@/utils/upload";
export default {
  data() {
    return {
      row: {},
      title: "设计公司评价",
      dialogVisible: false,
      pfForm: {
        config: [
          {
            type: "star",
            scoreTemplateType: true,
            name: "综合评价",
            required: "没有进行综合评价",
            bind: "integratedScore",
            "show-score": true,
            max: 5,
            "allow-half": true,
            "text-color": "#FFAA22",
            "void-color": "rgba(0, 0, 0, 0.1)",
            "void-icon-class": "el-icon-star-on",
            trigger: "change",
            col: 24,
          },
          {
            type: "star",
            scoreTemplateType: true,
            name: "专业知识评价",
            required: "没有进行专业知识评价",
            bind: "specialScore",
            "show-score": true,
            "text-color": "#FFAA22",
            "void-color": "rgba(0, 0, 0, 0.1)",
            "void-icon-class": "el-icon-star-on",
            max: 5,
            "allow-half": true,
            trigger: "change",
            col: 24,
          },
          {
            type: "star",
            scoreTemplateType: true,
            name: "沟通情况评价",
            required: "没有进行沟通情况评价",
            bind: "communicateScore",
            "show-score": true,
            "text-color": "#FFAA22",
            "void-color": "rgba(0, 0, 0, 0.1)",
            "void-icon-class": "el-icon-star-on",
            max: 5,
            "allow-half": true,
            trigger: "change",
            col: 24,
          },
          {
            type: "star",
            scoreTemplateType: true,
            name: "满意度评价",
            required: "没有进行满意度评价",
            bind: "responsivityScore",
            "show-score": true,
            trigger: "change",
            "void-color": "rgba(0, 0, 0, 0.1)",
            "text-color": "#FFAA22",
            "void-icon-class": "el-icon-star-on",
            max: 5,
            "allow-half": true,
            col: 24,
          },
        ],
        data: {
          integratedScore: 0,
          specialScore: 0,
          communicateScore: 0,
          responsivityScore: 0,
        },
        enums: {},
      },
    };
  },
  provide() {
    return {
      baseUrl: config.uploadBaseUrl,
      imgBaseUrl: config.imgBaseUrl,
      uploadRequest: upload,
      uploadBaseUrl: config.uploadBaseUrl,
    };
  },
  watch: {
    dialogVisible(val) {
      if (!val) {
        // 重置表单
        if (this.$refs["addpfForm"].resetForm) {
          this.$refs["addpfForm"].resetForm();
        }
      }
    },
  },
  methods: {
    init(row) {
      this.row = JSON.parse(JSON.stringify(row));
      this.row.integratedScore = this.row.integratedScore / 2;
      this.row.specialScore = this.row.specialScore / 2;
      this.row.communicateScore = this.row.communicateScore / 2;
      this.row.responsivityScore = this.row.responsivityScore / 2;
      this.pfForm.data = this.row;
      this.dialogVisible = true;
    },
    pfSumbit() {
      let params = {
        ...this.pfForm.data,
      };
      this.$emit("pfSumbit", params);
    },
  },
};
</script>
<style lang="scss" scoped>
.task-rate {
  // width: 418px;
  // height: 272px;
  // padding: 16px 24px !important;
  background: #ffffff;
  // box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.12);
  // border-radius: 8px;
  ::v-deep {
    .el-rate__text {
      font-size: 18px;
    }
    .popper__arrow {
      display: none !important;
    }
    .el-rate__decimal,
    .el-rate__icon .path2 {
      top: 2px;
    }
    .el-rate__icon {
      transform: scale(1.2);
      width: 32px;
      text-align: center;
      margin-right: 12px;
      font-size: 26px;
      &:hover {
        transform: scale(1.2);
      }
      .el-rate__decimal {
        width: 38.6% !important;
        left: 11% !important;
      }
    }
  }
}
.task-rate-dialog {
  ::v-deep {
    .el-dialog {
      .el-dialog__body {
        overflow: hidden;
        padding-top: 10px;
        padding-bottom: 0;
      }
      .el-dialog__header {
        text-align: center;
        padding: 14px ​24px;
      }
      .el-dialog__footer {
        padding: 11px 24px;
      }
    }
  }
  .dialog-footer {
    text-align: center;
    button {
      border-radius: 16px;
      min-width: 76px;
      order:0 !important;
      padding: 8px 0;
      font-size: 14px;
    }
  }
}
</style>
