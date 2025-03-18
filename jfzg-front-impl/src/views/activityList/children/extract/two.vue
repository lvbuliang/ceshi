<template>
  <div class="extract_box_two">
    <el-card shadow="never" class="extract_box_card">
      <div slot="header" class="clearfix">
        <img
          src="./../../../../assets/extractImage.png"
          width="24px"
          height="auto"
          alt=""
        />
        <span style="vertical-align: super">
          抽取方式：{{
            oneParams.ruleType == 1
              ? "手动抽取"
              : oneParams.ruleType == 2
              ? "自动抽取"
              : "随机抽取"
          }}</span
        >
      </div>
      <div class="text item">
        <SrAdd :config="form.config" :form="form.data" ref="srAdd"> </SrAdd>
      </div>
    </el-card>
    <div v-if="oneParams.ruleType == 1" class="extract_table">
      <SrSearch
        :search="search"
        :searchExpand="true"
        :showTextBtns="true"
        @queryList="getZhuanJiaQueryExtract"
      ></SrSearch>
      <SrTable
        @pageChanged="pageChanged"
        :data="table.data"
        @sizeChanged="sizeChanged"
        :config="table.tableConfig"
        :page="table.page"
        @selected="selected"
        @selectAll="selectAll"
        ref="oneSearch"
      ></SrTable>
    </div>
    <div v-else>
      <span>专家列表</span>
      <SrTable
        :data="canhuizhuanjiaTable.data"
        :config="canhuizhuanjiaTable.tableConfig"
        :page="canhuizhuanjiaTable.page"
      ></SrTable>
      <span>备选列表</span>
      <SrTable
        :data="beixuanzhuanjiaTable.data"
        :config="beixuanzhuanjiaTable.tableConfig"
        :page="beixuanzhuanjiaTable.page"
      ></SrTable>
    </div>
  </div>
</template>

<!--
  功能：功能描述
  汪振涛
  时间：2021年07月13日 10:09:48
  版本：v1.0
-->
<script>
import { mapState } from "vuex";
import {
  queryByReviewId,
  queryExtract,
  autoExtract,
  queryDetail,
} from "@/api/activityList";
import { listByTopicAndItem } from "@/api/index";
import config from "@/settings.js";
import upload from "@/utils/upload";
export default {
  provide() {
    return {
      baseUrl: config.baseUrl,
      imgBaseUrl: config.imgBaseUrl,
      uploadRequest: upload,
      uploadBaseUrl: config.uploadBaseUrl,
      previewUrl: config.previewUrl,
    };
  },
  components: {},
  props: {},
  data() {
    return {
      search: {
        size: "small",
        labelConfig: {
          labelWidth: "90px",
          labelSuffix: ":",
          labelPosition: "right",
        },
        config: [
          {
            type: "text",
            placeholder: "专家姓名/单位",
            bind: "expertName",
          },
          {
            type: "select",
            placeholder: "技术特长",
            bind: "expertIndustry",
            data: "expertIndustryVoList", // 对应enum中的stateList
            label: "label",
            value: "itemCode",
          },
          // {
          //   type: "select",
          //   placeholder: "行业领域",
          //   bind: "expertIndustry",
          //   data: "expertIndustryVoList", // 对应enum中的stateList
          //   label: "label",
          //   value: "itemCode",
          // },
          // {
          //   type: "select",
          //   placeholder: "技术方向",
          //   bind: "expertTechnicalDirection",
          //   data: "oneList", // 对应enum中的stateList
          //   label: "label",
          //   value: "itemCode",
          // },
        ],
        enum: { oneList: [], expertIndustryVoList: [] },
        btns: [
          {
            name: "设为参会专家",
            click: this.setCanhuizhuanjia,
            type: "primary",
          },
          {
            name: "设为备选专家",
            click: this.setBeiXuanZhuanJia,
          },
        ],
        formData: {
          expertName: "",
          expertTechnicalDirection: "",
          expertIndustry: "",
        },
      },
      table: {
        data: [], // 表格数据
        tableConfig: {
          rowClassName: this.rowClassName,
          title: "表格的标题", // 表格标题
          highlightCurrentRow: true, // 控制表格是否单选
          // maxLength: 20, // 一行最多显示多少字，超出显示popver
          selectionConfig: {
            display: true,
            width: "70",
            selectable: this.selectable,
          },
          tooltipEffect: "light",
          header: [
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
        },
        page: {
          // 分页配置
          total: 0, //总条数
          pages: 0, //总页数
          pageSize: 10, //每页展示多少个
          pageSizes: [10, 20, 30],
          pageNum: 1, //当前页
          background: true,
          // layout: 'total, prev, pager, next, sizes,jumper'
        },
      },
      loading: false,
      form: {
        config: [
          {
            name: "指定专家",
            type: "selectPeople",
            bind: "zhidingList",
            col: 24,
            className: "selectPeople",
            isHide: true,
          },
          {
            name: "参会专家",
            type: "selectPeople",
            bind: "canhuiList",
            col: 24,
            className: "selectPeople",
            delPeople: "delPeople",
          },
          {
            name: "备选专家",
            type: "selectPeople",
            bind: "beixuanList",
            col: 24,
            className: "selectPeople",
            delPeople: "delPeople",
          },
        ],
        data: {
          zhidingList: [],
          canhuiList: [],
          beixuanList: [],
        },
      },
      canhuizhuanjiaTable: {
        data: [], // 表格数据
        tableConfig: {
          rowClassName: this.rowClassName,
          title: "表格的标题", // 表格标题
          highlightCurrentRow: true, // 控制表格是否单选
          tooltipEffect: "light",
          header: [
            {
              label: "姓名",
              prop: "expertName",
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
        },
        page: {
          // 分页配置
          total: 0, //总条数
          pages: 0, //总页数
          pageSize: 10, //每页展示多少个
          pageSizes: [10, 20, 30],
          pageNum: 1, //当前页
          background: true,
          // layout: 'total, prev, pager, next, sizes,jumper'
        },
      },
      beixuanzhuanjiaTable: {
        data: [], // 表格数据
        tableConfig: {
          rowClassName: this.rowClassName,
          title: "表格的标题", // 表格标题
          highlightCurrentRow: true, // 控制表格是否单选
          // maxLength: 20, // 一行最多显示多少字，超出显示popver
          tooltipEffect: "light",
          header: [
            {
              label: "姓名",
              prop: "expertName",
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
        },
        page: {
          // 分页配置
          total: 0, //总条数
          pages: 0, //总页数
          pageSize: 10, //每页展示多少个
          pageSizes: [10, 20, 30],
          pageNum: 1, //当前页
          background: true,
          // layout: 'total, prev, pager, next, sizes,jumper'
        },
      },
      selectObj: null,
      loading: true,
    };
  },
  computed: {
    ...mapState({
      oneParams: (state) => state.extract.one,
    }),
  },
  mounted() {
    //1为人工抽取  其余为随机和混合抽取
    if (this.oneParams.ruleType == 1) {
      //随机抽取
      this.getQueryByReviewId();
      this.getZhuanJiaQueryExtract();
      this.getExpertIndustryDtoList();
      // this.getExpertTechnicalDirectionDtoList();
    } else if (this.oneParams.ruleType == 2) {
      //随机抽取也可以叫做自动抽取
      this.getQueryByReviewId(true);
      this.$set(this.form.config[0], "isDel", true);
      this.$set(this.form.config[1], "isDel", true);
      this.$set(this.form.config[2], "isDel", true);
    } else if (this.oneParams.ruleType == 3) {
      //混合抽取
      this.getEvadeExpert();
      this.getQueryByReviewId(true);
      this.$set(this.form.config[0], "isHide", false);
      this.$set(this.form.config[0], "isDel", true);
      this.$set(this.form.config[1], "isDel", true);
      this.$set(this.form.config[2], "isDel", true);
    }
  },
  methods: {
    pageChanged(val) {
      this.table.page.pageNum = val;
      this.getZhuanJiaQueryExtract(val);
    },
    sizeChanged(val) {
      this.table.page.pageSize = val;
      this.getZhuanJiaQueryExtract();
    },
    getQueryByReviewId(isSuiji = false) {
      queryByReviewId({ reviewId: this.$route.query.id, status: 4 }).then(
        (res) => {
          if (res.msg.code === "0000") {
            if (res.data[0] && JSON.stringify(res.data[0]) != "{}") {
              res.data[0].forEach((res) => {
                res.isDel = true;
              });
            } else if (res.data[1] && JSON.stringify(res.data[1]) != "{}") {
              res.data[1].forEach((res) => {
                res.isDel = true;
              });
            } else if (res.data[2] && JSON.stringify(res.data[2]) != "{}") {
              res.data[2].forEach((res) => {
                res.isDel = true;
              });
            }
            this.$set(this.form.data, "canhuiList", res.data[0] || []);
            this.$set(this.form.data, "beixuanList", res.data[1] || []);
          }
          if (isSuiji) {
            autoExtract({ reviewId: this.$route.query.id }).then(
              ({ data, msg }) => {
                console.log(this.form.data);
                if (data.bx && data.bx.length) {
                  data.bx.forEach((res) => {
                    res.isDel = true;
                  });
                  this.$set(this.beixuanzhuanjiaTable, "data", [
                    ...data.bx,
                    ...this.form.data.beixuanList,
                  ]);
                }
                if (data.ch && data.ch.length) {
                  data.ch.forEach((res) => {
                    res.isDel = true;
                  });
                  this.$set(this.canhuizhuanjiaTable, "data", [
                    ...data.ch,
                    ...this.form.data.canhuiList,
                  ]);
                }
                this.$set(this.form.data, "canhuiList", [
                  ...data.ch,
                  ...this.form.data.canhuiList,
                ]);
                this.$set(this.form.data, "beixuanList", [
                  ...data.bx,
                  ...this.form.data.beixuanList,
                ]);
              }
            );
            this.loading = false;
          }
        }
      );
    },
    getQueryExtract(num, jfids = []) {
      if (num) {
        console.log(num);
        this.table.page.pageNum = num;
      }
      this.loading = true;
      let param = {
        pageNum: this.table.page.pageNum,
        pageSize: this.table.page.pageSize,
        reviewId: this.$route.query.id,
        jfids: jfids,
        ...this.search.formData,
      };
      console.log(param);
      queryExtract(param).then((res) => {
        this.table.data = res.data.records.map((item) => {
          if (!this.hasChildrenFlag) {
            item.hasChildren = false;
          }
          return item;
        });

        this.table.page.total = res.data.total;
        this.loading = false;
      });
    },
    //获取技术方向
    // getExpertTechnicalDirectionDtoList() {
    //   listByTopicAndItem({ topic: "JFZG_SKILL_DIRECTION" }).then((res) => {
    //     let arr = res.data.map((item) => {
    //       return {
    //         label: item.chName,
    //         itemCode: item.itemCode,
    //         expertId: item.expertId,
    //       };
    //     });
    //     this.$set(this.search.enum, "oneList", arr);
    //   });
    // },
    //获取行业领域
    getExpertIndustryDtoList() {
      listByTopicAndItem({ topic: "JFZG_MAJOR_CONTENT" }).then((res) => {
        let arr = res.data.map((item) => {
          return {
            label: item.chName,
            itemCode: item.itemCode,
            expertId: item.expertId,
          };
        });
        this.$set(this.search.enum, "expertIndustryVoList", arr);
      });
    },
    selected(value) {
      this.selectObj = value;
    },
    selectAll(value) {
      this.selectObj = value;
    },
    setCanhuizhuanjia() {
      this.$set(this.form.data, "canhuiList", [
        ...this.form.data.canhuiList,
        ...this.selectObj,
      ]);
      this.getZhuanJiaQueryExtract();
    },
    setBeiXuanZhuanJia() {
      this.$set(this.form.data, "beixuanList", [
        ...this.form.data.beixuanList,
        ...this.selectObj,
      ]);
      this.getZhuanJiaQueryExtract();
    },
    delPeople(value) {
      console.log(value);
    },
    getZhuanJiaQueryExtract(num = 1) {
      let canhuiIds = this.form.data.canhuiList.map(({ id }) => id);
      let beixuanIds = this.form.data.beixuanList.map(({ id }) => id);
      this.getQueryExtract(num, [...canhuiIds, ...beixuanIds]);
      this.$refs.oneSearch.$refs.SrTable.clearSelection();
    },
    submit() {
      let list = [];
      console.log(this.form.data, " this.form.data");
      if (this.oneParams.ruleType == "3") {
        list = [...this.form.data.canhuiList, ...this.form.data.zhidingList];
      } else {
        list = this.form.data.canhuiList;
      }
      let canhuiIds = list.map(({ expertId, code, id }) => {
        return {
          jfid: expertId ? expertId : id,
          code: this.oneParams.ruleType == 1 ? null : code,
          type: 1,
        };
      });
      let beixuanIds = this.form.data.beixuanList.map(
        ({ expertId, code, id }) => {
          return {
            jfid: expertId ? expertId : id,
            code: this.oneParams.ruleType == 1 ? null : code,
            type: 2,
          };
        }
      );

      return [...canhuiIds, ...beixuanIds];
    },
    getEvadeExpert() {
      queryDetail({ reviewId: this.$route.query.id }).then(({ data }) => {
        if (
          data.zdExpertId &&
          data.zdExpertId.length &&
          data.zdExpertIdList &&
          data.zdExpertIdList.length
        ) {
          data.zdExpertIdList.forEach((res) => {
            res.isDel = true;
          });
          this.$set(this.form.data, "zhidingList", data.zdExpertIdList);
        }
      });
    },
  },
};
</script>

<style  lang="scss">
.extract_box_two {
  .extract_box_card {
    border: 1px solid #efefef !important;
    margin-bottom: 16px;
    .el-card__header {
      padding: 16px 24px;
      .clearfix {
        height: 24px;
      }
    }
    .el-card__body {
      padding: 16px 24px;
    }
  }
  .selectPeople {
    .el-form-item__label {
      width: 100px !important;
    }
    .el-form-item__content {
      margin-left: 100px !important;
      .select_people_btn {
        display: none;
      }
    }
  }
}
</style>
