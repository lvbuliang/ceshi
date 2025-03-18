<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="1000px"
      :before-close="handleClose"
      :close-on-click-modal="false"
      :append-to-body="true"
      :showClose="false"
      class="bzhTableHeader"
    >
      <div class="content_box">
        <div class="content_title">成员管理</div>
        <div class="conTitle">
          <div class="sys" :class="title.systenName ? '' : 'white'">
            <span class="sysText">系统名称</span>:&nbsp;{{ title.systenName }}
          </div>&nbsp;&nbsp;
          <div class="pro" :class="title.projectName ? '' : 'white'">
            <span class="sysText">项目名称</span>:&nbsp;{{ title.projectName }}
          </div>
        </div>
        <SrAdd
          class="sradd"
          :config="form.config"
          :enums="form.enums"
          :form="form.data"
          :otherConfig="form.otherConfig"
          ref="add1"
        >
          <template slot="reportWriter">
            <div class="reportWriter">
              <el-input
                v-model="form.data.weeklyPerson"
                placeholder="请输入内容"
                :disabled="true"
              ></el-input>
              <div class="btn" @click="addReport">
                <i class="el-icon-plus"></i>
              </div>
            </div>
          </template>
        </SrAdd>

        <!-- 多标段 sectionSorts > 1-->
        <div class="content" v-if="sectionSorts > 1">
          <div
            class="content-item"
            v-for="(item, index) in result"
            :key="index"
          >
            <div class="item-sort">标段{{ index + 1 }}</div>
            <div>
              <SrAdd
                class="sradd"
                :config="cjdwConfig.config"
                :enums="cjdwConfig.enums"
                :form="cjdwConfig.data"
                :otherConfig="cjdwConfig.otherConfig"
                ref="add2"
              >
                <!-- 承建单位 -->
                <template slot="contractUnit">
                  <el-select @clear="clearA(index)" clearable  v-model="contractUnit[index]" placeholder="请选择" @change="changeA(index, $event, 'change')">
                    <el-option
                      v-for="item in options1"
                      :key="item.dataValue"
                      :label="item.dataName"
                      :value="item.dataValue"
                    >
                    </el-option>
                  </el-select>
                </template>
                <!-- 承建单位项目经理 -->
                <template slot="contractor">
                  <el-select @clear="clearB(index)" clearable  v-model="contractor[index]" placeholder="请选择" @change="changeB(index, $event)">
                    <el-option
                      v-for="item in options2"
                      :key="item.mobile"
                      :label="item.dataName"
                      :value="item.dataValue"
                    >
                    </el-option>
                  </el-select>
                </template>
                <!-- 承建单位项目经理电话 -->
                <template slot="contractorPhoneNumber">
                  <el-input
                      v-model="contractorPhoneNumber[index]"
                      placeholder="请输入内容"
                      :disabled="true"
                    ></el-input>
                </template>
                <!-- 周报审批人 -->
                <template slot="reportWriter">
                  <div class="reportWriter">
                    <el-input
                      v-model="weeklyPerson[index]"
                      placeholder="请输入内容"
                      :disabled="true"
                    ></el-input>
                    <div class="btn" @click="addReportItem('others', index)">
                      <i class="el-icon-plus"></i>
                    </div>
                  </div>
                </template>
              </SrAdd>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="sectionSorts > 1 ? saveHeader2() : saveHeader()"> 保存 </el-button>
      </div>
    </el-dialog>
    <DialogT
      :openType="openType"
      :index="value4Index"
      :data="dataCopy"
      :dialogVisible="reportDialog"
      @close="reportDialogClose"
      @saveSelectData="reportDialogSave"
      @saveSelectDataItem="reportDialogSaveItem"
    />
  </div>
</template>
<script>
import vuedraggable from "vuedraggable";
// import TestFormAdd from "../../../components/srFormAdd.vue";
import {
  getQueryBizunitsByProperty,
  getProjectDetail,
  getUserByRoleCode,
  queryUsersByBuProperty,
  getSectionCount
} from "@/api/planProject";
import { cjdwConfig } from "./const";
import DialogT from "./DialogT.vue";
export default {
  name: "SrSettingTable",
  components: { vuedraggable, DialogT },
  props: {
    dialogVisible: {
      type: Boolean,
      default() {
        return true;
      },
    },
    personData: {
      type: Number,
    },
    // 成员管理批量选择ids
    pilIds: {
      type: Array,
    },
    // 成员管理批量or行间
    memberManageText: {
      type: String,
    },
    data: {
      type: Array,
      default() {
        return [];
      },
    },
    dataTwo: {
      type: Array,
      default() {
        return [];
      },
    },
    dataThree: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  updated() {
    //console.log("已选择数据", this.selectdata);
  },
  data() {
    return {
      openType: null,
      cjdwConfig,
      result: [],
      contractUnit: [], // 承建单位id数据数组
      contractUnitFullName: [], //承建单位名称数据数组
      contractor: [], // 承建单位项目经理id数组
      contractorName: [], //承建单位项目经理名称数组
      contractorPhoneNumber: [], // 承建单位项目经理电话
      weeklyPerson: [], // 周报审批人名称
      weeklyPersonId: [], // 周报审批人id
      options1: [],
      options2: [],
      value1Index: 0,
      value4Index: 0,
      datazb1: [],
      datazb2: [],
      datazb3: [],
      datazbAll: [],
      dataCopy: [],
      reportDialog: false,
      fromData: {},
      editableTabs: [],
      form: {
        otherConfig: {
          labelNum: 155,
        },
        config: [
          {
            type: "select",
            name: "项目负责人",
            placeholder: "请选择",
            // bind: "contactName",
            bind: "contactId",
            dataList: "xmfzrList",
            col: 8,
            filterable: true,
            // required: "项目负责人不能为空",
          },
          {
            type: "select",
            name: "方案经理",
            placeholder: "请选择",
            bind: "programManagerId",
            // bind: "programManagerName",
            dataList: "programManagerList",
            col: 8,
            filterable: true,
            // required: "方案经理不能为空",
          },
          {
            type: "select",
            name: "客户经理",
            placeholder: "请选择",
            bind: "clientManagerId",
            // bind: "clientManagerName",
            dataList: "clientManagerList",
            col: 8,
            filterable: true,
            // required: "客户经理不能为空",
          },
          {
            type: "select",
            name: "采购经理",
            placeholder: "请选择",
            bind: "procurementManagerId",
            // bind: "procurementManagerName",
            dataList: "procurementManagerNameList",
            maxLength: 8,
            class: "gg",
            col: 8,
            filterable: true,
          },
          {
            type: "select",
            name: "监理单位",
            placeholder: "请选择",
            bind: "controlUnit",
            // bind: "controlUnitFullName",
            dataList: "jlList",
            trigger: "change",
            col: 8,
            change: this.selectJL,
            filterable: true,
          },
          {
            type: "select",
            name: "监理工程师",
            placeholder: "请选择",
            bind: "controlJfid",
            // bind: "controlName",
            dataList: "controlNameList",
            maxLength: 20,
            col: 8,
            filterable: true,
            trigger: "change",
            change: this.selectJLGCS,
          },
          {
            type: "input",
            name: "监理工程师联系方式",
            placeholder: "请输入",
            bind: "controlorPhoneNumber",
            maxLength: 20,
            col: 8,
          },
          /* {
            type: 'select',
            name: '周报填报人',
            placeholder: '请选择',
            // bind: 'procurementManagerName',
            maxLength: 16,
            class: 'gg',
            col: 16,
          }, */
          
          {
            type: "slot",
            slotName: "reportWriter",
            name: "周报填报人",
            placeholder: "请选择",
            bind: "weeklyPerson",
            maxLength: 16,
            class: "gg",
            col: 16,
          },
          {
            type: "select",
            name: "承建单位",
            placeholder: "请选择",
            bind: "contractUnit",
            // bind: "contractUnitFullName",
            dataList: "contractUnitFullName",
            trigger: "change",
            change: this.selectCJ,
            col: 8,
            filterable: true,
          },
          {
            type: "select",
            name: "承建单位项目经理",
            placeholder: "请选择",
            bind: "contractor",
            // bind: "contractorName",
            dataList: "contractorNameList",
            maxLength: 20,
            col: 8,
            filterable: true,
            trigger: "change",
            change: this.selectCJJL,
          },
          {
            type: "input",
            name: "承建单位项目经理电话",
            placeholder: "请输入",
            bind: "contractorPhoneNumber",
            maxLength: 20,
            col: 8,
          },
        ],
        data: {
          contactName: "",
          programManagerName: "",
          clientManagerName: "",
          procurementManagerName: "",

          // contractUnit: "",
          contractUnitFullName: "", //
          contractorName: "",
          contractorPhoneNumber: "",
          // controlUnit: "",
          controlUnitFullName: "", //
          controlName: "", //监理工程师
          controlJfid: "",
          controlorPhoneNumber: "", //监理工程师联系方式
          weeklyPerson: "", //周报填报人
          weeklyPersonId: "",
          contactId: "", // 项目负责人id
          programManagerId: "",
          clientManagerId: "",
          procurementManagerId: "",
          contractUnit: "",
          contractor: "", //承建单位项目经理
          controlUnit: "",
        },
        enums: {
          xmfzrList: [],
          contactNameList: [],
          programManagerList: [],
          clientManagerList: [],
          procurementManagerNameList: [],
          contractUnitFullName: [],
          controlUnitFullName: [],
          contractorNameList: [], //cjdwxmjl
          controlNameList: [],
          jlList: [],
        },
      },
      templateId: this.$route.query.templateId,
      // 标题
      title: {
        systenName: "",
        projectName: "",
      },
      sectionSorts: 0,
    };
  },
  created() {
    this.getProjectDetailA();
    this.getUserByRoleCodeA();
    this.getQueryBizunitsByPropertyA("CJDW");
    //console.log("dasdadasd", this.contractUnitFullName);
    this.getQueryBizunitsByPropertyA("JLDW");
    // this.getQueryBizunitsByPropertyB()
    this.queryUsersByBuPropertyA();
  },
  mounted() {},
  methods: {
    searchSection(row) {
      console.log("row", row);

      getSectionCount({ projectId: row.id }).then((res) => {
        if (res.msg.code == "0000") {
          this.sectionSorts = res.data;

          if (this.sectionSorts > 1) {
            for (let index = 0; index < res.data; index++) {
              this.result.push(this.cjdwConfig)
              
            }
            this.$set(this.form.config[7], 'name', '周报审批人')
            this.form.config = this.form.config.splice(
              0,
              this.form.config.length - 3
            );
          }
        }
      });
    },
    handleClose() {
      this.$emit("close");
    },
    async queryUsersByBuPropertyA() {
      const res1 = await queryUsersByBuProperty(3);
      const res2 = await queryUsersByBuProperty(40);
      const res3 = await queryUsersByBuProperty(4);
      this.datazbAll.push(...res1.data);
      this.datazbAll.push(...res2.data);
      this.datazbAll.push(...res3.data);
      this.datazbAll = this.datazbAll.map((item, index) => {
        const buid = item.buid;
        const buName = item.buName;
        const buUniqueCode = item.buUniqueCode;
        const userBaseInfoVos = [];
        userBaseInfoVos.push({
          jfid: item.jfid,
          roleCode: item.roleCode,
          buid: item.buid,
          buName: item.buName,
          roleName: item.roleName,
          fullname: item.fullname,
          buUniqueCode: item.buUniqueCode,
        });
        return {
          buid,
          buName,
          buUniqueCode,
          userBaseInfoVos,
        };
      });
      this.dataCopy = this.datazbAll;
      let len = this.dataCopy.length;
      for (let i = 0; i < len; i++) {
        for (let j = i + 1; j < len; j++) {
          if (this.dataCopy[i].buid == this.dataCopy[j].buid) {
            this.dataCopy[i].userBaseInfoVos.push(
              ...this.dataCopy[j].userBaseInfoVos
            );
            this.dataCopy.splice(j, 1);
            len--;
            j--;
          }
        }
      }
      //console.log(this.dataCopy, "this.dataCopy");
    },

    getQueryBizunitsByPropertyA(d) {
      getQueryBizunitsByProperty({ buPropertyEnum: d }).then((res) => {
        if (d == "CJDW") {
          //console.log("sdadadad", res.data);
          res.data.map((element) => {
            //console.log("承建单位", element.buName);
            this.form.enums.contractUnitFullName.push({
              dataName: String(element.buName),
              dataValue: String(element.buid),
            });
          });
          this.options1 = this.form.enums.contractUnitFullName
          //console.log("ioioioi", this.form.enums.contractUnitFullName);
        } else {
          // this.controlUnitFullName = res.data
          res.data.map((element) => {
            //console.log("监理单位", element.buName);
            this.form.enums.jlList.push({
              dataName: String(element.buName),
              dataValue: String(element.buid),
            });
          });
        }
      });
    },
    changeA(index, val, type) {
      this.value1Index = index;
      console.log('index:', index, 'value1Index:', this.value1Index, '承建单位:', this.contractUnit);
      if(type == 'change') {
         this.contractor[index] = '';
         this.contractorName[index] = '';
         this.contractorPhoneNumber[index] = '';
      }
      let idx = this.options1.findIndex(item => item.dataValue == String(val))
      this.contractUnitFullName[index] = this.options1[idx].dataName;
      // this.options2 = [];
      getUserByRoleCode({
        roleCode: "CJDW_XMJL",
        buid: this.contractUnit[index],
      }).then((res) => {
        if (res.data) {
          let newArr = []
          res.data.map((element) => {
            if (element.fullname) {
              newArr.push({
                dataName: String(element.fullname),
                dataValue: String(element.jfid),
                mobile: String(element.mobile),
              });
            }
          });
          this.options2 = newArr
          console.log('xxx', this.options2);
          
        }
      });
    },
    clearA(index) {
      this.contractUnit[index] = '';
      this.contractUnitFullName[index] = '';
      this.contractor[index] = '';
      this.contractorName[index] = '';
      this.contractorPhoneNumber[index] = '';
    },
    changeB(index, val) {
      let idx = this.options2.findIndex(item => item.dataValue == String(val))
      this.contractorName[index] = this.options2[idx].dataName
      console.log('切换承建单位项目经理', val, this.contractor, this.contractorPhoneNumber, index, idx, this.options2);
      this.contractorPhoneNumber[index] = this.options2[idx].mobile
       
    },
    clearB(index) {
      this.contractor[index] = '';
      this.contractorName[index] = '';
      this.contractorPhoneNumber[index] = '';
    },
    saveHeader() {
      let data = this.$refs["add1"].validate();
      // //console.log("成员管理保存的数据", data);
      data.contactName = this.getAllId(
        this.form.enums.xmfzrList,
        data.contactId
      );
      data.programManagerName = this.getAllId(
        this.form.enums.programManagerList,
        data.programManagerId
      );
      data.clientManagerName = this.getAllId(
        this.form.enums.clientManagerList,
        data.clientManagerId
      );
      data.procurementManagerName = this.getAllId(
        this.form.enums.procurementManagerNameList,
        data.procurementManagerId
      );
      data.contractUnitFullName = this.getAllId(
        this.form.enums.contractUnitFullName,
        data.contractUnit
      );
      data.contractorName = this.getAllId(
        this.form.enums.contractorNameList,
        data.contractor
      );
      data.controlUnitFullName = this.getAllId(
        this.form.enums.jlList,
        data.controlUnit
      );
      data.controlName = this.getAllId(
        this.form.enums.controlNameList,
        data.controlJfid
      );
      // //console.log("chuuhuhu", data);
      // getQueryBizunitsByProperty(data).then((res) => {
      //   //console.log('成员管理数据', res.msg.code)
      // })
      /* this.selectdata.forEach((item1, index) => {
        this.allData.forEach((item) => {
          if (item1.itemCode == item.itemCode) {
            item.index = index;
          }
          //console.log(item);
        });
      }); */
      // if (this.selectdata.length == 0) {
      //   this.$message({
      //     type: 'warning',
      //     message: '请选择协审服务人员',
      //   })
      //   return
      // } else {
      this.$emit("saveLabelList", data);
      // }
      /* let flag = false;
      this.selectdata.map((item) => {
        //console.log(item);
        if (item.fullName == "信创小组") {
          flag = true;
        }
      });
      if (flag) {
        this.$emit("saveLabelList", this.allData, this.selectdata);
      } else {
        this.$message({
          type: "warning",
          message: "请选择信创审核小组",
        });
        return;
      } */
    },
        // 多标段数据保存
    saveHeader2() {
      let data = this.$refs["add1"].validate();
      
      data.contactName = this.getAllId(
        this.form.enums.xmfzrList,
        data.contactId
      );
      data.programManagerName = this.getAllId(
        this.form.enums.programManagerList,
        data.programManagerId
      );
      data.clientManagerName = this.getAllId(
        this.form.enums.clientManagerList,
        data.clientManagerId
      );
      data.procurementManagerName = this.getAllId(
        this.form.enums.procurementManagerNameList,
        data.procurementManagerId
      );
      // data.contractUnitFullName = this.getAllId(
      //   this.form.enums.contractUnitFullName,
      //   data.contractUnit
      // );
      // data.contractorName = this.getAllId(
      //   this.form.enums.contractorNameList,
      //   data.contractor
      // );
      // data.controlUnitFullName = this.getAllId(
      //   this.form.enums.jlList,
      //   data.controlUnit
      // );
      // data.controlName = this.getAllId(
      //   this.form.enums.controlNameList,
      //   data.controlJfid
      // );
      console.log("成员管理保存的数据", this.contractUnit, this.contractor, this.contractorPhoneNumber, this.weeklyPerson, this.weeklyPersonId);
      let newArr = [];
      for (let index = 0; index < this.contractUnit.length; index++) {
        newArr.push({
          contractUnit: this.contractUnit[index],
          contractUnitFullName: this.contractUnitFullName[index],
          contractor: this.contractor[index],
          contractorName: this.contractorName[index],
          contractorPhoneNumber: this.contractorPhoneNumber[index],
          fieldNo: index + 1,
          weeklyPerson: this.weeklyPerson[index],
          weeklyPersonId: this.weeklyPersonId[index],
          projectId: ''
        })
        
      }
      data.memberFieldInfoDtos = newArr

      this.$emit("saveLabelList2", data);
    },
    // 成员管理回显数据
    getMemberManage(personData) {
      getProjectDetail({ id: personData }).then((res) => {
        console.log(res,'ssssssssssssssss')
        this.form.data.contactName = res.data.contactName;
        this.form.data.contactId = res.data.contactId
          ? res.data.contactId + ""
          : "";
        this.form.data.programManagerName = res.data.programManagerName;
        this.form.data.programManagerId = res.data.programManagerId
          ? res.data.programManagerId + ""
          : "";
        this.form.data.clientManagerName = res.data.clientManagerName;
        this.form.data.clientManagerId = res.data.clientManagerId
          ? res.data.clientManagerId + ""
          : "";
        this.form.data.procurementManagerName = res.data.procurementManagerName;
        this.form.data.procurementManagerId = res.data.procurementManagerId
          ? res.data.procurementManagerId + ""
          : "";
        this.form.data.contractUnitFullName = res.data.contractUnitFullName;
        this.form.data.contractUnit = res.data.contractUnit
          ? res.data.contractUnit + ""
          : "";
        this.form.data.contractor = res.data.contractor
          ? res.data.contractor + ""
          : "";
        this.form.data.contractorName = res.data.contractorName;
        this.form.data.contractorPhoneNumber = res.data.contractorPhoneNumber;
        this.form.data.controlUnit = res.data.controlUnit
          ? res.data.controlUnit + ""
          : "";
        this.form.data.controlUnitFullName = res.data.controlUnitFullName;
        this.form.data.controlName = res.data.controlName;
        this.form.data.controlJfid = res.data.controlJfid
          ? res.data.controlJfid + ""
          : "";
        this.form.data.controlorPhoneNumber = res.data.controlorPhoneNumber;
        this.form.data.weeklyPerson = res.data.weeklyPerson;
        this.form.data.weeklyPersonId = res.data.weeklyPersonId;
        // this.getJlAndCjData();
        // 系统名称
        this.title.systenName = res.data.systemName;
        this.title.projectName = res.data.projectName;

        if(res.data.menberFieldInfoList !== null && res.data.menberFieldInfoList.length > 0) {
          this.contractUnit = [];
          this.contractUnitFullName = [];
          this.contractor = [];
          this.contractorName = [];
          this.contractorPhoneNumber = [];
          this.weeklyPerson = [];
          this.weeklyPersonId = [];
          console.log('有多标段数据', res.data.menberFieldInfoList);
          for (let index = 0; index < res.data.menberFieldInfoList.length; index++) {
            this.contractUnit.push(String(res.data.menberFieldInfoList[index].contractUnit))
            this.contractUnitFullName.push(res.data.menberFieldInfoList[index].contractUnitFullName)
            this.changeA(index, String(res.data.menberFieldInfoList[index].contractUnit), 'huixian');
            this.contractor.push(String(res.data.menberFieldInfoList[index].contractor))
            this.contractorName.push(res.data.menberFieldInfoList[index].contractorName)
            this.contractorPhoneNumber.push(res.data.menberFieldInfoList[index].contractorPhoneNumber)
            this.weeklyPerson.push(res.data.menberFieldInfoList[index].weeklyPerson)
            this.weeklyPersonId.push(res.data.menberFieldInfoList[index].weeklyPersonId)
          }          
        }
      });
    },
    getProjectDetailA() {
      /**
       * 行间成员管理
       * 批量成员管理  1个回显 多个不回显
       */
      if (this.memberManageText == "成员管理内") {
        // if (this.personData > 0) {
          this.getMemberManage(this.personData);
        // }
      } else if (this.memberManageText == "成员管理外") {
        if (this.pilIds.length == 1) {
          this.getMemberManage(this.pilIds[0]);
        }
      }
    },
    getAllId(list, id) {
      let label = "";
      // //console.log(8884444444, id, list);
      const element = list.find((element) => element.dataValue == id);
      // //console.log("aaa", element);
      // return;
      if (element) {
        label = element.dataName;
      }
      return label;
    },
    // 根据code  拿到角色信息
    getUserByRoleCodeA() {
      getUserByRoleCode({ roleCode: "XMFZR" }).then((res) => {
        //console.log("XMFZR", res.data);
        res.data.map((element) => {
          if (element.fullname) {
            this.form.enums.xmfzrList.push({
              dataName: String(element.fullname),
              dataValue: String(element.jfid),
            });
          }
        });
      });
      getUserByRoleCode({ roleCode: "FAJL" }).then((res) => {
        //console.log("方案经理", res.data);
        res.data.map((element) => {
          if (element.fullname) {
            this.form.enums.programManagerList.push({
              dataName: String(element.fullname),
              dataValue: String(element.jfid),
            });
          }
        });
      });
      getUserByRoleCode({ roleCode: "KHJL" }).then((res) => {
        //console.log("客户经理", res.data);
        res.data.map((element) => {
          if (element.fullname) {
            this.form.enums.clientManagerList.push({
              dataName: String(element.fullname),
              dataValue: String(element.jfid),
            });
          }
        });
      });
      getUserByRoleCode({ roleCode: "CGJL" }).then((res) => {
        //console.log("采购经理", res.data);
        res.data.map((element) => {
          if (element.fullname) {
            this.form.enums.procurementManagerNameList.push({
              dataName: String(element.fullname),
              dataValue: String(element.jfid),
            });
          }
        });
      });
      // this.getJlAndCjData()
    },
    // 获取承建单位项目经理以及简历工程师
    // getJlAndCjData() {
    //   getUserByRoleCode({
    //     roleCode: "CJDW_XMJL",
    //     buid: this.form.data.contractUnit,
    //   }).then((res) => {
    //     this.form.enums.contractorNameList = [];
    //     //console.log("承建单位项目经理", res.data);
    //     res.data.map((element) => {
    //       if (element.fullname) {
    //         this.form.enums.contractorNameList.push({
    //           dataName: String(element.fullname),
    //           dataValue: String(element.jfid),
    //         });
    //       }
    //     });
    //     //console.log(
    //       this.form.enums.contractorNameList,
    //       "this.form.enums.contractorNameList123232"
    //     );
    //   });
    //   getUserByRoleCode({
    //     roleCode: "JLGCS",
    //     buid: this.form.data.controlUnit,
    //   }).then((res) => {
    //     //console.log("监理工程师", res.data);
    //     this.form.enums.controlNameList = [];
    //     if (res.data) {
    //       res.data.map((element) => {
    //         this.form.enums.controlNameList.push({
    //           dataName: String(element.fullname),
    //           dataValue: String(element.jfid),
    //         });
    //       });
    //     }
    //   });
    // },
    // 获取承建单位项目经理下拉框
    getContractorNameList(val) {
      getUserByRoleCode({
        roleCode: "CJDW_XMJL",
        buid: val,
      }).then((res) => {
        this.form.enums.contractorNameList = [];
        if (res.data) {
          res.data.map((element) => {
            if (element.fullname) {
              this.form.enums.contractorNameList.push({
                dataName: String(element.fullname),
                dataValue: String(element.jfid),
                mobile: String(element.mobile),
              });
            }
          });
          //console.log(res.data,'建设')
        }
      });
    },
    // 获取监理经理下拉框
    getControlNameList(val) {
      getUserByRoleCode({
        roleCode: "JLGCS",
        buid: val,
      }).then((res) => {
        this.form.enums.controlNameList = [];
        if (res.data) {
          res.data.map((element) => {
            if (element.fullname) {
              this.form.enums.controlNameList.push({
                dataName: String(element.fullname),
                dataValue: String(element.jfid),
                mobile: String(element.mobile),
              });
            }
          });
        }
      });
    },
    addReport() {
      this.reportDialog = true;
    },
    addReportItem(type, index) {
      console.log('cxcxxcx', type, index);
      
      this.value4Index = index;
      this.openType = type;
      this.reportDialog = true;  
    },
    reportDialogClose() {
      this.reportDialog = false;
    },
    reportDialogSaveItem({ data, index }) {
      console.log('all', data[0].data[0], index, this.weeklyPerson);
      this.weeklyPerson[index] = data[0].data[0].fullname
      this.weeklyPersonId[index] = data[0].data[0].jfid
      
      this.reportDialog = false;
    },
    reportDialogSave(all) {
      this.reportDialog = false;
      this.form.data.weeklyPerson = all[0].data[0].fullname;
      this.form.data.weeklyPersonId = all[0].data[0].jfid;
    },
    // 监理
    selectJL(val) {
      this.form.data.controlJfid = "";
      //console.log(val,'controlJfid')
      // this.getControlNameList(val);
      // getUserByRoleCode({ roleCode: "JLGCS", buid: val }).then((res) => {
      //   // //console.log("监理工程师", res.data);
      //   if (res.data) {
      //     this.form.enums.controlNameList = [];
      //     res.data.map((element) => {
      //       this.form.enums.controlNameList.push({
      //         dataName: String(element.fullname),
      //         dataValue: String(element.jfid),
      //       });
      //     });
      //   }
      // });
    },
    // 承建
    selectCJ(val) {
      this.form.data.contractor = "";
      // this.getContractorNameList(val);
      // getUserByRoleCode({ roleCode: "CJDW_XMJL", buid: val }).then((res) => {
      //   // //console.log("承建单位项目经理", res.data);
      //   this.form.enums.contractorNameList = [];
      //   res.data.map((element) => {
      //     if (element.fullname) {
      //       this.form.enums.contractorNameList.push({
      //         dataName: String(element.fullname),
      //         dataValue: String(element.jfid),
      //       });
      //     }
      //   });
      // });
    },
    // 承建经理
    selectCJJL(val) {
      //console.log(val,'jingli')
      if (val != "") {
        //console.log(this.form.enums.contractorNameList,'this.form.enums.contractorNameList')
        this.form.enums.contractorNameList.forEach((item) => {
          if (String(val) == item.dataValue) {
            this.form.data.contractorPhoneNumber = item.mobile;
          }
        });
      } else if (val == "") {
        this.form.data.contractorPhoneNumber = "";
      }
    },
    // 监理工程师
    selectJLGCS(val) {
      //console.log(val,'jingli')
      if (val != "") {
        this.form.enums.controlNameList.forEach((item) => {
          if (String(val) == item.dataValue) {
            this.form.data.controlorPhoneNumber = item.mobile;
          }
        });
      } else if (val == "") {
        this.form.data.controlorPhoneNumber = "";
      }
    },
  },
  watch: {
    "form.data.contractUnit": {
      handler(newVal) {
        if (newVal == "") {
          //console.log(newVal, "newvalcontractUnit");
          this.form.enums.contractorNameList = [];
          this.form.data.contractorPhoneNumber = "";
        } else {
          this.getContractorNameList(newVal);
        }
      },
      deep: true,
      immediate: true,
    },
    "form.data.controlUnit": {
      handler(newVal) {
        if (newVal == "") {
          this.form.enums.controlNameList = [];
          this.form.data.controlorPhoneNumber = "";
        } else {
          this.getControlNameList(newVal);
        }
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>
<style lang="scss" scoped>
.sradd {
  padding: 20px;
}

.content {
  height: 200px;
  overflow-y: scroll;
}

.item-sort {
  padding-left: 45px;
  font-size: 20px;
  font-weight: bold;
}

.reportWriter {
  display: flex;
  ::v-deep .el-input {
    width: 34%;
  }
  .btn {
    margin-left: 5px;
    width: 30px;
    height: 30px;
    opacity: 1;
    color: rgba(66, 130, 255, 1);
    border-radius: 50%;
    text-align: center;
    line-height: 30px;
    cursor: pointer;
    border: 1px dashed rgba(66, 130, 255, 1);
  }
}
.conTitle {
  font-size: 16px;
  // font-weight: bold;
  height: 100%;
  width: 96%;
  background-color: rgb(241, 243, 246);
  display: flex;
  // align-items:
  // flex-direction: column;
  margin: 14px 0 0 16px;
  padding: 16px;
  justify-content: flex-start;
  font-size: 16px;
  font-weight: 500;
  color: rgba(29, 33, 41, 1);
  .white {
    color: #fff;
  }
  .sys {
    letter-spacing: .05em;
    margin-right: 120px;
    margin-bottom: 3px;
    .sysText {
      font-weight: 600;
    }
  }
  .pro {
    letter-spacing: .05em;
    margin-right: 10px;
    .sysText {
      font-weight: 600;
    }
  }
}
.bzhTableHeader .el-dialog__body .content_box .content_title {
  height: 56px;
  padding-left: 16px;
  text-align: left;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  // line-height: 56px;
  border-bottom: 1px solid #e8e8e8;
  font-size: 16px;
  font-weight: 500;
}
::v-deep .sr-add .el-input__inner {
  border-radius: 4px !important;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  .el-button {
    border-radius: 4px !important;
  }
}
</style>
