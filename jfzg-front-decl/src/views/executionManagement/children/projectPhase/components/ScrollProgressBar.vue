<template>
  <div class="progress-bar-container">
    <div class="progress-bar" :style="progressStyle"></div>
    <div class="progress-value" :style="valueStyle">{{ displayValue }}</div>
  </div>
</template>

<script>
export default {
  name: "ProgressBar",
  props: {
    value: {
      type: [Number, String],
      default: null
    }
  },
  computed: {
    // 计算进度条的实际值（处理 null 或空字符串）
    actualValue() {
      if (this.value == null || this.value === "" || isNaN(Number(this.value))) {
        return 0;
      }
      return Math.min(Math.max(Number(this.value), 0), 100); // 限制在 0-100 范围内
    },
    // 动态计算进度条的样式
    progressStyle() {
      return {
        width: `${this.actualValue}%`,
        backgroundColor: this.getProgressColor(this.actualValue)
      };
    },
    // 动态计算进度值的样式
    valueStyle() {
      return {
        left: `${this.actualValue}%`,
        transform: `translateX(-${this.actualValue}%`
      };
    },
    // 显示的值（如果值为 0，则不显示）
    displayValue() {
      return this.actualValue > -1 ? `${this.actualValue}%` : "";
    }
  },
  methods: {
    // 根据进度值返回不同的颜色
    getProgressColor(value) {
      // if (value < 50) return "#FF6347"; // 红色
      // if (value < 80) return "#FFD700"; // 黄色
      // return "#32CD32"; // 绿色
      if(value>0){
        return "#1989fa";
      }
    }
  }
};
</script>

<style scoped>
.progress-bar-container {
  position: relative;
  width: 100%;
  height: 15px;
  background-color: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  transition: width 0.3s ease;
}

.progress-value {
  position: absolute;
  top: -20%;
  transform: translateY(-10%);
  white-space: nowrap;
  padding: 0px 0px 0px 4px;
  font-size: 12px;
  color: #333;
}


</style>