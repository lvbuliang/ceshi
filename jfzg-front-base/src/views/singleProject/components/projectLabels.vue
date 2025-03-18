<template>
  <div class="projectLabels">
    <div
      class="projectLabels-content"
      v-if="LabelShowlist && LabelShowlist.length > 0"
    >
      <div
        v-for="(item, index) in LabelShowlist"
        :key="index"
        class="projectLabels-content-item"
      >
        {{ item }}
      </div>
      <div class="addLabel" @click="isshow = true">
        <i class="el-icon-plus"></i>
        <span>添加标签</span>
        <div class="labelDialog" v-show="isshow">
          <p
            v-for="(item, index) in labelList"
            :key="index"
            @click="selectLabel(index, item.status)"
          >
            {{ item.statusName }}
            <i class="el-icon-success" v-show="item.enable"></i>
          </p>
          <div class="btns">
            <div
              class="confire"
              v-debounce="[() => updateProject(), config.deTime]"
            >
              确定
            </div>
            <div class="delete" @click.stop="dialogClock">取消</div>
          </div>
        </div>
      </div>
    </div>
    <div v-else style="position: relative">
      <EmptyFile
        :title="'暂无项目标签，立即'"
        :btnName="'添加'"
        @handleEmptyClick="addTab1"
      >
      </EmptyFile>
      <div class="empty-labelDialog" v-show="isshow1">
        <p
          v-for="(item, index) in labelList"
          :key="index"
          @click="selectLabel(index, item.status)"
        >
          {{ item.statusName }}
          <i class="el-icon-success" v-show="item.enable"></i>
        </p>
        <div class="btns">
          <div
            class="confire"
            v-debounce="[() => updateProject(), config.deTime]"
          >
            确定
          </div>
          <div class="delete" @click.stop="isshow1 = false">取消</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { updateProject, getProjectLabel } from "@/api/singleProject.js";
import config from "@/settings.js";
import EmptyFile from "./emptyFile.vue";
export default {
  props: {},
  data() {
    return {
      config,
      LabelShowlist: [],
      labelList: [],
      isshow: false,
      isshow1: false,
    };
  },
  methods: {
    // 选择标签（打勾or取消打勾）
    selectLabel(index, label) {
      this.labelList[index].enable = !this.labelList[index].enable;
    },
    // 关闭弹框
    dialogClock() {
      this.isshow = false;
    },
    // 唤出弹框
    addTab1() {
      this.isshow1 = true;
    },
    // 保存标签
    updateProject() {
      const Arr = [];
      this.labelList.forEach((el) => {
        if (el.enable) {
          Arr.push(el.status);
        }
      });
      const labelStr = Arr.join(",");
      updateProject({ id: this.$route.query.projectId, projectLabel: labelStr })
        .then((res) => {
          if (res.msg.code == "0000") {
            this.isshow = false;
            this.isshow1 = false;
          }
        })
        .then(() => {
          this.getProjectLabels();
        });
    },
    // 获取标签列表
    getProjectLabels() {
      const LabelList = [];
      getProjectLabel({ projectId: this.$route.query.projectId }).then(
        (res) => {
          this.labelList = res.data;
          this.labelList.forEach((el) => {
            if (el.enable) {
              LabelList.push(el.statusName);
            }
          });
        }
      );
      this.LabelShowlist = LabelList;
    },
  },
  components: {
    EmptyFile,
  },
  mounted() {
    window.addEventListener("click", (e) => {
      // if (!this.$el.contains(e.target)) {
      //   this.isshow = false
      // }
    });
  },
  created() {
    this.getProjectLabels();
  },
};
</script>

<style lang="scss">
.projectLabels {
  padding-bottom: 8px;
  .empty-labelDialog {
    text-align: left;
    position: absolute;
    background: #ffffff;
    box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    border: 1px solid #efefef;
    padding: 8px;
    width: 272px;
    z-index: 10;
    left: 58px;
    p {
      cursor: pointer;
      height: 32px;
      line-height: 32px;
      border-radius: 8px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.85);
      padding-left: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      i {
        font-size: 16px;
        color: #1890ff;
        margin-right: 19px;
      }
      &:hover {
        background: #f7f7f7;
      }
    }
    .btns {
      width: 272px;
      padding: 12px 0 4px 0;
      border-top: 1px solid #e8e8e8;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 12px;
      .confire {
        width: 76px;
        height: 32px;
        background: #1890ff;
        border-radius: 16px;
        line-height: 32px;
        text-align: center;
        cursor: pointer;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #ffffff;
        margin-right: 8px;
      }
      .delete {
        width: 76px;
        height: 32px;
        background: #ffffff;
        border-radius: 16px;
        border: 1px solid #cccccc;
        line-height: 30px;
        text-align: center;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        cursor: pointer;
      }
      .delete:hover {
        border: 1px solid #1890ff;
        color: #1890ff;
      }
    }
  }
  .projectLabels-content {
    display: flex;
    flex-wrap: wrap;
    .projectLabels-content-item {
      padding: 0 16px;
      height: 32px;
      background: #f7f7f7;
      border-radius: 8px;
      margin-right: 8px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
      line-height: 32px;
      margin-bottom: 8px;
    }
    .addLabel {
      width: 104px;
      height: 32px;
      background: #ffffff;
      border-radius: 8px;
      border: 1px solid #1890ff;
      line-height: 30px;
      text-align: center;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #1890ff;
      cursor: pointer;
      position: relative;
      //  margin-top: 10px;
      span {
        margin-left: 4px;
      }
      .labelDialog {
        text-align: right;
        position: absolute;
        background: #ffffff;
        box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        border: 1px solid #efefef;
        padding: 8px;
        width: 272px;
        z-index: 10;
        left: -60px;
        p {
          cursor: pointer;
          height: 32px;
          line-height: 32px;
          border-radius: 8px;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.85);
          padding-left: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          i {
            font-size: 16px;
            color: #1890ff;
            margin-right: 19px;
          }
          &:hover {
            background: #f7f7f7;
          }
        }

        .btns {
          width: 272px;
          padding: 12px 0 4px 0;
          margin-top: 8px;
          border-top: 1px solid #e8e8e8;
          display: flex;
          justify-content: center;
          align-items: center;
          .confire {
            width: 76px;
            height: 32px;
            background: #1890ff;
            border-radius: 16px;
            line-height: 32px;
            text-align: center;
            cursor: pointer;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #ffffff;
            margin-right: 8px;
          }
          .delete {
            width: 76px;
            height: 32px;
            background: #ffffff;
            border-radius: 16px;
            border: 1px solid #cccccc;
            line-height: 30px;
            text-align: center;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
            cursor: pointer;
          }
          .delete:hover {
            border: 1px solid #1890ff;
            color: #1890ff;
          }
        }
      }
    }
  }
}
</style>