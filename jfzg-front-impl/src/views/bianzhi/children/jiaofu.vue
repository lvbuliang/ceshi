<template>
  <div class="jfw_bianzhi">
    <div class="searchPage">
      <SrSearch
        :search="search"
        :searchExpand="true"
        :showTextBtns="true"
        :hideBtns="false"
        @queryList="pageChanged(1)"
      ></SrSearch>
      <span class="title">交付物设置</span>
    </div>
    <div>
      <SwiperTab
        :eletab="eletab"
        v-if="eletab.length > 0"
        ref="SwiperTab"
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
            <span v-if="!scope.scope.row.templates[0]">{{ "" }}</span>
            <span class="fileNameBox" v-else>
              <span
                @click="seeFile(scope.scope.row)"
                v-if="
                  scope.scope.row.templates[0].fileName.substring(
                    0,
                    scope.scope.row.templates[0].fileName.lastIndexOf('.')
                  ).length < 20
                "
              >
                {{ scope.scope.row.templates[0].fileName }}</span
              >
              <span @click="seeFile(scope.scope.row)" v-else>
                {{
                  scope.scope.row.templates[0].fileName.substring(0, 20)
                }}...{{
                  scope.scope.row.templates[0].fileName.substring(
                    scope.scope.row.templates[0].fileName.lastIndexOf(".")
                  )
                }}</span
              >
              <i
                class="sr-icon-download downpic"
                style="color: rgb(24, 144, 255)"
                @click="download(scope.scope.row)"
              ></i>
            </span>
          </p>
        </template>
      </SrTable>
    </div>
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
          :ref="`formAdd`"
        ></SrAdd>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          size="medium"
          round
          type="primary"
          v-debounce="[() => centerDialogSubmit(), config.deTime]"
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
              <span
                v-if="
                  !scope.scope.row.templates || !scope.scope.row.templates[0]
                "
                >{{ "" }}</span
              >
              <span class="fileNameBox" v-else>
                <span
                  @click="seeFile2(scope.scope.row)"
                  v-if="
                    scope.scope.row.templates[0].name.substring(
                      0,
                      scope.scope.row.templates[0].name.lastIndexOf('.')
                    ).length < 20
                  "
                >
                  {{ scope.scope.row.templates[0].name }}</span
                >
                <span @click="seeFile2(scope.scope.row)" v-else>
                  {{ scope.scope.row.templates[0].name.substring(0, 20) }}...{{
                    scope.scope.row.templates[0].name.substring(
                      scope.scope.row.templates[0].name.lastIndexOf(".")
                    )
                  }}</span
                >
                <i
                  class="sr-icon-download downpic"
                  style="color: rgb(24, 144, 255)"
                  @click="download2(scope.scope.row)"
                ></i>
              </span>
            </p>
          </template>
        </SrTable>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          size="medium"
          round
          type="primary"
          v-debounce="[() => centerDialogSubmit2(), config.deTime]"
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
import SwiperTab from "../components/swiperTab";
import SwiperTabjfw from "../components/swiperTabjfw";
import {
  api_userSetQuery,
  api_userSetSave,
  api_userSetExport,
} from "@/api/index.js";
import { permissionCode } from "@/views/milestone/const.js";
import config from "@/settings.js";
import {
  getJFWlist,
  saveJFWlist,
  mobanList,
  mobanJFWList,
  mobanlcbList,
  api_getdeliveryNormalList,
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
    projectType: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      config,
      addMObanList: [],
      eleMoban: [],
      eleLcbMoban: [],
      indexData: 0,
      dialogVisible2: false,
      dialogVisible: false,
      isTableHeaderId: "",
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
            hideHeaderSetting: true,
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
                    validate: this.btnValidate, //自定义判断是否展示按钮权限
                  },
                  {
                    name: "删除", // 按钮名称，优先显示icon
                    type: "text",
                    size: "small",
                    method: "delete", // 点击执行该页面methods中对应的方法
                    icon: "iconbianji", // 按钮显示的图标,不传显示中文
                    code: "2334455", // 按钮的唯一值,用于角色按钮权限控制，不传默认不进行权限控制
                    validate: this.btnValidate, //自定义判断是否展示按钮权限
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
      displayOperationBtn: true,
      baseDeliveryList: [], //预置交付物
    };
  },
  methods: {
    btnValidate(item, row) {
      console.log(item, row);
      if ((item.name == "删除" || item.name == "编辑") && row.canDelete) {
        return false;
      } else {
        return true;
      }
    },
    getdeliveryNormalList() {
      api_getdeliveryNormalList().then((res) => {
        console.log(res);
        this.baseDeliveryList = res.data;
      });
    },

    // 查看附件
    seeFile(row) {
      let token = sessionStorage.getItem("token");
      if (
        [
          "txt",
          "ppt",
          "pptx",
          "doc",
          "docx",
          "xls",
          "xlsx",
          "html",
          "pdf",
          "ofd",
        ].includes(row.templates[0].fileName.split(".").pop())
      ) {
        window.open(`${config.baseUrl}/viewPdf?id=${row.templates[0].fileId}`);
      } else {
        window.open(
          `${config.baseUrl}/jfzg/file/api/file/download?key=${row.templates[0].fileId}&access_token=${token}`
        );
      }
    },
    // 查看附件
    seeFile2(row) {
      let token = sessionStorage.getItem("token");
      if (
        [
          "txt",
          "ppt",
          "pptx",
          "doc",
          "docx",
          "xls",
          "xlsx",
          "html",
          "pdf",
          "ofd",
        ].includes(row.templates[0].name.split(".").pop())
      ) {
        window.open(`${config.baseUrl}/viewPdf?id=${row.templates[0].id}`);
      } else {
        window.open(
          `${config.baseUrl}/jfzg/file/api/file/download?key=${row.templates[0].id}&access_token=${token}`
        );
      }
    },
    download(file) {
      let token = sessionStorage.getItem("token");
      console.log(
        `${config.baseUrl}/jfzg/file/api/file/download?key=${file.templates[0].fileId}&access_token=${token}`
      );
      window.open(
        `${config.baseUrl}/jfzg/file/api/file/download?key=${file.templates[0].fileId}&access_token=${token}`
      );
    },
    download2(file) {
      let token = sessionStorage.getItem("token");
      console.log(
        `${config.baseUrl}/jfzg/file/api/file/download?key=${file.templates[0].id}&access_token=${token}`
      );
      window.open(
        `${config.baseUrl}/jfzg/file/api/file/download?key=${file.templates[0].id}&access_token=${token}`
      );
    },
    getMoban() {
      // console.log("初始化这里");
      mobanList({ projectType: this.projectType }).then((res) => {
        // console.log("这里", res);
        var eleMoban = [];
        for (var i = 0; i < res.data.list.length; i++) {
          // console.log(res.data.list[i]);
          // 如果初始化第一条模板是标准模板不显示多选框
          if (!res.data.list[0].canDelete) {
            this.table2.tableConfig.selectionConfig.display = false;
          }
          var map = {
            tagTypeName: res.data.list[i].templName,
            tagTypeId: res.data.list[i].templId,
            isClick: true,
            canDelete: res.data.list[i].canDelete, //用于标识是否是标准模板
          };
          eleMoban.push(map);
        }
        this.eleMoban = eleMoban;
        if (res.data.list && res.data.list.length > 0) {
          var param = {
            id: this.eleMoban[0].tagTypeId,
          };
          var eleLcbMoban = [];
          mobanlcbList(param).then((res) => {
            for (var i = 0; i < res.data.list.length; i++) {
              var map = {
                tagTypeName: res.data.list[i].stageName,
                tagTypeId: res.data.list[i].id,
                templId: res.data.list[i].templId,
                isClick: true,
                flag: res.data[i].list[i].flag,
              };
              eleLcbMoban.push(map);
            }
            this.eleLcbMoban = eleLcbMoban;
            if (this.eleLcbMoban[0]) {
              var param = {
                id: this.eleLcbMoban[0].tagTypeId,
              };
              mobanJFWList(param).then((res) => {
                if (res.data) {
                  for (var i = 0; i < res.data.length; i++) {
                    res.data[i].num = i + 1;
                    res.data[i].name = res.data[i].deliverName;
                    res.data[i].isChecked = res.data[i].isCheck;
                    res.data[i].stageWeightName =
                      res.data[i].stageWeight + " %";
                    res.data[i].templates = res.data[i].templFile
                      ? JSON.parse(res.data[i].templFile)
                      : [];
                    if (res.data[i].templates == "0") {
                      res.data[i].templates = [];
                    }
                  }
                  this.$set(this.table2, "data", res.data);
                } else {
                  this.$set(this.table2, "data", []);
                }
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
    // 里程碑节点切换里程碑模版同步切换获取里程碑节点下交付物
    changeLcb(index) {
      var param = {
        id: this.eleMoban[index].tagTypeId,
      };
      // 切换的模板是标准不显示多选
      if (this.eleMoban[index].canDelete) {
        this.table2.tableConfig.selectionConfig.display = false;
      } else {
        this.table2.tableConfig.selectionConfig.display = true;
      }
      var eleLcbMoban = [];
      mobanlcbList(param).then((res) => {
        console.log("切换里程碑", res);
        if (res && res.data && res.data.list && res.data.list.length > 0) {
          for (var i = 0; i < res.data.list.length; i++) {
            var map = {
              tagTypeName: res.data.list[i].stageName,
              tagTypeId: res.data.list[i].id,
              templId: res.data.list[i].templId,
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
              if (res.data) {
                for (var i = 0; i < res.data.length; i++) {
                  res.data[i].num = i + 1;
                  res.data[i].name = res.data[i].deliverName;
                  res.data[i].isChecked = res.data[i].isCheck;
                  res.data[i].stageWeightName = res.data[i].stageWeight + " %";
                  res.data[i].templates = res.data[i].templFile
                    ? JSON.parse(res.data[i].templFile)
                    : [];
                  if (res.data[i].templates == "0") {
                    res.data[i].templates = [];
                  }
                }
                this.$set(this.table2, "data", res.data);
              } else {
                this.$set(this.table2, "data", []);
              }
            });
          }
        } else {
          this.eleLcbMoban = [];
          this.$set(this.table2, "data", []);
        }
      });
    },
    // 从模版添加交付物选择不同里程碑点击获取不同里程碑节点交付物模版
    getJFW(index) {
      var param = {
        id: this.eleLcbMoban[index].tagTypeId,
      };
      mobanJFWList(param).then((res) => {
        if (res.data) {
          for (var i = 0; i < res.data.length; i++) {
            res.data[i].num = i + 1;
            res.data[i].name = res.data[i].deliverName;
            res.data[i].isChecked = res.data[i].isCheck;
            res.data[i].stageWeightName = res.data[i].stageWeight + " %";
            res.data[i].templates = res.data[i].templFile
              ? JSON.parse(res.data[i].templFile)
              : [];
            if (res.data[i].templates == "0") {
              res.data[i].templates = [];
            }
          }
          this.$set(this.table2, "data", res.data);
        } else {
          this.$set(this.table2, "data", []);
        }
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

    delete(row) {
      this.$SrUtils.showConfirmMessage.call(this, {
        title: "提示",
        content: "此操作将删除此交付物, 是否继续?",
        okFun: () => {
          //1.页面逻辑删除
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
          this.$set(this.table, "data", deliverys);
          // 如果这条数据已保存进数据库
          // if(row.stageId){
          //   var deletedata = [];
          //   deletedata.push(row.stageId);
          //   removelcbAjax(deletedata).then((res) => {
          //     if (res.msg.code == "0000") {
          //       this.$message({
          //         type: "success",
          //         message: "删除成功",
          //       });
          //     }
          //   });
          // }else{
          this.$message({
            type: "success",
            message: "删除成功",
          });
          // }
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
          width: "140px",
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
        projectId: this.$route.query.id,
      };
      getJFWlist(param).then((res) => {
        if (res) {
          console.log("这里有啥", res);
          for (var i = 0; i < res.data.length; i++) {
            console.log("i", i);
            var map = {
              tagTypeName: res.data[i].stageInfo.stageName,
              tagTypeId: res.data[i].stageInfo.stageId,
              dataValue: res.data[i].stageInfo.stageId,
              dataName: res.data[i].stageInfo.stageName,
              deliverys: [],
              isClick: true,
              flag: res.data[i].stageInfo.flag,
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
              console.log("这里", map);
            }
            // 预置交付物
            if (!res.data[i].deliveryInfo) {
              console.log("111");
              // console.log(res.data[i].stageInfo.flag);
              // console.log(this.baseDeliveryList);
              let temp = res.data[i].stageInfo.flag;
              let result = this.baseDeliveryList.find(
                (item) => item.flag == temp
              );
              if (result) {
                // console.log("result", result);
                result.deliveryInfos.forEach((element) => {
                  console.log("element", element, JSON.parse(element.file));
                  let templateFile = [];
                  if (element.file) {
                    templateFile = JSON.parse(element.file);
                    // console.log("templateFile", templateFile);
                    element.deliveryFile = [
                      {
                        fileId: templateFile[0]?.id,
                        fileName: templateFile[0]?.name,
                      },
                    ];
                    // console.log("hou", element);
                  } else {
                    element.deliveryFile = null;
                  }
                  console.log(element.deliveryFile);
                  element.templates = element.deliveryFile || [];
                });
                map.deliverys = result.deliveryInfos;
                console.log(map);
              }
            }
            console.log(this.baseDeliveryList);
            this.eletab.push(map);
          }
          var index = 0;
          var list = this.eletab[index].deliverys || [];
          this.table.data = list;
          // console.log(this.table.table);
          this.$set(this.form.enums, "lcblist", this.eletab);
        } else {
          this.table.data = [];
        }
      });
    },
    changeshow(index) {
      var list = this.eletab[index].deliverys || [];
      // console.log("list", list, this.eletab[index]);
      this.indexData = index;
      this.table.data = list;
    },
    // 添加、编辑交付物确定
    centerDialogSubmit() {
      var that = this;
      this.$refs["formAdd"].validate((valid) => {
        if (valid) {
          that.$set(that.table, "data", []);
          let params = {
            ...this.form.data,
          };
          console.log(params);
          if (this.dialogTitle == "添加交付物") {
            var index = 0;
            for (var i = 0; i < this.eletab.length; i++) {
              if (this.eletab[i].tagTypeId == params.stageId) {
                index = i;
                this.indexData = index;
                that.$refs.SwiperTab.changeactive(this.indexData);

                if (params.templates && params.templates.length > 0) {
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
          } else {
            var index = 0;
            for (var i = 0; i < this.eletab.length; i++) {
              console.log(this.eletab[i], params);
              if (this.eletab[i].tagTypeId == params.stageId) {
                index = i;
                this.indexData = index;
                if (params.templates && params.templates.length > 0) {
                  params.templates[0].fileId = params.templates[0].id;
                  params.templates[0].fileName = params.templates[0].name;
                }
                for (var n = 0; n < this.eletab[i].deliverys.length; n++) {
                  console.log(this.eletab[i].deliverys[n], params);
                  if (
                    this.eletab[i].deliverys[n].num == params.num &&
                    this.eletab[i].deliverys[n].id == params.id
                  ) {
                    this.eletab[i].deliverys[n].name = params.name;
                    this.eletab[i].deliverys[n].isChecked = params.isChecked;
                    this.eletab[i].deliverys[n].templates =
                      params.templates || [];
                    this.eletab[i].deliverys[n].stageId = params.stageId;
                    break;
                  }
                }
                break;
              }
            }
          }
          var deliverys = this.eletab[index].deliverys;
          this.$set(this.table, "data", deliverys);
          this.dialogVisible = false;
        }
      });
    },
    // 从模版中添加、编辑交付物确定
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
    // 添加交付物
    add() {
      this.dialogTitle = "添加交付物";
      this.$set(this.form, "data", {});
      this.$set(this.form.config[0], "disabled", false);
      this.$set(this.form.config[this.form.config.length - 1], "fileList", []);
      if (this.$refs["formAdd"]) {
        this.$refs["formAdd"].resetForm();
      }
      this.dialogVisible = true;
    },
    // 添加模版交付物
    addmoban() {
      this.dialogVisible2 = true;
    },
    edit(row) {
      console.log("row", row);
      console.log(this.form.data);
      if (this.$refs["formAdd"]) {
        this.$refs["formAdd"].resetForm();
        this.form = {
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
        };
      }
      row.stageId = this.eletab[this.indexData].tagTypeId;
      var rowdata = JSON.parse(JSON.stringify(row));
      console.log(rowdata);
      if (rowdata.templates && rowdata.templates.length > 0) {
        rowdata.templates = [
          {
            id: rowdata.templates[0].fileId,
            name: rowdata.templates[0].fileName,
          },
        ];
      }
      rowdata.isChecked = String(rowdata.isChecked);
      this.$set(this.form, "data", rowdata);
      /*      this.$set(
        this.form.config[this.form.config.length - 1],
        "fileList",
        rowdata.deliveryFile || []
      ); */
      this.$set(this.form.config[0], "disabled", true);
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
    this.getdeliveryNormalList();
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
        min-width: 190px;
        cursor: pointer;
        box-sizing: border-box;
        padding-bottom: 10px;
        div {
          width: 100%;
          padding-left: 24px;
          padding-right: 24px;
          white-space: nowrap;
        }
      }
    }
  }
  .jfw_SwiperTab {
    margin-bottom: 8px;
  }
}
</style>
<style lang="scss" scoped>
.jfw_bianzhi {
  ::v-deep
    .el-dialog
    .el-dialog__footer
    .dialog-footer
    .el-button:nth-child(2) {
    margin-right: 0px;
  }
  .fileNameBox {
    cursor: pointer;
    position: relative;
    display: inline-block;
    .downpic {
      margin-left: 1px;
      vertical-align: middle;
      display: none;
    }
  }
  .fileNameBox:hover {
    color: #1890ff;
  }
  .fileNameBox:hover .downpic {
    display: inline-block;
  }
  .searchPage {
    position: relative;
    margin-bottom: 46px;
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
    ::v-deep .sr_search .search-btn {
      padding-bottom: 0px !important;
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
