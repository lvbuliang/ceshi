<template>
  <ul :class="{ project_accordion: true, project_white: mode === 'blue' }">
    <li
      v-for="(item, index) in $attrs.projectSdtableItemList"
      :key="index"
      :class="{ node_item: true, active_node: nodeIndex === index }"
    >
      <div class="project_info" @click="getProjectInfo(item, index)">
        <!-- 产品定的统一用三个点图标 -->
        <img
          v-if="mode === 'blue'"
          class="node_png"
          :src="pictureBlueArr[index]"
        />
        <img class="node_png" :src="pictureArr[index]" v-else />
        <!-- <div class="node_status">
                    {{ item.statusName }}
                </div> -->
        <div class="node_name">
          {{ item.itemName }}
        </div>
        <!-- 增加项目状态2.25 -->
        <div>
          <div class="status">{{ item.statusName }}</div>
        </div>
      </div>
      <div class="project_detail" v-if="nodeIndex === index">
        <div class="project_detail_left">
          <ul class="field_content">
            <li
              v-for="(value, key) in JSON.parse(item.frontJsonFormat)"
              :key="key"
            >
              <label class="field_label">{{ value.label }}：</label>
              <span class="field_value" :title="projectDetail[value.value]">{{
                projectDetail[value.value]
              }}</span>
            </li>
          </ul>
          <!-- 步骤条组件 -->
          <!-- <sr-step
                        v-model="steps"
                        :mode="mode"
                        v-if="steps && steps.length"
                    ></sr-step>
                    <sr-step v-model="placeSteps" :mode="mode" v-else>
                    </sr-step> -->
          <SrSteps1
            v-model="steps"
            :mode="mode"
            v-if="steps && steps.length"
          ></SrSteps1>
          <SrSteps1 v-model="placeSteps" :mode="mode" v-else> </SrSteps1>
        </div>
        <!-- 立项的时候不展示下拉 2.25-->
        <div class="project_detail_right" v-if="item.itemName != '立项'">
          <i
            class="el-icon-arrow-down"
            :class="{ active: showcharts }"
            @click.stop="showCharts(item)"
          ></i>
        </div>
        <img
          class="sign"
          src="@/assets/standtable/planIn.png"
          v-if="projectDetail.typeName === '计划内'"
        />
        <img
          class="sign"
          src="@/assets/standtable/planOut.png"
          v-else-if="projectDetail.typeName === '计划外'"
        />
      </div>
    </li>
  </ul>
</template>

<script>
import { getProjectBasciInfo } from "@/api/home";
import keyan_blue from "@/assets/standtable/keyan_blue.png";
import keyan from "@/assets/standtable/keyan.png";
import gaisuan_blue from "@/assets/standtable/gaisuan_blue.png";
import gaisuan from "@/assets/standtable/gaisuan.png";
import shishi_blue from "@/assets/standtable/shishi_blue.png";
import shishi from "@/assets/standtable/shishi.png";
import yanshou_blue from "@/assets/standtable/yanshou_blue.png";
import yanshou from "@/assets/standtable/yanshou.png";
import pingjia_blue from "@/assets/standtable/pingjia_blue.png";
import pingjia from "@/assets/standtable/pingjia.png";
import diaodu_blue from "@/assets/standtable/diaodu_blue.png";
import diaodu from "@/assets/standtable/diaodu.png";
import shenbao_blue from "@/assets/standtable/shenbao_blue.png";
import shenbao from "@/assets/standtable/shenbao.png";
import SrSteps1 from "../../../components/SrStep";
export default {
  components: {
    SrSteps1,
  },
  props: {
    activeIndex: {
      type: Number,
      default: () => {
        return 0;
      },
    },
    stepIndex: Number,
    mode: {
      type: String,
      default: () => {
        return "blue";
      },
    },
  },
  mounted() {
    this.nodeIndex = this.activeIndex;
    console.log(this.$attrs)
    if(this.$attrs.defaultItemId==0){
      this.nodeIndex=0
    }else if(this.$attrs.defaultItemId==1){
      this.nodeIndex=1

    }else if(this.$attrs.defaultItemId==2){
      this.nodeIndex=2

    }else if(this.$attrs.defaultItemId==3){
      this.nodeIndex=3
    }
    console.log(this.$attrs.projectSdtableItemList)
    // 默认查询可研的模块
    this.getProjectInfo(this.$attrs.projectSdtableItemList[this.nodeIndex],this.nodeIndex);
    document.querySelector("body").addEventListener("click", () => {
      this.showcharts = false;
      this.$emit("showCharts", { projectDetail: {} }, false);
    });
  },
  data() {
    return {
      nodeIndex: null, // 控制节点显示
      showcharts: false,
      projectDetail: {},
      steps: [], // 步骤条数据
      placeSteps: [
        { nodeName: "开始", status: "0" },
        [],
        { nodeName: "结束", status: "0" },
      ],
      moduleName: "",
      pictureArr: [shenbao, keyan, gaisuan, shishi, yanshou, diaodu, pingjia],
      pictureBlueArr: [
        shenbao_blue,
        keyan_blue,
        gaisuan_blue,
        shishi_blue,
        yanshou_blue,
        diaodu_blue,
        pingjia_blue,
      ],
    };
  },
  methods: {
    // 点击项目节点获取该节点的详情
    getProjectInfo(item, index) {
      this.moduleName = item.itemName;
      this.nodeIndex = index;
      getProjectBasciInfo({
        itemId: item.itemId,
        projectId: this.$attrs.id,
      }).then((res) => {
        if (res.msg.code === "0000") {
          // 循环判断对象里的哪个字段有值就赋值给详情
          Object.keys(res.data).forEach((item) => {
            if (res.data[item]) {
              this.projectDetail = res.data[item];
            }
          });
          this.steps =
            this.projectDetail.process || this.projectDetail.processList;
          let Index = null;
          if (this.steps) {
            // 寻找步骤条中最后一个状态为2的数据，将其改为1，显示进行中图标
            this.steps.map((val, i) => {
              if (val.status == "2") {
                Index = i;
              }
            });
            // 如果所有节点状态都为2，就全部显示不带图标的实心点
            if (Index !== null && Index < this.steps.length - 1) {
              this.steps[Index].status = "1";
            }
          }
        }
      });
    },
    showCharts(item) {
      this.showcharts = !this.showcharts;
      this.$emit(
        "showCharts",
        { projectDetail: this.$attrs, nodeDetail: item },
        this.showcharts
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.project_accordion {
  height: 128px;
  width: 100%;
  background: #ffffff linear-gradient(270deg, #063e79 0%, #3577fe 100%);
  border-radius: 8px;
  display: flex;
  color: #fff;
  font-size: 14px;
  overflow: hidden;
  .node_item {
    width: 80px;
    border-right: 1px solid #fff;
    border-color: rgba($color: #fff, $alpha: 0.1);
    .project_info {
      height: 100%;
      padding: 30px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-direction: column;
      color: #fff;
      font-size: 14px;
      cursor: pointer;

      .node_status {
        height: 19px;
        margin: 12px 0 6px 0;
      }
      .node_name {
        color: #fff;
      }
      &:hover {
        background: #002766;
      }
    }
    &.active_node {
      flex-grow: 1;
      display: flex;
      .project_info {
        width: 80px;
        &:hover {
          background-color: inherit;
        }
      }
      .project_detail {
        flex-grow: 1;
        display: flex;
        padding: 8px;
        padding-left: 16px;
        padding-right: 0;
        border-left: 1px dashed rgba($color: #fff, $alpha: 0.1);
        position: relative;
        .sign {
          position: absolute;
          right: -1px;
          top: 0;
          width: 43px;
          height: 43px;
        }
        .project_detail_left {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .field_content {
            display: flex;
            flex-wrap: wrap;
            li {
              width: 33.333333%;
              position: relative;
              padding-left: 15px;
              height: 20px;
              line-height: 20px;
              display: flex;
              &:after {
                content: "";
                height: 8px;
                display: inline-block;
                border-left: 1px solid rgba($color: #fff, $alpha: 0.2);
                position: absolute;
                right: 0;
                top: 45%;
                transform: translateY(-50%);
              }

              .field_label {
                color: rgba($color: #fff, $alpha: 0.7);
              }
              .field_value {
                color: #fff;
                flex-grow: 1;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
              &:nth-of-type(3n) {
                &::after {
                  display: none;
                }
              }
            }
          }
        }
        .project_detail_right {
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: flex-end;
          .garden {
            width: 80px;
            height: 87px;
          }
          i {
            cursor: pointer;
            font-size: 18px;
            &.active {
              transform: rotate(180deg);
            }
          }

          .module_name {
            display: flex;
            height: 32px;
            align-items: center;
            background-color: rgba($color: #fff, $alpha: 0.1);
            border-radius: 8px 0px 0px 8px;
            padding: 0 5px;
            span {
              margin: 0 3px;
              font-size: 14px;
            }
          }

          .el-icon-arrow-down {
            margin-right: 8px;
          }
        }
      }
    }
    .node_png {
      width: 32px;
      height: 32px;
    }
  }
}

// 子级背景白色样式
.project_white {
  background: #fff;
  border-top: 1px solid #efefef;
  .node_item {
    border-color: rgba($color: #efefef, $alpha: 0.5);
    .project_info {
      color: #333;
      i {
        background: #f7f7f7;
        color: #999;
      }

      .base-iconfont {
        background: rgba($color: #e6f7ff, $alpha: 0.5);
        color: #1890ff;
      }

      .node_name {
        color: #666;
      }

      &:hover {
        background: rgba($color: #e6f7ff, $alpha: 0.5);
      }
    }
    &.active_node {
      .project_detail {
        border-left: 1px solid rgba($color: #efefef, $alpha: 0.5);
        .project_detail_left {
          .field_content {
            li {
              &:after {
                border-color: #ccc;
              }

              .field_label {
                color: #999;
              }
              .field_value {
                color: #333;
              }
            }
          }
        }
        .project_detail_right {
          .module_name {
            background-color: rgba($color: #e6f7ff, $alpha: 0.6);
            color: #333;
          }
          .el-icon-arrow-down {
            color: #1890ff;
          }
          .el-icon-more {
            background-color: #1890ff;
            color: #fff;
          }
        }
      }
    }
  }

  .empty {
    color: #999;
    width: 100%;
    justify-content: center;
    height: 70px;
  }
}

.empty {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #fff;
  width: 100%;
  justify-content: center;
  height: 65px;
  img {
    width: 40px;
    height: 30px;
    margin-right: 8px;
  }
}
.status {
  width: 80px;
  text-align: center;
  font-size: 12px;
  margin-top: 20px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
