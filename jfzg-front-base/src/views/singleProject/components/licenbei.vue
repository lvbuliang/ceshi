<template>
  <div class="lcb_bianzhi">
    <!-- <div class="searchPage">
      <SrSearch
        :search="search"
        :searchExpand="true"
        :showTextBtns="true"
        :hideBtns="false"
        @queryList="pageChanged(1)"
      ></SrSearch>
      <span class="title">里程碑设置</span>
    </div> -->
    <SrTable
      @pageChanged="pageChanged"
      :data="table.data"
      @sizeChanged="sizeChanged"
      :config="table.tableConfig"
      :page="table.page"
    ></SrTable>

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
        <SwiperTab
          :eletab="eleMoban"
          v-if="eleMoban.length > 0"
          class="jfw_SwiperTab"
          @changeMoban="changeMoban"
        />
        <SrTable
          @pageChanged="pageChanged"
          :data="table2.data"
          @sizeChanged="sizeChanged"
          :config="table2.tableConfig"
          :page="table2.page"
        ></SrTable>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          size="medium"
          round
          type="primary"
          v-debounce="[() => centerDialogSubmit2(), configSettings.deTime]"
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
import SwiperTab from "./swiperTablcb";
import config from "@/settings.js";
import store from "@/store";
import {
  api_userSetQuery,
  api_userSetSave,
  api_userSetExport,
} from "@/api/index.js";
import { permissionCode } from "@/views/milestone/const.js";
import {
  getlichengbeilist,
  mobanList,
  mobanlcbList,
  removelcbAjax,
} from "@/api/bianzhi/index";
import { api_queryList } from "@/api/projectLibrary";
import { setSession, getSession, removeSession } from "@/core/session.js";
import { api_getCustomFormTemplate, addlichengbeilist } from "@/api/index.js";
export default {
  //组件注册
  components: {
    SwiperTab,
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
      dialogVisible: false,
      dialogVisible2: false,
      isTableHeaderId: "",
      loading: false,
      userInfo: store.getters.userInfo,
      tableList: {
        header: [],
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
                  name: "添加里程碑",
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
                    name: "上移", // 按钮名称，优先显示icon
                    type: "text",
                    size: "small",
                    method: "upbutton", // 点击执行该页面methods中对应的方法
                    icon: "iconbianji", // 按钮显示的图标,不传显示中文
                    code: "2334455", // 按钮的唯一值,用于角色按钮权限控制，不传默认不进行权限控制
                    validate: this.btnValidate, //自定义判断是否展示按钮权限
                  },
                  {
                    name: "下移", // 按钮名称，优先显示icon
                    type: "text",
                    size: "small",
                    method: "upbutton", // 点击执行该页面methods中对应的方法
                    icon: "iconbianji", // 按钮显示的图标,不传显示中文
                    code: "2334455", // 按钮的唯一值,用于角色按钮权限控制，不传默认不进行权限控制
                    validate: this.btnValidate, //自定义判断是否展示按钮权限
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
            display: false,
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
      dialogTitle2: "模板里程碑添加",
      form: {
        config: [
          {
            key: "1625905137000_98984",
            type: "input",
            bind: "stageName",
            name: "里程碑节点名称",
            col: 12,
            className: "",
            isHide: false,
            isHideView: false,
            placeholder: "请输入",
            maxlength: 50,
            disabled: false,
            readonly: false,
            required: "里程碑节点名称为必填项",
            trigger: "blur",
            rules: [],
          },
          {
            key: "1626076896000_63831",
            type: "number",
            bind: "stageWeight",
            name: "权重",
            required: "权重为必填项",
            col: 12,
            className: "",
            isHide: false,
            isHideView: false,
            disabled: false,
            placeholder: "请输入权重",
            min: 0,
            max: 100,
            "controls-position": "",
            trigger: "blur",
            rules: [],
          },
          {
            key: "1625905388000_70927",
            type: "dateSelect",
            bind: "dueStartTime",
            name: "开始时间",
            col: 12,
            className: "",
            isHide: false,
            isHideView: false,
            timeType: "date",
            disabled: false,
            placeholder: "请选择",
            format: "yyyy-MM-dd",
            "range-separator": "",
            required: "开始时间为必填项",
            trigger: "blur",
            rules: [],
          },
          {
            key: "1625905386000_55767",
            type: "dateSelect",
            bind: "dueEndTime",
            name: "结束时间",
            col: 12,
            className: "",
            isHide: false,
            isHideView: false,
            timeType: "date",
            disabled: false,
            placeholder: "请选择",
            format: "yyyy-MM-dd",
            "range-separator": "",
            required: "结束时间为必填项",
            trigger: "blur",
            rules: [],
          },
        ],
        data: {
          stageName: "",
          dueStartTime: "",
          dueEndTime: "",
          stageWeight: "",
          stageWeightName: "",
        },
        otherConfig: {
          labelNum: 130,
        },
        enums: {},
      },
      eleMoban: [],
    };
  },
  methods: {
    upbutton(item, row) {
      if (row == "下移") {
        var z_data = this.table.data[item.sort + 1];
        this.table.data[item.sort + 1] = this.table.data[item.sort];
        this.table.data[item.sort] = z_data;
        this.table.data[item.sort].sort--;
        this.table.data[item.sort].num--;
        this.table.data[item.sort + 1].num++;
        this.table.data[item.sort + 1].sort++;
      } else {
        var z_data = this.table.data[item.sort - 1];
        this.table.data[item.sort - 1] = this.table.data[item.sort];
        this.table.data[item.sort] = z_data;
        this.table.data[item.sort].sort++;
        this.table.data[item.sort - 1].sort--;
        this.table.data[item.sort].num--;
        this.table.data[item.sort + 1].num++;
      }
    },
    btnValidate(item, row) {
      if (item.name == "上移" && row.sort == 0) {
        return false;
      } else if (
        (item.name == "下移" && row.sort == this.table.data.length - 1) ||
        this.table.data.length == 1
      ) {
        return false;
      } else {
        return true;
      }
    },
    centerDialogSubmit() {
      let params = {
        ...this.form.data,
      };
      if (this.dialogTitle == "添加里程碑") {
        var datalist = this.table.data || [];
        var map = {
          num: datalist.length + 1,
          sort: datalist.length + 1,
          stageName: params.stageName,
          stageWeight: params.stageWeight,
          stageWeightName: params.stageWeight + "%",
          dueTime: params.dueStartTime + "-" + params.dueEndTime,
          dueStartTime: params.dueStartTime,
          dueEndTime: params.dueEndTime,
        };
        datalist.push(map);
      } else {
        var datalist = this.table.data || [];
        for (var i = 0; i < datalist.length; i++) {
          if (datalist[i].num == params.num) {
            (datalist[i].stageName = params.stageName),
              (datalist[i].stageWeight = params.stageWeight),
              (datalist[i].stageWeightName = params.stageWeight + "%"),
              (datalist[i].dueTime =
                params.dueStartTime + "-" + params.dueEndTime),
              (datalist[i].dueStartTime = params.dueStartTime),
              (datalist[i].dueEndTime = params.dueEndTime);
          }
        }
      }
      this.$set(this.table, "data", datalist);
      this.dialogVisible = false;
    },
    centerDialogClose() {
      this.form.data = {};
      this.dialogVisible = false;
    },
    centerDialogSubmit2() {
      //当然选择新的模板下的里程碑时，调用接口删除所有老的项目下的里程碑，然后把模板中的里程碑加入到列表页中，先不保存，调用下一步时，才调用接口保存数据
      var deletedata = [];
      for (var i = 0; i < this.table.data.length; i++) {
        //只删除真实数据，临时数据在点确定重新渲染后自动丢失
        if (this.table.data[i].stageId) {
          deletedata.push(this.table.data[i].stageId);
        }
      }
      if (deletedata.length > 0) {
        removelcbAjax(deletedata).then((res) => {
          if (res.msg.code == "0000") {
            //调用接口删除后进行数据渲染，无需弹出提示框

            //遍历所有模板里程碑并渲染页面
            var datalist = [];
            for (var i = 0; i < this.table2.data.length; i++) {
              var map = {
                num: i + 1,
                sort: i + 1,
                stageWeightName: this.table2.data[i].stageWeight + "%",
                dueTime: "",
                ...this.table2.data[i],
                tempId: this.table2.data[i].id,
              };
              datalist.push(map);
            }
            this.$set(this.table, "data", datalist);
          }
        });
      } else {
        //第一次初始化页面无数据
        //遍历所有模板里程碑并渲染页面
        var datalist = [];
        for (var i = 0; i < this.table2.data.length; i++) {
          var map = {
            num: i + 1,
            sort: i + 1,
            stageWeightName: this.table2.data[i].stageWeight + "%",
            dueTime: "",
            ...this.table2.data[i],
            tempId: this.table2.data[i].id,
          };
          datalist.push(map);
        }

        this.$set(this.table, "data", datalist);
      }

      this.dialogVisible2 = false;
    },
    centerDialogClose2() {
      this.dialogVisible2 = false;
    },
    delete(row) {
      this.$SrUtils.showConfirmMessage.call(this, {
        title: "提示",
        content: "此操作将删除此申报项目, 是否继续?",
        okFun: () => {
          var deletedata = [];
          deletedata.push(row.stageId);
          removelcbAjax(deletedata).then((res) => {
            if (res.msg.code == "0000") {
              this.$message({
                type: "success",
                message: "删除成功",
              });
              if (this.table.data.length == 1) {
                this.table.page.pageNum = this.table.page.pageNum - 1;
              }
              this.getTbData();
            }
          });
        },
        cancelFun: () => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        },
      });
    },
    getTbHeader() {
      let headerData = [
        {
          disabled: true,
          index: 1,
          isShow: true,
          label: "序号",
          prop: "num",
          width: "70px",
        },
        { index: 2, isShow: true, label: "里程碑节点", prop: "stageName" },
        { index: 3, isShow: true, label: "里程碑完成计划", prop: "dueTime" },
        {
          index: 4,
          isShow: true,
          label: "权重",
          prop: "stageWeightName",
          width: "70px",
        },
      ];
      this.table.tableConfig.operateConfig.allTableHeader = headerData;
      this.table.tableConfig.header = headerData.filter((item) => item.isShow);

      let headerData2 = [
        {
          disabled: true,
          index: 1,
          isShow: true,
          label: "序号",
          prop: "num",
          width: "70px",
        },
        { index: 2, isShow: true, label: "里程碑节点", prop: "stageName" },
        {
          index: 3,
          isShow: true,
          label: "权重",
          prop: "stageWeightName",
          width: "70px",
        },
        {
          index: 4,
          isShow: true,
          label: "阶段性完成标志",
          prop: "stageCompleteDesc",
        },
      ];
      this.table2.tableConfig.header = headerData2.filter(
        (item) => item.isShow
      );
    },

    //页数发生改变
    pageChanged(val) {
      this.table.page.pageNum = val;
      this.getTbData();
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
      this.loading = true;
      getlichengbeilist(param).then((res) => {
        if (res) {
          // this.table.page.pages = res.data.pages;
          // this.table.page.total = res.data.total;
          // this.table.data = res.data.records;
          res.data = res.data.sort((a, b) => a.sort - b.sort);
          for (var i = 0; i < res.data.length; i++) {
            res.data[i].num = i + 1;
            (res.data[i].sort = i),
              (res.data[i].stageWeightName =
                (res.data[i].stageWeight || 0) + "%"),
              (res.data[i].dueTime =
                res.data[i].dueStartTime.substring(0, 10) +
                "-" +
                res.data[i].dueEndTime.substring(0, 10));
          }
          this.table.data = res.data;
        } else {
          this.table.data = [];
        }
        this.loading = false;
      });
    },
    settingHeader() {
      this.dialogVisible = true;
    },

    add() {
      this.$set(this.form, "data", {});
      this.dialogTitle = "添加里程碑";
      this.dialogVisible = true;
    },
    addmoban() {
      this.dialogVisible2 = true;
    },
    edit(row) {
      this.$set(this.form, "data", row);
      this.dialogTitle = "编辑里程碑";
      this.dialogVisible = true;
    },
    handleSelect(val) {
      removeSession("infoId_planedProject" + val.id);
      this.$router.push({
        name: "planedProjectAdd",
        query: { projectId: val.id },
      });
    },
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
          mobanlcbList(param).then((res) => {
            for (var i = 0; i < res.data.length; i++) {
              res.data[i].num = i + 1;
              res.data[i].stageWeightName = res.data[i].stageWeight + " %";
            }
            this.$set(this.table2, "data", res.data);
          });
        } else {
          this.$set(this.table2, "data", []);
        }
      });
    },
    changeMoban(index) {
      var param = {
        id: this.eleMoban[index].tagTypeId,
      };
      mobanlcbList(param).then((res) => {
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].num = i + 1;
          res.data[i].stageWeightName = res.data[i].stageWeight + " %";
        }
        this.$set(this.table2, "data", res.data);
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
<style lang="scss" scoped>
.lcb_bianzhi {
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
