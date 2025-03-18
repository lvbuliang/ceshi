<template>
  <div class="tjbox">
    <div class="tjbox2" style="height: 10%">
      <div class="tjbox2_text">
        <div class="middle_left_left_border"></div>
        统建项目
      </div>
    </div>
    <!-- 列表盒子 -->
    <div class="tab_box">
      <div class="tabs_box">
        <div
          style="width: 100px; height: 26px; margin-right: 20px"
          v-for="(tab, index) in tabs"
          :key="index"
          :class="{ active: activeTab === index }"
          @click="setActiveTab(index, tab.tagName)"
        >
          <div class="tjbox-tab" style="" size="small">
            {{ tab.tagName + (tab.num < 1 ? "" : `(${tab.num})`) }}
          </div>
        </div>
      </div>

      <div style="height: 80% !important; overflow-y: auto; position: relative">
        <!-- 添加加载动画 -->
        <transition name="fade">
          <div
            v-if="loading"
            class="loading-overlay"
            style="
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: rgba(255, 255, 255, 0.8);
              z-index: 999;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            "
          >
            <div class="loading-spinner"></div>
            <div class="loading-text">数据加载中</div>
          </div>
        </transition>

        <transition name="fade">
          <div v-if="!loading && listData.length > 0" key="data">
            <div
              class="tjbox-list"
              v-for="(item, index) in listData"
              :key="item.objectId"
            >
              <el-tooltip
                :content="item.schduleName"
                placement="bottom"
                effect="dark"
              >
                <span style="cursor: pointer">{{ item.schduleName }}</span>
              </el-tooltip>
              <el-button
                @click="goOperation(item.schduleUrl, item)"
                size="mini"
                type="text"
                round
                >{{ item.schduleUrlTitle }}</el-button
              >
            </div>
          </div>
          <div v-else-if="!loading && listData.length === 0" key="empty">
            <el-empty description="暂无处理的数据"></el-empty>
          </div>
        </transition>
      </div>
    </div>
    <!-- 分页盒子 -->
    <div class="page-box" v-show="pageData.total > 10">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="pageData.pageNum"
        :page-sizes="[10, 20, 30]"
        :page-size="pageData.pageSize"
        layout="sizes, prev, pager, next"
        :total="pageData.total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { querySchduleByTabV2 } from "@/api/home";

let tabTimer = null;
export default {
  name: "constructionProject",
  data() {
    return {
      tabs: [],
      htmlData: "",
      tagName: "周报填写",
      listData: [],
      loading: false, // 控制加载状态
      from_route: [
        { path: "reportAdd", activeTab: 0, tagName: "周报填写" },
        { path: "everydayriskDisposeNew", activeTab: 1, tagName: "风险预警" },
        { path: "everydaytroubleNew", activeTab: 1, tagName: "风险预警" },
        { path: "projectPhase", activeTab: 2, tagName: "执行进度" },
      ],
      // 分页数据
      pageData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      activeTab: 0,
    };
  },
  computed: {
    userInfo() {
      return JSON.parse(sessionStorage.getItem("userInfo"));
    },
  },
  updated() {

  },
  mounted() {
    this.htmlData = sessionStorage.getItem("htmlData");
    let fromRouter = sessionStorage.getItem("FROMROUTER");
    console.log('fromRouterfromRouterfromRouter',fromRouter);
    
    this.from_route.forEach((item) => {
      console.log('item.pathitem.path',item.path);
      
      if (fromRouter.includes(item.path) && this.htmlData) {
        console.log('itemitemitemitemitem',item);
        
        this.activeTab = item.activeTab;
        this.tagName = item.tagName;
      }
    });
    console.log(' this.activeTab this.activeTab', this.activeTab);
    
    this.querySchduleByTab();
  },
  methods: {
    // 获取统建项目tags
    querySchduleByTab() {
      this.listData = [];
      let temp = {
        tabName: this.tagName,
        ...this.pageData,
      };
      querySchduleByTabV2(temp).then((res) => {
        this.pageData.total = res.data.pageData.total;
        this.listData = res.data.pageData.records;

        this.loading = false; // 数据加载完成后隐藏加载动画
        this.tabs = res.data.tagAndNumVos.filter(
          (item) => item.tagName != "里程碑进度" && item.tagName != "审批"
        );
      });
    },
    setActiveTab(index, t) {
      this.pageData.pageNum = 1;
      this.pageData.pageSize = 10;
      this.loading = true; // 切换 Tab 时显示加载动画

      this.activeTab = index;

      this.tagName = t;
      sessionStorage.setItem("tagName", this.tagName);
      this.querySchduleByTab();
    },
    // 操作某条数据
    goOperation(url, item) {
      let newParam = `activeName=${this.tagName}`;
      sessionStorage.setItem("htmlData", item.moduleName);
      // 将 activeName 参数放在第一个位置
      let [baseUrl, queryString] = url.split("?");
      let newUrl = `${baseUrl}?${newParam}`;
      if (queryString) {
        newUrl += `&${queryString}`;
      }
      console.log("newUrlnewUrlnewUrl", newUrl);

      this.$router.push({
        path: newUrl,
      });
    },
    // 切换每页显示条数
    handleSizeChange(val) {
      this.pageData.pageNum = 1;
      this.pageData.pageSize = val;
      this.querySchduleByTab();
    },
    // 切换页数
    handleCurrentChange(val) {
      console.log("val", val);

      this.pageData.pageNum = val;
      this.querySchduleByTab();
    },
  },
};
</script>

<style lang="scss" scoped>
@media (max-width: 1400px) {
  .tjbox .tjbox-tab {
    font-size: 12px !important;
  }
}

@media (min-width: 1400px) and (max-width: 1680px) {
  .tjbox .tjbox-tab {
    font-size: 14px !important;
  }
}

@media (min-width: 1680px) {
  .tjbox .tjbox-tab {
    font-size: 14px !important;
  }
}

::v-deep .el-empty__description {
  color: #4f4848;
  font-size: 12px;
}

::v-deep.el-empty {
  width: 100px;
  margin: auto;
}

.tjbox {
  width: 50%;
  height: 100%;
  padding: 10px 20px;
  padding-bottom: 0;
  margin-top: 8px;
  margin-right: 16px;
  border-radius: 4px;
  box-sizing: border-box;
  background: rgb(255, 255, 255);

  .tjbox2 {
    width: 100%;

    // border-bottom: 1px solid rgb(229, 230, 235);
    // padding: 0 20px;
    .tjbox2_text {
      display: flex;
      align-items: center;
      width: 50%;
      font-weight: 700;
      font-size: 16px;

      .middle_left_left_border {
        width: 4px;
        height: 14px;
        border-radius: 5px;
        background: rgb(1, 118, 255);
        margin: 0 5px;
      }
    }
  }

  .tjbox-tab {
    width: 100%;
    height: 100%;
    cursor: pointer;
    padding-bottom: 10px;
    text-align: center;
    font-size: 14px;
  }

  .tjbox-list {
    width: 100%;
    // height: 39px;
    /* background-color: rebeccapurple; */
    background-color: rgb(255, 255, 255);
    padding: 8px 12px;
    padding-bottom: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    // border-radius: 0px;

    span {
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .tjbox-list-q {
      width: 56px;
      height: 24px;
      opacity: 1;
      // border-radius: 20px;
      // background: rgba(66, 130, 255, 1);
      display: flex;
      color: aliceblue;
      justify-content: center;
      align-items: center;
    }
  }

  .tab_box {
    padding-top: 10px;
    height: calc(100% - 66px) !important;

    .tabs_box {
      display: flex;
      width: 100%;
      // padding-bottom: 10px;
      border-bottom: 1px solid rgb(219, 222, 236);
      justify-content: space-around;
      // margin-bottom: 10px;
    }
  }
}

.page-box {
  display: flex;
  justify-content: flex-end;

  .page-box-single {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.active {
  color: rgb(1, 118, 255);
}

.active::after {
  content: "";
  width: auto;
  min-width: 44px;
  height: 2px;
  background: #1182fb;
  border-radius: 1px;
  display: block;
  margin-top: 1px;
  z-index: 10;
  transition: background-color 1s ease;
}
/* 加载动画的过渡效果 */
// .fade-enter-active,
// .fade-leave-active {
//   transition: opacity 0.3s;
// }

// .fade-enter,
// .fade-leave-to {
//   opacity: 0;
// }

/* 加载动画的过渡效果 */
// .fade-enter-active,
// .fade-leave-active {
//   transition: opacity 0.3s;
// }

// .fade-enter,
// .fade-leave-to {
//   opacity: 0;
// }

/* 加载动画的过渡效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.loading-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
// 文本文字
.loading-text {
  font-size: 12px;
  color: #4a97e2;
  margin-top: 10px; /* 与动画之间的间距 */
}

/* 加载动画 */
.loading-spinner {
  border: 2.5px solid rgba(0, 0, 0, 0.1); /* 背景线条 */
  border-top: 2px dashed #4a97e2; /* 加载动画的颜色 */
  border-radius: 50%; /* 圆形 */
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite; /* 动画 */
}

/* 旋转动画 */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
