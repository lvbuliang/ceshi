<template>
  <section class="srNavPage">
    <div class="work-inner" v-if="project && project.matterName">
      <el-row>
        <el-col :span="12">
          <div class="nav">
            <img :src="imgUrl" alt style="width: 48px; height: auto" />
            <div class="nav_title">
              <div>
                <span class="title">{{
                  project.matterName || "新型智慧城市全生命周期项目"
                }}</span>
              </div>
              <div>
                <div class="workNumbering">
                  <label>{{ projectName }}</label>
                  <span>{{ project.projectNo }}</span>
                </div>
              </div>
            </div>
            <!-- <div class="nav_tag">
              <el-tag v-for="tag in tags" :key="tag.name" size="mini">
                {{ tag.name }}
              </el-tag>
            </div> -->
          </div>
        </el-col>
        <el-col :span="12"> </el-col>
      </el-row>
    </div>
  </section>
</template>
<script>
import config from "@/settings.js";
export default {
  props: {
    project: {
      type: Object,
      default() {
        return {};
      },
    },
    projectName: {
      type: String,
      default() {
        return "项目编号：";
      },
    },
    tags: {
      type: Array,
      default() {
        return [];
      },
    },
    imgUrl: {
      type: String,
      default() {
        return require("@/assets/zhuanxiangfazhan.png");
      },
    },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
.srNavPage {
  box-sizing: border-box;
  margin-bottom: 18px;
  .nav {
    display: flex;
  }
  .nav_title {
    padding-left: 8px;
  }
  .nav_tag {
    .el-tag {
      background: #fff1c2;
      color: #ffaa22;
      border: none;
      border-radius: 2px;
      margin-right: 10px;
    }
  }
  .title {
    font-size: 24px;
    line-height: 28px;
    color: #333333;
  }

  .mack_label {
    color: rgba(0, 122, 255, 1);
  }
  .mack_val {
    padding-left: 5px;
  }
  .workNumbering {
    font-size: 12px;
    color: #666666;
  }
}
</style>
