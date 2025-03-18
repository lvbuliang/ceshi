<template>
  <div class="peoplel" v-if="$route.meta.lv == 2">
    <FSearch :form="search" @queryList="getProjectList(1)"></FSearch>
    <div class="btn" style="margin-bottom: 16px">
      <el-button type="primary" size="small" @click="add">
        <i class="el-icon-circle-plus-outline el-icon--left"></i>新增待办模板
      </el-button>
    </div>

    <FTable
      class="tableData"
      :data="table.data"
      :config="table.config"
      :page="table.page"
      @pageChanged="getPageData"
      @sizeChanged="getSizeDate"
      :other-config="otherConfig"
      :maxHeight="2000"
    >
    </FTable>
  </div>
  <router-view v-else></router-view>
</template>

<script>
import FTable from "@/components/FTable/index.vue";
import FForm from "@/components/FForm/form-add.vue";
import FSearch from "@/components/FSearch/index.vue";
import { getTodoList } from "@/api/autotemplatemanagement/autotemplatemanagement.js";
import { listModule } from "@/api/index.js";
export default {
  components: {
    FTable,
    FSearch,
    FForm,
  },
  data() {
    return {
      otherConfig: {
        labelNum: 150,
      },
      search: {
        textMaxNum: 4, // label 最多几个字默认4个
        showExpand: false, // 是否显示展开收起，默认超过三个显示
        minNum: 3, // 收起显示几个, 默认3个
        config: [
          {
            type: "text",
            name: "关键字",
            placeholder: "请输入关键字",
            bind: "keyword", // 对应this.search.data对象的field1
          },
        ],

        form: {
          keyword: "",
        },
      },
      table: {
        data: [], // 表格数据
        config: {
          fixed: "right",
          operationWidth: 250, // 操作列的宽度，不传默认180
          title: "", // 表格标题
          header: [
            // 表格列配置
            {
              name: "模板名称",
              prop: "templateName",
            },
            {
              name: "模板编号",
              prop: "templateCode",
            },
            {
              name: "来源",
              prop: "platformName",
            },
            {
              name: "业务编码",
              prop: "modelName",
              width: 120,
            },
            {
              name: "待办期限（天）",
              prop: "limitDay",
              width: 150,
            },
            {
              name: "内容",
              prop: "templateContext",
            },
            {
              name: "创建时间",
              prop: "createTime",
            },
          ],
          innerBtn: [
            // 表格内部操作按钮，不需要操作列的innerBtn 写成false
            {
              name: "编辑", // 按钮名称，优先显示icon
              method: "edit", // 点击执行该页面methods中对应的方法
              className: "font-size-20",
            },
          ],
        },
        page: {
          // 分页配置
          total: 12, //总条数
          pages: 2, //总页数
          pageSize: 5, //每页展示多少个
          pageNum: 1, //当前页
        },
      },
      newData: "",
      platformList: {
        JFZG_CLOUD: "解放智管",
      },
      listModule: {},
    };
  },
  watch: {
    $route: {
      handler(val, oldval) {
        if (val) {
          this.table.page.pageNum = 1;
          this.getProjectList(1);
        }
      },
      // 深度观察监听
      deep: true,
    },
  },

  created() {
    this.getMoubleCode();
  },
  mounted() {
    setTimeout(() => {
      this.getProjectList(1);
    }, 500);
  },
  methods: {
    getMoubleCode() {
      listModule().then((res) => {
        if (res.msg.code === "0000") {
          res.data.forEach((item) => {
            this.listModule[item.moduleCode] = item.moduleName;
          });
        }
      });
    },
    add(row) {
      this.$router.push({
        name: "todotemplateadd",
      });
    },
    edit(row) {
      this.$router.push({
        name: "todotemplatedit",
        query: {
          rowData: JSON.stringify(row),
        },
      });
    },
    getPageData(pageNum) {
      this.table.page.pageNum = pageNum;
      this.getProjectList();
    },
    getSizeDate(pageSize) {
      this.table.page.pageSize = pageSize;
      this.getProjectList(1);
    },
    eventNotify(ref) {
      this.$refs[ref].init();
    },
    // 获取项目列表
    getProjectList(page) {
      if (page) {
        this.table.page.pageNum = page;
      }
      let params = {
        pageNum: this.table.page.pageNum,
        pageSize: this.table.page.pageSize,
      };

      const searchForms = this.search.form;
      Object.keys(searchForms).map((item) => {
        if (searchForms[item]) {
          params[item] = searchForms[item];
        }
      });

      getTodoList(params).then((res) => {
        console.log(res);
        if (res.msg.message == "SUCCESS") {
          let Data = res.data.records;
          Data.map((item) => {
            item.modelName = this.listModule[item.modelCode];
            item.platformName = this.platformList[item.platform];
          });

          this.$set(this.table, "data", Data);
          this.$set(this.table.page, "total", res.data.total);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.peoplel {
  /deep/ .page {
    margin-top: 16px !important;
  }

  .tableData /deep/.el-table__body-wrapper {
  }
}
</style>
