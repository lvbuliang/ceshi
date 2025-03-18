import { projectOverview, taskStatistics } from "@/api/progress";
import { getLastWeekDays, TimeRange, group } from './tongchou'
export const taskEvent = {
    // 事件和任务
    data() {
        return {
            pickerOptions: {
                'firstDayOfWeek': 1
            },
            pickerOptionsEnd: {
                'firstDayOfWeek': 1
            },
            pickerOptionsTaskEnd: {
                'firstDayOfWeek': 1
            },
            echartInfo211: {
                id: "chart211",
                chartWidth: 500,
                chartHeight: 300,
                formatter: '',
                text: '剩余任务数：',
                ydata: ["10", "21", "30", "10", "21", "30", '80'],
                showYLine: true, //y轴显示
                areaStyleColor: "transparent",
                color: '#B2C4D5',
                showValue: "none", //折线上的值
                xdata: ["08-11", "08-12", "08-13", "08-14", "08-15", "08-16", "08-17"]
            },
            active: 0,
            active2: 0,
            isEchartInfo211: false,
            echartInfo212: {
                id: "chart212",
                chartWidth: 500,
                chartHeight: 120,
                formatter: '',
                text: '事件汇报：',
                ydata: ["0", "10", "0", "0", "0", "0", '0'],
                showYLine: false, //y轴显示
                showValue: "none", //折线上的值
                xdata: ["08-10", "08-12", "08-13", "08-14", "08-15", "08-16"]
            },
            isEchartInfo212: false,
            eventTotalCount: 0,//事件总次数
            eventNewsList: [],
            startTime: this.$moment().subtract('days', 6).format('YYYY-MM-DD'),
            endTime: this.$moment().format('YYYY-MM-DD'),

            // 任务
            startTaskTime: this.$moment().subtract('days', 6).format('YYYY-MM-DD'),
            endTaskTime: this.$moment().format('YYYY-MM-DD'),
        }
    },
    methods: {
        projectOverviewList(time, projectId) {
            if (!projectId) { projectId = this.$route.query.id }
            let params = {
                projectId: Number(projectId),
                dateTimes: time
            }
            projectOverview(params).then(res => {
                this.active = Math.random();
                // 事件
                this.eventTotalCount = res.data.project.totalCount;  // 事件总数
                this.eventNewsList = res.data.project.threeDateList;//最新汇报
                let eventYdata = res.data.project.dateCodeList.map(item => {
                    return item.eventNum.toString()
                });
                let eventXdata = res.data.project.dateCodeList.map(item => {
                    return item.date.substring(5, 13).toString()
                });

                this.$set(this.echartInfo212, 'ydata', eventYdata);
                this.$set(this.echartInfo212, 'xdata', eventXdata);
                this.isEchartInfo212 = true;

            })
        },
        projectTaskStatistics(time, projectId) {
            if (!projectId) { projectId = this.$route.query.id }
            let params = {
                projectId: Number(projectId),
                dateTimes: time
            }
            taskStatistics(params).then(res => {
                this.active2 = Math.random();

                //任务
                let taskYdata = res.data.map(item => {
                    return item.count.toString()
                });

                let taskxdata = res.data.map(item => {
                    return item.deadline.substring(5, 13).toString()
                });
                this.$set(this.echartInfo211, 'ydata', taskYdata);
                this.$set(this.echartInfo211, 'xdata', taskxdata);
                this.isEchartInfo211 = true;


            })
        },
        /**事件开始事件 */
        getEventStartWeek(val, projectId) {
            this.startTime = this.$moment(val).subtract('days', 1).format('YYYY-MM-DD');
            this.endTime = this.$moment(val).subtract('days', -5).format('YYYY-MM-DD');
            this.pickerOptionsEnd = Object.assign({}, this.pickerOptionsEnd, {
                disabledDate: (time) => {
                    return time.getTime() < new Date(this.startTime)
                }
            })
            this.getEventEndWeek(val, projectId)
        },

        /**事件结束时间 */
        getEventEndWeek(val, projectId) {
            this.endTime = this.$moment(val).subtract('days', -5).format('YYYY-MM-DD');
            let rangeTime = TimeRange(this.startTime, this.endTime).toString();
            /**对日期分成7等分 */
            let timeArr = group(rangeTime);
            let arr = []
            for (let i = 0; i < timeArr.length; i++) {
                if (timeArr[i].length > 0) {
                    arr.push(timeArr[i][0])
                }

            }
            this.projectOverviewList(arr.toString(), projectId)
        },
        /**任务开始事件 */
        getTaskStartWeek(val, projectId) {

            this.startTaskTime = this.$moment(val).subtract('days', 1).format('YYYY-MM-DD');
            this.endTaskTime = this.$moment(val).subtract('days', -5).format('YYYY-MM-DD');
            this.pickerOptionsTaskEnd = Object.assign({}, this.pickerOptionsTaskEnd, {
                disabledDate: (time) => {
                    return time.getTime() < new Date(this.startTaskTime)
                }
            })
            this.getTaskEndWeek(val, projectId)
        },

        /**任务结束时间 */
        getTaskEndWeek(val, projectId) {

            this.endTaskTime = this.$moment(val).subtract('days', -5).format('YYYY-MM-DD');
            let rangeTime = TimeRange(this.startTaskTime, this.endTaskTime).toString();
            /**对日期分成7等分 */
            let timeArr = group(rangeTime);
            let arr = []
            for (let i = 0; i < timeArr.length; i++) {
                if (timeArr[i].length > 0) {
                    arr.push(timeArr[i][0])
                }

            }
            this.projectTaskStatistics(arr.toString(), projectId)
        },
        taskEvent(projectId) {
            let rangeTime = TimeRange(this.startTime, this.endTime).toString();
            this.projectOverviewList(rangeTime, projectId)
            this.pickerOptionsEnd = Object.assign({}, this.pickerOptionsEnd, {
                disabledDate: (time) => {
                    return time.getTime() < new Date(this.startTime)
                }
            })


            this.projectTaskStatistics(rangeTime)

            this.pickerOptionsTaskEnd = Object.assign({}, this.pickerOptionsTaskEnd, {
                disabledDate: (time) => {
                    return time.getTime() < new Date(this.startTaskTime)
                }
            })
        },


    },
    created() {
        this.taskEvent();
    }
}