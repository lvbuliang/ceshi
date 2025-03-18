<template>
  <div class="tabCardBox">
    <draggable
      :list="cardData"
      :group="roleCode == 'CJDW_CY' ? 'comp' : ''"
      @change="log"
      style="display:flex"
      class="expendClass"
    >
      <div class="cardList" v-for="(item, i) in cardData" :key="i">
        <div class="imgAdv">
          <img :src="cardImg" class="cardImg" alt />
          <img
            :src="deleteImg"
            alt
            class="delete"
            v-if="showEdit"
            @click="deleteBtn(item)"
          />
        </div>
        <div class="cardC">
          <span>{{ item.fullName || item.nickname || item.fullname }}</span>
          <img :src="phone" alt class="phone" />
          <span class="phNumber">{{ item.mobile }}</span>
        </div>
      </div>
      <div class="cardList cardList2" v-if="showEdit" @click="addMember">
        <div>
          <div class="imgAdv">
            <img :src="addImg" alt />
          </div>
          <p class="add">待添加成员</p>
        </div>
      </div>
    </draggable>

    <table-dialog
      ref="tableDialog"
      :tableCol="tableCol"
      :search-col="searchCol"
      :other-config="otherConfig"
      @selectBc="selectBc"
      :buid="buid"
      :ids="this.ids"
    ></table-dialog>
  </div>
</template>
<script>
import tableDialog from "./tableDialog.vue";
import draggable from "vuedraggable";
import { getMembersListAjax } from "@/api/shishi/taskList";
import { addMembersAjax, removeMembersAjax } from "@/api/bianzhi/index.js";
export default {
  components: {
    tableDialog,
    draggable,
  },
  props: {
    cardData: {
      type: Array,
      default() {
        return [];
      },
    },
    buid: {
      type: Number,
    },
    roleId: {
      type: Number,
    },
    showExpend: {
      type: Boolean,
      default() {
        return false;
      },
    },
    showEdit: {
      type: Boolean,
      default() {
        return true;
      },
    },
    roleCode: {
      type: String,
    },
    index: {
      type: Number,
    },
    dataList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      id: "",
      cardImg: require("@/assets/shishi/touxiang_1.png"),
      deleteImg: require("@/assets/shishi/delete.png"),
      addImg: require("@/assets/shishi/add.png"),
      phone: require("@/assets/shishi/icon-phone.png"),
      ids: [],
      otherConfig: {
        // 其他配置项
        title: "添加成员", // 弹框标题,
        getDataList: getMembersListAjax, // 接口
        multiple: false, // 是否多选
        noSelect: false, // 不显示选择框
        showBottom: true, // 显示底部确认按钮
        noPage: false, // 没有分页
        defaultParams: {
          // 默认参数
          a: "",
        },
        selectInfo: {
          // 用户选择的信息
          label: "选择成员",
          value: "",
        },
      },
      tableCol: [
        {
          name: "姓名",
          prop: "fullname",
        },
        {
          name: "手机号",
          prop: "mobile",
        },
        {
          name: "登录时间",
          prop: "lastLoginTime",
        },
      ],
      searchCol: [
        // 搜索条件
        {
          type: "text",
          name: "成员",
          placeholder: "请输入成员",
          bind: "cityPlanName",
        },
      ],
    };
  },
  methods: {
    /**
     * 删除成员
     */
    deleteBtn(item) {
      var that = this;
      let title = "确认移除当前成员?";
      let info = "移除后您可重新从列表中添加";
      this.$SrUtils.showConfirmMessage.call(this, {
        title: "确认移除当前成员?",
        content: "移除后您可重新从列表中添加",
        okFun: () => {
          removeMembersAjax({
            projectId: 100, //项目id必填
            unitType: "CJDW", //承建单位
            jfid: item.memberJfid || item.jfid, //成员id
          }).then((res) => {
            if (res.msg.message == "SUCCESS") {
              debugger;
              that.cardData.splice(that.cardData.indexOf(item), 1);
            }
          });
        },
        cancelFun: () => {
          return false;
        },
      });
    },
    /**
     * 添加手动成员
     */
    addMember() {
      this.field = "";
      let ids = [];
      this.dataList.forEach((item) => {
        ids = [...ids, ...item.cardData];
      });
      this.$refs.tableDialog.init(ids);
    },
    /**
     * 多选成员
     */
    selectBc(data) {
      data.forEach((element) => {
        addMembersAjax({
          projectId: 100, //项目id必填
          bulidId: 2186, //承建单位 id,
          jfid: element.jfid, //成员id
          fullname: element.fullname,
          memberType: "CY",
          mobile: element.mobile,
          unitType: "CJDW",
        }).then((res) => {
          if (res.msg.code == "0000") {
            this.cardData.push(element);
          } else {
            // this.$message({
            //   message: "成员已存在，请勿重复添加",
            //   type: "warning",
            //   showClose: true,
            //   duration: 2000
            // });
          }
        });
      });
    },
    /**
     * 拖拽
     */
    log(evt) {
      if (evt.added) {
        evt.added.element.fullName = evt.added.element.fullname;
        /**调用新增接口 */
        addMembersAjax({
          projectId: 100, //项目id必填
          bulidId: 2186, //承建单位 id,
          jfid: evt.added.element.jfid, //成员id
          fullname: evt.added.element.fullname,
          memberType: "CY",
          mobile: evt.added.element.mobile,
          unitType: "CJDW",
        }).then((res) => {
          if (res.msg.code == "0000") {
            debugger;
            let item = {
              isEdit: true,
              isExpend: false,
            };
            this.$emit("finish", item);
          } else {
            // this.$message({
            //   message: "成员已存在，请勿重复添加",
            //   type: "warning",
            //   showClose: true,
            //   duration: 2000
            // });
          }
        });
      } else if (evt.removed) {
        removeMembersAjax({
          projectId: this.$route.query.id, //项目id必填
          bulidId: Number(this.buid), //承建单位 id,
          memberId: evt.removed.element.memberJfid || evt.removed.element.jfid, //成员id
          roleId: this.roleId,
        }).then((res) => {
          if (res.msg.message == "SUCCESS") {
            // that.cardData.splice(that.cardData.indexOf(item), 1);
          }
        });
      }
    },
  },
  created() {
    console.log(this.roleCode);
    /**
     * 样式调整：mode=='edit'模式下：3n  margin-right:0,   mode=='view'模式下，4n margin-right:0
     */
    this.id = this.$route.query.id;
    this.buid = this.$props.buid;
  },
};
</script>
<style lang="scss" scoped>
.tabCardBox {
  padding: 20px 20px 0 20px;
  display: flex;
  // position: relative;
  width: 100%;
}
.cardList2 {
  background: rgba(246, 249, 253, 1);
  width: 220px;
  height: 132px;
  cursor: pointer;
}
.cardList3:nth-of-type(3n) {
  margin-right: 0;
}
.cardImg {
  width: 40px;
}
.cardList {
  width: 220px;
  padding: 15px;
  // float: left;
  margin-right: 10px;
  margin-bottom: 20px;
  text-align: center;
  border-radius: 20px;
  border: 1px solid rgba(200, 219, 233, 1);
  background: #fafafa;
  .add {
    margin-top: 10px;
    color: #555;
    font-size: 13px;
  }
  .imgAdv {
    position: relative;
    margin-top: 15px;
    .delete {
      position: absolute;
      top: 30px;
      left: 100px;
      width: 14px;
      height: 14px;
      cursor: pointer;
    }
  }
  .cardC {
    margin-top: 8px;
    color: #333;
    span:nth-child(1) {
      font-weight: 500;
    }
    .phone {
      width: 17px;
      height: 16px;
      margin-left: 10px;
      vertical-align: middle;
    }
    .phNumber {
      font-size: 12px;
    }
  }
  .time {
    font-size: 10px;
    margin-top: 10px;
    color: #b8b8b8;
  }
}
.expendClass {
  flex-direction: row;
  flex-wrap: wrap;
  height: 100%;
  width: 100%;
}
</style>
