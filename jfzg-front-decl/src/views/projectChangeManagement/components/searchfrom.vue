<template>
  <div class="search-from">
    <div>
      <el-form
        size="small"
        :inline="true"
        :model="search.formData"
        class="demo-form-inline"
        ref="searchForm"
      >
        <el-form-item>
          <el-input
            @clear="clearFunc('systemName')"
            clearable
            v-model="search.formData.systemName"
            placeholder="系统名称"
            @blur="inputAntSelectBlur"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            @clear="clearFunc('projectName')"
            clearable
            v-model="search.formData.projectName"
            placeholder="项目名称"
            @blur="inputAntSelectBlur"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="search.formData.status"
            clearable
            placeholder="选择状态"
            @clear="clearFunc('status')"
            @change="inputAntSelectBlur"
          >
            <el-option
              v-for="item in search.enum.statusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="search.formData.tjPerson"
            clearable
            placeholder="发起人"
            @clear="clearFunc('tjPerson')"
            @change="inputAntSelectBlur"
          >
            <el-option
              v-for="item in search.enum.customerManager"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            class="circle-btn"
            icon="el-icon-search"
            type="primary"
            circle
            @click="searchFn"
          ></el-button>
        </el-form-item>

        <el-form-item>
          <el-button
            class="circle-btn"
            icon="el-icon-refresh"
            circle
            @click="resetForm"
          ></el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="searchPage">
      <div
        class="search_btn1"
        v-if="this.userInfo.currentRole.roleCode == 'CJDW_XMJL'"
      >
        <el-button class="search_btn" @click="add" type="primary">
          新增变更
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import store from "@/store";
export default {
  props: {
    search: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      userInfo: store.getters.userInfo,
    };
  },
  methods: {
    resetForm() {
      this.$emit("child-event");
    },
    searchFn() {
      this.$emit("child-searchFn");
    },
    add() {
      this.$emit("child-add");
    },
  },
};
</script>
<style>
.search-from {
  display: flex;
  justify-content: space-between;
}
.circle-btn {
  border-radius: 50% !important;
}
.search_btn {
  height: 40px;
  border-radius: 13px !important;
}
</style>
