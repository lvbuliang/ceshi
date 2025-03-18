<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="544px"
      @close="handleClose"
      :close-on-click-modal="false"
      :append-to-body="true"
      :showClose="false"
      class="bzhTableHeader"
    >
      <div class="content_box">
        <!-- <div class="content_title">选择周报人</div> -->
        <div class="content_title">{{ title.label }}</div>
        <div class="content_left">
          <el-input
            @change="searchData"
            placeholder="请输入单位名称或人员姓名"
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
                      <div class="content_title_text">
                        {{ item.buName }}
                      </div>
                      <!-- <i class="header-icon el-icon-info"></i> -->
                    </template>
                    <div
                      v-for="(item1, index1) in item.userBaseInfoVos"
                      class="listItem"
                      :key="index1"
                    >
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="item1.buName"
                        placement="top"
                        :disabled="!isShowTooltip"
                      >
                        <span
                          class="label"
                          @mouseenter="visibilityChange($event)"
                        >
                          {{ item1.fullname }}
                          {{ item1.buName ? '(' + item1.buName + ')' : '' }}
                        </span>
                      </el-tooltip>
                      <el-radio
                        @change="
                          (e) => changechecbox(e, item1, item.buName, item.buid)
                        "
                        v-model="radio"
                        :label="item1.jfid + item1.buid + item1.roleCode"
                        :disabled="item1.disabled"
                        >{{ '' }}</el-radio
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
                      <div class="content_title_text">
                        {{ item.buName }}
                      </div>
                      <!-- <i class="header-icon el-icon-info"></i> -->
                    </template>
                    <div
                      v-for="(item1, index1) in item.data"
                      class="listItem"
                      :key="index1"
                    >
                      <span class="label">
                        {{ item1.fullname }}
                        {{ item1.buName ? '(' + item1.buName + ')' : '' }}
                      </span>
                      <el-radio
                        @click.native.prevent="
                          deleteSelectData(item1, index, index1, item.buName)
                        "
                        v-model="item1.isShow"
                      ></el-radio>
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </div>
            </transition-group>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveData"> 确 认 </el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'DialogT',
  props: {
    dialogVisible: {
      type: Boolean,
      default() {
        return false;
      },
    },
    data: {
      type: Array,
      // default() {
      //   return [
      //     // 示例数据
      //     {
      //       buid: 7352,
      //       buName: "审核经办人",
      //       buUniqueCode: "JFZG_XSFWJG_BUCODE_1",
      //       userBaseInfoVos: [
      //         {
      //           jfid: 5173,
      //           roleCode: "QZSCFW_JBR",
      //           buid: 7352,
      //           buName: "协审服务机构1",
      //           roleName: "协审经办人",
      //           fullname: "前置审查服务经办人",
      //           buUniqueCode: "JFZG_XSFWJG_BUCODE_1",
      //         },
      //       ],
      //     },
      //     {
      //       buid: 7353,
      //       buName: "协审经办人",
      //       buUniqueCode: "JFZG_XSFWJG_BUCODE_2",
      //       userBaseInfoVos: [
      //         {
      //           jfid: 5479,
      //           roleCode: "QZSCFW_JBR",
      //           buid: 7353,
      //           buName: "协审服务机构2",
      //           roleName: "协审经办人",
      //           fullname: "前置审查服务经办人",
      //           buUniqueCode: "JFZG_XSFWJG_BUCODE_2",
      //           disabled: true,
      //         },
      //         {
      //           jfid: 5092,
      //           roleCode: "QZSCFW_JBR",
      //           buid: 7353,
      //           buName: "协审服务机构2",
      //           roleName: "协审经办人",
      //           fullname: "王凯",
      //           buUniqueCode: "JFZG_XSFWJG_BUCODE_2",
      //         },
      //         {
      //           jfid: 5099,
      //           roleCode: "QZSCFW_JBR",
      //           buid: 7353,
      //           buName: "协审服务机构2",
      //           roleName: "协审经办人",
      //           fullname: "朱军",
      //           buUniqueCode: "JFZG_XSFWJG_BUCODE_2",
      //           disabled: true,
      //         },
      //         {
      //           jfid: 5476,
      //           roleCode: "QZSCFW_JBR",
      //           buid: 7353,
      //           buName: "协审服务机构2",
      //           roleName: "协审经办人",
      //           fullname: "蒋园",
      //           buUniqueCode: "JFZG_XSFWJG_BUCODE_2",
      //         },
      //       ],
      //     },
      //   ];
      // },
    },
    title: {
      type: String,
      default() {
        return '';
      },
    },
  },
  data() {
    return {
      isShowTooltip: false,
      search: '',
      selectdata: [],
      // dataOne: [],
      allData: [],
      dataCopy: JSON.parse(JSON.stringify(this.data)),
      activeNames: '', //处室默认手风琴展开
      activeNames1: 0, //已选手风琴
      activeNames2: '', //已征求风琴
      arr: [],
      arrchild: [],
      radio: '',
      // dataCopy: JSON.parse(JSON.stringify(this.data)),
    };
  },
  watch: {
    data: {
      handler(v) {
        console.log(v);
        this.dataCopy = JSON.parse(JSON.stringify(this.data));
        this.allData = JSON.parse(JSON.stringify(this.data));
      },
    },
  },
  mounted() {
    // this.changeData(true);
    console.log(this.allData);
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
    },
    handleClose() {
      this.$emit('close', this.selectdata);
    },
    searchData(val) {
      console.log(val);
      if (val) {
        this.dataCopy = this.allData
          .map((item) => {
            let result = item.userBaseInfoVos.filter(
              (item) =>
                item.fullname.indexOf(val) != -1 ||
                item.buName.indexOf(val) != -1
            );
            return result.length > 0
              ? { ...item, userBaseInfoVos: result }
              : {};
          })
          .filter((item) => Object.keys(item).length > 0);
      } else {
        this.dataCopy = this.allData;
      }
    },
    changechecbox(e, item, buName, buid) {
      console.log(e, item, buName, buid, this.selectdata);
      this.selectdata.splice(0, 1, { buName, buid, data: [item] });
      console.log('已选择数据', this.selectdata);
    },
    deleteSelectData(item, index, index1, buName) {
      console.log(this.selectdata[index]);
      console.log('shanchu????', item, index, index1, buName);
      this.radio = '';
      if (this.selectdata[index].data.length == 1) {
        this.selectdata.splice(index, 1);
      } else {
        this.selectdata[index].data.splice(index1, 1);
      }
    },
    changeData(flag) {
      // console.log('this.selectdata', this.selectdata);
      if (flag) {
        this.selectdata.sort((a, b) => a.index - b.index);
      }
    },
    saveData() {
      if (this.selectdata.length == 0) {
        this.$message({
          type: 'warning',
          message: `请选择${this.title.label}`,
        });
        return;
      } else {
        this.$emit('saveSelectData', this.selectdata, this.title.value);
        // console.log("saveSelectData", this.allData, this.selectdata);
      }
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
.content_title_text{
  width: 220px;
  overflow: hidden;
  white-space: nowrap;
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
