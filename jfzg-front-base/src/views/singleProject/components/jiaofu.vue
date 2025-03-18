<template>
  <div class="jfw_bianzhi">
    <!-- <div class="searchPage">
      <SrSearch
        :search="search"
        :searchExpand="true"
        :showTextBtns="true"
        :hideBtns="false"
        @queryList="pageChanged(1)"
      ></SrSearch>
      <span class='title'>交付物设置</span>
    </div> -->
    <SwiperTab
      :eletab="eletab"
      v-if="eletab.length > 0"
      class="jfw_SwiperTab"
    />
    <SrTable
      @pageChanged="pageChanged"
      :data="table.data"
      @sizeChanged="sizeChanged"
      :config="table.tableConfig"
      :page="table.page"
    >
      <template slot="cellSlot" slot-scope="scope">
        <p class="statusBox" v-if="scope.scope.item.prop == 'isChecked'">
          <span>{{ isCheckedName[scope.scope.row.isChecked] }}</span>
        </p>
        <p class="statusBox" v-if="scope.scope.item.prop == 'templates'">
          <span>{{
            scope.scope.row.templates[0]
              ? scope.scope.row.templates[0].fileName
              : ""
          }}</span>
        </p>
      </template>
    </SrTable>

    <el-dialog
      class="dialog"
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="800px"
      center
    >
      <div class="contentBox">
        <SrAdd
          :config="form.config"
          :otherConfig="otherConfig"
          :enums="form.enums"
          :form="form.data"
          :ref="`form`"
        ></SrAdd>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          size="medium"
          round
          type="primary"
          v-debounce="[() => centerDialogSubmit(), configSettings.deTime]"
          >确 定</el-button
        >
        <el-button size="medium" round @click="centerDialogClose"
          >取 消</el-button
        >
      </span>
    </el-dialog>

    <el-dialog
      class="dialog"
      :title="dialogTitle2"
      :visible.sync="dialogVisible2"
      width="800px"
      center
    >
      <div class="contentBox">
        <SwiperTabjfw
          enter="moban"
          :eletab="eleMoban"
          v-if="eleMoban.length > 0"
          class="jfw_SwiperTab"
          @changeMoban="changeLcb"
        />
        <SwiperTabjfw
          enter="lcb"
          :eletab="eleLcbMoban"
          v-if="eleLcbMoban.length > 0"
          class="jfw_SwiperTab"
          @changeMoban="getJFW"
        />
        <SrTable
          @pageChanged="pageChanged"
          :data="table2.data"
          @selected="selectedBc"
          @sizeChanged="sizeChanged"
          :config="table2.tableConfig"
          :page="table2.page"
        >
          <template slot="cellSlot" slot-scope="scope">
            <p class="statusBox" v-if="scope.scope.item.prop == 'isChecked'">
              <span>{{ isCheckedName[scope.scope.row.isChecked] }}</span>
            </p>
            <p class="statusBox" v-if="scope.scope.item.prop == 'templates'">
              <span>{{
                scope.scope.row.templates[0]
                  ? scope.scope.row.templates[0].fileName
                  : ""
              }}</span>
            </p>
          </template>
        </SrTable>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          size="medium"
          round
          type="primary"
          @click="centerDialogSubmit2"
          >确 定</el-button
        >
        <el-button size="medium" round @click="centerDialogClose2"
          >取 消</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import store from "@/store";
import SwiperTab from "./swiperTab";
import SwiperTabjfw from "./swiperTabjfw";
import config from "@/settings.js";
import {
  api_userSetQuery,
  api_userSetSave,
  api_userSetExport,
} from "@/api/index.js";
import { permissionCode } from "@/views/milestone/const.js";
import {
  getJFWlist,
  saveJFWlist,
  mobanList,
  mobanJFWList,
  mobanlcbList,
} from "@/api/bianzhi/index";
import { api_queryList } from "@/api/projectLibrary";
import { setSession, getSession, removeSession } from "@/core/session.js";
import { api_getCustomFormTemplate, addlichengbeilist } from "@/api/index.js";
export default {
  //组件注册
  components: {
    SwiperTab,
    SwiperTabjfw,
  },

  props: {
    ifHideAddBtn: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      configSettings: config,
      addMObanList: [],
      eleMoban: [],
      eleLcbMoban: [],
      indexData: 0,
      dialogVisible2: false,
      dialogVisible: false,
      isTableHeaderId: "",
      loading: false,
      userInfo: store.getters.userInfo,
      tableList: {
        header: [],
      },
      isCheckedName: {
        0: "是",
        1: "否",
      },
      search: {
        size: "small",
        nosearch: true,
        labelConfig: {
          labelWidth: "90px",
          labelSuffix: ":",
          labelPosition: "right",
        },
        config: [],
        enum: {},
        btns:
          this.$route.name == "bianzhiInitiateDetail"
            ? [
                {
                  name: "添加交付物",
                  click: this.add,
                  type: "primary",
                },
                {
                  name: "从模板中添加",
                  click: this.addmoban,
                  // type: "primary",
                },
              ]
            : [],
        formData: {},
      },
      dialogTitle2: "模板交付物添加",
      table: {
        data: [], // 表格数据
        tableConfig: {
          rowClassName: this.rowClassName,
          title: "表格的标题", // 表格标题
          highlightCurrentRow: false, // 控制表格是否单选
          // maxLength: 20, // 一行最多显示多少字，超出显示popver
          load: this.load,
          tooltipEffect: "light",
          header: [],
          selectionConfig: {
            display: false,
            width: "70",
          },
          operateConfig: {
            display: this.$route.name == "bianzhiInitiateDetail" ? true : false,
            label: "操作",
            width: "156",
            fixed: "right",
            allTableHeader: "",
            saveHeaderList: false,
            export: false,
            // exportPermissionCode: this.ifHideAddBtn ? "M004_M002_001" : "M003_M002_002",
          },
          innerBtn:
            this.$route.name == "bianzhiInitiateDetail"
              ? [
                  // 表格内部操作按钮，不需要操作列的innerBtn 写成false
                  {
                    name: "编辑", // 按钮名称，优先显示icon
                    type: "text",
                    size: "small",
                    method: "edit", // 点击执行该页面methods中对应的方法
                    icon: "iconbianji", // 按钮显示的图标,不传显示中文
                    code: "2334455", // 按钮的唯一值,用于角色按钮权限控制，不传默认不进行权限控制
                  },
                  {
                    name: "删除", // 按钮名称，优先显示icon
                    type: "text",
                    size: "small",
                    method: "delete", // 点击执行该页面methods中对应的方法
                    icon: "iconbianji", // 按钮显示的图标,不传显示中文
                    code: "2334455", // 按钮的唯一值,用于角色按钮权限控制，不传默认不进行权限控制
                  },
                ]
              : [],
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
      table2: {
        data: [], // 表格数据
        tableConfig: {
          rowClassName: this.rowClassName,
          title: "表格的标题", // 表格标题
          highlightCurrentRow: false, // 控制表格是否单选
          // maxLength: 20, // 一行最多显示多少字，超出显示popver
          load: this.load,
          tooltipEffect: "light",
          header: [],
          selectionConfig: {
            display: true,
            width: "70",
          },
          innerBtn: [],
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
      otherConfig: {
        labelNum: 155,
      },
      dialogTitle: "",
      form: {
        config: [
          {
            key: "1626078367000_52418",
            type: "select",
            bind: "stageId",
            name: "里程碑节点名称",
            col: 12,
            className: "",
            isHide: false,
            isHideView: false,
            dataList: "lcblist",
            dataConfig: {
              url: "",
              params: [],
            },
            label: "",
            value: "",
            placeholder: "请选择里程碑节点",
            multiple: false,
            disabled: false,
            filterable: false,
            required: "里程碑节点名称为必填项",
            trigger: "blur",
            rules: [],
          },
          {
            key: "1626078388000_2099",
            type: "input",
            bind: "name",
            name: "交付物名称",
            col: 12,
            className: "",
            isHide: false,
            isHideView: false,
            placeholder: "请输入交付物名称",
            maxlength: 50,
            disabled: false,
            readonly: false,
            required: "交付物名称为必填项",
            trigger: "blur",
            rules: [],
          },
          {
            key: "1626078370000_84711",
            type: "select",
            bind: "isChecked",
            name: "是否为验收项",
            col: 12,
            className: "",
            isHide: false,
            isHideView: false,
            dataList: "isCheckedList",
            dataConfig: {
              url: "",
              params: [],
            },
            label: "",
            value: "",
            placeholder: "请选择",
            multiple: false,
            disabled: false,
            filterable: false,
            required: "是否为验收项为必填项",
            trigger: "blur",
            rules: [],
          },
          {
            key: "1626078408000_82205",
            type: "upload",
            bind: "templates",
            name: "文档模板",
            col: 24,
            className: "",
            isHide: false,
            isHideView: false,
            fileList: [],
            fileTip: "",
            limit: 1,
            fileType: "",
            // "required": "文档模板为必填项",
            trigger: "blur",
            rules: [],
          },
        ],
        data: {
          stageId: "",
          name: "",
          isChecked: "",
          templates: "",
        },
        otherConfig: {
          labelNum: 130,
        },
        enums: {
          lcblist: [],
          isCheckedList: [
            {
              dataValue: "0",
              dataName: "是",
              disabled: false,
            },
            {
              dataValue: "1",
              dataName: "否",
              disabled: false,
            },
          ],
        },
      },
      eletab: [],
    };
  },
  methods: {
    getMoban() {
      mobanList().then((res) => {
        var eleMoban = [];
        for (var i = 0; i < res.data.length; i++) {
          var map = {
            tagTypeName: res.data[i].cnName,
            tagTypeId: res.data[i].templId,
            isClick: true,
          };
          eleMoban.push(map);
        }
        this.eleMoban = eleMoban;
        if (res.data && res.data.length > 0) {
          var param = {
            id: this.eleMoban[0].tagTypeId,
          };
          var eleLcbMoban = [];
          mobanlcbList(param).then((res) => {
            for (var i = 0; i < res.data.length; i++) {
              var map = {
                tagTypeName: res.data[i].stageName,
                tagTypeId: res.data[i].id,
                templId: res.data[i].templId,
                isClick: true,
              };
              eleLcbMoban.push(map);
            }
            this.eleLcbMoban = eleLcbMoban;
            if (this.eleLcbMoban[0]) {
              var param = {
                id: this.eleLcbMoban[0].tagTypeId,
              };
              mobanJFWList(param).then((res) => {
                for (var i = 0; i < res.data.length; i++) {
                  res.data[i].num = i + 1;
                  res.data[i].name = res.data[i].deliverName;
                  res.data[i].isChecked = res.data[i].isCheck;
                  res.data[i].templates = res.data[i].templFileId || [];
                }
                this.$set(this.table2, "data", res.data);
              });
            } else {
              this.$set(this.table2, "data", []);
            }
          });
        } else {
          this.$set(this.table2, "data", []);
        }
      });
    },
    changeLcb(index) {
      var param = {
        id: this.eleMoban[index].tagTypeId,
      };
      var eleLcbMoban = [];
      mobanlcbList(param).then((res) => {
        for (var i = 0; i < res.data.length; i++) {
          var map = {
            tagTypeName: res.data[i].stageName,
            tagTypeId: res.data[i].id,
            templId: res.data[i].templId,
            isClick: true,
          };
          eleLcbMoban.push(map);
        }
        this.eleLcbMoban = eleLcbMoban;
        if (this.eleLcbMoban[0]) {
          var param = {
            id: this.eleLcbMoban[0].tagTypeId,
          };
          mobanJFWList(param).then((res) => {
            for (var i = 0; i < res.data.length; i++) {
              res.data[i].num = i + 1;
              res.data[i].stageWeightName = res.data[i].stageWeight + " %";
            }
            this.$set(this.table2, "data", res.data);
          });
        }
      });
    },
    getJFW(index) {
      var param = {
        id: this.eleLcbMoban[index].tagTypeId,
      };
      mobanJFWList(param).then((res) => {
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].num = i + 1;
          res.data[i].name = res.data[i].deliverName;
          res.data[i].isChecked = res.data[i].isCheck;
          res.data[i].templates = res.data[i].templFileId || [];
        }
        this.$set(this.table2, "data", res.data);
      });
    },
    upbutton(item, row) {
      if (row == "下移") {
        var z_data = this.table.data[item.sort + 1];
        this.table.data[item.sort + 1] = this.table.data[item.sort];
        this.table.data[item.sort] = z_data;
        this.table.data[item.sort].sort--;
        this.table.data[item.sort + 1].sort++;
      } else {
        var z_data = this.table.data[item.sort - 1];
        this.table.data[item.sort - 1] = this.table.data[item.sort];
        this.table.data[item.sort] = z_data;
        this.table.data[item.sort].sort++;
        this.table.data[item.sort - 1].sort--;
      }
    },
    centerDialogClose() {
      this.form.data = {};
      this.dialogVisible = false;
    },
    centerDialogClose2() {
      this.dialogVisible2 = false;
    },
    delete(row) {
      var deliverys = this.eletab[this.indexData].deliverys;
      var deleteIndex = 0;
      for (var i = 0; i < deliverys.length; i++) {
        if (deliverys[i].num == row.num) {
          deleteIndex = i;
          break;
        }
      }
      deliverys.splice(deleteIndex, 1);
      for (var i = 0; i < deliverys.length; i++) {
        deliverys[i].num = i + 1;
      }
      this.eletab[this.indexData].deliverys = deliverys;
      this.table.data = deliverys;
    },
    getTbHeader() {
      let headerData = [
        {
          disabled: true,
          index: 1,
          isShow: true,
          label: "序列",
          prop: "num",
          width: "70px",
        },
        { index: 2, isShow: true, label: "交付物名称", prop: "name" },
        {
          index: 3,
          isShow: true,
          label: "是否为验收项",
          prop: "isChecked",
          cellSlot: true,
        },
        {
          index: 4,
          isShow: true,
          label: "模板",
          prop: "templates",
          cellSlot: true,
        },
      ];

      this.table.tableConfig.operateConfig.allTableHeader = headerData;
      this.table.tableConfig.header = headerData.filter((item) => item.isShow);
      this.table2.tableConfig.header = headerData.filter((item) => item.isShow);
    },

    //页数发生改变
    pageChanged(val) {
      this.table.page.pageNum = val;
      this.getTbData();
    },
    selectedBc(val) {
      this.addMObanList = val;
    },
    sizeChanged(val) {
      this.table.page.pageNum = 1;
      this.table.page.pageSize = val;
      this.getTbData();
    },
    getTbData() {
      let param = {
        projectId: this.$route.query.projectId,
      };
      console.log(param);
      this.loading = true;
      getJFWlist(param).then((res) => {
        if (res) {
          for (var i = 0; i < res.data.length; i++) {
            var map = {
              tagTypeName: res.data[i].stageInfo.stageName,
              tagTypeId: res.data[i].stageInfo.stageId,
              dataValue: res.data[i].stageInfo.stageId,
              dataName: res.data[i].stageInfo.stageName,
              deliverys: [],
              isClick: true,
            };
            if (
              res.data[i].deliveryInfo &&
              res.data[i].deliveryInfo.length > 0
            ) {
              for (var n = 0; n < res.data[i].deliveryInfo.length; n++) {
                res.data[i].deliveryInfo[n].num = n + 1;
                res.data[i].deliveryInfo[n].templates =
                  res.data[i].deliveryInfo[n].deliveryFile || [];
              }
              map.deliverys = res.data[i].deliveryInfo || [];
            }
            this.eletab.push(map);
          }
          var index = 0;
          if (this.eletab.length > 0) {
            var list = this.eletab[index].deliverys || [];
          }
          this.table.data = list;
          this.$set(this.form.enums, "lcblist", this.eletab);
        } else {
          this.table.data = [];
        }
        this.loading = false;
      });
    },
    changeshow(index) {
      var list = this.eletab[index].deliverys || [];
      this.indexData = index;
      this.table.data = list;
    },
    centerDialogSubmit() {
      let params = {
        ...this.form.data,
      };
      var index = 0;
      for (var i = 0; i < this.eletab.length; i++) {
        if (this.eletab[i].tagTypeId == params.stageId) {
          index = i;
          this.indexData = index;
          if (params.templates) {
            params.templates[0].fileId = params.templates[0].id;
            params.templates[0].fileName = params.templates[0].name;
          }
          var map = {
            num: this.eletab[i].deliverys.length + 1,
            name: params.name,
            isChecked: params.isChecked,
            templates: params.templates || [],
            stageId: params.stageId,
          };
          this.eletab[i].deliverys.push(map);
          break;
        }
      }

      this.$set(this.table, "data", this.eletab[index].deliverys);
      this.dialogVisible = false;
    },
    centerDialogSubmit2() {
      for (var i = 0; i < this.eletab.length; i++) {
        if (i == this.indexData) {
          for (var y = 0; y < this.addMObanList.length; y++) {
            if (
              this.addMObanList[y].templates &&
              this.addMObanList[y].templates[0]
            ) {
              this.addMObanList[y].templates[0].fileId =
                this.addMObanList[y].templates[0].id;
              this.addMObanList[y].templates[0].fileName =
                this.addMObanList[y].templates[0].name;
            }
            var map = {
              num: this.eletab[i].deliverys.length + 1 + y,
              name: this.addMObanList[y].deliverName,
              isChecked: this.addMObanList[y].isChecked,
              templates: this.addMObanList[y].templates || [],
              stageId: this.eletab[i].tagTypeId,
            };
            this.eletab[i].deliverys.push(map);
          }
        }
      }
      this.$set(this.table, "data", this.eletab[this.indexData].deliverys);
      this.dialogVisible2 = false;
    },
    settingHeader() {
      this.dialogVisible = true;
    },

    add() {
      this.dialogTitle = "添加交付物";
      this.$set(this.form, "data", {});
      this.$set(this.form.config[this.form.config.length - 1], "fileList", []);
      this.dialogVisible = true;
    },
    addmoban() {
      this.dialogVisible2 = true;
    },
    edit(row) {
      row.stageId = this.eletab[this.indexData].tagTypeId;
      this.$set(this.form, "data", row);
      this.$set(
        this.form.config[this.form.config.length - 1],
        "fileList",
        row.deliveryFile
      );
      this.dialogTitle = "编辑交付物";
      this.dialogVisible = true;
    },
    prev() {
      this.swiper.slidePrev();
    },
    next() {
      this.swiper.slideNext();
    },
    handleSelect(val) {
      removeSession("infoId_planedProject" + val.id);
      this.$router.push({
        name: "planedProjectAdd",
        query: { projectId: val.id },
      });
    },
  },
  created() {
    this.getTbData();
    this.getTbHeader();
    this.getMoban();
  },
};
</script>
<style lang="scss">
.jfw_bianzhi {
  .Swiper {
    .swiperTodo {
      display: flex;
      flex-wrap: unset;
      position: relative;
      .swiperTodoItem {
        min-width: 300px;
        cursor: pointer;
        box-sizing: border-box;
        padding-bottom: 10px;
        div {
          width: 100%;
          padding-left: 40px;
          padding-right: 40px;
          white-space: nowrap;
        }
      }
    }
  }
  .sr_table {
    .el-table {
      border-top-right-radius: 0px !important;
      border-top-left-radius: 0px !important;
    }
  }
  .Swiper .swiperTodo {
    border-bottom: none;
    border-bottom-right-radius: 0px !important;
    border-bottom-left-radius: 0px !important;
  }
}
</style>
<style lang="scss" scoped>
.jfw_bianzhi {
  /deep/ .sr_table {
    .sr_table_bottom {
      display: none !important;
    }
  }
  .searchPage {
    position: relative;
    .title {
      position: absolute;
      top: 5px;
      height: 22px;
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 700;
      color: #333333;
      line-height: 22px;
    }
  }
}
::v-deep .SrDialogSelect {
  .el-input--suffix {
    display: none;
  }
}
::v-deep .dialog {
  .el-dialog__header {
    height: 56px;
  }
  .el-dialog__footer {
    padding: 12px 0;
  }
  .dialog-footer {
    .el-button {
      width: 76px;
      height: 32px;
      font-size: 14px;
      padding: 5px 24px;
    }
  }
}
.searchRightBtn {
  display: inline-block;
  button {
    width: 76px;
    height: 32px;
    border-radius: 16px;
    padding: 5px 24px;
  }
}
</style>
