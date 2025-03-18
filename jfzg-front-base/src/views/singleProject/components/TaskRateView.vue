<template>
  <div class="task-rate">
    <SrAdd
      :config="pfForm.config"
      :otherConfig="{ labelNum: 126 }"
      :form="pfForm.data"
      :enums="pfForm.enums"
      class="pfForm"
      ref="addpfForm"
    ></SrAdd>
  </div>
</template>

<script>
  import config from "@/settings.js";
  import upload from "@/utils/upload";
  export default {
    props:{
      rateInfo: {
        type:String
      }
    },
    provide() {
      return {
        baseUrl: config.uploadBaseUrl,
        imgBaseUrl: config.imgBaseUrl,
        uploadRequest: upload,
        uploadBaseUrl: config.uploadBaseUrl,
      };
    },
    data() {
      return {
        pfForm: {
          config: [
            {
              type: "star",
              scoreTemplateType: true,
              name: "综合评价",
              required: "没有进行综合评价",
              bind: "integratedScore",
              "show-score": true,
              max: 5,
              "allow-half": true,
              "text-color": "#FFAA22",
              "void-color": "rgba(0, 0, 0, 0.1)",
              "void-icon-class": "el-icon-star-on",
              trigger: "change",
              disabled: true,
              col: 24
            },
            {
              type: "star",
              scoreTemplateType: true,
              name: "专业知识评价",
              required: "没有进行专业知识评价",
              bind: "specialScore",
              "show-score": true,
              "text-color": "#FFAA22",
              "void-color": "rgba(0, 0, 0, 0.1)",
              "void-icon-class": "el-icon-star-on",
              max: 5,
              "allow-half": true,
              disabled: true,
              trigger: "change",
              col: 24,
            },
            {
              type: "star",
              scoreTemplateType: true,
              name: "沟通情况评价",
              required: "没有进行沟通情况评价",
              bind: "communicateScore",
              "show-score": true,
              "text-color": "#FFAA22",
              "void-color": "rgba(0, 0, 0, 0.1)",
              "void-icon-class": "el-icon-star-on",
              max: 5,
              "allow-half": true,
              trigger: "change",
              disabled: true,
              col: 24,
            },
            {
              type: "star",
              scoreTemplateType: true,
              name: "满意度评价",
              required: "没有进行满意度评价",
              bind: "responsivityScore",
              "show-score": true,
              trigger: "change",
              "void-color": "rgba(0, 0, 0, 0.1)",
              "text-color": "#FFAA22",
              "void-icon-class": "el-icon-star-on",
              max: 5,
              "allow-half": true,
              disabled: true,
              col: 24,
            },
          ],
          data: {
            integratedScore: 0,
            specialScore: 0,
            communicateScore: 0,
            responsivityScore: 0
          },
          enums: {},
        }
      }
    },
    watch:{
      'rateInfo': {
        handler(val) {
          if (val) {
            this.transformData(val)
          }
        }
      }
    },
    mounted() {
      if (this.rateInfo) {
        this.transformData(this.rateInfo)
      }
    },
    methods:{
      transformData(val) {
        if (val && val != '') {
          let evaluateContent = JSON.parse(val)
          if (evaluateContent) {
            let integratedScore = evaluateContent.integratedScore?evaluateContent.integratedScore:0
            let specialScore = evaluateContent.specialScore?evaluateContent.specialScore:0
            let communicateScore = evaluateContent.communicateScore?evaluateContent.communicateScore:0
            let responsivityScore = evaluateContent.responsivityScore ?evaluateContent.responsivityScore:0
            let halfEvaluateContent = {
              integratedScore: integratedScore / 2,
              specialScore: specialScore / 2,
              communicateScore: communicateScore / 2,
              responsivityScore: responsivityScore / 2,
            };
            this.pfForm.data = halfEvaluateContent
            // console.log('transformData.evaluateContent', this.pfForm.data)
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .task-rate {
    width: 418px;
    // height: 272px;
    // padding: 16px 24px !important;
    background: #ffffff;
    box-sizing: border-box;
    // box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.12);
    border-radius: 8px;
    ::v-deep{
      .el-rate__text {
        font-size: 18px;
      }
      .popper__arrow {
        display: none !important;
      }
      .el-rate__decimal,
      .el-rate__icon .path2 {
        top: 2px;
      }
      .el-rate__icon {
        transform: scale(1.2);
        width: 32px;
        text-align: center;
        margin-right: 12px;
        font-size: 26px;
        &:hover {
          transform: scale(1.2);
        }
        .el-rate__decimal {
          width: 38.6% !important;
          left: 11% !important;
        }
      }
    }
  }
</style>
