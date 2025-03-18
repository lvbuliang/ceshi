<template>
  <div class="enclosure">
    <div class="enclosure-tabs">
      <div
        v-for="item in tabs"
        @mouseover="selectStyle(item)"
        @mouseout="outStyle(item)"
        @click="handleCheckTab(item.id)"
        :key="item.id"
        class="enclosure-tabs-item"
        :class="{ active: activeTabindex == item.id }"
      >
        <img
          :src="
            activeTabindex == item.id || item.hoverIndex
              ? item.activeicon
              : item.icon
          "
          alt=""
        />
        <span>{{ item.name }}</span>
      </div>
    </div>
    <!-- 实施管理附件判断 -->
    <div v-if="this.activeTabindex == 1">
      <div class="enclosure-content" v-if="backlogList.length > 0">
        <!-- tab轮播 -->
        <swiper ref="todoSwiper" :options="swiperOption" class="swiperTodo">
          <swiper-slide
            class="swiperTodoItem"
            v-for="(item, i) in backlogList"
            :key="item.tagTypeCode"
          >
            <div
              :class="{ hitColor: i === tagTypeCode }"
              v-debounce="[() => handleClick(item, i)]"
            >
              <span>
                {{ item.stageName }}
                <span>
                  (
                  <b class="tabsNum_x"> {{ item.dbCount || 0 }} </b>)
                </span>
              </span>
            </div>
          </swiper-slide>
          <div
            class="swiper-button-prev"
            slot="button-prev"
            @click="prev"
            :style="{ marginTop: isTop + 'px' }"
          >
            <i class="el-icon-arrow-left"></i>
          </div>
          <div
            class="swiper-button-next"
            slot="button-next"
            @click="next"
            :style="{ marginTop: isTop + 'px' }"
          >
            <i class="el-icon-arrow-right"></i>
          </div>
        </swiper>
        <!-- 文件 -->
        <div
          class="filebox1"
          v-if="
            backlogList.length > 0 &&
            backlogList[this.tagTypeCode].fileList.length > 0
          "
        >
          <div
            class="filebox"
            v-for="(item, index) in backlogList[this.tagTypeCode].fileList"
            :key="index"
            @click="seeFile(item.id)"
          >
            <div class="icon">
              <!-- <i class="el-icon-paperclip"></i> -->
              <img src="@/assets/singleProject/file.png" alt="" />
            </div>
            <div class="mess">
              <el-tooltip
                v-if="item.name.length > 10"
                :content="item.name"
                placement="top"
                effect="light"
              >
                <p>
                  {{ "..." + item.name.substring(item.name.length - 10) }}
                </p>
              </el-tooltip>
              <p v-else>{{ item.name }}</p>
              <!-- <span>{{item.fileSize}}</span> -->
            </div>
          </div>
        </div>
        <div
          class="enclosure-nodata bgcolor"
          v-if="
            backlogList.length > 0 &&
            backlogList[this.tagTypeCode].fileList.length == 0
          "
        >
          <EmptyFile :title="'暂无内容'"></EmptyFile>
        </div>
      </div>
      <!-- 无值时 -->
      <div class="enclosure-nodata bgcolor" v-if="backlogList.length == 0">
        <EmptyFile :title="'暂无内容'"></EmptyFile>
      </div>
    </div>
    <div v-if="this.activeTabindex != 1">
      <div class="enclosure-content" v-if="fileList && fileList.length > 0">
        <div
          class="filebox"
          v-for="(item, index) in fileList"
          :key="index"
          @click="seeFile(item.fileId)"
        >
          <div class="icon">
            <!-- <i class="el-icon-paperclip"></i> -->
            <img src="@/assets/singleProject/file.png" alt="" />
          </div>
          <div class="mess">
            <el-tooltip
              v-if="item.fileName.length > 10"
              :content="item.fileName"
              placement="top"
              effect="light"
            >
              <p>
                {{ "..." + item.fileName.substring(item.fileName.length - 10) }}
              </p>
            </el-tooltip>
            <p v-else>{{ item.fileName }}</p>
            <!-- <span>{{item.fileSize}}</span> -->
          </div>
        </div>
      </div>

      <div class="enclosure-nodata" v-else>
        <EmptyFile :title="'暂无内容'"></EmptyFile>
      </div>
    </div>
  </div>
</template>

<script>
import config from "@/setting.js";
import { getAllFilesByModule, getAllProjectFile } from "@/api/singleProject.js";
import { api_getdeliverListById } from "@/api/index.js";
import EmptyFile from "./emptyFile.vue";
export default {
  props: {},
  data() {
    return {
      activeTabindex: 0,
      backlogList: [], //实施管理文件
      tabs: [
        // {
        //   id: 0,
        //   name: "可研",
        //   icon: require("@/assets/singleProject/single_icon03.png"),
        //   activeicon: require("@/assets/singleProject/single_icon04.png"),
        //   hoverIndex: false,
        // },
        // {
        //   id: 1,
        //   name: "概算",
        //   icon: require("@/assets/singleProject/single_icon09.png"),
        //   activeicon: require("@/assets/singleProject/single_icon10.png"),
        //   hoverIndex: false,
        // },
        // {
        //   id: 2,
        //   name: "实施管理",
        //   icon: require("@/assets/singleProject/single_icon53.png"),
        //   activeicon: require("@/assets/singleProject/single_icon54.png"),
        //   hoverIndex: false,
        // },
        // {
        //   id: 3,
        //   name: "验收管理",
        //   icon: require("@/assets/singleProject/single_icon48.png"),
        //   activeicon: require("@/assets/singleProject/single_icon47.png"),
        //   hoverIndex: false,
        // },
        // {
        //   id: 4,
        //   name: "后评价管理",
        //   icon: require("@/assets/singleProject/single_icon01.png"),
        //   activeicon: require("@/assets/singleProject/single_icon02.png"),
        //   hoverIndex: false,
        // },
        // {
        //   id: 5,
        //   name: '其他',
        //   icon:require('@/assets/singleProject/single_icon40.png'),
        //   activeicon: require('@/assets/singleProject/single_icon41.png')
        // }
        {
          id: 0,
          name: "立项",
          icon: require("@/assets/singleProject/single_icon03.png"),
          activeicon: require("@/assets/singleProject/single_icon04.png"),
          hoverIndex: false,
        },
        {
          id: 1,
          name: "实施管理(交付物)",
          icon: require("@/assets/singleProject/single_icon53.png"),
          activeicon: require("@/assets/singleProject/single_icon54.png"),
          hoverIndex: false,
        },
        {
          id: 2,
          name: "验收管理",
          icon: require("@/assets/singleProject/single_icon48.png"),
          activeicon: require("@/assets/singleProject/single_icon47.png"),
          hoverIndex: false,
        },
        {
          id: 3,
          name: "其他",
          icon: require("@/assets/singleProject/single_icon40.png"),
          activeicon: require("@/assets/singleProject/single_icon41.png"),
        },
      ],
      fileList: [], //除了实施管理文件之外的附件
      isTop: null,
      tagTypeCode: 0, // 实施管理文件tag标签字段
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
  created() {
    this.getDeliveryReport();
  },
  computed: {
    swiper() {
      return this.$refs.todoSwiper.$swiper;
    },
  },
  methods: {
    handleClick(tab, i) {
      this.tagTypeCode = i;
      console.log("11111", tab, i);
    },
    // 查询列表数据
    selectStyle(item) {
      item.hoverIndex = true;
    },
    outStyle(item) {
      item.hoverIndex = false;
    },
    // 切换tab
    handleCheckTab(index) {
      this.activeTabindex = index;
      console.log(index);
      // this.getDeliveryReport(index + 1);
      if (this.activeTabindex == 1) {
        // 立项附件
        this.getFileList();
      } else if (this.activeTabindex == 0) {
        // 实施管理附件
        this.getDeliveryReport(1);
        // this.getAllProjectFileList()
      } else if (this.activeTabindex == 2) {
        // 验收管理附件
        this.getDeliveryReport(4);
      } else {
        // 其他附件
        this.getDeliveryReport(5);
      }
    },
    // 查看文件
    seeFile(item) {
      window.open(`${config.baseUrl}/viewPdf?id=${item}`);
    },
    // 根据tab获取相应的文件内容
    getDeliveryReport(moduleFlag = "1") {
      getAllFilesByModule({
        projectId: this.$route.query.projectId,
        moduleFlag: moduleFlag,
      }).then((res) => {
        if (moduleFlag == 5) {
          this.fileList = [];
        } else {
          this.fileList = res.data;
        }
      });
    },
    // 实施管理交付物附件
    getFileList() {
      api_getdeliverListById({ projectId: this.$route.query.projectId }).then(
        (res) => {
          console.log("实施管理交付物附件", res.data);
          res.data.map((item) => {
            let length = 0;
            let fileList = [];
            item.deliverys.map((item1) => {
              length += item1.deliveryFiles.length;
              item1.deliveryFiles.map((item3) => {
                // console.log(item3)
                fileList.push(JSON.parse(item3.fileContext));
              });
            });
            console.log(length, fileList);
            item.dbCount = length;
            item.fileList = fileList;
          });
          this.backlogList = res.data;
          console.log(this.backlogList);
        }
      );
    },
    prev() {
      this.swiper.slidePrev();
    },
    next() {
      this.swiper.slideNext();
    },
  },
  components: {
    // Newwenjian
    EmptyFile,
  },
};
</script>

<style lang="scss">
.enclosure {
  .enclosure-tabs {
    margin-bottom: 16px;
    display: flex;
    .enclosure-tabs-item {
      width: 263px;
      height: 40px;
      background: #ffffff;
      border-radius: 8px;
      border: 1px solid #efefef;
      text-align: center;
      line-height: 38px;
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #999999;
      margin-right: 8px;
      cursor: pointer;
      img {
        width: 14px;
        vertical-align: middle;
        margin-right: 3px;
      }
      span {
        display: inline-block;
        vertical-align: middle;
      }
      &.active {
        background: #e6f7ff;
        border-radius: 8px;
        border: 1px solid transparent;
        color: #1890ff;
      }
      &:hover {
        color: #1890ff;
      }
    }
  }
  .enclosure-content {
    padding: 16px 16px 0 16px;
    border-radius: 8px;
    background: #fafafa;
    display: flex;
    flex-wrap: wrap;
    .filebox {
      margin-right: 31px;
      display: flex;
      align-items: center;
      margin-bottom: 16px;
      cursor: pointer;
      &:hover .mess {
        p {
          color: #1890ff;
        }
      }
      &:last-child {
        margin-right: 0;
      }
      .icon {
        width: 32px;
        height: 32px;
        background: #f2f2f2;
        border-radius: 8px;
        margin-right: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          width: 16px;
          height: 16px;
        }
      }
      .mess {
        width: 124px;
        p {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
          line-height: 22px;
        }
        span {
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #666666;
          line-height: 20px;
        }
      }
    }
  }
  .enclosure-nodata {
    text-align: center;
    font-size: 16px;
    color: #999999;
  }
  .swiperTodo {
    margin-bottom: 15px;
    border-bottom: 1px solid #eeeeee;
    margin-top: -4px;
    width: 100%;
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
.filebox1 {
  display: flex;
}
.bgcolor {
  width: 100%;
  text-align: center;
}
</style>
