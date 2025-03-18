<template>
  <div class="peoplem">
    <p class="m_title" v-if="false">
      项目名称：
      <span>智慧监控项目系统</span>
    </p>
    <div class="btnAdd">
      <el-button type="primary" size="small" @click="addType">
        <i class="el-icon-circle-plus-outline el-icon--left"></i>新增字段类型
      </el-button>
    </div>
    <div class="container">
      <el-container>
        <el-aside class="el-aside" width="362px">
          <p class="title">字典类型</p>
          <ul class="ul_list">
            <li
              v-for="(a, index) in dict.dicttypelist"
              :class="{ red: changeRed2 == index }"
              :key="index"
              class="li_list"
              @click="selectHandle(a.chName, index, a.itemCode)"
            >
              {{ a.chName }}
            </li>
          </ul>
        </el-aside>
        <el-main class="el-main">
          <p class="title_M">{{ setname }}</p>
          <FSearch
            :form="search"
            @queryList="querydictList(itemcode, 1)"
          ></FSearch>
          <div class="btn">
            <el-button type="primary" size="small" @click="add">
              <i class="el-icon-circle-plus-outline el-icon--left"></i>新增
            </el-button>
          </div>

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
            v-if="dialog.type === 3"
            ref="modelMgrRef"
            :config="formType.config"
            :form="formType.data"
            :rules="formType.rules"
            :enums="formType.enums"
            refForm="modelMgrRefForm"
            @eventNotify="eventNotify"
            :column="2"
          ></FForm>
          <FForm
            v-else
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
          <el-button
            type="primary"
            size="small"
            @click="springBox_determine(dialog.type)"
            >确定</el-button
          >
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
  api_queryDicttypeList, //获取字典类型列表
  api_queryDictList, //获取字典列表
  api_addDictRecord, //添加
  api_addDictRecordType, //添加类型
  api_editDictRecord, //编辑
  api_deleteDictRecord, //删除
} from "@/api/dictManage/dictManage";
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
      itemcode: "",
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
      formType: {
        title: "表单标题",
        config: [
          {
            col: 24,
            type: "text",
            name: "字段类型名称",
            placeholder: "请输入字段类型名称",
            bind: "chName",
            trigger: "blur", // 校验时机
            required: "请输入中文名称", // 必填需要指定提示信息
          },
          {
            col: 24,
            type: "text",
            name: "字段类型code",
            placeholder: "请输入字段类型code",
            bind: "code",
               trigger: "blur", // 校验时机
            required: "请输入字段类型code", // 必填需要指定提示信息
          },
        ],
        data: {
          chName: "",
          code: "",
        },
      },
      form: {
        title: "表单标题",
        config: [
          {
            col: 24,
            type: "text",
            name: "中文名称",
            placeholder: "请输入中文名称",
            bind: "chName",
            trigger: "blur", // 校验时机
            required: "请输入中文名称", // 必填需要指定提示信息
          },
          {
            col: 24,
            type: "text",
            name: "英文名称",
            placeholder: "请输入英文名称",
            bind: "enName",
          },
          {
            col: 24,
            type: "text",
            name: "数据值全名（中）",
            placeholder: "请输入数据值全名（中）",
            bind: "fullCnname",
          },
          {
            col: 24,
            type: "text",
            name: "数据值全名（英）",
            placeholder: "请输入数据值全名（英）",
            bind: "fullEnname",
          },
          {
            col: 24,
            type: "textarea",
            name: "数据描述",
            placeholder: "请输入数据描述（不超过255个字）",
            bind: "memo",
            maxlength: 255,
          },
        ],
        data: {
          codeId: "",
          topic: "",
          chName: "",
          enName: "",
          fullCnname: "",
          fullEnname: "",
          memo: "",
        },
      },

      table: {
        data: [], // 表格数据
        config: {
          fixed: "right",
          operationWidth: 140, // 操作列的宽度，不传默认180
          title: "", // 表格标题
          header: [
            // 表格列配置
            {
              name: "中文名称",
              prop: "chName",
            },
            {
              name: "英文名称",
              prop: "enName",
              width: 200,
            },
            {
              name: "数据值全名（中）",
              prop: "fullCnname",
              width: 200,
            },
            {
              name: "数据值全名（英）",
              prop: "fullEnname",
              width: 200,
            },
            {
              name: "数据描述",
              prop: "memo",
              width: 200,
            },
          ],
          innerBtn: [
            // 表格内部操作按钮，不需要操作列的innerBtn 写成false
            {
              name: "编辑", // 按钮名称，优先显示icon
              method: "edit", // 点击执行该页面methods中对应的方法
              className: "font-size-20",
            },
            {
              name: "删除", // 按钮名称，优先显示icon
              method: "delete", // 点击执行该页面methods中对应的方法
              className: "font-size-20",
              // validate: this.btnValidate,
            },
          ],
        },
        page: {
          // 分页配置
          total: 0, //总条数
          pages: 0, //总页数
          pageSize: 5, //每页展示多少个
          pageNum: 1, //当前页
        },
      },

      search: {
        textMaxNum: 8, // label 最多几个字默认4个
        showExpand: false, // 是否显示展开收起，默认超过三个显示
        minNum: 4, // 收起显示几个, 默认3个
        config: [
          {
            type: "text",
            name: "字典值",
            placeholder: "请输入字典值",
            bind: "keyword", // 对应this.search.data对象的field1
          },
        ],
        form: {
          keyword: "",
        },
      },
    };
  },
  mounted() {
    this.querydicttypeList();
  },
  methods: {
    // 获取字典类型列表
    querydicttypeList() {
      api_queryDicttypeList().then((res) => {
        // console.log(res);
        if (res.msg.message == "SUCCESS") {
          let arr = [];
          res.data.forEach((item, index) => {
            if (item.itemCode != "SERVICE_CAPABILITY") {
              arr.push(item);
            }
          });
          this.$set(this.dict, "dicttypelist", arr);
          this.itemcode = arr[0].itemCode;
          console.log(this.itemcode);
          this.setname = arr[0].chName;
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
    // 获取字典列表
    querydictList(code, page) {
      //console.log(this.table.page.pageSize);
      let params = {
        page: this.table.page.pageNum,
        size: this.table.page.pageSize,
        topic: code,
      };

      const searchForms = this.search.form;
      Object.keys(searchForms).map((item) => {
        if (searchForms[item]) {
          params[item] = searchForms[item];
        }
      });
      if (page) {
        params.page = page;
      }
      api_queryDictList(params).then((res) => {
        //console.log(res);
        if (res.msg.message == "SUCCESS") {
          this.$set(this.table, "data", res.data.list);
          this.$set(this.table.page, "pageNum", res.data.pageNum);
          this.$set(this.table.page, "pageSize", res.data.pageSize);
          this.$set(this.table.page, "total", res.data.total);
        }
      });
    },
    // 删除
    delete(row) {
      this.$confirm("此操作将删除该字典数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          api_deleteDictRecord(row.codeId).then((res) => {
            //console.log(res);
            if (res.msg && res.msg.code == "0000") {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.$set(this.table.page, "pageNum", 1);
              this.$set(this.table.page, "pageSize", 5);
              this.querydictList(this.itemcode);
            } else {
              this.$message.error("删除失败");
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
    // 新增字典类型
    addType() {
      this.formType.data = {};
      this.dialog = {
        dialogVisible: true,
        width: "560px",
        title: "添加字典类型",
        type: 3,
      };
    },
    // 新增
    add() {
      this.form.data = {};
      this.dialog = {
        dialogVisible: true,
        width: "560px",
        title: "添加字典值",
        type: 0,
      };
    },
    //   编辑
    edit(row) {
      //console.log(row);
      this.dialog = {
        dialogVisible: true,
        width: "560px",
        title: "编辑项目信息",
        type: 1,
      };
      this.form.data = {
        codeId: row.codeId,
        chName: row.chName,
        enName: row.enName,
        fullCnname: row.fullCnname,
        fullEnname: row.fullEnname,
        memo: row.memo,
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
        // 新增操作
        if (type == 0) {
          let data = this.form.data;
          data.topic = this.itemcode;
          api_addDictRecord(data).then((res) => {
            //console.log(res);
            if (res.msg.code == "0000") {
              this.$message({
                type: "success",
                message: "添加成功!",
              });
              this.colseDialog();
              this.querydictList(this.itemcode);
            } else {
              this.$message.error("添加失败");
            }
          });
        }
        // 新增类型
        else if (type === 3) {
          let data = this.formType.data;
          api_addDictRecordType(data).then((res) => {
            //console.log(res);
            if (res.msg.code == "0000") {
              this.$message({
                type: "success",
                message: "添加成功!",
              });
              this.colseDialog();
              this.querydicttypeList();
            } else {
              this.$message.error("添加失败");
            }
          });
        }

        // 编辑操作
        else {
          let data = this.form.data;
          api_editDictRecord(data).then((res) => {
            if (res.msg.code == "0000") {
              this.$message({
                type: "success",
                message: "编辑成功!",
              });
              this.colseDialog();
              this.querydictList(this.itemcode);
            } else {
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
    btnValidate(item, row) {
      if (this.itemcode == "INDUSTRY_DIRECTION") {
        return false;
      }
      return true;
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
  .btnAdd {
    margin-bottom: 16px;
  }
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
          background-color: #0099ff;
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
      .search {
        .el-form-item__label {
          width: 100px !important;
        }
      }
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
  /deep/ .search {
    .el-form {
      .el-form-item:nth-child(1) {
        margin-left: 32px;
      }
    }
  }

  .tableData {
    padding-left: 32px;
  }
}
</style>