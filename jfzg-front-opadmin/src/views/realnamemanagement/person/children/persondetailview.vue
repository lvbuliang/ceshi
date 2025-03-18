<template>
  <div class="checkpar">
    <div class="check_status" v-show="registFlag">
      <p class="icon_status">
        <img :src="registFlag==1?yes:no" alt />
        <span>{{registFlag==1?'审核通过':'审核不通过'}}</span>
      </p>
      <!-- <p class="detail_text">--</p> -->
    </div>
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
        <span>{{checkObj.idencode?checkObj.idencode:'--'}}</span>
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
  api_queryPersonList, //获取个人列表
  api_personAuthInfo, //个人认证信息
  api_personCheckPass, //个人审核通过
  api_personCheckReject, //个人审核不通过
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
      src_person_list: [],
      baseUrl: config.imgBaseUrl,
      trajectoryData: [],
      checkObj: {
        fullname: "", //姓名
        mobile: "", //
        userId: "", //
        idencode: "", //证件号
        idenimgpos: "", //身份证正面照片
        idenimgrev: "", //身份证反面照片
        idenimghand: "", //手持身份证照片
      },
      registFlag: "",
      yes: require("@/assets/yes.png"),
      no: require("@/assets/no.png"),
    };
  },
  mounted() {
    this.getPersonData();
    this.getTrace();
  },
  methods: {
    // 获取留痕
    getTrace() {
      let id = this.$route.query.jfid;
      common_trajectoryList(id, "GYSCYSMRZ")
        .then((res) => {
          //console.log(res.data);

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
          this.registFlag = res.data.status;
          this.src_person_list.push(this.baseUrl + res.data.idenimghand);
          this.src_person_list.push(this.baseUrl + res.data.idenimgpos);
          this.src_person_list.push(this.baseUrl + res.data.idenimgrev);
          //console.log(this.src_person_list)
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
  overflow: hidden;
  .check_status {
    display: flex;
    align-items: center;
    justify-content: center;
    .icon_status {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .detail_text {
      font-size: 16px;
      color: gray;
    }
    img {
      width: 50px;
      height: 50px;
    }
    span {
      margin-left: 20px;
      font-size: 30px;
      color: #000000;
      font-weight: 500;
    }
    width: 100%;
    height: 145px;
    border-bottom: 1px solid #f0f2f5;
  }
  .check_btn {
    width: 100%;
    text-align: center;
    padding-top: 32px;
    background-color: #f0f2f5;
    .el-button {
      border-radius: 16px;
    }
  }
  .check_text {
    width: 100%;
    height: 240px;
    border-top: 1px solid #f0f2f5;
    .check_name {
      padding-left: 0px;
      font-size: 14px;
      color: #707070;
    }
    .name {
      padding: 24px 0px;
      font-family: "苹方-简 中黑体";
      font-weight: 500;
      color: #000000;
      font-size: 16px;
    }
  }
  .people_info,
  .comp_info {
    width: 100%;
    height: 250px;
    border-bottom: 1px solid #f0f2f5;
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
    height: 220px;
  }
  .people_info {
    border-bottom: 1px solid #e8e8e8;
  }
}
</style>