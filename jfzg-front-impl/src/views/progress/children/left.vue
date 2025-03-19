<template>
  <div class="left_detail">
    <div class="left_detail_first">
      <div
        :class="['jsz', baseimgClick ? 'morewidth' : '']"
        :style="baseimgClick ? lefttopback : righttopback"
        @click="base_click('1')"
      >
        <div>
          <img class="baseimg" :src="jsz_png" alt="" />
          <span :class="['base_title', baseimgClick ? 'base_title_click' : '']"
            >建设中</span
          >
        </div>
        <div class="mgt6">
          <span
            :class="['base_count', baseimgClick ? 'base_title_click' : '']"
            >{{ construct }}</span
          >
          <span class="jindutiao" v-if="baseimgClick">
            <span class="jindutiao2" :style="{ width: totalPercent }"></span>
          </span>
        </div>
        <!-- <img class='baseimg1 ' :src="baseimgClick?lefttopback:nostart" alt=""> -->
      </div>
      <div
        :class="['ywc', baseimgClick ? '' : 'morewidth']"
        :style="baseimgClick ? righttopback : lefttopback"
        @click="base_click('2')"
      >
        <div>
          <img class="baseimg" :src="ywc_png" alt="" />
          <span :class="['base_title', baseimgClick ? '' : 'base_title_click']"
            >已完成</span
          >
        </div>
        <div class="mgt6">
          <span
            :class="['base_count', baseimgClick ? '' : 'base_title_click']"
            >{{ done }}</span
          >
        </div>
        <!-- <img class='baseimg1 ' :src="baseimgClick?nostart:started" alt=""> -->
      </div>
    </div>
    <div class="left_detail_secound">
      <el-input
        placeholder="请输入项目名称或编号"
        v-model="searchVal"
        slot="suffix"
        @keyup.enter="onEnterSearch"
      >
        <i slot="suffix" class="el-input__icon el-icon-search"></i>
      </el-input>
    </div>
    <div class="left_detail_third">
      <div
        v-for="(item, i) in project_list"
        :key="'s_' + i"
        class="project_list_all"
      >
        <div
          class="project_list"
          @click="projectClick(i)"
          :class="[
            'project_list',
            active == i
              ? item.activationStatusName == '逾期'
                ? item.contractAmount
                  ? 'redclick'
                  : 'rednocontactclick'
                : item.activationStatusName == '正常'
                ? item.contractAmount
                  ? 'blueclick'
                  : 'bluenocontactclick'
                : !item.activationStatusName
                ? item.contractAmount
                  ? 'greenclick'
                  : 'greennocontactclick'
                : item.contractAmount
                ? 'greyclick'
                : 'greynocontactclick'
              : '',
            item.status,
          ]"
        >
          <img
            class="baseimg2"
            v-if="item.activationStatusName == '逾期'"
            :src="red"
            alt=""
          />
          <img
            class="baseimg2"
            v-if="item.activationStatusName == '正常'"
            :src="blue"
            alt=""
          />
          <img
            class="baseimg2"
            v-if="item.activationStatusName == '暂停'"
            :src="grey"
            alt=""
          />
          <img
            class="baseimg2"
            v-if="!item.activationStatusName"
            :src="wancheng"
            alt=""
          />
          <img
            :class="['baseimg3', item.contractAmount ? '' : 'top42']"
            v-if="item.activationStatusName == '逾期' && active == i"
            :src="redsanjiao"
            alt=""
          />
          <img
            :class="['baseimg3', item.contractAmount ? '' : 'top42']"
            v-if="item.activationStatusName == '正常' && active == i"
            :src="bluesanjiao"
            alt=""
          />
          <img
            :class="['baseimg3', item.contractAmount ? '' : 'top42']"
            v-if="item.activationStatusName == '暂停' && active == i"
            :src="greysanjiao"
            alt=""
          />
          <img
            :class="['baseimg3', item.contractAmount ? '' : 'top42']"
            v-if="!item.activationStatusName && active == i"
            :src="greensanjiao"
            alt=""
          />
          <div class="projectInfo">
            <div class="flex">
              <div
                :title="item.projectName"
                :class="['title']"
                @click="clickprojectName(item)"
              >
                {{ item.projectName }}
              </div>

              <div v-if="active == i" class="lineheight">
                <span :class="['code_title']">项目编号：</span>
                <span :class="['code_name']">{{ item.projectCode }}</span>
              </div>

              <div v-if="active == i && item.contractAmount" class="lineheight">
                <span :class="['code_title']">合同金额（万元）：</span>
                <span :class="['code_name']">{{
                  item.contractAmount || " - "
                }}</span>
              </div>

              <div class="lineheight">
                <span :class="['code_title']">合同周期：</span>
                <span v-if="item.contractDuration" :class="['code_name']">{{
                  item.contractDuration
                }}</span>
                <span v-else :class="['code_name_click']"
                  ><span
                    v-if="
                      checkCodeInArr('M005_001_001') &&
                      baseimgClick &&
                      !(item.activationStatusName == '暂停')
                    "
                    @click="addhetong(item)"
                    >创建合同</span
                  ></span
                >
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="active == i"
          :class="[
            'backcolor',
            catchstagePercent(item.stagePercent) == '96.9%'
              ? 'zhijiaoborder'
              : '',
            item.activationStatusName == '逾期'
              ? 'red'
              : item.activationStatusName == '正常'
              ? 'blue'
              : !item.activationStatusName
              ? 'wancheng'
              : 'grey',
          ]"
          :style="{
            width: item.activationStatusName
              ? catchstagePercent(item.stagePercent)
              : '%6.9%',
          }"
        ></div>
        <div
          v-if="
            active == i &&
            ((item.stagePercent && item.stagePercent != '0.00%') ||
              !item.activationStatusName)
          "
          :class="[
            'lineover',
            item.activationStatusName == '逾期'
              ? 'redover'
              : item.activationStatusName == '正常'
              ? 'blueover'
              : !item.activationStatusName
              ? 'greenover'
              : 'greyover',
          ]"
          :style="{
            left: item.activationStatusName
              ? catchstage2Percent(item.stagePercent) || '0px'
              : '86%',
          }"
        >
          <div style="position: relative; height: 100%; width: 100%">
            <div
              :class="[
                'tipjindu',
                item.activationStatusName == '逾期'
                  ? 'redtipjindu'
                  : item.activationStatusName == '正常'
                  ? 'bluetipjindu'
                  : !item.activationStatusName
                  ? 'greentipjindu'
                  : 'greytipjindu',
              ]"
            >
              <span>项目进度</span>
              <span v-if="item.activationStatusName">{{
                item.stagePercent
              }}</span>
              <span v-else>100%</span>
            </div>
          </div>
        </div>
      </div>
      <div class="fenye" v-if="this.project_list.length < 0">
        <el-pagination
          layout="prev, pager, next"
          :total="page.total"
          :page-size="page.size"
          :current-page="page.pageNo"
          @current-change="handleChange"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import ywc_png from "@/assets/process/ywc.svg";
import jsz_png from "@/assets/process/jsz.svg";
import nostart from "@/assets/shishi/home/nostart.png";
import started from "@/assets/shishi/home/started.png";
import red from "@/assets/process/red.png";
import blue from "@/assets/process/blue.png";
import grey from "@/assets/process/grey.png";
import wancheng from "@/assets/process/wancheng.svg";
// import lefttopback from "@/assets/process/lefttopback.png";
// import righttopback from "@/assets/process/righttopback.png";
import greysanjiao from "@/assets/process/greysanjiao.svg";
import greensanjiao from "@/assets/process/greensanjiao.svg";

import bluesanjiao from "@/assets/process/bluesanjiao.svg";
import redsanjiao from "@/assets/process/redsanjiao.svg";
import { getProject, countProcessTrack } from "@/api/genzong/index.js";
import utils from "@/utils/index.js";

export default {
  //组件注册
  components: {},
  watch: {
    searchVal: {
      handler: function (data) {
        if (data != null) {
          this.active = 0;
          if (data) {
            this.getProjectList(data);
          } else {
            this.getProjectList();
          }
        }
      },
      immediate: true,
    },
  },
  data() {
    return {
      page: {
        total: 20,
        size: 5,
        pageSize: 5,
        pageSizes: [5, 10, 20, 30],
        pageNo: 1,
      },
      searchVal: null,
      project_list: [],
      active: 0,
      ywc_png: ywc_png,
      jsz_png: jsz_png,
      started: started,
      nostart: nostart,
      red: red,
      blue: blue,
      grey: grey,
      wancheng: wancheng,
      // righttopback:righttopback,
      // lefttopback:lefttopback,

      lefttopback: {
        backgroundImage:
          "url(" + require("@/assets/process/lefttopback.png") + ")",
      },
      righttopback: {
        backgroundImage:
          "url(" + require("@/assets/process/righttopback.png") + ")",
      },

      greysanjiao: greysanjiao,
      greensanjiao: greensanjiao,
      bluesanjiao: bluesanjiao,
      redsanjiao: redsanjiao,
      construct: 0,
      done: 0,
      totalPercent: "0%",
      baseimgClick: true,
    };
  },
  methods: {
    catchstagePercent(val) {
      if (val) {
        var newwidht = 0;
        if (val.split("%")[name.split("%").length - 1] > 10) {
          newwidht = val.split("%")[name.split("%").length - 1] - 3.1;
        } else {
          newwidht = val.split("%")[name.split("%").length - 1];
        }

        return newwidht + "%";
      } else {
        ("0px");
      }
    },
    catchstage2Percent(val) {
      if (val) {
        var newwidht = val.split("%")[name.split("%").length - 1];
        if (newwidht > 80) {
          newwidht = newwidht - 12;
        }
        return newwidht + "%";
      } else {
        ("0px");
      }
    },
    addhetong(val) {
      this.$router.push({
        name: "contractAdd",
        query: { projectId: val.projectId },
      });
    },
    //下一页
    handleChange(page) {
      this.active = 0;
      this.page.pageNo = page;
      this.getProjectList();
    },
    checkCodeInArr(data) {
      return utils.checkCodeInArr(data);
    },
    onEnterSearch() {
      this.getProjectList(this.searchVal);
    },
    clickprojectName(val) {
      this.$router.push({
        name: "progressView",
        query: { projectId: val.projectId },
      });
    },
    base_click(data) {
      if (data == 2) {
        this.baseimgClick = false;
      } else {
        this.baseimgClick = true;
      }
      this.active = 0;
      this.page.pageNo = 1;
      this.getProjectList();
    },
    projectClick(i) {
      this.active = i;
      this.$emit("changePro", this.project_list[i]);
    },
    pageChanged() {},
    getProjectList() {
      var params = {
        pageNo: this.page.pageNo,
        pageSize: 9999,
        processType: this.baseimgClick ? 1 : 2,
        keyword: this.searchVal || "",
      };
      getProject(params).then((res) => {
        for (var i = 0; i < res.data.records.length; i++) {
          if (
            res.data.records[i].contractDuration &&
            res.data.records[i].contractDuration != "[]"
          ) {
            res.data.records[i].contractDuration =
              JSON.parse(res.data.records[i].contractDuration)[0] +
              " - " +
              JSON.parse(res.data.records[i].contractDuration)[1];
          } else {
            res.data.records[i].contractDuration = " - ";
          }
          res.data.records[i].status =
            this.baseimgClick && res.data.records[i].activationStatus != "2"
              ? 1
              : 2;
        }
        if (res.data.records && res.data.records.length > 0) {
          this.$emit("changePro", res.data.records[0]);
        } else {
          this.$emit("changePro", {});
        }
        this.totalPercent = res.data.totalPercent || "0%";
        this.project_list = res.data.records;
        this.$set(this.page, "total", res.data.total);
      });
    },
    countProcessTrack() {
      countProcessTrack().then((res) => {
        this.construct = res.data.construct;
        this.done = res.data.done;
      });
    },
  },
  created() {
    this.countProcessTrack();
    this.getProjectList();
  },
};
</script>

<style lang="scss" scoped>
.selectWidthinput {
  width: 200px;
}
::v-deep .el-col-19 {
  width: 82.16667%;
}
.left_detail {
  width: 374px;
  background: #fafafa;
  padding: 24px;
  padding-right: 16px;
  .left_detail_first {
    display: flex;
    .jsz {
      // background-image: url('righttopback')!important;
      background-size: 108px 102px;
      background-repeat: no-repeat;
      cursor: pointer;
      padding: 18px 0px 13px 16px;
      width: 128px;
      height: 102px;
      // background: #FFFFFF;
      border-radius: 8px;
      // border: 1px solid #EEEEEE;
      position: relative;
      .baseimg1 {
        height: 100%;
        position: absolute;
        right: 0px;
        bottom: 0px;
        width: 150px;
      }
      .mgt6 {
        margin-top: 6px;
      }
      .baseimg {
        position: relative;
        top: 2px;
      }
      .base_title {
        width: 54px;
        height: 25px;
        font-size: 18px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
        line-height: 25px;
        margin-left: 4px;
        vertical-align: bottom;
      }
      .base_title_click {
        color: #1890ff !important;
      }
      .base_count {
        width: 25px;
        height: 32px;
        font-size: 24px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #666666;
        line-height: 32px;
      }
      .jindutiao {
        margin-left: 16px;
        width: 105px;
        height: 4px;
        background: #e2e2e2;
        border-radius: 4px;
        vertical-align: super;
        display: inline-block;
        position: relative;
        .jindutiao2 {
          width: 0%;
          height: 4px;
          border-radius: 4px;
          background: #1890ff;
          /* vertical-align: super; */
          display: inline-block;
          position: absolute;
        }
      }
    }
    .morewidth {
      width: 227px !important;
      // border: 1px solid rgba(24, 144, 255, 0.2)!important;
      // background-image: url('lefttopback')!important;
      background-size: 208px 102px !important;
      background-repeat: no-repeat !important;
    }
    .ywc {
      // background-image: url('righttopback')!important;
      // background-image: url(righttopback.png);
      background-size: 118px 102px;
      background-repeat: no-repeat;
      cursor: pointer;
      margin-left: 8px;
      padding: 18px 0px 13px 16px;
      width: 128px;
      height: 102px;
      // background: #FFFFFF;
      border-radius: 8px;
      // border: 1px solid #EEEEEE;
      position: relative;
      .baseimg1 {
        height: 100%;
        position: absolute;
        right: 0px;
        bottom: 0px;
        width: 150px;
      }
      .mgt6 {
        margin-top: 6px;
      }
      .baseimg {
        position: relative;
        top: 2px;
      }
      .line_class {
        width: 20px;
        height: 1px;
        // border: 1px solid #CCCCCC;
        // margin-top: 4px;
        // margin-bottom: 2px;
      }
      .base_title {
        width: 54px;
        height: 25px;
        font-size: 18px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
        line-height: 25px;
        margin-left: 4px;
        vertical-align: bottom;
      }
      .base_title_click {
        color: #1890ff !important;
      }
      .base_count {
        width: 25px;
        height: 32px;
        font-size: 24px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #666666;
        line-height: 32px;
      }
      .jindutiao {
        margin-left: 16px;
        width: 105px;
        height: 4px;
        background: #e2e2e2;
        border-radius: 4px;
        vertical-align: super;
        display: inline-block;
        position: relative;
        .jindutiao2 {
          width: 70%;
          height: 4px;
          background: #1890ff;
          /* vertical-align: super; */
          display: inline-block;
          position: absolute;
        }
      }
    }
  }
  .left_detail_secound {
    margin-top: 16px;
  }
  .left_detail_third {
    width: 344px;
    margin-top: 12px;
    max-height: calc(100% - 139px);
    overflow: scroll;
    overflow-x: hidden;
    .fenye {
      text-align: center;
      margin-top: 40px;
      background: #fafafa;
      ::v-deep .el-pagination {
        .number {
          background: #fafafa;
        }
        button {
          background: #fafafa;
        }
      }
    }

    .projectInfo {
      z-index: 22;
      .flex {
        display: flex;
        flex-direction: column;
        .lineheight {
          height: 20px;
        }
      }
      margin-left: 9px;
      .title_click {
        color: #ffffff !important;
      }
      .title:hover {
        color: #1890ff;
      }
      .title {
        height: 20px;
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
        line-height: 20px;
        max-width: 170px;
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .code_title {
        height: 22px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        line-height: 22px;
      }
      .code_title_click {
        color: rgba(255, 255, 255, 0.6) !important;
      }
      .code_name {
        height: 22px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 22px;
      }
      .code_name_click {
        color: #1890ff;
      }

      .stutas_button {
        margin-left: 8px;
        width: 44px;
        height: 24px;
        background: #e6f7ff;
        padding: 2px 8px;
        border-radius: 8px;
        width: 28px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #1890ff;
        line-height: 20px;
      }
      .stutas_button_click {
        background: rgba(255, 255, 255, 0.4) !important;
        color: #1976ff !important;
      }
    }
    .baseimg2 {
      width: 41px;
      height: 40px;
      z-index: 22;
    }
    .baseimg3 {
      width: 16px;
      height: 16px;
      z-index: 22;
      position: absolute;
      right: 8px;
      top: 45%;
    }
    .top42 {
      top: 42% !important;
    }
    .project_list_all {
      position: relative;
      width: 334px;
      .project_list {
        width: 334px;
        height: 76px;
        border-radius: 8px;
        margin-bottom: 8px;
        padding: 18px 16px;
        display: flex;
        cursor: pointer;
        position: relative;
        // background: #fff;
      }
      .project_list:hover {
        background: #fff;
      }

      .zhijiaoborder {
        border-top-right-radius: 8px !important;
        border-bottom-right-radius: 8px !important;
      }
      .backcolor {
        height: 92%;
        border-radius: 8px;
        border-top-right-radius: 0px;
        border-bottom-right-radius: 0px;
        margin-bottom: 8px;
        margin-left: 4px;
        padding: 18px 0px;
        display: flex;
        cursor: pointer;
        position: absolute;
        z-index: 11;
        top: 5px;
        left: 1px;
      }
      .lineover {
        display: none;
        position: absolute;
        height: 5px;
        width: 2px;
        bottom: -2px;
        .tipjindu {
          position: absolute;
          width: 200px;
          /* width: 62px; */
          height: 18px;
          font-size: 10px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          /* color: #1890FF; */
          line-height: 18px;
          top: -20px;
          z-index: 20;
          left: -58px;
        }
      }
      .redover {
        background: #cf1322;
      }
      .blueover {
        background: #1890ff;
      }
      .greyover {
        background: #cdcdcd;
      }
      .greenover {
        background: #2eae5b;
      }
      .redtipjindu {
        color: #cf1322;
      }
      .bluetipjindu {
        color: #1890ff;
      }
      .greytipjindu {
        color: #cdcdcd;
      }
      .greentipjindu {
        color: #2eae5b;
      }
      .red {
        background: linear-gradient(268deg, #ffe4db 0%, #fffdfc 100%);
      }
      .blue {
        background: linear-gradient(90deg, #f4fcff 0%, #e6f7ff 100%);
      }
      .grey {
        background: linear-gradient(
          268deg,
          #ebebeb 0%,
          rgba(231, 231, 231, 0) 100%
        );
      }
      .wancheng {
        background: linear-gradient(268deg, #e1fbe9 0%, #f6fef8 100%);
        width: 96.9% !important;
      }
    }
    .project_list_all:hover .lineover {
      display: block;
    }
    .project_list:last-child {
      margin-bottom: 0px;
    }
    .normal {
      background: #f7fdff;
    }
    .yuqi {
      background: #fffdf8;
    }
    .zanting {
      background: #fafafa;
    }
    .click {
      background: #fff;
      height: 116px !important;
    }
    .redclick {
      background: #fff;
      height: 116px !important;
      border: 1px solid #cf1322;
    }
    .rednocontactclick {
      background: #fff;
      height: 97px !important;
      border: 1px solid #cf1322;
    }
    .blueclick {
      background: #fff;
      height: 116px !important;
      border: 1px solid #1890ff;
    }
    .bluenocontactclick {
      background: #fff;
      height: 97px !important;
      border: 1px solid #1890ff;
    }
    .greyclick {
      background: #fff;
      height: 116px !important;
      border: 1px solid #cdcdcd;
    }
    .greynocontactclick {
      background: #fff;
      height: 97px !important;
      border: 1px solid #cdcdcd;
    }
    .greenclick {
      background: #fff;
      height: 116px !important;
      border: 1px solid #2eae5b;
    }
    .greennocontactclick {
      background: #fff;
      height: 97px !important;
      border: 1px solid #2eae5b;
    }
  }
  .left_detail_third::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 6px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
    position: relative;
    left: 1px;
  }
  .left_detail_third::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px #d8d8d8;
    background: #d8d8d8;
  }
  .left_detail_third::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    // -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    // border-radius: 10px;
    background: #fafafa;
  }
}
</style>
