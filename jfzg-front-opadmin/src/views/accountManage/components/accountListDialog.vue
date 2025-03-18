<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="700px"
      :append-to-body="true"
      class="common-dialog"
      :before-close="bClose"
    >
      <FForm
        v-if="flag"
        ref="modelMgrRef"
        class="modelMgrRef"
        :config="form.config"
        :form="form.data"
        :rules="form.rules"
        :enums="form.enums"
        :other-config="otherConfig"
        refForm="modelMgrRefForm"
        @eventNotify="eventNotify"
        :column="2"
      >
        <template slot="cascader">
          <el-select
            v-model="form.data.deptId"
            :disabled="(buId ? false : true) || disabledFlag"
            placeholder="请选择部门"
          >
            <el-option
              v-for="item in form.enums.typeList"
              :key="item.id"
              :label="item.deptName"
              :value="item.id"
            ></el-option>
          </el-select>
        </template>
        <template slot="switch">
          <el-switch v-model="form.data.enabled" :active-text="active" @change="switchChange"></el-switch>
        </template>
        <template slot="quicLoginUser">
          <el-switch
            v-model="form.data.quicLoginUser"
            :active-text="active2"
            @change="quicLoginUserChange"
          ></el-switch>
        </template>
      </FForm>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">确 定</el-button>
        <el-button @click="colseDialog">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import FForm from "@/components/FForm/form-add";
import {
  api_saveOrUpdate,
  api_isExist,
  api_buPropertyList,
  api_findBuRoleList,
  api_departmentList,
} from "@/api/accountManage/accountManage";
import {
  api_opAdd,
  api_opUpdate,
  api_addUnitMembers,
  api_updateUnitMembers,
  api_selectAllUnitList,
  api_allUserList,
  api_accountList
} from "@/api/unitManage/unitManage";
import Check from "@/assets/Check.png";
import Circle from "@/assets/Circle.png";
export default {
  components: {
    FForm,
  },

  data() {
    return {
      Check: Check,
      Circle: Circle,
      flag: true,
      dialogVisible: false,
      title: "",
      otherConfig: {
        // 其他配置
        labelNum: 100, // label宽度，可选120和150，默认120
        column: 2, // 列数，默认2
        validateOnRuleChange: false,
      },
      form: {
        config: [
          {
            col: 24, // 独占一行
            type: "text",
            name: "姓名",
            placeholder: "请输入姓名",
            bind: "fullname",
            trigger: "blur", // 校验时机
            required: "请输入姓名", // 必填需要指定提示信息
          },
          {
            col: 24, // 独占一行
            type: "number",
            name: "联系方式",
            placeholder: "请输入联系方式",
            bind: "mobile",
            trigger: "blur", // 校验时机
            required: "请输入联系方式", // 必填需要指定提示信息
            rules: {
              // validator_1: this.mobileRules,
              isphone: "请输入正确的联系方式",
            },
          },
          {
            col: 24, // 独占一行
            type: "text",
            name: "身份证号码",
            placeholder: "请输入身份证号码",
            bind: "idencode",
            trigger: "blur", // 校验时机
            // required: "请输入身份证号码", // 必填需要指定提示信息
            rules: {
              regular_IdCard: "请输入正确的身份证号码！",
            },
          },
          {
            col: 24,
            type: "select",
            name: "单位",
            placeholder: "请选择单位",
            bind: "buid",
            dataList: "departmentList", // 定义在this.form.enums中的typeList
            trigger: "blur", // 校验时机
            required: "请选择单位", // 必填需要指定提示信息
            change: this.changeVal,
            disabled: false,
          },
          // {
          //   col: 24,
          //   type: "select",
          //   name: "部门",
          //   placeholder: "请选择部门",
          //   bind: "deptId",
          //   dataList: "typeList", // 定义在this.form.enums中的typeList
          //   change: this.changeVal,
          //   ref: "refHandle",
          //   disabled: true,
          // },
          {
            col: 24,
            type: "arrSelect",
            name: "角色",
            placeholder: "请选择角色",
            bind: "userRoleIds",
            dataList: "roleList", // 定义在this.form.enums中的typeList
            // change: this.changeVal,
            disabled: true,
            multiple: true,
          },
          {
            col: 24, // 独占一行
            type: "text",
            name: "职务",
            placeholder: "请输入职务",
            bind: "role",
          },
          {
            col: 24, // 独占一行
            type: "text",
            name: "登录账户",
            placeholder: "请输入登录账户",
            bind: "userId",
            trigger: "blur", // 校验时机
            required: "请输入登录账户", // 必填需要指定提示信息
            rules: {
              validator_1: this.userIdRules,
            },
            // className: 'loginName',
            // slotName: 'loginSlot'
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
              // validator_1:this.regular_PWD,
              regular_PWD: "只允许设置8-20位数字和字母的密码！",
            },
          },
          {
            col: 24, // 独占一行
            type: "text",
            name: "邮箱",
            placeholder: "请输入邮箱",
            bind: "mailbox",
            rules: {
              regular_Email: "请输入正确的邮箱",
            },
          },
          {
            type: "slot",
            slotName: "switch",
            name: "账号状态",
            bind: "enabled",
          },
        ],
        data: {
          buid: "",
          fullname: "",
          mobile: "",
          deptId: "",
          role: "", //职务
          idencode: "", //身份证
          userId: "", //账号
          password: "", //
          mailbox: "", //邮箱
          enabled: true, //  false 禁用  true 启用
          accountStat: true,
        },
        enums: {
          departmentList: [],
          roleList: [],
          typeList: [],
          jfidList: [],
        },
        rules: {},
      },
      active: "启用",
      active2: "不是",
      usable: true,
      disabledFlag: false,
      userIdOrg: null,
      role: {
        buid: "",
        deptId: "",
      },
      buProperty: "",
      findBuRoleList: [],
    };
  },
  computed: {
    buId() {
      return this.form.data.buid;
    },
  },
  watch: {
    buId: {
      handler: function (value) {
        if (value) {
          // console.log(value)
          // this.getDepartmentList();
          // this.getFindByCondintion(this.filietRole(value));
        }
      },
    },
  },
  mounted() {
    console.log(this.buId);
  },
  methods: {
    changeVal(row, item) {
      if (item.name == "单位") {
        this.role.buid = row;
        this.form.config[4].disabled = false;
        this.form.config[5].disabled = false;
        this.form.data.deptId = "";
        this.form.data.roleId = "";
        // this.getDepartmentList();
        this.getFindByCondintion(this.filietRole(row));
      } else {
        // this.role.deptId = row;
        // this.getFindByCondintion();
      }
    },
    init(data) {
      this.form.data = {
        buid: "",
        fullname: "",
        mobile: "",
        deptId: "",
        role: "", //职务
        roleId: "", //
        idencode: "", //身份证
        userId: "", //账号
        password: "", //
        mailbox: "", //邮箱
        enabled: true, //  false 禁用  true 启用
        quicLoginUser: false, // 是否是快捷登录
      };

      this.form.enums.departmentList = [];
      this.form.enums.typeList = [];
      this.flag = false;
      this.$nextTick(() => {
        this.flag = true;
      });
      this.title = data.title;
      if (data.title == "新增成员") {
        this.form.config = [
          {
            col: 24,
            type: "select",
            name: "账号",
            placeholder: "请选择账号",
            bind: "jfid",
            dataList: "jfidList", // 定义在this.form.enums中的typeList
            trigger: "blur", // 校验时机
            required: "请选择账号", // 必填需要指定提示信息
            change: this.changeVal,
          },
          {
            col: 24,
            type: "select",
            name: "单位",
            placeholder: "请选择单位",
            bind: "buid",
            dataList: "departmentList", // 定义在this.form.enums中的typeList
            trigger: "blur", // 校验时机
            required: "请选择单位", // 必填需要指定提示信息
            change: this.changeVal,
            // disabled: true,
          },
          {
            col: 24,
            type: "arrSelect",
            name: "角色",
            placeholder: "请选择角色",
            bind: "userRoleIds",
            dataList: "roleList", // 定义在this.form.enums中的typeList
            change: this.changeVal,
            required: "请选择角色", // 必填需要指定提示信息
            multiple: true,
          },
          {
            col: 24, // 独占一行
            type: "text",
            name: "职务",
            placeholder: "请输入职务",
            bind: "position",
          },
        ];
        this.isDisabled(data);
        this.getAllUserList();
        // this.getBuPropertyList()
      } else if (data.title == "新增人员") {
        this.form.config = [
          {
            col: 24, // 独占一行
            type: "text",
            name: "姓名",
            placeholder: "请输入姓名",
            bind: "fullname",
            trigger: "blur", // 校验时机
            required: "请输入姓名", // 必填需要指定提示信息
          },
          {
            col: 24, // 独占一行
            type: "number",
            name: "联系方式",
            placeholder: "请输入联系方式",
            bind: "mobile",
            trigger: "blur", // 校验时机
            required: "请输入联系方式", // 必填需要指定提示信息
            rules: {
              // validator_1: this.mobileRules,
              isphone: "请输入正确的联系方式",
            },
          },
          {
            col: 24, // 独占一行
            type: "text",
            name: "身份证号码",
            placeholder: "请输入身份证号码",
            bind: "idencode",
            trigger: "blur", // 校验时机
            // required: "请输入身份证号码", // 必填需要指定提示信息
            rules: {
              regular_IdCard: "请输入正确的身份证号码！",
            },
          },
          {
            col: 24, // 独占一行
            type: "text",
            name: "登录账户",
            placeholder: "请输入登录账户",
            bind: "userId",
            trigger: "blur", // 校验时机
            required: "请输入登录账户", // 必填需要指定提示信息
            rules: {
              validator_1: this.userIdRules,
            },
            // className: 'loginName',
            // slotName: 'loginSlot'
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
              // validator_1:this.regular_PWD,
              regular_PWD: "只允许设置8-20位数字和字母的密码！",
            },
          },
          {
            col: 24, // 独占一行
            type: "text",
            name: "邮箱",
            placeholder: "请输入邮箱",
            bind: "mailbox",
            rules: {
              regular_Email: "请输入正确的邮箱",
            },
          },
          {
            type: "slot",
            slotName: "quicLoginUser",
            name: "快捷登录",
            bind: "quicLoginUser",
          },
          {
            type: "slot",
            slotName: "switch",
            name: "账号状态",
            bind: "enabled",
          },
        ];
        this.PWDInit();
        this.getBuPropertyList();
      } else if (data.title == "编辑人员") {
        this.form.config = [
          {
            col: 24, // 独占一行
            type: "text",
            name: "姓名",
            placeholder: "请输入姓名",
            bind: "fullname",
            trigger: "blur", // 校验时机
            required: "请输入姓名", // 必填需要指定提示信息
          },
          {
            col: 24, // 独占一行
            type: "number",
            name: "联系方式",
            placeholder: "请输入联系方式",
            bind: "mobile",
            trigger: "blur", // 校验时机
            required: "请输入联系方式", // 必填需要指定提示信息
            rules: {
              // validator_1: this.mobileRules,
              isphone: "请输入正确的联系方式",
            },
          },
          {
            col: 24, // 独占一行
            type: "text",
            name: "身份证号码",
            placeholder: "请输入身份证号码",
            bind: "idencode",
            trigger: "blur", // 校验时机
            // required: "请输入身份证号码", // 必填需要指定提示信息
            rules: {
              regular_IdCard: "请输入正确的身份证号码！",
            },
          },
          {
            col: 24, // 独占一行
            type: "text",
            name: "登录账户",
            placeholder: "请输入登录账户",
            bind: "userId",
            trigger: "blur", // 校验时机
            required: "请输入登录账户", // 必填需要指定提示信息
            rules: {
              validator_1: this.userIdRules,
            },
            // className: 'loginName',
            // slotName: 'loginSlot'
          },
          {
            col: 24, // 独占一行
            type: "text",
            name: "邮箱",
            placeholder: "请输入邮箱",
            bind: "mailbox",
            rules: {
              regular_Email: "请输入正确的邮箱",
            },
          },
          {
            type: "slot",
            slotName: "quicLoginUser",
            name: "快捷登录",
            bind: "quicLoginUser",
          },
          {
            type: "slot",
            slotName: "switch",
            name: "账号状态",
            bind: "enabled",
          },
        ];
        this.getBuPropertyList(true);
        this.role = {
          buid: data.buid,
          deptId: data.deptId,
        };
        this.userIdOrg = data.userId;
        let obj = {
          userId: data.userId,
          enabled: data.accountStat ? false : true,
          idencode: data.idencode,
          deptId: data.deptId,
          buid: data.buid,
          roleId: data.roleId,
          role: data.role,
          mailbox: data.mailbox,
          mobile: data.mobile,
          fullname: data.userName,
          jfid: data.jfid,
          quicLoginUser: data.quicLoginUser ? true : false,
        };
        this.active = obj.enabled ? "启用" : "停用";
        this.active2 = obj.quicLoginUser ? "是" : "不是";
        this.$set(this.form, "data", obj);
      } else if (data.title == "编辑成员") {
        this.form.config = [
          {
            col: 24,
            type: "text",
            name: "账号",
            placeholder: "请选择账号",
            bind: "fullname",
            trigger: "blur", // 校验时机
            required: "请选择账号", // 必填需要指定提示信息
            change: this.changeVal,
            disabled: true,
          },
          {
            col: 24,
            type: "select",
            name: "单位",
            placeholder: "请选择单位",
            bind: "buid",
            dataList: "departmentList", // 定义在this.form.enums中的typeList
            trigger: "blur", // 校验时机
            required: "请选择单位", // 必填需要指定提示信息
            change: this.changeVal,
            // disabled: true,
          },
          {
            col: 24,
            type: "arrSelect",
            name: "角色",
            placeholder: "请选择角色",
            bind: "userRoleIds",
            dataList: "roleList", // 定义在this.form.enums中的typeList
            change: this.changeVal,
            required: "请选择角色", // 必填需要指定提示信息
            multiple: true,
          },
          {
            col: 24, // 独占一行
            type: "text",
            name: "职务",
            placeholder: "请输入职务",
            bind: "position",
          },
        ];
        this.userIdOrg = data.userId;
        let obj = {
          userId: data.userId,
          enabled: data.accountStat ? false : true,
          idencode: data.idencode,
          deptId: data.deptId,
          buid: +data.buid,
          userRoleIds: data.roleInfos.map((item) => {
            return item.roleId;
          }),
          role: data.role,
          mailbox: data.mailbox,
          mobile: data.mobile,
          fullname: data.userName,
          jfid: data.jfid,
          buName: data.buName,
          buProperty: data.buProperty,
          disabledFlag: data.disabledFlag,
          position: data.position,
        };
        this.$set(this.form, "data", obj);
        this.isDisabled(obj);
        this.getBuPropertyList();
        this.active = obj.enabled ? "启用" : "停用";
      }
      this.dialogVisible = true;
    },

    //获取所有账号下拉
    getAllUserList() {
      let data = {
        pageSize: "10",
        pageNum: "1",
      };
      api_accountList(data).then((res) => {
        if (res.msg.code == "0000") {
          let list = res.data.map((item) => {
            return {
              // userName
              dataName: item.userId,
              dataValue: item.jfid,
            };
          });
          this.$set(this.form.enums, "jfidList", list);
        }
      });
    },
    //获取单位类型下拉
    getBuPropertyList(flag) {
      api_selectAllUnitList()
        .then((res) => {
          if (res.msg && res.msg.code == "0000") {
            let arr = [];
            res.data.forEach((item) => {
              let obj = {};
              if (item.buid) {
                obj.buProperty = item.buProperty;
                obj.dataValue = item.buid;
                obj.dataName = item.buName;
                arr.push(obj);
              }
            });
            this.$set(this.form.enums, "departmentList", arr);
            this.findBuRoleList = arr;
            if (flag) {
              this.getFindByCondintion(this.filietRole(this.form.data.buid));
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //获取角色下拉列表
    getFindByCondintion(data) {
      api_findBuRoleList({ buProperty: data })
        .then((res) => {
          // console.log(res)
          if (res.msg && res.msg.code == "0000") {
            let arr = [];
            res.data.forEach((item) => {
              let obj = {};
              if (item.roleId) {
                obj.dataValue = item.roleId;
                obj.dataName = item.roleName;
                arr.push(obj);
              }
            });
            this.$set(this.form.enums, "roleList", arr);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //获取部门下拉菜单
    getDepartmentList() {
      let data = {
        buid: this.buId,
      };
      api_departmentList(data)
        .then((res) => {
          if (res.msg && res.msg.code == "0000") {
            res.data = res.data.map(({ id, deptName }) => ({
              dataValue: id,
              dataName: deptName,
            }));
            this.$set(this.form.enums, "typeList", res.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 过滤获取角色参数
    filietRole(row) {
      console.log(this.findBuRoleList);
      let buPropertyRole = "";
      this.findBuRoleList.forEach((item) => {
        if (item.dataValue == row) {
          buPropertyRole = item.buProperty;
        }
      });
      return buPropertyRole;
    },
    //检测登录账号
    userIdRules(rule, value, callback) {
      // console.log(value)
      if (this.userIdOrg == value) {
        callback();
      } else {
        api_isExist({ userId: value })
          .then((res) => {
            if (res.msg && res.msg.code == "0000") {
              if (!res.data) {
                callback();
              } else {
                callback(new Error("账号已存在"));
              }
            } else {
              callback(new Error("账号已存在"));
            }
          })
          .catch((error) => {
            callback(new Error("账号已存在"));
          });
      }
    },
    switchChange() {
      this.active = this.active == "启用" ? "停用" : "启用";
    },
    quicLoginUserChange() {
      this.active2 = this.active2 == "是" ? "不是" : "是";
    },
    // 密码框初始化
    PWDInit() {
      if (this.title == "新增成员" || this.title == "编辑成员") {
        if (this.form.config[8].name != "密码") {
          // let data = {
          //   col: 24, // 独占一行
          //   type: "password",
          //   name: "密码",
          //   placeholder: "请输入密码",
          //   bind: "password",
          //   trigger: "change", // 校验时机
          //   required: "请输入密码",
          //   rules: {
          //     // validator_1:this.regular_PWD,
          //     regular_PWD: "只允许设置8-20位数字和字母的密码！",
          //   },
          // };
          // this.form.config.splice(8, 0, data);
        }
      } else if (this.title == "新增人员" || this.title == "编辑人员") {
        if (this.form.config[4].name != "密码") {
          let data = {
            col: 24, // 独占一行
            type: "password",
            name: "密码",
            placeholder: "请输入密码",
            bind: "password",
            trigger: "change", // 校验时机
            required: "请输入密码",
            rules: {
              // validator_1:this.regular_PWD,
              regular_PWD: "只允许设置8-20位数字和字母的密码！",
            },
          };
          this.form.config.splice(4, 0, data);
        }
      }
    },
    // 单位管理菜单进入初始化
    isDisabled(data) {
      console.log(data);
      this.form.data.buid = data.buid;
      this.form.enums.departmentList.push({
        dataValue: data.buid,
        dataName: data.buName,
      });
      if (data.deptId == "-1" || data.deptId == null) {
        // this.getDepartmentList();
        this.$set(this.form.config[1], "disabled", false);
      } else {
        this.form.data.buid = +data.buid;
        this.form.data.deptId = +data.deptId;
        this.form.enums.typeList.push({
          id: data.deptId,
          deptName: data.deptName,
        });
        this.$set(this.form.config[1], "disabled", true);
      }
      this.disabledFlag = data.disabledFlag;
      this.$set(this.form.config[1], "disabled", true);
      // this.$set(this.form.config[5], "disabled", false);
      this.getFindByCondintion(data.buProperty);
    },
    // 提交
    submit() {
      var parameter = new Promise((resolve, reject) => {
        // console.log(resolve, this.$refs["modelMgrRef"].$refs["modelMgrRefForm"].validate())
        this.$refs["modelMgrRef"].$refs["modelMgrRefForm"].validate((valid) => {
          // console.log(valid)
          if (valid) {
            resolve();
          }
        });
      });
      Promise.all([parameter]).then(() => {
        let data = {
          userId: this.form.data.userId || "",
          enabled: this.form.data.enabled,
          idencode: this.form.data.idencode || "",
          deptId: this.form.data.deptId || "",
          userRoleIds: this.form.data.userRoleIds || "",
          role: this.form.data.role || "",
          mailbox: this.form.data.mailbox || "",
          mobile: this.form.data.mobile || "",
          fullname: this.form.data.fullname || "",
          buid: this.form.data.buid || "",
          jfid: this.form.data.jfid || "",
          position: this.form.data.position || "",
        };

        if (this.title == "新增成员") {
          data.password = this.form.data.password;
          api_addUnitMembers(data)
            .then((res) => {
              // console.log(res);
              if (res.msg && res.msg.code == "0000") {
                this.$message.success("新增成功");
                this.dialogVisible = false;
                this.$emit("refresh");
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else if (this.title == "新增人员") {
          data.password = this.form.data.password;
          data.quicLoginUser = this.form.data.quicLoginUser ? 1 : 0;
          api_opAdd(data)
            .then((res) => {
              if (res.msg && res.msg.code == "0000") {
                this.$message.success("编辑成功");
                this.dialogVisible = false;
                this.$emit("refresh");
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else if (this.title == "编辑成员") {
          data.jfid = this.form.data.jfid;
          api_updateUnitMembers(data)
            .then((res) => {
              if (res.msg && res.msg.code == "0000") {
                this.$message.success("编辑成功");
                this.dialogVisible = false;
                this.$emit("refresh");
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else if (this.title == "编辑人员") {
          data.jfid = this.form.data.jfid;
          data.quicLoginUser = this.form.data.quicLoginUser ? 1 : 0;
          api_opUpdate(data)
            .then((res) => {
              if (res.msg && res.msg.code == "0000") {
                this.$message.success("编辑成功");
                this.dialogVisible = false;
                this.$emit("refresh");
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      });
    },
    // 弹框取消
    colseDialog() {
      this.$refs["modelMgrRef"].$refs["modelMgrRefForm"].resetFields();
      this.dialogVisible = false;
    },
    // 弹框关闭前回调
    bClose(done) {
      this.$refs["modelMgrRef"].$refs["modelMgrRefForm"].resetFields();
      done();
    },
    /**
     * 点击事件类型的选项在点击后执行
     */
    eventNotify(ref) {
      this.$refs[ref].init();
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .quicLoginUserClass {
  .el-form-item__label {
    line-height: 24px;
  }
}

.accountListDialog {
  /deep/.dialog-footer {
    text-align: center;
  }
  .fr {
    float: right;
  }
  .cascader {
    width: 100%;
  }
  .loginSlot {
    width: 37%;
    display: inline-block;
    height: 100%;
    margin-left: 8px;
    img {
      width: 16px;
      height: 16px;
      vertical-align: middle;
    }
    .usable {
      color: #52c41a;
    }
    .notAvailable {
      color: #ff4d4f;
    }
    .el-icon-check {
      background-color: #52c41a;
      color: #fff;
      border-radius: 100%;
    }
    .el-icon-close {
      background-color: #ff4d4f;
      color: #fff;
      border-radius: 100%;
    }
  }
  .modelMgrRef {
    /deep/.el-form {
      .el-form-item:nth-child(1) {
        width: 52% !important;
        padding-right: 0;
      }
      .el-form-item:nth-child(2) {
        width: 48% !important;
        padding-left: 63px !important;
        .el-form-item__label {
          width: 63px !important;
        }
      }
      .loginName {
        // width: 224px;
        .button {
          color: #007aff;
        }
      }
    }
  }
}
</style>
