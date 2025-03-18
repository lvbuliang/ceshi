<template>
  <div class="departmentTooltip" v-show="flag">
    <ul>
      <li
        :class="{ current: currentIndex === index }"
        v-for="(item, index) in dates"
        :key="index"
        @click="itemClick(index)"
      >
        {{ isNaN(item) ? item : item + "年" }}
      </li>
    </ul>
  </div>
</template>

<script>
import { getAllProjectYears } from "@/api/standTable.js";
export default {
  props: {},
  data() {
    return {
      flag: false,
      currentIndex: null,
      dates: [],
    };
  },
  computed: {
    /* dates() {
      let list = [];
      const nowYear = new Date().getFullYear();
      for (let index = 4; index > 0; index--) {
        list.push(nowYear - index);
      }
      list.push(nowYear);
      list.push(nowYear + 1);
      return list;
    }, */
  },
  created() {
    // this.currentIndex = 0;
    this.getAllProjectYearsData();
  },
  methods: {
    show(val) {
      if (val) {
        this.flag = false;
      } else {
        this.flag = !this.flag;
      }
    },
    itemClick(i) {
      this.currentIndex = i;
      this.$emit("itemClick", this.dates[i]);
      this.flag = false;
    },
    getAllProjectYearsData() {
      getAllProjectYears().then((res) => {
        if (res.data) {
          res.data.sort((a, b) => b - a);
          this.dates = res.data;
          this.dates.unshift("全部");
          this.dates.map((item, index) => {
            // console.log("?????", new Date().getFullYear(), item);
            if (new Date().getFullYear() == item) {
              this.currentIndex = index;
            }
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.departmentTooltip {
  padding: 10px 0 10px 0;
  background-color: #fff;
  position: absolute;
  z-index: 10;
  width: 166px;
  box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  .current {
    color: #1890ff;
  }
  &::before {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-bottom: 6px solid #fff;
    top: -6px;
    left: 52px;
    box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.1);
  }
  ul {
    li {
      font-size: 14px;
      font-weight: 400;
      color: #606266;
      cursor: pointer;
      padding: 0 20px 0 20px;
      height: 34px;
      line-height: 34px;
      &:hover {
        background-color: #f7f7f7;
      }
    }
  }
}
</style>
