<template>
  <div>
    <el-form
      label-width="140px"
      class="top-form"
      :rules="rules"
      :model="ruleForm"
      ref="ruleForm"
    >
      <el-form-item label="评审活动名称：" prop="reviewActivitiesName">
        <el-input
          v-model="ruleForm.reviewActivitiesName"
          placeholder="请输入评审活动名称"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="活动类型：" prop="reviewActivitiesType">
        <el-select
          v-model="ruleForm.reviewActivitiesType"
          placeholder="请选择活动类型"
          clearable
          @change="selectChange"
        >
          <el-option
            v-for="item in reviewActivitiesTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="评审次数：" prop="reviewTimes" v-if="isVisable">
        <el-input v-model="ruleForm.reviewTimes" placeholder="请输入评审次数">
        </el-input>
      </el-form-item>
      <el-form-item label="专家人数：" prop="extractNum">
        <el-input v-model="ruleForm.extractNum" placeholder="请输入专家人数">
        </el-input>
      </el-form-item>
      <el-form-item label="会议时长：" prop="meetingLength">
        <el-select
          v-model="ruleForm.meetingLength"
          placeholder="请选择会议时长"
          clearable
        >
          <el-option
            v-for="item in meetingTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="会议时间：" prop="meetingTime">
        <el-date-picker
          v-model="ruleForm.meetingTime"
          meetingType="datetime"
          placeholder="请选择具体时间"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          class="meeting-wrap"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="会议形式：" prop="meetingType">
        <el-radio-group v-model="ruleForm.meetingType">
          <el-radio :label="0">线上会议</el-radio>
          <el-radio :label="1">现场会议</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="线上会议链接："
        prop="meetingUrl"
        v-if="!ruleForm.meetingType"
      >
        <el-input
          v-model="ruleForm.meetingUrl"
          placeholder="请粘贴会议链接"
        ></el-input>
      </el-form-item>
      <el-form-item label="现场会议地址：" prop="meetingAddress" v-else>
        <el-input
          v-model="ruleForm.meetingAddress"
          placeholder="请填写会议地址"
        ></el-input>
      </el-form-item>
      <el-form-item label="联系人：">
        <el-input
          v-model="ruleForm.userName"
          placeholder="请填写联系人"
        ></el-input>
      </el-form-item>
      <el-form-item label="联系电话：" prop="phone">
        <el-input
          v-model="ruleForm.phone"
          placeholder="请填写联系电话"
        ></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getReviewActivitiesCountOfYear } from "@/api/planProject";
export default {
  name: "",
  props: {
    activityForm: {
      type: Object,
      default: {},
    },
  },
  components: {},
  data() {
    return {
      ruleForm: {
        reviewActivitiesName: "",
        isInSystem: 2,
        extractNum: null,
        meetingLength: null,
        reviewActivitiesType: null,
        reviewTimes: null,
        meetingUrl: "",
        meetingAddress: "",
        meetingTime: "",
        meetingType: null,
        userName: "",
        phone: "",
      },
      rules: {
        reviewActivitiesName: [
          { required: true, message: "请输入评审活动名称", trigger: "blur" },
        ],
        reviewActivitiesType: [
          { required: true, message: "请选择活动类型", trigger: "change" },
        ],
        reviewTimes: [
          { required: true, message: "请输入评审次数", trigger: "blur" },
        ],
        extractNum: [
          { required: true, message: "请输入专家人数", trigger: "blur" },
          {
            pattern: /^[1-9]\d*$/,
            message: "专家人数需为正整数",
            trigger: "blur",
          },
        ],
        meetingLength: [
          { required: true, message: "请选择会议时长", trigger: "change" },
        ],
        meetingUrl: [
          { required: true, message: "请粘贴会议链接", trigger: "blur" },
        ],
        meetingAddress: [
          { required: true, message: "请填写会议地址", trigger: "blur" },
        ],
        meetingTime: [
          {
            required: true,
            message: "请选择具体时间",
            trigger: "change",
          },
        ],
        meetingType: [
          { required: true, message: "请选择会议形式", trigger: "change" },
        ],
        phone: [
          { pattern: /^1[3-9]\d{9}$/, message: "格式不正确", trigger: "blur" },
        ],
      },
      reviewActivitiesTypeList: [
        {
          value: 0,
          label: "函评",
        },
        {
          value: 1,
          label: "现场评审",
        },
      ],
      meetingTypeList: [
        {
          value: 0,
          label: "4小时以下",
        },
        {
          value: 1,
          label: "4小时以上",
        },
      ],
      isVisable: true,
      reviewActivitiesCount: null,
    };
  },
  watch: {
    "ruleForm.meetingType": {
      handler: function (newValue, oldValue) {
        // 切换按钮清空填写信息会议地址、会议链接
        if (newValue) {
          this.ruleForm.meetingAddress = "";
          this.ruleForm.meetingUrl = "";
          if (this.activityForm.meetingType == 1) {
            console.log("有历史记录");
            this.ruleForm.meetingAddress = this.activityForm.meetingAddress;
          }
        }
      },
      deep: true,
    },
  },
  created() {
    this.getReviewActivitiesCount();
    // 回到上一步回显
    if (Object.keys(this.activityForm).length > 0) {
      this.ruleForm = Object.assign({}, this.activityForm);
    }
    if (this.activityForm.reviewActivitiesType == 1) {
      this.isVisable = false;
    }
  },
  methods: {
    // 活动类型change事件
    selectChange(val) {
      console.log(val);
      if (val) {
        this.isVisable = false;
      } else {
        this.isVisable = true;
      }
    },
    // 获取本年度评审活动总数
    getReviewActivitiesCount() {
      let year = new Date().getFullYear();
      console.log("year", year);
      getReviewActivitiesCountOfYear({ year: year }).then((res) => {
        console.log(res);
        this.reviewActivitiesCount = res.data;
        this.ruleForm.reviewActivitiesName =
          `${year}` +
          "年第" +
          `${this.reviewActivitiesCount + 1}` +
          "次评审活动";
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.top-form {
  margin-top: 14px;
  ::v-deep .el-form-item {
    margin-bottom: 16px;
  }
  ::v-deep .el-form-item__label {
    padding: 0px !important;
    line-height: 32px;
    height: 32px;
    font-family: "PingFangSC-Regular", "PingFang SC";
  }
  ::v-deep .el-form-item__content {
    line-height: 32px;
    height: 32px;
  }
  ::v-deep .el-input__inner {
    width: 420px !important;
    margin-left: 0px !important;
  }
  ::v-deep .el-input {
    height: 32px;
  }

  .meeting-wrap {
    width: 400px !important;
    ::v-deep .el-input__inner {
      padding-left: 35px !important;
    }
  }
  ::v-deep .el-input__prefix {
    // width: 400px !important;
    right: 365px !important;
    top: 0px !important;
  }
}
</style>
