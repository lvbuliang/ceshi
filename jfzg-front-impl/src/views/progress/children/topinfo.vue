<template>
     <div class='top_info' >   
         
          <div v-if='mode==1 ||mode==2'>
            <span  class='top_info_title'>{{infodata.name}}</span>
            <el-popover
                placement="bottom-start"
                width="128"
                trigger="click"
                id="tabPopover"
                :append-to-body="false"
                class="tabPopover_project_genzong top3"
              >
              <div class="" v-if='mode==2'>
                  <div class='tip_title' @click='change("所有任务","renwu")'>
                      所有任务
                  </div>
                  <div class='tip_title'  @click='change("指给我的任务","renwu")'>
                    指给我的
                  </div>
                  <div class='tip_title'  @click='change("我审查的任务","renwu")'>
                    我审查的
                  </div>
                  <div class='tip_title'  @click='change("我创建的任务","renwu")'>
                    我创建的
                  </div>
              </div>
              <div class="" v-if='mode==1'>
                  <div class='tip_title' @click='change("所有交付物","jfw")'>
                      所有交付物
                  </div>
                  <div class='tip_title'  @click='change("有验收需求","jfw")'>
                    有验收需求
                  </div>
                  <div class='tip_title'  @click='change("无验收需求","jfw")'>
                    无验收需求
                  </div>
   
              </div>
              <img :class="['up_png',fanzhaun01 ? '' : 'transform180']" :src="up" alt="" slot="reference" @click="mouseOver('fanzhaun01')">
              </el-popover>  
          </div>
         <div v-else class='risk_ques'>
          <span :class="['top_info_title',clickrisk ? '' : 'colorgrey']"  @click='changeclickrisk("1")'>{{infodata.name1}}</span>
          <el-popover
            placement="bottom-start"
            width="128"
            trigger="click"
            id="tabPopover"
            :append-to-body="false"
            class="tabPopover_project_genzong"
          >
           <div class="">
              <div class='tip_title'  @click='change("所有风险","risk")'>
                  所有风险
              </div>
              <div class='tip_title'  @click='change("我处理的风险","risk")'>
                  我处理的风险
              </div>
              <div class='tip_title'  @click='change("我创建的风险","risk")'>
                  我创建的风险
              </div>
          </div>
          <img :class="['up_png',fanzhaun02 ? '' : 'transform180']" :src="up" alt="" slot="reference" @click="mouseOver('fanzhaun02')">
          </el-popover>   
          <span class='line'></span>
          <span :class="['top_info_title',clickrisk ? 'colorgrey' : '']" @click='changeclickrisk("2")'>{{infodata.name2}}</span>
          <el-popover
            placement="bottom-start"
            width="128"
            trigger="click"
            id="tabPopover"
            :append-to-body="false"
            class="tabPopover_project_genzong"
          >
           <div class="">
             <div class='tip_title' @click='change("所有问题","ques")'>
                  所有问题
              </div>
              <div class='tip_title' @click='change("我处理的问题","ques")'>
                  我处理的问题
              </div>
              <div class='tip_title' @click='change("我创建的问题","ques")'>
                  我创建的问题
              </div>
          </div>
          <img class='up_png' :class="['up_png',fanzhaun03 ? '' : 'transform180']" :src="up" alt="" slot="reference" @click="mouseOver('fanzhaun03')">
          </el-popover>   
         </div>
                 
          <div class='buttons'>
            <img style='margin-right: 8px;cursor:pointer' @mouseover="addsvghover" @mouseleave="addsvgleave" :src="addsvg?add:addhover" alt="" @click='addclick' v-if='projectstatus==1&&(mode==2 &&checkCodeInArr("M005_002_001")||mode==3 &&checkCodeInArr("M005_003_002_003")||mode==1 &&checkCodeInArr("M005_003_002_003"))'>
            <img style='cursor:pointer' :src="moresvg?more:morehover" alt="" @click='moreclick' @mouseover="moresvghover" @mouseleave="moresvgleave">
          </div>
       </div>
      
</template>

<script>
import add from "@/assets/process/right/add.svg";
import addhover from "@/assets/process/right/addhover.svg";

import more from "@/assets/process/right/more.svg";
import morehover from "@/assets/process/right/morehover.svg";
import up from "@/assets/process/up.png";
export default {
  props: {
    mode: {
      type: String,
      default: "1"
    },
    info: {
      type: Object
    },
    projectstatus: {
      type: Number,
    },
  },
  //组件注册
  components: {

  },
  data() {
    return {
      addsvg:false,
      moresvg:true,
      clickrisk:true,
      add:add,
      addhover:addhover,
      more:more,
      morehover:morehover,
      up:up,
      infodata:{},
      fanzhaun01:false,
      fanzhaun02:false,
      fanzhaun03:false,
    };
  },
  methods: {
    addsvghover(){
      this.addsvg = true
    },
    addsvgleave(){
      this.addsvg = false
    },
    moresvghover(){
      this.moresvg = false
    },
    moresvgleave(){
      this.moresvg = true
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
    change(data,str){
      if(str =='renwu'){
        this.$set(this.infodata,'name',data)
      }else if(str =='risk'){
        this.$set(this.infodata,'name1',data)
      }else if(str =='ques'){
        this.$set(this.infodata,'name2',data)
      }else if(str =='jfw'){
        this.$set(this.infodata,'name',data)
      }
      this.$emit('change',data)
    },
    changeclickrisk(data){
      if(data == 1){
        this.clickrisk = true
        this.$emit('getRiskOrQues','risk')
      }else{
        this.clickrisk = false
        this.$emit('getRiskOrQues','ques')
      }
    },
    mouseOver(item){
      if(item == 'fanzhaun01'){
        this.fanzhaun01 = !this.fanzhaun01
      }else if(item == 'fanzhaun02'){
        this.fanzhaun02 = !this.fanzhaun02
      }else if(item == 'fanzhaun03'){
        this.fanzhaun03 = !this.fanzhaun03
      }
      
    },
    mouseLeave(item){
      if(item == 1){
        this.fanzhaun01 = false
      }else if(item == 2){
        this.fanzhaun02 = false
      }else if(item == 3){
        this.fanzhaun03 = false
      }
    },
    addclick(){
      this.$emit('addclick',this.clickrisk)
    },
    moreclick(){
      this.$emit('moreclick',this.mode)
    },
  },
  mounted() {
    this.infodata = this.info
  },
};
</script>

<style lang="scss" scoped>

  .top_info{
    position: relative;
    width: 100%;
    padding:12px 16px;
    padding-bottom: 8px;
    
    .buttons{
        position: absolute;
        top: 16px;
        right: 16px;
      img{
        height: 16px;
        width: 16px;
      }
    }
    .up_png{
        height: 16px;
        width: 16px;
        position: relative;
        top: 2px;
    }
    .transform180{
      transform: rotate(180deg);
    }
    
    .jindu{
      width: 23px;
      height: 20px;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      line-height: 20px;
      color:#333333;
      .jindu_blue{
        color: #1890FF;
      }
      .jindu_green{
        color: #52C41A;
      }
    }
    .top_info_title{
      cursor: pointer;
      height: 24px;
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      line-height: 24px;
    }
    .colorgrey{
      color:#999999
    }
    .iyanse{
      color:#CCCCCC;
      margin-left:8px;
      margin-right: 4px;
    }
  }

  .risk_ques{
      display: flex;
      .line{
        width: 1px;
        height: 16px;
        border: 1px solid #EDEDED;
        margin-left: 8px;
        margin-right: 8px;
        position: relative;
        top:4px;
      }
      .jindu{
        margin-left: 6px;
        width: 23px;
        height: 20px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        line-height: 20px;
        color:#333333;
        .jindu_blue{
          color: #1890FF;
        }
        .jindu_green{
          color: #52C41A;
        }
      }
      .risk_{
        flex:1;
        padding: 12px 23px;
        border-right: 1px solid #EDEDED;
        border-bottom: 1px solid #EDEDED;
        .top_info_title{
          width: 32px;
          height: 24px;
          font-size: 16px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 700;
          color: #666666;
          line-height: 24px;
        }
      }
      .question_{
        flex:1;
        padding: 12px 23px;
        border-right: 1px solid #EDEDED;
        border-bottom: 1px solid #EDEDED;
        .top_info_title{
          width: 32px;
          height: 24px;
          font-size: 16px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 700;
          color: #666666;
          line-height: 24px;
        }
      }
    }
</style>
<style lang="scss">
  .top3{
    top: 1px!important;
  }
  .tabPopover_project_genzong{
    position: relative;
    top: 3px;
    .tip_title{
      cursor: pointer;
      box-sizing: border-box;
      padding: 6px 7px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #606266;
      line-height: 22px;
    }
    .tip_title:hover{
      color: #1890FF
    }
  }
</style>
