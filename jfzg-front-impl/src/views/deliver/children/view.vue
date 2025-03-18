<template>
  <div :class="['InitiateDetail_class', onlyShow ? 'noPadding' : '']">
    <sr-nav-page
      v-if="!onlyShow"
      :type="2"
      :project="srNavPageObj"
    ></sr-nav-page>
    <div class="title_box" v-if="!onlyShow">
      <span class="title">交付物管理</span>
      <section class="btns" v-if="userInfo.currentRole.roleCode != 'PSZJ'">
        <el-button
          type="primary"
          v-debounce="[() => addDeliver(), config.deTime]"
          >添加交付物</el-button
        >
        <!-- <el-button @click="addDeliverFromTemplate">从模板中添加</el-button> -->
      </section>
    </div>
    <SwiperTab
      :eletab="eletab"
      :onlyShow="onlyShow"
      @exportData="exportData"
      @handleClick="handleClick"
    />
    <div class="deliverList">
      <Deliverable
        ref="Deliverable"
        @approve="approve"
        @approveDeliver="approveDeliver"
        @see="see"
        @editDeliver="editDeliver"
        @uploadSuccessHandle="uploadSuccessHandle"
        :deliverysList="activeDeliverList"
        :onlyShow="onlyShow"
      />
    </div>
    <SrDialog
      @submitData="submitData"
      @workFlowHandle="workFlowHandle"
      ref="SrDialog"
      :visible="visible"
      :title="title"
      :type="type"
    ></SrDialog>
    <div class="bottom" v-if="!onlyShow">
      <el-button @click="goBack">返回列表</el-button>
    </div>
  </div>
</template>

<script>
//
import Deliverable from "../components/deliverableList";
import SrDialog from "../components/SrDialog";
import SwiperTab from "../components/swiperTab";
import {
  api_getdeliverListById,
  api_addDeliver,
  editDeliverApprove,
  getProjectStages,
  approveDeliverFile,
} from "@/api/deliver/index";
import { api_getDetailById } from "@/api/projectLibrary";
import store from "@/store";
import workflows from "@/utils/workflow";
import config from "@/settings.js";
import { api_activititodo } from "@/api/index";
export default {
  components: { Deliverable, SrDialog, SwiperTab },
  computed: {
    swiper() {
      return this.$refs.todoSwiper.swiper;
    },
  },
  props: {
    onlyShow: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  data() {
    return {
      config,
      type: "addDeliver",
      title: "添加交付物",
      visible: false,
      srNavPageObj: { projectName: "项目名称", projectCode: "123" },
      eletab: [],
      activeDeliverList: [],
      id: "",
      RowData: {},
      deliverItem: {},
      workflows: workflows,
      taskId: null,
      buttonList: [],
      userInfo: store.getters.userInfo,
      currentStageId: "",
    };
  },

  created() {
    // this.buttonInit()
    if (this.$route.query.projectId) {
      this.getdeliverListById();
      this.getProjectInfo();
    }
  },
  methods: {
    //获取项目信息
    getProjectInfo() {
      api_getDetailById({ id: this.$route.query.projectId }).then((res) => {
        if (res.msg.code == "0000") {
          res.data.name = res.data.projectName;
          res.data.mainProjectCode = res.data.projectCode;
          this.srNavPageObj = res.data;
        }
      });
    },
    //空内容点击上传
    exportData() {
      this.addDeliver();
    },
    // 返回列表
    goBack() {
      this.$router.push({
        name: "deliverProjectList",
      });
    },
    // 工作流
    workFlowHandle(Data, Type) {
      console.log(Data);
      console.log(Type);
      this.deliverApprove(Data, Type);
    },
    // 提交
    submitData(Data) {
      if (this.type == "addDeliver") {
        this.addNewDeliver(Data);
      } else if (this.type == "approve") {
        this.approveDeliverFile(Data);
      } else if (this.type == "editDeliver") {
        this.editNewDeliver(Data);
      }
    },
    // 获取任务id
    buttonInit() {
      let { roleCode } = this.userInfo.currentRole;
      let { jfid } = this.userInfo;
      let param = {
        owner: jfid,
        role: roleCode,
        processId: this.deliverItem.processId,
      };

      api_activititodo(param).then((res) => {
        let assignee = res.data[0].assignee;
        this.buttonList = JSON.parse(res.data[0].description).filter((item) => {
          //按钮筛选  以assignee优先roleCode
          item.assignee = assignee;
          if (assignee == jfid) {
            return true;
          } else if (roleCode == item.role) {
            return true;
          }
        });
        this.taskId = res.data[0].taskId;
      });
    },
    // 工作流参数
    getParam(item) {
      let param = {
        vars: item.btnValue,
        processInstanceId: this.deliverItem.processId,
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

    // 交付物审核
    deliverApprove(Data, Type) {
      let btns = [];
      if (this.deliverItem.description) {
        btns = JSON.parse(this.deliverItem.description)[0].btns;
      }
      let param = {};
      if (this.buttonList[0].showForm) {
        Data.accessory = Data.accessoryList.map((item) => {
          return item.id;
        });
        param = { ...Data };
      }
      console.log("btns", btns);
      btns.forEach((item) => {
        if (item.btnType == Type) {
          let obj = this.getParam(item);
          param = { ...param, ...obj };
          this.workflows.setApiAfferentUrlOfPost(item.btnUrl, param, (res) => {
            if (res) {
              this.$message({
                message: "交付物审核成功",
                type: "success",
              });
              this.getdeliverListById();
            }
          });
        }
      });
    },

    // 交付物文件审核
    approveDeliverFile(Formdata) {
      let data = {
        advice: Formdata.advice,
        files: JSON.stringify(Formdata.files),
        id: this.RowData.id, // 交付物文件的Id
        status: this.$refs["SrDialog"].approveformAdd.data.approve,
      };
      approveDeliverFile(data).then((res) => {
        this.$message({
          message: "审核成功",
          type: "success",
        });
        this.getdeliverListById(true);
      });
    },
    // 新增交付物
    addNewDeliver(Formdata) {
      let data = {
        projectId: this.$route.query.projectId,
        ...Formdata,
      };
      api_addDeliver(data).then((res) => {
        this.$message({
          message: "添加成功",
          type: "success",
        });
        this.getdeliverListById(true);
      });
    },
    // 编辑交付物
    editNewDeliver(Formdata) {
      let data = {
        projectId: this.$route.query.projectId,
        ...Formdata,
        status: 1,
      };
      editDeliverApprove(data).then((res) => {
        this.$message({
          message: "编辑成功",
          type: "success",
        });
        this.getdeliverListById();
      });
    },
    // 上传成功回调
    uploadSuccessHandle() {
      this.getdeliverListById(true);
    },
    // 编辑交付物
    editDeliver(row) {
      console.log(row);
      this.type = "editDeliver";
      this.title = "编辑交付物";
      this.$refs["SrDialog"].edit(row);
      this.$refs["SrDialog"].visible = true;
    },
    // 查看
    see(row) {
      this.type = "approveView";
      this.title = "查看审核结果";
      this.$refs["SrDialog"].init(row.id);
      this.$refs["SrDialog"].visible = true;
    },
    // 审核附件
    approve(row) {
      console.log(row);
      this.RowData = row;
      this.type = "approve";
      this.title = "填写交付物附件审核结果";
      this.$refs["SrDialog"].visible = true;
    },
    // 审核交付物
    approveDeliver(row) {
      console.log(row);
      this.deliverItem = row;
      this.buttonInit();

      this.type = "approveDeliver";
      this.title = "填写交付物审核结果";
      this.$refs["SrDialog"].visible = true;
    },
    // 添加交付物
    addDeliver() {
      this.type = "addDeliver";
      this.title = "添加交付物";
      this.$refs["SrDialog"].visible = true;
    },
    // 从模板中添加
    addDeliverFromTemplate() {
      this.type = "addDeliverFromTemplate";
      this.title = "选择交付物模板";
      this.$refs["SrDialog"].visible = true;
    },
    prev() {
      this.swiper.slidePrev();
    },
    next() {
      this.swiper.slideNext();
    },
    // tab切换
    handleClick(item) {
      console.log(item);
      this.dataHandle(item.stageId);
    },
    // 数据处理
    dataHandle(activestageId) {
      console.log(activestageId)
      this.currentStageId = activestageId;
      this.$refs["Deliverable"].activeNames = [];
      this.eletab.forEach((item) => {
        if (item.stageId == activestageId) {
          this.activeDeliverList = item.deliverys;
          this.activeDeliverList.forEach((a) => {
            if (a.deliveryFiles.length > 0) {
              // 交付物下有附件的默认展开
              this.$refs["Deliverable"].activeNames.push(a.id);
              a.deliveryFiles.forEach((b) => {
                let fileContext;
                try {
                  fileContext = JSON.parse(b.fileContext);
                  if (fileContext) {
                    b.fileName = fileContext.name;
                    if (fileContext.size) {
                      b.fileSize =
                        (Number(fileContext.size) / 1024).toFixed(2) + "KB";
                    }
                    b.fileId = fileContext.id;
                  }
                } catch (e) {
                  fileContext = b;
                  if (fileContext) {
                    if (fileContext.size) {
                      b.fileSize =
                        (Number(fileContext.size) / 1024).toFixed(2) + "KB";
                    }
                    b.fileId = fileContext.id;
                  }
                }
              });
            }
          });
        }
      });
    },

    // 根据项目id 查交付物列表
    // isUpdate 只是刷新当前里程碑的数据
    getdeliverListById(isUpdate) {
      let params = {
        projectId: this.$route.query.projectId,
      };
      api_getdeliverListById(params).then((res) => {
        if (res.msg.code == "0000" && res.data.length) {
          this.eletab = res.data;
          this.eletab.forEach((item) => {
            item.count = item.deliverys.length;
          });
          if (isUpdate) {
            this.dataHandle(this.currentStageId);
          } else {
            this.dataHandle(res.data[0].stageId);
            // this.dataHandle(this.currentStageId);
          }
          console.log("查交付物列表", res.data);
          console.log(this.active)
        }
        // console.log("工作流", JSON.parse(res.data[0].deliverys[10].description));
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.InitiateDetail_class {
  padding-bottom: 40px;
  .title_box {
    display: flex;
    align-items: center;
    margin: 24px 0 14px 0;
    justify-content: space-between;
    .title {
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
    }
    .btns {
      .el-button {
        width: 118px;
        height: 32px;
        border-radius: 16px;
        padding: 0 !important;
      }
    }
  }
  .bottom {
    position: fixed;
    bottom: 0;
    left: 81px;
    width: 100%;
    height: 63px;
    background: #ffffff;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    border: 1px solid #e6e6e6;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    .el-button {
      width: 104px;
      height: 32px;
      padding: 0;
      border-radius: 16px;
    }
  }
}
.noPadding {
  padding-bottom: 0px;
}
</style>
