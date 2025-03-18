<template>
  <div class="fwnlZu">
    <!-- <FFieldset title="服务能力" class="mgt30 zjtcBox1">
      <div slot="content">
        <DList
          type="fwnl"
          :table="fwnlTable"
          @pageSize="pagefwSize"
          @refres="refres"
          @sizeChange="sizefwChange"
        ></DList>
      </div>
    </FFieldset> -->
    <FFieldset title="建设经验推广" class="mgt30 zjtcBox1">
      <div slot="content">
        <DList
          type="fwnl"
          :table="jsTable"
          @pageSize="pagejsSize"
          @refres="refres"
          @sizeChange="sizejsChange"
        ></DList>
      </div>
    </FFieldset>
  </div>
</template>

<script>
import FFieldset from "./FHeader/FFieldset.vue";
import DList from "./dList";
import { serverListInfo } from '@/api/progress'
export default {
  components: {
    FFieldset,
    DList
  },
  props: {
    single: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  computed: {
    themeName() {
      return sessionStorage.getItem("themeName");
    },
  },
  data() {
    return {
      id: "",
      fwnlTable: {
        data: [],
        showBtn: false,
        type: "fwnl",
        id: "",
        page: {
          pageSize: 4,
          pageNum: 1,
          total: 0,
          num:4,
          pageSizes:[4,8,16]
        }
      },
      jsTable: {
        data: [],
        type: "jsjy",
        showBtn: false,
        id: "",
        page: {
          pageSize: 4,
          pageNum: 1,
          total: 0,
          num:4,
          pageSizes:[4,8,16]
        }
      }
    };
  },
  methods: {
    //获取服务列表
    queryFwList(page) {
      let params = {
        pageNum: page,
        pageSize: this.fwnlTable.page.pageSize,
        projectId: this.id,
        trainType: 2
      };
      this.single.Interface(params).then(res => {
        this.$set(this.fwnlTable, "data", res.data.records);
        this.$set(this.fwnlTable, "id", this.id);
        this.$set(this.fwnlTable.page, "total", res.data.total);
        this.$set(this.fwnlTable.page, "pages", res.data.pages);
      });
    },

    //建设经验
    // queryJsList(page) {
    //   let params = {
    //     pageNum: page,
    //     pageSize: this.jsTable.page.pageSize,
    //     projectId: this.id||'',
    //     trainType: 1
    //     // type:2
    //   };
    //   this.single.Interface(params).then(res => {
    //     console.log('建设经验',this.jsTable)
    //     this.$set(this.jsTable, "data", res.data.records);
    //     this.$set(this.jsTable, "id", this.id);
    //     this.$set(this.jsTable.page, "total", res.data.total);
    //     this.$set(this.jsTable.page, "pages", res.data.pages);
    //   });
    // },
    queryJsList(page){
      let params = {
        "pageNum":page,
        "pageSize": this.jsTable.page.pageSize,
        "type": 2
      }
      serverListInfo(params).then(res => {
        if(res.msg.code == '0000'){
          this.$set(this.jsTable, "data", res.data.records);
          this.$set(this.jsTable, "id", this.id);
          this.$set(this.jsTable.page, "total", res.data.total);
          this.$set(this.jsTable.page, "pages", res.data.pages);
        }
      })
    },

    // pagefwSize(page) {
    //   this.queryFwList(page);
    // },
    pagejsSize(page) {
      this.queryJsList(page);
    },
    // sizefwChange(data) {
    //   this.fwnlTable.page.pageSize = data;
    //   this.queryFwList(1);
    // },
    sizejsChange(data) {
      this.jsTable.page.pageSize = data;
      this.queryJsList(1);
    },
    refres() {
      this.queryJsList(1);
      // this.queryFwList(1);
    }
  },
  created() {
    if (this.$route.query.id) {
      this.id = this.$route.query.id;
    }

    this.queryJsList(1);
    // this.queryFwList(1);
    if (this.single.type == 2) {
      this.$set(this.fwnlTable, "showBtn", true);
      this.$set(this.jsTable, "showBtn", true);
    }
  }
};
</script>
<style lang="scss">
.zjtcBox1{
  .inner{
    height: auto !important;
    background: #fff;
  }
}
</style>
