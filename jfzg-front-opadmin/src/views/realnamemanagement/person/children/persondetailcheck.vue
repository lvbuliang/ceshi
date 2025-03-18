<template>
  <div class="checkpar">
    <div class="people_info">
      <p class="name">认证人信息</p>
      <p class="list">
        姓名：
        <span>{{checkObj.fullname?checkObj.fullname:'--'}}</span>
      </p>
      <p class="list">
        手机号：
        <span>{{checkObj.mobile?checkObj.mobile:'--'}}</span>
      </p>
      <p class="list">
        帐号：
        <span>{{checkObj.userId?checkObj.userId:'--'}}</span>
      </p>
      <p class="list">
        证件号：
        <span>{{checkObj.idencode?checkObj. idencode:'--'}}</span>
      </p>
      <p class="list">
        证件类型：
        <span>大陆居民第二代身份证</span>
      </p>
      <p class="list">
        认证方式：
        <span>手持身份证认证</span>
      </p>
      <section class="pic_list">
        <el-image
          v-for="(a,index) in src_person_list"
          :key="index"
          :src="a"
          :preview-src-list="src_person_list"
        ></el-image>
      </section>
    </div>

    <div class="check_text">
      <p class="name">审核</p>
      <!-- <span class="check_name">审核说明</span>
      <textarea name="" id="textarea"  placeholder="请输入审核说明"></textarea>-->
      <div class="check_mass">
        <FForm
          ref="modelMgrRef"
          :config="form.config"
          :form="form.data"
          :rules="form.rules"
          :enums="form.enums"
          refForm="modelMgrRefForm"
          @eventNotify="eventNotify"
          :column="2"
        ></FForm>
      </div>
    </div>
    <div class="check_btn">
      <el-button class="exportbtn" type="primary" size="big" @click="checkPass">审核通过</el-button>
      <el-button class="exportbtn" type size="big" @click="checkReject">审核不通过</el-button>
    </div>
    <div class="markW">
      <p class="mark_title">
        <span>留痕轨迹</span>
      </p>
      <demoTab v-show="trajectoryData" :showDefaultImg="true" :trajectoryData="trajectoryData"></demoTab>
    </div>
  </div>
</template>

<script>
import FForm from "@/components/FForm/form-add.vue";
import url from "../../../../assets/shenfen.png";
import demoTab from "@/components/WorkFlowMark/Tab.vue";
import config from "@/settings.js";
import {
  api_queryPersonList, //获取供应商列表
  api_personAuthInfo, //供应商认证信息
  api_personCheckPass, //供应商审核通过
  api_personCheckReject, //供应商审核不通过
  api_querySupplierList, //获取供应商列表
  api_supplierAuthInfo, //供应商认证信息
  api_supplierCheckPass, //供应商审核通过
  api_supplierCheckReject, //供应商审核不通过
  common_trajectoryList,
} from "@/api/realnameManage/realnameManage";
export default {
  components: {
    FForm,
    demoTab,
  },
  data() {
    return {
      baseUrl: config.imgBaseUrl,
      src_person_list: [],
      src_supp_list: [],
      trajectoryData: [],

      form: {
        title: "表单标题",
        config: [
          {
            col: 24,
            type: "textarea",
            maxlength: 200,
            name: "审核说明",
            placeholder: "请输入审核说明",
            bind: "value_dis",
          },
        ],
        data: {
          value_dis: "",
        },
      },
      // 个人
      checkObj: {
        fullname: "",
        mobile: "",
        userId: "",
        idencode: "",
        idenimgpos: "",
        idenimgrev: "",
        idenimghand: "",
      },
    };
  },

  mounted() {
    this.getPersonData();
    this.getTrace();
  },
  methods: {
    eventNotify(ref) {
      this.$refs[ref].init();
    },
    // 获取留痕
    getTrace() {
      let id = this.$route.query.jfid;
      common_trajectoryList(id, "GYSCYSMRZ")
        .then((res) => {
          //console.log(res);
          if (res.msg.code == "0000") {
            this.$set(this, "trajectoryData", res.data);
          } else {
            //console.log(res);
          }
        })
        .catch((err) => {
          //console.log("获取留痕轨迹", err);
        });
    },
    // 获取个人信息
    getPersonData() {
      let params = {
        jfid: this.$route.query.jfid,
      };
      api_personAuthInfo(params).then((res) => {
        //console.log(res);
        if (res.msg.message == "SUCCESS") {
          this.checkObj = res.data;
          this.src_person_list.push(this.baseUrl + res.data.idenimghand);
          this.src_person_list.push(this.baseUrl + res.data.idenimgpos);
          this.src_person_list.push(this.baseUrl + res.data.idenimgrev);
        }
      });
    },
    // 审核通过
    checkPass() {
      let data = {
        jfid: this.$route.query.jfid,
        checkresult: this.form.data.value_dis,
      };
      api_personCheckPass(data).then((res) => {
        //console.log(res);
        if (res.msg.message == "SUCCESS") {
          this.$message({
            message: "操作成功",
            type: "success",
          });
          let self = this;
          setTimeout(function () {
            self.$router.push({
              name: "personlist",
            });
          }, 1000);
        } else {
          this.$message.error("操作失败");
        }
      });
    },
    // 审核不通过
    checkReject() {
      let data = {
        jfid: this.$route.query.jfid,
        checkresult: this.form.data.value_dis,
      };
      api_personCheckReject(data).then((res) => {
        //console.log(res);
        if (res.msg.message == "SUCCESS") {
          this.$message({
            message: "操作成功",
            type: "success",
          });
          let self = this;
          setTimeout(function () {
            self.$router.push({
              name: "personlist",
            });
          }, 1000);
        } else {
          this.$message.error("操作失败");
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.checkpar /deep/ {
  .markW {
    min-height: 220px;
    border-top: 1px solid #e8e8e8;
    .noneData {
      color: gray;
      margin: 32px;

      font-size: 14px;
    }
    .mark_title {
      border-right: 1px solid #e8e8e8;
      span {
        display: inline-block;
        height: 100%;
        border: 1px solid #e8e8e8;
        border-bottom: none;
        border-top: none;
        padding: 0px 32px;
        z-index: 100;
      }
      height: 50px;
      line-height: 50px;
      color: #2fc2a5;
    }
    .Tabs {
      .el-tabs__nav-scroll {
        display: none;
      }
      .busCardTabs {
        border: 1px solid #e8e8e8;
        border-top: none;
      }
      .busCardTabs .el-tabs__content {
        border: none;
        .el-tab-pane {
          .el-timeline {
            .el-timeline-item:last-child {
              .tag:nth-child(2) {
                width: 240px;
              }
            }
          }
        }
      }
      .tag {
        display: inline-block;
        width: 260px;
        margin-right: 20px;
        vertical-align: top;
      }
      .tag:nth-child(1) {
        width: 160px;
      }
      .tag:nth-child(2) {
        width: 220px;
      }
      .tag:nth-child(3),
      .tag:nth-child(6),
      .operate {
        display: none;
      }
      .tag:nth-child(4) {
        width: 300px;
      }
      .tag:nth-child(5) {
        width: 700px;
      }
    }
  }
  .check_btn {
    width: 100%;
    text-align: center;
    padding: 20px;
    // background-color: #f0f2f5;
    .el-button {
      border-radius: 16px;
    }
  }
  .check_text {
    // .el-form {
    //   .el-form-item:nth-child(1) {
    //     .el-form-item__label {
    //       width: 117px !important;
    //     }
    //   }
    // }
    width: 100%;
    height: 240px;
    .check_name {
      padding-left: 0px;
      font-size: 14px;
      color: #707070;
    }
    .name {
      padding: 24px 0px;
      font-family: "苹方-简 中黑体";

      color: #000000;
      font-size: 16px;
    }
  }
  .people_info,
  .comp_info {
    width: 100%;
    height: 250px;
    .name {
      padding: 24px 0px;
      font-family: "苹方-简 中黑体";

      color: #000000;
      font-size: 16px;
    }
    .list {
      display: inline-block;
      width: 25%;
      padding-left: 0px;
      padding-bottom: 24px;
      font-family: "苹方-简 常规体";

      color: #707070;
      font-size: 14px;
    }
    .pic_list {
      padding-left: 0px;
      margin-bottom: 24px;
      .el-image {
        width: 76px;
        height: 76px;
        margin-right: 10px;
      }
    }
  }
  .comp_info {
    height: 210px;
  }
  .people_info {
    border-bottom: 1px solid #e8e8e8;
  }
}
</style>