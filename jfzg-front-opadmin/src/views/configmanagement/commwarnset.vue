<template>
  <div class="peoplem">
    <div class="container">
      <el-container>
        <el-aside class="el-aside" width="362px">
          <p class="title">角色</p>
          <ul class="ul_list">
            <li
              v-for="(a,index) in dict.dicttypelist"
              :class="{ red:changeRed2 == index}"
              :key="index"
              @click="selectHandle(a.roleName,index,a.roleCode)"
            >{{a.roleName}}</li>
          </ul>
        </el-aside>
        <el-main class="el-main">
          <p class="title_M">{{setname}}</p>
          <FTable
            class="tableData"
            :data="table.data"
            :config="table.config"
            :page="table.page"
            @pageChanged="getPageData"
            @sizeChanged="getSizeDate"
          ></FTable>
        </el-main>
      </el-container>
    </div>
    <!-- 弹框 -->
    <div class="springBox">
      <el-dialog
        class="common-dialog"
        :title="dialog.title"
        :visible.sync="dialog.dialogVisible"
        :width="dialog.width"
        :before-close="bClose"
        append-to-body
      >
        <div class="springBox_form">
          <FForm
            ref="modelMgrRef"
            :config="form.config"
            :form="form.data"
            :rules="form.rules"
            :enums="form.enums"
            refForm="modelMgrRefForm"
            @eventNotify="eventNotify"
            :column="2"
          ></FForm>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" @click="springBox_determine(dialog.type)">确定</el-button>
          <el-button type size="small" @click="colseDialog">取消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>


<script>
import FTable from "@/components/FTable/index.vue";
import FForm from "@/components/FForm/form-add.vue";
import FSearch from "@/components/FSearch/index.vue";
import {
  api_queryRoleList,
  api_updateCommWarnInfo,
  api_queryCommWarnList,
} from "@/api/configManage/configManage";

export default {
  name: "peoplemanage",
  components: {
    FTable,
    FSearch,
    FForm,
  },
  data() {
    return {
      setname: "",
      changeRed2: "0",
      dict: {
        dicttypelist: [],
      },

      dialog: {
        dialogVisible: false,
        width: "",
        title: "",
        type: "",
        buid: "",
      },
      form: {
        title: "表单标题",
        config: [
          {
            col: 24,
            type: "text",
            name: "阶段名称",
            placeholder: "请输入阶段名称",
            bind: "phaseName",
            trigger: "blur", // 校验时机
            // required: "请输入阶段名称"
          },
          {
            col: 24,
            type: "text",
            name: "处理期限",
            placeholder: "请输入处理期限",
            bind: "limitDay",
            // required: "请输入处理期限"
          },
          {
            col: 24,
            type: "text",
            name: "待办提醒时间",
            placeholder: "请输入待办到期提醒时间",
            bind: "remindDay",
            //  required: "请输入待办到期提醒时间"
          },
          {
            col: 24,
            type: "textarea",
            name: "提示说明",
            placeholder: "请输入提示说明",
            bind: "remark",
            // required: "请输入提示说明"
          },
        ],
        data: {
          phaseName: "",
          limitDay: "",
          remindDay: "",
          remark: "",
        },
      },
      table: {
        data: [], // 表格数据
        config: {
          fixed: "right",
          operationWidth: 100, // 操作列的宽度，不传默认180
          title: "", // 表格标题
          header: [
            // 表格列配置
            {
              name: "阶段名称",
              prop: "phaseName",
           
            },
            {
              name: "处理期限",
              prop: "limitDay",
               width:200
            },
            {
              name: "待办到期提醒时间",
              prop: "remindDay",
                width:200
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
          pages: 5, //总页数
          pageSize: 5, //每页展示多少个
          pageNum: 1, //当前页
        },
      },
      search: {
        textMaxNum: 4, // label 最多几个字默认4个
        showExpand: false, // 是否显示展开收起，默认超过三个显示
        minNum: 4, // 收起显示几个, 默认3个
        config: [
          {
            type: "text",
            name: "字典值",
            placeholder: "请输入关键词",
            bind: "keyword", // 对应this.search.data对象的field1
          },
        ],
        form: {
          keyword: "",
        },
      },
      itemcode: "",
    };
  },
  mounted() {
    this.queryRolrList();
  },
  methods: {
    // 获取角色列表
    queryRolrList() {
      api_queryRoleList().then((res) => {
        //console.log(res);
        if (res.msg.message == "SUCCESS") {
          this.$set(this.dict, "dicttypelist", res.data);
          this.itemcode = res.data[0].roleCode;
          this.setname = res.data[0].roleName;
          this.querydictList(this.itemcode);
        }
      });
    },

    // 选择设置成员名称
    selectHandle(name, index, code) {
      this.setname = name;
      this.changeRed2 = index;
      this.itemcode = code;
      this.search.form.keyword = "";
      this.table.page.pageNum = 1;
      this.table.page.pageSize = 5;
      this.querydictList(code);
    },
    // 获取待办预警列表
    querydictList(code) {
      let params = {
        page: this.table.page.pageNum,
        size: this.table.page.pageSize,
        roleCode: code,
      };

      api_queryCommWarnList(params).then((res) => {
        //console.log(res);
        if (res.msg.message == "SUCCESS") {
          this.$set(this.table, "data", res.data.list);
          this.$set(this.table.page, "pageNum", res.data.pageNum);
          this.$set(this.table.page, "pageSize", res.data.pageSize);
          this.$set(this.table.page, "total", res.data.total);
        }
      });
    },

    //   编辑
    edit(row) {
      //console.log(row);
      this.dialog = {
        dialogVisible: true,
        width: "560px",
        title: "编辑信息",
        type: 1,
      };
      this.form.data = {
        id: row.id,
        limitDay: row.limitDay,
        remindDay: row.remindDay,
        phaseName: row.phaseName,
        remark: row.remark,
      };
    },
    eventNotify(ref) {
      this.$refs[ref].init();
    },
    // 弹框确定
    springBox_determine(type) {
      var parameter = new Promise((resolve, reject) => {
        this.$refs["modelMgrRef"].$refs["modelMgrRefForm"].validate((valid) => {
          if (valid) {
            resolve();
          }
        });
      });
      Promise.all([parameter]).then(() => {
        // 编辑操作
        if (type == 1) {
          let data = this.form.data;

          api_updateCommWarnInfo(data).then((res) => {
            //console.log(res);
            if (res.msg.code == "0000") {
                 this.$message({
                type: "success",
                message: "编辑成功!",
              });
              this.colseDialog();
              this.querydictList(this.itemcode);
            }else{
               this.$message.error("编辑失败");
            }
          });
        }
      });
    },
    // 弹框取消
    colseDialog() {
      this.$refs["modelMgrRef"].$refs["modelMgrRefForm"].resetFields();
      this.dialog.dialogVisible = false;
    },
    // 弹框关闭前回调
    bClose(done) {
      this.$refs["modelMgrRef"].$refs["modelMgrRefForm"].resetFields();
      done();
    },
    getPageData(pageNum) {
      this.table.page.pageNum = pageNum;
      this.querydictList(this.itemcode);
    },
    getSizeDate(pageSize) {
      this.table.page.pageSize = pageSize;
      this.querydictList(this.itemcode);
    },
  },
};
</script>

<style lang="scss" scoped>
.leftlist_title,
.sec_title {
  font-size: 16px;
  color: #262626;
  font-family: "黑体";
  font-weight: Medium;
  padding-left: 32px;
  height: 54px;
  line-height: 54px;
  border-bottom: 1px solid #f0f0f0;
}
.sec_title {
  border-bottom: none;
}
.btn {
  padding-left: 32px;
}
.peoplem {
  .container {
    width: 100%;
    overflow: hidden;
    padding: 0px;
    .title {
      height: 54px;
      line-height: 54px;
      width: 100%;
      padding-left: 32px;
      border-bottom: 1px solid #eee;

      font-size: 16px;
      color: #262626;
    }
    .el-aside {
      background: white;
      border: 1px solid #eee;
      padding: 0px;
 
      .ul_list {
        height: 520px;
        overflow: auto;
        padding-top: 16px;
        .red {
          background-color: #0099FF;
          color: white;
        }
        li {
          padding-left: 32px;
          list-style-type: none;
          height: 38px;
          line-height: 38px;
          color: #262626;
          font-size: 14px;
        }
        li:hover {
         cursor: pointer;
        }
      }
    }
    /deep/ .el-main {
      .btn {
        padding: 16px 24px 16px 32px;
      }

      padding: 0;
      .title_M {
        height: 54px;
        line-height: 54px;
        padding-left: 32px;
      }
    }
  }

  .m_title {
    font-size: 16px;
    color: #262626;
    font-family: "黑体";
    font-weight: Medium;
    padding: 24px;
  }

  #search {
    .el-input__inner {
      width: 450px;
    }
  }
  .tableData {
    padding-left: 32px;
  }
}
</style>