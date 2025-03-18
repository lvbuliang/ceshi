<template>
  <div class="arrowBar">
    <div class="up">
      <i class="el-icon-caret-top" v-if="isUp" @click="up"></i>
      <i class="el-icon-caret-top c" v-else></i>
    </div>
    <div class="hthover">{{hoverTitle}}</div>
    <div class="line"></div>
    <div class="line1"></div>
    <div class="center" :style="{transform:`translateY(${y}px)`}">
      <div>
        <ul>
          <li v-for="(item,i) in stageWorkList" class="hbHover"  @mouseover="mouseOver(item)">
              <el-tooltip class="item" effect="light" :content="item.stageName" placement="top">
                 <span>
                  {{formatTxt(item.stageName,5)}}
                </span>
              </el-tooltip>
            <span>
              <i :class="item.color" :style="{width:item.checkScore+'%'}"></i>
            </span>
          
          </li>
        </ul>
      </div>
    </div>

    <div class="progress">
      <ul>
        <li>0</li>
        <li>25</li>
        <li style="text-indent: 10px;">50</li>
        <li style="text-indent: 20px;">75</li>
        <li style="text-indent: 20px;">100</li>
      </ul>
    </div>

    <div class="down">
      <i class="el-icon-caret-bottom" v-if="isDown"  @click="down"></i>
      <i class="el-icon-caret-bottom c" v-else></i>
    </div>
  </div>
</template>
<script>
import { qualityAssessment } from "@/api/progress";
import { getstage } from "../tongchou"
export default {
  props: {
    projectId:[Number,String]
  },
  data() {
    return {
      stageWorkList:[],
      y: 30,
      fixed:30,
      num: 4,
      isUp: true,
      isDown: true,
      dataNum:0,
      hoverTitle:"",
    };
  },
  watch: {
    y(val) {
      this.y = val;
    },
  },
  methods: {
    queryQualityAssessment(){
      let params = {
           projectId: this.projectId
      }
      qualityAssessment(params).then(res => {

               let data=res.data;
                // 我需要的数据：百分占比，里程碑名称，color:
                data.forEach(item=>{
                  let num=0;
                  if(item.warningScoreMemo){
                    num = getstage(item.checkScore, JSON.parse(item.warningScoreMemo));
                  }
                    let obj={
                        checkScore:item.checkScore,
                        stageName:item.stageName,
                        stageId:item.stageId,
                        color:''
                    };
                    if (num == 0) {
                        obj.color='red'
                    } else if (num == 1) {
                        obj.color='yellow'
                    } else {
                        obj.color='green'
                    }
                    this.stageWorkList.push(obj)


                })

                if (this.stageWorkList.length > 4) {
                this.isUp = true;
                this.isDown = false;
              } else {
                this.isUp = false;
                this.isDown = false;
              }

                this.dataNum=this.stageWorkList.length;

            })
    },
    up() {
      // 中止条件：
    this.isDown=true
    this.y -= 30;
  
    this.y==-(this.fixed*(this.num-3))?this.isUp=false:this.isUp=true;
    this.y==30?this.isDown=false:this.isDown=true;
    
    },
    down() {
      this.y += 30;
      this.y==30?this.isDown=false:this.isDown=true;
      this.y==-(this.fixed*(this.num+1))?this.isUp=false:this.isUp=true;
    },
    formatTxt(txt, maxlength) {
      //格式化表格字段过长
      if (txt) {
        if (txt.length < maxlength) {
          return txt;
        } else {
          return txt.substring(0, maxlength) + "...";
        }
      }
      return "-";
    },

    /**鼠标移入 */
    mouseOver(item){
      console.log(item)
      this.hoverTitle=item.stageName+':'+item.checkScore
    }
  },
  created() {
    this.queryQualityAssessment()

    
  },
};
</script>
<style lang="scss" scoped>
.arrowBar {
  height: 170px;
  overflow: hidden;
  position: relative;
  .hthover{
      position: absolute;
      top:0px;
      font-size: 12px;
      color: #333;
      padding: 5px 10px;
      right: 0px;
      z-index: 999;
      background:rgba(255,255,255,1);
      box-shadow:0px 4px 10px 0px rgba(0,0,0,0.1)
  }
 
  .c {
    color: #ccc;
  }
  .red {
    background: #ff0000;
  }
  .green {
    background: #009900;
  }
  .yellow {
    background: #f7a900;
  }
  .up {
    position: absolute;
    top: 8px;
    z-index: 99;
    width: 100%;
    cursor: pointer;
    background: #fff;
  }
  .center {
    height: 130px;
    width: 248px;
    ul {
      li {
        height: 30px;
        cursor: pointer;
        position: relative;
        line-height: 30px;
        width: 246px;
        border-right: 1px solid #e8e8e8;
        font-size: 12px;
        color: #555;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        span:nth-child(1) {
          display: inline-block;
          width: 70px;
          border-right: 1px solid #e8e8e8;
        }
        span:nth-child(2) {
          display: inline-block;
          height: 10px;
          width: 178px;
          margin-left: -3px;
          i {
            display: inline-block;
            height: 10px;
            margin-left: 2px;
          }
        }
        
      }
    }
   li:hover{
     background: #f6f6f6;
  }
  }
  .down {
    position: absolute;
    cursor: pointer;
    bottom: 0px;
    z-index: 99;
    width: 100%;
    background: #fff;
  }
  .progress {
    position: absolute;
    bottom: 0;
    left: 70px;
    z-index: 100;
    width: 178px;
    border-top: 1px solid #e8e8e8;
    padding-top: 6px;
    font-size: 12px;
    ul {
      display: flex;

      li {
        flex-grow: 1;
        color: #555;
      }
    }
  }
  .line {
    position: absolute;
    top: 30px;
    left: 115px;
    height: 118px;
    width: 44px;
    z-index: 0;
    border-left: 1px dashed #e8e8e8;
    border-right: 1px dashed #e8e8e8;
  }
  .line1 {
    position: absolute;
    top: 30px;
    left: 202px;
    height: 118px;
    width: 44px;
    z-index: 0;
    border-left: 1px dashed #e8e8e8;
  }
}
</style>