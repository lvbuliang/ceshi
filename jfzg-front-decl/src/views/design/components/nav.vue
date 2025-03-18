<template>
  <section class="designNavPage">
    <div class="work-inner" >
      <el-row>
        <el-col :span="12">
          <div class="nav">
            <img v-if="project.type == 'company'" src="@/assets/design/design_company_nav.png" alt />
            <img v-else src="@/assets/design/design_person_img.png" alt />
            <div class="nav_title">
              <div>
                <span class="title">{{
                  project.matterName 
                }}</span>
              </div>
              <div>
                <div class="workNumbering">
                  <label>{{ project.projectName }}</label>
                  <div class="projectNoBox" v-if="project.projectNo">
                    <span
                      class="projectNo"
                      v-for="(item, index) in project.projectNo"
                      :key="index"
                      v-if="item.name"
                      >{{ item.name }}</span
                    >
                  </div>
                  <div class="projectNoBox" v-if="project.Tel">
                    <span
                      >{{ project.Tel }}</span
                    >
                  </div>
                </div>
              </div>
            </div>
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
  mounted () {
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
.designNavPage {
  box-sizing: border-box;
  margin-bottom: 18px;
  .nav {
    display: flex;
    align-items: center;
    margin-left: -9px;
    img {
      width: 67px;
      height: auto;
    }
  }
  .nav_title {
    // padding-left: 8px;
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
    display: flex;
    align-items: center;
    .projectNoBox {
      display: flex;
      align-items: center;
      .projectNo {
        min-width: 58px;
        height: 24px;
        padding: 4px 13px;
        background: rgba(230, 247, 255, 0.5);
        border-radius: 12px;
        font-size: 12px;
        text-align: center;
        color: #1890ff;
        line-height: 17px;
        margin-right: 8px;
      }
    }
  }
}
</style>
