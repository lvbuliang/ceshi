<template>
  <div class="dlistBox">
    <div class="btnFwnlBox" v-if="table.showBtn">
      <el-button type="primary" size="small" @click="add">新建</el-button>
    </div>
    <div class="fwnlBoxList">
      <div class="fwnlBox" v-for="(item,i) in table.data" :key="i">
        <div class="titleJ">{{item.topic}}</div>
        <div class="titleB">
          <span class="time">{{item.pubTime}}</span>
          <span @click="showNoticeDetail(item)" class="see">
            查看详情
            <i class="el-icon-arrow-right"></i>
          </span>
        </div>
      </div>
    </div>
    <PreviewDialog :obj="obj" ref="previewDialog" />
    <pagination
      :page="table.page"
      class="rg"
      @currentChange="currentChange"
      @sizeChange="sizeChange"
    ></pagination>
  </div>
</template>
<script>
import PreviewDialog from "./previewDialog.vue";
import pagination from "./FPagination/pagination";

import demoQuillEditor from "./quill-editor";
import { saveConstructionexperience } from "@/api/progress";
export default {
  components: { pagination, demoQuillEditor, PreviewDialog },
  props: {
    table: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      obj: {
        id: "",
        read: "1",
      },
      title: "新增",
      dialogVisible: false,
      isSee: true,
      id: "",
      buildList: [],
      form: {
        config: [
          {
            type: "text",
            name: "标题",
            placeholder: "标题",
            bind: "title",
            required: "必填",
            disabled: true,
            trigger: "blur", // 校验时机
            col: 24,
          },
        ],
        data: {
          title: "", //标题
          content: "", //内容
          projectId: this.table.id,
          trainType: 1, //类型  1-建设经验推广 2-服务能力
        },

        enums: {},
        rules: {},
      },
    };
  },
  mounted() {
    // this.getBuildData()
  },
  methods: {
    /**服务能力和建设经验推广是同一个接口，至少传参不一样 */
    // 获取建设经验推广数据
    // getBuildData(){
    //   let params = {
    //     "pageNum": 1,
    //     "pageSize": 4,
    //     "type": 2
    //   }
    //   serverListInfo(params).then(res => {
    //     if(res.msg.code == '0000'){
    //       this.table.data = res.data.records
    //     }
    //   })
    // },

    /**
     * 当前页
     */
    currentChange(data) {
      //刷新列表数据
      this.$emit("pageSize", data);
    },
    sizeChange(data) {
      this.$emit("sizeChange", data);
    },

    /**
     * 设置富文本值
     */
    setData() {},
    /**
     * 获取富文本值
     */
    getData() {
      let content = this.$refs.demoQuillEditor.content;
      return content;
    },

    /**
     * 提交
     */
    submitInfo() {
      this.$refs["modelAuInfo"].validate((valid) => {
        if (valid) {
          var data = this.form.data;
          data.content = this.getData();
          data.projectId = this.table.id;
          if (this.table.type == "fwnl") {
            data.trainType = 2;
          } else {
            data.trainType = 1;
          }
          saveConstructionexperience(data).then((res) => {
            this.dialogVisible = false;
            this.$emit("refres");
            this.$router.push({
              name: "tcdetail",
              query: {
                id: this.$route.query.id,
              },
            });
          });
        }
      });
    },

    /**
     * 查看详情
     */
    showNoticeDetail(item) {
      this.obj.id = item.id + "";
      this.$refs["previewDialog"].open();
    },
    see(item) {
      this.$router.push({
        name: "article",
        query: {
          id: item.id,
        },
      });
    },
    /**
     * 新增
     */
    add() {
      this.$router.push({
        name: "addSList",
        query: {
          id: this.table.id,
        },
      });
      this.$router.push({
        name: "addSList",
        query: {
          id: this.table.id,
          type: this.table.type,
        },
      });
    },
  },
  created() {
    // console.log(this.table.id);
  },
};
</script>
<style lang="scss" scoped>
$border-focus-color: #007aff;
.fwnlBoxList {
  display: flex;
  flex-wrap: wrap;
  margin: 10px 10px 0px 10px;
}
//服务能力
.fwnlBox {
  flex: 0 0 49%;
  margin-left: 10px;
  margin-bottom: 10px;
  background: #fff;
  padding: 24px 40px;
  box-sizing: border-box;
  border: 1px solid #efefef;
  border-radius: 4px;
  .titleB {
    display: flex;
  }
  .time {
    flex-grow: 1;
    display: inline-block;
    color: #333;
    margin-right: 20px;
  }
  .titleJ {
    flex-grow: 1;
    color: #333;
    line-height: 24px;
    min-height: 56px;
    font-size: 16px;
    margin-bottom: 10px;
    font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box; /* 将对象作为弹性伸缩盒子模型显示 */
    -webkit-line-clamp: 2; /* 控制最多显示几行 */
    -webkit-box-orient: vertical; /* 设置或检索伸缩盒对象的子元素的排列方式 */
  }
  .see {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #007aff;
    display: inline-block;
    text-align: right;
    cursor: pointer;
  }
}
.fwnlBox:hover {
  border: 1px solid $border-focus-color;
  box-sizing: border-box;
}
.rg {
  margin-bottom: 20px;
}
.btnFwnlBox {
  padding: 0px 20px;
  text-align: right;
  justify-content: left;
  .el-button {
    padding: 0;
    width: 130px;
    font-size: 14px;
    height: 40px;
  }
}
</style>
<style lang="scss">
.dlistBox .table-components {
  margin-top: 0;
}
.dlistBox .el-dialog__header {
  background: rgba(237, 243, 252, 1);
  height: 58px;
  line-height: 32px;
  border-bottom: 1px solid #eee;
}
.dlistBox .el-dialog__title {
  color: #333;
  font-size: 14px;
  font-weight: bold;
}

.dlistBox .el-dialog__footer {
  text-align: center;
}
</style>