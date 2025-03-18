<template>
  <!-- 数据看板 -->
  <div class="page-container" :style="{ height: boxHeight + 'px' }">
    <div class="main" v-if="$route.name == 'dataBoard'">
      <!-- 标题 -->
      <div class="top">
        <dv-decoration-5 class="dv-5"></dv-decoration-5>
        <div class="title">项目数据看板</div>
        <div class="time">{{ getNowTime(date) }}</div>
      </div>
      <!-- 内容 -->
      <dv-loading v-if="isLoading">Loading...</dv-loading>
      <div class="content" v-else>
        <div class="top">
          <!-- 进度 -->
          <div class="chart1">
            <dv-decoration-8 class="line-1" />
            <chart1 />
          </div>
          <!-- 数据 -->
          <div class="chart2">
            <div class="m-center">数据概览</div>
            <chart2 />
          </div>
          <!-- 阶段 -->
          <div class="chart3">
            <dv-decoration-8 :reverse="true" class="line-3" />
            <chart3 />
          </div>
        </div>
        <div class="bottom">
          <!-- 承接单位 -->
          <div class="chart4">
            <div class="l-center">承接单位概览</div>
            <chart4 />
          </div>
          <!-- 收支分析 -->
          <div class="chart5">
            <div class="m-center">收支分析</div>
            <div class="chart-flex">
              <div class="chart-item">
                <chart5 />
              </div>
              <div class="chart-item">
                <chart7 />
              </div>
              <div class="chart-item">
                <chart8 />
              </div>
            </div>
          </div>
          <!-- 合同/订单 -->
          <div class="chart6">
            <chart6 />
          </div>
        </div>
      </div>
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<script>
import chart1 from "./components/chart1.vue";
import chart2 from "./components/chart2.vue";
import chart3 from "./components/chart3.vue";
import chart4 from "./components/chart4.vue";
import chart5 from "./components/chart5.vue";
import chart6 from "./components/chart6.vue";
import chart7 from "./components/chart7.vue";
import chart8 from "./components/chart8.vue";
export default {
  components: {
    chart1,
    chart2,
    chart3,
    chart4,
    chart5,
    chart6,
    chart7,
    chart8,
  },
  data() {
    return {
      boxHeight: "",
      date: new Date(),
      timer: null,
      isLoading: false,
    };
  },
  watch: {
    $route: {
      handler(val) {
        this.getWorkflowHeight();
      },
    },
  },
  mounted() {
    //显示当前日期时间
    let _this = this; // 声明一个变量指向Vue实例this，保证作用域一致
    this.timer = setInterval(() => {
      _this.date = new Date(); // 修改数据date
    }, 1000);
    this.$nextTick(() => {
      this.getWorkflowHeight();
    });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.getWorkflowHeight);
    if (this.timer) {
      clearInterval(this.timer); // 在Vue实例销毁前，清除我们的定时器
    }
  },
  methods: {
    getNowTime(time) {
      var vWeek, vWeek_s, year, month, day, hours, minutes, seconds;
      vWeek = [
        "星期天",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
      ];
      var date = new Date(time);
      year = date.getFullYear();
      month =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      day = date.getDate() < 10 ? date.getDate() : date.getDate();
      hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      minutes =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      seconds =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      vWeek_s = date.getDay();
      return (
        year +
        "年" +
        month +
        "月" +
        day +
        "日" +
        "\xa0\xa0\xa0" +
        vWeek[vWeek_s] +
        "\xa0\xa0\xa0" +
        hours +
        ":" +
        minutes +
        ":" +
        seconds
      );
    },
    getWorkflowHeight() {
      let workflowHeight = 0;
      let container = document.querySelector(".workflow");
      if (container) {
        workflowHeight = "";
      }
      workflowHeight += 66;
      this.boxHeight = window.innerHeight - workflowHeight;
    },
  },
};
</script>

<style lang="scss" scoped>
.page-container {
  border-radius: 10px;
  background-color: #f8f8f8;
  background-image: linear-gradient(to bottom, #021a3edf, #0c47a0e6);
  color: #fff;
  .main {
    height: 100%;
    display: flex;
    flex-direction: column;
    .top {
      position: relative;
      height: 80px;
      display: flex;
      align-items: center;
      font-size: 16px;
      .dv-5 {
        width: 100%;
        height: 80px;
      }
      .title {
        position: absolute;
        top: 6px;
        left: 50%;
        font-size: 22px;
        font-weight: bold;
        transform: translateX(-50%);
      }
      .time {
        position: absolute;
        top: 60%;
        right: 5%;
      }
    }
    .content {
      padding: 0 20px;
      flex: 1;
      .top {
        display: flex;
        height: 56%;
        width: 100%;
        .chart1,
        .chart2,
        .chart3 {
          width: 28%;
          height: 100%;
          // background-image: linear-gradient(to bottom, #021a3edf, #0c47a0e6);
        }
        .chart1 {
          margin-right: 2%;
          .line-1 {
            height: 50px;
            width: 100%;
          }
        }
        .chart2 {
          flex: 1;
          position: relative;
          display: flex;
          flex-direction: column;
          .m-center {
            text-align: center;
            font-weight: bold;
            font-size: 22px;
            height: 30px;
          }
        }
        .chart3 {
          margin-left: 2%;
          .line-3 {
            height: 50px;
            width: 100%;
          }
        }
      }
      .bottom {
        display: flex;
        height: 41%;
        width: 100%;
        .chart4,
        .chart5,
        .chart6 {
          width: 28%;
          height: 100%;
          color: #fff;
          // background-image: linear-gradient(to bottom, #021a3edf, #0c47a0e6);
        }
        .chart4 {
          margin-right: 2%;
          .l-center {
            font-weight: bold;
            font-size: 18px;
            padding-left: 10px;
          }
        }
        .chart5 {
          flex: 1;
          .m-center {
            font-weight: bold;
            font-size: 18px;
            padding-left: 10px;
          }
          .chart-flex {
            display: flex;
            .chart-item {
              flex: 1;
            }
          }
        }
        .chart6 {
          width: 20%;
          margin-left: 2%;
        }
      }
    }
  }
}
</style>
