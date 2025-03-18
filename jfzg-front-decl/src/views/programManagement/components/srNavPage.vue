<template>
  <section class="srNavPage">
    <div class="work-inner" v-if="project && project.projectName">
      <el-row>
        <el-col style='display: flex;'>
          <div class="nav">
            <img
              src="../../../assets/zhuanxiangfazhan.png"
              alt
              style="width: 48px; height: auto"
            />
            <div class="nav_title">
              <div>
                <span class="title">{{
                  project.projectName || "新型智慧城市全生命周期项目"
                }}</span>
              </div>
              <div>
                <div class="workNumbering">
                  <label>{{ projectName }}</label>
                  <span>{{ project.projectCode }}</span>
                  <!-- 注释掉什么类的项目 -->
                  <!-- <span class="sort">{{ project.kind==0?'专业类项目':'公共类项目' }}</span> -->
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
    .sort {
      line-height: 20px;
      text-align: center;
      width: 80px;
      display: inline-block;
      border-radius: 4px;
      background-color: #1890ff;
      color: #fff;
      margin-left: 14px;
    }
  }
}
</style>
