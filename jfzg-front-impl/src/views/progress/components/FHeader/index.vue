<template>
  <section class="f-header" :style="'margin-top:'+top">
    <h3 :class="headerType[type]">{{title}}<i :class="expand?'el-icon-arrow-down':'el-icon-arrow-up'" @click="expand=!expand"></i></h3>
    <div style="padding:20px 30px;" v-show="expand">
      <slot></slot>
    </div>
  </section>
</template>
<script>
export default {
  props: {
    title: {
      type: String
    },
    top: {
      type: String
    },
    type: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      expand: true,
      headerType: ['', 'head-one', 'head-two']
    }
  }
}

</script>
<style lang="scss">
.f-header {
  width: 100%;
  border-radius: 2px;
  background: #fff;

  >div {
    padding: 20px;
  }

  >h3 {
    position: relative;
    padding: 15px 30px;
    border-bottom: 1px solid #eaeaea;
    color: #333;
    font-size: 16px;
    line-height: 1;
    font-weight: normal;
    display: flex;
    justify-content: space-between;

    i {
      color: #5685F5;
      display: block;
      cursor: pointer;
    }

    &.head-one {
      color: #344DA7;

      &:after {
        content: "";
        position: absolute;
        left: 15px;
        top: 45px;
        width: 85px;
        border-bottom: 2px solid #344DA7;
        overflow: hidden;
      }
    }

    &.head-two {
      margin: 0 30px;
      padding: 15px 0;

      &:after {
        content: "";
        position: absolute;
        left: 0;
        top: 45.5px;
        width: 85px;
        border-bottom: 1px solid #344DA7;
        overflow: hidden;
      }
    }
  }
}

</style>
