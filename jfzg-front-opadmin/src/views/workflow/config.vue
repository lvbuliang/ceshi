<template>
  <div class="config_Page">
    <el-container direction="horizontal">
      <el-aside :width="show ? '100%' : '50%'">
        <Iframe />
      </el-aside>
      <el-main width="50%" v-if="!show">
        <div class="table_list" v-if="!Edit">
          <FTable
            class="tableData"
            :data="table.data"
            :config="table.config"
            :page="table.page"
          >
           <template slot="cellSlot" slot-scope="scope">
            <p class="statusBox" v-if="scope.scope.item.prop == 'role'">
              <div v-html='getrole(scope.scope.row.desc)'></div>
            </p>
           </template>
          </FTable>
        </div>
        <div v-else class="edit">
          <div class="info">
            <p>
              <span style='min-width: 100px;'
                >节点名称：
              </span>
              <span
                ><el-input disabled v-model="activeName"></el-input>
              </span>
            </p>
            <p>
              <span style='min-width: 100px;'
                >经办人：
              </span>
              
              <span>
                <el-select v-model="value" clearable placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option> </el-select
              ></span>
            </p>
            <el-button class="exportbtnFour" type="primary" @click="addjbr">
              <i class="el-icon-circle-plus-outline el-icon--left"></i
              >新增经办人
            </el-button>
          </div>
          <div class="Tag">
            <el-tabs
              v-model="editableTabsValue"
              type="border-card"
              closable
              @tab-remove="removeTab"
            >
              <el-tab-pane
                v-for="(item, index) in JSONData"
                :key="index"
                :label="item.roleName"
                :name="index + ''"
              >
                <div class="tab_content">
                  <div class="btn" style="marginbottom: 16px">
                    <el-button
                      class="exportbtnFour"
                      type="primary"
                      @click="add"
                    >
                      <i class="el-icon-circle-plus-outline el-icon--left"></i
                      >新增按钮
                    </el-button>
                  </div>
                  <FTable
                    class="tableData"
                    :data="item.btns"
                    :config="editTable.config"
                    :page="editTable.page"
                  >
                  </FTable>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
          <div v-if='this.JSONData &&this.JSONData.length>0'>
            <shenhepeizhi ref="shenhepeizhi" :editableTabsValue='editableTabsValue' :showForm='this.JSONData[this.editableTabsValue||0].showForm' :showFormdata='this.JSONData[this.editableTabsValue||0]' :showFormlabel='this.JSONData[this.editableTabsValue||0].showFormlabel||""'></shenhepeizhi>
          </div>
          
        </div>
        <div v-if="Edit" class="footer">
          <el-button @click="setJson" type="primary">生成JSON</el-button>
          <el-button @click="backEdit">返 回</el-button>
        </div>
      </el-main>
      <div class="show" @click="clickHandle">
        <i :class="show ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"></i>
      </div>
    </el-container>
    <div class="footer">
      <el-button @click="backmain">返 回</el-button>
    </div>
    <div class="Dialog">
      <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
        width="500px"
        :append-to-body="true"
        class="common-dialog-style"
      >
        <Dialog2
          ref="Dialog2"
          :nomolrole="nomolrole"
          :type="dialogType"
          :codeStr="beautifierJson"
          @cancel="canceldialogVisible"
          :formdata='JSONData'
        ></Dialog2>
      </el-dialog>
    </div>
    <Dialog ref="Dialog" :type="dialogType" :codeStr="beautifierJson"></Dialog>
  </div>
</template>

<script>
import Iframe from "./iframe";
import shenhepeizhi from "./shenhepeizhi";
import FSearch from "@/components/FSearch/index.vue";
import FTable from "@/components/FTable/index.vue";
import Dialog from "./component/Dialog";
import Dialog2 from "./component/Dialog2";
import { api_getFlowTaskList, api_jbr } from "@/api/work/work";
import beautifier from "js-beautify";
import { beautifierConf } from "@/utils/index";
export default {
  components: {
    Iframe,
    shenhepeizhi,
    FSearch,
    FTable,
    Dialog,
    Dialog2,
  },
  computed: {
    id() {
      return this.$route.query.id;
    },
  },

  watch: {
    editableTabsValue(val) {
      this.nomolrole = this.JSONData[val].role;
    },
  },
  data() {
    return {
      nomolrole: "",
      title: "新增按钮",
      dialogVisible: false,
      jsonStr: "",
      beautifierJson: "",
      dialogType: "form",
      value: "",
      editableTabsValue: "",
      tabIndex: 2,
      options: [],
      show: false,
      Edit: false,
      search: {
        textMaxNum: 8, // label 最多几个字默认4个
        showExpand: false, // 是否显示展开收起，默认超过三个显示
        minNum: 3, // 收起显示几个, 默认3个
        config: [
          {
            type: "text",
            name: "节点名称",
            placeholder: "请输入节点名称",
            bind: "key", // 对应this.search.data对象的field1
          },
          {
            type: "select",
            name: "经办人",
            placeholder: "请选择经办人",
            bind: "status",
            data: "stateList", // 对应enum中的stateList
          },
        ],

        form: {
          projectName: "",
          buName: "",
          projectCode: "",
          name: "",
        },
        enum: {
          stateList: [],
        },
        total: 0,
        pageNum: 0,
        pageSize: 0,
      },
      editTable: {
        data: [], // 表格数据
        config: {
          fixed: "right",
          operationWidth: 120,
          // selection: true, // 是否显示复选框
          // multiple: true,
          // rowKey: "", // 操作列的宽度，不传默认180
          // title: "", // 表格标题
          header: [
            // 表格列配置
            {
              name: "按钮名称",
              prop: "btnName",
              width: 100,
            },
            {
              name: "按钮性质",
              prop: "btnEventTypeName",
              width: 100,
            },
            {
              name: "类型",
              prop: "btnTypeName",
            },
            {
              name: "跳转节点",
              prop: "version",
              width: 100,
            },
            {
              name: "待办id",
              prop: "agencyId",
            },
            {
              name: "消息推送id",
              prop: "messageId",
              width: 150,
              //   cellSlot: true,
            },
          ],
          outerBtn: [
            {
              name: "新增", // 按钮中文名称
              method: "add", // 按钮点击执行的函数，需要在本页methods定义add方法
              icon: "el-icon-circle-plus-outline", // 按钮图标
              type: "primary", // 按钮风格
            },
          ],
          innerBtn: [
            // 表格内部操作按钮，不需要操作列的innerBtn 写成false

            {
              name: "编辑",
              method: "toModel",
              className: "font-size-20",
            },
            {
              name: "删除",
              method: "delete",
              className: "font-size-20",
            },
          ],
        },
        // page: {
        //   // 分页配置
        //   total: 12, //总条数
        //   pages: 1, //总页数
        //   pageSize: 5, //每页展示多少个
        //   pageNum: 1, //当前页
        // },
      },
      table: {
        data: [], // 表格数据
        config: {
          fixed: "right",
          operationWidth: 100,
          index: "序号",
          // selection: true, // 是否显示复选框
          // multiple: true,
          // rowKey: "", // 操作列的宽度，不传默认180
          // title: "", // 表格标题
          header: [
            // 表格列配置
            {
              name: "节点名称",
              prop: "name",
            },
            {
              name: "经办角色",
              prop: "role",
              cellSlot: true,
            },
            {
              name: "审核表单",
              prop: "",
            },
            {
              name: "json串",
              prop: "desc",
            },
          ],
          innerBtn: [
            {
              name: "编辑",
              method: "edit",
              className: "font-size-20",
            },
          ],
        },
        // page: {
        //   // 分页配置
        //   total: 12, //总条数
        //   pages: 1, //总页数
        //   pageSize: 5, //每页展示多少个
        //   pageNum: 1, //当前页
        // },
      },
      JSONData: [
        {
          role: "经办人",
          checkOwner: false,
          showForm: true,
          btns: [
            {
              btnName: "按钮名0",
              btnValue: "按钮值0",
              btnType: "",
              btnEventType: "",
              btnUrl: "",
              examineState: "",
              agencyId: "",
              agencyNextrole: "",
              nextBuCode: "",
              messageId: "",
            },
            {
              btnName: "按钮名1",
              btnValue: "按钮值1",
              btnType: "",
              btnEventType: "",
              btnUrl: "",
              examineState: "",
              agencyId: "",
              agencyNextrole: "",
              nextBuCode: "",
              messageId: "",
            },
          ],
          operationBtns: [
            {
              btnName: "按钮名0",
              btnValue: "按钮值0",
            },
          ],
          nodes: [
            {
              dataName: "节点名0",
              dataValue: "节点值0",
            },
          ],
        },
        {
          role: "负责人",
          checkOwner: false,
          showForm: true,
          btns: [
            {
              btnName: "按钮名0",
              btnValue: "按钮值0",
              btnType: "",
              btnEventType: "",
              btnUrl: "",
              examineState: "",
              agencyId: "",
              agencyNextrole: "",
              nextBuCode: "",
              messageId: "",
            },
          ],
          operationBtns: [
            {
              btnName: "按钮名0",
              btnValue: "按钮值0",
            },
          ],
          nodes: [
            {
              dataName: "节点名0",
              dataValue: "节点值0",
            },
          ],
        },
      ],
      activeName: "",
    };
  },
  mounted() {
    this.getWorkList(this.id);
    this.getJbr();
  },
  methods: {
    getrole(val){
      if(val){
        var newRole = JSON.parse(val)||[]
        var roleName = '';
        if(newRole.length > 0){
          //老代码数据为空兼容
          for(var i=0;i<newRole.length;i++){
            if(newRole[i].role == "assignee"){
              newRole[i].roleName ='代理人';
              break;
            }
          }

          for(var i=0;i<newRole.length;i++){
            if(i !=newRole.length-1){
              roleName +=newRole[i].roleName +'、'
            }else{
              roleName +=newRole[i].roleName
            }
          }
          return roleName
        }
      }else{
        return ''
      }
      
    },
    setIds(list) {
      let id = Number(
        Math.random()
          .toString()
          .substr(3, 3) + Date.now()
      ).toString(36);
      let flag = list.find((item) => {
        return item.id == id;
      });
      if (flag) {
        return this.setIds(list);
      } else {
        return id;
      }
    },
    canceldialogVisible(data) {
      this.dialogVisible = false;
      if (this.title == "新增按钮") {
        if (data) {
          for (var i = 0; i < this.JSONData.length; i++) {
            if (data.role == this.JSONData[i].role) {
              let id = this.setIds(this.JSONData[i].btns);
              let newData = JSON.parse(JSON.stringify(data));
              newData.btns[0].id = id;
              this.JSONData[i].btns = this.JSONData[i].btns.concat(
                newData.btns
              );
              console.log(this.JSONData[i].btns);
            }
          }
        }
      } else {
        if (data) {
          for (var i = 0; i < this.JSONData.length; i++) {
            if (data.role == this.JSONData[i].role) {
              for (var y = 0; y < this.JSONData[i].btns.length; y++) {
                if (this.JSONData[i].btns[y].id == data.btns[0].id) {
                  this.JSONData[i].btns.splice(y, 1, data.btns[0]);
                }
              }
            }
          }
        }
      }
    },
    addjbr() {
      let roleName = "";
      let flag = false;
      this.options.forEach((item, i) => {
        if (item.value == this.value) {
          roleName = item.label;
        }
      });
      this.JSONData.forEach((item) => {
        if (item.role == this.value) {
          flag = true;
        }
      });
      if (!roleName) {
        this.$message.error("请先选择要添加的经办人");
        return;
      }
      if (flag) {
        this.$message.error("请勿添加相同的经办人");
        return;
      }
      this.JSONData.push({
        role: this.value,
        roleName: roleName,
        checkOwner: false,
        showForm: true,
        btns: [],
        operationBtns: [
          {
            btnName: "按钮名0",
            btnValue: "按钮值0",
          },
        ],
        nodes: [
          {
            dataName: "节点名0",
            dataValue: "节点值0",
          },
        ],
      });
    },
    getJbr() {
      api_jbr().then((res) => {
        if (res.msg.code == "0000") {
          var options = [];
          var data = res.data;
          for (var i = 0; i < data.length; i++) {
            var map = {
              roleCode: data[i].roleCode,
              roleId: data[i].roleId,
              roleName: data[i].roleName,
              value: data[i].roleCode,
              label: data[i].roleName,
            };
            options.push(map);
          }
          options.unshift({
            value: "assignee",
            label: "代理人",
            roleCode: "assignee",
            roleName: "代理人",
            roleId: "",
          });
        }
        this.options = options;
      });
    },

    setJson() {
      this.JSONData[this.editableTabsValue].showFormlabel = this.$refs.shenhepeizhi.shenpi_Moudle.moduleCode
      this.JSONData[this.editableTabsValue].showFormdata = this.$refs.shenhepeizhi.shenpi_Moudle.auditJson
      this.JSONData[this.editableTabsValue].showForm = this.$refs.shenhepeizhi.showForm
      this.dialogType = "Json";
      this.$refs["Dialog"].dialogVisible = true;
      this.jsonStr = JSON.stringify(this.JSONData);
      this.beautifierJson = beautifier.js(this.jsonStr, beautifierConf.js);
      // this.$refs["Dialog"].setEditorValue(this.beautifierJson);
    },
    backEdit() {
      this.Edit = false;
    },
    backmain(){
      this.$router.push({
        name: "processList",
      });
    },
    addTab(targetName) {
      let newTabName = ++this.tabIndex + "";
      this.editableTabs.push({
        title: "New Tab",
        name: newTabName,
        content: "New Tab content",
      });
      this.editableTabsValue = newTabName;
    },
    removeTab(targetName) {
      if( this.JSONData.length ==1){
        this.$set(this,'JSONData',[])
        return false
      }
      let tabs = this.JSONData;
      //1.删除在高亮后面，不影响
      if(targetName >this.editableTabsValue){

      }else if(targetName  ==this.editableTabsValue){
        // 2.删除 ==高亮后面，高亮—1或为0
        if(this.editableTabsValue =='0'){

        }else{
          this.editableTabsValue = this.editableTabsValue -1 +'' 
        }
      }else if(targetName < this.editableTabsValue){
        // 2.删除在高亮前面，高亮—1或为0
        if(this.editableTabsValue =='0'){

        }else{
          this.editableTabsValue = this.editableTabsValue -1 +'' 
        }
      }
      this.JSONData = tabs.filter((tab, index) => index != targetName);
    },
    //   新增按钮
    add() {
      this.title = "新增按钮";
      this.dialogType = "form";
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs["Dialog2"].init();
      });
    },
    edit(row) {
      this.Edit = true;
      this.activeName = row.name;
      var JSONData = JSON.parse(row.desc);
      for (var i = 0; i < JSONData.length; i++) {
        if(JSONData[i].role == "assignee"){
          JSONData[i].roleName = "代理人"
        }
        if (JSONData[i].btns && JSONData[i].btns.length > 0) {
          for (var y = 0; y < JSONData[i].btns.length; y++) {
            JSONData[i].btns[y].id = y;
          }
        }
      }
      this.editableTabsValue = 0;
      this.JSONData = JSONData;
    },
    toModel(row) {
      this.title = "编辑按钮";
      this.dialogType = "form";
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs["Dialog2"].init(JSON.parse(JSON.stringify(row)));
      });
    },
    delete(row) {
      this.JSONData[this.editableTabsValue].btns = this.JSONData[
        this.editableTabsValue
      ].btns.filter((item) => {
        return item.id != row.id;
      });
    },
    getWorkList(id) {
      api_getFlowTaskList(id).then((res) => {
        if (res.msg.code == "0000") {
          this.$set(this.table, "data", res.data);
        }
      });
    },
    clickHandle() {
      this.show = !this.show;
    },
  },
};
</script>

<style lang="scss" scoped>
.config_Page {
  width: 100%;
  .el-container {
    position: relative;
    .show {
      position: absolute;
      right: -25px;
      i {
        cursor: pointer;
        font-size: 26px;
        font-weight: 600;
        color: rgb(75, 105, 238);
      }
    }
    .el-aside {
      background: white !important;
      border: 1px solid black;
      padding: 0 !important;
      margin: 0 !important;
    }
    .el-main {
      background: white !important;
      border: 1px solid black;
      border-left: none;
      position: relative;
      .footer {
        width: 90%;
        overflow: hidden;
        position: absolute;
        bottom: 40px;
      }
      .edit {
        .info {
          display: flex;
          align-items: center;
          p {
            display: flex;
            align-items: center;
            margin-right: 24px;
          }
        }
        .Tag {
          margin-top: 16px;
        }
      }
    }
  }
  .footer {
    margin-top: 24px;
    width: 100%;
    text-align: center;
  }
}
</style>
