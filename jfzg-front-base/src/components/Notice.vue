<template>
  <div class="container">
    <div class="notice-icon">
      <img src="@/assets/images/notice.png" alt="公告" />
    </div>
    <div
      class="m-slider"
      :style="`height: ${height}px; width: ${totalWidth}px;`"
      @mouseenter="onStop"
      @mouseleave="onStart"
    >
      <span
        :style="`will-change: transform; transform: translateX(${right}px); line-height: ${height}px; width: 100%`"
        class="u-slide-title"
        v-for="item in noticeData"
        :key="item.id"
        :title="item.title"
        :href="item.link"
        @click="onClick(item.link)"
      >
        {{ item.title || "--" }}
  </span>
    </div>
    <div class="right"></div>
  </div>
</template>
<script>
export default {
  name: "Notice",
  props: {
    noticeData: {
      // 滚动文字数组
      type: Array,
      required: true,
      default: () => {
        return [];
      },
    },
    totalWidth: {
      // 滚动区域总宽度
      type: Number,
      default: 1200,
    },
    height: {
      // 滚动区域高度
      type: Number,
      default: 46,
    },
    amount: {
      // 滚动区域展示条数
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      right: 0,
      fpsRaf: null, // fps回调标识
      moveRaf: null, // 一个 long 整数，请求 ID ，是回调列表中唯一的标识。是个非零值，没别的意义
      start: 0,
      end: 0,
      step: 1, // 默认移动参数（120fps: 0.5, 60fps: 1）
    };
  },
  computed: {
    width() {
      // 滚动文字每条的固定宽度
      return this.totalWidth;
    },
  },
  created() {
    this.fpsRaf = requestAnimationFrame(this.getFPS);
    console.log("fps:", this.fpsRaf);
  },
  methods: {
    getFPS(timestamp) {
      // 单位ms，用1000ms/两个时间的间隔≈刷新频率fps
      console.log('timestamp:', this.fpsRaf)
      if (this.fpsRaf === 2) {
        this.start = timestamp;
      }
      if (this.fpsRaf === 3) {
        this.end = timestamp;
        console.log('timestamp:', timestamp, this.start,  Math.floor(1000 / (this.end - this.start)))
        // 计算屏幕刷新率
        const fps = Math.floor(1000 / (this.end - this.start));
        if (fps === 120) {
          this.step = 0.5;
        }
        console.log("fps:", fps);
        console.log("step:", this.step);
      }
      this.fpsRaf = requestAnimationFrame(this.getFPS);
      console.log("fps2:", this.fpsRaf);
      if (this.fpsRaf > 3) {
        cancelAnimationFrame(this.fpsRaf);
        this.onStart();
      }
    },
    onClick(link) {
      // 通知父组件点击的标题
      this.$emit("click", link);
    },
    onStop() {
      // 暂停动画
      cancelAnimationFrame(this.moveRaf);
    },
    onStart() {
      // 开始动画
      if (this.noticeData.length > this.amount) {
        // 超过amount条开始滚动
        this.moveRaf = requestAnimationFrame(this.moveRight);
      }
    },
    moveRight() {
      console.log('cccc', this.right, this.width);
      
      if (this.right >= this.width) {
        this.noticeData.push(this.noticeData.shift()); // 将第一条数据放到最后
        this.right = 0;
      } else {
        this.right += this.step; // 每次移动step（px）
      }
      this.moveRaf = requestAnimationFrame(this.moveRight);
    },
  },
};
</script>
<style lang="scss" scoped>
$themeColor: #1890ff;

.container {
  display: flex;
  align-items: center;
  height: 46px;
  background: #ffffff;
  box-shadow: 0px 0px 5px #d3d3d3;
  border-radius: 5px;
  margin-top: 10px;
  .notice-icon {
    width: 40px;
    height: 60%;
    margin-right: 22px;
    padding-left: 10px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .m-slider {
    white-space: nowrap;
    overflow: hidden;
    display: flex;
    align-items: center;
    .u-slide-title {
      display: inline-block;
      margin-left: 22px;
      font-size: 14px;
      color: #333;
      font-weight: 400;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;
      &:hover {
        color: $themeColor;
      }
    }
  }
  .right {
    width: 146px;
    height: 100%;
  }
}
</style>
