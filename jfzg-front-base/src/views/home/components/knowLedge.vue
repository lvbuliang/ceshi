<template>
  <div class="Knowledge">
    <!-- 顶部标题 -->
    <div class="ledge-title">
      <span class="ledge-sub-title">知识库</span>
      <span>更多 <i class="el-icon-arrow-right"></i></span>
    </div>
    <div style="height: calc(100% - 10px)">
      <el-tabs v-model="activeName2" @tab-click="handleClick">
        <el-tab-pane label="公司制度(19)" name="first1">
          <div v-for="item in 3">
            <div class="pane-item">
              <div style="width: 100%">
                <span class="pane-item-title"></span>

                <span class="pane-item-text"
                  >[公司制度]明确公司的价值和文化，塑造公司良好形象和人文关怀，加强...</span
                >
                <p class="item-sub-text">2024-06-18 18:31:21</p>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <!-- 行业规范 -->
        <el-tab-pane label="行业规范(10)" name="second2">
          <div v-for="item in 3">
            <div class="pane-item">
              <div style="width: 100%">
                <span class="pane-item-title"></span>

                <span class="pane-item-text"
                  >[公司制度]明确公司的价值和文化，塑造公司良好形象和人文关怀，加强...</span
                >
                <p class="item-sub-text">2024-06-18 18:31:21</p>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="交付物模板(10)" name="third3">
          <div v-for="item in 3">
            <div class="pane-item">
              <div style="width: 100%">
                <span class="pane-item-title"></span>

                <span class="pane-item-text"
                  >[公司制度]明确公司的价值和文化，塑造公司良好形象和人文关怀，加强...</span
                >
                <p class="item-sub-text">2024-06-18 18:31:21</p>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  name: "knowLedge",
  data() {
    return {
      activeName2: "first1",
    };
  },
  methods: {
    handleClick() {},
  },
};
</script>

<style lang="scss" scoped>
.Knowledge {
  width: 100%;
  background: rgb(255, 255, 255);
  height: calc(36% - 16px);
  // flex: 1;
  padding: 16px 20px;
  // margin-top: 16px;
  // margin-bottom: 16px;
  border-radius: 10px;

  .ledge-title {
    display: flex;
    justify-content: space-between;

    .ledge-sub-title {
      height: 22px;
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 0px;
      line-height: 22px;
      color: rgba(29, 33, 41, 1);
      text-align: left;
      vertical-align: top;
    }
  }

  .pane-item {
    width: 100%;
    height: 50px;
    /* background-color: rebeccapurple; */
    background-color: rgb(255, 255, 255);
    padding: 0px 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 0px;

    /* border-bottom: 1px solid gray; */
    .pane-item-title {
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      margin-right: 5px;
      margin-bottom: 8px;
      background: rgba(255, 141, 26, 1);
    }

    .pane-item-text {
      display: inline-block;
      // width: 80%;
      width: calc(100% - 12px);
      font-weight: 500;
      color: rgba(29, 33, 41, 1);
      font-size: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: pointer;
    }

    .item-sub-text {
      line-height: 12px;
      margin-left: 12px;
      color: gray;
      cursor: pointer;
    }
  }
}
</style>
