/**
 * 项目总体情况
 */
import chartConfig7 from "./SR-Charts/config3.js";
import chartConfig5 from "./SR-Charts/config1.js";
import chartConfig8 from "./SR-Charts/config4.js";
import { getQualityByParam, task, delivery, statisticsWorkOrderCount, qualityAssessment } from "@/api/progress";
import { getMonthDay, getstage, sortByKey } from "./tongchou"
export const situationProject = {
    data() {
        return {
            /**汇报情况曲线图 */
            echartInfo: {
                id: "chart",
                chartWidth: '100%',
                chartHeight: 120,
                text: "",
                ydata: [10, 20, 44, 30, 11, 23, 0, 0],
                showYLine: false, //y轴不显示
                showValue: "none", //折线上的值
                xdata: ["1月", "2月", "3月", "4月", "5月", "6月"]
            },
            hbList: {},
            isecharInfo: false,
            chartConfig7, //质量情况
            chartConfig5,//交付物情况
            chartConfig8,//技术性检查
            showcfig7: false,

            huiBaoNum: 0,//汇报次数
            qualityNewList: {
                grade: "暂无",
                average: 0,
            },//最近的质量情况
            jfwList: {},//交付物
            WorkOrderCount: {
                itemCount: 0,   //进行中数量
                allCount: 0,     //总数
                itemRate: 100,  //通过率
                result: "暂无",
            },
            stageWorkList: [],
            rise: false,
            decline: false

        }
    },
    methods: {
        /**
         * 质量情况
         */
        queryQualityByParam(projectId) {
            if (!projectId) { projectId = this.$route.query.projectId }
            let params = {
                projectId: Number(projectId)
            }
            getQualityByParam(params).then(res => {

                /**比较距离上一条数据是增还是减 */
                if (res.data.length > 1) {
                    if (res.data[res.data.length - 1].checkScore > res.data[res.data.length - 2]) {
                        this.rise = true;

                    } else {
                        this.decline = true
                    }
                }
                // 根据评分标准得知良优
                if (res.data.length > 0) {
                    //求平均分
                    let allScore = 0;
                    res.data.map(item => {
                        allScore = allScore + item.checkScore
                    })
                    this.qualityNewList = res.data[res.data.length - 1];//最新一条记录
                    this.qualityNewList.average = (allScore / res.data.length).toFixed(0)//平均分

                    let score = res.data[res.data.length - 1].checkScore;
                    // 判断值处于数组的哪个阶段
                    let num = getstage(score, res.data[res.data.length - 1].warningScoreMemo);

                    if (num == 0) {
                        this.qualityNewList.grade = '差'
                    } else if (num == 1) {
                        this.qualityNewList.grade = '质量可靠'
                    } else {
                        this.qualityNewList.grade = '良好'
                    }
                    //x轴数据
                    let data = sortByKey(res.data, 'carryTime', 'up')
                    let dateXList = data.map((item, i) => {
                        // return getMonthDay(item.carryTime)
                        return `第${i + 1}次`
                    })
                    let dateSerries = data.map(item => {
                        return item.checkScore
                    })

                    this.$set(chartConfig7.xAxis, 'data', dateXList);
                    this.$set(chartConfig7.series[0], 'data', dateSerries);
                    this.showcfig7 = true;

                }

            })

        },

        /**
         * 近3个月的汇报情况-需要整改
         */
        reportCountList() {
            let projectId = this.$route.query.projectId
            task({ projectId }).then(res => {
                if (res.data) {


                    // console.log(res)
                    this.hbList = res.data;
                    // console.log('汇总情况', res.data)

                    //处理y轴数据
                    let month = this.$moment().format('MM')
                    if (res.data.sort == 2) {
                        res.data = res.data.reverse();
                    }
                    let yAxis = res.data.map(item => {
                        // // 判断为0并且不是当月
                        if (item.count == 0 && month != item.count) {
                            item.count = null
                        }
                        return item.count
                    })
                    // console.log('汇总情况y', yAxis)

                    //处理x轴数据
                    let xAxis = res.data.map(item => {
                        return item.month + '月'
                    })
                    this.$set(this.echartInfo, 'ydata', yAxis)
                    this.$set(this.echartInfo, 'xdata', xAxis)
                    this.isecharInfo = true
                }
            })
        },

        /**
         * 交付物情况
         */
        getDeliSituationList() {
            let projectId = this.$route.query.projectId
            delivery({ projectId }).then(res => {
                console.log(res)
                if (res.data) {
                    let { total, submitNum } = res.data;
                    this.jfwList = { submitted: submitNum, shouldSubmit: total }

                    this.$set(chartConfig5.series[0], 'data', [
                         {
                        value: submitNum||0,
                        name:  '已提交 '
                    },
                        {
                        value: total-submitNum|| 1,
                        name: '需提交'
                    },
                    ])
                }
            })
        },

        /**
         * 技术性检查工单-进度检查情况
         */
        statisticsWorkOrderCountList(projectId) {
            if (!projectId) { projectId = this.$route.query.projectId }
            let params = {
                nodeId: "workflow_workorder_tech",
                projectId: projectId
            }
            statisticsWorkOrderCount(params).then(res => {
                this.WorkOrderCount = res.data
                if (this.WorkOrderCount.allCount != 0 && this.WorkOrderCount.itemCount != 0) {
                    chartConfig8.series[0].data[0].value = res.data.itemRate
                    this.WorkOrderCount.result = "通过"

                } else {
                    chartConfig8.series[0].data[0].value = 0
                    this.WorkOrderCount.result = "暂无"
                }

            })
        },
        getsituationProject(projectId) {
            chartConfig7.chartWidth = 240;
            chartConfig7.chartHeight = 200;
            this.queryQualityByParam(projectId);
            this.reportCountList(projectId)
            this.getDeliSituationList(projectId);
            this.statisticsWorkOrderCountList(projectId);
        }
    },
    mounted() {
        // this.getsituationProject();
    },
    created() {

    }
}