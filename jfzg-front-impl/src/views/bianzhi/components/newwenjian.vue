<template>
  <div class="">
    <div class="title">项目成员登记</div>
    <el-radio-group v-model="tabPosition" style="margin: 16px 0;"
      text-color="#1890FF"
      fill="#F7F7F7">
      <el-radio-button label="CJDW"
          ><i class="base-iconfont icon-machinery"></i>承建单位</el-radio-button
        >
        
    </el-radio-group>

    <div v-if="tabPosition == 'CJDW'" class="member_table_class">
      <div
        class="member_table_left"
        :style="{
          width: $route.name === 'bianzhiInitiateDetail' ? 'calc(100% - 308px);' : '100%',
        }"
      >
        <div class="left">
          <span class="top">单位名称</span>
          <span class="content">{{ danwei }}</span>
        </div>
        <div class="center">
          <span class="top">当前项目角色</span>
          <span class="content" style="height:80px"
            >项目负责人({{ fzrData }})</span
          >
          <span class="content" style="flex:1;border-bottom: 0px;">项目成员({{ MemberData }})</span>
        </div>
        <div class="right">
          <span class="top">成员（{{ totalData }}）</span>
          <el-popover
            placement="top-start"
            width="320"
            trigger="hover"
            content="从右侧成员列表中拖拽任意成员至下方角色栏中"
          >
            <i
              class="sr-icon-prompt-fill top_i"
              slot="reference"
              v-if="$route.name === 'bianzhiInitiateDetail'"
            ></i>
          </el-popover>
          <span class="content"
            ><div
              class="avatar_class"
              v-for="(item, index) in Fzr_data"
              :key="index + 'name'"
            >
              <el-avatar name="key" :class="item.color">
                <span class="avatar">{{ item.firstname }}</span>
              </el-avatar>
              <div>
                <span class="avatar_class_name">{{ item.fullname }}</span>
                <span class="avatar_class_mobile">{{ item.mobile }}</span>
              </div>
            </div></span
          >
          <span class="content" style="border-bottom: 0px;border-right: 0px;">
            <draggable
              @change="log"
              :list="Member_data"
              :group="'comp'"
              style="display:flex"
              class="expendClass"
            >
              <div
                class="avatar_class"
                v-for="(item, index) in Member_data"
                @click="deleteBtn(item)"
                :key="index + 'membername'"
              >
                <el-avatar name="key" :class="item.color">
                  <span class="avatar">{{ item.firstname }}</span>
                </el-avatar>
                <div>
                  <img
                    :src="deletePng"
                    class="deletePng"
                    v-if="$route.name === 'bianzhiInitiateDetail'"
                  />
                  <span class="avatar_class_name">{{ item.fullname }}</span>
                  <span class="avatar_class_mobile">{{ item.mobile }}</span>
                </div>
              </div>
              <div
                v-if="$route.name === 'bianzhiInitiateDetail'"
                class="avatar_class"
                key="membername"
              >
                <el-avatar
                  name="key"
                  class="membernamecolor"
                  :src="addmemberPng"
                >
                </el-avatar>
                <div>
                  <span class="avatar_class_name"></span>
                  <span class="avatar_class_mobile"></span>
                </div>
              </div>
            </draggable>
          </span>
        </div>
      </div>

      <div
        class="member_table_add"
        v-if="$route.name == 'bianzhiInitiateDetail'"
      >
        <selectUser :personnelList="Member_data" :personnelList2="Fzr_data" :buid="CJDWbuid"  v-if='CJDWbuid'></selectUser>
      </div>
    </div>
  </div>
</template>
<script>
import draggable from "vuedraggable";
import selectUser from "./selectUser";
import { addMembersAjax, removeMembersAjax } from "@/api/bianzhi/index.js";
import { queryByUnitType, getDetailById } from "@/api/bianzhi/index.js";
import addmemberPng from "@/assets/shishi/addmember.png";
import deletePng from "@/assets/shishi/delete.png";
export default {
  components: { selectUser, draggable },
  data() {
    // 根据userInfo返回的角色不同显示顺序不同,不同单位的人权限不一样
    return {
      tabPosition: "CJDW",
      totalData: 0,
      fzrData: 0,
      MemberData: 0,
      personnelList: [],
      Fzr_data: [],
      Member_data: [],
      addmemberPng: addmemberPng,
      deletePng: deletePng,
    };
  },
  watch: {
    tabPosition: {
      handler(val) {},
    },
  },
  props: {
    CJDWbuid: {
      type: Number,
    },
    danwei: {
      type: String,
    },
  },
  methods: {
    /**
     * 删除成员
     */
    deleteBtn(item) {
      if (this.$route.name != "bianzhiInitiateDetail") {
        return false;
      }
      var that = this;
      let title = "确认移除当前成员?";
      let info = "移除后您可重新从列表中添加";
      this.$SrUtils.showConfirmMessage.call(this, {
        title: "确认移除当前成员?",
        content: "移除后您可重新从列表中添加",
        okFun: () => {
          removeMembersAjax({
            projectId: this.$route.query.id, //项目id必填
            unitType: "CJDW", //承建单位
            jfid: item.jfid, //成员id
          }).then((res) => {
            if (res.msg.message == "SUCCESS") {
              var index = 0;
              var Member_data = this.Member_data;
              for (var i = 0; i < Member_data.length; i++) {
                if (Member_data[i].jfid == item.jfid) {
                  index = i;
                  break;
                }
              }
              this.Member_data.splice(index, 1);
              this.MemberData--;
              this.totalData--;
            }
          }, item);
        },
        cancelFun: () => {
          return false;
        },
      });
    },
    randomNum(min, max, type) {
      type = type || 1;
      min = Math.ceil(min);
      max = Math.floor(max);
      switch (type) {
        case 1: //得到一个两数之间的随机整数,这个值不小于min（如果min不是整数的话，得到一个向上取整的 min），并且小于（但不等于）max  [min,max)
          return Math.floor(Math.random() * (max - min)) + min;
        case 2: //得到一个两数之间的随机整数，包括两个数在内,这个值比min大（如果min不是整数，那就不小于比min大的整数），但小于（但不等于）max [min,max]
          return Math.floor(Math.random() * (max - min + 1)) + min;
        case 3: //得到一个两数之间的随机整数， (min,max)
          return Math.floor(Math.random() * (max - min - 1)) + min + 1;
      }
    },
    getmember() {
      var params = {
        projectId: this.$route.query.id,
        unitType: "CJDW",
      };
      queryByUnitType(params).then(({ success, data }) => {
        var { members = [], principals = [] } = data[params.unitType] || {};
        var Fzr_data = [];
        var Member_data = [];
        for (var i = 0; i < principals.length; i++) {
          var map = {
            firstname: principals[i].fullname.slice(0, 1),
            fullname: principals[i].fullname,
            mobile: principals[i].mobile,
            jfid: principals[i].jfid,
            color: "color_random_" + this.randomNum(1, 4, 2),
          };
          Fzr_data.push(map);
        }
        for (var i = 0; i < members.length; i++) {
          var map = {
            firstname: members[i].fullname.slice(0, 1),
            fullname: members[i].fullname,
            mobile: members[i].mobile,
            jfid: members[i].jfid,
            color: "color_random_" + this.randomNum(1, 4, 2),
          };
          Member_data.push(map);
        }
        this.Fzr_data = Fzr_data;
        this.Member_data = Member_data;
        this.fzrData = Fzr_data.length;
        this.MemberData = Member_data.length;
        this.totalData = Fzr_data.length + Member_data.length;
      }, params);
    },
    /**
     * 拖拽
     */
    log(evt) {
      if (evt.added) {
        evt.added.element.fullName = evt.added.element.fullname;
        var evtdata = evt.added.element;
        /**调用新增接口 */
        addMembersAjax({
          projectId: this.$route.query.id, //项目id必填
          bulidId: this.CJDWbuid, //承建单位 id,
          jfid: evt.added.element.jfid, //成员id
          fullname: evt.added.element.fullname,
          memberType: "CY",
          mobile: evt.added.element.mobile,
          unitType: "CJDW",
        }).then((res) => {
          if (res.msg.code == "0000") {
            this.MemberData++;
            this.totalData++;
          } else {
            this.$message.error(res.msg);
          }
        }, evtdata);
      } else if (evt.removed) {
        removeMembersAjax({
            projectId: this.$route.query.id, //项目id必填
            unitType: "CJDW", //承建单位
            jfid: evt.removed.element.jfid, //成员id
          }).then((res) => {
            if (res.msg.message == "SUCCESS") {
              var index = 0;
              var Member_data = this.Member_data;
              for (var i = 0; i < Member_data.length; i++) {
                if (Member_data[i].jfid == item.jfid) {
                  index = i;
                  break;
                }
              }
              this.Member_data.splice(index, 1);
              this.MemberData--;
              this.totalData--;
            }
          });
      }
    },
  },
  created() {
    this.getmember();
  },
};
</script>
<style lang="scss" scoped>
i {
  font-size: 16px;
  margin-right: 6px;
}
.title{
  height: 22px;
  font-size: 14px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #333333;
  line-height: 22px;
}
.member_table_class {
  display: flex;
  position: relative;
  .member_table_add {
    margin-left: 8px;
    width: 302px;
    position: absolute;
    right: 0px;
  }
  .member_table_left {
    display: flex;
    min-width: 0;
    // flex:1;
    width: calc(100% - 308px);
    min-height: 200px;
    border: 1px solid #efefef;
    .left {
      display: flex;
      border-right: 1px solid #efefef;
      width: 133px;
      flex-flow: column;
      .top {
        height: 40px;
        width: 133px;
        line-height: 40px;
        text-align: center;
        border-bottom: 1px solid #efefef;
      }

      .content {
        min-height: 160px;
        justify-content: center;
        width: 100%;
        display: flex;
        align-items: center;
        height: 100%;
      }
      span {
        padding-left: 12px;
        padding-right: 12px;
        font-size: 14px;
        font-weight: 400;
        color: #333333;
        line-height: 22px;
      }
    }
    .center {
      display: flex;
      border-right: 1px solid #efefef;
      width: 153px;
      flex-flow: column;
      .top {
        height: 40px;
        width: 153px;
        line-height: 40px;
        text-align: center;
        border-bottom: 1px solid #efefef;
      }
      .content {
        min-height: 80px;
        width: 153px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-bottom: 1px solid #efefef;
      }
      span {
        padding-left: 12px;
        padding-right: 12px;
        font-size: 14px;
        font-weight: 400;
        color: #333333;
        line-height: 22px;
      }
    }
    .right {
      display: flex;
      // border-right: 1px solid #efefef;
      border-right: 0px;
      flex-grow: 1;
      flex-flow: wrap;
      position: relative;
      .top {
        height: 40px;
        line-height: 40px;
        width: 100%;
        text-align: left;
        border-bottom: 1px solid #efefef;
        padding-left: 12px;
        padding-right: 12px;
        font-size: 14px;
        font-weight: 400;
        color: #333333;
      }
      .top_i {
        position: absolute;
        right: 12px;
        top: 12px;
        color: #cccccc;
      }
      .content {
        min-height: 80px;
        flex-wrap: wrap;
        width: 100%;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #efefef;

        padding-left: 12px;
        padding-right: 12px;
        font-size: 14px;
        font-weight: 400;
        color: #333333;
        line-height: 22px;
      }
      .avatar {
        width: 16px;
        height: 22px;
        font-size: 16px;
        font-weight: 400;
        color: #ffffff;
        line-height: 22px;
      }
    }
  }
  .color_random_1 {
    background: linear-gradient(270deg, #f0c35d 0%, #f8a61c 100%);
    position: absolute;
    left: 0;
    top: 22px;
    width: 36px;
    height: 36px;
  }
  .color_random_2 {
    background: linear-gradient(45deg, #3678fe 0%, #73b6ff 100%);
    position: absolute;
    left: 0;
    top: 22px;
    width: 36px;
    height: 36px;
  }
  .color_random_3 {
    background: linear-gradient(90deg, #f9455a 0%, #fc9959 100%);
    position: absolute;
    left: 0;
    top: 22px;
    width: 36px;
    height: 36px;
  }
  .color_random_4 {
    background: linear-gradient(270deg, #81daff 0%, #27c0ff 100%);
    position: absolute;
    left: 0;
    top: 22px;
    width: 36px;
    height: 36px;
  }
  .membernamecolor {
    position: absolute;
    left: 0;
    top: 22px;
  }
  .expendClass {
    flex-direction: row;
    flex-wrap: wrap;
    height: 100%;
    width: 100%;
  }
  .avatar_class:hover .deletePng {
    display: inline-block;
  }
  .avatar_class {
    position: relative;
    cursor: pointer;
    width: 152px;
    height: 80px;
    // margin-right: 24px;
    .deletePng {
      position: absolute;
      top: 47px;
      left: 26px;
      width: 14px;
      height: 14px;
      display: none;
    }
    .avatar_class_name {
      position: absolute;
      left: 47px;
      top: 22px;
      height: 18px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 18px;
    }
    .avatar_class_mobile {
      position: absolute;
      top: 42px;
      left: 44px;
      width: 84px;
      height: 18px;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 18px;
      text-align: center;
    }
  }
  // .avatar_class:first-child{
  //   margin-left: 0px;
  // }
}
</style>
