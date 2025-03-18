<template>
  <section class="app-main">
    <top />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <breadcrumb
        id="breadcrumb-container"
        class="breadcrumb-container"
        v-if="!$route.meta.hideBread"
      />
      <transition name="fade-transform" mode="out-in">
        <div class="app-content">
          <not-juris v-if="$route.meta.type === 'noJurisdiction'"></not-juris>
          <router-view />
        </div>
      </transition>
    </el-scrollbar>
    <footer>版权所有：{{projectName}}</footer>
  </section>
</template>
<script>
import Breadcrumb from "@/components/Breadcrumb";
import top from "./Head/index.vue";
import NotJuris from "./noJurisdiction";
export default {
  name: "AppMain",
  components: {
    Breadcrumb,
    top,
    NotJuris
  },
  data () {
    return {
      projectName: ''
    }
  },
  computed: {
    cachedViews () {
      return this.$store.state.tagsView.cachedViews;
    },
    key () {
      return this.$route.path;
    },
    themeName () {
      return this.$store.state.permission.theme || ""
    },
  },
  mounted () {
    // console.log(this.$route.meta)
    if (this.themeName == 'changsha') {
      this.projectName = '长沙市新型智慧城市全周期项目后台管理系统'
    } else if (this.themeName == 'yuhua') {
      this.projectName = '雨花台区政务信息化项目后台管理系统'
    } else {
      this.projectName = '解放号网络科技有限公司'
    }
  },
};
</script>
<style lang="scss" scoped>
@import "~@/styles/variables.scss";

.app-main {
  width: 100%;
  background: rgba(240, 242, 245, 1);
  .app-content {
    margin: 24px;
    background: #fff;
    margin-bottom: 0;
    padding: 30px 30px 78px 30px;
    border-radius: 2px;
  }
}

.hasTagsView {
  .app-main {
    position: relative;
    top: $tagsView;
    height: calc(100% - #{$tagsView});
    overflow: hidden;
  }
}
</style>
<style lang="scss">
// fix css style bug in open el-dialog
.app-main {
  height: 100%;

  .el-scrollbar {
    height: calc(100% - 100px);
    overflow: hidden;

    &__wrap {
      overflow-x: hidden;
    }

    &__thumb {
      background: rgba(0, 0, 0, 0.5);
    }
  }
  .el-scrollbar__view {
    overflow-x: hidden;
  }
  footer {
    height: 35px;
    line-height: 35px;
    text-align: center;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.45);
    background: rgba(240, 242, 245, 1);
  }
}
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}

</style>
