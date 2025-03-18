<template>
  <div class="intensificationList">
    <Title :obj="obj" name="cs_intensificationView" :query="{id:this.id}" />
    <div class="sum">相似文档{{page.total}}个</div>
    <Similarity v-for="(item,i) in arr" :key="i" :obj="item" name="cs_intensificationView" />
    <div class="sr_table_bottom">
      <div>
        <slot name="leftBottomSlot"></slot>
      </div>
      <div>
        <el-pagination
          class="pagination"
          v-if="page.total > (page.minSize || 10)"
          @size-change="handleSizeChange"
          @current-change="handleChange"
          :current-page="page.pageNum || 1"
          :layout="
                        page.layout || 'total, sizes, prev, pager, next, jumper'
                    "
          :total="page.total"
          :page-size="page.pageSize || 10"
          :page-sizes="page.pageSizes || [10, 20, 30]"
        ></el-pagination>
      </div>
    </div>
    <sr-work-flow
      ref="work_flow"
      :hideFrom="true"
      :buttonList="[{ role: '', btns: [],  nodes: []}]"
      :backName="$route.name.includes('Audit')? 'chusheAudit' : 'chushe'"
    ></sr-work-flow>
  </div>
</template>
<script>
import Title from "@/views/components/intensification/title.vue";
import Similarity from "@/views/components/intensification/similarity.vue";
import {
  api_projectPreliminary_detail,
  api_projectPreliminary_list,
} from "@/api/chushe";

export default {
  components: {
    Title,
    Similarity,
  },
  data() {
    return {
      id: this.$route.query.id, // 业务id
      arr: [],
      obj: {},
      page: {
        total: 0,
        pageSize: 5,
        pageSizes: [5, 10, 20, 30],
        pageNum: 1,
      },
    };
  },
  created() {
    this.init();
    this.initView();
  },
  methods: {
    async init() {
      let params = {
        busiId: this.id, //当前初设主键
        pageNum: this.page.pageNum, //当前页
        pageSize: this.page.pageSize, //每页条数
      };
      let res = await api_projectPreliminary_list(params);
      if (res.msg.code != "0000" || !res.data) return;
      this.$set(this, "arr", res.data.records);
      let page = {
        ...this.page,
        total: res.data.total,
        pageSize: res.data.size,
        pageNum: res.data.current,
      };
      this.$set(this, "page", page);
    },
    async initView() {
      let params = {
        id: this.id, //当前初设主键
      };
      let res = await api_projectPreliminary_detail(params);
      if (res.msg.code != "0000" || !res.data) return;
      this.$set(this, "obj", res.data);
    },
    // 分页大小
    handleSizeChange(size) {
      this.page.pageNum = 1;
      this.page.pageSize = size;
      this.init();
    },
    //页数发生改变
    handleChange(page) {
      this.page.pageNum = page;
      this.init();
    },
  },
};
</script>
<style lang="scss" scoped>
.intensificationList {
  .sum {
    padding-top: 23px;
    margin-bottom: 8px;
    height: 20px;
    font-size: 14px;
    color: #999999;
    line-height: 20px;
  }

  .sr_table_bottom {
    margin-top: 24px;
  }
}
</style>
