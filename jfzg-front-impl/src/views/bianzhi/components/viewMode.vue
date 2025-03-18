<template>
  <div>
    <div >
      <el-row :gutter="20">
        <el-col class="unitName"
          :span="17">
          <unitName :setting="setting"></unitName>
          <div class="backBox">
            <slot name="cjdw"></slot>
            <!--如何对应的tab下，有哪几个角色列表-->
            <cardBox :mode="mode"
              :type="type"
              :memberdatas="memberdatas"
              @dataList="dataList"
              :buid="buid"
              @sum="sum"></cardBox>
          </div>
        </el-col>
        <el-col class="selectUser"
          :span="7">
          <selectUser :personnelList="personnelList"
            :buid="buid"></selectUser>
        </el-col>
      </el-row>
    </div>

  </div>
</template>
<script>
import unitName from "./unitName";
import cardBox from "./cardBox";
import selectUser from "./selectUser";
export default {
  components: { unitName, cardBox, selectUser },
  props: {
    //角色：1表示承建单位 2表示监理单位人员 3表示建设单位
    userType: {
      type: String,
      default: ""
    },
    memberdatas: {
      type: Object
    },
    memberdatas1: {
      type: Object
    },
    memberdatas2: {
      type: Object
    },
    buid: {
      type: Number
    },
    /**
     * 传过来的信息
     */
    info: {
      type: Object,
      default () {
        return {};
      }
    },
    /**
     * 判断处于那个tab
     */
    type: {
      type: String,
      default: ""
    },

    /**
     * 承建的哪个阶段
     */
    active: {
      type: String,
      default: ""
    },
    ruleForm: { type: Object }
  },
  data () {
    return {
      role: "2", //从接口获取的当前用户角色
      som: "",
      setting: {
        icon: require("@/assets/shishi/icon-logo.png"),
        unitName: "",
        info: "" //还得判断角色是否允许修改
      },
      mode: "edit",
      memberdata: "",
      num: 0,
      personnelList: [],

    };
  },
  methods: {
    /**
     * 设置单位名称
     */
    setUnitName () {
      if (this.type == "jsdw") {
        this.setting.unitName = this.$props.ruleForm.buildName;
      } else if (this.type == "cjdw") {
        this.setting.unitName = this.$props.ruleForm.supplyerName;
      } else if (this.type == "jldw") {
        this.setting.unitName = this.$props.ruleForm.supervisorName;
      }
    },
    sum (value) {
      this.num = value;
      this.setRole(this.num);
    },
    dataList (list) {
      this.flag = !this.flag;
      this.personnelList = [];
      list.map(({ cardData }) => {
        this.personnelList = [...this.personnelList, ...cardData];
      });
      console.log(this.personnelList)
    },
    /**
     * 判断角色
     */
    setRole (value) {
      //当前登陆人身份是建设单位,其他人模式都是查看
      if (this.som == "show") {
        this.mode = "edit";
      } else {
        this.mode = "view";
      }
    }
  },
  created () {
    this.som = this.$route.query.som;
    this.setUnitName();
    setTimeout(() => {
      this.setRole(this.num);
    }, 500);
  }
};
</script>
<style lang="scss" scoped>
.backBox {
  background: rgba(236, 242, 252, 0.49);
  margin-top: 20px;
  padding: 20px 20px 10px 20px;
  border: 1px solid rgba(200, 219, 233, 1);
}
.messages {
  display: flex;
  align-items: center;
}
.mess {
  width: 100%;
  line-height: 40px;
  background: rgba(230, 247, 255, 1);
  border-radius: 2px;
  border: 1px solid rgba(186, 231, 255, 1);
  margin: 20px 0 10px;
  padding: 0 10px;
  font-weight: 400;
}
</style>