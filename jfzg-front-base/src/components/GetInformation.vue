<template>
  <div class="getInformation">
    <el-dialog
      :visible.sync="dialogVisible"
      width="980px"
      title="消息中心"
      append-to-body
      :before-close="handleClose"
      class="common-dialog"
    >
      <div class="source table-dialog">
        <SrSearch
          :search="search"
          :searchExpand="true"
          :showTextBtns="true"
          :hideBtns="false"
          @queryList="getList(1)"
        ></SrSearch>
        <el-tabs
          type="border-card"
          v-model="activeName"
          class="tabs"
          @tab-click="handleClick"
        >
          <el-tab-pane name="未读消息">
            <span slot="label">
              <i class="base-iconfont icon-unMessage"></i>
              未读消息({{ unread }})
            </span>
            <SrTable
              :data="table.data"
              :config="table.config"
              :page="table.page"
              @pageChanged="pageChanged"
              @sizeChanged="sizeChanged"
              @selected="selected"
            >
              <div class slot="cellSlot" slot-scope="scope">
                <span>
                  <!-- <img class="imgIcon" :src="iconClass" alt /> -->
                  {{ scope.scope.row.creatorName }}
                </span>
              </div>
            </SrTable>
          </el-tab-pane>
          <el-tab-pane name="已读消息">
            <span slot="label">
              <i class="base-iconfont icon-message"></i>
              已读消息({{ read }})
            </span>
            <SrTable
              class="read"
              :data="table2.data"
              :config="table2.config"
              :page="table2.page"
              @pageChanged="pageChanged"
              @sizeChanged="sizeChanged"
              @selected="selected"
            >
              <div class slot="cellSlot" slot-scope="scope">
                <span>
                  <!-- <img class="imgIcon" :src="iconClass" alt /> -->
                  {{ scope.scope.row.creatorName }}
                </span>
              </div>
            </SrTable>
          </el-tab-pane>
        </el-tabs>
        <div
          class="placeholderBox"
          v-if="paginationIndex && activeName == '未读消息'"
        ></div>
        <div v-if="activeName == '未读消息'" class="btnBox">
          <el-button
            size="small"
            class="buttonSmall"
            :disabled="btnDisbled"
            v-debounce="[() => setMessageType('all'), config.deTime]"
            >全部已读</el-button
          >
          <el-button
            :disabled="btnDisbled"
            size="small"
            class="buttonSmall"
            v-debounce="[() => setMessageType(), config.deTime]"
            >标记已读</el-button
          >
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { api_queryMessageNumber } from "@/api/user.js";
import {
  api_getMessageList,
  api_updateMessageReaded,
  api_queryCount,
} from "@/api/GetInformation.js";
import config from "@/settings.js";
// import shouqi from "@/assets/shouqi_xiaoxi.png";
// import zhankai from "@/assets/zhankai_xiaoxi.png";
export default {
  components: {},
  props: {
    informData: {
      type: Object,
    },
  },
  watch: {
    informData: {
      handler: function (value) {
        if (value) {
          this.unread = value.unreadNumber;
          this.read = value.readedNumber;
        }
      },
    },
  },
  data() {
    return {
      config,
      btnDisbled: true,
      dialogVisible: false,
      activeName: "未读消息",
      paginationIndex: true,
      search: {
        size: "small",
        labelConfig: {
          labelWidth: "90px",
          labelSuffix: ":",
          labelPosition: "right",
        },
        config: [
          {
            type: "text",
            placeholder: "搜索消息关键词搜索",
            bind: "name", // 对应this.search.data对象的field1
          },
        ],
        enum: {},
        formData: {
          field3: "2019",
          field1: "",
        },
      },
      table: {
        data: [], // 表格数据
        config: {
          // expand: true, // 表格扩展
          multiple: true,
          operationWidth: 40, // 操作列的宽度，不传默认180
          header: [
            // 表格列配置
            { label: "消息内容", prop: "messageContent" },
            {
              label: "提交人",
              prop: "creatorName",
              cellSlot: true,
              width: 120,
            },
            { label: "单位", prop: "buildName", width: 180 },
            { label: "提交时间", prop: "createTime", width: 180 },
          ],
          indexConfig: {
            display: true,
            label: "序号",
            width: "70",
          },
          emptyConfig: {
            // 表格数据为空时默认显示的内容
            display: true,
            emptyNull: "暂无数据",
          },
          selectionConfig: {
            display: true,
            width: "70",
            selectable: this.selectable,
          },
          operateConfig: false,
          selection: true, // 是否显示复选框
        },
        page: {
          // 分页配置
          total: 0, //总条数
          pages: 2, //总页数
          pageSize: 10, //每页展示多少个
          pageNum: 1, //当前页
        },
      },
      table2: {
        data: [], // 表格数据
        config: {
          // expand: true, // 表格扩展
          multiple: true,
          operationWidth: 40, // 操作列的宽度，不传默认180
          header: [
            // 表格列配置
            { label: "消息内容", prop: "messageContent" },
            {
              label: "提交人",
              prop: "creatorName",
              cellSlot: true,
              width: 120,
            },
            { label: "单位", prop: "buildName", width: 180 },
            { label: "提交时间", prop: "createTime", width: 180 },
          ],
          indexConfig: {
            display: true,
            label: "序号",
            width: "70",
          },
          emptyConfig: {
            // 表格数据为空时默认显示的内容
            display: true,
            emptyNull: "暂无数据",
          },
          operateConfig: false,
          selection: true, // 是否显示复选框
        },
        page: {
          // 分页配置
          total: 0, //总条数
          pages: 2, //总页数
          pageSize: 10, //每页展示多少个
          pageNum: 1, //当前页
        },
      },
      searchConfig: {
        label: "请输入要查询的消息内容",
        value: "",
      },
      unread: 0,
      read: 0,
      unreadType: 0,
      selectedList: [],
      // iconClass: shouqi,
      button2Index: true,
      tabsIndex: 0,
    };
  },
  mounted() {},
  computed: {
    userInfo() {
      return this.$store.getters.userInfo;
    },
  },
  methods: {
    selectable(row, index) {
      // 列表选择框
      if (row.id) {
        return true;
      } else {
        return false;
      }
    },
    handleClick(val) {
      // tab选项卡点击
      this.tabsIndex = +val.index;
      this.unreadType = +val.index;
      this.getList(1);
    },
    handleClose() {
      this.$emit("handleClose");
      this.dialogVisible = false;
    },
    //获取消息数量
    getMessageNumber() {
      let buid = this.userInfo.bizunitInfos[0].buid;
      let jfid = this.userInfo.jfid;
      let data = {
        receivedId: jfid,
        buid: buid,
      };
      api_queryCount(data)
        .then((res) => {
          if (res.msg && res.msg.code == "0000") {
            this.unread = res.data.unreadNumber;
            this.read = res.data.readedNumber;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    selected(val) {
      this.selectedList = val;
      // iconxinfengdakai   iconemail-fill
    },
    setStatus(val) {
      this.unreadType = val;
      // if (val == 0) {
      //   this.table.config.multiple = true;
      //   this.table.config.selection = true;
      //   this.button2Index = true;
      //   this.table.data = [];
      //   this.$set(this, "iconClass", shouqi);
      // } else {
      //   this.table.config.multiple = false;
      //   this.table.config.selection = false;
      //   this.table.data = [];
      //   this.button2Index = false;
      //   this.$set(this, "iconClass", zhankai);
      // }
      this.table.page = {
        total: 0, //总条数
        pages: 2, //总页数
        pageSize: 10, //每页展示多少个
        pageNum: 1, //当前页
      };
      this.getList();
    },
    setMessageType(val) {
      let ids = [];
      if (val == "all") {
        if (this.table.data && this.table.data.length > 0) {
          this.table.data.forEach((item) => {
            ids.push(item.id);
          });
        }
      } else {
        if (this.selectedList.length > 0) {
          this.selectedList.forEach((item) => {
            if (item.id) {
              ids.push(item.id);
            }
          });
        }
      }
      if (ids.length > 0) {
        api_updateMessageReaded(ids)
          .then((res) => {
            if (res.msg && res.msg.code == "0000") {
              this.getList(1);
              this.$message.success("设置成功!");
              this.getMessageNumber();
            } else {
              // this.$message.error('设置已读失败!');
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    init() {
      this.getMessageNumber();
      this.getList(1);
      this.getMessageNumber();
      this.dialogVisible = true;
    },
    pageChanged(val) {
      if (this.tabsIndex === 0) {
        this.table.page.pageNum = val;
      } else if (this.tabsIndex == 1) {
        this.table2.page.pageNum = val;
      }

      this.getList();
    },
    sizeChanged(val) {
      if (this.tabsIndex === 0) {
        this.table.page.pageSize = val;
      } else if (this.tabsIndex == 1) {
        this.table2.page.pageSize = val;
      }

      this.getList(1);
    },
    getList(page) {
      let tableData = {};
      if (this.tabsIndex === 0) {
        tableData = this.table;
      } else if (this.tabsIndex == 1) {
        tableData = this.table2;
      }
      if (page) {
        tableData.page.pageNum = page;
      }
      let buid = sessionStorage.getItem('buid');
      let jfid = this.userInfo.jfid;
      let data = {
        messageContent: this.search.formData.name,
        unread: +this.unreadType,
        pageNum: tableData.page.pageNum,
        pageSize: tableData.page.pageSize,
        receivedId: jfid,
        buid: buid,
      };
      api_getMessageList(data)
        .then((res) => {
          if (res.msg && res.msg.code == "0000") {
            if (this.tabsIndex === 0) {
              this.table.page.total = res.data.total;
              this.table.page.pages = res.data.pages;
              this.table.data = res.data.records;
              if (res.data.records.length) {
                this.btnDisbled = false;
              }
              this.paginationIndex =
                this.table.page.total < this.table.page.pageSize;
            } else if (this.tabsIndex == 1) {
              this.table2.page.total = res.data.total;
              this.table2.page.pages = res.data.pages;
              this.table2.data = res.data.records;
              this.paginationIndex = false;
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.common-dialog {
  .imgIcon {
    width: 16px;
    vertical-align: sub;
  }
  ::v-deep .tabs {
    .el-tabs__item {
      min-width: 144px;
      padding: 0 17px 0 16px;
      text-align: center;
      border: none;
      &:last-child {
        .base-iconfont {
          margin-bottom: 1px;
        }
      }
      .base-iconfont {
        line-height: 19px;
        vertical-align: middle;
        display: inline-block;
      }
    }
  }
  ::v-deep.search-config {
    .search_right_button {
      margin-right: 0;
    }
    .el-form-item__content {
      span:last-child {
        .el-button {
          margin-right: 0;
        }
      }
    }
  }
  .placeholderBox {
    height: 36px;
  }
  ::v-deep .el-dialog {
    border-radius: 8px;
  }
  ::v-deep .el-tabs--border-card {
    box-shadow: none;
    border: 0;
    .el-tabs__header {
      background: #fff;
      border: 0;
      .el-tabs__item {
        color: #333 !important;
      }
      .el-tabs__nav {
        border-radius: 8px 8px 0px 0px;
        border: 1px solid #cccccc;
        border-bottom: 0;
      }

      .is-active {
        background: #1890ff;
        color: #fff !important;
        border-color: #1890ff;
      }
      .el-tabs__item {
        &:first-child {
          border-radius: 8px 0px 0px 0px;
        }

        &:last-child {
          border-radius: 0px 8px 0px 0px;
        }
      }
    }
    .el-tabs__content {
      padding: 0;
      padding-bottom: 40px;
    }
  }
  ::v-deep .el-dialog__body {
    padding: 24px;
    max-height: none;
    position: relative;
    .sr_search {
      position: absolute;
      right: 24px;
      top: 24px;
      z-index: 10;
      .el-col-19 {
        width: 100%;
      }
      .el-col-5 {
        display: none;
      }
      // .el-form-item {
      // margin: 0;
      // &:first-child {
      //   margin-right: 8px;
      // }
      // }
      // .el-input__inner {
      //   width: 200px;
      // }
      .el-input__suffix {
        .el-icon-search {
          display: none;
        }
      }
    }

    .btnBox {
      position: absolute;
      left: 24px;
      bottom: 24px;

      .buttonSmall {
        width: 104px;
        height: 32px;
        border-radius: 16px;
        font-size: 14px;
        box-sizing: border-box;
      }
      .is-disabled {
        border-color: #ccc;
      }
    }
  }
  ::v-deep .el-dialog__headerbtn,
  ::v-deep .el-message-box__headerbtn {
    top: 18px;
  }
  ::v-deep .el-dialog__title {
    line-height: 56px;
  }
  ::v-deep .el-dialog__header {
    padding: 0;
    height: 56px;
    line-height: 56px;
    text-align: center;
    border-bottom: 1px solid #e8e8e8;
    display: flex;
    .el-dialog__title {
      flex-grow: 1;
    }
    .el-dialog__headerbtn {
      margin-right: 4px;
    }
  }
  ::v-deep .el-table {
    border: 1px solid rgba(230, 230, 230, 1);
    border-radius: 0 8px 8px 8px;
  }
  ::v-deep.table-components .el-table th,
  ::v-deep.table-components .el-table td {
    padding: 13px 0;
  }
  .read {
    ::v-deep .el-table {
      td {
        color: #999999;
      }
    }
  }

  ::v-deep .table-components {
    // height: 431px;
    padding: 0 20px !important;
    padding-bottom: 20px !important;
    /deep/.el-table__body-wrapper {
      min-height: 250px;
    }
    .table-header {
      padding: 0;
    }
  }
}
</style>
