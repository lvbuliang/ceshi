<template>
  <div class="contractAdd">
    <div v-if="!get_success">
      <sr-nav-page :type="2" :project="srNavPageObj"></sr-nav-page>
      <div class="total-page">
        <el-tabs v-model="activeName">
          <el-tab-pane name="合同信息">
            <template slot="label" class="tabsLabel">
              <img
                style="vertical-align: middle"
                src="@/assets/barrage_fill@2x.png"
                width="24px"
                height="auto"
                alt
              />
              <span
                style="color: #333; vertical-align: middle; padding-left: 4px"
                >合同信息</span
              >
            </template>
            <SrAdd
              :config="form.config"
              :otherConfig="otherConfig"
              :enums="form.enums"
              :form="form.data"
              :ref="`form`"
            ></SrAdd>
          </el-tab-pane>
        </el-tabs>
      </div>
      <WorkFlow
        :hideFrom="true"
        :clickMethods="clickmethods"
        :buttonList="buttonList"
        backName="contract"
        :backFlag="$route.query.id ? true : false"
        ref="work_flow"
      ></WorkFlow>
    </div>
    <div v-else>
      <SuccessMsg :name="contractName" />
    </div>
  </div>
</template>

<script>
import store from "@/store";
import config from "@/settings.js";
import {
  api_getCustomFormTemplate,
  queryBizunitsByProperty,
} from "@/api/index.js";
import {
  api_setContractData,
  api_getContractDetail,
  listByTopicAndItem,
  api_setContractDraft,
} from "@/api/contract/index.js";
import upload from "@/utils/upload";
import WorkFlow from "@/components/SrWorkFlow";
import SuccessMsg from "@/components/success_msg.vue";
import { mapGetters } from "vuex";
import { setSession, getSession, removeSession } from "@/core/session.js";
import { setState } from "@/utils/app-store";
import { setIntervaltime } from "@/utils/common";
import { getDetailById } from "@/api/projectLibrary/index.js";
export default {
  components: {
    WorkFlow,
    SuccessMsg,
  },
  provide() {
    return {
      baseUrl: config.uploadBaseUrl,
      imgBaseUrl: config.imgBaseUrl,
      uploadRequest: upload,
      uploadBaseUrl: config.uploadBaseUrl,
    };
  },
  data() {
    return {
      activeName: "合同信息",
      isNew: false,
      srNavPageObj: { name: "", code: "" },
      timer: "",
      get_success: false,
      contractName: "合同信息管理",
      form: {
        config: [],
        data: {},
        enums: {},
      },
      templateId: "",
      otherConfig: {
        labelNum: 160,
      },
      clickmethods: { tg: this.tg },
      buttonList: [
        {
          role: "",
          btns: [
            {
              btnName: "确认",
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
      contractUnitFullName: "", //建设单位
      controlUnitFullName: "", //监理单位
    };
  },
  computed: {
    userInfo() {
      return store.getters.userInfo;
    },
    ...mapGetters(["msg"]),
  },
  watch: {
    msg: function (n, o, y) {
      if (n == "主应用请求保存表单") {
        this.btg("close");
      }
    },
    get_success: function (n) {
      this.routeUpdata();
    },
    $route(to) {
      this.$set(this, "editableTabs", []);
      if (to.name == "contractAdd") {
        this.createdfunc();
      }
    },
  },
  mounted() {
    console.log(this.userInfo);
    this.createdfunc();
    if (this.$route.query.projectId) {
      this.getProjectData();
    }
  },
  methods: {
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

    routeClose(timeout) {
      this.$SrUtils.routeClose.call(this, "subimpl", this.$setState, timeout);
    },
    getProjectData() {
      getDetailById({ id: this.$route.query.projectId }).then((res) => {
        if (res.msg.code == "0000") {
          this.srNavPageObj = {
            projectName: res.data.projectName,
            projectCode: res.data.projectCode,
          };
          // 处理监理与建设单位
          console.log("值", this.form);
          this.form.config.forEach((item) => {
            if (res.data.contractUnit && item.bind == "contractUnit") {
              // item.disabled = true;
              this.form.data.contractUnit = res.data.contractUnit;
              this.contractUnitFullName = res.data.contractUnit;
              if (this.$route.query.parentId) {
                item.disabled = true;
              }
            }
            if (res.data.controlUnit && item.bind == "controlUnit") {
              // item.disabled = true;
              this.form.data.controlUnit = res.data.controlUnit;
              this.controlUnitFullName = res.data.controlUnit;
              if (this.$route.query.parentId) {
                item.disabled = true;
              }
            }
          });
        }
      });
    },
    createdfunc() {
      if (this.$route.query.parentId) {
        this.contractName = "子合同信息管理";
      } else {
        this.contractName = "合同信息管理";
      }
      this.getCustomFormTemplate();
      if (this.$route.query.id) {
        this.getDetail(this.$route.query.id);
      } else if (
        getSession("infoId_contractAdd" + this.$route.query.projectId) &&
        getSession("infoId_contractAdd" + this.$route.query.projectId) != "null"
      ) {
        this.getDetail(
          getSession("infoId_contractAdd" + this.$route.query.projectId)
        );
        // this.timer = setInterval(this.getsetInterval, this.$SrUtils.autoSaving());
      } else {
        // this.timer = setInterval(this.getsetInterval, this.$SrUtils.autoSaving());
      }
    },
    getsetInterval() {
      this.btg("linshi_current");
    },
    getDetail(id) {
      api_getContractDetail({ id }).then((res) => {
        if (res.msg.code == "0000") {
          res.data.otherFile = res.data.otherFile
            ? JSON.parse(res.data.otherFile)
            : [];
          res.data.contractFile = res.data.contractFile
            ? JSON.parse(res.data.contractFile)
            : [];
          res.data.status = res.data.status + "";
          res.data.contractDuration = res.data.contractDuration
            ? JSON.parse(res.data.contractDuration)
            : [];
          // res.data.contractUnitName = Number(res.data.contractUnitName);

          console.log(res.data);
          this.$set(this.form, "data", res.data);
        }
      });
    },
    //JFZG_CONTRACT_STATUS
    getListByTopicAndItem() {
      listByTopicAndItem({ topic: "JFZG_CONTRACT_STATUS" }).then((res) => {
        if (res.msg.code == "0000") {
          this.form.enums.statusList = res.data.map((item) => {
            return {
              dataName: item.chName,
              dataValue: item.itemCode,
            };
          });
        }
      });
    },
    //自定义表单获取
    getCustomFormTemplate() {
      let moduleCode = this.$route.query.parentId ? "13002" : "13001";
      let params = {
        moduleCode,
        // templateId: this.templateId,
      };
      api_getCustomFormTemplate(params).then((res) => {
        if (res.msg.code == "0000") {
          let list = res.data.templateDetail
            ? JSON.parse(res.data.templateDetail)
            : [];
          if (list.length > 0) {
            this.form = JSON.parse(list[0].formArr)[0].selectData.formAdd;
            console.log(this.form);
            // 处理建设单位与监理单位
            this.getContractUnitNameList((rs) => {
              this.$set(this.form.enums, "contractUnitNameList", rs);
            });
            this.getControlUnitNameList((rs) => {
              this.$set(this.form.enums, "controlUnitNameList", rs);
            });
          }
          // debugger;
          this.templateId = res.data.id;
          console.log(this.form);
          this.getListByTopicAndItem();
          if (this.userInfo && !this.$route.query.id) {
            this.$set(
              this.form.data,
              "signUnit",
              this.userInfo.bizunitInfos[0].buName
            );
          }
          if (this.$route.query.id) {
            this.getDetail(this.$route.query.id);
          }
        }
      });
    },
    // 处理实施管理模块还未成员管理弹框提示
    tg(data) {
      console.log("tijiao", this.form.data);
      this.$refs["form"].validate((val) => {
        if (val) {
          if (
            (this.contractUnitFullName != this.form.data.contractUnit &&
              this.contractUnitFullName) ||
            (this.controlUnitFullName != this.form.data.controlUnit &&
              this.controlUnitFullName)
          ) {
            this.$confirm(
              "承建单位/监理单位信息与「实施管理」中的「成员信息」不一致，请认真核对信息！为避免验收风险，请及时更新「实施管理」中的所有信息！",
              "风险提示：",
              {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                center: false,
              }
            )
              .then(() => {
                this.tijiao(data);
              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: "已取消",
                });
              });
          } else {
            this.tijiao(data);
          }
        }
      });
    },
    tijiao(data) {
      let params = {
        id: this.$route.query.id,
        ...this.form.data,
        projectId: this.$route.query.projectId,
        templateId: this.templateId,
      };
      console.log("传参", params);
      if (!params.otherFile) {
        params.otherFile = [];
      }
      if (!params.contractFile) {
        params.contractFile = [];
      }
      params.otherFile = params.otherFile
        ? JSON.stringify(params.otherFile)
        : [];
      params.contractFile = params.contractFile
        ? JSON.stringify(params.contractFile)
        : [];
      params.contractDuration = params.contractDuration
        ? JSON.stringify(params.contractDuration)
        : null;
      if (this.$route.query.parentId) {
        params.parentId = this.$route.query.parentId;
      }
      if (this.$route.query.id) {
        params.id = this.$route.query.id;
      }
      if (params.modified) {
        params.modified = "";
      }
      // 承建单位名字
      if (params.contractUnit) {
        this.form.enums.contractUnitNameList.map((item) => {
          if (item.dataValue == params.contractUnit) {
            params.contractUnitName = item.dataName;
          }
        });
      }
      // 监理单位名字
      if (params.controlUnit) {
        this.form.enums.controlUnitNameList.map((item) => {
          if (item.dataValue == params.controlUnit) {
            params.controlUnitName = item.dataName;
          }
        });
      }
      if (
        getSession("infoId_contractAdd" + this.$route.query.projectId) &&
        getSession("infoId_contractAdd" + this.$route.query.projectId) != "null"
      ) {
        params.id = getSession(
          "infoId_contractAdd" + this.$route.query.projectId
        );
        this.isNew = true;
      } else {
        this.isNew = true;
      }
      api_setContractData(params).then((res) => {
        if (res.msg.code == "0000") {
          if (this.$route.query.id) {
            this.$message.success("修改成功");
          } else {
            this.$message.success("新增成功");
          }
          clearInterval(this.timer);
          if (
            this.$route.name == "contractEdit" ||
            this.$route.name == "subcontractEdit"
          ) {
            this.routeClose();
            this.$router.push({ name: "contract" });
          } else {
            if (this.isNew == true) {
              this.get_success = true;
            } else {
              this.routeClose();
              this.$router.push({ name: "contract" });
            }
          }
        }
      });
    },
    btg(str) {
      let data = this.$refs["form"].validate();
      console.log(data);
      // (val) => {
      // if (val) {
      let params = {
        id: this.$route.query.id,
        ...this.form.data,
        projectId: this.$route.query.projectId,
        templateId: this.templateId,
      };
      if (!params.otherFile) {
        params.otherFile = [];
      }
      if (!params.contractFile) {
        params.contractFile = [];
      }
      params.otherFile = params.otherFile
        ? JSON.stringify(params.otherFile)
        : [];
      params.contractFile = params.contractFile
        ? JSON.stringify(params.contractFile)
        : [];
      params.contractDuration = params.contractDuration
        ? JSON.stringify(params.contractDuration)
        : null;
      /* params.otherFile = params.otherFile
            ? JSON.stringify(params.otherFile)
            : "";
          params.contractFile = params.contractFile
            ? JSON.stringify(params.contractFile)
            : ""; */
      if (this.$route.query.parentId) {
        params.parentId = this.$route.query.parentId;
      }

      if (params.modified) {
        params.modified = "";
      }
      // 承建单位名字
      if (params.contractUnit) {
        this.form.enums.contractUnitNameList.map((item) => {
          if (item.dataValue == params.contractUnit) {
            params.contractUnitName = item.dataName;
          }
        });
      }
      // 监理单位名字
      if (params.controlUnit) {
        this.form.enums.controlUnitNameList.map((item) => {
          if (item.dataValue == params.controlUnit) {
            params.controlUnitName = item.dataName;
          }
        });
      }
      if (str == "linshi_current") {
        params.temporary = 1;
      }
      if (
        getSession("infoId_contractAdd" + this.$route.query.projectId) &&
        getSession("infoId_contractAdd" + this.$route.query.projectId) != "null"
      ) {
        params.id = getSession(
          "infoId_contractAdd" + this.$route.query.projectId
        );
        this.isNew = true;
      } else {
        this.isNew = false;
      }
      api_setContractDraft(params).then((res) => {
        // api_setContractData(params).then((res) => {
        if (res.msg.code == "0000") {
          if (str == "linshi_current") {
            setSession(
              "infoId_contractAdd" + this.$route.query.projectId,
              res.data
            );
          } else if (str == "close") {
            removeSession("infoId_contractAdd" + this.$route.query.projectId);
            this.$message.success("保存成功");
          } else {
            this.$message.success("保存成功");
            removeSession("infoId_contractAdd" + this.$route.query.projectId);
            clearInterval(this.timer);
            if (
              this.$route.name == "contractEdit" ||
              this.$route.name == "subcontractEdit"
            ) {
              this.routeClose();
              this.$router.push({ name: "contract" });
            } else {
              if (this.isNew == true) {
                this.get_success = true;
              } else {
                this.routeClose();
                this.$router.push({ name: "contract" });
              }
            }
          }
        }
      });
      // }
      // });
    },
    getContractUnitNameList(callback) {
      queryBizunitsByProperty({ buPropertyEnum: "CJDW" }).then((res) => {
        console.log("2", res);
        this.contractUnitNameList = res.data.map((item) => {
          let emunObj = {};
          emunObj.dataName = item.buName;
          emunObj.dataValue = item.buid;
          return emunObj;
        });
        callback(this.contractUnitNameList);
      });
    },
    getControlUnitNameList(callback) {
      queryBizunitsByProperty({ buPropertyEnum: "JLDW" }).then((res) => {
        console.log("3", res);
        this.controlUnitNameList = res.data.map((item) => {
          let emunObj = {};
          emunObj.dataName = item.buName;
          emunObj.dataValue = item.buid;
          return emunObj;
        });
        callback(this.controlUnitNameList);
      });
    },
  },
};
</script>

<style lang="scss" socped>
.contractAdd {
  ::v-deep .total-page {
    .el-tabs__nav-wrap {
      &::after {
        height: 1px;
      }
    }
    .el-tabs__content {
      padding: 0;
    }
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
    ::v-deep .el-tabs__header {
      margin-bottom: 16px;
    }
    .tabsDataTitle {
      margin-top: 8px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      color: #333333;
      line-height: 22px;
      margin-bottom: 13px;
      font-size: 14px;
    }
  }
}
</style>
