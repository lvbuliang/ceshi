<template>
  <el-dialog
    class="roleListDialog common-dialog"
    :title="title"
    :visible.sync="dialogVisible"
    width="700px"
    :before-close="close"
  >
    <FForm
      v-if="flag"
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
      <template slot="switch">
        <el-switch
          v-model="form.data.status"
          :active-text="active"
          @change="switchChange"
        >
        </el-switch>
      </template>
    </FForm>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submit">确 定</el-button>
      <el-button @click="close">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import FForm from "@/components/FForm/form-add";
import { addandedit_api_biaozhunhua,api_buPropertyList} from "@/api/roleManage/roleManage_biaozhunhua";
export default {
  components: {
    FForm,
  },
  data() {
    return {
      active: "启用",
      flag: false,
      title: "",
      dialogVisible: false,
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
            name: "角色名称",
            placeholder: "请输入角色名称",
            bind: "roleName",
            trigger: "blur", // 校验时机
            required: "请输入角色名称", // 必填需要指定提示信息
          },
          {
            col: 24, // 独占一行
            type: "text",
            name: "角色编码",
            placeholder: "请输入角色编码",
            bind: "roleCode",
            trigger: "blur",
            required: "请输入角色编码", // 必填需要指定提示信息
            rules: {
              validator_1: this.validator, // 自定义事件校验（仅在其他校验方式无法实现时使用）
            },
          },
          {
            type: "select",
            name: "单位类型",
            bind: "buProperty",
            dataList: "buPropertyList",
            col: 24,
            trigger: "blur", // 校验时机
            required: "请选择单位类型", // 必填需要指定提示信息
            change: this.buPropertyChange,
          },
          // {
          //   type: "select",
          //   name: "父级角色",
          //   bind: "parentBuid",
          //   dataList: "parentBuidList",
          //   placeholder: "请选择父级角色",
          //   col: 24,
          //   disabled: true,
          // },
          // {
          //   type: "checkbox",
          //   name: "权限范围",
          //   bind: "dataType",
          //   dataList: "dataTypeList",
          //   col: 24,
          //   trigger: "blur", // 校验时机
          //   required: "请选择权限范围", // 必填需要指定提示信息
          // },
          {
            col: 24, // 独占一行
            type: "textarea",
            name: "角色描述",
            placeholder: "请输入角色描述，限制在50字以内",
            showWordLimit: true, // 显示限制字数
            maxlength: 100,
            bind: "remark",
            trigger: "blur", // 校验时机
            required: "请输入角色描述", // 必填需要指定提示信息
          },
          {
            type: "slot",
            slotName: "switch",
            name: "角色是否启用",
            bind: "status",
          },
        ],
        data: {
          roleName: "",
          roleCode: "",
          roleId: "",
          status: true,
          remark: "",
          hasBuPower: 1,
          buProperty: "",
          dataType: [],
        },
        enums: {
          buPropertyList: [],
          dataTypeList: [
            {
              dataName: "个人权限",
              dataValue: 3,
            },
            {
              dataName: "单位权限",
              dataValue: 2,
            },
            {
              dataName: "平台权限",
              dataValue: 1,
            },
          ],
          typeList: [
            {
              dataName: "企业角色",
              dataValue: 1,
            },
            {
              dataName: "部门角色",
              dataValue: 2,
            },
            {
              dataName: "个人角色",
              dataValue: 3,
            },
          ],
          parentBuidList: [],
        },
        rules: {},
      },
    };
  },
  mounted() {
    this.getBuPropertyList();
  },
  methods: {
    buPropertyChange(item, value) {
      // if (this.title == "新增角色") {
      //   if (value) {
      //     this.getAloneRole(item);
      //   }
      // }
    },
    switchChange() {
      this.active = this.active == "启用" ? "停用" : "启用";
      // console.log(this.form.data.accountStat);
    },
    init(data) {
      this.flag = false;
      this.$nextTick(() => {
        this.flag = true;
      });
      this.title = data.title;
      if (data.roleId) {
        if (data.dataType && typeof data.dataType == "string") {
          data.dataType = data.dataType.split(",").map(Number);
        } else if (data.dataType && data.dataType.length > 0) {
          data.dataType = data.dataType;
        } else {
          data.dataType = [];
        }
        this.form.data = JSON.parse(JSON.stringify(data));
        this.active = data.status ? "启用" : "停用";
        this.form.data.status = data.status ? true : false;
      }
      this.dialogVisible = true;
    },
    getAloneRole(buProperty) {
      api_getAloneRole({ buProperty }).then((res) => {
        if (res.msg.code == "0000") {
          if (res.data && res.data.length > 0) {
            this.form.enums.parentBuidList = res.data.map((item) => {
              return {
                dataValue: item.role_id,
                dataName: item.role_name,
              };
            });
          }
            this.form.config[3].disabled = false;
        }
      });
    },
    //获取角色类型下拉
    getBuPropertyList() {
      api_buPropertyList().then((res) => {
        if (res.msg && res.msg.code == "0000") {
          let arr = [];
          res.data.forEach((item) => {
            let obj = {};
            if (item.id) {
              obj.dataValue = item.id;
              obj.dataName = item.propertyName;
              arr.push(obj);
            }
          });
          this.$set(this.form.enums, "buPropertyList", arr);
        }
      });
    },
    close() {
      this.form.data = {
        roleName: "",
        roleCode: "",
        roleId: "",
        status: "",
        remark: "",
        buProperty: "",
        dataType: [],
      };
      this.dialogVisible = false;
    },
    eventNotify() {},
    validator(rule, value, callback) {
      if (/[\u4E00-\u9FA5]/g.test(value)) {
        callback(new Error("角色Code不能输入汉字!"));
      } else {
        callback();
      }
    },
    submit() {
      var parameter = new Promise((resolve, reject) => {
        this.$refs["modelMgrRef"].$refs["modelMgrRefForm"].validate((valid) => {
          if (valid) {
            resolve();
          }
        });
      });
      Promise.all([parameter]).then(() => {
        let data = {
          roleId: this.form.data.roleId,
          roleName: this.form.data.roleName,
          roleCode: this.form.data.roleCode,
          status: this.form.data.status ? 1 : 0,
          remark: this.form.data.remark,
          hasBuPower: 1,
          buProperty: this.form.data.buProperty,
          dataType: this.form.data.dataType,
        };
        // if (this.title == "新增角色") {
        //   data.parentBuid = this.form.data.parentBuid;
        //   if (data.parentBuid) {
        //     let obj = this.form.enums.parentBuidList.find((item) => {
        //       return item.dataValue == data.parentBuid;
        //     });
        //     data.parentNames = obj.dataName;
        //   }
        // }
        // console.log(JSON.stringify(data), data)
        addandedit_api_biaozhunhua(data).then((res) => {
          if (res.msg && res.msg.code == "0000") {
            this.$message({
              message: this.title.substring(0, 2) + "成功",
              type: "success",
            });
            this.$emit("success", true);
            this.close();
          }
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.roleListDialog {
  /deep/.dialog-footer {
    text-align: center;
  }
}
</style>
