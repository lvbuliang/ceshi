<template>
  <div class="quick">
    <div class="contentBox">
      <div
        class="content"
        v-for="(item, index) in list"
        :key="index"
        @click="contentClick(item, index)"
      >
        <div class="contentItem">
          <img
            :src="`${config.baseUrl}/front-res/images/quick/${item.menuUrl}@2x.png`"
            :alt="item.permissionName"
          />
          <div v-if="item.permissionName" class="text ellipsis">
            {{ item.permissionName }}
          </div>
        </div>
      </div>
      <div class="lastChild">
        <img
          @mouseover="mouseOverLastChild('mouseover')"
          @mouseleave="mouseLeaveLastChild('mouseleave')"
          @click.stop="mouseOverLastChild('click')"
          :src="lastChildUrl"
          alt=""
        />
        <div v-if="dialogFlag" class="modal" @click.stop="modalClick"></div>
        <div
          class="lastChildHover"
          v-if="dialogFlag"
          :style="
            'left:' +
            lastChildHoverLeft +
            'px;' +
            'top:' +
            lastChildHoverTop +
            'px'
          "
        >
          <div class="buttons">
            <div
              class="popoverBut"
              v-for="(item, index) in tabImgList"
              :key="index"
            >
              <el-popover
                popper-class="quickPopover"
                placement="top"
                :title="item.text"
                width="52"
                trigger="hover"
              >
                <img
                  class="popoverImg"
                  @mouseover="item.hoverFalg = true"
                  @mouseleave="item.hoverFalg = false"
                  v-debounce="[() => lastChildHoverClick(item), config.deTime]"
                  :src="item.hoverFalg ? item.default : item.hover"
                  slot="reference"
                  alt=""
                />
              </el-popover>
            </div>
          </div>
          <el-tabs class="tabs" v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="全部快捷入口" name="first"> </el-tab-pane>
            <el-tab-pane label="我的收藏" name="second"></el-tab-pane>
          </el-tabs>
          <div v-if="tabContentList && tabContentList.length">
            <div class="tabContentBox tabCollectFlag">
              <div
                class="tabContent"
                v-for="(item, index) in tabContentList"
                :key="index"
                @click="tabContentClick(item)"
              >
                <div class="imgBox">
                  <img
                    v-if="buttonsFlag && item.collectState"
                    class="imgBoxIcon"
                    :src="collectCancelUrl"
                    alt=""
                  />
                  <img
                    v-if="buttonsFlag && !item.collectState"
                    class="imgBoxIcon"
                    :src="collectConfirmUrl"
                    alt=""
                  />
                  <img
                    :src="`${config.baseUrl}/front-res/images/quick/${item.menuUrl}@2x.png`"
                    :alt="item.permissionName"
                  />
                </div>
                <div
                  :title="item.permissionName"
                  v-if="item.permissionName"
                  class="text ellipsis"
                >
                  {{ item.permissionName }}
                </div>
              </div>
            </div>
            <el-pagination
              v-if="paginationIndex"
              class="pagination"
              layout="prev, pager, next"
              :total="this.total"
              :page-size="12"
              @current-change="handleCurrentChange"
            >
            </el-pagination>
          </div>
          <div class="empty" v-else>
            <div class="emptyContent">
              <img src="@/assets/images/empty-icon.png" alt="" />
              <span>暂无内容</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { api_quickData, api_quickEdit } from "@/api/home";
import { api_getUserPermissionByToken } from "@/api/user.js";
import { getStorageToken } from "@/utils/user-vali";
import { mapState } from "vuex";
import config from "@/setting.js";
export default {
  data() {
    return {
      id: "",
      quickImgMap: {},
      quick_delete: require("@/assets/images/home/quick_delete.png"),
      quick_delete_hover: require("@/assets/images/home/quick_delete_hover.png"),
      quick_ellipsis: require("@/assets/images/home/quick_ellipsis.png"),
      quick_ellipsis_hover: require("@/assets/images/home/quick_ellipsis_hover.png"),
      lastChildHoverLeft: 0,
      lastChildHoverTop: 0,
      paginationIndex: false,
      collectCancelUrl: require("@/assets/images/home/collectCancel.png"),
      collectConfirmUrl: require("@/assets/images/home/collectConfirm.png"),
      buttonsRigth: 40,
      buttonsFlag: false,
      total: 0,
      tabsIndex: 0,
      lastChildUrl: "",
      tabContentListPageNaum: 1,
      activeName: "first",
      tabImgList: [
        {
          text: "编辑",
          hover: require("@/assets/images/home/edit.png"),
          default: require("@/assets/images/home/edit_hover.png"),
          hoverFalg: false,
        },
      ],
      collectList: [],
      tabOverallData: [],
      tabContentData: [],
      tabContentList: [],
      list: [],
      dialogFlag: false,
      pageNum: 1,
      config,
    };
  },
  computed: {
    ...mapState({
      speed: (state) => state.menu.speed,
    }),
  },
  mounted() {
    this.lastChildUrl = this.quick_ellipsis;
    this.getTabContentList();
  },
  methods: {
    modalClick() {
      this.dialogFlag = false;
    },
    //切换tab页
    handleClick(tab, event) {
      this.tabsIndex = +tab.index;
      if (this.tabsIndex === 0) {
        //所有快捷入口
        this.paginationIndex = this.tabContentData.length > 12;
        this.total = this.tabContentData.length;
        this.setTabContentList(1);
      } else if (this.tabsIndex === 1) {
        //已收藏快捷入口
        this.paginationIndex = this.collectList.length > 12;
        this.total = this.collectList.length;
        this.setCollectList(1);
      }
      this.pageNum = 1;
      this.setTabImgList(this.buttonsFlag);
    },
    //首页点击
    contentClick(item, index) {
      if (!item.remark) return;
      let element = {
        url: item.remark,
        title: item.permissionName,
      };
      this.$store.commit("tabs/UPDATE_TABS_LIST", element);
      this.$store.commit("tabs/UPDATE_CURRENT_PAGE", element.url);
      this.$router.push({
        path: item.remark,
      });
    },
    //移入触发
    mouseOverLastChild(item) {
      this.setLastChildHoverLeft();
      if (item == "mouseover") {
        this.dialogFlag = true;
        this.lastChildUrl = this.quick_ellipsis_hover;
      } else if (item == "click") {
        if (this.dialogFlag) {
          this.dialogFlag = false;
          this.lastChildUrl = this.quick_ellipsis;
        } else {
          this.lastChildUrl = this.quick_ellipsis_hover;
          this.dialogFlag = true;
        }
      }
    },
    setLastChildHoverLeft() {
      if (this.list.length) {
        this.lastChildHoverLeft = -(9 * 50);
      } else {
        this.lastChildHoverLeft = 0;
      }
      if (this.tabContentData.length > 12) {
        this.lastChildHoverTop = -375;
      } else {
        this.lastChildHoverTop = -345;
      }
    },
    //移出触发
    mouseLeaveLastChild(item) {
      if (!this.dialogFlag) {
        this.lastChildUrl = this.quick_ellipsis;
      }
    },
    // 浮窗点击事件
    tabContentClick(item) {
      if (!this.buttonsFlag) {
        if (!item.remark) return;
        let element = {
          url: item.remark,
          title: item.permissionName,
        };
        this.$store.commit("tabs/UPDATE_TABS_LIST", element);
        this.$store.commit("tabs/UPDATE_CURRENT_PAGE", element.url);
        this.$router.push({
          path: item.remark,
        });
      } else {
        this.$nextTick(() => {
          item.collectState = !item.collectState;
          if (this.tabsIndex == 1) {
            this.setCollectList(this.pageNum);
          } else {
            this.handleCurrentChange(this.pageNum);
          }
        });
      }
    },
    async getTabContentList() {
      let params1 = {
        permissionCode: "M001",
      };
      let params2 = { Authorization: getStorageToken() };
      let list1 = [];
      let list2 = [];
      let list3 = [];
      let list4 = [];
      let res1 = await api_quickData(params1);
      // let res2 = await api_getUserPermissionByToken(params2);
      let res2 = this.speed;
      if (res1.msg.code == "0000") {
        if (res1.data.data) {
          list1 = JSON.parse(res1.data.data);
        } else {
          list1 = [];
        }
        if (res1.data.id) {
          this.id = res1.data.id;
        }
      }
      // if (res2.msg.code == "0000") {
      //   list2 = res2.data.speed;
      // }
      if (!res2.length) {
        return;
      }
      list2 = res2;
      //判断权限是否更改
      list2.forEach((item) => {
        let flag = "";
        if (list1 && list1.length > 0) {
          flag = list1.find((item2) => {
            return item.permissionId == item2.permissionId;
          });
        }
        if (flag) {
          item.collectState = flag.collectState;
          list3.push(item);
        } else {
          item.collectState = false;
          list3.push(item);
        }
      });
      //接口数据
      this.tabOverallData = JSON.parse(JSON.stringify(list3));
      this.tabContentData = [...list3];
      //已收藏数据
      list3.forEach((item) => {
        if (item.collectState == true) {
          list4.push(item);
        }
      });
      //设置首页已收藏数据
      if (list4.length && list4.length > 8) {
        this.list = list4.slice(0, 8);
      } else {
        this.list = list4;
      }
      //区分当前tab页
      if (this.tabsIndex === 0) {
        this.setTabContentList(1);
        this.paginationIndex = this.tabContentData.length > 12;
        this.total = this.tabContentData.length;
      } else if (this.tabsIndex === 1) {
        this.setCollectList(1);
        this.paginationIndex = this.collectList.length > 12;
        this.total = this.collectList.length;
      }
    },
    //分页截取  所有数据
    setTabContentList(val) {
      let list = this.tabContentData.slice((val - 1) * 12, val * 12);
      this.$set(this, "tabContentList", list);
    },
    //分页截取  已收藏数据
    setCollectList(val) {
      let list = [];
      let list1 = [];
      this.tabContentData.forEach((item) => {
        if (item.collectState == true) {
          list1.push(item);
        }
      });
      this.collectList = list1;
      list = this.collectList.slice((val - 1) * 12, val * 12);
      this.$set(this, "tabContentList", list);
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      if (this.tabsIndex === 0) {
        this.setTabContentList(val);
      } else if (this.tabsIndex === 1) {
        this.setCollectList(val);
      }
    },
    lastChildHoverClick(item) {
      if (item.text == "编辑") {
        this.buttonsFlag = true;
      } else if (item.text == "保存") {
        this.buttonsFlag = false;
        let params = {
          permissionCode: "M001",
          data: JSON.stringify(this.tabContentData),
        };
        if (this.id) {
          params.id = this.id;
        }
        api_quickEdit(params).then((res) => {
          if (res.msg.code == "0000") {
            this.dialogFlag = false;
            this.buttonsFlag = false;
            this.getTabContentList();
            // this.$message("保存成功");
          }
        });
      } else if (item.text == "取消") {
        this.buttonsFlag = false;
        this.getTabContentList();
      }
      this.setTabImgList(this.buttonsFlag);
    },
    setTabImgList(falg) {
      let list = [];
      if (falg) {
        list = [
          {
            text: "保存",
            hover: require("@/assets/images/home/save.png"),
            default: require("@/assets/images/home/save_hover.png"),
            hoverFalg: false,
          },
          {
            text: "取消",
            hover: require("@/assets/images/home/close.png"),
            default: require("@/assets/images/home/close_hover.png"),
            hoverFalg: false,
          },
        ];
      } else {
        list = [
          {
            text: "编辑",
            hover: require("@/assets/images/home/edit.png"),
            default: require("@/assets/images/home/edit_hover.png"),
            hoverFalg: false,
          },
        ];
      }
      this.tabImgList = list;
    },
  },
};
</script>

<style lang="scss" scoped>
.quick {
  position: absolute;
  left: -24px;
  right: -24px;
  bottom: 0;
  // width: 100%;
  height: 108px;
  padding-top: 24px;
  .contentBox {
    width: 100%;
    height: 100%;
    padding: 24px 56px;
    box-shadow: 0px -2px 8px 0px rgba(0, 0, 0, 0.05);
    padding-bottom: 0;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .content {
      height: 60px;
      display: inline-block;
      cursor: pointer;
      flex: 1;
      .contentItem {
        width: 84px;
        text-align: center;
      }
      img {
        width: 32px;
        height: 32px;
      }
      .text {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 22px;
        &:hover {
          color: #007aff;
        }
      }
    }
    .content:first-child {
      padding-left: 0;
    }
  }
  .lastChild {
    width: 60px !important;
    height: 60px !important;
    background: #ffffff;
    border-radius: 8px;
    padding: 0 !important;
    margin-left: 14px;
    display: inline-block;
    position: relative;
    cursor: pointer;
    z-index: 20;
    img {
      width: 60px;
      height: 60px;
      z-index: 20;
      position: relative;
    }
    .modal {
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 0;
      position: fixed;
    }
    .lastChildHover {
      width: 504px;
      min-height: 332px;
      max-height: 378px;
      background: #ffffff;
      box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.1);
      border-radius: 4px;
      position: absolute;
      top: -388px;
      left: -444px;
      z-index: 15;
      .empty {
        width: 100%;
        height: 276px;
        display: flex;
        justify-content: center;
        align-items: center;
        .emptyContent {
          margin: 0 auto;
          text-align: center;
          img {
            width: 80px;
            height: 60px;
            margin: auto;
            display: block;
            margin-bottom: 8px;
          }
          span {
            width: 56px;
            font-size: 14px;
            font-weight: 400;
            color: #666666;
          }
        }
      }
      .buttons {
        top: 20px;
        right: 8px;
        z-index: 10;
        position: absolute;
        .popoverImg {
          width: 16px;
          height: 16px;
          margin-right: 16px;
        }
        .popoverBut {
          display: inline-block;
        }
      }
      ::v-deep .tabs {
        .el-tabs__item {
          height: 56px;
          line-height: 56px;
        }
        .el-tabs__nav-wrap {
          padding-left: 24px;
        }
        .el-tabs__header {
          margin: 0;
        }
        .el-tabs__content {
          padding: 0;
        }
      }
      .tabContentBox {
        height: 276px;
        padding: 12px 4px;
        .tabContent {
          width: 124px;
          height: 84px;
          padding: 12px 20px;
          display: inline-block;
          text-align: center;
          position: relative;
          img {
            width: 32px;
            height: 32px;
          }
          .text {
            height: 22px;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
            line-height: 22px;
          }
        }
      }
      .tabCollectFlag {
        .imgBox {
          width: 32px;
          height: 32px;
          margin: auto;
          display: inline-block;
          position: relative;
          .imgBoxIcon {
            width: 13px;
            height: 13px;
            top: -4px;
            right: -4px;
            color: #ffffff;
            border-radius: 100%;
            z-index: 21;
            position: absolute;
          }
        }
      }
      ::v-deep .pagination {
        // padding: 10px 0;
        text-align: center;
        button {
          height: 22px;
          line-height: 22px;
        }
        .el-pager li {
          height: 22px;
          line-height: 22px;
        }
      }
    }
  }
  .ellipsis {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
}
</style>
<style lang="scss">
.quickPopover {
  padding: 8px 12px;
  height: 44px;
  .el-popover__title {
    width: 28px;
    height: 22px;
    line-height: 22px;
    font-size: 14px;
  }
}
</style>
