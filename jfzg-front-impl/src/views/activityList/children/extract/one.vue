<template>
  <div class="extract-page">
    <div>
      <div class="extract_group">
        <label class="radioLabel" for="">抽取方式：</label>
        <el-radio-group v-model="ruleType">
          <el-radio :label="1">手动抽取</el-radio>
          <el-radio :label="2">自动抽取</el-radio>
          <el-radio :label="3">混合抽取</el-radio>
        </el-radio-group>
      </div>
      <template>
        <SrAdd
          :config="form.config"
          :form="form.data"
          :otherConfig="otherConfig"
          :enums="form.enums"
          ref="srAdd"
        >
        </SrAdd>
      </template>
    </div>
    <SrDialogSelect
      class="SrDialogSelect"
      ref="SrDialogSelect"
      :getList="getList"
      :params="params"
      dialogTitle="选择专家"
      @select="handleSelect"
      :header="expertDialogHeader"
      :isExpert="true"
      @refresh="refresh"
      :selectionConfig="{ display: true }"
    >
      <template v-slot:search>
        <el-input v-model="params.expertName" placeholder="请输入专家姓名"></el-input>
      </template>
    </SrDialogSelect>

    <SrDialogSelect
      class="SrDialogSelect"
      ref="zhidingzhuanjiaSrDialogSelect"
      :getList="getList"
      :params="params"
      dialogTitle="选择专家"
      @select="zhidingzhuanjiahandleSelect"
      :header="expertDialogHeader"
      @refresh="refresh"
      :isExpert="true"
      :selectionConfig="{ display: true }"
    >
      <template v-slot:search>
        <el-input v-model="params.expertName" placeholder="请输入专家姓名"></el-input>
      </template>
    </SrDialogSelect>
  </div>
</template>

<!--
  功能：功能描述
  汪振涛
  时间：2021年07月12日 17:37:26
  版本：v1.0
-->
<script>
import { listByTopicAndItem, queryProvineCity } from "@/api/index";
import config from "@/settings.js";
import upload from "@/utils/upload";
import { getUnitName, queryDetail, evadeExpert } from "@/api/activityList";
export default {
  watch: {
    ruleType: {
      handler(value) {
        console.log(value);
        if (value == 3) {
          this.$set(this.form.config[0], "isHide", false);
        } else {
          this.$set(this.form.config[0], "isHide", true);
        }
      },
      immediate: true
    }
  },
  provide() {
    return {
      baseUrl: config.baseUrl,
      imgBaseUrl: config.imgBaseUrl,
      uploadRequest: upload,
      uploadBaseUrl: config.uploadBaseUrl,
      previewUrl: config.previewUrl
    };
  },
  computed: {
    reviewId() {
      return this.$route.query.id;
    },
    needExpertNum() {
      return this.$route.query.extractNum;
    }
  },
  props: {},
  data() {
    return {
      params: {
        expertName: ''
      },
      getList: evadeExpert,
      ruleType: 1,
      buttonList: [
        {
          role: "",
          btns: [],
          nodes: []
        }
      ],
      clickmethods: {
        tg: this.tg,
        last: this.last,
        next: this.next
      },
      otherConfig: {
        labelNum: 170
      },
      form: {
        config: [
          {
            name: "指定专家",
            type: "selectPeople",
            bind: "zdExpertId",
            addPeople: this.zhidingAddPeople,
            col: 24
          },

          {
            type: "checkbox",
            placeholder: "请选择政策法规标准",
            bind: "standards",
            dataList: "standardOptions",
            trigger: "change",
            col: 24,
            name: "政策法规标准"
          },
          {
            type: "checkbox",
            placeholder: "请选择项目规划与评审",
            bind: "planReview",
            dataList: "planReviewOptions",
            trigger: "change",
            col: 24,
            name: "项目规划与评审"
          },
          {
            type: "checkbox",
            placeholder: "请选择政务信息化领域",
            bind: "govInfoField",
            dataList: "govInfoFieldOptions",
            trigger: "change",
            col: 24,
            name: "政务信息化领域"
          },
          {
            type: "checkbox",
            placeholder: "请选择擅长ICT技术领域",
            bind: "ICTField",
            dataList: "ICTFieldOptions",
            trigger: "change",
            col: 24,
            name: "擅长ICT技术领域"
          },
          {
            type: "checkbox",
            placeholder: "请选择擅长应用领域",
            bind: "appField",
            dataList: "appFieldOptions",
            trigger: "change",
            col: 24,
            name: "擅长应用领域"
          },

          {
            name: "规避专家",
            type: "selectPeople",
            bind: "evadeExpert",
            addPeople: this.addEvadeExpertPeople,
            col: 24
          },
          {
            type: "checkbox",
            placeholder: "请输入规避单位",
            bind: "checkbox",
            dataList: "checkboxList",
            trigger: "change",
            col: 24,
            name: "抽取规则",
            // className: "danweiCheckbox"
          }
        ],
        enums: {
          checkboxList: [
            { dataValue: "1", dataName: "本次抽取屏蔽掉前一场会议抽取的专家" }
          ],
          // oneList: [],
          // expertIndustryVoList: [],
          // evadeUnitList: [],
          // permanentAddressProvineList: [],
          // permanentAddressCityList: [],
          standardOptions: [],
          planReviewOptions: [],
          govInfoFieldOptions: [],
          ICTFieldOptions: [],
          appFieldOptions: []
        },
        data: {
          checkbox: [],
          // province: "",
          // city: "",
          // one: "",
          // two: "",
          // tree: "",
          // evadeUnit: [],
          // hylyList: [],
          evadeExpert: [],
          zdExpertId: [],
          standards: [],
          planReview: [],
          govInfoField: [],
          ICTField: [],
          appField: [],
        }
      },
      expertDialogHeader: [
        {
          label: "姓名",
          prop: "name"
        },
        {
          label: "手机号",
          prop: "phone"
        },
        {
          label: "行业领域",
          prop: "hyName"
        },
        {
          label: "评审次数",
          prop: "time"
        },
        {
          label: "评审平均分",
          prop: "avgScore"
        }
      ]
    };
  },
  created() {
    // this.getUnitStatusList();
    // this.getExpertTechnicalDirectionDtoList();
    // this.getExpertIndustryDtoList();
    // this.getProvine();
    // this.unitName();
    this.getQueryDetail();
    this.getSpecialityList()
  },
  methods: {
    refresh(){
      this.$set(this.params,'expertName','')
    },
    // permanentAddressProvineChange(value) {
    //   if (value) {
    //     this.getCity(value);
    //     this.$set(this.form.enums, "permanentAddressCityList", []);
    //     this.$set(this.form.data, "city", "");
    //   }
    // },
    //获取单位性质
    // getUnitStatusList() {
    //   listByTopicAndItem({ topic: "JFZG_UNIT_NATURE" }).then(res => {
    //     let arr = res.data.map(item => {
    //       return {
    //         label: item.chName,
    //         value: item.itemCode
    //       };
    //     });
    //     this.$set(this.form.enums, "unitStatusList", arr);
    //   });
    // },
    //获取技术方向
    // getExpertTechnicalDirectionDtoList() {
    //   listByTopicAndItem({ topic: "JFZG_SKILL_DIRECTION" }).then(res => {
    //     let arr = res.data.map(item => {
    //       return {
    //         label: item.chName,
    //         itemCode: item.itemCode,
    //         expertId: item.expertId
    //       };
    //     });
    //     this.$set(this.form.enums, "oneList", arr);
    //   });
    // },
    //获取行业领域
    // getExpertIndustryDtoList() {
    //   listByTopicAndItem({ topic: "JFZG_INDUSTRY_TERRITORY" }).then(res => {
    //     let arr = res.data.map(item => {
    //       return {
    //         label: item.chName,
    //         itemCode: item.itemCode,
    //         expertId: item.expertId
    //       };
    //     });
    //     this.$set(this.form.enums, "expertIndustryVoList", arr);
    //   });
    // },
    //行业领域下拉方法
    // expertIndustryDtoList(value, res) {
    //   if (value.length > 3) {
    //     value.shift();
    //   }
    // },
    //获取省
    // getProvine(callback) {
    //   queryProvineCity({ type: "LOC", level: "1" }).then(res => {
    //     let arr = [];
    //     arr = res.data.map(item => {
    //       return {
    //         value: item.code,
    //         label: item.fullname
    //       };
    //     });
    //     this.$set(this.form.enums, "permanentAddressProvineList", arr);
    //   });
    // },
    //获取市
    // getCity(parentCode = "") {
    //   queryProvineCity({
    //     type: "LOC",
    //     level: "2",
    //     parentCode: parentCode
    //   }).then(res => {
    //     let arr = [];
    //     arr = res.data.map(item => {
    //       return {
    //         value: item.code,
    //         label: item.fullname
    //       };
    //     });
    //     this.$set(this.form.enums, "permanentAddressCityList", arr);
    //   });
    // },
    //获取规避单位
    // unitName() {
    //   getUnitName().then(res => {
    //     let arr = res.data.map(item => {
    //       return {
    //         label: item,
    //         itemCode: item
    //       };
    //     });
    //     this.$set(this.form.enums, "evadeUnitList", arr);
    //   });
    // },
    //校验
    verification() {
      let flag = this.$refs.srAdd.validate();
      console.log('flag:', flag)
      // debugger
      // let one = [];
      // let two = [];
      // let tree = [];
      // let enums = this.form.enums;
      if (flag) {
        // if (flag.one) {
        //   enums.oneList.forEach(item => {
        //     if (item.itemCode == flag.one) {
        //       item.num = "1";
        //       one.push(JSON.parse(JSON.stringify(item)));
        //     }
        //   });
        // }
        // if (flag.two) {
        //   enums.oneList.forEach(item => {
        //     if (item.itemCode == flag.two) {
        //       item.num = "2";
        //       two.push(JSON.parse(JSON.stringify(item)));
        //     }
        //   });
        // }
        // if (flag.tree) {
        //   enums.oneList.filter(item => {
        //     if (item.itemCode == flag.tree) {
        //       item.num = "3";
        //       tree.push(JSON.parse(JSON.stringify(item)));
        //     }
        //   });
        // }
        if (flag.checkbox.length) {
          flag.shieldBefore = true;
        }
        if (flag.evadeExpert && flag.evadeExpert.length) {
          flag.evadeExpert = flag.evadeExpert.map(({ id, expertId }) =>
            expertId ? expertId : id
          );
        }
        if (flag.zdExpertId && flag.zdExpertId.length) {
          flag.zdExpertId = flag.zdExpertId.map(({ id, expertId }) =>
            expertId ? expertId : id
          );
        }

        const hylyList = [...flag.standards,...flag.planReview,...flag.appField, ...flag.ICTField, ...flag.govInfoField]
        // const hylyList = selectedCodes.join(',')
        delete flag.standards
        delete flag.planReview
        delete flag.appField
        delete flag.ICTField
        delete flag.govInfoField
        // flag.jsfxList = [...one, ...two, ...tree];
        return {
          ...flag,
          hylyList,
          ...{ ruleType: this.ruleType },
          ...{ needExpertNum: this.needExpertNum },
          ...{ reviewId: this.reviewId }
        };
      } else {
        return false;
      }
    },
    //获取详情
    getQueryDetail() {
      queryDetail({ reviewId: this.reviewId }).then(res => {
        let rs = res.data;
        if (rs) {
          const data = {...this.form.data, id: rs.id}
          // rs.checkbox = [];
          // rs.jsfxList.forEach(item => {
          //   if (item.num == 1) {
          //     rs.one = item.itemCode;
          //   } else if (item.num == 2) {
          //     rs.two = item.itemCode;
          //   } else if (item.num == 3) {
          //     rs.tree = item.itemCode;
          //   }
          // });
          if (rs.shieldBefore) {
            data.checkbox = ["1"];
          }
          // if (rs.province && rs.city) {
          //   this.getCity(rs.province);
          // }
          if (rs.evadeExpertList && rs.evadeExpertList.length) {
            data.evadeExpert = rs.evadeExpertList;
          }
          if (rs.zdExpertIdList && rs.zdExpertIdList.length) {
            rs.zdExpertId = rs.zdExpertIdList;
          }
          // 回填特长数据
          if (rs.hylyList && rs.hylyList.length) {
            rs.hylyList.forEach(code => {
              if (code.startsWith('1')) {
                data.standards.push(code)
              } else if (code.startsWith('2')) {
                data.planReview.push(code)
              } else if (code.startsWith('3')) {
                data.govInfoField.push(code)
              } else if (code.startsWith('4')) {
                data.ICTField.push(code)
              } else if (code.startsWith('5')) {
                data.appField.push(code)
              }
            })
          }
          this.ruleType = rs.ruleType;
          console.log('data>>>>', data)
          this.$set(this.form, "data", data);
        }
      });
    },
    //抽取完专家回调
    handleSelect(val) {
      this.$set(this.form.data, "evadeExpert", val);
    },
    zhidingzhuanjiahandleSelect(val) {
      this.$set(this.form.data, "zdExpertId", val);
    },
    //新增规避专家
    addEvadeExpertPeople() {
      this.params.expertName = ""
      this.$refs.SrDialogSelect.dialogVisible = true;
      this.$refs.SrDialogSelect.search();
    },
    zhidingAddPeople() {
      this.params.expertName = ""
      this.$refs.zhidingzhuanjiaSrDialogSelect.dialogVisible = true;
      this.$refs.zhidingzhuanjiaSrDialogSelect.search();
    },
    getSpecialityList () {
      listByTopicAndItem({ topic: "JFZG_MAJOR_CONTENT" }).then((res) => {
        if (res.msg.code !== '0000') return;
        const standardOptions = []
        const planReviewOptions = []
        const govInfoFieldOptions = []
        const ICTFieldOptions = []
        const appFieldOptions = []
        res.data.forEach(item => {
          if (item.itemCode.startsWith('1')) {
            standardOptions.push({
              dataValue: item.itemCode,
              dataName: item.chName,
            })
          }
          if (item.itemCode.startsWith('2')) {
            planReviewOptions.push({
              dataValue: item.itemCode,
              dataName: item.chName,
            })
          }
          if (item.itemCode.startsWith('3')) {
            govInfoFieldOptions.push({
              dataValue: item.itemCode,
              dataName: item.chName,
            })
          }
          if (item.itemCode.startsWith('4')) {
            ICTFieldOptions.push({
              dataValue: item.itemCode,
              dataName: item.chName,
            })
          }
          if (item.itemCode.startsWith('5')) {
            appFieldOptions.push({
              dataValue: item.itemCode,
              dataName: item.chName,
            })
          }
        })
        this.$set(this.form.enums, "standardOptions", standardOptions);
        this.$set(this.form.enums, "planReviewOptions", planReviewOptions);
        this.$set(this.form.enums, "govInfoFieldOptions", govInfoFieldOptions);
        this.$set(this.form.enums, "ICTFieldOptions", ICTFieldOptions);
        this.$set(this.form.enums, "appFieldOptions", appFieldOptions);
      });
    },
  }
};
</script>

<style lang="scss">
.extract-page {
  .radioLabel {
    width: 170px;
    display: inline-block;
    text-align: right;
    line-height: 32px;
  }
  .extract_group {
    margin-top: 16px;
    margin-bottom: 16px;
  }
  .permanentAddressCity {
    .el-form-item__content {
      margin: 0 !important;
    }
  }
  .danweiCheckbox {
    .el-checkbox {
      display: block;
    }
  }
  .el-checkbox-group {
    border-radius: 8px;
    border: 1px solid #e5e5e5;
    padding: 16px;
  }
  .SrDialogSelect {
    display: none !important;
    ::v-deep .el-input {
      display: none;
    }
  }
}
</style>
