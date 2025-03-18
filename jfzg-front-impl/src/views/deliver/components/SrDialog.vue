<template>
  <div class="SrDialog">
    <el-dialog
      :title="title"
      :visible.sync="visible"
      append-to-body
      width="800px"
      v-if="visible"
    >
      <div class="content" v-if="type == 'addDeliver' || type == 'editDeliver'">
        <SrAdd
          :config="formAdd.config"
          :enums="formAdd.enums"
          :form="formAdd.data"
          :ref="`Formadd`"
        ></SrAdd>
      </div>

      <div class="content" v-else-if="type == 'approveView'">
        <SrView
          :formData="approveformView.config"
          :ruleForm="approveformView.data"
        ></SrView>
      </div>

      <div class="content" v-else-if="type == 'approve'">
        <SrAdd
          :config="approveformAdd.config"
          :enums="approveformAdd.enums"
          :form="approveformAdd.data"
          :ref="`approveformAdd`"
        ></SrAdd>
      </div>
      <div class="content" v-else-if="type == 'approveDeliver'">
        <SrAdd
          :config="approveDeliverformAdd.config"
          :enums="approveDeliverformAdd.enums"
          :form="approveDeliverformAdd.data"
          :ref="`approveDeliverformAdd`"
        ></SrAdd>
      </div>

      <div class="content" v-else>
        <div class="content_title">
          <SwiperTab :eletab="eletab" />
        </div>
        <div class="content_table">
          <SrTable
            @pageChanged="pageChanged"
            :data="table.data"
            @sizeChanged="sizeChanged"
            :config="table.tableConfig"
            :page="table.page"
            @selected="selected"
            @selectAll="selectAll"
          >
          </SrTable>
        </div>
      </div>
      <div v-if="type == 'approveDeliver'" slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>

        <el-button v-debounce="[() => rejectHandle(), config.deTime]"
          >不通过</el-button
        >
        <el-button
          type="primary"
          v-debounce="[() => rejectHandle(), config.deTime]"
          >通 过</el-button
        >
      </div>
      <div v-else slot="footer" class="dialog-footer">
        <el-button type="primary" v-debounce="[() => submit(), config.deTime]"
          >确 定</el-button
        >
        <el-button @click="visible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import SwiperTab from "./swiperTab";
import config from "@/settings.js";
import upload from "@/utils/upload";
import { getProjectStages, getDeliverApproveDetail } from "@/api/deliver/index";

export default {
  components: {
    SwiperTab,
  },
  provide() {
    return {
      baseUrl: config.uploadBaseUrl,
      imgBaseUrl: config.imgBaseUrl,
      uploadRequest: upload,
      uploadBaseUrl: config.uploadBaseUrl,
    };
  },
  computed: {
    swiper() {
      return this.$refs.todoSwiper.swiper;
    },
  },
  data() {
    return {
      config,
      loading: false,
      approveformView: {
        config: [
          {
            span: 24,
            label: "审核",
            value: "approveResult",
          },
          {
            span: 24,
            label: "审核意见",
            value: "result",
          },
          {
            span: 24,
            label: "上传附件",
            value: "file",
            type: "uploader",
            colNum: 3, // 一行几个附件
            maxFeild: 15, // 单个附件显示几个字
            showExpand: true, // 是否需要展开收起功能
          },
        ],
        data: {
          approveResult: "",
          result: "",
          file: [],
        },
      },
      table: {
        data: [
          {
            num: 1,
            fileName: "交付物名称",
            sourceIsSeal: "否",
            userName: "模板",
          },
          {
            num: 2,
            fileName: "交付物名称",
            sourceIsSeal: "否",
            userName: "模板",
          },
        ], // 表格数据
        tableConfig: {
          rowClassName: this.rowClassName,
          title: "表格的标题", // 表格标题
          highlightCurrentRow: false, // 控制表格是否单选
          // maxLength: 20, // 一行最多显示多少字，超出显示popver
          load: this.load,
          tooltipEffect: "light",
          header: [
            {
              label: "序号",
              prop: "num",
            },
            {
              label: "交付物名称",
              prop: "fileName",
              width: 350,
            },
            {
              label: "是否为验收项",
              prop: "sourceIsSeal",
            },
            {
              label: "模板",
              prop: "userName",
            },
          ],
          selectionConfig: {
            display: true,
            width: "70",
          },
          operateConfig: {
            // display: true,
            // label: "操作",
            // width: "156",
            // fixed: "right",
            // allTableHeader: "",
            // saveHeaderList: this.saveHeaderList,
            // export: this.export,
            // exportPermissionCode: this.ifHideAddBtn ? "M004_M002_001" : "M003_M002_002",
          },
          innerBtn: [
            // 表格内部操作按钮，不需要操作列的innerBtn 写成false
            {
              name: "查看", // 按钮名称，优先显示icon
              type: "text",
              size: "small",
              method: "see", // 点击执行该页面methods中对应的方法
              field: "id", // 控制按钮显示隐藏的字段，目前仅支持单一字段，常显的按钮不需要传
              value: [1, 2], // 需要根据字段控制按钮显示隐藏，当state值不等于该数组的任何一个值的时候显示。逻辑this.table.data的某条数据state!=1&&state!=2时显示该行的这个按钮
              icon: "iconbianji", // 按钮显示的图标,不传显示中文
              code: "2334455", // 按钮的唯一值,用于角色按钮权限控制，不传默认不进行权限控制
            },
            {
              name: "编辑",
              method: "edit",
              type: "text",
              size: "small",
              icon: "el-icon-document",
              className: "font-size-20",
              validate: this.btnValidate, //自定义判断是否展示按钮权限
            },
            {
              name: "删除",
              method: "delete",
              type: "text",
              size: "medium",
              icon: "el-icon-document",
              className: "font-size-20",
              validate: this.btnValidate, //自定义判断是否展示按钮权限
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
      swiperOption: {
        loop: false,
        slidesPerView: "auto", // 每页展示几条数据
        spaceBetween: 0,
        initialSlide: 0,
        freeMode: true,
        navigation: {
          nextEl: ".swiper-button-Next",
          prevEl: ".swiper-button-Prev",
        },
      },
      eletab: [
        {
          stageName: "启动阶段",
          count: 10,
        },
        {
          stageName: "需求分析阶段",
          count: 10,
        },
        {
          stageName: "设计阶段",
          count: 10,
        },
        {
          stageName: "开发阶段",
          count: 10,
        },
        {
          stageName: "测试阶段",
          count: 10,
        },
        {
          stageName: "试运行阶段",
          count: 10,
        },
      ],
      visible: false,
      formAdd: {
        config: [
          {
            key: "1624869956000_46093",
            type: "input",
            col: 12,
            filterable: false,
            multiple: false,
            className: "",
            rules: [],
            trigger: "blur",
            isHideView: false,
            isHide: false,
            bind: "name",
            name: "交付物名称",
            disabled: false,
            placeholder: "请输入交付物名称",
            required: "请输入交付物名称",
          },
          {
            key: "1625624726000_73237",
            type: "select",
            col: 12,
            maxlength: 50,
            className: "",
            rules: [],
            trigger: "blur",
            isHideView: false,
            isHide: false,
            bind: "milestoneId",
            readonly: false,
            name: "里程碑阶段",
            disabled: false,
            dataList: "milestoneIdList",
            placeholder: "请输入里程碑阶段",
            required: "请输入里程碑阶段",
          },
          {
            key: "1625624566000_73891",
            type: "select",
            col: 12,
            filterable: false,
            multiple: false,
            className: "",
            rules: [],
            label: "",
            trigger: "blur",
            isHideView: false,
            isHide: false,
            bind: "isSeal",
            dataList: "isSealList",
            name: "是否盖章",
            disabled: false,
            placeholder: "请选择是否盖章",
            value: "",
            required: "请选择是否盖章",
          },
          {
            key: "1625624566000_73891",
            type: "select",
            col: 12,
            filterable: false,
            multiple: false,
            className: "",
            rules: [],
            label: "",
            trigger: "blur",
            isHideView: false,
            isHide: false,
            bind: "isChecked",
            dataList: "isCheckedList",
            name: "是否验收项",
            disabled: false,
            placeholder: "请选择是否验收项",
            value: "",
            required: "请选择是否验收项",
          },
        ],
        data: {
          name: "",
          milestoneId: "",
          isChecked: "",
          isSeal: "",
        },
        enums: {
          isCheckedList: [
            {
              dataName: "是",
              dataValue: 0,
            },
            {
              dataName: "否",
              dataValue: 1,
            },
          ],
          isSealList: [
            {
              dataName: "是",
              dataValue: 0,
            },
            {
              dataName: "否",
              dataValue: 1,
            },
          ],
          milestoneIdList: [],
        },
      },
      approveformAdd: {
        config: [
          {
            key: "1626090539000_22640",
            type: "radio",
            bind: "approve",
            name: "审核",
            col: 24,
            className: "",
            isHide: false,
            isHideView: false,
            dataList: "approveList",
            required: "审核为必填项",
            trigger: "blur",
            rules: [],
          },
          {
            key: "1626090666000_85054",
            type: "textarea",
            bind: "advice",
            name: "审核意见",
            col: 24,
            className: "",
            isHide: false,
            isHideView: false,
            placeholder: "请输入审核意见",
            maxlength: 500,
            row: 3,
            disabled: false,
            readonly: false,
            resize: "none",
            trigger: "blur",
            rules: [],
          },
          {
            key: "1626090696000_45761",
            type: "upload",
            bind: "files",
            name: "上传附件",
            col: 24,
            className: "",
            isHide: false,
            isHideView: false,
            fileList: [],
            fileTip: "",
            limit: 1,
            fileType: "",
            trigger: "blur",
            rules: [],
          },
        ],
        data: {
          approve: "",
          advice: "",
          files: "",
        },
        otherConfig: {
          labelNum: 130,
        },
        enums: {
          approveList: [
            {
              dataValue: "1000",
              dataName: "通过",
              disabled: false,
            },
            {
              dataValue: "2",
              dataName: "不通过",
              disabled: false,
            },
          ],
        },
      },
      approveDeliverformAdd: {
        config: [
          {
            type: "textarea",
            name: "审批意见",
            placeholder: "请输入审批意见",
            bind: "auditOpinion",
            append: true,
            maxLength: 100,
            col: 24,
          },
          {
            type: "upload",
            name: "附件",
            bind: "accessoryList",
            fileList: [],
            limit: 10,
            tipPopover: true, // hover显示提示  默认外面显示
            col: 24,
          },
        ],
        data: {
          auditOpinion: "",
          accessoryList: [],
        },
      },
    };
  },
  mounted() {
    if (this.$route.query.projectId) {
      this.getProjectStages();
    }
  },
  watch: {
    visible(val) {
      if (!val) {
        // 重置表单
        if (this.$refs["Formadd"] && this.$refs["Formadd"].resetForm) {
          this.$refs["Formadd"].resetForm();
        }
        if (
          this.$refs["approveformAdd"] &&
          this.$refs["approveformAdd"].resetForm
        ) {
          this.$refs["approveformAdd"].resetForm();
          console.log(this.$refs["approveformAdd"]);
          // 清空附件
          this.approveformAdd = {
            config: [
              {
                key: "1626090539000_22640",
                type: "radio",
                bind: "approve",
                name: "审核",
                col: 24,
                className: "",
                isHide: false,
                isHideView: false,
                dataList: "approveList",
                required: "审核为必填项",
                trigger: "blur",
                rules: [],
              },
              {
                key: "1626090666000_85054",
                type: "textarea",
                bind: "advice",
                name: "审核意见",
                col: 24,
                className: "",
                isHide: false,
                isHideView: false,
                placeholder: "请输入审核意见",
                maxlength: 500,
                row: 3,
                disabled: false,
                readonly: false,
                resize: "none",
                trigger: "blur",
                rules: [],
              },
              {
                key: "1626090696000_45761",
                type: "upload",
                bind: "files",
                name: "上传附件",
                col: 24,
                className: "",
                isHide: false,
                isHideView: false,
                fileList: [],
                fileTip: "",
                limit: 1,
                fileType: "",
                trigger: "blur",
                rules: [],
              },
            ],
            data: {
              approve: "",
              advice: "",
              files: "",
            },
            otherConfig: {
              labelNum: 130,
            },
            enums: {
              approveList: [
                {
                  dataValue: "1000",
                  dataName: "通过",
                  disabled: false,
                },
                {
                  dataValue: "2",
                  dataName: "不通过",
                  disabled: false,
                },
              ],
            },
          };
        }
      }
    },
  },
  methods: {
    // 查看审核结果
    init(id) {
      console.log(id);
      let params = {
        id: id,
      };
      getDeliverApproveDetail(params).then((res) => {
        console.log(res.data[0]);
        let Dat = res.data[0];
        this.approveformView.data.approveResult =
          Dat.status == 1000 || Dat.status === 1 ? "通过" : "不通过";
        this.approveformView.data.result = Dat.result;
        this.approveformView.data.file = JSON.parse(Dat.file);
      });
    },
    // 编辑交付物
    edit(row) {
      this.$set(this.formAdd, "data", row);
    },
    // 获取项目下的了程碑阶段 getProjectStages
    getProjectStages() {
      let params = {
        projectId: this.$route.query.projectId,
      };
      getProjectStages(params).then((res) => {
        let type_list = [];
        res.data.forEach((item) => {
          let emunObj = {};
          emunObj.dataName = item.stageName;
          emunObj.dataValue = item.stageId;
          type_list.push(emunObj);
        });
        this.$set(this.formAdd.enums, "milestoneIdList", type_list);
      });
    },
    // 通过
    passHandle() {
      this.visible = false;
      this.$emit("workFlowHandle", this.approveDeliverformAdd.data, "primary");
    },
    // 不通过
    rejectHandle() {
      this.visible = false;
      this.$emit("workFlowHandle", this.approveDeliverformAdd.data, "danger");
    },
    submit() {
      if (this.type == "addDeliver") {
        this.$refs["Formadd"].validate((val) => {
          if (val) {
            this.visible = false;
            this.$emit("submitData", this.formAdd.data);
          }
        });
      } else if (this.type == "approve") {
        this.$refs["approveformAdd"].validate((val) => {
          if (val) {
            console.log("通过");
            this.visible = false;
            this.$emit("submitData", this.approveformAdd.data);
          }
        });
      } else if (this.type == "approveDeliver") {
        this.visible = false;
        this.$emit("submitData", this.approveDeliverformAdd.data);
      } else if (this.type == "editDeliver") {
        this.visible = false;
        this.$emit("submitData", this.formAdd.data);
      } else if ((this.type = "approveView")) {
        this.visible = false;
      }
    },
    selected(val) {
      console.log(val);
    },
    selectAll(all) {},
    prev() {
      this.swiper.slidePrev();
    },
    next() {
      this.swiper.slideNext();
    },
    handleClick(tab) {
      console.log(tab);
    },
    //页数发生改变
    pageChanged(val) {
      this.table.page.pageNum = val;
    },
    sizeChanged(val) {
      this.table.page.pageNum = 1;
      this.table.page.pageSize = val;
    },
  },
  props: {
    title: {
      type: String,
      default: function () {
        return "";
      },
    },
    type: {
      type: String,
      default: function () {
        return "";
      },
    },
  },
};
</script>

<style lang="scss">
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
  .el-dialog__body {
    .content {
      .content_title {
        margin-bottom: 8px;
      }
    }
  }
  .el-dialog__footer {
    .dialog-footer {
      text-align: center;
      display: flex;
      justify-content: center;
      .el-button {
        width: 76px;
        height: 32px;
        padding: 0;
        border-radius: 16px;
      }
      .el-button:nth-child(1) {
        order: 2;
      }
      .el-button:nth-child(2) {
        order: 1;
        margin-right: 8px;
      }
    }
  }
}
</style>
