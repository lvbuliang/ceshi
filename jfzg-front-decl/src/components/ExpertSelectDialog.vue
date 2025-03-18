<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="880px"
      :before-close="handleClose"
      :close-on-click-modal="false"
      :showClose="false"
      class="expertTableHeader"
    >
      <div class="content_box">
        <div class="content_title">选择参与评审的专家人员</div>
        <div class="content_left">
          <!--        <div class="search-box" v-if="active != 1 && !isNoReviewActivity">
            <el-input
              size="small"
              placeholder="请输入专家名称"
              style="width: 400px"
              v-model="expertName"
            ></el-input>
            <el-button
              icon="el-icon-search"
              size="small"
              type="primary"
              name="搜索"
              circle
              @click="handleSearh"
            ></el-button>
            <el-button
              icon="el-icon-refresh"
              size="small"
              class="resetBtn"
              name="重置"
              circle
              @click="resetData"
            ></el-button>
          </div> -->
          <div class="switch">
            <div class="step-wrap">
              <div
                class="serial-number"
                :style="{
                  backgroundColor: active == 1 ? '#1890ff' : '#fff',
                  color: active == 1 ? '#fff' : '#666',
                }"
              >
                1
              </div>
              <span class="step-title">评审活动</span>
            </div>
            <div class="step-wrap">
              <div
                class="serial-number"
                :style="{
                  backgroundColor: active == 2 ? '#1890ff' : '#fff',
                  color: active == 2 ? '#fff' : '#666',
                }"
              >
                2
              </div>
              <span class="step-title">抽取条件 </span>
            </div>
            <div class="step-wrap">
              <div
                class="serial-number"
                :style="{
                  backgroundColor: active == 3 ? '#1890ff' : '#fff',
                  color: active == 3 ? '#fff' : '#666',
                }"
              >
                3
              </div>
              <span class="step-title"> 设置评审组 </span>
            </div>
          </div>
          <!-- 评审活动 -->
          <OneStep
            v-if="active == 1"
            ref="OneStepForm"
            :activityForm="activityForm"
          ></OneStep>
          <!-- 抽取条件 -->
          <TwoStep
            v-if="active == 2"
            ref="TwoStepForm"
            :expertList="expertList"
            :reviewId="reviewId"
            @sendExpert="acceptExpert"
          ></TwoStep>
          <!-- 设置评审组 -->
          <ThreeStep
            v-if="active == 3"
            :reviewId="reviewId"
            :isInSystem="isInSystem"
            :ruleType="ruleType"
            ref="ThreeStepNTable"
            @sumitExpert="sumitExpert"
            @zhiding="zhiding"
            @assignExpert="assignExpert"
            @standbyExpert="standbyExpert"
          ></ThreeStep>
        </div>
        <div class="content_right">
          <div class="content_right_top">
            <div class="content_right_title">本次已选</div>
            <div class="checked_list">
              <div
                class="collapse-item-wrap"
                :key="item.expertId"
                v-for="item in selectExpertItemList"
              >
                <span class="label">{{ item.expertName }}</span>
                <el-checkbox
                  @change="(e) => changechecbox(e, item)"
                  style="float: right"
                  v-model="item.isShow"
                  class="right-check"
                ></el-checkbox>
              </div>
            </div>
          </div>
          <div class="content_right_bottom">
            <div class="content_right_title">历史已选</div>
            <div class="checked_list">
              <div
                class="collapse-item-wrap"
                :key="index"
                v-for="(item, index) in historySelectedList"
              >
                <span class="label">{{ item.name }}</span>
                <i
                  style="float: right"
                  class="el-icon-success"
                  v-if="item.isSubmit"
                ></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="last"
          v-if="active == 2 || active == 3"
          >上一步</el-button
        >
        <el-button
          type="primary"
          @click="next"
          v-if="active == 1 || active == 2"
          >下一步</el-button
        >
        <el-button type="primary" @click="handleSave" v-if="active == 3"
          >邀请专家</el-button
        >
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  evadeExpert,
  getExpert,
  getReviewAndProject,
  saveOrUpdateConference,
  saveOrUpdateReviewActivities,
  save,
  queryDetail,
  saveOrUpdateGroupDetail,
  batchAuditTeam,
  expertAspirationSave,
  batchAuditTeamAtJointTrial,
  batchAuditTeamAtExpertTrial,
  getHistoricalExpert,
} from "@/api/planProject";
import OneStep from "./OneStep.vue";
import TwoStep from "./TwoStep.vue";
import ThreeStep from "./ThreeStep.vue";
export default {
  name: "SrSettingTable",
  components: {
    OneStep,
    TwoStep,
    ThreeStep,
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default() {
        return false;
      },
    },
    data: {
      type: Array,
      default() {
        return [];
      },
    },
    pilId: {
      type: Array,
      default() {
        return [];
      },
    },
    projectList: {
      type: Array,
      default() {
        return [];
      },
    },
    spanaActive: {
      type: Number,
      default: null,
    },
    taskName: {
      type: String,
      default: "",
    },
  },
  updated() {},
  data() {
    return {
      active: 1,
      radio: "",
      search: "",

      params: {
        expertName: "",
      },
      getList: evadeExpert,
      isExpertDialog: true,
      isNoReviewActivity: false,
      expertName: "", //查询参数专家姓名
      expertList: [], //专家列表
      projectIdList: [], //勾选项目ids
      reviewActivityAndExpertList: [], //评审活动和专家
      groupList: [], //创建分组列表
      reviewId: null, //评审活动id
      selectChangeCheckedList: [], //评审活动下勾选的专家列表
      groupInfoList: [], //分组列表
      groupId: null, //评审会信息id
      reviewActivityInfo: {}, //评审会信息
      isHistory: true,
      reviewInfoId: null,
      extractId: null, //抽取id
      activeTab: null, //当前处于哪个节点
      activityForm: {}, //评审活动上部分表单
      projectInfos: [], //组合的勾选项目数据
      isInSystem: null, //专家体制类型
      ruleType: null,
      selectExpertItemList: [], //已选列表
      assignExpertList: [], //指定勾选专家
      standbyExpertList: [], //备选勾选专家
      manuaLExpertList: [], //手动抽取勾选
      expertDataList: [], //指定专家的数据
      historyList: [], //查询历史参数
      historySelectedList: [], //历史已选
    };
  },
  watch: {},
  created() {
    console.log("项目id", this.pilId);
    this.projectIdList = this.pilId;
    console.log("id", this.projectIdList);
    this.activeTab = this.spanaActive;
    console.log("当前节点", this.activeTab);
    console.log("xiangmu", this.projectList);
  },

  mounted() {
    // this.getReviewAndProjectList();
    this.getHistoricalExpertList();
  },
  methods: {
    // 历史已选
    getHistoricalExpertList() {
      this.historyList = this.projectList.map((item) => {
        return {
          projectId: item.id,
          // node: this.activeTab,
          status: item.status,
          source: item.source,
        };
      });
      getHistoricalExpert(this.historyList).then((res) => {
        console.log("res", res);
        this.historySelectedList = res.data;
      });
    },
    // 组合专家
    updateSelectExpertItemList() {
      let uniqueExpertList = new Set();
      if (this.ruleType === 2) {
        uniqueExpertList = new Set([
          ...this.assignExpertList,
          ...this.standbyExpertList,
        ]);
      } else if (this.ruleType === 3) {
        uniqueExpertList = new Set([
          ...this.expertDataList,
          ...this.assignExpertList,
          ...this.standbyExpertList,
        ]);
      }
      this.selectExpertItemList = Array.from(uniqueExpertList);
      this.selectExpertItemList.forEach((item) => {
        item.isShow = true;
      });
    },
    // 指定专家
    assignExpert(val) {
      console.log("指定专家", val);
      console.log("ruleType", this.ruleType);
      this.assignExpertList = val;
      this.updateSelectExpertItemList();
    },
    // 备选专家
    standbyExpert(val) {
      console.log("备选专家", val);
      console.log("ruleType", this.ruleType);
      this.standbyExpertList = val;
      this.updateSelectExpertItemList();
    },
    // 指定专家
    zhiding(val) {
      console.log("指定专家的数据", val);
      this.expertDataList = val;
    },
    // 表格选择结果
    sumitExpert(val) {
      console.log("接收子传递", val);
      this.manuaLExpertList = val;
      this.selectExpertItemList = [];
      this.selectExpertItemList = [...this.manuaLExpertList];
      this.selectExpertItemList.forEach((item) => {
        item.isShow = true;
      });
    },
    // 保存评审活动--此时是修改
    saveActivity() {
      this.projectInfos = this.projectList.map((item) => {
        return {
          projectId: item.id,
          projectStatus: item.status,
          source: item.source,
          version: item.version,
        };
      });
      console.log(this.reviewId);
      let params = {
        id: this.reviewId,
        projectInfos: this.projectInfos, //项目信息
        reviewActivitiesName: this.activityForm.activityName, //评审项目名称
        meetingTime: this.activityForm.meetingTime, //会议时间
        meetingAddress: this.activityForm.meetingAddress, //会议地址
        meetingUrl: this.activityForm.meetingUrl, //会议链接
        extractNum: this.activityForm.extractNum, //专家人数
        isDelete: false,
        reviewActivitiesType: this.activityForm.reviewActivitiesType, //评审活动类型
        meetingType: this.activityForm.meetingType, //评审会议方式
        meetingLength: this.activityForm.meetingLength, //评审会议时长
        reviewTimes: this.activityForm.reviewTimes, //评审次数
        feePercentage:
          this.activityForm.reviewActivitiesType == 0
            ? 50
            : this.activityForm.reviewActivitiesType == 1 &&
              this.activityForm.meetingLength == 0
            ? 60
            : this.activityForm.reviewActivitiesType == 1 &&
              this.activityForm.meetingLength == 1
            ? 100
            : null,
        phone: this.activityForm.phone,
        userName: this.activityForm.userName,
      };
      //新增评审活动
      saveOrUpdateReviewActivities(params).then((res) => {
        console.log("修改评审会", res);
        if (res.msg.code == "0000") {
          this.addBatchAuditTeam();
        }
      });
    },
    // 指定专家填充在已选列表中
    acceptExpert(val) {
      this.selectExpertItemList = [];
      this.selectExpertItemList = val;
      this.selectExpertItemList.forEach((item) => {
        item.isShow = true;
      });
    },
    // 分组初审批量分配审核小组
    addBatchAuditTeam() {
      const idsList = this.projectList.map((item) => {
        return { id: item.id };
      });
      console.log(idsList);
      console.log(this.reviewId);
      let tempForm = {
        address: this.activityForm.meetingAddress,
        id: this.reviewId,
        meetingTime: this.activityForm.meetingTime,
        type: this.activityForm.meetingType,
        name: this.activityForm.reviewActivitiesName,
        url: this.activityForm.meetingUrl,
      };
      console.log("专家数据", this.selectExpertItemList);
      let params = {
        conferenceData: tempForm,
        // groupInfoList: this.groupInfoList,
        projectInfoList: idsList,
        expertList: this.selectExpertItemList,
      };
      if (this.taskName == "分组初审") {
        batchAuditTeam(params).then((res) => {
          console.log("res", res);
          if (res.msg.code == "0000") {
            this.$message.success("提交成功");
            this.$emit("close");
          }
        });
      } else if (this.taskName == "联合会审") {
        // 联合会审发起评审会
        batchAuditTeamAtJointTrial(params).then((res) => {
          console.log("res", res);
          if (res.msg.code == "0000") {
            this.$message.success("提交成功");
            this.$emit("close");
          }
        });
      } else if (this.taskName == "专家评审") {
        // 专家评审发起评审会
        batchAuditTeamAtExpertTrial(params).then((res) => {
          console.log("res", res);
          if (res.msg.code == "0000") {
            this.$message.success("提交成功");
            this.$emit("close");
          }
        });
      }
    },

    // 确认按钮操作
    handleSave() {
      if (this.selectExpertItemList.length == 0) {
        this.$message.warning("请选择参会专家！");
        return;
      }
      const jfids = [];
      console.log("选择", this.selectExpertItemList);
      this.selectExpertItemList.map((item) => {
        jfids.push({
          code: null,
          // jfid: item.id,
          jfid: item.expertId,
          type: 1,
          groupId: 0,
        });
      });
      console.log("jfid", jfids);
      expertAspirationSave({
        jfids: [...jfids],
        reviewId: this.reviewId,
      }).then((res) => {
        console.log("res", res);
        if (res.msg.code == "0000") {
          // 保存评审活动信息
          // debugger;
          this.saveActivity();
        }
      });
    },
    // 获取评审活动及专家
    // getReviewAndProjectList() {
    //   const stringArr = this.projectIdList.join(",");
    //   console.log("3454546", stringArr);
    //   let params = {
    //     projectIdList: stringArr,
    //   };
    //   getReviewAndProject(params).then((res) => {
    //     console.log("评审活动", res);
    //     this.reviewActivityAndExpertList = res.data;
    //     console.log("评审活动和专家", this.reviewActivityAndExpertList);
    //   });
    // },
    // 查询专家按钮操作
    // handleSearh() {
    //   if (this.expertName.trim()) {
    //     this.getExpertList();
    //   } else {
    //     this.expertList = [];
    //   }
    // },
    // 重置专家按钮操作
    resetData() {
      this.expertName = "";
      // 不传递数据
      this.expertList = [];
    },
    // 获取专家列表
    getExpertList() {
      let params = {
        pageNum: 1,
        pageSize: 9999,
        name: this.expertName,
        // ...this.search.formData,
      };
      getExpert(params).then((res) => {
        console.log("f2", res);
        this.expertList = res.data.records;
        console.log("专家列表", this.expertList);
      });
    },
    // 上一步
    last() {
      // 清除已选列表数据
      this.selectExpertItemList = [];
      this.assignExpertList = [];
      this.standbyExpertList = [];
      this.active--;
    },
    // 下一步
    next() {
      // 保存分组信息
      if (this.active == 1) {
        console.log("this>>>>", this.$refs);
        this.$refs.OneStepForm.$refs.ruleForm.validate((valid) => {
          if (valid) {
            console.log("111");
            console.log(this.$refs.OneStepForm.ruleForm);
            this.activityForm = this.$refs.OneStepForm.ruleForm;
            console.log("表单信息", this.activityForm);
            // debugger;
            // 新增评审活动
            this.projectInfos = this.projectList.map((item) => {
              return {
                projectId: item.id,
                projectStatus: item.status,
                source: item.source,
                version: item.version,
              };
            });
            let params = {
              id: this.reviewId ? this.reviewId : 0,
              projectInfos: this.projectInfos, //项目信息
              reviewActivitiesName: this.activityForm.reviewActivitiesName, //评审项目名称
              meetingTime: this.activityForm.meetingTime, //会议时间
              meetingAddress: this.activityForm.meetingAddress, //会议地址
              meetingUrl: this.activityForm.meetingUrl, //会议链接
              extractNum: this.activityForm.extractNum, //专家人数
              isDelete: true,
              reviewActivitiesType: this.activityForm.reviewActivitiesType, //评审活动类型
              meetingType: this.activityForm.meetingType, //评审会议方式
              meetingLength: this.activityForm.meetingLength, //评审会议时长
              reviewTimes: this.activityForm.reviewTimes, //评审次数
              feePercentage:
                this.activityForm.reviewActivitiesType == 0
                  ? 50
                  : this.activityForm.reviewActivitiesType == 1 &&
                    this.activityForm.meetingLength == 0
                  ? 60
                  : this.activityForm.reviewActivitiesType == 1 &&
                    this.activityForm.meetingLength == 1
                  ? 100
                  : null,
              phone: this.activityForm.phone,
              userName: this.activityForm.userName,
            };
            saveOrUpdateReviewActivities(params).then((res) => {
              console.log("评审会", res);
              this.reviewId = res.data;
            });
            this.active++;
          }
        });
      } else if (this.active == 2) {
        // 如果是抽取页面，先新增评审活动后，保存抽取规则
        console.log(this.$refs.TwoStepForm);
        let params = this.$refs.TwoStepForm.verification();
        console.log("评审", this.$refs, params);
        // debugger;
        if (params) {
          // this.$store.commit("extract/UPDATE_ONE_PARAMS", params);
          this.isInSystem = params.isInSystem;
          delete params.isInSystem;
          console.log("this.isInSystem", this.isInSystem);
          delete params.evadeExpertList;
          delete params.zdExpertIdList;
          params.needExpertNum = this.activityForm.extractNum; //专家人数
          params.ruleType = this.$refs.TwoStepForm.ruleType;
          this.ruleType = this.$refs.TwoStepForm.ruleType;
          params.reviewId = this.reviewId;
          save({
            id: this.extractId ? this.extractId : null,
            data: JSON.stringify(params),
            reviewId: this.reviewId,
          }).then(({ msg, data }) => {
            console.log("抽取", data);
            this.extractId = data.id;
            // this.stepOneParms = data; // 这个参数主要判断字段里面是否有jxcq这个字段 如果有 flag 为flase时打开的弹框里面则显示继续抽取得按钮
            // if (data && data.flag) {
            this.active++;
            // } else {
            // this.dialogVisible = true; //flag为false时 代表抽取条件不足 显示弹框
            // }
          });
        }
      }

      console.log("当前步骤", this.active);
    },
    handleClose() {
      this.$emit("close");
    },
    toggleSelection(row) {
      console.log("11111");
      if (this.ruleType != 1) {
        // 专家列表
        if (
          this.$refs.ThreeStepNTable.$refs.canhuizhuanjiaTableRef.tableData &&
          this.$refs.ThreeStepNTable.$refs.canhuizhuanjiaTableRef.tableData
            .length > 0
        ) {
          let result =
            this.$refs.ThreeStepNTable.$refs.canhuizhuanjiaTableRef.tableData.filter(
              (item) => item.expertId == row.expertId
            );
          if (result.length > 0) {
            this.$refs.ThreeStepNTable.$refs.canhuizhuanjiaTableRef.$refs.SrTable.toggleRowSelection(
              row
            );
          }
          // 移除参会列表
          const index = this.assignExpertList.findIndex(
            (item2) => item2.expertId == row.expertId
          );
          console.log(index);
          if (index !== -1) {
            this.assignExpertList.splice(index, 1);
          }
          console.log("33", result);
        }
        // 备选列表
        if (
          this.$refs.ThreeStepNTable.$refs.beixuanzhuanjiaTableRef.tableData &&
          this.$refs.ThreeStepNTable.$refs.beixuanzhuanjiaTableRef.tableData
            .length > 0
        ) {
          let result2 =
            this.$refs.ThreeStepNTable.$refs.beixuanzhuanjiaTableRef.tableData.filter(
              (item) => item.expertId == row.expertId
            );
          if (result2.length > 0) {
            this.$refs.ThreeStepNTable.$refs.beixuanzhuanjiaTableRef.$refs.SrTable.toggleRowSelection(
              row
            );
          }
          // 移除备选列表
          const index = this.standbyExpertList.findIndex(
            (item2) => item2.expertId == row.expertId
          );
          console.log(index);
          if (index !== -1) {
            this.standbyExpertList.splice(index, 1);
          }
        }
      } else if (this.ruleType == 1) {
        // 移除手动抽取条件中的专家
        console.log(this.$refs.ThreeStepNTable.$refs.manuaLZhuanjiaTableRef);
        if (
          this.$refs.ThreeStepNTable.$refs.manuaLZhuanjiaTableRef.tableData &&
          this.$refs.ThreeStepNTable.$refs.manuaLZhuanjiaTableRef.tableData
            .length > 0
        ) {
          let result =
            this.$refs.ThreeStepNTable.$refs.manuaLZhuanjiaTableRef.tableData.filter(
              (item) => item.expertId == row.expertId
            );
          if (result.length > 0) {
            this.$refs.ThreeStepNTable.$refs.manuaLZhuanjiaTableRef.$refs.SrTable.toggleRowSelection(
              row
            );
          }
          // 移除手动抽取条件中的专家
          const index = this.manuaLExpertList.findIndex(
            (item2) => item2.expertId == row.expertId
          );
          console.log(index);
          if (index !== -1) {
            this.manuaLExpertList.splice(index, 1);
          }
        }
      }
      // 移除抽取条件中的专家
      const index2 = this.expertDataList.findIndex(
        (item2) => item2.expertId == row.expertId
      );
      console.log(index2);
      if (index2 !== -1) {
        this.expertDataList.splice(index2, 1);
      }
      console.log(this.expertDataList);
      console.log(this.$refs.ThreeStepNTable);
    },
    changechecbox(e, item) {
      console.log(e, item);
      this.$set(item, "isShow", item.isShow);
      if (!e) {
        const index = this.selectExpertItemList.findIndex(
          (expert) => expert.expertId == item.expertId
        );
        if (index !== -1) {
          // 从表格中也要移除
          if (this.active == 3) {
            this.toggleSelection(item);
          }
          this.selectExpertItemList.splice(index, 1); // 从 expertList 中移除对应的项
        }
      }
      this.selectExpertItemList.splice();
      // 手动触发重新渲染
      this.$nextTick(() => {
        this.$forceUpdate();
      });
      console.log("最终", this.selectExpertItemList);
    },
  },
};
</script>
<style lang="scss" scoped>
.select-class {
  ::v-deep .el-form-item {
    margin-bottom: 10px;
  }
  ::v-deep .el-form-item__label {
    // width: 140px !important;
  }
  ::v-deep .el-input__inner {
    width: 420px !important;
    margin-left: 0px !important;
    // padding-left: 0px !important;
  }
  ::v-deep .el-input {
    height: 32px;
  }
  ::v-deep .el-input__suffix {
    height: 32px;
  }
  ::v-deep .el-select {
    width: 420px;
    height: 32px;
  }
  ::v-deep .select_people_btn {
    width: 32px;
    height: 32px;
  }
  ::v-deep .people_list .people_item .last_name {
    width: 32px;
    height: 32px;
  }
}
.right-check {
  ::v-deep .el-checkbox__inner {
    border-radius: 50%;
  }
}
.groupList {
  text-overflow: ellipsis; /* 溢出显示省略号 */
  overflow: hidden; /* 溢出隐藏 */
  white-space: nowrap; /* 强制不换行 */
}
.demo-ruleForm {
  ::v-deep .el-form-item {
    margin-bottom: 14px;
  }
  ::v-deep .el-form-item__label {
    padding: 0 6px 0 0;
  }
  .el-radio-group {
    .el-radio {
      margin-right: 10px;
    }
  }
  ::v-deep .el-date-editor {
    width: 182px !important;
    ::v-deep .el-input__inner {
      width: 182px !important;
    }
  }
}
.search-box {
}
.switch {
  height: 32px;
  background-color: #eef7ff;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 0px 8px 0px 24px;
  border-radius: 8px;
  .step-wrap {
    display: flex;
    align-items: center;
    .serial-number {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      text-align: center;
    }
    .step-title {
      margin-left: 4px;
    }
  }
}
.step-one-btn {
  margin: 14px 8px 14px 24px;
  display: flex;
  justify-content: flex-end;

  .el-button {
    // width: 76px;
    height: 28px;
    /* background: $--color-primary; */
    border-radius: 16px;
    padding: 5px 14px;
  }
}
.step-two-btn {
  margin: 14px 8px 14px 24px;
  display: flex;
  justify-content: flex-end;

  .el-button {
    // width: 76px;
    height: 28px;
    /* background: $--color-primary; */
    border-radius: 16px;
    padding: 5px 14px;
  }
}
.step-two-active-list {
  margin: 0px 8px 0px 24px;
  padding: 8px;
  padding-top: 0;
  height: 294px;
  overflow-y: auto;
  overflow-x: hidden;
}
.demo-dynamic {
  .el-form-item {
    // background-color: #f7f7f7;
    margin-bottom: 18px;
    ::v-deep .el-form-item__content {
      width: 360px !important;
      display: flex;
      align-items: center;
      i {
        width: 20px;
        height: 20px;
        display: inline-block;
      }
    }
    ::v-deep .el-input__inner {
      width: 360px !important;
      margin-left: 0px !important;
      margin-bottom: 0px !important;
    }
  }
}
.content_left {
  width: 65% !important;
}
.content_right {
  width: 35% !important;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .content_right_top {
    flex: 1;
    max-height: calc(100% - 180px);
  }
  .content_right_bottom {
    height: 180px;
    max-height: 180px;
  }
}
.sr_table_popover {
  padding: 8px 0 !important;

  .popover_container {
    .infinite-list {
      max-height: 356px;
      overflow-y: auto;
      text-align: center;
    }

    .infinite-list-item {
      height: 34px;
      line-height: 34px;
      padding: 0 12px;
      cursor: pointer;
      color: #606266;

      &:hover {
        background: #f7f7f7;
      }
    }
  }
}
.checked_list {
  //   height: 200px;
  height: calc(100% - 22px - 8px);
  overflow-x: hidden;
  overflow-y: auto;
  // padding: 0px 16px;
  //   background-color: #f7f7f7;
}
.meeting-wrap {
  width: 182px !important;
}
.el-collapse {
  // width: 100%;
  border-top: none;
  border-bottom: none;
}
.el-collapse-item {
  padding: 4px 0px;
}
::v-deep .el-collapse-item__content {
  margin-bottom: 0;
  padding-bottom: 0px;
}

::v-deep .el-collapse-item__header {
  font-size: 14px;
  border: none;
  height: 32px;
  border-radius: 8px 8px 0px 0px !important;
  border-radius: 8px 8px 8px 8px !important;
  // text-overflow: ellipsis; /* 溢出显示省略号 */
  // overflow: hidden; /* 溢出隐藏 */
  // white-space: nowrap; /* 强制不换行 */
  span {
    padding-left: 5px;
  }
}
::v-deep .el-collapse-item__header:hover {
  background-color: #f7f7f7;
}
.collapse-title {
  text-overflow: ellipsis; /* 溢出显示省略号 */
  overflow: hidden; /* 溢出隐藏 */
  white-space: nowrap; /* 强制不换行 */
}
.el-collapse-item__content {
  font-size: 14px;
}
::v-deep .el-collapse-item__wrap {
  border-bottom: none;
  padding: 0px 16px;
}
.collapse-item-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  //   flex-direction: column;
  padding: 5px 16px;
  height: 32px;
}
.collapse-item-wrap:hover {
  background-color: #f7f7f7;
  border-radius: 8px;
}
/* .el-radio {
  line-height: 32px;
  // 审核小区选择区域扩大问题
  width: 100%;
  text-align: right;
} */
.expertTableHeader {
  // ::v-deep .el-dialog {
  //   margin-top: 3vh !important;
  // }
  box-sizing: border-box;
  * {
    box-sizing: border-box;
  }
  ::v-deep .el-dialog__header {
    padding: 0 !important;
  }
  .el-dialog__footer {
    text-align: center;
    height: 56px;
    padding: 12px 24px;
    border-top: 1px solid #e8e8e8;
    .el-button {
      // width: 76px;
      height: 32px;
      /* background: $--color-primary; */
      border-radius: 16px;
      padding: 5px 24px;
    }
  }
  ::v-deep .el-dialog__body {
    padding: 0 !important;
    overflow: hidden !important;
    // max-height: 788px;
    max-height: 600px;
    .content_box {
      .content_title {
        height: 56px;
        padding: 16px 0;
        text-align: center;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.85);
        line-height: 24px;
        border-bottom: 1px solid #e8e8e8;
      }
      .content_left {
        width: 50%;
        float: left;
        border-right: 1px solid #e8e8e8;
        padding-top: 16px;
        // height: 486px;
        height: 534px;
        // height: 655px;
        // height: 730px;
        background: #ffffff;
        position: relative;
        border-radius: 4px;
        .content_left_lists {
          padding: 8px;
          padding-top: 0;
          padding-left: 24px;
          height: 342px;
          // height: 530px;
          overflow-y: auto;
          overflow-x: hidden;
          .content_left_list {
            // width: 256px;
            width: 100%;
            height: 32px;
            border-radius: 8px;
            color: rgba(0, 0, 0, 0.85);
            // padding: 5px 16px;
            line-height: 22px;
            position: relative;
            .more {
              float: right;
              top: 50%;
              transform: translate(-50%, -50%) rotate(90deg);
              position: absolute;
              right: 16px;
            }
            //修改 多选框样式
            .label {
              display: block;
              width: 100%;
              left: 16px;
              top: 50%;
              transform: translateY(-50%);
              position: absolute;
            }
            .el-checkbox {
              width: 100%;
              height: 100%;
              padding: 5px 16px;
              text-align: right;
            }
            &:hover {
              background: #f7f7f7;
              cursor: pointer;
            }
            .el-checkbox__inner {
              border-radius: 50%;
              width: 16px;
              height: 16px;
              &::after {
                left: 5px;
                top: 2px;
              }
            }
          }
        }
        .content_left_title {
          height: 22px;
          font-size: 14px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 600;
          color: rgba(0, 0, 0, 0.85);
          line-height: 22px;
          margin-bottom: 13px;
          padding: 16px;
          padding-top: 0;
        }
        .el-input__inner {
          //   width: 224px;
          width: 360px;
          height: 32px;
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid #e5e5e5;
          margin-left: 24px;
          margin-bottom: 16px;
          padding-left: 12px;
        }
        .el-input__prefix {
          right: -180px;
          top: -6px;
        }
      }
      .content_right {
        margin-top: 20px;
        padding: 8px;
        width: 50%;
        float: right;
        padding-top: 0;
        // height: 466px;
        // height: 640px;
        height: 514px;
        .wrapper {
          height: 375px;
          overflow-y: auto;
          overflow-x: hidden;
        }
      }
      .content_right_title {
        height: 22px;

        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.85);
        line-height: 22px;
        // margin-bottom: 13px;
        padding: 16px;
        padding-top: 0;

        span {
          float: right;

          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999;
          line-height: 20px;
          margin-right: 16px;
        }
      }
      .content_right_list {
        width: 256px;
        height: 32px;
        border-radius: 8px;
        line-height: 22px;
        padding: 5px 16px;
        color: rgba(0, 0, 0, 0.85);
        &:hover {
          background: #f7f7f7;
          cursor: pointer;
          .el-icon-close {
            display: inline-block;
          }
        }
        .sr-icon-move1 {
          font-size: 16px;
          margin-top: 2px;
          margin-right: 8px;
          vertical-align: middle;
        }
        .el-icon-close {
          float: right;
          background: #999;
          border-radius: 50%;
          width: 16px;
          height: 16px;
          padding-left: 2px;
          padding-top: 2px;
          color: #fff;
          font-size: 12px;
          display: none;
          margin-top: 4px;
          &:hover {
            background: #1890ff;
          }
        }
      }
    }
  }
}
</style>
