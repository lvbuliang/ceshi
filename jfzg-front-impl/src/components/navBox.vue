<template>
  <div>
    <sr-nav-page :type="2" :project="srNavPageObj"></sr-nav-page>
  </div>
</template>

<script>
import { getDetailById } from "@/api/projectLibrary/index.js";
export default {
  data () {
    return {
      srNavPageObj:{ name: "", code: "" },
    }
  },
  mounted () {
    this.getProjectData()
  },
  methods: {
    getProjectData() {
      getDetailById({ id: this.$route.query.projectId }).then((res) => {
        if (res.msg.code == "0000") {
          this.srNavPageObj = {
            projectName: res.data.projectName,
            projectCode: res.data.projectCode,
          };
        }
      });
    },
  }
};
</script>

<style></style>
