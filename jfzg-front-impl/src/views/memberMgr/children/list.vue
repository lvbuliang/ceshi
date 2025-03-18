<template>
  <div class="total-page">
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
      :config="table.tableConfig"
      @sortChange="sortChange"
      :page="table.page"
    ></SrTable>
  </div>
</template>

<script>
import {
  queryBizunitsByProperty,
  listByTopicAndItem,
  api_userSetQuery,
  api_userSetSave,
  queryBizunitsByProperties
} from "@/api/index.js";
import { permissionCode } from "../const.js";
import { api_queryMemberProjects } from "@/api/memberMgr/memberMgrList.js";

export default {
  data() {
    return {
      isTableHeaderId: "",
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
          header: [],
          selectionConfig: {
            display: false,
            width: "70"
          },
          operateConfig: {
            display: true,
            label: "操作",
            width: "156",
            fixed: "right",
            allTableHeader: "",
            saveHeaderList: this.saveHeaderList
          },
          innerBtn: [
            // 表格内部操作按钮，不需要操作列的innerBtn 写成false
            {
              name: "维护人员", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "see" // 点击执行该页面methods中对应的方法
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
        }
      },
      search: {
        size: "small",
        labelConfig: {
          labelWidth: "90px",
          labelSuffix: ":",
          labelPosition: "right"
        },
        config: [
          {
            type: "text",
            placeholder: "请输入项目名称",
            bind: "projectName", // 对应this.search.data对象的field1
            disabled: false,
            class: "txt_project"
          },
          {
            type: "select",
            placeholder: "请选择承建单位",
            bind: "contractUnit",
            data: "cjdwList", // 对应enum中的stateList
            class: "getyearclass",
            disabled: false
          },
          {
            type: "select",
            placeholder: "请选择建设单位",
            bind: "constructionUnit",
            data: "jsdwList", // 对应enum中的stateList
            class: "getyearclass",
            disabled: false
          },
          // {
          //   type: "select",
          //   placeholder: "请选择项目类型",
          //   bind: "projectType",
          //   data: "projectTypeList", // 对应enum中的stateList
          //   class: "getyearclass",
          //   disabled: false
          // }
        ],
        enum: {
          projectTypeList: [],
          cjdwList: [],
          jsdwList: []
        },
        formData: {
          projectName: "",
          contractUnit: "",
          constructionUnit: "",
          projectType: ""
        }
      }
    };
  },
  computed: {
    userInfo() {
      return this.$store.getters.userInfo;
    }
  },
  methods: {
    // 处理用户信息
    handleMemberInfo() {
      let userType = this.userInfo.bizunitInfos[0].buProperty;
      if (userType == "2") {
        this.search.config.splice(2,1)
      } else if (userType == "3") {
        this.search.config.splice(1,1)
      }
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
    getTbHeader() {
      api_userSetQuery({ permissionCode: permissionCode }).then(res => {
        this.isTableHeaderId = res.data.id;
        let headerData = JSON.parse(res.data.data).sort(
          (a, b) => a.index - b.index
        );
        this.table.tableConfig.operateConfig.allTableHeader = headerData;
        this.table.tableConfig.header = headerData.filter((item) => {
          if (item.prop == "jsdwTotal" ||item.prop == "cjdwTotal" ||item.prop == "jldwTotal" ) {
            item.sortable = 'custom';
          }
          if (item.prop == "endDate" ||item.prop == "beginDate" ) {
            item.sortable = 'custom';
            
          }
          return item.isShow
        });
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
    // 获取表格数据
    getTbData() {
      let param = {
        pageNum: this.table.page.pageNum,
        pageSize: this.table.page.pageSize,
        ...this.search.formData
      };
      this.loading = true;
      api_queryMemberProjects(param).then(res => {
        if (res) {
          this.table.page.pages = res.data.pages;
          this.table.page.total = res.data.total;
          this.table.data = res.data.records;
        } else {
          this.table.data = [];
        }
        this.loading = false;
      });
    },
    saveHeaderList(data) {
      api_userSetSave({
        data: JSON.stringify(data),
        permissionCode: permissionCode,
        id: this.isTableHeaderId
      }).then(res => {
        if (res.msg.code == "0000") {
          this.getTbData();
          this.getTbHeader();
        }
      });
    },
    // 查看行数据
    see(row) {
      this.$router.push({
        name: "memberMgrView",
        query: {
          projectId: row.projectId
        }
      });
    },
    getQueryBizunitsByProperty() {
      // 获取承建单位
      queryBizunitsByProperty({ buPropertyEnum: "CJDW" }).then(res => {
        if (res?.data) {
          this.$set(
            this.search.enum,
            "cjdwList",
            this.$utils.enumsDataNameValue(
              res.data,
              "buName",
              "buid",
              "label",
              "value"
            )
          );
        }
      });
      // 获取建设单位
      queryBizunitsByProperties([
        { buPropertyEnum: "JSDW" },
        { buPropertyEnum: "TCDW" },
      ]).then(res => {
        if (res?.data) {
          this.$set(
            this.search.enum,
            "jsdwList",
            this.$utils.enumsDataNameValue(
              res.data,
              "buName",
              "buid",
              "label",
              "value"
            )
          );
        }
      });
    },
    getListByTopicAndItem() {
      listByTopicAndItem({ topic: "JFZG_XMKGL_TYPE" }).then(res => {
        let type_list = this.$utils.enumsDataNameValue(
          res.data,
          "chName",
          "itemCode",
          "label",
          "value"
        );
        this.$set(this.search.enum, "projectTypeList", type_list);
      });
    }
  },
  created() {
    this.getTbHeader();
    this.getTbData();
    this.getQueryBizunitsByProperty();
    this.getListByTopicAndItem();
    this.handleMemberInfo();
  }
};
</script>
<style lang="scss" scoped>
.searchPage {
  ::v-deep {
    .getyearclass {
      width: 160px !important;
    }
    .txt_project {
      width: 160px !important;
    }
  }
}
</style>
