<template>
  <div class="Deliverable">
    <el-collapse
      v-model="activeNames"
      v-if="deliverysList.length > 0"
      @change="collapseChange"
    >
      <el-collapse-item
        v-for="(item, index) in deliverysList"
        :key="item.id"
        :name="item.id"
        :class="[activeNames.includes(item.id) ? 'activeItem' : '']"
      >
        <template slot="title">
          <el-row style="width: 100%">
            <el-col :span="6" class="topTitle ellipsis">
              <el-tooltip
                class="item"
                effect="dark"
                :disabled="item.name.length < 7"
                :content="item.name"
                placement="top-start"
              >
                <span class="title"
                  >{{ "0" + (index + 1) }} {{ item.name }}</span
                >
              </el-tooltip>

              <span class="title_isChecked">{{
                item.isChecked == "0" ? "有验收需求" : "无验收需求"
              }}</span>
            </el-col>
            <el-col class="deliverable" :span="18">
              <span v-if="item.status == 1" class="textBox">
                <img src="@/assets/shishi/approve_deliver.png" alt="" />
                <b style="color: #ffaa22"> 待审核</b></span
              >
              <span v-else-if="item.status == 2" class="textBox">
                <img src="@/assets/shishi/nopass.png" alt="" />
                <b style="color: #f5222d"> 审核驳回</b></span
              >

              <span v-else class="textBox">
                <img src="@/assets/shishi/filecount.png" alt="" />
                <b>
                  {{ item.deliveryFiles ? item.deliveryFiles.length : 0 }}</b
                ></span
              >

              <div v-if="!onlyShow" class="btns">
                <div
                  v-if="
                    item.status === 1000 &&
                    userInfo.currentRole.roleCode != 'PSZJ'
                  "
                  class="upload-type"
                  @click.stop="clickStop"
                >
                  <SrBigUploadDeliver
                    ref="srUpload"
                    @fileUpload="fileUpload"
                    @fileProgress="
                      (rootFile, file, chunk) => {
                        fileProgress(rootFile, file, chunk, uploadItem);
                      }
                    "
                    @startUpload="
                      (file) => {
                        BigFileStartUpload(file, item, index);
                      }
                    "
                    @uploadSuccess="
                      (data) => {
                        BigFileUploadSuccess(data, item, index);
                      }
                    "
                  ></SrBigUploadDeliver>
                </div>

                <el-tooltip
                  v-if="item.status === 2 && item.creator == userInfo.jfid"
                  class="item"
                  effect="light"
                  content="编辑"
                  placement="top-start"
                >
                  <i
                    @click.stop="editDeliver(item)"
                    class="icon base-iconfont icon-editor"
                  ></i>
                </el-tooltip>
                <el-tooltip
                  v-if="item.modelFile"
                  class="item"
                  effect="light"
                  content="模板下载"
                  placement="top-start"
                >
                  <i
                    class="icon base-iconfont icon-packing-labeling"
                    @click.stop="downLoadTemp(item)"
                  ></i>
                </el-tooltip>
                <el-tooltip
                  v-if="item.status === 1 && item.todo && item.description"
                  class="item"
                  effect="light"
                  :content="
                    JSON.parse(item.description)[0].operationBtns[0].btnName
                  "
                  placement="top-start"
                >
                  <i
                    @click.stop="approveDeliver(item)"
                    class="icon base-iconfont icon-shenhexinxi"
                  ></i>
                </el-tooltip>
                <el-tooltip
                  v-if="
                    item.descBtn.deleteBtn &&
                    userInfo.currentRole.roleCode != 'PSZJ'
                  "
                  class="item"
                  effect="light"
                  content="删除"
                  placement="top-start"
                >
                  <i
                    @click.stop="deleteHandle(item)"
                    class="icon base-iconfont icon-ashbin"
                  ></i>
                </el-tooltip>
              </div>
            </el-col>
          </el-row>
        </template>
        <SrTable
          @pageChanged="pageChanged"
          :data="item.deliveryFiles"
          @sizeChanged="sizeChanged"
          :config="table.tableConfig"
          :page="table.page"
        >
          <template slot="cellSlot" slot-scope="{ scope }">
            <!-- 文件名称 -->
            <span v-if="scope.item.prop == 'fileName'" class="fileNameBox">
              <i class="sr-icon-attachent"></i>
              <span
                @click="seeFile(scope.row)"
                v-if="
                  scope.row.fileName.substring(
                    0,
                    scope.row.fileName.lastIndexOf('.')
                  ).length < 20
                "
              >
                {{ scope.row.fileName }}</span
              >
              <span @click="seeFile(scope.row)" v-else>
                {{ scope.row.fileName.substring(0, 20) }}...{{
                  scope.row.fileName.substring(
                    scope.row.fileName.lastIndexOf(".")
                  )
                }}</span
              >
              <i
                class="sr-icon-download downpic"
                style="color: rgb(24, 144, 255)"
                @click="download(scope.row)"
              ></i>
              <el-progress
                v-if="showProgress && scope.row.isPsShow"
                :percentage="percentage"
              ></el-progress>
            </span>
            <!-- 盖章件 -->
            <template v-if="scope.item.prop == 'isSeal'">{{
              scope.row.isSeal == "0" ? "是" : "否"
            }}</template>
            <!-- 状态 -->
            <template v-if="scope.item.prop == 'status'">
              <template v-if="scope.row.status">
                <span
                  class="dot"
                  :class="
                    scope.row.status == 1 || scope.row.status == 0
                      ? 'yellow'
                      : scope.row.status == 3 || scope.row.status == 1000
                      ? 'green'
                      : 'red'
                  "
                ></span>
                {{ filterStatus[scope.row.status] }}
              </template>
              <span v-else> - </span>
            </template>
          </template>
          <!-- <template slot="empty">
            <div class="zanwu">
              <img src="@/assets/shishi/nodata.png" alt="" />
              <div>还没有内容，快来<b style="color:#1890FF;cursor: pointer;">上传</b>吧</div>
            </div>
          </template> -->
        </SrTable>
      </el-collapse-item>
    </el-collapse>
    <!-- <pagination
      :page="table.page"
      @Change="pageChanged"
      @sizeChange="sizeChanged"
    ></pagination>
    <auditDialog ref="auditDialog" @selectBc="deliveryAuditSubmit"></auditDialog> -->
  </div>
</template>
<script>
// import uploaderView from "../../milestone/components/uploaderView.vue";
import config from "@/settings.js";
import upload from "@/utils/upload";
import SrBigUploadDeliver from "./SrBigUpload";
import {
  uploadDeliverFile,
  deleteDeliverFile,
  deleteDeliver,
  approveDeliverFile,
} from "@/api/deliver/index";
import store from "@/store";
export default {
  components: { SrBigUploadDeliver },
  props: {
    deliverysList: {
      type: Array,
      default() {
        return [];
      },
    },
    onlyShow: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  provide() {
    return {
      baseUrl: config.uploadBaseUrl,
      imgBaseUrl: config.imgBaseUrl,
      uploadRequest: upload,
      uploadBaseUrl: config.uploadBaseUrl,
    };
  },
  computed: {},
  data() {
    return {
      showProgress: false, //进度条
      percentage: 0,
      filterStatus: {
        0: "待审核",
        1: "审核中",
        2: "未通过",
        3: "已通过",
        1000: "已通过",
      },
      deliveryId: null,
      btnCode: "",
      viewdata: [
        {
          id: 109,
          name: "xxxxxx模板.png",
          size: 367,
          url: "jfowe/project/1/projectFile_dd6381e6-3021-4dc5-a9c4-6d7a81b0a1b3.png",
        },
      ],
      loading: false,
      table: {
        data: [], // 表格数据
        tableConfig: {
          rowClassName: this.rowClassName,
          title: "表格的标题", // 表格标题
          highlightCurrentRow: false, // 控制表格是否单选
          // maxLength: 20, // 一行最多显示多少字，超出显示popver
          load: this.load,
          tooltipEffect: "light",
          header: [
            {
              label: "文件名称",
              prop: "fileName",
              cellSlot: true,
              width: 400,
            },
            {
              label: "是否盖章件",
              prop: "isSeal",
              cellSlot: true,
              width: 100,
            },
            {
              label: "提交人",
              prop: "creatorName",
              width: 120,
            },
            {
              label: "上传时间",
              prop: "createTime",
              width: 110,
            },
            {
              label: "大小",
              prop: "fileSize",
              // cellSlot: true,
              width: 110,
            },

            {
              label: "状态",
              prop: "status",
              cellSlot: true,
              width: 100,
            },
            {
              label: "当前处理单位",
              prop: "handleBuName",
            },
            // {
            //   label: "操作",
            //   prop: "operating",
            //   cellSlot: true,
            // },
            // {
            //   label: "审核",
            //   prop: "audit",
            //   cellSlot: true,
            // },
          ],
          selectionConfig: {
            display: false,
            width: "70",
          },
          operateConfig: {
            display: !this.onlyShow,
            label: "操作",
            width: "156",
            fixed: "right",
            allTableHeader: "",
            hideHeaderSetting: true,
            // saveHeaderList: this.saveHeaderList,
            // export: this.export,
            // exportPermissionCode: this.ifHideAddBtn ? "M004_M002_001" : "M003_M002_002",
          },
          innerBtn: [
            // 表格内部操作按钮，不需要操作列的innerBtn 写成false
            {
              name: "查看审核", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "see", // 点击执行该页面methods中对应的方法
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
              validate: this.btnValidate, //自定义判断是否展示按钮权限
            },
            {
              name: "审核",
              method: "approve",
              type: "text",
              size: "small",
              icon: "el-icon-document",
              className: "font-size-20",
              validate: this.btnValidate, //自定义判断是否展示按钮权限
            },
            {
              name: "删除",
              method: "delete",
              type: "text",
              size: "medium",
              field: "status",
              value: [],
              icon: "el-icon-document",
              className: "font-size-20",
              validate: this.btnValidate, //自定义判断是否展示按钮权限
            },
          ],
        },
        page: {
          // 分页配置
          total: 0, //总条数
          pages: 0, //总页数
          pageSize: 10, //每页展示多少个
          pageSizes: [10, 20, 30],
          pageNum: 1, //当前页
          background: true,
          // layout: 'total, prev, pager, next, sizes,jumper'
        },
      },
      activeNames: [],
      resultData: [],
      flag: false,
      buttonFlag: true,
      collapseChangeList: "",
      number: 0,
      userInfo: store.getters.userInfo,
    };
  },
  mounted() {
    console.log(this.$utils.formatDate(new Date()));
    console.log(
      "this.userInfo.currentRole.roleCode",
      this.userInfo.currentRole.roleCode
    );
    // "PSZJ"
    console.log("this.userInfo", this.userInfo.currentRole.roleCode);
  },
  watch: {
    deliverysList: {
      handler(val) {
        if (val) {
          // console.log("val", JSON.parse(val[11].description));
        }
      },
      deep: true, //true 深度监听
    },
  },
  methods: {
    downLoadTemp(item) {
      if (item && item.modelFile) {
        try {
          const modelFile = JSON.parse(item.modelFile);
          if (modelFile && modelFile.length > 0) {
            const file = modelFile[0];
            console.log("downLoadTemp.item", file);
            const token = sessionStorage.getItem("token");
            window.open(
              `${config.previewUrl}?key=${file.fileId}&access_token=${token}`
            );
          }
        } catch (e) {
          console.log(
            "deliverableList.vue downLoadTemp()中JSON.parse(item.modelFile)转换报错",
            e
          );
        }
      }
    },
    btnValidate(row, item) {
      if (item.operations) {
        if (
          row.name == "审核" &&
          item.operations.isShowCheck &&
          this.userInfo.currentRole.roleCode != "PSZJ"
        ) {
          return true;
        }
        if (row.name == "查看审核" && item.operations.isShow) {
          return true;
        }
        if (
          row.name == "删除" &&
          item.operations.isShowDelete &&
          this.userInfo.currentRole.roleCode != "PSZJ"
        ) {
          return true;
        }
      } else {
        return false;
      }
    },
    // btnValidate(item, row) {
    //   let flag = false;
    //   if (
    //     item.name == "审核" &&
    //     this.userInfo.currentRole.roleCode == "JSDW_JBR"
    //   ) {
    //     flag = true;
    //   }
    //   return flag;
    // },
    // 删除
    deleteBtnValidate(item, row) {
      let flag = false;
      if (item.name == "删除" && this.userInfo.jfid === row.creator) {
        flag = true;
      }
      return flag;
    },
    collapseChange(row) {
      // console.log(row);
      // this.collapseChangeList = row.join(",");
    },
    // 查看附件
    seeFile(row) {
      if (
        [
          "zip",
          "rar",
          "xls",
          "xlsx",
          "doc",
          "docx",
          "txt",
          "html",
          "pdf",
        ].includes(row.fileName.split(".").pop())
      ) {
        window.open(`${config.baseUrl}/viewPdf?id=${row.fileId}`);
      } else {
        window.open(
          `${config.baseUrl}/jfzg/file/api/file/download?key=${row.fileId}`
        );
      }
    },
    // 附件上传
    fileUpload(fileData) {
      let data = {
        deliveryId: this.deliveryId,
        fileContext: JSON.stringify(fileData),
        isSeal: 0,
      };
      uploadDeliverFile(data).then((res) => {
        if (res.msg.code == "0000") {
          this.$message({
            type: "success",
            message: "上传成功!",
          });
          this.$emit("uploadSuccessHandle");
        }
      });
    },
    // 开始上传
    BigFileStartUpload(file, item, index) {
      console.log("列表", this.deliverysList);
      this.deliverysList.map((item, index1) => {
        if (index == index1) {
          console.log(".....", item.isSeal, file);
          item.deliveryFiles.push({
            fileName: file.name,
            deliveryId: item.id,
            isPsShow: true,
            isSeal: item.isSeal,
            creatorName: this.userInfo.currentRole.roleName,
            createTime: this.$utils.formatDate(new Date()),
          });
        }
      });
      this.showProgress = true;
      console.log("开始 上传", file, item, index);
    },
    // 上传过程
    fileProgress(rootFile, file, chunk, item) {
      this.percentage = Math.round(file.progress() * 100);
    },
    // 上传成功
    BigFileUploadSuccess(fileList, item, index) {
      console.log("上传成功", fileList, item);
      this.deliveryId = item.id;
      this.showProgress = false;
      this.percentage = 0;
    },
    // 查看
    see(row) {
      this.$emit("see", row);
    },
    // 删除
    delete(row) {
      this.$SrUtils.showConfirmMessage.call(this, {
        title: "提示",
        content: "此操作将删除此交付物文件, 是否继续?",
        okFun: () => {
          deleteDeliverFile({ id: row.id }).then((res) => {
            if (res.msg.code == "0000") {
              this.$message({
                type: "success",
                message: "删除成功",
              });
              this.$emit("uploadSuccessHandle");
            }
          });
        },
        cancelFun: () => {},
      });
    },
    // 里程碑文件审核
    approve(row) {
      this.$emit("approve", row);
    },
    downLoadHandle(row) {},
    // 交付物审核
    approveDeliver(row) {
      this.$emit("approveDeliver", row);
    },
    // 编辑交付物
    editDeliver(row) {
      this.$emit("editDeliver", row);
    },
    // 删除交付物
    deleteHandle(item) {
      console.log(item);
      this.$SrUtils.showConfirmMessage.call(this, {
        title: "提示",
        content: "此操作将删除此交付物, 是否继续?",
        okFun: () => {
          deleteDeliver({ id: item.id }).then((res) => {
            if (res.msg.code == "0000") {
              this.$message({
                type: "success",
                message: "删除成功",
              });
              this.$emit("uploadSuccessHandle");
            }
          });
        },
        cancelFun: () => {},
      });
    },
    clickStop() {},
    callBeforeUpLoad(item, file) {
      console.log(item);
      //验证大小,格式
      //fileType是字符串
      item.fileType =
        item.fileType ||
        "doc,docx,xls,xlsx,ppt,pptx,pdf,txt,jpg,jpeg,jpe,png,rar,zip";
      item.fileSize = item.fileSize || 50 * 1024 * 1024;
      var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      let type = item.fileType.split(",");
      let index = type.indexOf(testmsg);
      if (type.indexOf(testmsg) != -1) {
        const extension = testmsg === type[index];
        const isLt2M = file.size / 1024 / 1024 < item.fileSize;
        if (!extension) {
          this.$message({
            message: `上传文件只能是${item.fileType}格式!`,
            type: "warning",
          });
        }
        if (!isLt2M) {
          this.$message({
            message: "上传文件大小不能超过 50MB!",
            type: "warning",
          });
        }
        return extension && isLt2M;
      } else {
        this.$message({
          message: `上传文件只能是${item.fileType}格式!`,
          type: "warning",
        });
        return false;
      }
    },

    //页数发生改变
    pageChanged(val) {
      this.table.page.pageNum = val;
      //   this.getTbData();
    },
    sizeChanged(val) {
      this.table.page.pageNum = 1;
      this.table.page.pageSize = val;
    },

    //判断是否是建设无监理
    isJianli() {
      api_isJianli({ projectId: this.$route.query.projectId })
        .then((res) => {
          // console.log('api_isJianli', res);
          if (res.msg && res.msg.code == "0000") {
            if (res.data && res.data == "2") {
              this.flag = true;
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //无闪烁跳转
    exportFile(url) {
      let a = document.createElement("a");
      a.href = url;
      a.click();
    },
    download(file) {
      let token = sessionStorage.getItem("token");
      this.exportFile(
        `${config.baseUrl}/jfzg/file/api/file/download?key=${file.fileId}&access_token=${token}`
      );
    },
    /**
     * 用于格式化表格数据，
     */
    formatter() {},
    //前端分页组件
    pageChanged(val) {
      this.table.page.pageNum = val;
      this.getCaptureData();
    },
    sizeChanged(val) {
      this.table.page.pageSize = val;
      this.getCaptureData();
    },
  },
};
</script>
<style lang="scss" scoped>
.Deliverable {
  // margin-top: 16px;
  .el-collapse {
    .fileNameBox {
      cursor: pointer;
      position: relative;
      display: inline-block;
      width: 390px;
      .downpic {
        position: absolute;
        right: 15px;
        top: 1px;
        display: none;
      }
    }
    .fileNameBox:hover {
      color: #1890ff;
    }
    .fileNameBox:hover .downpic {
      display: block;
    }
    .zanwu {
      img {
        width: 80px;
        height: 60px;
        margin-top: 24px;
      }
      div {
        position: relative;
        top: -20px;
      }
    }
    // padding: 0;
    // border: none !important;
    ::v-deep .el-collapse-item__header {
      height: 40px;
      background: #fafafa;
      border-radius: 8px;
      padding-left: 16px;
    }
    .el-collapse-item:nth-child(1) {
      margin-top: 8px;
    }
    ::v-deep .el-collapse-item__wrap {
      border: none !important;
    }
    ::v-deep .el-collapse-item__content {
      padding-bottom: 1px;
    }
    ::v-deep .el-collapse-item {
      margin-top: 16px;
      .sr_table {
        .el-table__fixed-right {
          height: 100% !important;
        }
      }
    }
  }
}
.collapse_title {
  .zanwushenhe {
    width: 76px;
    height: 28px;
    background: rgba(204, 204, 204, 1);
    border-radius: 2px;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    text-align: center;
    line-height: 28px;
    cursor: pointer;
  }

  .fileName {
    position: absolute;
    left: 0;
  }
  .iconText {
    position: absolute;
    right: 3px;
    font-size: 16px;
    color: rgba(53, 167, 255, 1);
    line-height: 52px;
  }
  ::v-deep.el-collapse-item__arrow {
    margin-right: 21px;
    // font-size: 16px;
    color: rgba(53, 167, 255, 1);
  }
  ::v-deep.el-collapse-item__wrap {
    border: none;
    .table-components .el-table::before {
      display: none;
    }
  }
  ::v-deep.inner .title {
    padding: 0 20px 0 24px;
    min-width: 116px;
  }
  .ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  ::v-deep.el-table__header-wrapper,
  ::v-deep.el-table__row {
    .tree-col {
      .cell {
        padding-left: 34px !important;
      }
    }
  }
  .topTitle {
    .title {
      padding-left: 14px;
      font-size: 20px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      width: 180px;
      float: left;
    }
  }
  ::v-deep.el-collapse {
    border: none;
  }
}
.zanwu {
  line-height: 60px;
  width: 50%;
  color: #909399;
  margin: 0 auto;
  text-align: center;
  font-size: 14px;
}
*:focus {
  outline: none !important;
}
.iconfujian {
  margin-right: 5px;
  color: rgb(124, 198, 255);
}
.dot {
  width: 6px;
  height: 6px;
  border-radius: 100%;
  display: inline-block;
  margin-right: 5px;
}
.red {
  background-color: red;
}
.green {
  background-color: #009900;
}
.yellow {
  background-color: #f7a900;
}
// .title {
//   font-size: 18px;
//   font-weight: 600;
//   min-width: 100px;
// }
.title_isChecked {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(85, 85, 85, 1);
  padding-left: 15px;
}
.collapse_title ::v-deep .widthUp {
  padding-top: 7px;
}
.deliverable {
  padding-right: 0px !important;
  display: flex;
  align-items: center;
  position: relative;
  .textBox {
    display: flex;
    align-items: center;
    margin-right: 150px;
    img {
      width: 16px;
      height: 16px;
      margin-right: 5px;
    }
    b {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
    }
    .Red {
      color: red;
    }
    .Green {
      color: #009900;
    }
    .Yellow {
      color: #f7a900;
    }
  }
  .btns {
    position: absolute;
    right: 16px;
    display: flex;
    align-items: center;
    .el-tooltip {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 10px;
    }
    .el-tooltip:hover {
      color: #1890ff;
    }

    .icon-download,
    .icon-editor {
      font-size: 20px;
      font-weight: 600;
    }
    .icon-packing-labeling {
      font-size: 20px;
      font-weight: 400;
      color: #000;
    }
    .icon-ashbin {
      font-size: 22px;
      font-weight: 400;
      color: #000;
    }
    .icon-shenhexinxi {
      font-size: 15px;
      font-weight: 600;
    }
    ::v-deep .upload-type {
      margin-right: 10px;
      .upload-demo {
        .el-upload-list {
          display: none;
        }
      }
      .bigFileUpload .uploader-example div .uploader-btn .icon-upload {
        font-weight: normal;
        color: #000;
      }
    }
  }
  .uploaderview {
    display: block;
    width: 50%;
    margin-right: 40px;
    float: right;
    ::v-deep .uploader {
      margin-bottom: 0;
      max-width: none;
      width: 215px !important;
    }
  }
}
.preview ::v-deep .uploader_title {
  max-width: 100px;
  min-width: 80px;
}
// .collapse_title .table ::v-deep section {
//   padding: (0!important);
// }
</style>
<style lang="scss">
.Deliverable {
  .el-table {
    border-radius: 0 0 8px 8px !important;
  }
  .collapse_title {
    .el-col {
      padding: 0 20px;
    }
    .inner {
      padding-bottom: 0;
      .el-collapse-item {
        margin-top: 16px;
      }
      .el-collapse {
        padding: 0;
        ::v-deep .el-collapse-item__header {
          height: 40px !important;
          background: #c02a2a !important;
          border-radius: 8px 8px 0px 0px !important;
        }
      }
      .el-collapse-item {
        margin-bottom: 20px;
      }
      .el-collapse-item:nth-last-child(1) {
        margin-bottom: 0;
        // .table-components {
        //   border-bottom: 0;
        // }
        // .el-collapse-item__header:nth-last-child(1) {
        //   border-bottom-color: transparent;
        // }
      }
    }

    .table-components {
      margin-top: 0 !important;
      padding: 0 !important;
      margin: 0;
      border-bottom: 1px solid rgba(113, 168, 228, 1);
      .table-components {
        .table-components {
          .el-table__expand-icon,
          .el-icon {
            display: none;
          }
        }
      }
    }
  }
}

.activeItem {
  .el-collapse-item__header {
    border-radius: 8px 8px 0 0 !important;
  }
}
</style>
