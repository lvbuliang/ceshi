<template>
  <div class="unitList" v-if="$route.meta.lv == 2">
    <!-- 搜索  -->
    <div class="search">
      <FSearch :form="search" @queryList="getUnitList(1)"></FSearch>
    </div>
    <!-- 操作按钮 -->
    <div class="buttonOperation">
      <!-- <el-button type="primary" size="small" @click="add"><i class="el-icon-circle-plus-outline el-icon--left"></i>新增单位</el-button> -->
      <el-button class="exportbtnFour" type="primary" @click="add">
        <i class="el-icon-circle-plus-outline el-icon--left"></i>添加
      </el-button>
    </div>
    <!-- 表格 -->
    <div class="table">
      <FTable
        class="tableData"
        :data="table.data"
        :config="table.config"
        :page="table.page"
        :formatter="formatter"
        @pageChanged="getPageData"
        @sizeChanged="getSizeDate"
      >
        <!-- <div slot="cellSlot" slot-scope="scope">
                    <div v-if="scope.scope.row.isCheck == 0">{{'否'}}</div>
                    <div v-if="scope.scope.row.isCheck == 1">{{ '是'  }}</div>
        </div>-->
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
          ></FForm>
        </div>
        <!-- <p>支持扩展名：doc/docx/xls/xlsx/ppt/pptx/pdf/txt/jpg/jpeg/jpe/png/rar/zip格式文件，文件不能超过200MB</p> -->
        <div slot="footer" class="dialog-footer" style="text-align: center">
          <el-button
            type="primary"
            size="small"
            style="width: 80px; height: 32px"
            @click="springBox_determine(dialog.type)"
            >确定</el-button
          >
          <el-button
            type
            size="small"
            style="width: 80px; height: 32px"
            @click="colseDialog"
            >取消</el-button
          >
        </div>
      </el-dialog>
    </div>
  </div>
  <router-view v-else></router-view>
</template>

<script>
import FSearch from '@/components/FSearch/index.vue'
import FTable from '@/components/FTable/index.vue'
import FForm from '@/components/FForm/form-add'
import {
  api_getMilepostList,
  api_getMilestoneList,
  api_deliverableList,
  api_lcbSelect,
  fileData,
  api_removeDeliverableList,
  api_saveDeliverable,
  api_qtDeliverable,
} from '@/api/tempmanagement/tempmanagement'
import config from '@/settings.js'
import upload from '@/utils/upload'
export default {
  components: {
    FSearch,
    FTable,
    FForm,
  },
  provide() {
    return {
      baseUrl: config.uploadBaseUrl,
      imgBaseUrl: config.imgBaseUrl,
      uploadRequest: upload,
      uploadBaseUrl: config.uploadBaseUrl,
    }
  },
  data() {
    return {
      search: {
        textMaxNum: 5, // label 最多几个字默认4个
        showExpand: false, // 是否显示展开收起，默认超过三个显示
        minNum: 4, // 收起显示几个, 默认3个
        config: [
          {
            type: 'text',
            name: '交付物名称',
            placeholder: '请输入交付物名称',
            bind: 'deliverName', // 对应this.search.data对象的field1
          },
          {
            type: 'select',
            name: '项目类型',
            placeholder: '请选择项目类型',
            bind: 'templTypeCode',
            data: 'type', // 对应enum中的stateList
          },
          {
            type: 'select',
            name: '里程碑模板',
            placeholder: '请选择里程碑模板',
            bind: 'templId',
            data: 'lcbList', // 对应enum中的stateList
          },
          {
            type: 'select',
            name: '验收项',
            placeholder: '请选择验收项',
            bind: 'isCheck',
            data: 'isCheck', // 对应enum中的stateList
          },
          // {
          //   type: "select",
          //   name: "所属分册",
          //   placeholder: "请选择所属分册",
          //   bind: "fascicleCode",
          //   data: "fc", // 对应enum中的stateList
          // },
        ],
        form: {
          deliverName: '',
          stageId: '',
          templTypeCode: '',
          isCheck: '',
          fascicleCode: '',
        },
        enum: {
          type: [],
          fc: [],
          lcbList: [],
          isCheck: [
            {
              dataName: '否',
              dataValue: '1',
            },
            {
              dataName: '是',
              dataValue: '0',
            },
          ],
        },
      },
      table: {
        data: [],
        config: {
          operationWidth: 150, // 操作列的宽度，不传默认180
          fixed: 'right',
          title: '表格的标题', // 表格标题
          selection: false,
          multiple: true,
          // rowKey: "buid",
          header: [
            // 表格列配置
            {
              name: '项目交付物名称',
              prop: 'deliverName',
              width: 200,
              cellSlot: false,
            },
            { name: '里程碑模板', prop: 'templName', width: 120 },
            { name: '里程碑节点', prop: 'stageName', width: 120 },
            { name: '项目类型', prop: 'templTypeName' },
            // { name: "交付物分册", prop: "fascicleName", width: 120 },
            { name: '排序', prop: 'sort' },
            // { name: "合同金额", prop: "contractAmount", haveHTML: true},
            {
              name: '是否为验收项',
              prop: 'isCheck',
              haveHTML: true,
              width: 135,
            },
            { name: '交付物模板', prop: 'templFileName', width: 125 },
            { name: '创建时间', prop: 'createTime' },
          ],
          outerBtn: [], // 外部按钮
          innerBtn: [
            {
              name: '编辑',
              method: 'edit',
              field: 'id',
            },
            {
              name: '删除',
              method: 'delate',
              field: 'id',
            },
          ],
        },
        page: {
          // 分页配置
          total: 0, //总条数
          pages: '', //总页数
          pageSize: 5, //每页展示多少个
          pageNum: 1, //当前页
        },
      },
      dialog: {
        dialogVisible: false,
        width: '',
        title: '',
        type: '',
        buid: '',
      },
      form: {
        title: '表单标题',
        config: [
          {
            col: 24,
            type: 'text',
            name: '交付物名称',
            placeholder: '请输入交付物名称',
            bind: 'deliverName',
            trigger: 'blur', // 校验时机
            required: '请输入交付物名称', // 必填需要指定提示信息
          },
          {
            col: 24,
            type: 'select',
            name: '里程碑模板',
            change: this.changeSelect,
            placeholder: '请选择里程碑模板',
            bind: 'templId',
            dataList: 'lcbList', // 对应enum中的stateList
            required: '请选择里程碑模板', // 必填需要指定提示信息
          },
          {
            col: 24,
            type: 'select',
            name: '里程碑节点',
            placeholder: '请选择里程碑节点',
            bind: 'stageId',
            disabled: true,
            dataList: 'lcbList1', // 对应enum中的stateList
            required: '请选择里程碑节点', // 必填需要指定提示信息
          },
          {
            col: 24,
            type: 'select',
            name: '项目类型',
            placeholder: '请选择项目类型',
            bind: 'templTypeCode',
            dataList: 'type',
            disabled: true,
          },
          {
            col: 12,
            type: 'select',
            name: '是否验收项',
            placeholder: '请选择是否验收项',
            bind: 'isCheck',
            dataList: 'isCheck',
            required: '请选择是否验收项',
          },
          {
            col: 12,
            type: 'number2',
            name: '排序',
            placeholder: '请选择排序',
            bind: 'sort',
            required: '请选择排序',
          },
          // {
          //   col: 24,
          //   type: "select",
          //   name: "金额",
          //   placeholder: "请选择金额",
          //   bind: "contractAmount",
          //   required: "请选择金额",
          //   dataList: "money",
          // },
          // {
          //   col: 24,
          //   type: "select",
          //   name: "所属分册",
          //   placeholder: "请选择所属分册",
          //   bind: "fascicleCode",
          //   dataList: "fc",
          // },

          {
            type: 'bigUpload',
            name: '交付物模板',
            fileList: [],
            bind: 'templFileId',
            col: 24,
            limit: 1, // 上传数量
            fileTip:
              '温馨提示：支持扩展名为 doc/docx/xls/xlsx/ppt/pptx/pdf/txt/jpg/jpeg/jpe/png/rar/zip 大小不超过500M', //提示
            fileType:
              'doc,docx,xls,xlsx,ppt,pptx,pdf,txt,jpg,jpeg,jpe,png,rar,zip', //校验
          },
        ],
        data: {
          deliverName: '',
          stageId: '',
          templId: '',
          templTypeCode: '',
          isCheck: '',
          sort: '',
          templFileId: [],
          id: '',
          fascicleCode: '',
        },
        enums: {
          type: [],
          fc: [],
          lcbList1: [],
          lcbList: [],
          money: [
            {
              dataName: '不限制',
              dataValue: 0,
            },
            {
              dataName: '50万以上',
              dataValue: 1,
            },
            {
              dataName: '1000万以上',
              dataValue: 2,
            },
          ],
          isCheck: [
            {
              dataName: '是',
              dataValue: 0,
            },
            {
              dataName: '否',
              dataValue: 1,
            },
          ],
        },
        rules: {},
      },
      active: '停用',
      miliseList: [],
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.getUnitList()
      this.select()
    },
    async changeSelect(val) {
      // console.log('测试val的值', val)
      if (val != '') {
        this.form.config[2].disabled = false
        let params = {
          pageNum: 1,
          templId: val,
        }
        let res = await api_getMilepostList(params)
        console.log(res)
        if (res.msg.code == '0000') {
          let arr = res.data.list.map(({ id, stageName }) => ({
            dataValue: id,
            dataName: stageName,
          }))
          this.$set(this.form.enums, 'lcbList1', arr)
        }
        this.miliseList.forEach((item) => {
          if (item.templId === val) {
            this.$set(this.form.data, 'templTypeCode', item.projectType)
          }
        })
      } else {
        this.form.data.stageId = ''
        this.form.enums.lcbList1 = []
        this.form.config[2].disabled = true
      }
    },
    async select() {
      let res = await api_getMilestoneList()
      if (res.msg.code == '0000') {
        let arr = res.data.list.map(({ templId, templName }) => ({
          dataValue: templId,
          dataName: templName,
        }))
        this.$set(this.search.enum, 'lcbList', arr)
        this.$set(this, 'miliseList', res.data.list)
        this.$set(this.form.enums, 'lcbList', arr)
      }
      let NewList = [
        // { topic: "DeliverFascicle" },
        { topic: 'JFZG_XMKGL_TYPE' },
      ]
      NewList.forEach(async (item, index) => {
        let res1 = await api_qtDeliverable(item)
        let NewArr = res1.data.map(({ itemCode, chName }) => ({
          dataValue: itemCode,
          dataName: chName,
        }))
        const arr = ['type']
        this.$set(this.search.enum, arr[index], NewArr)
        this.$set(this.form.enums, arr[index], NewArr)
      })
    },
    delate(row) {
      this.$confirm(
        '此操作将永久删除该数据, 是否继续?',
        '确认要删除此条数据吗？',
        {
          showClose: false,
          showCancelButton: true, // 是否显示取消按钮
          showConfirmButton: true, // 是否显示确认按钮
          confirmButtonText: '确定', // 确定按钮名字
          cancelButtonText: '取消', // 取消按钮名字
          customClass: 'changsha_confirm changsha_confirm_success', //  类名必传支持三种样式
          type: 'warning',
        }
      )
        .then(() => {
          let params = {
            deliverId: row.id,
          }
          api_removeDeliverableList(params).then((res) => {
            if (res.msg.code == '0000') {
              this.$message({
                message: '删除成功',
                type: 'success',
              })
              this.getUnitList()
            }
          })
        })
        .catch(() => {})
    },
    // 获取单位管理列表
    async getUnitList(page) {
      let params = {
        pageSize: this.table.page.pageSize,
        pageNum: this.table.page.pageNum,
      }
      const searchForms = this.search.form
      Object.keys(searchForms).map((item) => {
        if (searchForms[item]) {
          params[item] = searchForms[item]
        }
      })
      if (page) {
        params.pageNum = page
      }
      let res = await api_deliverableList(params)
      let fileList = []
      if (res.msg.message == 'SUCCESS') {
        // let arr = res.data.list.map(({ templFile }) => ({
        //   id: templFileId || "",
        // }));
        for (var i = 0; i < res.data.list.length; i++) {
          if (res.data.list[i].templFile) {
            res.data.list[i].templFileName = JSON.parse(
              res.data.list[i].templFile
            )[0].name
          } else {
            res.data.list[i].templFileName = '暂无模板'
          }
        }
        // for (const item of arr) {
        //   if (item.id != "") {
        //     // if(typeof item.id =='string'){
        //     //   item.id = JSON.parse(item.id)[0].id
        //     // }

        //     // let res1 = await fileData(item);
        //     // if (res1) fileList.push({ name: res1.data.name });
        //   } else {
        //     fileList.push({ name: "暂无模板" });
        //   }
        // }
        let arr1 = []
        res.data.list.forEach((item, index) => {
          arr1.push({ ...item })
        })
        this.$set(this.table, 'data', arr1)
        this.$set(this.table.page, 'pageNum', res.data.pageNum)
        this.$set(this.table.page, 'pageSize', res.data.pageSize)
        this.$set(this.table.page, 'total', res.data.total)
      }
    },
    add() {
      this.form.config[2].disabled = true
      for (let key in this.form.data) {
        if (key == 'templFileId') {
          this.form.data[key] = []
        } else {
          this.form.data[key] = ''
        }
      }
      this.dialog = {
        dialogVisible: true,
        width: '700px',
        title: '新增交付物模板',
        type: 0,
      }
    },
    // 编辑
    async edit(row) {
      console.log(row)
      let params = {
        pageNum: 1,
        templId: row.templId,
      }
      let res = await api_getMilepostList(params)
      if (res.msg.code == '0000') {
        let arr = res.data.list.map(({ id, stageName }) => ({
          dataValue: id,
          dataName: stageName,
        }))
        this.$set(this.form.enums, 'lcbList1', arr)
      }
      this.form.config[2].disabled = false
      this.dialog = {
        dialogVisible: true,
        width: '700px',
        title: '编辑交付物模板',
        type: 1,
      }
      this.form.data.templFileId = row.templFile
        ? JSON.parse(row.templFile)
        : []
      this.$set(
        this.form.config[this.form.config.length - 1],
        'fileList',
        this.form.data.templFileId
      )
      this.form.data.id = row.id
      this.form.data.templId = row.templId
      this.form.data.stageId = +row.stageId
      this.form.data.deliverName = row.deliverName

      this.form.data.sort = +row.sort
      this.form.data.isCheck = +row.isCheck
      this.form.data.templTypeCode = row.templTypeCode
      this.form.data.fascicleCode = row.fascicleCode
    },
    // 弹框确定
    springBox_determine(type) {
      var parameter = new Promise((resolve, reject) => {
        this.$refs['modelMgrRef'].$refs['modelMgrRefForm'].validate((valid) => {
          if (valid) {
            resolve()
          }
        })
      })
      Promise.all([parameter]).then(() => {
        let params = this.form.data
        if (type == 0) {
          delete params.id
        }
        if (params.templFileId.length > 0) {
          params.templFile = JSON.stringify(params.templFileId)
          params.templFileId = params.templFileId[0].id
        } else {
          delete params.templFileId
          params.templFile = ''
        }
        delete params.templId
        api_saveDeliverable(params).then((res) => {
          if (res.msg.code == '0000') {
            if (type == 0) {
              this.$message({
                message: '添加成功',
                type: 'success',
              })
            } else {
              this.$message({
                message: '编辑成功',
                type: 'success',
              })
            }
            this.colseDialog()
            this.getUnitList()
          }
        })
      })
    },
    // 弹框取消
    colseDialog() {
      // this.$set(this.form.config[7], "fileList", []);
      this.$refs['modelMgrRef'].$refs['modelMgrRefForm'].resetFields()
      this.dialog.dialogVisible = false
    },
    // 弹框关闭前回调
    bClose(done) {
      this.$refs['modelMgrRef'].$refs['modelMgrRefForm'].resetFields()
      done()
    },
    getPageData(pageNum) {
      this.table.page.pageNum = pageNum
      this.getUnitList()
    },
    getSizeDate(pageSize) {
      this.table.page.pageSize = pageSize
      this.getUnitList()
    },
    eventNotify(ref) {
      this.$refs[ref].init()
    },
    formatter(key, val, row) {
      if (key === 'isCheck') {
        if (row['isCheck'] == 0) {
          return '<div>是</div>'
        } else if (row['isCheck'] == 1) {
          return '<div>否</div>'
        }
      }
    },
  },
}
</script>
