<template>
  <!-- 相似文档子 -->
  <div class="similarity">
    <div class="left">
      <img class="img" :src="fileImg(obj.fileName)" alt />
    </div>
    <div class="center">
      <h3 class="title" @click="goClick(obj.id)">{{obj.projectName}}</h3>
      <ul class="info">
        <li>{{obj.createTime}}</li>
        <li>上传人：{{obj.creatorName}}</li>
        <li>预算单位：{{obj.buName}}</li>
      </ul>
      <div class="tag" :class="!openOffFlag && 'limitHeight'">
        <!-- 匹配相等的颜色明亮 -->
        <p v-for="(item,i) in obj.labelVos" :key="i +'info'" :class="item.mate && 'mate'">{{item}}</p>
        <div v-if="obj.labelVos && obj.labelVos.length > 10" class="openOff">
          <i v-if="openOffFlag" class="icon el-icon-arrow-up" @click="openOffFlag = false"></i>
          <i v-else class="icon el-icon-arrow-down" @click="openOffFlag = true"></i>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="progress" :class="themeColor(obj.color).bac">
        <div class="title">
          <div class="fw500">对比分析结果</div>
          <div>相似度：{{obj.similarity ? obj.similarity : 0}}%</div>
        </div>
        <el-progress
          :percentage="obj.similarity && typeof obj.similarity == 'number' ? obj.similarity :Number(obj.similarity)"
          :stroke-width="8"
          :class="themeColor(obj.color).pro"
          :show-text="false"
        ></el-progress>
        <div class="tips">
          <i :class="themeColor(obj.color).i"></i>
          {{obj.message}}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { fileTypeImg, getFileType, arrFind } from "./utils.js";

export default {
  props: {
    obj: Object, // 集约化比对成功的对象
    name: String, // 路由名称
  },
  data() {
    return {
      openOffFlag: false,
    };
  },
  methods: {
    themeColor(val) {
      // 展示什么class
      let arr = [
        { color: "red", bac: "no", pro: "noCustomColors", i: "el-icon-error" },
        {
          color: "blue",
          bac: "yes",
          pro: "yesCustomColors",
          i: "el-icon-success",
        },
      ];
      let item = arrFind(arr, val, "color");

      return item ? item : arr[0];
    },
    fileImg(val) {
      return val ? fileTypeImg(getFileType(val)) : "";
    },
    goClick(id) {
      this.$router.push({ name: this.name, query: { id } });
    },
  },
};
</script>
<style lang="scss"scoped>
.fw500 {
  font-weight: 500;
}
.yesCustomColors {
  ::v-deep .el-progress-bar__inner {
    background: linear-gradient(270deg, #65afff 0%, #3577fe 100%);
  }
}
.noCustomColors {
  ::v-deep .el-progress-bar__inner {
    background: linear-gradient(90deg, #f9455a 0%, #fc9959 100%);
  }
}
.similarity {
  box-sizing: border-box;
  padding-top: 20px;
  padding-bottom: 12px;
  display: flex;
  border-bottom: 1px dashed #e6e6e6;
  .left {
    width: 48px;
    align-items: start;
    .img {
      width: 100%;
      height: 48px;
    }
  }

  .center {
    flex-grow: 1;
    padding-left: 16px;

    .title {
      font-size: 24px;
      color: #333333;
      height: 32px;
      line-height: 32px;
      max-width: 936px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;
      &:hover {
        color: #1890ff;
      }
    }

    .info {
      margin: 8px 0;
      height: 18px;
      font-size: 12px;
      color: #999999;
      line-height: 18px;
      display: flex;
      max-width: 936px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      li {
        border-left: 1px solid #979797;
        padding: 0 16px;
        &:first-child {
          border-left: none;
          padding-left: 0;
        }
      }
    }

    .tag {
      position: relative;
      padding-right: 30px;
      .openOff {
        position: absolute;
        right: 32px;
        top: 4px;
        .icon {
          font-size: 14px;
          color: #1890ff;
        }
      }
      p {
        display: inline-block;
        font-size: 14px;
        height: 24px;
        line-height: 24px;
        box-sizing: border-box;
        color: #666666;
        background: #f7f7f7;
        border-radius: 8px;
        padding: 0px 8px;
        margin-right: 8px;
        margin-bottom: 8px;
      }

      .mate {
        background: #fff1f0;
      }
    }

    .limitHeight {
      height: 32px;
      overflow: hidden;
    }
  }

  .right {
    width: 390px;

    .progress {
      width: 100%;
      padding: 16px;
      min-height: 95px;
      box-sizing: border-box;
      border-radius: 8px;
      .title {
        height: 22px;
        font-size: 14px;
        color: #333333;
        line-height: 22px;
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
      }

      .tips {
        margin-top: 8px;
        font-size: 12px;
        i {
          font-size: 14px;
          margin-right: 4px;
        }
      }
    }

    .yes {
      background: #f7fdff;
      .tips {
        color: #1890ff;
      }
    }

    .no {
      background: #fff9f9;
      .tips {
        color: #f5222d;
      }
    }
  }
}
</style>

