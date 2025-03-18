<template>
  <div class="total-page">
    <!-- <sr-nav-page :project="srNavPageObj" :type="2"></sr-nav-page> -->
    <TestFormView
      v-if="editableTabs.length"
      :editableTabs="[]"
      :slotList="['基本信息', '评审项目']"
      activeNameT="基本信息"
      :hideTrackIconActivity="true"
      :trackData2="trackData2"
    >
      <div slot="基本信息">
        <BorderLine :title="'评审活动信息'" :isLine="true">
          <SrView :formData="formData" :ruleForm="ruleForm"></SrView>
        </BorderLine>
        <BorderLine :title="'评审专家信息'" :isLine="true">
          <SrTable
            class="table"
            @pageChanged="pageChanged"
            :data="table.data"
            @sizeChanged="sizeChanged"
            :config="table.tableConfig"
            :page="table.page"
          >
            <template slot="cellSlot" slot-scope="scope">
              <div v-if="scope.scope.item.prop == 'statusName'">
                <i
                  v-if="scope.scope.row.status == 2"
                  class="base-iconfont icon-reeor-fill"
                ></i>
                <i
                  v-else-if="scope.scope.row.status == 1000"
                  class="base-iconfont icon-success-fill"
                ></i>
                <span>{{ scope.scope.row.statusName }}</span>
              </div>
            </template>
          </SrTable>
        </BorderLine>
      </div>
      <div slot="评审项目">
        <div style="display: flex; justify-content: space-between">
          <left :projectList="projectList" @handleDetail="handleDetail" />
          <right :projectId="projectId" v-if="projectId" :source="source" />
        </div>
      </div>
    </TestFormView>
    <sr-work-flow
      ref="work_flow"
      :hideFrom="true"
      :buttonList="buttonList"
      backName="activityList"
    ></sr-work-flow>
  </div>
</template>

<script>
import TestFormView from "../../../components/srFormView.vue";
import { api_getCustomFormTemplate } from "@/api/index";
import { detail, queryByReviewId, getReviewRecord } from "@/api/activityList";
import BorderLine from "@/components/borderLine";
import left from "../components/Left";
import right from "../components/Right";
export default {
  components: {
    TestFormView,
    BorderLine,
    left,
    right,
  },
  computed: {
    templateId() {
      return this.$route.query.templateId;
    },
  },
  provide() {
    return {
      baseUrl: "",
      imgBaseUrl: "",
      uploadRequest: "",
      uploadBaseUrl: "",
    };
  },
  data() {
    return {
      editableTabs: [],
      activeName: "0",
      srNavPageObj: {},
      fromData: {},
      buttonList: [
        {
          role: "",
          btns: [],
          nodes: [],
        },
      ],
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
            {
              index: 1,
              label: "专家姓名",
              prop: "expertName",
            },
            {
              index: 2,
              label: "手机号",
              prop: "phone",
            },
            {
              index: 3,
              label: "专家职称类型",
              prop: "professionalLevelName",
            },
            /*  {
              index: 4,
              label: "所属分组",
              prop: "groupName",
            }, */
            {
              index: 5,
              label: "技术方向",
              prop: "jsName",
            },
            {
              index: 6,
              label: "行业领域",
              prop: "hyName",
            },
            {
              index: 7,
              label: "评审次数",
              prop: "reviewTimes",
            },
            {
              index: 8,
              label: "评审平均分",
              prop: "avgScore",
            },
            {
              index: 9,
              label: "税后劳务费",
              prop: "fee",
            },
            {
              index: 10,
              label: "邀请状态",
              prop: "statusName",
            },
          ],
          selectionConfig: {
            display: false,
            width: "70",
          },
          operateConfig: {
            display: false,
            label: "操作",
            width: "170",
            fixed: "right",
            allTableHeader: "",
            saveHeaderList: this.saveHeaderList,
            export: this.export,
            exportPermissionCode: "M005_001_004",
          },
          innerBtn: [],
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
      provinceList: [
        {
          value: "选项1",
          label: "黄金糕",
        },
        {
          value: "选项2",
          label: "双皮奶",
        },
        {
          value: "选项3",
          label: "蚵仔煎",
        },
        {
          value: "选项4",
          label: "龙须面",
        },
        {
          value: "选项5",
          label: "北京烤鸭",
        },
      ],
      prov: "",
      formData: {},
      ruleForm: {},
      projectList: [], //项目列表
      reviewExpertList: [], //评审专家信息
      projectId: null,
      source: null,
      trackData2: [],
    };
  },
  created() {
    detail({ id: this.$route.query.id }).then((res) => {
      if (res.data.file) {
        res.data.file = JSON.parse(res.data.file);
      } else {
        res.data.file = [];
      }
      this.projectList = res.data.list;
      res.data.projectList = res.data.list
        .map((item) => {
          return item.projectName;
        })
        .join();
      res.data.reviewActivitiesType =
        res.data.reviewActivitiesType == "0"
          ? "函评"
          : res.data.reviewActivitiesType == "1"
          ? "现场评审"
          : "";
      res.data.meetingLength =
        res.data.meetingLength == "0"
          ? "4小时以下"
          : res.data.meetingLength == "1"
          ? "4小时以上"
          : "";
      res.data.meetingType =
        res.data.meetingType == "0"
          ? "线上评审"
          : res.data.meetingType == "1"
          ? "线下评审"
          : "";
      res.data.feePercentage = res.data.feePercentage
        ? res.data.feePercentage + "%"
        : "";
      api_getCustomFormTemplate({
        moduleCode: "24001",
        // templateId: this.templateId,
      }).then((res1) => {
        this.editableTabs = JSON.parse(res1.data.templateDetail);
        this.editableTabs.forEach((item) => {
          item.formArr = JSON.parse(item.formArr);
          item.formArr[0].selectData.formView.data = res.data;
        });
        console.log("有啥", this.editableTabs);
        for (
          let i = 0;
          i < this.editableTabs[0].formArr[0].selectData.formView.config.length;
          i++
        ) {
          // 会议方式线上评审隐藏线下评审地址
          if (
            this.editableTabs[0].formArr[0].selectData.formView.config[i] &&
            this.editableTabs[0].formArr[0].selectData.formView.config[i]
              .value == "meetingUrl"
          ) {
            if (
              this.editableTabs[0].formArr[0].selectData.formView.data
                .meetingType == "线下评审"
            ) {
              this.editableTabs[0].formArr[0].selectData.formView.config[
                i
              ].isHide = true;
            }
          }
          // 会议方式线下评审隐藏线上评审地址
          if (
            this.editableTabs[0].formArr[0].selectData.formView.config[i] &&
            this.editableTabs[0].formArr[0].selectData.formView.config[i]
              .value == "meetingAddress"
          ) {
            if (
              this.editableTabs[0].formArr[0].selectData.formView.data
                .meetingType == "线上评审"
            ) {
              this.editableTabs[0].formArr[0].selectData.formView.config[
                i
              ].isHide = true;
            }
          }
          // 现场评审时隐藏评审次数
          if (
            this.editableTabs[0].formArr[0].selectData.formView.config[i] &&
            this.editableTabs[0].formArr[0].selectData.formView.config[i]
              .value == "reviewTimes"
          ) {
            if (
              this.editableTabs[0].formArr[0].selectData.formView.data
                .reviewActivitiesType == "现场评审"
            ) {
              this.editableTabs[0].formArr[0].selectData.formView.config[
                i
              ].isHide = true;
            }
          }
        }
        this.formData =
          this.editableTabs[0].formArr[0].selectData.formView.config;
        // console.log("配置", this.formData);
        this.ruleForm =
          this.editableTabs[0].formArr[0].selectData.formView.data;
        // console.log("数据", this.ruleForm);
      });
    });
    this.getReviewRecordList();
    this.getReviewRecordData();
  },
  methods: {
    getReviewRecordData() {
      let params = {
        reviewId: this.$route.query.id,
      };
      getReviewRecord(params).then((res) => {
        console.log("评审记录", res);
        this.trackData2 = res.data;
      });
    },
    handleDetail(val) {
      this.projectId = val.projectId;
      this.source = val.source;
      console.log("接收子传递的数据", this.projectId, this.source);
    },
    // 评审专家信息
    getReviewRecordList() {
      queryByReviewId({
        reviewId: this.$route.query.id,
      }).then((res) => {
        console.log("评审专家信息", res);
        if (res.data[1] && res.data[1].length) {
          this.table.data = res.data[1];
        }
      });
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
  },
  beforeRouteLeave(to, form, next) {
    if (this.$refs.work_flow) {
      this.$refs.work_flow.$el.style.display = "none";
    }
    next();
  },
};
</script>
<style lang="scss" scoped>
.searchPage {
  display: flex;
  justify-content: space-between;
}
.searchRightBtn {
  display: inline-block;
  button {
    width: 76px;
    height: 32px;
    border-radius: 16px;
    padding: 5px 24px;
  }
}
.tabsLabel {
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #333333;
  line-height: 24px;
  i {
    margin-right: 4px;
  }
}
::v-deep .el-tabs__header {
  margin-bottom: 8px;
}
.tabsDataTitle {
  margin-top: 8px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #333333;
  line-height: 22px;
}
.sr-view {
  padding: 8px 0;
}
</style>