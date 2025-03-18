
<template>
  <div class="formDialog">
    <el-dialog
      custom-class="sr-dialog"
      :title="title || ''"
      :visible.sync="isOpen"
      :append-to-body="true"
      :width="width"
    >
      <div>
        <slot name="center"></slot>
        <SrAdd
          v-if="isOpen"
          ref="modelMgrRef"
          :config="formT.config"
          :otherConfig="formT.otherConfig"
          :form="formT.data"
          :rules="formT.rules"
          :enums="formT.enums"
          refForm="modelMgrRefForm"
          @eventNotify="eventNotify"
          :column="2"
        />
      </div>
      <section slot="footer" class="dialog-footer">
        <el-button @click="cancel" size="medium">{{ rightBtn }}</el-button>
        <el-button
          v-if="leftFlag"
          :disabled="leftDisabled"
          type="primary"
          v-debounce="[() => confirm(), config.deTime]"
          size="medium"
          :style="leftDisabled && 'background:#ccc;border:#ccc;'"
        >{{ leftBtn }}</el-button>
      </section>
    </el-dialog>
  </div>
</template>
<script>
import config from "@/settings.js";
export default {
  name: "formDialog",
  props: {
    title: String,
    form: {
      type: Object,
      default() {
        return {};
      },
    },
    width: {
      type: String,
      default() {
        return "1000px";
      },
    },
    leftBtn: {
      // 提交按钮名称
      type: String,
      default() {
        return "确 定";
      },
    },
    leftFlag: {
      // 开启提交按钮 默认开启
      type: Boolean,
      default() {
        return true;
      },
    },
    leftDisabled: Boolean, // 禁用提交的按钮 默认关闭
    rightBtn: {
      // 取消按钮名称
      type: String,
      default() {
        return "取 消";
      },
    },
  },
  watch: {
    form: {
      handler: function (news, old) {
        this.formT = JSON.parse(JSON.stringify(news));
      },
      deep: true,
    },
  },
  data() {
    return {
      config,
      isOpen: false,
      formT: {},
    };
  },
  created() {
    if (!!this.form) {
      this.formT = JSON.parse(JSON.stringify(this.form));
    }
  },
  methods: {
    validate() {
      let flag;
      flag = this.$refs.modelMgrRef.validate();
      if (!flag) {
        return false;
      } else {
        return this.formT.data;
      }
    },
    cancel() {
      this.$nextTick(() => {
        this?.$refs["modelMgrRef"]?.$refs["modelMgrRefForm"]?.resetFields();
      });

      this.$emit("cancel");
      this.isOpen = false;
    },
    $isShow() {
      this.isOpen = !this.isOpen;
    },
    eventNotify(ref) {
      if (ref) {
        this.$refs[ref].init();
      }
    },
    confirm() {
      if (!this.validate()) {
        this.$message.warning("请输入必填项！");
        return;
      }
      this.$emit("confirm", this.formT.data);
    },
  },
};
</script>
<style lang="scss">
.sr-dialog {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: 0 !important;
  transform: translate(-50%,-50%);
  .el-dialog {
    width: 600px;
    color: rgba(0, 0, 0, 0.85);

    &__header {
      border-bottom: 0.5px solid rgba(0, 0, 0, 0.15);
      padding: 15px 20px;
    }

    &__title {
      font-size: 16px;
    }

    .dialog-footer {
      text-align: center;
    }
  }

  .tip {
    padding: 0;
    text-align: center;
    font-size: 16px;

    p {
      padding: 20px 0 30px;
    }
  }

  .form-config .tip_all {
    .svg-icon {
      width: 20px;
      height: 20px;
    }
    .up_tip {
      line-height: 20px;
    }
  }
}
</style>

