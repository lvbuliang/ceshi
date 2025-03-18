<template>
  <div class="extract-page">
    <div class="btn-wrap">
      <el-button type="primary" size="small" round @click="handleAddGroup">
        新增
      </el-button>
    </div>
    <SrTable
      @pageChanged="pageChanged"
      :data="table.data"
      @sizeChanged="sizeChanged"
      :config="table.tableConfig"
      :page="table.page"
      align="left"
    ></SrTable>
    <el-dialog
      :title="title"
      :visible.sync="visible"
      append-to-body
      width="800px"
    >
      <div class="content_historyStyle">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="140px"
          class="demo-ruleForm"
        >
          <el-form-item label="评审小组名称" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="小组备注">
            <el-input v-model="ruleForm.remark"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit" round size="small"
          >确 定</el-button
        >
        <el-button @click="visible = false" round size="small">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import config from "@/settings.js";
import upload from "@/utils/upload";
import { saveGroup, getGroupList, deleteGroup } from "@/api/activityList";
export default {
  watch: {
    visible(val) {
      if (!val) {
        // 重置表单
        this.$refs["ruleForm"].resetFields();
        this.ruleForm.remark = "";
      }
    },
  },
  provide() {
    return {
      baseUrl: config.baseUrl,
      imgBaseUrl: config.imgBaseUrl,
      uploadRequest: upload,
      uploadBaseUrl: config.uploadBaseUrl,
      previewUrl: config.previewUrl,
    };
  },
  computed: {},
  props: {},
  data() {
    return {
      table: {
        data: [], // 表格数据
        tableConfig: {
          rowClassName: this.rowClassName,
          title: "表格的标题", // 表格标题
          highlightCurrentRow: false, // 控制表格是否单选
          // maxLength: 20, // 一行最多显示多少字，超出显示popver
          load: this.load,
          tooltipEffect: "light",
          header: [
            {
              label: "评审小组名称",
              prop: "name",
            },
            {
              label: "小组备注",
              prop: "remark",
            },
          ],
          selectionConfig: {
            display: false,
            width: "70",
          },
          operateConfig: {
            display: true,
            label: "操作",
            width: "170",
            fixed: "right",
            allTableHeader: "",
            saveHeaderList: this.saveHeaderList,
            export: this.export,
            exportPermissionCode: "M005_001_004",
          },
          innerBtn: [
            // 表格内部操作按钮，不需要操作列的innerBtn 写成false
            {
              name: "编辑", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "update", // 点击执行该页面methods中对应的方法
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
            },
            {
              name: "删除", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "del", // 点击执行该页面methods中对应的方法
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
            },
          ],
        },
        page: {
          // 分页配置
          total: 0, //总条数
          pages: 0, //总页数
          pageSize: 10, //每页展示多少个
          pageSizes: [10, 20, 30],
          pageNum: 1, //当前页
          background: true,
          // layout: 'total, prev, pager, next, sizes,jumper'
        },
      },
      visible: false,
      ruleForm: {
        name: "",
        remark: "",
      },
      rules: {
        name: [
          { required: true, message: "请输入评审小组名称", trigger: "blur" },
        ],
      },
      title: "设置分组",
      groupId: null, //分组id
      itemVal: {}, //当前分组的详细信息
    };
  },
  created() {
    // this.initData();
  },
  methods: {
    // 初始化数据
    // initData() {
    //   let params = {
    //     conferenceId: this.$route.query.id,
    //   };
    //   getGroupList(params).then((res) => {
    //     console.log("分组列表", res);
    //     this.table.data = res.data;
    //     if (res.data.length == 0) {
    //       let params = {
    //         conferenceId: this.$route.query.id,
    //         id: 0,
    //         name: "默认分组",
    //         remark: "",
    //       };
    //       saveGroup(params).then((res) => {
    //         console.log("res");
    //         if (res.msg.code == "0000") {
    //           this.initData();
    //         }
    //       });
    //     }
    //   });
    //   /* this.table.data = [
    //     {
    //       id: new Date().getTime(),
    //       groupName: "默认分组",
    //       remark: "小组",
    //     },
    //   ]; */
    // },
    // 新增按钮操作
    handleAddGroup() {
      this.title = "设置分组";
      this.groupId = null;
      this.ruleForm.name = "";
      this.ruleForm.remark = "";
      this.visible = true;
    },
    // 确认按钮操作
    submit() {
      if (this.groupId) {
        console.log("编辑", this.groupId);
        /*  const result = this.table.data.find((item) => item.id == this.groupId);
        console.log("result", result);
        if (result) {
          result.id = this.itemVal.id;
          result.groupName = this.ruleForm.name;
          result.remark = this.ruleForm.remark;
        } */
        let params = {
          conferenceId: this.$route.query.id,
          id: this.groupId,
          name: this.ruleForm.name,
          remark: this.ruleForm.remark,
        };
        saveGroup(params).then((res) => {
          console.log("res");
          if (res.msg.code == "0000") {
            this.$message({ type: "success", message: "操作成功!" });
            // this.initData();
          }
        });
      } else {
        /*   this.table.data.push({
          id: new Date().getTime(),
          groupName: this.ruleForm.name,
          remark: this.ruleForm.remark,
        }); */
        console.log("新增", this.groupId);
        let params = {
          conferenceId: this.$route.query.id,
          id: 0,
          name: this.ruleForm.name,
          remark: this.ruleForm.remark,
        };
        saveGroup(params).then((res) => {
          console.log("res");
          if (res.msg.code == "0000") {
            this.$message({ type: "success", message: "操作成功!" });
            // this.initData();
          }
        });
      }
      this.visible = false;
    },
    // 编辑按钮操作
    update(row) {
      console.log("row", row);
      this.title = "编辑分组";
      this.itemVal = row;
      this.groupId = row.id;
      this.ruleForm.name = row.name;
      this.ruleForm.remark = row.remark;
      this.visible = true;
    },
    // 删除操作
    del(row) {
      console.log("row", row);
      if (this.table.data && this.table.data.length == 1) {
        this.$message.warning("至少保留一个分组！");
        return;
      }
      let params = {
        conferenceId: this.$route.query.id,
        id: row.id,
      };
      this.$confirm("此操作将删除此分组，是否继续？", `提示`, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteGroup(params).then((res) => {
            console.log(res);
            if (res.msg.code == "0000") {
              this.$message({
                type: "success",
                message: "操作成功!",
              });
              // this.initData();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
  },
};
</script>
  
<style lang="scss">
.extract-page {
  .btn-wrap {
    text-align: right;
    margin-bottom: 16px;
  }
  .el-dialog {
    .el-dialog__header {
      height: 56px;
      position: relative;
      .el-dialog__title {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
      }
    }
    ::v-deep .el-dialog__body {
      padding-top: 8px;
      padding-right: 0px;
      .content_historyStyle {
        ::v-deep .el-checkbox-group {
          .el-checkbox {
            width: 170px;
            margin: 16px 24px 0 0;
            ::v-deep .el-checkbox__label {
              font-size: 14px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #333333;
            }
          }
        }
        .content_title {
          margin-bottom: 8px;
        }
      }
    }
    ::v-deep .el-dialog__footer {
      .dialog-footer {
        text-align: center;
        display: flex;
        justify-content: center;
        .el-button {
          width: 76px !important;
          height: 32px !important;
          padding: 0 !important;
          border-radius: 16px;
        }
      }
    }
  }
}
</style>
  