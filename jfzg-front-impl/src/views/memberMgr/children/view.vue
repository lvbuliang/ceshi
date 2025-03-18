<template>
  <div class="task-detail-page">
    <sr-nav-page
      :project="srNavPageObj"
      :type="2"
      v-if="srNavPageObj"
    ></sr-nav-page>
    <TestFormView :hideTrackIcon="true" :editableTabs="[]" :slotList="['基本信息', '成员管理']" activeNameT="成员管理">
      <ProjectBaseMessage slot="基本信息" :projectId="$route.query.projectId" style="margin-top: 16px;" />
      <newwenjian slot="成员管理" />
    </TestFormView>
    <sr-work-flow
      ref="work_flow"
      :hideFrom="true"
      :buttonList="buttonList"
      backName="memberMgr"
    ></sr-work-flow>
  </div>
</template>

<script>
import TestFormView from "@/components/srFormView.vue";
import ProjectBaseMessage from "@/components/projectBaseMessage";
import newwenjian from "../components/newwenjian.vue";
import { getDetailById } from "@/api/memberMgr/memberMgrList.js";
export default {
  components: {
    TestFormView,
    ProjectBaseMessage,
    newwenjian
  },
  data() {
    return {
      srNavPageObj: {
        projectName: "项目名称",
        projectCode: 123
      },
      editableTabs: [],
      buttonList: [
        {
          role: "",
          btns: [],
          nodes: []
        }
      ]
    };
  },
  computed: {
    projectId() {
      return this.$route.query.projectId;
    }
  },
  created() {
    // this.$store.getters.userInfo
    this.init();
  },
  methods: {
    async init() {
      let res = await getDetailById({ id: this.$route.query.projectId });
      if (res.data) {
        this.srNavPageObj.projectName = res.data.projectName
        this.srNavPageObj.projectCode = res.data.projectCode
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
