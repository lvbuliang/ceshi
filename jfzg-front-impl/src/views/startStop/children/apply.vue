<template>
  <div class="total-page">
    <sr-nav-page :type="2" :project="srNavPageObj"></sr-nav-page>
    <div v-if="editableTabs.length > 0">
      <div>
        <TestFormAdd
          v-if="fromData"
          ref="formAdd"
          :fromData="fromData"
          :editableTabs="editableTabs"
          :slotList="['暂停信息']"
        >
          <SrView ref="viewMessage1" slot="暂停信息" :formData="stopConfig" :ruleForm="data"></SrView>
        </TestFormAdd>
        <sr-work-flow
          :hideFrom="true"
          :clickMethods="clickmethods"
          :buttonList="buttonList"
          backName="startStop"
          ref="work_flow"
        ></sr-work-flow>
      </div>
    </div>
  </div>
</template>
<script>
import TestFormView from "@/components/srFormView.vue";
import TestFormAdd from "@/components/srFormAdd.vue";

import { api_getDetailById } from "@/api/projectLibrary";
import {
  api_getProjectStopDelitail,
  api_getStopInfoById,
  api_applyStartProject,
} from "@/api/startStop";
export default {
  components: { TestFormView, TestFormAdd },
  data() {
    return {
      srNavPageObj: { name: "", code: "" },
      data: {},
      id: this.$route.query.id,
      projectId: this.$route.query.projectId,
      fromData: {},
      editableTabs: [
        {
          formArr: [
            {
              selectData: {
                formAdd: {
                  enums: {},
                  data: {
                    riskName: "",
                    otherFile: "",
                  },
                  config: [
                    {
                      type: "textarea",
                      name: "申请理由",
                      placeholder: "请输入内容",
                      maxlength: 500,
                      bind: "improveContext",
                      col: 24,
                      trigger: "blur", // 校验时机
                      required: "请输入内容",
                    },
                    {
                      type: "upload",
                      name: "申请附件",
                      fileSize: 500,
                      fileList: [],
                      placeholder: "选择上传文件",
                      fileType: "pdf",
                      required: "选择上传文件",
                      col: 24,
                      bind: "improveFile",
                    },
                  ],
                  otherConfig: {
                    labelNum: 130,
                  },
                },
                formView: {
                  config: [],
                },
              },
            },
          ],
          title: "启停申请",
        },
      ],
      buttonList: [
        {
          role: "",
          btns: [
            {
              btnName: "提交申请",
              btnValue: "tg",
              btnType: "primary",
              btnEventType: "tg",
            },
          ],
          nodes: [],
        },
      ],
      clickmethods: { tg: this.tg },
      stopConfig: [
        {
          label: "整改内容",
          type: "value",
          span: 24,
          value: "descContext",
        },
        {
          label: "项目暂停通知单",
          type: "uploader",
          span: 24,
          value: "stopFile",
        },
        {
          label: "整改通知单",
          type: "uploader",
          span: 24,
          value: "rectFile",
        },
      ],
      startConfig: [
        {
          label: "申请理由",
          type: "value",
          span: 24,
          value: "improveContext",
        },
        {
          label: "申请附件",
          type: "uploader",
          span: 24,
          value: "improveFile",
        },
      ],
    };
  },
  created() {
    this.projectInit();
    if (this.$route.query.isAgain) {
      this.init();
    } else {
      this.businessInit();
    }
  },
  methods: {
    async businessInit() {
      let params = {
        id: this.$route.query.id,
      };
      api_getStopInfoById(params).then((res) => {
        if (res.msg.code === "0000") {
          let { stopFile, rectFile, improveFile } = res.data;
          let obj = {
            ...res.data,
            stopFile:
              stopFile && typeof stopFile === "string"
                ? JSON.parse(stopFile)
                : stopFile,
            rectFile:
              rectFile && typeof rectFile === "string"
                ? JSON.parse(rectFile)
                : rectFile,
            improveFile:
              improveFile && typeof improveFile === "string"
                ? JSON.parse(improveFile)
                : improveFile,
          };
          this.data = obj;
        }
      });
    },
    async init() {
      let params = {
        projectId: this.$route.query.projectId,
      };
      api_getProjectStopDelitail(params).then((res) => {
        if (res.msg.code === "0000") {
          let { improveFile, improveContext } = res.data;

          let obj = {
            improveContext,
            improveFile:
              improveFile && typeof improveFile === "string"
                ? JSON.parse(improveFile)
                : improveFile,
          };

          this.editableTabs[0].formArr[0].selectData.formAdd.data = obj;
        }
      });
    },
    async projectInit() {
      let res = await api_getDetailById({ id: this.$route.query.projectId });
      if (res?.data) {
        this.srNavPageObj = res.data;
      }
    },
    async tg() {
      let data = this.$refs["formAdd"]?.validateFun();
      if (!data) return;
      // 项目启动
      let params = {
        ...data,
        projectId: this.projectId,
        id: this.id,
        improveFile:
          data.improveFile && Array.isArray(data.improveFile)
            ? JSON.stringify(data.improveFile)
            : "",
      };
      let res = await api_applyStartProject(params);
      if (res.msg.code == "0000") {
        this.$message.success("启动申请成功！");
        this.$router.push({
          name: "startStop",
        });
      }
    },
  },
};
</script>

<style>
</style>