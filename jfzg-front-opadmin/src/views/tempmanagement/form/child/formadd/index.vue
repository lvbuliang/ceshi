<template>
  <div>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="模板名称">
        <el-input
          v-model="templateName"
          disabled
          placeholder="模板名称"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" @click="onSubmit"
          >提交</el-button
        >
        <el-button size="small" type="default" @click="preview(true)"
          >预览</el-button
        >
      </el-form-item>
    </el-form>
    <div class="tab-container">
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane name="setTab">
          <div slot="label" class="tab-item">
            <svg-icon class="svg" icon-class="tab"></svg-icon>
            <span>设置tab</span>
          </div>
        </el-tab-pane>
        <el-tab-pane name="setAudit">
          <div slot="label" class="tab-item">
            <svg-icon class="svg" icon-class="tab"></svg-icon>
            <span>设置审批表单</span>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <template v-if="activeName == 'setTab'">
      <div class="regular-box">
        <div class="regular-left-box">
          <div class="regular-title">
            <h5>设置tab</h5>
            <div style="cursor: pointer;" alt="新增tab" @click="addTab">
              <svg-icon class="svg_plus" icon-class="plus"></svg-icon>
            </div>
          </div>
          <div class="tree-box">
            <div class="emptyImg" v-if="!editableTabs.length">
              <img :src="emptyImg" alt="暂无数据" />
              <p>暂无tab,<span @click="addTab">新增</span>一个</p>
            </div>
            <el-tree
              v-else
              class="tree"
              :data="editableTabs"
              draggable
              :allow-drop="collapse"
              :props="defaultProps"
            ></el-tree>
          </div>
        </div>
        <div class="regular-right-box form_setting">
          <div class="regular-title">
            <h5>设置内容</h5>
          </div>
          <el-tabs
            @keydown.native.delete.capture.stop
            class="title_tabs"
            type="border-card"
            v-model="editableTabsValue"
            @tab-remove="removeTab"
          >
            <el-tab-pane
              v-for="(item, index) in editableTabs"
              :key="item.name"
              :name="item.name"
            >
              <div class="btnBox" style="margin-bottom: 16px;">
                <el-button
                  size="medium"
                  type="primary"
                  @click="addForm(index, 'basicForm')"
                  >新增关联表单</el-button
                >
                <el-button size="medium" @click="addForm(index, 'customForm')"
                  >新增自定义表单</el-button
                >
              </div>
              <div
                class="tabTitle"
                slot="label"
                @mouseover="tabsMouseover(item)"
                @mouseleave="tabsMouseleave(item)"
              >
                <div class="hoverBox" v-if="item.iconHoverIndex">
                  <img :src="tabs_bg" alt="" />
                  <i class="el-icon-edit" @click="icon_edit(item)"></i>
                  <i class="el-icon-close" @click="removeTab(item.name)"></i>
                </div>
                <el-input
                  class="title_input"
                  v-model="item.title"
                  placeholder="请输入标题"
                  v-if="item.iconEditIndex"
                ></el-input>
                <p class="ellipsis" v-else>{{ item.title }}</p>
              </div>
              <div
                class="form_box"
                v-for="(child, key) in item.formArr"
                :key="child.id"
              >
                <div
                  class="form_item"
                  :is="child.type"
                  @syncTemplate="syncTemplate"
                  :basicData="child.basicData"
                  :selectData.sync="child.selectData"
                  :title.sync="child.title"
                  @deleteFm="
                    () => {
                      removeForm(item.formArr, key);
                    }
                  "
                ></div>
              </div>
              <div class="zanwu" v-if="!item.formArr.length">
                <img :src="zanwurl" alt="" />
                <p>暂无数据</p>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </template>
    <template v-if="activeName == 'setAudit'">
      <div>
        <custom-form
          :selectData.sync="selectData"
          :title.sync="selectData.title"
          :deleteFlag="false"
          v-if="selectData.title"
        />
      </div>
    </template>
    <el-dialog
      title="关联字典表"
      width="400px"
      class="tempmanagementBasicFormBox"
      :visible.sync="dialogFormVisible"
    >
      <el-select v-model="value" placeholder="请选择" @change="handleSelect">
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.tableComment"
          :value="item.tableColumn"
        >
        </el-option>
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button round type="primary" @click="dialogConfirm">确 定</el-button>
        <el-button round @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-drawer
      title="预览"
      :visible.sync="drawer"
      direction="rtl"
      size="100%"
      :with-header="false"
      ref="drawer"
    >
      <layout
        @close="$refs.drawer.closeDrawer()"
        :editableTabs="editableTabs"
        :selectData.sync="selectData"
        v-if="drawer"
      />
    </el-drawer>
  </div>
</template>

<script>
import basicForm from "./basicForm";
import customForm from "./customForm";
import layout from "../preview/layout.vue";
import {
  saveTemplate,
  listModuleTableByModuleCode,
  getCustomFormTemplate,
  updateModuleTableTemplate,
} from "@/api/index.js";

export default {
  components: {
    basicForm,
    customForm,
    layout,
  },
  computed: {
    moduleCode() {
      return this.$route.query.moduleCode;
    },
    headType() {
      return this.$route.query.headType;
    },
    templateId() {
      return this.$route.query.templateId;
    },
  },
  data() {
    return {
      zanwurl: require("@/assets/empty.png"),
      defaultProps: {
        children: "formArr",
        label: "title",
      },
      drawer: false,
      value: "",
      templateName: "",
      options: [],
      dialogFormVisible: false,
      editableTabsValue: null,
      tabIndex: null,
      editableTabs: [],
      basicData: null,
      // 审批流扩展字段
      selectData: {
        title: "",
      },
      activeName: "setTab",
      emptyImg: require("@/assets/empty.png"),
      tabs_bg: require("@/assets/tabs_bg.png"),
    };
  },
  mounted() {
    if (this.templateId) {
      getCustomFormTemplate({
        moduleCode: this.moduleCode,
        templateId: this.templateId,
      }).then((res) => {
        this.editableTabs = JSON.parse(res.data.templateDetail).map((item) => {
          item.iconEditIndex = false;
          item.iconHoverIndex = false;
          item.formArr = JSON.parse(item.formArr);
          item.formArr.forEach((val) => {
            if (!val.id) {
              val.id = new Date().getTime();
            }
          });
          return item;
        });
        let total = this.$route.query.total || 0;
        let number = res.data.templateName.split("-");
        if (number.length > 1) {
          number[number.length - 1] = this.formatZero( +total + 1, 3);
        } else {
          number.push(this.formatZero( +total + 1, 3));
        }
        this.templateName = number.join("-");
        this.selectData = JSON.parse(res.data.auditJson);
        this.editableTabsValue = JSON.parse(res.data.templateDetail)[0].name;
      });
    } else {
      this.templateName = this.$route.query.moduleName;
    }
  },
  methods: {
    //同步关联表单
    syncTemplate(json) {
      let params = {
        id: this.$route.query.tableId,
        tableColumn: json,
      };
      console.log(params);
      updateModuleTableTemplate(params).then((res) => {
        if (res.msg.code === "0000") {
          this.$message({
            message: "编辑成功",
            type: "success",
          });
        }
      });
    },
    formatZero(num, len) {
      if (String(num).length > len) return num;
      return (Array(len).join(0) + num).slice(-len);
    },
    tabsMouseover(item) {
      item.iconHoverIndex = true;
    },
    tabsMouseleave(item) {
      item.iconHoverIndex = false;
      item.iconEditIndex = false;
    },
    icon_edit(item) {
      item.iconEditIndex = true;
      // item.iconHoverIndex = false;
    },
    handleTabClick(tab, event) {
      console.log(tab, event);
      if (tab.name == "setAudit") {
        this.addApply();
      }
    },
    handleSelect(val) {
      this.basicData = JSON.parse(val);
    },
    onSubmit() {
      if (!this.templateName || !this.editableTabs.length) {
        this.$message({
          message: "请填写模版名称以及新增对应表单",
          type: "warning",
        });
        return false;
      }
      this.preview(false);
      let params = {
        moduleCode: this.moduleCode,
        headType: this.headType,
        templateName: this.templateName,
        templateDetail: JSON.stringify(this.editableTabs),
        auditJson: JSON.stringify(this.selectData),
      };
      saveTemplate(params).then((res) => {
        if (res.msg.code === "0000") {
          this.$message({
            message: "新增成功",
            type: "success",
          });
          this.$router.push({
            name: "temList",
          });
        }
      });
    },
    addApply() {
      this.selectData.title = "审批流扩展字段";
    },
    // 新增tab页签
    addTab() {
      const name = new Date().getTime().toString();
      this.editableTabsValue = name;
      this.editableTabs.push({
        title: "New Tab",
        name,
        iconEditIndex: false,
        iconHoverIndex: false,
        formArr: [],
      });
    },
    addForm(index, type) {
      this.tabIndex = index;
      if (type === "basicForm") {
        listModuleTableByModuleCode({
          moduleCode: this.moduleCode,
        }).then((res) => {
          console.log(JSON.parse(res.data[0].tableColumn));
          this.options = res.data;
        });
        this.dialogFormVisible = true;
      } else {
        this.editableTabs[index].formArr.push({
          type,
          title: "自定义表单",
          selectData: {},
          basicData: {},
          id: new Date().getTime(),
        });
      }
    },
    // 新增关联字典表表单
    dialogConfirm() {
      if (this.basicData) {
        this.dialogFormVisible = false;
        this.editableTabs[this.tabIndex].formArr.push({
          type: "basicForm",
          title: "关联字典表表单",
          basicData: this.basicData,
          selectData: {
            formAdd: {
              config: [],
              otherConfig: this.basicData.formAdd.otherConfig,
            },
          },
          id: new Date().getTime(),
        });
      } else {
        this.$message({
          message: "请选择字典表数据",
          type: "warning",
        });
      }
    },
    // 删除tab页签
    removeTab(targetName) {
      this.editableTabs = this.editableTabs.filter(
        (tab) => tab.name !== targetName
      );
    },
    // 删除表单
    removeForm(formArr, index) {
      formArr.splice(index, 1);
    },
    preview(flag) {
      this.editableTabs.forEach((val) => {
        val.formArr.forEach((item) => {
          if (item.selectData.formAdd && item.selectData.formAdd.config) {
            let config = item.selectData.formAdd.config.map((res) => {
              let obj = {
                className: "",
                isHide: Boolean(res.isHide || res.isHideView),
                value: res.bind,
                label: res.name,
                span: res.col,
                key: res.key,
                dataConfig: res.dataConfig,
              };
              if (res.type === "star") {
                obj.type = "star";
              } else if (res.type === "editor") {
                obj.type = "html";
              } else if (res.type === "upload") {
                obj.type = "uploader";
                obj.colNum = 3;
                obj.maxFeild = 15;
                obj.showExpand = true;
              } else {
                obj.type = "value";
              }
              return obj;
            });
            item.selectData.formView = {
              config,
            };
          }
        });
      });
      localStorage.setItem("editableTabs", JSON.stringify(this.editableTabs));
      this.drawer = flag;
    },
    // 拖拽控制
    collapse(moveNode, inNode, type) {
      // 不能拖拽到级别里面
      // 一级拖动到一级
      if (moveNode.level == 1 && inNode.level == 1) {
        // 四种情况
        if (moveNode.nextSibling == undefined) {
          return type == "prev";
        } else if (inNode.nextSibling == undefined) {
          return type == "next";
        } else if (moveNode.nextSibling.id !== inNode.id) {
          return type == "prev";
        } else {
          return type == "next";
        }
      }
      //是否为同级下的子节点
      // 二级拖动到二级
      if (
        moveNode.level == 2 &&
        inNode.level == 2 &&
        moveNode.parent.id == inNode.parent.id
      ) {
        // 四种情况
        if (moveNode.nextSibling == undefined) {
          return type == "prev";
        } else if (inNode.nextSibling == undefined) {
          return type == "next";
        } else if (moveNode.nextSibling.id !== inNode.id) {
          return type == "prev";
        } else {
          return type == "next";
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.demo-form-inline {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 3px;
  .ellipsis {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  ::v-deep {
    .el-button + .el-button {
      margin-left: 8px;
    }

    .el-button--small {
      min-width: 76px;
    }

    .el-form-item {
      margin-bottom: 12px;
    }
  }
}
.tab-container {
  ::v-deep {
    .el-tabs__item {
      font-weight: 400;
      &.is-active {
        font-weight: 500;
      }
    }
    .el-tabs__nav-wrap::after {
      display: none;
    }
    .el-tabs__content {
      padding: 0;
    }
    .el-tabs__header {
      margin-bottom: 8px;
    }
  }

  .tab-item {
    display: flex;
    align-items: center;
    font-size: 14px;
    .svg {
      width: 12px;
      height: 12px;
    }
    span {
      margin-left: 4px;
    }
  }
}
.regular-box {
  display: flex;
  border-radius: 8px;
  .regular-left-box {
    width: 210px;
    background: #ffffff;
    border: 1px solid #f0f0f0;
    border-right: none;
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
    ::v-deep .tree-box {
      min-height: 200px;
      .el-tree-node__content {
        height: 38px;
        line-height: 38px;
      }
      .el-tree-node__label {
        font-size: 14px;
        font-weight: 400;
        color: #262626;
        line-height: 22px;
      }
      .emptyImg {
        width: 100%;
        margin-top: 26px;
        text-align: center;
        img {
          width: 80px;
          height: 60px;
        }
        p {
          font-size: 16px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.25);
          line-height: 24px;
          span {
            color: #1890ff;
            cursor: pointer;
          }
        }
      }
    }
    .regular-title {
      height: 52px;
      padding: 0 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #f0f0f0;
      h5 {
        font-size: 16px;
        font-weight: 500;
        color: #262626;
        line-height: 24px;
      }
    }
  }
  .regular-right-box {
    flex: 1;
    background: #ffffff;
    border-radius: 0px 8px 8px 0px;
    border: 1px solid #f0f0f0;
    .regular-title {
      height: 52px;
      background: #ffffff;
      border-radius: 2px 8px 2px 2px;
      display: flex;
      align-content: center;
      h5 {
        font-size: 16px;
        font-weight: 500;
        color: #262626;
        line-height: 24px;
        line-height: 52px;
        padding-left: 24px;
      }
    }
  }
}
::v-deep .col-24 {
  .el-form-item__content {
    width: auto !important;
  }
}

.el-dialog__wrapper {
  .el-select {
    width: 100%;
  }
}

.form_setting {
  display: flex;
  flex-direction: column;
  ::v-deep .el-input {
    width: 100% !important;
  }
  .el-tabs--border-card {
    box-shadow: none;
  }
}

.el-tree {
  width: 208px;
  margin-top: 16px;
}

::v-deep .title_tabs {
  flex-grow: 1;
  padding: 18px 24px;
  border: none;
  background: #ffffff;
  .zanwu {
    width: 100%;
    height: 250px;
    background: #ffffff;
    text-align: center;
    padding-top: 83px;
    img {
      width: 80px;
      height: 60px;
    }
    p {
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.25);
      line-height: 24px;
    }
  }
  .el-tabs__item.is-active {
    p {
      color: #007aff;
    }
  }
  .tabTitle {
    width: 100%;
    padding-left: 16px;
    display: inline-block;
    position: relative;
    text-align: center;
    color: #595959;
    p {
      height: 40px;
      padding-right: 16px;
    }
    .hoverBox {
      width: 50%;
      height: 100%;
      position: absolute;
      right: 0;
      text-align: right;
      img {
        width: 100%;
        height: 100%;
        right: 0;
        position: absolute;
        z-index: 10;
      }
      i {
        font-size: 16px;
        z-index: 15;
        position: relative;
      }
    }
  }
  .title_input {
    width: 100px;
    z-index: 20;
    position: relative;
    ::v-deep .el-input__inner {
      border: none !important;
      height: 36px;
      width: 100px;
    }
  }
  .el-tabs__nav-scroll {
    background: #fff;
  }
  .el-tabs__nav {
    height: 40px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.15);
    display: flex;
    .el-tabs__item {
      width: 130px;
      height: 40px;
      background: rgba(0, 0, 0, 0.02);
      border-radius: 8px 8px 0px 0px;
      border: 1px solid rgba(0, 0, 0, 0.15);
      box-sizing: border-box;
      margin-right: 2px;
      margin-top: 0 !important;
      margin-left: 0 !important;
      border-bottom: none;
      padding: 0px !important;
      .el-input__inner {
        border: none;
        padding: 0;
      }
      &:hover {
        .el-input__inner {
          color: #1890ff;
        }
      }
      &:last-child {
        margin-right: 0;
      }
      .el-icon-close {
        font-size: 16px;
      }
    }
  }
  .el-tabs__content {
    padding: 0;
    padding-top: 16px;
    .btnBox {
      .el-button {
        width: 132px;
        height: 32px;
        padding: 0;
        text-align: center;
        line-height: 32px;
        font-size: 14px;
        font-weight: 400;
      }
    }
  }
}

.form_box {
  position: relative;
  .form_box_nav {
    height: 40px;
    background: #fafafa;
    border-radius: 8px 8px 0px 0px;
    margin-bottom: 8px;
  }
  .el-icon-circle-close {
    position: absolute;
    right: -10px;
    top: -10px;
    font-size: 20px;
    cursor: pointer;
  }

  .form_item {
    margin-bottom: 16px;
  }
  &:last-child {
    .form_item {
      margin-bottom: 0;
    }
  }
}
</style>
<style lang="scss">
.tempmanagementBasicFormBox {
  .el-dialog__header {
    height: 56px;
    line-height: 30px;
    background: #ffffff;
    border-radius: 8px;
    text-align: center;
    .el-dialog__title {
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      line-height: 24px;
    }
    .el-dialog__headerbtn {
      top: 19px;
    }
  }
  .dialog-footer {
    text-align: center;
    .el-button {
      width: 76px;
      height: 32px;
      font-size: 14px;
      padding: 0;
    }
  }
}
.el-message-box__wrapper {
  .el-message-box__btns {
    justify-content: right !important;
  }
}
</style>
