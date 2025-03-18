<template>
  <div class="tagMgr">
    <div class="search">
      <div class="demo-input-suffix first">
        <el-input
          class="input"
          placeholder="请输入资产名称"
          v-model="name"
          suffix-icon="el-icon-search"
        ></el-input>
      </div>
    </div>
    <div class="container">
      <div class="title">
        <span>资产目录</span>
        <span>
          <el-popover
            placement="top-start"
            trigger="hover"
            content="新增一级目录"
          >
            <i
              slot="reference"
              @click="addSubordinate()"
              class="el-icon-circle-plus-outline tree_icon"
            ></i> </el-popover
        ></span>
      </div>
      <el-scrollbar style="height: 460px">
        <div>
          <el-tree
            node-key="id"
            :data="dataList"
            :props="defaultProps"
            :default-expand-all="false"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <div
                class="nodeBox"
                @mouseenter="mouseenter(data)"
                @mouseleave="mouseleave(data)"
              >
                <span>
                  <el-input
                    class="input"
                    placeholder="请输入资产名称"
                    v-model="data.name"
                    @change="inputChange(data)"
                    v-if="data.editFlag"
                  ></el-input>
                  <span v-else>
                    {{ data.name }}
                  </span>
                </span>
                <span v-if="data.businessType == 0 && data.hoverFlag">
                  <el-popover
                    placement="top-start"
                    trigger="hover"
                    content="编辑"
                  >
                    <i
                      slot="reference"
                      @click="editNode(node, data)"
                      class="el-icon-edit-outline tree_icon"
                    ></i>
                  </el-popover>
                  <el-popover
                    placement="top-start"
                    trigger="hover"
                    content="新增下一级目录"
                  >
                    <i
                      slot="reference"
                      @click="addSubordinate(node, data)"
                      class="el-icon-circle-plus-outline tree_icon"
                    ></i>
                  </el-popover>
                  <el-popover
                    placement="top-start"
                    trigger="hover"
                    content="删除"
                  >
                    <i
                      slot="reference"
                      @click="deleteById(node, data)"
                      class="el-icon-delete tree_icon"
                    ></i>
                  </el-popover>
                </span>
              </div>
            </span>
          </el-tree>
        </div>
      </el-scrollbar>
      <div class="buttonBox" @click="addSubordinate()">
        <i slot="reference" class="el-icon-circle-plus-outline tree_icon"></i>
        <span>新增一级目录</span>
      </div>
    </div>
  </div>
</template>

<script>
import FForm from "@/components/FForm/form-add";
import {
  api_catalogueAdd,
  api_catalogueList,
  api_deleteCatalogue,
  add_zichanCatalogueUpdate,
} from "@/api/zichan/index.js";
import { getStorageToken } from "@/utils/user-vali";
import config from "@/settings.js";
export default {
  components: {
    FForm,
  },
  data() {
    return {
      defaultProps: {
        children: "childList",
        isLeaf: false,
      },
      showId: [0],
      dataList: [],
      name: "", // 搜索框字段
      dialogFlag: false, // 弹窗
      active: 0,
      file: "",
      filelist: [], // 上传文件列表
      stepStatus: "0", // 步骤条状态  0：导入前   1：导入中  2：成功
      emptyImg: require("@/assets/empty.png"), // 空白
      waitImg: require("@/assets/step_wait.png"), // 导入中
      checkImg: require("@/assets/Check.png"), // 成功
      circleImg: require("@/assets/Circle.png"), // 失败
      warningImg: require("@/assets/warning.png"), // 警告
      warningList: [],
      checkNum: 0,
      node_had: "", // 当前节点
      main_node: "", // 根节点
      main_resolve: "", // 根节点函数
      btnFlag: false,

      unitName: "",
      dialog: {
        dialogVisible: false,
        width: "",
        title: "",
        type: "",
      },
      otherConfig: {
        // 其他配置
        labelNum: 120, // label宽度，可选120和150，默认120
        column: 2, // 列数，默认2
        validateOnRuleChange: false,
      },
      form: {
        config: [
          {
            col: 24, // 独占一行
            type: "text",
            name: "标签类别",
            // placeholder: "请输入标签类别",
            disabled: true,
            bind: "typeName",
          },
          {
            col: 24, // 独占一行
            type: "text",
            name: "上级标签名称",
            disabled: true,
            // placeholder: "请输入上级标签名称",
            bind: "parentName",
          },
          {
            col: 24, // 独占一行
            type: "text",
            name: "标签名称",
            placeholder: "请输入标签名称",
            bind: "name",
            maxLength: 50,
            trigger: "blur", // 校验时机
            required: "请输入标签名称", // 必填需要指定提示信息
          },
          {
            col: 24, // 独占一行
            type: "text",
            name: "标签编码",
            placeholder: "请输入标签编码",
            bind: "code",
            maxLength: 50,
            trigger: "blur", // 校验时机
            required: "请输入标签编码", // 必填需要指定提示信息
          },
          {
            col: 24, // 独占一行
            type: "textarea",
            name: "标签描述",
            maxlength: 200,
            placeholder: "请输入标签描述",
            bind: "remark",
          },
        ],
        data: {
          typeName: "", // 标签类别
          parentName: "", // 上级标签
          name: "", // 标签名称
          code: "", // 标签编码
          remark: "", // 描述
        },
        enums: {
          menuUrlList: [],
        },
        rules: {},
      },

      loading: true,
    };
  },
  watch: {
    name(val) {
      this.$refs.tree.filter(val);
    },
    dialogFlag(val) {
      if (val) {
        this.$nextTick(() => {
          let getNode = document.getElementsByClassName("el-step__icon-inner");
          getNode.forEach((item) => {
            if (item.localName == "div") {
              item.style.display = "none";
            }
          });
        });
      }
    },
  },
  mounted() {
    this.getTreeList();
  },
  methods: {
    mouseenter(data) {
      this.$set(data, "hoverFlag", true);
    },
    mouseleave(data) {
      this.$set(data, "hoverFlag", false);
    },
    inputChange(data) {
      if (data.editFlag) {
        this.setZichanCatalogueUpdate(data);
      }
      this.$set(data, "editFlag", !data.editFlag);
    },
    editNode(node, data) {
      if (data.editFlag) {
        this.setZichanCatalogueUpdate(data);
      }
      this.$set(data, "editFlag", !data.editFlag);
    },
    setZichanCatalogueUpdate(data) {
      let params = {
        businessType: 0,
        name: data.name,
        parentId: data.parentId,
        id: data.id,
      };
      add_zichanCatalogueUpdate(params).then((res) => {
        if (res.msg.code == "0000") {
          this.$message("修改成功");
          this.getTreeList();
        }
      });
    },
    // 获取列表
    getTreeList(resolve) {
      api_catalogueList({ name: "" }).then((res) => {
        if (res && res.msg.code == "0000") {
          this.dataList = res.data.childList;
          let data = res.data.childList;
          // 前者item.参数名称为 prop 中的规定的属性名称
          // data.forEach(item => {
          //   // item.name = item.name;
          //   // item.parentId = item.parentId;
          //   // item.id = item.id;
          //   item.isLeaf = true;
          // });
          // resolve(data);
        }
      });
    },

    // loadNode(node, resolve) {
    //   if (node.level === 0) {
    //     this.main_node = node;
    //     this.main_resolve = resolve;
    //     this.getTreeList(resolve);
    //   } else {
    //     this.getChildList(node, resolve);
    //   }
    // },

    // // 列表点击展示子级
    // getChildList(data, resolve) {
    //   if (data) {
    //     console.log(data);
    //     // api_getChildList({ code: data }).then((res) => {
    //     //   if (res && res.msg.code == "0000") {
    //     //     let data = res.data;
    //     //     // 前者item.参数名称为 prop 中的规定的属性名称
    //     //     // data.forEach(item => {
    //     //     //   item.isLeaf = true;
    //     //     // });
    //     //     resolve(data);
    //     //   } else {
    //     //     return resolve([]);
    //     //   }
    //     // });
    //     if (data.childList) {
    //       resolve(data.childList);
    //     }else{
    //        resolve([]);
    //     }
    //   }
    // },

    handleNodeClick(data, node) {
      this.node_had = node;
      if (!data.parentCode) {
        return;
      }
      if (data.childrenList) {
        delete data.childrenList;
      }
      this.unitName = "编辑";
      this.form.data = JSON.parse(JSON.stringify(data));
    },

    // 添加下级
    addSubordinate(node, data) {
      this.unitName = "添加下级";
      this.node_had = node;
      let params = {
        businessType: 0,
        name: "新增节点",
        parentId: data ? data.id : 0,
      };
      api_catalogueAdd(params).then((res) => {
        if (res.msg.code == "0000") {
          this.$message("新增成功");
          this.getTreeList();
        }
      });
    },

    // 新增或修改
    saveOrUpdate() {
      this.btnFlag = true;
      let data = {
        type: this.form.data.type,
        parentCode: this.form.data.parentCode,
        name: this.form.data.name,
        code: this.form.data.code,
        remark: this.form.data.remark,
      };
      if (this.unitName == "编辑") {
        data.id = this.form.data.id;
      }
      let newPromise = new Promise((resolve, reject) => {
        this.$refs["modelMgrRef"].$refs["modelMgrRefForm"].validate((valid) => {
          if (valid) {
            resolve();
          } else {
            this.btnFlag = false;
          }
        });
      });
      Promise.all([newPromise]).then(() => {
        api_saveOrUpdate(data).then((res) => {
          this.btnFlag = false;
          if (res.msg && res.msg.code == "0000") {
            let title = "";
            if (this.unitName == "添加下级") {
              if (!data.children) {
                this.$set(data, "children", []);
              }
              data.children.push(this.form.data);
              this.form.data = {};
              title = "添加成功";
              this.node_had.loaded = false;
              this.node_had.expand();
            } else if (this.unitName == "编辑") {
              this.node_had.parent.loaded = false;
              this.node_had.parent.expand();
              title = "保存成功";
            }
            this.$message({
              message: title,
              type: "success",
            });
          }
        });
      });
    },

    // 删除标签
    deleteById(node, data) {
      this.node_had = node;
      console.log(data);
      this.$SrUtils.showConfirmMessage.call(this, {
        title: "你确定要删除该目录吗？",
        // content: "",
        okFun: () => {
          if (data.delete) {
            api_deleteCatalogue({ catalogId: data.id }).then((res) => {
              if (res.msg && res.msg.code == "0000") {
                this.$message({
                  message: "删除成功",
                  type: "success",
                });
                this.getTreeList();
              }
            });
          } else {
            this.$message.error("删除失败,当前目录不能删除");
          }
        },
        cancelFun: () => {
          return false;
        },
      });
    },

    // 标签导出
    exportFlie() {
      // let access_token = "8fc9dac6-21fb-441b-883d-8de161a64f46";
      let access_token = getStorageToken();
      let exportUrl =
        config.baseUrl +
        `/jfzg/opcenter/permission/op/export?access_token=${access_token}`;
      window.location.href = exportUrl;
    },

    // 下载模板
    downloadTemplate() {
      // let access_token = "8fc9dac6-21fb-441b-883d-8de161a64f46";
      let access_token = getStorageToken();
      let downloadUrl =
        config.baseUrl +
        `/jfzg/opcenter/permission/import/downMenumTemplate?access_token=${access_token}`;
      window.location.href = downloadUrl;
    },

    // 标签导入
    bootFile() {
      this.dialogFlag = true;
    },

    filterNode(value, data) {
      // return
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },

    // 选择文件
    handleExceed(e) {
      // 判断上传文件个数，超过提示报错
      // console.log(e);
      // this.$message({
      //   message: "只能上传一个文件",
      //   type: "error"
      // });
    },

    handleChansge(file, fileList) {
      let name = file.name;
      if (!/\.(xlsx|xls|XLSX|XLS)$/.test(file.name)) {
        this.$message({
          type: "error",
          message: "上传文件只能为excel文件，且为xlsx,xls格式",
        });
        this.file = "";
        this.filelist = [];
        return;
      } else {
        this.active = 1;
        this.file = file.raw;
        this.fileList = fileList;
      }
    },

    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },

    removeFile(file, fileList) {
      this.file = "";
    },

    // 开始导入
    postFile() {
      if (this.file == "") {
        this.$message({
          type: "error",
          message: "上传文件不能为空",
        });
        return false;
      } else {
        this.stepStatus = "1";
        // 文件形式的需要用 formData形式
        let formData = new FormData();
        formData.append("file", this.file);
        api_bootFile(formData).then((res) => {
          if (res.msg.reasonPhrase == "SUCCESS" || res.msg.code == "0000") {
            if (res.msg.message == "SUCCESS") {
              if (res.data == "0") {
                this.stepStatus = "3";
                this.active = 2;
              } else {
                this.stepStatus = "2";
                this.active = 3;
                this.checkNum = res.data;
              }
            } else {
              if (res.data && res.data.length) {
                this.warningList = res.data;
              }
              this.stepStatus = "4";
            }
          }
        });
      }
    },

    // 重置信息
    reseveInfo() {
      if (
        this.stepStatus == "2" ||
        this.stepStatus == "3" ||
        this.stepStatus == "4"
      ) {
        this.stepStatus = "0";
        this.active = 0;
        this.loadNode(this.main_node, this.main_resolve);
      }
      this.dialogFlag = false;
    },

    eventNotify() {},
  },
};
</script>
<style lang="scss">
.tagMgr {
  .buttonBox {
    width: 120px;
    height: 22px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #1890ff;
    line-height: 22px;
    cursor: pointer;
    display: flex;
    align-items: center;
    i {
      margin-right: 5px;
      margin-left: 2px;
      font-size: 16px;
    }
  }
  .container {
    .title {
      padding-top: 24px;
      padding-bottom: 8px;
      display: flex;
      align-content: center;
      justify-content: space-between;
      .tree_icon {
        color: #999;
      }
      .tree_icon:hover {
        color: #007aff;
      }
    }
  }
  .img {
    width: 16px;
    height: 16px;
    vertical-align: middle;
    margin-right: 5px;
  }
  .authListOperation {
    display: block;
    text-align: center;
    width: 80px;
    .ml10 {
      margin-left: 10px;
    }
  }
  .el-tree-node__content {
    height: 38px;
    line-height: 38px;
  }
  .el-tree-node__content:hover {
    background: #e6f7ff;
  }
  .rightSearch {
    .container {
      padding: 10px;
    }
  }
}
</style>
<style lang="scss" scoped>
.tagMgr {
  /deep/.el-input__icon.el-icon-search {
    cursor: pointer;
  }
  /deep/ .el-tree {
    margin: 10px 0;
  }
  .title {
    // height: 20px;
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
  }
  .form {
    width: 80%;
    margin: 0 auto;
  }
  .search {
    position: relative;
    padding: 16px 0 16px 0;
    line-height: 31px;
    border-bottom: 1px solid #f0f0f0;
    .el-button {
      height: 32px;
      border-radius: 16px;
      line-height: 0 !important;
    }
    .outBtn {
      position: absolute;
      right: 114px;
    }
    .inBtn {
      position: absolute;
      right: 0;
    }
  }

  .demo-input-suffix {
    width: 302px;
    display: inline-block;
    position: relative;
    padding-left: 0px;
    // margin-right: 48px;
    .lable {
      width: 80px;
      text-align: right;
      position: absolute;
      left: 0;
      font-size: 14px;
      top: 50%;
      transform: translateY(-50%);
    }
    .input {
      width: 260px;
      height: 32px;
      /deep/.el-input__inner {
        line-height: 32px;
        height: 32px;
        border-radius: 4px;
      }
      /deep/.el-input__icon {
        line-height: 35px;
      }
    }
  }
  .first {
    width: 370px;
    // padding-left: 70px;
    .lable {
      width: 70px;
    }
  }
  .container {
    width: 100%;
    .title {
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      line-height: 22px;
    }
    .custom-tree-node {
      flex-grow: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      padding-right: 8px;
      .nodeBox {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      span:first-child {
        width: 200px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .tree_popover {
        width: 60px !important;
      }
      .tree_icon {
        margin: 0 13px;
        color: #999;
      }
      .tree_icon:hover {
        color: #007aff;
      }
      .buttonOperation {
        display: inline-grid;
      }
    }
    .el-main {
      padding-top: 0;
      .title {
        height: 54px;
        line-height: 54px;
        padding-left: 11px;
      }
    }
  }

  .steps {
    /deep/ .el-step__head .el-step__icon {
      width: 24px;
      height: 24px;
      border: 4px solid #d9d9d9;
    }

    /deep/ .el-step__title {
      font-size: 14px;
    }
    /deep/ .is-finish {
      font-weight: 400;
      color: #666666;
    }
    /deep/ .is-process .el-step__icon {
      background: #ffffff;
      border: 8px solid #0090ff;
    }
    /deep/ .el-step__head.is-success .el-step__icon {
      border: 1px solid #0090ff;
    }
    // /deep/ .is-finish .el-step__icon {
    //   border: 1px solid #0090ff;
    // }
    /deep/ .el-step__head.is-success {
      border-color: #0090ff;
      color: #0090ff;
    }
    /deep/ .is-success .el-step__line {
      background-color: #0090ff;
    }
    /deep/ .el-step__title.is-success {
      color: #666666;
    }
    /deep/ .el-step__icon-inner {
      color: #0090ff;
    }
    .itemDes {
      font-size: 12px;
      color: #999999;
      // margin-top: 10px;
    }
    .downloadTemplate {
      color: #0090ff;
      cursor: pointer;
    }
  }

  .fileContent {
    width: 624px;
    height: 228px;
    border: 1px solid #d9d9d9;
    border-radius: 8px;
    margin-top: 24px;

    .step_empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      line-height: initial;

      .empty_img {
        width: 80px;
        height: 60px;
        margin-top: 48px;
      }

      .empty_null {
        margin: 8px 0;
        color: #666;
      }

      .emptyBtn {
        margin-top: 20px;
      }
    }

    .stepTwo {
      padding-left: 16px;
      .baginPost {
        margin-top: 24px;
        margin-left: 8px;
      }
      .chooseFile {
        height: 22px;
        font-size: 14px;
        font-weight: 500;
        color: #333333;
        line-height: 22px;
        margin-top: 16px;
      }
    }

    .stepThree {
      height: 100%;
      .threeContent {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        line-height: initial;
        img {
          width: 40px;
          height: 40px;
        }
        .stepThree_title {
          color: #333333;
          margin-top: 12px;
        }
      }

      .circleContent {
        display: flex;
        align-items: center;
        flex-direction: column;
        .circleImg {
          width: 40px;
          height: 40px;
          margin-top: 24px;
        }
        .stepThree_title {
          color: #333333;
          margin-top: 12px;
        }
        .warningList {
          width: 592px;
          height: 102px;
          background: #f5f5f5;
          border-radius: 8px;
          margin-top: 12px;
          overflow-y: scroll;
          padding: 16px 0 8px 16px;
          li {
            height: 22px;
            line-height: 22px;
            color: #333333;
            margin-bottom: 4px;
          }
        }
      }
    }
  }

  .el-main_footer {
    width: 100%;
    height: 100%;
    display: inline-block;
    text-align: center;
    padding-top: 24px;
  }

  /deep/ .el-dialog__footer {
    border: none;
    padding: 8px 24px 32px;
  }

  .dialogFooter {
    .el-button {
      width: 80px;
      height: 32px;
    }
  }
}
</style>
