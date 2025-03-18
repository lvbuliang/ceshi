<template>
  <div>
    <div class="step_title" v-show="show">
      <div class="borders"></div>
      <div class="steps_text">审核流程</div>
    </div>
    <div class="step">
      <div class="steps">
        <el-steps
          :active="srTraceActive"
          finish-status="success"
          align-center
          :direction="direction"
        >
          <el-step
            v-for="(item, index) in srTraceArr"
            :title="item.title"
            :key="index"
          >
            <template slot="description">
              <div class="text" v-html="item.description"></div>
            </template>
          </el-step>
        </el-steps>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    srTraceActive: {
      type: Number,
      default: 0,
    },
    srTraceArr: {
      type: Array,
      default: [],
    },
    RTData: {
      type: Array,
      default: [],
    },
    show: Boolean,
    direction: String,
  },
  watch: {
    RTData: {
      handler(newVal) {
        if (newVal.length != 0) {
          this.getStep();
        }
      },
      deep: true,
      immediate: true,
    },
  },
  data() {
    return {};
  },
  methods: {
    getStep() {
      if (this.RTData.length == 0) {
        this.srTraceActive = 1;
      } else {
        if (this.RTData[0].color == "FAIL" || this.RTData[0].color == "ERROR") {
          this.srTraceActive = 0;
        } else {
          this.srTraceArr.forEach((item, index) => {
            if (item.title == this.RTData[0].name) {
              this.srTraceActive = index + 1;
            }
          });
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.text {
  -webkit-word-wrap: break-word;
  -webkit-word-break: break-word;
  word-wrap: break-word;
  display: inline-block;
  overflow-wrap: break-word;
  word-break: break-word;
}
.step {
  display: flex;
  justify-content: center;
  .steps {
    width: 80%;
    ::v-deep .el-step.is-center .el-step__description {
      font-size: 14px;
      font-weight: 500;
      color: rgba(0, 0, 0, 1);
      margin-top: 10px;
    }
  }
}
.step_title {
  display: flex;
  align-items: center;
  width: 50%;
  font-weight: 700;
  font-size: 16px;
  margin: 0 0 10px 0;
  .borders {
    width: 4px;
    height: 14px;
    border-radius: 5px;
    background: rgb(1, 118, 255);
    margin: 0 5px;
  }
  .steps_text {
    font-size: 16px;
    font-weight: 500;
  }
}
::v-deep .el-step__line {
  // border-color: #d3dce6; /* 未完成的颜色 */
  // border-style: dashed; /* 虚线 */
  border: 1.5px dashed #d3dce6;
}

::v-deep .el-step__line-inner {
  // border-color: #409eff; /* 已完成的颜色 */
  // border: 2px dashed #409eff !important;
  // height: 1px !important;
  border: 0;
}

::v-deep .el-step__icon {
  background: #fff; // 未完成的背景色
  color: #d3dce6;
}

::v-deep .is-process .el-step__icon {
  // background-color: #409eff; /* 进行中的背景色 */
  background: #409eff;
  border-color: #409eff;
  color: #fff;
}

::v-deep .is-finish .el-step__icon {
  // background-color: #409eff; /* 已完成的背景色 */
  // color: #fff;
  // background: #000 !important;

  // background-color: #409eff; /* 进行中的背景色 */
  background: #409eff;
  border-color: #409eff;
}
::v-deep .el-step__title {
  color: black; /* 完成步骤的文字颜色为黑色 */
}

.no-line .el-step__line {
  display: none;
}
::v-deep.el-step.is-horizontal .el-step__line {
  // height: 0.1px !important;
  background: #fff !important;
}
::v-deep.el-step .is-process-done {
  background-color: blue !important;
}
::v-deep .is-success .is-text {
  background: #409eff !important;
  border: none;
}
::v-deep .is-success .el-step__line {
  border: 1.5px dashed #409eff;
}
::v-deep .el-step__head.is-success {
  .el-icon-check:before {
    color: #fff;
  }
}
::v-deep .el-step__description.is-success {
  color: #4b4040  !important;
}
::v-deep .el-step.is-vertical .el-step__title {
  font-size: 12px;
}
::v-deep .el-step__description {
  font-size: 15px;
    padding: 7px 20px;
    background: rgb(242, 242, 242);
    border: 1px solid #409eff;
    border-radius: 10px;
}
::v-deep .el-step.is-vertical .el-step__title {
  font-size: 15px;
}
::v-deep .el-tabs__content {
  padding: 0 !important;
}
</style>
