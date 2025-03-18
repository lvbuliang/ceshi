<template>
  <div class="unitDetails">
    <!-- <div class="navTitle">
        {{row.buName}}
      </div> -->
    <div class="container">
      <el-container style="height: 500px">
        <el-aside class="el-aside">
          <div class="title">组织架构</div>
          <div class="depTree">
            <el-tree
              :data="depDataList"
              node-key="id"
              @node-click="handleNodeClick"
              default-expand-all
              :expand-on-click-node="false"
            >
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="node.label"
                  :disabled="node.label.length < 13"
                  placement="top-start"
                >
                  <span ref="labelWidth">{{ node.label }}</span>
                </el-tooltip>
                <span>
                  <el-dropdown size="small" trigger="click" :hide-on-click="false">
                    <span class="el-dropdown-link">
                      <i
                        style="transform: rotate(270deg)"
                        slot="reference"
                        class="el-icon-more tree_icon"
                      ></i>
                    </span>
                    <div class="buttonOperation">
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item
                          @click.native.stop="addSubordinate(data, 1)"
                          >添加下级</el-dropdown-item
                        >
                        <el-dropdown-item
                          v-if="data.id != '-1'"
                          @click.native.stop="addSubordinate(data, 2)"
                          style="text-algin: center"
                          >编辑</el-dropdown-item
                        >
                      </el-dropdown-menu>
                    </div>
                  </el-dropdown>
                </span>
                <template> </template>
              </span>
            </el-tree>
          </div>
        </el-aside>
        <el-main class="el-main" v-if="rightData.unitName">
          <div class="rightTitle">
            {{ rightData.unitName }}
          </div>
          <div class="rightSearch">
            <FSearch
              :form="search"
              @queryList="getUnitDepMembersList(1)"
            ></FSearch>
          </div>
          <div class="buttonOperation">
            <el-button
              type="primary"
              class="exportbtnFour"
              size="small"
              @click="newStaff"
              ><i class="el-icon-circle-plus-outline el-icon--left"></i
              >新增人员</el-button
            >
          </div>
          <div class="rightTable">
            <!-- 表格 -->
            <FTable
              :data="table.data"
              :config="table.config"
              :page="table.page"
              :formatter="formatter"
              @pageChanged="getPageData"
              @sizeChanged="getSizeDate"
            >
            </FTable>
          </div>
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
        <!-- 添加/编辑子级单位-->
        <template>
          <FForm
            ref="modelMgrRef"
            :other-config="otherConfig"
            :config="form.config"
            :form="form.data"
            :rules="form.rules"
            :enums="form.enums"
            refForm="modelMgrRefForm"
            class="fform"
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
          <div slot="footer" class="dialog-footer">
            <el-button
              type="primary"
              size="small"
              @click="springBox_determine(0)"
              >确定</el-button
            >
            <el-button type="" size="small" @click="colseDialog(0)"
              >取消</el-button
            >
          </div>
        </template>
      </el-dialog>
    </div>
    <!-- 添加人员 -->
    <accountListDialog
      ref="accountListDialog"
      @refresh="isRefresh"
    ></accountListDialog>
    <multipleChoiceDialog
      ref="multipleChoiceDialog"
      @refresh="isRefresh"
    ></multipleChoiceDialog>
  </div>
</template>

<script>
let id = 1000;
import accountListDialog from "../../accountManage/components/accountListDialog";
import multipleChoiceDialog from "../../accountManage/components/multipleChoiceDialog.vue";
import FForm from "@/components/FForm/form-add";
import FTable from "@/components/FTable/index.vue";
import FSearch from "@/components/FSearch/index.vue";
import {
  api_forbiddenUnitMembers,
  api_enabledUnitMembers,
  api_buPropertyList,
  api_deleteMembers,
  api_addUnit,
  api_updateUnit,
} from "@/api/unitManage/unitManage";
import { api_listByTopicAndItem } from "@/api/roleManage/roleManage";
import {
  api_unitManageDetailList,
  api_queryDict,
  api_queryByParentId,
} from "@/api/accountManage/accountManage";
import { getQueryObject } from "@/utils/index";
import { getunitcode, checkunitcode } from "@/api/index.js";
export default {
  components: {
    FForm,
    FTable,
    FSearch,
    accountListDialog,
    multipleChoiceDialog,
  },
  data() {
    const depDataList = [];
    return {
      active: "启用",
      depDataList: JSON.parse(JSON.stringify(depDataList)),
      row: JSON.parse(this.$route.query.row),
      buPropertyId: this.$route.query.id,
      rightData: {
        unitName: "",
        unitid: " ",
      },
      otherConfig: {
        // 其他配置
        labelNum: 137, // label宽度，可选120和150，默认120
      },
      otherConfigPWD: {
        // 其他配置
        labelNum: 120, // label宽度，可选120和150，默认120
      },
      dialog: {
        dialogVisible: false,
        width: "",
        title: "",
        type: "",
        id: "",
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
          // {
          //   col: 24,
          //   type: "text",
          //   name: "统一社会信用代码",
          //   placeholder: "请输入统一社会信用代码",
          //   bind: "orgcode",
          // },
          {
            col: 24,
            type: "text",
            name: "单位编码",
            placeholder: "请输入单位编码",
            bind: "orgcode",
          },
          {
            col: 24,
            type: "text",
            name: "负责人",
            placeholder: "请输入负责人",
            bind: "contactName",
            trigger: "blur", // 校验时机
            required: "请输入负责人", // 必填需要指定提示信息
          },
          {
            col: 24,
            type: "text",
            name: "负责人联系方式",
            placeholder: "请输入负责人联系方式",
            bind: "contactphone",
            trigger: "blur", // 校验时机
            required: "请输入负责人联系方式", // 必填需要指定提示信息
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
            inactive: "启用",
            active: "停用",
          },
          {
            col: 24,
            type: "select",
            name: "父级单位",
            placeholder: "请选择父级单位",
            bind: "parentBuid",
            dataList: "parentBuidList",
            // trigger: "change", // 校验时机
            // required: "请选择父级单位", // 必填需要指定提示信息
            disabled: true,
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
            type: "checkbox",
            name: "单位标签",
            bind: "unitLabel",
            dataList: "unitLabel",
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
      search: {
        textMaxNum: 4, // label 最多几个字默认4个
        showExpand: false, // 是否显示展开收起，默认超过三个显示
        minNum: 3, // 收起显示几个, 默认3个
        config: [
          {
            type: "text",
            name: "姓名",
            placeholder: "请输入姓名",
            bind: "fullname", // 对应this.search.data对象的field1
          },
        ],
        enum: {},
        form: {
          fullname: "",
        },
      },
      table: {
        data: [],

        config: {
          operationWidth: 140, // 操作列的宽度，不传默认180
          title: "表格的标题", // 表格标题
          index: "序号", // 是否显示序号
          fixed: "right",
          header: [
            // 表格列配置
            { name: "姓名", prop: "userName" },
            { name: "登录账号", prop: "userId", width: 150 },
            { name: "职务", prop: "position", width: 120 },
            { name: "角色", prop: "roleName", width: 150 },
            { name: "联系方式", prop: "mobile", width: 150 },
            { name: "邮箱", prop: "mailbox", width: 150 },
            { name: "状态", prop: "accountStatName", haveHTML: true },
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
            // {
            //   name: '停用',
            //   method: 'disable',
            //   field: 'accountStat',
            //   value: [4],
            //   className: 'font-size-20',
            // },
            // {
            //   name: '启用',
            //   method: 'enable',
            //   field: 'accountStat',
            //   value: [0],
            //   className: 'font-size-20',
            // },
            {
              name: "删除",
              method: "delete",
              // field: "id",
              // value: [1, 2],
              className: "font-size-20",
            },
            // {
            //   name: '重置密码',
            //   method: 'resetPWD',
            //   field: 'id',
            //   value: [],
            //   className: 'font-size-20',
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
      formPWD: {
        title: "表单标题",
        config: [
          {
            col: 24,
            type: "radio",
            name: "重置方式",
            bind: "PWDType",
            method: "callFn",
            trigger: "blur", // 校验时机
            required: "请输入部门名称", // 必填需要指定提示信息
            dataList: "radioList",
          },
          {
            col: 24, // 独占一行
            type: "password",
            name: "密码",
            placeholder: "请输入密码",
            bind: "password",
            trigger: "change", // 校验时机
            required: "请输入密码",
            rules: {
              regular_PWD: "只允许设置8-20位数字和字母的密码！",
            },
          },
        ],
        data: {
          PWDType: 1,
          password: "",
        },
        enums: {
          radioList: [
            {
              dataName: "手动输入",
              dataValue: 1,
            },
            {
              dataName: "随机密码",
              dataValue: 0,
            },
          ],
        },
        rules: {},
      },
      addSubordinateData: {},
    };
  },
  computed: {
    themeName() {
      return this.$store.state.permission.theme || "";
    },
  },
  mounted() {
    // this.getDeptTypeList();
    if (this.themeName == "yuhua") {
      this.table.config.header[3].prop = "roleNames";
    }
    this.depDataList.push({
      buName: this.row.buName,
      phone: this.row.phone,
      buid: this.row.buid,
      id: "-1",
      label: this.row.buName,
      disabledFlag: false,
      deptType: this.row.deptType,
      buProperty: this.row.buProperty,
    });
    // this.getQueryByParentId();
    this.getBuPropertyList();
  },
  methods: {
    switchChange(value) {
      this.active = this.active == "启用" ? "停用" : "启用";
    },
    getDeptTypeList() {
      // 从字典表获取部门类型列表
      api_listByTopicAndItem({ topic: "FUNCTIONAL_DEPARTMENT" }).then((response) => {
        const data = response.data;
        let deptTypeList = [];
        data.map((res) => {
          let childs = res.childs;
          childs.map((child) => {
            let item = {
              dataValue: Number(child.itemCode),
              dataName: child.chName,
              label: child.chName,
              value: Number(child.itemCode),
            };
            deptTypeList.push(item);
          });
        });
        this.form.enums.deptTypeList = deptTypeList;
      });
    },
    //获取子账号
    getQueryByParentId(data) {
      let params = {
        parentBuid: data ? data.buid : this.row.buid,
      };
      api_queryByParentId(params).then((res) => {
        if (res.msg.code == "0000") {
          if (data) {
            res.data.forEach((item) => {
              item.label = item.buName;
              item.disabledFlag = true;
            });
            data.children = res.data;
            this.depDataList = JSON.parse(JSON.stringify(this.depDataList));
          } else {
            this.depDataList[0] = {
              buName: this.row.buName,
              phone: this.row.phone,
              buid: this.row.buid,
              id: "-1",
              label: this.row.buName,
              disabledFlag: false,
              deptType: this.row.deptType,
              buProperty: this.row.buProperty,
            };
            if (res.data.length > 0) {
              res.data.forEach((item) => {
                item.label = item.buName;
                item.disabledFlag = true;
              });
              this.depDataList[0].children = res.data;
            }
            this.depDataList = JSON.parse(JSON.stringify(this.depDataList));
          }
        }
      });
    },
    // 获取单位成员列表
    getUnitDepMembersList(page) {
      let params = {
        pageSize: this.table.page.pageSize,
        pageNum: this.table.page.pageNum,
        fullname: this.search.form.fullname,
        buid: this.rightData.buid,
        // page: this.table.page.pageNum,
        // size: this.table.page.pageSize,
      };
      if (this.rightData.unitid != "-1") {
        params.deptId = this.rightData.unitid;
      }
      if (page) {
        params.page = page;
        const searchForms = this.search.form;
        Object.keys(searchForms).map((item) => {
          if (searchForms[item]) {
            params[item] = searchForms[item];
          }
        });
      }
      api_unitManageDetailList(params).then((res) => {
        if (res.msg.message == "SUCCESS") {
          res.data.list.forEach((item) => {
            item.roleName = item.roleInfos
              .map((item1) => {
                return item1.roleName;
              })
              .join(",");
          });
          this.$set(this.table, "data", res.data.list);
          this.$set(this.table.page, "pageNum", res.data.pageNum);
          this.$set(this.table.page, "pageSize", res.data.pageSize);
          this.$set(this.table.page, "total", res.data.total);
        }
      });
    },
    // 新增人员
    newStaff() {
      let data = {};
      data = {
        buName: this.rightData.unitName,
        buid: this.rightData.buid,
        deptId: this.rightData.unitid,
        deptName: this.rightData.unitName,
        buProperty: this.rightData.buProperty,
        title: "新增成员",
      };
      if (this.themeName == "yuhua") {
        this.$refs.multipleChoiceDialog.init(data);
      } else {
        this.$refs.accountListDialog.init(data);
      }
    },
    // 编辑人员
    edit(row) {
      row.buName = this.rightData.unitName;
      row.buid = this.rightData.buid;
      row.disabledFlag = this.rightData.disabledFlag;
      row.buProperty = this.rightData.buProperty;
      row.title = "编辑成员";
      if (this.themeName == "yuhua") {
        this.$refs.multipleChoiceDialog.init(row);
      } else {
        this.$refs.accountListDialog.init(row);
      }
    },
    // 停用
    disable(row) {
      this.$confirm("此操作将停用该账号, 是否继续?", "确认要停用该账号吗？", {
        showClose: false,
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        customClass: "biaozhunhua_confirm changsha_confirm_warning", //
        type: "warning",
      })
        .then(() => {
          api_forbiddenUnitMembers(row.jfid).then((res) => {
            if (res.msg && res.msg.code == "0000") {
              this.$message({
                type: "success",
                message: "停用成功!",
              });
              this.getUnitDepMembersList();
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
    enable(row) {
      this.$confirm("此操作将启用该账号, 是否继续?", "确认要启用该账号吗？", {
        showClose: false,
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        customClass: "biaozhunhua_confirm changsha_confirm_warning", //
        type: "warning",
      })
        .then(() => {
          api_enabledUnitMembers(row.jfid).then((res) => {
            if (res.msg && res.msg.code == "0000") {
              this.$message({
                type: "success",
                message: "启用成功!",
              });
              this.getUnitDepMembersList();
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
      this.$confirm("此操作将删除该账号, 是否继续?", "确认要删除该账号吗？", {
        showClose: false,
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        customClass: "biaozhunhua_confirm changsha_confirm_warning", //
        type: "warning",
      })
        .then(() => {
          let params = {
            jfid: row.jfid,
            buid: this.rightData.buid,
          };
          api_deleteMembers(params).then((res) => {
            if (res.msg && res.msg.code == "0000") {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.getUnitDepMembersList(1);
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
    // 重置密码
    resetPWD(data) {
      this.dialog = {
        dialogVisible: true,
        width: "700px",
        title: "重置密码",
        type: 3,
        id: data.jfid,
      };

      if (this.formPWD.config.length == 1) {
        let data = {
          col: 24, // 独占一行
          type: "password",
          name: "密码",
          placeholder: "请输入密码",
          bind: "password",
          trigger: "change", // 校验时机
          required: "请输入密码",
          rules: {
            regular_PWD: "只允许设置8-20位数字和字母的密码！",
          },
        };
        this.formPWD.config.splice(1, 0, data);
      }
    },
    //tree  点击
    handleNodeClick(data, item) {
      this.rightData = {
        unitName: data.label,
        unitid: data.id,
        buid: data.buid,
        disabledFlag: data.disabledFlag,
        buProperty: data.buProperty,
      };
      this.table.page.pageNum = 1;
      this.table.page.pageSize = 5;
      this.getUnitDepMembersList();
      this.getQueryByParentId(data);
    },
    // 添加下级
    addSubordinate(data, type) {
      console.log('data',data,type)
      // this.getunitcode()
      var status = data.status == 1 ? true : false;
      this.active = data.status == 1 ? '启用' : '停用';
      if (type == 1) {
        this.getunitcode()
        this.addSubordinateData = data;
        this.$set(this.form.data, "parentBuid", data.buid);
        // this.$set(this.form.data, "", data.buid);
        let flag = this.form.enums.parentBuidList.find((item) => {
          return item.dataValue == data.buid;
        });
        if (!flag) {
          this.form.enums.parentBuidList.push({
            dataName: data.buName,
            dataValue: data.buid,
          });
        }
        this.$set(this.form.data, "buProperty", this.row.buProperty);
      } else if (type == 2) {
        this.$set(this.form, "data", data);
        this.$set(this.form.data, "orgcode", this.form.data.orgcode);
        this.$set(this.form.data, "parentBuid", data.parentBuid);
        let flag = this.form.enums.parentBuidList.find((item) => {
          return item.dataValue == data.parentBuid;
        });
        if (!flag) {
          this.form.enums.parentBuidList.push({
            dataName: data.parentNames,
            dataValue: data.parentBuid,
          });
        }
        this.$set(this.form.data, "status", status);
        this.$set(this.form.data, "buProperty", this.row.buProperty);
      }
      this.dialog = {
        dialogVisible: true,
        width: "560px",
        title: type == 1 ? "新增子级单位" : "编辑子级单位",
        type: type,
        data,
      };
    },
    // 获得单位编码
    getunitcode(){
      getunitcode().then(res=>{
        console.log(res.data)
        this.$set(this.form.data, "orgcode", res.data);

      })
    },
    //获取单位类型
    getBuPropertyList() {
      api_buPropertyList().then((res) => {
        if (res.msg.message == "SUCCESS") {
          let arr = [];
          res.data.forEach((item) => {
            let obj = {};
            if (item.id) {
              obj.dataValue = item.id + "";
              obj.dataName = item.propertyName;
              arr.push(obj);
            }
          });
          this.$set(this.form.enums, "stateList", arr);
        }
      });
    },
    // 弹框确定
    springBox_determine(type) {
      var parameter = new Promise((resolve, reject) => {
        if (type == 0) {
          this.$refs["modelMgrRef"].$refs["modelMgrRefForm"].validate(
            (valid) => {
              if (valid) {
                resolve();
              }
            }
          );
        } else {
          this.$refs["modelMgrRefPWD"].$refs["modelMgrRefFormPWD"].validate(
            (valid) => {
              if (valid) {
                resolve();
              }
            }
          );
        }
      });
      Promise.all([parameter]).then(() => {
        this.form.data.status = this.form.data.status == true ? 1 : 0;
        let params = JSON.parse(JSON.stringify(this.form.data));
        if (this.dialog.type == 1) {
          let obj = this.form.enums.parentBuidList.find((item) => {
            return item.dataValue == this.form.data.parentBuid;
          });
          params.parentNames = obj.dataName || "";
          this.checkunitcode(params.orgcode);
          this.addUnit(params);
        } else {
          params.buid = this.dialog.data.buid;
          this.updateUnit(params);
        }
      });
    },
    // 单位编码校验
    checkunitcode(data) {
      checkunitcode(data)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
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
            this.getQueryByParentId(this.addSubordinateData);
            this.$set(this.dialog, "dialogVisible", false);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 编辑单位
    updateUnit(data) {
      api_updateUnit(data).then((res) => {
        if (res.msg.message == "SUCCESS") {
          this.$message({
            message: "编辑成功",
            type: "success",
          });
          this.getQueryByParentId(this.addSubordinateData);
          this.$set(this.dialog, "dialogVisible", false);
        }
      });
    },
    // 弹框取消
    colseDialog(type) {
      if (type == 0) {
        this.$refs["modelMgrRef"].$refs["modelMgrRefForm"].resetFields();
      } else {
        this.$refs["modelMgrRefPWD"].$refs["modelMgrRefFormPWD"].resetFields();
      }
      this.dialog.dialogVisible = false;
    },
    // 关闭前回调
    bClose(done) {
      this.$refs["modelMgrRef"].$refs["modelMgrRefForm"].resetFields();
      this.form.data.status = true;
      done();
    },
    // 刷新列表
    isRefresh() {
      this.getUnitDepMembersList(1);
    },
    // 重置密码切换
    callFn(evt) {
      if (evt == 0) {
        this.formPWD.config.splice(1, 1);
      } else {
        this.formPWD.data.password = "";
        let data = {
          col: 24, // 独占一行
          type: "password",
          name: "密码",
          placeholder: "请输入密码",
          bind: "password",
          trigger: "change", // 校验时机
          required: "请输入密码",
          rules: {
            regular_PWD: "只允许设置8-20位数字和字母的密码！",
          },
        };
        this.formPWD.config.splice(1, 0, data);
      }
    },
    formatter(key, val, row) {
      if (key === "accountStatName") {
        if (row["accountStatName"] == "正常") {
          return "<div class='enabled round-state'>正常</div>";
        } else {
          return "<div class='disabled round-state'>停用</span></div>";
        }
      }
    },
    getPageData(pageNum) {
      this.table.page.pageNum = pageNum;
      this.getUnitDepMembersList();
    },
    getSizeDate(pageSize) {
      this.table.page.pageSize = pageSize;
      this.getUnitDepMembersList();
    },
    remove(node, data) {
      if (!data.children) {
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex((d) => d.id === data.id);
        children.splice(index, 1);
      } else {
        this.$message.error("删除失败,里面还有成员");
      }
    },
  },
};
</script>
<style lang="scss">
.el-dropdown-menu__item {
  text-align: center !important;
}

.unitDetails {
  .el-tree-node__content {
    height: 38px;
    line-height: 38px;
  }
  .el-tree-node__content:hover {
    background: #e6f7ff;
  }
}
</style>
<style lang="scss" scoped>
.unitDetails {
  // .navTitle{
  //     line-height: 68px;
  //     padding-left: 17px;
  //     font-size:16px;
  //     font-family:PingFangSC-Medium,PingFang SC;
  //     font-weight:500;
  //     color:rgba(38,38,38,1);
  // }
  ::v-deep .fform {
    .switch {
      width: 80px;
    }
  }
  .container {
    width: 100%;
    border-top: 1px solid #eee;
    .el-aside {
      width: 300px;
      background: white;
      border-right: 1px solid #eee;
      overflow-x: hidden;
      ::v-deep .custom-tree-node span:nth-child(1) {
        // width: 180px;
        width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      ::v-deep .custom-tree-node span:nth-child(2) {
        width: 20px;
      }
      .title {
        height: 40px;
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        line-height: 48px;
        color: #262626;
        height: 48px;
      }
      .custom-tree-node {
        flex-grow: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;

        .tree_icon {
          color: #bfbfbf;
        }
        .tree_icon:hover {
          color: #007aff;
        }
        .buttonOperation {
          text-align: center;
          margin: 0px;
          .el-dropdown-link {
            cursor: pointer;
            color: #409eff;
          }
          .el-icon-arrow-down {
            font-size: 12px;
          }
        }
      }
    }
    .el-main {
      padding-top: 0;
      .rightTitle {
        height: 40px;
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        line-height: 56px;
        color: #262626;
        height: 56px;
      }

      .rightSearch {
        /deep/.search {
          .el-form {
            .el-form-item:nth-child(1) {
              .el-form-item__label {
              width: 70px;
            
              }
            }
          }
        }
      }
      .buttonOperation {
        padding: 0px;
      }
    }
  }
  // 弹框
  .springBox {
    .springBox_button {
      text-align: center;
    }
  }
}
</style>
