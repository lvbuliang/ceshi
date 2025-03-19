<template>
  <div v-if="showWorkFlow" class="workflow">
    <div v-if="buttonList[0].showForm" class="workflow_formAdd">
      <div class="workflow_formAdd_left">
        <SrAdd
          v-if="buttonList[0].showForm"
          :config="form.config"
          :otherConfig="{ labelNum: 144 }"
          :form="form.data"
          ref="add"
        ></SrAdd>
      </div>
      <el-popover
        placement="top"
        trigger="hover"
        width="320"
        v-model="visible"
        popper-class="workflow_popover"
        :offset="24"
      >
        <el-collapse v-model="activeName" accordion>
          <el-collapse-item
            v-for="(item, index) in markData"
            :key="index"
            :name="index"
          >
            <template slot="title">
              <div class="el-collapse-item-list-box">
                <span class="markContentTime">{{ item.operatorTime }}</span>
                <span class="markContentName">
                  <span>{{ item.operator }}</span>
                </span>
                <span
                  :class="
                    item.color == 'FAIL'
                      ? 'markContentOpinion agree'
                      : 'markContentOpinion'
                  "
                  >{{ item.approvalResult }}</span
                >
              </div>
            </template>
          </el-collapse-item>
        </el-collapse>
        <div slot="reference" v-if="!hideTrackIcon" class="markBtton">
          <sr-trace-track :imgUrl="this.imgUrl" :trackData="trackData">
            <div class="markBttonIcon_box">
              <img

                width="40%"
                height="auto"
                class="markBttonIcon"
                alt
              />
            </div>
          </sr-trace-track>
        </div>
      </el-popover>
    </div>
    <div class="workflow_buttons">
      <div
        class="workflow_button"
        :key="index"

        v-for="(item, index) in filteredButtons"
      >
        <el-popover
          class="SrQiankunWorkFlowPopover"
          ref="popover5"
          placement="top"
          width="304"
          v-model="lastChildIndex"
          :append-to-body="false"
          v-if="item.btnEventType == 'fp'"
        >
          <el-input
            class="search"
            placeholder="请输入内容"
            suffix-icon="el-icon-search"
            v-model="searchIndex"
            @change="searchChange"
          ></el-input>
          <div class="contentBox">
            <div
              class="item"
              @click="setActiveItem(item)"
              v-for="item in itemList"
              :key="item.jfid"
            >
              {{ item.fullname }}
            </div>
          </div>
          <div
            class="maskLayerBox"
            @click="maskLayerClose"
            v-if="activeItemIndex"
          >
            <div class="content" @click.stop="maskLayerContent">
              <div class="top">
                <i class="base-iconfont icon-prompt-fill"></i>
                <span>
                  分配：
                  <span class="text">{{ activeItem.fullname }}</span>
                </span>
              </div>
              <div class="down">
                <div>姓名：{{ activeItem.fullname }}</div>
                <div>角色：{{ activeItem.roleName }}</div>
                <div>部门：{{ activeItem.buName }}</div>
              </div>
              <div class="buts">
                <el-button
                  @click.stop="fpSumbit()"
                  size="small"
                  round
                  type="primary"
                  >确定</el-button
                >
                <el-button @click.stop="maskLayerClose()" size="small" round
                  >取消</el-button
                >
              </div>
            </div>
          </div>
        </el-popover>
        <el-button
          v-if="item.btnEventType == 'fp'"
          v-popover:popover5
          @click.native="goback(item)"
          :type="item.btnType"
          >{{ item.btnName }}</el-button
        >
        <el-button v-else @click.native="goback(item)" :type="item.btnType">
          {{ item.btnName }}
        </el-button>
      </div>
      <div @click="gobackList(buttonList[0].backName)" class="gobackList">
        <el-button plain size="medium" round>返回列表</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { setState } from "@/utils/app-store";

import store from "@/store";
export default {
  name: "SrQiankunWorkFlow",
  inject: ["srtracetrackRequest", "workflowRequest"],
  props: {
    buttonList: Array,
    hideFrom: Boolean,
    clickMethods: Object,
    taskId: String || Number,
    backName: String,
    params: Object,
    hideTrackIcon: Boolean,
    //返回是否携带路由参数
    routerQuery: {
      type: Boolean,
      default() {
        return true;
      },
    },
  },
  watch: {
    "$route.path": {
      handler(newVal) {
        console.log(newVal);
      },
    },
  },
  computed: {
    filteredButtons() {
      const disallowedRoles = ["XMGLB", "DSZ", "BM_FZR", "ZJL"];
      return this.buttonList[0].btns.filter((button) => {
        console.log(
          JSON.stringify(this.userInfo.currentRole),
          "JSON.parse(this.userInfo.currentRole.roleCode))"
        );
        console.log(button.btnValue,'button.btnValue')
        // 如果当前用户角色在不允许的列表中，且按钮是保存按钮，则不显示
        if (
          disallowedRoles.includes(this.userInfo.currentRole.roleCode) &&
          button.btnValue === "btg"
        ) {
          return false;
        }
        return true;
      });
    },
    busiId() {
      return this.$route.query.id;
    },
    busiType() {
      return this.$route.meta.busiType;
    },
    projectId() {
      return this.$route.query.projectId;
    },
    processId() {
      return this.$route.query.processId;
    },
    userInfo() {
      return sessionStorage.getItem("userInfo");
    },
  },
  data() {
    return {

      userInfo: store.getters.userInfo,
      searchIndex: "",
      activeName: 1,
      activeItem: {},
      activeItemIndex: false,
      beAssignerList: [],
      itemList: [],
      lastChildIndex: false,
      trackData: [],
      markData: [],
      visible: false,
      showWorkFlow: true,
      imgUrl: "",
      fpForm: {
        config: [
          {
            type: "select",
            name: "分配人",
            bind: "beAssigner",
            placeholder: "请选择分配人",
            trigger: "change",
            dataList: "beAssignerList",
            required: "请选择分配人",
            col: 24,
          },
        ],
        data: {
          beAssigner: "",
        },
        enums: {
          beAssignerList: [],
        },
      },
      lastChildItem: {},
      form: {
        config: [
          {
            type: "input",
            name: "审批意见",
            placeholder: "请输入审批意见",
            bind: "auditOpinion",
            append: true,
            maxLength: 10,
            col: 8,
          },
          {
            type: "upload",
            name: "附件",
            bind: "accessoryList",
            fileList: [],
            limit: 10,
            tipPopover: true, // hover显示提示  默认外面显示
            col: 24,
          },
        ],
        data: {
          auditUserName: "",
          auditOpinion: "",
          auditTime: "",
          accessoryList: [],
        },
      },
    };
  },
  mounted() {},
  created() {
    this.form.data.auditUserName = JSON.parse(
      sessionStorage.getItem("userInfo")
    ).fullname;
    this.form.data.auditTime = this.getNowTime();
    if (this.buttonList[0].showForm) {
      this.getTraceTrackImage();
      this.getTraceTrack();
      this.getHoverTraceTrack();
    }
    this.getBeAssignerList();
  },
  beforeDestroy() {
    this.showWorkFlow = false;
  },
  destroyed() {
    this.$destroy();
    this.showWorkFlow = false;
  },
  methods: {
    //阻止冒泡
    maskLayerContent() {},
    //分配二次确定取消
    maskLayerClose() {
      this.activeItemIndex = false;
      this.activeItem = {};
    },
    //选中分配人
    setActiveItem(item) {
      if (item) {
        this.activeItemIndex = true;
        this.activeItem = item;
        console.log(this.activeItem);
      }
    },
    //搜索筛选
    searchChange(val) {
      let list = this.beAssignerList.filter((item) => {
        return item.fullname.includes(val);
      });
      this.$set(this, "itemList", list);
    },
    getBeAssignerList() {
      if (
        this.workflowRequest &&
        this.workflowRequest.queryUsersByBuUniqueCode
      ) {
        if (!this.userInfo) {
          return;
        }
        let userInfo = JSON.parse(this.userInfo);
        this.workflowRequest.queryUsersByBuUniqueCode(
          {
            buUniqueCode: userInfo.currentBizunit.buUniqueCode,
          },
          (res) => {
            if (res) {
              this.itemList = [...res.data];
              this.beAssignerList = [...res.data];
            }
          }
        );
      }
    },
    routeClose(timeout) {
      var routepath = window.location.pathname.replace(/\//g, "");
      this.$SrUtils.routeClose.call(this, routepath, this.$setState, timeout);
    },
    gobackList() {
      this.routeClose();
      if (this.routerQuery) {
        this.$router.push({ name: this.backName, query: { ...this.params } });
      } else {
        this.$router.push({ name: this.backName });
      }
    },
    getNowTime() {
      var date = new Date();
      var seperator1 = "-";

      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var hour = date.getHours();
      var minutes = date.getMinutes();
      var seconds = date.getSeconds();
      var strDate = date.getDate();

      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate =
        year +
        seperator1 +
        month +
        seperator1 +
        strDate +
        " " +
        hour +
        ":" +
        minutes +
        ":" +
        seconds;

      return currentdate;
    },
    //分配取消
    fpClose() {
      this.lastChildIndex = false;
    },
    getParam() {
      let item = this.lastChildItem;
      let param = {
        vars: item.btnValue,
        processInstanceId: this.processId,
        taskId: this.taskId,
        status: item.examineState,
        btnName: item.btnName,
      };
      if (item.nextBuCode) {
        param.nextBuCode = item.nextBuCode;
      }
      if (item.agencyId) {
        param.agencyId = item.agencyId;
      }
      if (item.agencyNextrole) {
        param.agencyNextrole = item.agencyNextrole;
      }
      if (item.nextBuCode) {
        param.nextBuCode = item.nextBuCode;
      }
      //消息模板id
      if (item.messageId) {
        param.messageId = item.messageId;
      }
      //代理人
      if (this.buttonList[0].assignee) {
        param.assignee = this.buttonList[0].assignee;
      }
      return param;
    },
    //分配确定
    fpSumbit() {
      let item = this.lastChildItem;
      let param = {};
      if (this.buttonList[0].showForm) {
        this.form.data.accessory = this.form.data.accessoryList.map((item) => {
          return item.id;
        });
        param = { ...this.form.data };
      }
      let obj = this.getParam();
      param = { ...param, ...obj };
      param.beAssigner = this.activeItem.jfid;
      param.buId = this.activeItem.buid;
      if (this.activeItem.jfid) {
        if (
          this.workflowRequest &&
          this.workflowRequest.setApiAfferentUrlOfPost
        ) {
          this.workflowRequest.setApiAfferentUrlOfPost(
            item.btnUrl,
            param,
            (res) => {
              if (res) {
                this.routeClose();
                if (this.routerQuery) {
                  this.$router.push({
                    name: this.backName,
                    query: { ...this.params },
                  });
                } else {
                  this.$router.push({ name: this.backName });
                }
              }
            }
          );
        }
      }
    },
    goback(item) {
      this.lastChildItem = item;
      console.log(this.getParam());
      if (this.clickMethods && this.clickMethods[item.btnEventType]) {
        this.clickMethods[item.btnEventType]();
      } else {
        if (item.btnEventType == "fp") {
          return;
        }
        let param = {};
        if (this.buttonList[0].showForm) {
          this.form.data.accessory = this.form.data.accessoryList.map(
            (item) => {
              return item.id;
            }
          );
          param = { ...this.form.data };
        }
        let obj = this.getParam();
        param = { ...param, ...obj };
        if (
          this.workflowRequest &&
          this.workflowRequest.setApiAfferentUrlOfPost
        ) {
          this.workflowRequest.setApiAfferentUrlOfPost(
            item.btnUrl,
            param,
            (res) => {
              if (res) {
                this.routeClose();
                if (this.routerQuery) {
                  this.$router.push({
                    name: this.backName,
                    query: { ...this.params },
                  });
                } else {
                  this.$router.push({ name: this.backName });
                }
              }
            }
          );
        }
      }
    },
    //留痕轨迹
    getTraceTrack() {
      if (
        this.srtracetrackRequest &&
        this.srtracetrackRequest.getTraceTrackList
      ) {
        this.srtracetrackRequest.getTraceTrackList(
          { busiId: this.busiId, busiType: this.busiType },
          (res) => {
            debugger;
            this.trackData = res.data;
          }
        );
      }
    },
    //留痕轨迹图片
    getTraceTrackImage() {
      if (
        this.srtracetrackRequest &&
        this.srtracetrackRequest.getTraceTrackImage
      ) {
        this.srtracetrackRequest.getTraceTrackImage(
          { processId: this.processId },
          (res) => {
            this.imgUrl = res.data;
          }
        );
      }
    },
    //触摸留痕轨迹
    getHoverTraceTrack() {
      if (
        this.srtracetrackRequest &&
        this.srtracetrackRequest.hoverTraceTrackList
      ) {
        this.srtracetrackRequest.hoverTraceTrackList(
          {
            busiId: this.busiId,
            busiType: this.busiType,
            // projectId: this.projectId,
          },
          (res) => {
            this.markData = res.data;
            this.markData = res.data.map((item) => {
              if (item.operatorTime) {
                let str = item.operatorTime
                  .split("-")
                  .splice(1, 2)
                  .join("-");
                item.operatorTime = str;
              }
              return item;
            });
            if (this.markData.length) {
              this.visible = true;
            } else {
              this.visible = false;
            }
          }
        );
      }
    },
  },
};
</script>
<style lang="scss">
.workflow {
  position: fixed;
  bottom: 0;
  width: calc(100% - 81px);
  background: #fff;
  z-index: 10;
  right: 0;
  .SrQiankunWorkFlowPopover {
    .el-popover {
      width: 304px;
      height: 392px;
      background-color: #ffffff;
      box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.1);
      border-radius: 4px;
      z-index: 15;
      padding: 16px;
      border: none;
      border-radius: 8px;
      position: relative;
      .popper__arrow {
        display: none;
      }
    }
    .search {
      margin-bottom: 8px;
    }
    .maskLayerBox {
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 16;
      background: rgba($color: #000000, $alpha: 0.2);
      border-radius: 8px;
      position: absolute;
      .content {
        width: 304px;
        height: 200px;
        background: #ffffff;
        border-radius: 8px;
        left: 0;
        bottom: 0;
        padding: 16px 18px;
        position: absolute;
        .top {
          width: 100%;
          height: 22px;
          line-height: 22px;
          font-size: 14px;
          .text {
            color: #1890ff;
          }
          i {
            font-size: 16px;
            color: #ffaa22;
            vertical-align: middle;
            // margin-right: 4px;
          }
        }
        .down {
          padding: 16px 0;
          div {
            width: 100%;
            height: 22px;
            line-height: 22px;
            margin-bottom: 8px;
            padding-left: 18px;
            cursor: pointer;
            &:last-child {
              margin-bottom: 0;
            }
          }
        }
        .buts {
          height: 32px;
          text-align: center;
        }
      }
    }
    .contentBox {
      width: 100%;
      height: 320px;
      overflow-x: hidden;
      overflow-y: auto;
      .item {
        height: 32px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 32px;
        text-indent: 8px;
        &:hover {
          background: #f7f7f7;
          border-radius: 8px;
        }
      }
    }
  }
  .lastChild {
    width: 300px;
    height: 200px;
    background-color: #ffffff;
    box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    z-index: 15;
    .fpForm {
      height: 140px;
    }
    .buts {
      width: 100%;
      height: 50px;
      text-align: center;
    }
  }
  .el-input-group {
    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: 100%;
      border-radius: 8px !important;
    }
    .el-input__inner {
      border-radius: 8px !important;
    }
  }

  .workflow_formAdd {
    display: flex;
    box-shadow: 0px -10px 20px 0px rgba(0, 0, 0, 0.1);

  }
  .markBtton {
    width: 64px;
    border-left: 1px solid #e3e3e3;
    position: relative;
    cursor: pointer;
    height: 100%;
    &:hover {
      background: #e6f7ff;
      .markHover {
        display: block;
      }
    }
    .markBttonIcon_box {
      position: relative;
      display: flex;
      justify-content: center;
    }

    .markHover {
      position: absolute;
      width: 422px;
      height: 138px;
      display: none;
      background: #ffffff;
      box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.1);
      border: 1px solid #efefef;
      top: -108px;
      left: -402px;
      box-sizing: border-box;
      padding: 8px;
      .markContentOpinion {
        color: #1890ff;
      }
      .agree {
        color: #f5222d;
      }
      .markHoverTitle {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        line-height: 22px;
        margin-bottom: 8px;
      }
      .markContentBox {
        height: 90px;
        overflow-y: auto;
      }
      .markContentName {
        margin: 0 23px;
      }
      .markContent {
        margin: 4px 0;
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #666666;
        margin-top: 8px;
        line-height: 22px;
      }
    }
  }

  .workflow_buttons {
    height: 64px;
    text-align: center;
    padding-top: 16px;
    border-top: 1px solid #e6e6e6;
    position: relative;
    .gobackList {
      display: inline-block;
      margin-left: 20px;
    }
    .workflow_button {
      box-sizing: border-box;
      display: inline-block;
      margin: 0 4px;
      button {
        padding: 0px 24px;
        line-height: 32px;
        border-radius: 16px;
      }
    }
  }
  .sr-add {
    .el-form-item__label {
      padding-right: 0;
    }
    .el-input-group__append {
      display: none;
    }
    .el-form-item__content {
      width: calc(100% - 168px);
    }
  }
}
.workflow_popover {
  font-size: 14px;
  margin: 0 !important;
  right: 24px !important;
  max-height: 560px;
  left: unset !important;
  .popper__arrow {
    display: none !important;
  }
  .el-collapse {
    border: none;
    .el-collapse-item__header {
      height: 30px;
      line-height: 15px;
      border: none;
      .el-collapse-item-list-box {
        display: flex;
        width: 90%;
        justify-content: space-between;
        font-size: 14px;
        .markContentName {
          flex-grow: 1;
          margin-left: 24px;
          span {
            display: inline-block;
            width: 80px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .markContentOpinion {
          flex-grow: 1;
          margin-left: 24px;
          color: #1890ff;
        }

        .agree {
          color: #f5222d;
        }
      }
      .el-collapse-item__arrow {
        display: none;
      }
    }
    .el-collapse-item__wrap {
      display: none;
    }
  }
}
</style>
