<template>
     <div class='' style='height: calc(100% - 44px);padding-bottom:12px'>
       <div class='echart_daa' v-show='!showmore'>
        <echart5 class='echart_class' ref="chart_line_one5"/> 
        <div class='echart_class'>
           <div class='show_echart'>
          <div class="wave-echart" id='waveEchart' ref='waveEchart' :style="{width: '100px', height: '100px'}"></div>
        </div>
        <div class="jfwqkRight">
              <div> 
                  <span>已提交</span>
                  <span>{{ jfwList.submitted }}</span>
              </div>
              <div> 
                  <span>需提交</span>
                  <span>{{ jfwList.shouldSubmit }}</span>
              </div> 
            </div>
        </div>
       
      </div>
      <div class='upup' :class="[!showmore?'upup':'upup2']" @mouseover="mouseOver" @mouseleave="mouseLeave">
        <div class='uppng'  v-if='riskhover' >
              <img v-if='showmore' :src="down" alt="" @click='hidemore'>
              <img v-else :src="up" alt="" @click='hidemore'>
            </div>
        <div :class="['overhover',riskhover?'hovershadow':'']"  @mouseover="mouseOver" @mouseleave="mouseLeave" :style="{'max-height':showmore?'max-height: calc(100%);':'max-height: calc(100% - 85px);'}">
        <div class='maxheight90' :style="{'max-height':showmore?'max-height: calc(100%);':'max-height: calc(100% - 85px);'}">
          
          <div v-if='jfwdata&&jfwdata.length>0'>
            <div v-for="(item, i) in jfwdata" :key="'s_' + i" :class="['jfwlsit', active == i ? 'click' : '', item.status]"> 
                <div class='projectInfo '>
                  <div v-if='projectstatus==1'>
                    <div class="element1">
                      <div class="child1"></div>
                  </div>
                    <span :class="['title',active == i ? 'title_click' : '']">{{item.name}}</span>
                    <div
                      class="upload-type"
                      @click.stop="clickStop"
                      v-if='checkCodeInArr("M005_003_002_003")'
                    >
                    <SrBigUploadDeliver
                      ref="srUpload"
                      @fileUpload="fileUpload"
                      @uploadSuccess="
                        (data) => {
                          BigFileUploadSuccess(data, item);
                        }
                      "
                    ></SrBigUploadDeliver>
                  </div>
                  </div>
                  <div v-if='item.deliveryFiles &&item.deliveryFiles.length>0'>
                    <div v-for="(item2, y) in item.deliveryFiles" :key="'s_' + y" class='wenjianList'>
                      <span >
                        <img class='circle' :src="checkleixing(item2)" alt="">
                        <span class='see_title'>{{item2.fileContext?JSON.parse(item2.fileContext).name:'-'}}</span>
                      </span>
                      <span class='buttun_png'>
                        <img class='deleted' :src="deleted" alt="" @click='delete_jfw(item2)' v-if='item2.operations&&item2.operations.isShowDelete &&projectstatus==1'>
                        <img class='download' :src="download" alt="" @click='download_jfw(item2)'>
                        <img class='flip' v-if='item2.operations&&item2.operations.isShow' :src="flip" alt="" @click='see(item2)'>
                        <span class='buttun' v-if='item2.operations&&item2.operations.isShowCheck &&projectstatus==1' @click='jfw_shenhe(item2)'>{{getstatus(item2.status)}}</span>
                      </span>
                    </div>
                  </div>
                  <div v-else class='nonowenjian'>暂无数据</div>
                </div>
                <div class='processing'>
                  <div class='processing_content'>

                </div>
                </div>
              </div>
          </div>
          <div v-else >
              <nodata title='暂无交付物' height='auto' :projectstatus='projectstatus' ></nodata>                
          </div>
      </div>
     </div>
      </div>
      
     </div>
</template>

<script>
import SrBigUploadDeliver from "./SrBigUpload";
import nodata from "../children/nodata.vue";
import echartsLiquidfill from 'echarts-liquidfill'
import config from "@/settings.js";
import wenjian0 from "@/assets/process/right/jfw/wenjian0.svg";
import wenjian1 from "@/assets/process/right/jfw/wenjian1.svg";
import wenjian2 from "@/assets/process/right/jfw/wenjian2.svg";
import wenjian3 from "@/assets/process/right/jfw/wenjian3.svg";
import wenjian4 from "@/assets/process/right/jfw/wenjian4.svg";
import wenjian5 from "@/assets/process/right/jfw/wenjian5.svg";

import upload_png from "@/assets/process/right/upload.png";
import deleted from "@/assets/process/right/deleted.png";
import shangchuan from "@/assets/process/right/shangchuan.png";
import download from "@/assets/process/right/download.png";
import flip from "@/assets/process/right/flip.png";
import noproject from "@/assets/process/right/noproject.png";
import echart5 from '../children/echart5.vue';
import Charts from "../components/SR-Charts/Charts.vue";
import { delivery} from "@/api/progress";
import chartConfig5 from "../components/SR-Charts/config1.js";
import {
  uploadDeliverFile,
  deleteDeliverFile,
  deleteDeliver,
  approveDeliverFile,
} from "@/api/deliver/index";
import upload from "@/utils/upload";
import up from "@/assets/process/right/up.svg";
import down from "@/assets/process/right/down.svg";
import echarts from 'echarts'
export default {

  //组件注册
  components: {
    echart5,
    Charts,
    SrBigUploadDeliver,
    nodata
  },
  provide() {
    return {
      baseUrl: config.uploadBaseUrl,
      imgBaseUrl: config.imgBaseUrl,
      uploadRequest: upload,
      uploadBaseUrl: config.uploadBaseUrl,
    };
  },
  props: {
    jfwdata: {
      type: Array,
      default: function () {
        return [];
      },
    },
    echart_data_jfw: {
      type: Object,
    },
    project_Id: {
      type: Number,
    },
    projectstatus: {
      type: Number,
    },
  },
  watch:{
      'echart_data_jfw': {
        handler(val) {
          if (val) {
            this.$refs.chart_line_one5.initChart(val)
            this.getJFW(val.groupsPercent)
            this.wave(Number(val.groupsPercent.percent.split('%')[0])/100);
          }
        }
      },
      'project_Id': {
        handler(val) {
          if (val) { 
          }
        }
      },
    },
  data() {
    return {
      riskhover1:true,
      showmore:false,
      riskhover:false,
      up:up,
      down:down,
      flag:false,
      deleted:deleted,
      download:download,
      flip:flip,
      shangchuan:shangchuan,
      upload_png:upload_png,
      wenjian0:wenjian0,
      wenjian1:wenjian1,
      wenjian2:wenjian2,
      wenjian3:wenjian3,
      wenjian4:wenjian4,
      wenjian5:wenjian5,
      noproject:noproject,
      active:0,
      chartConfig5,
      right:43,
      jfwList:{},
      deliveryId:null,
    };
  },
  methods: {
    wave(val){
       // 1. 实例化对象
  let myChart = echarts.init(document.getElementById('waveEchart'));
        // 2.指定配置
      var option = {
            // x轴
            xAxis: {
                show: false, // 不显示
            },
            // y轴
            yAxis: {
                show: false, // 不显示
            },
            grid: {
                x: 1110, //距离左边
						 x2: 0, //距离右边
						 y:0, //距离上边
						 y2:0,//距离下边

            },
            series: [{
                type: 'liquidFill',
                radius: '69%', // 半径大小
                center: ['35%', '35%'], // 布局位置
                data: [{
                    value: val,
                    direction: 'left',
                    itemStyle: {
                      normal: {
                        color: '#27C0FF',
                      }
                    }
                  }],
                  backgroundStyle: {
                      color: '#fff', //背景颜色
                  },
                  itemStyle: {
                    opacity: 0.9, // 波浪的透明度
                    shadowBlur: 0 // 波浪的阴影范围
                  },
                label: {
                    normal: {
                        color: '#333333',
                        textStyle: {
                            fontSize: 16
                        },
                        formatter: (params) => { //console.log(params)
                            let newValue = params.value * 100;
                            return newValue.toFixed(2)  +'%'
                        }
                    }
                },
                outline: { // 轮廓设置
                    show: true,
                    borderDistance: 0, // 轮廓间距
                    itemStyle: {
                        // borderColor: '#294D99', // 轮廓颜色
                        borderColor: '#28C1FF', // 轮廓颜色
                        borderWidth: 2, // 轮廓大小
                        shadowBlur: 'none', // 轮廓阴影
                    }
                },
            }
          ]
        };

      // 3. 把配置给实例对象
      myChart.setOption(option);

      // 4. 让图表跟随屏幕自动的去适应
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    hidemore(){
      this.showmore = !this.showmore
    },
    mouseOver(){
      this.riskhover = true
    },
    mouseLeave(){
      this.riskhover = false
    },
    // 审核附件
    jfw_shenhe(row) {
      this.$emit("approve", row);
    },
    // 查看
    see(row) {
      this.$emit("see", row);
    },
    //判断是否是建设无监理
    isJianli(projectId) {
      api_isJianli({ projectId: projectId })
        .then((res) => {
          // console.log('api_isJianli', res);
          if (res.msg && res.msg.code == "0000") {
            if (res.data && res.data == "2") {
              this.flag = true;
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getstatus(data){
      if(data ==1){
        return "审核"
      }else{
        return "查看审核"
      }
    },
    clickStop() {},
    // 上传成功
    BigFileUploadSuccess(fileList, item) {
      this.deliveryId = item.id;
    },
    // 附件上传
    fileUpload(fileData) {
      let data = {
        deliveryId: this.deliveryId,
        fileContext: JSON.stringify(fileData),
        isSeal: 0,
      };
      uploadDeliverFile(data).then((res) => {
        if (res.msg.code == "0000") {
          this.$message({
            type: "success",
            message: "上传成功!",
          });
          this.$emit("changejfwdata");
        }
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
    checkleixing(item2){
      var name = JSON.parse(item2.fileContext).name
      var leixing = name.split(".")[name.split(".").length-1]
      if(leixing =="pdf"){
        return wenjian1
      }else if(leixing =="xlsx"){
        return wenjian0
      }else if(leixing =="docx"){
        return wenjian5
      }else if(leixing =="png" ||leixing =="svg"){
        return wenjian2
      }else if(leixing =="ppt"){
        return wenjian3
      }else{
        return wenjian4
      }

      xlsx
    },
    // 查看附件
    seeFile(row) {
      if (
        [
          "zip",
          "rar",
          "xls",
          "xlsx",
          "doc",
          "docx",
          "txt",
          "html",
          "pdf",
        ].includes(JSON.parse(row.fileContext).name.split(".").pop())
      ) {
        window.open(`${config.baseUrl}/viewPdf?id=${row.fileId}`);
      } else {
        window.open(
          `${config.baseUrl}/jfzg/file/api/file/download?key=${row.fileId}`
        );
      }
    },
    download_jfw(row){
      let id = JSON.parse(row.fileContext).id
      let token = sessionStorage.getItem("token");
      this.exportFile(
        `${config.baseUrl}/jfzg/file/api/file/download?key=${id}&access_token=${token}`
      );
    },
    //无闪烁跳转
    exportFile(url) {
      let a = document.createElement("a");
      a.href = url;
      a.click();
    },
    // 删除
    delete_jfw(row) {
      var fileId = row.id
      this.$SrUtils.showConfirmMessage.call(this, {
        title: "提示",
        content: "此操作将删除此交付物文件, 是否继续?",
        okFun: () => {
          deleteDeliverFile({ id: fileId }).then((res) => {
            if (res.msg.code == "0000") {
              this.$message({
                type: "success",
                message: "删除成功",
              });
              this.$emit("changejfwdata");
            }
          });
        },
        cancelFun: () => {},
      });
    },
    getJFW(groupsPercent){
      this.jfwList = { 'submitted': groupsPercent.deliveryFileCount, 'person':groupsPercent.percent,'shouldSubmit': groupsPercent.deliveryCount }
      this.$set(chartConfig5.series[0], 'data', [{
          value: groupsPercent.deliveryFileCount,
          name: groupsPercent.deliveryCount / groupsPercent.deliveryFileCount
      }, {
          value: groupsPercent.deliveryCount,
          name: groupsPercent.deliveryFileCount / groupsPercent.deliveryCount
      },
      ])
    },
  },
  mounted() {
    // this.wave();
    // this.getJFW(this.project_Id)
    // this.isJianli(this.project_Id)  //?jfw没用这个判断？暂时不用
  },
};
</script>

<style lang="scss" scoped>
.echart_daa{
    height:85px;
    width:100%;
    display: flex;
    .show_echart{
        position: relative;
        top: 5px;
        left: -10px;   
    }
    .echart_class{
      width:50%!important;
      display: flex;
      justify-content: center;
    }
    #waveEchart{
      flex:1;
      width:100px!important
    }
  }
  .yinying{
    box-shadow: 0px -8px 16px 0px rgba(0, 0, 0, 0.08);
  }
  .upup{
    position: relative;
    top: -40px;
    margin-top: 20px;
    height: calc(100% - 53px);
  }
  .upup2{
    position: relative;
    top: -30px;
    margin-top: 20px;
    height: calc(100% - -22px);
  }
  .maxheight90{
    max-height: calc(100% - 85px);
    width: 100%;
    // overflow-y: scroll;
    padding-top: 12px;
    padding-bottom: 12px;
    position: relative;
  }
  .hovershadow{
        box-shadow: 0px -8px 16px 0px rgba(0, 0, 0, 0.08);
  }
 .uppng{
      position: absolute;
      top: 5px;
      display: flex;
      width: 100%;
      justify-content: center;
      cursor: pointer;
      z-index:333
    }
  .overhover{
    position: relative;
    top: 21px;
    margin-top: -3px;
    max-height: calc(100% - 21px);
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .overhover::-webkit-scrollbar {/*滚动条整体样式*/
        width: 6px;     /*高宽分别对应横竖滚动条的尺寸*/
        height: 1px;
    }
  .overhover::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
        border-radius: 10px;
         -webkit-box-shadow: inset 0 0 5px #D8D8D8;
        background: #D8D8D8;
    }
.overhover::-webkit-scrollbar-track {/*滚动条里面轨道*/
        // -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        // border-radius: 10px;
        background: #FAFAFA;
    }
  .jfwlsit{
    min-width: 259px;
    min-height: 68px;
    background: #FAFAFA;
    border-radius: 8px;
    margin: 16px;
    margin-bottom: 8px;
    margin-top: 8px;
    .projectInfo{
      position: relative;
      padding: 8px 12px 8px 12px;
      .element1{
          float: left;
          position: relative;
          top: 8px;
          height: 8px;
          width: 8px;
          display: flex;
          border-radius: 50%;
          background-color: #1890FF;
          align-items: center;
          justify-content: center;
        }
        .child1{
            height: 6px;
            width: 6px;
            border-radius: 50%;
            position: relative;
            background-color: #fff;
        }
      .title{
        height: 24px;
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 700;
        color: #333333;
        line-height: 24px;
        margin-left: 7px;
      }
      img{
        height: 16px;
        width:16px;
        vertical-align: top;
        position: relative;
        top: 3px;
      }
      
      .stutas_button{
        padding: 1px 8px;
        margin-left: 8px;
        width: 58px;  
        height: 24px;
        background: #E6F7FF;
        border-radius: 8px;
        width: 42px;
        height: 22px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #1890FF;
        line-height: 22px;
      }
    }
  }
  .jfwlsit:first-child{
    margin-top: 0px;
  }
  .jfwlsit:last-child{
    margin-bottom: 0px;
  }
  .nonowenjian{
    text-align: center;
    color: #999999;
  }
  .wenjianList{
    min-width: 235px;
    height: 22px;
    border-radius: 8px;
    margin-top: 6px;
    display: flex;
    justify-content:space-between;
    .see_title{
      max-width: 270px;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    }
    .circle{
      vertical-align: middle;
      margin-right: 4px;
    }
    .buttun_png{
      img{
        cursor: pointer;
        margin-left: 16px;
        height: 16px;
        width: 16px;
      }
    }
    .buttun{
      cursor: pointer;
      line-height: 19px;
      background: #FFFFFF;
      border-radius: 12px;
      border: 1px solid #E5E5E5;
      padding: 2px 16px;  
      position: relative;
      top: -3px;
      margin-left: 16px;
    }
  }
  .jfwqkRight{
      position: relative;
      top: 25px;
          height: 50px;
          font-size: 12px;
      color: #999999;
  }
  .nowenjian{
      text-align: center;
      display:flex;
      position: relative;
      width: 100%;
      height: 90px;
      border-radius: 8px;
      margin-top: 16px;
      .up_title{
        cursor: pointer;
      }
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
</style>
