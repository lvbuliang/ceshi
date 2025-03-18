<template>
  <div class="pageBox memberBox">
    <div class="tabLineBox">
      <tabLine :tabLineList="tabLineList"
        @showTab="showTab"
        type="first"></tabLine>
    </div>
    <!-- 承建单位 -->
    <div class="first"
      v-if="memberdatas.CJDW_FZR &&CJDWbuid &&JSON.stringify(memberdatas) != '{}'">
      <viewMode userType="1"
        :info="details"
        type="cjdw"
        key="cjdw"
        :memberdatas="memberdatas"
        :buid="CJDWbuid"
        :CJDWbuid="CJDWbuid"
        :ruleForm="ruleForm"></viewMode>
    </div>
  </div>
</template>
<script>
import viewMode from "./viewMode";
import tabLine from "./tabLine";
export default {
  components: { tabLine, viewMode },
  data () {
    // 根据userInfo返回的角色不同显示顺序不同,不同单位的人权限不一样
    return {
      userType: "1", //代表角色
      type: "first", //第一个显示哪一个选项卡
      name: "first", //当前用于哪一步
      active: "0", //显示承建单位的哪个投入
      tabLineList: [{ label: "承建单位成员", name: "first" }],
      details: {
        cjdw: "承建单位成员"
      }
    };
  },
  props: {
    memberdatas: {
      type: Object
    },
    CJDWbuid: {
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
  created () { }
};
</script>
<style lang="scss" scoped>
.pageBox {
  padding-top: 0;
}
.tabLineBox {
  // margin-top: 30px;
  padding: 0 5px;
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
</style>
<style>
.memberBox .el-tabs__nav-wrap {
  box-shadow: 0px 4px 6px 0px rgba(113, 168, 228, 0.1);
}
</style>