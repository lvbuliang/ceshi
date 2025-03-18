<template>
  <div class="peoplem">
    <div class="container">
      <el-container>
        <el-main class="el-main">
          <FSearch :form="tableSearch" @queryList="queryTableData()">

          </FSearch>
          <div class="buttonOperation">
            <el-button class="exportbtnFour" type="primary" @click="addFunc()">
              <i class="el-icon-circle-plus-outline el-icon--left"></i>新增
            </el-button>
          </div>
          <SrTable ref="selectTable" @sortChange="sortChange" @pageChanged="handlePageChange" :data="table.data"
            @sizeChanged="handleSizeChange" :config="table.config" :page="table.page">
            <template slot="cellSlot" slot-scope="scope">
              <template v-if="scope.scope.item.prop == 'ruleType'">
                <span v-if="scope.scope.row.ruleType == '0'">临期提醒</span>
                <span v-else>逾期提醒</span>
              </template>

            </template>
          </SrTable>
        </el-main>
      </el-container>
    </div>
    <!-- 弹框 -->
    <div class="springBox">
      <el-dialog class="common-dialog" :title="dialog.title" :visible.sync="dialog.visible" :width="dialog.width"
        :before-close="beforeClose" append-to-body>
        <div class="springBox_form">
          <FForm ref="modelMgrRef" :config="form.config" :form="form.data" :rules="form.rules" :enums="form.enums"
            refForm="modelMgrRefForm" @eventNotify="eventNotify" :column="2">
            <!-- 模块选择 -->
            <template slot="modules">
              <el-select :disabled="dialog.isEdit" v-model="form.data.templateCode" style="border-left: 0">
                <el-option v-for="item in form.enums.modulesList" :key="item.templateId" :label="item.templateName"
                  :value="item.templateCode" :disabled="item.disabled">
                </el-option>
              </el-select>
            </template>
            <!-- 规则类型 -->
            <template slot="ruleType">
              <el-select v-model="form.data.ruleType" style="border-left: 0">
                <el-option v-for="item in form.enums.ruleTypeList" :key="item.id" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </template>
          </FForm>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" @click="submitForm(dialog.isEdit)">确定</el-button>
          <el-button type size="small" @click="closeDialog">取消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import FTable from "@/components/FTable/index.vue";
import FForm from "@/components/FForm/form-add.vue";
import FSearch from "@/components/FSearch/index.vue";

// api
import { api_userSetQuery, api_userSetSave } from '@/api/index.js'
import { api_queryModulesList, api_queryWarningList, api_add, api_delete, api_update } from '@/api/configManage/earlyWarning.js'
export default {
  name: "peoplemanage",
  components: {
    FTable,
    FSearch,
    FForm,
  },
  data() {
    return {
      isTableHeaderId: '',
      roleName: "", //当前登录人名称
      roleCode: "", // 当前角色权限code
      dict: {
        dicttypelist: [],
      },
      //弹框
      dialog: {
        visible: false,
        width: "",
        title: "",
        isEdit: false, //是新增还是编辑进入
        buid: "",
      },
      // 查询
      tableSearch: {
        textMaxNum: 4,
        showExpand: false,
        minNum: 4,
        config: [
          {
            type: "text",
            name: "规则名称",
            placeholder: "请输入规则名称",
            bind: "ruleName",
          },
          {
            type: "select",
            name: "规则类型",
            placeholder: "请搜索规则类型",
            bind: "ruleType",
            data: "ruleTypeList", // 对应enum中的stateList
            isHave: true
          },
        ],
        form: {
          ruleName: "",
          ruleType: "",
        },
        enum: {
          modulesList: [

          ],
          ruleTypeList: [
            { dataName: '临期', dataValue: '0' },
            { dataName: '逾期', dataValue: '1' }
          ],
        },
      },
      form: {
        title: "表单标题",
        config: [
          {
            col: 24,
            type: "slot",
            slotName: "modules",
            name: "模块",
            placeholder: "请选择模块",
            bind: "templateCode",
            required: "请选择模块",
            trigger: "change",
            dataList: "modulesList"
          },
          {
            col: 24,
            type: "text",
            name: "规则名称",
            placeholder: "请输入规则名称",
            bind: "ruleName",
            trigger: "blur", // 校验时机
            required: "请输入规则名称"
          },
          {
            col: 24,
            type: "slot",
            slotName: "ruleType",
            name: "规则类型",
            placeholder: "请选择规则类型",
            bind: "ruleType",
            required: "请选择规则类型",
            trigger: "change",
            dataList: "ruleTypeList"
            // required: "请输入处理期限"
          },
          {
            col: 24,
            type: "text",
            name: "校验日期",
            placeholder: "请输入校验日期",
            bind: "checkDate",
            trigger: 'blur',
            required: "请输入校验日期"
          },
          {
            col: 24,
            type: "text",
            name: "设置天数",
            placeholder: "请输入设置天数",
            bind: "days",
            trigger: 'blur',
            required: "请输入设置天数"
          },
        ],
        data: {
          id: "",
          ruleName: "",
          ruleType: "",
          days: "",
          checkDate: "",
          templateCode: ""
        },
        enums: {
          modulesList: [],
          ruleTypeList: [
            { label: '临期', value: 0, id: 101 },
            { label: '逾期', value: 1, id: 201 }
          ], // 规则类型字典表
        }
      },
      table: {
        data: [], // 表格数据
        config: {
          title: "表格的标题", // 表格标题
          highlightCurrentRow: false, // 控制表格是否单选
          // maxLength: 20, // 一行最多显示多少字，超出显示popver
          // load: this.load,
          tooltipEffect: "light",
          header: [],
          indexConfig: {
            display: false,
          },
          selectionConfig: {
            display: false,
            width: "40",
          },
          operateConfig: {
            display: true,
            label: "操作",
            width: "200",
            fixed: "right",
            allTableHeader: "",
            saveHeaderList: this.saveHeaderList,
            hideHeaderSetting: true,
          },
          innerBtn: [
            // 表格内部操作按钮，不需要操作列的innerBtn 写成false
            {
              name: "编辑", // 按钮名称，优先显示icon
              method: "editFunc", // 点击执行该页面methods中对应的方法
              className: "font-size-20",
              type: 'text'
            },
            {
              name: "删除", // 按钮名称，优先显示icon
              method: "deleteFunc", // 点击执行该页面methods中对应的方法
              className: "font-size-20",
              type: 'text'
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
    this.getHeaderOptions();
    this.initModulesList();
    this.queryTableData();

  },
  methods: {
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
      this.queryTableData()
    },
    // 查询模块下拉选
    async initModulesList() {
      const { data } = await api_queryModulesList()

      data.forEach(item => {
        item.disabled = false;
        item.templateCode = item.templateCode;
        item.templateName = item.templateName;
        item.templateId = item.templateId
      })
      let realData = data

      this.form.enums.modulesList = realData


      data.map(item => {
        this.tableSearch.enum.modulesList.push({
          dataName: String(item.templateName),
          dataValue: String(item.templateCode),
          id: item.templateId
        })
      })
    },
    // 获取表头设置
    getHeaderOptions() {
      api_userSetQuery({ permissionCode: "M005_019" }).then((res) => {
        this.isTableHeaderId = res.data.id;
        let headerData = JSON.parse(res.data.data).sort(
          (a, b) => a.index - b.index
        );
        // this.table.config.operateConfig.allTableHeader = headerData;
        this.table.config.header = headerData.filter((item) => {
          return item.isShow;
        });

      });
    },
    // 分页获取表格数据
    async queryTableData() {
      let payLoad = {
        pageNum: this.table.page.pageNum,
        pageSize: this.table.page.pageSize,
        ruleName: this.tableSearch.form.ruleName,
        ruleType: this.tableSearch.form.ruleType
      }
      const { data } = await api_queryWarningList(payLoad)
      this.table.page.pageNum = data.pages;
      this.table.page.pageSize = data.size;
      this.table.page.total = data.total;
      this.table.data = data.records;
    },
    saveHeaderList(data) {
      api_userSetSave({
        data: JSON.stringify(data),
        permissionCode: 'M005_019',
        id: this.isTableHeaderId,
      }).then((res) => {
        if (res.msg.code == "0000") {
          this.queryTableData();
          this.getHeaderOptions();
        }
      });
    },
    // 新增
    addFunc() {
      console.log(this.table.data, this.form.enums.modulesList);
      this.table.data.forEach(item => {
        this.form.enums.modulesList.forEach(c => {
          if (item.templateCode == c.templateCode) {
            c.disabled = true
          }
        })
      })
      this.dialog = {
        visible: true,
        width: "560px",
        title: "新增预警规则",
        isEdit: false,
      };
      this.form.data = {
        id: '',
        templateCode: '',
        ruleType: '',
        days: '',
        ruleName: '',
        checkDate: '',
      };
    },
    //   编辑
    editFunc(row) {
      //console.log(row);
      this.dialog = {
        visible: true,
        width: "560px",
        title: "编辑预警规则",
        isEdit: true,
      };
      this.form.data = {
        id: row.id,
        templateCode: row.templateCode,
        ruleType: row.ruleType,
        days: row.days,
        ruleName: row.ruleName,
        checkDate: row.checkDate,
      };
    },
    // 删除
    async deleteFunc(row) {
      this.$confirm("是否确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          api_delete({ id: row.id }).then((res) => {
            if (res.msg.code == "0000") {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.table.page.pageNum = 1;
              this.queryTableData();
              this.form.enums.modulesList.forEach(c => {
                if (row.templateCode == c.templateCode) {
                  c.disabled = false
                }
              })
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
    eventNotify(ref) {
      this.$refs[ref].init();
    },
    // 弹框提交事件
    submitForm(isEdit) {
      var parameter = new Promise((resolve, reject) => {
        this.$refs["modelMgrRef"].$refs["modelMgrRefForm"].validate((valid) => {
          if (valid) {
            resolve();
          }
        });
      });
      Promise.all([parameter]).then(() => {
        // 编辑操作
        if (isEdit && this.form.data.id !== '') {
          api_update(this.form.data).then((res) => {
            //console.log(res);
            if (res.msg.code == "0000") {
              this.$message({
                type: "success",
                message: "编辑成功!",
              });
              this.closeDialog();
              this.table.page.pageNum = 1;
              this.queryTableData()
            } else {
              this.$message.error("编辑失败");
            }
          });
        } else {
          api_add(this.form.data).then(res => {
            if (res.msg.code == "0000") {
              this.$message({
                type: "success",
                message: "新增成功!",
              });
              this.closeDialog();
              this.table.page.pageNum = 1;
              this.queryTableData()
            } else {
              this.$message.error("新增失败");
            }
          })
        }
      });
    },
    // 弹框取消
    closeDialog() {
      this.$refs["modelMgrRef"].$refs["modelMgrRefForm"].resetFields();
      this.dialog.visible = false;
    },
    // 关闭之前的事件
    beforeClose(done) {
      this.$refs["modelMgrRef"].$refs["modelMgrRefForm"].resetFields();
      done();
    },
    handlePageChange(pageNum) {
      this.table.page.pageNum = pageNum;
      this.queryTableData();
    },
    handleSizeChange(pageSize) {
      this.table.page.pageSize = pageSize;
      this.queryTableData();
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
    // padding-left: 32px;
  }
}
</style>
