<template>
  <div class="total-page">
    <div class="searchPage">
      <SrSearch
        :search="search"
        :searchExpand="true"
        :showTextBtns="true"
        @queryList="pageChanged(1)"
      ></SrSearch>
    </div>
    <div
      class="cardBox"
      v-infinite-scroll="getlistYearPlanProject"
      infinite-scroll-distance="40px"
    >
      <!-- v-infinite-scroll="getlistYearPlanProject"
      infinite-scroll-distance="40px" -->
      <!-- v-infinite-scroll="getlistYearPlanProject" -->
      <div class="card" v-for="(item, index) in table.data" :key="index">
        <div class="project_name">{{ item.projectName }}</div>
        <div class="project_detail">
          <span>申报单位：{{ item.applicationUnit }}</span>
          <span>|</span>
          <span>
            申报联系人：{{ item.contactName }}({{ item.contactMobile }})
          </span>
          <span>|</span>

          <span> 建设单位：{{ item.constructUnitFullName }} </span>
          <span>|</span>
          <span v-if="item.constructorName">
            建设联系人：{{ item.constructorName }}({{
              item.constructorPhoneNumber
            }})
          </span>
          <span v-if="item.constructorName">|</span>
          <span>项目规模：{{ item.totalInvestmentAmount }}万元</span>
        </div>
        <div class="line"></div>
        <div class="project_timeline">
          <div class="content">
            <div class="contract">
              <ul class="linesegs">
                <li
                  class="lineseg"
                  v-for="(item1, index1) in item.projectStageInfoList"
                  :key="index1"
                >
                  <div class="project_stage">
                    <span
                      :class="[
                        item1.hasStart == 1 || item1.hasStart == 2
                          ? 'doneStage'
                          : '',
                      ]"
                      >{{ item1.stageName }}</span
                    >
                    <span v-if="item1.outTime == 1" class="timeout">超时</span>
                  </div>
                  <!-- <div class="solid radius">
                  </div> -->
                  <!-- /**
                        * 节点是否已经开始 2.已完成 1，已开始  0未开始 
                        */ -->
                  <img
                    class="node"
                    :src="
                      item1.hasStart == '0'
                        ? nodo
                        : item1.hasStart == '1'
                        ? doing
                        : done
                    "
                    alt=""
                  />
                  <div
                    :class="['xian', item1.hasStart == '2' ? 'xian_blue' : '']"
                  ></div>
                  <span
                    v-if="
                      (item1.hasStart == 1 || item1.hasStart == 0) &&
                      item1.planTime
                    "
                    :class="[
                      item1.hasStart == 1
                        ? 'project_time_blue'
                        : 'project_time',
                    ]"
                    >计划 {{ item1.planTime }}</span
                  >
                  <span
                    v-if="
                      (item1.hasStart == 1 || item1.hasStart == 2) &&
                      item1.actualTime
                    "
                    :class="[
                      item1.hasStart == 1
                        ? 'project_time_blue'
                        : 'project_time',
                    ]"
                  >
                    实际 {{ item1.actualTime }}
                    <i
                      v-if="item1.outTime == 1"
                      class="el-icon-warning-outline"
                    ></i>
                  </span>
                </li>
                <!-- <li class="lineseg">
                  <div>项目实施</div>
                  <div class="dashed b-radius"></div>
                  <div class="timeline"></div>
                  <h3 class="startdate">审核项目资料</h3>
                  <h3 class="startdate">2019-10-7</h3>
                </li>
                <li class="lineseg">
                  <div>项目实施</div>
                  <div class="dashed b-radius"></div>
                  <div class="timeline"></div>
                  <h3 class="startdate">设备分拨</h3>
                  <h3 class="startdate">2019-10-7</h3>
                </li>
                <li class="lineseg">
                  <div>项目实施</div>
                  <div class="dashed b-radius"></div>
                  <div class="xian"></div>
                  <h3 class="startdate">设备分拨</h3>
                  <h3 class="startdate">2019-10-7</h3>
                </li>
                <li class="lineseg">
                  <div>项目验收</div>
                  <div class="el-icon-success"></div>
                  <div class="timeline"></div>
                  <h3 class="startdate">设备分拨</h3>
                  <h3 class="startdate">2019-10-7</h3>
                </li>
                <li class="lineseg">
                  <div>项目评价</div>
                  <div class="b-radius"></div>
                  <h3 class="startdate">设备分拨</h3>
                  <h3 class="startdate">2019-10-7</h3>
                </li> -->
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<!--
  功能：功能描述
  汪振涛
  时间：2021年06月16日 15:34:49
  版本：v1.0
-->
<script>
import store from "@/store";
import {
  api_queryList,
  queryRemove,
  api_fileAway,
  api_getLibraryNumber,
} from "@/api/planProject";
import { queryBizunitsByProperty } from "@/api/index.js";
import {
  api_userSetQuery,
  api_userSetSave,
  api_addFile,
  api_updateFile,
  api_listByInstanceId,
  api_deleteItem,
  queryAllChildUnitExcludeSelfWithSameParentUnit,
} from "@/api/index.js";
import { get_year_plan } from "@/api/shenbao/index";
import {
  queryListByYearPlanId,
  getlistYearPlanProjects,
} from "@/api/yearPlan/index";
import config from "@/settings.js";
import utils from "@/utils/index.js";
import { setSession, getSession, removeSession } from "@/core/session.js";
// import Table from "@/components/table";
import upload from "@/utils/upload";
import nodo from "@/assets/nodo.png";
import doing from "@/assets/doing.png";
import done from "@/assets/done.png";
export default {
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
  props: {
    ifHideAddBtn: {
      type: Boolean,
      default: false,
    },
    year: {
      type: String,
      default: "",
    },
  },
  components: {
    // Table,
  },
  data() {
    return {
      nodo: nodo,
      doing: doing,
      done: done,
      supplementRow: {},
      activeRow: {},
      menuTypeObject: {
        menuType: "4001001",
        objectId: "",
        projectId: "",
      },
      //补充文件数据组
      tableDataList: [
        {
          //列表名称
          fileName: "上传附件",
          //文件提示
          popover: "",
          //按钮名称
          uploadReportName: "上传附件",
          //列表数据
          dataList: [],
          //实例id
          instanceId: 503,
        },
      ],
      // 上传意见
      codeObject: {
        //上传文件权限code
        updateFileCode: "M002_003_007",
        //删除code
        deleteCode: "M002_003_008",
        //停止上传code
        stopUploadingCode: "M002_003_009",
      },
      //停止上传状态
      stopUploadingFlag: true,
      //接口集合
      apiObject: {
        api_addFile,
        api_updateFile,
        api_listByInstanceId,
        api_deleteItem,
      },
      //弹框名称
      supplementBoxTitle: "上传附件",
      userInfo: store.getters.userInfo,
      search: {
        size: "small",
        labelConfig: {
          labelWidth: "90px",
          labelSuffix: ":",
          labelPosition: "right",
        },
        config: [
          {
            type: "select",
            placeholder: "请选择年度计划",
            bind: "year",
            data: "yearList", // 对应enum中的stateList
            class: "getyearclass",
            disabled: false,
          },
          {
            type: "select",
            placeholder: "请选择建设单位名称",
            bind: "constructBuid",
            data: "constructBuidList", // 对应enum中的stateList
            class: "getyearclass",
            // showType: "year",
            // format: "yyyy",
          },
          {
            type: "text",
            placeholder: "请输入项目名称",
            bind: "keyword", // 对应this.search.data对象的field1
          },
        ],
        enum: {
          yearList: [],
          constructBuidList: [],
        },
        btns: this.ifHideAddBtn
          ? []
          : [
              {
                name: "新增",
                click: this.add,
                type: "primary",
                permissionCode: "M015_M003_M001",
              },
              // { name: "导出", click: this.export, permissionCode: "M002_003_002" },
              // { name: "批量导入", click: this.bulkImport, permissionCode: "M002_003_003" },
            ],
        formData: {
          keyword: "",
          constructBuid: "",
          year: this.year ? Number(this.year) : "",
        },
        autoCompleteList: [],
      },
      timeLineData: [
        {
          plan: "2023-10-01～2023-10-15",
          true: "2023-10-01～2023-10-15",
          stage: "项目实施",
          status: 0,
        },
        {
          plan: "2023-10-01～2023-10-15",
          true: "2023-10-01～2023-10-15",
          stage: "项目实施",
          status: 1,
        },
        {
          plan: "2023-10-01～2023-10-15",
          true: "2023-10-01～2023-10-15",
          stage: "项目实施",
          status: 2,
        },
        {
          plan: "2023-10-01～2023-10-15",
          true: "2023-10-01～2023-10-15",
          stage: "项目实施",
          status: 2,
        },
        {
          plan: "2023-10-01～2023-10-15",
          true: "2023-10-01～2023-10-15",
          stage: "项目实施",
          status: 3,
        },
        {
          plan: "2023-10-01～2023-10-15",
          true: "2023-10-01～2023-10-15",
          stage: "项目实施",
          status: 2,
        },
        {
          plan: "2023-10-01～2023-10-15",
          true: "2023-10-01～2023-10-15",
          stage: "项目实施",
          status: 2,
        },
      ],
      table: {
        data: [],
        page: {
          pageNum: 1,
          pageSize: 5,
        },
      },
    };
  },
  created() {
    if (this.year) {
      this.$set(this.search.config[0], "disabled", true);
    }
  },
  mounted() {
    this.getYear();
    this.getlistYearPlanProject();
    this.queryAllChildUnit();
  },
  methods: {
    // 建设单位
    queryAllChildUnit() {
      queryAllChildUnitExcludeSelfWithSameParentUnit().then((res) => {
        if (res.data) {
          let constructBuidList = [];
          res.data.map((item) => {
            constructBuidList.push({
              value: item.buid,
              label: item.buName,
            });
          });
          this.search.enum.constructBuidList = constructBuidList;
        }
      });
    },
    getYear() {
      get_year_plan().then((res) => {
        var yearlist = [];
        for (var i = 0; i < res.data.length; i++) {
          var map = {
            value: res.data[i].id,
            label: res.data[i].yearPlanName,
          };
          yearlist.push(map);
        }
        this.$set(this.search.enum, "yearList", yearlist);
      });
    },
    getlistYearPlanProject() {
      let params = {
        pageNum: this.table.page.pageNum,
        pageSize: this.table.page.pageSize,
        ...this.search.formData,
      };
      getlistYearPlanProjects(params).then((res) => {
        if (res.data) {

          // this.table.data = res.data.records;
          this.table.data = [...this.table.data, ...res.data.records]; // 将新数据追加到已有数据的末尾
          this.table.page.pageNum++;
        }
      });
    },
    pageChanged(val) {
      this.table.data = [];
      this.table.page.pageNum = val;
      this.getlistYearPlanProject();
    },
    sizeChanged(val) {
      this.table.data = [];
      this.table.page.pageNum = 1;
      this.table.page.pageSize = val;
      this.getlistYearPlanProject();
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-table__fixed-right {
  height: 100% !important;
}
.searchPage {
  ::v-deep .getyearclass {
    width: 240px !important;
  }
}
::v-deep .el-input--mini .el-input__inner {
  height: 27px;
  line-height: 27px;
}
.cardBox {
  max-height: 490px;
  overflow-y: scroll;
}
// 滚动条
.cardBox::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 0px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 0px;
}
.cardBox::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 5px;
  // -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #f5f5f5;
}
.cardBox::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  // -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background: #ffffff;
}
.card {
  font-family: PingFangSC-Regular, PingFang SC;
  margin: 3px auto;
  width: 99.7%;
  height: 216px;
  border: 1px solid #ffffff;
  box-shadow: 0px 2px 6px 0px rgba(167, 167, 167, 0.4);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  .project_name {
    color: rgba(16, 16, 16, 1);
    font-size: 16px;
    font-weight: 600;
  }
  .project_detail {
    opacity: 0.57;
    color: rgba(90, 90, 90, 1);
    font-size: 14px;
    span {
      margin-right: 20px;
    }
  }
  .line {
    height: 1px;
    width: 100%;
    opacity: 0.5;
    border: 1px solid rgba(187, 187, 187, 1);
    margin-top: 11px;
    margin-bottom: 18px;
  }
  .project_timeline {
    width: 100%;
    .project_stage {
      color: rgba(150, 149, 149, 1);
      font-size: 16px;
      font-weight: 600;
      .timeout {
        display: inline-block;
        width: 30px;
        line-height: 18px;
        background-color: #fd8f15;
        font-size: 10px;
        text-align: center;
        color: #ffffff;
        border-radius: 3px;
        margin-left: 3px;
      }
    }
    .project_time {
      color: #cbcbcb;
      font-size: 10px;
    }
    .project_time_blue {
      color: rgba(55, 148, 255, 1);
      font-size: 10px;
    }
    .node {
      width: 40px;
      height: 40px;
      z-index: 20;
    }
  }
}
// 时间线
.content {
  width: 100%;
  height: auto;
  // margin: -75px 0 0 311px;
  display: inline-block;
}
.contract {
  width: 100%;
  height: auto;
  display: inline-block;
}
.title {
  padding: 2px;
  float: left;
  height: 30px;
  width: 50px;
  margin: 0 auto;
}
.contract .linesegs {
  width: 100%;
  display: flex;
  justify-content: space-between;
  list-style-type: none;
  float: left;
  position: relative;
  background-repeat: repeat-x;
  margin: 0px;
  // padding-left: 10px;
}
.linesegs li {
  float: left;
  // width: 110px;
  flex: 1 0 14.28%;
  position: relative;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.linesegs li .xian {
  margin: -30px 0 0 100%;
  width: 100%;
  height: 20px;
  border: 1px solid #3794ff;
  margin-bottom: 10px;
}
.xian_blue {
  background-color: #3794ff;
  // background: linear-gradient(to right, #3794ff 50%, transparent 50%);
}
.linesegs li:last-child .xian {
  display: none;
}
.linesegs li .dashed:after {
  content: "";
  display: block;
  border-top: 2px dashed #c9cdd4;
  width: 100%;
  height: 2px;
}

.linesegs li .solid:after {
  content: "";
  display: block;
  border-top: 2px solid #41ae3c;
  width: 100%;
  height: 2px;
}

.linesegs li .radius:before {
  content: "";
  display: block;
  position: relative;
  width: 10px;
  height: 10px;
  top: 5px;
  background: #41ae3c;
  -moz-border-radius: 100%;
  -webkit-border-radius: 100%;
  border-radius: 100%;
  background-size: 10px 10px;
}

.linesegs li .b-radius:before {
  content: "";
  display: block;
  position: relative;
  width: 10px;
  height: 10px;
  top: 5px;
  background: #41ae3c;
  -moz-border-radius: 100%;
  -webkit-border-radius: 100%;
  border-radius: 100%;
  background-size: 10px 10px;
}

.linesegs li .showtext {
  width: 100%;
  height: 30%;
  display: inline-block;
  text-align: center;
}
// .linesegs li .startdate {
//   width: 100%;
//   height: 1px;
//   margin-top: 10px;
//   font-size: 12px;
//   text-align: left;
//   position: relative;
//   left: -10px;
// }
// 处理阴影问题
::v-deep .el-tabs .el-tabs__content {
  padding-bottom: 10px !important;
}
// 超时icon
.el-icon-warning-outline {
  color: #fd8f15;
}
// 已经进行过的阶段为蓝色
.doneStage {
  color: #3794ff;
}
</style>
