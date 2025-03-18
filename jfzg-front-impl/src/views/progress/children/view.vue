<template>
  <div class="progressView">
    <div class="mgb31">
      <NavPage
        :type="2"
        :project="srNavPageObj"
        :tag="srNavPageObj.projectTypeName"
        routerName="progress"
      />
    </div>
    <!-- 集群基本情况 -->
    <div
      class="jqInfo"
      v-if="
        $route.query.isSonProject == 'false' ||
        $route.query.isSonProject == false
      "
    >
      <jqBaseInfo></jqBaseInfo>
    </div>
    <!--子项目情况-->
    <div
      class="zxmBox"
      v-if="
        mainProContro &&
        (this.$route.query.isSonProject == 'false' ||
          $route.query.isSonProject == false)
      "
    >
      <subProjectInfo
        :mainPro="mainPro"
        @changenewSonProjectId="changenewSonProjectId"
      ></subProjectInfo>
    </div>
    <div>
      <!--项目总体情况-->

      <!--第一行-->
      <div class="first flex">
        <div class="bg flex1">
          <ITitle title="进度情况"></ITitle>
          <div class="jdBox">
            <p class="title">{{ yuqiList.title }}</p>
            <div class="yqStatus">
              <!--现有，应有进度条百分比-->
              <!-- <lineStatus :percent="yuqiList"></lineStatus> -->
            </div>
            <!-- 根据是否正常判断显示内容 -->
            <div class="cq" v-if="yuqiList.title == '逾期'">
              当前已超期
              <span>
                {{ yuqiList.overdueTime }}天
                <i class="cs_iconfont iconlishibanben"></i>
              </span>
            </div>
            <div class="cq" v-else>当前未逾期</div>
          </div>
        </div>

        <div class="bg flex1">
          <ITitle title="风险/问题"></ITitle>
          <div class="tabCard">
            <div class="fxrisk flex">
              <span class="t"></span>
              <div class="flex1 flex">
                <span class="riskHColor flex1">
                  <img src="../assets/high.svg" alt />高
                </span>
                <span class="riskMColor flex1">
                  <img src="../assets/center.svg" alt />中
                </span>
                <span class="riskDColor flex1">
                  <img src="../assets/low.svg" alt />低
                </span>
              </div>
            </div>
            <div class="fxrisk flex">
              <span class="t">风险</span>
              <div class="flex1 flex">
                <template v-if="riskList && riskList.length">
                  <span
                    v-for="(item, i) in riskList"
                    :key="i + 'risk'"
                    class="flex1"
                    :class="riskProblem(item, 'risk')"
                    >{{ (item && item.riskCount) || 0 }}</span
                  >
                </template>
                <template v-else>
                  <span class="riskTColor flex1">{{ 0 }}</span>
                  <span class="riskTColor flex1">{{ 0 }}</span>
                  <span class="riskTColor flex1">{{ 0 }}</span>
                </template>
              </div>
            </div>
            <div class="fxrisk flex">
              <span class="t">问题</span>
              <div class="flex1 flex">
                <template v-if="problemList && problemList.length">
                  <span
                    v-for="(item, i) in problemList"
                    :key="i + 'problem'"
                    class="flex1"
                    :class="riskProblem(item)"
                    >{{ (item && item.problemCount) || 0 }}</span
                  >
                </template>
                <template v-else>
                  <span class="riskTColor flex1">{{ 0 }}</span>
                  <span class="riskTColor flex1">{{ 0 }}</span>
                  <span class="riskTColor flex1">{{ 0 }}</span>
                </template>
              </div>
            </div>
          </div>
        </div>

        <div class="bg flex1">
          <ITitle title="任务完成情况"></ITitle>
          <!-- <div class="hbNum">
            <span>{{ hbList.totalCount }}</span>次
          </div>-->
          <SLineChart :echartInfo="echartInfo" v-if="isecharInfo"></SLineChart>
        </div>

        <div class="bg flex1">
          <ITitle title="交付物情况"></ITitle>
          <div class="jfwqk flex">
            <div class="jfwqkLeft flex1">
              <span class="num">{{
                jfwList.submitted ? jfwList.submitted : 0
              }}</span>
              <span>已提交数量</span>
            </div>
            <div class="ctPositon flex1">
              <div :style="{ left: right + 'px' }" class="bfb">
                <div>提交</div>
                <div>
                  {{
                    ((jfwList.submitted / jfwList.shouldSubmit) * 100).toFixed(
                      0
                    ) == "NaN"
                      ? "0"
                      : (
                          (jfwList.submitted / jfwList.shouldSubmit) *
                          100
                        ).toFixed(0)
                  }}%
                </div>
              </div>
              <Charts :config="chartConfig5"></Charts>
            </div>
            <div class="jfwqkRight flex1">
              <span class="num">{{
                jfwList.shouldSubmit ? jfwList.shouldSubmit : 0
              }}</span>
              <span>需提交数量</span>
            </div>
          </div>
        </div>
      </div>

      <!--里程碑完成情况-->
      <div class="lcbBox">
        <ITitle title="里程碑完成情况"></ITitle>

        <steps
          class="steps"
          ref="stepsInfo"
          :isSupervisor="isSupervisor"
          :sonprojectId="sonprojectId"
          :queryId="projectId"
        ></steps>
      </div>

      <!--问题/风险/交付物-->
      <div class="jwfTj flex">
        <div class="box flex1">
          <ITitle title="风险问题情况"></ITitle>
          <div class="flex mgt16">
            <div class="flex1 bacFAF mgr16">
              <p class="text">风险情况</p>
              <div class="infoBox flex">
                <doughnut
                  :echartInfo="echartInfo6"
                  v-if="isecharInfo6"
                ></doughnut>
                <div class="flex1 condition">
                  <ul class="flex">
                    <li class="col666 flex1">
                      <span class="dot highBg"></span>高
                    </li>
                    <li class="col333 flex1">{{ qrTaskData.highNum }}</li>
                    <li class="col999 flex1">{{ qrTaskPer.highNum }}%</li>
                  </ul>
                  <ul class="flex">
                    <li class="col666 flex1">
                      <span class="dot centerBg"></span>中
                    </li>
                    <li class="col333 flex1">{{ qrTaskData.secondary }}</li>
                    <li class="col999 flex1">{{ qrTaskPer.secondary }}%</li>
                  </ul>
                  <ul class="flex">
                    <li class="col666 flex1">
                      <span class="dot lowBg"></span>低
                    </li>
                    <li class="col333 flex1">{{ qrTaskData.lowNum }}</li>
                    <li class="col999 flex1">{{ qrTaskPer.lowNum }}%</li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="flex1 bacFAF">
              <p class="text">问题情况</p>
              <div class="infoBox flex">
                <doughnut
                  :echartInfo="echartInfo7"
                  v-if="isecharInfo7"
                ></doughnut>
                <div class="flex1 condition">
                  <ul class="flex">
                    <li class="col666 flex1">
                      <span class="dot highBg"></span>高
                    </li>
                    <li class="col333 flex1">{{ qrQuestionData.highNum }}</li>
                    <li class="col999 flex1">{{ qrQuestionPer.highNum }}%</li>
                  </ul>
                  <ul class="flex">
                    <li class="col666 flex1">
                      <span class="dot centerBg"></span>中
                    </li>
                    <li class="col333 flex1">{{ qrQuestionData.secondary }}</li>
                    <li class="col999 flex1">{{ qrQuestionPer.secondary }}%</li>
                  </ul>
                  <ul class="flex">
                    <li class="col666 flex1">
                      <span class="dot lowBg"></span>低
                    </li>
                    <li class="col333 flex1">{{ qrQuestionData.lowNum }}</li>
                    <li class="col999 flex1">{{ qrQuestionPer.lowNum }}%</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="box flex1">
          <ITitle title="交付物提交情况"></ITitle>
          <div class="flex mgt16">
            <div class="flex1 bacFAF mgr16">
              <p class="text">各月提交情况</p>
              <div class="SLineChartDiv">
                <SLineChart
                  :echartInfo="echartInfo2"
                  v-if="isecharInfo2"
                ></SLineChart>
              </div>
            </div>
            <div class="flex1 bacFAF">
              <p class="text">检查通过率</p>
              <div class="jfwBottom flex">
                <passCircle :echartInfo="checkOK"></passCircle>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 交付物清单 -->
      <div class="jfwqd">
        <ITitle title="交付物清单"></ITitle>
        <SrTable
          :data="table.data"
          :config="table.tableConfig"
          :page="table.page"
          @pageChanged="pageChanged"
          @sizeChanged="sizeChanged"
        >
          <div slot="cellSlot" slot-scope="{ scope }">
            {{ scope.row.size }}b
          </div>
        </SrTable>
      </div>
    </div>
  </div>
</template>
<script>
import config from "@/settings.js";

import steps from "../components/steps";
import NavPage from "../components/navPage";
import ryzHub from "../components/ryzHb";
import fwjy from "../components/fwjy";
import sjhb from "../components/sjhb";
import zjtc from "../components/jiqun/subZjtc";
import lcbHb from "../components/lcbHb";
import ITitle from "../components/iTitle";
import FFieldset from "../components/FHeader/FFieldset.vue";
import SLineChart from "../components/Echarts/SLineChart"; // 圆滑曲线进度
import lineStatus from "../components/Echarts/lineStatus"; //逾期进度条
import doughnut from "../components/Echarts/doughnut"; //环形
import barBackground from "../components/Echarts/barBackground"; //柱状
import tabCard from "../components/tabCard"; //tab切换
import DList from "../components/dList";
import Charts from "../components/SR-Charts/Charts.vue";
import passCircle from "../components/Echarts/passCircle.vue";
import { qrisk } from "../components/qrisk";
import { dataList } from "../components/jiqun/data";
import { taskEvent } from "../components/mixinTaskEvent";
import { situationProject } from "../components/situationProject";
import arrowHorizontalBar from "../components/Echarts/arrowHorizontalBar";
import jqBaseInfo from "../components/jiqun/jqBaseInfo";
import subProjectInfo from "../components/jiqun/subProjectInfo";
import {
  overdueTime,
  riskAndProblemQuantity,
  detailMediumlongPlan,
  listConstructionexperience,
  deliveryList,
} from "@/api/progress";
import { api_getProjectById } from "@/api/progress";
export default {
  components: {
    ITitle,
    NavPage,
    SLineChart,
    FFieldset,
    lineStatus,
    tabCard,
    Charts,
    doughnut,
    barBackground,
    ryzHub,
    sjhb,
    lcbHb,
    DList,
    zjtc,
    fwjy,
    steps,
    arrowHorizontalBar,
    jqBaseInfo,
    subProjectInfo,
    passCircle,
  },
  mixins: [qrisk, situationProject, taskEvent, dataList],
  computed: {},
  watch: {
    sonprojectId: {
      handler: function (newVal) {
        //  mixins: [qrisk, situationProject, taskEvent, dataList],
        this.getQriskdata(newVal); //qrisk
        this.getsituationProject(newVal); //situationProject
        this.taskEvent(newVal); //taskEvent
        this.$refs.stepsInfo?.queryProjectInfo(newVal); //更新里程碑

        // this.dataList(newVal);//dataList --纯数据来源，无需修改
      },
    },
  },
  props: {
    queryId: {
      type: [String, Number],
      default: () => {
        return "";
      },
    },
  },
  data() {
    return {
      baseUrl: config.uploadBaseUrl,
      riskList: [],
      problemList: [],
      table: {
        data: [], // 表格数据
        tableConfig: {
          rowClassName: this.rowClassName,
          title: "表格的标题", // 表格标题
          highlightCurrentRow: false, // 控制表格是否单选
          // maxLength: 20, // 一行最多显示多少字，超出显示popver
          load: this.load,
          tooltipEffect: "light",
          header: [
            /* {
              disabled: true,
              index: 1,
              isShow: true,
              label: "序号",
              prop: "index",
              width: "70px",
            }, */
            {
              disabled: true,
              index: 2,
              isShow: true,
              label: "交付物名称",
              prop: "fileName",
            },
            {
              disabled: true,
              index: 3,
              isShow: true,
              label: "状态",
              prop: "statusName",
            },
            {
              disabled: true,
              index: 4,
              isShow: true,
              label: "提交人",
              prop: "createName",
            },
            {
              disabled: true,
              index: 5,
              isShow: true,
              label: "文件大小",
              prop: "size",
              cellSlot: true,
            },
            {
              disabled: true,
              index: 6,
              isShow: true,
              label: "提交时间",
              prop: "createTime",
            },
          ],
          selectionConfig: {
            display: false,
            width: "70",
          },
          operateConfig: {
            display: true,
            label: "操作",
            width: "156",
            fixed: "right",
          },
          innerBtn: [
            // 表格内部操作按钮，不需要操作列的innerBtn 写成false
            {
              name: "查看", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "preview", // 点击执行该页面methods中对应的方法
              // field: "id", // 控制按钮显示隐藏的字段，目前仅支持单一字段，常显的按钮不需要传
              // value: [1, 2], // 需要根据字段控制按钮显示隐藏，当state值不等于该数组的任何一个值的时候显示。逻辑this.table.data的某条数据state!=1&&state!=2时显示该行的这个按钮
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
            },
            {
              name: "下载",
              method: "download",
              type: "text",
              size: "small",
              icon: "el-icon-document",
              className: "font-size-20",
            },
          ],
        },
        page: {
          // 分页配置
          total: 0, //总条数
          pages: 0, //总页数
          pageSize: 10, //每页展示多少个
          pageSizes: [10, 20, 30],
          pageNum: 1, //当前页
          background: true,
          // layout: 'total, prev, pager, next, sizes,jumper'
        },
      },
      srNavPageObj: {
        projectCode: "",
        projectLabel: null,
        projectName: "",
        projectPeriod: "",
        creatorBuName: "",
      },

      mainPro: {},
      mainProContro: false,
      // sonprojectId: this.$route.query.id || this.queryId,
      sonprojectId: 458, // 假
      projectId: "",
      isSupervisor: true,
      amountDetail: {},
      yuqiList: {
        title: "逾期", // 进度情况,只要有一个延期，就是延期，延期天数取最大值
        overdueTime: 3, //延期天数
        normal: "", //现有进度
        abnormal: "", //应有进度
      },
      templateConfig: {
        title: `新增风险`,
        projectId: this.projectId,
      },

      isxm: 0, //项目汇报情况
      singleInfo: {
        type: "1",
        Interface: listConstructionexperience,
      },
      right: 43,
    };
  },
  methods: {
    preview(row) {
      let token = sessionStorage.getItem("token");
      if (
        [
          "txt",
          "ppt",
          "pptx",
          "doc",
          "docx",
          "xls",
          "xlsx",

          "html",
          "pdf",
        ].includes(this.$utils.getFileType(row.fileName))
      ) {
        window.open(`${config.baseUrl}/viewPdf?id=${row.url}`);
      } else {
        window.open(
          `${config.baseUrl}/jfzg/file/api/file/download?key=${row.url}&access_token=${token}`
        );
      }
    },
    download(row) {
      let token = sessionStorage.getItem("token");
      this.$utils.exportFile(
        `${this.baseUrl}/jfzg/file/api/file/downloadStream?key=${row.url}&access_token=${token}`
      );
    },
    async init() {
      // 项目进度
      let res1 = await overdueTime({ projectId: this.projectId });
      if (res1.msg.code == "0000" && res1.data) {
        this.$set(this, "yuqiList", {
          ...res1.data,
          title: !res1.data.overdueTime ? "正常" : "逾期",
        });
      }

      // 风险/问题
      let res2 = await riskAndProblemQuantity({ projectId: this.projectId });
      if (res2.msg.code == "0000" && res2.data) {
        this.$set(
          this,
          "riskList",
          this.riskAndProblemSort(res2.data.riskList, "riskLevel")
        );
        this.$set(
          this,
          "problemList",
          this.riskAndProblemSort(res2.data.problemList, "problemLevel")
        );
      }

      // 项目基本信息
      let res3 = await api_getProjectById({ projectId: this.projectId });
      if (res3.msg.code == "0000" && res3.data) {
        let { beginDate, endDate } = res3.data;
        let projectPeriod = "";
        if (beginDate && endDate) {
          projectPeriod = beginDate + " ～ " + endDate;
        }
        this.srNavPageObj = {
          ...res3.data,
          projectPeriod,
        };
      }
      // 交付物清单
      this.getTbData();
    },
    riskProblem(item, key) {
      // 风险问题颜色
      let arr = [
        { riskLevel: "", problemLevel: "", class: "riskTColor" },
        { riskLevel: "3", problemLevel: "3", class: "riskHColor" },
        { riskLevel: "2", problemLevel: "2", class: "riskMColor" },
        { riskLevel: "1", problemLevel: "1", class: "riskDColor" },
      ];
      let obj = {};
      if (key == "risk") {
        obj = item && this.$utils.arrFind(arr, item.riskLevel, "riskLevel");
      } else {
        obj =
          item && this.$utils.arrFind(arr, item.problemLevel, "problemLevel");
      }
      return obj && obj.class ? obj.class : arr[0].class;
    },
    riskAndProblemSort(arr, key) {
      // 风险、问题通过高中低排序
      let temp = [];
      for (const item of arr) {
        if (item.levelName == "高度") {
          temp[0] = item;
        }
        if (item.levelName == "中度") {
          temp[1] = item;
        }
        if (item.levelName == "轻度") {
          temp[2] = item;
        }
        /* if (item[key]) {
          if (item[key] == 3) {
            // 高
            temp[0] = item;
          }
          if (item[key] == 2) {
            // 中
            temp[1] = item;
          }
          if (item[key] == 1) {
            // 低
            temp[2] = item;
          }
        } */
      }
      return temp;
    },

    pageChanged(val) {
      this.table.page.pageNum = val;
      this.getTbData();
    },
    sizeChanged(val) {
      this.table.page.pageNum = 1;
      this.table.page.pageSize = val;
      this.getTbData();
    },
    async getTbData() {
      let param = {
        pageNum: this.table.page.pageNum,
        pageSize: this.table.page.pageSize,
        projectId: this.projectId,
      };

      // 交付物清单
      let res = await deliveryList(param);

      if (res.msg.code == "0000" && res.data) {
        this.table.page.pages = res.data.pages;
        this.table.page.total = res.data.total;
        this.$set(this.table, "data", res.data.records);
      }
    },
    changenewSonProjectId(projectId) {
      console.log(projectId);
      this.sonprojectId = projectId;
    },

    /**事件汇报详情 */
    goEventDetail(item) {
      this.$router.push({
        name: "shijianDetail",
        query: {
          projectId: this.projectId,
          isuser: 3,
          id: item.id,
        },
      });
    },
    /**是否有监理单位 */
    getData(data) {
      if (data.supervisorName) {
        this.isSupervisor = true;
      }
    },
    /**
     * 项目进展汇报tab
     */
    switchTabXm(data) {
      this.isxm = data;
    },

    /**跳转到质量检测记录 */
    hisQuality() {
      this.$router.push({
        name: "zlList",
        query: {
          id: this.projectId,
        },
      });
    },
    //计算
    calculationCt() {
      let bfb = (
        (this.jfwList.submitted / this.jfwList.shouldSubmit) *
        100
      ).toFixed(0);
      if (bfb >= 10 && bfb < 100) {
        this.right = 25;
      } else if (bfb <= 100) {
        this.right = 20;
      } else {
        if (this.$route.name == "allLifeCycle") {
          this.right = 50;
        } else {
          this.right = 43;
        }
      }
    },

    /**
     * 跳到控制点检测记录
     */
    cprojectList() {
      this.$router.push({
        name: "kzdList",
        query: {
          id: this.sonprojectId,
        },
      });
    },
    getInfodata(projectId) {
      let params = {
        id: projectId,
      };
      detailMediumlongPlan(params).then((res) => {
        let obj = { ...res.data };
        this.mainProContro = true;
        this.mainPro = {
          id: obj.id,
          projectName: obj.mediumlongProjectName,
          isTrial: obj.isTrial,
          father: true,
        };
      });
    },
  },
  mounted() {
    this.calculationCt();
    //进度情况，进度条如何计算

    this.getQriskdata(this.projectId); //qrisk
    this.getsituationProject(this.projectId); //situationProject
    this.taskEvent(this.projectId); //taskEvent
    this.$refs.stepsInfo?.queryProjectInfo(this.projectId); //更新里程碑
  },
  created() {
    this.projectId = this.$route.query.projectId || this.queryId;

    if (this.$route.query.type == "xmgl") {
      this.showXmgl = false;
    } else {
      this.showXmgl = true;
    }
    this.init();
    this.getInfodata(this.$route.query.projectId || this.queryId);
  },
};
</script>
<style lang="scss" scoped>
.progressView {
  ::v-deep.sr_table {
    .sr-icon-set {
      // 去除设置表头
      display: none;
    }
  }
  .flex {
    display: flex;
  }

  .flex1 {
    flex-grow: 1;
  }
  .flex1-8 {
    flex: 1.8;
  }
  .mgt16 {
    margin-top: 16px;
  }
  .mgr16 {
    margin-right: 16px;
  }
  .bacFAF {
    background: #fafafa;
  }
  .col333 {
    color: #333;
  }
  .col666 {
    color: #666;
  }
  .col999 {
    color: #999;
  }

  .lowBg {
    background: #1890fe;
  }
  .centerBg {
    background: #ffc64d;
  }
  .highBg {
    background: #f5222d;
  }
  .bgE6F {
    background: #e6f7ff;
    border: 1px solid #a3daff;
  }
  /**风险等级颜色*/
  //高
  .riskHColor {
    color: #ff0000;
  }

  .riskHBg {
    background: #ffe5e5;
  }

  //中
  .riskMColor {
    color: #f7a900;
  }

  .riskMBg {
    background: rgba(247, 169, 0, 0.1);
  }

  //低
  .riskDColor {
    color: #007aff;
  }
  .riskTColor {
    color: #cccccc;
  }
  .riskDBg {
    background: #e5f1ff;
  }

  .green {
    color: #009900;
  }

  .yellow {
    background: #fad337;
  }

  .blue {
    background: #52c41a;
  }

  .mgb30 {
    padding: 0 20px;
  }
  .mgb31 {
    margin-bottom: 20px;
  }
  @keyframes beat {
    0% {
      bottom: 30%;
    }

    // 25% {
    //     bottom: 14%;
    // }

    50% {
      bottom: 28%;
    }

    // 75% {
    //     bottom: 14%;
    // }

    100% {
      bottom: 30%;
    }
  }

  .skipUp {
    position: absolute;
    left: 70px;
    display: inline-block;
    animation-name: beat; /*动画名称*/
    animation-duration: 2s; /*设置秒数*/
    animation-timing-function: linear; /*速度曲线*/
    animation-iteration-count: infinite; /*播放次数*/
    animation-direction: alternate; /*逆向播放*/
    animation-play-state: running; /*正在运行*/
  }
  /**::after
  公有样式开始
 */
  .fs26 {
    font-size: 26px;
  }
  .notext {
    text-align: center;
    color: #d6dbe3;
  }
  .fs16 {
    font-size: 16px;
  }
  .sub {
    font-size: 13px;
    color: #595959;
  }
  .info {
    color: #999999;
    font-size: 12px;
  }
  .grey {
    background: #999;
  }
  .mgr10 {
    margin-right: 10px;
  }
  .cursor {
    cursor: pointer;
  }
  .mgb10 {
    margin-bottom: 10px;
  }
  .block {
    display: inline-block;
  }
  .mgb0 {
    margin-bottom: 0;
  }
  .yellow1 {
    background: rgba(247, 169, 0, 0.1);
    color: #f7a900;
  }
  .yellow2 {
    color: #f7a900;
  }

  .red {
    background: #f5222d;
  }
  .red1 {
    background: rgba(255, 0, 0, 0.1);
    color: #ff0000;
  }
  .red2 {
    color: #ff0000;
  }
  .greenBg {
    background: #6dcb2a;
  }
  .green1 {
    background: rgba(0, 153, 0, 0.1);
    color: #009900;
  }
  .green2 {
    color: #009900;
  }
  .blue {
    background: #007aff;
  }
  .ctPositon {
    position: relative;
    display: flex;
    justify-content: center;
    .bfb {
      text-align: center;
      position: absolute;
      right: 38px;
      top: 35px;
      font-weight: bold;
      font-size: 14px;
    }
  }
  /* 第一行 */
  .first {
    margin-bottom: 16px;
    .bg {
      border: 1px solid #e6e6e6;
      border-right: 0;
      height: 170px;
      padding: 16px;
      position: relative;
      .hbNum {
        position: absolute;
        margin-top: 20px;
        font-size: 12px;
        color: #333;
        span {
          font-size: 24px;
          font-weight: 700;
        }
      }
      .jfwqk {
        .jfwqkLeft,
        .jfwqkRight {
          margin-top: 20px;
          font-size: 12px;
          color: #333;
          .num {
            font-size: 24px;
            font-weight: 700;
          }
          span {
            display: block;
            text-align: center;
          }
        }
      }
      &:first-child {
        border-radius: 0px 0px 0px 8px;
      }
      &:last-child {
        border-radius: 0px 0px 8px 0px;
        border-right: 1px solid #e6e6e6;
      }
    }
  }
  /* 风险/问题 交付物提交 */
  .jwfTj {
    border: 1px solid #e6e6e6;
    border-radius: 8px;
    margin-top: 16px;
    height: 274px;
    .box {
      padding: 16px;

      &:first-child {
        border-right: 1px solid #e6e6e6;
      }

      .text {
        margin-top: 16px;
        padding-left: 16px;
        font-size: 14px;
        color: #999999;
      }
      .bacFAF {
        height: 202px;
        overflow: hidden;
      }

      .SLineChartDiv {
        padding: 16px;
        padding-top: 9px;
      }
      .dot {
        display: inline-block;
        margin-right: 4px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
      }

      .condition {
        padding: 30px 0;
        ul {
          margin-top: 16px;
          &:first-child {
            margin-top: 0;
          }
        }
      }

      .accuracy {
        padding: 30px 0;
        margin-top: 16px;
        ul {
          margin-top: 16px;
          &:first-child {
            margin-top: 0;
          }
        }
      }
    }
  }
  /**进度情况 */
  .jdBox {
    .title {
      margin-top: 24px;
      font-size: 28px;
      color: #333;
      height: 32px;
      line-height: 32px;
    }
    .yqStatus {
      margin-top: 19px;
    }
    .cq {
      margin-top: 11px;
      color: #666;
      span {
        display: inline-block;
        margin-left: 6px;
        color: #ff2323;
      }
    }
  }

  ::v-deep .el-tabs {
    > .el-tabs__header {
      border: none;
      margin: 0;
      .el-tabs__nav {
        border: none;
        .el-tabs__item {
          border: 1px solid #dfe4ed;
          height: 100%;
          text-align: center;
        }
        .is-active {
          // border: 1px solid #1890ff;
        }
      }
    }
  }
  /**风险 */
  .tabCard {
    margin-top: 14px;
    span.t {
      width: 58px;
      color: #333;
      font-size: 14px;
      padding-left: 0;
      padding-right: 20px;
    }
    .fxrisk {
      width: 100%;
      height: 32px;
      background: #f7f7f7;
      border-radius: 16px;
      align-items: center;
      margin-top: 4px;
      padding: 0 16px;
      &:first-child {
        margin-top: 0;
        background: transparent;
        span {
          font-size: 12px;
        }
        img {
          vertical-align: middle;
          margin-right: 2px;
        }
      }
      &:nth-child(2) {
        margin-top: 0;
      }
      span {
        display: inline-block;
        // margin-right: 6px;
        border-radius: 10px;
        font-size: 14px;
        text-align: center;
      }
    }
  }
  .riskHBg {
    margin-right: 6px;
  }
  .riskMBg {
    margin-right: 6px;
  }

  /**交付物 */
  .jfwqd {
    border: 1px solid #e6e6e6;
    border-radius: 8px;
    padding: 16px;
    margin-top: 16px;
    .headTitle {
      margin-bottom: 16px;
    }
  }
  .line {
    height: 40px;
    margin: 0 30px;
    margin-top: 27px;
    border-right: 1px dashed #dadada;
  }
}
</style>


<style lang="scss">
.progressView {
  // 里程碑完成情况
  .lcbBox {
    border: 1px solid #e6e6e6;
    border-radius: 8px;
    padding: 16px;
    .steps {
      margin-top: 16px;
    }
    .wrap .inner {
      background: #fff;
      cursor: pointer;
    }
  }
  .weekRange {
    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: 126px;
    }
    .el-input--suffix .el-input__inner {
      padding-right: 0;
    }
  }
}
</style>