<template>
  <div class="total-page">
    <div v-if="editableTabs.length > 0">
      <TestFormAdd
        ref="formAdd"
        :fromData="fromData"
        :editableTabs="editableTabs"
        @selectData="selectData"
        :projectStage="projectStage"
      ></TestFormAdd>
      <sr-work-flow
        :hideFrom="true"
        :clickMethods="clickmethods"
        :buttonList="buttonList"
        backName="activityList"
        ref="work_flow"
      ></sr-work-flow>
    </div>
  </div>
</template>

<script>
import TestFormAdd from "../../../components/srFormAdd";
import { api_getCustomFormTemplate } from "@/api/index";
import { subAndSave, getReviewActivitiesCountOfYear } from "@/api/activityList";
import {
  api_queryProjectNotInIds,
  api_queryListByStage,
  api_getLibraryNumber,
} from "@/api/projectLibrary";

export default {
  components: {
    TestFormAdd,
  },
  computed: {
    id() {
      return this.$route.query.id;
    },
  },
  data() {
    const { mobile, fullname } = this.$store.getters.userInfo;
    return {
      timer: "",
      isNew: false,
      get_success: false,
      editableTabs: [],
      fromData: {
        startTime: this.$moment().format("YYYY-MM-DD"),
        endTime: this.$moment().add(7, "d").format("YYYY-MM-DD"),
        projectList: [],
        phone: mobile,
        userName: fullname,
      },
      activeName: "0",
      templateId: this.$route.query.templateId,
      clickmethods: { tg: this.tg },
      buttonList: [
        {
          role: "",
          btns: [
            {
              btnName: "创建",
              btnValue: "tg",
              btnType: "primary",
              btnEventType: "tg",
            },
          ],
          nodes: [
            {
              dataName: "",
              dataValue: "节点值0",
            },
          ],
        },
      ],
      sign: null,
      node: null,
      projectStage: true, //是否显示评审活动所属阶段
      reviewActivitiesCount: null,
      activityName: "",
    };
  },
  methods: {
    // 获取本年度评审活动总数
    getReviewActivitiesCount() {
      let year = new Date().getFullYear();
      console.log("year", year);
      getReviewActivitiesCountOfYear({ year: year }).then((res) => {
        console.log("评审活动名称", res);
        this.reviewActivitiesCount = res.data;
        this.activityName =
          `${year}` +
          "年第" +
          `${this.reviewActivitiesCount + 1}` +
          "次评审活动";
        this.$set(this.fromData, "reviewActivitiesName", this.activityName);
      });
    },
    selectData(val1, val2) {
      console.log("最终", val1, val2);
      this.sign = val1;
      this.node = val2;
      console.log("11111111++++", this.sign, this.node);
      this.editableTabs.map((item) => {
        console.log(item);
        item.formArr.map((item2) => {
          item2.selectData.formAdd.config.map((conf) => {
            console.log("conf", conf);
            if (conf.type === "dialogSelect") {
              // conf.getList = api_queryProjectNotInIds;
              conf.getList = api_queryListByStage;
              conf.select = this.handleSelectProject;
              conf.trigger = "click";
              conf.header[1] = {
                prop: "projectTypeName",
                label: "项目类型",
              };
              // conf.params.activationStatus = 1;
              // conf.params.status = 1000;
              conf.params.isSubproject = "";
              conf.params.node = this.node;
              // conf.params.node = this.node;
              // conf.params.sign = this.sign;
              conf.params.sign = this.sign;
              // console.log(this.node, this.sign);
              conf.getNumber = api_getLibraryNumber;
              conf.addFlag = false;
              console.log("配置", conf);
              if (this.fromData.projectList) {
                conf.projectName = this.fromData.projectName;
                conf.selectData = this.fromData.projectList;
                /* conf.params.ids =
                    this.fromData.projectList &&
                    this.fromData.projectList.map((i) => i.projectId).join(","); */
              }
            }
          });
        });
      });
    },
    // 会议时长0四小时以下--60%，1 四小时以上--100%
    meetingLengthChange(value) {
      console.log("会议时长", value, value == "0", typeof value);
      this.editableTabs.forEach((item) => {
        item.formArr.forEach((item2) => {
          for (let i = 0; i < item2.selectData.formAdd.config.length; i++) {
            // console.log(item2.selectData.formAdd.data.reviewActivitiesType);
            // 评审活动类型为函评，劳务计算比例即为50%，不受会议时间限制
            if (item2.selectData.formAdd.data.reviewActivitiesType == "0") {
              item2.selectData.formAdd.data.feePercentage = "50%";
              return;
            }
            if (item2.selectData.formAdd.config[i].bind == "feePercentage") {
              if (value == "0") {
                item2.selectData.formAdd.data.feePercentage = "60%";
              } else if (value == "1") {
                item2.selectData.formAdd.data.feePercentage = "100%";
              } else {
                // 默认为空
                item2.selectData.formAdd.data.feePercentage = "";
              }
            }
          }
        });
      });
    },
    // 会议方式0线上会议隐藏线下会议地址，1现场会议，隐藏线上会议
    meetingTypeChange(value) {
      console.log("会议方式", value);
      this.editableTabs.forEach((item) => {
        item.formArr.forEach((item2) => {
          for (let i = 0; i < item2.selectData.formAdd.config.length; i++) {
            if (value == "0") {
              if (item2.selectData.formAdd.config[i].bind == "meetingUrl") {
                item2.selectData.formAdd.config[i].isHide = false;
              }
              if (item2.selectData.formAdd.config[i].bind == "meetingAddress") {
                item2.selectData.formAdd.config[i].isHide = true;
              }
            } else if (value == "1") {
              if (item2.selectData.formAdd.config[i].bind == "meetingAddress") {
                item2.selectData.formAdd.config[i].isHide = false;
              }
              if (item2.selectData.formAdd.config[i].bind == "meetingUrl") {
                item2.selectData.formAdd.config[i].isHide = true;
              }
            }
            //重置表单中已填写内容
            this.$set(item2.selectData.formAdd.data, "meetingAddress", "");
            this.$set(item2.selectData.formAdd.data, "meetingUrl", "");
          }
        });
      });
    },
    // 评审活动类型 // 等于函评0，展示评审次数
    reviewActivitiesTypeChange(value) {
      console.log("评审活动类型", value);
      this.editableTabs.forEach((item) => {
        item.formArr.forEach((item2) => {
          for (let i = 0; i < item2.selectData.formAdd.config.length; i++) {
            // 函评时展示评审次数，现场评审不展示
            if (item2.selectData.formAdd.config[i].bind == "reviewTimes") {
              if (value == "0") {
                item2.selectData.formAdd.config[i].isHide = false;
              } else if (value == "1") {
                item2.selectData.formAdd.config[i].isHide = true;
              }
              /*   else {
                // 默认展示
                item2.selectData.formAdd.config[i].isHide = true;
              } */
            }
            if (
              item2.selectData.formAdd.config[i].bind == "feePercentage" &&
              value == "0"
            ) {
              item2.selectData.formAdd.data.feePercentage = "50%";
            } else if (
              item2.selectData.formAdd.config[i].bind == "feePercentage" &&
              value != "0"
            ) {
              // 现场评审时，会议时长为0，劳务费基准60%，会议时长为1,劳务费基准100%
              if (item2.selectData.formAdd.data.meetingLength == "0") {
                item2.selectData.formAdd.data.feePercentage = "60%";
              } else if (item2.selectData.formAdd.data.meetingLength == "1") {
                item2.selectData.formAdd.data.feePercentage = "100%";
              } else {
                // 重置
                item2.selectData.formAdd.data.feePercentage = "";
              }
            }
          }
        });
      });
    },
    routeClose() {
      this.$SrUtils.routeClose.call(this, "subexpert", this.$setState);
    },
    routeUpdata() {
      var routerBase = "/subimpl";
      setState({
        ignore: "upDataAddTab",
        msg: {
          title: this.$route.meta.title,
          url: `${routerBase}/#${this.$route.fullPath}`,
          meta: { ...this.$route.meta, isSave: true },
        },
      });
    },
    tg() {
      let data = this.$refs["formAdd"].validateFun();
      console.log("data", data);
      if (data) {
        data.file = JSON.stringify(data.file);
        data.feePercentage = parseInt(data.feePercentage);
        data.projectInfos = data.projectList;
        delete data.projectList;
        /*  data.projectId = data.projectList
          .map((res) => {
            return res.projectId;
          })
          .join(); */

        subAndSave(data).then((res) => {
          if (res.msg.code == "0000") {
            this.$message.success("新增成功");
            this.routeClose();
            this.$router.push({ name: "activityList" });
          }
        });
      }
    },
    // 根据模版渲染表单
    createdfunc() {
      console.log(this.$refs);
      api_getCustomFormTemplate({
        moduleCode: "24001",
      }).then((res) => {
        console.log("moban", res);
        this.editableTabs = JSON.parse(res.data.templateDetail).map((item) => {
          item.formArr = JSON.parse(item.formArr);
          item.formArr.map((val) => {
            val.selectData.formAdd.config.map((conf, i) => {
              if (conf.bind === "endTime") {
                conf["picker-options"] = {
                  disabledDate: (time) => {
                    if (this.fromData.startTime) {
                      return (
                        time.getTime() <
                        new Date(this.fromData.startTime).getTime()
                      ); //如果没有后面的-8.64e7就是不可以选择今天的
                    }
                  },
                };
              }
              if (conf.bind === "startTime") {
                conf["picker-options"] = {
                  disabledDate: (time) => {
                    if (this.fromData.endTime) {
                      return (
                        new Date(this.fromData.endTime).getTime() <
                        time.getTime()
                      );
                    }
                  },
                };
              }
              if (conf.type === "dialogSelect") {
                // if (!this.sign && !this.node) {
                //   this.$message.warning("请先选择评审活动所属阶段！");
                //   return;
                // }

                // this.dialogVisible = false;
                // // conf.getList = api_queryProjectNotInIds;
                // conf.getList = api_queryListByStage;
                // conf.select = this.handleSelectProject;
                // conf.trigger = "click";
                // conf.header[1] = {
                //   prop: "projectTypeName",
                //   label: "项目类型",
                // };
                // // conf.params.activationStatus = 1;
                // // conf.params.status = 1000;
                // conf.params.isSubproject = "";
                // conf.params.node = 3;
                // // conf.params.node = this.node;
                // // conf.params.sign = this.sign;
                // conf.params.sign = 0;
                // // console.log(this.node, this.sign);
                // conf.getNumber = api_getLibraryNumber;
                conf.addFlag = false;
                // console.log("配置", conf);
                // if (this.fromData.projectList) {
                //   conf.projectName = this.fromData.projectName;
                //   conf.selectData = this.fromData.projectList;
                //   /* conf.params.ids =
                //     this.fromData.projectList &&
                //     this.fromData.projectList.map((i) => i.projectId).join(","); */
                // }
              }
              //会议时间大于系统时间
              if (conf.bind === "meetingTime") {
                conf["picker-options"] = {
                  disabledDate: (time) => {
                    return time.getTime() < new Date().getTime();
                  },
                };
              }
              // 给评审活动类型增加change事件
              if (conf.bind === "reviewActivitiesType") {
                // console.log("评审活动类型");
                // 绑定change事件
                conf.change = this.reviewActivitiesTypeChange;
              }
              /*  // 初始化隐藏评审次数以下代码暂不用现默认展示函评
              if (conf.bind === "reviewTimes") {
                conf.isHide = true;
              } */
              // 给会议方式添加change事件
              if (conf.bind === "meetingType") {
                console.log("会议方式");
                // 绑定change事件
                conf.change = this.meetingTypeChange;
              }
              // 默认会议方式为0即为线上会议，默认展示线上会议，隐藏线场会议
              if (conf.bind === "meetingAddress") {
                conf.isHide = true;
              }
              // 会议时长添加change事件
              if (conf.bind === "meetingLength") {
                // 绑定change事件
                conf.change = this.meetingLengthChange;
              }
            });
          });
          return item;
        });
        this.templateId = res.data.id;
      });
    },
    // 弹框选中项目事件
    handleSelectProject(val) {
      this.fromData.projectList = val.map((res) => {
        return {
          projectId: res.id,
          source: res.source,
          version: res.version,
          projectStatus: res.status,
        };
      });
      this.editableTabs[0].formArr[0].selectData.formAdd.data.projectList =
        this.fromData.projectList;
      this.editableTabs.map((res) => {
        res.formArr.map((item) => {
          item.selectData.formAdd.config.map((conf) => {
            if (conf.type === "dialogSelect") {
              conf.params.ids = val.map((res) => res.id).join(",");
            }
          });
        });
      });
    },
  },
  created() {
    this.getReviewActivitiesCount();
    this.createdfunc();
  },
};
</script>
<style lang="scss" scoped>
.searchPage {
  display: flex;
  justify-content: space-between;
}
.searchRightBtn {
  display: inline-block;
  button {
    width: 76px;
    height: 32px;
    border-radius: 16px;
    padding: 5px 24px;
  }
}
.tabsLabel {
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #333333;
  line-height: 24px;
  i {
    margin-right: 4px;
  }
}
.tabsDataTitle {
  margin-top: 8px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #333333;
  line-height: 22px;
}
</style>
