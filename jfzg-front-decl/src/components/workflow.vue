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
      <div class="markBtton">
        <sr-trace-track :imgUrl="imgUrl" :trackData="trackData">
          <div class="markBttonIcon_box">
            <!-- <img
              src="./xuanting.png"
              width="40%"
              height="auto"
              class="markBttonIcon"
              alt=""
            />-->
            <!-- <i class="iconfont icon-link markBttonIcon" style=""></i> -->
          </div>
        </sr-trace-track>
        <div class="markHover">
          <div class="markHoverTitle">下一环节 张三丰等 审批</div>
          <div class="markContentBox">
            <div
              class="markContent"
              v-for="(item, index) in markData"
              :key="index"
            >
              <span class="markContentTime">{{ item.operatorTime }}</span>
              <span class="markContentName">{{ item.operator }}</span>
              <span
                :class="
                  item.color == 'FAIL'
                    ? 'markContentOpinion agree'
                    : 'markContentOpinion'
                "
                >{{ item.approvalResult }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="workflow_buttons">
      <div
        class="workflow_button"
        :key="index"
        v-for="(item, index) in buttonList[0].btns"
      >
        <el-popover
          class="lastChild"
          ref="popover5"
          placement="top"
          width="300"
          v-model="lastChildIndex"
          :append-to-body="false"
          v-if="item.btnEventType == 'fp'"
        >
          <div>
            <SrAdd
              :config="fpForm.config"
              :otherConfig="{ labelNum: 100 }"
              :form="fpForm.data"
              :enums="fpForm.enums"
              class="fpForm"
              ref="addfpForm"
            ></SrAdd>
            <div class="buts">
              <el-button @click="fpSumbit()" type="primary">确定</el-button>
              <el-button @click="fpClose()" type="danger">取消</el-button>
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
        <el-button v-else @click.native="goback(item)" :type="item.btnType">{{
          item.btnName
        }}</el-button>
      </div>
      <div @click="gobackList(buttonList[0].backName)" class="gobackList">
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
  },
  watch: {
    "$route.path": {
      handler(newVal) {
        console.log(newVal);
      },
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
  },
  data() {
    return {
      lastChildIndex: false,
      trackData: [],
      markData: [],
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
            name: "审批人",
            bind: "auditUserName",
            placeholder: "请输入审批人",
            append: true,
            maxLength: 10,
            col: 8,
          },

          {
            type: "dateSelect",
            name: "审批时间",
            bind: "auditTime",
            trigger: "change",
            col: 8,
            format: "yyyy-MM-dd",
          },
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
    ).username;
    this.form.data.auditTime = this.getNowTime();
    if (this.buttonList[0].showForm) {
      this.getTraceTrackImage();
      this.getTraceTrack();
      this.getHoverTraceTrack();
      // this.getBeAssignerList()
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
    //this.workflowRequest.queryUsersByBuUniqueCode
    getBeAssignerList() {
      if (this.workflowRequest?.queryUsersByBuUniqueCode) {
        if (!this.userInfo) {
          return;
        }
        let userInfo = JSON.parse(this.userInfo);
        this.workflowRequest.queryUsersByBuUniqueCode(
          {
            buUniqueCode: userInfo.currentBizunit.buUniqueCode,
          },
          (res) => {
            if (res.msg.code == "0000") {
              var beAssignerList = res.data.map((item) => {
                return {
                  dataName: item.fullname,
                  dataValue: item.jfid,
                };
              });
              this.$set(this.fpForm.enums, "beAssignerList", beAssignerList);
            }
          }
        );
      }
    },
    gobackList() {
      this.routeClose();
      this.$router.push({ name: this.backName });
    },
    routeClose(timeout) {
      var routepath = window.location.pathname.replace(/\//g, "");
      this.$SrUtils.routeClose.call(this, routepath, this.$setState, timeout);
    },
    getNowTime() {
      let day2 = new Date();
      day2.setTime(day2.getTime());
      let s2 =
        day2.getFullYear() + "-" + (day2.getMonth() + 1) + "-" + day2.getDate();
      return s2;
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
      if (item.assignee) {
        param.assignee = item.assignee;
      }
      return param;
    },
    //分配确定
    fpSumbit() {
      let item = this.lastChildItem;
      let param = this.getParam();
      if (this.buttonList[0].showForm) {
        this.form.data.accessory = this.form.data.accessoryList.map((item) => {
          return item.id;
        });
        param = { ...param, ...this.form.data };
      }
      param.beAssigner = this.fpForm.data.beAssigner;
      console.log(this.$refs["addfpForm"]);
      this.$refs["addfpForm"][0].validate((val) => {
        if (val) {
          this.workflowRequest.setApiAfferentUrlOfPost(
            item.btnUrl,
            param,
            (res) => {
              if (res) {
                this.routeClose();
                this.$router.push({ name: this.backName });
              }
            }
          );
        }
      });
    },
    goback(item) {
      this.lastChildItem = item;
      if (this.clickMethods && this.clickMethods[item.btnEventType]) {
        this.clickMethods[item.btnEventType]();
      } else {
        if (item.btnEventType == "fp") {
          return;
        }
        let param = this.getParam();
        if (this.buttonList[0].showForm) {
          this.form.data.accessory = this.form.data.accessoryList.map(
            (item) => {
              return item.id;
            }
          );
          param = { ...param, ...this.form.data };
        }
        console.log(param)
        this.workflowRequest.setApiAfferentUrlOfPost(
          item.btnUrl,
          param,
          (res) => {
            if (res) {
              this.routeClose();
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
          projectId: this.projectId,
        },
        (res) => {
          this.markData = res.data;
        }
      );
    },
  },
};
</script>
