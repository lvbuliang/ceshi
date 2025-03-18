<template>
  <div class="peoplem">
    <div class="m_content">
      <div class="righttable">
        <FSearch :form="search" @queryList="getprojectMemberList(1)"></FSearch>
        <div class="btn">
          <el-button type="primary" size="small" @click="add">
            <i class="el-icon-circle-plus-outline el-icon--left"></i>新增人员
          </el-button>
        </div>

        <FTable
          class="tableData"
          :data="table.data"
          :config="table.config"
          :page="table.page"
          @pageChanged="getPageData"
          @sizeChanged="getSizeDate"
        ></FTable>
      </div>
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
          <FTable
            class="tableData"
            :data="dialogtable.data"
            :config="dialogtable.config"
            :page="dialogtable.page"
            @selected="onSelect"
          >
            <div slot="cellSlot" slot-scope="scope">
              <div class="table_unitName">{{ scope.scope.row.roleInfos[0].roleName}}</div>
            </div>
          </FTable>
        </div>
        <div slot="footer" class="dialog-footer">
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
</template>


<script>
import FTable from "@/components/FTable/index.vue";
import FForm from "@/components/FForm/form-add.vue";
import FSearch from "@/components/FSearch/index.vue";
import {
  api_queryProjectList, //获取项目列表
  api_editProjectInfo, //编辑项目信息
  api_queryMemberList, //项目成员列表
  api_removeMember, //移除项目成员
  api_addMember, //新增项目成员
  api_canAddMemberList, //可添加成员列表
} from "@/api/projectManage/projectManage";
export default {
  name: "peoplemanage",
  components: {
    FTable,
    FSearch,
    FForm,
  },
  data() {
    return {
      dialog: {
        dialogVisible: false,
        width: "",
        title: "",
        type: "",
        buid: "",
      },
      form: {
        title: "表单标题",
        config: [
          {
            col: 24,
            multiple: false,
            type: "selectLabel",
            name: "选择单位",
            placeholder: "请选择单位",
            bind: "unitid",
            dataList: "stateList", // 定义在this.form.enums中的typeList
            trigger: "blur", // 校验时机
            required: "请选择单位", // 必填需要指定提示信息
          },
          {
            col: 24,
            multiple: true,
            type: "select",
            name: "选择人员",
            placeholder: "请选择人员",
            bind: "personid",
            dataList: "personList", // 定义在this.form.enums中的typeList
            trigger: "blur", // 校验时机
            required: "请选择人员", // 必填需要指定提示信息
          },
        ],
        data: {
          unitid: "",
          personid: [],
        },
        enums: {
          stateList: [
            {
              dataName: "统筹单位",
              dataValue: "1",
            },
            {
              dataName: "建设单位",
              dataValue: "2",
            },
            {
              dataName: "承建单位",
              dataValue: "3",
            },
            {
              dataName: "监理单位",
              dataValue: "4",
            },
            {
              dataName: "第三方服务机构",
              dataValue: "5",
            },
            {
              dataName: "业务单位",
              dataValue: "6",
            },
            {
              dataName: "设计单位",
              dataValue: "7",
            },
            {
              dataName: "云服务商",
              dataValue: "8",
            },
          ],
          personList: [],
        },
        rules: {},
      },
      dialogtable: {
        jfids: [],
        rows: [],
        data: [], // 表格数据
        config: {
          fixed: "right",
          selection: true, // 是否显示复选框
          multiple: true,
          rowKey: "jfid",
          // expand: true, // 表格扩展
          operationWidth: 100, // 操作列的宽度，不传默认180
          title: "", // 表格标题
          header: [
            // 表格列配置
            {
              name: "姓名",
              prop: "fullname",
            },
            {
              name: "账户",
              prop: "userId",
            },
            {
              name: "联系方式",
              prop: "mobile",
            },
            {
              name: "角色",
              prop: "roleInfos",
              cellSlot: true,
            },
            {
              name: "登陆时间",
              prop: "lastLoginTime",
            },
          ],
        },
        //    page: {
        //   // 分页配置
        //   total: 12, //总条数
        //   pages: 2, //总页数
        //   pageSize: 5, //每页展示多少个
        //   pageNum: 1, //当前页
        // },
      },
      table: {
        data: [], // 表格数据
        config: {
          fixed: "right",
          selection: false, // 是否显示复选框
          multiple: true,
          // expand: true, // 表格扩展
          operationWidth: 120, // 操作列的宽度，不传默认180
          title: "", // 表格标题
          header: [
            // 表格列配置
            {
              name: "姓名",
              prop: "fullname",
              width: 80,
            },
            {
              name: "登陆账户",
              prop: "userId",
            },
            {
              name: "职务",
              prop: "role",
            },
            {
              name: "角色",
              prop: "roleName",
            },
            {
              name: "联系方式",
              prop: "mobile",
            },
            {
              name: "邮箱",
              prop: "email",
            },
          ],
          innerBtn: [
            // 表格内部操作按钮，不需要操作列的innerBtn 写成false
            {
              name: "移除", // 按钮名称，优先显示icon
              method: "remove", // 点击执行该页面methods中对应的方法
              className: "font-size-20",
              field: "roleCode", // 控制按钮显示隐藏的字段，目前仅支持单一字段，常显的按钮不需要传
              value: [],
            },
          ],
        },
        page: {
          // 分页配置
          total: 12, //总条数
          pages: 2, //总页数
          pageSize: 5, //每页展示多少个
          pageNum: 1, //当前页
        },
      },
      search: {
        textMaxNum: 3, // label 最多几个字默认4个
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

        form: {
          fullname: "",
        },
      },
    };
  },
  mounted() {
    this.getprojectMemberList();
  },
  methods: {
    // 获取项目成员列表
    getprojectMemberList(page) {
      let params = {
        page: this.table.page.pageNum,
        size: this.table.page.pageSize,
        projectId: this.$route.query.projectId,
      };

      const searchForms = this.search.form;
      Object.keys(searchForms).map((item) => {
        if (searchForms[item]) {
          params[item] = searchForms[item];
        }
      });
      if (page) {
        params.page = page;
      }
      api_queryMemberList(params).then((res) => {
        console.log(res);
        if (res.msg.message == "SUCCESS") {
          this.$set(this.table, "data", res.data.list);
          for (let a = 0; a < this.table.data.length; a++) {
            if (this.table.data[a].roleCode != "CJDW_CY") {
              this.table.config.innerBtn[0].value.push(
                this.table.data[a].roleCode
              );
            }
          }
          this.$set(this.table.page, "pageNum", res.data.pageNum);
          this.$set(this.table.page, "pageSize", res.data.pageSize);
          this.$set(this.table.page, "total", res.data.total);
        }
      });
    },
    // 添加成员多选
    onSelect(row) {
      this.dialogtable.rows = row;
      this.dialogtable.jfids = [];
      for (let a = 0; a < row.length; a++) {
        this.dialogtable.jfids.push(row[a].jfid);
      }
    },
    // 获取可添加成员列表
    getcanAddMemberList() {
      let data = {
        buid: this.$route.query.buid,
        projectId: this.$route.query.projectId,
      };
      api_canAddMemberList(data).then((res) => {
        console.log(res);
        if (res.msg.message == "SUCCESS") {
          this.$set(this.dialogtable, "data", res.data.memberInfos);
          //     this.$set(this.dialogtable.page, "pageNum", res.data.pageNum);
          // this.$set(this.dialogtable.page, "pageSize", res.data.pageSize);
          // this.$set(this.dialogtable.page, "total", res.data.total);
        }
      });
    },

    eventNotify(ref) {
      this.$refs[ref].init();
    },
    // 新增
    add(row) {
      this.dialogtable.rows = [];
      this.getcanAddMemberList();
      this.dialog = {
        dialogVisible: true,
        width: "960px",
        title: "新增人员",
        type: 0,
      };
    },
    // 移除
    remove(row) {
      this.$confirm("此操作将移除该成员, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let data = {
            jfid: row.jfid,
            projectId: this.$route.query.projectId,
          };
          api_removeMember(data).then((res) => {
            //console.log(res);
            if (res.msg.message == "SUCCESS") {
              this.$message({
                type: "success",
                message: "移除成功!",
              });
              this.$set(this.table.page, "pageNum", 1);
              this.$set(this.table.page, "pageSize", 5);
              this.getprojectMemberList();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消移除",
          });
        });
    },
    // 弹框确定
    springBox_determine(type) {
      if (this.dialogtable.jfids.length == 0) {
        this.$message.error("必须选择一位成员");
        return false;
      }
      if (type == 0) {
        let data = {
          jfids: this.dialogtable.jfids,
          projectId: this.$route.query.projectId,
        };
        api_addMember(data).then((res) => {
          //console.log(res);
          if (res.msg.code == "0000") {
            this.$message({
              message: "添加成功",
              type: "success",
            });
            this.dialog.dialogVisible = false;
            this.getprojectMemberList();
          } else {
            this.$message.error("添加失败");
          }
        });
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
      this.table.page.pageNum = pageNum;
      this.getprojectMemberList();
    },
    getSizeDate(pageSize) {
      this.table.page.pageSize = pageSize;
      this.getprojectMemberList();
    },
  },
};
</script>

<style lang="scss" scoped>
.ul_list {
  padding-top: 16px;
  .red {
    background-color: #e6f7ff;
  }
  li {
    padding-left: 24px;
    list-style-type: none;
    height: 38px;
    line-height: 38px;
    color: #262626;
    font-size: 14px;
  }
  li:hover {
    background-color: #fafafa;
  }
}
.leftlist_title {
  font-size: 16px;
  color: #262626;
  font-family: "黑体";
  font-weight: Medium;
  padding-left: 24px;
  height: 54px;
  line-height: 54px;
  border-bottom: 1px solid #f0f0f0;
  box-sizing: content-box;
}
.sec_title {
  font-size: 16px;
  color: #262626;
  font-family: "黑体";
  font-weight: Medium;
  height: 54px;
  padding: 0px 32px;
  padding-top: 20px;
  padding-bottom: 10px;
}
.btn {
  padding-left: 0px;
  padding-bottom: 16px;
  padding-top: 16px;
}
.peoplem {
  .m_title {
    font-size: 16px;
    color: #262626;
    font-family: "黑体";
    font-weight: Medium;
    padding: 24px;
  }

  .righttable {
    width: 100%;
    height: 600px;
    display: inline-block;

    margin-bottom: 30px;
    vertical-align: top;
  }
}
</style>