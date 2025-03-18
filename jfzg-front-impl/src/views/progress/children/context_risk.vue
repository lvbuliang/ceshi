<template>
     <div style='position:relative'>
       <div class='projectInfo' @mouseover="mouseOver" @mouseleave="mouseLeave">
        <div @click='fengxian_route(itemdata)' class='cursor'>
          <span class='number'>{{numberi+1}}</span>
          <img v-if='itemdata.priorityLevel==10 ||itemdata.riskLevel==3' class='color' :src="red" alt="">
          <img v-if='itemdata.priorityLevel==20 ||itemdata.riskLevel==1' class='color' :src="blue" alt="">
          <img v-if='itemdata.priorityLevel==30 ||itemdata.riskLevel==2' class='color' :src="yellow" alt="">
          <span :class="['title',active == numberi ? 'title_click' : '']">{{itemdata.taskName ||itemdata.riskName}}</span>
        </div>

      </div>
      <div :class="['backcolor', active == numberi ? 'green' : 'blue', itemdata.status]" :style="{width:itemdata.taskProgress+'%'}"></div>
     </div>
</template>

<script>
import dian from "@/assets/process/dian.png";
import yellow from "@/assets/process/right/yellow.png";
import blue from "@/assets/process/right/blue.png";
import red from "@/assets/process/right/red.png";
export default {

  //组件注册
  components: {

  },
  props: {
    processType: {
      type: Number,
    },
    itemdata: {
      type: Object,
      default: function () {
        return {};
      },
    },
    numberi: {
      type: Number,
      default: function () {
        return 0;
      },
    },
    form: {
      type: String,
    },
    active: {
      type: Number,
      default: function () {
        return 0;
      },
    },
  },
  data() {
    return {
      yellow:yellow,
      dian:dian,
      blue:blue,
      red:red,
      dialogVisible:false,
    }
  },
  methods: {
    fengxian_route(row){
      if(this.processType ==1){
          this.$router.push({
          name: "everydayriskView",
          query: {
            id: row.id,
            projectId: row.projectId,
            // templateId: val.templateId,
            // processId: val.processId,
            backName: 'progress',
          },
        });
      }else{
        this.$router.push({
        name: "everydaytroubleView",
        query: {
          id: row.id,
          projectId: row.projectId,
          // templateId: val.templateId,
          // processId: val.processId,
          backName: 'progress',
        },
      });
      }
      
    },
    mouseOver(i){
      this.dialogVisible = true
    },
    mouseLeave(i){
      this.dialogVisible = false
    },
  },
  mounted() {
  },
};
</script>

<style lang="scss" scoped>
  .green{
      background: linear-gradient(270deg, #EFFFE7 0%, #FFFFFF 100%);
    }
    .grey{ 
      background: linear-gradient(270deg, #F0F0F0 0%, #FFFFFF 100%);
    }
    .blue{ 
      background: linear-gradient(270deg, #E6F7FF 0%, #FFFFFF 100%);
    }
    .backcolor{
      cursor: pointer;
      height: 100%;
      border-radius: 8px;
      margin-bottom: 8px;
      display: flex;
      cursor: pointer;
      position: absolute;
      z-index: 11;
      top:0
    }
        
        .projectInfo{
          cursor: pointer;
          position: relative;
          padding: 5px 8px;
          box-sizing: border-box;
          height: 32px;
          min-width: 417px;
          display: flex;
          flex-direction: column-reverse;
          z-index: 33;
          .cursor{
            cursor: pointer;
          }
          .time_out{
            position: absolute;
            top: -12px;
            left: 12px;
            .dian{
              width:2px;
              height: 8px;
            }
          }
          .time_out2{
            position: absolute;
            top: -12px;
            right: 42px;
            .dian{
              width:2px;
              height: 8px;
            }
          }
          .color{
            height: 14px;
            width:14px;
            margin-left: 14px;
            vertical-align: middle;
            margin-top: -2px;
          }
          .title{
            height: 24px;
            font-size: 14px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 700;
            color: #333333;
            line-height: 24px;
            margin-left: 4px;
            margin-top: 10px;
            width: 77%;
            display: inline-block;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
            position: relative;
            top: 7px;
          }
          .number{
            height: 22px;
            font-size: 14px;
            font-family: DINAlternate-Bold, DINAlternate;
            font-weight: bold;
            color: #333333;
            line-height: 22px;
          }

    }
</style>
