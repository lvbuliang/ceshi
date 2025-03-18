export default {
    chartWidth: 340,
    chartHeight: 360,
    legend:{
      orient: 'horizontal', 
      icon:"circle",
      formatter: ["{b|{name}}"].join("\n"),
      itemWidth: 10,
      bottom:30,
      left:0,
      data: [],
      itemGap: 25,
      textStyle:{
        fontSize:12,
        rich:{
          b:{
            width:60
          }
        }
      }
    },
    // tooltip: {
    //   trigger: 'item',
    //   // formatter: "{b}: {c} ({d}%)"
    // },
    series: [{
      type: 'pie',    // 设置图表类型为饼图
      radius: '40%',  // 饼图的半径，外半径为可视区尺寸（容器高宽中较小一项）的 55% 长度。
      data:[],
      // label: {
      //   normal: {
      //      position: 'inner',
      //      show : false
      //   }
      // },
      center: ['50%', '40%'],//竖直方向移动圆心实现上下间距移动
      itemStyle: {
        normal: {
          // 设置饼图的颜色
          color: function(params) {
            var colorList = [ '#7C6AF2', '#C95FF2','#FF6383','#FF9F40','#FFCB48','#31DC72','#5C89FF']
            return colorList[params.dataIndex]
          },
          // 饼图各块之间的间隙
          borderWidth: 0,
          borderColor: '#fff'
        }
      }
  
    }]
  }