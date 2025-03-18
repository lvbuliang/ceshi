<template>
  <section class="head">
    <el-row>
      <el-col :span="1">
        <img @click="check" :src="Img"  :class="{'boxClose':flag,'box':!flag}"/>
      </el-col>
      <el-col :span="12">
        <div class="title">{{projectName}}</div>
      </el-col>
      <!-- <el-col :span="1" :offset="7">
        <i class="el-icon-search"></i>
      </el-col>
      <el-col :span="1">
        <i class="el-icon-bell"></i>
      </el-col>
      <el-col :span="2" >
        <div class="avatar">
          <el-avatar size="medium" class="imgsize" :src="circleUrl"></el-avatar>
          <span class="userName" @click="exit()">用户名</span>
        </div>
      </el-col>-->
    </el-row>
  </section>
</template>

<script>
import menuImg from "@/assets/menu.png"
export default {
  data () {
    return {
      circleUrl:
        "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      flag: false,
      Img: menuImg,
      projectName: ''
    };
  },
  computed: {
    themeName () {
      console.log(this.$store.state.permission.theme);
      return this.$store.state.permission.theme || "";
    },
  },
  watch: {
    themeName (val) {
      console.log(val)
    },
  },
  mounted () {
    if (this.themeName == 'changsha') {
      this.projectName = '欢迎访问长沙市新型智慧城市全周期项目后台管理系统'
    } else if (this.themeName == 'yuhua') {
      this.projectName = '欢迎访问雨花台区政务信息化项目后台管理系统'
    } else {
      this.projectName = '欢迎您访问豫信河南项目管理系统'
    }
  },
  methods: {
    check () {
      this.flag = !this.flag;
      this.$store.dispatch("menu/checkMenu", this.flag);
      console.log(this.flag)
    },
    exit () {
      this.$store.dispatch("user/logout").then(() => { });
    }
  },
};
</script>

<style lang="scss" scoped>
.head {
  height: 64px;
  padding: 0 52px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #1e001529;
  justify-content: space-between;
  background: rgba(255, 255, 255, 1);
  .box {
    width: 20px;
    height: 20px;
    line-height: 64px;
    position: absolute;
    left: -35px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
  }
  .boxClose{
    width: 20px;
    height: 20px;
    line-height: 64px;
    position: absolute;
    left: -35px;
    top: 50%;
    transform:rotate(180deg) translateY(50%) ;
    cursor: pointer;
  }
  .el-row {
    width: 100%;
    line-height: 64px;
  }
  .title {
    font-size: 14px;
    color: rgba(38, 38, 38, 1);
  }
  .avatar {
    display: flex;
    align-items: center;
  }
  .imgsize {
    width: 24px;
    height: 24px;
    line-height: 24px;
  }
  .userName {
    padding-left: 5px;
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
  }
  i {
    cursor: pointer;
  }
}
</style>