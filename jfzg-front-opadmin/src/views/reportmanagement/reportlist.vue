<template>
  <div class="peoplem">
    <div class="container">
      <div class="btn" style="margin-bottom:20px">
        <!-- <el-button type="primary" size="small" @click="add('serve')">
          <i class="el-icon-circle-plus-outline el-icon--left"></i>新增表格类型
        </el-button> -->
      </div>
      <el-container>
        <el-aside class="el-aside" width="362px">
          <p class="title">表格名称</p>
          <ul class="ul_list">
            <li
              v-for="(a,index) in serveTypeList"
              :class="{ red:changeRed2 == index}"
              :key="index"
              class="li_list"
              @click="selectHandle(a.code,index,a.id)"
            >
              {{a.code}}
              <el-dropdown class="more">
                <span class="el-dropdown-link">
                  <i class="el-icon-more"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item icon="el-icon-edit-outline" @click.native="uplateType(a,'serve')">
                   修改
                  </el-dropdown-item>
                  <el-dropdown-item icon="el-icon-delete" @click.native="deleteType(a)">
                   删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </li>
          </ul>
        </el-aside>
        <el-main class="el-main">
          <p class="title_M">{{setname}}</p>
          <FSearch :form="secondservesearch" @queryList="getServeTagList(setname,1)"></FSearch>
          <!-- <div class="btn">
            <el-button type="primary" size="small" @click="add('tag')">
              <i class="el-icon-circle-plus-outline el-icon--left"></i>新增标签库
            </el-button>
          </div> -->
            <!-- @pageChanged="getPageData"
            @sizeChanged="getSizeDate"
            :page="secondservertable.page" -->

          <FTable
            class="tableData"
            :data="secondservertable.data"
            :config="secondservertable.config"
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
        <div class="springBox_form" v-if="dialogType=='serve'">
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
        <div class="springBox_form" v-else-if="dialogType=='tag'||dialogType=='edit'">
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
            @click="springBox_determine(dialog)"
          >确定</el-button>
          <el-button type size="small" style="width:80px;height:32px;" @click="colseDialog">取消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>


<script>
import FTable from "@/components/FTable/index.vue";
import FForm from "@/components/FForm/form-add.vue";
import FSearch from "@/components/FSearch/index.vue";
import {
  specialFromType ,
  addorupType,
  delType,
  get_typeName,
  editTypeName,
  isBegin
} from "@/api/reportmanagement/reportmanagement";
export default {
  name: "peoplemanage",
  components: {
    FTable,
    FSearch,
    FForm,
  },
  data() {
    return {
      dialogType: "",
      isStart:'',
      dialog: {
        dialogVisible: false,
        width: "",
        title: "",
        type: "",
      },
      firstserveform: {
        title: "表单标题",
        config: [
          {
            col: 24,
            type: "text",
            name: "服务类型名称",
            placeholder: "请输入服务类型名称",
            bind: "name",
          },
        ],
        enums: {
          TypeList: [],
        },
        data: {
          name: "",
        },
      },
      secondserveform: {
        title: "表单标题",
        config: [
          {
            col: 24,
            type: "text",
            name: "字段名称",
            placeholder: "请输入字段名称",
            bind: "name",
          },
        ],
        enums: {
          TypeList: [],
        },
        data: {
          name: "",
          describe: "",
        },
      },
      secondservertable: {
        data: [], // 表格数据
        config: {
          fixed: "right",
          operationWidth: 140, // 操作列的宽度，不传默认180
          title: "", // 表格标题
          header: [
            {
              name: "字段名称",
              prop: "name",
            },
            {
              name: "创建时间",
              prop: "createTime",
            },
            {
              name: "创建人",
              prop: "creator",
            },
          ],
          innerBtn: [
            {
              name: "编辑", 
              method: "edit", 
              className: "font-size-20",
            },
            {
              name: "停用", 
              method: "start", 
              className: "font-size-20",
              validate: this.btnEnd
            },
             {
              name: "启用", 
              method: "start", 
              className: "font-size-20",
              validate: this.btnStart
            },
          ],
        },
        page:false,
      },
      secondservesearch: {
        textMaxNum: 4,  
        showExpand: false,  
        minNum: 4,  
        config: [
          {
            type: "text",
            name: "字段名称",
            placeholder: "请输入字段名称",
            bind: "name",  
          },
        ],
        form: {
          name: "",
        },
      },
      TypeId: "",
      serveTypeList: [],
      setname: "",
      changeRed2: "0",
      itemcode: "",
    };
  },
  mounted() {
    this.getServeTypeList();
  },
  methods: {
    // 获取类型
    getServeTypeList() {
      specialFromType().then((res) => {
        console.log(res);
        if (res.msg.message == "SUCCESS") {
          this.$set(this, "serveTypeList", res.data);
          this.itemcode = res.data[0].id;
          this.setname = res.data[0].code;
          this.getServeTagList(this.setname);
        }
      });
    },
    // 启用
    btnStart(item,row){
      let flag = false;
      if (row.isStart==1) {
        flag = true;
      }
      return flag;
    },
    // 停用
    btnEnd(item,row){
      let flag = false;
      if (row.isStart==0) {
        flag = true;
      }
      return flag;
    },
    // 获取标签列表
    getServeTagList(code) {
      let params = {
        code
      };
      const searchForms = this.secondservesearch.form;
      Object.keys(searchForms).map((item) => {
        if (searchForms[item]) {
          params[item] = searchForms[item];
        }
      });
      get_typeName(params).then((res) => {
        console.log(res);
        if (res.msg.message == "SUCCESS") {
          this.$set(this.secondservertable, "data", res.data);
        }
      });
    },
    // // 选择设置服务类型
    selectHandle(code, index, id) {
      this.setname = code;
      this.changeRed2 = index;
      this.itemcode = id;
      this.secondservesearch.form.name = "";
      // this.secondservertable.page.pageNum = 1;
      // this.secondservertable.page.pageSize = 5;
      this.getServeTagList(code);
    },
    // 启停
    start (row) {
      if(row.isStart==0){
        this.isStart = 1
      }else{
        this.isStart = 0
      }
      let data = {
        id:row.id,
        isStart:this.isStart
      }
      this.$confirm(`此操作将${data.isStart==1?"停用":"启用"}该字段, 是否继续?, 确认要${data.isStart==1?"停用":"启用"}该字段吗？`, {
        showClose: false,
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        customClass: "reportListandedit", 
        type: 'warning',
      }).then(() => {
        isBegin(data).then(res => {
          if (res.msg && res.msg.code == '0000') {
            this.$message({
              type: 'success',
              message:`${data.isStart==1?"停用":"启用"}成功！`
            });
          this.getServeTagList(this.setname);
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: `已取消${data.isStart==1?"停用":"启用"}`
        });
      });
    },
    eventNotify(ref) {
      this.$refs[ref].init();
    },
    //编辑
    edit(row) {
      this.dialogType = "edit";
      if (this.dialogType == "edit") {
        this.dialog = {
          dialogVisible: true,
          width: "560px",
          title: "新增标签",
          type: 1,
        };
        this.secondserveform.data = {
          id: row.id,
          name: row.name,
          code:this.setname,
          describe: row.describe,
        };
      }
    },
    //删除类型
    deleteType(row) {
      console.log("delete",row);
      delType({id:row.id}).then((res) => {
        if (res.msg.message == 'SUCCESS') {
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          this.dialog.dialogVisible = false
          this.getServeTypeList()
        }
      })
    },
    uplateType(row,type){
      console.log("bianji",row);
      this.dialogType = type;
      this.dialog = {
        dialogVisible: true,
        width: '560px',
        title: '编辑类型',
        type: 2,
        id: row.id,
        code:row.code
      }
      this.firstserveform.data.name = this.dialog.type == 2 ? row.code : ''
    },
    // 新增
    add(type) {
      this.dialogType = type;
      this.firstserveform.data = {};
      this.secondserveform.data = {};
      if (type == "tag") {
        this.dialog = {
          dialogVisible: true,
          width: "560px",
          title: "新增标签",
          type: 0,
        };
      } else {
        this.dialog = {
          dialogVisible: true,
          width: "560px",
          title: "新增类型",
          type: 0,
        };
      }
    },
    // 弹框确定
    springBox_determine(r) {
      console.log(r,'1111')
      if (this.dialogType == "serve") {
        // if (type == 0) {
          let data = {
            code: this.firstserveform.data.name,
          };
          if(r.type == 2){
            data.id=r.id
          }
          addorupType(data).then((res) => {
            if (res.msg.code == "0000") {
              this.$message({
                message: `${data.id?"编辑":"添加"}成功`,
                type: "success",
              });
              this.getServeTypeList();
              this.colseDialog();
            } else {
              this.$message.error("添加失败");
            }
          });
        // }
      } else {
        if (r.type == 0) {
          // let data = {
          //   name: this.secondserveform.data.name,
          //   typeId: this.itemcode,
          //   describe: this.secondserveform.data.describe,
          // };
          // api_addServeTag(data).then((res) => {
          //   console.log(res);
          //   if (res.msg.code == "0000") {
          //     this.$message({
          //       message: "添加成功",
          //       type: "success",
          //     });
          //     this.getServeTagList(this.itemcode);
          //     this.colseDialog();
          //   } else {
          //     this.$message.error("添加失败");
          //   }
          // });
        }else {
          let data = this.secondserveform.data;
          editTypeName(data).then((res) => {
            if (res.msg.code == "0000") {
              this.$message({
                type: "success",
                message: "编辑成功!",
              });
              this.colseDialog();
              this.getServeTagList(this.setname);
            } else {
              this.$message.error("编辑失败");
            }
          });
        }
      }
    },

    // 弹框取消
    colseDialog() {
      this.dialog.dialogVisible = false;
    },
    // 弹框关闭前回调
    bClose(done) {
      done();
    },
    getPageData(pageNum) {
      this.secondservertable.page.pageNum = pageNum;
      this.getServeTagList(this.setname);
    },
    getSizeDate(pageSize) {
      this.secondservertable.page.pageSize = pageSize;
      this.getServeTagList(this.setname);
    },
  },
};
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
    font-family: "黑体";
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
<style lang="scss">
.reportListandedit{
  .el-message-box__content .el-message-box__status{
      top: 10px !important;
    }
}

</style>
