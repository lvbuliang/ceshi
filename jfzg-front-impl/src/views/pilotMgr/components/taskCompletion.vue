<template>
  <div class="task-list-page">
    <taskList :hideSearchBtn="true" />
  </div>
</template>

<script>
import taskList from "@/views/task/children/taskList.vue";
export default {
  components: {
    taskList,
  },
};
</script>
<style lang="scss" scoped></style>
