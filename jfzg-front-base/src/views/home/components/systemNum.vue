<template>
  <!-- 项目数量 -->
  <div class="allMiddle">
    <div class="middle">
      <div class="middle_left middle_left-gradient">
        <div class="selects">
          <el-select
            size="mini"
            class="total-select"
            v-model="source"
            clearable
            placeholder="项目来源"
          >
            <el-option
              v-for="item in sourceoOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-select
            size="mini"
            class="total-select"
            v-model="time"
            clearable
            placeholder="年度计划"
            @change="timeChange"
          >
            <el-option
              v-for="item in timeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="bottom-box">
          <div class="middle_left_left">
            <div class="num">{{ systemNum }}</div>
            <div class="middle_left_left_text">系统数量</div>
          </div>
          <div class="middle_left_right">
            <div class="middle_left_right_boxTop">
              <div class="box">
                <div class="text">项目数</div>
                <div class="num">{{ projectNum }}</div>
              </div>
              <!-- <div class="box">
              <div class="text">已启动数</div>
              <div class="num">{{ researchApplicationNUm }}</div>
              <div class="num">-</div>
            </div> -->
              <div class="box">
                <div class="text">完成立项</div>
                <div class="num">
                  {{ optionPhaseNum }}
                </div>
                <!-- <div class="num">-</div> -->
              </div>
              <div class="box">
                <div class="text">完成采购</div>
                <div class="num">
                  {{ implIngNum }}
                </div>
                <!-- <div class="num">-</div> -->
              </div>
              <div class="box">
                <div class="text">完成预研申请</div>
                <div class="num">{{ researchApplicationNUm }}</div>
                <!-- <div class="num">-</div> -->
              </div>
            </div>
            <div class="middle_left_right_boxBottom">
              <div class="box">
                <div class="text">完成交底</div>
                <div class="num">{{ projectApprovalNum }}</div>
                <!-- <div class="num">-</div> -->
              </div>
              <div class="box">
                <div class="text">完成初验</div>
                <div class="num">{{ trialRunNum }}</div>
                <!-- <div class="num">-</div> -->
              </div>
              <div class="box">
                <div class="text">完成终验</div>
                <div class="num">{{ onlineNum }}</div>
                <!-- <div class="num">-</div> -->
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="middle_que middle_que-gradient">
        <div class="middle_que_top">
          <img src="@/assets/images/home/filled.png" alt="" class="image" />
          <span>问题</span>
        </div>
        <div class="middle_que_bottom">
          <div class="box">
            <div>已解决</div>
            <el-tooltip
              class="item"
              effect="dark"
              content="问题 已解决"
              placement="top"
            >
              <div @click="goRisk('0', '0')" class="num1">
                {{ MajorProblem.resolved }}
              </div>
            </el-tooltip>
          </div>

          <div class="box">
            <div>未解决</div>
            <el-tooltip
              class="item"
              effect="dark"
              content="问题 未解决"
              placement="top"
            >
              <div @click="goRisk('1', '0')" class="num2">
                {{ MajorProblem.unsolved }}
              </div>
            </el-tooltip>
          </div>
        </div>
      </div>
      <div class="middle_risk middle_risk-gradient">
        <div class="middle_que_top">
          <!-- <img src="@/assets/images/home/filled.png" alt="" class="image" />
          <span>风险</span> -->
          <img src="@/assets/images/notice2.png" alt="" class="image" />
          <span>通知</span>
        </div>
        <!-- 工作台新页面 -->
        <div class="list">
          <div v-for="item in noticeData" :key="item.id" class="list-view">
            <el-tooltip
              class="item-tip"
              effect="dark"
              :content="item.title"
              placement="bottom"
            >
              <div class="list-item" @click="onClick(item)">
                <span>{{ item.title || "--" }}</span>
              </div>
            </el-tooltip>
          </div>
        </div>
        <!-- <div class="middle_que_bottom">
          <div class="box">
            <div>已解决</div>
            <el-tooltip
              class="item"
              effect="dark"
              content="风险 已解决"
              placement="top"
            >
              <div @click="goRisk('0', '1')" class="num1">
                {{ MajorDanger.resolved }}
              </div>
            </el-tooltip>
          </div>

          <div class="box">
            <div>未解决</div>
            <el-tooltip
              class="item"
              effect="dark"
              content="风险 未解决"
              placement="top"
            >
              <div @click="goRisk('1', '1')" class="num2">
                {{ MajorDanger.unsolved }}
              </div>
            </el-tooltip>
          </div>
        </div> -->
      </div>
    </div>
    <PulidDialog ref="pulidDiaLog" @callback="callbackFunc" />
  </div>
</template>

<script>
import store from "@/store";
import { routerGo } from "@/utils/utils.js"; // 引入跨应用路由跳转
import { getStatement, getDangerInfo } from "@/api/planProject";
import { api_getNotice } from "@/api/home";
import PulidDialog from "./dialog/pulidDialog.vue";

export default {
  name: "workBench",
  components: {
    PulidDialog,
  },
  data() {
    return {
      noticeData: [], //播报数据
      // 项目信息报表
      systemNum: "",
      projectNum: "",
      researchApplicationNUm: "",
      optionPhaseNum: "",
      projectApprovalNum: "",
      implIngNum: "",
      trialRunNum: "",
      onlineNum: "",
      isConcern: 0,
      selectType: 0,
      year: "",
      btnname: "关注",

      // 全部项目  跟关注的项目
      titleVal: 0,
      // 重大问题
      MajorProblem: {
        resolved: null, // 已解决
        unsolved: null, // 未解决
      },
      // 重大风险
      MajorDanger: {
        resolved: null, // 已解决
        unsolved: null, // 未解决
      },
      timeOptions: [
        { label: "2024年度", value: "2024" },
        { label: "2025年度", value: "2025" },
      ],
      sourceoOptions: [{ label: "统建类", value: 0 }],
      source: 0,
      time: "2024",
    };
  },
  computed: {
    userInfo() {
      return JSON.parse(sessionStorage.getItem("userInfo"));
    },
  },
  methods: {
    onClick(item) {
      console.log(item, "ahhahaha");
      let row = {
        id: item.id,
      };
      this.$refs.pulidDiaLog.open("预览", row);
      // 获取点击的标题
      // let realUrl = `/subdecl/#/knowLedge?id=${item.id}`;
      // // routerGo(realUrl);
      // sessionStorage.setItem("htmlData",'知识库');
      // this.$router.push({
      //   path: realUrl,
      // });
    },
    //   onClick(item) {
    //   console.log(item, 'ahhahaha');

    //   // 获取点击的标题
    //   const targetUrl = '/subdecl/#/knowLedge'; // 目标路由的路径
    //   const id = item.id; // 获取点击项的 id 参数

    //   // 使用 this.$router.push 跳转并携带 id 参数
    //   this.$router.push({
    //     path: targetUrl,
    //     query: { id } // 将 id 参数传递到查询字符串中
    //   });
    // },
    getNotice() {
      api_getNotice().then((res) => {
        console.log(res, "最新公告");
        if (res.msg.code == "0000") {
          let newArr = [];

          if (res.data && res.data.length > 0) {
            res.data.forEach((item) => {
              if (item.type == "0") {
                console.log(item);
                console.log(
                  item.notificationTypeName,
                  "item.notificationTypeName"
                );
                newArr.push({
                  // title: `【项目管理部】发布【${item.knowledgeName}】, 请及时查阅!`,
                  title: `[${item.notificationTypeName}]-${item.knowledgeName}-${item.createTime}`,
                  link: "",
                  id: item.id,
                });
              }
            });

            this.noticeData = newArr;
            console.log("最新公告：", this.noticeData);
          } else {
            this.noticeData = [];
          }
        } else {
          this.noticeData = [];
          this.$message.error(res.msg.message);
        }
      });
    },
    timeChange() {
      this.getStatementA();
      this.getDangerData();
      this.$emit("callbackFunc", { time: this.time, source: this.source });
      // sessionStorage.setItem('sourceChange', this.source)
      // sessionStorage.setItem('yearChange', this.time)
    },
    // 获取重大风险和问题数据
    getDangerData(type) {
      let param = {
        contactId: 0,
        isDraft: 0,
        level: "",
        pageNo: 0,
        pageSize: 0,
        problemIds: [],
        projectId: 0,
        projectName: "",
        proposeTime: "",
        status: "",
        systemName: "",
        type: "",
        isConcern: type,
        yearPlanName: this.time,
        source: this.source,
      };
      getDangerInfo(param).then((res) => {
        //console.log(res);
        if (res.msg.code === "0000") {
          const { completeProblem, problemHandle, completeRisk, riskHandler } =
            res.data;
          this.MajorProblem.resolved = completeProblem;
          this.MajorProblem.unsolved = problemHandle;
          this.MajorDanger.resolved = completeRisk;
          this.MajorDanger.unsolved = riskHandler;
        }
      });
    },
    getStatementA() {
      getStatement({
        isConcern: this.isConcern,
        time: this.time,
        source: this.source,
      }).then((res) => {
        console.log(res.data, "ssss");
        if (res.data) {
          this.systemNum = res.data.systemNum;
          this.projectNum = res.data.projectNum;
          this.researchApplicationNUm = res.data.researchApplicationNUm; //res.data.researchApplicationNUm;
          this.optionPhaseNum = res.data.optionPhaseNum; //res.data.optionPhaseNum;
          this.projectApprovalNum = res.data.projectApprovalNum; //res.data.projectApprovalNum;
          this.implIngNum = res.data.implIngNum; //res.data.implIngNum;
          this.trialRunNum = res.data.trialRunNum; //res.data.trialRunNum;
          this.onlineNum = res.data.onlineNum; //res.data.onlineNum;
        }
      });
    },
    goRisk(type1, type2) {
      // 更新tabs页签
      let element = {
        url:
          "/subimpl/#/riskAndIssueNew" +
          `?type=0&statusSolve=${type1}&typePr=${type2}&isNew=true`,
        title: "风险问题管理",
      };
      let tabsList = JSON.parse(sessionStorage.getItem("tabsList")) || [];
      let obj = tabsList.findIndex((item) =>
        item.url.includes("/subimpl/#/riskAndIssueNew")
      );
      if (obj > -1) {
        // routerGo(obj.url);
        tabsList.splice(obj, 1, element);
      } else {
        tabsList.push({
          ...element,
        });
      }
      sessionStorage.setItem("htmlData", element.title);
      sessionStorage.setItem("tabsList", JSON.stringify(tabsList));
      routerGo(element.url);
    },
  },
  created() {
    // 获取重大风险信息
    this.getDangerData(0);
  },
  mounted() {
    this.getStatementA();
    this.getNotice();
    this.timeChange();
  },
};
</script>

<style lang="scss" scoped>
@import "../../../assets/css/systemNum/systemNum.css";

::v-deep .el-input__inner {
  border-radius: 2px !important;
  font-size: 12px !important;
  height: 22px !important;
}

::v-deep .el-input__suffix {
  top: 3px !important;
}

.allMiddle {
  height: 100%;
  background: rgba(255, 255, 255, 1);
  padding: 10px 10px;
  border-radius: 4px;
  .middle {
    // margin: 16px 0;
    // margin-top: 0;
    height: 100%;
    display: flex;
    flex-direction: row;
    font-size: 14px;
    color: rgba(78, 89, 105, 1);
    .middle_left {
      width: 56%;
      background: #fff;
      padding: 10px 0;
      // padding-left: 1vw;
      border-radius: 10px;
      border: 1px solid rgba(242, 243, 245, 1);

      .selects {
        margin-bottom: 10px;
        padding-left: 1.5%;
        display: flex;
        .total-select {
          height: 22px;
          margin-right: 20px;
          width: 120px;
        }
      }
      .bottom-box {
        display: flex;
        .middle_left_left {
          // display: flex;
          // flex-direction: column;
          // justify-content: center;
          // align-items: center;
          text-align: center;
          width: 30%;
          border-right: 1px solid rgba(242, 243, 245, 1);
          padding-left: 1.5%;
          margin-right: 3%;
          .middle_left_left_text {
            font-size: 22px !important;
            font-weight: bold;
            text-align: left;
            display: flex;
            justify-content: center;
            align-items: center;
            // .middle_left_left_border {
            //   width: 4px;
            //   height: 14px;
            //   border-radius: 5px;
            //   background: rgb(1, 118, 255);
            //   margin: 0 5px;
            // }
          }

          .text {
            font-size: 16px !important;
            font-weight: 700;
          }

          .num {
            font-size: 42px;
            font-weight: 700;
            color: rgba(66, 130, 255, 1);
            border: none;
            height: 60%;
            display: flex;
            justify-content: center;
            align-items: flex-end;
          }
        }

        .middle_left_right {
          // margin:0 auto;
          display: flex;
          flex-wrap: wrap;
          // justify-content: space-around;
          width: 65%;
          .middle_left_right_boxTop {
            width: 100%;
            height: 50%;
            display: flex;
            // margin-bottom: 8px;
          }
          .middle_left_right_boxBottom {
            width: 100%;
            height: 45%;
            display: flex;
            margin-top: 8px;
          }

          .box {
            width: 98px;
            margin-right: 4%;
            display: flex;
            /* align-items: center; */
            flex-direction: column;
            justify-content: left;
          }

          .box:last-child {
            margin-right: 0px;
          }

          .num {
            font-size: 24px;
            font-weight: 700;
            color: rgba(29, 33, 41, 1);

            border-bottom: 1px solid rgb(214, 217, 229);
          }

          .text {
            font-size: 14px;
            padding: 0 !important;
            font-weight: 400 !important;
          }
        }
      }
    }
    .middle_left-gradient {
      background: linear-gradient(
        to right,
        rgb(230, 241, 255),
        rgb(255, 255, 255)
      );
    }

    .middle_que {
      width: 20%;
      margin: 0 16px;
      background: #fff;
      border-radius: 10px;
      padding-top: 5px;
      padding-left: 24px;
      border: 1px solid rgba(242, 243, 245, 1);

      .middle_que_top {
        display: flex;
        align-items: center;
        .image {
          width: 5%;
          height: 5%;
        }
        span {
          display: inline-block;
          margin-left: 12px;
          font-size: 14px;
          color: rgba(212, 48, 48, 1);
          font-weight: 700;
        }
      }

      .middle_que_bottom {
        display: flex;
        justify-content: space-around;
        padding: 0 28px;
        color: rgba(29, 33, 41, 1);

        .box {
          width: 50%;
          display: flex;
          /* align-items: center; */
          flex-direction: column;
          justify-content: left;
          .item {
            border: none !important;
            background-color: rgba(255, 255, 255, 0) !important;
          }
        }

        .num1 {
          font-weight: 700;
          font-size: 36px;
          line-height: 36px;
          width: 30%;
          color: #000 !important;
          cursor: pointer;

          &:hover {
            font-size: 42px;
            line-height: 42px;
            font-weight: 900;
            transition: width 2s linear 0s;
          }
        }

        .num2 {
          font-weight: 700;
          font-size: 36px;
          line-height: 36px;
          color: rgba(212, 48, 48, 1);
          width: 30%;
          cursor: pointer;

          &:hover {
            font-size: 42px;
            line-height: 42px;
            font-weight: 900;
            transition: width 2s linear 0s;
          }
        }
      }
    }
    .middle_que-gradient {
      background: linear-gradient(
        to right,
        rgb(251, 235, 235),
        rgb(255, 255, 255)
      );
    }

    .middle_risk {
      width: 20%;
      background: #fff;
      border-radius: 10px;
      padding-top: 5px;
      padding-left: 24px;
      border: 1px solid rgba(242, 243, 245, 1);

      .middle_que_top {
        display: flex;
        align-items: center;
        .image {
          width: 7%;
          height: 7%;
        }
        span {
          display: inline-block;
          margin-left: 12px;
          font-size: 16px;
          //color: rgba(212, 48, 48, 1);
          font-weight: 700;
        }
      }

      .list {
        margin-top: 10px;
        width: 90%;
        height: 200px;
        .list-view {
          // height: 200px;
        }
        .list-item {
          width: 100%;
          &:hover {
            cursor: pointer;
            color: #1890ff;
          }
          span {
            display: inline-block;
            width: 100%;
            white-space: nowrap; /*规定段落中的文本不进行换行*/
            overflow: hidden; /*内容会被修剪，并且其余内容是不可见的。*/
            text-overflow: ellipsis; /*显示省略号来代表被修剪的文本*/
          }
        }
      }

      .middle_que_bottom {
        display: flex;
        justify-content: space-event;
        padding: 0 28px;
        color: rgba(29, 33, 41, 1);

        .box {
          width: 50%;
          display: flex;
          /* align-items: center; */
          flex-direction: column;
          justify-content: left;
          .item {
            border: none !important;
            background-color: rgba(255, 255, 255, 0) !important;
          }
        }

        .num1 {
          font-weight: 700;
          font-size: 36px;
          line-height: 36px;
          width: 30%;
          color: #000 !important;

          cursor: pointer;

          &:hover {
            font-size: 42px;
            line-height: 42px;
            font-weight: 900;
            transition: width 2s linear 0s;
          }
        }

        .num2 {
          font-weight: 700;
          font-size: 36px;
          line-height: 36px;
          color: rgba(212, 48, 48, 1);
          width: 30%;
          cursor: pointer;

          &:hover {
            font-size: 42px;
            line-height: 42px;
            font-weight: 900;
            transition: width 2s linear 0s;
          }
        }
      }
    }
    .middle_risk-gradient {
      background: linear-gradient(
        to right,
        rgb(251, 235, 235),
        rgb(255, 255, 255)
      );
    }
  }
}
.allMiddle
  .middle
  .middle_left
  .middle_left_right
  .middle_left_right_boxBottom
  .num {
  border: none;
}
.allMiddle .middle .middle_left {
  padding: 6px 0;
}
</style>
