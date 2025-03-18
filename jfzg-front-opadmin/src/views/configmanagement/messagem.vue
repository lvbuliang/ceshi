<template>
  <div class="config_m">
    <div class="list">
      <label>发送消息开关：</label>
      <el-switch
        v-model="ruleForm.sysSendMessage"
        @change="on_off"
        :active-text="ruleForm.sysSendMessage?'开启':'关闭'"
      ></el-switch>
    </div>
    <div class="list">
      <label>待办是否发送短信：</label>
      <el-switch
        v-model="ruleForm.schduleSendSms"
        @change="on_off"

        :active-text="ruleForm.schduleSendSms?'开启':'关闭'"
      ></el-switch>
    </div>
    <div class="list">
      <label>待办是否发送邮件：</label>
      <el-switch
        v-model="ruleForm.schduleSendEmail"
        @change="on_off"

        :active-text="ruleForm.schduleSendEmail?'开启':'关闭'"
      ></el-switch>
    </div>
    <!-- <div class="list">
      <label>待办预警消息提醒机制：</label>
      每&#x3000;
      <el-input-number
        size="small"
        v-model="comm_warn_on_off"
        controls-position="right"
        @change="on_off()"
        :min="1"
        :max="10"
      ></el-input-number>&#x3000;天
    </div> -->
    <div class="list">
      <label>待办预警消息短信：</label>
      <el-switch
        v-model="ruleForm.schduleWarningSms"
        @change="on_off"

        :active-text="ruleForm.schduleWarningSms?'开启':'关闭'"
      ></el-switch>
    </div>
    <div class="list">
      <label>待办预警消息邮件：</label>
      <el-switch
        v-model="ruleForm.schduleWarningTime"
        @change="on_off"

        :active-text="ruleForm.schduleWarningTime?'开启':'关闭'"
      ></el-switch>
    </div>
    <div class="list">
      <label>待办到期提醒时间：</label>
      <el-input-number
        size="small"
        v-model="ruleForm.schduleWarningEmail"
        controls-position="right"
        @change="on_off"
        :min="1"
        :max="10"
      ></el-input-number>&#x3000;天
    </div>
  </div>
</template>

<script>
import {
  view_xiaoxi_biaozhunhua,//查询
  set_xiaoxi_biaozhunhua//保存
} from "@/api/configManage/biaozhunhua_configManage";
export default {
  data() {
    return {
      ruleForm:{},
      messKeyid: "",
    };
  },
  mounted() {
    this.queryMessageConfigList();
  },
  methods: {
    // 消息配置查询
    queryMessageConfigList() {
      view_xiaoxi_biaozhunhua().then((res) => {
        if (res.msg.message == "SUCCESS") {
          res.data.sysSendMessage = res.data.sysSendMessage ===1?false:true
          res.data.schduleSendSms = res.data.schduleSendSms ===1?false:true
          res.data.schduleSendEmail = res.data.schduleSendEmail ===1?false:true
          res.data.schduleWarningSms = res.data.schduleWarningSms ===1?false:true
          res.data.schduleWarningTime = res.data.schduleWarningTime ===1?false:true
          this.ruleForm = res.data
          this.messKeyid = res.data.id;
        }
      });
    },
    // 开关：
    on_off() {
      let data = {
        id: parseInt(this.messKeyid),
        sysSendMessage :this.ruleForm.sysSendMessage ===false?1:0,
        schduleSendSms :this.ruleForm.schduleSendSms ===false?1:0,
        schduleSendEmail :this.ruleForm.schduleSendEmail ===false?1:0,
        schduleWarningSms :this.ruleForm.schduleWarningSms ===false?1:0,
        schduleWarningTime :this.ruleForm.schduleWarningTime ===false?1:0,
        schduleWarningEmail:this.ruleForm.schduleWarningEmail
      };
      set_xiaoxi_biaozhunhua(data).then((res) => {
        if (res.msg.message == "SUCCESS") {
          this.$message({
            message: "操作成功",
            type: "success",
          });
        } else {
          this.$message.error("操作失败");
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.config_m {
  .list {
    label {
      margin-right: 20px;
      display: inline-block;
      width: 180px;
      text-align: right;
      font-size: 14px;
      color: #000000;
    }
    margin: 32px;
    margin-top: 52px;
  }
  width: 100%;
  height: 650px;
  overflow: hidden;
  margin-left: 300px;
}
</style>