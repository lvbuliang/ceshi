<template>
  <div>
    <el-dialog
      :show-close="true"
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="35%"
      :before-close="handleClose"
    >
      <span
        v-if="dialogTitle == '项目概述' && projectDescriptionText"
        class="htmlDiv"
        v-html="projectDescriptionText"
      >
        <!-- {{ projectDescriptionText }} -->
      </span>

      <div
        v-else-if="dialogTitle == '业务应用需求' && businessNeeds"
        class="htmlDiv"
        v-html="businessNeeds"
      ></div>

      <div
        v-else-if="dialogTitle == '政务大数据平台能力' && commonData"
        class="htmlDiv"
        v-html="commonData"
      ></div>

      <div
        v-else-if="dialogTitle == '企业侧共性能力' && enterprise"
        class="htmlDiv"
        v-html="enterprise"
      ></div>

      <div
        v-else-if="dialogTitle == '项目分类' && projectClassification"
        class="htmlDiv"
        v-html="projectClassification"
      ></div>
      <div v-else>暂无内容</div>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleClose"
          >确 定</el-button
        >
      </span> -->
    </el-dialog>
  </div>
</template>
<script>
import { getProjectDetail } from "@/api/planProject";
export default {
  name: "DialogChen",
  components: {},
  mixins: [],
  props: {
    dialogTitle: {
      type: String,
      // default: '默认标题',
    },
    dialogVisible: {
      type: String,
      default() {
        return false;
      },
    },
  },
  data() {
    return {
      // dialogVisible: true,
      dialogTitle: "默认标题",
      active: [],
      activeT: "全文比对", // 默认选中
      arr: [],
      testId: "",
      projectDescriptionText: "",
      businessNeeds: "",
      commonData: '',
      enterprise: '',
      projectClassification: ''
    };
  },
  computed: {},
  watch: {},
  mounted() {
    this.getMessage();
  },
  created() {
    this.testId = this.$route.query.id;
  },
  methods: {
    handleClose() {
      this.$emit("closeDialog");
    },
    getMessage() {
      getProjectDetail({ id: this.testId }).then((res) => {
        if (res.data.projectOverview == null) {
          this.projectDescriptionText = "";
        } else {
          this.projectDescriptionText = res.data.projectOverview.replace(
            /\<img/gi,
            '<img style="max-width:100%;height:auto" '
          );
        }

        if (res.data.businessNeeds == null) {
          this.businessNeeds = "";
        } else {
          this.businessNeeds = res.data.businessNeeds.replace(
            /\<img/gi,
            '<img style="max-width:100%;height:auto" '
          );
        }

        if(res.data.commonData == null) {
          this.commonData = ''
        } else {
          this.commonData = res.data.commonData
        }

        if(res.data.enterprise == null) {
          this.enterprise = ''
        } else {
          this.enterprise = res.data.enterprise
        }

        if(res.data.projectClassification == null) {
          this.projectClassification = ''
        } else {
          this.projectClassification = res.data.projectClassification
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-dialog .el-dialog__header {
  text-align: left;
}

.htmlDiv {
  // position: fixed;
  // top: 0;
  // left: 0;
  max-width: 556px;
  height: 100%;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  font-size: 20px;
  background-size: contain;
}
</style>
