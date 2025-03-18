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
              v-if="deleteFlag"
              slot="reference"
              type="text"
              size="medium"
              icon="el-icon-delete"
              @click="deleteFm"
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
              slot="reference"
              type="text"
              size="medium"
              icon="el-icon-arrow-up"
              class="arrow-up"
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
                <div class="widget-cate"><span class="dol"></span>可选字段</div>
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
                      <span>{{ item.options.name }}</span>
                    </a>
                  </li>
                </draggable>
              </template>
            </div>
          </el-aside>
          <el-container class="center-container" direction="vertical">
            <!-- <el-header class="btn-bar" style="height: 45px;">
              <el-input :value="title" @input="changeTitle"></el-input>
              <el-button
                type="text"
                size="medium"
                icon="el-icon-view"
                @click="showJson"
                >查看json</el-button
              >
              <el-button
                type="text"
                size="medium"
                icon="el-icon-delete"
                @click="handleClear"
                >清空</el-button
              >
            </el-header> -->
            <el-main
              class="mainBox"
              :class="{ 'widget-empty': widgetForm.list.length == 0 }"
            >
              <div class="widget-cate"><span class="dol"></span> 组件</div>
              <widget-form
                v-if="!resetJson"
                ref="widgetForm"
                :data="widgetForm"
                :select.sync="widgetFormSelect"
              ></widget-form>
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
import { comType, basicComponents } from "./components/formAddConfig.js";
import WidgetForm from "./components/WidgetForm.vue";
import WidgetConfig from "./components/WidgetConfig.vue";
import FormConfig from "./components/FormConfig.vue";
import CusDialog from "./components/CusDialog.vue";
import Draggable from "vuedraggable";
import JsonDrawer from "./components/JsonDrawer";
import { formatFormAddConfig } from "@/utils/tem.js";
export default {
  components: {
    WidgetForm,
    WidgetConfig,
    FormConfig,
    Draggable,
    CusDialog,
    JsonDrawer,
  },
  props: {
    selectData: {
      // 已经选择的字段
      type: Object,
    },
    title: {
      type: String,
    },
    deleteFlag: {
      type: Boolean,
      default() {
        return true;
      },
    },
  },
  data() {
    return {
      handleClearIcon: require("@/assets/handleClear.png"),
      basicComponents:JSON.parse(JSON.stringify(basicComponents)) ,
      basicFields: ["input"],
      resetJson: false,
      widgetForm: {
        list: [],
        config: {
          labelNum: 130,
          // labelPosition: 'right',
          // size: 'small'
        },
      },
      widgetFormSelect: null,
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
    console.log(this.selectData);
    this.setJSON(this.selectData);
  },
  methods: {
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
      this.basicComponents = this.basicComponents.map((item) => {
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
        return {
          ...item,
        };
      });
    },
    handleMoveEnd(evt) {},
    handleMoveStart({ oldIndex }) {},
    handleMove() {
      return true;
    },
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
      deep: true,
      immediate: true,
      handler: function() {
        this.$emit("update:selectData", {
          formAdd: formatFormAddConfig(this.widgetForm),
          title: this.title,
        });
        this._loadComponents();
      },
    },
  },
};
</script>
