<template>
  <div class="singleProject">
    <!-- 头部项目信息 -->
    <div class="work-inner">
            <el-row>
                <el-col :span="24">
                    <div class="nav">
                        <img src="../../assets/singleProject/project.png" alt  />
                        <div class="nav_title">
                            <div>
                                <span class="title">
                                    {{project.projectName}}
                                </span>
                            </div>
                            <div>
                                <div class="workNumbering">
                                    <label>项目编号：</label>
                                    <span>
                                        {{project.projectCode}}
                                    </span>
                                    <span class="line"></span>
                                    <label>总投资金额（万元）：</label>
                                    <span>
                                        {{project.totalAmount | floattwo}}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
    <!-- 概览配置 -->
    <div class="singleProject-overview-page">
      <div class="singleProject-overview-page-content">
        <div class="singleProject-overview-page-content-fl">
          <contentCard :title="'资金概览'">
            <div slot="content">
              <amountStandTable :amounts="amounts"></amountStandTable>
            </div>
          </contentCard>
          <contentCard :title="'实施管理'">
            <div slot="content">
              <Implementation></Implementation>
            </div>
          </contentCard>
          <contentCard :title="'验收管理'">
            <div slot="content">
              <acceptance></acceptance>
            </div>
          </contentCard>
          <contentCard :title="'附件管理'">
            <div slot="content">
              <enclosure></enclosure>
            </div>
          </contentCard>
        </div>
        <div class="singleProject-overview-page-content-fr">
          <!--2.25 <contentCard :title="'项目标签'" class="projectLabels1">
            <div slot="content">
              <projectLabels></projectLabels>
            </div>
          </contentCard> -->
          <!-- <contentCard :title="'项目信息报送'" :btnName="'报送'" @handleClick="infoTalk" class="projectInfo1"> -->
          <contentCard :title="'项目周报'" :btnName="'报送'" @handleClick="infoTalk" class="projectInfo1">
            <div slot="content">
              <projectInfo></projectInfo>
            </div>
          </contentCard>
          <!-- <contentCard :title="'过程文档报备'" class="fileUpload1">
            <div slot="content">
              <fileUpload></fileUpload>
            </div>
          </contentCard> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import amountStandTable from "@/components/amountCardsingle";
import contentCard from "./components/contentCard.vue"
import Implementation from "./components/Implementation.vue"
import acceptance from "./components/acceptance.vue"
import enclosure from "./components/enclosure.vue"
import projectLabels from "./components/projectLabels.vue"
import projectInfo from "./components/projectInfo.vue"
import fileUpload from "./components/fileUpload.vue"
import {api_getDetailById} from "@/api/projectLibrary/index";
import {getstatisticsAmount} from "@/api/singleProject.js"
export default {
  data() {
    return {
      // 查询接口返回的详情数据
      project: {
        projectName: "",
        title:'',
        projectCode: "",
        totalAmount: ''
      },
      type: 2, // 1为规划头部，2为项目头部
      tag: [],
      amounts: {
      } // 金额
    };
  },
  components: {
    amountStandTable,
    contentCard,
    Implementation,
    acceptance,
    enclosure,
    projectLabels,
    projectInfo,
    fileUpload
  },
  filters: {
    floattwo(value) {
      if (isNaN(value)) {
        return '0.00'
      } else {
        return Math.abs(value).toFixed(2)
      }
    }
  },
  created() {
    this.getstatisticsAmount()
    this.getProjectDetail()
  },
  methods: {
    // 点击报送按钮跳转到报送页面
    infoTalk() {
      window.location.href=`/subdis/#/submitAdd?projectId=${this.$route.query.projectId}`
    },
    // 获取项目信息
    getProjectDetail() {
      api_getDetailById({id:this.$route.query.projectId}).then(res=>{
        this.project.projectName = res.data.projectName
        this.project.projectCode = res.data.projectCode
      })
    },
    // 获取项目金额信息
    getstatisticsAmount() {
      getstatisticsAmount({projectId:this.$route.query.projectId}).then(res=>{
        res.data.deductionAmount=res.data.totalInvestmentAmount-res.data.totalApprovedAmount
        this.amounts = res.data
        this.project.totalAmount = res.data.totalInvestmentAmount
      })
    }
  },
};
</script>

<style lang="scss">
.singleProject {
  min-width: 950px;
  width: 100%;
  .work-inner{
    margin-bottom: 16px;
    .nav{
      display: flex;
      align-items: center;
      img{
        width: 48px;
        height: 48px;
        margin-right: 8px;
      }
      .nav_title{
        .title{
          font-size: 24px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #333333;
          line-height: 32px;
        }
        .workNumbering{
          display: flex;
          align-items: center;
          label{
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #999999;
            line-height: 22px;
          }
          span{
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
            line-height: 22px;
          }
          .line{
            display: block;
            width: 1px;
            height: 9px;
            background: #CCCCCC;
            margin: 0 16px;
          }
        }
      }
    }
  }
  .singleProject-overview-page {
    width: 100%;
    .singleProject-overview-page-content{
      display:flex;
      .singleProject-overview-page-content-fl{
        width: calc(100% - 410px);
      }
      .singleProject-overview-page-content-fr{
        width: 410px;
        margin-left:16px;
        .projectLabels1{
          padding-bottom: 8px;
        }
        .projectInfo1{
          padding-bottom: 1px;
        }
      }
    }   
  }
}
</style>