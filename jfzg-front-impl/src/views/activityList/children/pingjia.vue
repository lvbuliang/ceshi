<template>
  <div class="total-page extractPingjia">
    <!-- <sr-nav-page :project="srNavPageObj" :type="2"></sr-nav-page> -->
    <el-timeline class="sr_time_line">
      <el-timeline-item>
        <slot>
          <h1 class="sr_time_line_title">
            <img
              src="./tips.png"
              class="expert_tips_img"
              width="22px"
              height="22px"
              alt=""
            />活动信息
          </h1>
          <TestFormView
            v-if="editableTabs.length"
            :editableTabs="editableTabs"
            :fromData="fromData"
          >
          </TestFormView>
        </slot>
      </el-timeline-item>
      <el-timeline-item>
        <slot>
          <h1 class="sr_time_line_title">
            <img
              src="./tips.png"
              class="expert_tips_img"
              width="22px"
              height="22px"
              alt=""
            />专家评论
          </h1>
          <el-radio-group
            v-model="label"
            style="margin-bottom: 8px; width: 100%"
          >
            <el-radio-button
              v-for="(item, index) in byReviewIdNotGroupList"
              :key="index"
              :label="item.expertId"
              >{{ item.expertName }}</el-radio-button
            >
          </el-radio-group>
          <el-table
            :data="tableData"
            :span-method="arraySpanMethod"
            border
            style="width: 100%"
          >
            <el-table-column
              prop="chName"
              label="分类"
              width="200"
            ></el-table-column>
            <el-table-column prop="memo" label="考核情形"></el-table-column>
            <el-table-column prop="sequenceNo" label="满分" width="50">
              <template slot-scope="scope">
                <div>
                  {{ scope.row.score ? scope.row.score : "-" }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="evaluationScore" label="评价" width="200">
              <template slot-scope="scope">
                <div v-if="scope.row.sequenceNo || scope.row.score">
                  <el-input-number
                    v-model="scope.row.evaluationScore"
                    :min="0"
                    :max="scope.row.sequenceNo"
                  ></el-input-number>
                </div>
                <div v-else>
                  <el-radio-group v-model="scope.row.evaluationFlag">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </slot>
      </el-timeline-item>
    </el-timeline>

    <sr-work-flow
      ref="work_flow"
      :hideFrom="true"
      :clickMethods="clickmethods"
      :buttonList="buttonList"
      backName="activityList"
    ></sr-work-flow>
  </div>
</template>

<script>
import TestFormView from "../../../components/srFormView.vue";
import { api_getCustomFormTemplate } from "@/api/index";
import {
  detail,
  queryByReviewIdNotGroups,
  detailByReviewActivitiesId,
  queryCodeList,
  toSave,
  toSave2,
} from "@/api/activityList";
export default {
  components: {
    TestFormView,
  },
  computed: {
    templateId() {
      return this.$route.query.templateId;
    },
  },
  watch: {
    label: {
      handler(newVal, oldVal) {
        if (!this.firstEnter) {
          //初始化不保存
          let params = this.tableData.map((item) => {
            return {
              id: item.id || null,
              classificationCode: item.classificationCode || item.parentCode,
              assessmentCode: item.assessmentCode || item.itemCode,
              evaluationFlag: item.evaluationFlag || null,
              evaluationScore: item.evaluationScore || item.sequenceNo,
              expertJfid: Number(oldVal),
              reviewActivitiesId: this.$route.query.id,
              topic: item.topic, //字典topic
            };
          });
          toSave2({ list: params }).then(({ msg, data }) => {
            if (data) {
              this.getDetailByReviewActivitiesId(newVal, "axious");
            }
          });
        } else {
          this.getDetailByReviewActivitiesId(newVal);
        }
      },
      // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法
      deep: true,
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
      firstEnter: true,
      editableTabs: [],
      activeName: "0",
      srNavPageObj: {},
      fromData: {},
      buttonList: [
        {
          role: "",
          btns: [
            {
              btnValue: "tg",
              btnName: "提交",
              btnType: "primary",
              btnEventType: "tg",
            },
          ],
          nodes: [],
        },
      ],
      ztdf: null,
      clickmethods: {
        tg: this.tg,
      },
      label: "",
      byReviewIdNotGroupList: [],
      tableData: [],
    };
  },

  methods: {
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    getQueryByReviewIdNotGroups() {
      queryByReviewIdNotGroups({ reviewId: this.$route.query.id }).then(
        ({ data }) => {
          this.byReviewIdNotGroupList = data;
          this.label = data[0].expertId.toString();
        }
      );
    },
    getDetailByReviewActivitiesId(label, str) {
      this.firstEnter = false;
      var params = {
        reviewActivitiesId: this.$route.query.id,
      };
      if (str) {
        params.axious = true;
      }
      detailByReviewActivitiesId(params).then(({ data }) => {
        if (data) {
          if (data.length) {
            var iscurrent = -1;
            for (var i = 0; i < data.length; i++) {
              if (data[i].expertJfid == label) {
                iscurrent = i;
              }
            }
            if (iscurrent >= 0) {
              let count = [];
              let resList = [...data[iscurrent].JFZG_EVALUATION_SCORE];
              let resList1 = [...data[iscurrent].JFZG_EVALUATION_FLAG];
              resList.forEach((item) => {
                item.list.forEach((i) => {
                  i.chName = item.classificationName;

                  i.memo = i.assessmentName;
                  i.topic = "JFZG_EVALUATION_SCORE";
                  if (i.score && !i.evaluationScore) {
                    i.evaluationScore = i.sequenceNo;
                  } else {
                    i.evaluationFlag = null;
                  }
                  if (i.chName == "总得分") {
                    this.ztdf = i;
                  }
                  count.push(i);
                });
              });
              resList1.forEach((item) => {
                item.list.forEach((i) => {
                  i.chName = item.classificationName;
                  i.memo = i.assessmentName;
                  i.topic = "JFZG_EVALUATION_FLAG";

                  count.push(i);
                });
              });
              count = count.filter((item) => item.chName != "总得分");
              this.tableData = this.$SrUtils.merge(["chName"], count);
            } else {
              this.getQueryCodeList();
            }
          } else {
            this.getQueryCodeList();
          }
        }
      }, label);
    },
    getQueryCodeList() {
      let SCOREDATA = null;
      let FLAGDATA = null;
      let count = [];
      queryCodeList({ topic: "JFZG_EVALUATION_SCORE" }).then(({ data }) => {
        //评分
        SCOREDATA = data;
        queryCodeList({ topic: "JFZG_EVALUATION_FLAG" }).then(({ data }) => {
          //是否
          FLAGDATA = data;
          [...SCOREDATA].forEach((item) => {
            item.childs.forEach((i) => {
              i.chName = item.chName;
              i.score = i.sequenceNo;
              i.topic = "JFZG_EVALUATION_SCORE";
              if (i.sequenceNo) {
                i.evaluationScore = i.sequenceNo;
              } else {
                i.evaluationFlag = null;
              }
              if (i.chName == "总得分") {
                this.ztdf = i;
              }
              count.push(i);
            });
          });
          [...FLAGDATA].forEach((item) => {
            item.childs.forEach((i) => {
              i.chName = item.chName;
              i.score = i.sequenceNo;
              i.topic = "JFZG_EVALUATION_FLAG";
              if (i.sequenceNo) {
                i.evaluationScore = i.sequenceNo;
              } else {
                i.evaluationFlag = null;
              }
              count.push(i);
            });
          });
          count = count.filter((item) => item.chName != "总得分");
          this.tableData = this.$SrUtils.merge(["chName"], count);
        });
      });
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (row[column.property + "_merge"]) {
        return row[column.property + "_merge"];
      } else {
        return { rowspan: 1, colspan: 1 };
      }
    },
    tg() {
      let params = this.tableData.map((item) => {
        return {
          id: item.id || null,
          classificationCode: item.classificationCode || item.parentCode,
          assessmentCode: item.assessmentCode || item.itemCode,
          evaluationFlag: item.evaluationFlag || null,
          evaluationScore: item.evaluationScore || 0,
          expertJfid: Number(this.label),
          reviewActivitiesId: this.$route.query.id,
          topic: item.topic, //字典topic
        };
      });
      var num = 0;
      for (var i = 0; i < params.length; i++) {
        if (params[i].topic == "JFZG_EVALUATION_SCORE") {
          num = num + Number(params[i].evaluationScore);
        }
      }
      var map = {
        id: this.ztdf.id || null,
        classificationCode:
          this.ztdf.classificationCode || this.ztdf.parentCode,
        assessmentCode: this.ztdf.assessmentCode || this.ztdf.itemCode,
        evaluationFlag: this.ztdf.evaluationFlag || null,
        evaluationScore: num || 0,
        expertJfid: Number(this.label),
        reviewActivitiesId: this.$route.query.id,
        topic: this.ztdf.topic, //字典topic
      };
      params.push(map);

      toSave({ list: params }).then(({ msg, data }) => {
        if (data) {
          this.$router.push({ name: "activityList" });
        }
      });
    },
  },

  created() {
    detail({ id: this.$route.query.id }).then((res) => {
      if (res.data.file) {
        res.data.file = JSON.parse(res.data.file);
      } else {
        res.data.file = [];
      }
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

      res.data.projectList = res.data.list
        .map((item) => {
          return item.projectName;
        })
        .join();
      api_getCustomFormTemplate({
        moduleCode: "24001",
      }).then((res1) => {
        this.editableTabs = JSON.parse(res1.data.templateDetail);
        this.editableTabs.forEach((item) => {
          item.formArr = JSON.parse(item.formArr);
          item.formArr[0].selectData.formView.data = res.data;
        });
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
      });
    });
  },
  mounted() {
    this.firstEnter = true;
    this.getQueryByReviewIdNotGroups();
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
<style lang="scss">
.extractPingjia {
  .sr_time_line {
    margin-top: 24px;
    h1 {
      margin-bottom: 8px;
    }
  }
  .total-page {
    .el-tabs__header {
      display: none;
    }
  }
  .sr_time_line_title {
    position: relative;
    .expert_tips_img {
      position: absolute;
      left: -30px;
    }
  }
}
.el-timeline-item__tail {
  margin-left: 3px !important;
  border-left: 1px dashed #ccc !important;
}
.el-timeline-item {
  padding-bottom: 8px !important;
}
</style>