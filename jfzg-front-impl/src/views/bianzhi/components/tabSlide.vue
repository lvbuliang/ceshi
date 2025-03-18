<template>
  <div class="tabSlide">
    <!--数据小于6的情况-->
    <div v-if="tabList.length<6">
      <div class="leftNav">
        <!--左箭头：数据大于5可点击-->
        <i class="el-icon-arrow-left ts"></i>
      </div>
      <div class="centerNav">
        <ul class="navBox">
          <li
            v-for="(item,i) in tabList"
            @click="changeActive(i)"
            :key="i"
            :class="{active:timeIndex==item.value}"
          >{{item.title}}</li>
        </ul>
      </div>
      <div class="rightNav">
        <i class="el-icon-arrow-right ts"></i>
      </div>
    </div>
    <div v-else>
      <div class="leftNav">
        <!--左箭头：数据大于5可点击-->
        <i class="el-icon-arrow-left" @click="moveLeft()" :class="{ts:left_button_active}"></i>
      </div>
      <div class="centerNav">
        <ul class="navBox" :style="{marginLeft:ml+'px'}">
          <li
            v-for="(item,i) in tabList"
            @click="changeActive(i)"
            :key="i"
            :class="{active:timeIndex==item.value}"
          >{{item.title}}</li>
        </ul>
      </div>
      <div class="rightNav">
        <i class="el-icon-arrow-right" @click="moveRight()" :class="{ts:right_button_disabled}"></i>
      </div>
    </div>
  </div>
</template>
<script>
import { getstageList } from "@/api/shishi/implement";
export default {
  data() {
    return {
      tabList: [
      ],
      timeIndex: 1, //默认当前选择的为最近的时间点
      ml: 60,
      left_button_active: true,
      right_button_disabled: false,
      id: null
    };
  },
  methods: {
    /**
     * 右滑
     */
    moveRight() {
      /**结束条件 ：105*个数= */
      //   this.ml最初是60
      if ((this.ml - 60) / 105 == -(this.tabList.length - 6)) {
        this.right_button_disabled = true;
      } else {
        this.ml -= 105;
        this.left_button_active = false;
      }
    },

    /**
     * 左滑
     */
    moveLeft() {
      /**结束条件，margin-left=60 */
      if (this.ml != 60) {
        this.ml += 105;
      } else {
        this.left_button_active = true;
        this.right_button_disabled = false;
      }

      //结束条件
    },

    /**
     * 点击当前tab
     */

    changeActive(i) {
      this.timeIndex = i.toString();
    }
  },
  created() {
    this.id = this.$route.query.id;
    var params = {
      projectId: Number(this.$route.query.id)
    };
    getstageList(params).then(res => {
      for (var i = 0; i < res.data.length; i++) {
        let obj={ title: res.data[i].stageName, value: i }
        this.tabList.push(obj)
      }
    });
  }
};
</script>
<style lang="scss" scoped>
.tabSlide {
  display: flex;
  background: #fff;
  position: relative;
  height: 46px;
  line-height: 46px;
  overflow: hidden;
  width: 100%;
  margin-bottom: 20px;
  border: 1px solid rgba(200, 219, 233, 1);
  .leftNav,
  .rightNav {
    width: 20px;
    height: 46px;
    text-align: center;
    cursor: pointer;
  }
  .leftNav {
    position: absolute;
    background: #fff;
    top: 1px;
  }
  .rightNav {
    position: absolute;
    background: #fff;
    right: 1px;
    top: 1px;
  }
  .centerNav {
    flex-grow: 1;
    padding:0 20px;
    box-sizing: border-box;
    .navBox {
      display: flex;
      li {
        width: 105px;
        text-align: center;
        cursor: pointer;
      }
    }
  }
  .active {
    border-bottom: 1px solid #1890ff;
    height: 44px;
    color: #1890ff;
  }
  .ts {
    color: #ccc;
  }
}
</style>