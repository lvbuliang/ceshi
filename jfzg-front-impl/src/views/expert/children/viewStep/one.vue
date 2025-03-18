<template>
  <div class="">
    <el-timeline class="sr_time_line">
      <el-timeline-item class="timeline_class">
        <slot>
          <div class="sr_time_line_title">
            <img
              src="./../../tips.png"
              class="expert_tips_img"
              width="22px"
              height="22px"
              alt=""
            />
            基本信息
          </div>
          <SrView :formData="viewFormOne.config" :ruleForm="detailedParams">
          </SrView>
        </slot>
      </el-timeline-item>
      <el-timeline-item class="timeline_class">
        <slot>
          <div class="sr_time_line_title">
            <img
              src="./../../tips.png"
              class="expert_tips_img"
              width="22px"
              height="22px"
              alt=""
            />财务信息
          </div>
          <SrView :formData="viewFormThree.config" :ruleForm="detailedParams">
          </SrView>
        </slot>
      </el-timeline-item>
      <el-timeline-item class="timeline_class">
        <slot>
          <div class="sr_time_line_title">
            <img
              src="./../../tips.png"
              class="expert_tips_img"
              width="22px"
              height="22px"
              alt=""
            />工作单位信息
          </div>
          <SrView :formData="viewFormFour.config" :ruleForm="detailedParams">
          </SrView>
        </slot>
      </el-timeline-item>
      <el-timeline-item class="timeline_class">
        <slot>
          <div class="sr_time_line_title">
            <img
              src="./../../tips.png"
              class="expert_tips_img"
              width="22px"
              height="22px"
              alt=""
            />
            专业特长
          </div>
          <SrView :formData="viewFormTwo.config" :ruleForm="detailedParams">
          </SrView>
        </slot>
      </el-timeline-item>
      <!-- <el-timeline-item>
        <slot>
          <div class="sr_time_line_title">
            <img
              src="./../../tips.png"
              class="expert_tips_img"
              width="22px"
              height="22px"
              alt=""
            />学历证明
          </div>
          <SrView :formData="viewFormTree.config" :ruleForm="detailedParams">
          </SrView>
        </slot>
      </el-timeline-item> -->
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
import { listByTopicAndItem, queryProvineCity } from "@/api/index";
import {
  baseInfoViewConfig,
  specialityViewConfig,
  financialViewConfig,
  workUnitConfig,
} from "./config";
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
        config: baseInfoViewConfig,
      },
      viewFormTwo: {
        config: specialityViewConfig,
      },
      viewFormThree: {
        config: financialViewConfig,
      },
      viewFormFour: {
        config: workUnitConfig,
      },
      // viewFormTree: {
      //   config: [
      //     {
      //       value: "educationPhone",
      //       label: "最高学历毕业证书",
      //       span: 24,
      //       type: "uploadImg",
      //       colNum: 3, // 一行几个附件
      //       maxFeild: 15, // 单个附件显示几个字
      //       showIcon: true,
      //       showExpand: true, // 是否需要展开收起功能
      //       labelWidth: 249,
      //     },
      //     {
      //       value: "diplomaPhone",
      //       label: "最高学位毕业证书",
      //       span: 24,
      //       type: "uploadImg",
      //       colNum: 3, // 一行几个附件
      //       maxFeild: 15, // 单个附件显示几个字
      //       showIcon: true,
      //       showExpand: true, // 是否需要展开收起功能
      //       labelWidth: 249,
      //     },
      //   ],
      // },
    };
  },
  methods: {},
  mounted() {},
};
</script>

<style lang="scss" scoped>
.timeline_class {
  position: relative;
}

.expert_tips_img {
  position: absolute;
  height: 22px;
  width: 22px;
  left: 0px;
  top: -1px;
}
</style>
