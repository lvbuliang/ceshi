<template>
  <!-- 集群概览基本信息 -->
  <div class="jqbaseInfo">
    <div class="title">
      <div class="t1">集群基本情况</div>
      <div class="t2">
        <svg-icon icon-class="icon_info" />
        <span>含主项目+子项目的基本概览</span>
      </div>
    </div>
    <div class="content">
      <el-row :gutter="20">
        <!--进度情况-->
        <el-col :span="6">
          <ul class="bg money">
            <li v-if="amountStatistics.totalInvestment||amountStatistics.totalInvestment===0">
              <p class="sub">
                <svg-icon icon-class="xmjhje2" />
                <span style="margin-left:2px">项目计划金额（万元）</span>
              </p>
              <p class="fs26">
                {{culdata(amountStatistics.totalInvestment,'left')}}.
                <span
                  class="fs14"
                >{{culdata(amountStatistics.totalInvestment,'right')}}</span>
              </p>
            </li>
            <li
              style="margin-top:24px"
              v-if="amountStatistics.contractAmount ||amountStatistics.contractAmount===0"
            >
              <p class="sub">
                <svg-icon icon-class="icon_info" />
                <span style="margin-left:4px">项目中标金额（万元）</span>
              </p>
              <p class="fs26">
                {{culdata(amountStatistics.contractAmount,'left')}}.
                <span
                  class="fs14"
                >{{culdata(amountStatistics.contractAmount,'right')}}</span>
              </p>
            </li>
          </ul>
        </el-col>
        <!--风险/问题-->
        <el-col :span="6" v-if="riskQuestion_data.progress">
          <div class="bg">
            <ETitle title="项目进度"></ETitle>
            <ul class="xmjdBox">
              <li>
                <svg-icon icon-class="zcjdxm" />
                <span>正常</span>
                <span>
                  <b>{{riskQuestion_data.progress.normal}}</b>个
                </span>
              </li>
              <li>
                <svg-icon icon-class="yqqfxxm" />
                <span>风险问题</span>
                <span>
                  <b>{{riskQuestion_data.progress.riskAndQues}}</b>个
                </span>
              </li>
              <li>
                <svg-icon icon-class="yqqxm" />
                <span>逾期</span>
                <span>
                  <b>{{riskQuestion_data.progress.abNormal}}</b>个
                </span>
              </li>
            </ul>
          </div>
        </el-col>
        <el-col :span="6" v-if="show_riskQuestion">
          <div class="bg">
            <ETitle title="项目问题/风险"></ETitle>
            <riskQuestion :riskQuestion_data="riskQuestion_data"></riskQuestion>
          </div>
        </el-col>
        <el-col :span="6" v-if="riskQuestion_data.event">
          <div class="bg">
            <ETitle title="汇报情况"></ETitle>
            <ul class="xmjdBox hbqkBox">
              <li>
                <span>
                  <i>汇报次数</i> &le; 10次
                </span>
                <span>
                  <b>{{riskQuestion_data.event.lowCount}}</b>个
                </span>
              </li>
              <li>
                <span>
                  10次 &lt;
                  <i>汇报次数</i> &lt; 50次
                </span>
                <span>
                  <b>{{riskQuestion_data.event.middleCount}}</b>个
                </span>
              </li>
              <li>
                <span>
                  <i>汇报次数</i> &ge; 50次
                </span>
                <span>
                  <b>{{riskQuestion_data.event.highCount}}</b>个
                </span>
              </li>
            </ul>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import ETitle from "../Echarts/Etitle"; //头部样式
import riskQuestion from "./riskQuestion";
import { getALLinfo } from "@/api/progress";
export default {
  components: { ETitle, riskQuestion },
  data() {
    return {
      amountStatistics: {},
      riskQuestion_data: {},
      show_riskQuestion: false,
    };
  },
  methods: {
    // 金额处理
    culdata(data, str) {
      if (str == "left") {
        var bigdata = "0";
        if (data && data >= 0) {
          return this.every3cut(data.toString().split(".")[0]);
        } else {
          return bigdata;
        }
      } else if (str == "right") {
        var smalldata = "0000";
        return data.toString().split(".")[1]
          ? this.fix4(data.toString().split(".")[1])
          : smalldata;
      }
    },
    // 每三位增加，切割
    every3cut(str) {
      str = str.toString();
      str = str.split(".")[0];
      var newStr = new Array(str.length + parseInt(str.length / 3));
      var strArray = str.split("");
      newStr[newStr.length - 1] = strArray[strArray.length - 1];
      var currentIndex = strArray.length - 1;
      for (var i = newStr.length - 1; i >= 0; i--) {
        if ((newStr.length - i) % 4 == 0) {
          if (i == 0) {
            newStr[i] = strArray[currentIndex--];
          } else {
            newStr[i] = ",";
          }
        } else {
          newStr[i] = strArray[currentIndex--];
        }
      }
      return newStr.join("");
    },
    //超过4位补足
    fix4(str) {
      if (str.length < 4) {
        var length = str.length;
        for (var i = 0; i < 4 - length; i++) {
          str += "0";
        }
      }
      return str;
    },
    getALLinfo() {
      getALLinfo({ projectId: this.$route.query.id }).then((res) => {
        this.show_riskQuestion = true;
        this.riskQuestion_data = res.data;
        var zerodata = {
          contractAmount: 0, //中标金额
          totalInvestment: 0, //计划金额
        };
        this.amountStatistics = this.riskQuestion_data.amountStatistics
          ? this.riskQuestion_data.amountStatistics
          : zerodata;
      });
    },
  },
  created() {
    this.getALLinfo();
  },
};
</script>

<style lang="scss" scoped>
.jqbaseInfo {
  margin: 60px 0;
  .grey {
    color: #666;
  }

  .fs26 {
    font-size: 26px;
  }
  .fs14 {
    font-size: 14px;
  }
  .title {
    margin-bottom: 20px;
    display: flex;
    .t1 {
      font-size: 18px;
      font-weight: bold;
      margin-right: 16px;
    }
    .t2 {
      color: #666666;
      span {
        margin-left: 2px;
        vertical-align: text-bottom;
      }
    }
  }
  .content {
    .bg {
      border-radius: 4px;
      padding: 20px;
      border: 1px solid #c8dbe9;
    }
    .money {
      .sub {
        color: #666;
      }
      .fs26 {
        font-size: 26px;
        margin-top: 12px;
        span {
          font-size: 14px;
        }
      }
    }
  }

  /**项目进度 */
  .xmjdBox {
    li {
      margin-top: 26px;
      display: flex;
    }
    li span:nth-of-type(1) {
      display: inline-block;
      flex-grow: 1;
      margin-left: 4px;
    }
  }
  /**汇报次数 */
  .hbqkBox {
    i {
      font-style: normal;
      color: #007aff;
    }
  }
}
</style>

