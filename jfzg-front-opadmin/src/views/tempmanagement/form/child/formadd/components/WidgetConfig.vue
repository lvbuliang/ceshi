<template>
  <div v-if="show" class="fd-widget-config">
    <div class="title">
      <span>基础属性</span>
    </div>
    <el-form label-position="top" :label-suffix="'：'">
      <template v-for="(optionsItem, oindex) in optionsList">
        <el-form-item
          :key="'o_' + oindex"
          :label="attrDesc[optionsItem]"
          v-if="attrDesc[optionsItem]"
        >
          <el-input
            v-if="attrComType[optionsItem] == 'input'"
            v-model="data['options'][optionsItem]"
            :placeholder="'请输入'"
            :disabled="disabled && ['bind', 'name'].includes(optionsItem)"
            clearable
          ></el-input>
          <template v-if="optionsItem == 'dataConfig'">
            <el-input
              v-model="data.options.dataConfig.url"
              placeholder="请输入接口地址"
              clearable
            ></el-input>
          </template>
          <el-input-number
            class="sr-number"
            controls-position="right"
            v-else-if="attrComType[optionsItem] == 'number'"
            v-model="data['options'][optionsItem]"
            :placeholder="'请输入' + attrDesc[optionsItem]"
          ></el-input-number>
          <template v-else-if="attrComType[optionsItem] == 'select'">
            <el-select
              v-model="data['options'][optionsItem]"
              :placeholder="'请选择' + attrDesc[optionsItem]"
            >
              <el-option
                v-for="citem in colList[optionsItem]"
                :key="citem.value"
                :label="citem.label"
                :value="citem.value"
              ></el-option>
            </el-select>
          </template>
          <el-switch
            v-else-if="attrComType[optionsItem] == 'switch'"
            v-model="data['options'][optionsItem]"
          ></el-switch>
        </el-form-item>
        <!-- 接口配置添加 -->
        <template v-if="optionsItem == 'dataConfig'">
          <div>
            <el-row
              v-for="(paramsItem, paramsIndex) in data.options.dataConfig
                .params"
              :key="paramsIndex"
            >
              <el-col :span="12">
                <el-input
                  style="width: 90px; margin-right: 10px"
                  placeholder="参数名"
                  size="mini"
                  clearable
                  v-model="paramsItem.key"
                ></el-input>
              </el-col>
              <el-col :span="12">
                <el-input
                  style="width: 90px; margin-right: 10px"
                  placeholder="参数值"
                  size="mini"
                  clearable
                  v-model="paramsItem.value"
                ></el-input>
              </el-col>
              <el-button
                @click="handleRemoveParams(paramsIndex)"
                circle
                plain
                type="danger"
                size="mini"
                icon="el-icon-minus"
                style="padding: 4px; margin-left: 5px"
              ></el-button>
            </el-row>
            <div style="margin-right: 22px; text-align: right">
              <el-button type="text" @click="handleAddParams"
                >添加选项</el-button
              >
            </div>
          </div>
        </template>
        <!-- 添加下拉选项 -->
        <template v-if="optionsItem == 'dataList'">
          <div>
            <draggable
              tag="ul"
              :list="data['options']['options']"
              v-bind="{
                group: { name: 'options' },
                ghostClass: 'ghost',
                handle: '.drag-item',
              }"
              handle=".drag-item"
            >
              <li
                v-for="(ooitem, ooindex) in data['options']['options']"
                :key="'oo_' + ooindex"
              >
                <i
                  class="drag-item moduleiconfont icon-bars"
                  style="font-size: 16px; margin: 0 5px; cursor: move"
                ></i>
                <el-input
                  style="width: 90px; margin-right: 10px"
                  placeholder="选项标签"
                  size="mini"
                  clearable
                  v-model="ooitem.dataName"
                ></el-input>
                <el-input
                  style="width: 80px"
                  placeholder="选项值"
                  size="mini"
                  clearable
                  v-model="ooitem.dataValue"
                ></el-input>
                <el-switch v-model="ooitem.disabled"></el-switch>
                <el-button
                  @click="handleOptionsRemove(ooindex)"
                  circle
                  plain
                  type="danger"
                  size="mini"
                  icon="el-icon-minus"
                  style="padding: 4px; margin-left: 5px"
                ></el-button>
              </li>
            </draggable>
            <div style="margin-right: 22px; text-align: right">
              <el-button type="text" @click="handleAddOption"
                >添加选项</el-button
              >
            </div>
          </div>
        </template>
      </template>
      <!-- <el-divider></el-divider> -->
      <div class="circlePlusOutlineBox">
        <span>正则校验</span>
        <el-button
          icon="el-icon-circle-plus-outline"
          type="text"
          @click="addRule"
        ></el-button>
      </div>
      <el-form-item label="触发方式">
        <!-- <el-radio-group v-model="data.rule.trigger">
          <el-radio label="blur">失去焦点</el-radio>
          <el-radio label="change">改变值</el-radio>
        </el-radio-group> -->
        <el-select
          v-model="data.rule.trigger"
          clearable
          placeholder="请选择触发方式"
        >
          <el-option
            v-for="item in ruleOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否必填">
        <!-- <el-switch v-model="data.rule.required"></el-switch> -->
        <el-radio-group v-model="data.rule.required">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-if="data.rule.list && data.rule.list.length > 0">
        <div
          v-for="(ruleItem, ruleIndex) in data.rule.list"
          :key="'r_' + ruleIndex"
          class="rule-item"
        >
          <el-form-item label="规则类型">
            <el-select
              v-model="ruleItem.type"
              clearable
              placeholder="请选择触发方式"
            >
              <el-option
                v-for="item in ruleItemTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="正则表达式" v-if="ruleItem.type == 2">
            <el-input
              v-model="ruleItem.expression"
              placeholder="请输入正则表达式"
            ></el-input>
          </el-form-item>
          <el-form-item label="选择规则" v-else>
            <el-select v-model="ruleItem.ruleName" placeholder="请选择规则">
              <el-option
                v-for="item in ruleNameList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="错误提示">
            <el-input
              v-model="ruleItem.errorTip"
              placeholder="请输入错误提示"
            ></el-input>
          </el-form-item>
          <div class="close-btn" @click="removeRule(ruleIndex)">
            <svg-icon icon-class="ashbin" class="svg_ashbin" />
          </div>
        </div>
      </template>
    </el-form>
  </div>
</template>

<script>
import Draggable from "vuedraggable";
import { colList, attrDesc, attrComType } from "./formAddConfig.js";
export default {
  components: {
    Draggable,
  },
  props: ["data", "disabled"],
  data() {
    return {
      ruleItemTypeOptions: [
        {
          label: "内置",
          value: 1,
        },
        {
          label: "自定义",
          value: 2,
        },
      ],
      ruleOptions: [
        {
          label: "失去焦点",
          value: "blur",
        },
        {
          label: "改变值",
          value: "change",
        },
      ],
      colList,
      attrDesc,
      attrComType,
      ruleNameList: [
        {
          label: "大于零的1-2位小数的数字",
          value: "Number1",
        },
        {
          label: "1-2位小数的数字",
          value: "Number2",
        },
        {
          label: "非0正整数",
          value: "Number3",
        },
        {
          label: "正整数",
          value: "Number4",
        },
        {
          label: "大于等于零的且不能超过四位小数",
          value: "Number5",
        },
        {
          label: "中文",
          value: "text1",
        },
        {
          label: "1～5的正整数",
          value: "rate",
        },
        {
          label: "身份证号",
          value: "IdCard",
        },
        {
          label: "银行卡号",
          value: "BankCard",
        },
        {
          label: "邮箱",
          value: "Email",
        },
        {
          label: "数字和大小写字母",
          value: "NumberText",
        },
      ],
    };
  },

  computed: {
    show() {
      if (this.data && Object.keys(this.data).length > 0) {
        return true;
      }
      return false;
    },
    optionsList() {
      let optionsKey = Object.keys(this.data.options);
      // 排序是为了保证，导入的组件和拖拽出来的组件属性列表一致
      return optionsKey;
    },
  },
  methods: {
    handleOptionsRemove(index) {
      this.data["options"]["options"].splice(index, 1);
    },
    handleAddOption() {
      let index = this.data["options"]["options"].length;
      this.data["options"]["options"].push({
        dataValue: "选项值" + index,
        dataName: "选项标签" + index,
        disabled: false,
      });
    },
    handleRemoveParams(index) {
      this.data.options.dataConfig.params.splice(index, 1);
    },
    handleAddParams() {
      this.data.options.dataConfig.params.push({
        key: "",
        value: "",
      });
    },
    addRule() {
      let ruleList = this.data.rule.list;
      let ruleObj = {
        type: 1,
        ruleName: "",
        expression: "",
        errorTip: "",
      };
      ruleList.push(ruleObj);
      this.$set(this.data.rule, "list", ruleList);
    },
    removeRule(index) {
      this.data["rule"]["list"].splice(index, 1);
    },
  },
};
</script>

<style scoped lang="scss">
.fd-widget-config {
  .title {
    font-size: 14px;
    font-weight: 500;
    color: #333333;
    line-height: 22px;
  }
  .rule-item {
    padding: 12px 6px;
    background: #f0f0f0;
    border-radius: 8px;
    position: relative;
    .close-btn {
      // position: absolute;
      // right: -6px;
      // top: -6px;
      width: 100%;
      display: block;
      height: 16px;
      line-height: 16px;
      border-radius: 50%;
      text-align: center;
      z-index: 1;
      cursor: pointer;
      font-size: 16px;
      color: #666;
      padding: 0 10px;
      text-align: right;
    }
  }
  .rule-item + .rule-item {
    margin-top: 8px;
  }
  ::v-deep .el-form {
    .el-form-item {
      display: flex;
      justify-content: center;
      align-content: center;
      .el-form-item__label {
        display: inline-block;
        width: 114px;
        text-align: right;
      }
      .el-form-item__content {
        display: inline-block;
        width: 112px;
        .el-input-number {
          width: 112px;
        }
      }
    }
  }
  ::v-deep.circlePlusOutlineBox {
    margin-top: 21px;
    padding: 0 7px;
    padding-top: 21px;
    border-top: 1px dashed #d9d9d9;
    display: flex;
    align-content: center;
    justify-content: space-between;
    margin-bottom: 21px;
    font-size: 14px;
    font-weight: 500;
    color: #333333;
    line-height: 22px;
    .el-button {
      padding: 0;
      i {
        color: #666;
      }
    }
  }
}
</style>
