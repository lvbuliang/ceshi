<template>
  <!-- 工作台创建项目 -->
  <div class="template_content" v-if="$route.name == 'workBench'">
    <!-- <Todo class="todo_x" :style="styleObject"></Todo> -->
    <!-- <Quick class="quick_x"></Quick> -->
    <!-- <div style="width: 100%; height: 100%; display: flex">
      <div style="width: 60%; display: flex; flex-direction: column"> -->
    <div class="allBox">
      <!-- 创建项目盒子 -->
      <!-- 系统数量 -->
      <systemNum class="systemNum" @callbackFunc="callbackFunc"></systemNum>

      <!-- 消息公告 -->
      <!-- <Notice :noticeData="noticeData" @click="onClick" :totalWidth="totalWidth" /> -->

      <!-- 统建 + 待办 -->
      <div class="conTD">
        <!-- 统建 -->
        <constructionProject />
        <!-- 待办 -->
        <div class="toDoBox">
          <!-- 代办 已办盒子 -->
          <div class="Knowledge2" style="position: relative">
            <div>
              <el-tabs v-model="activeName" @tab-click="handleClick1">
                <el-tab-pane :label="'待办' + '(' + pageData2.total + ')'" name="first">
                  <!-- 加载动画 -->
                  <div v-show="loading" class="loading-overlay">
                    <div class="loading-spinner"></div>
                    <div class="loading-text">待办加载中</div>
                  </div>
                  <div class="paneBox" v-if="!loading">
                    <div v-if="listData2.length > 0">
                      <div class="pane-item" v-for="item in listData2" :key="item.objectId">
                        <el-tooltip :content="item.schduleName" placement="bottom" effect="dark">
                          <div style="
                              width: 80%;
                              display: flex;
                              align-items: center;
                            ">
                            <span class="pane-item-title"></span>
                            <div class="pane-item-content">
                              <span class="pane-item-text">{{
                                item.schduleName
                              }}</span>
                              <p class="item-sub-text">{{ item.createTime }}</p>
                            </div>
                          </div>
                        </el-tooltip>

                        <div>
                          <el-button @click="goOperation2(item.schduleUrl, item)" size="mini" type="primary" round>{{
                            item.schduleUrlTitle }}</el-button>
                        </div>
                      </div>
                    </div>
                    <div v-else style="height: 100%;line-height: 120px;">
                      <empty text="暂无处理的待办" />
                    </div>
                  </div>

                  <!-- 分页盒子 -->
                  <!-- <div class="page-box" v-show="listData.length > 10"> -->
                  <div class="page-box2">
                    <!-- <div class="page-box-single" style="">共条</div> -->
                    <el-pagination @size-change="handleSizeChange2" @current-change="handleCurrentChange2"
                      :current-page.sync="pageData2.pageNum" :page-sizes="[5, 10, 15]" :page-size="pageData2.pageSize"
                      layout="sizes, prev, pager, next" :total="pageData2.total" v-if="!loading && pageData2.total > 5">
                    </el-pagination>
                  </div>
                </el-tab-pane>

                <!-- 行业规范 -->
                <el-tab-pane :label="'已办' + '(' + pageData3.total + ')'" name="second">
                  <!-- 加载动画 -->
                  <div v-show="loading" class="loading-overlay">
                    <div class="loading-spinner"></div>
                    <div class="loading-text">已办加载中</div>
                  </div>
                  <div class="paneBox" v-if="!loading">
                    <div v-if="listData3.length > 0">
                      <div class="pane-item" v-for="item in listData3" :key="item.objectId">
                        <el-tooltip :content="item.schduleName" :placement="listData3[0] ? 'bottom' : 'top-start'"
                          effect="dark">
                          <div style="
                              width: 80%;
                              display: flex;
                              align-items: center;
                            ">
                            <span :class="item.schduleUrlTitle == '已查看'
                              ? 'pane-item-title activeA'
                              : 'pane-item-title'
                              "></span>
                            <div class="pane-item-content">
                              <span :class="item.schduleUrlTitle == '已查看'
                                ? 'pane-item-text activeB'
                                : 'pane-item-text'
                                ">{{ item.schduleName }}</span>
                              <p :class="item.schduleUrlTitle == '已查看'
                                ? 'item-sub-text activeB'
                                : 'item-sub-text'
                                ">
                                {{ item.createTime }}
                              </p>
                            </div>
                          </div>
                        </el-tooltip>
                        <div>
                          <el-button @click="
                            goOperation3(
                              item.schduleUrlRead,
                              item,
                              item.schduleId
                            )
                            " size="mini" :type="item.schduleUrlTitle == '已查看'
                              ? 'info'
                              : 'primary'
                              " round>{{ item.schduleUrlTitle }}</el-button>
                        </div>
                      </div>
                    </div>

                    <!-- <div v-else-if="!loading && listData.length === 0" key="empty">
            <el-empty description="暂无处理的数据"></el-empty>
          </div> -->
                    <div v-else style="height: 100%;line-height: 120px;">
                      <empty text="暂无处理的已办" />
                    </div>
                  </div>
                  <!-- 分页盒子 -->
                  <div class="page-box2">
                    <el-pagination @size-change="handleSizeChange2" @current-change="handleCurrentChange2"
                      :current-page.sync="pageData3.pageNum" :page-sizes="[5, 10, 15]" :page-size="pageData3.pageSize"
                      layout="sizes, prev, pager, next" :total="pageData3.total" v-if="!loading && pageData3.total > 5">
                    </el-pagination>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </div>
      </div>

      <!-- 项目列表 -->
      <projectList class="projectList" ref="projectListRef"></projectList>
    </div>
  </div>
  <router-view v-else></router-view>
</template>

<script>
import Todo from "./components/todo.vue";
import Quick from "./components/quick.vue";
import empty from "./components/empty.vue";
import systemNum from "./components/systemNum.vue"; //系统数量
import constructionProject from "./components/constructionProject.vue"; //统建类项目
import knowLedge from "./components/knowLedge.vue"; // 知识库
import projectList from "./components/projectList.vue"; // 项目列表
import Notice from "@/components/Notice.vue"; // 消息轮播
import { queryData, updateTitle, api_queryDoList, api_getFixedGroupMembers } from "@/api/home";
import store from "@/store";

export default {
  components: {
    Todo,
    Quick,
    empty,
    // workBench,
    systemNum,
    constructionProject,
    knowLedge,
    projectList,
    Notice,
  },
  data() {
    return {
      userType: 0,
      loading: false, // 控制加载状态
      pageData2: {
        pageNum: 1,
        pageSize: 5,
        total: 0,
      },
      pageData3: {
        pageNum: 1,
        pageSize: 5,
        total: 0,
      },
      activeName: "first",

      styleObject: {
        width: "800px",
      },
      tabs: [],
      listData2: [],
      listData3: [],
      status: 0,
    };
  },
  computed: {
    userInfo() {
      return JSON.parse(sessionStorage.getItem("userInfo"));
    },
  },
  watch: {
    $route: {
      handler(val) {
        console.log("$route", val);
      },
    },
  },
  mounted() {
    window.addEventListener("resize", this.init);
    this.$nextTick(function () {
      this.init();
    });
    this.getUserByCode()

  },
  unmounted() {
    window.removeEventListener("resize", this.init);
  },
  methods: {
    // 根据code  拿到角色信息
    // 根据code  拿到角色信息
    getUserByCode() {
      api_getFixedGroupMembers({ type: 0 }).then((res) => {
        const user = res.data.find(item => item.jfid === this.userInfo.jfid);
        console.log('user',user);
        
        this.userType = user ? 0 : 1;
        console.log('this.userType',this.userType);
        
        this.queryList(0);
        this.queryList(1);
      });
    },
    callbackFunc(data) {
      console.log(data, "datadata");
      this.$nextTick(() => {
        this.$refs.projectListRef.changeYear(data);
      });
    },
    init() {
      if (this.$route.fullPath != "/base/home") return;
      if (document.querySelector(".template_content")) {
        let boxWidth = document.querySelector(".template_content").offsetWidth;
        this.styleObject.width = boxWidth + "px";
      }
    },

    // 待办切换
    handleClick1(tab, event) {
      this.loading = true; // 显示加载动画
      this.activeName = tab.name;
      this.status = tab.index;
      if (this.status == 0 || this.status == "0") {
        this.pageData2.pageNum = 1;
        this.pageData2.pageSize = 5;
      } else {
        this.pageData3.pageNum = 1;
        this.pageData3.pageSize = 5;
      }
      // if (tabTimer) {
      //   clearTimeout(tabTimer);
      // }
      // tabTimer = setTimeout(() => {
      // this.pageData = {
      //   pageNum: 1,
      //   pageSize: 10,
      //   total: 0,
      //   status: this.status,
      // };
      this.queryList(this.status);
      // }, 1000);
    },
    // 查询列表数据
    queryList(status) {
      console.log('his.userType,his.userType,',this.userType,);
      
      // if (status==0) {

      // }
      // let temp = {
      //   ...this.pageData2,
      //   status,
      // };

      api_queryDoList({
        pageNum:
          Number(status) == 0 ? this.pageData2.pageNum : this.pageData3.pageNum,
        pageSize:
          Number(status) === 0
            ? this.pageData2.pageSize
            : this.pageData3.pageSize,
        status: Number(status),
        type: this.userType,
      }).then((res) => {
        if (res && res.success) {
          let { data } = res;
          if (status == "0") {
            this.pageData2.total = data.total;
            this.listData2 = data.records;
          } else {
            this.pageData3.total = data.total;
            this.listData3 = data.records;
          }

          this.loading = false; // 隐藏加载动画
          // this.$set(this, "listData2", data.records);
        }
      });
    },
    // 操作某条数据
    goOperation2(url, item) {
      console.log(item.moduleName, "页面的名称");
      sessionStorage.setItem("htmlData", item.moduleName);

      if (!url) return;
      let realUrl = url.includes("contractId") ? url : url + "&contractId=null";
      let newUrl = "";
      if (url.includes("projectInitial") || url.includes("projectStart")) {
        newUrl = realUrl;
      } else {
        newUrl = url;
      }
      this.$router.push({
        path: newUrl,
      });

      // let element = {
      //   url: url.includes('projectInitial') || url.includes('projectStart') ? realUrl : url,
      //   title: item.moduleName,
      // };

      // // 更新tabs页签
      // this.$store.commit("tabs/UPDATE_TABS_LIST", element);
      // // 初验单独处理
      // if(url.includes('projectInitial') || url.includes('projectStart')) {
      //   this.$store.commit("tabs/UPDATE_CURRENT_PAGE", element.realUrl);
      // } else {
      //   this.$store.commit("tabs/UPDATE_CURRENT_PAGE", element.url);
      // }
    },
    // 操作某条数据
    goOperation3(url, item, ids) {
      sessionStorage.setItem("htmlData", item.moduleName);
      if (!url) return;
      // let ids = item.schduleId;
      updateTitle({ id: ids }).then((res) => { });
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
    // 分页
    // 切换每页显示条数
    handleSizeChange2(val) {
      if (this.status == 0 || this.status == "0") {
        this.pageData2.pageNum = 1;
        this.pageData2.pageSize = val;
      } else {
        this.pageData3.pageNum = 1;
        this.pageData3.pageSize = val;
      }

      this.queryList(this.status);
    },
    // 切换页数
    handleCurrentChange2(val) {
      if (this.status == 0 || this.status == "0") {
        this.pageData2.pageNum = val;
      } else {
        this.pageData3.pageNum = val;
      }

      this.queryList(this.status);
    },
  },
};
</script>

<style lang="scss" scoped>
@media (max-height: 850px) {
  .template_content {
    .allBox {
      .systemNum {
        height: 190px !important;
      }

      .conTD {
        height: 186px !important;

        .toDoBox {
          height: 186px !important;

          ::v-deep .el-tabs__content {
            height: 136px !important;
            margin-bottom: 0 !important;
          }
        }
      }

      .projectList {
        height: calc(100% - 0px) !important;
      }
    }
  }
}

// -------------------------
.template_content {
  height: 100%;
  width: 100%;
  font-family: PingFangSC-Regular, PingFang SC;

  // overflow-x: auto;
  .allBox {
    display: flex;
    flex-direction: column;
    height: 100%;

    .systemNum {
      height: 220px;
    }

    .conTD {
      width: 100%;
      display: flex;
      height: 250px;
      margin-bottom: 8px;

      // border-radius: 4px;
      .toDoBox {
        margin-top: 8px;
        width: calc(50% - 15px);
        height: 250px;
        background: none;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        ::v-deep .el-tabs__content {
          height: 200px;
          margin-bottom: 0 !important;
          padding-bottom: 5px !important;
        }
      }
    }

    .projectList {
      height: calc(100% - 430px);
      overflow: auto;
    }
  }

  .floatLeft {
    float: left;
  }

  .height40 {
    height: 40px;
  }

  .height325 {
    height: 325px;
  }

  .infinite-list {
    width: 1020px;
    height: 286px;
    overflow: scroll;
  }

  .infinite-list li {
    height: 56px;
    background: #fff;
    padding-left: 20px;
    padding-top: 11px;
    border-bottom: 1px dashed #000000;

    img {
      position: relative;
      top: 5px;
    }

    .time {
      width: 82px;
      height: 22px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
      line-height: 22px;
      margin-left: 9px;
    }

    .content {
      margin-left: 30px;
    }

    .content2,
    .content3 {
      margin-left: 5px;
    }
  }

  .jiantou {
    height: 40px;
    line-height: 40px;
    margin-left: 10px;
    margin-right: 10px;
    cursor: pointer;
  }
}

.page-box2 {
  display: flex;
  justify-content: flex-end;

  // margin-bottom: 16px;
  .page-box-single {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

//--------------------
::v-deep .item {
  // margin-right: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: rgba(78, 89, 105, 1);
  // border-radius: 30px;
  // color: rgba(66, 130, 255, 1);
  // background: rgba(236, 242, 255, 1);
  // border: 1px solid rgba(66, 130, 255, 1);
}

::v-deep .el-button--small {
  // margin-left: 8px;
  width: 72px;
  height: 26px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  // background: rgba(66, 130, 255, 1);
  // padding: 7px 24px;

  // border-radius: 45px;
}

::v-deep .el-tabs__item {
  font-weight: 700;
}

::v-deep .el-tabs__content .el-tab-pane {
  height: 99%;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
}

.activeA {
  background: #fff !important;
}

.activeB {
  color: #999 !important;
}

.Knowledge2 {
  // display: none;
  width: 100%;
  background: rgb(255, 255, 255);
  height: 100%;
  // flex: 1;
  padding-left: 10px;
  padding-right: 0;
  border-radius: 4px;

  // margin-top: 16px;
  // margin-bottom: 16px;
  // border-radius: 10px;
  ::v-deep .el-tabs__header {
    margin-bottom: 5px !important;
  }

  .ledge-title {
    display: flex;
    justify-content: space-between;

    .ledge-sub-title {
      height: 22px;
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 0px;
      line-height: 22px;
      color: rgba(29, 33, 41, 1);
      text-align: left;
      vertical-align: top;
    }
  }

  .paneBox {
    // height: calc(100% - 45px);
    overflow-y: auto;
    padding-top: 5px;
  }

  .pane-item {
    width: 100%;
    // height: 50px;
    /* background-color: rebeccapurple; */
    background-color: rgb(255, 255, 255);
    padding: 0px 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 0px;
    margin-bottom: 5px;

    /* border-bottom: 1px solid gray; */
    .pane-item-title {
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      margin-right: 5px;
      margin-bottom: 8px;
      background: rgba(255, 141, 26, 1);
    }

    .pane-item-content {
      width: calc(100% - 12px);
    }

    .pane-item-text {
      display: inline-block;
      width: 100%;
      font-weight: 500;
      color: rgba(29, 33, 41, 1);
      font-size: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: pointer;
    }

    .item-sub-text {
      line-height: 12px;
      // margin-left: 12px;
      color: gray;
      cursor: pointer;
    }
  }
}

.loading-overlay {
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
}

.loading-spinner {
  border: 2.5px solid rgba(0, 0, 0, 0.1); /* 背景线条 */
  border-top: 2px dashed #4a97e2; /* 加载动画的颜色 */
  border-radius: 50%; /* 圆形 */
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite; /* 动画 */
}

.loading-text {
  font-size: 12px;
  color: #4a97e2;
  margin-top: 10px; /* 与动画之间的间距 */
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
