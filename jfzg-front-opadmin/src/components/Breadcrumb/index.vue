<template>
  <div class="app-breadcrumb">
    <el-breadcrumb separator="/">
      <transition-group name="breadcrumb">
        <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
          <span
            v-if="item.redirect==='noRedirect'||index==levelList.length-1 || index == 0"
            :class="'no-redirect' + index"
          >{{ item.meta.title }}</span>
          <a v-else @click.prevent="handleLink(item,index)">{{ item.meta.title }}</a>
        </el-breadcrumb-item>
      </transition-group>
    </el-breadcrumb>
    <div class="navTxt">{{navTxt}}</div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  data() {
    return {
      levelList: null,
      navTxt: "",
    };
  },
  watch: {
    $route(route) {
      // if you go to the redirect page, do not update the breadcrumbs
      if (route.path.startsWith("/redirect/")) {
        return;
      }
      if (route.meta.common) {
        this.levelList.push({
          meta: route.meta,
          path: route.fullPath,
          name: route.name,
          redirect: route.redirect,
          query: route.query,
          params: route.params,
        });
        return;
      }
      this.getBreadcrumb();
    },
    levelList(n, o) {
      this.SET_BREADDATA(n);
    },
  },
  created() {
    this.getBreadcrumb();
  },
  methods: {
    ...mapMutations("user", ["SET_BREADDATA"]),
    getBreadcrumb() {
      if (this.$route.meta.common) {
        this.levelList = JSON.parse(localStorage.getItem("breadData"));
        if (
          this.$route.name != this.levelList[this.levelList.length - 1].name
        ) {
          this.levelList.push({
            meta: this.$route.meta,
            path: this.$route.fullPath,
            name: this.$route.name,
            redirect: this.$route.redirect,
            query: this.$route.query,
            params: this.$route.params,
          });
        }

        return;
      }
      // only show routes with meta.title
      let matched = this.$route.matched.filter(
        (item) => item.meta && item.meta.title
      );
      const first = matched[0];

      if (!this.isDashboard(first)) {
        //matched = [{ path: '/dashboard', meta: { title: 'Dashboard' }}].concat(matched)
      }

      this.levelList = matched.filter(
        (item) => item.meta && item.meta.title && item.meta.breadcrumb !== false
      );
      this.navTxt = this.levelList.slice(-1);
      this.navTxt = this.navTxt[0].meta.title;
      this.levelList = this.levelList.map((res) => {
        return {
          meta: res.meta,
          path: res.path,
          name: res.name,
          redirect: res.redirect,
          query: res.query,
          params: res.params,
        };
      });
      this.levelList.pop();
      this.levelList.push({
        meta: this.$route.meta,
        path: this.$route.fullPath,
        name: this.$route.name,
        redirect: this.$route.redirect,
        query: this.$route.query,
        params: this.$route.params,
      });
    },
    isDashboard(route) {
      const name = route && route.name;
      if (!name) {
        return false;
      }
      return (
        name.trim().toLocaleLowerCase() === "Dashboard".toLocaleLowerCase()
      );
    },
    handleLink(item,index) {
      if(index == 0) return
      const { redirect, path } = item;
      if (redirect) {
        this.$router.push(redirect);
        return;
      }
      this.$router.push(path);
    },
  },
};
</script>

<style lang="scss">
.app-breadcrumb {
  font-size: 14px;
  padding-left: 32px;
  background: #fff;
  height: 98px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  .el-breadcrumb__inner a {
    color: rgba(0, 0, 0, 0.45);
    font-weight: 400;
    &:hover {
      color: #000;
    }
  }
  .no-redirect0{
    color: rgba(0, 0, 0, 0.45);
  }
  .no-redirect1 {
    color: rgba(0, 0, 0, 0.65);
    cursor: text;
  }
  .navTxt {
    font-size: 20px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    line-height: 28px;
  }
}
</style>
