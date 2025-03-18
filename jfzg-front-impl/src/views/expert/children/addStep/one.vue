<template>
  <div>
    <SrAdd
      :config="form.config"
      :form="form.data"
      :otherConfig="otherConfig"
      :enums="form.enums"
      ref="step_one"
      class="expert_add_step"
    >
      <template class="airBox" slot="jiben"
        ><div>
          <img
            src="./../../tips.png"
            class="expert_tips_img"
            width="22px"
            height="22px"
            alt=""
          />
        </div>
        基本信息</template
      >
      <template slot="finance"
        ><div>
          <img
            src="./../../tips.png"
            class="expert_tips_img"
            width="22px"
            height="22px"
            alt=""
          />
        </div>
        财务信息
      </template>
      <template slot="work"
        ><div>
          <img
            src="./../../tips.png"
            class="expert_tips_img"
            width="22px"
            height="22px"
            alt=""
          />
        </div>
        工作单位信息
      </template>
      <template slot="airBox"
        ><div>
          <img
            src="./../../tips.png"
            class="expert_tips_img"
            width="22px"
            height="22px"
            alt=""
          />
        </div>
        专业特长
      </template>
      <!-- <template slot="xueli"
        ><div>
          <img
            src="./../../tips.png"
            class="expert_tips_img"
            width="22px"
            height="22px"
            alt=""
          />
        </div>
        学历证明
      </template> -->
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
import { listByTopicAndItem, queryProvineCity } from "@/api/index";
import { getProfessionalLevel } from "@/api/expert";
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
          this.provine = val.permanentAddressProvine;
        }
      },
      deep: true,
      immediate: true,
    },
    permanentAddressProvine: {},
    // provine: {
    //   handler(val) {
    //     if (val) {
    //       this.getCity(val.permanentAddressProvine);
    //     }
    //   },
    //   deep: true,
    // },
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
            id: "jiben",
            airBoxSlot: true,
            rightSlot: true,
          },
          {
            type: "uploadImg",
            name: "头像",
            bind: "headPhoto",
            fileList: [],
            col: 8,
            showfileTip: true,
            fileType: ".jpg,.jpeg,.jpe,.png", //校验
            fileTip: "只能上传jpg/jpeg/jpe/png格式", //提示
          },
          {
            type: "uploadImg",
            name: "身份证正面",
            bind: "identityFrontPhone",
            fileList: [],
            col: 8,
            // required: "未上传身份证正面照片",
            showfileTip: true,
            fileType: ".jpg,.jpeg,.jpe,.png", //校验
            fileTip: "只能上传jpg/jpeg/jpe/png格式", //提示
          },
          {
            type: "uploadImg",
            name: "身份证反面",
            bind: "identityReversePhone",
            fileList: [],
            col: 8,
            // required: "未上传身份证反面照片",
            showfileTip: true,
            fileType: ".jpg,.jpeg,.jpe,.png", //校验
            fileTip: "只能上传jpg/jpeg/jpe/png格式", //提示
          },
          {
            type: "input",
            name: "姓名",
            placeholder: "请输入姓名",
            bind: "name",
            maxLength: 2000,
            col: 8,
            required: "姓名不能为空",
          },
          {
            type: "radio",
            name: "性别",
            bind: "gender",
            col: 8,
            dataList: "genderList",
            // required: "性别不能为空",
            label: "label",
          },
          {
            type: "select",
            name: "民族",
            placeholder: "请输入民族",
            bind: "nationality",
            // maxLength: 20,
            dataList: "nationalityList",
            filterable: "true",
            trigger: "change",
            col: 8,
            label: "label",
            value: "value",
          },
          {
            type: "dateSelect",
            timeType: "date",
            name: "出生年月",
            bind: "birthDate",
            placeholder: "请选择出生年月",
            col: 8,
            format: "yyyy-MM-dd",
          },
          {
            type: "input",
            name: "身份证号",
            placeholder: "请输入身份证号",
            bind: "identityCard",
            maxLength: 20,
            col: 8,
            required: "身份证号不能为空",
            rules: {
              regular_IdCard: "请输入正确的身份证号码！",
            },
          },
          {
            type: "select",
            name: "政治面貌",
            placeholder: "请选择政治面貌",
            bind: "politicsStatus",
            dataList: "politicsStatusList",
            trigger: "change",
            col: 8,
            label: "label",
            value: "value",
          },
          {
            type: "input",
            name: "联系电话",
            placeholder: "请输入联系电话",
            bind: "phone",
            col: 8,
            required: "联系电话不能为空",
            rules: {
              isphone: "联系电话格式不正确",
            },
          },
          {
            type: "input",
            name: "电子邮箱",
            placeholder: "请输入电子邮箱",
            bind: "email",
            col: 8,
            required: "邮箱不能为空",
            rules: {
              isEmail: "邮箱格式不正确",
            },
          },
          {
            type: "input",
            name: "毕业院校",
            placeholder: "请输入毕业院校",
            bind: "graduatedSchool",
            maxLength: 2000,
            col: 8,
          },
          {
            type: "input",
            name: "学位",
            placeholder: "请输入学位",
            bind: "diploma",
            maxLength: 2000,
            col: 8,
          },
          {
            type: "input",
            name: "专业",
            placeholder: "请输入专业",
            bind: "major",
            maxLength: 50,
            col: 8,
          },
          /* {
            type: "input",
            name: "专业技术资格",
            placeholder: "请输入专业技术资格",
            bind: "career",
            maxLength: 50,
            col: 8,
          }, */

          {
            type: "airBox", //占位空格
            col: 24,
            id: "finance",
            airBoxSlot: true,
            rightSlot: true,
          },
          {
            type: "input",
            name: "开户行",
            placeholder: "请输入开户行",
            bind: "bankName",
            maxLength: 2000,
            col: 8,
            required: "开户银行不能为空",
          },
          {
            type: "input",
            name: "银行卡号",
            placeholder: "请输入银行卡号",
            bind: "bankCard",
            maxLength: 2000,
            col: 8,
            required: "银行卡号不能为空",
            rules: {
              regular_BankCard: "请输入正确的银行卡号",
            },
          },
          {
            type: "airBox", //占位空格
            col: 24,
            id: "work",
            airBoxSlot: true,
            rightSlot: true,
          },
          {
            type: "input",
            name: "工作单位",
            placeholder: "请输入工作单位",
            bind: "workUnit",
            maxLength: 2000,
            col: 8,
            required: "工作单位不能为空",
          },
          {
            type: "select",
            name: "体制类别",
            placeholder: "请选择体制类别",
            bind: "isInSystem",
            dataList: "systemCategoryList",
            // maxLength: 50,
            col: 8,
            required: "体制类别不能为空",
            label: "label",
            value: "value",
          },
          {
            type: "input",
            name: "职务",
            placeholder: "请输入职务",
            bind: "duty",
            maxLength: 2000,
            col: 8,
            required: "职务不能为空",
          },
          {
            type: "select",
            name: "专家职称类型",
            placeholder: "请选择专家职称类型",
            bind: "professionalLevelId",
            dataList: "professionalLevelList",
            trigger: "change",
            col: 8,
            required: "专家职称类型不能为空",
            label: "label",
            value: "value",
            change: this.professionalLevelNameChange,
          },
          {
            type: "input",
            name: "劳务费基准",
            placeholder: "请输入劳务费基准",
            bind: "basePrice",
            maxLength: 50,
            col: 8,
            required: "劳务费基准不能为空",
            disabled: true,
          },
          {
            type: "input",
            name: "单位联系人",
            placeholder: "请输入单位联系人",
            bind: "unitContact",
            col: 8,
            maxLength: 2000,
          },
          {
            type: "input",
            name: "单位电话",
            placeholder: "请输入单位电话",
            bind: "unitPhone",
            col: 8,
            maxLength: 500,
          },
          {
            type: "input",
            name: "工作经历",
            placeholder: "请输入工作经历",
            bind: "workExperience",
            col: 24,
            maxLength: 2000,
          },
          {
            type: "input",
            name: "项目经历与取得成果",
            placeholder: "请输入项目经历与取得成果",
            bind: "projectExperience",
            col: 24,
            maxLength: 2000,
          },

          {
            type: "input",
            name: "推荐单位意见",
            placeholder: "请输入推荐单位意见",
            bind: "recommendation",
            col: 24,
            maxLength: 2000,
          },

          // {
          //   type: "number",
          //   name: "工作年限",
          //   placeholder: "请输入工作年限",
          //   bind: "workYear",
          //   col: 8,
          //   max: 50,
          //   min: 1,
          //   rules: {
          //     isNumber: "请输入正确的工作年限",
          //   },
          // },
          // {
          //   type: "select",
          //   name: "常驻省",
          //   placeholder: "请选择常驻省",
          //   bind: "permanentAddressProvine",
          //   dataList: "permanentAddressProvineList",
          //   trigger: "change",
          //   col: 8,
          //   label: "label",
          //   value: "value",
          //   change: this.permanentAddressProvineChange,
          //   // required: "未选择常驻省",
          // },
          // {
          //   type: "select",
          //   name: "常驻市",
          //   placeholder: "请选择市",
          //   bind: "permanentAddressCity",
          //   dataList: "permanentAddressCityList",
          //   trigger: "change",
          //   col: 8,
          //   label: "label",
          //   value: "value",
          //   // required: "未选择常驻市",
          // },
          // {
          //   type: "select",
          //   name: "政治面貌",
          //   placeholder: "请选择政治面貌",
          //   bind: "politicsStatus",
          //   dataList: "politicsStatusList",
          //   trigger: "change",
          //   col: 8,
          //   label: "label",
          //   value: "value",
          // },
          // {
          //   type: "radio",
          //   name: "是否在职",
          //   bind: "workStatus",
          //   col: 8,
          //   dataList: "workStatusList",
          //   label: "label",
          //   // required: "未选择是否在职",
          // },
          // {
          //   type: "select",
          //   name: "所属委员会",
          //   placeholder: "请选择所属委员会",
          //   bind: "expertLabel",
          //   dataList: "expertLabelList",
          //   trigger: "change",
          //   col: 8,
          //   label: "label",
          //   value: "value",
          // },
          // {
          //   type: "dateSelect",
          //   timeType: "daterange",
          //   name: "专家聘期",
          //   bind: "expertTime",
          //   col: 8,
          //   startname: "expertStartDate",
          //   endname: "expertEndDate",
          //   // required: "未选择专家聘期",
          //   startPlaceholder: "开始日期",
          //   endPlaceholder: "结束日期",
          //   format: "yyyy-MM-dd",
          // },
          // {
          //   type: "dateSelect",
          //   timeType: "daterange",
          //   name: "委员会聘期",
          //   bind: "expertLabelTime",
          //   col: 8,
          //   startname: "expertLabelStartDate",
          //   endname: "expertLabelEndDat",
          //   // required: "未选择委员会聘期",
          //   startPlaceholder: "开始日期",
          //   endPlaceholder: "结束日期",
          //   format: "yyyy-MM-dd",
          // },
          // {
          //   type: "dateSelect",
          //   timeType: "date",
          //   name: "批示时间",
          //   bind: "examineDate",
          //   col: 8,
          //   // required: "未选择批示时间",
          //   placeholder: "请选择",
          //   format: "yyyy-MM-dd",
          // },

          {
            type: "airBox", //占位空格
            col: 24,
            id: "airBox",
            airBoxSlot: true,
            rightSlot: true,
          },
          {
            type: "checkbox",
            placeholder: "请选择政策法规标准",
            bind: "standards",
            dataList: "standardOptions",
            trigger: "change",
            col: 24,
            name: "政策法规标准",
          },
          {
            type: "checkbox",
            placeholder: "请选择项目规划与评审",
            bind: "planReview",
            dataList: "planReviewOptions",
            trigger: "change",
            col: 24,
            name: "项目规划与评审",
          },
          {
            type: "checkbox",
            placeholder: "请选择政务信息化领域",
            bind: "govInfoField",
            dataList: "govInfoFieldOptions",
            trigger: "change",
            col: 24,
            name: "政务信息化领域",
          },
          {
            type: "checkbox",
            placeholder: "请选择擅长ICT技术领域",
            bind: "ICTField",
            dataList: "ICTFieldOptions",
            trigger: "change",
            col: 24,
            name: "擅长ICT技术领域",
          },
          {
            type: "checkbox",
            placeholder: "请选择擅长应用领域",
            bind: "appField",
            dataList: "appFieldOptions",
            trigger: "change",
            col: 24,
            name: "擅长应用领域",
          },
          {
            type: "input",
            name: "其他",
            placeholder: "请输入其他",
            bind: "other",
            col: 24,
            maxLength: 500,
          },
          // {
          //   type: "uploadImg",
          //   name: "身份证正面",
          //   bind: "identityFrontPhone",
          //   fileList: [],
          //   col: 24,
          //   // required: "未上传身份证正面照片",
          // },
          // {
          //   type: "uploadImg",
          //   name: "身份证反面",
          //   bind: "identityReversePhone",
          //   fileList: [],
          //   col: 24,
          //   // required: "未上传身份证反面照片",
          // },
          // {
          //   type: "airBox", //占位空格
          //   col: 24,
          //   id: "xueli",
          //   airBoxSlot: true,
          //   rightSlot: true,
          // },
          // {
          //   type: "uploadImg",
          //   name: "最高学历毕业证书",
          //   bind: "educationPhone",
          //   fileList: [],
          //   col: 24,
          // },
          // {
          //   type: "uploadImg",
          //   name: "最高学位毕业证书",
          //   bind: "diplomaPhone",
          //   fileList: [],
          //   col: 24,
          // },
        ],
        data: {
          headPhoto: "",
          name: "",
          identityCard: "",
          birthDate: "",
          gender: "",
          phone: "",
          email: "",
          bankName: "",
          bankCard: "",
          // workYear: "",
          // permanentAddressProvine: "",
          // permanentAddressCity: "",
          politicsStatus: "",
          // workStatus: "",
          // expertLabel: "",
          // expertTime: [],
          // expertLabelTime: [],
          // examineDate: "",
          identityFrontPhone: "",
          identityReversePhone: "",
          // educationPhone: "",
          // diplomaPhone: "",
          nationality: "",
          career: "",
          graduatedSchool: "",
          diploma: "",
          major: "",
          workUnit: "",
          duty: "",
          workExperience: "",
          projectExperience: "",
          recommendation: "",
          standards: [],
          planReview: [],
          govInfoField: [],
          ICTField: [],
          appField: [],
          other: "",
        },
        enums: {
          politicsStatusList: [],
          genderList: [],
          // workStatusList: [],
          // expertLabelList: [],
          // permanentAddressProvineList: [],
          // permanentAddressCityList: [],
          standardOptions: [],
          planReviewOptions: [],
          govInfoFieldOptions: [],
          ICTFieldOptions: [],
          appFieldOptions: [],
          professionalLevelList: [], //职称类别
          systemCategoryList: [
            {
              label: "体制外",
              value: 0,
            },
            {
              label: "体制内",
              value: 1,
            },
          ],
        },
      },
      provine: "",
      basePriceList: [], //劳务费基准
      nationalityList: [], //民族
    };
  },
  methods: {
    professionalLevelNameChange(value) {
      if (value) {
        this.basePriceList.map((item) => {
          if (item.id == value) {
            this.$set(this.form.data, "basePrice", item.price);
          }
        });
      } else {
        this.$set(this.form.data, "basePrice", "");
      }
    },
    // 获取职称列表
    getProfessionalLevelList() {
      getProfessionalLevel().then((res) => {
        console.log("职称列表", res);
        this.basePriceList = res.data;
        let arr = res.data.map((item) => {
          return {
            label: item.name,
            value: item.id,
          };
        });
        this.$set(this.form.enums, "professionalLevelList", arr);
      });
    },
    // 获取民族
    getnationalityList() {
      listByTopicAndItem({ topic: "NATION_ENUM" }).then((res) => {
        console.log("民族", res);
        let arr = res.data.map((item) => {
          return {
            label: item.chName,
            value: item.itemCode,
          };
        });
        this.$set(this.form.enums, "nationalityList", arr);
      });
    },
    //获取政治面貌
    getpoliticsStatusList() {
      listByTopicAndItem({ topic: "JFZG_EXPERT_ZZMM" }).then((res) => {
        console.log("政治面貌", res);
        let arr = res.data.map((item) => {
          return {
            label: item.chName,
            value: item.itemCode,
          };
        });
        this.$set(this.form.enums, "politicsStatusList", arr);
      });
    },
    //获取性别
    getgenderList() {
      listByTopicAndItem({ topic: "JFZG_EXPERT_GENDER" }).then((res) => {
        let arr = res.data.map((item) => {
          return {
            label: item.itemCode,
            dataName: item.chName,
          };
        });
        this.$set(this.form.enums, "genderList", arr);
      });
    },
    //获取是否在职
    // getWorkStatusList() {
    //   listByTopicAndItem({ topic: "JFZG_EXPERT_WORK_STATUS" }).then((res) => {
    //     let arr = res.data.map((item) => {
    //       return {
    //         label: item.itemCode,
    //         dataName: item.chName,
    //       };
    //     });
    //     this.$set(this.form.enums, "workStatusList", arr);
    //   });
    // },
    // //获取所属委员会
    // getExpertLabelList() {
    //   listByTopicAndItem({ topic: "JFZG_EXPERT_COMMITTEE" }).then((res) => {
    //     let arr = res.data.map((item) => {
    //       return {
    //         label: item.chName,
    //         value: item.itemCode,
    //       };
    //     });
    //     this.$set(this.form.enums, "expertLabelList", arr);
    //   });
    // },
    //获取省
    // getProvine(callback) {
    //   queryProvineCity({ type: "LOC", level: "1" }).then((res) => {
    //     let arr = [];
    //     arr = res.data.map((item) => {
    //       return {
    //         value: item.code,
    //         label: item.fullname,
    //       };
    //     });
    //     this.$set(this.form.enums, "permanentAddressProvineList", arr);
    //   });
    // },
    //获取市
    // getCity(parentCode = "", cityCode = "") {
    //   queryProvineCity({
    //     type: "LOC",
    //     level: "2",
    //     parentCode: parentCode,
    //   }).then((res) => {
    //     let arr = [];
    //     arr = res.data.map((item) => {
    //       return {
    //         value: item.code,
    //         label: item.fullname,
    //       };
    //     });
    //     this.$set(this.form.enums, "permanentAddressCityList", arr);
    //   });
    // },
    //校验
    verification() {
      console.log("1111", this.$refs.step_one);
      let flag = this.$refs.step_one.validate();
      if (flag) {
        return flag;
      }
    },
    //下拉时获取到省的值
    // permanentAddressProvineChange(value) {
    //   if (value) {
    //     this.getCity(value);
    //     this.$set(this.form.enums, "permanentAddressCityList", []);
    //     this.$set(this.form.data, "permanentAddressCity", "");
    //   }
    // },
    workYearInput(value) {
      console.log(value);
    },
    getSpecialityList() {
      listByTopicAndItem({ topic: "JFZG_MAJOR_CONTENT" }).then((res) => {
        if (res.msg.code !== "0000") return;
        const standardOptions = [];
        const planReviewOptions = [];
        const govInfoFieldOptions = [];
        const ICTFieldOptions = [];
        const appFieldOptions = [];
        res.data.forEach((item) => {
          if (item.itemCode.startsWith("1")) {
            standardOptions.push({
              dataValue: item.itemCode,
              dataName: item.chName,
            });
          }
          if (item.itemCode.startsWith("2")) {
            planReviewOptions.push({
              dataValue: item.itemCode,
              dataName: item.chName,
            });
          }
          if (item.itemCode.startsWith("3")) {
            govInfoFieldOptions.push({
              dataValue: item.itemCode,
              dataName: item.chName,
            });
          }
          if (item.itemCode.startsWith("4")) {
            ICTFieldOptions.push({
              dataValue: item.itemCode,
              dataName: item.chName,
            });
          }
          if (item.itemCode.startsWith("5")) {
            appFieldOptions.push({
              dataValue: item.itemCode,
              dataName: item.chName,
            });
          }
        });
        this.$set(this.form.enums, "standardOptions", standardOptions);
        this.$set(this.form.enums, "planReviewOptions", planReviewOptions);
        this.$set(this.form.enums, "govInfoFieldOptions", govInfoFieldOptions);
        this.$set(this.form.enums, "ICTFieldOptions", ICTFieldOptions);
        this.$set(this.form.enums, "appFieldOptions", appFieldOptions);
      });
    },
  },
  created() {
    this.getnationalityList(); //获取民族
    this.getpoliticsStatusList();
    this.getgenderList();
    this.getSpecialityList();
    this.getProfessionalLevelList();
    // this.getWorkStatusList();
    // this.getExpertLabelList();
    // this.getProvine();
  },
};
</script>

<style lang="scss">
.expert_add_step {
  border-left: 1px dashed #cccccc;
  margin-left: 15px;
  .el-form-item {
    .airBox {
      position: relative;
      padding-left: 25px;
      div {
        width: 22px;
        height: 30px;
        display: inline-block;
        position: absolute;
        background: #fff;
        left: -1px;
        .expert_tips_img {
          vertical-align: middle;
          position: absolute;
          left: -13px;
          top: 5px;
        }
      }
    }
  }
}
</style>
