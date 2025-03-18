<template>
  <div class="Task">
    <TaskList :hideSearchBtn="true" />
  </div>
</template>

<script>
import TaskList from "@/views/task/children/taskList.vue";
export default {
  components: {
    TaskList,
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.Task {
  margin-top: 16px;
}
</style>
