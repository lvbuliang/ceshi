<template>
  <div v-if="showWorkFlow" class="workflow">
    <div v-if="buttonList[0].showForm" class="workflow_formAdd">
      <div class="workflow_formAdd_left">
        <SrAdd
          v-if="buttonList[0].showForm"
          :config="form.config"
          :otherConfig="{ labelNum: 144 }"
          :form="form.data"
          :enums="form.enums"
          ref="add"
          class="add"
        >
          <div slot="inputBox">
            <el-popover
              placement="top"
              @hide="popover"
              :visible-arrow="false"
              popper-class="inputBoxPopper"
              :width="inputWidth"
              trigger="click"
            >
              <el-input
                type="textarea"
                :rows="5"
                placeholder="请输入审批意见"
                autosize
                clearable
                show-word-limit
                maxlength="2000"
                :resize="'none'"
                v-model="form.data.auditOpinion"
              >
              </el-input>
              <el-input
                class="inputBox"
                v-model="form.data.auditOpinion"
                slot="reference"
                placeholder="请输入审批意见"
                maxlength="2000"
                @focus="inputclick"
              >
              </el-input>
            </el-popover></div
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
                <sr-popover :content="item.operator">
                  <span class="markContentName"
                    ><span>{{ item.operator }}</span></span
                  >
                </sr-popover>

                <span
                  class="markContentOpinion"
                  :class="
                    item.color == 'FAIL'
                      ? 'fail'
                      : item.color == 'SUCCESS'
                      ? 'success'
                      : 'normal'
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
                src="../../../assets/xuanting.png"
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
      <div class="automaticSave" v-if="typeof loading === 'boolean'">
        <div v-if="loading">
          <i
            class="el-icon-circle-check"
            style="margin-left: 4px; margin-right: 4px; color: #000000"
          ></i>
          {{ getToTime }}自动保存成功
        </div>
        <div v-else><i class="el-icon-loading"></i>自动保存中</div>
      </div>
      <div
        class="workflow_button btn"
        :key="index"
        v-for="(item, index) in buttonList[0].btns"
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
                  <span class="text">
                    {{ activeItem.fullname }}
                  </span>
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
        <!-- 发起会签 -->
        <el-popover
          class="SrQiankunWorkFlowPopover"
          ref="popover6"
          placement="top"
          width="304"
          v-model="lastChildIndex"
          :append-to-body="false"
          v-if="item.btnEventType == 'hq'"
        >
          <el-input
            class="search"
            placeholder="请输入内容"
            suffix-icon="el-icon-search"
            v-model="searchIndex"
            @change="searchChange"
          ></el-input>
          <div class="contentBox contentBox1">
            <div class="item" v-for="item in itemList" :key="item.jfid">
              <el-checkbox
                v-model="item.selected"
                @change="handleItemSelectChange(item)"
              ></el-checkbox>
              <span> {{ item.fullname }} </span>
            </div>
          </div>
          <div class="btn-wrap">
            <el-button
              @click.stop="hqSumbit()"
              size="small"
              round
              type="primary"
              >确定</el-button
            >
            <el-button @click.stop="hqClose()" size="small" round
              >取消</el-button
            >
          </div>
        </el-popover>
        <el-button
          v-if="item.btnEventType == 'fp'"
          v-popover:popover5
          @click.native="goback(item)"
          :type="item.btnType"
          >{{ item.btnName }}</el-button
        >

        <el-button
          v-else-if="item.btnEventType == 'hq'"
          v-popover:popover6
          @click.native="goback(item)"
          :type="item.btnType"
          >{{ item.btnName }}</el-button
        >
        <el-button
          :disabled="item.disabled"
          v-else
          @click.native="goback(item)"
          :type="item.btnType"
          >{{ item.btnName }}</el-button
        >
      </div>
      <div
        @click="gobackList(buttonList[0].backName)"
        v-if="backFlag"
        class="gobackList"
      >
        <el-button plain size="medium" round>返回列表</el-button>
      </div>
    </div>
  </div>
</template>
  
  <script>
export default {
  name: "SrQiankunWorkFlow",
  inject: ["srtracetrackRequest", "workflowRequest"],
  props: {
    buttonList: Array,
    hideFrom: Boolean,
    clickMethods: Object,
    taskId: String || Number,
    backName: String,
    hideTrackIcon: Boolean,
    backFlag: {
      type: Boolean,
      default() {
        return true;
      },
    },
    //返回是否携带路由参数
    routerQuery: {
      type: Boolean,
      default() {
        return true;
      },
    },
    //工单设置处理参数
    WorkOrderDisposeFlag: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  watch: {
    "$route.path": {
      handler(newVal) {},
    },
    workFlowLoading: {
      handler(val) {
        this.loading = val;
      },
    },
    workFlowConfig: {
      handler(val) {
        if (val && Object.keys(val).length) {
          // this.setFromConfig(val);
        }
      },
      deep: true,
    },
    buttonList: {
      handler(val) {
        console.log(val);
        if (val.length) {
          if (val[0].showForm) {
            // this.getFormConfig();
          }
        }
      },
      deep: true,
    },
  },
  computed: {
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
    getToTime() {
      let myDate = new Date();
      let str = myDate.toTimeString();
      let timeStr = str.substring(0, 8);
      return timeStr;
    },
  },
  data() {
    return {
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
            type: "slot",
            slotName: "inputBox",
            name: "审批意见",
            placeholder: "请输入审批意见",
            bind: "auditOpinion",
            append: true,
            maxLength: 2000,
            col: 8,
          },
          {
            type: "upload",
            name: "附件",
            bind: "accessoryList",
            fileList: [],
            fileSize: 500,
            limit: 10,
            tipPopover: true, // hover显示提示  默认外面显示
            col: 16,
            fileType: "pdf,doc,docx",
            fileTip: "仅支持word/pdf格式文件上传",
          },
        ],
        enums: {},
        data: {
          auditUserName: "",
          auditOpinion: "",
          auditTime: "",
          accessoryList: [],
        },
      },
      inputWidth: 0,
      selectDataList: [],
      isHq: false,
    };
  },
  mounted() {
    if (this.WorkOrderDisposeFlag) {
      this.$set(this.form.config[0], "name", "处理意见");
      this.$set(this.form.config[0], "placeholder", "请输入审批意见");
    }
  },
  created() {
    this.form.data.auditUserName = JSON.parse(
      sessionStorage.getItem("userInfo")
    ).fullname;
    this.form.data.auditTime = this.getNowTime();
    console.log("buttonList", this.buttonList);
    if (this.buttonList[0].showForm) {
      this.getTraceTrackImage();
      this.getTraceTrack();
      this.getHoverTraceTrack();
      console.log(
        "是否有分配按钮",
        this.buttonList[0].btns.some((item2) => {
          return item2.btnEventType == "tjps" || item2.btnEventType == "bh";
        })
      );
      console.log(
        "是否有会签按钮",
        this.buttonList[0].btns.some((item) => {
          return item.btnEventType == "hq";
        })
      );
      if (
        this.buttonList[0].btns.some((item) => {
          return item.btnEventType == "hq";
        })
      ) {
        // 受理节点的发起会签、步骤2
        this.getBeCountersignAssignerList();
      } else if (
        this.buttonList[0].btns.some((item2) => {
          return item2.btnEventType == "tjps" || item2.btnEventType == "bh";
        })
      ) {
        // 会签节点的转办、步骤3
        this.getBeTransferAssignerList();
      } else {
        // 分配节点的分配按钮、步骤1
        this.getBeDistributionAssignerList();
      }
    }
  },
  beforeDestroy() {
    this.showWorkFlow = false;
  },
  destroyed() {
    this.$destroy();
    this.showWorkFlow = false;
  },
  methods: {
    handleItemSelectChange(item) {
      console.log("item", item);
      if (item.selected) {
        console.log("item选中");
        this.selectDataList.push(item);
      } else {
        const index = this.selectDataList.indexOf(item);
        if (index > -1) {
          this.selectDataList.splice(index, 1);
        }
      }
      console.log(this.selectDataList);
    },
    inputclick(el) {
      this.$nextTick(() => {
        this.inputWidth = +el.target.offsetWidth;
      });
    },
    // popover(item) {
    //   // this.form.data.auditOpinion = this.textarea;
    // },
    //阻止冒泡
    maskLayerContent() {},
    // 会签取消
    hqClose() {
      this.lastChildIndex = false;
      this.selectDataList = this.selectDataList.map((item) => {
        if (item.selected) {
          item.selected = false;
        }
        return item;
      });
      this.selectDataList = [];
    },
    //分配二次确定取消
    maskLayerClose() {
      this.activeItemIndex = false;
      this.activeItem = {};
    },
    //选中分配人
    setActiveItem(item) {
      console.log("item", item);
      if (item) {
        this.activeItemIndex = true;
        this.activeItem = item;
      }
    },
    //搜索筛选
    searchChange(val) {
      let list = this.beAssignerList.filter((item) => {
        return item.fullname.includes(val);
      });
      this.$set(this, "itemList", list);
    },
    // 会签
    getBeCountersignAssignerList() {
      if (this.workflowRequest.getUserBaseInfoByBuidAndRoleCodes) {
        if (!this.userInfo) {
          return;
        }
        this.workflowRequest.getUserBaseInfoByBuidAndRoleCodes(
          {
            keyword: "",
            page: 1,
            roleCodes: ["TCDW_FZR ", "FZGHC_FZR"],
            size: 100,
          },
          (res) => {
            if (res) {
              console.log("res", res);
              this.itemList = [...res.data.records];
              console.log("itemList", this.itemList);
              this.beAssignerList = [...res.data.records];
              console.log("beAssignerList", this.beAssignerList);
            }
          }
        );
      }
    },
    // 会签节点转办
    getBeTransferAssignerList() {
      if (this.workflowRequest.getUserBaseInfoByBuidAndRoleCodes) {
        if (!this.userInfo) {
          return;
        }
        let userInfo = JSON.parse(this.userInfo);
        console.log("userInfo", userInfo);
        this.workflowRequest.getUserBaseInfoByBuidAndRoleCodes(
          {
            buid: userInfo.currentBizunit.buid,
            keyword: "",
            page: 1,
            roleCodes: ["GHFZC_JBR", "TCDW_CSWC"],
            size: 100,
          },
          (res) => {
            if (res) {
              console.log("res", res);
              this.itemList = [...res.data.records];
              console.log("itemList", this.itemList);
              this.beAssignerList = [...res.data.records];
              console.log("beAssignerList", this.beAssignerList);
            }
          }
        );
      }
    },
    // 分配节点
    getBeDistributionAssignerList() {
      if (this.workflowRequest.queryUsersByBuUniqueCode) {
        if (!this.userInfo) {
          return;
        }
        let userInfo = JSON.parse(this.userInfo);
        console.log("userInfo", userInfo);
        this.workflowRequest.queryUsersByBuUniqueCode(
          {
            buUniqueCode: userInfo.currentBizunit.buUniqueCode,
          },
          (res) => {
            if (res) {
              console.log("res", res);
              //   屏蔽负责人身份
              this.itemList = [...res.data];
              const index = this.itemList.findIndex(
                (item) => item.roleCode === "FZGHC_FZR"
              );
              if (index > -1) {
                this.itemList.splice(index, 1);
              }
              this.beAssignerList = [...res.data];
              const index2 = this.beAssignerList.findIndex(
                (item) => item.roleCode === "FZGHC_FZR"
              );
              if (index2 > -1) {
                this.beAssignerList.splice(index2, 1);
              }
              console.log("itemList", this.itemList);

              console.log("beAssignerList", this.beAssignerList);
            }
          }
        );
      }
    },
    gobackList() {
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
    // 会签确定
    hqSumbit() {
      let item = this.lastChildItem;
      let param = {};
      if (this.buttonList[0].showForm) {
        this.form.data.accessory = this.form.data.accessoryList.map((item) => {
          return item.id;
        });
        console.log(this.form.data.accessory);
        param = { ...this.form.data };
        console.log("param", param);
      }
      let obj = this.getParam();
      console.log("obj", obj);
      param = { ...param, ...obj };
      param.userBaseInfoDtoList = this.selectDataList;
      console.log("selectDataList", this.selectDataList);
      if (this.selectDataList.length) {
        this.workflowRequest.setApiAfferentUrlOfPost(
          item.btnUrl,
          param,
          (res) => {
            if (res) {
              this.$router.push({ name: this.backName });
            }
          }
        );
      }
    },
    //分配确定
    fpSumbit() {
      let item = this.lastChildItem;
      console.log("item", item);
      let param = {};
      if (this.buttonList[0].showForm) {
        this.form.data.accessory = this.form.data.accessoryList.map((item) => {
          return item.id;
        });
        console.log(this.form.data.accessory);
        param = { ...this.form.data };
        console.log("param", param);
      }
      let obj = this.getParam();
      param = { ...param, ...obj };
      console.log("activeItem", this.activeItem);
      param.beAssigner = this.activeItem.jfid;
      param.buId = this.activeItem.buid;
      param.beAssignerName = this.activeItem.fullname;

      if (this.activeItem.jfid) {
        // 如果是转办移除buid和jfid,
        this.buttonList[0].btns.map((item2) => {
          if (item2.btnEventType == "tjps" || item2.btnEventType == "bh") {
            delete param.beAssigner;
            delete param.buId;
            delete param.beAssignerName;
            param.userBaseInfoDtoList = [];
            param.userBaseInfoDtoList[0] = this.activeItem;
          }
        });
        console.log("param", param);
        this.workflowRequest.setApiAfferentUrlOfPost(
          item.btnUrl,
          param,
          (res) => {
            if (res) {
              this.$router.push({ name: this.backName });
            }
          }
        );
      }
    },
    goback(item) {
      this.lastChildItem = item;
      if (this.clickMethods && this.clickMethods[item.btnEventType]) {
        this.clickMethods[item.btnEventType]();
      } else {
        if (item.btnEventType == "fp") {
          return;
        }
        if (item.btnEventType == "hq") {
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
        this.workflowRequest.setApiAfferentUrlOfPost(
          item.btnUrl,
          param,
          (res) => {
            if (res) {
              this.$router.push({ name: this.backName });
            }
          }
        );
      }
    },
    //留痕轨迹
    getTraceTrack() {
      this.srtracetrackRequest.getTraceTrackList(
        { busiId: this.busiId, busiType: this.busiType },
        (res) => {
          this.trackData = res.data;
        }
      );
    },
    //留痕轨迹图片
    getTraceTrackImage() {
      this.srtracetrackRequest.getTraceTrackImage(
        { processId: this.processId },
        (res) => {
          this.imgUrl = res.data;
        }
      );
    },
    //触摸留痕轨迹
    getHoverTraceTrack() {
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
              let str = item.operatorTime.split("-").splice(1, 2).join("-");
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
    },
  },
};
</script>
<style lang="scss" scoped>
.contentBox1 {
  height: 285px !important;
}
.btn-wrap {
  display: flex;
  justify-content: center;
}
.gobackList {
  margin-left: 8px !important;
}
</style>
  