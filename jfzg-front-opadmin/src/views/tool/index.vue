<template>
  <div class="tool-page">
    <div class="tool-page-left">
      <el-form label-width="130px" ref="add">
        <el-form-item label="角色CODE">
          <el-input
            v-model.trim="form.role"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="按钮配置">
          <div>
            <el-button
              type="text"
              icon="el-icon-circle-plus-outline"
              @click="handleAddBtn"
              >添加按钮</el-button
            >
          </div>
          <draggable
            tag="ul"
            :list="form['btns']"
            v-bind="{
              group: { name: 'btns' },
              ghostClass: 'ghost',
              handle: '.drag-item',
            }"
            handle=".drag-item"
          >
            <li
              v-for="(ooitem, ooindex) in form['btns']"
              :key="'oa_' + ooindex"
              class="btn-list"
            >
              <div>
                <el-select
                  class="btn-attr"
                  v-model="ooitem.btnType"
                  placeholder="请选择按钮类型"
                >
                  <el-option
                    v-for="item in btnTypeList"
                    :key="item.value"
                    :label="item.value"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <br />
                <el-select
                  class="btn-attr"
                  v-model="ooitem.btnEventType"
                  placeholder="请选择事件类型"
                >
                  <el-option
                    v-for="item in eventTypeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <br />
                <el-input
                  class="btn-attr"
                  placeholder="按钮名"
                  clearable
                  v-model="ooitem.btnName"
                ></el-input>
                <br />
                <el-input
                  class="btn-attr"
                  type="textarea"
                  :rows="2"
                  placeholder="按钮值"
                  clearable
                  v-model="ooitem.btnValue"
                ></el-input>
                <br />
                <el-input
                  class="btn-attr"
                  type="textarea"
                  :rows="2"
                  placeholder="按钮接口url"
                  clearable
                  v-model="ooitem.btnUrl"
                ></el-input>
                <br />
                <el-input
                  class="btn-attr"
                  placeholder="审核状态"
                  clearable
                  v-model="ooitem.examineState"
                ></el-input>
                <br />
                <el-input
                  class="btn-attr"
                  placeholder="待办id"
                  clearable
                  v-model="ooitem.agencyId"
                ></el-input>
                <br />
                <el-input
                  class="btn-attr"
                  placeholder="待办下个角色"
                  clearable
                  v-model="ooitem.agencyNextrole"
                ></el-input>
                <br />
                <el-input
                  class="btn-attr"
                  placeholder="nextBuCode"
                  clearable
                  v-model="ooitem.nextBuCode"
                ></el-input>
                <br />
                <el-input
                  class="btn-attr"
                  placeholder="消息推送id"
                  clearable
                  v-model="ooitem.messageId"
                ></el-input>
              </div>
              <div>
                <i
                  class="drag-item iconfont el-icon-rank"
                  style="font-size: 16px; margin: 0 5px; cursor: move"
                ></i>
                <el-button
                  @click="handleBtnRemove(ooindex)"
                  circle
                  plain
                  type="danger"
                  size="mini"
                  icon="el-icon-minus"
                  style="padding: 4px; margin-left: 5px"
                ></el-button>
              </div>
            </li>
          </draggable>
        </el-form-item>
        <el-form-item label="操作按钮配置">
          <draggable
            tag="ul"
            :list="form['operationBtns']"
            v-bind="{
              group: { name: 'operationBtns' },
              ghostClass: 'ghost',
              handle: '.drag-item',
            }"
            handle=".drag-item"
          >
            <li
              v-for="(ooitem, ooindex) in form['operationBtns']"
              :key="'oa_' + ooindex"
              class="btn-list"
            >
              <div>
                <br />
                <el-input
                  class="btn-attr"
                  placeholder="按钮名"
                  clearable
                  v-model="ooitem.btnName"
                ></el-input>
                <br />
                <el-input
                  class="btn-attr"
                  placeholder="跳转地址"
                  clearable
                  v-model="ooitem.btnValue"
                ></el-input>
              </div>
              <div>
                <i
                  class="drag-item iconfont el-icon-rank"
                  style="font-size: 16px; margin: 0 5px; cursor: move"
                ></i>
                <el-button
                  @click="handleBtnRemove(ooindex)"
                  circle
                  plain
                  type="danger"
                  size="mini"
                  icon="el-icon-minus"
                  style="padding: 4px; margin-left: 5px"
                ></el-button>
              </div>
            </li>
          </draggable>
        </el-form-item>
        <el-form-item label="可跳转节点配置">
          <div>
            <el-button
              type="text"
              icon="el-icon-circle-plus-outline"
              @click="handleAddNode"
              >添加节点</el-button
            >
          </div>
          <draggable
            tag="ul"
            :list="form['nodes']"
            v-bind="{
              group: { name: 'nodes' },
              ghostClass: 'ghost',
              handle: '.drag-item',
            }"
            handle=".drag-item"
          >
            <li
              v-for="(ooitem, ooindex) in form['nodes']"
              :key="'on_' + ooindex"
              class="btn-list"
            >
              <div>
                <el-input
                  class="btn-attr"
                  placeholder="节点名"
                  clearable
                  v-model="ooitem.dataName"
                ></el-input>
                <br />
                <el-input
                  class="btn-attr"
                  type="textarea"
                  :rows="2"
                  placeholder="节点值"
                  clearable
                  v-model="ooitem.dataValue"
                ></el-input>
              </div>
              <div>
                <i
                  class="drag-item iconfont el-icon-rank"
                  style="font-size: 16px; margin: 0 5px; cursor: move"
                ></i>
                <el-button
                  @click="handleNodeRemove(ooindex)"
                  circle
                  plain
                  type="danger"
                  size="mini"
                  icon="el-icon-minus"
                  style="padding: 4px; margin-left: 5px"
                ></el-button>
              </div>
            </li>
          </draggable>
        </el-form-item>
        <el-form-item label="是否展示审核表单">
          <el-checkbox v-model="form.showForm"></el-checkbox>
        </el-form-item>
        <!-- 是否校验按钮归属 -->
        <el-form-item label="是否校验按钮归属">
          <el-checkbox v-model="form.checkOwner"></el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">获取JSON串</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="tool-page-right">
      <MonacoEditor
        editorStyleName="tool-editor"
        ref="jsonEditor"
        :readOnly="false"
        :content-body.sync="jsonEg"
      >
      </MonacoEditor>
    </div>
  </div>
</template>

<script>
import { beautifierConf } from "@/utils/index";
import beautifier from "js-beautify";
import Draggable from "vuedraggable";
import MonacoEditor from "@/components/MonacoEditor.vue";
export default {
  components: {
    Draggable,
    MonacoEditor,
  },
  props: {},
  watch: {},
  data() {
    return {
      btnTypeList: [
        {
          value: "default",
        },
        {
          value: "primary",
        },
        {
          value: "danger",
        },
      ],
      operationList: [
        {
          label: "提交评审",
          value: "tjps",
        },
        {
          label: "发起第三方",
          value: "fqdsf",
        },
        {
          label: "转办",
          value: "zb",
        },
        {
          label: "授权代理",
          value: "sqdl",
        },
      ],
      eventTypeList: [
        {
          label: "提交评审",
          value: "tjps",
        },
        {
          label: "发起第三方",
          value: "fqdsf",
        },
        {
          label: "转办",
          value: "zb",
        },
        {
          label: "授权代理",
          value: "sqdl",
        },
        {
          label: "节点跳转",
          value: "jdtz",
        },
        {
          label: "驳回",
          value: "bh",
        },
        {
          label: "分配",
          value: "fp",
        },
      ],
      jsonStr: "",
      jsonEg: "",
      form: {
        role: "",
        checkOwner:false,
        showForm: true,
        btns: [
          {
            btnName: "按钮名0",
            btnValue: "按钮值0",
            btnType: "",
            btnEventType: "",
            btnUrl: "",
            examineState: "",
            agencyId: "",
            agencyNextrole: "",
            nextBuCode: "",
            messageId:''
          },
        ],
        operationBtns: [
          {
            btnName: "按钮名0",
            btnValue: "按钮值0",
          },
        ],
        nodes: [
          {
            dataName: "节点名0",
            dataValue: "节点值0",
          },
        ],
      },
    };
  },
  methods: {
    setEditorValue(codeStr) {
      this.$refs.jsonEditor.setValue(codeStr);
    },
    handleBtnRemove(index) {
      this.form["btns"].splice(index, 1);
    },
    handleAddBtn1() {
      let index = this.form["operationBtns"].length;
      this.form["operationBtns"].push({
        btnValue: "按钮值" + index,
        btnName: "按钮名" + index,
      });
    },
    handleAddBtn() {
      let index = this.form["btns"].length;
      this.form["btns"].push({
        btnValue: "按钮值" + index,
        btnName: "按钮名" + index,
        btnType: "",
        btnEventType: "",
        btnUrl: "",
        examineState: "",
        agencyId: "",
        agencyNextrole: "",
        nextBuCode: "",
      });
    },
    handleNodeRemove(index) {
      this.form["nodes"].splice(index, 1);
    },
    handleAddNode() {
      let index = this.form["nodes"].length;
      this.form["nodes"].push({
        dataValue: "节点值" + index,
        dataName: "节点名" + index,
      });
    },
    onSubmit() {
      this.jsonStr = JSON.stringify([{ ...this.form }]);
      this.beautifierJson = beautifier.js(this.jsonStr, beautifierConf.js);
      this.setEditorValue(this.beautifierJson);
    },
    resetForm() {
      this.form = {
        role: "",
        btns: [
          {
            btnName: "按钮名0",
            btnValue: "按钮值0",
            btnType: "",
            btnEventType: "",
          },
        ],
        nodes: [
          {
            dataName: "节点名0",
            dataValue: "节点值0",
          },
        ],
      };
      this.onSubmit();
    },
  },
  mounted() {
    this.onSubmit();
  },
};
</script>

<style lang="scss" scoped>
.tool-page {
  margin: 20px auto;
  width: 80%;
  display: flex;
  .tool-page-right {
    margin-left: 20px;
    width: 50%;
    ::v-deep .tool-editor {
      width: 100%;
      height: 82vh;
    }
  }
  .btn-list {
    display: flex;

    .btn-attr {
      width: 200px;
      margin-bottom: 10px;
    }
  }
}
</style>
