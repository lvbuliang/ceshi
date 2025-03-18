export default {
    chartWidth: 110,
    chartHeight: 110,

    series: [{
        type: 'pie',
        radius: ['50%', '78%'],
        avoidLabelOverlap: false,
        // 偏移距离
        hoverOffset: 0,
        // 饼图文字配置
        label: {
            show: false,
            position: 'center'
        },
        // 饼图文字样式配置
        emphasis: {
            label: {
                show: false,
                fontSize: '16',
                fontWeight: 'bold',
                color: 'rgba(51, 51, 51, 1)'
            }
        },
        // 饼图数据
        data: [
            {
                value: 0,
                name: '0%'
            },
            {
                value: 0,
                name: '0%'
            }
        ],
        itemStyle: {
            normal: {
                // 设置饼图的颜色
                color: function (params) {
                    var colorList = ['rgba(24, 144, 255, 0.85)', 'rgba(240, 242, 245, 1)']
                    return colorList[params.dataIndex]

                }
            }
        }
    }]
}