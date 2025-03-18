<template>
  <div class="tabCircle">
    <span
      v-for="(item,i) in dataList"
      :key="i"
      :class="{active:active==i}"
      @click="handClick(item)"
    >{{item.tilte}}</span>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dataList: [
        { tilte: "周", value: "0" },
        { tilte: "月", value: "1" }
      ],
      active: 0
    };
  },
  methods: {
    handClick(item) {
      this.active = item.value;
      this.$emit("activeTab", this.active);
    }
  }
};
</script>
<style lang="scss" scoped>
.tabCircle {
  span {
    display: inline-block;
    margin-right: 20px;
    border: 1px solid #e6e6e6;
    padding: 8px 10px;
    border-radius: 50%;
    cursor: pointer;
  }
  span.active {
    background: #007aff;
    color: #fff;
    border: 1px solid #007aff;
  }
}
</style>