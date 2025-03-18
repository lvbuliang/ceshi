<template>
  <!-- <el-drawer
    :withHeader="false"
    size="auto"
    :visible.sync="flag"
    direction="btt"
    :before-close="handleClose"
    
  > -->
  <div class="departmentDialog" v-if="flag" @click="handleAllClick">
    <!-- <RiskAndProblemPie></RiskAndProblemPie> -->
    <header>
      <div class="header_first">
        <img class="date" src="@/assets/images/el-date.png" />
        <div @click="yearClick" class="switch_year">
          <span>{{ yearName }}</span>
          <i class="icon-down-arrow"></i>
        </div>
        <!-- <h3>部门动态</h3> -->
        <div class="searchPage">
          <SrSearch
            v-if="isShowSearch"
            :search="search"
            :searchExpand="true"
            :showTextBtns="true"
            @queryList="pageChanged(1)"
            @handleSelect="handleSelect"
          ></SrSearch>
        </div>
        <Tooltip ref="tooltip" class="tooltip" @itemClick="itemClick"></Tooltip>
        <div
          class="switch_box"
          @click="toWorkBench"
          v-if="checkCodeInArr('M001_010')"
        >
          <i class="base-iconfont icon-qiehuan"></i>
          工作台模式
        </div>
      </div>
    </header>
    <main>
      <Card title="项目申报总览" :year="year">
        <Items :config="config1" :data="yearPlanInvesData" @see="see"></Items>
      </Card>
      <Card title="清单申报情况" :year="year">
        <Items
          :config="config3"
          :data="yearDeclareProjectData"
          @see="see"
        ></Items>
      </Card>
      <Card title="清单审核情况" :year="year">
        <Items :config="config4" :data="yearRKProjectData" @see="see"></Items>
      </Card>
      <Card title="年度项目类型汇总看板">
        <!-- v-if="
              riskAndProblemsData.length &&
              riskAndProblemsData[1] &&
              riskAndProblemsData[1].length
              :echartData="riskAndProblemsData"
            " -->
        <Type
          id="typeEcharts"
          ref="typeEcharts"
          :typeBarData="typeBarData"
        ></Type>
        <!-- <div class="flexCenter" v-else>
            <img src="@/assets/images/empty-icon.png" /> 
            <span>暂无内容</span>
          </div>-->
      </Card>
      <Card title="方案申报情况">
        <Items :config="config5" :data="projectDeclarationData"></Items>
      </Card>
      <Card title="方案审核情况">
        <Items :config="config6" :data="projectApprovalData"></Items>
      </Card>
      <Card title="年度建设进展">
        <div class="construction">
          <div class="num">
            <div class="icon">
              <img src="@/assets/standtable/project.png" alt="" />
            </div>
            项目总数(个)：
            <span>{{ constructionData.allProject }}</span>
          </div>
          <div>
            <span>进度正常：</span>
            <span>{{ constructionData.normalProject }}</span>
          </div>
          <div>
            <span>进度逾期：</span>
            <span>{{ constructionData.unNormalProject }}</span>
          </div>
        </div>
        <div class="middle">
          <div>
            <ul class="tree">
              <li class="treeItems">
                <img src="@/assets/standtable/purchase.png" alt="" />
                <span class="title">项目采购(个)：</span>
                <span
                  class="purchaseNum"
                  style="color: #91affa; font-size: 16px"
                  >{{
                    constructionData.buyProject
                      ? constructionData.buyProject
                      : 0
                  }}</span
                >
                <ul>
                  <li class="treeItem">
                    <span>合同签约：</span>
                    <span>{{
                      constructionData.contractdProject
                        ? constructionData.contractdProject
                        : 0
                    }}</span>
                  </li>
                </ul>
              </li>
            </ul>
            <ul class="tree">
              <li class="treeItems">
                <img src="@/assets/standtable/implement.png" alt="" />
                <span class="title">项目实施(个)：</span>
                <span
                  class="purchaseNum"
                  style="color: #6ac5f9; font-size: 16px"
                  >{{
                    constructionData.doProject
                      ? constructionData.doProject
                      : 0
                  }}</span
                >
                <ul>
                  <li class="treeItem">
                    <span>实施中：</span>
                    <span>{{
                      constructionData.doingProject
                        ? constructionData.doingProject
                        : 0
                    }}</span>
                  </li>
                </ul>
              </li>
            </ul>
            <ul class="tree">
              <li class="treeItems">
                <img src="@/assets/standtable/acceptance.png" alt="" />
                <span class="title">项目验收(个)：</span>
                <span
                  class="purchaseNum"
                  style="color: #c69aff; font-size: 16px"
                  >{{
                    constructionData.checkProject
                      ? constructionData.checkProject
                      : 0
                  }}</span
                >
                <ul>
                  <li class="treeItem">
                    <span>初验完成：</span>
                    <span>{{
                      constructionData.firstCheckProject
                        ? constructionData.firstCheckProject
                        : 0
                    }}</span>
                  </li>
                  <li class="treeItem">
                    <span>终验完成：</span>
                    <span>{{
                      constructionData.lastCheckProject
                        ? constructionData.lastCheckProject
                        : 0
                    }}</span>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          <FunnelPlots
            id="funnelPlots"
            ref="funnelPlots"
            :echartData="constructionData"
          ></FunnelPlots>
        </div>
        <!-- <Items :config="config2" :data="yearPlanConsData"></Items> -->
      </Card>
      <!-- <Card title="项目资金汇总看板">
        <Pie id="pieEcharts" ref="pieEcharts" :echartData="pieEchartsData"></Pie>
      </Card> -->
      <!-- <Card title="项目风险汇总看板">
          <Bar
            id="barEcharts"
            ref="barEcharts"
            :echartData="riskAndProblemsData"
            v-if="
              riskAndProblemsData.length &&
              riskAndProblemsData[1] &&
              riskAndProblemsData[1].length
            "
          ></Bar>
          <div class="flexCenter" v-else>
            <img src="@/assets/images/empty-icon.png" />
            <span>暂无内容</span>
          </div>
        </Card> -->
      <!-- :echartData="riskAndProblemsData"
            v-if="
              riskAndProblemsData.length &&
              riskAndProblemsData[1] &&
              riskAndProblemsData[1].length
            " -->
      <Card title="风险问题">
        <div class="riskAndQue">
          <div class="left">
            <div class="num">
              <div class="numItem">
                <div class="imgbg">
                  <img src="@/assets/standtable/risk.png" alt="" />
                </div>
                <span>风险：</span>
                <span class="numcolor">{{
                  riskAndProblemsData.allRisk ? riskAndProblemsData.allRisk : 0
                }}</span>
              </div>
              <div class="numItem">
                <div class="imgbg">
                  <img src="@/assets/standtable/question.png" alt="" />
                </div>
                <span>问题：</span>
                <span class="numcolor">{{
                  riskAndProblemsData.allProblem
                    ? riskAndProblemsData.allProblem
                    : 0
                }}</span>
              </div>
            </div>
            <RiskBar
              id="barEcharts"
              ref="barEcharts"
              :echartData="riskAndProblemsData.data"
            ></RiskBar>
          </div>
          <!-- <Table :riskAndProblemsTable="riskAndProblemsTable"></Table> -->
        </div>
        <!-- <div class="flexCenter" v-else>
            <img src="@/assets/images/empty-icon.png" />
            <span>暂无内容</span>
          </div> -->
      </Card>
      <Card title="资金使用进度">
        <div class="fundsProgress">
          <fundBar :echartData="fundprogress"></fundBar>
        </div>
        <!-- <div class="flexCenter" v-else>
            <img src="@/assets/images/empty-icon.png" />
            <span>暂无内容</span>
          </div> -->
      </Card>
    </main>
  </div>
  <!-- </el-drawer> -->
</template>

<script>
import store from "@/store";
import Card from "./card";
import Items from "./items";
import Pie from "@/components/Charts/Pie";
import RiskAndProblemPie from "@/components/Charts/RiskAndProblemPie";
import Bar from "@/components/Charts/Bar";
import Type from "@/components/Charts/TypeBar";
import FunnelPlots from "@/components/Charts/FunnelPlots";
import RiskBar from "@/components/Charts/RiskBar";
import Tooltip from "./tooltip";
import Table from "./table";
import fundBar from "@/components/Charts/fundBar";
import {
  yearPlanInves,
  yearPlanCons,
  riskAndProblems,
  projectType,
  getAllProject,
  getAllBuName,
  getYearPlanProgress,
  getProjectDeclaration,
  getProjectApproval,
  getYearDeclareProject,
  getYearRKProject,
  getProjectServiceBoard,
  getyearProjectConstruction,
  getprojectRiskAndProblmTotal,
  getprojectRiskAndProblmTable,
  getfundprogress,
} from "@/api/standTable.js";
import { checkCodeInArr } from "@/utils/utils.js";
export default {
  components: {
    Card,
    Items,
    Pie,
    Bar,
    Tooltip,
    RiskAndProblemPie,
    Type,
    FunnelPlots,
    RiskBar,
    Table,
    fundBar,
  },
  props: {},

  data() {
    return {
      isShowSearch: true,
      search: {
        size: "small",
        labelConfig: {
          labelWidth: "90px",
          labelSuffix: ":",
          labelPosition: "right",
        },
        config: [
          /* {
            type: "autoComplete",
            placeholder: "请输入项目名称或项目编号",
            bind: "projectName", // 对应this.search.data对象的field1
          }, */
          {
            type: "select",
            placeholder: "请选择单位名称",
            bind: "createBuid", // 对应this.search.data对象的field1
            isHave: true, //支持下拉框输入
            data: "buNameList",
          },
        ],
        enum: {
          buNameList: [],
        },
        formData: {
          createBuid: "",
          projectName: "",
          orderByColumn: "", // 基于哪个字段排序
          orderBy: "", // DESC降序, ASC升序
        },
        autoCompleteList: [], //输入框远程搜索list
      },
      year: new Date().getFullYear(),
      yearName: new Date().getFullYear(),
      // 年度投资进展
      config1: [
        {
          label: "规划重点任务总数(个)",
          // key: "yearPlanInvesTotal",
          key: "countTasksWithPlan",
          isAmount: true,
          isBlod: true,
          isShort: true,
        },
        /* // { label: "投资项目数量（个）", key: "yearPlanProjectTotal" },
                // { label: "计划内项目数量（个）", key: "planInProjectTotal" }, */
        {
          label: "已完成任务数(个)",
          //key: "yearPlanProjectTotal",
          key: "countTasksWithProject",
          isAmount: true,
          isBlod: true,
          isShort: true,
          /* rate: {
            isLong: true,
            label: "占比",
            key: "percentageCompletedTasks",
          }, */
        },

        {
          label: "项目总数(个)",
          key: "projectTotal",
          isAmount: true,
          isBlod: true,
          isShort: true,
          isHover: true, //提示
          data: [
            {
              label: "计划项目(个)",
              key: "projectJhxmTotal",
            },
            {
              label: "专项增补(个)",
              key: "projectZxzbTotal",
            },
            {
              label: "备案项目(个)",
              key: "projectBaxmTotal",
            },
          ],
        },
        {
          label: "项目总规模(万)",
          // key: "yearPredictInvesAmount",
          key: "projectScaleTotal",
          isMoney: true,
          isBlod: true,
          isShort: true,
          isHover: true, //提示
          data: [
            {
              label: "计划项目(万)",
              key: "projectJhxmScaleTotal",
            },
            {
              label: "专项增补(万)",
              key: "projectZxzbScaleTotal",
            },
            {
              label: "备案项目(万)",
              key: "projectBaxmScaleTotal",
            },
          ],
        },
        /* // {
                //     label: "本年度已完成投资总额（万元）",
                //     key: "currYearCompleteAmount",
                //     isMoney: true,
                //     rate: {
                //         label: "占比（%）",
                //         key: "currYearCompleteAmountRate",
                //     },
                // }, */
        {
          label: " 已支付总规模(万)",
          key: "projectTotalPaymentAmount",
          isMoney: true,
          isBlod: true,
          isShort: true,
          isHover: true, //提示
          data: [
            {
              label: "计划项目(万)",
              key: "projectJhxmPaymentAmount",
            },
            {
              label: "专项增补(万)",
              key: "projectZxzbPaymentAmount",
            },
            {
              label: "备案项目(万)",
              key: "projectXmbaPaymentAmount",
            },
          ],
          // haveSee: true,
          /* rate: {
            label: "占比",
            key: "completeAmountRate",
          }, */
        },
        {
          label: " 申报单位数量(个)",
          key: "applyBizunitTotal",
          isAmount: true,
          isBlod: true,
          isShort: true,
        },
      ],
      // 计划项目申报
      config3: [
        {
          label: "总项目数(个)",
          key: "declareProjectTotal",
          isBlod: true,
          isAmount: true,
          rate: {
            label: "同比",
            key: "projectPercentage",
          },
        },
        {
          label: "总规模(万)",
          key: "declareProjectScaleTotal",
          isBlod: true,
          isMoney: true,
          rate: {
            label: "同比",
            key: "scalePercentage",
          },
        },
        { label: "新建项目数(个)", key: "newDeclareProjectTotal" },
        {
          label: "新建项目规模(万)",
          key: "newDeclareProjectScaleTotal",
        },
        {
          label: "升级改造项目数(个)",
          key: "upgradeProjectTotal",
        },
        {
          label: "升级改造项目规模(万)",
          key: "upgradeProjectScaleTotal",
        },
      ],
      // 计划项目入库
      config4: [
        {
          label: "总项目数(个)",
          key: "rkprojectTotal",
          isBlod: true,
          isAmount: true,
          rate: {
            label: "同比",
            key: "rkprojectPercentage",
          },
        },
        {
          label: "总规模(万)",
          key: "rkprojectScaleTotal",
          isBlod: true,
          isMoney: true,
          rate: {
            label: "同比",
            key: "rkscalePercentage",
          },
        },
        { label: "新建项目数(个)", key: "newRKProjectTotal" },
        {
          label: "新建项目规模(万)",
          key: "newRKProjectScaleTotal",
        },
        {
          label: "升级改造项目数(个)",
          key: "upgradeRKProjectTotal",
        },
        {
          label: "升级改造项目规模(万)",
          key: "upgradeRKProjectScaleTotal",
        },
      ],
      // 项目立项申报
      config5: [
        {
          label: "总项目数(个)",
          key: "allProjectTotal",
          isBlod: true,
          isAmount: true,
          rate: {
            label: "同比",
            key: "allProjectPercent",
          },
        },
        {
          label: "总规模(万)",
          key: "allProjectScaleTotal",
          isBlod: true,
          isMoney: true,
          rate: {
            label: "同比",
            key: "scalePercent",
          },
        },
        {
          label: "计划内项目数(个)",
          key: "planProjectTotal",
          // isShort: true,
        },
        {
          label: "计划内项目规模(万)",
          key: "planProjectScale",
          // isShort: true,
        },
        {
          label: "专项增补项目数(个)",
          key: "projectTotal",
          // isShort: true,
        },
        {
          label: "专项增补项目规模(万)",
          key: "projectScale",
          // isShort: true,
        },
        {
          label: "备案制项目数(个)",
          key: "recordProjectTotal",
          // isShort: true,
        },
        {
          label: "备案制项目规模(万)",
          key: "recordProjectScale",
          // isShort: true,
        },
      ],
      // 项目立项批复
      config6: [
        {
          label: "总项目数(个)",
          key: "projectApprovalTotal",
          isBlod: true,
          isAmount: true,
          rate: {
            label: "同比",
            key: "projectApprovalPercent",
          },
        },
        {
          label: "总规模(万)",
          key: "projectApprovalScaleTotal",
          isBlod: true,
          isMoney: true,
          rate: {
            label: "同比",
            key: "projectScalePercent",
          },
        },
        {
          label: "计划内项目数(个)",
          key: "planProjectApproval",
        },
        {
          label: "计划内项目规模(万)",
          key: "planProjectScale",
        },
        {
          label: "专项增补项目数(个)",
          key: "projectApproval",
        },
        {
          label: "专项增补项目规模(万)",
          key: "projectApprovalScale",
        },
        {
          label: "备案制项目数(个)",
          key: "recordProjectApproval",
        },
        {
          label: "备案制项目规模(万)",
          key: "recordProjectScale",
        },
      ],
      // 年度建设进展
      config2: [
        /* {
                    label: "已开工项目数量（个）",
                    key: "hasBeginProjectTotal",
                    rate: {
                        label: "占比（%）",
                        key: "hasBeginProjectTotalRate",
                    },
                },
                {
                    label: "未开工项目数量（个）",
                    key: "notBeginProjectTotal",
                    rate: {
                        label: "占比（%）",
                        key: "notBeginProjectTotalRate",
                    },
                }, */
        {
          label: "建设中的项目数量（个）",
          // key: "beginingProjectTotal",
          key: "buildStartNumber",
          rate: {
            label: "占比（%）",
            // key: "beginingProjectTotalRate",
            key: "buildStartNumberRate",
          },
        },
        /* {
                    label: "审批(可研、概算)项目数量（个）",
                    key: "auditProjectTotal",
                    rate: { label: "占比（%）", key: "auditProjectTotalRate" },
                },
                {
                    label: "进入验收阶段项目数量（个）",
                    key: "hasYanShouProjectTotal",
                    rate: {
                        label: "占比（%）",
                        key: "hasYanShouProjectTotalRate",
                    },
                }, */
        {
          label: "建设完成项目数量（个）",
          // key: "hasYanShouProjectTotal",
          key: "buildCompleteNumber",
          rate: {
            label: "占比（%）",
            // key: "hasYanShouProjectTotalRate",
            key: "buildCompleteNumberRate",
          },
        },
      ],
      // 年度投资进展数据
      yearPlanInvesData: {},
      // 项目立项申报
      projectDeclarationData: {},
      // 项目立项批复
      projectApprovalData: {},
      // 年度建设进展数据
      yearPlanConsData: {},
      // 计划项目申报
      yearDeclareProjectData: {},
      // 计划项目入库
      yearRKProjectData: {},
      // 年度项目服务类型汇总看板
      typeBarData: [
        {
          ydata: [],
          data1: [],
          data2: [],
          data3: [],
        },
      ],
      // 年度项目建设
      constructionData: {},
      // 项目类型汇总看板
      pieEchartsData: [],
      // 项目风险汇总看板
      riskAndProblemsData: {
        allProblem: 0,
        allRisk: 0,
        data: [],
      },
      // 项目风险表格
      riskAndProblemsTable: [],
      // 资金使用进度
      fundprogress: {},
      // 控制部门动态弹框是否展示
      flag: true,
      // 项目编号
      projectCode: "",
      // 年份判断是否为全部
      isAllYears: 1,
      userInfo: {},
      name: "",
    };
  },
  watch: {
    search: {
      handler(v) {
        console.log(v.formData.projectName, this.projectCode);
        if (v.formData.projectName == "") {
          this.projectCode = "";
        }
        console.log(this.projectCode);
      },
      deep: true,
    },
  },
  mounted() {
    setTimeout(() => {
      this.userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
      console.log(this.userInfo.currentBizunit.buProperty);
      if (this.userInfo.currentBizunit.buProperty != 1) {
        // this.search.config = this.search.config.slice(0, 1);
        // this.search.config.splice(0, 1);
        this.isShowSearch = false;
      }
    }, 300);
    // this.init();
    this.getAllProjectList();
    this.getAllBuNameList();
    this.getYearPlanProgressData();
    this.getProjectDeclarationData();
    this.getProjectApprovalData();
    this.getYearDeclareProjectData();
    this.getYearRKProjectData();
    this.getProjectServiceBoardData();
    this.getyearProjectConstructionData();
    this.getprojectRiskAndProblmTotalData();
    this.getprojectRiskAndProblmTableData();
    this.getfundprogressData();
  },
  methods: {
    // 全局事件
    handleAllClick(event) {
      // console.log("点击了");
      var one = document.querySelector(".switch_year");
      if (one) {
        console.log("11111111", one);
        if (!one.contains(event.target)) {
          this.$refs["tooltip"].show(true);
        }
      }
    },
    handleClose() {
      this.flag = false;
      // 关闭弹框后,清除
      this.projectCode = "";
    },
    yearClick() {
      this.$refs["tooltip"].show();
    },
    // 初始化
    init() {
      this.flag = true;
      if (this.search.formData.projectName == "") {
        this.projectCode = "";
      }
      this.getAllProjectList();
      this.getAllBuNameList();
      this.getYearPlanProgressData();
      this.getProjectDeclarationData();
      this.getProjectApprovalData();
      this.getYearDeclareProjectData();
      this.getYearRKProjectData();
      this.getProjectServiceBoardData();
      this.getyearProjectConstructionData();
      this.getprojectRiskAndProblmTotalData();
      this.getprojectRiskAndProblmTableData();
      this.getfundprogressData();
      /* yearPlanInves({ year: this.year }).then((res) => {
        res.data && (this.yearPlanInvesData = res.data);
      });
      yearPlanCons({ year: this.year }).then((res) => {
        if (res.data) {
          // 建设完成数量
          res.data.buildCompleteNumber =
            res.data.projectSum - res.data.buildStartNumber;
          // 建设中占比
          res.data.buildStartNumberRate =
            res.data.buildStartNumber / res.data.projectSum;
          // 建设完成占比
          res.data.buildCompleteNumberRate =
            res.data.buildCompleteNumber / res.data.projectSum;
          this.yearPlanConsData = res.data;
        }
        // res.data && (this.yearPlanConsData = res.data);
      });
      riskAndProblems({ year: this.year }).then((res) => {
        if (res.data) {
          let xdata = [];
          let data1 = [];
          let data2 = [];
          res.data.map((item) => {
            xdata.push(item.buidNmae);
            data1.push(item.riskNum);
            data2.push(item.problemNum);
          });
          this.riskAndProblemsData = [xdata, data1, data2];
        }
      });
      projectType({ year: this.year }).then((res) => {
        if (res.data) {
          res.data.map((item) => {
            item.value = item.sum;
            item.name = item.chName;
          });
          this.pieEchartsData = res.data;
        }
      }); */
    },
    // 跳转建设单位列表
    see() {
      this.$router.push({ name: "jsdwList", query: { year: this.year } });
    },
    // 切换年份
    itemClick(e) {
      this.yearName = e;
      if (e == "全部") {
        this.isAllYears = 0;
        this.year = "";
      } else {
        this.isAllYears = 1;
        this.year = e;
      }
      this.search.formData.projectName = "";
      this.search.formData.createBuid = "";
      this.projectCode = "";
      this.init();
    },
    // 搜索
    pageChanged() {
      this.init();
    },
    // 处理buname
    buname() {
      if (this.search.formData.buName) {
        this.search.enum.buNameList.map((item) => {
          if (item.value == this.search.formData.buName) {
            this.search.formData.buName = item.label;
          }
        });
      }
    },
    // 获取所有项目名称与编号
    getAllProjectList() {
      let list = [];
      getAllProject({
        year: this.year,
        isAllYears: this.isAllYears,
      }).then((res) => {
        console.log("项目名称与编号", res);
        if (res.data) {
          res.data.map((item, index) => {
            list.push({
              id: index + 1,
              value: item.projectName,
              code: item.projectCode ? item.projectCode : "",
            });
          });
        }
        this.search.autoCompleteList = list;
      });
    },
    // 获取所有申报单位
    getAllBuNameList() {
      getAllBuName({
        year: this.year,
        isAllYears: this.isAllYears,
      }).then((res) => {
        this.search.enum.buNameList = [];
        console.log("申报单位", res.data);
        if (res.data) {
          res.data.map((item) => {
            this.search.enum.buNameList.push({
              label: item.buName,
              value: item.buid,
            });
          });
        }
        console.log(".....", this.search.enum.buNameList);
      });
    },
    handleSelect(item) {
      console.log("选择的项目", item);
      this.projectCode = item.code;
    },
    // 年度投资进展统计
    getYearPlanProgressData() {
      // this.buname();
      getYearPlanProgress({
        year: this.year,
        projectCode: this.projectCode,
        isAllYears: this.isAllYears,
        ...this.search.formData,
      }).then((res) => {
        console.log("项目申报总预览", res.data);
        if (res.data) {
          res.data.completeAmountRate = res.data.projectScaleTotal
            ? (res.data.payScaleTotal / res.data.projectScaleTotal).toFixed(2) +
              "%"
            : "0.00%";
          this.yearPlanInvesData = res.data;
        }
      });
    },
    // 项目立项申报
    getProjectDeclarationData() {
      // this.buname();
      getProjectDeclaration({
        year: this.year,
        projectCode: this.projectCode,
        isAllYears: this.isAllYears,
        ...this.search.formData,
      }).then((res) => {
        console.log("项目立项申报", res.data);
        if (res.data) {
          this.projectDeclarationData = res.data;
        }
      });
    },
    // 项目立项批复
    getProjectApprovalData() {
      // this.buname();
      getProjectApproval({
        year: this.year,
        projectCode: this.projectCode,
        isAllYears: this.isAllYears,
        ...this.search.formData,
      }).then((res) => {
        console.log("项目立项批复", res.data);
        if (res.data) {
          this.projectApprovalData = res.data;
        }
      });
    },
    // 计划项目申报
    getYearDeclareProjectData() {
      // this.buname();
      getYearDeclareProject({
        year: this.year,
        projectCode: this.projectCode,
        isAllYears: this.isAllYears,
        ...this.search.formData,
      }).then((res) => {
        console.log("计划项目申报", res.data);
        if (res.data) {
          this.yearDeclareProjectData = res.data;
        }
      });
    },
    // 计划项目入库
    getYearRKProjectData() {
      // this.buname();
      getYearRKProject({
        year: this.year,
        projectCode: this.projectCode,
        isAllYears: this.isAllYears,
        ...this.search.formData,
      }).then((res) => {
        console.log("计划项目入库", res.data);
        if (res.data) {
          this.yearRKProjectData = res.data;
        }
      });
    },
    // 年度项目服务类型汇总看板
    getProjectServiceBoardData() {
      // this.buname();
      getProjectServiceBoard({
        year: this.year,
        projectCode: this.projectCode,
        isAllYears: this.isAllYears,
        ...this.search.formData,
      }).then((res) => {
        console.log("年度项目服务类型汇总看板", res.data);
        if (res.data) {
          this.typeBarData[0].ydata = [
            "第三方服务类",
            "专业软件开发服务及相关运行维护服务类、数据治理类、系统业务运营服务类",
            "公共支撑平台开发服务类、数据治理类",
            "公共支撑平台开发服务类、通用应用软件开发服务及相关运行维护服务类",
            "专业软件开发服务及相关运行维护服务类、系统业务运营服务类",
            "专业软件开发服务及相关运行维护服务类、数据治理类",
            "综合类",
            "通用正版软件服务类",
            "公共支撑平台开发服务类",
            "公共/专业基础设施服务类",
            "通用应用软件开发服务及相关运行维护服务类",
            "系统业务运营服务类",
            "数据治理类",
            "专业软件开发服务及相关运行维护服务类",
          ];
          this.typeBarData[0].data1 = res.data.planProject;
          this.typeBarData[0].data2 = res.data.unPlanProject;
          this.typeBarData[0].data3 = res.data.BAProject;
          console.log(this.typeBarData);
        }
      });
    },
    // 年度项目建设
    getyearProjectConstructionData() {
      // this.buname();
      getyearProjectConstruction({
        year: this.year,
        projectCode: this.projectCode,
        isAllYears: this.isAllYears,
        ...this.search.formData,
      }).then((res) => {
        console.log("年度项目建设", res);
        if (res.data) {
          this.constructionData = res.data;
        }
      });
    },
    // 风险与问题柱状图
    getprojectRiskAndProblmTotalData() {
      // this.buname();
      getprojectRiskAndProblmTotal({
        year: this.year,
        projectCode: this.projectCode,
        isAllYears: this.isAllYears,
        ...this.search.formData,
      }).then((res) => {
        console.log("风险与问题柱状图", res.data);
        if (res.data) {
          let data1 = [];
          let data2 = [];
          data1 = [res.data.lowRisk, res.data.middleRisk, res.data.highRisk];
          data2 = [
            res.data.lowProblem,
            res.data.middleProblem,
            res.data.highProblem,
          ];
          this.riskAndProblemsData.data = [data1, data2];
          this.riskAndProblemsData.allRisk = res.data.allRisk;
          this.riskAndProblemsData.allProblem = res.data.allProblem;
        }
      });
    },
    // 风险与问题表格
    getprojectRiskAndProblmTableData() {
      // this.buname();
      getprojectRiskAndProblmTable({
        year: this.year,
        projectCode: this.projectCode,
        isAllYears: this.isAllYears,
        ...this.search.formData,
      }).then((res) => {
        console.log("风险与问题表格", res.data);
        this.riskAndProblemsTable = res.data;
      });
    },
    // 资金使用进度
    getfundprogressData() {
      // this.buname();
      getfundprogress({
        year: this.year,
        projectCode: this.projectCode,
        isAllYears: this.isAllYears,
        ...this.search.formData,
      }).then((res) => {
        console.log("资金使用进度", res);
        if (res.data) {
          this.fundprogress = res.data;
        }
      });
    },
    // 更新tab页签
    toWorkBench() {
      this.$router.push({
        name: "workBench",
      });
    },
    checkCodeInArr(code) {
      // 权限
      let arr = this.permission_views;
      return checkCodeInArr(code, arr);
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep {
  .el-drawer {
    max-height: calc(100% - 25px);
    bottom: 25px;
    left: 105px;
    width: calc(100% - 129px);
    overflow-y: auto;
    background: #ffffff;
    box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    padding: 16px 16px 0 16px;
  }
}
.flexCenter {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 88px;
  img {
    width: 80px;
    vertical-align: middle;
  }
  span {
    color: #666;
    font-size: 14px;
  }
}
.departmentDialog {
  padding: 16px 16px 0 16px;
  header {
    .header_first {
      // width: 80%;
      display: flex;
      align-items: center;
      margin-bottom: 16px;
      .tooltip {
        top: 54px;
        left: 46px;
      }
      .switch_year {
        font-size: 24px;
        color: #1890ff;
        cursor: pointer;
        padding-right: 10px;
        margin: 0 4px 0 8px;
        i {
          font-size: 16px;
        }
      }
      .date {
        width: 24px;
        height: 24px;
        margin-top: -5px;
      }
      span {
        font-weight: 500;
        position: relative;
      }
      h3 {
        font-size: 22px;
        font-weight: 500;
        color: #333333;
      }
      .searchPage {
        flex: 1;
        ::v-deep .el-form-item {
          margin-bottom: 0;
        }
      }
      .switch_box {
        width: 124px;
        height: 40px;
        margin-right: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        cursor: pointer;
        background: linear-gradient(
          270deg,
          #ffa922 0%,
          #ff7d22 100%,
          #ff7d22 100%
        );
        border-radius: 100px 32px 32px 100px;

        i {
          margin-right: 3px;
        }

        &:hover {
          background: linear-gradient(
            270deg,
            #ff7d22 0%,
            #ff7d22 0%,
            #ffa922 100%
          );
          box-shadow: -10px 2px 20px 0px rgba(255, 128, 34, 0.2);
        }
      }
    }
  }
  main {
    display: flex;
    flex-wrap: wrap;
    .departmentCard {
      margin-bottom: 16px;
      margin-right: 16px;
    }
    .departmentCard:nth-child(4) {
      height: 537px;
    }
    .departmentCard:nth-child(5) {
      height: 537px;
    }
    .departmentCard:nth-child(6) {
      height: 537px;
    }
    .departmentCard:nth-child(7) {
      width: calc(38% - 8px);
      height: 368px;
    }
    .departmentCard:nth-child(8) {
      width: calc(23% - 8px);
      // margin-right: 0px;
      height: 368px;
    }
    .departmentCard:nth-child(9) {
      width: calc(38% - 8px);
      // margin-right: 0px;
      height: 368px;
    }
    // > :nth-last-of-type(-n+2) {
    //   margin-bottom: 0;
    // }
    > :nth-of-type(3n) {
      margin-right: 0;
    }
    .mb0 {
      margin-bottom: 0;
    }
  }
}
.construction {
  display: flex;
  align-items: center;
  font-weight: 500;
  font-family: PingFang SC-Medium, PingFang SC !important;
  // 项目总数
  .num {
    display: flex;
    height: 30px;
    align-items: center;
    color: #333333;
    font-size: 16px;
    .icon {
      background-color: #1890ff;
      border-radius: 8px;
      width: 30px;
      height: 30px;
      padding: 6px;
      margin-right: 6px;
      img {
        width: 18px;
      }
    }
    span {
    }
    span:nth-child(2) {
      color: #1890ff;
    }
  }
  div:nth-child(2) {
    margin: auto 6%;
    span:nth-child(2) {
      color: #1890ff;
    }
  }
  div:nth-child(3) {
    span:nth-child(2) {
      color: red;
    }
  }
}
.middle {
  display: flex;
  padding-left: 5%;
  #FunnelPlots {
    flex: 1;
  }
  .tree {
    // --声明变量 ,变量名前面要加两根连词线（--）
    --spacing: 1.5rem;
    --radius: 10px;
  }
  .tree li {
    // var()用于读取变量
    /**
    var()函数用于读取变量。
    var()函数还可以使用第二个参数，表示变量的默认值。如果该变量不存在，就会使用这个默认值。
    第二个参数不处理内部的逗号或空格，都视作参数的一部分。
  */
    display: block;
    position: relative;
    // padding-left: calc(2.5 * var(--spacing) - var(--radius));
  }
  .tree ul {
    margin-left: calc(var(--radius) - var(--spacing));
    padding-left: 0;
  }
  .tree ul li {
    // border-left: 2px solid #ddd;
    margin-left: 3px;
  }

  .tree ul li:last-child {
    border-color: transparent;
  }
  // 第一个
  .tree ul li::before {
    content: "";
    display: block;
    position: absolute;
    top: calc(var(--spacing) / -5);
    left: calc(var(--spacing) - 0.3rem);
    width: calc(var(--spacing));
    height: calc(var(--spacing) - 0.5rem);
    border: solid #91affa;
    border-width: 0 0 1px 1px;
  }
  // 第二个
  .tree:nth-child(2) ul li::before {
    content: "";
    display: block;
    position: absolute;
    top: calc(var(--spacing) / -5);
    left: calc(var(--spacing) - 0.3rem);
    width: calc(var(--spacing) + 1rem);
    height: calc(var(--spacing) - 0.5rem);
    border: solid #6ac5f9;
    border-width: 0 0 1px 1px;
  }
  // 第三个
  .tree:nth-child(3) ul li::before {
    content: "";
    display: block;
    position: absolute;
    top: calc(var(--spacing) / -5);
    left: calc(var(--spacing) - 0.3rem);
    width: calc(var(--spacing));
    height: calc(var(--spacing) - 0.5rem);
    border: solid #c69aff;
    border-width: 0 0 1px 1px;
  }
  // 第三个的第二个分支
  .tree:nth-child(3) ul li:nth-child(2)::before {
    content: "";
    display: block;
    position: absolute;
    // top: calc( var(--radius) / -1 );
    top: -12px;
    left: calc(var(--spacing) - 0.3rem);
    width: calc(var(--spacing));
    height: calc(var(--spacing));
    border: solid #c69aff;
    border-width: 0 0 1px 1px;
  }
  .treeItems {
    background-color: #f7f7f7;
    width: 164px;
    border-radius: 8px;
    padding: 8px;
    margin-top: 16px;
    color: #333333;
    img {
      margin-right: 3px;
    }
    .treeItem {
      color: #666;
      padding-left: calc(2.55 * var(--spacing) - var(--radius));
    }
  }
  .tree:nth-child(2) {
    .treeItems {
      .treeItem {
        color: #666;
        padding-left: calc(3.2 * var(--spacing) - var(--radius));
      }
    }
  }
  .tree:nth-child(3) {
    .treeItems {
      .treeItem {
        color: #666;
        padding-left: calc(2.6 * var(--spacing) - var(--radius));
      }
    }
  }
}
.riskAndQue {
  display: flex;
  .left {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-left: 2%;
    .num {
      display: flex;
      width: 100%;
      // justify-content: space-around;
      .numItem {
        display: flex;
        align-items: center;
        color: #333333;
        font-size: 16px;
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 500;
        margin-right: 10%;
        .imgbg {
          background-color: #1890ff;
          width: 30px;
          height: 30px;
          border-radius: 8px;
          padding: 5px;
          margin-right: 6px;
          img {
            width: 20px;
          }
        }
        .numcolor {
          color: #1890ff !important;
        }
      }
    }
  }
}
::v-deep .sr_search .el-select {
  width: 240px;
}
</style>
