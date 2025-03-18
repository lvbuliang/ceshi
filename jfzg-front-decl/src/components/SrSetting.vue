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
        <div class="content_title">设置标签 <span></span></div>
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
              :key="item.itemCode"
              v-for="item in dataCopy"
            >
              <span class="label">{{ item.chName }}</span>
              <el-checkbox
                @change="(e) => changechecbox(e, item)"
                style="float: right"
                v-model="item.isShow"
                :disabled="item.disabled"
              ></el-checkbox>
            </div>
          </div>
        </div>
        <div class="content_right">
          <div class="content_right_title">
            已选
            <span>已选{{ selectdata.length }}/{{ dataCopy.length }}</span>
          </div>

          <!-- <vuedraggable class="wrapper" ghostClass="ghost" v-model="selectdata"> -->
            <transition-group>
              <div
                :key="item.itemCode"
                v-for="(item, index) in selectdata"
                class="content_right_list"
              >
                <!-- <i style="float: left" class="icon-move1"></i> -->
                <span>{{ item.chName }}</span>
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
        (item) => item.chName.indexOf(e) != -1
      );
    },
    changechecbox(e, item) {
      console.log(e, item);
      if (e == true) {
        item.index = this.selectdata.length;
        item.isShow = true;
        this.selectdata.push(item);
      } else {
        this.changeData();
      }
      console.log("已选择数据", this.selectdata);
    },
    deleteSelectData(item, index) {
      this.selectdata.splice(index, 1);
      this.dataCopy.forEach((item1) => {
        if (item.itemCode== item1.itemCode) {
          item1.isShow = false;
        }
      });
    },
    changeData(flag) {
      this.selectdata = this.dataCopy.filter((item) => item.isShow);
      if (flag) {
        this.selectdata.sort((a, b) => a.index - b.index);
      }
    },
    saveHeader() {
      this.selectdata.forEach((item1, index) => {
        this.allData.forEach((item) => {
          if (item1.itemCode == item.itemCode) {
            item.index = index;
          }
          console.log(item)
        });

      });
      console.log(this.allData)
      this.$emit("saveLabelList", this.allData,this.selectdata);
    },
  },
};
</script>
