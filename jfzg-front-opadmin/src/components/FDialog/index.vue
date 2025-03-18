<template>
  <el-dialog class="FD" :title="config.title||''" :visible.sync="isOpen">
    <div class="tip">
      <p v-if="config.info">{{config.info}}</p>
      <div v-if="config.needForm"><slot></slot></div>
    </div>
    <section slot="footer" class="dialog-footer" v-if="!config.needForm">
      <el-button type="primary" @click="confirm" size="medium">确 定</el-button>
      <el-button @click="isOpen = false" size="medium">取 消</el-button>
    </section>
  </el-dialog>
</template>
<script>
export default {
  props: {
    config: {
      type: Object,
      default () {
        return {};
      }
    }
  },

  data() {
    return {
      isOpen: false
    }
  },

  methods: {
    confirm() {
      this.$emit("confirm");
    }
  }
}

</script>
<style lang="scss">
.FD {
  .el-dialog {
    width: 600px;
    color: rgba(0, 0, 0, .85);

    &__header {
      border-bottom: .5px solid rgba(0, 0, 0, 0.15);
      padding: 15px 20px;
    }

    &__title {
      font-size: 16px;
    }

    .dialog-footer {
      padding-bottom: 25px;
      text-align: center;
    }
  }

  .tip {
    padding: 30px 0 20px;
    text-align: center;
    font-size: 16px;

    p {
      padding:20px 0 30px;
    }
  }
}

</style>
