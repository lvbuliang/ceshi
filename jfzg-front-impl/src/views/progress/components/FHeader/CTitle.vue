<template>
  <h5 class="common-title relative">
    <el-row>
      <el-col class="relative title" :span="12">
        <div class="description clearfix">
          <img :src="!iconWhite?iconTitle:iconTitleWhite" alt />
        </div>
        <span>{{ title }}</span>
      </el-col>
      <el-col :span="12" class="rightPage">
        <slot class="rightPage" name="rightPage"></slot>
      </el-col>
    </el-row>
  </h5>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
    },
    iconWhite: Boolean,
  },
  data() {
    return {
      iconTitle: require("../../assets/components/icon-title.png"),
      iconTitleWhite: require("../../assets/components/icon-title-white.png"),
    };
  },
};
</script>

<style lang="scss" scoped>
.relative {
  color: #333;
}
.title {
  display: flex;
  align-items: center;
}
.el-row {
  width: 100%;
}
.common-title {
  font-size: 20px;
  height: 28px;
  line-height: 28px;
  font-weight: 600;

  .description {
    width: 22px;
    height: 22px;
    margin-right: 6px;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
