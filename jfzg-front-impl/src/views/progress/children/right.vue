<template>
     <div class='right_detail'>
       <div class='right_detail_first'>
         <div class='right_first_left' v-if='projectInfo'>
           <div class='flex3 nfje'>
             <div>
               <img class='img24' :src="right01" alt="">
               <span class='title'>拟付金额(万元)</span>
             </div>
             <span class='count'>
               {{projectInfo.paidAmout || 0}}
               <img :src="edit_png" alt="" @click='count_route' v-if="checkCodeInArr('M005_001_007') &&contractId &&projectstatus==1">
             </span>
             <img class='img59' :src="right03" alt="">
           </div>
           <div class='flex3 yfje'>
             <div>
               <img class='img24' :src="right02" alt="">
               <span class='title'>已付金额(万元)</span>
             </div>
             <span class='count'>{{projectInfo.realityAmount || 0}}
               <img :src="edit_png" alt="" @click='count_route' v-if="checkCodeInArr('M005_001_007')&&contractId&&projectstatus==1">
             </span>
             <img class='img59' :src="right04" alt="">
           </div>

           <div class='flex3 right_first_right' v-if='projectInfo'>
             <img class='img59' :src="right05" alt="">
             <div class='tab_click' >
               <span @click="handleClick('jsdw')" :class="['title',activetab == 'jsdw'? 'title_click' : '']">建设单位</span>
               <span @click="handleClick('cjdw')" :class="['title',activetab == 'cjdw'? 'title_click' : '']">承建单位</span>
               <span @click="handleClick('jldw')" :class="['title',activetab == 'jldw'? 'title_click' : '']">监理单位</span>
             </div>
              <div label="建设单位" name="first" v-if='"jsdw"==activetab'>
                <div class='unit_info'>
                  <div class='title'>{{projectInfo.constructUnitName}}<img :src="edit_png" alt="" @click='member_route' v-if="buProperty==2 &&checkCodeInArr('M005_003_003_001')&&projectstatus==1"></div>
                  <div class='content'>
                    <div class='title_name'>
                      <span>项目经理：</span>
                      <span>{{projectInfo.constructFullName}}</span>
                    </div>
                    <div class='title_line'></div>
                    <div style='margin-left:16px'>
                      <span>成员：</span>
                      <span>{{projectInfo.constructMember}}</span>
                    </div>
                  </div>
                  
                </div>
              </div>
              <div label="承建单位" name="second" v-if='"cjdw"==activetab'>
                <div class='unit_info'>
                  <div class='title'>{{projectInfo.contractUnitFullName}}<img :src="edit_png" alt="" @click='member_route' v-if="buProperty==3 &&checkCodeInArr('M005_003_003_001')&&projectstatus==1"></div>
                  <div class='content'>
                    <div class='title_name'>
                      <span>项目经理：</span>
                      <span>{{projectInfo.contractFullName}}</span>
                    </div>
                    <div class='title_line'></div>
                    <div style='margin-left:16px'>
                      <span>成员：</span>
                      <span>{{projectInfo.contractMember}}</span>
                    </div>
                  </div>
                  
                </div>
              </div>
              <div label="监理单位" name="third" v-if='"jldw"==activetab'>
                <div class='unit_info'>
                  <div class='title'>{{projectInfo.controlUnitFullName}}<img :src="edit_png" alt="" @click='member_route' v-if="buProperty==4 &&checkCodeInArr('M005_003_003_001')&&projectstatus==1"></div>
                  <div class='content'>
                    <div class='title_name'>
                      <span>项目经理：</span>
                      <span>{{projectInfo.controlFullName}}</span>
                    </div>
                    <div class='title_line'></div>
                    <div style='margin-left:16px'>
                      <span>成员：</span>
                      <span>{{projectInfo.controlMember}}</span>
                    </div>
                  </div>
                  
                </div>
              </div>
         </div>
         </div>
         
       </div>

       <div class='right_detail_second' v-if='is_no_content'>
         <div class='center'>
            <div><img :src="noproject" alt=""></div>
            <div class='div' v-if='checkCodeInArr("M005_002_001")&&projectstatus==1'>您还没添加编制实施方案，立即<span @click='bianzhi_route' style='cursor:pointer'>编制</span></div>
            <div class='div' v-else>您还没添加编制实施方案</div>
         </div>
       </div>

       <div v-else style='height: calc(100% - 112px);'>
         <div>
           <lcb
            :eletab="eletab"
            :currentStage='currentStage'
            v-if="eletab.length > 0"
            ref="SwiperTab"
            class="jfw_SwiperTab"
            @eletabClick='eletabClick'
            :project_Id='projectId'
            :projectstatus='projectstatus'
          ></lcb> 
         </div>
         <div class='right_detail_third'>
           <div class='info_class'>
             <topinfo mode = '2' :info='infoList[1]' @addclick='addrenwu' @moreclick='moreclick' @change='change' :projectstatus='projectstatus'></topinfo>
             <renwu :renwudata='renwudata' @addclick='addrenwu' :echart_data_renwu='echart_data_renwu' :projectstatus='projectstatus'></renwu> 
             <AddTaskDialog v-if='projectId' ref="addTask"  :project_Id='projectId' @refreshList="getTaskAll"></AddTaskDialog>
            </div>
           <div class='info_class'>
             <div class='info_class1'>
                <topinfo mode = '3' :info='infoList[2]' @addclick='addfxwt' @moreclick='moreclick' @getRiskOrQues='getRiskOrQues' @change='change' :projectstatus='projectstatus'></topinfo>
                <risk :riskandquedata='riskandquedata' @addclick='addfxwt' :processType='processType' @riskhandler='riskhandler' :echart_data_risk='echart_data_risk' :projectstatus='projectstatus'></risk> 
                <AdFengxianDialog v-if='projectId' :processType='processType' ref="addfx"  :project_Id='projectId' @refreshList="riskhandler"></AdFengxianDialog>
                <AdQuesDialog v-if='projectId' :processType='processType' ref="addques"  :project_Id='projectId' @refreshList="riskhandler"></AdQuesDialog>
             </div>
             <div class='info_class1' style='border-top: 1px solid #EFEFEF;'> 
                <topinfo mode = '1' :info='infoList[0]' @addclick='addjfw' @moreclick='moreclick' @change='change' :projectstatus='projectstatus'></topinfo>
                <jfw @see='see' @approve="approve" v-if='projectId' :jfwdata='jfwdata' :project_Id='projectId' @addclick='addjfw' @changejfwdata='changejfwdata' :projectstatus='projectstatus' :echart_data_jfw='echart_data_jfw'></jfw>
                <SrDialog
                  @submitData="submitData"
                  @workFlowHandle="workFlowHandle"
                  ref="SrDialog"
                  :visible="visible"
                  :title="title"
                  :type="type"
                ></SrDialog>
             </div>
             
           </div>
         </div>
       </div>
     </div>
</template>

<script>
import right01 from "@/assets/process/right/right01.png";
import right02 from "@/assets/process/right/right02.png";
import right03 from "@/assets/process/right/right03.png";
import right04 from "@/assets/process/right/right04.png";
import right05 from "@/assets/process/right/right05.png";
import edit_png from "@/assets/process/right/edit.png";

import noproject from "@/assets/process/right/noproject.png";
import topinfo from "../children/topinfo.vue";
import lcb from "../children/lcb.vue";
import jfw from "../children/jfw.vue";
import renwu from "../children/renwu.vue";
import risk from "../children/risk.vue";

import AddTaskDialog from "../../task/children/addTask.vue";
import AdFengxianDialog from "../children/adFengxianDialog.vue";
import AdQuesDialog from "../children/adQuesDialog.vue";
import SrDialog from "../children/SrDialog.vue";

import {
  api_addDeliver,
  approveDeliverFile
} from "@/api/deliver/index";

import { 
  getInfoProject, 
  getProjectTrackMileStone, 
  getProjectTrackDeliveryAll,
  getProjectTrackTaskAll,
  getProjectTrackProblemAll,
  getContractAmountByProjectId
  } from "@/api/genzong/index.js";
import utils from "@/utils/index.js";
import {
  api_getdeliverListById,
} from "@/api/deliver/index";
export default {
  //组件注册
  components: {
    topinfo,
    lcb,
    jfw,
    renwu,
    risk,
    AddTaskDialog,
    AdFengxianDialog,
    AdQuesDialog,
    SrDialog
  },
  props:{
    projectId: {
      type: Number,
    },
    projectstatus: {
      type: Number,
    },
  },
  watch:{
      'projectId': {
        handler(val) {
          if (val) {
            this.buProperty = this.$store.state.userinfo.userInfo.currentBizunit.buProperty
            this.id = val
            this.getInfoProject(val);
            this.getProjectTrackMileStone(val); 
          }else{
            this.buProperty = this.$store.state.userinfo.userInfo.currentBizunit.buProperty
            this.id = val;
            this.getInfoProject(val);
            this.getProjectTrackMileStone(val); 
          }
        }
      },
      renwuuserFlag: {
        handler(val) {
            this.getTaskAll()  
        }
      },
      jfwcheckFlag: {
        handler(val) {
           this.getJfw();
        }
      },
      riskuserFlag: {
        handler(val) {
           this.riskhandler();
        }
      },
    },
  data() {
    return {
      buProperty:null,
      contractId:null,
      RowData: {},
      type: "addDeliver",
      title: "添加交付物",
      renwuuserFlag:'',//任务flag
      jfwcheckFlag:'',//交付物flag
      echart_data_renwu:null,
      echart_data_risk:null,
      echart_data_jfw:null,
      visible: false,//交付物弹出框
      processType:1,//默认风险
      eletab:[],
      currentStage:null,
      jfwdata:[],
      renwudata:[],
      riskandquedata:[],
      id:null,
      projectInfo:null,
      right01:right01,
      right02:right02,
      right03:right03,
      right04:right04,
      right05:right05,
      edit_png:edit_png,
      noproject:noproject,
      activeName: 'first',
      is_no_content:false,
      activetab:'jsdw',
      infoList:[{
        'name':'当前交付物'
      },
      {
        'name':'任务'
      },
      {
        'name1':'所有风险',
        'name2':'所有问题'
      }],
      riskuserFlag:'',
      tab:0
    };
  },
  methods: {
    // 审核附件
    approve(row) {
      this.RowData = row;
      this.type = "approve";
      this.title = "填写交付物附件审核结果";
      this.$refs["SrDialog"].visible = true;
      this.$refs["SrDialog"].inits(this.projectId)
    },
    bianzhi_route(){
        this.$router.push({
          name: "bianzhiInitiateDetail",
          query: { id: this.projectId },
        });   
    },
    checkCodeInArr(code, arr){
        arr = sessionStorage.getItem('permission_btns') || []
        if (!code) {
          return true;
        }
        arr = typeof arr == 'string' ? JSON.parse(arr) : arr
        let flag = false;
        for (let k = 0; k < arr.length; k++) {
          if (arr[k].permissionCode == code) {
            flag = true;
            break;
          }
        }
        return flag;
    },
    member_route(){
      this.$router.push({
        name: "memberMgrView",
        query: { projectId: this.projectId },
      });
    },
    count_route(){
      this.$router.push({
        name: "fundList",
        query: {
          id: this.contractId,
          projectId: this.projectId,
          type: "fundList",
        },
      });
    },
    // 下拉框切换
    change(data){
      if(data =='所有任务'){
        this.renwuuserFlag=''
      }else if(data =='我创建的任务'){
        this.renwuuserFlag=1
      }else if(data =='指给我的任务'){
        this.renwuuserFlag=2
      }else if(data =='我审查的任务'){
        this.renwuuserFlag=3
      }else if(data =='所有交付物'){
        this.jfwcheckFlag=''
      }else if(data =='有验收需求'){
        this.jfwcheckFlag=0
      }else if(data =='无验收需求'){
        this.jfwcheckFlag=1
      }else if(data =='所有问题' ||data =='所有风险'){
        this.riskuserFlag=''
      }else if(data =='我创建的问题' ||data =='我创建的风险'){
        this.riskuserFlag=0
      }else if(data =='我处理的问题' ||data =='我处理的风险'){
        this.riskuserFlag=1
      }
    },
    // 查看
    see(row) {
      this.type = "approveView";
      this.title = "查看审核结果";
      this.$refs["SrDialog"].init(row.id)
      this.$refs["SrDialog"].visible = true;
    },
    // 提交
    submitData(Data) {
      if (this.type == "addDeliver") {
        this.addNewDeliver(Data);
      } else if (this.type == "approve") {
        this.approveDeliverFile(Data);
      } else if (this.type == "editDeliver") {
        this.editNewDeliver(Data);
      }
    },
    // 交付物文件审核
    approveDeliverFile(Formdata) {
      let data = {
        advice: Formdata.advice,
        files: JSON.stringify(Formdata.files),
        id: this.RowData.id, // 交付物文件的Id
        status: this.$refs["SrDialog"].approveformAdd.data.approve,
      };
      approveDeliverFile(data).then((res) => {
        this.$message({
          message: "审核成功",
          type: "success",
        });
        this.getJfw();
      });
    },
    // 新增交付物
    addNewDeliver(Formdata) {
      let data = {
        projectId: this.projectId,
        ...Formdata,
      };
      api_addDeliver(data).then((res) => {
        this.$message({
          message: "添加成功",
          type: "success",
        });
        this.getJfw();   
      });
    },
    // 工作流
    workFlowHandle(Data, Type) {
    },
    //新增任务
    addrenwu(){
      this.$refs.addTask.inits(this.projectId);
    },
    //新增风险问题
    addfxwt(){
      if(this.processType ==1){
        this.$refs.addfx.init();
      }else{
        this.$refs.addques.init();
      }   
    },
    //新增交付物
    addjfw(){
      this.title = "添加交付物";
      this.type = "addDeliver",
      this.$refs["SrDialog"].visible = true;
      this.$refs["SrDialog"].inits(this.projectId)
    },
    //更多跳转
    moreclick(mode){
      if(mode == 2 ){
        this.$router.push({
          name: "taskList",
          query: { projectId: this.projectId },
        });
      }else if(mode == 3 ){
        this.$router.push({
          name: "riskAndIssue",
          query: { projectId: this.projectId },
        });
      }else if(mode == 1 ){
        this.$router.push({
          name: "deliverTaskView",
          query: { projectId: this.projectId },
        });
      }
    },
    //任务查询
    getTaskAll(){
      if(this.eletab[this.tab]){
        let params = {
          milestoneId : this.eletab[this.tab].stageId,
          projectId : this.projectId,
          pageNo:1,
          pageSize:100,
          userFlag:this.renwuuserFlag
        }
        getProjectTrackTaskAll(params).then(res =>{
          this.echart_data_renwu = {
            processTask:res.data.processTask||0,
            completeTask: res.data.completeTask||0,
            auditedTask: res.data.auditedTask ||0,
            echartCount:res.data.echartCount ||[]
          }
          this.renwudata = res.data.records
        })
        }
      
    },
    //里程碑查询
    getProjectTrackMileStone(id){
      if(id){
        getProjectTrackMileStone({'projectId':id}).then(res =>{
          if(res.data &&res.data.records&&res.data.records.length >0){
            this.is_no_content =false;
          }else{
            this.is_no_content =true;
          }
          // this.eletab = eletab
          this.eletab = res.data.records ||[]
          this.currentStage = res.data.currentStage
          this.tab = 0;
          this.getTaskAll();
          this.riskhandler();
          this.getJfw();    
        })
        
      }else{
        this.is_no_content =true;
      }
    },
    //风险问题查询
    riskhandler(){
      if(this.eletab[this.tab]){
        let params = {
          milestoneId : this.eletab[this.tab].stageId,
          projectId : this.projectId,
          pageNo:1,
          pageSize:100,
          processType :this.processType,
          userFlag:this.riskuserFlag
        }
        if(params.milestoneId){
          getProjectTrackProblemAll(params).then(res =>{
            let processTask = 0;
            let completeTask = 0;
            let auditedTask = 0;
            if(res.data.groupsCount &&res.data.groupsCount.length>0){
              for(var i=0;i<res.data.groupsCount.length;i++){
                if(res.data.groupsCount[i].name =='待处理'){
                  processTask = res.data.groupsCount[i].quantity ||0
                }
                if(res.data.groupsCount[i].name =='已处理'){
                  auditedTask = res.data.groupsCount[i].quantity ||0
                }
                if(res.data.groupsCount[i].name =='已关闭'){
                  completeTask = res.data.groupsCount[i].quantity ||0
                }
              } 
            }
            this.echart_data_risk = {
              processTask:processTask,
              completeTask: completeTask,
              auditedTask: auditedTask,
              groupsPercent:res.data.groupsPercent ||[]
            }
            this.riskandquedata = res.data.records
          })
        }
      }
      
    },
    //交付物查询
    getJfw(){
      if(this.eletab[this.tab]){
        let params = {
          milestoneId : this.eletab[this.tab].stageId,
          projectId : this.projectId,
          pageNo:1,
          pageSize:100,
          checkFlag:this.jfwcheckFlag
        }
        getProjectTrackDeliveryAll(params).then(res =>{
          let processTask = 0;
          let completeTask = 0;
          let auditedTask = 0;
          if(res.data.groupsCount &&res.data.groupsCount.length>0){
            for(var i=0;i<res.data.groupsCount.length;i++){
              if(res.data.groupsCount[i].statusName =='待审核'){
                processTask = res.data.groupsCount[i].quantity ||0
              }
              if(res.data.groupsCount[i].statusName =='审核驳回'){
                auditedTask = res.data.groupsCount[i].quantity ||0
              }
              if(res.data.groupsCount[i].statusName =='审批通过'){
                completeTask = res.data.groupsCount[i].quantity ||0
              }
            } 
          }
          this.echart_data_jfw = {
            processTask:processTask,
            completeTask: completeTask,
            auditedTask: auditedTask,
            groupsPercent:res.data.deliveryData ||[]
          }
          // this.jfwdata = res.data.records
        })


      api_getdeliverListById({'projectId':this.projectId,"checkFlag":this.jfwcheckFlag}).then((res) => {
        if (res.msg.code == "0000" && res.data.length) {
          for(var i =0;i<res.data.length;i++){
            if(this.eletab[this.tab].stageId ==res.data[i].stageId){
              this.jfwdata = res.data[i].deliverys ||[];
              break;
            }
          }
        }
        // console.log("工作流", JSON.parse(res.data[0].deliverys[10].description));
      });

      }
    },
    //修改交付物附件刷新交付物模块
    changejfwdata(){
      this.getJfw()
    },
    //切换风险问题
    getRiskOrQues(Flag){
      // processType 1 风险 2问题（必填）
      if(Flag == 'risk'){
        this.processType = 1
      }else{
        this.processType = 2
      }
      this.riskhandler()
    },
    //里程碑切换
    eletabClick(tab){
      this.tab = tab
      let params = {
        milestoneId : this.eletab[this.tab].stageId,
        projectId : this.projectId,
        pageNo:1,
        pageSize:100,
        userFlag:this.renwuuserFlag,
      }
      this.getJfw();
      getProjectTrackTaskAll(params).then(res =>{
        this.echart_data_renwu = {
          processTask:res.data.processTask||0,
          completeTask: res.data.completeTask||0,
          auditedTask: res.data.auditedTask||0, 
          echartCount:res.data.echartCount ||[]
        }

        this.renwudata = res.data.records
      })
      this.riskhandler()
    },
    pageChanged(){},
    handleClick(tab) {
      this.activetab = tab
    },
    //查询项目基本信息
    getInfoProject(id){
      if(id){
        getInfoProject({'projectId':id}).then(res =>{
          this.projectInfo = res.data
        })
        getContractAmountByProjectId({'projectId':id}).then(res =>{
          this.contractId = res.data?res.data.id:null
        })
      }else{
        this.projectInfo = {};
        this.contractId = null;
      }
    },
  },
  created() {
  },
};
</script>

<style lang="scss" scoped>

  .right_detail{
    margin-left: 16px;
    // background: #F7F7F7;
    margin-top: 24px;
    margin-right: 24px;
    min-width: 864px;
    flex-grow:1;
    .right_detail_first{
      display:flex;
      width: 100%;
      height: 112px;
      background: #FFFFFF;
      border-radius: 8px;
      .right_first_left{
        display:flex;
        width: 100%;
        height: 100%;
        .flex3{
          position: relative;
          border-radius: 8px;
          min-width: 274px;
          height: 102px;
          padding-top: 19px;
          padding-left: 24px;
          flex: 1;
        }
        .nfje{
          background: #FFFFFF linear-gradient(270deg, #F0C35D 0%, #F8A61C 100%);
        }
        .yfje{
          margin-left: 9px;
          background: linear-gradient(270deg, #81DAFF 0%, #27C0FF 100%);
        }
        .img24{
          height: 24px;
          width: 24px;
        }
        .img59{
          position: absolute;
          right: 0;
          top:15px;
          width: 59px;
          height: 72px;
          // opacity: 0.3;
        }
        .count{
          height: 32px;
          font-size: 24px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #FFFFFF;
          line-height: 32px;
          img{
            cursor: pointer;
            height: 16px;
            width: 16px;
          }
        }
        .title{
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #FFFFFF;
          line-height: 22px;
          margin-left: 4px;
          vertical-align: top;
        }
      }
      .right_first_right{
       height: 100%;
       margin-left: 9px;
       background: #FFFFFF linear-gradient(270deg, #73708F 0%, #3F3D56 100%);
       padding-top: 12px!important;
       padding-left: 16px!important;
       padding-right: 16px!important;
       min-width: 298px!important;
       .tab_click{
         cursor: pointer;
         max-width: 266px;
        height: 26px;
        background: rgb(255,255,255,0.1);
        border-radius: 4px;
        padding-left: 1px;
        padding-right: 1px;
        .title{
          width: 88px;
          height: 24px;
          line-height: 24px;
          color: rgb(255,255,255,0.6);
          border-radius: 4px;
          font-size: 14px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 400;
          display: inline-block;
          text-align: center;
          margin-top: 1px;
          margin-left: 0px!important;
        }
        .title_click{    
          background: rgba(255, 255, 255, 0.2);
          color: #FFFFFF;
          font-weight: 700;
        }
       }
        .unit_info{
          position:relative;
          margin-left: 8px;
          margin-top: 8px;
          .title{
            position:relative;
            margin-left: 0px!important;
            display: inline;
            img{
              cursor: pointer;
              height: 16px;
              width:16px;
              position: absolute;
              top: 1px;
              right: -26px;
            }
          }
          .content{
            display: flex;
            height: 20px;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgb(255,255,255,0.6);
            line-height: 20px;
            .title_line{
              margin-left: 15px;
              width: 1px;
              height: 12px;
              background: rgba(255, 255, 255, 0.2);
              position: relative;
              top: 5px;
            }
          }
          
          
        }
      }
    }
    .right_detail_second{
      text-align: center;
      display:flex;
      position: relative;
      width: 100%;
      height: calc(100% - 130px);
      background: #FFFFFF;
      border-radius: 8px;
      margin-top: 16px;
      .center{
        position: absolute;
        left:50%;
        top:50%;
        transform: translate(-50%, -50%);
        img{
          width:80px;
          height: 60px;
        }
        .div{
          height: 22px;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #666666;
          line-height: 22px;
        }
        span{
          color: #1890FF;
        }
      }
    }
    .right_detail_third{
      display:flex;
      position: relative;
      width: 100%;
      height: calc(100% - 83px);
      background: #fff;
      border: 1px solid #EDEDED;
      border-radius: 8px 0px 8px 8px;
      top:-6px;
      .info_class{
        // border: 1px solid #EDEDED;
        // border-radius: 8px 0px 0px 8px;
        flex:1;
        width: 50%;
        height: calc(100%);
        display: flex;
        flex-direction: column;
        border-right: 1px solid #EDEDED;
        .info_class1{
          height: 50%;
          flex:1;
          // margin-bottom: 12px;
        }
      }
    }
  }
</style>
