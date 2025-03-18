<template>
  <iframe id="iframe" class="iframe" :src="src"></iframe>
</template>
<script>
import config from "@/settings.js";

export default {
  computed: {
    id() {
      return this.$route.query.id;
    },
  },
  data() {
    return {
      src: "",
    };
  },
  mounted() {
    console.log('config>>>', config)
    this.src = `${config.baseUrl}/opadmin/modeler/modeler.html?modelId=${this.id}`;
  },
};
</script>
<style>
.iframe {
  width: 100%;
  height: 800px;
  border: 0;
  overflow: hidden;
}
</style>
