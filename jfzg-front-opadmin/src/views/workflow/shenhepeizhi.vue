<template>
  <div class='shenhe_Module'>
    <div class='title'> 
      审核配置
      <el-switch
        v-model="showForm"
        active-color="#13ce66"
        inactive-color="#e8e8e8">
      </el-switch>
      </div>
    <div v-if='showForm'>
      <div class='title'> 默认字段</div>

    <div class='shenhe_moren_button'> 
      <div class='shenhe_moren'>审批意见</div>
      <div class='shenhe_moren'>审批附件</div>
    </div>

    <div class='title'> 自定义字段
      <el-select v-model="moduleCode" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div  v-for="(item, index) in config" :key="'config'+index" class='configdata'>
      <div :class="['configdata_name',item.isHide==true?'':'noclick']">
        {{item.name}}
      </div>
      <div>
        <el-switch
          v-model="item.isHide"
          active-color="#13ce66"
          inactive-color="#e8e8e8"
          @change='changeswitch'>
        </el-switch>
      </div>
    </div>
    </div>
    
  </div>
</template>
<script>
import config from "@/settings.js";
import { listModule,listCustomFormTemplate,getCustomFormTemplate } from "@/api/index.js";

export default {

  data() {
    return {
      src: "",
      value: true,
      moduleCode:'',
      options: [],
      templateId:'',
      shenpi_Moudle:{},
      auditJson:{},
      config:[],
    };
  },
  props:{
    showForm: {
      type: Boolean
    },
    showFormdata: {
      type: Object
    },
    showFormlabel: {
      type: String
    },
    editableTabsValue: {
      type: Number
    },
  },
  watch: {
    moduleCode: {
      handler(el) {
        this.getTempList();
      }
    },
    showFormdata: {
      handler(el) {
      }
    },
    editableTabsValue: {
      handler(el) {
        this.moduleCode = this.showFormlabel
        this.getTempList();
      }
    },
    showFormlabel: {
      handler(el) {
        this.moduleCode = this.showFormlabel
      }
    },
  },
  methods:{
    changeswitch(){
      this.auditJson.formAdd.config = this.config
      this.shenpi_Moudle.auditJson = this.auditJson
    },
    // 获取模块列表
      getTempList() {
        if(this.moduleCode){
          listCustomFormTemplate({pageNum: 1,pageSize: 5,moduleCode:this.moduleCode}).then((res) => {
            if (res.msg.message == "SUCCESS") {
                for(var i=0;i<res.data.list.length;i++){
                  if(res.data.list[i].version =='1'){
                    this.templateId = res.data.list[i].id;
                    this.getshenpi()
                    break
                  }else{
                    this.shenpi_Moudle = {}
                    this.auditJson = {}
                    this.config = []
                  }
                }
                
            }
          });
        }else{
          this.shenpi_Moudle = {}
          this.auditJson = {}
          this.config = []
        }
        
      },
      getshenpi() {
        var params = {
          moduleCode: this.moduleCode,
          templateId: this.templateId
        }
        getCustomFormTemplate(params).then((res) => {
          if (res.msg.code === "0000") {
            this.shenpi_Moudle = res.data
            this.auditJson = JSON.parse(res.data.auditJson)
            if(JSON.parse(res.data.auditJson).formAdd){
              this.$set(this,'config',JSON.parse(res.data.auditJson).formAdd.config)
            }else{
              this.$set(this,'config',[])
            }
          }
        });
      },
      getMoubleCode() {
        listModule().then((res) => {
          if (res.msg.code === "0000") {
            let arr = [];
            res.data.forEach((item) => {
              let obj = {};
              if (item.id) {
                obj.value = item.moduleCode;
                obj.label = item.moduleName;
                arr.push(obj);
              }
            });
            this.options = arr;
          }
        });
      },
  },
  mounted() {
    this.moduleCode = this.showFormlabel
    if(this.showFormdata.showFormdata){
      var showFormdata = JSON.parse(this.showFormdata.showFormdata)
    }
    this.getMoubleCode();
  },
};
</script>
<style lang="scss" scoped>
  .shenhe_Module{
    margin-top: 20px;
  }
  .title{
    margin-top: 10px;
  }
  .configdata{
    margin-top: 10px;
    display: flex;
  }
  .configdata_name{
      padding:2px 16px;
      width: 100px;
      border:1px solid #e8e8e8;
      border-radius: 8px;
      text-align: center;
      margin-right: 8px;    
  }
  .noclick{
    background: #e8e8e8;
      color:#6666
  }
  .shenhe_moren_button{
    margin-top: 10px;
    .shenhe_moren{
      float:left;
      padding:2px 16px;
      width: 100px;
      border:1px solid #e8e8e8;
      border-radius: 8px;
      text-align: center;
    }
    .shenhe_moren:last-child{
      margin-left: 20px;
    }
  } 
  .shenhe_moren_button::after{
    content: '';
    display: block;
    clear: both;
  }
  
</style>
