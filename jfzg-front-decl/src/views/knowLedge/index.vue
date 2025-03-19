<template>
  <div class="common-card">
    <!-- 标签页 -->
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="通知公告" name="通知公告">
        <div v-if="activeName === '通知公告'">
          <div class="searchPage" ref="searchRef">
            <div>
              <SearchForm
                :search="searchData"
                @startTimeChange="handleStartTimeChange"
                @endTimeChange="handleEndTimeChange"
                @search="handleSearchFn"
                @reset="handleResetForm"
                :publishList="publishList"
                :publishTypeList="publishTypeList"
                :publishFlag="true"
              />
            </div>
            <div class="other-btns">
              <!-- <el-button size="small" @click="exportFiles">导出</el-button> -->
              <el-button
                v-if="userInfo.currentRole.roleCode == 'FZGHC_JBRBF'"
                size="small"
                type="primary"
                @click="add('publid')"
                >新增</el-button
              >
            </div>
          </div>
          <CustomLoading :visible="isLoading" />
          <SrTable
            ref="selectTable"
            @pageChanged="handlePageChange"
            :noData="noData"
            :data="table.data"
            @sizeChanged="handleSizeChange"
            :config="table.config"
            :page="table.page"
            @selected="selected"
            @sortChange="sortChange"
      :extra-tooltip-labels="['公告范围', '标题']" 
          >
            <!-- 标题名称 -->
            <template slot="knowledgeName" slot-scope="{ scope }">
              <div v-if="scope.item.prop == 'knowledgeName'">

                  <div
                    class="custom-link"
                    @click="previewFileItem(scope.row, 'publi')"
                    style="color: #1890ff"
                  >
                    {{ scope.row.knowledgeName }}
                  </div>
              </div>
            </template>
            <!-- 公告范围 -->
            <template slot="jfIdBuIdRoleCodeName" slot-scope="{ scope }">
              <div v-if="scope.item.prop == 'jfIdBuIdRoleCodeName'">
   
                  <div class="custom-link">
                    {{ scope.row.jfIdBuIdRoleCodeName }}
                  </div>
              </div>
            </template>
            <!-- 创建时间 createTime -->
            <template slot="createTime" slot-scope="{ scope }">
              <div v-if="scope.item.prop == 'createTime'">
 
                  <div class="custom-link">
                    {{ scope.row.createTime }}
                  </div>
              </div>
            </template>
            <!-- 发布部门 -->
            <template slot="publishDeptName" slot-scope="{ scope }">
              <div v-if="scope.item.prop == 'publishDeptName'">
  
                  <div class="custom-link">
                    {{ scope.row.publishDeptName }}
                  </div>
              </div>
            </template>
          </SrTable>
        </div>
      </el-tab-pane>
      <el-tab-pane label="技术文档" name="技术文档">
        <div v-if="activeName === '技术文档'">
          <div class="searchPage" ref="searchRefSecond">
            <div>
              <SearchForm
                :search="searchData"
                @startTimeChange="handleStartTimeChange"
                @endTimeChange="handleEndTimeChange"
                @search="handleSearchFn"
                @reset="handleResetForm"
                :fileTypeList="fileTypeList"
                :publishList="publishList"
                :publishFlag="false"
              />
            </div>

            <div class="other-btns">
              <el-button size="small" @click="exportFiles">导出</el-button>
              <el-button
                v-if="userInfo.currentRole.roleCode == 'FZGHC_JBRBF'"
                size="small"
                type="primary"
                @click="add('skill')"
                >新增</el-button
              >
            </div>
          </div>
          <CustomLoading :visible="isLoading" />
          <SrTable
            ref="selectTable"
            @pageChanged="handlePageChange"
            :noData="noData"
            :data="secondTable.data"
            @sizeChanged="handleSizeChange"
            :config="secondTable.config"
            :page="secondTable.page"
            @selected="selected"
            @sortChange="sortChange"

      :extra-tooltip-labels="['名称', '标题']" 
          >
            <template slot="knowledgeName" slot-scope="{ scope }">
              <div v-if="scope.item.prop == 'knowledgeName'">

                  <div
                    class="custom-link"
                    @click="previewFileItem(scope.row, 'skill')"
                    style="color: #1890ff"
                  >
                    {{ scope.row.knowledgeName }}
                  </div>
              </div>
            </template>



            <!-- 发布部门 publishBuName -->
            <template slot="publishBuName" slot-scope="{ scope }">
              <div v-if="scope.item.prop == 'publishBuName'">
    
                  <div class="custom-link">
                    {{ scope.row.publishBuName }}
                  </div>
              </div>
            </template>
            <!-- 类型 -->
            <!-- <template slot="contextType" slot-scope="{ scope }">
            <div v-if="scope.item.prop == 'contextType'">
              {{ typeFilter(scope.row.contextType) }}
            </div>
          </template> -->
            <!-- 备注 -->
            <template slot="remarks" slot-scope="{ scope }">
              <div v-if="scope.item.prop == 'remarks'">
 
                  <div class="custom-link-2">
                    {{ scope.row.remarks }}
                  </div>
              </div>
            </template>
          </SrTable>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 新增 | 编辑 弹框 -->
    <EditDialog ref="editDiaLog" @callback="callbackFunc" />
    <PulidDialog ref="pulidDiaLog" @callback="callbackFunc" />
  </div>
</template>

<script>
// utils
import store from "@/store";
import config from "@/settings.js";
import { getCommonTableHeight } from "@/utils/tableHeightUtils.js";

// components
import EditDialog from "./components/editDialog.vue";
import SearchForm from "./components/searchForm.vue";
// api
import { api_userSetQuery, api_userSetSave } from "@/api/index.js";
import {
  api_query_knowLedge,
  api_query_getRoleCodeAndNames,
  api_delete_getRoleCodeAndNames,
  api_withdraw_knowLedge,
} from "@/api/knowLedge/index.js";
import PulidDialog from "./components/pulidDialog.vue";

const typeMap = {
  0: "通知类",
  1: "统建政策类",
  2: "项目管理类",
  3: "安全运维类",
  4: "其他类",
};
export default {
  name: "know_ledge",
  components: { EditDialog, SearchForm, PulidDialog },
  data() {
    return {
      isLoading: false,
      noData: false,
      fileTypeList: [
        { label: "全部", value: "" },
        { label: "通知类", value: "0" },
        { label: "统建政策类", value: "1" },
        { label: "项目管理类", value: "2" },
        { label: "安全运维类", value: "3" },
        { label: "其他类", value: "4" },
      ],
      publishList: [
        { label: "全部", value: "" },
        { label: "已发布", value: "0" },
        { label: "未发布", value: "1" },
      ],
      // 通知类型 0：通知 1：通告 2：命令 3：决定 4：公告 5：通报 6：议案 7：意见 8：会议纪要 9：请选择类型"
      publishTypeList: [
        { label: "全部", value: "" },
        { label: "通知", value: "0" },
        { label: "通告", value: "1" },
        { label: "命令", value: "2" },
        { label: "决定", value: "3" },
        { label: "公告", value: "4" },
        { label: "通报", value: "5" },
        { label: "议案", value: "6" },
        { label: "意见", value: "7" },
        { label: "会议纪要", value: "8" },
      ],

      activeName: "通知公告",
      userInfo: store.getters.userInfo,
      isTableHeaderId: "",
      fileIds: [], // 批量选择的id
      viewScopeList: [],
      // 新增 | 编辑 弹框
      searchData: {
        knowledgeName: "",
        contextType: "",
        createTime: "",
        endTime: "",
        saveStatus: "",
        notificationType: "",
      },
      table: {
        data: [], // 表格数据
        indexConfig: {
          display: false, //不展示序号
        },
        selectionConfig: {
          display: true,
          width: "40",
          selectable: this.selectable,
        },
        config: {
          title: "表格的标题", // 表格标题
          highlightCurrentRow: false, // 控制表格是否单选
          tooltipEffect: "light",
          maxLength: 20, // 一行最多显示多少字，超出显示popver
          maxHeight: 0,
          header: [],
          indexConfig: {
            display: false, //不展示序号
          },
          selectionConfig: {
            display: true,
            width: "40",
            selectable: this.selectable,
          },
          operateConfig: {
            display: true,
            label: "操作",
            width: "160",
            fixed: "right",
            allTableHeader: "",
            saveHeaderList: this.saveHeaderList,
            // hideHeaderSetting: true,
          },
          innerBtn: [
            {
              name: "预览", // 按钮名称，优先显示icon
              method: "preview", // 点击执行该页面methods中对应的方法
              className: "font-size-20",
              type: "text",
              validate: this.btnValidate2,
            },
            {
              name: "撤回", // 按钮名称，优先显示icon
              method: "withdraw", // 点击执行该页面methods中对应的方法
              className: "font-size-20",
              type: "text",
              validate: this.btnValidate,
            },
            // 表格内部操作按钮，不需要操作列的innerBtn 写成false
            {
              name: "编辑", // 按钮名称，优先显示icon
              method: "edit", // 点击执行该页面methods中对应的方法
              className: "font-size-20",
              type: "text",
              validate: this.btnValidate,
            },

            {
              name: "删除", // 按钮名称，优先显示icon
              method: "del", // 点击执行该页面methods中对应的方法
              className: "font-size-20",
              type: "text",
              validate: this.btnValidate3,
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
      secondTable: {
        data: [], // 表格数据
        indexConfig: {
          display: false, //不展示序号
        },
        selectionConfig: {
          display: true,
          width: "40",
          selectable: this.selectable,
        },
        config: {
          title: "表格的标题", // 表格标题
          highlightCurrentRow: false, // 控制表格是否单选
          tooltipEffect: "light",
          maxLength: 20, // 一行最多显示多少字，超出显示popver
          maxHeight: 0,
          header: [],
          indexConfig: {
            display: false, //不展示序号
          },
          selectionConfig: {
            display: true,
            width: "40",
            selectable: this.selectable,
          },
          operateConfig: {
            display: true,
            label: "操作",
            width: "160",
            fixed: "right",
            allTableHeader: "",
            saveHeaderList: this.saveHeaderList,
            // hideHeaderSetting: true,
          },
          innerBtn: [
            // 表格内部操作按钮，不需要操作列的innerBtn 写成false
            {
              name: "预览", // 按钮名称，优先显示icon
              method: "scondPreview", // 点击执行该页面methods中对应的方法
              className: "font-size-20",
              type: "text",
              validate: this.btnValidate2,
            },
            {
              name: "撤回", // 按钮名称，优先显示icon
              method: "withdraw", // 点击执行该页面methods中对应的方法
              className: "font-size-20",
              type: "text",
              validate: this.btnValidate,
            },
            {
              name: "编辑", // 按钮名称，优先显示icon
              method: "scondEdit", // 点击执行该页面methods中对应的方法
              className: "font-size-20",
              type: "text",
              validate: this.btnValidate,
            },

            {
              name: "删除", // 按钮名称，优先显示icon
              method: "del", // 点击执行该页面methods中对应的方法
              className: "font-size-20",
              type: "text",
              validate: this.btnValidate3,
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
    };
  },
  created() {
    this.queryRoleCodeAndName();
  },
  mounted() {
    this.queryTableData();
    this.getHeaderOptions();
    this.calculateTableHeight();
    const pattern = /\/knowLedge\?id/;
    if (pattern.test(this.$route.fullPath)) {
      let row = {
        id: this.$route.query.id,
      };
      // sessionStorage.setItem("htmlData", '知识库');

      this.$refs.pulidDiaLog.open("预览", row);
      this.$router.push({ query: {} });
    }
  },
  methods: {
    calculateTableHeight() {
      // 调用工具函数并传入元素的 ref
      let height = getCommonTableHeight(this.$refs.searchRef);
      this.tableHeight = height - 50; // 根据你的需求减去固定值

      this.$set(this.table.config, "maxHeight", this.tableHeight);
      this.$set(this.secondTable.config, "maxHeight", this.tableHeight);
    },
    /***************   搜索 | 重置 | 开始时间change | 结束时间change | 新增 | 导出    **********************************/
    handleSearchFn(e) {
      this.table.page.pageNum = 1;
      this.table.page.pageSize = 10;
      this.queryTableData();
    },
    // 分页
    handleResetForm() {
      Object.keys(this.searchData).forEach((item) => {
        if (this.searchData[item]) {
          this.searchData[item] = "";
        }
      });
      this.handleSearchFn();
    },
    handleStartTimeChange(time) {
      this.searchData.createTime = time;
      if (
        (this.searchData.endTime &&
          this.searchData.createTime > this.searchData.endTime) ||
        this.searchData.startTime == null
      ) {
        this.searchData.endTime = null;
      }
    },
    handleEndTimeChange(time) {
      if (!this.searchData.createTime) {
        this.$message.warning("请先选择开始日期");
        this.searchData.endTime = null;
      } else {
        this.searchData.endTime = time;
      }
    },

    // 新增
    add(info) {
      const { roleCode } = this.userInfo.currentRole;
      if (roleCode !== "FZGHC_JBRBF")
        return this.$message.warning("此功能仅限于管理权限者");
      if (info == "publid") {
        this.$nextTick(() => {
          this.$refs.pulidDiaLog.openAdd("新增");
        });
      } else {
        this.$nextTick(() => {
          this.$refs.editDiaLog.openAdd("新增");
        });
      }
    },
    // 数组扁平化
    flatten(arr) {
      return arr.reduce(function (prev, item) {
        return prev.concat(Array.isArray(item) ? this.flatten(item) : item);
      }, []);
    },
    down(url) {
      var iframe = document.createElement("iframe");
      iframe.src = url;
      iframe.style.display = "none";
      document.body.appendChild(iframe);
    },

    // 导出
    async exportFiles() {
      if (this.fileIds.length < 1) {
        return this.$message("请先选中要导出的公告附件！");
      } else if (this.fileIds.length > 1) {
        return this.$message("一次最多导出1个公告！");
      }

      try {
        for (const file of this.fileIds) {
          if (file.downloadIds != null) {
            await this.flatten(file.downloadIds);
            for (const downloadId of file.downloadIds) {
              await this.down(
                `${config.baseUrl}/jfzg/file/api/file/download?key=${
                  downloadId.id
                }&access_token=${sessionStorage.getItem("token")}`
              );
            }
          } else {
            this.$message.warning("所选的公告有附件未上传");
          }
        }
      } catch (error) {
        this.$message.error("文件导出失败，请重试！");
      }
    },
    // 查询可查看范围下拉选数据
    queryRoleCodeAndName() {
      api_query_getRoleCodeAndNames().then((res) => {
        let list = [{ dataName: "全部", dataValue: "all" }];
        res.data.map((item) => {
          list.push({
            dataName: item.roleName,
            dataValue: item.roleCode,
          });
        });
        this.viewScopeList = list;
      });
    },
    /*************   table查询 | 类型回显 | 多选 | 编辑 | 预览 | 删除(按钮权限以及方法) | 分页  ***************************/
    queryTableData() {
      this.isLoading = true;
      this.noData = false;
      const {
        knowledgeName,
        createTime,
        endTime,
        contextType,
        saveStatus,
        notificationType,
      } = this.searchData;
      if (
        (createTime !== "" && endTime == "") ||
        (endTime !== "" && createTime == "")
      ) {
        // this.$message.warning("开始或结束时间未选择");
        return false;
      }
      this.table.data = [];
      this.secondTable.data = [];

      let payLoad = {
        pageNo: this.table.page.pageNum,
        pageSize: this.table.page.pageSize,
        knowledgeName,
        createTime,
        endTime,
        contextType,
        notificationType,
        saveStatus,
        type: this.activeName == "通知公告" ? 0 : 1,
      };
      api_query_knowLedge(payLoad)
        .then((res) => {
          if (res.data?.records) {
            this.isLoading = false;
            // this.table.page.pageNum = res.data.pages;
            this.table.page.total = res.data.total;
            this.table.data = res.data.records;

            this.secondTable.data = res.data.records;
            this.secondTable.page.total = res.data.total;
          } else {
            this.isLoading = false;
            this.noData = true;
            this.table.data = [];
            this.secondTable.data = [];
          }
        })
        .catch(() => {
          this.isLoading = false;
          this.noData = true;
        });
    },

    typeFilter(type) {
      return typeMap[type] || "未知类型";
    },

    viewScopeFilter(type) {
      if (type === "all") {
        return "全部";
      }

      const typeList = type.split(",");
      const matchedNames = this.viewScopeList
        .filter((item) => typeList.includes(item.dataValue))
        .map((item) => item.dataName);

      return matchedNames.join(",");
    },

    // select
    selectable(row, index) {},

    // 多选操作
    selected(sectionList) {
      this.fileIds = sectionList;
    },

    handleClick(tab, event) {
      Object.keys(this.searchData).forEach((item) => {
        if (this.searchData[item]) {
          this.searchData[item] = "";
        }
      });
      this.callbackFunc();
      this.queryTableData();
    },

    hasPermission(roleCode, requiredRoles) {
      return requiredRoles.includes(roleCode);
    },

    // 编辑 权限
    btnValidate(row, item) {
      if (row.name == "撤回") {
        if (item.saveStatus == 0) {
          const { roleCode } = this.userInfo.currentRole;
          return this.hasPermission(roleCode, ["FZGHC_JBRBF"]);
        }
      } else {
        const { roleCode } = this.userInfo.currentRole;
        return this.hasPermission(roleCode, ["FZGHC_JBRBF"]);
      }
    },

    // 预览权限
    btnValidate2(row, item) {
      const { roleCode } = this.userInfo.currentRole;
      if (item.viewScope == "all") {
        return true;
      }
      let viewScopeList = (item.viewScope || "").split(",");
      return this.hasPermission(
        roleCode,
        viewScopeList.concat(["FZGHC_JBRBF",
        "DSZ",
        "ZJL",
        "F_ZJL",
        "BM_FZR",
      "XMGLB"
      ])
      );
    },

    // 删除 权限
    btnValidate3(row, item) {
      const { roleCode } = this.userInfo.currentRole;
      return this.hasPermission(roleCode, [
        "FZGHC_JBRBF",
        "DSZ",
        "ZJL",
        "F_ZJL",
        "BM_FZR",,
      "XMGLB"
      ]);
    },

    // 编辑方法
    edit(row) {
      const { roleCode } = this.userInfo.currentRole;
      if (roleCode !== "FZGHC_JBRBF")
        return this.$message.warning("此功能仅限于管理权限者");
      this.$nextTick(() => {
        // this.$refs.editDiaLog.open("编辑", row);
        this.$refs.pulidDiaLog.open("编辑", row);
      });
    },
    scondEdit(row) {
      const { roleCode } = this.userInfo.currentRole;
      if (roleCode !== "FZGHC_JBRBF")
        return this.$message.warning("此功能仅限于管理权限者");
      this.$nextTick(() => {
        this.$refs.editDiaLog.open("编辑", row);
      });
    },
    // 预览
    preview(row) {
      this.$nextTick(() => {
        this.$refs.pulidDiaLog.open("预览", row);
      });
    },
    // 撤回
    withdraw(row) {
      this.$confirm("此操作将撤回该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        api_withdraw_knowLedge({
          id: row.id,
        }).then(() => {
          this.$message({
            type: "success",
            message: "撤回成功!",
          });
          this.queryTableData();
        });
      });
    },
    scondPreview(row) {
      this.$nextTick(() => {
        this.$refs.editDiaLog.open("预览", row);
        // this.$refs.pulidDiaLog.open("预览", row);
      });
    },
    // 附件预览
    previewFileItem(item, info) {
      const { roleCode } = this.userInfo.currentRole;
      const canPreview =
        item.viewScope === "all" ||
        item.viewScope.split(",").includes(roleCode);

      if (info == "publi") {
        this.$nextTick(() => {
          this.$refs.pulidDiaLog.open("预览", item);
        });
      } else {
        this.$nextTick(() => {
          this.$refs.editDiaLog.open("预览", item);
        });
      }
      // if (canPreview) {

      // }
    },

    // 删除方法
    del(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          api_delete_getRoleCodeAndNames({ id: row.id }).then((res) => {
            if (res.msg.code == "0000") {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.queryTableData();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    handlePageChange(val) {
      this.table.page.pageNum = val;
      try {
        this.queryTableData();
      } catch (error) {
        // 可以在这里添加更多的错误处理逻辑，例如显示错误提示给用户
      }
    },

    handleSizeChange(val) {
      const DEFAULT_PAGE_NUM = 1;
      this.table.page.pageNum = DEFAULT_PAGE_NUM;
      this.table.page.pageSize = val;
      try {
        this.queryTableData();
      } catch (error) {
        // 可以在这里添加更多的错误处理逻辑，例如显示错误提示给用户
      }
    },

    /*************************************      弹框回调函数    *******************************************************/
    callbackFunc() {
      const DEFAULT_PAGE_NUM = 1;
      const DEFAULT_PAGE_SIZE = 10;
      this.table.page.pageNum = DEFAULT_PAGE_NUM;
      this.table.page.pageSize = DEFAULT_PAGE_SIZE;

      try {
        this.queryTableData();
      } catch (error) {
        // 可以在这里添加更多的错误处理逻辑，例如显示错误提示给用户
      }
    },

    /***********************************      获取表头设置        *******************************************************/
    getHeaderOptions() {
      api_userSetQuery({ permissionCode: "M005_030" }).then((res) => {
        this.isTableHeaderId = res.data.id;
        let headerData = JSON.parse(res.data.data).sort(
          (a, b) => a.index - b.index
        );

        this.table.config.operateConfig.allTableHeader = headerData;
        // this.secondTable.config.operateConfig.allTableHeader = headerData;

        this.table.config.header = headerData.filter((item) => {
          return item.isShow;
        });

        this.table.config.header = headerData.splice(0, 5);

        this.secondTable.config.header = headerData;

        // this.secondTable.config.header = headerData.filter((item) => {
        //   return item.isShow;
        // });
      });
    },

    saveHeaderList(data) {
      api_userSetSave({
        data: JSON.stringify(data),
        permissionCode: "M005_030",
        id: this.isTableHeaderId,
      }).then((res) => {
        if (res.msg.code == "0000") {
          this.getHeaderOptions();
        }
      });
    },

    sortChange(column) {
      const orderMap = {
        ascending: "ASC",
        descending: "DESC",
      };

      this.searchData.formData["orderBy"] = orderMap[column.order] || "";
      this.queryTableData();
    },
  },
};
</script>

<style lang="scss" scoped>
.common-card {
  height: 100%;
  padding: 0px 20px;
  background-color: #fff;
}

.searchPage {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  .other-btns {
    display: flex;
    height: 100%;
    // margin-bottom: 10px;
    // display: flex;
    // flex-direction: row-reverse;
    // .el-button {
    //   margin-left: 10px;
    // }
  }
}

// .sr_table {
//   height: 90%;
// }

// ::v-deep .sr_table th {
//   line-height: 48px;
//   height: 48px;
//   > .cell {
//     line-height: 24px !important;
//   }
// }

// ::v-deep .sr_table td {
//   line-height: 60px;
//   height: 60px;
//   > .cell {
//     line-height: 24px !important;
//   }
// }

.custom-link {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}

.custom-link-2 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
::v-deep .el-table {
  tr {
    height: 60px !important;
  }
}
</style>
