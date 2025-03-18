<template>  
      <div class="echart" id="echart-line5" :style="{float:'left',width: '100%', height: '100px'}"></div>   
</template>

<script>

import echarts from 'echarts'

export default {
     
      methods:{

      initChart(xData) {
          let getchart = echarts.init(document.getElementById('echart-line5'));
          var  option = {
            xAxis: {
                type: 'category',
                
                data: ['待审核', '审批通过', '审核驳回'],
                splitLine: {
                  "show": false
                },
                axisLabel:{
                  interval: 0,    //强制文字产生间隔
                    textStyle:{
                      fontSize: 12,
                    }
                },
                axisLabel:{
                    interval: 0,
                    textStyle:{
                      fontSize: 12,
                        color:'#333333'
                    }
                },
                axisLine: {
                    lineStyle: {
                        type: 'dashed',
                        color: '#DDDDDD',//左边线的颜色
                        width:0.5//坐标线的宽度
                    }
                },
            },
            yAxis: {
                type: 'value',
                // max:20,
                splitNumber : 1,
                // interval:10,
                axisLabel:{
                    textStyle:{
                        color:'#999999'
                    }
                },

                axisLine:{
                  show:false
                },
                splitLine:{
                    show:true,
                    lineStyle:{
                        type:'dashed',
                        color:'#DDDDDD',
                        width:0.5
                    }
                },
                axisTick:{
                  show:false
                },
            },
              grid: {
                x: 50,
                y: 10,
                x2: 0,
                y2: 35
              },
            series: [{
                data: [xData.processTask, xData.completeTask, xData.auditedTask],
                type: 'bar',
                showBackground: true,
                backgroundStyle :{
                  color: '#F1F1F1 ',
                  barBorderRadius: 15,
                },
                itemStyle: {
                    normal: {
                            color: function(params) {
                                var colorList = ['#29C1FF','#52C41A','#f5222D'];
                                return colorList[params.dataIndex]
                            },
                            barBorderRadius:[15, 15, 15, 15],
                        }
                    },
            　　　　　　barWidth:8,
            }]
};

          getchart.setOption(option);
          //随着屏幕大小调节图表
          window.addEventListener("resize", () => {
            getchart.resize();
        });
      },

    }

}
</script>
<style scoped>
  #echart-line5{
    position: relative;
    left: -16px;
  }
</style>