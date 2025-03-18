<template>
  <div class="pageBox memberBox">
    <div class="header">
      <div class="optionTab">
        <span :class="{'active': name == 'first'}"
          @click="showTab('first')">承建单位成员</span>
        <span :class="{'active': name == 'third'}"
          @click="showTab('third')">建设单位成员</span>
        <span v-if="ruleForm.supervisorName"
          :class="{'active': name == 'two'}"
          @click="showTab('two')">监理单位成员</span>
      </div>
    </div>

    <!-- 承建单位 -->
    <div class="first"
      v-if="name=='first' &&JSON.stringify(memberdatas) != '{}'&&(memberdatas.CJDW_FZR)">
      <viewMode userType="1"
        :info="details"
        type="cjdw"
        key="cjdw"
        :memberdatas="memberdatas"
        :buid="CJDWbuid"
        :ruleForm="ruleForm">
        <div slot="cjdw">
          <tabCard @switchTab="switchTabMs"></tabCard>
          <tabSlide v-if="active!=0"></tabSlide>
        </div>
      </viewMode>
    </div>
    <!--建设单位-->
    <div class="third"
      v-else-if="name=='third' &&memberdatas2.JSDW_FZR">
      <viewMode userType="3"
        :info="details"
        type="jsdw"
        key="jsdw"
        :memberdatas2="memberdatas2"
        :buid="JSDWbuid"
        :ruleForm="ruleForm"></viewMode>
    </div>
    <!--监理单位-->
    <div class="two"
      v-else-if="name=='two' &&memberdatas1.JLDW_FZR">
      <viewMode userType="2"
        :info="details"
        type="jldw"
        key="jldw"
        :memberdatas1="memberdatas1"
        :buid="JLDWbuid"
        :ruleForm="ruleForm"></viewMode>
    </div>
  </div>
</template>
<script>
import tabCard from "./tabCard";
import viewMode from "./viewMode";
import tabLine from "./tabLine";
import tabSlide from "./tabSlide"
export default {
  components: { tabLine, viewMode, tabCard, tabSlide },
  data () {
    // 根据userInfo返回的角色不同显示顺序不同,不同单位的人权限不一样
    //
    return {
      userType: "1", //代表角色
      type: "", //第一个显示哪一个选项卡
      name: "", //当前用于哪一步
      active: "0", //显示承建单位的哪个投入
      details: {
        cjdw: "承建单位成员",
        jsdw: "建设单位成员",
        jldw: "监理单位成员"
      }
    };
  },
  props: {
    memberdatas: {
      type: Object
    },
    memberdatas1: {
      type: Object
    },
    memberdatas2: {
      type: Object
    },
    CJDWbuid: {
      type: Number
    },
    JLDWbuid: {
      type: Number
    },
    JSDWbuid: {
      type: Number
    },
    ruleForm: { type: Object }
  },
  methods: {
    //一级显示
    showTab (name) {
      this.name = name;
    },

    /**
     * 承建单位一级显示
     */
    switchTabMs (data) {
      this.active = data.toString();
    }
  },
  created () {
    this.showTab("first");
  }
};
</script>
<style lang="scss" scoped>
.pageBox {
  padding-top: 0;
}
.tabLineBox {
  // margin-top: 30px;
  padding: 0 10px;
}
.first .two {
  padding: 10px;
}
.backBox {
  background: rgba(236, 242, 252, 0.49);
  margin-top: 20px;
  padding: 20px 20px 10px 20px;
  border: 1px solid rgba(200, 219, 233, 1);
}
.header {
  width: 100%;
  display: flex;
  justify-content: center;
  .optionTab {
    // width: 300px;
    // height: 50px;
    // display: flex;
    // justify-content: space-between;
    span {
      // flex-grow: 1;
      width: 128px;
      height: 32px;
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(24, 144, 255, 1);
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(24, 144, 255, 1);
      line-height: 32px;
      display: inline-block;
      text-align: center;
      // justify-content: center;
      // align-items: center;
      cursor: pointer;
    }

    span:nth-last-child(2){
      border-left: none;
      border-right: none;
    }
    span:nth-last-child(1) {
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }
    span:nth-child(1) {
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
      border: 1px solid rgba(24, 144, 255, 1);
    }
    .active {
      background: rgba(24, 144, 255, 1);
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      line-height: 32px;
    }
  }
}
</style>
<style>
.memberBox .el-tabs__nav-wrap {
  box-shadow: 0px 4px 6px 0px rgba(113, 168, 228, 0.1);
}
</style>