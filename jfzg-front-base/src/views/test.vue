<template>
    <div class="test-box">
   <div class="setup">
    <el-steps   :active="active"  align-center space="40%">
  <el-step title="创建分组"></el-step>
  <el-step title="抽取条件"></el-step>
  <el-step title="专家抽取"></el-step>
  <el-step title="专家确认"></el-step>
</el-steps>
</div>

   
   <div class="table">
    <el-table
    :data="tableData"
    style="width: 100%" 
    row-key="id"
    border
    :header-cell-style="{background:'rgb(241,245,255)',color:'black',fontWeight:'800'}"
    lazy
    :load="load"
    :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
 
        <el-table-column
      prop="date"
      label="序号"
      type="index"
      :index="indexMethod"
      width="100">
    </el-table-column>
    <el-table-column
      prop="name"
      label="审评小组名称"
      width="800">
    </el-table-column>
    <el-table-column
      prop="notes"
      label="小组备注"
      width="400">
    </el-table-column>
    <el-table-column  
      label="操作">
      <template slot-scope="scope" v-if="scope.row.name">
        <el-button @click="handleClick(scope.$index,scope.row)" type="text" size="small">编辑</el-button>
        <el-button type="text" size="small" @click.native.prevent="deleteRow(scope.$index, tableData)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-button type="primary" round class="addBtn"  @click="adds()">新增</el-button>
<el-button  round class="return">返回列表</el-button>
<el-button type="primary" round class="next" @click="next">下一步</el-button>
   </div>
   <div class="add">
    <el-dialog
  title="小组新增"
  :visible.sync="dialogVisible"
  width="30%"
  :before-close="handleClose">
  <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
  <el-form-item label="审评小组名称" prop="name">
    <el-input  v-model="ruleForm.name"></el-input>
  </el-form-item>
  <el-form-item label="小组备注" prop="notes">
    <el-input  v-model="ruleForm.notes" ></el-input>
  </el-form-item>
</el-form>
  <span slot="footer" class="dialog-footer">
    <el-button   @click="resetForm('ruleForm')">重置</el-button>
    <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
  </span>
</el-dialog>
   </div>
   <div class="editor">
    <el-dialog
  title="编辑"
  :visible.sync="dialogVisibles"
  width="30%"
  :before-close="handleClose">
  <el-form :model="ruleForms" status-icon  ref="ruleForms" label-width="100px" class="demo-ruleForm">
  <el-form-item label="审评小组名称" prop="names">
    <el-input  v-model="ruleForms.names"></el-input>
  </el-form-item>
  <el-form-item label="小组备注" prop="note">
    <el-input  v-model="ruleForms.note" ></el-input>
  </el-form-item>
</el-form>
  <span slot="footer" class="dialog-footer">
    <el-button   @click="resetForms('ruleForms')">重置</el-button>
    <el-button type="primary" @click="changeForm('ruleForms')">确 定</el-button>
  </span>
</el-dialog>
   </div>

    </div>
</template>
<el-button
          size="mini"
         >Edit</el-button>
        <el-button
          size="mini"
          type="danger"
         >Delete</el-button>
      </template>
    </el-table-column>

<script>
export default {
    data() {
      return {
        allid:'',
        ruleForm:{
        date:'',
        name:'',
        notes:'',
        },
        ruleForms:{
        names:'',
        note:'',
        },
        active: 1,
        dialogVisible: false,
        dialogVisibles: false,
        tableData: [{
          date: '1',
          name: '默认分组',
          notes: '-',}
          // operate: '编辑 删除'
        // }, {
        //     date: '',
        //   name: '',
        //   notes: '',
        //   operate: '',
      
        // }, {
        //     date:' ',
        //   name: '',
        //   notes: '',
        //   operate: '',
        // }
      ], 
      };
    },

    methods: {
      adds(){
        this.dialogVisible = true

      },
      handleClick(index,row){
        console.log(index,row);
       this.dialogVisibles = true
       this.ruleForms.names=row.name
       this.ruleForms.note=row.notes
       this.allid =index
      },
      
      indexMethod(index) {
        return index + 1;
      },
      next() {
        if (this.active++ > 3) this.active = 0;
      },
      deleteRow(index, rows) {
        rows.splice(index, 1);
      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      submitForm(){ 
      const obj= JSON.parse(JSON.stringify(this.ruleForm))
      this.tableData.push(obj)
      // this.date=this.tableData.length
      this.ruleForm.name=''
      this.ruleForm.notes=''
      this.dialogVisible = false
      
    },
      changeForm(){
            this.tableData[this.allid].name=this.ruleForms.names
            this.tableData[this.allid].notes=this.ruleForms.note
            this.dialogVisibles = false
    },
    resetForm(formName){
      this.$refs[formName].resetFields();
    },
    resetForms(){
      this.ruleForms.names=''
      this.ruleForms.note=''
    }
    }
  
}
</script>

<style lang="scss" >
  .test-box{
   .setup{
   width: 100%;
    margin:  100px 0;
    /* width: 2000px; */ 
   }
   .el-step__icon{
    background-color: rgb(156,145,153);
    color: white;
    width: 30px;
    height: 30px;
   }
   
  
   .el-step__head.is-finish > .el-step__icon.is-text {
    background: #0076F6;
    /* color: #0076F6; */
  }
  .el-step__icon.is-text {
    border-radius: 50%;
    border:none;
    border-color: inherit;
}
.el-step__title.is-process{
    color: black; 
    font-weight:600
}
.el-step__title.is-wait{
    color: black; 
    font-weight:600
}
.el-step__title.is-finish{
    color: black; 
    font-weight:600
}
   
   .table{
    width: 90%;
    position: relative;
    margin: auto;
    .ahead{
        background-color: aqua;
    }
    .cell{
     color: black;   
    }
   td{
    height: 48px;
   }
   .addBtn{
    position: absolute;
    right: 0px;
    top: -60px;
   }
   .return{
    position: absolute;
    left:50%;
    bottom:-350px;
    transform: translateX(-30%)
   }
   .next{
    position: absolute;
    left:50%;
    bottom: -350px;
    transform: translateX(-150%)
   }
   }
  }

</style>