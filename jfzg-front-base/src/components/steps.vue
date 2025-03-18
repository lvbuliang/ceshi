<template>
  <div class="steps">
    <ul>
      <li v-for="(item, index) in list" :key="index">
        <div
          @click="stepClick(index)"
          :class="[
            'pointer',
            { round: index > defaultIndex },
            { round_current: index == defaultIndex },
            { round_active: index < defaultIndex },
            { 'el-icon-check': index < defaultIndex },
          ]"
        ></div>
        <span :class="index == defaultIndex ? 'item_current' : ''">{{ item }}</span>
        <div
          :class="[
            'border',
            { blue: index < defaultIndex },
            { none: index >= list.length - 1 },
          ]"
        ></div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default() {
        return ["项目成员登记", "里程碑设置", "交付物设置", "任务设置"];
      },
    },

    defaultIndex: [String, Number],
  },

  methods: {
    stepClick(index) {
      this.$emit("stepClick", index);
    },
  },
};
</script>

<style lang="scss" scoped>
.steps {
  display: flex;
  justify-content: center;
  align-items: center;
  // padding-bottom: 26px;
  margin-bottom: 50px;
  ul {
    display: flex;
    align-items: center;
    li {
      display: flex;
      align-items: center;
      position: relative;
      .none {
        opacity: 0;
      }
      span {
        position: absolute;
        transform: translateX(-44%);
        margin-left: 9px;
        position: absolute;
        top: 26px;
        font-size: 14px;
        font-weight: 400;
        color: #999999;
        margin-top: 8px;
      }
      .pointer {
       cursor: default;
      }
      .round {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        border: 2px solid #e9e9e9;
      }
      .item_current {
        color: #1890ff;
      }
      .round_current {
        width: 24px;
        height: 24px;
        background: #1890ff;
        box-shadow: 0px 2px 8px 0px rgba(85, 85, 85, 0.2);
        border-radius: 50%;
        position: relative;
        &::after {
          position: absolute;
          content: "";
          width: 10px;
          height: 10px;
          background: #ffffff;
          border-radius: 50%;
          left: 7px;
          top: 7px;
        }
      }

      .round_active {
        width: 24px;
        height: 24px;
        // background: #1890ff;
        border: 1px solid #1890ff;
        box-shadow: 0px 2px 4px 0px rgba(24, 144, 255, 0.3);
        border-radius: 50%;
        position: relative;
        &::before {
          position: absolute;
          font-size: 14px;
          left: 4px;
          top: 4px;
          color: #1890ff;
        }
      }

      .border {
        width: 131px;
        height: 1px;
        background: #e9e9e9;
      }
      .blue {
        background-color: #1890ff;
      }
    }
  }
}
</style>