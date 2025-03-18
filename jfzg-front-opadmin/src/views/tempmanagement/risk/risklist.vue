
<template>
  <div class="unitList" v-if="$route.meta.lv == 2">
    <!-- 搜索  -->
    <div class="search">
      <FSearch :form="search" @queryList="getUnitList(1)"></FSearch>
    </div>
    <!-- 操作按钮 -->
    <div class="buttonOperation">
      <!-- <el-button type="primary" size="small" @click="add"><i class="el-icon-circle-plus-outline el-icon--left"></i>新增单位</el-button> -->
      <el-button class="exportbtnFour" type="primary" @click="add" >
        <i class="el-icon-circle-plus-outline el-icon--left"></i>添加
      </el-button>
    </div>
    <!-- 表格 -->
    <div class="table">
      <FTable
        :data="table.data"
        :config="table.config"
        :page="table.page"
        :formatter="formatter"
        @pageChanged="getPageData"
        @sizeChanged="getSizeDate"
      >
                <div slot="cellSlot" slot-scope="scope">
                    <div v-if="scope.scope.row.templType == 1">{{'问题'}}</div>
                    <div v-if="scope.scope.row.templType == 2">{{'风险'}}</div>
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
          >
          </FForm>
        </div>
        <div slot="footer" class="dialog-footer" style="text-align: center;">
          <el-button
            type="primary"
            size="small"
            style="width:80px;height:32px;"
            @click="springBox_determine(dialog.type)"
          >确定</el-button>
          <el-button type size="small" style="width:80px;height:32px;" @click="colseDialog">取消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
  <router-view v-else></router-view>
</template>

<script>
import FSearch from "@/components/FSearch/index.vue";
import FTable from "@/components/FTable/index.vue";
import FForm from "@/components/FForm/form-add";
import {
  api_gdSelect,
  api_getRiskQuestionList,
  api_addRiskQuestionList,
  api_editRiskQuestionList,
  api_removeRiskQuestionList,
  api_qtDeliverable
} from "@/api/tempmanagement/tempmanagement";
export default {
  components: {
    FSearch,
    FTable,
    FForm
  },
  data() {
    return {
      search: {
        textMaxNum: 5, // label 最多几个字默认4个
        showExpand: false, // 是否显示展开收起，默认超过三个显示
        minNum: 4, // 收起显示几个, 默认3个
        config: [
             {
            type: "text",
            name: "关键词",
            placeholder: "请输入关键词",
            bind: "keyword" // 对应this.search.data对象的field1
          },
          {
            type: "select",
            name: "项目类型",
            placeholder: "请选择项目类型",
            bind: "projectType",
            data: "typeList" // 对应enum中的stateList
          },
          {
            type: "select",
            name: "类型",
            placeholder: "请选择类型",
            bind: "templType",
            data: "stateList" // 对应enum中的stateList
          },
        
        
        ],
        form: {
          keyword: "",
          projectType: "",
          templType: "",
         
        },
        enum: {
          typeList:[],
          stateList: [
            {
              dataName: "问题",
              dataValue: "1"
            },
            {
              dataName: "风险",
              dataValue: "2"
            }
          ]
        }
      },
      table: {
        data: [],
        config: {
          fixed: "right",
          operationWidth: 140, // 操作列的宽度，不传默认180
          title: "表格的标题", // 表格标题
          index: "", // 是否显示序号
          header: [
            // 表格列配置
            { name: "描述", prop: "measureDescribe",width: 200 },
            { name: "处理措施", prop: "templName" ,width: 180},
            { name: "说明", prop: "templDesc",width: 600,  },
            { name: "类型", prop: "templType",width: 60, cellSlot: true},
            { name: "项目类型", prop: "projectTypeName",width: 120},
            { name: "里程碑", prop: "stage", },
          ],
          outerBtn: [], // 外部按钮
          innerBtn: [
            {
              name: "编辑",
              method: "edit",
              field: "id",
            },
            {
              name: "删除",
              method: "delate",
              field: "id",
            },
          ]
        },
        page: {
          // 分页配置
          total: 12, //总条数
          pages: "", //总页数
          pageSize: 5, //每页展示多少个
          pageNum: 1 //当前页
        }
      },
      dialog: {
        dialogVisible: false,
        width: "",
        title: "",
        type: "",
        buid: ""
      },
      form: {
        title: "表单标题",
        config: [
          {
            col: 24,
            type: "text",
            name: "描述",
            placeholder: "请输入描述",
            bind: "measureDescribe",
            trigger: "blur", // 校验时机
            required: "请输入描述" // 必填需要指定提示信息
          },
          {
            col: 24,
            type: "text",
            name: "处理措施",
            placeholder: "请输入处理措施",
            bind: "templName",
            trigger: "blur", // 校验时机
            required: "请输入处理措施" // 必填需要指定提示信息
          },
          {
            col: 24,
            type: "select",
            name: "项目类型",
            change:this.changeSelect,
            placeholder: "请选择项目类型",
            bind: "projectType",
            dataList:"typeList",
            trigger: "blur", // 校验时机
            required: "请选择项目类型" // 必填需要指定提示信息
          },
          {
            col: 24,
            type: "select",
            name: "里程碑",
            disabled: true,
            placeholder: "请选择里程碑",
            bind: "stage",
            dataList:"lcbList",
            trigger: "blur", // 校验时机
            required: "请选择里程碑" // 必填需要指定提示信息
          },
          {
            col: 24,
            type: "select",
            name: "类型",
            placeholder: "请选择类型",
            bind: "templType",
            dataList:"stateList",
            trigger: "blur", // 校验时机
            required: "请选择类型" // 必填需要指定提示信息
          },
          {
            col: 24,
            type: "textarea",
            name: "说明",
            maxlength:200,
            placeholder: "请输入相关说明",
            bind: "templDesc",
          },
        ],
        data: {
          measureDescribe:'',
          templName:'',
          stage:'',
          templType:'',
          projectType:'',
          templDesc:'',
        },
        enums: {
          lcbList:[],
          typeList:[],
          stateList: [
            {
              dataName: "问题",
              dataValue: 1
            },
            {
              dataName: "风险",
              dataValue: 2
            }
          ]
        },
        rules: {}
      },
      params:{
        projectType:''
      }
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.select()
      this.getUnitList()
    },
    async changeSelect(val){
      if(val != ''){
        this.form.data.stage = ''
        this.form.config[3].disabled = false
        this.params.projectType = val
      }
      let res = await api_gdSelect(this.params);
      let arr = []
      if (res.msg.code == "0000") {
        res.data.forEach((item,index)=>{
          arr.push({dataName:item,dataValue:item,})
        })
        this.$set(this.form.enums, "lcbList", arr);
      }
    },
    // 项目类型
    async select(){
      let NewList = {topic:'JFZG_XMKGL_TYPE'}
      let res1 = await api_qtDeliverable(NewList)
      let NewArr = res1.data.map(({itemCode,chName})=>({dataValue:itemCode,dataName:chName}))
      this.$set(this.search.enum, 'typeList', NewArr)
      this.$set(this.form.enums, 'typeList', NewArr)
    },
    // 获取单位管理列表
    getUnitList(page) {
      let params = {
        page: this.table.page.pageNum,
        size: this.table.page.pageSize
      };
      const searchForms = this.search.form;
      Object.keys(searchForms).map(item => {
        if (searchForms[item]) {
          params[item] = searchForms[item];
        }
      });
      if (page) {
        params.page = page;
      }
      api_getRiskQuestionList(params).then(res => {
        console.log(res);
        if (res.msg.message == "SUCCESS") {
          this.$set(this.table, "data", res.data.list);
          this.$set(this.table.page, "pageNum", res.data.pageNum);
          this.$set(this.table.page, "pageSize", res.data.pageSize);
          this.$set(this.table.page, "total", res.data.total);
        }
      });
    },
    // 新增单位
    add() {
      this.form.config[3].disabled = true
      for(let key in this.form.data){
        this.form.data[key] = ''
      }
      this.dialog = {
        dialogVisible: true,
        width: "560px",
        title: "新增风险问题",
        type: 0,
        buid: ""
      };
    },
    // 编辑
    async edit(row) {
      this.form.config[3].disabled = false
      this.dialog = {
        dialogVisible: true,
        width: "560px",
        title: "编辑风险问题",
        type: 1,
        buid: row.templId
      };

      this.form.data.measureDescribe = row.measureDescribe
      this.form.data.templName = row.templName
      this.form.data.stage = row.stage
      this.form.data.templType = row.templType
      this.form.data.projectType = row.projectType
      this.form.data.templDesc = row.templDesc
      this.params.projectType = row.projectType
      let res = await api_gdSelect(this.params);
      let arr = []
      if (res.msg.code == "0000") {
        res.data.forEach((item,index)=>{
          arr.push({dataName:item,dataValue:item,})
        })
        this.$set(this.form.enums, "lcbList", arr);
      }
    },
    // 删除
    delate(row) {
        this.$confirm('此操作将永久删除该数据, 是否继续?', '确认要删除此条数据吗？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api_removeRiskQuestionList(row.templId).then(res => {
            if (res.msg.message == "SUCCESS") {
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.getUnitList(1);
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    // 弹框确定
    springBox_determine(type) {
      var parameter = new Promise((resolve, reject) => {
        this.$refs["modelMgrRef"].$refs["modelMgrRefForm"].validate(valid => {
          if (valid) {
            resolve();
          }
        });
      });
      Promise.all([parameter]).then(() => {
        let params = this.form.data;
        if (type == 0) {
          this.addUnit(params);
        } else {
          params.templId = this.dialog.buid;
          this.updateUnit(params);
        }
      });
    },
    // 新增
    addUnit(data) {
      api_addRiskQuestionList(data).then(res => {
        if (res.msg.message == "SUCCESS") {
          this.$message({
            message: "新建成功",
            type: "success"
          });
          this.getUnitList(1);
          this.dialog.dialogVisible = false;
        }
      });
    },
    // 编辑
    updateUnit(data) {
      console.log(data);
      api_editRiskQuestionList(data).then(res => {
        if (res.msg.message == "SUCCESS") {
          this.$message({
            message: "编辑成功",
            type: "success"
          });
          this.getUnitList(1);
          this.dialog.dialogVisible = false;
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
      this.getUnitList();
    },
    getSizeDate(pageSize) {
      this.table.page.pageSize = pageSize;
      this.getUnitList();
    },
    // 获取企业类型
    getBuPropertyList() {
      api_buPropertyList().then(res => {
        console.log(res);
        if (res.msg.message == "SUCCESS") {
          res.data.forEach(item => {
            item.dataName = item.propertyName;
            item.dataValue = item.id;
          });
          this.form.enums.stateList = res.data;
        }
      });
    },
    eventNotify(ref) {
      this.$refs[ref].init();
    },
    formatter(key, val, row) {
      if (key === "status") {
        if (row["status"] == 1) {
          return "<div class='wait round-state'>启用</div>";
        } else if (row["status"] == 0) {
          return "<div class='enabled round-state'>停用</div>";
        }
      }
    }
  }
};
</script>