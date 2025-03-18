<template>
  <div class="total-page">
    <div class="searchPage">
      <SrSearch
        :search="search"
        :searchExpand="true"
        :showTextBtns="true"
        @queryList="pageChanged(1)"
      ></SrSearch>
    </div>
    <SrTable
      @pageChanged="pageChanged"
      :data="table.data"
      @sizeChanged="sizeChanged"
      :config="table.tableConfig"
      :page="table.page"
    ></SrTable>
  </div>
</template>
  
  <script>
import store from "@/store";
import { getQueryList, queryRemove } from "@/api/projectLibrary";
import { api_userSetQuery, api_userSetSave } from "@/api/index.js";
import config from "@/settings.js";
import utils from "@/utils/index.js";
import { setSession, getSession, removeSession } from "@/core/session.js";
import Table from "@/components/table";
import { getList } from "@/api/expenseSettlement/index.js";
import { getProfessionalLevel } from "@/api/expert";
export default {
  props: {},
  components: {
    Table,
  },
  data() {
    return {
      userInfo: store.getters.userInfo,
      search: {
        size: "small",
        labelConfig: {
          labelWidth: "90px",
          labelSuffix: ":",
          labelPosition: "right",
        },
        config: [
          {
            type: "text",
            placeholder: "请输入专家名称",
            bind: "expertName",
          },
          {
            type: "select",
            placeholder: "请选择专家职称类型",
            bind: "professionalLevelIds",
            data: "professionalLevelList",
            multiple: true,
            collapseTags: true,
          },
          {
            type: "month",
            placeholder: "请选择评审活动时间",
            bind: "dateTime",
            format: "yyyy-MM",
          },
        ],
        enum: {
          // 搜索项下拉数据
          plan_typeList: [
            {
              value: "2",
              label: "总体发展规划",
            },
            {
              value: "1",
              label: "专项发展规划",
            },
          ],
          professionalLevelList: [],
        },
        btns: [],
        formData: {
          expertName: "",
          professionalLevelIds: [],
          dateTime: "", //评审活动时间
        },
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
            display: true,
            label: "操作",
            width: "166",
            fixed: "right",
            allTableHeader: "",
            saveHeaderList: this.saveHeaderList,
            export: this.export,
            exportPermissionCode: "M002_003_002",
          },
          innerBtn: [
            // 表格内部操作按钮，不需要操作列的innerBtn 写成false
            {
              name: "查看", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "see", // 点击执行该页面methods中对应的方法
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
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

  mounted() {
    this.getTbData();
    this.getTbHeader();
    this.getProfessionalLevelList();
  },
  methods: {
    // 获取职称列表
    getProfessionalLevelList() {
      getProfessionalLevel().then((res) => {
        console.log("职称列表", res.data);
        let arr = res.data.map((item) => {
          return {
            label: item.name,
            value: item.id,
          };
        });
        this.$set(this.search.enum, "professionalLevelList", arr);
      });
    },
    /*     load(tree, treeNode, resolve) {
      let param = {
        pageNo: 1,
        pageSize: 9999,
        ...this.search.formData,
        isSubproject: 1,
        mainProjectId: tree.id,
      };
      getQueryList(param).then((res) => {
        if (res.msg.code == "0000") {
          let { roleCode } = this.userInfo.currentRole;
          let { jfid } = this.userInfo;
          let list = res.data.records.map((item) => {
            debugger;
            if (item.todo) {
              item.operationBtns = [];
              if (item.assignee == jfid) {
                item.description &&
                  JSON.parse(item.description).map((item1) => {
                    item1.operationBtns &&
                      item.operationBtns.push(item1.operationBtns[0]);
                  });
                item.path = this.workView;
              } else {
                item.description &&
                  JSON.parse(item.description).map((item1) => {
                    if (roleCode == item1.role) {
                      item1.operationBtns &&
                        item.operationBtns.push(item1.operationBtns[0]);
                    }
                  });
                item.path = this.workView;
              }
            }

            item.num = tree.num + "." + item.num;

            item.btns = [
              {
                name: "查看", // 按钮名称，优先显示icon
                type: "text",
                size: "small",
                method: "see", // 点击执行该页面methods中对应的方法
                // field: "id", // 控制按钮显示隐藏的字段，目前仅支持单一字段，常显的按钮不需要传
                // value: [1, 2], // 需要根据字段控制按钮显示隐藏，当state值不等于该数组的任何一个值的时候显示。逻辑this.table.data的某条数据state!=1&&state!=2时显示该行的这个按钮
                icon: "iconbianji", // 按钮显示的图标,不传显示中文
                // code: "2334455", // 按钮的唯一值,用于角色按钮权限控制，不传默认不进行权限控制
              },
            ];
            if (item.editable) {
              console.log("进来了");
              item.btns.push({
                name: "编辑",
                method: "edit",
                type: "text",
                size: "small",
                icon: "el-icon-document",
                className: "font-size-20",
              });
              item.btns.push({
                name: "删除",
                method: "delete",
                type: "text",
                size: "medium",
                icon: "el-icon-document",
                className: "font-size-20",
              });
            }
            if (
              item.memberStatus == 0 &&
              utils.checkCodeInArr("M002_003_004")
            ) {
              item.btns.push({
                name: "成员管理", // 按钮名称，优先显示icon
                type: "text",
                size: "small",
                method: "memberCatch", // 点击执行该页面methods中对应的方法
                // field: "id", // 控制按钮显示隐藏的字段，目前仅支持单一字段，常显的按钮不需要传
                // value: [1, 2], // 需要根据字段控制按钮显示隐藏，当state值不等于该数组的任何一个值的时候显示。逻辑this.table.data的某条数据state!=1&&state!=2时显示该行的这个按钮
                icon: "iconbianji", // 按钮显示的图标,不传显示中文
              });
            }

            if (item.operationBtns) {
              item.operationBtns.forEach((items) => {
                items.name = items.btnName;
              });
            }

            if (item.operationBtns) {
              // console.log('item.operationBtns.before',item.operationBtns)
              item.operationBtns = item.operationBtns.filter(
                (item) => item.name != ""
              );
              // console.log('item.operationBtns.after',item.operationBtns)
              item.btns = [...item.btns, ...item.operationBtns];
            }

            return item;
          });
          resolve(list);
        }
      });
    }, */
    delete(row) {
      this.$SrUtils.showConfirmMessage.call(this, {
        title: "提示",
        content: "此操作将删除此项目, 是否继续?",
        okFun: () => {
          queryRemove({ id: row.id }).then((res) => {
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
    pigeonhole(row) {
      this.$SrUtils.showConfirmMessage.call(this, {
        title: "提示",
        content: "此操作将归档此项目, 是否继续?",
        okFun: () => {
          queryRemove({ id: row.id }).then((res) => {
            if (res.msg.code == "0000") {
              this.$message({
                type: "success",
                message: "归档成功",
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
            message: "已取消归档",
          });
        },
      });
    },
    export() {
      // api_userSetExport({permissionCode:'M002_001',access_token:sessionStorage.getItem('token')}).then((res) => {
      // });
      window.open(
        `${
          config.baseUrl
        }/jfzg/history/project/export?permissionCode=M002_003&access_token=${sessionStorage.getItem(
          "token"
        )}`
      );
    },
    btnValidate(row, item) {
      if (row.name == "编辑" && item.editable) {
        return true;
      }
      if (row.name == "删除" && item.editable) {
        return true;
      }

      return false;
    },
    getTbData() {
      const result =
        this.search.formData.dateTime && this.search.formData.dateTime !== ""
          ? this.search.formData.dateTime.split("-")
          : [];
      console.log(result);
      const obj = {
        year: result[0] ? result[0] : "",
        month: result[1] ? result[1] : "",
      };
      console.log("obj", obj);
      // delete this.search.formData.dateTime;
      console.log(this.search.formData);
      // debugger;
      let param = {
        pageNum: this.table.page.pageNum,
        pageSize: this.table.page.pageSize,
        ...this.search.formData,
        ...obj,
      };
      getList(param).then((res) => {
        console.log("res", res);
        this.table.page.pages = res.data.pages;
        this.table.page.total = res.data.total;

        /*   let { roleCode } = this.userInfo.currentRole;
        let { jfid } = this.userInfo;
        res.data.records.forEach((item) => {
          if (item.todo) {
            item.operationBtns = [];
            if (item.assignee == jfid) {
              item.description &&
                JSON.parse(item.description).map((item1) => {
                  item1.operationBtns &&
                    item.operationBtns.push(item1.operationBtns[0]);
                });
              item.path = this.workView;
            } else {
              item.description &&
                JSON.parse(item.description).map((item1) => {
                  if (roleCode == item1.role) {
                    item1.operationBtns &&
                      item.operationBtns.push(item1.operationBtns[0]);
                  }
                });
              item.path = this.workView;
            }
          }
        }); */
        this.table.data = res.data.records;
        console.log("表格", this.table.data);
      });
    },
    getTbHeader() {
      api_userSetQuery({ permissionCode: "M002_009" }).then((res) => {
        this.isTableHeaderId = res.data.id;
        let headerData = JSON.parse(res.data.data).sort(
          (a, b) => a.index - b.index
        );
        this.table.tableConfig.operateConfig.allTableHeader = headerData;
        this.table.tableConfig.header = headerData.filter((item) => {
          if (item.prop == "num") {
            item.width = "80px";
          }
          return item.isShow;
        });
      });
    },
    see(row) {
      this.$router.push({
        name: "expenseSettlementView",
        query: {
          id: row.id,
          //   processId: row.processId,
          //   templateId: row.templateId,
        },
      });
    },
    pageChanged(val) {
      this.table.page.pageNum = val;
      this.getTbData();
    },
    sizeChanged(val) {
      this.table.page.pageNum = 1;
      this.table.page.pageSize = val;
      this.getTbData();
    },
    settingHeader() {
      this.dialogVisible = true;
    },
    saveHeaderList(data) {
      api_userSetSave({
        data: JSON.stringify(data),
        permissionCode: "M002_009",
        id: this.isTableHeaderId,
      }).then((res) => {
        if (res.msg.code == "0000") {
          this.getTbData();
          this.getTbHeader();
        }
      });
    },
  },
};
</script>
  
  <style scoped></style>
  