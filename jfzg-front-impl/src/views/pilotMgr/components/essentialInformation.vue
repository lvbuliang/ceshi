<template>
  <div class="essentialInformation">
    <BorderLine :title="'基本信息'" :isLine="true">
      <projectBaseMessage
        class="projectBaseMessage"
        :projectId="projectId"
        @projectInit="projectInit"
      />
    </BorderLine>
    <BorderLine :title="'成员信息'" :isLine="true">
      <ImplementationPlan ref="ImplementationPlan" />
    </BorderLine>
  </div>
</template>

<script>
import projectBaseMessage from "@/components/projectBaseMessage.vue";
import ImplementationPlan from "./ImplementationPlan.vue";
import BorderLine from "@/components/borderLine";
export default {
  name: "essentialInformation",
  props: {
    projectId: [Number, String],
  },
  components: {
    projectBaseMessage,
    ImplementationPlan,
    BorderLine,
  },
  data() {
    return {
      formData: {},
    };
  },
  mounted() {},
  methods: {
    projectInit(obj) {
      this.$refs["ImplementationPlan"].init("17001", obj);
      this.$emit("projectInit", obj);
    },
  },
};
</script>

<style>
.essentialInformation {
  margin-top: 16px;
}
</style>
