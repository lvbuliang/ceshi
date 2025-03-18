<template>
  <div>
    <SrAdd
      :config="form.config"
      :form="form.data"
      :otherConfig="otherConfig"
      :enums="form.enums"
      ref="step_two"
      class="expert_add_step"
    >
      <template slot="jishu"
        ><div>
          <img
            src="./../../tips.png"
            class="expert_tips_img"
            width="22px"
            height="22px"
            alt=""
          />
        </div>
        技术方向
      </template>
      <template slot="lingyu">
        <div>
          <img
            src="./../../tips.png"
            class="expert_tips_img"
            width="22px"
            height="22px"
            alt=""
          />
        </div>
        行业领域
      </template>
      <template slot="zhichen"
        ><div>
          <img
            src="./../../tips.png"
            class="expert_tips_img"
            width="22px"
            height="22px"
            alt=""
          />
        </div>
        最高职称
      </template>
      <template slot="zige"
        ><div>
          <img
            src="./../../tips.png"
            class="expert_tips_img"
            width="22px"
            height="22px"
            alt=""
          />
        </div>
        职业资格
      </template>
      <template slot="xinxi"
        ><div>
          <img
            src="./../../tips.png"
            class="expert_tips_img"
            width="22px"
            height="22px"
            alt=""
          />
        </div>
        从事专业信息</template
      >
      <template slot="zhenshu"
        ><div>
          <img
            src="./../../tips.png"
            class="expert_tips_img"
            width="22px"
            height="22px"
            alt=""
          />
        </div>
        专业技术资格证书</template
      >
      <template slot="jingli"
        ><div>
          <img
            src="./../../tips.png"
            class="expert_tips_img"
            width="22px"
            height="22px"
            alt=""
          />
        </div>
        专业相关工作经历</template
      >
      <template slot="chenguo"
        ><div>
          <img
            src="./../../tips.png"
            class="expert_tips_img"
            width="22px"
            height="22px"
            alt=""
          />
        </div>
        个人成果</template
      >
    </SrAdd>
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
      uploadFileUrl: config.uploadFileUrl,
      previewUrl: config.previewUrl,
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
  watch: {
    detailedParams: {
      handler(val) {
        if (this.$route.query.id) {
          this.$set(this.form, "data", val);
        }
      },
      deep: true,
    },
  },
  data() {
    return {
      otherConfig: {
        labelNum: 190,
      },
      form: {
        config: [
          {
            type: "airBox", //占位空格
            col: 24,
            id: "jishu",
            airBoxSlot: true,
            rightSlot: true,
          },
          {
            type: "select",
            name: "第一技术方向",
            placeholder: "请选择第一技术方向",
            bind: "one",
            dataList: "oneList",
            required: "未选择第一技术方向",
            col: 8,
            label: "label",
            value: "itemCode",
          },
          {
            type: "select",
            name: "第二技术方向",
            placeholder: "请选择第一技术方向",
            bind: "two",
            dataList: "oneList",
            col: 8,
            label: "label",
            value: "itemCode",
          },
          {
            type: "select",
            name: "第三技术方向",
            placeholder: "请选择第一技术方向",
            bind: "tree",
            dataList: "oneList",
            col: 8,
            label: "label",
            value: "itemCode",
          },
          {
            type: "airBox", //占位空格
            col: 24,
            id: "lingyu",
            airBoxSlot: true,
            rightSlot: true,
          },
          {
            type: "select",
            col: 24,
            name: "行业领域",
            multiple: true,
            dataList: "expertIndustryVoList",
            bind: "dtoList",
            label: "label",
            value: "itemCode",
            change: this.expertIndustryDtoList,
            // required: "未选择行业领域",
          },
          {
            type: "airBox", //占位空格
            col: 24,
            id: "zhichen",
            airBoxSlot: true,
            rightSlot: true,
          },
          {
            type: "input",
            name: "职称",
            placeholder: "请输入职称",
            bind: "professional",
            col: 8,
          },
          {
            type: "dateSelect",
            timeType: "date",
            name: "职称评定时间",
            bind: "professionalDate",
            col: 12,
            placeholder: "请选择职称评定时间",
            format: "yyyy-MM-dd",
          },
          {
            type: "uploadImg",
            name: "职称证书",
            bind: "professionalPhoto",
            fileList: [],
            col: 24,
            limit: 10,
          },
          {
            type: "airBox", //占位空格
            col: 24,
            id: "zige",
            airBoxSlot: true,
            rightSlot: true,
          },
          {
            type: "input",
            name: "职业资格",
            placeholder: "请输入职业资格",
            bind: "career",
            col: 8,
          },
          {
            type: "dateSelect",
            timeType: "date",
            name: "取得时间",
            bind: "careerDate",
            col: 8,
            placeholder: "请选择取得时间",
            // required: "取得时间不能为空",
            format: "yyyy-MM-dd",
          },
          {
            type: "input",
            name: "注册号",
            placeholder: "请输入注册号",
            bind: "careerNum",
            col: 8,
          },
          {
            type: "uploadImg",
            name: "职称证书",
            bind: "careerPhoto",
            fileList: [],
            col: 24,
            limit: 10,
          },
          {
            type: "airBox", //占位空格
            col: 24,
            id: "xinxi",
            airBoxSlot: true,
            rightSlot: true,
          },
          {
            type: "input",
            name: "现从事专业",
            placeholder: "请输入现从事专业",
            bind: "major",
            col: 8,
          },
          {
            type: "dateSelect",
            timeType: "date",
            name: "从事时间",
            bind: "majorDate",
            col: 8,
            placeholder: "请选择从事时间",
            format: "yyyy-MM-dd",
          },
          {
            type: "dateSelect",
            timeType: "date",
            name: "结束时间",
            bind: "majorEndDate",
            col: 8,
            placeholder: "请选择结束时间",
            format: "yyyy-MM-dd",
          },
          {
            type: "airBox", //占位空格
            col: 24,
            id: "zhenshu",
            airBoxSlot: true,
            rightSlot: true,
          },
          {
            type: "input",
            name: "证书名称",
            placeholder: "请输入证书名称",
            // required: "证书名称不能为空",
            bind: "technologyName",
            col: 8,
          },
          {
            type: "dateSelect",
            timeType: "date",
            name: "取得时间",
            bind: "technologyDate",
            col: 8,
            placeholder: "请选择取得时间",
            format: "yyyy-MM-dd",
          },
          {
            type: "uploadImg",
            name: "证书",
            bind: "technologyPhoto",
            fileList: [],
            col: 24,
            limit: 10,
          },
          {
            type: "airBox", //占位空格
            col: 24,
            id: "jingli",
            airBoxSlot: true,
            rightSlot: true,
          },
          {
            type: "input",
            name: "工作单位",
            placeholder: "请输入工作单位",
            bind: "workUnit",
            col: 8,
            // required: "工作单位不能为空",
          },
          {
            type: "input",
            name: "职务",
            placeholder: "请输入职务",
            bind: "duty",
            col: 8,
            // required: "职务不能为空",
          },
          {
            type: "dateSelect",
            timeType: "date",
            name: "从事时间",
            bind: "workStartDate",
            col: 8,
            placeholder: "请选择从事时间",
            format: "yyyy-MM-dd",
            // required: "从事时间不能为空",
          },
          {
            type: "dateSelect",
            timeType: "date",
            name: "结束时间",
            bind: "workEndDate",
            col: 8,
            placeholder: "请选择结束时间",
            format: "yyyy-MM-dd",
          },
          {
            type: "select",
            name: "单位性质",
            bind: "unitStatus",
            col: 8,
            dataList: "unitStatusList",
            label: "label",
            value: "value",
            // required: "单位性质不能为空",
            placeholder: "请选择",
          },
          {
            type: "airBox", //占位空格
            col: 24,
            id: "chenguo",
            airBoxSlot: true,
            rightSlot: true,
          },
          {
            type: "textarea",
            name: "工作经历及获奖情况",
            placeholder: "请输入工作经历及获奖情况",
            bind: "workExperience",
            col: 24,
            maxLength: 30,
            rules: {
              maxLength_30: "请输入30个字符以内的内容",
            },
          },
          {
            type: "textarea",
            name: "参与评审的项目",
            placeholder: "请输入参与评审的项目",
            bind: "reviewContent",
            col: 24,
            maxLength: 30,
            rules: {
              maxLength_30: "请输入30个字符以内的内容",
            },
          },
        ],
        data: {
          professional: "",
          professionalDate: "",
          professionalPhoto: [],
          career: "",
          careerDate: "",
          careerNum: "",
          careerPhoto: "",
          major: "",
          majorDate: "",
          majorEndDate: "",
          technologyName: "",
          technologyDate: "",
          technologyPhoto: [],
          workUnit: "",
          duty: "",
          workStartDate: "",
          workEndDate: "",
          unitStatus: "",
          workExperience: "",
          reviewContent: "",
          dtoList: [],
        },
        enums: {
          unitStatusList: [],
          oneList: [],
          expertIndustryVoList: [],
        },
      },
    };
  },
  methods: {
    //获取单位性质
    getUnitStatusList() {
      listByTopicAndItem({ topic: "JFZG_UNIT_NATURE" }).then((res) => {
        let arr = res.data.map((item) => {
          return {
            label: item.chName,
            value: item.itemCode,
          };
        });
        this.$set(this.form.enums, "unitStatusList", arr);
      });
    },
    //获取技术方向
    getExpertTechnicalDirectionDtoList() {
      listByTopicAndItem({ topic: "JFZG_SKILL_DIRECTION" }).then((res) => {
        let arr = res.data.map((item) => {
          return {
            label: item.chName,
            itemCode: item.itemCode,
            expertId: item.expertId,
          };
        });
        this.$set(this.form.enums, "oneList", arr);
      });
    },
    //获取行业领域
    getExpertIndustryDtoList() {
      listByTopicAndItem({ topic: "JFZG_INDUSTRY_TERRITORY" }).then((res) => {
        let arr = res.data.map((item) => {
          return {
            label: item.chName,
            itemCode: item.itemCode,
            expertId: item.expertId,
          };
        });
        this.$set(this.form.enums, "expertIndustryVoList", arr);
      });
    },
    //行业领域下拉方法
    expertIndustryDtoList(value, res) {
      if (value.length > 3) {
        value.shift();
      }
    },
    //校验
    verification() {
      let flag = this.$refs.step_two.validate();
      if (flag) {
        return flag;
      }
    },
  },
  mounted() {
    this.getUnitStatusList();
    this.getExpertTechnicalDirectionDtoList();
    this.getExpertIndustryDtoList();
  },
};
</script>

<style scoped >
</style>
