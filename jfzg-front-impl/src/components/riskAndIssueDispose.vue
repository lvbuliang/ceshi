<template>
  <div class="dispose"
       v-if="List && List.length > 0">
    <BorderLine title="改进措施">
      <span slot="titleAfter">
        (已改进:
        <span style="color: #1890ff">{{ finish }}</span> 未完成:
        <span style="color: #ff0019">{{ undone }}</span> )
      </span>

      <div class="contentBox">
        <div class="box"
             v-for="(item, index) in List"
             :key="item.id">
          <div class="contentTitle">
            <div class="titleBox">
              <span class="num">{{ index + 1 }}</span>
              <span class="template">{{ item.remark }}</span>
              <span class="duty">措施责任人：{{ item.liablerName }}</span>
              <!-- reeor-fill    success-fill -->
              <span class="status"
                    :class="item.statusName == '未完成' ? 'reeor' : 'success'">
                <i v-if="item.statusName == '未完成'"
                   class="base-iconfont icon-reeor-fill"></i>
                <i v-if="item.statusName == '已处理'"
                   class="base-iconfont icon-success-fill"></i>
                {{ item.statusName }}
              </span>
            </div>
            <el-button type="primary"
                       size="small"
                       v-if="item.statusName == '未完成' && !isShow &&projectProblemOperationVo.canSubmit"
                       round
                       @click="submit(item)">完成并提交</el-button>
          </div>
          <div class="contentText"
               v-if="(item.replyList && item.replyList.length > 0) || (item.statusName == '未完成' && !isShow)">
            <div v-if="item.replyList && item.replyList.length > 0">
              <div class="replyItem"
                   v-for="(item1, index1) in item.replyList"
                   :key="index1">
                <el-avatar> {{ item1.replyName != '' ? item1.replyName.slice(-1):'U' }} </el-avatar>
                <div class="textBox">
                  <div class="contentTextTitle">
                    <span class="name">{{ item1.replyName }}</span>
                    <span class="timeBox">{{ item1.replyTime }}</span>
                  </div>
                  <div class="text" :class="'lastText'">{{ item1.content }}</div>
                </div>
              </div>
            </div>
            <div class="footer"
                 v-if="item.statusName == '未完成' && !isShow">
              <el-input v-model.trim="input[index]"
                        placeholder="请输入内容" clearable></el-input>
              <el-button v-if="projectProblemOperationVo.canReply"
                         size="small"
                         round
                         :type="getBtnType(index)"
                         :disabled="getBtnType(index) == 'default'"
                         @click="reply(item, index)">回复</el-button>
            </div>
          </div>
        </div>
      </div>
    </BorderLine>
  </div>
</template>

<script>
import BorderLine from "@/components/borderLine";

export default {
  components: {
    BorderLine,
  },
  props: {
    dataList: {
      type: Array,
      default () {
        return [];
      },
    },
    isShow: Boolean, // 是否是查看模式，默认输入模式
    //问题按钮显示
    projectProblemOperationVo: {
      type: Object,
      default () {
        return {
          canSubmit: true,
          canReply: true
        }
      }
    }
  },
  watch: {
    dataList: {
      handler: function (params) {
        if (params?.length > 0)
        {
          this.input = [];
          this.List = params.map((item) => {
            item.content = "";
            return item;
          });
          this.setCount();
        }
      },
      deep: true,
      immediate: true,
    },
    projectProblemOperationVo: {
      handler: function (params) {
        console.log(params);
      },
      deep: true,
      immediate: true,
    }
  },
  data () {
    return {
      input: [],
      List: [],
      finish: 0,
      undone: 0,
    };
  },
  methods: {
    getBtnType(index) {
      if (this.input[index] != undefined && this.input[index] != '') {
        return 'primary'
      }
      return 'default'
    },
    setCount () {
      this.finish = 0;
      this.undone = 0;
      this.List.forEach((item) => {
        if (item.statusName == "未完成")
        {
          ++this.undone;
        } else if (item.statusName == "已处理")
        {
          ++this.finish;
        }
      });
    },
    reply (item, index) {
      if (this.input[index] == undefined || this.input[index] == '') return
      item.content = this.input[index];
      this.$emit("reply", item);
    },
    submit (item) {
      this.$emit("submit", item);
    },
  },
};
</script>

<style lang="scss" scoped>
.dispose {
  .title {
    font-size: 14px;
    font-weight: 500;
    color: #333333;
    line-height: 22px;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    img {
      width: 22px;
      height: 22px;
      margin-right: 6px;
    }
  }
  .contentBox {
    .box {
      margin-bottom: 20px;
      &:last-child {
        margin-bottom: 0;
      }
    }
    ::v-deep .contentTitle {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
      .titleBox {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        .num {
          width: 14px;
          height: 14px;
          border-radius: 100%;
          color: #fff;
          background: #1890ff;
          line-height: 14px;
          font-size: 10px;
          display: block;
          margin-right: 5px;
          text-align: center;
        }
        .template {
          margin-right: 17px;
        }
        .duty {
          color: #666;
          margin-right: 18px;
        }
        .status {
          i {
            font-size: 16px;
          }
        }
        .success {
          color: #1890ff;
        }
        .reeor {
          color: #f5222d;
        }
      }
      .el-button {
        font-size: 14px;
      }
    }
  }
  .contentText {
    background: #fafafa;
    border-radius: 8px;
    padding: 12px;
    .replyItem{
      display: flex;
      &::v-deep{
        .el-avatar {
          background-color: #9CC1E3;
          width: 24px;
          height: 24px;
          line-height: 24px;
        }
      }
      .textBox {
        padding-left: 8px;
        margin-bottom: 17px;
        flex: 1;
        .contentTextTitle {
          margin-bottom: 5px;
        }
        .name {
          color: #333;
          margin-right: 8px;
        }
        .timeBox {
          color: #999;
        }
        .text {
          font-size: 14px;
          font-weight: 400;
          color: #666666;
          line-height: 22px;
          padding-bottom: 7px;
          border-bottom: 1px dashed #E8E8E8;
          word-break: break-all;
					word-wrap: break-word;
        }
        .lastText {
          border: none;
        }
      }
    }
    .footer {
      display: flex;
      align-items: center;
      .el-input {
        margin-right: 8px;
      }
      &::v-deep {
        .el-button.is-disabled,
        .el-button.is-disabled:focus,
        .el-button.is-disabled:hover {
          color: #FFFFFF;
          cursor: not-allowed;
          background-image: none;
          background-color: #CCCCCC;;
          border-color: #CCCCCC;;
        }
      }
    }
  }
}
</style>
