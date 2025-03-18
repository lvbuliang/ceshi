<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="900px"
    :title="title"
    append-to-body
    class="add-fx-dialog"
     :destroy-on-close='true'
  >
  <everydaytroubleEdit ref='everydaytroubleEdit' :project_Id='project_Id' @cancel='cancel'/>

  </el-dialog>
</template>

<script>
import everydaytroubleEdit from "./risk/add";
export default {
  components:{
    everydaytroubleEdit
  },
  props: {
    project_Id: {
      type: Number,
    },
    processType: {
      type: Number,
    },
  },
  data() {
    return {
      dialogVisible: false,
      title:'新增风险'
    };
  },
 
  
  created() {
  },
  methods: {
    cancel(){
      this.dialogVisible = false;
      this.$emit('refreshList')
    },
    init() {
      this.dialogVisible = true;
      if(this.$refs.everydaytroubleEdit){
        this.$refs.everydaytroubleEdit.init();
      }

    },
    
  }
};
</script>

<style lang="scss" scoped>
.add-fx-dialog {
  ::v-deep {
    .el-dialog{
      .el-dialog__body{
        overflow-x:hidden;
        overflow-y:auto;
        padding-top: 10px;
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
  .dialog-footer{
    text-align: center;
    button{
      border-radius: 16px;
      min-width: 76px;
      font-size: 14px;
    }
  }
}
</style>