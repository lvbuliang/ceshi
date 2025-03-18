<template>
  <div class="unitList" v-if="$route.meta.lv == 2">
    <!-- 搜索  -->
    <div class="search">
      <FSearch :form="search" @queryList="getUnitList(1)"></FSearch>
    </div>
    <!-- 操作按钮 -->
    <div class="buttonOperation">
      <el-button class="exportbtnFour" type="primary" @click="add">
        <i class="el-icon-circle-plus-outline el-icon--left"></i>新增单位
      </el-button>
      <el-button class="exportbtnFour" @click="exportData">
        <i class="el-icon-download el-icon--left"></i>导出excel
      </el-button>
    </div>
    <!-- 表格 -->
    <div class="table">
      <FTable
        :data="table.data"
        :config="table.config"
        :page="table.page"
        :formatter="formatter"
        @selected="onSelect"
        @pageChanged="getPageData"
        @sizeChanged="getSizeDate"
      >
        <div slot="cellSlot" slot-scope="scope">
          <div class="table_unitName" @click="unitDetails(scope.scope.row)">
            {{ scope.scope.row.buName }}
          </div>
        </div>
      </FTable>
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
        <!-- <div class="springBox_form"> -->
        <FForm
          class="fform"
          ref="modelMgrRef"
          :config="form.config"
          :form="form.data"
          :rules="form.rules"
          :enums="form.enums"
          :other-config="otherConfig"
          refForm="modelMgrRefForm"
          @eventNotify="eventNotify"
          :column="2"
        >
          <div slot="switch">
            <el-switch
              class="switch"
              v-model="form.data.status"
              :active-text="active"
              @change="switchChange"
            ></el-switch>
          </div>
        </FForm>
        <span slot="footer" class="dialog-footer">
          <el-button
            type="primary"
            size="small"
            @click="springBox_determine(dialog.type)"
            >确定</el-button
          >
          <el-button type size="small" @click="colseDialog">取消</el-button>
        </span>
        <!-- </div> -->
      </el-dialog>
    </div>
  </div>
  <router-view v-else></router-view>
</template>

<script>
import { getStorageToken, clearStorageToken } from "@/utils/user-vali.js";
import FSearch from "@/components/FSearch/index.vue";
import FTable from "@/components/FTable/index.vue";
import FForm from "@/components/FForm/form-add";
import {
  api_unitList,
  api_addUnit,
  api_updateUnit,
  api_unitForbidden,
  api_unitEnabled,
  api_unitDelete,
  api_buPropertyList,
  api_getAloneUnit,
  api_resetPwdUnitMembers,
} from "@/api/unitManage/unitManage";

import { api_queryDict } from "@/api/accountManage/accountManage";
import { api_listByTopicAndItem } from "@/api/roleManage/roleManage";
import config from "@/settings.js";
import { getunitcode, checkunitcode } from "@/api/index.js";
export default {
  components: {
    FSearch,
    FTable,
    FForm,
  },
  data() {
    return {
      search: {
        textMaxNum: 4, // label 最多几个字默认4个
        showExpand: false, // 是否显示展开收起，默认超过三个显示
        minNum: 3, // 收起显示几个, 默认3个
        config: [
          {
            type: "text",
            name: "单位名称",
            placeholder: "请输入单位名称",
            bind: "buName", // 对应this.search.data对象的field1
          },
          {
            type: "select",
            name: "单位类型",
            placeholder: "请选择单位类型",
            bind: "buProperty",
            data: "stateList", // 对应enum中的stateList
          },
        ],
        enum: {
          stateList: [],
        },
        form: {
          buName: "",
          buProperty: "",
        },
      },
      table: {
        data: [],
        config: {
          title: "表格的标题", // 表格标题
          index: "序号", // 是否显示序号
          selection: true,
          multiple: true,
          rowKey: "buid",
          fixed: "right",
          operationWidth: 250, // 操作列的宽度，不传默认180
          header: [
            // 表格列配置
            { name: "单位名称", prop: "buName", cellSlot: true, width: 320 },
            { name: "单位类型", prop: "buPropertyName" },
            { name: "地址", prop: "address", width: 320 },
            { name: "状态", prop: "status", haveHTML: true, width: 100 },
            { name: "联系人", prop: "contactName", width: 120 },
          ],
          outerBtn: [], // 外部按钮
          innerBtn: [
            {
              name: "编辑",
              method: "edit",
              field: "id",
              value: [],
              code: "2334455",
            },
            {
              name: "停用",
              method: "disable",
              field: "status",
              value: [0],
              className: "font-size-20",
            },
            {
              name: "启用",
              method: "enabled",
              field: "status",
              value: [1],
              className: "font-size-20",
            },
            // {
            //   name: "删除",
            //   method: "delete",
            //   field: "id",
            //   value: [1, 2],
            //   className: "font-size-20",
            // },
          ],
        },
        page: {
          // 分页配置
          total: 12, //总条数
          pages: "", //总页数
          pageSize: 5, //每页展示多少个
          pageNum: 1, //当前页
        },
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
            name: "单位名称",
            placeholder: "请输入单位名称",
            bind: "buName",
            trigger: "blur", // 校验时机
            required: "请输入单位名称", // 必填需要指定提示信息
          },
          {
            // col: 24,
            // type: "text",
            // name: "单位编码",
            // placeholder: "请输入单位编码",
            // bind: "orgcode",
            col: 24, // 独占一行
            type: "text",
            name: "单位编码",
            placeholder: "请输入单位编码",
            bind: "orgcode",
            trigger: "blur", // 校验时机
            // required: "请输入单位编码", // 必填需要指定提示信息
          },
          {
            col: 24,
            type: "text",
            name: "联系人",
            placeholder: "请输入联系人",
            bind: "contactName",
            trigger: "blur", // 校验时机
            required: "请输入联系人", // 必填需要指定提示信息
          },
          {
            col: 24,
            type: "text",
            name: "联系方式",
            placeholder: "请输入联系方式",
            bind: "contactphone",
            trigger: "blur", // 校验时机
            required: "请输入联系方式", // 必填需要指定提示信息
            rules: {
              isphone: "请输入正确的联系方式",
            },
          },
          {
            col: 24,
            type: "text",
            name: "联系人邮箱",
            placeholder: "请输入联系人邮箱",
            bind: "enterpriseEmail",
            rules: {
              regular_Email: "请输入正确的邮箱",
            },
          },
          {
            col: 24,
            type: "text",
            name: "地址",
            placeholder: "请输入地址",
            bind: "address",
          },
          {
            type: "slot",
            slotName: "switch",
            name: "单位状态",
            bind: "status",
            inactive: "停用",
            active: "启用",
          },
          {
            col: 24,
            type: "select",
            name: "单位类型",
            placeholder: "请选择单位类型",
            bind: "buProperty",
            dataList: "stateList",
            // trigger: "change", // 校验时机
            required: "请选择单位类型", // 必填需要指定提示信息
            disabled: true,
          },
          {
            col: 24,
            type: "select",
            name: "单位标签",
            bind: "unitLabel",
            dataList: "unitLabel",
            change: this.unitLabelChange,
          },
        ],
        data: {
          buName: "",
          orgcode: "",
          contactName: "",
          contactphone: "",
          enterpriseEmail: "",
          address: "",
          buProperty: "",
          status: true,
          unitLabel: "",
          parentBuid: "",
        },
        enums: {
          stateList: [],
          unitLabel: [],
          parentBuidList: [],
        },
        rules: {},
      },
      active: "启用",
      buids: null,
      otherConfig: {
        // 其他配置
        labelNum: 137, // label宽度，可选120和150，默认120
      },
    };
  },
  computed: {
    themeName() {
      return this.$store.state.permission.theme || "";
    },
  },
  watch: {
    form: {
      deep: true,
      handler(n) {
        if (n.data.buProperty == 2 && this.themeName == "yuhua") {
          n.config[1].required = "请输入统一社会信用代码";
          n.config[1].trigger = "blur";
        } else {
          n.config[1].trigger = false;
          n.config[1].required = false;
        }
      },
    },
    $route: {
      handler(val, oldval) {
        this.search.form = {
          buName: "",
          buProperty: "",
        };
        this.init();
      },
      // 深度观察监听
      deep: true,
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    //单位标签切换5
    unitLabelChange(val) {
      if (val) {
        let flag = this.form.enums.unitLabel.find((item) => {
          return item.dataValue == val;
        });
        if (flag) {
          this.form.data.unitLabelName = flag.dataName;
        }
      }
    },
    init() {
      this.getUnitList();
      this.getBuPropertyList();
    },
    // 获取单位管理列表
    getUnitList(page) {
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
      api_unitList(params).then((res) => {
        if (res.msg.message == "SUCCESS") {
          this.$set(this.table, "data", res.data.records);
          console.log(this.table.data);
          // this.$set(this.table.page, "pageNum", res.data.pageNum);
          // this.$set(this.table.page, "pageSize", res.data.pageSize);
          this.$set(this.table.page, "total", res.data.total);
        }
      });
    },
    // 新增单位
    add() {
      getunitcode().then((res) => {
        console.log(res);
        this.form.config[7].disabled = false;
        this.form.data = {
          buName: "",
          orgcode: res.data,
          contactName: "",
          contactphone: "",
          enterpriseEmail: "",
          address: "",
          buProperty: "",
          status: true,
          unitLabelName: "",
          unitLabel: "",
          parentBuid: "",
        };
        this.dialog = {
          dialogVisible: true,
          width: "700px",
          title: "新增单位",
          type: 0,
          buid: "",
        };
        this.getAloneUnit();
      });
    },
    //获取父级单位
    getAloneUnit() {
      api_getAloneUnit().then((res) => {
        if (res.msg.code == "0000") {
          // debugger
          if (res.data && res.data.length > 0) {
            this.form.enums.parentBuidList = res.data.map((item) => {
              return {
                dataValue: item.BUID + "",
                dataName: item.BU_NAME,
              };
            });
          }
        }
      });
    },
    // 导出
    exportData() {
      let access_token = getStorageToken();
      let url;
      if (this.buids) {
        url = `/jfzg/opcenter/unit/export/excel/part`;
        url = `${url}?buids=${this.buids}&access_token=${access_token}`;
      } else {
        url = `/jfzg/opcenter/unit/export/excel`;
        let searchForms = this.search.form;
        url = `${url}?${`buName`}=${searchForms.buName}&${`buProperty`}=${
          searchForms.buProperty
        }&access_token=${access_token}`;
      }
      // console.log(config.baseUrl + url)
      window.open(config.baseUrl + url);
    },
    // 编辑
    edit(row) {
      this.form.config[7].disabled = true;
      this.getAloneUnit();
      this.dialog = {
        dialogVisible: true,
        width: "700px",
        title: "编辑单位",
        type: 1,
        buid: row.buid,
      };
      this.active = row.status == 1 ? "启用" : "停用";
      this.form.data = {
        address: row.address,
        buName: row.buName,
        buProperty: parseInt(row.buProperty),
        contactName: row.contactName,
        contactphone: row.contactphone,
        enterpriseEmail: row.enterpriseEmail,
        orgcode: row.orgcode,
        status: row.status == 1 ? true : false,
        unitLabel: row.unitLabel ? row.unitLabel : "",
        parentBuid: "",
      };
    },
    // 停用
    disable(row) {
      this.$confirm("此操作将停用该单位, 是否继续?", "确认要停用该单位吗？", {
        showClose: false,
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        customClass: "biaozhunhua_confirm changsha_confirm_warning", //
        type: "warning",
      })
        .then(() => {
          api_unitForbidden(row.buid).then((res) => {
            if (res.msg.message == "SUCCESS") {
              this.$message({
                message: "停用成功",
                type: "success",
              });
              this.getUnitList(this.table.page.pageNum);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消停用",
          });
        });
    },
    // 启用
    enabled(row) {
      this.$confirm("此操作将启用该单位, 是否继续?", "确认要启用该单位吗？", {
        showClose: false,
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        customClass: "biaozhunhua_confirm changsha_confirm_warning", //
        type: "warning",
      })
        .then(() => {
          api_unitEnabled(row.buid).then((res) => {
            if (res.msg.message == "SUCCESS") {
              this.$message({
                message: "启用成功",
                type: "success",
              });
              this.getUnitList(this.table.page.pageNum);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消启用",
          });
        });
    },
    // 删除
    delete(row) {
      this.$confirm(
        "此操作将永久删除该单位, 是否继续?",
        "确认要删除该单位吗？",
        {
          showClose: false,
          cancelButtonText: "取消",
          confirmButtonText: "确定",
          customClass: "biaozhunhua_confirm changsha_confirm_warning", //
          type: "warning",
        }
      )
        .then(() => {
          api_unitDelete(row.buid).then((res) => {
            if (res.msg.message == "SUCCESS") {
              this.$message({
                message: "删除成功",
                type: "success",
              });
              this.getUnitList(1);
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
    // 单位详情
    unitDetails(row) {
      this.$router.push({
        name: "unitDetail",
        query: {
          row: JSON.stringify(row),
          id: row.buProperty,
        },
      });
    },
    // 表格多选框方法
    onSelect(data) {
      let buids = data.map((item) => {
        return item.buid;
      });

      this.buids = buids.join(",");
    },
    // 弹框确定
    springBox_determine(type) {
      console.log(this.form.data, type);
      // contactphone

      var parameter = new Promise((resolve, reject) => {
        this.$refs["modelMgrRef"].$refs["modelMgrRefForm"].validate((valid) => {
          if (valid) {
            resolve();
          }
        });
      });
      console.log(parameter);
      Promise.all([parameter]).then(() => {
        this.form.data.status = this.form.data.status == true ? 1 : 0;
        let params = JSON.parse(JSON.stringify(this.form.data));
        if (type == 0) {
          this.checkunitcode(params.orgcode);
          this.addUnit(params);
        } else {
          params.buid = this.dialog.buid;
          this.updateUnit(params);
        }
      });
    },
    // 编码校验
    checkunitcode(data) {
      checkunitcode(data)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
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
    // 新增单位
    addUnit(data) {
      api_addUnit(data)
        .then((res) => {
          if (res.msg.message == "SUCCESS") {
            this.$message({
              message: "新建成功",
              type: "success",
            });
            this.getUnitList(1);
            this.dialog.dialogVisible = false;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 编辑单位
    updateUnit(data) {
      // console.log(data)
      api_updateUnit(data).then((res) => {
        if (res.msg.message == "SUCCESS") {
          this.$message({
            message: "编辑成功",
            type: "success",
          });
          this.getUnitList(1);
          this.dialog.dialogVisible = false;
        }
      });
    },
    getPageData(pageNum) {
      this.table.page.pageNum = pageNum;
      this.getUnitList();
    },
    getSizeDate(pageSize) {
      this.table.page.pageSize = pageSize;
      this.getUnitList();
    },
    switchChange(value) {
      this.active = this.active == "启用" ? "停用" : "启用";
      // console.log(this.form.data.status)
    },
    // 获取企业类型
    getBuPropertyList() {
      api_buPropertyList().then((res) => {
        if (res.msg.message == "SUCCESS") {
          let arr = [];
          res.data.forEach((item) => {
            let obj = {};
            if (item.id) {
              obj.dataValue = item.id;
              obj.dataName = item.propertyName;
              arr.push(obj);
            }
          });
          this.$set(this.search.enum, "stateList", arr);
          this.$set(this.form.enums, "stateList", arr);
        }
      });
      // 获取单位标签
      api_listByTopicAndItem({ topic: "UNIT_LABEL" }).then((res) => {
        if (res.msg.code == "0000") {
          if (res.data && res.data.length > 0) {
            this.form.enums.unitLabel = res.data.map((item) => {
              return {
                dataName: item.chName,
                dataValue: item.itemCode,
              };
            });
          }
        }
      });
    },
    eventNotify(ref) {
      console.log(ref);
    },
    formatter(key, val, row) {
      if (key === "status") {
        if (row["status"] == 1) {
          return "<div class='enabled round-state'>正常</div>";
        } else if (row["status"] == 0) {
          return "<div class='wait round-state'>停用</div>";
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.unitList {
  .table {
    .table_unitName {
      font-size: 14px;
      color: rgba(0, 122, 255, 1);
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    :hover .table_unitName {
      cursor: pointer;
    }
  }
}
</style>
<style lang="scss">
.common-dialog {
  .fform {
    .switch {
      width: 80px;
    }
  }
}
</style>
