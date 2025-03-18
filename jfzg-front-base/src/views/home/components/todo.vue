<template>
  <div style="width: 100%">
    <div class="todo-box" style="width: 100%">
      <swiper
        ref="todoSwiper"
        :options="swiperOption"
        class="swiperTodo"
        style="width: 100%"
      >
        <swiper-slide
          class="swiperTodoItem"
          v-for="(item, i) in tagObj.backlogList"
          :key="item.tagTypeCode"
        >
          <div
            :class="{ hitColor: item.tagTypeCode === tagTypeCode }"
            v-debounce="[() => handleClick(item, i), config.deTime]"
          >
            <span>
              {{ item.tagTypeName }}
              <span>
                (
                <b class="tabsNum_x"> {{ item.dbCount || 0 }} </b>)
              </span>
            </span>
          </div>
        </swiper-slide>
        <div class="more" style="">
          <span>更多 <i class="el-icon-arrow-right"></i></span>
        </div>
        <div
          v-if="tagObj.backlogList.length > 9"
          class="swiper-button-prev"
          slot="button-prev"
          @click="prev"
          :style="{ marginTop: isTop + 'px' }"
        >
          <i class="el-icon-arrow-left"></i>
        </div>
        <div
          v-if="tagObj.backlogList.length > 9"
          class="swiper-button-next"
          slot="button-next"
          @click="next"
          :style="{ marginTop: isTop + 'px' }"
        >
          <i class="el-icon-arrow-right"></i>
        </div>
      </swiper>
      <div class="wrap">
        <ul
          class="infinite-list"
          v-if="listData && listData.length > 0"
          style="overflow: auto"
        >
          <li
            v-for="i in listData"
            :key="i.projectId"
            :class="[
              getClassName(i),
              'infinite-list-item',
              'flex',
              'flex-v-center',
              i.status == 0 && i.project_status == 1 ? 'pause' : active,
            ]"
          >
            <!-- <img :src="getIconClassName(i)" class="icon-email" /> -->

            <el-tooltip
              v-if="i.schdule_name.length >= 60"
              :content="getSchduleName(i)"
              placement="top-start"
              effect="light"
            >
              <span class="content">{{ getSchduleName(i) }}</span>
            </el-tooltip>
            <span v-else class="content">{{ getSchduleName(i) }}</span>

            <template v-if="i.status == 0 && i.project_status != 1">
              <!-- <span class="countdown1" v-if="i.syts > 0"
                >距时限{{ i.syts }}天</span
              >
              <span class="countdown2" v-else-if="i.syts < 0"
                >已超期{{ Math.abs(i.syts) }}天</span
                            >-->
              <el-button
                v-if="i.schdule_url_title"
                @click="goOperation(i.schdule_url, i)"
                size="mini"
                type="primary"
                round
                >{{ i.schdule_url_title }}</el-button
              >
            </template>
            <el-button
              v-else-if="i.status == 1"
              @click="goOperation(i.schdule_url_read, i)"
              type="primary"
              size="mini"
              round
              >去查看</el-button
            >
            <span
              style="color: #cccccc"
              class="handle"
              v-else-if="i.project_status == 1"
              >项目暂停</span
            >
            <div style="width: 100%">
              <span class="time">{{ i.create_time }}</span>
            </div>
          </li>
        </ul>
        <template v-else>
          <empty />
        </template>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[5, 10, 20, 30]"
          :page-size="pageData.pageSize"
          :current-page="pageData.pageNum"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageData.total"
          v-if="pageData.total > 10"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { api_queryDoList, api_queryNeedDoCount } from "@/api/home";
import empty from "./empty.vue";
import config from "@/settings.js";
const openImg = require("@/assets/images/home/iconemail-open.png");
const closeImg = require("@/assets/images/home/iconemail-close.png");
const wait = require("@/assets/images/workBench/wait.png");
const wait_select = require("@/assets/images/workBench/wait_select.png");
const complete = require("@/assets/images/workBench/complete.png");
const complete_select = require("@/assets/images/workBench/complete_select.png");
const whole = require("@/assets/images/workBench/whole.png");
const whole_select = require("@/assets/images/workBench/whole_select.png");

let tabTimer = null;
export default {
  components: {
    empty,
  },
  data() {
    return {
      config,
      // 分页数据
      pageData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      isTop: null,
      active: 0, // 工作台状态字段
      tagTypeCode: null, // tag标签字段
      tagObj: {
        backlogList: [
          { tagTypeName: "待办", tagTypeCode: null, dbCount: 12 },

          {
            tagTypeName: "已办",
            tagTypeCode: "JFZGNDJHGL1677742897331",
            dbCount: 5,
          },
        ],
        backlogCount: 0, //待办总数
        haveDoneCount: 0, //已办总数
        allCount: 0,
      },
      keyword: null, // 搜索关键词
      tabsArr: [
        {
          title: "待办任务",
          key: "backlogCount",
          type: 0,
          en: "To Do Task",
          icon: "icon-daiban",
          select: wait_select,
          unSelect: wait,
        },
        {
          title: "已办任务",
          key: "haveDoneCount",
          type: 1,
          en: "Completed Tasks",
          icon: "icon-yiban",
          select: complete_select,
          unSelect: complete,
        },
        {
          title: "全部",
          key: "allCount",
          type: null,
          en: "All Tasks",
          icon: "icon-quanbu",
          select: whole_select,
          unSelect: whole,
        },
      ],
      listData: [
        {
          schdule_url_title: "去处理",
          schdule_end_time: "2024-08-15",
          syts: 0,
          schdule_url:
            "/subplan/#/projectLibrary/projectLibraryWorkView?id=6930&processId=78bd8f2e-3851-11ef-bd0c-2a01e4d6a651&templateId=15399544",
          create_time: "2024-08-08",
          module: "3001",
          moduleName: "方案审核",
          schdule_name:
            "「政务服务数据管理局/办公室」申报的「测试code1」已经组织评审通过了，需要您进行资金初审",
          schdule_url_read:
            "/subplan/#/projectLibrary/projectLibraryView?id=6930&processId=78bd8f2e-3851-11ef-bd0c-2a01e4d6a651&templateId=15399544",
          schdule_id: 44151,
          status: 0,
          ROW_ID: 1,
        },
        {
          schdule_url_title: "去处理",
          schdule_end_time: "2024-08-15",
          syts: 0,
          schdule_url:
            "/subdecl/#/planProject/planProjectWorkView?id=6927&processId=5dc72c87-3839-11ef-bd0c-2a01e4d6a651&templateId=15399539",
          create_time: "2024-08-08",
          module: "18008",
          moduleName: "清单审核",
          schdule_name:
            "「政务服务数据管理局/办公室申报经办人」「办公室经办人」申报的「测试新增0702-01」已经完成「符合性前置审查」，需要您组织「项目入库」",
          schdule_url_read:
            "/subdecl/#/planProject/planProjectView?id=6927&processId=5dc72c87-3839-11ef-bd0c-2a01e4d6a651&templateId=15399539",
          schdule_id: 44150,
          status: 0,
          ROW_ID: 2,
        },
        {
          schdule_url_title: "去处理",
          schdule_end_time: "2024-08-15",
          syts: -1,
          schdule_url:
            "/subdecl/#/planProject/planProjectWorkView?id=6928&processId=abb19db0-3839-11ef-bd0c-2a01e4d6a651&templateId=15399539",
          create_time: "2024-08-08",
          module: "18008",
          moduleName: "清单审核",
          schdule_name:
            "「政务服务数据管理局/办公室申报经办人」「办公室经办人」申报的「测试新增0702-02」已经完成「符合性前置审查」，需要您组织「项目入库」",
          schdule_url_read:
            "/subdecl/#/planProject/planProjectView?id=6928&processId=abb19db0-3839-11ef-bd0c-2a01e4d6a651&templateId=15399539",
          schdule_id: 44149,
          status: 0,
          ROW_ID: 3,
        },
      ],
      listData2: [
        {
          schdule_url_title: "去处理",
          schdule_end_time: "2024-09-15",
          syts: 0,
          schdule_url:
            "/subplan/#/projectLibrary/projectLibraryWorkView?id=6930&processId=78bd8f2e-3851-11ef-bd0c-2a01e4d6a651&templateId=15399544",
          create_time: "2024-08-08",
          module: "3001",
          moduleName: "方案审核",
          schdule_name:
            "「政务服务数据管理局/办公室」申报的「测试code1」已经组织评审通过了，需要您进行资金初审",
          schdule_url_read:
            "/subplan/#/projectLibrary/projectLibraryView?id=6930&processId=78bd8f2e-3851-11ef-bd0c-2a01e4d6a651&templateId=15399544",
          schdule_id: 44151,
          status: 0,
          ROW_ID: 1,
        },
        {
          schdule_url_title: "去处理",
          schdule_end_time: "2024-09-15",
          syts: 0,
          schdule_url:
            "/subdecl/#/planProject/planProjectWorkView?id=6927&processId=5dc72c87-3839-11ef-bd0c-2a01e4d6a651&templateId=15399539",
          create_time: "2024-08-08",
          module: "18008",
          moduleName: "清单审核",
          schdule_name:
            "「政务服务数据管理局/办公室申报经办人」「办公室经办人」申报的「测试新增0702-01」已经完成「符合性前置审查」，需要您组织「项目入库」",
          schdule_url_read:
            "/subdecl/#/planProject/planProjectView?id=6927&processId=5dc72c87-3839-11ef-bd0c-2a01e4d6a651&templateId=15399539",
          schdule_id: 44150,
          status: 0,
          ROW_ID: 2,
        },
        {
          schdule_url_title: "去处理",
          schdule_end_time: "2024-09-15",
          syts: -1,
          schdule_url:
            "/subdecl/#/planProject/planProjectWorkView?id=6928&processId=abb19db0-3839-11ef-bd0c-2a01e4d6a651&templateId=15399539",
          create_time: "2024-08-08",
          module: "18008",
          moduleName: "清单审核",
          schdule_name:
            "「政务服务数据管理局/办公室申报经办人」「办公室经办人」申报的「测试新增0702-02」已经完成「符合性前置审查」，需要您组织「项目入库」",
          schdule_url_read:
            "/subdecl/#/planProject/planProjectView?id=6928&processId=abb19db0-3839-11ef-bd0c-2a01e4d6a651&templateId=15399539",
          schdule_id: 44149,
          status: 0,
          ROW_ID: 3,
        },
      ],
      swiperOption: {
        loop: false,
        prevButton: ".swiper-button-prev", //上一张
        nextButton: ".swiper-button-next", //下一张
        slidesPerView: "auto", // 每页展示几条数据
        spaceBetween: 0,
        initialSlide: 0,
        freeMode: true,
      },
    };
  },
  computed: {
    timesCom() {
      return function (time) {
        return time.split("T")[0];
      };
    },
    hasUndoCode() {
      return true;
    },
    hasDoneCode() {
      return true;
    },
    swiper() {
      return this.$refs.todoSwiper.$swiper;
    },
    tabsList() {
      return JSON.parse(sessionStorage.getItem("tabsList"));
    },
    currentPage() {
      return sessionStorage.getItem("CURRENT_PAGE");
    },
  },
  methods: {
    toSandTable() {
      this.$router.push({ name: "sandTable" });
    },
    search() {
      this.pageData.pageNum = 1;
      this.init();
    },
    refresh() {
      this.keyword = null;
      this.init();
    },
    // 切换每页显示条数
    handleSizeChange(val) {
      this.pageData.pageNum = 1;
      this.pageData.pageSize = val;
      this.queryList();
    },
    // 切换页数
    handleCurrentChange(val) {
      this.pageData.pageNum = val;
      this.queryList();
    },
    isIE() {
      if (!!window.ActiveXObject || "ActiveXObject" in window) {
        this.isTop = -5;
      }
    },
    prev() {
      this.swiper.slidePrev();
    },
    next() {
      this.swiper.slideNext();
    },
    getImage(item) {
      if (item.type === this.active) {
        return item.select;
      } else {
        return item.unSelect;
      }
    },
    // 根据状态展示不同图标
    getIconClassName(i) {
      if (i.status == 0 && i.project_status == 1) {
        // 待办被暂停
        return closeImg;
      } else if (i.status == 0) {
        // 待办
        return closeImg;
      } else {
        // 已办
        return openImg;
      }
    },
    // 根据状态添加不同类名
    getClassName(i) {
      if (i.status == 0 && i.project_status == 1) {
        // 待办被暂停
        return "suspend";
      } else if (i.status == 0) {
        // 待办
        return "waitDone";
      } else {
        // 已办
        return "aleradyDone";
      }
    },
    // 根据状态展示提示语
    getSchduleName(i) {
      return (
        i.schdule_name +
        (i.status == 1
          ? "，已处理！"
          : i.project_status == 1 ||
            i.module == 1001 ||
            i.module == 2001 ||
            i.module == 7001
          ? ""
          : "，请尽快处理！")
      );
    },
    // 操作某条数据
    goOperation(url, item) {
      if (!url) return;
      this.$router.push({
        path: url,
      });
      let element = {
        url,
        title: item.moduleName,
      };
      // 更新tabs页签
      this.$store.commit("tabs/UPDATE_TABS_LIST", element);
      this.$store.commit("tabs/UPDATE_CURRENT_PAGE", element.url);
    },
    // 切换左侧状态，全部null, 待办0, 已办1，根据status重新查询tag数组
    changeActive(activeName) {
      this.active = activeName;
      this.tagTypeCode = null;
      this.keyword = "";
      this.swiper.slideTo(0);
      if (tabTimer) {
        clearTimeout(tabTimer);
      }
      tabTimer = setTimeout(() => {
        this.pageData = {
          pageNum: 1,
          pageSize: 10,
          total: 0,
        };
        this.init();
      }, 1000);
    },
    // 切换tag标签，例如全部、专项规划、总体规划，根据tagTypeCode重新查询列表数据
    handleClick(tab, i) {
      this.tagTypeCode = tab.tagTypeCode;
      this.listData = this.listData2;
      this.pageData = {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      };
      // this.queryList();
    },
    // 查询列表数据
    queryList() {
      let temp = {
        status: this.active,
        tagTypeCode: this.tagTypeCode,
        ...this.pageData,
        keyword: this.keyword,
      };
      api_queryDoList(temp).then((res) => {
        if (res && res.success) {
          let { data } = res;
          this.pageData.total = data.total;
          this.$set(this, "listData", data.records);
        } else {
          this.$set(this, "listData", []);
        }
      });
    },
    // 初始化查询总数和tag数组
    init() {
      api_queryNeedDoCount({ status: this.active, keyword: this.keyword }).then(
        (res) => {
          this.tagObj = res.data;
          this.tagObj.allCount = res.data.backlogCount + res.data.haveDoneCount;
          this.queryList();
        }
      );
    },
  },
  created() {
    this.isIE();
    if (this.hasUndoCode || this.hasDoneCode) {
      // this.init();
    }
  },
};
</script>

<style lang="scss">
* {
  touch-action: pan-y;
}
.todo-box {
  .swiperTodo {
    border-bottom: 1px solid #eeeeee;
    margin-top: -4px;
    width: 100% !important;
    .swiper-container {
      overflow-y: inherit;
    }
    .swiper-button-next:after,
    .swiper-container-rtl .swiper-button-prev:after {
      font-size: 0px;
      color: #999;
    }
    [class^="el-icon-"],
    [class*=" el-icon-"] {
      line-height: 1;
    }
    .swiper-button-prev::after,
    .swiper-container-rtl .swiper-button-next::after {
      content: "";
    }
    .swiper-button-next::after,
    .swiper-container-rtl .swiper-button-prev::after {
      content: "";
    }
    .swiper-button-prev:after,
    .swiper-button-next:after {
      font-size: 16px;
      color: #999 !important;
      margin-top: -5px;
    }
    .swiper-button-prev {
      left: 0 !important;
    }
    .swiper-button-next,
    .swiper-button-prev {
      display: none;
      font-size: 16px;
      font-weight: bold;
      color: #999 !important;
      width: 24px;
      height: 24px;
      background: #ffffff;
      box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.12);
      border-radius: 20px;
      margin-top: 0;
      transform: translateY(-58%);
    }
    .swiper-button-next {
      right: 0 !important;
    }
    &:hover {
      .swiper-button-next,
      .swiper-button-prev {
        display: flex;
      }
    }
  }
  .wrap {
    width: 100%;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }
  .swiperTodoItem {
    height: 40px;
    width: auto !important;
    padding-right: 32px;
    color: #333;
    -moz-user-select: none;
    -o-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
    cursor: pointer;
    > div {
      display: flex;
      align-items: center;
      height: 40px;
    }
  }
  .hitColor {
    color: #1890ff;
    font-weight: 500;
    position: relative;

    &::after {
      content: "";
      width: 100%;
      height: 2px;
      position: absolute;
      bottom: 0;
      z-index: 99;
      left: 0;
      background-color: #1890ff;
    }

    .tabsNum_x {
      color: #1890ff !important;
      font-weight: 500 !important;
    }
  }
}
</style>
<style lang="scss" scoped>
$normalColor: #007aff;
$buttonColor: #1890ff;
::v-deep.el-tooltip__popper {
  width: 500px;
  line-height: 22px;
}
::v-deep .el-input__inner {
  padding-left: 12px !important;
}

.todo-box {
  font-size: 14px;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  .ul_box {
    width: 128px;
    margin-right: 24px;
    display: flex;
    flex-direction: column;
    li {
      flex: 1;
      min-width: 128px;
      padding-left: 14px;
      background: #fff;
      border: 1px solid #eeeeee;
      border-radius: 8px;
      margin-bottom: 8px;
      display: flex;
      justify-content: center;
      position: relative;
      cursor: pointer;
      color: #666;
      flex-direction: column;
      font-size: 18px;
      overflow: hidden;
      .line {
        width: 20px;
        height: 1px;
        background-color: #ccc;
        margin-bottom: 4px;
      }
      .en {
        font-size: 12px;
      }
      .number {
        font-size: 18px;
        font-weight: 700;
        color: #000;
      }
      .number,
      .title {
        font-family: "lanting";
      }
      .base-iconfont {
        margin-top: 8px;
        color: #1890ff;
        &:hover {
          color: rgb(54, 183, 254);
        }
      }
      .bg {
        width: 87px;
        height: 180px;
        position: absolute;
        right: 0px;
        bottom: 0px;
      }
      .status_img {
        height: 40px;
      }
      &.active {
        border: none;
        background: linear-gradient(
          47deg,
          #3577fe 0%,
          rgba(101, 175, 255, 0.9) 100%
        );
        color: #fff;
        &::after {
          content: "";
          width: 0px;
          height: 0px;
          border: 10px solid transparent;
          border-left: 10px solid #76aeff;
          position: absolute;
          right: -20px;
        }
        .line {
          background-color: rgba(255, 255, 255, 0.4);
        }
        .base-iconfont {
          color: rgba($color: #fff, $alpha: 0.7) !important;
        }
        .number {
          color: #fff;
        }
      }
      &:last-of-type {
        margin-bottom: 0;
      }
    }
  }
  .content_box {
    width: calc(100% - 152px);
    display: flex;
    flex-direction: column;
    .search_head {
      display: flex;
      height: 40px;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 2px;
      .search {
        display: flex;
        .el-input {
          width: 240px;
        }
        .el-button {
          margin-left: 8px !important;
        }
      }
      .switch_box {
        width: 124px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        cursor: pointer;
        background: linear-gradient(
          270deg,
          #ffa922 0%,
          #ff7d22 100%,
          #ff7d22 100%
        );
        border-radius: 100px 32px 32px 100px;
        i {
          margin-right: 3px;
        }
        &:hover {
          background: linear-gradient(
            270deg,
            #ff7d22 0%,
            #ff7d22 0%,
            #ffa922 100%
          );
          box-shadow: -10px 2px 20px 0px rgba(255, 128, 34, 0.2);
        }
      }
    }
  }
  .more {
    width: 10%;
    height: 100%;
    // background-color: red;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    position: absolute;
    right: 0px;
    cursor: pointer;
  }
  .tabsNum_x {
    color: #333;
    font-weight: normal;
  }
  .liang {
    background: $normalColor;
    width: 200px;
    height: 40px;
    font-weight: 500;
  }
  .is-plain {
    width: 200px;
    height: 40px;
    font-weight: 500;
  }
  .wrap {
    height: calc(100% - 80px);
    .el-pagination {
      height: 60px;
      display: flex;
      align-items: flex-end;
      justify-content: flex-end;
    }
    .infinite-list {
      width: 100%;
      line-height: 30px;
      padding-right: 16px;
      height: calc(100% - 60px);
      overflow-y: scroll !important;
      // -ms-overflow-style: none;
      // overflow: -moz-scrollbars-none;
      scrollbar-face-color: #ccc;
      &::-webkit-scrollbar {
        width: 10px !important;
      }
      &::-webkit-scrollbar-thumb {
        background: rgba($color: #ccc, $alpha: 1);
        border-radius: 8px;
      }
      scrollbar-color: #ccc rgba($color: #fff, $alpha: 0);
      .infinite-list-item {
        // height: 55px;
        display: flex;
        flex-wrap: wrap;
        border-bottom: 1px dashed rgba(0, 0, 0, 0.08);
        position: relative;
        .icon-email {
          width: 32px;
          height: 32px;
          border-radius: 8px;
        }
        .time {
          color: #999;
          margin-left: 22px;
          width: 82px !important;
        }
        &.aleradyDone {
          .content {
            color: #999;
          }
        }
        .content {
          margin-left: 10px;
          margin-right: 142px;
          width: 780px;
          flex: 1;
          line-height: 1.4;
          color: #333;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
        }
        .countdown1,
        .countdown2 {
          color: #ff6600;
          margin-left: 70px;
          font-size: 12px;
          display: flex;
          width: 92px;
          height: 28px;
          line-height: 28px;
          padding-left: 28px;
          align-items: center;
          background: url("../../../assets/images/home/djs-bg1.png") 0 0
            no-repeat;
          background-size: 92px 28px;
        }
        .countdown2 {
          color: #ff0000;
          background-image: url("../../../assets/images/home/djs-bg2.png");
        }

        .handle {
          position: absolute;
          top: 0;
          bottom: 0;
          right: 0;
        }
        &.suspend {
          .content {
            color: #cccccc;
          }
          .handle {
            color: #cccccc;
            cursor: default;
          }
        }
      }
    }
  }
}
::v-deep .todo_x {
  width: 50%;
}
::v-deep .empty-box {
  width: 70%;
}
</style>
