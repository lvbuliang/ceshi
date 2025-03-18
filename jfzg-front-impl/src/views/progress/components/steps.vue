<template>
  <!-- <FFieldset title="里程碑完成情况" class="stepsLcbBox" :class="{'stepsLcbBox1': (list.length||0)<=9}"> -->
  <div>
    <template>
      <!-- <div class="topLcb">
        <div class="curText">
          <span v-if="curList.length>0">
            {{curList[0].title}}
            <i
              v-if="curList[0].status==3"
              :class="curList[0].status == '1' ? 'success' : curList[0].status == '2' ? 'yanqisuccess' :'notsuccess'"
            >{{curList[0].status | filtersBtnStatu}}</i>
            <i v-if="curList[0].delayNum" class="exceed">超期{{curList[0].delayNum||0}}天</i>
          </span>
        </div>
        <div class="waitProjess">
          <span>
            {{finshNum}}
            <i>完成</i>
          </span> /
          <span>
            {{watiNum}}
            <i>待完成</i>
          </span>
        </div>
      </div>
      <el-scrollbar style="height:100%">
        <div class="Sr_Steep_Style">
          根据步骤数量判断样式 
          <el-steps :active="Number(active)" align-center :class="{'overFiveSteps':list.length>9}">
            <el-step v-for="(item,index) in list" :key="index">
               头部时间 
              <template slot="title">
                <span>{{item.time||0}}</span>
              </template>
               底部详情 
              <template slot="description" v-if="item.child && item.child.length">
                小于2
                <template v-if="item.child.length <= 2">
                  <template v-for="(child,i) in item.child">
                    <div
                      :key="i + 'description'"
                      class="curDay"
                      v-if=" judgeToday && item.time==curDay && i==0"
                    >今天 {{curDay2}}</div>
                  </template>
                  <div class="statusBox" v-if="isShowStart &&index==0">项目开始</div>
                  <div
                    class="statusBox"
                    :class="child.status!=5?'black':''"
                    v-for="(child,t) in item.child"
                    :key="t"
                  >
                    <div style="color:#333;z-index: 9999;">
                      <span @click="goStateId(child)">{{child.title}}</span>
                    </div>
                    <div
                      v-if="child.status==1||child.status==2||child.status==3"
                      class="box"
                      :class="child.status == '1' ? 'success' : child.status == '2' ? 'yanqisuccess' :'notsuccess'"
                    >{{child.status | filtersBtnStatu }}</div>
                  </div>
                </template>
                超过2的情况
                <template v-else>
                  <template v-for="(child,i) in item.child">
                    <div
                      :key="i+'curDay'"
                      class="curDay"
                      v-if=" judgeToday && item.time==curDay && i==0"
                    >今天 {{curDay2}}</div>
                  </template>
                  <div class="statusBox" v-if="isShowStart && index==0">项目开始</div>
                  <div class="statusBox xx" v-for="(child,j) in item.child.slice(0,2)" :key="j">
                    <div @click="goStateId(child)">{{child.title}}</div>
                    <div
                      class="box"
                      v-if="child.status==1||child.status==2||child.status==3"
                      :class="child.status == '1' ? 'success' : child.status == '2' ? 'yanqisuccess' :'notsuccess'"
                    >{{child.status | filtersBtnStatu}}</div>
                  </div>
                  <div class="more">
                    <el-popover placement="bottom" width="195" trigger="hover">
                      <template>
                        <div
                          style="text-align: center;"
                          class="popoverBox statusBox"
                          v-for="(child,m) in item.child.slice(2,item.child.length)"
                          :key="m"
                        >
                          <div @click="goStateId(child)">{{child.title}}</div>
                          <div
                            class="box"
                            :class="child.status == '1' ? 'success' : child.status == '2' ? 'yanqisuccess' :'notsuccess'"
                            v-if="child.status==1||child.status==2||child.status==3"
                          >{{child.status | filtersBtnStatu}}</div>
                        </div>
                      </template>
                      <el-button slot="reference" type="primary" size="mini" round>更多</el-button>
                    </el-popover>
                  </div>
                </template>
              </template>
             里程碑日期和今天日期重合：今天的日期在里程碑里面 
       
              <template slot="description" v-else>
                <div>今天 {{curDay2}}</div>
              </template>
            </el-step>
          </el-steps>
        </div>
      </el-scrollbar>-->

      <div class="ganttBox">
        <!-- <div class="moreTask" @click="goListTask">
          更多任务
          <i class="el-icon-arrow-right"></i>
        </div>-->
        <gantt :curList="curList" :setbacks="setbacks" :key="isGant"></gantt>
      </div>
    </template>
  </div>
  <!-- </FFieldset> -->
</template>
<script>
/**
 * 暂定1为完成,2为逾期完成,3为逾期
 * isComplete:0：未开始， 1：执行中，2：已完成
 */
import FFieldset from "./FHeader/FFieldset.vue";
import {
  findSame2,
  maxArrNumber,
  curTimeIsExit,
  CompareDate,
} from "./tongchou";
import { getCompareDate } from "@/utils/plan";
import {
  stageCompleteNode,
  getStatusByProjectId,
  getstageList,
} from "@/api/progress";
import gantt from "./gant/gant";
import tabCard from "./tabCard"; //tab切换
import pagination from "./FPagination/pagination";
export default {
  components: { FFieldset, gantt, tabCard, pagination },
  props: {
    isSupervisor: [Boolean],
    queryId: {
      type: [String, Number],
      default: () => {
        return "";
      },
    },
  },

  filters: {
    filtersBtnStatu(value) {
      let val;
      switch (value) {
        case 1:
          val = "完成";
          break;
        case 2:
          val = "逾期完成";
          break;
        case 3:
          val = "逾期";
          break;
        case 4:
          val = "未开始";
          break;
        case 5:
          val = "执行中";
          break;
        default:
          break;
      }
      return val;
    },
  },

  data() {
    return {
      isGant: 0,
      ethticList: [],
      curDay: "", //当前时间
      isShowStart: false,
      startTime: "", //开始时间
      finshNum: 0, //结束
      watiNum: 0, //等待进行
      judgeToday: false, //判断里程碑里面是否包括今天
      list: [],
      tabList: [
        { name: "审核情况", value: "0" },
        { name: "上报情况", value: "1" },
      ],
      active: "0",
      yanQiList: {
        title: "正常", // 进度情况,只要有一个延期，就是延期，延期天数取最大值
        delayNum: 0, //延期天数
        normal: "100", //现有进度
        abnormal: "", //应有进度
      },
      dataList: [],
      dataTitle: "", //里程碑名称
      curList: [], //当前位于的里程碑
      setbacks: "checkSetbacks", //setbacks上报 ，checkSetbacks审核
      stageId: "", //里程碑id
      page: {
        pageNum: 1,
        pageSize: 5,
        pages: 0,
        num: 5,
        total: 5,
      },
      sonprojectId: this.$route.query.id || this.queryId,
    };
  },
  watch: {
    isSupervisor(newVal, oldVal) {
      if (newVal) {
        this.tabList = [
          { name: "审核情况", value: "0" },
          { name: "上报情况", value: "1" },
        ];
      } else {
        this.tabList = [];
      }
    },
    dataList(newVal, oldVal) {
      if (newVal) {
        this.dataList = newVal;
        this.isGant += Math.random();
      }
    },
    stageId(newVal, oldVal) {
      if (newVal) {
        this.isGant += Math.random();
      }
    },
    setbacks(newVal, oldVal) {
      if (newVal) {
        this.isGant += Math.random();
      }
    },
  },
  methods: {
    /**
     * 获取里程碑列表里面最小的时间
     */
    queryProjectInfo(sonprojectId) {
      this.sonprojectId = sonprojectId ? sonprojectId : this.sonprojectId;
      let params = {
        projectId: this.sonprojectId,
      };
      getstageList(params).then((res) => {
        let startDate = [];

        res.data.map((item) => {
          startDate.push(item.dueStartTime);
        });

        this.startTime = getCompareDate(startDate, "min");
        // console.log(typeof this.startTime,'开始时间')
        this.getStageCompleteNode(sonprojectId);
      });
    },

    /**
     * 里程碑节点列表
     */
    getStageCompleteNode(sonprojectId) {
      var sonprojectId = sonprojectId ? sonprojectId : this.sonprojectId;
      stageCompleteNode("", sonprojectId).then((res) => {
        if (res.data) {
          this.ethticList = res.data;
          res.data.map((item) => {
            if (item.isEnd == 2) {
              this.finshNum++;
            }
            if (item.isComplete == 0 || item.isComplete == 1) {
              this.watiNum++;
            }
          });
          this.findSameList(res.data, sonprojectId);
          var list = this.list;
          for (let i = 0; i < list.length; i++) {
            if (list[i].time == this.curDay) {
              if (list[i].child && list[i].child.length > 0) {
                this.stageId = list[i].child[0].stageId;
                console.log("this.stageId", this.stageId);
              }
            }
          }
        }
      });
    },
    findSameList(arr, sonprojectId) {
      // console.log('arr',arr)
      let ds = findSame2(arr, "showTime"); //ds是数组中包含数组
      // console.log('ds',ds)
      let arrList = [];

      let delayNumList = [];

      ds.forEach((item, i) => {
        //数组中的数组
        let child = [];
        let obj = {};

        item.map((items) => {
          let state = "";
          if (items.delayNum > 0) {
            // 获取最大逾期天数
            delayNumList.push(items.delayNum);
          }
          // sDelay：是否逾期 1：逾期，0未逾期
          // isComplete：0：未开始， 1：执行中，2：已完成
          //（1,0）-逾期 （1，1）逾期  （1，2）逾期完成，（0，2）正常 -不显示

          if (
            (items.isDelay == 1 && items.isComplete == 0) ||
            (items.isDelay == 1 && items.isComplete == 1)
          ) {
            //逾期
            state = 3;
          } else if (items.isDelay == 1 && items.isComplete == "2") {
            //逾期完成
            state = 2;
          } else if (items.isComplete == 2) {
            //完成
            state = 1;
          } else if (items.isComplete == 0) {
            //未开始
            state = 4;
          } else if (items.isComplete == 1) {
            //执行中
            state = 5;
          }

          child.push({
            title: items.stageName,
            status: state,
            showTime: items.showTime,
            isEnd: items.isEnd,
            delayNum: items.delayNum,
            stageId: items.stageId,
          });

          //isComplete:0：未开始， 1：执行中，2：已完成

          obj = {
            time: items.showTime,
            child: child,
          };
        });

        // console.log(obj);
        arrList.push(obj);
      });
      //里程碑
      let finishArr = JSON.parse(JSON.stringify(arrList));

      this.yanQiList.delayNum = maxArrNumber(delayNumList) || 0;
      if (this.yanQiList.delayNum > 0) {
        this.yanQiList.title = "逾期";
        this.yanQiList.abnormal = 100;
        this.yanQiList.normal = "";
      } else {
        this.yanQiList.title = "正常";
        this.yanQiList.delayNum = "逾期";
        this.yanQiList.normal = 100;
        this.yanQiList.abnormal = "";
      }
      this.$emit("yuqiList", this.yanQiList);

      //判断在第几步，正在执行中的(isComplete:1)，可能多个然后比较？？？
      this.list = arrList;
      //获取正在进行的里程碑
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].child) {
          this.list[i].child.map((val) => {
            if (val.isEnd == 1) {
              this.curList.push(val);
            }
          });
        }
      }
      this.list.unshift({
        time: this.startTime,
        child: [{ title: "项目开始", type: 1 }],
      });

      //console.log('startTime',this.startTime)

      try {
        /**
         * 判断active应该为多少？
         * 当前日期是否在当前里程碑中：（1）在找到当前数据 （2）不在，push一条当前日期
         * 项目开始时间等于等一个里程碑
         */
        //获得在数组第几个，新增一条记录

        let flg = curTimeIsExit(this.list, this.curDay);
        console.log("flg", flg);
        //当前开始时间
        let obj = {
          time: this.curDay,
          child: [],
        };
        //当前时间等于里程碑
        // （1）等于第一个里程碑：
        // a:项目开始时间等于第一个里程碑，
        // b:项目开始时间不等于第一个里程碑
        // （2）不等于第一个：定点在等于的值

        // 当前时间小于里程碑
        // （1）定点在（目标值）里程碑之前
        // 当前时间大于里程碑
        // （1）定点在（目标值）里程碑之后

        if (flg.type == 0) {
          // 大于
          let arrTiem = [{ time: this.curDay }];
          this.list = this.list.concat(arrTiem);
          if (this.list[0].time == this.list[1].time) {
            //开始时间等于第一个里程碑
            this.list.shift();
            this.isShowStart = true; //第一条数据
            this.active = flg.day - 1;
          } else {
            this.active = flg.day;
          }
        } else if (flg.type == 1) {
          //另一种情况，和其中的某个日期相等且判别项目开始日期和第一个里程碑重合
          this.judgeToday = true;
          if (this.list[0].time == this.list[1].time && flg.day == -1) {
            //并且是当天
            this.list.shift();
            this.isShowStart = true; //第一条数据
            this.active = flg.day + 1;
          } else if (this.list[0].time == this.list[1].time) {
            this.list.shift();
            this.isShowStart = true; //第一条数据
            this.active = flg.day;
          } else {
            this.active = flg.day + 1;
          }
        } else {
          //小于
          if (this.list[0].time == this.list[1].time) {
            this.list.shift();
            this.isShowStart = true; //第一条数据
            this.list.splice(flg.day - 1, 0, obj);
            this.active = flg.day - 1;
          } else {
            this.list.splice(flg.day, 0, obj);
            //console.log(this.list)
            this.active = flg.day;
          }
        }
      } catch (e) {
        console.log(e);
      }

      this.queryStageId(finishArr, sonprojectId);
    },

    // 默认显示当前阶段的，-找出对应的stageId
    // 如果有多个阶段同时进行，显示的里程碑开始时间最早的里程碑的任务
    // 如果当前没有进行的阶段，默认显示离当前时间最近的一个里程碑的任务
    // 如果项目已经结项，默认显示最后一个里程碑的任务
    queryStageId(arrList, sonprojectId) {
      var sonprojectId = sonprojectId ? sonprojectId : "";
      // 判断项目是否结项
      let params = {
        projectId: Number(sonprojectId),
      };
      getStatusByProjectId(params).then((res) => {
        if (res.data) {
          //已经结项;默认显示最后一个里程碑的任务
          let childLength = arrList[arrList.length - 1].child.length - 1;
          this.stageId = arrList[arrList.length - 1].child[childLength].stageId;
        } else {
          //没有结项;(1)是否多个阶段同时进行：显示开始时间最早的里程碑任务
          //console.log('curList',this.curList)
          if (this.curList.length > 0) {
            //有进行的阶段
            this.stageId = this.curList[0].stageId;
          } else {
            //没有进行的的阶段:找出距离当前时间最近的里程碑;判断取前还是取后
            //1：先找到当前日期，剔除没有值的里程碑
            //  console.log('list',this.list)
            this.list.map((item, i) => {
              if (item.time == this.curDay) {
                //  console.log('i',i)
                //如果i==0,今天是第一个或第二个
                if (i == 0 || i == 1) {
                  this.stageId = this.list[i + 1].child[0].stageId;
                } else {
                  //比较时间大小
                  let num = CompareDate(
                    this.list[i - 1].time,
                    this.list[i + 1].time
                  );
                  if (num == 0) {
                    this.stageId = this.list[i - 1].child[0].stageId;
                  } else if (num == 2) {
                    this.stageId = this.list[i + 1].child[0].stageId;
                  }
                }
              }
            });
          }
        }
      });
    },

    //点击里程碑出任务列表
    goStateId(item) {
      this.stageId = item.stageId;
    },
    /**
     * 跳转到项目对应的任务 listTaskL
     */
    goListTask() {
      // console.log('路由',this.$router)
      this.$router.push({
        name: "listTaskL",
        query: {
          projectId: this.sonprojectId,
        },
      });
    },

    /**
     * 切换审核情况和上报情况
     */
    switchTabRisk(data) {
      //0代表审核，1代表上报
      if (data == 0) {
        this.setbacks = "checkSetbacks";
      } else {
        this.setbacks = "setbacks";
      }
    },
  },
  created() {
    if (this.isSupervisor) {
      this.tabList = [
        { name: "审核情况", value: "0" },
        { name: "上报情况", value: "1" },
      ];
    } else {
      this.tabList = [];
    }
    this.queryProjectInfo();

    this.curDay = this.$moment().subtract("days", 0).format("YYYY-MM-DD");
    this.curDay2 = this.$moment().subtract("days", 0).format("MM-DD");
  },
};
</script>

<style  lang="scss">
.stepsLcbBox {
  overflow: scroll;
  .overFiveSteps {
    .el-step.is-center .el-step__head {
      width: 120px;
    }
    .el-step.is-horizontal:last-child {
      max-width: 20% !important;
    }
  }
}
.lcbBox .inner {
  background: #71a8e4;
}
.lcbBox .Sr_Steep_Style .el-step__main .el-step__title {
  width: 120px;
  height: 10px;
}

.black {
  color: #333;
}
.curDay {
  color: #007aff;
  font-size: 12px;
  margin-bottom: 10px;
}
.ganttBox {
  .moreTask {
    text-align: right;
    margin-bottom: 10px;
    margin-top: 20px;
    color: #007aff;
    cursor: pointer;
  }
}
.topLcb {
  display: flex;
  height: 24px;
  line-height: 24px;
  .waitProjess {
    margin-right: 20px;
    font-size: 14px;
    span:nth-of-type(1) {
      font-size: 16px;
    }
    span:nth-of-type(2) {
      color: #999;
      font-size: 16px;
    }
    i {
      display: inline-block;
      padding-left: 5px;
      font-size: 12px;
      font-style: normal;
    }
  }
  .curText {
    flex-grow: 1;
    i {
      font-style: normal;
      padding: 2px 8px;
      border-radius: 8px;
      font-weight: 400;
      font-size: 14px;
    }
    span {
      display: inline-block;
    }

    .exceed {
      background: rgba(245, 34, 45, 0.1);
      border-radius: 8px;
      color: #f5222d;
      margin-left: 6px;
    }
  }
  .tabCardList {
    text-align: center;
  }
  .curText span:nth-of-type(1) {
    color: #666;
    font-size: 16px;
    font-weight: bold;
  }
  .curText span:last-child::after {
    content: "";
    width: 0;
    border-left: 1px solid #fff;
  }
}

.Sr_Steep_Style {
  margin-top: 50px;
  padding-top: 20px;
  .el-steps {
    min-height: 120px;
  }
  .el-step.is-center .el-step__description {
    padding: 0;
  }
  .el-step__head.is-finish .el-step__line {
    background-color: #ff9535;
    .el-step__line-inner {
      background: #71a8e4;
    }
  }
  .el-step__main {
    position: relative;
    .el-step__title {
      position: absolute;
      top: -60px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 12px;
      color: #999999;
    }
    .el-step__title.is-process {
      span {
        width: 0px;
        display: inline-block;
        overflow: hidden;
      }
      &:after {
        content: "";
        position: absolute;
        width: 50px;
        height: 50px;
        left: 35px;
        top: -15px;
        background: url("../assets/addres.png") center center no-repeat;
        background-size: 80%;
        animation: process_animation 1s infinite ease;
      }
      &:before {
        content: "";
        position: absolute;
        width: 28px;
        height: 14px;
        background: #ccc;
        border-radius: 28px/14px;
        top: 14px;
        animation: process_footer_animation 1s infinite ease;
        left: 45px;
      }
    }
  }

  .el-step__icon.is-text {
    background-color: #fff;
    width: 8px;
    height: 8px;
    border-radius: 0;
    position: relative;
    &:after {
      content: "";
      width: 8px;
      height: 8px;
      background: red;
      position: absolute;
      background: #007aff;
    }
    .el-step__icon-inner {
      visibility: hidden;
      overflow: hidden;
      // margin-right: -14px;
      // margin-top: -5px;
    }
  }
  .is-process {
    .el-step__icon.is-text {
      border-radius: 50%;
      background: #ff953552;
      &:after {
        position: relative;
        content: "";
        width: 8px;
        height: 8px;
        top: 0;
        left: 0;
        position: absolute;
        background: #ff9535;
        border-radius: 50%;
      }
    }
    .el-step__icon {
      border: 8px solid #fffefd3b;
    }
  }
  .el-step__head.is-finish {
    .el-step__icon.is-text {
      &:after {
        content: "";

        position: absolute;
        top: -3px;
        left: -4px;
      }
    }
  }
  .is-wait {
    .el-step__icon.is-text {
      background: #ff953552;
      &:after {
        content: "";
        width: 4px;
        height: 4px;
        position: absolute;
        top: -2px;
        left: -2px;
        background: #fff;
      }
    }
    .el-step__icon {
      border: 6px solid #c8dbe9;
    }
  }
  .el-step__line {
    background-color: #c8dbe9;
  }
  .el-step__description {
    margin-top: 1px;
  }
  .el-step__description.is-finish {
    color: #333;
  }
  .el-step__description.is-process {
    color: #007aff;
    font-size: 12px;
  }
  .el-step__description.is-wait {
    color: #999999;
  }
  /**
  * 详情样式
  */
  .el-step__description {
    font-size: 14px;
  }
  @keyframes process_animation {
    0% {
      top: -25px;
    }
    50% {
      top: -35px;
    }
    100% {
      top: -25px;
    }
  }
  @keyframes process_footer_animation {
    0% {
      transform: scale(1, 1);
    }
    50% {
      transform: scale(0.5, 0.5);
    }
    100% {
      transform: scale(1, 1);
    }
  }
}
</style>
<style lang="scss" scoped>
.statusBox {
  margin-bottom: 10px;
  // cursor: pointer;
  font-size: 14px;
  .box {
    font-size: 12px;
    display: inline-block;
    border: 1px solid #ccc;
    padding: 1px 11px;
    margin-top: 3px;
    border-radius: 30px;
    background: #ffb9001f;
  }
}
.more {
  button {
    padding: 4px 11px;
  }
}
.popoverBox {
  margin: 15px;
}

.yanqisuccess {
  color: #ffbe00;
  background: rgba(255, 185, 0, 0.1) !important;
  border: 0 !important;
}
.notsuccess {
  color: #ff9535;
  background: rgba(255, 149, 53, 0.1) !important;
  border: 0 !important;
}
.success {
  color: #009900;
  background: rgba(229, 244, 229, 1) !important;
  border: 0 !important;
}
.not {
  color: #ff0000;
  background: rgba(255, 0, 0, 0.1) !important;
  border: 0 !important;
}
</style>
<style  lang="scss">
.stepsLcbBox {
  -webkit-user-select: none;
  .el-tabs__header .el-tabs__nav .el-tabs__item {
    background: #fff;
  }
  .el-tabs__nav {
    text-align: right;
  }

  .Sr_Steep_Style .el-step__description.is-process {
    color: #333;
  }
  .el-scrollbar__thumb {
    width: 100%;
  }
  .el-scrollbar__wrap {
    margin: 0 !important;
    overflow-x: hidden;
  }
}
.stepsLcbBox1 {
  .el-scrollbar__thumb {
    width: 0;
  }
}
</style>