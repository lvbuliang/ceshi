<template>
  <div>
    <el-dialog :title="title" :visible.sync="dialogVisible" width="50%">
      <div>{{ content }}</div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      content: "",
    };
  },
  methods: {
    open(content, type) {
      this.dialogVisible = true;
      this.content = content;
      this.title = type;
    },
  },
};
</script>
