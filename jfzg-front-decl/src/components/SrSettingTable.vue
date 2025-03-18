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
        <div class="content_title">表头设置 <span></span></div>
        <div class="content_left">
          <el-input
            @change="searchData"
            placeholder="请输入文字进行搜索"
            v-model="search"
          >
          </el-input>
          <i
            @click="deleteSelectData(item, index)"
            style="float: right"
            class="el-icon-search"
          ></i>
          <div class="content_left_lists">
            <div class="content_left_title">所有表头</div>
            <div
              class="content_left_list"
              :key="item.prop"
              v-for="item in data"
            >
              <span>{{ item.label }}</span>
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
            已选表头
            <span>已选{{ selectdata.length }}/{{ data.length }}</span>
          </div>

          <vuedraggable class="wrapper" v-model="selectdata">
            <transition-group>
              <div
                :key="item.prop"
                v-for="(item, index) in selectdata"
                class="content_right_list"
              >
                <span>{{ item.label }}</span>
                <i
                  @click="deleteSelectData(item, index)"
                  style="float: right"
                  class="el-icon-close"
                  v-if="!item.disabled"
                ></i>
              </div>
            </transition-group>
          </vuedraggable>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveHeader">确 定</el-button>

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
  updated() {},
  data() {
    return {
      search: "",
      selectdata: [],
      allData: [],
    };
  },
  mounted() {
    this.changeData(true);
    this.allData = this.data;
  },
  created() {},
  methods: {
    handleClose() {
      this.$emit("close");
    },
    searchData(e) {
      this.data = this.allData.filter((item) => item.prop.indexOf(e) != -1);
    },
    changechecbox(e, item) {
      if (e == true) {
        item.index = this.selectdata.length;
        item.isShow = true;
        this.selectdata.push(item);
      } else {
        this.changeData();
      }
    },
    deleteSelectData(item, index) {
      this.selectdata.splice(index, 1);
      this.data.forEach((item1) => {
        if (item.prop == item1.prop) {
          item1.isShow = false;
        }
      });
    },
    changeData(flag) {
      this.selectdata = this.data.filter((item) => item.isShow);
      if (flag) {
        this.selectdata.sort((a, b) => a.index - b.index);
      }
    },
    saveHeader() {
      this.selectdata.forEach((item1, index) => {
        this.data.forEach((item) => {
          if (item1.prop == item.prop) {
            item.index = index;
          }
        });
      });
      this.$emit("saveHeaderList", this.data);
    },
  },
};
</script>
<style lang="scss">
</style>