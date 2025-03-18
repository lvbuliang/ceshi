<template>
  <div class="peoplem">
    <div class="container">
      <div class="btn" style="margin-bottom:20px">
        <el-button type="primary" size="small" @click="add('serve')">
          <i class="el-icon-circle-plus-outline el-icon--left"></i>新增领域
        </el-button>
      </div>
      <el-container>
        <el-aside class="el-aside" width="362px">
          <p class="title">行业领域</p>
          <ul class="ul_list">
            <li
              v-for="(a, index) in serveTypeList"
              :class="{ red: changeRed2 == index }"
              :key="index"
              class="li_list"
              @click="selectHandle(a.chName, index, a.codeId)"
            >
              {{ a.chName }}
              <el-dropdown class="more">
                <span class="el-dropdown-link">
                  <i class="el-icon-more"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    icon="el-icon-edit"
                    @click.native="editType(a)"
                  >
                    编辑
                  </el-dropdown-item>
                  <el-dropdown-item
                    icon="el-icon-delete"
                    @click.native="deleteType(a)"
                  >
                    删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </li>
          </ul>
        </el-aside>
        <el-main class="el-main">
          <p class="title_M">{{ setname }}</p>
          <FSearch
            :form="secondservesearch"
            @queryList="getServeTagList(itemcode, 1)"
          ></FSearch>
          <div class="btn">
            <el-button type="primary" size="small" @click="add('tag')">
              <i class="el-icon-circle-plus-outline el-icon--left"></i>新增分类
            </el-button>
          </div>
          <FTable
            class="tableData"
            :data="secondservertable.data"
            :config="secondservertable.config"
            :page="secondservertable.page"
            @pageChanged="getPageData"
            @sizeChanged="getSizeDate"
          ></FTable>
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
        <div class="springBox_form" v-if="dialogType == 'serve'">
          <FForm
            ref="modelMgrRef"
            :config="firstserveform.config"
            :form="firstserveform.data"
            :rules="firstserveform.rules"
            :enums="firstserveform.enums"
            refForm="modelMgrRefForm"
            @eventNotify="eventNotify"
            :column="2"
          ></FForm>
        </div>
        <div
          class="springBox_form"
          v-else-if="dialogType == 'tag' || dialogType == 'edit'"
        >
          <FForm
            ref="modelMgrRef"
            :config="secondserveform.config"
            :form="secondserveform.data"
            :rules="secondserveform.rules"
            :enums="secondserveform.enums"
            refForm="modelMgrRefForm"
            @eventNotify="eventNotify"
            :column="2"
          ></FForm>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button
            type="primary"
            size="small"
            style="width:80px;height:32px;"
            @click="springBox_determine(dialog.type)"
            >确定</el-button
          >
          <el-button
            type
            size="small"
            style="width:80px;height:32px;"
            @click="colseDialog"
            >取消</el-button
          >
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import FTable from '@/components/FTable/index.vue'
import FForm from '@/components/FForm/form-add.vue'
import FSearch from '@/components/FSearch/index.vue'
import {
  api_getServeTypeList, //服务能力类型列表(get)
  api_addServeType, //添加服务能力类型(post)
  api_getServeTagList, //服务能力标签列表(get)
  api_addServeTag, //添加服务能力标签(post)
  api_editServeTag, //编辑服务能力标签(post)
  api_queryIndustryDirection,
  api_addIndustryDirection,
  api_updateIndustryDirection,
  api_queryType,
  api_addType,
  api_updateType,
  api_deleteIndustryDirection,
} from '@/api/dictManage/dictManage'
export default {
  name: 'peoplemanage',
  components: {
    FTable,
    FSearch,
    FForm,
  },
  data() {
    return {
      dialogType: '',
      dialog: {
        dialogVisible: false,
        width: '',
        title: '',
        type: '',
      },
      firstserveform: {
        title: '表单标题',
        config: [
          {
            col: 24,
            type: 'text',
            name: '领域名称',
            placeholder: '请输入领域名称',
            bind: 'name',
          },
        ],
        enums: {
          TypeList: [],
        },
        data: {
          name: '',
        },
      },
      secondserveform: {
        title: '表单标题',
        config: [
          {
            col: 24,
            type: 'text',
            name: '分类名称',
            placeholder: '请输入分类名称',
            bind: 'name',
          },
          {
            col: 24,
            type: 'textarea',
            name: '分类描述',
            placeholder: '请输入分类描述',
            bind: 'memo',
            placeholder: '请输入分类描述（不超过200个字）',
            maxlength: 200,
          },
        ],
        enums: {
          TypeList: [],
        },
        data: {
          name: '',
          memo: '',
        },
      },
      secondservertable: {
        data: [], // 表格数据
        config: {
          fixed: 'right',
          operationWidth: 140, // 操作列的宽度，不传默认180
          title: '', // 表格标题
          header: [
            {
              name: '分类名称',
              prop: 'chName',
            },
            {
              name: '分类编号',
              prop: 'itemCode',
            },
            {
              name: '分类描述',
              prop: 'memo',
            },
            {
              name: '创建时间',
              prop: 'createTime',
            },
          ],
          innerBtn: [
            // 表格内部操作按钮，不需要操作列的innerBtn 写成false
            {
              name: '编辑', // 按钮名称，优先显示icon
              method: 'edit', // 点击执行该页面methods中对应的方法
              className: 'font-size-20',
            },
            {
              name: '删除', // 按钮名称，优先显示icon
              method: 'delete', // 点击执行该页面methods中对应的方法
              className: 'font-size-20',
            },
          ],
        },
        page: {
          // 分页配置
          total: 10, //总条数
          pages: 2, //总页数
          pageSize: 5, //每页展示多少个
          pageNum: 1, //当前页
        },
      },
      secondservesearch: {
        textMaxNum: 4, // label 最多几个字默认4个
        showExpand: false, // 是否显示展开收起，默认超过三个显示
        minNum: 4, // 收起显示几个, 默认3个
        config: [
          {
            type: 'text',
            name: '分类名称',
            placeholder: '请输入分类名称',
            bind: 'name', // 对应this.search.data对象的field1
          },
        ],
        form: {
          name: '',
        },
      },
      TypeId: '',
      serveTypeList: [],
      setname: '',
      changeRed2: '0',
      itemcode: '',
    }
  },
  mounted() {
    this.getServeTypeList()
  },
  methods: {
    // 获取服务能力类型
    getServeTypeList() {
      api_queryIndustryDirection().then((res) => {
        console.log(res)
        if (res.msg.message == 'SUCCESS') {
          this.$set(this, 'serveTypeList', res.data)
          this.itemcode = res.data[0].codeId
          this.setname = res.data[0].chName
          this.getServeTagList(this.itemcode)
        }
      })
    },
    // 获取标签列表
    getServeTagList(territoryId, page) {
      let params = {
        page: this.secondservertable.page.pageNum,
        size: this.secondservertable.page.pageSize,
        territoryId,
      }
      const searchForms = this.secondservesearch.form
      Object.keys(searchForms).map((item) => {
        if (searchForms[item]) {
          params[item] = searchForms[item]
        }
      })
      if (page) {
        params.page = page
      }
      api_queryType(params).then((res) => {
        console.log(res)
        if (res.msg.message == 'SUCCESS') {
          this.$set(this.secondservertable, 'data', res.data.records)
          this.$set(this.secondservertable.page, 'pageNum', res.data.current)
          this.$set(this.secondservertable.page, 'pageSize', res.data.size)
          this.$set(this.secondservertable.page, 'total', res.data.total)
        }
      })
    },
    // 选择设置服务类型
    selectHandle(name, index, id) {
      this.setname = name
      this.changeRed2 = index
      this.itemcode = id
      this.secondservesearch.form.name = ''
      this.secondservertable.page.pageNum = 1
      this.secondservertable.page.pageSize = 5
      this.getServeTagList(id)
    },
    eventNotify(ref) {
      this.$refs[ref].init()
    },
    //编辑
    edit(row) {
      this.dialogType = 'edit'
      if (this.dialogType == 'edit') {
        this.dialog = {
          dialogVisible: true,
          width: '560px',
          title: '新增分类',
          type: 1,
        }
        this.secondserveform.data = {
          id: row.codeId,
          name: row.chName,
          memo: row.memo,
        }
      }
    },
    editType(row) {
      this.dialogType = 'serve'
      this.dialog = {
        dialogVisible: true,
        width: '560px',
        title: '编辑领域',
        type: 1,
      }
      this.firstserveform.data = {
        id: row.codeId,
        name: row.chName,
      }
    },
    //删除类型
    deleteType(row) {
       console.log(row)
      let obj = {
        id: row.codeId,
      }
      api_deleteIndustryDirection(obj).then((res) => {
        if (res.msg.code == '0000') {
          this.$message({
            message: '删除成功',
            type: 'success',
          })
          this.getServeTypeList()
        } else {
          this.$message.error('删除失败')
        }
      })
    },
    //删除
    delete(row) {
      console.log(row)
      let obj = {
        id: row.codeId,
      }
      api_deleteIndustryDirection(obj).then((res) => {
        if (res.msg.code == '0000') {
          this.$message({
            message: '删除成功',
            type: 'success',
          })
          this.getServeTagList(this.itemcode)
        } else {
          this.$message.error('删除失败')
        }
      })
    },
    // 新增
    add(type) {
      this.dialogType = type
      this.firstserveform.data = {}
      this.secondserveform.data = {}
      if (type == 'tag') {
        this.dialog = {
          dialogVisible: true,
          width: '560px',
          title: '新增分类',
          type: 0,
        }
      } else {
        this.dialog = {
          dialogVisible: true,
          width: '560px',
          title: '新增领域',
          type: 0,
        }
      }
    },
    //新增服务类型
    addServeType() {},
    // 弹框确定
    springBox_determine(type) {
      if (this.dialogType == 'serve') {
        if (type == 0) {
          let data = {
            name: this.firstserveform.data.name,
          }
          api_addIndustryDirection(data).then((res) => {
            console.log(res)
            if (res.msg.code == '0000') {
              this.$message({
                message: '添加成功',
                type: 'success',
              })
              this.getServeTypeList()
              this.colseDialog()
            } else {
              this.$message.error('添加失败')
            }
          })
        } else if (type == 1) {
          let data = {
            id: this.firstserveform.data.id,
            name: this.firstserveform.data.name,
          }
          api_updateIndustryDirection(data).then((res) => {
            if (res.msg.code == '0000') {
              this.$message({
                message: '编辑成功',
                type: 'success',
              })
              this.getServeTypeList()
              this.colseDialog()
            } else {
              this.$message.error('编辑失败')
            }
          })
        }
      } else {
        if (type == 0) {
          let data = {
            name: this.secondserveform.data.name,
            territoryId: this.itemcode,
            memo: this.secondserveform.data.memo,
          }
          api_addType(data).then((res) => {
            console.log(res)
            if (res.msg.code == '0000') {
              this.$message({
                message: '添加成功',
                type: 'success',
              })
              this.getServeTagList(this.itemcode)
              this.colseDialog()
            } else {
              this.$message.error('添加失败')
            }
          })
        } else {
          let data = this.secondserveform.data
          api_updateType(data).then((res) => {
            if (res.msg.code == '0000') {
              this.$message({
                type: 'success',
                message: '编辑成功!',
              })
              this.colseDialog()
              this.getServeTagList(this.itemcode)
            } else {
              this.$message.error('编辑失败')
            }
          })
        }
      }
    },

    // 弹框取消
    colseDialog() {
      this.dialog.dialogVisible = false
    },
    // 弹框关闭前回调
    bClose(done) {
      done()
    },
    getPageData(pageNum) {
      this.secondservertable.page.pageNum = pageNum
      this.getServeTagList(this.itemcode)
    },
    getSizeDate(pageSize) {
      this.secondservertable.page.pageSize = pageSize
      this.getServeTagList(this.itemcode)
    },
  },
}
</script>

<style lang="scss" scoped>
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
          position: relative;
          .more {
            position: absolute;
            right: 30px;

            .el-icon-more {
              color: rgb(175, 174, 174);
              transform: rotate(90deg);
            }
          }
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
    font-family: '黑体';
    font-weight: Medium;
    padding: 24px;
  }
  /deep/ .search {
    .el-form {
      .el-form-item:nth-child(1) {
        margin-left: 32px;
      }
    }
  }

  .tableData {
    padding-left: 32px;
  }
}
</style>
