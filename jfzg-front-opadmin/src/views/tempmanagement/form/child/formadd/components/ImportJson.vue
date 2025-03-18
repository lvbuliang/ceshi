<template>
  <cus-dialog
    title="导入JSON"
    :visible="importVisible"
    @on-close="importVisible = false"
    @on-submit="handleImportJson"
    width="800px"
  >
    <el-alert type="info" title="JSON格式如下，直接复制生成的json覆盖此处代码点击确定即可"></el-alert>
    <div style="margin-top: 10px;">
      <MonacoEditor
        :readOnly="false"
        :content-body.sync="jsonEg">
      </MonacoEditor>
    </div>
  </cus-dialog>
</template>

<script>
  import CusDialog from './CusDialog.vue'
  import MonacoEditor from '@/components/MonacoEditor.vue'
  export default {
    components:{
      CusDialog,
      MonacoEditor
    },
    data() {
      return {
        importVisible: false,
        jsonEg: ''
      }
    },
    methods:{
      open() {
        this.importVisible = true
      },
      handleImportJson() {
        this.$emit('on-import', this.jsonEg)
        this.importVisible = false
      }
    }
  }
</script>

<style>
</style>
