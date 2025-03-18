<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="544px"
      :before-close="handleClose"
      :close-on-click-modal="false"
      :showClose="false"
      class="bzhTableHeader"
    >
      <div class="content_box">
        <div class="content_title">审核分配 <span></span></div>
        <div class="content_left">
          <el-input
            @change="searchData"
            placeholder="请输入文字进行搜索"
            v-model="search"
          >
          </el-input>
          <i
            @click="searchData(search)"
            style="float: right"
            class="el-icon-search"
          ></i>
          <div class="content_left_lists">
            <div class="content_left_title">所有可选</div>
            <div
              class="content_left_list"
              :key="item.id"
              v-for="item in dataCopy"
            >
              <span class="label">{{ item.buName }}</span>
              <el-radio
                @change="(e) => changechecbox(e, item)"
                style="float: right"
                v-model="radio"
                :disabled="item.disabled"
                :label="item.buid"
                >{{ "" }}</el-radio
              >
            </div>
          </div>
        </div>
        <div class="content_right">
          <div class="content_right_title">
            已选
            <!-- <span>已选{{ selectdata.length }}/{{ dataCopy.length }}</span> -->
          </div>

          <!-- <vuedraggable class="wrapper" ghostClass="ghost" v-model="selectdata"> -->
          <transition-group>
            <div
              :key="item.buid"
              v-for="(item, index) in selectdata"
              class="content_right_list"
            >
              <!-- <i style="float: left" class="icon-move1"></i> -->
              <span>{{ item.buName }}</span>
              <i
                @click="deleteSelectData(item, index)"
                style="float: right"
                class="el-icon-close"
                v-if="!item.disabled"
              ></i>
            </div>
          </transition-group>
          <!-- </vuedraggable> -->
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveHeader">确 认</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import vuedraggable from "vuedraggable";

export default {
  name: "SrSettingTable",
  components: { vuedraggable },
  props: {
    dialogVisible: {
      type: Boolean,
      default() {
        return false;
      },
    },
    data: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  updated() {
    console.log("全部数据", this.data);
    console.log("已选择数据", this.selectdata);
  },
  data() {
    return {
      radio: "",
      search: "",
      selectdata: [],
      allData: [],
      dataCopy: JSON.parse(JSON.stringify(this.data)),
    };
  },
  mounted() {
    this.changeData(true);
    this.allData = this.dataCopy;
    document.body.ondrop = function (event) {
      event.preventDefault();
      event.stopPropagation();
    };
    document.body.ondragover = function (event) {
      event.preventDefault();
      event.stopPropagation();
    };
    document.body.ondragenter = function (event) {
      event.preventDefault();
      event.stopPropagation();
    };
  },
  methods: {
    handleClose() {
      this.$emit("close");
    },
    searchData(e) {
      this.dataCopy = this.allData.filter(
        (item) => item.buName.indexOf(e) != -1
      );
    },
    changechecbox(e, item) {
      console.log(e, item);
      if (e == item.buid) {
        item.index = this.selectdata.length;
        // item.isShow = true;
        this.selectdata.splice(0, 1, item);
      } else {
        // this.changeData();
      }
      console.log("已选择数据", this.selectdata);
    },
    deleteSelectData(item, index) {
      this.selectdata.splice(index, 1);
      this.dataCopy.forEach((item1) => {
        if (item.buid == item1.buid) {
          this.radio = "";
        }
      });
    },
    changeData(flag) {
      console.log("", flag);
      this.selectdata = this.dataCopy.filter((item) => item.isShow);
      if (flag) {
        this.selectdata.sort((a, b) => a.index - b.index);
      }
    },
    saveHeader() {
      this.selectdata.forEach((item1, index) => {
        this.allData.forEach((item) => {
          if (item1.buid == item.buid) {
            item.index = index;
          }
          console.log(item);
        });
      });
      console.log(this.allData);
      this.$emit("saveLAllocationList", this.allData, this.selectdata);
    },
  },
};
</script>
<style lang="scss" scoped>
.el-radio {
  line-height: 32px;
  // 审核小区选择区域扩大问题
  width: 100%;
  text-align: right;
}
</style>
