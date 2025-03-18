<template>
  <div class="companysDetails pageBox">
    <detailsNav class="nav" :project="navData" />
    <div class="giveMark">
      <div class="giveMarkHeader">
        <div
          class="giveMarkHeaderContent"
          v-for="(item, index) in headerList"
          :key="index"
        >
          {{ item }}
        </div>
      </div>
      <div class="content">
        <div
          class="contentBox"
          v-for="(item, index) in contentBoxList"
          :key="index"
        >
          <img :src="item.imgUrl" alt="" />
          <div class="textBox">
            <p class="top">{{ item.textTop }}</p>
            <p class="down">{{ item.textDown }}</p>
          </div>
          <div class="grade" :style="'color:' + item.color">
            {{ item.grade ? item.grade : 0 }}
          </div>
        </div>
      </div>
      <el-tabs class="tabs" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane
          v-for="(item, index) in newEditableTabs"
          :key="String(index)"
          :label="item.title"
          :name="String(index)"
        >
          <template slot="label" class="tabsLabel">
            <img
              style="vertical-align: middle"
              src="@/assets/barrage_fill@2x.png"
              width="24px"
              height="auto"
              alt=""
            />
            <span
              style="color: #333; vertical-align: middle; padding-left: 4px"
              >{{ item.title }}</span
            ></template
          >
          <div v-if="index == 0">
            <div class="searchPage">
              <SrSearch
                :search="search"
                :searchExpand="true"
                :showTextBtns="true"
                :hideBtns="false"
                @queryList="pageChanged(1)"
              >
              </SrSearch>
            </div>
            <SrTable
              @pageChanged="pageChanged"
              :data="table.data"
              @sizeChanged="sizeChanged"
              @sortChange="sortChange"
              :config="table.tableConfig"
              :page="table.page"
            >
              <template slot="cellSlot" slot-scope="scope">
                <div v-if="scope.scope.item.prop == 'type'">
                  {{
                    scope.scope.row.type ? typeObj[scope.scope.row.type] : ""
                  }}
                </div>
                <div
                  class="buttonName"
                  v-else-if="scope.scope.item.prop == 'buttonName'"
                >
                  <span @click="rateDailog(scope.scope.row)">
                    {{ scope.scope.row.buttonName }}
                  </span>
                </div>
              </template>
            </SrTable>
          </div>
          <div v-if="index == 1">
            <div class="searchPage">
              <SrSearch
                :search="search2"
                :searchExpand="true"
                :showTextBtns="true"
                :hideBtns="false"
                @queryList="pageChanged(1)"
              >
              </SrSearch>
            </div>
            <SrTable
              @pageChanged="pageChanged"
              :data="table2.data"
              @sizeChanged="sizeChanged"
              @sortChange="sortChange"
              :config="table2.tableConfig"
              :page="table2.page"
            >
            </SrTable>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <WorkFlow
      ref="work_flow"
      :hideFrom="true"
      :buttonList="buttonList"
      :backName="backName"
    ></WorkFlow>
    <dailogRate ref="dailogRate" @pfSumbit="pfSumbit" />
    <designDailog
      ref="designDailog"
      :visible="visible"
      :title="dailogTitle"
      @SrDialogClose="SrDialogClose"
      @SrDialogSubmit="SrDialogSubmit"
      @handleClose="handleClose"
      :formData="formData"
      :type="false"
    />
  </div>
</template>

<script>
import detailsNav from "./nav.vue";
import {
  api_getDesignCompanyById,
  api_getDesignComPanyList,
  api_getAllDesignerList,
  api_saveDesignerScore,
  api_saveDesigner,
  api_delDesigner,
  api_getDesignerList,
  api_getDesignerById
} from "@/api/design/index.js";
import dailogRate from "./dailogRate.vue";
import moment from "moment";
import config from "@/settings.js";
import upload from "@/utils/upload";
import designDailog from "../components/designDailog.vue";
import WorkFlow from "../../../components/workflow";
import srtracetrack from "@/utils/srtracetrack";
import workflows from "@/utils/workflow";
import { api_userSetQuery, api_userSetSave } from "@/api/index.js";
export default {
  props: {},
  components: {
    detailsNav,
    designDailog,
    WorkFlow,
    dailogRate
  },
  provide() {
    return {
      baseUrl: config.uploadBaseUrl,
      imgBaseUrl: config.imgBaseUrl,
      uploadRequest: upload,
      uploadBaseUrl: config.uploadBaseUrl,
      srtracetrackRequest: srtracetrack,
      workflowRequest: workflows
    };
  },
  data() {
    return {
      backName: "personAudit",
      buttonList: [{}],
      visible: false,
      visible2: false,
      pageIndex: 0,

      pageState: 0,
      id: "",
      formData: {},
      dailogTitle: "新增人员",
      typeObj: {
        1: "可研",
        2: "概算"
      },
      search: {
        size: "small",
        labelConfig: {
          labelWidth: "110px",
          labelSuffix: ":",
          labelPosition: "right"
        },
        config: [
          {
            type: "text",
            placeholder: "请输入项目名称",
            bind: "projectName" // 对应this.search.data对象的field1
          },
          {
            type: "select",
            placeholder: "请选择设计类型",
            bind: "type",
            data: "typeList", // 对应enum中的stateList
            class: "plan_type"
          }
        ],
        enum: {
          // 搜索项下拉数据 1：可研 2.概算
          typeList: [
            {
              value: 1,
              label: "可研"
            },
            {
              value: 2,
              label: "概算"
            }
          ]
        },
        btns: [],
        formData: {
          projectName: "",
          type: null,
          orderByColumn: "", // 基于哪个字段排序
          orderBy: "" // DESC降序, ASC升序
        }
      },
      search2: {
        size: "small",
        labelConfig: {
          labelWidth: "90px",
          labelSuffix: ":",
          labelPosition: "right"
        },
        config: [
          {
            type: "text",
            placeholder: "请输入人员名称",
            bind: "name" // 对应this.search.data对象的field1
          }
        ],
        enum: {},
        btns: [
          {
            name: "新增人员",
            click: this.addPerson,
            type: "primary"
          }
        ],
        formData: {
          name: "",
          orderByColumn: "", // 基于哪个字段排序
          orderBy: "" // DESC降序, ASC升序
        }
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
          header: [
            { label: "项目名称", prop: "projectName", width: "200" },
            { label: "设计类型", prop: "type", cellSlot: true },
            { label: "设计人", prop: "designerName" },
            {
              label: "综合评价",
              prop: "integratedScore",
              sortable: "custom",
              width: "150"
            },
            {
              label: "专业知识评价",
              prop: "specialScore",
              sortable: "custom",
              width: "150"
            },
            {
              label: "沟通情况评价",
              prop: "communicateScore",
              sortable: "custom",
              width: "150"
            },
            {
              label: "满意度评价",
              prop: "responsivityScore",
              sortable: "custom",
              width: "150"
            },
            { label: "操作", prop: "buttonName", cellSlot: true }
          ],
          selectionConfig: {
            display: false,
            width: "70"
          },
          indexConfig: {
            display: true,
            label: "序号",
            width: "70"
          },
          operateConfig: {
            display: false,
            label: "操作",
            width: "156",
            fixed: "right",
            allTableHeader: "",
            saveHeaderList: ""
          },
          innerBtn: [
            // 表格内部操作按钮，不需要操作列的innerBtn 写成false
            {
              name: "评价",
              method: "evaluate",
              type: "text",
              size: "small",
              icon: "el-icon-document",
              className: "font-size-20"
            }
          ]
        },
        page: {
          // 分页配置
          total: 0, //总条数
          pages: 0, //总页数
          pageSize: 10, //每页展示多少个
          pageSizes: [10, 20, 30],
          pageNum: 1, //当前页
          background: true
          // layout: 'total, prev, pager, next, sizes,jumper'
        }
      },
      isTableHeaderId: "",
      table2: {
        data: [], // 表格数据
        tableConfig: {
          rowClassName: this.rowClassName,
          title: "表格的标题", // 表格标题
          highlightCurrentRow: false, // 控制表格是否单选
          // maxLength: 20, // 一行最多显示多少字，超出显示popver
          load: this.load,
          tooltipEffect: "light",
          header: [
            // { label: "人员名称", prop: "name", width: "100" },
            // { label: "联系电话", prop: "contactMobile" },
            // { label: "设计项目", prop: "designProjectNum" },
            // { label: "作品", prop: "reportNum" },
            // { label: "综合评价", prop: "integratedScore" },
            // { label: "专业知识评价", prop: "specialScore" },
            // { label: "沟通情况评价", prop: "communicateScore" },
            // { label: "满意度评价", prop: "responsivityScore" },
          ],
          selectionConfig: {
            display: false,
            width: "70"
          },
          indexConfig: {
            display: false,
            label: "序号",
            width: "70"
          },
          operateConfig: {
            display: false,
            label: "操作",
            width: "156",
            fixed: "right",
            allTableHeader: "",
            saveHeaderList: this.saveHeaderList,
            export: this.export,
            exportPermissionCode:
              this.$route.name == "companyAuditView"
                ? "M004_M006_002_002"
                : "M003_M006_002_001"
          },
          innerBtn: [
            // 表格内部操作按钮，不需要操作列的innerBtn 写成false
            {
              name: "编辑",
              method: "edit",
              type: "text",
              size: "small",
              icon: "el-icon-document",
              className: "font-size-20"
            },
            {
              name: "删除",
              method: "delete",
              type: "text",
              size: "small",
              icon: "el-icon-document",
              className: "font-size-20"
            }
          ]
        },
        page: {
          // 分页配置
          total: 0, //总条数
          pages: 0, //总页数
          pageSize: 10, //每页展示多少个
          pageSizes: [10, 20, 30],
          pageNum: 1, //当前页
          background: true
          // layout: 'total, prev, pager, next, sizes,jumper'
        }
      },
      newEditableTabs: [
        {
          title: "设计项目及评价"
        },
        {
          title: "人员信息"
        }
      ],
      activeName: "0",
      navData: {
        matterName: "我是长沙新型设计公司名称",
        type: "company",
        projectName: "创建人信息：",
        projectNo: [
          {
            name: "李晓晓"
          },
          {
            name: "大数据局"
          },
          {
            name: "2010/08/05 9:00 "
          }
        ]
      },
      headerList: [
        "联系人名称",
        "李晓思",
        "联系电话",
        "18920140024",
        "设计公司编号",
        "CS-XM-2102240003"
      ],
      contentBoxList: [
        {
          imgUrl: require("@/assets/design/design_score_1.png"),
          textTop: "综合评分",
          textDown: "Comprehensive Score",
          grade: "9.1",
          color: "#00B8FF"
        },
        {
          imgUrl: require("@/assets/design/design_score_2.png"),
          textTop: "专业知识评分",
          textDown: "Professional knowledge Score",
          grade: "8.2",
          color: "#FFAA22"
        },
        {
          imgUrl: require("@/assets/design/design_score_3.png"),
          textTop: "沟通情况评分",
          textDown: "Communication Score",
          grade: "7.2",
          color: "#52C41A"
        },
        {
          imgUrl: require("@/assets/design/design_score_4.png"),
          textTop: "响应度评分",
          textDown: "Responsiveness Score",
          grade: "9.6",
          color: "#F9455A"
        }
      ],
      imgUrl: require("@/assets/design/design_score_1.png"),
      backNameObj: {
        personAuditView: "personAudit",
        companyAuditView: "companyAudit",
        personView: "person",
        companyView: "company"
      }
    };
  },
  computed: {
    userInfo() {
      return store.getters.userInfo;
    }
  },
  mounted() {
    this.setPageState();
    if (this.$route.query.id) {
      this.id = this.$route.query.id;
      this.getDetails();
      this.getProjectTableData(1);
    }
    if (this.$route.name.includes("Audit")) {
      this.$set(this.table2.tableConfig.operateConfig, "display", true);
    } else {
      this.$set(this.table2.tableConfig.operateConfig, "display", false);
    }
    this.backName = this.backNameObj[this.$route.name];
  },
  methods: {
    rateDailog(item) {
      this.$refs.dailogRate.init(item);
    },
    export() {
      window.open(
        `${
          config.baseUrl
        }/jfzg/projectDecl/designer/export?permissionCode=M003_M006_002&access_token=${sessionStorage.getItem(
          "token"
        )}`
      );
    },
    sortChange(column) {
      if (this.pageIndex == "0") {
        if (column.order === "ascending") {
          this.search.formData["orderByColumn"] = column.prop;
          this.search.formData["orderBy"] = "ASC";
        } else if (column.order === "descending") {
          this.search.formData["orderByColumn"] = column.prop;
          this.search.formData["orderBy"] = "DESC";
        } else {
          this.search.formData["orderByColumn"] = "";
          this.search.formData["orderBy"] = "";
        }
        this.getProjectTableData();
      } else if (this.pageIndex == "1") {
        if (column.order === "ascending") {
          this.search2.formData["orderByColumn"] = column.prop;
          this.search2.formData["orderBy"] = "ASC";
        } else if (column.order === "descending") {
          this.search2.formData["orderByColumn"] = column.prop;
          this.search2.formData["orderBy"] = "DESC";
        } else {
          this.search2.formData["orderByColumn"] = "";
          this.search2.formData["orderBy"] = "";
        }
        this.getPersonTableData();
      }
    },
    //表头获取
    getTbHeader() {
      api_userSetQuery({ permissionCode: "M003_M006_002" }).then(res => {
        this.isTableHeaderId = res.data.id;
        let headerData = JSON.parse(res.data.data).sort(
          (a, b) => a.index - b.index
        );
        this.table2.tableConfig.operateConfig.allTableHeader = headerData;
        this.table2.tableConfig.header = headerData.filter(item => {
          if (
            item.prop == "integratedScore" ||
            item.prop == "specialScore" ||
            item.prop == "communicateScore" ||
            item.prop == "responsivityScore"
          ) {
            item.sortable = "custom";
            item.width = "150px";
          }
          return item.isShow;
        });
        // this.table2.tableConfig.header = headerData.filter(
        //   (item) => item.isShow
        // );
        this.getPersonTableData(1);
      });
    },
    //表头保存
    saveHeaderList(data) {
      api_userSetSave({
        data: JSON.stringify(data),
        permissionCode: "M003_M006_002",
        id: this.isTableHeaderId
      }).then(res => {
        if (res.msg.code == "0000") {
          // this.getTbData();
          this.getTbHeader();
        }
      });
    },
    handleClose() {
      this.dailogTitle = "";
      this.formData = {};
      this.visible = false;
    },
    SrDialogClose() {
      this.dailogTitle = "";
      this.formData = {};
      this.visible = false;
    },
    SrDialogSubmit(data) {
      api_saveDesigner(data).then(res => {
        if (res.msg.code == "0000") {
          this.dailogTitle = "";
          this.formData = {};
          this.getPersonTableData(1);
          this.visible = false;
        }
      });
    },
    //评分关闭
    pfClose(item) {
      this.pfForm.data = {
        integratedScore: 0,
        specialScore: 0,
        communicateScore: 0,
        responsivityScore: 0
      };
      // this.$refs[`popover`].forEach((item) => {
      //   item.doClose();
      // });
    },
    //评分提交
    pfSumbit(item) {
      let {
        integratedScore,
        specialScore,
        communicateScore,
        responsivityScore,
        id,
        designerId,
        projectId,
        projectName,
        type
      } = item;
      let params = {
        designerId,
        projectId,
        projectName,
        type,
        id,
        integratedScore: integratedScore * 2,
        specialScore: specialScore * 2,
        communicateScore: communicateScore * 2,
        responsivityScore: responsivityScore * 2
      };
      api_saveDesignerScore(params).then(res => {
        if (res.msg.code == "0000") {
          this.$refs.dailogRate.dialogVisible = false;
          this.getDetails();
          this.getProjectTableData(1);
        }
      });
    },
    //设置 title
    setPageState() {
      if (
        this.$route.name == "companyView" ||
        this.$route.name == "companyAuditView"
      ) {
        this.pageState = 1;
        this.newEditableTabs = [
          {
            title: "设计项目及评价"
          },
          {
            title: "人员信息"
          }
        ];
      } else if (
        //查看设计人员
        this.$route.name == "personView" ||
        this.$route.name == "personAuditView"
      ) {
        this.pageState = 2;

        this.newEditableTabs = [
          {
            title: "设计项目及评价"
          }
        ];
      }
    },
    //设置列表搜索
    setSearchConfig(val) {
      if (val == 0) {
        this.search.config = [
          {
            type: "text",
            placeholder: "请输入项目名称",
            bind: "companyName" // 对应this.search.data对象的field1
          },
          {
            type: "select",
            placeholder: "请选择设计类型",
            bind: "type",
            data: "typeList", // 对应enum中的stateList
            className: "plan_type"
          }
        ];
        this.search.btns = [];
      } else if (val == 1) {
        this.search.config = [
          {
            type: "text",
            placeholder: "请输入人员名称",
            bind: "name" // 对应this.search.data对象的field1
          }
        ];
        this.search.btns.push({
          name: "新增人员",
          click: this.addPerson,
          type: "primary"
        });
      }
    },
    addPerson(data) {
      this.dailogTitle = "新增人员";
      let companyData = { ...data };
      companyData.companyId = this.$route.query.id;
      companyData.companyCode = this.$route.query.companyCode;
      this.$set(this.formData, "companyData", companyData);
      this.visible = true;
    },
    //tab切换
    handleClick(value) {
      this.pageIndex = value.index;
      if (value.index == "0") {
        this.getProjectTableData(1);
      } else if (value.index == "1") {
        this.getTbHeader();
      }
    },
    //页数发生改变
    pageChanged(val) {
      //查看设计公司
      if (this.pageIndex == "0") {
        this.table.page.pageNum = val;
        this.getProjectTableData();
      } else if (this.pageIndex == "1") {
        this.table2.page.pageNum = val;
        this.getPersonTableData();
      }
    },
    sizeChanged(val) {
      //查看设计公司
      if (this.pageIndex == "0") {
        this.table.page.pageNum = 1;
        this.table.page.pageSize = val;
        this.getProjectTableData();
      } else if (this.pageIndex == "1") {
        this.table2.page.pageNum = 1;
        this.table2.page.pageSize = val;
        this.getPersonTableData();
      }
    },
    edit(data) {
      this.dailogTitle = "编辑人员";
      let companyData = { ...data };
      companyData.id = data.id;
      companyData.companyId = this.$route.query.id;
      companyData.companyCode = this.$route.query.companyCode;
      this.$set(this.formData, "companyData", companyData);
      this.visible = true;
    },
    delete(row) {
      this.$SrUtils.showConfirmMessage.call(this, {
        title: "提示",
        content: "此操作将删除此人员, 是否继续?",
        okFun: () => {
          api_delDesigner({ designerId: row.id }).then(res => {
            if (res.msg.code == "0000") {
              this.$message({
                type: "info",
                message: "删除成功"
              });
              this.getPersonTableData(1);
            }
          });
        },
        cancelFun: () => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        }
      });
    },
    getDesignerById() {
      api_getDesignerById({ id: this.id }).then(res => {
        if (res.msg.code == "0000") {
          let obj = {
            matterName: res.data.contactName,
            type: "person",
            projectName: "Tel：",
            Tel: res.data.moblie
          };
          let list = [
            "设计公司",
            res.data.companyName,
            "岗位",
            res.data.ability,
            "能力",
            res.data.station
          ];
          let list1 = [
            {
              imgUrl: require("@/assets/design/design_score_1.png"),
              textTop: "综合评分",
              textDown: "Comprehensive Score",
              grade: res.data.integratedScore,
              color: "#00B8FF"
            },
            {
              imgUrl: require("@/assets/design/design_score_2.png"),
              textTop: "专业知识评分",
              textDown: "Professional knowledge Score",
              grade: res.data.specialScore,
              color: "#FFAA22"
            },
            {
              imgUrl: require("@/assets/design/design_score_3.png"),
              textTop: "沟通情况评分",
              textDown: "Communication Score",
              grade: res.data.communicateScore,
              color: "#52C41A"
            },
            {
              imgUrl: require("@/assets/design/design_score_4.png"),
              textTop: "响应度评分",
              textDown: "Responsiveness Score",
              grade: res.data.responsivityScore,
              color: "#F9455A"
            }
          ];
          this.headerList = list;
          this.navData = obj;
          this.contentBoxList = list1;
        }
      });
    },
    getDesignCompanyById() {
      api_getDesignCompanyById({ id: this.id }).then(res => {
        if (res.msg.code == "0000") {
          let obj = {
            matterName: res.data.companyName,
            type: "company",
            projectName: "创建人信息：",
            projectNo: [
              {
                name: res.data.contactName
              },
              {
                name: res.data.deptName
              },
              {
                name: moment(res.data.createTime).format("YYYY/MM/DD")
              }
            ]
          };
          let list = [
            "联系人名称",
            res.data.contactName,
            "联系电话",
            res.data.contactMobile,
            "设计公司编号",
            res.data.companyCode
          ];
          let list1 = [
            {
              imgUrl: require("@/assets/design/design_score_1.png"),
              textTop: "综合评分",
              textDown: "Comprehensive Score",
              grade: res.data.integratedScore,
              color: "#00B8FF"
            },
            {
              imgUrl: require("@/assets/design/design_score_2.png"),
              textTop: "专业知识评分",
              textDown: "Professional knowledge Score",
              grade: res.data.specialScore,
              color: "#FFAA22"
            },
            {
              imgUrl: require("@/assets/design/design_score_3.png"),
              textTop: "沟通情况评分",
              textDown: "Communication Score",
              grade: res.data.communicateScore,
              color: "#52C41A"
            },
            {
              imgUrl: require("@/assets/design/design_score_4.png"),
              textTop: "响应度评分",
              textDown: "Responsiveness Score",
              grade: res.data.responsivityScore,
              color: "#F9455A"
            }
          ];
          this.headerList = list;
          this.navData = obj;
          this.contentBoxList = list1;
        }
      });
    },
    getDetails() {
      //查看设计公司
      if (this.pageState == 1) {
        this.getDesignCompanyById();
      } else if (
        //查看设计人员
        this.pageState == 2
      ) {
        this.getDesignerById();
      }
    },
    getProjectTableData(index) {
      if (index) {
        this.table.page.pageNum = index;
      }
      let { pageNum, pageSize } = this.table.page;
      let params = Object.assign(
        {},
        { pageNum, pageSize },
        this.search.formData
      );
      if (params.orderByColumn == "") {
        delete params.orderByColumn;
      }
      if (params.orderBy == "") {
        delete params.orderBy;
      }
      //公司设计项目列表
      if (this.pageState == 1) {
        params.companyId = this.id;
      } else if (
        //人员设计项目列表
        this.pageState == 2
      ) {
        params.id = this.id;
      }
      params.designType = +this.pageState;
      api_getDesignComPanyList(params).then(res => {
        if (res.msg.code == "0000") {
          this.table.page.total = res.data.total;
          if (this.$route.name.includes("Audit")) {
            this.table.data = res.data.records.map(item => {
              item.buttonName = "评价";
              item.visible = false;
              return item;
            });
          } else {
            this.table.tableConfig.header = [
              { label: "项目名称", prop: "projectName", width: "200" },
              { label: "设计类型", prop: "type", cellSlot: true },
              { label: "设计人", prop: "designerName" },
              {
                label: "综合评价",
                prop: "integratedScore",
                sortable: "custom"
              },
              {
                label: "专业知识评价",
                prop: "specialScore",
                sortable: "custom"
              },
              {
                label: "沟通情况评价",
                prop: "communicateScore",
                sortable: "custom"
              },
              {
                label: "满意度评价",
                prop: "responsivityScore",
                sortable: "custom"
              }
            ];
            this.search2.btns = [];

            this.table.data = res.data.records.map(item => {
              return item;
            });
          }
        }
      });
    },
    //获取所有人员
    getPersonTableData(index) {
      if (index) {
        this.table2.page.pageNum = index;
      }
      let { pageNum, pageSize } = this.table2.page;
      let params = Object.assign(
        {},
        { pageNum, pageSize },
        this.search2.formData
      );
      if (params.orderByColumn == "") {
        delete params.orderByColumn;
      }
      if (params.orderBy == "") {
        delete params.orderBy;
      }
      params.companyId = this.id;
      api_getDesignerList(params).then(res => {
        if (res.msg.code == "0000") {
          this.table2.page.total = res.data.total;
          this.table2.data = res.data.records;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.companysDetails {
  ::v-deep .el-table__fixed-right {
    height: 100% !important; //设置高优先，以覆盖内联样式
  }
  ::v-deep .tabs {
    .el-tabs__item {
      height: 30px;
      line-height: 24px;
      vertical-align: top;
      span {
        height: 24px;
        font-size: 16px;
        font-weight: 500;
        color: #333333;
        line-height: 24px;
        display: inline-block;
      }
    }
    .el-tabs__content {
      padding-bottom: 50px;
    }
  }
  ::v-deep.searchPage {
    .search-btn {
      height: 49px !important;
    }
    .plan_type {
      width: 150px !important;
    }
  }
  // ::v-deep .el-icon-setting {
  //   display: none !important;
  // }
  .nav {
    margin-bottom: 24px;
  }
  .giveMark {
    width: 100%;
    height: 120px;
    border-radius: 8px;
    border: 1px solid #efefef;
    .giveMarkHeader {
      width: 100%;
      height: 40px;
      display: flex;
      align-items: center;
      .giveMarkHeaderContent {
        height: 40px;
        font-size: 14px;
        font-weight: 400;
        color: #666666;
        // line-height: 40px;
        text-align: left;
        padding: 9px 12px;
        border: 1px solid #efefef;
        border-top: none;
        border-left: none;
        flex-grow: 1;
      }
      // .giveMarkHeaderContent:first-child {
      //   border-radius: 8px 0px 0px 0px;
      // }
      .giveMarkHeaderContent:last-child {
        border-top: none;
        border-right: none;
      }
      .giveMarkHeaderContent:nth-child(2n-1) {
        background-color: #fafafa;
      }
    }
    .content {
      width: 100%;
      height: 80px;
      align-items: center;
      padding: 0 12px;
      margin-bottom: 24px;
      display: flex;
      .contentBox {
        height: 36px;
        border-right: 1px solid #efefef;
        align-items: center;
        display: flex;
        margin-right: 49px;
        justify-content: flex-start;
        flex-grow: 1;
        img {
          width: 32px;
          height: 32px;
          margin-right: 10px;
        }
        .textBox {
          min-width: 114px;
          font-weight: 400;
          color: #666666;
          margin-right: 24px;
          .top {
            font-size: 12px;
            line-height: 17px;
          }
          .down {
            font-size: 10px !important;
            line-height: 14px;
          }
        }
        .grade {
          width: 46px;
          height: 36px;
          font-size: 36px;
          font-weight: 500;
          line-height: 36px;
        }
      }
      .contentBox:last-child {
        border-right: none;
        margin-right: 0px;
      }
    }
  }
  ::v-deep .sr_table {
    .buttonName {
      color: #1890ff;
      cursor: pointer;
    }
  }
}
</style>
<style lang="scss">
.detailsPopover {
  width: 418px;
  height: 272px;
  padding: 16px 24px !important;
  background: #ffffff;
  box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  .el-form {
    margin-bottom: 8px;
  }
  .el-rate__text {
    font-size: 18px;
  }
  .popper__arrow {
    display: none !important;
  }
  .buts {
    text-align: center;
  }
  .el-rate__decimal,
  .el-rate__icon .path2 {
    top: 2px;
  }
  .el-rate__icon {
    transform: scale(1.2);
    width: 32px;
    text-align: center;
    margin-right: 12px;
    font-size: 26px;
    &:hover {
      transform: scale(1.2);
    }
    .el-rate__decimal {
      width: 38.6% !important;
      left: 11% !important;
    }
  }
}
</style>
