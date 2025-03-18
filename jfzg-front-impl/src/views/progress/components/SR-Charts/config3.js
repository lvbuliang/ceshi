export default {
    chartWidth: 400,
    chartHeight: 300,
    // 网格,判断y轴显示不全的情况
    grid: {
        x: 40,
        y: 10,
        x2: 20,
        y2: 60,
        // width: {totalWidth} - x - x2,
        // height: {totalHeight} - y - y2,
        backgroundColor: 'rgba(0,0,0,0)',
        borderWidth: 1,
        borderColor: '#ccc'
    },
    grid: {
        left: "3%",
        right: "4%",
        bottom: "20px",
        containLabel: true
      },
    xAxis: {
        type: "category",
        boundaryGap: true,
        data: ["04-12", "04-13", "本次"],
        show: true,
        axisLine: {
            show: false,

        },
        axisTick: {
            //y轴刻度线
            show: true,
            lineStyle: {
                color: '#d9d9d9'
            }
        }
    },
    tooltip: {
        trigger: "axis",
        axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "line", // 默认为直线，可选为：'line' | 'shadow'
            lineStyle: {
                type: 'dashed',
                color: '#0090FF'
            }
        }
    },
    yAxis: {
        type: 'value',
        show: true,
        max: 100,
        // 开启y轴的事件功能
        // triggerEvent: true,
        splitLine: {
            //网格线
            show: true,
            lineStyle: {
                type: "dashed"
            }
        },
        axisLine: {
            show: true,
            lineStyle: {
                color: '#e6e6e6'

            }
        },
        axisTick: {
            //y轴刻度线
            show: true
        },

        // 控制y轴值和样式
        axisLabel: {
            formatter: '{value}分',
            color: '#555',


        }
    },
    series: [{
        data: [0, 20, 40, 50, 60, 80],
        type: "line",
        // 是否开启平滑曲线
        smooth: true,
        symbol: 'circle',
        // 折线图中标记的图形
        // symbol: 'image://data:image/gif;base64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7',
        // 浮标的大小
        symbolSize: 8,

        lineStyle: {
            // 控制线的颜色
            color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                // 渐变
                colorStops: [{
                    offset: 0, color: '#D8EEFE' // 0% 处的颜色
                }, {
                    offset: .5, color: '#0090FF'
                }, {
                    offset: 1, color: '#D8EEFE' // 100% 处的颜色
                }],
                globalCoord: true
            },
            width: 3,

        },
        itemStyle : {
            normal : {
                color:'#007aff'
            }
        }
    }]
}