<template>
  <div class="subProjectInfo">
    <jqTitle :info="jqTitle"></jqTitle>
    <div class="subBg">
      <!-- 项目列表 -->
      <template>
        <!-- <div class="classBox">
          <div class="sc">选择项目所属行业：</div>
          <div class="scbox">
            <span
              :class="{ active: active == -1 }"
              @click="searchIndustry('', -1)"
              >全部行业</span
            >
            <span
              :class="{ active: active == i }"
              v-for="(item, i) in industryNoList"
              @click="searchIndustry(item.dataValue, i)"
              >{{ item.dataName }}</span
            >
          </div>
        </div>-->
        <div class="scResult">
          <!-- 查询和切换 -->
          <template>
            <div class="scNumber">
              当前项目数量：
              <span class="font-color-operation-btn" v-if="totaldata>0">{{totaldata}}</span>个
            </div>
            <div class="scPage" v-if="searchPage.config.total>4">
              <el-pagination
                small
                :hide-on-single-page="true"
                layout="prev, pager, next, jumper"
                :page-size="searchPage.config.pageSize"
                :current-page="searchPage.config.pageNum"
                @current-change="changePage"
                :total="searchPage.config.total"
              ></el-pagination>
            </div>
          </template>
          <!--项目列表-->
        </div>
        <!--项目列表-->
        <template>
          <div class="projectBox">
            <el-row :gutter="20">
              <el-col :lg="{ span: '4-8' }" v-for="(item, i) in searchPage.data" :key="i + ''">
                <div
                  class="ph"
                  :class="{ active: proActive == i }"
                  @click="changeSubProject(item.id, i)"
                >
                  <div class="mark">
                    <span v-if="item.father">主项目</span>
                    <span v-else>子项目</span>
                    <span v-if="item.isTrial == 1">试点项目</span>
                  </div>
                  <div class="name">{{ item.projectName }}</div>
                  <div class="mark2" v-if="proActive == i">
                    <svg-icon icon-class="icon-biaoshi1" />
                  </div>
                  <div class="mark2" v-else>
                    <svg-icon icon-class="icon-biaoshi2" />
                  </div>
                </div>
              </el-col>
            </el-row>
            <basic-info
              style="background: #fff"
              :showToggle="false"
              :projectId="newSonProjectId"
              :type="2"
            />
          </div>
        </template>
      </template>
    </div>
  </div>
</template>
<script>
import jqTitle from "./jqTitle";
import { dataList } from "./data";
import { getSonPro } from "@/api/progress";

export default {
  components: { jqTitle },
  mixins: [dataList],
  computed: {
    industryNoList() {
      return this.$getDict("INDUSTRY_DIRECTION"); //行动方向
    },
  },
  props: {
    mainPro: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      newSonProjectId: this.$route.query.id,
      totaldata: 0,
      active: -1,
      proActive: 0,
      jqTitle: {
        title: "主/子项目情况",
        subTitle: "",
        showtip: false,
      },
      searchPage: {
        data: [],
        config: {
          pageSize: 4,
          pageNum: 1,
          total: 1,
        },
      },
    };
  },

  methods: {
    /**查询行业类型 */
    searchIndustry(val, i) {
      this.active = i;
      console.log(val);
    },
    //分页
    changePage(val) {
      this.queryList(val);
    },
    //获取主项目对应的子项目
    queryList(pageNum) {
      var getparams = {
        page: pageNum,
        size: 4,
        projectId: this.$route.query.id,
      };
      getSonPro(getparams).then((res) => {
        var newlist = [];
        newlist.push(this.mainPro);
        var listlength = (res.data.list || []).length || 0;
        this.totaldata = res.data.total + 1; //子项目数量+父项目
        for (var i = 0; i < listlength; i++) {
          var map = {
            id: res.data.list[i].projectId,
            projectName: res.data.list[i].projectName,
          };
          newlist.push(map);
        }
        this.$set(this.searchPage, "data", newlist);
      });
    },

    /**子项目切换 */
    changeSubProject(id, index) {
      this.newSonProjectId = id;
      this.$emit("changenewSonProjectId", id);
      this.proActive = index;
    },
  },
  created() {
    this.queryList(1);
  },
};
</script>
<style lang="scss" scoped>
.subProjectInfo {
  .subBg {
    background: #f0f7ff;
    margin: 0 -20px;
    padding: 0 25px;
  }
  /**行动方向 */
  .classBox {
    display: flex;
    font-size: 12px;
    padding: 25px 0;
    border-bottom: 1px dashed #cbddeb;
    .sc {
      width: 130px;
      margin-right: 10px;
      line-height: 30px;
    }
    .scbox {
      span {
        display: inline-block;
        padding: 8px 16px;
        margin-right: 10px;
        color: #666;
        margin-top: 5px;
        cursor: pointer;
      }
      span.active {
        background: #007aff;
        color: #fff;
        border-radius: 6px;
      }
      span:hover {
        background: #007aff;
        color: #fff;
        border-radius: 6px;
      }
    }
  }
  .scResult {
    padding: 24px 0;
    display: flex;
    .scNumber {
      flex-grow: 1;
      font-size: 12px;
      line-height: 26px;
      color: #999;
    }
    .scPage {
      font-size: 14px;

      ::v-deep .el-pager li {
        background: transparent;
      }
      ::v-deep .el-pagination .btn-prev,
      ::v-deep .el-pagination .btn-next {
        background: transparent;
      }
    }
  }
  .projectBox {
    padding-bottom: 28px;
    .ph {
      position: relative;
      padding: 20px;
      background: #fff;
      cursor: pointer;
      box-sizing: border-box;
      .mark {
        font-size: 12px;
        span {
          display: inline-block;
          width: 60px;
          height: 22px;
          line-height: 22px;
          border-radius: 2px;
          text-align: center;
          &:nth-of-type(1) {
            color: #00b5ff;
            background: #d8f3ff;
          }
          &:nth-of-type(2) {
            color: #ff6600;
            margin-left: 10px;
            background: #ffeee3;
          }
        }
      }
      .name {
        margin: 14px 0 0;
        font-size: 16px;
        height: 48px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;

        line-height: 24px;
        font-weight: bold;
      }
      .mark2 {
        position: absolute;
        top: 0;
        right: 0;
      }
      &:hover {
        border-radius: 4px;
        border: 1px solid #007aff;
        box-sizing: border-box;
      }
    }
    .ph.active {
      border-radius: 6px;
      border: 1px solid #007aff;
    }

    ::v-deep.el-col-lg-4-8 {
      width: 20%;
    }
  }
}
</style>
<style lang="scss">
/**子项目详情 */
.subProjectInfo {
  .basicInfo {
    background: #fff;
    margin: 24px 0 0;
    .basic_content {
      padding-top: 0;
    }

    .basic_info {
      border: 1px solid #fff;
    }
    .basic_head {
      background: #fff;
      border: 1px solid #fff;
    }
    .basicInfo .basic_content .basic_ul li .labelName {
      color: #999;
    }
  }
}
</style>