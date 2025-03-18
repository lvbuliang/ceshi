<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="522px"
      :append-to-body="true"
      :close-on-click-modal="false"
      class="multipleChoiceDialog"
      :before-close="bClose"
    >
      <el-scrollbar style="height:100%">
        <div style="width:100%;max-height:570px">
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
                >
                </el-option>
              </el-select>
            </template>
            <template slot="switch">
              <el-switch
                v-model="form.data.accountStat"
                :active-text="active"
                @change="switchChange"
              >
              </el-switch>
            </template>
            <div class="buidSolt" slot="buid">
              <div class="buidBox" :class="buid ? 'mBt22' : ''">
                <label class="labelActive" for="role">单位：</label>
                <div class="content">
                  <el-select
                    class="buidSelect"
                    v-model="buid"
                    @change="buidChange"
                    :disabled="buidDisabled"
                    filterable
                    placeholder="请选择单位"
                  >
                    <el-option
                      v-for="item in departmentList"
                      :key="item.dataValue"
                      :label="item.dataName"
                      :value="item.dataValue"
                    >
                      <span>{{ item.dataName }}</span>
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div class="buidBox mBt22" v-if="buid">
                <label for="role">部门：</label>
                <div class="content deptId">
                  <el-select
                    class="deptIdSelect"
                    v-model="deptId"
                    multiple
                    placeholder="请选择部门"
                    value-key="dataValue"
                  >
                    <el-option
                      v-for="item in typeList"
                      :key="item.dataValue"
                      :label="item.dataName"
                      :value="item.dataValue"
                      :disabled="item.disabled"
                    >
                      <span>{{ item.dataName }}</span>
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div class="roleBox" v-if="buid">
                <label for="role">角色：</label>
                <div class="content roleId">
                  <el-select
                    class="roleIdSelect"
                    multiple
                    v-model="roleId"
                    value-key="dataValue"
                    placeholder="请选择角色"
                  >
                    <el-option
                      v-for="item in roleList"
                      :key="item.dataValue"
                      :label="item.dataName"
                      :value="item.dataValue"
                      :disabled="item.disabled"
                    >
                      <span>{{ item.dataName }}</span>
                    </el-option>
                  </el-select>
                </div>
              </div>
            </div>
          </FForm>
        </div>
      </el-scrollbar>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">确 定</el-button>
        <el-button @click="colseDialog">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import FForm from '@/components/FForm/form-add'
import {
  api_saveOrUpdate,
  api_isExist,
  api_buPropertyList,
  api_findBuRoleList,
  api_departmentList,
} from '@/api/accountManage/accountManage'
import {
  api_addUnitMembers,
  api_updateUnitMembers,
  api_selectAllUnitList,
} from '@/api/unitManage/unitManage'
import Check from '@/assets/Check.png'
import Circle from '@/assets/Circle.png'
export default {
  components: {
    FForm,
  },
  mounted() {},
  data() {
    return {
      Check: Check,
      Circle: Circle,
      flag: true,
      dialogVisible: false,
      title: '',
      otherConfig: {
        // 其他配置
        labelNum: 100, // label宽度，可选120和150，默认120
        column: 2, // 列数，默认2
        validateOnRuleChange: false,
      },
      form: {
        config: [
          {
            col: 12, // 独占一行
            type: 'text',
            name: '姓名',
            placeholder: '请输入姓名',
            bind: 'fullname',
            trigger: 'blur', // 校验时机
            required: '请输入姓名', // 必填需要指定提示信息
          },
          {
            col: 12, // 独占一行
            type: 'number',
            name: '联系方式',
            placeholder: '请输入联系方式',
            bind: 'mobile',
            trigger: 'blur', // 校验时机
            required: '请输入联系方式', // 必填需要指定提示信息
            rules: {
              // validator_1: this.mobileRules,
              isphone: '请输入正确的联系方式',
            },
          },
          {
            col: 24, // 独占一行
            type: 'text',
            name: '身份证号码',
            placeholder: '请输入身份证号码',
            bind: 'idencode',
            trigger: 'blur', // 校验时机
            // required: '请输入身份证号码', // 必填需要指定提示信息
            rules: {
              regular_IdCard: '请输入正确的身份证号码！',
            },
          },
          {
            col: 24,
            type: 'slot',
            slotName: 'buid',
          },
          {
            col: 24, // 独占一行
            type: 'text',
            name: '职务',
            placeholder: '请输入职务',
            bind: 'role',
          },
          {
            col: 24, // 独占一行
            type: 'text',
            name: '登录账户',
            placeholder: '请输入登录账户',
            bind: 'userId',
            trigger: 'blur', // 校验时机
            required: '请输入登录账户', // 必填需要指定提示信息
            rules: {
              validator_1: this.userIdRules,
            },
            // className: 'loginName',
            // slotName: 'loginSlot'
          },
          {
            col: 24, // 独占一行
            type: 'password',
            name: '密码',
            placeholder: '请输入密码',
            bind: 'password',
            trigger: 'change', // 校验时机
            required: '请输入密码',
            rules: {
              // validator_1:this.regular_PWD,
              regular_PWD: '只允许设置8-20位数字和字母的密码！',
            },
          },
          {
            col: 24, // 独占一行
            type: 'text',
            name: '邮箱',
            placeholder: '请输入邮箱',
            bind: 'mailbox',
            rules: {
              regular_Email: '请输入正确的邮箱',
            },
          },
          {
            type: 'slot',
            slotName: 'switch',
            name: '账号状态',
            bind: 'enabled',
          },
        ],
        data: {
          buid: '',
          fullname: '',
          mobile: '',
          deptId: '',
          role: '', //职务
          roleId: '', //
          idencode: '', //身份证
          userId: '', //账号
          password: '', //
          mailbox: '', //邮箱
          enabled: true, //  false 禁用  true 启用
          accountStat: true,
        },
        enums: {},
        rules: {},
      },
      active: '启用',
      usable: true,
      disabledFlag: false,
      userIdOrg: null,
      role: {
        buid: '',
        deptId: '',
      },
      accountStat:"",
      buProperty: '',
      findBuRoleList: [],
      buid: '',
      buidDisabled: false,
      deptIdIndex: true,
      deptId: [],
      roleId: [],
      departmentList: [],
      roleList: [],
      typeList: [],
    }
  },
  computed: {
    buId() {
      return this.form.data.buid
    },
  },
  watch: {
    buId: {
      handler: function(value) {
        if (value) {
          // this.getDepartmentList()
          // this.getFindByCondintion(this.filietRole(value))
        }
      },
    },
  },
  methods: {
    //遍历禁用选项
    deptDisbled(type) {
      let idList = type== 'deptId'?'typeList':'roleList'
      if (this[type] && this[type].length > 0) {
        let arr = JSON.parse(JSON.stringify(this[idList]))
        arr.forEach((item, index) => {
          let index1 = this[type].find((item1) => {
            return item1 == item.dataValue
          })
          if (index1) {
            item.disabled = true
          }
        })
        this.$set(this, `${idList}`, arr)
        let dom = document.querySelectorAll(`.${type} .el-tag`)
        ;[].forEach.call(dom, (item) => {
          item.children.forEach((item1) => {
            if (item1.localName == 'i') {
              item1.style.display = 'none'
            }
          })
        })
      }
    },
    buidChange(row) {
      this.role.buid = row
      this.form.config[4].disabled = false
      this.form.config[5].disabled = false
      this.form.data.deptId = ''
      this.form.data.roleId = ''
      this.getDepartmentList()
      this.getFindByCondintion(this.filietRole(row))
    },
    changeVal(row, item) {
      console.log(row, item)
      if (item.name == '单位') {
        this.role.buid = row
        this.form.config[4].disabled = false
        this.form.config[5].disabled = false
        this.form.data.deptId = ''
        this.form.data.roleId = ''
        this.getDepartmentList()
        this.getFindByCondintion(this.filietRole(row))
      } else {
        // this.role.deptId = row;
        // this.getFindByCondintion();
      }
    },
    init(data) {
      this.form.data = {
        buid: '',
        fullname: '',
        mobile: '',
        deptId: '',
        role: '', //职务
        roleId: '', //
        idencode: '', //身份证
        userId: '', //账号
        password: '', //
        mailbox: '', //邮箱
        enabled: true, //  false 禁用  true 启用
      }
      this.form.enums.departmentList = []
      this.form.enums.typeList = []
      // this.flag = false
      // this.$nextTick(() => {
      //   this.flag = true
      // })
      this.title = data.title
      if (data.title == '新增成员') {
        this.buid = data.buid
        this.form.config[4].disabled = true
        this.form.config[5].disabled = false
        this.buidDisabled = true
        this.isDisabled(data)
        this.PWDInit()
        // this.getDepartmentList()
      } else if (data.title == '新增人员') {
        this.form.config[4].disabled = true
        this.form.config[5].disabled = true
        this.PWDInit()
        this.getBuPropertyList()
      } else if (data.title == '编辑人员') {
        this.getBuPropertyList(true)
        this.role = {
          buid: data.buid,
          deptId: data.deptId,
        }
        this.form.config[4].disabled = false
        this.form.config[5].disabled = false
        if (this.form.config[6].name == '密码') {
          this.form.config.splice(6, 1)
        }
        this.userIdOrg = data.userId
        let obj = {
          userId: data.userId,
          enabled: data.accountStat ? false : true,
          idencode: data.idCard,
          deptId: data.deptId,
          buid: data.buid,
          roleId: data.roleId,
          role: data.role,
          mailbox: data.mailBox,
          mobile: data.mobile,
          fullname: data.userName,
          jfid: data.jfid,
        }
        this.buid = data.buid
        if(data.deptIds){
          this.deptId=data.deptIds.split(',')
        }else{
          this.deptId = ''
        }
        if(data.roleIds){
          this.roleId=data.roleIds.split(',')
        }else{
          this.roleId=''
        }
        this.active = obj.accountStat ? '启用' : '停用'
        this.$set(this.form, 'data', obj)
        this.getDepartmentList(true)
      } else if (data.title == '编辑成员') {
        if (this.form.config[6].name == '密码') {
          this.form.config.splice(6, 1)
        }
        this.userIdOrg = data.userId
        data.fullname = data.userName
        data.idencode = data.idCard
        data.enabled= data.accountStat ? false : true
        let newData = JSON.parse(JSON.stringify(data))
        this.$set(this.form, 'data', newData)
        this.buid = data.buid
        if(data.roleIds){
          this.roleId=data.roleIds.split(',')
        }else{
          this.roleId=''
        }
        this.buidDisabled = true
        this.isDisabled(data)
        this.active = data.accountStat ? '启用' : '停用'
        // this.getBuPropertyList(true)
        // this.getDepartmentList()
      }
      this.dialogVisible = true
    },
    //获取单位类型下拉
    getBuPropertyList(flag) {
      api_selectAllUnitList()
        .then((res) => {
          if (res.msg && res.msg.code == '0000') {
            let arr = []
            res.data.forEach((item) => {
              let obj = {}
              if (item.buid) {
                obj.buProperty = item.buProperty
                obj.dataValue = item.buid
                obj.dataName = item.buName
                obj.disabled = false
                arr.push(obj)
              }
            })
            this.$set(this, 'departmentList', arr)
            this.findBuRoleList = arr
            if (flag) {
              this.getFindByCondintion(
                this.filietRole(this.form.data.buid)
              )
            }
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    //获取角色下拉列表
    getFindByCondintion(data, type) {
      api_findBuRoleList({ buProperty: data })
        .then((res) => {
          // console.log(res)
          if (res.msg && res.msg.code == '0000') {
            let arr = []
            res.data.forEach((item) => {
              let obj = {}
              if (item.roleId) {
                obj.dataValue = item.roleId.toString()
                obj.dataName = item.roleName
                obj.disabled = false
                arr.push(obj)
              }
            })
            this.$set(this, 'roleList', arr)
            if (type) {
              this.deptDisbled('roleId')
            }
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    //获取部门下拉菜单
    getDepartmentList(type) {
      let data = {
        buid: this.buid,
      }
      api_departmentList(data)
        .then((res) => {
          if (res.msg && res.msg.code == '0000') {
            res.data = res.data.map(({ id, deptName }) => ({
              dataValue: id.toString(),
              dataName: deptName,
              disabled: false,
            }))
            this.$set(this, 'typeList', res.data)
            if (type) {
              this.deptDisbled('deptId')
            } else {
            }
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    // 过滤获取角色参数
    filietRole(row) {
      let buPropertyRole = ''
      this.findBuRoleList.forEach((item) => {
        if (item.dataValue == row) {
          buPropertyRole = item.buProperty
        }
      })
      return buPropertyRole
    },
    //检测登录账号
    userIdRules(rule, value, callback) {
      // console.log(value)
      if (this.userIdOrg == value) {
        callback()
      } else {
        api_isExist({ userId: value })
          .then((res) => {
            if (res.msg && res.msg.code == '0000') {
              if (!res.data) {
                callback()
              } else {
                callback(new Error('账号已存在'))
              }
            } else {
              callback(new Error('账号已存在'))
            }
          })
          .catch((error) => {
            callback(new Error('账号已存在'))
          })
      }
    },
    switchChange() {
      this.active = this.active == '启用' ? '停用' : '启用'
    },

    // 密码框初始化
    PWDInit() {
      if (this.form.config[6].name != '密码') {
        let data = {
          col: 24, // 独占一行
          type: 'password',
          name: '密码',
          placeholder: '请输入密码',
          bind: 'password',
          trigger: 'change', // 校验时机
          required: '请输入密码',
          rules: {
            // validator_1:this.regular_PWD,
            regular_PWD: '只允许设置8-20位数字和字母的密码！',
          },
        }
        this.form.config.splice(6, 0, data)
      }
    },
    // 单位管理菜单进入初始化
    isDisabled(data) {
      this.form.data.buid = data.buid
      this.departmentList.push({
        dataValue: data.buid,
        dataName: data.buName,
      })
      if (data.deptIds == '-1' || !data.deptIds ) {
        this.deptId = ''
        this.getDepartmentList()
      } else {
        this.form.data.buid = data.buid
        this.deptId=data.deptIds.split(',')
        this.getDepartmentList(true)
      }
      this.disabledFlag = data.disabledFlag
      this.getFindByCondintion(data.buProperty)
    },
    // 提交
    submit() {
      console.log(this.form.data);
      var parameter = new Promise((resolve, reject) => {
        // console.log(resolve, this.$refs["modelMgrRef"].$refs["modelMgrRefForm"].validate())
        this.$refs['modelMgrRef'].$refs['modelMgrRefForm'].validate((valid) => {
          // console.log(valid)
          if (valid) {
            resolve()
          }
        })
      })
      Promise.all([parameter]).then(() => {
        if (!this.buid) {
          return
        }
        let deptIds=''
        let roleIds = ''
        if(this.deptId&&this.deptId.length>0){
          deptIds = this.deptId.join(',')
        }
        if(this.roleId&&this.roleId.length>0){
          roleIds = this.roleId.join(',')
        }
        let data = {
          userId: this.form.data.userId,
          enabled: this.form.data.enabled,
          idencode: this.form.data.idencode,
          deptIds,
          roleIds,
          role: this.form.data.role,
          mailbox: this.form.data.mailbox,
          mobile: this.form.data.mobile,
          fullname: this.form.data.fullname,
          buid: this.buid,
        }

        if (this.title == '新增成员' || this.title == '新增人员') {
          data.password = this.form.data.password
          api_addUnitMembers(data)
            .then((res) => {
              // console.log(res);
              if (res.msg && res.msg.code == '0000') {
                this.$message.success('新增成功')
                this.dialogVisible = false
                this.$emit('refresh')
              }
            })
            .catch((error) => {
              console.log(error)
            })
        } else if (this.title == '编辑成员' || this.title == '编辑人员') {
          data.jfid = this.form.data.jfid
          api_updateUnitMembers(data)
            .then((res) => {
              if (res.msg && res.msg.code == '0000') {
                this.$message.success('编辑成功')
                this.dialogVisible = false
                this.$emit('refresh')
              }
            })
            .catch((error) => {
              console.log(error)
            })
        }
      })
    },
    // 弹框取消
    colseDialog() {
      this.$refs['modelMgrRef'].$refs['modelMgrRefForm'].resetFields()
      this.buid = ''
      this.deptId = []
      this.roleId = []
      this.departmentList = []
      this.roleList = []
      this.typeList = []
      this.dialogVisible = false
    },
    // 弹框关闭前回调
    bClose(done) {
      // this.$refs['modelMgrRef'].$refs['modelMgrRefForm'].resetFields()
      this.colseDialog()
      done()
    },
    /**
     * 点击事件类型的选项在点击后执行
     */
    eventNotify(ref) {
      this.$refs[ref].init()
    },
  },
}
</script>

<style lang="scss" scoped>
.multipleChoiceDialog {
  // max-height: 500px;
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
  ::v-deep .modelMgrRef {
    .el-form {
      max-height: 570px;
      .el-form-item:nth-child(1) {
        width: 52% !important;
        padding-right: 0;
      }
      .el-form-item:nth-child(2) {
        width: 48% !important;
        padding-left: 66px !important;
        .el-form-item__label {
          width: 66px !important;
        }
      }
      .loginName {
        // width: 224px;
        .button {
          color: #007aff;
        }
      }
    }
    .buidSolt {
      .mBt22 {
        // margin-bottom: 22px;
      }
      .labelActive {
        &::after {
          content: '*';
          color: #ff4d4f;
          left: -9px;
          position: absolute;
        }
      }
      .buidBox {
        position: relative;
        label {
          position: absolute;
          left: -44px;
        }
      }
      .roleBox {
        position: relative;
        label {
          position: absolute;
          left: -44px;
        }
      }
    }
  }
}
</style>
