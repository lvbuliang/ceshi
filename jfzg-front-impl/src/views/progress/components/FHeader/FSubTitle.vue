<template>
  <div class="FSubTitle">
    <span class="subtitle">{{title}}</span>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  props: {
    title: {
      type: String
    }
  },
  created(){
  }
};
</script>

<style style="scss" scoped>
.subtitle {
  color: #333;
  font-size: 15px;
  font-weight: bold;
  display: inline-block;
  margin-bottom: 30px;
}
.subtitle:before {
  content: "";
  display: inline-block;
  width: 4px;
  height: 4px;
  background-color: #4c6dd1;
  vertical-align: middle;
  margin-right: 7px;
  border-radius: 4px;
}
</style>