<template>
  <div class="deliverable">
    <!-- <DeliverList :onlyShow="true" /> -->
   <Deliverable ref="Deliverable"
       :deliverysList="activeDeliverList"
       :onlyShow="true" 
    />
  </div>
</template>
<script>
// import DeliverList from "@/views/deliver/children/view";
import Deliverable from "@/views/deliver/components/deliverableList";
import { api_getDeliveryListByStageId } from "@/api/deliver/index";

export default {
  components: { Deliverable },
  watch: {},
  props: {},
  computed: {},
  data() {
    return {
      activeDeliverList: []
    };
  },
  methods: {
    getDeliveryListByStageId() {
      let param = {
        projectId: this.$route.query.projectId,  // 项目Id
        stageId: this.$route.query.stageId  // 里程碑Id
      }
      api_getDeliveryListByStageId(param).then((res) => {
        console.log('api_getDeliveryListByStageId',res)
        if (res && res.success) {
          this.activeDeliverList = res.data
          if (this.activeDeliverList && this.activeDeliverList.length>0) {
            this.activeDeliverList.forEach((a) => {
              if (a.deliveryFiles.length > 0)
              {
                // 交付物下有附件的默认展开
                a.deliveryFiles.forEach((b) => {
                  let fileContext
                  try{
                    fileContext = JSON.parse(b.fileContext)
                    if (fileContext) {
                      b.fileName = fileContext.name;
                      if (fileContext.size) {
                        b.fileSize = (Number(fileContext.size) / 1024).toFixed(2) + "KB";
                      }
                      b.fileId = fileContext.id;
                    }
                  } catch(e) {
                    fileContext = b
                    if (fileContext) {
                      if (fileContext.size) {
                        b.fileSize = (Number(fileContext.size) / 1024).toFixed(2) + "KB";
                      }
                      b.fileId = fileContext.id;
                    }
                  }
                });
              }
            });
          }
        }
      })
    }
  },
  mounted() {
    this.getDeliveryListByStageId()
  },
};
</script>
<style lang="scss" scoped>
.deliverable {
  padding-top: 16px;
}
</style>
