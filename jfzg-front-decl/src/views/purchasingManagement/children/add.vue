<template>
  <div class="container">
    <!-- 多标段 -->
    <multipleForm ref="multipleForm" />

    <!-- 底部按钮组 -->
    <div class="bottom_btns" :style="{ width: `calc(100% - ${widthB})` }">
      <el-button v-if="$route.query.procurementStatus != '已提交'" size="small" type="primary" @click.prevent="saveForm">暂存</el-button>
      <el-button size="small" type="primary" @click.prevent="tjForm">提交</el-button>
      <el-button class="gobackList" size="small" @click.prevent="returnList"
        >返回列表</el-button
      >
      <el-button  v-if=isFromWorkBench type='success' size="small" @click="backWorkBench">前往工作台</el-button>
    </div>
  </div>
</template>

<script>
// 多标段 | 单标段 页面
import multipleForm from "../components/multipleForm.vue";
export default {
  name: "purchasingManagement_add",
  components: { multipleForm },
  data() {
    return {
      isFromWorkBench: false,//是否从工作台进入
      widthB: "",
    };
  },
  computed: {
    isProcurementEdit() {
      return Number(this.$route.query.isProcurementEdit);
    }
  },
  beforeMount() {
    if (this.isProcurementEdit === 1) {
      // 说明不是第一次进入编辑 需要调用查询详情接口回显
      this.$nextTick(() => {
        this.$refs.multipleForm.preview(); //回显
      });
    }
  },
  mounted() {
    if(this.$route.query.activeName=='待办'||this.$route.query.activeName=='已办'){ 
      this.isFromWorkBench = true
    }
    this.initResizeObserver();
    if (this.isProcurementEdit === 1) {
      // 说明不是第一次进入编辑 需要调用查询详情接口回显
      this.$nextTick(() => {
        this.$refs.multipleForm.preview(); //回显
      });
    }
  },
  beforeDestroy() {
    this.destroyResizeObserver();
  },
  methods: {
    backWorkBench(){
    this.$router.go(-1)
    },
    // 暂存
    saveForm() {
      this.$confirm(
        `是否暂存此项目, 继续?`,
        "提示",
        {
          confirmButtonText: "确定暂存",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
            this.$nextTick(() => {
              this.$refs.multipleForm.saveFunc();
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    // 提交
    tjForm() {
      this.$confirm(
        `是否提交此项目, 继续?`,
        "提示",
        {
          confirmButtonText: "确定提交",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
            this.$nextTick(() => {
              this.$refs.multipleForm.tjFunc();
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    // 返回列表
    returnList() {
      this.$router.push({
        name: "purchasingManagement",
      });
    },
    initResizeObserver() {
      this.resizeObserver = new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          this.widthB = entry.contentRect.width + "px";
        });
      });
      this.resizeObserver.observe(document.querySelector(".main-menu-box"));
    },
    destroyResizeObserver() {
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  padding: 20px;
  height: calc(100% - 70px);
  overflow-y: auto;
}

.bottom_btns {
  position: fixed;
  bottom: 0;
  width: calc(100% - 220px);
  border-left: 2px solid rgb(230, 230, 230);
  background: #fff;
  z-index: 10;
  right: 0;
  padding: 20px 0;
  text-align: center;
  border-top: 1px solid #e6e6e6;
  .gobackList {
    display: inline-block;
    margin-left: 20px;
  }
  .workflow_button {
    box-sizing: border-box;
    display: inline-block;
    margin: 0 4px;
    button {
      padding: 0px 24px;
      line-height: 32px;
      border-radius: 16px;
    }
  }
}
</style>
