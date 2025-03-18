<template>
  <!-- 循环次数 -->
  <!--建设单位负责人,建设单位经办人-->
  <!--承建单位负责人,承建单位项目经理，承建单位成员-->
  <!--监理单位负责人，监理单位负责人-->
  <div>
    <div class="boxTabCard"
      v-for="(item,i) in dataList"
      :key="i">
      <div class="tabCardTitle">
        <img :src="tsImg"
          alt />
        <div class="tabCenter">{{item.name}}</div>
        <div class="tabTopRight">
          <span>
            当前
            <i>{{item.num}}</i> 个人
          </span>
          <!-- 出现在编辑模式下 ,但是不同时出现-->
          <template v-if="mode=='edit'">
            <span class="t"
              v-if="item.isEdit==false &&item.noEdit"
              @click="edit(item)">编辑</span>
            <span class="t blue"
              v-else-if="item.isEdit"
              @click="finish(item)">完成</span>
          </template>

          <!-- 出现在查看模式下 展开出现的条件：》3 -->
          <template v-if="mode=='view'">
            <span class="t"
              v-if="item.num>4&&!item.isExpend"
              @click="open(item)">展开</span>
            <span class="t"
              v-else-if="item.num>4&&item.isExpend"
              @click="putAway(item)">收起</span>
          </template>
        </div>
      </div>
      <div :class="item.isExpend?'tabCardBox':'tabCardBox hidTabCard'">
        <!--循环-->
        <tabList :cardData="item.cardData"
          :showExpend="item.isExpend"
          :showEdit="item.isEdit"
          :buid="buid"
          :roleId="roleId"
          :roleCode="item.roleCode"
          :index="i"
          :dataList="dataList"
          @getInfoLists="getInfoLists"
          @changeNum="changeNum"
          @finish="finish"></tabList>
      </div>
    </div>
  </div>
</template>
<script>
import tabList from "./cardList";

import { getbuRoles } from "@/api/shishi/implement";
export default {
  components: { tabList },
  props: {
    mode: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      default: ""
    },
    memberdatas: {
      type: Object
    },
    buid: {
      type: Number
    }
  },
  data () {
    return {
      tsImg: require("@/assets/shishi/icon-bar.png"),
      dataList: [],
      roleId: 0,
      num: 0,
    };
  },
  methods: {
    getInfoLists () {
      this.dataList = [];
      setTimeout(() => {
        this.$emit("getInfodata");
        this.getbuInfo();
      }, 1000);
    },
    changeNum (i, num) {
      this.dataList[i].num = num;
    },
    getbuInfo (str) {
      this.dataList = [];
      var that = this;
      
      var res = {"data":[
        {"roleCode":"CJDW_FZR","roleName":"承建单位/负责人","remark":"承建单位/负责人"},
        {"roleCode":"CJDW_CY","roleName":"承建单位/成员","remark":"承建单位/成员"}]}
        var map = {};
        for (var i = 0; i < res.data.length; i++) {
            map = {
              name: res.data[i].roleName,
              roleCode: res.data[i].roleCode,
              isExpend: true,
              isEdit: false,
              noEdit: false,
              num: this.memberdatas[res.data[i].roleCode]
                ? this.memberdatas[res.data[i].roleCode].length
                : 0,
              cardData: this.memberdatas[res.data[i].roleCode] || []
            };
            if (map.roleCode == "CJDW_CY") {
              map.noEdit = true;
              if (str) {
                map.isEdit = !map.isEdit;
                map.isExpend = !item.isExpend;
              }
            }
            this.dataList.push(map);

          
        }
        let flag = 0;
        this.dataList.forEach(element => {
          flag += element.cardData.length;
        });
        this.$emit("sum", flag);
        this.$emit("dataList", this.dataList);
    },

    setColum () {
      if (this.type == "jsdw") {
        // this.num = 2;
      } else if (this.type == "cjdw") {
        // this.num = 3;
      } else if (this.type == "jldw") {
        // this.num = 4;
      }
    },
    /**
     * 展开
     */
    open (item) {
      item.isExpend =true;
    },
    /**
     * 收起
     */
    putAway (item) {
      item.isExpend = false;
    },
    /**
      编辑,点击编辑，列表第三个margin-right:0
     */
    edit (item) {
      item.isEdit = !item.isEdit;
    },
    /**
     * 完成编辑
     */
    finish (item) {
      item.isEdit = !item.isEdit;
      setTimeout(() => {
        debugger
      }, 500);
    }
  },
  created () {
    this.getbuInfo();
  }
};
</script>
<style lang="scss" scoped>
i {
  font-style: normal;
}
.boxTabCard {
  background: #fff;
  overflow: hidden;
  margin-bottom: 10px;
  border: 1px solid rgba(200, 219, 233, 1);
  .tabCardTitle {
    display: flex;
    align-items: center;
    padding: 0 20px;
    height: 60px;
    border-bottom: 1px solid #e6e6e6;
  }
  .tabCardTitle img {
    width: 15px;
    height: 14px;
    vertical-align: middle;
    margin-right: 10px;
  }
  .tabCenter {
    color: #333;
    flex-grow: 1;
  }
  .tabTopRight {
    color: #666;
    i {
      color: #1890ff;
    }
    span.t {
      padding: 4px 14px;
      border: 1px solid #e6e6e6;
      margin-left: 20px;
      border-radius: 4px;
      cursor: pointer;
    }
    span.blue {
      color: #1890ff;
      background:#fff
    }
  }
}
.tabCardBox {
  display: flex;
}
.hidTabCard{
  height: 163px;
}
</style>
