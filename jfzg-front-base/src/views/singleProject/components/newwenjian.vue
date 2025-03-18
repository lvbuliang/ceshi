<template>
  <div class="tabBtn">
    <div class="tabBtn-tabs" v-if="userType === 'CJDW'">
      <div
        class="title"
        :class="{ active: activeContabIndex == 'CJDW' }"
        @click="handleCheckconTab('CJDW')"
      >
        承建单位成员
      </div>
      <div class="line"></div>
      <div
        class="title"
        :class="{ active: activeContabIndex == 'JSDW' }"
        @click="handleCheckconTab('JSDW')"
      >
        建设单位成员
      </div>
      <div class="line"></div>
      <div
        class="title"
        :class="{ active: activeContabIndex == 'JLDW' }"
        @click="handleCheckconTab('JLDW')"
      >
        监理单位成员
      </div>
    </div>
    <div class="tabBtn-tabs" v-else-if="userType === 'JSDW'">
      <div
        class="title"
        :class="{ active: activeContabIndex == 'JSDW' }"
        @click="handleCheckconTab('JSDW')"
      >
        建设单位成员
      </div>
      <div class="line"></div>
      <div
        class="title"
        :class="{ active: activeContabIndex == 'CJDW' }"
        @click="handleCheckconTab('CJDW')"
      >
        承建单位成员
      </div>
      <div class="line"></div>
      <div
        class="title"
        :class="{ active: activeContabIndex == 'JLDW' }"
        @click="handleCheckconTab('JLDW')"
      >
        监理单位成员
      </div>
    </div>
    <div class="tabBtn-tabs" v-else-if="userType === 'JLDW'">
      <div
        class="title"
        :class="{ active: activeContabIndex == 'JLDW' }"
        @click="handleCheckconTab('JLDW')"
      >
        监理单位成员
      </div>
      <div class="line"></div>
      <div
        class="title"
        :class="{ active: activeContabIndex == 'CJDW' }"
        @click="handleCheckconTab('CJDW')"
      >
        承建单位成员
      </div>
      <div class="line"></div>
      <div
        class="title"
        :class="{ active: activeContabIndex == 'JSDW' }"
        @click="handleCheckconTab('JSDW')"
      >
        建设单位成员
      </div>
    </div>
    <div class="member_table_class">
      <div class="member_table_left">
        <div class="left">
          <span class="top">单位名称</span>
          <span class="content">{{ danwei ? danwei : "-" }}</span>
        </div>
        <div class="center">
          <span class="top">当前项目角色</span>
          <span class="content" style=""
            >项目负责人<i>({{ fzrData }})</i>
          </span>
          <span class="content bdNone" style=""
            >项目成员 <i>({{ MemberData }})</i>
          </span>
        </div>
        <div class="right">
          <span class="top">成员（{{ totalData }}）</span>
          <span class="content">
            <div
              class="avatar_class"
              v-for="(item, index) in Fzr_data"
              :key="index + 'name'"
            >
              <el-avatar name="key" :class="item.color">
                <span class="avatar">{{ item.firstname }}</span>
              </el-avatar>
              <div>
                <span class="avatar_class_name">{{
                  item.fullname ? item.fullname : "-"
                }}</span>
                <span class="avatar_class_mobile">{{
                  item.mobile ? item.mobile : "-"
                }}</span>
              </div>
            </div>
          </span>
          <span class="content bdNone">
            <draggable
              @change="log"
              :list="Member_data"
              :group="'comp'"
              style="display: flex"
              class="expendClass"
            >
              <div
                class="avatar_class"
                v-for="(item, index) in Member_data"
                @click="tabPosition === userType ? deleteBtn(item) : ''"
                :key="index + 'membername'"
              >
                <el-avatar name="key" :class="item.color">
                  <span class="avatar">{{ item.firstname }}</span>
                </el-avatar>
                <div>
                  <span class="avatar_class_name">{{
                    item.fullname ? item.fullname : "-"
                  }}</span>
                  <span class="avatar_class_mobile">{{
                    item.mobile ? item.mobile : "-"
                  }}</span>
                </div>
              </div>
            </draggable>
          </span>
        </div>
      </div>

      <div class="blankWhite"></div>
    </div>
  </div>
</template>
<script>
import draggable from "vuedraggable";
import {
  addMembersAjax,
  removeMembersAjax,
  queryByUnitType,
  getDetailById,
} from "@/api/memberMgr/memberMgrList.js";

export default {
  components: { draggable },
  data() {
    // 根据userInfo返回的角色不同显示顺序不同,不同单位的人权限不一样
    return {
      userType: "", // 登入用户类型
      userInfoType: {},
      constructionUnit: "", // 建设单位id
      contractUnit: "", // 承建单位id
      controlUnit: "", // 监理单位id
      tabPosition: "CJDW",
      totalData: 0,
      fzrData: 0,
      MemberData: 0,
      danwei: "",
      buid: 0,
      personnelList: [],
      Fzr_data: [],
      Member_data: [],
      activeContabIndex: "CJDW",
    };
  },
  computed: {
    userInfo() {
      return this.$store.getters.userInfo;
    },
  },
  watch: {
    tabPosition: {
      handler(val) {
        this.tabPosition = val;
        if (val === "CJDW") {
          this.danwei = this.userInfoType.contractUnitFullName;
          this.buid = Number(this.contractUnit);
        } else if (val === "JSDW") {
          this.danwei = this.userInfoType.constructUnitFullName;
          this.buid = Number(this.constructionUnit);
        } else if (val === "JLDW") {
          this.danwei = this.userInfoType.controlUnitFullName;
          this.buid = Number(this.controlUnit);
        }
        this.getmember();
      },
    },
  },
  props: {},
  methods: {
    // 初始化
    init() {
      this.getInfodata();
      this.getmember();
    },
    handleCheckconTab(index) {
      this.activeContabIndex = index;
      this.tabPosition = index;
    },
    // 处理用户信息
    handleMemberInfo() {
      let userInfo=JSON.parse(sessionStorage.getItem('userInfo'))
      console.log(this.userInfo,userInfo);
      let userType = userInfo.currentBizunit.buProperty;
      if (userType == "1" || userType == "2") {
        this.userType = "JSDW";
        this.tabPosition = "JSDW";
        this.activeContabIndex = "JSDW";
        this.danwei = this.userInfoType.constructUnitFullName;
        this.buid = this.userInfoType.constructUnit;
      } else if (userType == "3") {
        this.userType = "CJDW";
        this.tabPosition = "CJDW";
        this.activeContabIndex = "CJDW";
        this.danwei = this.userInfoType.contractUnitFullName;
        this.buid = this.userInfoType.contractUnit;
      } else if (userType == "4") {
        this.userType = "JLDW";
        this.tabPosition = "JLDW";
        this.activeContabIndex = "JLDW";
        this.danwei = this.userInfoType.controlUnitFullName;
        this.buid = this.userInfoType.controlUnit;
      }
    },
    /**
     * 删除成员
     */
    deleteBtn(item) {
      this.tabPosition === this.userType;
      var that = this;
      let title = "确认移除当前成员?";
      let info = "移除后您可重新从列表中添加";
      this.$SrUtils.showConfirmMessage.call(this, {
        title: "确认移除当前成员?",
        content: "移除后您可重新从列表中添加",
        okFun: () => {
          removeMembersAjax({
            projectId: this.$route.query.projectId, //项目id必填
            unitType: this.userType, //承建单位
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

    // 获取单位和 id
    getInfodata() {
      var that = this;
      getDetailById({ id: that.$route.query.projectId }).then((res) => {
        (that.constructionUnit = res.data.constructionUnit), // 建设单位id
          (that.contractUnit = res.data.contractUnit), // 承建单位id
          (that.controlUnit = res.data.controlUnit); // 监理单位id
        console.log(res);
        let obj = {
          contractUnitFullName: res.data.contractUnitFullName, // 承建单位
          constructUnitFullName: res.data.constructUnitFullName, // 建设单位
          controlUnitFullName: res.data.controlUnitFullName, // 监理单位
        };
        that.userInfoType = obj;
        this.handleMemberInfo();
      });
    },
    getmember() {
      var params = {
        projectId: this.$route.query.projectId,
        unitType: this.tabPosition,
      };
      queryByUnitType(params).then(({ data }) => {
        var Fzr_data = [];
        var Member_data = [];
        var { members, principals } = data[params.unitType] || [];
        if (principals && principals.length) {
          for (var i = 0; i < principals.length; i++) {
            let num = i + 1;
            if (num % 4 === 0) {
              num = 4;
            } else {
              num = num % 4;
            }
            var map = {
              firstname: principals[i].fullname.slice(0, 1),
              fullname: principals[i].fullname,
              mobile: principals[i].mobile,
              jfid: principals[i].jfid,
              color: "color_random_" + num,
            };
            Fzr_data.push(map);
          }
        }
        if (members && members.length) {
          for (var i = 0; i < members.length; i++) {
            let num = i + 1;
            if (num % 4 === 0) {
              num = 4;
            } else {
              num = num % 4;
            }
            var map = {
              firstname: members[i].fullname.slice(0, 1),
              fullname: members[i].fullname,
              mobile: members[i].mobile,
              jfid: members[i].jfid,
              color: "color_random_" + num,
            };
            Member_data.push(map);
          }
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
          projectId: this.$route.query.projectId, //项目id必填
          jfid: evt.added.element.jfid, //成员id
          fullname: evt.added.element.fullname,
          memberType: "CY",
          mobile: evt.added.element.mobile,
          unitType: this.userType,
        }).then((res) => {
          if (res.msg.code == "0000") {
            this.MemberData++;
            this.totalData++;
          } else {
            this.$message.error(res.msg);
          }
        }, evtdata);
      } else if (evt.removed) {
        // return false;
        removeMembersAjax({
          projectId: this.$route.query.projectId, //项目id必填
          // memberId: evt.removed.element.memberJfid || evt.removed.element.jfid, //成员id
          // roleId: this.roleId
          unitType: this.userType, //承建单位
          jfid: evt.removed.element.jfid || "", //成员id
        }).then((res) => {
          if (res.msg.code == "0000") {
            // this.getmember();
            this.MemberData--;
            this.totalData--;
          }
        });
      }
    },
  },
  created() {
    // this.$store.dispatch("app/getUserInfo");
    this.init();
  },
};
</script>
<style lang="scss" scoped>
i {
  font-size: 16px;
  margin-right: 6px;
}
.tabBtn-tabs {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 30px 0 12px 0;
  .title {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
    margin: 0 16px;
    cursor: pointer;
    &.active {
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
    }
  }
  .title:hover {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
  }
  .line {
    width: 1px;
    height: 14px;
    background: #cccccc;
  }
}
.member_table_class {
  display: flex;
  flex-direction: column;
  // min-height: 505px;
  position: relative;

  .member_table_add {
    margin-left: 8px;
    width: 302px;
    position: absolute;
    right: 0px;
  }
  .blankWhite {
    width: 100%;
    flex-grow: 1;
    // height: 200px;
  }
  .member_table_left {
    display: flex;
    min-width: 0;
    border-radius: 8px;
    flex-grow: 1;
    // width: 82%;
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
        text-align: left;
        border-bottom: 1px solid #efefef;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
      }
      .content {
        min-height: 160px;
        // justify-content: center;
        width: 100%;
        display: flex;
        align-items: center;
        height: 100%;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
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
        text-align: left;
        border-bottom: 1px solid #efefef;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
      }
      .content {
        min-height: 80px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        border-bottom: 1px solid #efefef;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        i {
          color: #999999;
        }
      }
      .bdNone {
        border-bottom: none;
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
      // display: flex;
      // border-right: 1px solid #efefef;
      flex-grow: 1;
      flex-flow: wrap;
      .top {
        display: flex;
        height: 40px;
        line-height: 40px;
        width: 100%;
        text-align: left;
        border-bottom: 1px solid #efefef;
        padding-left: 12px;
        padding-right: 12px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
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
      .bdNone {
        border-bottom: none;
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
      width: 180px;
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
