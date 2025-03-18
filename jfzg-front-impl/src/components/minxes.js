import {
  api_getSnopshotInfo,
  api_dayWeekMonthWorkFlow,
} from "@/api/shishi/report.js";
import {
  common_trajectoryList
} from "@/api";

export const publicMethod = {
  methods: {
    //获取  步骤条
    getStepBoxList(processId, typeName) {
      let obj = {
        projectId: this.$route.query.projectId,
        processId: processId ? processId : '',
      }
      api_dayWeekMonthWorkFlow(obj).then((res) => {
        if (res.msg.code == '0000') {
          if (res.data.length > 0) {
            let newArr = []
            let flag = 0
            res.data.forEach((item, index) => {
              let obj = {}
              if (index < res.data.length - 1) {
                obj.title = item.nodeName + typeName
              } else {
                obj.title = item.nodeName
              }
              obj.name = item.userName
              obj.time = item.opTime
              if (item.todo) {
                flag = index
              }
              newArr.push(obj)
            })
            this.stepList = newArr
            this.stepActive = flag
          }
        }
      })
    },
    //获取留痕轨迹
    getTrajectoryList(type) {
      if (this.$route.query.id) {
        let id = this.$route.query.id;
        common_trajectoryList(id, type).then(res => {
            // console.log("获取留痕轨迹", res);
            if (res.msg.code == "0000") {
              this.$set(this, "trajectoryData", res.data);
            } else {
              console.log(res);
            }
          })
          .catch(err => {
            console.log("获取留痕轨迹", err);
          });
      }
    },
    // 获取快照信息
    async getSnopshotInfo() {
      let params = {
        projectId: this.$route.query.projectId,
        objectId: this.$route.query.id,
        topic: '',
        modelCode: '',
      }
      let res = await api_getSnopshotInfo(params)
      if (res.msg.code == '0000') {
        if (res.data) {
          this.$set(this, 'snapshotPaseData', JSON.parse(res.data.modelContent))
        }
      }
    },
    //任务完成情况输入返回
    change(form) {
      console.log('任务完成情况输入返回', form)
      // this.$set(this.snapshotData, 'missionFeeling', form)
      this.snapshotData.missionFeeling = form
    },
    //项目信息返回数据
    informationData(data) {
      console.log('项目信息返回数据', data)
      this.$set(this.nav, 'title', data.projectName)
      // this.$set(this.nav, 'stage', '试运行')
      this.$set(this.nav, 'userName', this.$store.state.user.userInfo.fullName)
      this.$set(this.snapshotData, 'informationData', data)
      this.$set(this.snapshotData, 'nav', this.nav)
    },
    //完成里程碑信息
    doneingTableData(data) {
      console.log('完成里程碑信息', data)
      this.$set(this.nav, 'stage', data[0].stageName)
      this.$set(this.snapshotData, 'doneingTable', data)
      this.$set(this.snapshotData, 'nav', this.nav)
      console.log(this.snapshotData)
    },
    //当前提交里程碑信息
    doneTableData(data) {
      console.log('当前提交里程碑信息', data)
      this.$set(this.snapshotData, 'doneTable', data)
    },
    //项目问题返回
    questionList(data) {
      console.log('项目问题返回', data)
      this.$set(this.snapshotData, 'questionList', data)
    },
    //项目风险返回
    riskList(data) {
      console.log('项目风险返回', data)
      this.$set(this.snapshotData, 'riskList', data)
    },
    //交付物返回
    resultList(data) {
      console.log('交付物返回', data)
      this.$set(this.snapshotData, 'resultList', data)
    },
  }
}