<template>
  <div class="search_head">
    <div class="search">
      <el-input v-model="params.proNameOrCode" placeholder="请输入关键字搜索"></el-input>
      <!-- <el-select class="approval_status" v-model="params.projecType" placeholder="项目类型">
        <el-option v-for="item in projectTypeArray" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select> -->
      <el-select class="approval_status" v-model="params.consBuid" placeholder="选择单位">
        <el-option v-for="item in unitArray" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-button size="small" type="primary" icon="base-iconfont icon-search" circle @click="search" name="搜索">
      </el-button>
      <el-button size="small" icon="base-iconfont icon-exchangerate" circle @click="refresh" name="重置"></el-button>
      <!-- <el-button size="small" icon="base-iconfont icon-export" circle>
            </el-button> -->
    </div>
    <div class="switch_box" @click="toWorkBench" v-if="checkCodeInArr('M001_010')">
      <i class="base-iconfont icon-qiehuan"></i>
      工作台模式
    </div>
  </div>
</template>

<script>
  import {
    listByTopicAndItem,
    getChengjianUnit,
    getChengjianUnits
  } from "@/api/standTable.js";
  import {
    checkCodeInArr
  } from "@/utils/utils.js";
  export default {
    computed: {
      tabsList() {
        return JSON.parse(sessionStorage.getItem("tabsList"));
      },
      currentPage() {
        return sessionStorage.getItem("CURRENT_PAGE");
      },
      permission_views() {
        // 工作台权限块列表
        return this.$store.getters.permission_views;
      }
    },
    data() {
      return {
        projectTypeArray: [],
        params: {
          proNameOrCode: null,
          projecType: null,
          consBuid: null,
        },
        unitArray: []
      };
    },
    mounted() {
      listByTopicAndItem({
        topic: "JFZG_XMKGL_TYPE"
      }).then((res) => {
        if (res.msg.code == "0000") {
          let list = res.data.map((item) => {
            return {
              label: item.chName,
              value: item.itemCode,
            };
          });
          this.projectTypeArray = list;
        }
      });
      getChengjianUnits([
        { buPropertyEnum: "JSDW" },
        { buPropertyEnum: "TCDW" },
      ]).then((res) => {
        let type_list = [];
        res.data.forEach((item) => {
          let emunObj = {};
          emunObj.label = item.buName;
          emunObj.value = item.buid;
          type_list.push(emunObj);
        });
        this.unitArray = type_list
      });
    },
    methods: {
      checkCodeInArr(code) {
        // 权限
        let arr = this.permission_views;
        return checkCodeInArr(code, arr);
      },
      search() {
        this.$emit("search", this.params);
      },
      refresh() {
        this.params = {
          proNameOrCode: null,
          projecType: null,
          consBuid: null,
        }
        this.$emit("search", {})
      },
      // 更新tab页签
      toWorkBench() {
        this.$router.push({
          name: "workBench"
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .search_head {
    margin-bottom: 8px;
    padding: 0 24px;
    display: flex;
    height: 40px;
    align-items: center;
    justify-content: space-between;

    .search {
      display: flex;

      .el-input {
        width: 240px;
        margin-right: 8px;
      }
    }

    .switch_box {
      width: 124px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      cursor: pointer;
      background: linear-gradient(270deg,
          #ffa922 0%,
          #ff7d22 100%,
          #ff7d22 100%);
      border-radius: 100px 32px 32px 100px;

      i {
        margin-right: 3px;
      }

      &:hover {
        background: linear-gradient(270deg, #FF7D22 0%, #FF7D22 0%, #FFA922 100%);
        box-shadow: -10px 2px 20px 0px rgba(255, 128, 34, 0.2);
      }
    }

    .approval_status {
      width: 112px;
      margin-right: 8px;
    }

    .el-button {
      padding: 7px;
    }

    .el-button+.el-button {
      margin-left: 8px;
    }
  }
</style>
