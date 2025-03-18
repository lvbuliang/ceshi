export default {
    chartWidth: 200,
    chartHeight: 200,
    tooltip: {
        // a为仪表盘的名称，b为值的名称，c为值
        formatter: "{a} <br/>{b} : {c}%",
 
    },
    // 隐藏工具栏
    toolbox: {
        show: false,
    },
    grid: {
        left: "3%",
        right: "4%",
        bottom: "0px",
        top:'20px',
        containLabel: true
    },
    series: [{
        name: "单仪表盘示例", // 系列名称,用于tooltip的显示，legend 的图例筛选，在 setOption 更新数据和配置项时用于指定对应的系列。
        type: "gauge", // 系列类型
        radius: "100%", // 参数:number, string。 仪表盘半径,默认 75% ，可以是相对于容器高宽中较小的一项的一半的百分比，也可以是绝对的数值。
        center: ["50%", "50%"], // 仪表盘位置(圆心坐标)
        startAngle: 215, // 仪表盘起始角度,默认 225。圆心 正右手侧为0度，正上方为90度，正左手侧为180度。
        endAngle: -35, // 仪表盘结束角度,默认 -45
        splitNumber: 5, // 仪表盘刻度的分割段数,默认 10。
        axisLine: { // 仪表盘轴线(轮廓线)相关配置。
            show: true, // 是否显示仪表盘轴线(轮廓线),默认 true。
            lineStyle: { // 仪表盘轴线样式。
                // 根据值计算白分比
                color: [
                    [0.8, '#1890FF'],
                    [1, '#F0F2F5']
                ], //仪表盘的轴线可以被分成不同颜色的多段。每段的  结束位置(范围是[0,1]) 和  颜色  可以通过一个数组来表示。默认取值：[[0.2, '#91c7ae'], [0.8, '#63869e'], [1, '#c23531']]
                opacity: 1, //图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
                width: 10, //轴线宽度,默认 30。
            }
        },

        splitLine: { // 分隔线样式。
            length: 20,
            lineStyle: { // 分隔线样式。
                color: "auto", //线的颜色,默认 #eee。
                type: "dashed", //线的类型,默认 solid。 此外还有 dashed,dotted
            }
        },

        axisTick: { // 刻度(线)样式。
            show: false, // 是否显示刻度(线),默认 true。
            splitNumber: 10, // 分隔线之间分割的刻度数,默认 5。
            length: 0, // 刻度线长。支持相对半径的百分比,默认 8。
            lineStyle: { // 刻度线样式。	
                color: "#eee", //线的颜色,默认 #eee。
                opacity: 1, //图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
                width: 1, //线度,默认 1。
                type: "solid", //线的类型,默认 solid。 此外还有 dashed,dotted
            },
        },

        axisLabel: { // 刻度标签。
            show: true, // 是否显示标签,默认 true。
            distance: 1, // 标签与刻度线的距离,默认 5。
            color: "rgba(0,0,0,0.65)", // 文字的颜色,默认 #fff。
            fontSize: 12, // 文字的字体大小,默认 5。
            formatter: function (v) {
                switch (v + '') {
                    case '20':
                        return '差';
                    case '40':
                        return '中';
                    case '60':
                        return '良';
                    case '80':
                        return '优';
                    default:
                        return '';
                }
            }, // 刻度标签的内容格式器，支持字符串模板和回调函数两种形式。 示例:// 使用字符串模板，模板变量为刻度默认标签 {value},如:formatter: '{value} kg'; // 使用函数模板，函数参数分别为刻度数值,如formatter: function (value) {return value + 'km/h';}
        },

        pointer: { // 仪表盘指针。
            show: true, // 是否显示指针,默认 true。
            length: "70%", // 指针长度，可以是绝对数值，也可以是相对于半径的百分比,默认 80%。
            width: 5, // 指针宽度,默认 8。
            itemStyle: {
                color: '#1890FF',
                borderWidth: 3
            }
        },

        itemStyle: { // 仪表盘指针样式。
            color: "#1890FF", // 指针颜色，默认(auto)取数值所在的区间的颜色
            opacity: 1, // 图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
            borderType: "dashed", // 柱条的描边类型，默认为实线，支持 'solid', 'dashed', 'dotted'。
        },

        title: { // 仪表盘标题。
            show: true, // 是否显示标题,默认 true。
            offsetCenter: [0, "50%"], //相对于仪表盘中心的偏移位置，数组第一项是水平方向的偏移，第二项是垂直方向的偏移。可以是绝对的数值，也可以是相对于仪表盘半径的百分比。
            fontSize: 16, // 文字的字体大小,默认 15。
            color: 'rgba(0,0,0,0.45)',
            fontSize: 14
        },

        detail: { // 仪表盘详情，用于显示数据。
            offsetCenter: [0, "75%"], // 相对于仪表盘中心的偏移位置，数组第一项是水平方向的偏移，第二项是垂直方向的偏移。可以是绝对的数值，也可以是相对于仪表盘半径的百分比。
            fontSize: 24, // 文字的字体大小,默认 15。
            formatter: '{value}%',
            color: "#333"

        },

        data: [{
            name: "通过率",
            value: '100',
        }]
    }]
}