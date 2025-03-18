<template>
  <ul class="items">
    <li v-for="(item, index) in config" :key="index">
      <!-- 需要提示的左边 -->
      <div class="left" v-if="item.isHover">
        <img src="@/assets/standtable/plan.png" alt="" v-if="item.isMoney" />
        <img
          src="@/assets/standtable/planStar.png"
          alt=""
          v-else-if="item.isAmount"
        />
        <img src="" alt="" v-else />
        <label v-if="item.isBlod">
          <el-tooltip class="item" effect="light" placement="top">
            <div slot="content">
              <div v-for="val in item.data" :key="index">
                <div class="tips">
                  {{ val.label }}：{{ data[val.key] ? data[val.key] : "0" }}
                </div>
              </div>
            </div>
            <span
              style="
                color: #1890ff;
                width: 105px;
                display: inline-block;
                margin-right: 8px;
                font-weight: bold;
                cursor: pointer;
              "
              :style="{ width: item.isShort ? '160px' : '105px' }"
            >
              {{ item.label }}
              <i class="el-icon-warning"></i>
              ：
            </span>
          </el-tooltip>
          <el-tooltip  class="item" effect="light" placement="top">
            <div slot="content">
              <div v-for="val in item.data" :key="index">
                <div class="tips">
                  {{ val.label }}：{{ data[val.key] ? data[val.key] : "0" }}
                </div>
              </div>
            </div>
            <span style="cursor: pointer">{{ data[item.key] || 0 }}</span>
          </el-tooltip>
        </label>
        <label v-else>
          <span
            style="width: 136px; margin-right: 14px; display: inline-block"
            v-if="item.isShort"
          >
            {{ item.label }}：
          </span>
          <span
            style="width: 160px; margin-right: 14px; display: inline-block"
            v-else
          >
            {{ item.label }}：
          </span>
          <span>{{ data[item.key] || 0 }}</span>
        </label>
        <i
          class="base-iconfont icon-browse"
          v-if="item.haveSee"
          @click="$emit('see')"
        ></i>
      </div>
      <!-- 不需提示的左边 -->
      <div class="left" v-else>
        <img src="@/assets/standtable/plan.png" alt="" v-if="item.isMoney" />
        <img
          src="@/assets/standtable/planStar.png"
          alt=""
          v-else-if="item.isAmount"
        />
        <img src="" alt="" v-else />
        <label v-if="item.isBlod">
          <span
            style="
              color: #1890ff;
              width: 105px;
              display: inline-block;
              margin-right: 8px;
              font-weight: bold;
            "
            :style="{ width: item.isShort ? '160px' : '105px' }"
          >
            {{ item.label }}：
          </span>
          <span>{{ data[item.key] || 0 }}</span>
        </label>
        <label v-else>
          <span
            style="width: 136px; margin-right: 14px; display: inline-block"
            v-if="item.isShort"
          >
            {{ item.label }}：
          </span>
          <span
            style="width: 160px; margin-right: 14px; display: inline-block"
            v-else
          >
            {{ item.label }}：
          </span>
          <span>{{ data[item.key] || 0 }}</span>
        </label>
        <i
          class="base-iconfont icon-browse"
          v-if="item.haveSee"
          @click="$emit('see')"
        ></i>
      </div>
      <div class="right" v-if="item.rate">
        <img src="@/assets/standtable/zhanbi.png" alt="" />
        <!-- <img src="@/assets/standtable/tongbi.png" alt="" v-else />  v-if="item.isZhanbi"-->
        <label v-if="item.isBlod">
          <span
            class="tongbi"
            style="font-weight: bold; color: #1890ff"
            :style="{ width: item.rate.isLong ? '160px' : '105px' }"
          >
            {{ item.rate.label }}：
          </span>
          <span>
            {{ data[item.rate.key] ? data[item.rate.key] : "-" }}
          </span>
        </label>
        <!-- <label v-else>
          {{ item.rate.label }}：
          <span style="color: #1890ff">{{
            data[item.rate.key] ? data[item.rate.key] : "-"
          }}</span>
        </label> -->
      </div>
      <!-- 提示在右侧 -->
      <!-- <i
        style="color: #1890ff; text-align: right; flex: 1; margin-right: 5px"
        class="el-icon-warning"
      ></i> -->
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    config: {
      type: Array,
      default() {
        return [];
      },
    },
    data: {
      type: Object,
      default() {
        return {};
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.items {
  li {
    display: flex;
    width: 100%;
    height: 38px;
    background: #fafafa;
    border-radius: 8px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: 8px;
    padding-left: 12px;
    font-family: PingFang SC-Medium, PingFang SC !important;
    > :nth-last-of-type(1) {
      margin-bottom: 0;
    }
    label {
      font-size: 14px;
      color: #666666;
      span {
        color: #333333;
      }
    }
    .left {
      width: 65%;
      display: flex;
      align-items: center;
      img {
        margin-right: 4px;
        width: 16px;
      }
    }
    .right {
      width: 35%;
      display: flex;
      align-items: center;
      img {
        margin-right: 4px;
        width: 16px;
      }
    }

    .icon-browse {
      font-size: 20px;
      color: #666666;
      cursor: pointer;
      margin-left: 16px;
      &:hover {
        color: #1890ff;
      }
    }
  }
  // 设置没有占比与同比的li标签的左边为100%
  li:nth-child(n + 3) {
    .left {
      width: 100% !important;
    }
  }
}
.tips {
  font-family: "PingFang SC-Regular, PingFang SC" !important;
  font-weight: 400;
  font-size: 12px;
  color: #666666;
  line-height: 18px;
}
@media screen and (max-width: 1550px) {
  li {
    /*  width: 100%;
    display: flex;
    flex-wrap: wrap; */

    .left {
      width: 100% !important;
    }
    .right {
      width: 100% !important;
    }
    .tongbi {
      display: inline-block;
      width: 105px;
      margin-right: 3px;
    }
  }
  li:nth-child(1),
  li:nth-child(2) {
    height: 45px !important;
  }
}
</style>
