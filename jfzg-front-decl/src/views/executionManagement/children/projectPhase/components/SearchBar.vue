<template>
  <div class="search">
    <div class="button-group">
      <el-button circle size="medium" round plain @click="handleGoback">
        返回列表
      </el-button>
      <el-button
        v-if="hasConstructionPermission"
        circle
        size="medium"
        round
        plain
        type="primary"
        @click="handleSaveTopLevelNode"
      >
        保存阶段
      </el-button>
      <el-button
        v-if="isFromWorkBench"
        type="success"
        size="small"
        @click="handleBackWorkBench"
      >
        前往工作台
      </el-button>
    </div>

    <div class="action-group" v-if="showActionGroup">
      <el-tooltip
        v-if="hasConstructionPermission"
        class="item"
        effect="dark"
        content="批量保存"
        placement="top-end"
      >
        <el-button
          :disabled="clicked"
          circle
          plain
          round
          size="medium"
          @click="handleBatchSave"
        >
          批量保存
        </el-button>
      </el-tooltip>

      <el-tooltip
        class="item"
        effect="dark"
        content="生成甘特图"
        placement="top-end"
      >
        <el-button
          @click="handleSkipGantt"
          circle
          plain
          round
          size="medium"
        >
          生成甘特图
        </el-button>
      </el-tooltip>

      <el-tooltip
        v-if="hasConstructionPermission"
        class="item"
        effect="dark"
        content="新增子任务"
        placement="top-end"
      >
        <el-button
          @click="handleAddSubtask"
          circle
          round
          size="medium"
          type="primary"
        >
          新增子任务
        </el-button>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchBar',
  props: {
    hasConstructionPermission: {
      type: Boolean,
      default: false
    },
    isFromWorkBench: {
      type: Boolean,
      default: false
    },
    clicked: {
      type: Boolean,
      default: false
    },
    showActionGroup: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    handleGoback() {
      this.$emit('goback');
    },
    handleSaveTopLevelNode() {
      this.$emit('save-top-level-node');
    },
    handleBackWorkBench() {
      this.$emit('back-work-bench');
    },
    handleBatchSave() {
      this.$emit('batch-save');
    },
    handleSkipGantt() {
      this.$emit('skip-gantt');
    },
    handleAddSubtask() {
      this.$emit('add-subtask');
    }
  }
};
</script>

<style scoped>
.search {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.button-group {
  display: flex;
  gap: 10px;
}

.action-group {
  display: flex;
  gap: 10px;
}
</style>