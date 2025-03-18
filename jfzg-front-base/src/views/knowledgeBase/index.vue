<template>
  <div class="knowledgeBase">
    <header>
      <div class="title">
        <img src="@/assets/images/zhishiku/zhishiku_title.png" alt="" />
        <span>知识库</span>
      </div>
      <div class="search">
        <input type="text" v-model="str" />
        <button @click="search">搜索</button>
      </div>
    </header>
    <main>
      <List :listData="listData" :total="total"></List>
      <Empty v-if="!listData.length"></Empty>
      <el-pagination
        v-else
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="size"
        layout="sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </main>
  </div>
</template>

<script>
import Empty from "./empty";
import List from "./list";
import { querylist } from "@/api/knowledgeBase/index";
import store from "@/store";

export default {
  components: {
    Empty,
    List,
  },
  // props: {
  //   keyword: [String]
  // },
  data() {
    return {
      str: "",
      total: 0,
      listData: [],
      page: 1,
      size: 10,
    };
  },
  computed: {
    keyword() {
      return store.getters.knowledgeBaseKeyword;
    },
  },
  watch: {
    keyword: {
      handler(v) {
        this.str = v;
        this.search();
      },
      immediate: true,
    },
  },
  created() {
    // this.search();
  },
  methods: {
    search() {
      const params = { keyword: this.str, page: this.page, size: this.size };
      querylist(params).then((res) => {
        if (res && res.msg && res.msg.code == "0000") {
          this.listData = res.data.hits.map((item) => {
            let num = this.setRandomNumber(5, 1);
            item.tagList = this.setRandomNumber(20, num[0]);
            return  item
          });
          this.total = res.data.total;
          this.$store.commit("app/SET_KEYWORD", this.str);
        }
      });
    },
    setRandomNumber(maxNum, maxLength) {
      var arr2 = new Array();
      for (var k = 0; k < maxLength; k++) {
        var id = Math.ceil(Math.random() * maxNum);
        if (arr2.indexOf(id) === -1) {
          arr2.push(id);
        } else {
          k = k - 1;
          continue;
        }
      }
      return arr2;
    },
    handleSizeChange(e) {
      this.size = e;
      this.search();
    },
    handleCurrentChange(e) {
      this.page = e;
      this.search();
    },
  },
};
</script>

<style lang="scss" scoped>
.knowledgeBase {
  main {
    overflow: hidden;
    .empty {
      margin-top: 73px;
    }
    ::v-deep {
      .el-pagination {
        float: right;
        margin: 24px 0;
        .el-pagination__editor.el-input {
          width: 60px;
          margin: 0 6px;
        }
        .el-input__inner {
          border-radius: 3px !important;
        }
        .el-pager {
          font-weight: 400;
          > li {
            color: #666666;
          }
          .active {
            color: #1890ff;
          }
        }
      }
    }
  }
  header {
    .title {
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        width: 32px;
        margin-right: 8px;
      }
      span {
        font-size: 36px;
        font-weight: 500;
        color: #333333;
      }
    }
    .search {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 30px;
      input {
        width: 460px;
        height: 40px;
        background: #ffffff;
        border-radius: 8px 0px 0px 8px;
        border: 1px solid #cccccc;
        padding-left: 8px;
        font-size: 14px;
      }
      button {
        width: 100px;
        height: 40px;
        background: #1890ff;
        border-radius: 0px 8px 8px 0px;
        color: #ffffff;
        border: none;
        cursor: pointer;
      }
    }
  }
}
</style>
