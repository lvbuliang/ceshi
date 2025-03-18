<template>
  <div class="progress-container">
    <!-- 总进度条 -->
    <div class="total-progress">
      <div class="total-progress-bar">
        <div
          class="total-progress-fill"
          :style="{ width: totalProgress + '%' }"
        ></div>
      </div>
      <div class="total-progress-percentage">{{ totalProgress }}%</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TaskProgressBar",
  props: {
    totalProgress: {
      type: Number,
      required: true,
      validator: (value) => {
        return value >= 0 && value <= 100;
      },
    },
  },
};
</script>

<style scoped>
.progress-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.total-progress {
  display: flex;
  align-items: center;
  margin-top: 20px;
}

.total-progress-bar {
  width: 80%;
  height: 15px;
  /* background-color: #e0e0e0; */
  background: rgb(236, 243, 251);
  border-radius: 12px;
  overflow: hidden;
  /* margin-right: 10px; */
}

.total-progress-fill {
  height: 100%;
  background-color: rgb(50, 74, 229);
  transition: width 0.3s ease;
}

.total-progress-percentage {
  font-weight: bold;
}
</style>
