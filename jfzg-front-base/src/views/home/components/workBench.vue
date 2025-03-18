<template>
  <div>
    <div class="createProject">
      <div class="createtab" style="" @click="createProject">
        <div class="createtabs">
          <img src="../../../assets/images/home/test1.png" alt="创建项目" />
        </div>
        <div>创建项目</div>
      </div>
      <div class="createtab">
        <div class="createtabs">
          <img src="../../../assets/images/home/test2.png" alt="填写周报" />
        </div>
        <div>填写周报</div>
      </div>
      <div class="createtab">
        <div class="createtabs">
          <img src="../../../assets/images/home/test3.png" alt="发起变更" />
        </div>
        <div>发起变更</div>
      </div>
      <div class="createtab">
        <div class="createtabs">
          <img src="../../../assets/images/home/test4.png" alt="变更审核" />
        </div>
        <div>变更审核</div>
      </div>
      <div class="createtab">
        <div class="createtabs">
          <img src="../../../assets/images/home/test5.png" alt="上传合同" />
        </div>
        <div>上传合同</div>
      </div>
      <div class="createtab">
        <div class="createtabs">
          <img src="../../../assets/images/home/test6.png" alt="风险问题" />
        </div>
        <div>风险问题</div>
      </div>
      <div class="createtab">
        <div class="createtabs">
          <img src="../../../assets/images/home/test7.png" alt="更多" />
        </div>
        <div>更多</div>
      </div>
    </div>
  </div>
</template>

<script>
import store from "@/store";
import { routerGo } from "@/utils/utils.js"; // 引入跨应用路由跳转
export default {
  name: "workBench",
  data() {
    return {};
  },
  computed: {
    userInfo() {
      return JSON.parse(sessionStorage.getItem("userInfo"));
    },
  },
  methods: {
    createProject() {
      if (this.userInfo.currentRole.roleCode != "FZGHC_JBRBF") {
        return;
      }
      // 更新tabs页签
      let element = {
        url: "/subdecl/#/planProject/createProject",
        title: "项目信息",
      };
      this.$store.commit("tabs/UPDATE_TABS_LIST", element);
      this.$store.commit("tabs/UPDATE_CURRENT_PAGE", element.url);
      routerGo("/subdecl/#/planProject/createProject");
    },
  },
};
</script>

<style lang="scss" scoped>
.createProject {
  width: 100%;
  padding: 20px;
  background: rgba(255, 255, 255, 1);
  display: flex;
  border-radius: 0px 10px 10px 10px;
  justify-content: space-evenly;

  .createtab {
    width: 152px;
    height: 76px;
    opacity: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .createtabs {
      width: 48px;
      height: 48px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 10px;
      background: rgba(227, 238, 255, 1);
      margin-bottom: 8px;
    }
  }
}
</style>
