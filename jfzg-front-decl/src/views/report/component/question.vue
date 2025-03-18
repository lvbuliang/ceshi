<template>
  <div class="content_qu">
    <div v-for="(item, index) in table" :key="index">
      <div class="title" v-if="isDuobiaoduan">标段{{ index + 1 }}:</div>
      <SrAdd
        class="sradd"
        :config="form.config"
        :enums="form.enums"
        :form="form.data[index]"
        :otherConfig="form.otherConfig"
        ref="add"
      >
        <template slot="existProblem">
          <SrTable
            v-if="table.length && table[index].data.length > 0"
            @pageChanged="pageChanged($event, index)"
            :data="table[index].data2"
            @sizeChanged="sizeChanged($event, index)"
            :config="table[0].tableConfig"
            :page="table[index].page"
            @selected="selected"
            ref="selectTable"
          >
            <!-- operate -->
            <template slot="operate" slot-scope="scope">
              <el-button type="text" @click="delQue(scope.scope.row, index)"
                >删除</el-button
              >
            </template>
          </SrTable>
          <div class="btns" @click="selectQue(index)">选择问题</div>
        </template>
        <template slot="addProblem">
          <SrTable
            @pageChanged="pageChanged2($event, index)"
            :data="table2[index].data2"
            @sizeChanged="sizeChanged2($event, index)"
            :config="table2[0].tableConfig"
            :page="table2[index].page"
            ref="selectTable"
          >
            <template slot="operate" slot-scope="scope">
              <el-button type="text" @click="editQue(scope.scope.row, index)"
                >编辑</el-button
              >
              <el-button type="text" @click="delQue2(scope.scope.row, index)"
                >删除</el-button
              >
            </template>
          </SrTable>
          <div class="btns" @click="addQue(index)">
            <i class="el-icon-plus"></i>
            新增
          </div>
        </template>
      </SrAdd>
    </div>
    <!-- 存在问题弹框 -->
    <el-dialog
      :visible.sync="exitQueDialog"
      width="700px"
      :close-on-click-modal="false"
      :append-to-body="true"
      :show-close="true"
      title="存在的问题"
    >
      <div class="content_box">
        <!-- <div class="content_title">存在的问题</div> -->
        <SrTable
          @pageChanged="pageChanged3"
          :data="table3.data"
          @sizeChanged="sizeChanged3"
          :config="table3.tableConfig"
          :page="table3.page"
          @selected="exitQueSelected"
          ref="selectTable1"
        >
        </SrTable>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveExitQueDialog">保 存</el-button>
        <el-button @click="exitQueDialog = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 新增问题弹框组件 -->
    <el-dialog
      :visible.sync="addQueDialog"
      width="700px"
      :close-on-click-modal="false"
      :append-to-body="true"
      :show-close="true"
      @close="addQueDialogClose"
      title="新增问题"
    >
      <div class="content_box">
        <!-- <div class="content_title">新增的问题</div> -->
        <SrAdd
          class="sradd"
          :config="form2.config"
          :enums="form2.enums"
          :form="form2.data"
          :otherConfig="form2.otherConfig"
          ref="add1"
        >
          <el-input
            v-model="form2.data.liablerName"
            placeholder="请输入内容"
            style="width: 100%"
          ></el-input>
          <template slot="liablerName">
            <div class="reportWriter">
              <div class="btn" @click="addLiablerName">
                <i class="el-icon-plus"></i>
              </div>
            </div>
          </template>

          <!-- 问题处理人 -->
          <!-- <template slot="processorName">
            <div class="reportWriter">
              <el-input
                style="width: 80%"
                v-model="form2.data.processorName"
                placeholder="请选择问题处理人"
                :disabled="true"
              ></el-input>
              <div class="btn" @click="addprocessorName">
                <i class="el-icon-plus"></i>
              </div>
            </div>
          </template> -->
        </SrAdd>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveAddQueDialog">保 存</el-button>
        <el-button @click="addQueDialog = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 问题处理人 -->
    <!-- <DialogT
      :data="dataCopy"
      :title="title"
      :dialogVisible="commonDialog"
      @close="commonDialogClose"
      @saveSelectData="commonDialogSave"
      ref="commonDialog"
    /> -->
  </div>
</template>
<script>
// 问题处理人
// import DialogT from "../component/DialogT.vue";
import config from "@/settings.js";
import upload from "@/utils/upload";
import store from "@/store";
import {
  getUserByRoleCode,
  api_getServiceTypeList,
  api_queryProblemPage,
  querySave,
  api_getReportById,
  api_saveProblem,
  api_updateInfo,
  api_deleteProblem,
  api_queryProblemDetailById,
  api_delReportById,
  api_queryAllProblemPage,
  getSonReportById
} from "@/api/report/index";
import {
  getProjectDetail,
  queryUsersByBuProperty,
} from "@/api/planProject/index";
export default {
  // 问题处理人
  // components: { DialogT },
  provide() {
    return {
      baseUrl: config.uploadBaseUrl,
      imgBaseUrl: config.imgBaseUrl,
      uploadRequest: upload,
      uploadBaseUrl: config.uploadBaseUrl,
    };
  },
  props: {
    detailData: {
      default() {
        return [{}, {}];
      },
    },
  },
  data() {
    return {
      dataCopy: [],
      title: {},
      commonDialog: false,
      // 新增周报
      form: {
        otherConfig: {
          labelNum: 90,
        },
        config: [
          {
            type: "slot",
            slotName: "existProblem",
            name: "存在的问题",
            // placeholder: "请输入下周工作计划",
            // bind: "problemId",
            col: 24,
            // required: "下周工作计划不能为空",
          },
          {
            type: "slot",
            slotName: "addProblem",
            name: "新增问题",
            // placeholder: "请输入下周工作计划",
            // bind: "problemDto",
            col: 24,
            // required: "下周工作计划不能为空",
          },
          {
            type: "upload",
            name: "附件",
            className: "fujian",
            bind: "weeklyFile",
            fileList: [],
            fileTip:
              "支持扩展名:.doc.docx.pdf.xls.xlsx.ppt.jpg.png，最多上传5个文件，每个文件大小不超过20MB",
            fileType: "doc,docx,pdf,xls,xlsx,ppt,jpg,png",
            limit: 5,
            tipPopover: true, // hover显示提示  默认外面显示
            col: 24,
          },
        ],
        data: [
          {
            systemName: "", //系统名称
            projectName: "", //项目名称
            contactJfid: "", //项目负责人jfid
            contactName: "", //项目负责人
            projectMaturity: "", //所属阶段
            reportPeriod: [], //报告周期
            season: "", //周期类别
            progress: "", //工作推进情况
            nextWorkPlan: "", //下周工作计划
            problemId: [], //存在问题
            problemDto: [], //新增问题
            weeklyFile: [], //附件
          },
        ],
        enums: {
          contactNameList: [], //项目负责人
          systemNameList: [], //系统名称
          projectNameList: [], //项目名称
          projectMaturityList: [
            {
              dataValue: "建设实施阶段",
              dataName: "建设实施阶段",
            },
            {
              dataValue: "方案编制阶段",
              dataName: "方案编制阶段",
            },
            {
              dataValue: "初步上线",
              dataName: "初步上线",
            },
            {
              dataValue: "未启动",
              dataName: "未启动",
            },
          ], //所属阶段
        },
      },
      form2: {
        otherConfig: {
          labelNum: 140,
        },
        config: [
          {
            type: "input",
            name: "问题描述",
            placeholder: "请输入问题描述",
            bind: "description",
            col: 24,
            required: "问题描述不能为空",
          },
          {
            type: "select",
            name: "问题类型",
            placeholder: "请选择问题类型",
            // bind: "problemType",
            bind: "type",
            dataList: "problemTypeList",
            trigger: "change",
            col: 12,
            required: "问题类型不能为空",
          },
          {
            type: "select",
            name: "问题等级",
            placeholder: "请选择问题等级",
            // bind: "problemLevel",
            bind: "level",
            dataList: "problemLevelList",
            trigger: "change",
            col: 12,
            required: "问题等级不能为空",
          },
          {
            type: "input",
            name: "提出人",
            placeholder: "请输入提出人",
            bind: "proposerName",
            disabled: true,
            col: 24,
            required: "提出人不能为空",
          },
          // 问题处理人
          // {
          //   type: "slot",
          //   slotName: "processorName",
          //   name: "问题处理人",
          //   placeholder: "请选择问题处理人",
          //   bind: "processorName",
          //   dataList: "processorList",
          //   col: 24,
          //   required: "提出人不能为空",
          // },
          {
            type: "input",
            name: "责任处室/部门",
            placeholder: "请输入责任处室/部门",
            bind: "departName",
            col: 12,
            // required: "责任处室/部门不能为空",
          },
          {
            type: "input",
            // slotName: "liablerName",
            name: "责任人",
            // placeholder: "请选择责任人",
            bind: "liablerName",
            // dataList: "liablerNameList",
            // trigger: "change",
            col: 12,
            // required: "责任人不能为空",
          },
        ],
        data: {
          description: "", //问题描述
          // problemType: "", //问题类型
          // problemLevel: "", //问题等级
          type: "",
          level: "",
          proposer: "", //提出人jfid
          proposerName: "", //提出人fullname
          departName: "", //部门
          liablerName: "", //责任人
          liabler: "", //责任人id
          // 问题处理人
          // processorName: "", //问题处理人
          // processor: "", //问题处理人Id
          // processorBuid: "", //问题处理人buid
          // processorRoleCode: "", //问题处理人角色
          // contractId: this.$route.query.contractId || "",
        },
        enums: {
          problemTypeList: [
            {
              dataValue: "2",
              dataName: "外部问题",
            },
            {
              dataValue: "1",
              dataName: "内部问题",
            },
            {
              dataValue: "3",
              dataName: "云网问题",
            },
          ],
          problemLevelList: [
            {
              dataValue: "2",
              dataName: "严重",
            },
            {
              dataValue: "1",
              dataName: "一般",
            },
            {
              dataValue: "0",
              dataName: "轻微",
            },
          ],
          // clientManagerList: [],

          // contractUnitFullName: [],
          // controlUnitFullName: [],
        },
      },
      table: [
        {
          data: [], // 表格数据
          data2: [], // 表格数据
          tableConfig: {
            rowClassName: this.rowClassName,
            title: "表格的标题", // 表格标题
            highlightCurrentRow: false, // 控制表格是否单选
            // maxLength: 20, // 一行最多显示多少字，超出显示popver
            // load: this.load,
            tooltipEffect: "light",
            header: [
              {
                label: "问题描述",
                prop: "description",
                isShow: true,
                index: 1,
                // width: "150px",
              },
              { label: "提出人", prop: "proposerName", isShow: true,
              width: "120px", index: 2 },
              {
                label: "提出时间",
                prop: "proposeTime",
                isShow: true,
                index: 3,
                width: "150px",
              },
              {
                label: "更新时间",
                prop: "updateTime",
                isShow: true,
                index: 4,
                width: "150px",
              },
              {
                label: "操作",
                prop: "operate",
                isShow: true,
                index: 5,
                slotName: "operate",
                width: "120px",
              },
            ],
            indexConfig: {
              display: false,
            },
            selectionConfig: {
              display: false,
              width: "40",
            },
            operateConfig: {
              display: false,
              label: "操作",
              width: "120",
              fixed: "right",
              allTableHeader: "",
              saveHeaderList: this.saveHeaderList,
              // export: this.exprotByCondition,
              exportPermissionCode: "M015_M003_M003", //导出
              hideHeaderSetting: true,
            },
            innerBtn: [
              // 表格内部操作按钮，不需要操作列的innerBtn 写成false
              {
                name: "删除", // 按钮名称，优先显示icon
                type: "text",
                size: "small",
                method: "delQue", // 点击执行该页面methods中对应的方法
                icon: "iconbianji", // 按钮显示的图标,不传显示中文
              },
            ],
          },
          page: {
            // 分页配置
            total: 0, //总条数
            minSize: 5,
            pages: 10, //总页数
            pageSize: 5, //每页展示多少个
            pageSizes: [5, 10, 15],
            pageNum: 1, //当前页
            background: true,
            layout: "total, prev, pager, next, sizes,jumper",
          },
        },
      ],
      table2: [
        {
          data: [], // 表格数据
          data2: [], // 表格数据
          tableConfig: {
            rowClassName: this.rowClassName,
            title: "表格的标题", // 表格标题
            highlightCurrentRow: false, // 控制表格是否单选
            // maxLength: 20, // 一行最多显示多少字，超出显示popver
            // load: this.load,
            tooltipEffect: "light",
            header: [
              {
                label: "问题描述",
                prop: "description",
                isShow: true,
                index: 1,
                // width: "150px",
              },
              { label: "提出人", prop: "proposerName", isShow: true,
              width: "120px", index: 2 },
              {
                label: "提出时间",
                prop: "proposeTime",
                isShow: true,
                index: 3,
                width: "150px",
              },
              {
                label: "更新时间",
                prop: "updateTime",
                isShow: true,
                index: 4,
                width: "150px",
              },
              {
                label: "操作",
                prop: "operate",
                isShow: true,
                index: 5,
                slotName: "operate",
                width: "120px",
              },
            ],
            indexConfig: {
              display: false,
            },
            selectionConfig: {
              display: false,
              width: "40",
            },
            operateConfig: {
              display: false,
              label: "操作",
              width: "120",
              fixed: "right",
              allTableHeader: "",
              saveHeaderList: this.saveHeaderList,
              // export: this.exprotByCondition,
              exportPermissionCode: "M015_M003_M003", //导出
              hideHeaderSetting: true,
            },
            innerBtn: [
              {
                name: "编辑", // 按钮名称，优先显示icon
                type: "text",
                size: "small",
                method: "editQue", // 点击执行该页面methods中对应的方法
                icon: "iconbianji", // 按钮显示的图标,不传显示中文
              },
              {
                name: "删除", // 按钮名称，优先显示icon
                type: "text",
                size: "small",
                method: "delQue2", // 点击执行该页面methods中对应的方法
                icon: "iconbianji", // 按钮显示的图标,不传显示中文
              },
            ],
          },
          page: {
            // 分页配置
            total: 0, //总条数
            minSize: 5,
            pages: 10, //总页数
            pageSize: 5, //每页展示多少个
            pageSizes: [5, 10, 15],
            pageNum: 1, //当前页
            background: true,
            layout: "total, prev, pager, next, sizes,jumper",
          },
        },
      ],
      table3: {
        data: [], // 表格数据
        tableConfig: {
          rowClassName: this.rowClassName,
          title: "表格的标题", // 表格标题
          highlightCurrentRow: false, // 控制表格是否单选
          // maxLength: 20, // 一行最多显示多少字，超出显示popver
          // load: this.load,
          tooltipEffect: "light",
          header: [
            {
              label: "问题描述",
              prop: "description",
              isShow: true,
              index: 1,
              // width: "150px",
            },
            { label: "提出人", prop: "proposerName", isShow: true,
            width: "120px", index: 2 },
            {
              label: "提出时间",
              prop: "proposeTime",
              isShow: true,
              index: 3,
              width: "150px",
            },
            {
              label: "更新时间",
              prop: "updateTime",
              isShow: true,
              index: 4,
              width: "150px",
            },
          ],
          indexConfig: {
            display: false,
          },
          selectionConfig: {
            display: true,
            width: "40",
          },
          operateConfig: {
            display: false,
            label: "操作",
            width: "120",
            fixed: "right",
            allTableHeader: "",
            saveHeaderList: this.saveHeaderList,
            // export: this.exprotByCondition,
            exportPermissionCode: "M015_M003_M003", //导出
            hideHeaderSetting: true,
          },
          innerBtn: [
            {
              name: "编辑", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "editQue", // 点击执行该页面methods中对应的方法
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
            },
            {
              name: "删除", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "delQue2", // 点击执行该页面methods中对应的方法
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
            },
          ],
        },
        page: {
          // 分页配置
          total: 0, //总条数
          minSize: 5,
          pages: 10, //总页数
          pageSize: 5, //每页展示多少个
          pageSizes: [5, 10, 15],
          pageNum: 1, //当前页
          background: true,
          layout: "total, prev, pager, next, sizes,jumper",
        },
      },
      exitQueDialog: false,
      exitQueProjectList: [],
      addQueDialog: false,
      userInfo: store.getters.userInfo,
      problemIds: [], //获取新增问题的id
      selectQsIndex: 0,
      addQsIndex: 0,
      tableCopy: {},
      tableCopy2: {},
    };
  },
  watch: {
    detailData: {
      handler(v) {
        console.log("detailData", v);
        let tableCopy = JSON.parse(JSON.stringify(this.table[0]));
        let tableCopy2 = JSON.parse(JSON.stringify(this.table2[0]));
        if (v.length > 0) {
          for (let i = 1; i < v.length; i++) {
            this.table.push(tableCopy);
            this.table2.push(tableCopy2);
          }
          v.forEach((item, index) => {
            console.log(item, index, this.table, this.table2);
            this.table[index].data = item.problemDto;

            this.table2[index].data = item.alreadyExistProblemDto;
          });
          console.log("detailData", this.table, this.table2);
        }
      },
    },
  },
  computed: {
    projectId() {
      return this.$route.query.projectId;
    },
    id() {
      return this.$route.query.id;
    },
    isDuobiaoduan() {
      return this.parseBoolean(this.$route.query.isDuobiaoduan);
    },
    contractId() {
      return this.$route ? this.$route.query.contractId : "";
    }, 
  },
  created() {
    this.tableCopy = JSON.parse(JSON.stringify(this.table[0]));
    this.tableCopy2 = JSON.parse(JSON.stringify(this.table2[0]));
    if (this.contractId) {
      this.getSon(this.$route.query.id)
    } else {
      // 详情
      this.getReportById(this.$route.query.id);
    }
    // this.getReportById(this.$route.query.id);
    // 获取存在问题列表
    this.getExitQueList();
  },
  methods: {
    // 问题处理人
    // addprocessorName() {
    //   this.title = { label: "问题处理人", value: "2" };
    //   this.commonDialog = true;
    // },
    // commonDialogClose() {
    //   this.commonDialog = false;
    // },
    // commonDialogSave(select, val) {
    //   console.log(select, val);
    //   if (val == 2) {
    //     // 责任人
    //     this.form2.data.processor = select[0].data[0].jfid;
    //     this.form2.data.processorName = select[0].data[0].fullname;
    //     this.form2.data.processorBuid = select[0].data[0].buid;
    //     this.form2.data.processorRoleCode = select[0].data[0].roleCode;
    //   }
    //   console.log(this.form2.data, this.$refs.commonDialog);
    //   this.$refs.commonDialog.selectdata = [];
    //   // this.$refs.commonDialog.data = [];
    //   this.$refs.commonDialog.radio = "";
    //   this.commonDialog = false;
    // },
    parseBoolean(value) {
      return value === "true" || value === true;
    },
    //页数发生改变
    pageChanged(val, index) {
      this.table[index].page.pageNum = val;
      let start = (val - 1) * this.table[index].page.pageSize;
      let end = val * this.table[index].page.pageSize;
      this.table[index].data2 = this.table[index].data.slice(start, end);
    },
    sizeChanged(val, index) {
      this.table[index].page.pageNum = 1;
      this.table[index].page.pageSize = val;
      this.table[index].data2 = this.table[index].data.slice(0, val);
    },
    pageChanged2(val, index) {
      console.log(val, index);
      this.table2[index].page.pageNum = val;
      this.queryAllProblemPage();
      let start = (val - 1) * this.table2[index].page.pageSize;
      let end = val * this.table2[index].page.pageSize;
      this.table2[index].data2 = this.table2[index].data.slice(start, end);
      // console.log(start, end, this.table2.data2, this.table2.data);
    },
    sizeChanged2(val, index) {
      this.table2[index].page.pageNum = 1;
      this.table2[index].page.pageSize = val;
      this.table2[index].data2 = this.table2[index].data.slice(0, val);
      this.queryAllProblemPage();
    },
    pageChanged3(val) {
      this.table3.page.pageNum = val;
      this.getExitQueList();
    },
    sizeChanged3(val) {
      this.table3.page.pageNum = 1;
      this.table3.page.pageSize = val;
      this.getExitQueList();
    },
    // 获取存在问题列表
    getExitQueList(isDraft = 1, problemIds = []) {
      api_queryProblemPage({
        pageNu: isDraft ? this.table3.page.pageNum : 1,
        pageSize: isDraft ? this.table3.page.pageSize : 5,
        projectId: this.projectId,
        problemIds: problemIds,
        isDraft: isDraft,
      }).then((res) => {
        if (res.data) {
          console.log(res.data, "23232");
          if (res.data.records.length > 0) {
            // 存在问题表格弹框
            this.table3.data = res.data.records;
            this.table3.page.total = res.data.total;
          }
          console.log(this.problemIds);
        } else {
          // 新增问题表格
          this.table2[0].data.push(...res.data.records);
          this.table2[0].page.total = this.table2[0].data.length;
          this.problemIds = this.table2[0].data.map((item) => item.id);
        }
      });
    },
    // 获取新增问题列表
    queryAllProblemPage(problemIds = []) {
      let i = this.addQsIndex;
      api_queryAllProblemPage({
        pageNu: this.table2[i].page.pageNum,
        pageSize: this.table2[i].page.pageSize,
        projectId: this.projectId,
        problemIds: problemIds,
      }).then((res) => {
        if (res.msg.code == "0000") {
          console.log(res.data, "12323232323");
          this.table2[i].data = res.data;
          this.table2[i].page.total = this.table2[i].data.length;
          this.problemIds = this.table2[i].data.map((item) => item.id);
          this.table2[i].data2 = this.table2[i].data.slice(0, 5);
          console.log(
            this.problemIds,
            this.table2[i].data,
            this.table2[i].page.total
          );
        }
      });
    },
    getSon(id) {
      getSonReportById({ id }).then((res) => {
        console.log("详情id", res);
        if (res.data) {
          for (let i = 1; i < res.data.length; i++) {
            this.table.push(JSON.parse(JSON.stringify(this.tableCopy)));
            this.table2.push(JSON.parse(JSON.stringify(this.tableCopy2)));
            this.form.data.push({
              weeklyFile: "",
            });
          }

          res.data.forEach((item, index) => {
            console.log(item, index, this.table, this.table2);
            this.table2[index] != null
              ? (this.table2[index].data = JSON.parse(
                  JSON.stringify(item.problemDto ? item.problemDto : [])
                ))
              : [];

            this.table[index] != null
              ? (this.table[index].data = JSON.parse(
                  JSON.stringify(
                    item.alreadyExistProblemDto
                      ? item.alreadyExistProblemDto
                      : []
                  )
                ))
              : [];
            // 新增问题
            if (this.table2[index]) {
              this.table2[index].page.total = this.table2[index].data.length;
              this.problemIds = this.table2[index].data.map((item) => item.id);
              this.table2[index].data2 = this.table2[index].data.slice(0, 5);
            }
            // 存在问题
            if (this.table[index]) {
              this.table[index].page.total = this.table[index].data.length;
              this.table[index].data2 = this.table[index].data.slice(0, 5);
            }
            console.log(this.table2);
            // 附件
            this.form.data[index].weeklyFile = item.weeklyFile
              ? JSON.parse(item.weeklyFile)
              : [];
          });
        }
      });
    },
    // 获取详情
    getReportById(id) {
      api_getReportById({ id }).then((res) => {
        console.log("详情id", res);
        if (res.data) {
          for (let i = 1; i < res.data.length; i++) {
            this.table.push(JSON.parse(JSON.stringify(this.tableCopy)));
            this.table2.push(JSON.parse(JSON.stringify(this.tableCopy2)));
            this.form.data.push({
              weeklyFile: "",
            });
          }

          res.data.forEach((item, index) => {
            console.log(item, index, this.table, this.table2);
            this.table2[index] != null
              ? (this.table2[index].data = JSON.parse(
                  JSON.stringify(item.problemDto ? item.problemDto : [])
                ))
              : [];

            this.table[index] != null
              ? (this.table[index].data = JSON.parse(
                  JSON.stringify(
                    item.alreadyExistProblemDto
                      ? item.alreadyExistProblemDto
                      : []
                  )
                ))
              : [];
            // 新增问题
            if (this.table2[index]) {
              this.table2[index].page.total = this.table2[index].data.length;
              this.problemIds = this.table2[index].data.map((item) => item.id);
              this.table2[index].data2 = this.table2[index].data.slice(0, 5);
            }
            // 存在问题
            if (this.table[index]) {
              this.table[index].page.total = this.table[index].data.length;
              this.table[index].data2 = this.table[index].data.slice(0, 5);
            }
            console.log(this.table2);
            // 附件
            this.form.data[index].weeklyFile = item.weeklyFile
              ? JSON.parse(item.weeklyFile)
              : [];
          });
        }
      });
    },
    /**---------------问题------------------- */
    //存在问题--- 选择问题
    selectQue(index) {
      this.exitQueDialog = true;
      this.selectQsIndex = index;
      console.log("点击选择问题", this.exitQueDialog);
    },
    // 存在问题选择监听
    exitQueSelected(projectList) {
      console.log("选择的存在问题", projectList);
      this.exitQueProjectList = projectList;
    },
    //存在问题--- 删除
    delQue(row, i) {
      console.log("......", row, i, this.table[i], this.table);
      this.$SrUtils.showConfirmMessage.call(this, {
        title: "提示",
        content: "此操作将删除此数据, 是否继续?",
        okFun: () => {
          let index = this.table[i].data.findIndex(
            (item) => item.id === row.id
          );
          console.log(index);
          let start =
            (this.table[i].page.pageNum - 1) * this.table[i].page.pageSize;
          let end = this.table[i].page.pageNum * this.table[i].page.pageSize;
          this.table[i].data.splice(index, 1);
          this.table[i].page.total = this.table[i].data.length;
          if (this.table[i].data2.length == 1) {
            this.table[i].data2 = this.table[i].data.slice(
              start - this.table[i].page.pageSize,
              end - this.table[i].page.pageSize
            );
          } else {
            this.table[i].data2 = this.table[i].data.slice(start, end);
          }
          this.$message({
            type: "success",
            message: "已删除",
          });
          console.log(
            this.table[i].data2,
            this.table[i].data,
            this.table,
            start,
            end
          );
          // this.table.data2.splice(index, 1);
        },
        cancelFun: () => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        },
      });
    },

    // 存在问题--确定
    saveExitQueDialog() {
      let i = this.selectQsIndex;
      if (this.exitQueProjectList.length == 0) {
        this.$message.warning("请选择数据");
      }
      this.exitQueProjectList = this.exitQueProjectList.filter(
        (item2) => !this.table[i].data.some((item) => item.id === item2.id)
      );
      this.table[i].data.push(...this.exitQueProjectList);
      this.table[i].data2 = this.table[i].data.slice(0, 5);
      this.table[i].page.total = this.table[i].data.length;
      this.exitQueDialog = false;
      this.$refs.selectTable1.$children[0].clearSelection();
    },
    //新增问题-- 新增
    addQue(index) {
      this.$set(this.form2.data, "proposer", this.userInfo.jfid);
      this.$set(this.form2.data, "proposerName", this.userInfo.fullname);
      this.addQueDialog = true;
      this.addQsIndex = index;
      console.log(this.addQueDialog, "this.addQueDialog");
    },
    //新增问题-- 编辑
    editQue(row) {
      console.log(row);
      this.addQueDialog = true;
      this.queryProblemDetailById(row.id);
    },
    // 查询问题详情
    queryProblemDetailById(id) {
      api_queryProblemDetailById({ id }).then((res) => {
        if (res.data) {
          this.form2.data = res.data;
        }
      });
    },
    //新增问题-- 删除
    delQue2(row, i) {
      console.log(row);
      this.$SrUtils.showConfirmMessage.call(this, {
        title: "提示",
        content: "此操作将删除此数据, 是否继续?",
        okFun: () => {
          api_deleteProblem({ id: row.id }).then((res) => {
            if (res.msg.code == "0000") {
              const filteredArray = this.problemIds.filter(
                (item) => item !== row.id
              );
              this.queryAllProblemPage(filteredArray);
              if (this.table2[i].data.length == 1) {
                this.table2[i].page.pageNum = this.table2[i].page.pageNum - 1;
              }
              this.$message({
                type: "success",
                message: "已删除",
              });
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
    saveAddQueDialog() {
      let data = this.$refs["add1"].validate();
      this.$refs["add1"].validate((valid) => {
        if (valid) {
          let params = {
            ...data,
          };
          if (!params.id) {
            params.isDraft = 0;
          }
          params.projectId = this.projectId;
          params.contactName = this.form.data.contactName;
          params.contactJfid = this.form.data.contactJfid;
          params.systemName = this.form.data.systemName;
          params.projectName = this.form.data.projectName;
          // 问题处理人
          // params.contractId = this.$route.query.contractId;
          
          // params.console.log(params);
          // return;
          if (params.id) {
            api_updateInfo(params).then((res) => {
              if (res.msg.code == "0000") {
                this.$message.success("保存成功");
                // this.problemIds.push(params.id);
                this.queryAllProblemPage(this.problemIds);
                this.addQueDialog = false;
              }
            });
          } else {
            api_saveProblem(params).then((res) => {
              if (res.data) {
                this.$message.success("保存成功");
                this.problemIds.push(res.data);
                this.queryAllProblemPage(this.problemIds);
                this.addQueDialog = false;
              }
            });
          }
        }
      });
    },
    addQueDialogClose() {
      console.log("关闭前的回调");
      this.form2.data = Object.assign(
        {},
        {
          description: "", //问题描述
          // problemType: "", //问题类型
          // problemLevel: "", //问题等级
          type: "",
          level: "",
          proposer: "", //提出人jfid
          proposerName: "", //提出人fullname
        }
      );
      console.log(this.$refs["add1"]);
      this.$nextTick(() => {
        this.$refs["add1"].$children[0].clearValidate();
      });
      // console.log(this.$refs["add1"].$children[0].clearValidate())
      // this.$refs["add1"].clearValidateItem({ bind: "level" });
    },
  },
};
</script>
<style lang="scss" scoped>
.title {
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0px;
  line-height: 22px;
  color: rgba(29, 33, 41, 1);
  font-family: PingFangSC-Medium, PingFang SC;
  margin: 20px 0;
}
.btns {
  width: 80px;
  text-align: center;
  height: 34px;
  font-size: 12px;
  line-height: 34px;
  border-radius: 4px;
  color: rgba(66, 130, 255, 1);
  background: rgba(66, 130, 255, 0.1);
  cursor: pointer;
  border: 1px dashed rgba(66, 130, 255, 1);
}
::v-deep .sr_table {
  margin-bottom: 16px;
}
.btn {
  margin-left: 5px;
  width: 30px;
  height: 30px;
  opacity: 1;
  color: rgba(66, 130, 255, 1);
  border-radius: 50%;
  text-align: center;
  line-height: 30px;
  cursor: pointer;
  border: 1px dashed rgba(66, 130, 255, 1);
}
</style>
