import {
    riskAndProblemQuantity, deliveryFileSubmit, deliveryFilePass
} from "@/api/progress";
import { getPer, sortByKey } from "./tongchou"
export const qrisk = {
    /**
     * 问题/风险/交付物
     */

    data() {
        return {
            // 检查通过率
            checkOK: {
                "total": 0,//总数量
                "passNum": 0//通过数 
            },
            /**问题风险情况-风险情况 */
            echartInfo6: {
                id: "chart11",
                chartWidth: 164,
                chartHeight: 164,
                borderWidth: 2,
                labelText: "",
                data: [
                    { value: 1, name: "highNum", itemStyle: { color: '#F5222D' } },
                    { value: 1, name: "secondary", itemStyle: { color: '#FFC64D' } },
                    { value: 1, name: "lowNum", itemStyle: { color: '#1890FF' } }
                ],
            },
            isecharInfo6: false,
            isecharInfo7: false,
            qrTaskData: {
                highNum: 0,// 高风险个数
                secondary: 0,//中风险个数
                lowNum: 0,//低级个数
            },
            // 问题
            qrQuestionData: {
                highNum: 0,// 高风险个数
                secondary: 0,//中风险个数
                lowNum: 0,//低级个数
            },//问题
            qrTaskDataCopy: {},
            qrQuestionDataCopy: {},
            qrTaskPer: {},//风险百分比
            qrQuestionPer: {},//问题百分比
            /**问题风险情况-问题情况 */
            echartInfo7: {
                id: "chart17",
                chartWidth: 164,
                chartHeight: 164,
                borderWidth: 3,
                labelText: "",
                data: [
                    { value: 1, name: "高", itemStyle: { color: '#F5222D' } },
                    { value: 1, name: "中", itemStyle: { color: '#FFC64D' } },
                    { value: 1, name: "低", itemStyle: { color: '#1890FF' } }
                ],
                //#F5222D(高),#1890FF(低),#FFC64D(中)
            },
            //交付物各月提交情况
            echartInfo2: {
                id: "chart2",
                chartWidth: '100%',
                chartHeight: 138,
                ydata: ["10", "21", "30"],
                formatter: '项',
                text: '',
                showYLine: true, //y轴显示
                showValue: "none", //折线上的值
                xdata: ["3月", "4月", "5月"]
            },
            isecharInfo2: false,
            /**交付物情况环形 完成情况参数1 */
            echartInfo3: {
                id: "chart3",
                chartWidth: 164,
                chartHeight: 164,
                labelText: "",// 完成\n情况
                data: [
                    { value: 335, name: "通过数", itemStyle: { color: '#007AFF' } },
                    { value: 310, name: "总数量", itemStyle: { color: '#E6F7FF' } },
                ],
            },
            isechartInfo3: false

        }
    },
    methods: {
        /**
         * 风险问题
         */
        getRiskQuestionPieChart() {
            let projectId = this.$route.query.projectId
            riskAndProblemQuantity({ projectId }).then(res => {
                if (res.data) {

                    this.qrTaskData = this.arrObj(res.data.riskList, 'riskCount', 'riskLevel');
                    this.qrQuestionData = this.arrObj(res.data.problemList, 'problemCount', 'problemLevel');
                    this.isecharInfo6 = true;
                    this.isecharInfo7 = true;

                    this.$set(this.echartInfo6, 'data', this.riskQuestionAssign(res.data.riskList, 'riskCount', 'riskLevel'))
                    this.$set(this.echartInfo7, 'data', this.riskQuestionAssign(res.data.problemList, 'problemCount', 'problemLevel'))

                    //计算百分比,单个除以整体
                    if (this.qrQuestionData.highNum == null) {
                        this.qrQuestionData.highNum = 0
                    }
                    if (this.qrQuestionData.secondary == null) {
                        this.qrQuestionData.secondary = 0
                    }
                    if (this.qrQuestionData.lowNum == null) {
                        this.qrQuestionData.lowNum = 0
                    }
                    let qrQuestionDataNum = Number(this.qrQuestionData['highNum']) + Number(this.qrQuestionData['secondary']) + Number(this.qrQuestionData['lowNum'])
                    this.qrQuestionPer['highNum'] = getPer(this.qrQuestionData['highNum'], qrQuestionDataNum)
                    this.qrQuestionPer['secondary'] = getPer(this.qrQuestionData['secondary'], qrQuestionDataNum)
                    if (this.qrQuestionData.highNum == 0 && this.qrQuestionData.secondary == 0 && this.qrQuestionData.lowNum == 0) {
                        this.qrQuestionPer['lowNum'] = 0
                    } else {
                      this.qrQuestionPer['lowNum'] = getPer(this.qrQuestionData['lowNum'], qrQuestionDataNum)

                        // this.qrQuestionPer['lowNum'] = parseFloat(100 - (getPer(this.qrQuestionData['highNum'], qrQuestionDataNum) + getPer(this.qrQuestionData['secondary'], qrQuestionDataNum)))

                    }

                    //任务
                    if (this.qrTaskData.highNum == null) {
                        this.qrTaskData.highNum = 0
                    }
                    if (this.qrTaskData.secondary == null) {
                        this.qrTaskData.secondary = 0
                    }
                    if (this.qrTaskData.lowNum == null) {
                        this.qrTaskData.lowNum = 0
                    }


                    let qrTaskDateNum = Number(this.qrTaskData['highNum']) + Number(this.qrTaskData['secondary']) + Number(this.qrTaskData['lowNum'])
                    this.qrTaskPer['highNum'] = getPer(this.qrTaskData['highNum'], qrTaskDateNum)
                    this.qrTaskPer['secondary'] = getPer(this.qrTaskData['secondary'], qrTaskDateNum)



                    if (this.qrTaskData.lowNum == 0 && this.qrTaskData.secondary == 0 && this.qrTaskData.highNum == 0) {
                        this.qrTaskPer['lowNum'] = 0
                    } else {
                    this.qrTaskPer['lowNum'] = getPer(this.qrTaskData['lowNum'], qrTaskDateNum)
                        
                        // this.qrTaskPer['lowNum'] = parseFloat(100 - getPer(this.qrTaskData.highNum, qrTaskDateNum) - getPer(this.qrTaskData.secondary, qrTaskDateNum))
                    }


                }
            })
        },
        riskQuestionAssign(arr, val, key) {// 风险问题数据处理
            let tempArr = [];
            for (const item of arr) {
                let obj = {}
                if (item[key] == 3) {// 高
                    obj.value = item[val];
                    obj.name = '高';
                    obj.itemStyle = { color: '#F5222D' }
                }
                if (item[key] == 2) {// 中
                    obj.value = item[val];
                    obj.name = '中';
                    obj.itemStyle = { color: '#FFC64D' }
                }
                if (item[key] == 1) {// 低
                    obj.value = item[val];
                    obj.name = '低';
                    obj.itemStyle = { color: '#1890FF' }
                }

                tempArr.push(obj)
            }

            return tempArr;
        },
        arrObj(arr, val, key) {// 数组转对象
            let obj = {}
            for (const item of arr) {
                if (item[key] == 3) {// 高
                    obj.highNum = item[val]
                }
                if (item[key] == 2) {// 中
                    obj.secondary = item[val]
                }
                if (item[key] == 1) {// 低
                    obj.lowNum = item[val]
                }
            }

            return obj;
        },
        /**
         * 交付物各月提交情况
         */
        getNearThreeMonList() {
            let projectId = this.$route.query.projectId
            deliveryFileSubmit({ projectId }).then(res => {
                if (res.data) {
                    //处理y轴数据
                    //对数据根据日期排序
                    // let data = sortByKey(res.data, 'month', 'up')
                    let month = this.$moment().format('MM')
                    let yAxis = res.data.map(item => {
                        // if (item.count == 0 && month != item.month) {
                        //     item.count = null
                        // }
                        return item.count
                    })
                    //处理x轴数据
                    let xAxis = res.data.map(item => {
                        return item.month + '月'
                    })

                    this.$set(this.echartInfo2, 'ydata', yAxis)
                    this.$set(this.echartInfo2, 'xdata', xAxis)
                    this.isecharInfo2 = true;
                }
            })
        },

        /**
         * 检查通过率
         */
        getAdoptDeliInfoList() {
            let projectId = this.$route.query.projectId
            deliveryFilePass({ projectId }).then(res => {
                if (res.data) {
                    let { total, passNum } = res.data;
                    passNum = passNum ? passNum : 0
                    total = total ? total : 0
                    let adoptList = [
                        { value: passNum, name: "通过数", itemStyle: { color: '#007AFF' } },
                        { value: total, name: "总数量", itemStyle: { color: '#E6F7FF' } },
                    ]
                    this.$set(this, 'checkOK', res.data)
                    this.$set(this.echartInfo3, 'data', adoptList)
                    this.isechartInfo3 = true
                }

            })
        },
        getQriskdata(projectId) {
            this.getRiskQuestionPieChart(projectId)//
            this.getNearThreeMonList(projectId);//交付物各月提交情况
            this.getAdoptDeliInfoList(projectId)
        }
    },
    created() {

        // this.getQriskdata();

    }
}