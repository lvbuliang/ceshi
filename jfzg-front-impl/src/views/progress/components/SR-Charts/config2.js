export default {
    chartWidth: 200,
    chartHeight: 200,

    series: [{
        type: 'pie',
        // 调节饼图的粗细
        radius: ['50%', '70%'],
        // 偏移距离
        hoverOffset: 0,
        // 饼图文字配置
        label: {
            show: true,
            position: 'center',
            formatter: '风险\n情况',
            fontSize: 16,
            color: '#333'
        },
        // 饼图数据
        data: [{
                value: 60,
                name: '69%'
            },
            {
                value: 30,
                name: '34%'
            },
            {
                value: 10,
                name: '34%'
            }
        ],
        itemStyle: {
            normal: {
                // 设置饼图的颜色
                color: function (params) {
                    var colorList = ['#3AA0FF', '#FFB235', '#FF3F3F']
                    return colorList[params.dataIndex]
                },
                // 饼图各块之间的间隙
                borderWidth: 4,
                borderColor: '#fff'
            }
        }
    }]
}