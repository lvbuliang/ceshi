<template>
  <div class="Swiper">
    <Swiper ref="todoSwiper" :options="swiperOption" class="swiperTodo">
      <Swiper-slide :class="['swiperTodoItem']" v-for="(item, i) in eletab" :key="'s_' + i">
        <div @click="handleClick(i, $event)" class='top10'>
          <div class='up'>
            <img style='vertical-align: text-top;margin-right:4px' v-if='item.status==5' :src="lcb0" alt="">
            <img style='vertical-align: text-top;margin-right:4px' v-if='item.status==1000' :src="lcb1" alt="">
            <img style='vertical-align: text-top;margin-right:4px' v-if='item.status==2' :src="lcb2" alt="">
            <img style='vertical-align: text-top;margin-right:4px' v-if='!item.status' :src="lcb3" alt="">
            <img style='vertical-align: text-top;margin-right:4px' v-if='item.status==3' :src="lcb4" alt="">
            <!-- {{item.stageCompleteDesc}} -->
            <span :class="['cellClass',active ==i?'clicktitle':'']" v-if='item.stageName.length<8' :title='item.stageName'>
              {{ item.stageName }}
            </span>
            <span :class="['cellClass',active ==i?'clicktitle':'']" v-else :title='item.stageName'>
              {{ item.stageName.substring(0,6)+"..." }}
            </span>
            <el-popover
              placement="top"
              width="200"
              trigger="hover"
              v-if='item.stageCompleteDesc'
            >
              <div class="" >
                  <div>任务完成标识：</div>
                  <div>{{item.stageCompleteDesc}}</div>
              </div>
              <img style='vertical-align: text-top;margin-right:4px'  :src="wenhao" alt="" slot="reference">
            </el-popover>  
          </div>
          <div class='up'> 
            <span v-if='checknobuttun(item) ||active != i'>{{item.dueStartTime.substring(0,10)}}  - {{item.dueEndTime.substring(0,10)}} </span>
            <div class='clickline2' v-if='checknobuttun(item) &&active == i'>
              <img style='' :src="clicklcb" alt="">
            </div>
          </div>
          <div v-if='active == i ' :class="[active == i ? 'activeClass' : '']">
            <div class="lcbclick" style='width:60px' @click='lcbclick(item)' v-if='item.status !=2 &&item.status !=3 &&item.status !=1000 &&checkCodeInArr("M005_004_001")&&projectstatus==1'>
              汇报
            </div>
            <div class="lcbclick" style='width:60px' @click='workView(item)' v-if='item.status ==2 &&checkCodeInArr("M005_004_003")&&projectstatus==1'>
              检查
            </div>
            <div class="lcbclick" style='width:60px' @click='workView(item)' v-if='item.status ==3 &&checkCodeInArr("M005_004_002") &&projectstatus==1'>
              审查
            </div>
            <div class="lcbclick" style='width:83px' @click='see(item)' v-if='item.status ==1000'>
              审查通过
            </div>
            <div class='clickline' v-if='!checknobuttun(item)'>
              <img style='' :src="clicklcb" alt="">
            </div>
            
          </div>
          <span class="line" v-if="eletab.length-1 !=i" ></span>
        </div>
      </Swiper-slide>
      <div class="swiper-button-prev" slot="button-prev" @click="prev" v-if='showButton'>
        <i class="el-icon-arrow-left"></i>
      </div>
      <div class="swiper-button-next" slot="button-next" @click="next" v-if='showButton'>
        <i class="el-icon-arrow-right"></i>
      </div>
    </Swiper>
  </div>
</template>

<script>
import store from "@/store";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import config from "@/settings.js";
import upload from "@/utils/upload";
import lcb0 from "@/assets/process/right/lcb0.svg";
import lcb1 from "@/assets/process/right/lcb1.svg";
import lcb2 from "@/assets/process/right/lcb2.svg";
import lcb3 from "@/assets/process/right/lcb3.svg";
import lcb4 from "@/assets/process/right/lcb4.svg";
import wenhao from "@/assets/process/right/wenhao.svg";
import clicklcb from "@/assets/process/right/clicklcb.svg";

export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  provide() {
    return {
      baseUrl: config.uploadBaseUrl,
      imgBaseUrl: config.imgBaseUrl,
      uploadRequest: upload,
      uploadBaseUrl: config.uploadBaseUrl,
    };
  },
  computed: {
    swiper() {
      return this.$refs.todoSwiper.$swiper;
    },
  },
  props: {
    eletab: {
      type: Array,
      default: function () {
        return [];
      },
    },
    currentStage: {
      type: Number,
    },
    project_Id: {
      type: Number,
    },
    projectstatus: {
      type: Number,
    },
  },
   watch:{
    'eletab': {
        handler(val) {
          if (val) {
            if(val.length>0){
              this.catch_nomaldata(val)
              var widthdata= this.$refs.todoSwiper._vnode.elm.clientWidth
              if(this.eletab &&this.eletab.length){
                this.catch_nomaldata(this.eletab);
              }
              if(widthdata > this.eletab.length* 300){
                this.showButton = false
              }else{
                this.showButton = true
              }
            }
          }
        }
      },
   },
  data() {
    return {
      clicklcb:clicklcb,
      lcb0:lcb0,
      lcb1:lcb1,
      lcb2:lcb2,
      lcb3:lcb3,
      lcb4:lcb4,
      wenhao:wenhao,
      active: 0,
      showButton:false,
      widthdata:0,
      swiperOption: {
        loop: false,
        slidesPerView: "auto", // 每页展示几条数据
        spaceBetween: 0,
        initialSlide: 0,
        freeMode: true,
        navigation: {
          nextEl: ".swiper-button-Next",
          prevEl: ".swiper-button-Prev",
        },
      },
    };
  },
  methods: {
    checknobuttun(item){
      let huibao = item.status !=2 &&item.status !=3 &&item.status !=1000 &&this.checkCodeInArr("M005_004_001") &&this.projectstatus==1
      let shencha = item.status ==2 &&this.checkCodeInArr("M005_004_003")&&this.projectstatus==1
      let jiancha = item.status ==3 &&this.checkCodeInArr("M005_004_002")&&this.projectstatus==1
      let iswancheng = item.status ==1000
      if((huibao || shencha ||jiancha ||iswancheng)){
        return false
      }else{
        return true
      }
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
    prev() {
      this.swiper.slidePrev();
    },
    next() {
      this.swiper.slideNext();
    },
    handleClick(tab) {
      this.active = tab;
      this.$emit('eletabClick',tab)
    },
    changeactive(tab){
      this.active = tab;
    },
    lcbclick(row){
      this.$router.push({
        name: "milestoneEdit",
        query: {
          id: row.id,
          projectId: this.project_Id,
          templateId: row.templateId,
          processId: row.workflowId,
          stageId: row.stageId,
          backName: 'progress',
        },
      });
    },
    workView(row) {
      this.$router.push({
        name: "milestoneReport",
        query: {
          id: row.id,
          projectId: this.project_Id,
          processId: row.workflowId,
          templateId: row.templateId,
          stageId: row.stageId,
          backName: 'progress',
        },
      });
    },
    see(row) {
      this.$router.push({
        name: "milestoneView",
        query: {
          id: row.id,
          projectId: this.project_Id,
          templateId: row.templateId,
          processId: row.processId,
          stageId: row.stageId,
          backName: 'progress',
        },
      });
    },
    catch_nomaldata(list){
      let catch_nomaldata = 0;
      for(var i=0;i<list.length;i++){
        if(list[i].stageId ==this.currentStage){
          catch_nomaldata = i;
          break
        }
      }
      this.active = catch_nomaldata
      this.$emit('eletabClick',this.active)
    },
  },
  created(){
    this.$nextTick(() => {
      var widthdata= this.$refs.todoSwiper._vnode.elm.clientWidth
      if(this.eletab &&this.eletab.length){
        this.catch_nomaldata(this.eletab);
      }
      if(widthdata > this.eletab.length* 300){
        this.showButton = false
      }else{
        this.showButton = true
      }
    });
    
  }
};
</script>

<style lang="scss" scoped>
.Swiper {
  height: 73px;
  background: #fff;
  border: 1px solid #EFEFEF;
  border-bottom: 0;  
  border-radius: 8px 8px 0px 0px;
  
  .swiperTodo {
    border-radius: 8px;
    // margin-top: -4px;
    width: 100%;
    .swiper-container {
      overflow-y: inherit;
    }
    .swiper-button-next:after,
    .swiper-container-rtl .swiper-button-prev:after {
      font-size: 0px;
      color: #999;
    }
    [class^="el-icon-"],
    [class*=" el-icon-"] {
      line-height: 1;
    }
    .swiper-button-prev::after,
    .swiper-container-rtl .swiper-button-next::after {
      content: "";
    }
    .swiper-button-next::after,
    .swiper-container-rtl .swiper-button-prev::after {
      content: "";
    }
    .swiper-button-prev:after,
    .swiper-button-next:after {
      font-size: 16px;
      color: #999 !important;
      margin-top: -5px;
    }
    .swiper-button-prev {
      left: 0 !important;
      border-right: 1px solid #efefef;
    }
    .swiper-button-next,
    .swiper-button-prev {
      font-size: 16px;
      font-weight: bold;
      color: #999 !important;
      width: 88px;
      height: 88px;
      background: #ffffff;
      margin-top: 2px;
      transform: translateY(-58%);
    }
    .swiper-button-next {
      right: 0 !important;
      border-left: 1px solid #efefef;
    }
    &:hover {
      .swiper-button-next,
      .swiper-button-prev {
        display: flex;
      }
    }
  }
  .swiper-container {
    position: relative;
    width: 100%;
    height: 73px;

    .swiperTodoItem {
      height: 73px;
      line-height: 12px;
      padding: 16px;
      padding-top: 5px;
      padding-bottom: 10px;
      flex:1;
      min-width: 200px !important;
      color: #666;
      -moz-user-select: none;
      -o-user-select: none;
      -khtml-user-select: none;
      -webkit-user-select: none;
      -ms-user-select: none;
      user-select: none;
      cursor: pointer;     
      .top10{
        // position: relative;
        // top: -10px;
      } 
      div {
        text-align: left;
        .up{
          // height: 34px;
              text-align: center;
        }
        .lcbclick{
          box-sizing:border-box;
          border-radius: 12px;
          border: 1px solid #1890FF;
          padding:5px 16px;
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #1890FF;
          // line-height: 20px;
          margin: 0 auto;
          width: 58px;
          position: relative;
          top:-4px;
        }
        .clickline{
          position: relative;
          top:-4px;
          // bottom: 8px;
          // left: 10%;
          // height: 4px;
          img{
            margin: 0 auto;
            display: inherit;
            position: relative;
            top: 5px;
          }
        }
        .clickline2{
          text-align: center;
          position:relative;
          top: 6px;
        }
        .activeClass{
           height: 34px;
           position: relative;
        }
        .line {
          border-left: 1px solid #EDEDED;
          height: 32px;
          position: absolute;
          right: 0%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      }
      .cellClass {
        height: 32px;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
        line-height: 32px;
      }
      .clicktitle {
        color: #1890FF;
        font-weight: 700;
      }
      
    }
    .swiper-button-prev,.swiper-button-next{
      display: none;
      height:24px;
      width: 24px;
      border-radius: 20px;
      border:0;
      box-shadow: 0px 2px 6px 0px rgb(0 0 0 / 12%);
    }
    .swiper-button-prev{
      margin-left: 10px;
    }
    .swiper-button-prev{
      margin-right: 10px;
    }
    .swiperTodoItem:first-child{
        margin-left:0px;
      }
    .showleft:first-child{
      margin-left:88px;
    }
    .swiperTodoItemhid:nth-child(1) {
      margin-left: 88px;
    }
    .showleft:nth-last-child(1) {
      margin-right: 88px;
    }
  }
}
.swiper-wrapper:hover .swiper-button-prev{
  display: flex;
}
.swiper-wrapper:hover .swiper-button-next{
  display: flex;
}

</style>
