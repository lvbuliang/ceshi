<template>
  <div class="tool-page">
    <div class="">
      <el-form label-width="130px" ref="add" v-for="(ooitem, ooindex) in form['btns']" :key="'oa_' + ooindex"
              class="btn-list">
        <el-form-item label='请选择按钮性质'>
                <el-select
                  class="btn-attr"
                  v-model="ooitem.btnType"
                  placeholder="请选择按钮性质"
                >
                  <el-option
                    v-for="item in btnTypeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
        </el-form-item>
        <el-form-item label='请选择按钮类型'>
                <el-select
                  class="btn-attr"
                  v-model="ooitem.btnEventType"
                  placeholder="请选择按钮类型"
                >
                  <el-option
                    v-for="item in eventTypeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
        </el-form-item>
        <el-form-item label='按钮名'>
                <el-input
                  class="btn-attr"
                  placeholder="按钮名"
                  clearable
                  v-model="ooitem.btnName"
                ></el-input>
        </el-form-item>
        <el-form-item label='按钮值'>
                <el-input
                  class="btn-attr"
                  type="textarea"
                  :rows="2"
                  placeholder="按钮值"
                  clearable
                  v-model="ooitem.btnValue"
                ></el-input>
        </el-form-item>
        <el-form-item label='按钮接口url'>
                <el-input
                  class="btn-attr"
                  type="textarea"
                  :rows="2"
                  placeholder="按钮接口url"
                  clearable
                  v-model="ooitem.btnUrl"
                ></el-input>
        </el-form-item>
        <el-form-item label='审核状态'>
                <el-input
                  class="btn-attr"
                  placeholder="审核状态"
                  clearable
                  v-model="ooitem.examineState"
                ></el-input>
        </el-form-item>
        <el-form-item label='待办配置'>
                <el-switch
                  v-model="ooitem.daibanondata"
                  on-color="#00A854"
                  on-text="开"
                  on-value="1"
                  off-color="#F04134"
                  off-text="关"
                  off-value="0"
                  @change="changedaibanSwitch(ooitem.daibanondata)">
                </el-switch>
        </el-form-item>
        <el-form-item label='待办模板' v-if='ooitem.daibanondata'>
                <el-select
                  class="btn-attr"
                  v-model="ooitem.agencyId"
                  placeholder="待办模板"
                >
                  <el-option
                    v-for="item in daibanmoban"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
        </el-form-item>
        <el-form-item label='待办单位' v-if='ooitem.daibanondata'>
                <el-select
                  class="btn-attr"
                  v-model="ooitem.nextBuCode"
                  placeholder="待办单位"
                  @change='nextBuCodechange'
                >
                  <el-option
                    v-for="item in unitList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
        </el-form-item>
        <el-form-item label='待办角色' v-if='ooitem.daibanondata'>
                <el-select
                  class="btn-attr"
                  v-model="ooitem.agencyNextrole"
                  placeholder="待办角色"
                  @change='agencyNextrolechange'
                >
                  <el-option
                    v-for="item in roleList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
        </el-form-item>
        <el-form-item label='待办接收人' v-if='ooitem.daibanondata'>
                <el-select
                  class="btn-attr"
                  v-model="ooitem.nextjfid"
                  placeholder="待办接收人"
                >
                  <el-option
                    v-for="item in personList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
        </el-form-item>
        <el-form-item label='消息配置'>
                <el-switch
                  v-model="ooitem.xiaoxiondata"
                  on-color="#00A854"
                  on-text="开"
                  on-value="1"
                  off-color="#F04134"
                  off-text="关"
                  off-value="0"
                  @change="changeSwitch(ooitem.xiaoxiondata)">
                </el-switch>
        </el-form-item>
        <el-form-item label='消息模板' v-if='ooitem.xiaoxiondata'>
                <el-select
                  class="btn-attr"
                  v-model="ooitem.messageId"
                  placeholder="消息模板"
                >
                  <el-option
                    v-for="item in xiaoximoban"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
        </el-form-item>

        <el-form-item label='消息单位' v-if='ooitem.xiaoxiondata'>
                <el-select
                  class="btn-attr"
                  v-model="ooitem.nextxiaoxiBuCode"
                  placeholder="消息单位"
                  @change='nextxiaoxiBuCodechange'
                >
                  <el-option
                    v-for="item in unitList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
        </el-form-item>
        <el-form-item label='消息角色' v-if='ooitem.xiaoxiondata'>
                <el-select
                  class="btn-attr"
                  v-model="ooitem.xiaoxiNextrole"
                  placeholder="消息角色"
                  @change='xiaoxiNextrolechange'
                >
                  <el-option
                    v-for="item in roleList2"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
        </el-form-item>
        <el-form-item label='消息接收人' v-if='ooitem.xiaoxiondata'>
                <el-select
                  class="btn-attr"
                  v-model="ooitem.nextxiaoxijfid"
                  placeholder="消息接收人"
                >
                  <el-option
                    v-for="item in personList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
        </el-form-item>
        
        <el-form-item>
          <div>
                <el-button type="primary" @click="onSubmit">确认</el-button>
                <el-button @click="resetForm">取消</el-button>
              </div>
        </el-form-item>
      </el-form>
    </div>

  </div>
</template>

<script>
import { beautifierConf } from "@/utils/index";
import beautifier from "js-beautify";
import Draggable from "vuedraggable";
import MonacoEditor from "@/components/MonacoEditor.vue";
import {
  api_unitList,
} from "@/api/unitManage/unitManage";
import {
  api_findBuRoleList,
} from "@/api/accountManage/accountManage";

import { getTodoList,messageTemplateList } from "@/api/autotemplatemanagement/autotemplatemanagement.js";

export default {
  components: {
    Draggable,
    MonacoEditor,
  },
  props: {
    nomolrole: {
      type: String,
      default: function () {
        return "";
      },
    },
    formdata: {
      type: Object,
    },
  },
  watch: {},
  data() {
    return {
      btnTypeList: [
        {
          label: "默认",
          value: "default",
        },
        {
          label: "主按钮",
          value: "primary",
        },
        {
          label: "异常",
          value: "danger",
        },
      ],
      operationList: [
        {
          label: "提交评审",
          value: "tjps",
        },
        {
          label: "发起第三方",
          value: "fqdsf",
        },
        {
          label: "转办",
          value: "zb",
        },
        {
          label: "授权代理",
          value: "sqdl",
        },
      ],
      daibanmoban:[],
      xiaoximoban:[],
      roleList:[],
      roleList2:[],
      unitList:[],
      unitList2:[],
      personList:[],
      eventTypeList: [
        {
          label: "提交评审",
          value: "tjps",
        },
        {
          label: "发起第三方",
          value: "fqdsf",
        },
        {
          label: "转办",
          value: "zb",
        },
        {
          label: "授权代理",
          value: "sqdl",
        },
        {
          label: "节点跳转",
          value: "jdtz",
        },
        {
          label: "驳回",
          value: "bh",
        },
        {
          label: "分配",
          value: "fp",
        },
      ],
      jsonStr: "",
      jsonEg: "",
      form: {
        checkOwner:false,
        showForm: true,
        btns: [
          {
            btnName: "按钮名0",
            btnValue: "按钮值0",
            btnType: "",
            btnTypeName: "",
            btnEventType: "",
            btnEventTypeName: "",
            btnUrl: "",
            examineState: "",
            agencyId: "",
            agencyNextrole: "",
            xiaoxiNextrole: "",
            nextjfid:'',
            nextxiaoxijfid:'',
            nextBuCode: "",
            nextxiaoxiBuCode: "",
            daibanondata:true,
            xiaoxiondata: true,
            messageId:''
          },
        ],
        operationBtns: [
          {
            btnName: "按钮名0",
            btnValue: "按钮值0",
          },
        ],
        nodes: [
          {
            dataName: "节点名0",
            dataValue: "节点值0",
          },
        ],
      }
    };
  },
  methods: {
    changexiaoxiSwitch(val){
    },
    changeSwitch(val){
    },
    getDanbanmobanId(){
      let params = {
        pageNum: 1,
        pageSize: 9999,
      };
      getTodoList(params).then((res) => {
        if (res.msg.message == "SUCCESS") {
          let Data = res.data.records;
          Data.map((item) => {
            item.value = item.templateCode;
            item.label = item.templateName;
          });
          this.$set(this,'daibanmoban',Data)
        }
      });
      messageTemplateList(params).then((res) => {
        if (res.msg.message == "SUCCESS") {
          let Data = res.data.records;
          Data.map((item) => {
            item.value = item.templateCode;
            item.label = item.templateName;
          });
          this.$set(this,'xiaoximoban',Data)
        }
      });
      
    },
    nextBuCodechange(val){
      for(var i=0;i<this.unitList.length;i++){
        if(this.unitList[i].value ==val){
          this.getFindByCondintion(this.unitList[i].buProperty)
          break;
        }
      }
    },
    nextxiaoxiBuCodechange(val){
      for(var i=0;i<this.unitList.length;i++){
        if(this.unitList[i].value ==val){
          this.getFindByCondintion2(this.unitList[i].buProperty)
          break;
        }
      }
    },
    agencyNextrolechange(val){
      this.$set(this.form.btns[0],'nextjfid','')
      this.form.btns[0].nextBuCode
    },
    xiaoxiNextrolechange(val){
      this.$set(this.form.btns[0],'nextxiaoxijfid','')
      this.form.btns[0].nextxiaoxiBuCode
    },
    //获取角色下拉列表
    getFindByCondintion(data) {
      api_findBuRoleList({ buProperty: data })
        .then((res) => {
          // console.log(res)
          if (res.msg && res.msg.code == "0000") {
            let arr = [];
            res.data.forEach((item) => {
              let obj = {};
              if (item.roleCode) {
                obj.value = item.roleCode;
                obj.label = item.roleName;
                arr.push(obj);
              }
            });
            this.$set(this,'roleList',arr)
            this.$set(this.form.btns[0],'agencyNextrole','')
            this.$set(this.form.btns[0],'nextjfid','')
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //获取角色下拉列表
    getFindByCondintion2(data) {
      api_findBuRoleList({ buProperty: data })
        .then((res) => {
          // console.log(res)
          if (res.msg && res.msg.code == "0000") {
            let arr = [];
            res.data.forEach((item) => {
              let obj = {};
              if (item.roleCode) {
                obj.value = item.roleCode;
                obj.label = item.roleName;
                arr.push(obj);
              }
            });
            this.$set(this,'roleList2',arr)
            this.$set(this.form.btns[0],'xiaoxiNextrole','')
            this.$set(this.form.btns[0],'nextxiaoxijfid','')
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getUnit(){
      let params = {
        pageNum: 1,
        pageSize: 999,
      };
      api_unitList(params).then((res) => {
        let unitList = [];
        if (res.msg.message == "SUCCESS") {
          for(var i=0; i < res.data.records.length;i++){
            var map = {
              buProperty: res.data.records[i].buProperty,
              label: res.data.records[i].buName,
              value: res.data.records[i].buUniqueCode,
            }
            unitList.push(map)
          }
          this.unitList =  unitList
        }
      });
    },
    handleBtnRemove(index) {
      this.form["btns"].splice(index, 1);
    },
    handleAddBtn1() {
      let index = this.form["operationBtns"].length;
      this.form["operationBtns"].push({
        btnValue: "按钮值" + index,
        btnName: "按钮名" + index,
      });
    },
    handleAddBtn() {
      let index = this.form["btns"].length;
      this.form["btns"].push({
        btnValue: "按钮值" + index,
        btnName: "按钮名" + index,
        btnType: "",
        btnTypeName: "",
        btnEventType: "",
        btnEventTypeName: "",
        btnUrl: "",
        examineState: "",
        agencyId: "",
        agencyNextrole: "",
        xiaoxiNextrole: "",
        nextjfid:'',
        nextxiaoxijfid:'',
        nextBuCode: "",
        nextxiaoxiBuCode: "",
      });
    },
    handleNodeRemove(index) {
      this.form["nodes"].splice(index, 1);
    },
    handleAddNode() {
      let index = this.form["nodes"].length;
      this.form["nodes"].push({
        dataValue: "节点值" + index,
        dataName: "节点名" + index,
      });
    },
    onSubmit() {
      for(let i=0 ;i<this.eventTypeList.length;i++){
        if(this.form.btns[0].btnEventType ==this.eventTypeList[i].value){
          this.$set(this.form.btns[0],'btnEventTypeName',this.eventTypeList[i].label);
          break;
        }
      }
      for(let i=0 ;i<this.btnTypeList.length;i++){
        if(this.form.btns[0].btnType ==this.btnTypeList[i].value){
          this.$set(this.form.btns[0],'btnTypeName',this.btnTypeList[i].label);
          break;
        }
      }

      this.jsonStr = { ...this.form,'role':this.nomolrole };
      this.$emit('cancel',this.jsonStr)
    },
    resetForm() {
      this.form = {
        btns: [
          {
            btnName: "按钮名0",
            btnValue: "按钮值0",
            btnType: "",
            btnTypeName: "",
            btnEventType: "",
            btnEventTypeName: "",
          },
        ],
        nodes: [
          {
            dataName: "节点名0",
            dataValue: "节点值0",
          },
        ],
      };
      this.$emit('cancel')
    },
    init(data){
      var form2 = {
        checkOwner:false,
        showForm: true,
        btns: [],
        operationBtns: [
          {
            btnName: "按钮名0",
            btnValue: "按钮值0",
          },
        ],
        nodes: [
          {
            dataName: "节点名0",
            dataValue: "节点值0",
          },
        ],
      }
      if(data){
        if(data.agencyId){
          data.daibanondata =true
        }else{
          data.daibanondata =false
        }
        if(data.messageId){
          data.xiaoxiondata =true
        }else{
          data.xiaoxiondata =false
        }
        
        form2.btns.push(data)
        this.$set(this,'form',form2)
      }else{
        let adddata = {
            btnName: "",
            btnValue: "",
            btnType: "",
            btnTypeName: "",
            btnEventType: "",
            btnEventTypeName: "",
            btnUrl: "",
            examineState: "",
            agencyId: "",
            agencyNextrole: "",
            xiaoxiNextrole: "",
            nextjfid:'',
            nextxiaoxijfid:'',
            nextBuCode: "",
            nextxiaoxiBuCode: "",
            daibanondata:true,
            xiaoxiondata: true,
            messageId:''
      }
        form2.btns.push(adddata)
        this.$set(this,'form',form2)
      }
      
    }
  },
  mounted() {
    this.formdata
    this.getUnit();
    this.getDanbanmobanId();
  },
};
</script>

<style lang="scss" scoped>
.tool-page {
  margin: 20px auto;
  width: 80%;
  display: flex;
  .tool-page-right {
    margin-left: 20px;
    width: 50%;
    ::v-deep .tool-editor {
      width: 100%;
      height: 82vh;
    }
  }
  .btn-list {
    display: flex;
    flex-direction: column;

    .btn-attr {
      width: 200px;
      margin-bottom: 10px;
    }
  }
}
</style>
