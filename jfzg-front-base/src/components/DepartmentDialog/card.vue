<template>
  <div class="departmentCard">
    <div class="header" @click="headerClick">
      <h3>{{ title }}</h3>
    <i class="el-icon-arrow-right" v-if="hasRight"></i>
    </div>
    
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default() {
        return "";
      },
    },
    hasRight: Boolean,
    year: [String, Number]
  },
  methods: {
    headerClick() {
      if (this.hasRight) {
        this.$router.push({name: 'amountStandTable', query: {year: this.year}})
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.departmentCard {
  width: calc(33% - 8px);
  // height: 340px;
  height: 357px;
  background: #ffffff;
  border-radius: 8px;
  // border: 1px solid #efefef;
  box-shadow: 0px 0px 4px 0px rgba(0,0,0,0.08);
  background-color: #fff;
  padding: 16px;
  padding-bottom: 0;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    margin-bottom: 16px;
    i {
      font-size: 16px;
      color:  #1890FF;
    }
  }
  h3 {
    font-size: 16px;
    font-weight: 500;
    color: #333333;
    position: relative;
    padding-left: 8px;
    &::before {
      position: absolute;
      width: 4px;
      height: 16px;
      content: '';
      background-image: linear-gradient(rgba(64, 169, 255, 1), rgba(9, 109, 217, 1));
      border-radius: 2px;
      left: 0;
      top: 4px;
    }
  }
}
</style>