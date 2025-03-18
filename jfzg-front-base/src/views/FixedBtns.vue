<template>
<!--  知识库搜索显示-->
  <div v-if="false" class="fixedBtns">
    <img src="@/assets/images/zhishiku/monkey.png" alt />
    <ul class="fixedBtnsUl">
      <div class="fixedBtnsDiv" v-for="(item, index) in imgUrls" :key="'img_'+index" v-if="checkCodeInArr(item.code)">
        <li
          @click="fixedBtnsClick(index)"
          @mouseover="mouseover(index)"
        >
          <i class="base-iconfont" :class="item.img" alt />
        </li>
      </div>
    </ul>
    <div class="knowledgeBaseDialog" v-show="visible" @mouseleave="dailogMouseleave">
      <header>
        <img src="@/assets/images/zhishiku/zhishiku_title.png" alt />
        <h3>知识检索库</h3>
      </header>
      <el-input v-model="keyword" placeholder="请输入您要检索的关键字">
        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
      </el-input>
    </div>
  </div>
</template>

<script>
import config from "@/setting.js";
import store from "@/store";
import { checkCodeInArr } from "@/utils/utils.js";
export default {
  data() {
    return {
      imgUrls: [
        {
          img: 'icon-fuwuzhongxin',
          code: "M001_006",
          name: "服务中心",
        },
        {
          img: 'icon-zhishiku',
          code: "M001_008",
          name: "知识库",
        },
        {
          img: 'icon-caozuoshouce',
          code: "M001_007",
          name: "驾驶舱",
        },
      ],
      visible: false,
      keyword: "",
    };
  },
  computed: {
    permission_views() {
      // 权限页面
      return store.getters.permission_views;
    },
  },
  watch: {
    permission_views(val) {
      if (val) {
        this.checkCodeAll(this.imgUrls);
      }
    },
  },
  mounted() {},
  beforeDestroy() {
    // window.removeEventListener("click", this.dialogclick);
  },
  methods: {
    checkCodeInArr(code) {
      // 权限
      let arr = this.permission_views;
      return checkCodeInArr(code, arr);
    },
    checkCodeAll(arr) {
      // 权限判断是否一个没有
      let views = this.permission_views;
      return arr.some((item) => checkCodeInArr(item.code, views));
    },
    search() {
      this.$router.push({
        name: "knowledgeBaseSearch",
        // params: { keyword: this.keyword },
      });
      this.$store.commit("app/SET_KEYWORD", this.keyword);
    },
    dialogclick(e) {
      let ul = document.querySelector(".fixedBtnsUl");
      let li = ul.childNodes[1];
      if (li.contains(e.target)) {
        return;
      }
      if (!document.querySelector(".knowledgeBaseDialog").contains(e.target)) {
        if (!this.visible) {
          return;
        }
        if (ul.contains(e.target)) {
          return;
        }
        this.visible = false;
      }
    },
    fixedBtnsClick(i) {
      if (i == 1) {
        // this.visible = !this.visible;
      } else if (i == 2) {
        window.open(`${config.baseUrl}/pmreport`);
      }
    },
    mouseover(i) {
      if (i == 1) {
        this.visible = true;
      } else {
        this.visible = false;
      }
    },
    dailogMouseleave() {
      this.visible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.fixedBtns {
  position: fixed;
  right: 0;
  top: 50%;
  margin-top: -25px;
  z-index: 999;
  > img {
    width: 64px;
    position: absolute;
    top: -40px;
    left: -14px;
  }
  .knowledgeBaseDialog {
    width: 454px;
    height: 128px;
    background: #ffffff;
    box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    position: absolute;
    padding: 20px;
    left: -460px;
    top: 12px;
    ::v-deep {
      .el-input {
      }
      .el-input-group__append {
        padding: 0 8px 0 8px;

        width: 40px;
        height: 40px;
        background: #ffffff;
        border-radius: 0px 8px 8px 0px;
        border: 1px solid #e5e5e5;
        border-left: none;
      }
      .el-input__inner {
        height: 40px;
        line-height: 40px;
      }
    }
    header {
      display: flex;
      align-items: center;
      margin-bottom: 14px;
      img {
        width: 22px;
      }
      h3 {
        font-size: 18px;
        font-weight: 600;
        color: #333333;
        margin-left: 6px;
      }
    }
  }
  ul {
    border-radius: 8px 0 0 8px;
    width: 48px;
    background: #1890ff;
    box-shadow: 0px 2px 20px 0px rgba(8, 31, 57, 0.2);
    .fixedBtnsDiv:not(:first-child){
      &::before{
        content: '';
        display: block;
        margin: -1px auto;
        width: 20px;
        height: 1px;
        background: rgba(255, 255, 255, 0.1);
      }
    }
    li {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 48px;
      cursor: pointer;
      position: relative;
      i {
        font-size: 18px;
        color: #fff;
        opacity: 0.8;
      }
      &:hover{
        i {
          opacity:1;
        }
        &::after {
          position: absolute;
          top: 4px;
          left: 4px;
          content: "";
          width: 40px;
          height: 40px;
          border-radius: 8px;
          background: #ffffff;
          opacity: 0.1;
        }
      }
    }
  }
}
</style>
