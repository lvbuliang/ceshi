<template>
  <div class="table">
    <div class="headerBtn" :class="{ posAbS: title }">
      <el-button
        class="btn"
        v-for="(item, i) in btns"
        :key="item.name + i"
        :type="item.type"
        @click="item.click"
        >{{ item.name }}</el-button
      >
    </div>
    <BorderLine :title="title" :isLine="!!title">
      <SrTable
        @pageChanged="pageChanged"
        :data="table.data"
        @sizeChanged="sizeChanged"
        :config="table.tableConfig"
        :page="table.page"
      >
        <template slot="cellSlot" slot-scope="{ scope }">
          <template v-if="scope.item.prop == 'remark'">
            <div>
              <h4>
                <b>{{ scope.row.title }}</b>
              </h4>
              <p>{{ scope.row.remark }}</p>
            </div>
          </template>
          <template v-if="scope.item.prop == 'liabler'">
            <div>{{ liablerFun(scope.row.liabler) }}</div>
          </template>
        </template>
      </SrTable>
    </BorderLine>
    <FormDialog
      ref="formDialog"
      :form="form"
      width="800px"
      title="添加措施"
      @confirm="confirm"
    />
  </div>
</template>
<script>
import FormDialog from "@/components/formDialog.vue";
import BorderLine from "@/components/borderLine";
import { queryUnitMembersBy } from "@/api/bianzhi";
import { queryByUnitType } from "@/api/bianzhi/index";
import store from "@/store";
export default {
  components: {
    FormDialog,
    BorderLine,
  },
  props: {
    tableUrl: Function, // 请求接口
    params: Object, // 其他参数
    tableData: Array, // 表格数据
    title: String, // 标题
  },
  watch: {
    params: {
      handler(val) {
        if (val) {
          this.getTbData();
          this.projectMember();
        }
      },
    },
    tableData: {
      handler(val) {
        console.log(222222, val);
        if (val && val.length) {
          this.$set(this.table, "data", val);
        }
      },
      deep: true,
    },
  },
  computed: {
    // userInfo() {
    //   return sessionStorage.getItem("userInfo");
    // },
  },
  data() {
    return {
      userInfo: store.getters.userInfo,
      btns: [
        {
          name: "添加措施",
          click: this.add,
          type: "primary",
          // permissionCode: "M005_003_002_003",
        },
        // { // 没有模板注释掉
        //   name: "从模板中添加",
        //   click: this.templateAdd,
        //   // permissionCode: "M005_003_002_003",
        // },
      ],
      table: {
        data: [], // 表格数据
        tableConfig: {
          // rowClassName: this.rowClassName,
          title: "表格的标题", // 表格标题
          highlightCurrentRow: false, // 控制表格是否单选
          // maxLength: 20, // 一行最多显示多少字，超出显示popver
          load: this.load,
          index: "序号", // 是否显示序号
          tooltipEffect: "light",
          header: [
            {
              index: 1,
              label: "措施",
              prop: "remark",
              cellSlot: true,
            },
            {
              index: 2,
              label: "措施责任人",
              prop: "liabler",
              cellSlot: true,
            },
          ],
          selectionConfig: {
            display: false,
            width: "70",
          },
          operateConfig: {
            display: true,
            label: "操作",
            width: "156",
            fixed: "right",
            allTableHeader: "",
            saveHeaderList: this.saveHeaderList,
          },
          innerBtn: [
            {
              name: "编辑",
              method: "edit",
              type: "text",
              size: "small",
              // field: "status",
              // value: ["2", "3", "4"],
              icon: "el-icon-document",
              // code: "M005_003_002_004", // 按钮的唯一值,用于角色按钮权限控制，不传默认不进行权限控制
              className: "font-size-20",
              // validate: this.btnValidate,
            },
            {
              name: "删除",
              method: "delete",
              type: "text",
              size: "medium",
              // field: "status",
              // value: ["1"],
              icon: "el-icon-document",
              // code: "M005_003_002_005", // 按钮的唯一值,用于角色按钮权限控制，不传默认不进行权限控制
              className: "font-size-20",
              // reverse: true,
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
      form: {
        config: [
          {
            type: "textarea",
            name: "问题描述",
            placeholder: "请输入问题描述",
            required: "请输入问题描述",
            maxlength: 100,
            col: 24,
            bind: "title",
          },
          {
            type: "textarea",
            name: "处理措施",
            col: 24,
            placeholder: "请输入处理措施",
            maxlength: 100,
            required: "请输入处理措施",
            bind: "remark",
          },
          {
            type: "select",
            name: "措施责任人",
            col: 24,
            placeholder: "请选择措施责任人",
            // required: "请选择措施责任人",
            bind: "liabler",
            dataList: "liablerList",
          },
        ],
        otherConfig: {
          labelNum: 140,
          column: 2,
        },
        enums: {
          liablerList: [],
        },
        rules: {},
        data: {},
      },
    };
  },
  created() {
    if (this.tableData && this.tableData.length) {
      this.$set(this.table, "data", this.tableData);
    }
    this.getTbData();
    this.projectMember();
  },
  methods: {
    async projectMember() {
      let { buid } = this.userInfo.currentBizunit
        ? this.userInfo.currentBizunit
        : {};
      queryByUnitType({ projectId: this.$route.query.projectId }).then(
        (res) => {
          if (res.msg.code == "0000") {
            let allmember = [
              ...res.data["JSDW"].members,
              ...res.data["JSDW"].principals,
              ...res.data["CJDW"].members,
              ...res.data["CJDW"].principals,
              ...res.data["JLDW"].members,
              ...res.data["JLDW"].principals,
            ];
            let Fzr_data = [];
            for (let i = 0; i < allmember.length; i++) {
              var map = {
                fullname: allmember[i].fullname,
                mobile: allmember[i].mobile,
                jfid: allmember[i].jfid,
                dataName: allmember[i].fullname,
                dataValue: allmember[i].jfid,
              };
              var cannotadd = false;
              for (var j = 0; j < Fzr_data.length; j++) {
                if (Fzr_data[j].jfid == allmember[i].jfid) {
                  cannotadd = true;
                  break;
                }
              }
              if (!cannotadd) {
                Fzr_data.push(map);
              }
            }
            // 处理人
            this.$set(
              this.form.enums,
              "liablerList",
              this.$utils.enumsDataNameValue(Fzr_data, "fullname", "jfid")
            );
          }
        }
      );

      // if (!buid) return;
      // 项目成员所有人
      // let res = await queryUnitMembersBy({
      //   buid,
      // });
      // if (res?.data && res.msg.code == "0000") {
      //   this.$set(
      //     this.form.enums,
      //     "liablerList",
      //     this.$utils.enumsDataNameValue(res.data, "fullname", "jfid")
      //   );
      // }
    },
    liablerFun(val) {
      let arr = this.form.enums.liablerList;
      return this.$utils.arrFind(arr, val, "dataValue", true)?.dataName;
    },
    add() {
      this.form.data = {};
      this.$emit("clearInter");
      this.$refs["formDialog"].$isShow();
    },
    edit(data) {
      this.form.data = data;
      this.$refs["formDialog"].$isShow();
    },
    delete(data) {
      this.$SrUtils.showConfirmMessage.call(this, {
        title: "提示",
        content: "此操作将删除此数据, 是否继续?",
        okFun: () => {
          this.$emit("tableDelete", data);
        },
        cancelFun: () => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        },
      });
    },
    templateAdd() {},
    async confirm(data) {
      // 弹框确定
      if (data.id) {
        // 编辑
        this.$emit("tableEdit", data);
      } else {
        this.$emit("tableConfirm", data);
      }
    },
    pageChanged(val) {
      this.table.page.pageNum = val;
      this.getTbData();
    },
    sizeChanged(val) {
      this.table.page.pageNum = 1;
      this.table.page.pageSize = val;
      this.getTbData();
    },
    getTbData() {
      let param = {
        ...this.params,
      };
      const searchForms = param;
      Object.keys(searchForms).map((item) => {
        if (this.$utils.isEmpty(searchForms[item])) {
          param[item] = searchForms[item];
        }
      });
      this.tableUrl(param).then((res) => {
        if (!res?.data) return;
        this.table.data = res.data;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.table {
  position: relative;

  .headerBtn {
    width: 100%;
    height: 32px;
    display: flex;
    justify-content: flex-end;
    .btn {
      height: 32px;
      padding-top: 10px;
      padding-bottom: 10px;
      margin-left: 8px;
      border-radius: 16px;
    }
  }

  .posAbS {
    position: absolute;
    right: 0;
    top: 0;
  }

  ::v-deep .borderLine {
    padding-top: 10px;
  }
}
</style>
