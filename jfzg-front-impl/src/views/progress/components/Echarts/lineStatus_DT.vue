<template>
  <!--
    功能：进度条-动态 
    作者：王骁骁
    日期：2020/6/14
  -->
  <section class="lineStatusDT">
    <div :class="isFold?'foldStyle':'tileStyle'" :style="outerCom">
      <span
        v-for="(item,i) in lineArrT"
        :key="i"
        ref="spanColor"
        :style="styleCom(item,i)"
        class="normal"
      ></span>
    </div>
  </section>
</template>
<script>
export default {
  props: {
    background: {
      // 背景色
      type: String,
      default: '#fff'
    },
    height: {
      // 高度
      type: String,
      default: '8px'
    },
    /*
     * background:当前进度条背景色
     * num:当前数量
     */
    lineArr: Array,
    isFold: Boolean, //是否开启折叠，默认平铺

    totality: [Number, String] //总数
  },
  computed: {
    outerCom() {
      return {
        background: this.background,
        height: this.height,
        borderRadius: this.borderRadiusFun(this.height)
      };
    },
    styleCom(item, i) {
      return function(item, i) {
        let { background, num } = item;
        let totality = this.totality * 1;
        if (isNaN(this.totality) || isNaN(num)) return;
        let width_t;
        if(num==0){
          width_t = 0
        }else{
         width_t = (num / totality) * 100;
        }
        let obj = {};
        if (this.isFold) {
          obj = {
            background: !background ? '#007AFF' : background,
            width: width_t + '%',
            zIndex: this.lineArrT.length - i,
            borderRadius: this.borderRadiusFun(this.height)
          };
        } else {
          obj = {
            background: !background ? '#007AFF' : background,
            width: width_t + '%',
            borderRadius:
              this.lineArrT.length == 1 ? this.borderRadiusFun(this.height) : ''
          };
        }
        return obj;
      };
    }
  },
  data() {
    return {
      lineArrT: []
    };
  },
  methods: {
    getHierarchyFun(arr) {
      if (!arr) return;
      if (this.isFold) {
        this.lineArrT = arr.sort((a, b) => a.num - b.num);
      } else {
        this.lineArrT = arr;
      }
    },
    borderRadiusFun(item) {
      let semicircle = item.split('p')[0];
      return parseInt(semicircle / 2) + 'px';
    }
  },
  created() {
    this.getHierarchyFun(this.lineArr);
  }
};
</script>
<style lang="scss" scoped>
.lineStatusDT {
  width: 100%;
  overflow: hidden;
  .foldStyle {
    position: relative;
    //现在的进度
    .normal {
      position: absolute;
      top: 0;
      left: 0;
      display: inline-block;
      height: 100%;
    }
  }

  .tileStyle {
    display: flex;
    overflow: hidden;

    .normal {
      display: block;
    }
  }
}
</style>