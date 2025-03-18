<template>
  <div
    class="designer"
    v-if="$route.name == 'person' || $route.name == 'personAudit'"
  >
    <div class="searchPage">
      <SrSearch
        :search="search"
        :searchExpand="true"
        :showTextBtns="true"
        :hideBtns="false"
        @queryList="pageChanged(1)"
      ></SrSearch>
    </div>
    <SrTable
      @pageChanged="pageChanged"
      :data="table.data"
      @sizeChanged="sizeChanged"
      @sortChange="sortChange"
      :config="table.tableConfig"
      :page="table.page"
    ></SrTable>
    <designDailog
      ref="designDailog"
      :visible="visible"
      :title="'新增人员'"
      @SrDialogClose="SrDialogClose"
      @SrDialogSubmit="SrDialogSubmit"
      @handleClose="handleClose"
    />
  </div>
  <router-view v-else></router-view>
</template>

<script>
import store from "@/store";
import config from "@/settings.js";
import designDailog from "../components/designDailog.vue";
import { api_userSetQuery, api_userSetSave } from "@/api/index.js";
import {
  api_delDesigner,
  api_getDesignerList,
  api_saveDesigner,
} from "@/api/design/index.js";
export default {
  components: {
    designDailog,
  },
  data() {
    return {
      visible: false,
      dialogTitle: "新增人员",
    
      tableList: {
        header: [],
      },
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
            placeholder: "请输入公司名称关键字",
            bind: "companyName", // 对应this.search.data对象的field1
          },
          {
            type: "text",
            placeholder: "请输入人员名称关键字",
            bind: "name", // 对应this.search.data对象的field1
          },
        ],
        enum: {
          // 搜索项下拉数据
        },
        btns: [
          // {
          //   name: "导出",
          //   click: this.export,
          //   permissionCode: "M003_M006_002_001",
          // },
          {
            name: "新增",
            click: this.add,
            type: "primary",
            permissionCode: "M004_M006_002_001",
          },
          // {
          //   name: "导出",
          //   click: this.export,
          //   permissionCode: "M004_M006_002_002",
          // },
        ],
        formData: {
          companyName: "",
          name: "",
          orderByColumn: "", // 基于哪个字段排序
          orderBy: ""// DESC降序, ASC升序
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
            width: "156",
            fixed: "right",
            allTableHeader: "",
            saveHeaderList: this.saveHeaderList,
            export: this.export,
            exportPermissionCode:
              this.$route.name == "personAudit"
                ? "M004_M006_002_002"
                : "M003_M006_002_001",
          },
          innerBtn: [
            // 表格内部操作按钮，不需要操作列的innerBtn 写成false
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
            {
              name: "删除",
              method: "delete",
              type: "text",
              size: "small",
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
    };
  },
  mounted() {
    this.getTbHeader();
  },
  computed: {
    userInfo() {
      return store.getters.userInfo;
    },
  },
  watch: {
    $route: {
      handler: function(params) {
        if (params.name == "person" || params.name == "personAudit") {
          this.getTbHeader();
        }
      },
    },
  },
  methods: {
    btnValidate() {
      if (this.$route.name == "person") {
        return false;
      } else {
        return true;
      }
    },
    handleClose() {
      this.visible = false;
    },
    SrDialogClose() {
      this.visible = false;
    },
    SrDialogSubmit(data) {
      api_saveDesigner(data).then((res) => {
        if (res.msg.code == "0000") {
          this.getTbData(1);
          this.visible = false;
        }
      });
    },
    add() {
      this.dialogTitle = "新增人员";
      this.visible = true;
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
    see(data) {
      this.$router.push({
        name: `${this.$route.name}View`,
        query: {
          id: data.id,
          companyCode: data.companyCode,
        },
      });
    },
    delete(data) {
      this.$SrUtils.showConfirmMessage.call(this, {
        title: '确认删除该人员',
        content: '删除后该人员所有信息将被删除！',
        okFun: () => {
          api_delDesigner({ designerId: data.id }).then((res) => {
            if (res.msg.code == "0000") {
              this.$message({
                type: "info",
                message: "删除成功",
              });
              this.getTbData(1);
            }
          });
        },
        cancelFun: () => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        }
      })
    },
    //表头获取
    getTbHeader() {
      api_userSetQuery({ permissionCode: "M003_M006_002" }).then((res) => {
        this.isTableHeaderId = res.data.id;
        let headerData = JSON.parse(res.data.data).sort(
          (a, b) => a.index - b.index
        );
        this.table.tableConfig.operateConfig.allTableHeader = headerData;
        this.table.tableConfig.header = headerData.filter((item) => {
          if ( item.prop == "integratedScore" || item.prop == "specialScore" || item.prop == "communicateScore" || item.prop == "responsivityScore") {
            item.sortable = 'custom';
            item.width = "180px"
          }
          return item.isShow
        });
        this.getTbData();
      });
    },
    //表头保存
    saveHeaderList(data) {
      api_userSetSave({
        data: JSON.stringify(data),
        permissionCode: "M003_M006_002",
        id: this.isTableHeaderId,
      }).then((res) => {
        if (res.msg.code == "0000") {
          // this.getTbData();
          this.getTbHeader();
        }
      });
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
    sortChange(column) {
      if (column.order === "ascending") {
        this.search.formData['orderByColumn'] = column.prop
        this.search.formData['orderBy'] = 'ASC'
      } else if (column.order === "descending") {
        this.search.formData['orderByColumn'] = column.prop
        this.search.formData['orderBy'] = 'DESC'
      } else {
        this.search.formData['orderByColumn'] = ''
        this.search.formData['orderBy'] = ''
      }
       this.getTbData()
    },
    getTbData(index) {
      if (index) {
        this.table.page.pageNum = index;
      }
      let param = {
        pageNum: this.table.page.pageNum,
        pageSize: this.table.page.pageSize,
        ...this.search.formData,
      };
      if (param.orderByColumn == '') {
        delete param.orderByColumn
      }
      if (param.orderBy == '') {
        delete param.orderBy
      }
      api_getDesignerList(param).then((res) => {
        if (res.msg.code == "0000") {
          this.table.page.total = res.data.total;
          this.table.data = res.data.records;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
// .designer {
// }
</style>
