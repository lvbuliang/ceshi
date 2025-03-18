<template>
  <div>
    <div class="mobileBox">
      <div class="top">
        <div class="left_m_add">可选成员 ({{allmemberData}})</div>
        <div class="search">
          
          <el-input placeholder="请输入成员姓名"
            suffix-icon="el-icon-search"
            v-model="name"
            size="small"
            @input="valChange"></el-input>
        </div>
      </div>
      <div class="center">
        <draggable class="dragArea list-group userbox"
          :list="userList"
          :group="'comp'"
          @change="log">
          <div class="phtop"
            v-for="(item,i) in userList"
            :key="i">
            <el-avatar name='key' :class='item.color'> <span class='avatar'>{{item.firstname}}</span> </el-avatar>
            <div class="flexInfo">
              <div>
                <span class="name">{{item.fullname}}</span>
                <span class="flexWidth">
                  {{item.mobile}}
                </span>
              </div>
            </div>
          </div>
        </draggable>
      </div>
    </div>

  </div>
</template>
<script>
import draggable from "vuedraggable";
import { queryUnitMembersBy } from "@/api/bianzhi/index.js";
import { SendInvitation, SendInvitation2 } from "@/api/shishi/implement.js";
export default {
  components: {
    draggable
  },
  props: {
    buid: {
      type: Number
    },
    personnelList: {
      type: Array,
      default () {
        return [];
      }
    },
    personnelList2: {
      type: Array,
      default () {
        return [];
      }
    },
    flag: {
      type: Boolean,
      default () {
        return null;
      }
    }
  },
  data () {
    return {
      allmemberData:0,
      name: "",
      userList: [],
      userLists: [],
    };
  },
  methods: {
    log (evt) { },
    getMembers () {
      queryUnitMembersBy({ buid: this.buid  }).then(
        ({ success, data }) => {
          let memberInfoList = [];
          if (this.personnelList.length ||this.personnelList2.length) {
            data.forEach(item => {
              let isInclude = this.personnelList.some(
                i => (item.jfid || item.memberJfid) == (i.jfid || i.memberJfid)
              );
              let isInclude2 = this.personnelList2.some(
                i => (item.jfid || item.memberJfid) == (i.jfid || i.memberJfid)
              );
              if (!isInclude &&!isInclude2) {
                memberInfoList.push(item);
              }
            });
          } else {
            memberInfoList = data;
          }
          memberInfoList.forEach(item => {
              item.firstname =  item.fullname.slice(0,1),
              item.color  = 'color_random_'+this.randomNum(1,4,2)
            });
          this.$set(this, "userList", memberInfoList);
          this.$set(this, "userLists", memberInfoList);
          this.allmemberData = memberInfoList.length;
        }
      );
    },
    randomNum(min,max,type){
        type = type || 1;
        min = Math.ceil(min);
        max = Math.floor(max);
        switch(type){
            case 1: //得到一个两数之间的随机整数,这个值不小于min（如果min不是整数的话，得到一个向上取整的 min），并且小于（但不等于）max  [min,max)
                return Math.floor(Math.random() * (max - min)) + min;
            case 2: //得到一个两数之间的随机整数，包括两个数在内,这个值比min大（如果min不是整数，那就不小于比min大的整数），但小于（但不等于）max [min,max]
                return Math.floor(Math.random() * (max - min + 1)) + min;
            case 3: //得到一个两数之间的随机整数， (min,max)
                return Math.floor(Math.random() * (max - min-1)) + min+1;
        }
    },
    valChange (val) {
      if (val) {
        this.userList = [];
        this.userLists.forEach(element => {
          if (element.fullname.indexOf(val) != -1) {
            this.userList.push(element);
          }
        });
      } else {
        this.userList = this.userLists;
      }
    },
    show () {
      this.dialogVisible = true;
    },
  },
  watch: {
    personnelList (value) {
      this.getMembers();
    },
    flag (value) {
      this.getMembers();
    }
  },
  created () {
    //阻止火狐默认拖拽打开链接

    document.body.ondrop = function (event) {
      event.preventDefault();
      event.stopPropagation();
    };
    this.getMembers();
  }
};
</script>
<style lang="scss" scoped>
.mobileBox {
  position: relative;
  // margin: 30px 0px 10px 10px;
  background: #fff;
  box-sizing: border-box;
  border-radius: 4px;
  border: 1px solid #efefef;
  .el-button--primary {
    width: 100%;
  }
  .top {
    display: flex;
    flex-wrap: wrap;
    height: 64px;
    padding: 16px;
    border-bottom: 1px solid #EEEEEE;
    .left_m_add{
      width: 99px;
      height: 32px;
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      line-height: 32px;
    }
    .title {
      font-size: 17px;
    }
    .search {
      width: 160px;
      margin-left: 9px;
    }
    img {
      vertical-align: middle;
    }
  }
  .center {
    height: 439px;
    width: 100%;
    .ctitle {
      position: absolute;
      top: 0;
      padding: 13px 0 4px 16px;
    }
    .userbox {
      position: absolute;
      padding-bottom:80px;
      width:100%;
      padding: 16px;
      padding-top: 0px;
      height: 442px;
      overflow: auto;
      overflow-x: hidden;
    }
    .phtop {
      position: relative;
      width:100%;
      height: 71px;
      border-bottom: 1px dashed #EEEEEE;
      .name {
        position: absolute;
        top: 18px;
        left: 52px;
        width: 100px;
      }
      .flexWidth {
        position: absolute;
        left: 52px;
        width: 100px;
        top: 40px;
      }
    }
    .color_random_1{
      background: linear-gradient(270deg, #F0C35D 0%, #F8A61C 100%);
      position: absolute;
      left: 0;
      top: 22px;
      width:36px;
      height:36px
    }
    .color_random_2{
      background: linear-gradient(45deg, #3678FE 0%, #73B6FF 100%);
      position: absolute;
      left: 0;
      top: 22px;
      width:36px;
      height:36px
    }
    .color_random_3{
      background: linear-gradient(90deg, #F9455A 0%, #FC9959 100%);
      position: absolute;
      left: 0;
      top: 22px;
      width:36px;
      height:36px
    }
    .color_random_4{
      background: linear-gradient(270deg, #81DAFF 0%, #27C0FF 100%);
      position: absolute;
      left: 0;
      top: 22px;
      width:36px;
      height:36px
    }
  }
  .bottom {
    position: absolute;
    bottom: 0;
    text-align: center;
    cursor: pointer;
    padding: 20px;
    width: 100%;
    background: #fff;
  }
}
.common-dialog {
  p {
    padding: 0 10px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    background: rgba(230, 247, 255, 1);
    border-radius: 2px;
    border: 1px solid rgba(186, 231, 255, 1);
  }
  .dialog-footer {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
<style lang="scss">
</style>