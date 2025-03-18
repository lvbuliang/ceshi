<template>
  <section class="Sr_Nav_Page progressNavpage">
    <div class="work-inner">
      <el-row>
        <el-col :span="22">
          <div class="nav">
            <img :src="configData[type].image" alt style="width: 48px; height: auto" />
            <div class="nav_title">
              <div class="projectTitle">
                <span class="title">{{ project[configData[type].title] }}</span>
                <span class="tag">{{tag}}</span>
              </div>
              <div class="tips" v-if="configData[type].name && type != '5'">
                <div class="workNumbering">
                  <label>{{ configData[type].name }}：</label>
                  <span>{{ project[configData[type].code] ? project[configData[type].code] : '-' }}</span>
                </div>
                <div class="workNumbering">
                  <label>{{ configData[type].periodName }}：</label>
                  <span>{{ project[configData[type].period] ? project[configData[type].period] : '-' }}</span>
                </div>
                <div class="workNumbering">
                  <label>{{ configData[type].jsdwName }}：</label>
                  <span>{{ project[configData[type].jsdw] ? project[configData[type].jsdw] : '-' }}</span>
                </div>
                <div class="workNumbering">
                  <label>{{ configData[type].cjdwName }}：</label>
                  <span>{{ project[configData[type].cjdw] ? project[configData[type].cjdw] : '-' }}</span>
                </div>
                <div class="workNumbering">
                  <label>{{ configData[type].jldwName }}：</label>
                  <span>{{ project[configData[type].jldw] ? project[configData[type].jldw] : '-' }}</span>
                </div>
              </div>
              <div v-else class="expertWorkNumbering">
                <div class="workNumbering">
                  <label>
                    <i class="el-icon-phone"></i>
                    {{ project[configData[type].phone] }}
                  </label>
                  <label>
                    <i class="el-icon-location-outline"></i>
                    {{project[ configData[type].address ]}}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="2">
          <div class="back" @click="backToList">
            <i class="base-iconfont icon-return1"></i>
            <span>返回</span>
          </div>
        </el-col>
      </el-row>
    </div>
  </section>
</template>
<script>
import planImg from "./plan.png";
import projectImg from "./project.png";
import yearPlanImg from "./yearPlan.jpg";
import taskImg from "./task.png";
import zhuanjia from "./zhuanjia.png";
export default {
  name: "SrNavPage",
  props: {
    project: {
      type: Object,
      default() {
        return {};
      },
    },
    type: {
      type: Number,
      default: () => {
        return 1; // 1是规划头部，2是项目头部
      },
    },
    tag: String, // 项目名称后面的标签
    routerName: String, // 返回
  },
  data() {
    return {
      configData: {
        1: {
          image: planImg,
          title: "name",
          name: "规划编号",
          code: "code",
        },
        2: {
          image: projectImg,
          title: "projectName",
          name: "项目编号",
          code: "projectCode",
          periodName: "项目周期",
          period: "projectPeriod",
          jsdwName: "建设部门",
          jsdw: "constructUnitFullName",
          cjdwName: "承建部门",
          cjdw: "contractUnitFullName",
          jldwName: "监理单位",
          jldw: "controlUnitFullName",
        },
        3: {
          image: yearPlanImg,
          title: "yearPlanName",
          name: "年度项目计划编号",
          code: "yearPlanCode",
        },
        4: {
          image: taskImg,
          title: "taskName",
        },
        5: {
          title: "name",
          image: zhuanjia,
          phone: "phone",
          address: "addressName",
        },
      },
    };
  },
  mounted() {},
  methods: {
    backToList() {
      this.$router.push({ name: this.routerName });
    },
  },
};
</script>
<style lang="scss" scoped>
.progressNavpage {
  .projectTitle {
    display: flex;
    align-items: center;
    .tag {
      background: #e6f7ff;
      border-radius: 12px;
      font-size: 12px;
      color: #1890ff;
      margin-left: 8px;
      padding: 2px 8px;
    }
  }

  .tips {
    margin-top: 2px;
    display: flex;
    .workNumbering {
      padding: 0 16px;
      border-left: 1px solid #cccccc;
      label {
        color: #999;
      }
      span {
        color: #333;
      }
      &:first-child {
        padding-left: 0;
        border: none;
      }
    }
  }

  .back {
    text-align: right;
    line-height: 50px;
    cursor: pointer;
  }
}
</style>
