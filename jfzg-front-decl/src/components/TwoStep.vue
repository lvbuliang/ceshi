<template>
  <div class="extract-page">
    <div style="margin: 16px 8px 16px 24px">
      <div class="extract_group">
        <label class="radioLabel" for="">抽取方式：</label>
        <el-radio-group v-model="ruleType">
          <el-radio :label="1">手动抽取</el-radio>
          <el-radio :label="2">自动抽取</el-radio>
          <el-radio :label="3">混合抽取</el-radio>
        </el-radio-group>
      </div>
      <SrAdd
        :config="form.config"
        :form="form.data"
        :otherConfig="otherConfig"
        :enums="form.enums"
        ref="srAdd"
        class="select-class"
        :isExpertDialog="isExpertDialog"
      >
      </SrAdd>
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
      style="display: none"
      :addFlag="false"
    >
      <template v-slot:search>
        <el-input
          v-model="params.expertName"
          placeholder="请输入专家姓名"
        ></el-input>
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
      style="display: none"
      :addFlag="false"
    >
      <template v-slot:search>
        <el-input
          v-model="params.expertName"
          placeholder="请输入专家姓名"
        ></el-input>
      </template>
    </SrDialogSelect>
  </div>
</template>

<script>
import { listByTopicAndItem } from "@/api/index";
import { evadeExpert, queryDetail } from "@/api/planProject";
export default {
  name: "",
  components: {},
  props: {
    // expertList: {
    //   type: Array,
    //   default: () => {
    //     return [];
    //   },
    // },
    reviewId: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      form: {
        config: [
          {
            name: "指定专家",
            type: "selectPeople",
            bind: "zdExpertId",
            addPeople: this.zhidingAddPeople,
            col: 24,
          },
          {
            type: "select",
            placeholder: "请选择专家体制类型",
            bind: "isInSystem",
            dataList: "systemTypeOptions",
            trigger: "change",
            col: 24,
            name: "专家体制类型",
            collapseTags: true,
          },
          {
            type: "select",
            placeholder: "请选择政策法规标准",
            bind: "standards",
            dataList: "standardOptions",
            trigger: "change",
            col: 24,
            name: "政策法规标准",
            multiple: true,
            collapseTags: true,
          },
          {
            type: "select",
            placeholder: "请选择项目规划与评审",
            bind: "planReview",
            dataList: "planReviewOptions",
            trigger: "change",
            col: 24,
            name: "项目规划与评审",
            multiple: true,
            collapseTags: true,
          },
          {
            type: "select",
            placeholder: "请选择政务信息化领域",
            bind: "govInfoField",
            dataList: "govInfoFieldOptions",
            trigger: "change",
            col: 24,
            name: "政务信息化领域",
            multiple: true,
            collapseTags: true,
          },
          {
            type: "select",
            placeholder: "请选择擅长ICT技术领域",
            bind: "ICTField",
            dataList: "ICTFieldOptions",
            trigger: "change",
            col: 24,
            name: "擅长ICT技术领域",
            multiple: true,
            collapseTags: true,
          },
          {
            type: "select",
            placeholder: "请选择擅长应用领域",
            bind: "appField",
            dataList: "appFieldOptions",
            trigger: "change",
            col: 24,
            name: "擅长应用领域",
            multiple: true,
            collapseTags: true,
          },

          {
            name: "规避专家",
            type: "selectPeople",
            bind: "evadeExpert",
            addPeople: this.addEvadeExpertPeople,
            col: 24,
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
          },
          /*     {
            type: "dateRelevancy",
            placeholder: "请选择",
            bind: "activityTime",
            dataList: "activityTime",
            trigger: "change",
            col: 12,
            name: "评审活动周期",
            // className: "danweiCheckbox"
          }, */
        ],
        enums: {
          checkboxList: [
            { dataValue: "1", dataName: "本次抽取屏蔽掉前一场会议抽取的专家" },
          ],
          // oneList: [],
          // expertIndustryVoList: [],
          // evadeUnitList: [],
          // permanentAddressProvineList: [],
          // permanentAddressCityList: [],
          systemTypeOptions: [
            {
              dataValue: 2,
              dataName: "全部",
            },
            {
              dataValue: 0,
              dataName: "体制内",
            },
            {
              dataValue: 1,
              dataName: "体制外",
            },
          ],
          standardOptions: [],
          planReviewOptions: [],
          govInfoFieldOptions: [],
          ICTFieldOptions: [],
          appFieldOptions: [],
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
          isInSystem: 2,
          evadeExpert: [],
          zdExpertId: [],
          standards: [],
          planReview: [],
          govInfoField: [],
          ICTField: [],
          appField: [],
        },
      },
      otherConfig: {
        labelNum: 130,
      },
      isExpertDialog: true,
      getList: evadeExpert,
      expertDialogHeader: [
        {
          label: "姓名",
          prop: "name",
        },
        {
          label: "手机号",
          prop: "phone",
        },
        {
          label: "行业领域",
          prop: "hyName",
        },
        {
          label: "评审次数",
          prop: "time",
        },
        {
          label: "评审平均分",
          prop: "avgScore",
        },
      ],
      params: {
        pageSize: 10,
        expertName: "",
      },
      isInSystemList: [
        {
          value: 2,
          label: "全部",
        },
        {
          value: 0,
          label: "体制内",
        },
        {
          value: 1,
          label: "体制外",
        },
      ],

      value: "",
      isVisable: true,
      ruleType: 1,
    };
  },
  watch: {
    ruleType: {
      handler(value) {
        console.log(value);
        // 清空指定专家
        this.$set(this.form.data, "zdExpertId", []);
        if (value == 3) {
          this.$set(this.form.config[0], "isHide", false);
        } else {
          this.$set(this.form.config[0], "isHide", true);
        }
      },
      immediate: true,
    },
  },
  created() {
    this.getSpecialityList();
    this.getQueryDetail();
    // console.log("搜搜名字", this.expertList);
    // if (this.expertList.length > 0) {
    //   this.expertList.forEach((item) => {
    //     item.expertId = item.id;
    //     item.expertName = item.name;
    //   });
    //   this.$set(this.form.data, "zdExpertId", this.expertList);
    // }
  },
  methods: {
    //校验
    verification() {
      let flag = this.$refs.srAdd.validate();
      console.log("flag:", flag);
      if (flag) {
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

        const hylyList = [
          ...flag.standards,
          ...flag.planReview,
          ...flag.appField,
          ...flag.ICTField,
          ...flag.govInfoField,
        ];
        delete flag.standards;
        delete flag.planReview;
        delete flag.appField;
        delete flag.ICTField;
        delete flag.govInfoField;
        return {
          ...flag,
          hylyList,
          ...{ ruleType: this.ruleType },
          ...{ needExpertNum: this.needExpertNum },
          ...{ reviewId: this.reviewId },
        };
      } else {
        return false;
      }
    },
    refresh() {
      this.$set(this.params, "expertName", "");
    },
    //抽取完专家回调
    handleSelect(val) {
      console.log("规避专家", val);
      let cancatArr = [];
      const filteredList = val.reduce((uniqueList, item) => {
        // 检查是否已经存在相同 id 的项
        const existingItem = uniqueList.find(
          (uniqueItem) => uniqueItem.id === item.id
        );
        // 如果不存在相同 id 的项，则将当前项添加到 uniqueList 中
        if (!existingItem) {
          uniqueList.push(item);
        }
        return uniqueList;
      }, []);
      console.log("规避专家", filteredList);
      cancatArr = filteredList;
      this.$set(this.form.data, "evadeExpert", cancatArr);
    },
    zhidingzhuanjiahandleSelect(val) {
      console.log("指定专家", val);
      // 搜索到的填充到指定专家中
      let cancatArr = [];
      // if (this.expertList.length != 0) {
      //   cancatArr = [...this.expertList, ...val];
      // } else {
      cancatArr = [...val];
      // }
      const filteredList = cancatArr.reduce((uniqueList, item) => {
        // 检查是否已经存在相同 id 的项
        const existingItem = uniqueList.find(
          (uniqueItem) => uniqueItem.id === item.id
        );
        // 如果不存在相同 id 的项，则将当前项添加到 uniqueList 中
        if (!existingItem) {
          uniqueList.push(item);
        }
        return uniqueList;
      }, []);
      console.log("专家", filteredList);
      cancatArr = filteredList;
      this.$set(this.form.data, "zdExpertId", cancatArr);
      this.$emit("sendExpert", cancatArr);
    },
    //新增规避专家
    addEvadeExpertPeople() {
      this.params.expertName = "";
      console.log(">>>", this.$refs);
      this.$refs.SrDialogSelect.dialogVisible = true;
      this.$refs.SrDialogSelect.search();
    },
    zhidingAddPeople() {
      this.params.expertName = "";
      console.log(this.$refs);
      this.$refs.zhidingzhuanjiaSrDialogSelect.dialogVisible = true;
      this.$refs.zhidingzhuanjiaSrDialogSelect.search();
    },
    getSpecialityList() {
      listByTopicAndItem({ topic: "JFZG_MAJOR_CONTENT" }).then((res) => {
        console.log("1111", res);
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

    //获取详情
    getQueryDetail() {
      console.log();
      queryDetail({ reviewId: this.reviewId }).then((res) => {
        let rs = res.data;
        if (rs) {
          const data = { ...this.form.data, id: rs.id };
          if (rs.shieldBefore) {
            data.checkbox = ["1"];
          }
          if (rs.evadeExpertList && rs.evadeExpertList.length) {
            data.evadeExpert = rs.evadeExpertList;
          }
          if (rs.zdExpertIdList && rs.zdExpertIdList.length) {
            // rs.zdExpertId = rs.zdExpertIdList;
            data.zdExpertId = rs.zdExpertIdList;
          }
          // 回填特长数据
          if (rs.hylyList && rs.hylyList.length) {
            rs.hylyList.forEach((code) => {
              if (code.startsWith("1")) {
                data.standards.push(code);
              } else if (code.startsWith("2")) {
                data.planReview.push(code);
              } else if (code.startsWith("3")) {
                data.govInfoField.push(code);
              } else if (code.startsWith("4")) {
                data.ICTField.push(code);
              } else if (code.startsWith("5")) {
                data.appField.push(code);
              }
            });
          }
          this.ruleType = rs.ruleType;
          console.log("data>>>>", data);
          this.$set(this.form, "data", data);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.radioLabel {
  width: 130px;
  display: inline-block;
  text-align: right;
  line-height: 32px;
}
.extract_group {
  margin-top: 16px;
  margin-bottom: 16px;
}
.select-class {
  ::v-deep .el-form-item {
    margin-bottom: 10px;
  }
  ::v-deep .el-form-item__label {
    // width: 140px !important;
  }
  ::v-deep .el-input__inner {
    width: 400px !important;
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
    width: 400px;
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
  ::v-deep .el-checkbox-group {
    height: 32px;
  }
}
.activity-form {
  ::v-deep .el-form-item {
    height: 32px;
    .el-form-item__label {
      padding: 0px;
      height: 32px;
      line-height: 32px;
      font-family: "PingFangSC-Regular", "PingFang SC";
    }
    .el-form-item__content {
      height: 32px;
      line-height: 32px;
    }
  }
  /*   ::v-deep .el-input__prefix {
    right: 0px !important;
    top: 0px !important;
  } */
  ::v-deep .el-input__inner {
    width: 200px !important;
    margin-left: 0px !important;
  }

  ::v-deep .el-date-editor.el-input {
    width: 200px !important;
  }
  ::v-deep .el-input__prefix {
    // width: 200px;
    // right: 0px !important;
    // top: 0px !important;
    position: absolute;
    top: 0px !important;
    // left: 0px !important;
    right: 175px !important;
    z-index: 999;
  }
  ::v-deep .el-col-12 {
    height: 32px !important;
  }
  .activity-date {
    position: relative;
    height: 32px;
    ::v-deep .el-date-editor.el-input {
      height: 32px !important;
    }
    ::v-deep .el-input__inner {
      padding-left: 30px !important;
    }
  }
}
.top-form {
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
    width: 400px !important;
    margin-left: 0px !important;
    // padding-left: 0px !important;
  }
  ::v-deep .el-input {
    height: 32px;
  }
}
</style>
