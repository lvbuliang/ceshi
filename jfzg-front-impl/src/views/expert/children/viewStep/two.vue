<template>
  <div>
    <el-timeline class="sr_time_line">
      <el-timeline-item>
        <slot>
          <div class="sr_time_line_title">
            <img
              src="./../../tips.png"
              class="expert_tips_img"
              width="22px"
              height="22px"
              alt=""
            />技术方向
          </div>
          <SrView :formData="viewFormOne.config" :ruleForm="detailedParams">
          </SrView>
        </slot>
      </el-timeline-item>
      <el-timeline-item>
        <slot>
          <div class="sr_time_line_title">
            <img
              src="./../../tips.png"
              class="expert_tips_img"
              width="22px"
              height="22px"
              alt=""
            />行业领域
          </div>
          <SrView :formData="viewFormTwo.config" :ruleForm="detailedParams">
          </SrView>
        </slot>
      </el-timeline-item>
      <el-timeline-item>
        <slot>
          <div class="sr_time_line_title">
            <img
              src="./../../tips.png"
              class="expert_tips_img"
              width="22px"
              height="22px"
              alt=""
            />最高职称
          </div>
          <SrView
            :formData="viewFormTree.config"
            :ruleForm="detailedParams"
          ></SrView>
        </slot>
      </el-timeline-item>
      <el-timeline-item>
        <slot>
          <div class="sr_time_line_title">
            <img
              src="./../../tips.png"
              class="expert_tips_img"
              width="22px"
              height="22px"
              alt=""
            />职业资格
          </div>
          <SrView :formData="viewFormFour.config" :ruleForm="detailedParams">
          </SrView>
        </slot>
      </el-timeline-item>
      <el-timeline-item>
        <slot>
          <div class="sr_time_line_title">
            <img
              src="./../../tips.png"
              class="expert_tips_img"
              width="22px"
              height="22px"
              alt=""
            />从事专业信息
          </div>
          <SrView :formData="viewFormFive.config" :ruleForm="detailedParams">
          </SrView>
        </slot>
      </el-timeline-item>
      <el-timeline-item>
        <slot>
          <div class="sr_time_line_title">
            <img
              src="./../../tips.png"
              class="expert_tips_img"
              width="22px"
              height="22px"
              alt=""
            />专业技术资格证书
          </div>
          <SrView :formData="viewFormSix.config" :ruleForm="detailedParams">
          </SrView>
        </slot>
      </el-timeline-item>
      <el-timeline-item>
        <slot>
          <div class="sr_time_line_title">
            <img
              src="./../../tips.png"
              class="expert_tips_img"
              width="22px"
              height="22px"
              alt=""
            />专业相关工作经历
          </div>
          <SrView :formData="viewFormSevn.config" :ruleForm="detailedParams">
          </SrView>
        </slot>
      </el-timeline-item>
      <el-timeline-item>
        <slot>
          <div class="sr_time_line_title">
            <img
              src="./../../tips.png"
              class="expert_tips_img"
              width="22px"
              height="22px"
              alt=""
            />个人成果
          </div>
          <SrView :formData="viewFromBA.config" :ruleForm="detailedParams">
          </SrView>
        </slot>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<!--
  功能：form表单新增
  汪振涛
  时间：2020年11月18日 11:40:41
  版本：v1.0
-->
<script>
import config from "@/settings.js";
import upload from "@/utils/upload";
import { listByTopicAndItem } from "@/api/index";
export default {
  name: "FormAdd",
  provide() {
    return {
      baseUrl: config.baseUrl,
      imgBaseUrl: config.imgBaseUrl,
      uploadRequest: upload,
      uploadBaseUrl: config.uploadBaseUrl,
    };
  },
  components: {},
  props: {
    detailedParams: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      viewFormOne: {
        config: [
          {
            value: "one",
            label: "第一技术方向",
            span: 8,
            type: "value",
          },
          {
            value: "two",
            label: "第二技术方向",
            span: 8,
            type: "value",
          },
          {
            value: "tree",
            label: "第三技术方向",
            span: 8,
            type: "value",
          },
        ],
      },
      viewFormTwo: {
        config: [
          {
            value: "dtoList",
            label: "行业领域",
            span: 24,
            type: "value",
          },
        ],
      },
      viewFormTree: {
        config: [
          {
            value: "professional",
            label: "职称",
            span: 8,
            type: "value",
          },
          {
            value: "professionalDate",
            label: "职称评定时间",
            span: 8,
            type: "value",
          },
          {
            value: "professionalPhoto",
            label: "职称证书",
            span: 24,
            type: "uploadImg",
            colNum: 3, // 一行几个附件
            maxFeild: 15, // 单个附件显示几个字
            showIcon: true,
            showExpand: true, // 是否需要展开收起功能
            labelWidth: 249,
          },
        ],
      },
      viewFormFour: {
        config: [
          {
            value: "career",
            label: "职业资格",
            span: 8,
            type: "value",
          },
          {
            value: "careerDate",
            label: "取得时间",
            span: 8,
            type: "value",
          },
          {
            value: "careerNum",
            label: "注册号",
            span: 8,
            type: "value",
          },
          {
            value: "careerPhoto",
            label: "职称证书",
            span: 24,
            type: "uploadImg",
            colNum: 3, // 一行几个附件
            maxFeild: 15, // 单个附件显示几个字
            showIcon: true,
            showExpand: true, // 是否需要展开收起功能
            labelWidth: 249,
          },
        ],
      },
      viewFormFive: {
        config: [
          {
            value: "major",
            label: "现从事专业",
            span: 8,
            type: "value",
          },
          {
            value: "majorDate",
            label: "从事时间",
            span: 8,
            type: "value",
          },
          {
            value: "majorEndDate",
            label: "结束时间",
            span: 8,
            type: "value",
          },
        ],
      },
      viewFormSix: {
        config: [
          {
            value: "technologyName",
            label: "证书名称",
            span: 8,
            type: "value",
          },
          {
            value: "technologyDate",
            label: "取得时间",
            span: 8,
            type: "value",
          },
          {
            value: "technologyPhoto",
            label: "证书",
            span: 24,
            type: "uploadImg",
            colNum: 3, // 一行几个附件
            maxFeild: 15, // 单个附件显示几个字
            showIcon: true,
            showExpand: true, // 是否需要展开收起功能
            labelWidth: 249,
          },
        ],
      },
      viewFormSevn: {
        config: [
          {
            value: "workUnit",
            label: "工作单位",
            span: 8,
            type: "value",
          },
          {
            value: "duty",
            label: "职务",
            span: 8,
            type: "value",
          },
          {
            value: "duty",
            label: "职务",
            span: 8,
            type: "value",
          },
          {
            value: "workStartDate",
            label: "从事时间",
            span: 8,
            type: "value",
          },
          {
            value: "workEndDate",
            label: "结束时间",
            span: 8,
            type: "value",
          },
          {
            value: "unitStatusName",
            label: "单位性质",
            span: 8,
            type: "value",
          },
        ],
      },
      viewFromBA: {
        config: [
          {
            value: "workExperience",
            label: "工作经历及获奖情况",
            span: 24,
            type: "value",
          },
          {
            value: "reviewContent",
            label: "参与评审的项目",
            span: 24,
            type: "value",
          },
        ],
      },
    };
  },
  methods: {},
  mounted() {},
};
</script>

<style scoped >
</style>
