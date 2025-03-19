<template>
  <div class="common-card">
    <div class="searchPage">
      <!-- 搜索 -->
      <SearchList
        ref="searchList"
        @search="listSearch"
        @refresh="listRefresh"
      ></SearchList>
    </div>
    <div class="table-box" :style="{ height: boxHeight + 'px' }">
      <!-- 合同 -->
      <div class="item">
        <div class="elBtn">
          <div class="title">
            <div class="border"></div>
            <span>服务列表</span>
          </div>
          <div class="btns">
            <el-button
              v-if="
                ['XMFZR', 'FZGHC_JBRBF', 'DSZ', 'ZJL', 'F_ZJL'].includes(
                  this.roleCode
                )
              "
              size="small"
              @click="exportContract"
              >导出</el-button
            >
            <el-button
              v-if="
                ['FZGHC_JBRBF'].includes(this.roleCode) ||
                (userInfo.jfid == 5516 && this.roleCode == 'XMFZR')
              "
              type="primary"
              size="small"
              @click="addContract"
              >新增</el-button
            >
          </div>
        </div>
        <SrTable
          @pageChanged="pageChanged"
          :data="table.data"
          @sizeChanged="sizeChanged"
          :config="table.tableConfig"
          :page="table.page"
          @sortChange="sortChange"
          @selected="selected"
          @clickRow="clickRowContract"
        >
          <template slot="serviceName" slot-scope="scope">
            <el-tooltip
              :content="scope.scope.row.serviceName"
              placement="top-start"
              effect="light"
            >
              <div class="table_unitName">
                {{ scope.scope.row.serviceName }}
              </div>
            </el-tooltip>
          </template>
          <template slot="frameworkContract" slot-scope="scope">
            <el-tooltip
              :content="scope.scope.row.frameworkContract"
              placement="top-start"
              effect="light"
            >
              <div class="table_unitName">
                {{ scope.scope.row.frameworkContract }}
              </div>
            </el-tooltip>
          </template>
          <template slot="winningBidder" slot-scope="scope">
            <el-tooltip
              :content="scope.scope.row.winningBidder"
              placement="top-start"
              effect="light"
            >
              <div class="table_unitName">
                {{ scope.scope.row.winningBidder }}
              </div>
            </el-tooltip>
          </template>
          <template slot="serviceType" slot-scope="scope">
            <div class="table_unitName">
              {{ setServiceType(scope.scope.row.serviceType) }}
            </div>
          </template>
        </SrTable>
      </div>
      <!-- 订单 -->
      <div class="item">
        <div class="elBtn" style="margin-top: 0">
          <div class="title">
            <div class="border"></div>
            <span>订单列表</span>
          </div>
          <div class="btns">
            <!-- <el-button
              type="primary"
              size="small"
              @click="
                () => {
                  orderDialogVisible = true;
                }
              "
              >导入</el-button
            > -->
          </div>
        </div>
        <SrTable
          @pageChanged="orderPageChanged"
          :data="orderTable.data"
          @sizeChanged="orderSizeChanged"
          :config="orderTable.tableConfig"
          :page="orderTable.page"
          @sortChange="sortChange"
          @selected="selectedOrder"
          class="sr_table2"
        >
          <template slot="orderName" slot-scope="scope">
            <el-tooltip
              :content="scope.scope.row.orderName"
              placement="top-start"
              effect="light"
            >
              <div class="table_unitName1">
                {{ scope.scope.row.orderName }}
              </div>
            </el-tooltip>
          </template>
          <template slot="winningBidder" slot-scope="scope">
            <el-tooltip
              :content="scope.scope.row.winningBidder"
              placement="top-start"
              effect="light"
            >
              <div class="table_unitName">
                {{ scope.scope.row.winningBidder }}
              </div>
            </el-tooltip>
          </template>
          <template slot="serviceType" slot-scope="scope">
            <div class="table_unitName">
              {{ setServiceType(scope.scope.row.serviceType) }}
            </div>
          </template>
          <template slot="projectName" slot-scope="scope">
            <el-tooltip
              :content="scope.scope.row.projectName"
              placement="top-start"
              effect="light"
            >
              <div class="table_unitName1">
                {{ scope.scope.row.projectName }}
              </div>
            </el-tooltip>
          </template>
          <template slot="contactId" slot-scope="scope">
            <template v-if="scope.scope.item.prop == 'contactId'">
              <div v-if="scope.scope.row.contactId">
                {{ setContactName(scope.scope.row.contactId) }}
              </div>
              <div v-else>-</div>
            </template>
          </template>
          <template slot="signingTime" slot-scope="scope">
            <template v-if="scope.scope.item.prop == 'signingTime'">
              <div class="cellSlotbox" v-if="scope.scope.row.signingTime">
                {{ changeTime(scope.scope.row.signingTime) }}
              </div>
              <div v-else>-</div>
            </template>
          </template>
        </SrTable>
      </div>
    </div>
    <!-- 导入 -->
    <el-dialog
      :visible.sync="orderDialogVisible"
      width="650px"
      center
      class="elDialog"
    >
      <div slot="title">服务名称:&nbsp;{{ serviceName }}&emsp;&emsp;导入</div>
      <el-form ref="uploadFormref" :model="uploadForm" class="demo-form-inline">
        <el-form-item prop="sourceValue">
          <el-upload
            class="upload-demo"
            action="string"
            :http-request="uploadFile"
            :show-file-list="true"
            :before-upload="beforeAvatarUpload"
            ref="upfile"
          >
            <div style="display: flex; align-items: center">
              <div style="font-size: 14px">文件导入:</div>
              <div class="button">点击上传</div>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <div class="link-box">
          <el-button type="text" @click="downloadExcel"
            >关联订单信息模版下载&nbsp;<i class="el-icon-download"></i
          ></el-button>
        </div>
        <div class="btn-box">
          <el-button
            @click="
              () => {
                orderDialogVisible = false;
                this.$refs.upfile.clearFiles();
              }
            "
            >取 消</el-button
          >
          <el-button type="primary" @click="upRefalsh('uploadFormref')"
            >下一步</el-button
          >
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import store from "@/store";
import config from "@/settings.js";
import upload from "@/utils/upload";
import SearchList from "@/views/orderManagement/component/searchList.vue";
import { api_userSetQuery, api_userSetSave } from "@/api/index.js";
import {
  api_contractSearchLise,
  api_orderSearchLise,
  api_deleteService,
  api_importOrder,
  api_exportContract,
  api_searchRoleCode,
  api_deleteOrderService,
} from "@/api/orderManagement/index.js";
export default {
  components: { SearchList },
  provide() {
    return {
      baseUrl: config.baseUrl,
      imgBaseUrl: config.imgBaseUrl,
      uploadRequest: upload,
      uploadBaseUrl: config.uploadBaseUrl,
      uploadFileUrl: config.uploadFileUrl,
      previewUrl: config.previewUrl,
    };
  },
  data() {
    return {
      userInfo: store.getters.userInfo,
      roleCode: store.getters.userInfo.currentRole.roleCode,
      boxHeight: "600",
      // 合同数据
      table: {
        data: [], // 表格数据
        tableConfig: {
          rowClassName: this.rowClassName,
          title: "表格的标题", // 表格标题
          highlightCurrentRow: true,
          load: this.load,
          tooltipEffect: "light",
          header: [],
          selectionConfig: {
            display: true,
            width: "40",
          },
          operateConfig: {
            display: true,
            label: "操作",
            width: "190",
            fixed: "right",
            allTableHeader: "",
            saveHeaderList: this.saveHeaderList,
          },
          innerBtn: [
            // 表格内部操作按钮，不需要操作列的innerBtn 写成false
            {
              name: "新增订单", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "addOrder", // 点击执行该页面methods中对应的方法
              // field: "id", // 控制按钮显示隐藏的字段，目前仅支持单一字段，常显的按钮不需要传
              // value: [1, 2], // 需要根据字段控制按钮显示隐藏，当state值不等于该数组的任何一个值的时候显示。逻辑this.table.data的某条数据state!=1&&state!=2时显示该行的这个按钮
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
              code: "M010_010_011",
              validate: this.btnValidate,
            },
            {
              name: "编辑",
              method: "editContract",
              type: "text",
              size: "medium",
              icon: "el-icon-document",
              className: "font-size-20",
              validate: this.btnValidate, //自定义判断是否展示按钮权限
            },
            {
              name: "查看", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "see", // 点击执行该页面methods中对应的方法
              // field: "id", // 控制按钮显示隐藏的字段，目前仅支持单一字段，常显的按钮不需要传
              // value: [1, 2], // 需要根据字段控制按钮显示隐藏，当state值不等于该数组的任何一个值的时候显示。逻辑this.table.data的某条数据state!=1&&state!=2时显示该行的这个按钮
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
              code: "M010_010_011",
              validate: this.btnValidate,
            },
            {
              name: "删除", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "deleteService", // 点击执行该页面methods中对应的方法
              // field: "id", // 控制按钮显示隐藏的字段，目前仅支持单一字段，常显的按钮不需要传
              // value: [1, 2], // 需要根据字段控制按钮显示隐藏，当state值不等于该数组的任何一个值的时候显示。逻辑this.table.data的某条数据state!=1&&state!=2时显示该行的这个按钮
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
              code: "M010_010_011",
              validate: this.btnValidate,
            },
          ],
        },
        page: {
          // 分页配置
          total: 0, //总条数
          pages: 0, //总页数
          pageSize: 5, //每页展示多少个
          minSize: 5,
          pageSizes: [5, 10, 20, 50],
          pageNum: 1, //当前页
          background: true,
          // layout: 'total, prev, pager, next, sizes,jumper'
        },
      },
      // 订单
      orderTable: {
        data: [], // 表格数据
        tableConfig: {
          rowClassName: this.rowClassName,
          title: "表格的标题", // 表格标题
          highlightCurrentRow: false, // 控制表格是否单选
          load: this.load,
          tooltipEffect: "light",
          header: [],
          selectionConfig: {
            display: false,
            width: "40",
          },
          operateConfig: {
            display: true,
            label: "操作",
            width: "160",
            fixed: "right",
            allTableHeader: "",
            saveHeaderList: this.saveHeaderList2,
          },
          innerBtn: [
            // 表格内部操作按钮，不需要操作列的innerBtn 写成false
            {
              name: "编辑",
              method: "editOrder",
              type: "text",
              size: "medium",
              icon: "el-icon-document",
              className: "font-size-20",
              validate: this.btnValidate2, //自定义判断是否展示按钮权限
            },
            {
              name: "查看", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "seeOrder", // 点击执行该页面methods中对应的方法
              // field: "id", // 控制按钮显示隐藏的字段，目前仅支持单一字段，常显的按钮不需要传
              // value: [1, 2], // 需要根据字段控制按钮显示隐藏，当state值不等于该数组的任何一个值的时候显示。逻辑this.table.data的某条数据state!=1&&state!=2时显示该行的这个按钮
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
              code: "M010_010_011",
              validate: this.btnValidate2,
            },
            {
              name: "删除", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "deleOrder", // 点击执行该页面methods中对应的方法
              // field: "id", // 控制按钮显示隐藏的字段，目前仅支持单一字段，常显的按钮不需要传
              // value: [1, 2], // 需要根据字段控制按钮显示隐藏，当state值不等于该数组的任何一个值的时候显示。逻辑this.table.data的某条数据state!=1&&state!=2时显示该行的这个按钮
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
              code: "M010_010_011",
              validate: this.btnValidate2,
            },
          ],
        },
        page: {
          // 分页配置
          total: 0, //总条数
          pages: 0, //总页数
          pageSize: 5, //每页展示多少个
          minSize: 5,
          pageSizes: [5, 10, 20, 50],
          pageNum: 1, //当前页
          background: true,
          // layout: 'total, prev, pager, next, sizes,jumper'
        },
      },
      isTableHeaderId: "",
      isOrderTableHeaderId: "",
      exportContractId: [],
      searchParam: {},
      // 获取查询订单Id
      searchOrderId: null,
      // serviceName: "",
      // 导入
      orderDialogVisible: false,
      // 上传文件
      uploadForm: {
        sourceValue: "",
      },
      formData: null,
      // 新增服务合同
      clickNewContract: {
        serviceType: "",
        serviceName: "",
        createTime: "",
      },
      XMFZRList: [],
      // 多选新增
      addSelectList: [],
    };
  },
  created() {
    this.getTbHeader();
    this.getContact();
    this.searchOrderId = null;
  },
  mounted() {
    this.$nextTick(() => {
      this.getWorkflowHeight();
    });
    this.getTbData();
  },
  activated() {
    this.getTbHeader();
    // 缓存;
    this.getTbData(this.searchOrderId);
  },

  methods: {
    setServiceType(val) {
      const serviceTypeMap = {
        1: "等保",
        2: "密评",
        3: "其他",
        4: "监理",
        5: "三方测评",
      };
      return serviceTypeMap[val] || "-";
    },
    getContact() {
      let params = {
        roleCode: "XMFZR",
      };
      api_searchRoleCode(params).then((res) => {
        res.data.map((element) => {
          if (element.fullname) {
            this.XMFZRList.push({
              label: String(element.fullname),
              value: String(element.jfid),
            });
          }
        });
      });
    },
    setContactName(val) {
      for (var i = 0; i < this.XMFZRList.length; i++) {
        if (this.XMFZRList[i].value == val) {
          return this.XMFZRList[i].label;
        }
      }
    },

    changeTime(time) {
      var date = new Date(time);
      var seperator1 = "-";

      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();

      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate;
      return currentdate;
    },
    btnValidate(row, item) {
      const roleCode = this.roleCode;
      const userInfo = this.userInfo;

      const permissions = {
        新增订单: (role) => ["XMFZR", "FZGHC_JBRBF"].includes(role),
        编辑: (role) =>
          ["XMFZR", "FZGHC_JBRBF"].includes(role) &&
          item.creatorJfid === userInfo.jfid,
        删除: (role) =>
          ["XMFZR", "FZGHC_JBRBF"].includes(role) &&
          item.creatorJfid === userInfo.jfid,
        查看: (role) =>
          ["XMFZR", "FZGHC_JBRBF", "DSZ", "ZJL", "F_ZJL","XMGLB"].includes(role),
      };

      const operation = row.name;

      if (permissions[operation]) {
        return permissions[operation](roleCode);
      }

      return false;
    },
    btnValidate2(row, item) {
      if (row.name == "编辑") {
        if (this.roleCode == "XMFZR") {
          if (Number(item.contactId) == Number(this.userInfo.jfid)) {
            return true;
          }
        }
        if (this.roleCode == "FZGHC_JBRBF") {
          return true;
        }
      }
      if (row.name == "查看") {
        if (
          ["XMFZR", "FZGHC_JBRBF", "DSZ", "ZJL", "F_ZJL",'XMGLB'].includes(
            this.roleCode
          )
        ) {
          return true;
        }
      }
      if (row.name == "删除") {
        if (["FZGHC_JBRBF"].includes(this.roleCode)) {
          return true;
        }
      }
    },
    getWorkflowHeight() {
      let workflowHeight = 0;
      let container = document.querySelector(".workflow");
      if (container) {
        workflowHeight = "";
      }
      workflowHeight += 127;
      this.boxHeight =
        window.innerHeight -
        document.querySelector(".the-nav").offsetHeight -
        workflowHeight;
    },
    getTbHeader() {
      api_userSetQuery({ permissionCode: "M005_027" }).then((res) => {
        this.isTableHeaderId = res.data.id;
        let headerData = JSON.parse(res.data.data).sort(
          (a, b) => a.index - b.index
        );

        this.table.tableConfig.operateConfig.allTableHeader = headerData;
        this.table.tableConfig.header = headerData.filter((item) => {
          //
          if (["serviceName"].includes(item.prop)) {
            item.slotName = "serviceName";
          }
          if (["frameworkContract"].includes(item.prop)) {
            item.slotName = "frameworkContract";
          }
          if (["winningBidder"].includes(item.prop)) {
            item.slotName = "winningBidder";
          }
          return item.isShow;
        });
      });
      api_userSetQuery({ permissionCode: "M005_028" }).then((res) => {
        this.isOrderTableHeaderId = res.data.id;
        let headerData = JSON.parse(res.data.data).sort(
          (a, b) => a.index - b.index
        );

        this.orderTable.tableConfig.operateConfig.allTableHeader = headerData;
        this.orderTable.tableConfig.header = headerData.filter((item) => {
          if (["orderName"].includes(item.prop)) {
            item.slotName = "orderName";
          }
          if (["projectName"].includes(item.prop)) {
            item.slotName = "projectName";
          }
          return item.isShow;
        });
      });
    },
    saveHeaderList(data) {
      api_userSetSave({
        data: JSON.stringify(data),
        permissionCode: "M005_027",
        id: this.isTableHeaderId,
      }).then((res) => {
        if (res.msg.code == "0000") {
          this.getTbData();
          this.getTbHeader();
        }
      });
    },
    saveHeaderList2(data) {
      api_userSetSave({
        data: JSON.stringify(data),
        permissionCode: "M005_028",
        id: this.isOrderTableHeaderId,
      }).then((res) => {
        if (res.msg.code == "0000") {
          this.getTbData();
          this.getTbHeader();
        }
      });
    },
    //页数发生改变
    pageChanged(val) {
      this.table.page.pageNum = val;
      // this.getTbData();
      this.getTbData(this.searchOrderId);
    },
    sizeChanged(val) {
      this.table.page.pageNum = 1;
      this.table.page.pageSize = val;
      // this.getTbData();
      this.getTbData(this.searchOrderId);
    },
    //页数发生改变
    orderPageChanged(val) {
      this.orderTable.page.pageNum = val;
      this.getOrderTableTbData(this.searchOrderId);
    },
    orderSizeChanged(val) {
      this.orderTable.page.pageNum = 1;
      this.orderTable.page.pageSize = val;
      this.getOrderTableTbData(this.searchOrderId);
    },
    // 搜索
    listSearch(searchParams) {
      this.searchParam = searchParams;
      this.table.page.pageNum = 1;
      this.getTbData("", "search");
      this.$set(this.table.tableConfig, "highlightCurrentRow", false);
    },
    // 重置
    listRefresh() {
      this.table.page.pageNum = 1;
      this.getTbData();
      this.$set(this.table.tableConfig, "highlightCurrentRow", false);
    },
    getTbData(orderIds, searchType) {
      let param = {};
      // 搜索
      if (this.searchParam.hasOwnProperty("serviceName")) {
        param = {
          pageNum: this.table.page.pageNum,
          pageSize: this.table.page.pageSize,
          ...this.searchParam,
        };
      } else {
        param = {
          pageNum: this.table.page.pageNum,
          pageSize: this.table.page.pageSize,
          ...this.$refs["searchList"].searchForm,
        };
      }
      api_contractSearchLise(param).then((res) => {
        if (res.data.records && res.data.records.length > 0) {
          this.table.page.pages = res.data.pages;
          this.table.page.total = res.data.total;
          this.table.data = res.data.records;
          if (!this.searchOrderId) {
            this.searchOrderId = this.table.data[0].id;
          }
          // 搜索
          if (searchType == "search") {
            if (Number(this.table.data[0].id) != Number(orderIds)) {
              this.searchOrderId = this.table.data[0].id;
              this.getOrderTableTbData(this.searchOrderId);
            }
          } else {
            // 点击当前行
            if (orderIds) {
              // 有无合同Id
              this.getOrderTableTbData(orderIds);
            } else {
              if (this.table.data[0].status == 1) {
                this.getOrderTableTbData(this.table.data[0].id);
              } else {
                this.orderTable.data = [];
              }
            }
          }
        } else {
          this.table.data = [];
          this.orderTable.data = [];
        }
      });
    },
    clickRowContract(row) {
      this.searchOrderId = row.id;
      this.$set(this.table.tableConfig, "highlightCurrentRow", true);
      if (row.status == 1) {
        this.getOrderTableTbData(this.searchOrderId);
      } else {
        this.orderTable.data = [];
      }
    },
    // 订单数据
    getOrderTableTbData(id) {
      let param = {
        pageNum: this.orderTable.page.pageNum,
        pageSize: this.orderTable.page.pageSize,
        serviceId: id,
      };
      api_orderSearchLise(param).then((res) => {
        if (res.data.records && res.data.records.length > 0) {
          this.orderTable.page.pages = res.data.pages;
          this.orderTable.page.total = res.data.total;
          this.orderTable.data = res.data.records;
        } else {
          this.orderTable.data = [];
        }
      });
    },

    // 新增合同
    addContract() {
      // 新增服务合同
      if (this.addSelectList.length == 1) {
        this.clickNewContract = {
          ...this.clickNewContract,
          ...this.addSelectList[0],
        };
        this.$router.push({
          name: "AddContract",
          query: {
            contractNew: JSON.stringify(this.clickNewContract),
          },
        });
      } else if (this.addSelectList.length > 1) {
        this.$message.warning("请选择一个服务再新增合同");
      } else {
        this.$router.push({
          name: "AddContract",
        });
      }
    },

    // 新增订单信息
    addOrder(row) {
      this.$router.push({
        name: "AddOrder",
        query: {
          startTime: row.startTime,
          endTime: row.endTime,
          serviceId: row.id,
          frameworkContract: row.frameworkContract,
          new: "0",
        },
      });
    },
    // 编辑合同信息
    editContract(row) {
      this.$router.push({
        name: "AddContract",
        query: {
          edit: "0",
          id: row.id,
        },
      });
    },
    // 编辑订单信息
    editOrder(row) {
      this.$router.push({
        name: "AddOrder",
        query: {
          edit: "0",
          orderId: row.id,
          serviceId: row.serviceId,
        },
      });
    },

    // 查看
    see(row) {
      this.$router.push({
        name: "orderManagementView",
        query: {
          id: row.id,
        },
      });
    },
    seeOrder(row) {
      this.$router.push({
        name: "contractManagementView",
        query: {
          orderId: row.id,
        },
      });
    },
    deleOrder(row) {
      this.$confirm("确定删除该订单?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.deleteorderFun(row.id);
      });
    },
    // 删除服务
    deleteService(row) {
      this.$confirm("确定删除该合同?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.deleteFun(row.id);
      });
    },

    deleteFun(deleteId) {
      api_deleteService({ id: deleteId }).then((res) => {
        if (res.data == "删除成功") {
          this.$message({
            message: res.data,
            type: "success",
          });
          this.getTbData(this.searchOrderId);
        } else {
          this.$message({
            message: res.data,
            type: "error",
          });
        }
      });
    },
    deleteorderFun(deleteId) {
      let delById = [];
      delById.push(deleteId);
      api_deleteOrderService(delById).then((res) => {
        if (res.msg.code == "0000") {
          this.$message({
            message: "删除成功",
            type: "success",
          });
          this.getTbData(this.searchOrderId);
        } else {
          this.$message({
            message: "删除失败",
            type: "error",
          });
        }
      });
    },

    // 合同多选操作
    selected(selectedList) {
      this.addSelectList = [];
      this.addSelectList = selectedList;
      this.exportContractId = [];
      selectedList.forEach((ele) => {
        this.exportContractId.push(ele.id);
      });
    },
    // 关联订单导入
    // 模板下载
    downloadExcel() {
      let token = sessionStorage.getItem("token");
      window.open(
        `${config.baseUrl}/jfzg/projectlibrary/order/management/templateExcel?access_token=${token}`
      );
    },
    beforeAvatarUpload(file) {
      let testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      const isXLS = testmsg.toUpperCase() == "XLS";
      const isXLSX = testmsg.toUpperCase() == "XLSX";
      const isSize = file.size / 1024 / 1024 < 20;
      if (!isXLS && !isXLSX) {
        this.$message.warning("上传文件只能是xls、xlsx格式!");
        return false;
      }
      if (!isSize) {
        this.$message.warning("上传文件大小不能超过20MB!");
        return false;
      }
    },
    uploadFile(params) {
      this.formData = new FormData();
      this.formData.append("file", params.file);
      this.formData.append("id", this.searchOrderId);
    },
    upRefalsh(uploadFormref) {
      this.$refs[uploadFormref].validate((valid) => {
        if (valid) {
          if (this.formData) {
            api_importOrder(this.formData).then((res) => {
              if (res.msg.code == "0000") {
                if (res.msg.message == "SUCCESS") {
                  // this.getProjectList();
                  this.$refs["upfile"].clearFiles();
                  this.getTbData();
                  if (res.data[0].code === "1") {
                    this.$message({
                      type: "success",
                      message: res.data[0].result,
                    });
                  } else {
                    this.$message({
                      type: "warning",
                      message: res.data[0].result,
                    });
                  }
                } else {
                  this.$message({
                    type: "warning",
                    message: res.data[0].result,
                  });
                }
              }
            });
            this.orderDialogVisible = false;
            this.getTbData();
          } else {
            this.$message.warning("请上传文件");
          }
        }
      });
    },
    // 合同导出
    exportContract() {
      api_exportContract(this.exportContractId).then((res) => {
        const link = document.createElement("a");
        const blob = new Blob([res.data], {
          type: "application/vnd.ms-excel",
        });
        const pat = new RegExp("filename=([^;]+\\.[^\\.;]+)"); // 设置下载文件名称
        let contentDisposition;
        if (res.headers["content-disposition"])
          contentDisposition = res.headers["content-disposition"];
        if (res.headers["Content-Disposition"])
          contentDisposition = res.headers["Content-Disposition"];
        const result = pat.exec(contentDisposition);
        let fileName = result && result[1]; // 生成下载链接
        const URL = window.URL || window.webkitURL;
        link.href = URL.createObjectURL(blob); // 如果Content-Disposition没有提供文件名，则使用默认名称
        fileName = "订单管理";
        link.setAttribute("download", decodeURIComponent(fileName)); // 使用URI解码而不是解码
        document.body.appendChild(link);
        link.click(); // 释放URL对象
        window.URL.revokeObjectURL(link.href);
        document.body.removeChild(link);
      });
      // }
    },
  },
};
</script>

<style lang="scss" scoped>
.common-card {
  height: 100%;
}

.item {
  height: 50%;
  position: relative !important;
}

.sr_table {
  height: 80%;
  overflow-y: scroll;
}
::v-deep .sr_table_bottom {
  position: absolute !important;
  bottom: 0 !important;
  right: 0 !important;
}
.sr_table2 {
  height: 75%;
  overflow-y: scroll;
  ::v-deep .sr_table_bottom {
    position: absolute !important;
    bottom: 8px !important;
    right: 0 !important;
  }
}

::v-deep .sr_table th {
  line-height: 48px;
  height: 48px;
  > .cell {
    line-height: 24px !important;
  }
}

::v-deep .sr_table td {
  line-height: 60px;
  height: 60px;
  > .cell {
    line-height: 24px !important;
  }
}

.SrDialogSelect {
  ::v-deep .el-input {
    display: none;
  }
}
.searchPage {
  background: #fff;
  padding: 0 20px 0 0;
  // overflow: auto;
  ::v-deep .getyearclass {
    width: 240px !important;
  }
  ::v-deep .selectWidthCustom {
    width: 153px !important;
  }
  ::v-deep .el-col-19 {
    width: 100% !important;
  }
  ::v-deep .sr_search .el-select {
    width: 160px !important;
  }
  ::v-deep .el-col-5 {
    display: none !important;
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
::v-deep .sr_search .inputStyle {
  width: 170px !important;
  .el-input {
    width: 170px !important;
  }
}
::v-deep .sr_search .selectStyle {
  width: 170px !important;
  .el-select {
    width: 170px !important;
  }
}
.elBtn {
  display: flex;
  margin-top: 5px;
  margin-bottom: 5px;
  justify-content: space-between;
  align-items: flex-end;
  .btns {
    padding-bottom: 5px;
    padding-right: 10px;
  }
}
.border {
  width: 4px;
  height: 14px;
  border-radius: 5px;
  background: #0176ff;
  margin: 0 5px;
}
.title {
  display: flex;
  align-items: center;
  justify-content: center;
  span {
    font-size: 15px;
    font-weight: bolder;
  }
}
::v-deep .sr_search .el-form-item {
  width: 175px !important;
}
::v-deep .sr_search .el-date-editor {
  width: 100% !important;
}
::v-deep .el-dialog .el-dialog__footer {
  padding: 0 !important;
}
.elDialog .dialog-footer {
  display: flex !important;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  .link-box {
    width: 100px;
    height: 50px;
    /* background-color: red; */
    display: block;
    font-size: 12px;
    line-height: 50px;
  }
  .el-button {
    height: 32px;
    border-radius: 4px;
    padding: 0 20px !important;
  }
}
.upload-demo {
  padding-left: 10px;
}
.button {
  height: 28px;
  line-height: 18px;
  text-align: center;
  margin-left: 10px;
  padding: 5px 10px;
  border-radius: 4px;
  border: 1px solid #1890ff;
  font-size: 14px;
  color: #1890ff;
}
.el-table .success-row {
  background: #f0f9eb;
}
.table_unitName {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;
}
.table_unitName1 {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
::v-deep .sr_table_bottom {
  position: absolute !important;
  bottom: -13px !important;
  right: 0 !important;
  .pagination {
    margin-top: 0px !important;
  }
}
</style>
