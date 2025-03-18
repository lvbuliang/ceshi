<template>
  <div class="fm-add-style">
    <el-container class="fm2-container">
      <el-header class="fm2-container-header">
        <el-input class="input" :value="title" @input="changeTitle"></el-input>
        <div class="buttonBox">
          <el-popover
            placement="top-start"
            trigger="hover"
            content="清空已设置的组件"
          >
            <el-button
              slot="reference"
              type="text"
              size="medium"
              class="arrow-up"
              @click="handleClear"
            >
              <img class="handleClearImg" :src="handleClearIcon" alt="" />
            </el-button>
          </el-popover>

          <el-popover
            placement="top-start"
            trigger="hover"
            content="删除当前模块"
          >
            <el-button
              slot="reference"
              type="text"
              size="medium"
              @click="deleteFm"
            >
              <svg-icon icon-class="ashbin" class="svg_ashbin" />
            </el-button>
          </el-popover>
          <el-popover
            placement="top-start"
            trigger="hover"
            content="同步关联表单模板"
          >
            <el-button
              slot="reference"
              type="text"
              size="medium"
              icon="el-icon-document-copy"
              @click="syncTemplate"
            ></el-button>
          </el-popover>
          <el-popover placement="top-start" trigger="hover" content="查看JSON">
            <el-button
              slot="reference"
              type="text"
              size="medium"
              icon="el-icon-view"
              @click="showJson"
            ></el-button>
          </el-popover>
          <el-popover
            v-if="!UnfoldFlag"
            placement="top-start"
            trigger="hover"
            content="展开模块"
          >
            <el-button
              slot="reference"
              type="text"
              size="medium"
              icon="el-icon-arrow-down"
              class="arrow-up"
              @click="Unfold"
            ></el-button>
          </el-popover>
          <el-popover
            placement="top-start"
            trigger="hover"
            v-else
            content="收起模块"
          >
            <el-button
              class="arrow-up"
              slot="reference"
              type="text"
              size="medium"
              icon="el-icon-arrow-up"
              @click="PackUp"
            ></el-button>
          </el-popover>
        </div>
      </el-header>
      <el-main class="fm2-main" v-if="UnfoldFlag">
        <el-container>
          <el-aside class="asideBox" width="280px">
            <div class="components-list">
              <template v-if="basicFields.length">
                <div class="widget-cate">
                  <span class="dol"></span> 可选字段
                </div>
                <draggable
                  tag="ul"
                  :list="basicComponents"
                  v-bind="{
                    group: { name: 'people', pull: 'clone', put: false },
                    sort: false,
                    ghostClass: 'ghost',
                  }"
                  @end="handleMoveEnd"
                  @start="handleMoveStart"
                  :move="handleMove"
                >
                  <li
                    class="form-edit-widget-label"
                    :class="{ 'no-put': item.type == 'divider' }"
                    v-for="(item, index) in basicComponents"
                    :key="index"
                  >
                    <a>
                      <i class="icon moduleiconfont" :class="item.icon"></i>
                      <span>{{
                        item.name ? item.name : item.options.name
                      }}</span>
                    </a>
                  </li>
                </draggable>
              </template>
              <template v-if="basicFields.length">
                <div class="widget-cate">
                  <span class="dol"></span> 基础组件
                </div>
                <draggable
                  tag="ul"
                  :list="basicComponentsList"
                  v-bind="{
                    group: { name: 'people', pull: 'clone', put: false },
                    sort: false,
                    ghostClass: 'ghost',
                  }"
                  @end="handleMoveEnd"
                  @start="handleMoveStart"
                  :move="handleMove"
                >
                  <li
                    class="form-edit-widget-label"
                    :class="{ 'no-put': item.type == 'divider' }"
                    v-for="(item, index) in basicComponentsList"
                    :key="index"
                  >
                    <a>
                      <i class="icon moduleiconfont" :class="item.icon"></i>
                      <span>{{
                        item.name ? item.name : item.options.name
                      }}</span>
                    </a>
                  </li>
                </draggable>
              </template>
            </div>
          </el-aside>
          <el-container class="center-container" direction="vertical">
            <el-main
              class="mainBox"
              :class="{ 'widget-empty': widgetForm.list.length == 0 }"
            >
              <div class="widget-cate"><span class="dol"></span> 组件</div>
              <basic-widget-form
                v-if="!resetJson"
                ref="widgetForm"
                :data="widgetForm"
                :select.sync="widgetFormSelect"
              ></basic-widget-form>
            </el-main>
          </el-container>
          <el-aside class="widget-config-container" width="258px">
            <el-container>
              <el-header class="tab-container" height="45px">
                <div
                  class="config-tab"
                  :class="{ active: configTab == 'widget' }"
                  @click="handleConfigSelect('widget')"
                >
                  字段属性
                </div>
                <div
                  class="config-tab"
                  :class="{ active: configTab == 'form' }"
                  @click="handleConfigSelect('form')"
                >
                  表单属性
                </div>
              </el-header>
              <el-main class="config-content">
                <widget-config
                  v-show="configTab == 'widget'"
                  :data="widgetFormSelect"
                ></widget-config>
                <form-config
                  v-show="configTab == 'form'"
                  :data="widgetForm.config"
                ></form-config>
              </el-main>
            </el-container>
          </el-aside>
        </el-container>
      </el-main>
    </el-container>
    <json-drawer
      size="60%"
      :visible.sync="jsonDrawerVisible"
      :json-str="JSON.stringify(formData)"
      @refresh="refreshJson"
    />
  </div>
</template>

<script>
import { basicComponents, comType } from "./components/formAddConfig.js";
import BasicWidgetForm from "./components/BasicWidgetForm.vue";
import WidgetConfig from "./components/WidgetConfig.vue";
import FormConfig from "./components/FormConfig.vue";
import CusDialog from "./components/CusDialog.vue";
import Draggable from "vuedraggable";
import JsonDrawer from "./components/JsonDrawer";
import { formatFormAddConfig } from "@/utils/tem.js";
export default {
  components: {
    BasicWidgetForm,
    WidgetConfig,
    FormConfig,
    Draggable,
    CusDialog,
    JsonDrawer,
  },
  props: {
    basicData: {
      // 该模版的所有字段
      type: Object,
    },
    selectData: {
      // 已经选择的字段
      type: Object,
    },
    title: {
      type: String,
    },
  },
  data() {
    return {
      handleClearIcon: require("@/assets/handleClear.png"),
      choiceArr: [],
      basicComponents,
      basicFields: ["input"],
      basicComponentsList: [],
      resetJson: false,
      widgetForm: {
        list: [],
        config: {
          labelNum: 130,
          // labelPosition: 'right',
          // size: 'small'
        },
      },
      widgetFormSelect: {},
      configTab: "widget",
      previewVisible: false,
      importEditor: null,
      jsonEg: "",
      basicComponentsMap: null,
      jsonDrawerVisible: false,
      formData: {},
      generateConf: null,
      dialogVisible: false,
      UnfoldFlag: true,
    };
  },
  mounted() {
    // this._loadComponents();
    this.setJSON(this.selectData);
  },
  methods: {
    syncTemplate() {
      let data = formatFormAddConfig(this.widgetForm);
      this.formData = {
        formAdd: data,
      };
      this.$emit("syncTemplate", JSON.stringify(this.formData));
    },
    Unfold() {
      this.UnfoldFlag = true;
    },
    PackUp() {
      this.UnfoldFlag = false;
    },
    //触发删除
    deleteFm() {
      this.$SrUtils.showConfirmMessage.call(this, {
        title: "确认要删除该模块吗？",
        content: "您的操作将删除当前模块里已设置的组件，请再次确认后慎重操作。",
        okFun: () => {
          this.$emit("deleteFm");
        },
        cancelFun: () => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        },
      });
    },
    changeTitle(val) {
      this.$emit("update:title", val);
    },
    _loadComponents() {
      this.basicComponentsMap = new Map();
      // 根据剩下可选择的字段渲染左侧可拖拽的组件
      //提取自定义模板基础组件
      let newList = JSON.parse(JSON.stringify(basicComponents));
      let list = newList.map((item) => {
        let key =
          Date.parse(new Date()) + "_" + Math.ceil(Math.random() * 99999);
        // 公共属性
        const commonAttr = {
          name: comType[item.type],
          col: 8,
          className: "",
          isHide: false,
          isHideView: false,
        };
        if (item.type === "checkbox") {
          commonAttr["defaultValue"] = [];
        } else if (item.type === "star" || item.type === "number") {
          commonAttr["defaultValue"] = 0;
        } else {
          commonAttr["defaultValue"] = "";
        }
        var combindAttr = Object.assign({}, commonAttr, item.options);
        if (combindAttr["dataList"] === "") {
          combindAttr["options"] = [
            {
              dataValue: "1",
              dataName: "选项标签1",
              disabled: false,
            },
            {
              dataValue: "2",
              dataName: "选项标签2",
              disabled: false,
            },
          ];
        }
        this.basicComponentsMap.set(item.type, combindAttr);
        item.options = JSON.parse(JSON.stringify(combindAttr));
        item.key = key;
        return {
          ...item,
        };
      });
      //获取的关联表单组件
      this.basicComponents = this.choiceArr.map((item) => {
        // 公共属性
        const commonAttr = item;
        if (item.type === "checkbox") {
          commonAttr["defaultValue"] = [];
        } else if (item.type === "star" || item.type === "number") {
          commonAttr["defaultValue"] = 0;
        } else {
          commonAttr["defaultValue"] = "";
        }
        var combindAttr = Object.assign({}, commonAttr, item.options);
        if (combindAttr["dataList"] === "") {
          combindAttr["options"] = [
            {
              dataValue: "1",
              dataName: "选项标签1",
              disabled: false,
            },
            {
              dataValue: "2",
              dataName: "选项标签2",
              disabled: false,
            },
          ];
        } else {
          combindAttr["options"] = this.basicData.formAdd.enums[item.dataList];
        }
        this.basicComponentsMap.set(item.type, combindAttr);
        item.options = JSON.parse(JSON.stringify(combindAttr));
        return {
          ...item,
        };
      });
      this.basicComponentsList = [...list];
    },
    handleMoveEnd(evt) {},
    handleMoveStart({ oldIndex }) {},
    handleMove() {
      return true;
    },
    // 预览
    handlePreview() {
      let data = formatFormAddConfig(this.widgetForm);
      this.formData = {
        formAdd: data,
      };
      this.dialogVisible = true;
    },
    handleConfigSelect(value) {
      this.configTab = value;
    },
    // 清空
    handleClear() {
      this.$SrUtils.showConfirmMessage.call(this, {
        title: "确认要清空组件吗？",
        content: "您的操作将清空当前模块里已设置的组件，请再次确认后慎重操作。",
        okFun: () => {
          this.widgetForm = {
            list: [],
            config: {
              labelNum: 130,
            },
          };

          this.widgetFormSelect = {};
        },
        cancelFun: () => {
          this.$message({
            type: "info",
            message: "已取消清空",
          });
        },
      });
    },
    onDialogClose() {
      this.$refs["formAddRef"]["resetClipboard"]();
      this.previewVisible = false;
    },
    setJSON(param) {
      // 把formAdd组件的配置转成widgetForm
      if (param && param.formAdd) {
        let json = param.formAdd;
        let list = [];
        if (json && json.config && json.config.length > 0) {
          json.config.map((item) => {
            let temp = {};
            let options = this.basicComponentsMap.get(item.type);
            let comOptions = Object.assign({}, options, item);
            temp["options"] = comOptions;
            temp["type"] = comOptions.type;
            temp["rule"] = {
              required: item.required ? true : false,
              trigger: item.trigger,
              list: [],
            };
            if (item.key) {
              temp["key"] = item.key;
            } else {
              temp["key"] = comOptions.type + "_" + comOptions.bind;
            }
            if (item.dataList) {
              temp["options"]["options"] = json["enums"][item.dataList];
            }
            for (let ruleName in item.rules) {
              let ruleNameArr = ruleName.split("_");
              let ruleValue = item.rules[ruleName];
              let ruleObj = {};
              if (ruleNameArr[0] == "regular") {
                ruleObj["type"] = 1;
                ruleObj["ruleName"] = ruleNameArr[1];
                ruleObj["errorTip"] = ruleValue;
              } else {
                ruleObj["type"] = 2;
                ruleObj["expression"] = ruleValue.pattern;
                ruleObj["errorTip"] = ruleValue.message;
              }
              temp["rule"]["list"].push(ruleObj);
            }
            list.push(temp);
          });
        }
        this.widgetForm.list = list;
        this.widgetForm.config = param.formAdd.otherConfig;
        if (list.length > 0) {
          this.widgetFormSelect = list[0];
        }
      }
    },
    showJson() {
      let data = formatFormAddConfig(this.widgetForm);
      this.formData = {
        formAdd: data,
      };
      this.jsonDrawerVisible = true;
    },
    refreshJson(data) {
      this.setJSON(data);
    },
    generate(data) {
      this.generateConf = data;
      this.previewVisible = true;
    },
  },
  watch: {
    widgetForm: {
      handler: function(val) {
        const keyArr = val.list.map((res) => {
          return res.options.bind;
        });
        this.$emit("update:selectData", {
          formAdd: formatFormAddConfig(this.widgetForm),
          title: this.title,
        });
        this.choiceArr = this.basicData.formAdd.config.filter((res) => {
          return !keyArr.includes(res.bind);
        });
        this._loadComponents();
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>

<style lang="scss">
$primary-color: #409eff;
$primary-background-color: #ecf5ff;
.el-message-box__content .el-message-box__status {
  top: -33px;
}
.el-message-box .el-message-box__btns {
  justify-content: end;
  text-align: right;
}
.fm-add-style {
  .fa-icon {
    width: auto;
    height: 1em; /* 或任意其它字体大小相对值 */

    /* 要在 Safari 中正常工作，需要再引入如下两行代码 */
    max-width: 100%;
    max-height: 100%;
    vertical-align: middle;
  }

  .fm2-container {
    background: #fff;
    height: 100%;
    // border: 1px solid #e0e0e0;
    .fm2-container-header {
      height: 40px !important;
      background: #fafafa;
      border-radius: 8px 8px 0px 0px;
      padding: 0;
      margin-bottom: 8px;
      display: flex;
      align-content: center;
      .input {
        width: 50% !important;
        .el-input__inner {
          height: 100%;
          padding: 0 16px;
          border: none;
          font-weight: 400;
          color: #333333;
          background: #fafafa;
        }
      }
      .buttonBox {
        flex: 1;
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: flex-end;
        .svg_ashbin {
          font-size: 16px;
        }
        .handleClearImg {
          width: 16px;
          height: 16px;
        }
        i {
          font-size: 16px;
          color: #666666;
        }
        .el-button {
          width: 63px;
          display: flex;
          margin-left: 0;
          justify-content: center;
          i,
          span {
            flex: 1;
            border-right: 1px dashed #ccc;
          }
        }
        .arrow-up {
          i,
          span {
            border-right: none;
          }
        }
      }
    }
    & > .el-container {
      background: #fff;
    }
    .fm2-main {
      position: relative;

      .el-aside {
        padding: 0;
        margin-bottom: 0;
      }
    }
    main {
      padding: 0;
    }
  }

  .center-container {
    margin-right: 8px;
    background: #fafafa;
    padding: 8px 0;
    .mainBox {
      .widget-cate {
        padding: 8px 12px;
        font-size: 13px;
        line-height: 32px;
        .dol {
          width: 8px;
          height: 8px;
          display: inline-block;
          border: 1px solid #1890ff;
          border-radius: 100%;
          margin-right: 4px;
        }
      }
    }
    .btn-bar {
      height: 45px;
      line-height: 45px;
      font-size: 18px;
      border-bottom: solid 2px #e4e7ed;
      text-align: right;
      display: flex;
      align-items: center;
    }

    .el-main {
      padding: 0;
      position: relative;
      background: #fafafa;
    }
  }
  .asideBox {
    border-bottom-left-radius: 8px;
    margin-right: 8px;
  }
  .components-list {
    padding: 8px 0;
    width: 100%;
    height: 100%;
    background: #fafafa;
    border-radius: 0px 0px 0px 8px;
    .widget-cate {
      padding: 8px 12px;
      font-size: 13px;
      .dol {
        width: 8px;
        height: 8px;
        display: inline-block;
        border: 1px solid #1890ff;
        border-radius: 100%;
        margin-right: 4px;
      }
    }

    ul {
      min-height: 200px;
      position: relative;
      overflow: hidden;
      padding: 0 10px 10px;
      margin: 0;
    }

    .form-edit-widget-label {
      font-size: 12px;
      display: block;
      width: 48%;
      position: relative;
      float: left;
      left: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-bottom: 8px;
      margin-right: 8px;
      font-weight: 400;
      color: #262626;
      background: #ffffff;
      border-radius: 8px;
      border: 1px solid #d9d9d9;
      box-sizing: border-box;

      &:hover {
        color: $primary-color;
        border: 1px solid $primary-color;
        a {
          color: $primary-color;
        }
      }
      &:nth-child(2n) {
        margin-right: 0;
      }
      & > a {
        display: block;
        cursor: move;
        background: #ffffff;
        color: #262626;
        display: flex;
        align-items: center;
        .icon {
          margin-right: 6px;
          margin-left: 8px;
          font-size: 14px;
          display: inline-block;
          vertical-align: middle;
        }

        span {
          display: inline-block;
          vertical-align: middle;
        }
      }
    }
  }

  .widget-form-container {
    .widget-form-list {
      // background: #fff;
      min-height: 600px;
      margin: 10px;

      .widget-col-list {
        min-height: 50px;
        border: 1px dashed #ccc;
        background: #fff;
      }

      .widget-view {
        border-radius: 8px;
        margin-bottom: 24px !important;
        margin-right: 8px;
        text-align: left;
        position: relative;
        display: inline-block;
        border: 1px dashed rgba(170, 170, 170, 0.7);
        background-color: rgba(236, 245, 255, 0.3);
        margin: 0;

        .el-form-item__content {
          position: unset;
        }
        .el-form-item__label {
          text-align: left;
          text-indent: 10px;
        }
        &.is_req {
          .el-form-item__label::before {
            content: "*";
            color: #f56c6c;
            margin-right: 4px;
          }
        }

        &.col-6 {
          width: 25%;
        }
        &.col-8 {
          width: 33.333%;
        }
        &.col-12 {
          width: 50%;
        }
        &.col-24 {
          width: 100%;
        }
        .widget-view-description {
          height: 15px;
          line-height: 15px;
          font-size: 13px;
          margin-top: 6px;
          color: #909399;
        }

        .widget-view-action {
          position: absolute;
          right: 0;
          bottom: 0;
          height: 28px;
          line-height: 28px;
          border-radius: 2px;
          background: $primary-color;
          z-index: 9;

          i {
            font-size: 14px;
            color: #fff;
            margin: 0 5px;
            cursor: pointer;
          }
        }
        .topRight {
          top: -30px;
          right: 0px;
        }
        .topLeft {
          top: -30px;
          right: 52px;
        }
        .widget-view-drag {
          position: absolute;
          // left: -2px;
          // top: -2px;
          bottom: -18px;
          height: 28px;
          line-height: 28px;
          border-radius: 2px;
          background: $primary-color;
          z-index: 9;

          i {
            font-size: 14px;
            color: #fff;
            margin: 0 5px;
            cursor: move;
          }
        }

        &:after {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          display: block;
        }

        &:hover {
          background: $primary-background-color;
          outline: 1px solid $primary-color;
          outline-offset: 0px;

          &.active {
            outline: 2px solid $primary-color;
            border: 1px solid $primary-color;
            outline-offset: 0;
          }

          .widget-view-drag {
            display: block;
          }
        }

        &.active {
          outline: 2px solid $primary-color;
          border: 1px solid $primary-color;
        }

        &.ghost {
          background: #f56c6c;
          border: 2px solid #f56c6c;
          outline-width: 0;
          height: 3px;
          box-sizing: border-box;
          font-size: 0;
          content: "";
          overflow: hidden;
          padding: 0;
        }
      }

      .widget-table {
        padding-bottom: 0;
        padding: 5px;
        background-color: rgba(253, 246, 236, 0.3);

        .widget-table-wrapper {
          min-height: 50px;
          background: #fff;
          display: flex;
          justify-content: flex-start;

          .widget-table-row {
            td {
              border-bottom: 0;
            }
          }

          .widget-table-left {
            width: 51px;
            border-left: 1px solid #ebeef5;
            border-right: 1px solid #ebeef5;
            border-top: 1px solid #ebeef5;
            flex: none;
          }

          .widget-table-view {
            border: 1px solid #ebeef5;
            width: 200px;
            float: left;
            height: 100%;
            position: relative;
            display: block;

            .el-table {
              height: 100%;
            }

            &.is_req {
              .el-form-item__label::before {
                content: "*";
                color: #f56c6c;
                margin-right: 4px;
              }
            }

            .widget-view-description {
              height: 15px;
              line-height: 15px;
              font-size: 13px;
              margin-top: 6px;
              color: #909399;
            }

            .widget-view-action {
              position: absolute;
              right: 0;
              bottom: 0;
              height: 28px;
              line-height: 28px;
              background: $primary-color;
              z-index: 9;

              i {
                font-size: 14px;
                color: #fff;
                margin: 0 5px;
                cursor: pointer;
              }
            }

            .widget-view-drag {
              position: absolute;
              left: -2px;
              top: -2px;
              bottom: -18px;
              height: 28px;
              line-height: 28px;
              background: $primary-color;
              z-index: 9;

              i {
                font-size: 14px;
                color: #fff;
                margin: 0 5px;
                cursor: move;
              }
            }

            &::after {
              position: absolute;
              left: 0;
              right: 0;
              top: 0;
              bottom: 0;
              display: block;
              content: "";
            }

            &::before {
              display: none;
            }

            &:hover {
              background: $primary-background-color;
              outline: 1px solid $primary-color;
              outline-offset: -1px;

              &.active {
                border: 1px solid $primary-color;
                outline: 1px solid $primary-color;
                outline-offset: -1px;
              }

              .widget-view-drag {
                display: block;
              }
            }

            &.active {
              outline: 1px solid $primary-color;
              border: 1px solid $primary-color;
              outline-offset: -1px;
            }

            &.ghost {
              background: #f56c6c;
              outline-width: 0;
              width: 5px !important;
              box-sizing: border-box;
              font-size: 0;
              content: "";
              overflow: hidden;
              padding: 0;
              position: relative;
              outline: none !important;
              border: 0 !important;

              &::after {
                background: #f56c6c;
                position: absolute;
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;
                z-index: 9999;
                content: "";
                outline: none;
              }
            }
          }

          .widget-table-content {
            width: 100%;
            outline: 1px dashed #ccc;
            background: #fff;
            flex-grow: 1;
            margin: 0 1px;
            overflow: auto;

            & > div {
              height: 100%;
            }

            .widget-table-col {
              height: 100%;

              .ghost {
                background: #f56c6c;
                position: relative;
                content: "";
                float: left;
                height: 100%;
                width: 5px !important;
                list-style: none;
                font-size: 0;
                overflow: hidden;
                outline: none;

                &::after {
                  background: #f56c6c;
                  position: absolute;
                  top: 0;
                  left: 0;
                  bottom: 0;
                  right: 0;
                  z-index: 9999;
                  content: "";
                  outline: none;
                }
              }
            }
          }
        }

        &.active {
          outline: 2px solid #e6a23c;
          border: 1px solid #e6a23c;
        }

        &:hover {
          background: #fdf6ec;
          outline: 1px solid #e6a23c;
          outline-offset: 0px;

          &.active {
            outline: 2px solid #e6a23c;
            border: 1px solid #e6a23c;
            outline-offset: 0;
          }
        }

        .widget-view-action.widget-col-action {
          background: #e6a23c;
        }

        .widget-view-drag.widget-col-drag {
          background: #e6a23c;
        }

        &::after {
          display: none;
        }

        &.ghost {
          background: #f56c6c;
          outline-width: 0;
          height: 5px;
          box-sizing: border-box;
          font-size: 0;
          content: "";
          overflow: hidden;
          padding: 0;
          position: relative;
          outline: none;
          border: 0;

          &::after {
            background: #f56c6c;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            content: "";
            display: block;
            z-index: 999;
          }
        }
      }

      .widget-col {
        padding-bottom: 0;
        padding: 5px;
        background-color: rgba(253, 246, 236, 0.3);

        &.active {
          outline: 2px solid #e6a23c;
          border: 1px solid #e6a23c;
        }

        &:hover {
          background: #fdf6ec;
          outline: 1px solid #e6a23c;
          outline-offset: 0px;

          &.active {
            outline: 2px solid #e6a23c;
            border: 1px solid #e6a23c;
            outline-offset: 0;
          }
        }

        .el-col {
          min-height: 50px;
        }

        &.ghost {
          background: #f56c6c;
          border: 2px solid #f56c6c;
          outline-width: 0;
          height: 3px;
          box-sizing: border-box;
          font-size: 0;
          content: "";
          overflow: hidden;
          padding: 0;
        }

        .widget-view-action.widget-col-action {
          background: #e6a23c;
        }

        .widget-view-drag.widget-col-drag {
          background: #e6a23c;
        }

        &::after {
          display: none;
        }
      }

      .ghost {
        background: #f56c6c;
        border: 2px solid #f56c6c;
        outline-width: 0;
        height: 3px;
        box-sizing: border-box;
        font-size: 0;
        content: "";
        overflow: hidden;
        padding: 0;
      }
    }

    .ghost {
      background: #f56c6c;
      border: 2px solid #f56c6c;
      position: relative;

      &::after {
        background: #f56c6c;
      }
    }

    li.ghost {
      height: 5px;
      list-style: none;
      font-size: 0;
      overflow: hidden;
    }

    .widget-grid {
      background: #f4f6fc;
      position: relative;
      border-left: 5px solid transparent;
      padding: 5px;
      margin: 0 !important;

      &.active {
        border-left: 5px solid $primary-color;
        background: #b3d8ff;
      }
    }

    .widget-grid-container {
      &.ghost {
        background: #f56c6c;
        border: 2px solid #f56c6c;
        outline-width: 0;
        height: 3px;
        box-sizing: border-box;
        font-size: 0;
        content: "";
        overflow: hidden;
        padding: 0;
      }
    }

    .ghost {
      background: #f56c6c;
      border: 2px solid #f56c6c;
      position: relative;

      &::after {
        background: #f56c6c;
      }
    }

    li.ghost {
      height: 5px;
      list-style: none;
      font-size: 0;
      overflow: hidden;
    }
  }

  .widget-config-container {
    position: relative;
    background: #fafafa;
    border-radius: 0px 0px 8px 0px;
    .el-header {
      padding: 0 16px;
    }

    .config-tab {
      height: 45px;
      line-height: 45px;
      display: inline-block;
      width: 145px;
      text-align: center;
      font-size: 14px;
      font-weight: 500;
      position: relative;
      cursor: pointer;

      &.active {
        border-bottom: solid 2px $primary-color;
      }
    }

    .config-content {
      padding: 16px;

      .el-form-item__label {
        padding: 0;
        font-weight: 500;
      }

      .el-form-item {
        margin-bottom: 0;
      }
    }

    .ghost {
      background: #fff;
      border: 1px dashed $primary-color;

      &::after {
        background: #fff;
        display: block;
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      }
    }

    ul {
      margin: 0;
      padding: 0;
    }

    li.ghost {
      list-style: none;
      font-size: 0;
      display: block;
      position: relative;
    }
  }

  .viewer-container {
    z-index: 99999 !important;
  }

  .form-empty {
    position: absolute;
    text-align: center;
    width: 300px;
    font-size: 20px;
    top: 200px;
    left: 50%;
    margin-left: -150px;
    color: #ccc;
    img {
      width: 24px;
      height: 24px;
      margin-bottom: 8px;
    }
  }

  .widget-empty {
    background-position: 50%;
  }

  .tab-container {
    display: flex;
  }
}
</style>
