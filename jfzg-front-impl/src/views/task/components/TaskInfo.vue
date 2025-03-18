<template>
  <section class="Sr_Nav_Page">
    <div class="work-inner">
      <el-row>
        <el-col :span="12">
          <div class="nav">
            <img src="@/assets/task.png" alt style="width: 48px; height: auto" />
            <div class="nav_title">
              <div class="nav_title_box">
                <span class="title">
                  {{ info.taskName }}
                </span>
                <span :class="info.className">{{ info.statusName }}</span>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </section>
</template>
<script>

  export default {
    props: {
      info: {
        type: Object,
        default () {
          return {};
        },
      }
    },
    data() {
      return {
        
      };
    },
    mounted() {},
    methods: {},
  };
</script>
<style lang="scss" scoped>
  .danger-label,.success-label,.warning-label{
    min-width: 58px;
    height: 24px;
    line-height: 24px;
    border-radius: 8px;
    font-size: 14px;
    padding: 0 8px;
    margin-left: 8px;
  }
  .danger-label{
    color: #F5222D;
    background: rgba(245, 34, 45, 0.1);
  }
  .success-label {
    color: #52C41A;
    background: rgba(82, 196, 26, 0.1);
  }
  .warning-label{
    color: #FFAA22;
    background: rgba(255, 170, 34, 0.1);
  }
  .nav_title_box{
    display: flex;
    align-items: center;
  }
</style>
