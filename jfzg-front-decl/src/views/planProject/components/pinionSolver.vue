<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="544px"
      :before-close="handleClose"
      :close-on-click-modal="false"
      :append-to-body="true"
      :showClose="false"
      class="bzhTableHeader"
    >
      <div class="content_box">
        <div class="content_title">选择协审服务人员</div>
        <div class="content_left">
          <el-input
            @change="searchData"
            placeholder="请输入文字进行搜索"
            v-model="search"
          >
          </el-input>
          <i @click="searchData(search)" class="el-icon-search"></i>
          <div class="content_left_lists">
            <div class="content_left_title">所有可选:</div>
            <div class="content_left_kx">
              <div
                class="content_left_list1"
                :key="item.buid"
                v-for="(item, index) in dataCopy"
              >
                <el-collapse
                  v-model="activeNames"
                  @change="handleChange(item, index)"
                >
                  <el-collapse-item :title="item.buName" :name="index">
                    <template slot="title">
                      <div class="content-title-text">
                        {{ item.buName }}
                      </div>
                      <!-- <i class="header-icon el-icon-info"></i> -->
                    </template>

                    <div
                      v-for="(item1, index1) in item.userBaseInfoVos"
                      class="listItem"
                    >
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="item1.roleName"
                        placement="top"
                        :disabled="!isShowTooltip"
                      >
                        <span
                          class="label"
                          @mouseenter="visibilityChange($event)"
                        >
                          {{ item1.fullname }}
                          {{ item1.roleName ? "(" + item1.roleName + ")" : "" }}
                        </span>
                      </el-tooltip>
                      <el-radio
                        @change="
                          (e) => changechecbox(e, item1, item.buName, item.buid)
                        "
                        v-model="radio"
                        :label="item1.jfid"
                        :disabled="item1.disabled"
                        >{{ "" }}</el-radio
                      >
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </div>
            </div>
          </div>
        </div>
        <div class="content_right">
          <div class="content_right_title">已选:</div>
          <div class="content_right_yx">
            <transition-group>
              <div
                :key="item.buid"
                v-for="(item, index) in selectdata"
                class="content_right_list1"
              >
                <el-collapse v-model="activeNames1" accordion>
                  <el-collapse-item :title="item.buName" :name="index">
                    <template slot="title">
                      <div class="content-title-text">
                        {{ item.buName }}
                      </div>
                      <!-- <i class="header-icon el-icon-info"></i> -->
                    </template>
                    <div v-for="(item1, index1) in item.data" class="listItem">
                      <span class="label">
                        {{ item1.fullname }}
                        {{ item1.roleName ? "(" + item1.roleName + ")" : "" }}
                      </span>
                      <!-- <el-radio
                        @change="
                          (e) =>
                            deleteSelectData(item1, index, index1, item.buName)
                        "
                        v-model="item1.isShow"
                        :disabled="item1.disabled"
                      ></el-radio> -->
                      <i
                        @click="
                          deleteSelectData(item1, index, index1, item.buName)
                        "
                        style="float: right"
                        class="el-icon-close"
                        v-if="!item.disabled"
                      ></i>
                      <!-- <i
                        @click="deleteSelectData(item1,index,index1)"
                        style="float: right"
                        class="el-icon-close"
                        v-if="!item1.disabled"
                      ></i> -->
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </div>
            </transition-group>
          </div>
          <!-- <div class="content_right_title">已征求:</div>
          <div class="content_right_zq">
            <transition-group>
              <div
                :key="item.id"
                v-for="(item, index) in dataThree"
                class="content_right_list1"
              >
                <el-collapse v-model="activeNames2" accordion>
                  <el-collapse-item :title="item.fullName" :name="index">
                    <div v-for="(item1, index1) in item.data" class="listItem">
                      <span class="label">
                        {{ item1.userName }}
                        {{ item1.roleName ? "(" + item1.roleName + ")" : "" }}
                      </span>
                      <el-checkbox
                        @change="(e) => deleteSelectData(item1, index, index1)"
                        v-model="item1.isShow"
                        disabled
                      ></el-checkbox>
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </div>
            </transition-group>
          </div> -->
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveHeader"> 确 认 </el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import vuedraggable from "vuedraggable";
import { getListByPage } from "@/api/projectLibrary";
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
    dataTwo: {
      type: Array,
      default() {
        return [];
      },
    },
    dataThree: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  updated() {
    console.log("已选择数据", this.selectdata);
  },
  data() {
    return {
      isShowTooltip: false,
      search: "",
      selectdata: [],
      // selectdata22: [], //信创已选择
      allData: [],
      // allData2: [], //信创所有数据
      dataCopy: JSON.parse(JSON.stringify(this.data)),
      // dataCopy2: JSON.parse(JSON.stringify(this.dataTwo)), //信创
      activeNames: "", //处室默认手风琴展开
      activeNames1: 0, //已选手风琴
      activeNames2: "", //已征求风琴
      arr: [],
      arrchild: [],
      radio: "",
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
    // 是否显示提示
    visibilityChange(event) {
      console.log(event);
      const ev = event.target;
      const ev_weight = ev.scrollWidth; // 文本的实际宽度   scrollWidth：对象的实际内容的宽度，不包边线宽度，会随对象中内容超过可视区后而变大。
      const content_weight = ev.clientWidth; // 文本的可视宽度 clientWidth：对象内容的可视区的宽度，不包滚动条等边线，会随对象显示大小的变化而改变。
      // const content_weight = this.$refs.tlp.$el.parentNode.clientWidth; // 文本容器宽度(父节点)
      if (ev_weight > content_weight) {
        // 实际宽度 > 可视宽度  文字溢出
        this.isShowTooltip = true;
      } else {
        // 否则为不溢出
        this.isShowTooltip = false;
      }
    },
    handleChange(val, index) {
      console.log(val);
      // this.getListByPageList(val.buid, val.fullName, index);
    },
    // 根据buid获取人员
    /*  getListByPageList(buid, buName, indexPar) {
      this.arr = [];
      console.log("..", this.dataCopy[indexPar].data.length, indexPar);
      if (this.dataCopy[indexPar].data.length != 0) {
        this.arr = this.dataCopy[indexPar].data;
        console.log(this.arr);
        return;
      }
      let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
      // this.dataCopy[indexPar].data = [];
      // console.log(this.dataCopy);
      getListByPage({
        buid,
        fullname: "",
        pageNum: 0,
        pageSize: 100,
        platform: "",
      }).then((res) => {
        if (res.data) {
          let dataList = res.data.list;
          console.log("人员", dataList);
          dataList.map((item, index) => {
            this.arr.push({
              id: item.bumemberid,
              userName: item.userName,
              roleName: item.roleInfos[0].roleName,
              nowBuId: userInfo.currentBizunit.buid,
              nowJfid: userInfo.jfid, //发起人账号id
              nowRole: userInfo.currentRole.roleCode, //发起人角色信息
              unitName: userInfo.currentBizunit.buName, //发起人单位信息
              // userName = userInfo.fullname; //发起人角色名字
              nextBuId: item.buid,
              nextJfid: item.jfid,
              nextRole: item.roleInfos[0].roleCode,
              buName: buName,
            });
            this.$nextTick(() => {
              this.$set(this.dataCopy[indexPar], "data", this.arr);
            });
          });
          console.log(this.dataCopy);
        }
      });
    }, */
    handleClose() {
      this.$emit("close");
    },
    searchData(e) {
      this.dataCopy = this.allData.filter(
        (item) => item.buName.indexOf(e) != -1
      );
      // console.log(this.dataCopy, this.allData);
    },
    changechecbox(e, item, buName, buid) {
      console.log(e, item, buName, buid, this.selectdata);
      this.selectdata.splice(0, 1, { buName, buid, data: [item] });
      /*let flog = false;
       if (e == true) {
        // item.index = this.selectdata.length;
        item.isShow = true;
        if (this.selectdata.length == 0) {
          this.selectdata.push({ buid, buName, data: [item] });
        } else {
          this.selectdata.map((item1, index) => {
            console.log(item1);
            if (item1.buName == buName) {
              console.log("....item == fullName");
              this.selectdata[index].data.push(item);
              flog = true;
            }
          });
          if (this.selectdata.length > 0 && !flog) {
            this.selectdata.push({ buid, buName, data: [item] });
          }
        }
        // this.selectdata.push({ fullName, data: item });
        // this.selectdata=arr;
      } else {
        console.log("......");
        this.changeData();
      } */
      console.log("已选择数据", this.selectdata);
    },
    deleteSelectData(item, index, index1, buName) {
      console.log("shanchu????", item, index, index1, buName);
      this.radio = "";
      if (this.selectdata[index].data.length == 1) {
        this.selectdata.splice(index, 1);
      } else {
        this.selectdata[index].data.splice(index1, 1);
      }
      /*if (buName != "信创小组") {
        this.dataCopy.forEach((item1) => {
          item1.data.forEach((item2) => {
            if (item2.id == item.id) {
              // item2.isShow = false;
              this.radio = "";
            }
          });
        });
      } */
    },
    changeData(flag) {
      /* //this.selectdata = this.dataCopy.filter((item) => item.isShow);
      if (this.selectdata.length > 0) {
        this.selectdata.map((item1, index1) => {
          item1.data.map((item2, index2) => {
            if (item2.isShow == false && item1.data.length > 1) {
              item1.data.splice(index2, 1);
            } else if (item2.isShow == false) {
              this.selectdata.splice(index1, 1);
            }
          });
        });
      // } */
      if (flag) {
        this.selectdata.sort((a, b) => a.index - b.index);
      }
    },
    saveHeader() {
      /* this.selectdata.forEach((item1, index) => {
        this.allData.forEach((item) => {
          if (item1.itemCode == item.itemCode) {
            item.index = index;
          }
          console.log(item);
        });
      }); */
      if (this.selectdata.length == 0) {
        this.$message({
          type: "warning",
          message: "请选择协审服务人员",
        });
        return;
      } else {
        this.$emit("saveLabelList", this.allData, this.selectdata);
      }
      /* let flag = false;
      this.selectdata.map((item) => {
        console.log(item);
        if (item.fullName == "信创小组") {
          flag = true;
        }
      });
      if (flag) {
        this.$emit("saveLabelList", this.allData, this.selectdata);
      } else {
        this.$message({
          type: "warning",
          message: "请选择信创审核小组",
        });
        return;
      } */
    },
  },
};
</script>
<style lang="scss" scoped>
.content_left_list1 {
  width: 230px;
  margin-left: 16px;
  border-radius: 8px;
  color: rgba(0, 0, 0, 0.85);
  position: relative;
  // 信创小组左
  .listItem1 {
    width: 100%;
    height: 32px;
    margin-right: 10px;
    padding-left: 10px;
    padding-right: 10px;
    position: relative;
    line-height: 32px;
    border-radius: 8px;
    &:hover {
      background-color: #f7f7f7;
    }
    .label {
      position: absolute;
      display: inline-block;
      width: 170px;
      line-height: 22px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .el-radio {
      width: 100%;
      text-align: right;
      ::v-deep .el-radio__inner {
        border-radius: 50%;
      }
    }
  }
}
.el-collapse {
  border: none;
  background-color: #f7f7f7;
  border-radius: 8px;
  .el-collapse-item {
    ::v-deep .el-collapse-item__header {
      border: none;
      height: 32px;
      line-height: 32px;
      margin-bottom: 8px;
      background-color: #f7f7f7;
      padding-left: 5px;
      border-radius: 8px;
    }
    ::v-deep .el-collapse-item__content {
      padding-bottom: 0;
      background-color: #f7f7f7;
      margin-bottom: 8px;
      border-radius: 0 0 8px 8px;
    }
    ::v-deep .el-collapse-item__wrap {
      border: none;
    }
    // 处室左
    .listItem {
      /* display: flex;
      justify-content: space-between; */
      width: 100%;
      height: 32px;
      margin-right: 10px;
      margin-left: 5px;
      padding-left: 5px;
      padding-right: 20px;
      position: relative;
      .label {
        z-index: 100;
        position: absolute;
        display: inline-block;
        width: 170px;
        line-height: 22px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .el-radio {
        width: 100%;
        text-align: right;
        ::v-deep .el-radio__inner {
          border-radius: 50%;
        }
      }
    }
  }
}
.content-title-text {
  width: 220px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
// 右边公共多选框样式
.content_right_list1 {
  width: 230px;
  margin-left: 16px;
  border-radius: 8px;
  color: rgba(0, 0, 0, 0.85);
  position: relative;
  .el-radio {
    ::v-deep .el-radio__inner {
      border-radius: 50%;
    }
  }
}
.content_right_yx {
  height: 260px;
  overflow-y: auto;
}
.content_right_zq {
  // padding-top: 20px;
  height: 100px;
  overflow-y: auto;
}
.content_left {
  height: 450px !important;
}
.content_left_lists {
  height: 400px !important;
}
.content_left_kx {
  // width: 230px;
  height: 340px;
  overflow-y: auto;
}
.content_right_yx::-webkit-scrollbar {
  width: 2px;
  height: 9px;
  background-color: #969696;
}
.content_right_yx::-webkit-scrollbar-track {
  background: #e2e2e2;
  border-radius: 2px;
}
.content_right_yx::-webkit-scrollbar-thumb {
  background: #969696;
  border-radius: 8px;
}
.content_right_yx::-webkit-scrollbar-thumb:hover {
  background: #a5a5a5;
}
.content_right_yx::-webkit-scrollbar-corner {
  background: #969696;
}
.content_right_zq::-webkit-scrollbar {
  width: 2px;
  height: 9px;
  background-color: #969696;
}
.content_right_zq::-webkit-scrollbar-track {
  background: #e2e2e2;
  border-radius: 2px;
}
.content_right_zq::-webkit-scrollbar-thumb {
  background: #969696;
  border-radius: 8px;
}
.content_right_zq::-webkit-scrollbar-thumb:hover {
  background: #a5a5a5;
}
.content_right_zq::-webkit-scrollbar-corner {
  background: #969696;
}
.content_left_kx::-webkit-scrollbar {
  width: 2px;
  height: 9px;
  background-color: #969696;
}
.content_left_kx::-webkit-scrollbar-track {
  background: #e2e2e2;
  border-radius: 2px;
}
.content_left_kx::-webkit-scrollbar-thumb {
  background: #969696;
  border-radius: 8px;
}
.content_left_kx::-webkit-scrollbar-thumb:hover {
  background: #a5a5a5;
}
.content_left_kx::-webkit-scrollbar-corner {
  background: #969696;
}
.content_right_list1:hover .el-icon-close {
  display: inline-block;
}
.el-icon-close {
  float: right;
  background: #999;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  padding-left: 2px;
  padding-top: 2px;
  color: #fff;
  font-size: 12px;
  display: none;
  margin-top: 4px;
  &:hover {
    // display: block;
    background: #1890ff;
  }
}
</style>
