<template> 
    <div class='center_echart'>
        <div class='show_echart'>
            <div class="echart" id="echart-line2" :style="{width: '80px', height: '80px'}"></div>
        </div> 
        <div class="tishi">
                <div>
                    <span class='color_left teji'></span>
                    <span class='title'>特急 {{tejidata}}</span>
                    <span class='title3'>{{person_teji}}</span>      
                </div> 

                <div>
                    <span class='color_left jinji'></span>
                    <span class='title'>紧急 {{jinjidata}}</span>
                    <span class='title3'>{{person_jinji}}</span>      
                </div> 

                <div>
                    <span class='color_left yiban'></span>
                    <span class='title'>一般 {{yibandata}}</span>
                    <span class='title3'>{{person_yiban}}</span>      
                </div> 
            </div>
    </div>
</template>

<script>

import echarts from 'echarts'

export default {
     data() {
        return {
            tejidata:0,
            jinjidata:0,
            yibandata:0,
            person_teji:'0%',
            person_jinji:'0%',
            person_yiban:'0%',
        }
      },
      methods:{

      initChart(xData) {
          var all_count = 0;
          this.tejidata = 0;
          this.jinjidata = 0;
          this.yibandata = 0;
          this.person_teji= '0%';
          this.person_jinji= '0%';
          this.person_yiban= '0%';
          if(xData.length>0){
              for(var i =0;i<xData.length;i++){
                  all_count +=Number(xData[i].quantity)
                  if(xData[i].name =='特级'){
                      this.tejidata = xData[i].quantity
                      this.person_teji = xData[i].percent
                  }
                  if(xData[i].name =='紧急'){
                      this.jinjidata = xData[i].quantity
                      this.person_jinji = xData[i].percent
                  }
                  if(xData[i].name =='一般'){
                      this.yibandata = xData[i].quantity
                      this.person_yiban = xData[i].percent
                  }
              }
          }else{
                all_count = 1;
                this.tejidata = 0;
                this.jinjidata = 0;
                this.yibandata = 0;
                this.person_teji = '0%';
                this.person_jinji = '0%';
                this.person_yiban = '0%';
          }
          let getchart = echarts.init(document.getElementById('echart-line2'));
          
          var BorderWidth = '8';
          var placeHolderStyle1 = {
            normal: {
                label: {
                    show: false,
                    position: "center"
                },
                labelLine: {
                    show: true
                },
                color: "rgba(245, 34, 45, 0.01)",
                borderColor: "rgba(245, 34, 45, 0.11)",
                borderWidth: 8,

            },
            emphasis: {
                color: "rgba(245, 34, 45, 0.01)",
                borderColor: "rgba(245, 34, 45, 0.11)",
                borderWidth: 8
            }
          }
          var placeHolderStyle2 = {
            normal: {
                label: {
                    show: false,
                    position: "center"
                },
                labelLine: {
                    show: true
                },
                color: "rgba(245, 170, 34, 0.01)",
                borderColor: "rgba(245, 170, 34, 0.11)",
                borderWidth: 8,

            },
            emphasis: {
                color: "rgba(245, 170, 34, 0.01)",
                borderColor: "rgba(245, 170, 34, 0.11)",
                borderWidth: 8
            }
          }
            var placeHolderStyle3 = {
            normal: {
                label: {
                    show: false,
                    position: "center"
                },
                labelLine: {
                    show: true
                },
                color: "rgba(43, 193, 255, 0.01)",
                borderColor: "rgba(43, 193, 255, 0.11)",
                borderWidth: 8,

            },
            emphasis: {
                color: "rgba(43, 193, 255, 0.01)",
                borderColor: "rgba(43, 193, 255, 0.11)",
                borderWidth: 8
            }
          }
          var  option = {
            backgroundColor: '#fff',
            
            series: [{
                name: '特急',
                type: 'pie',
                clockWise: true, //顺时加载
                hoverAnimation: false, //鼠标移入变大
                radius: [14, 14],
                itemStyle: {
                    normal: {
                        label: {
                            show: false,
                            position: 'outside'
                        },
                        
                        borderWidth: BorderWidth,
                        shadowBlur: 8,
                        borderColor: "#F5222D",
                        shadowColor: 'rgba(0, 0, 0, 0)' //边框阴影
                    }
                },
                data: [{
                    value: this.tejidata,
                },
                {
                    value: all_count-this.tejidata,
                    name: '',
                    itemStyle: placeHolderStyle1
                }
                ]
            }, {
                name: '紧急',
                type: 'pie',
                clockWise: true,
                hoverAnimation: false,
                radius: [22, 22],
                itemStyle: {
                    normal: {
                        label: {
                            show: false
                        },
                       
                        borderWidth: BorderWidth,
                        shadowBlur:8,
                        borderColor: "#FFAA22",
                        shadowColor: 'rgba(0, 0, 0, 0)' //边框阴影
                    }
                },
                data: [{
                    value: this.jinjidata,
                }, 
                {
                    value: all_count-this.jinjidata,
                    name: '',
                    itemStyle: placeHolderStyle2
                }
                ]
            },  {
                name: '一般',
                type: 'pie',
                clockWise: true,
                hoverAnimation: false,
                radius: [30, 30],
                itemStyle: {
                    normal: {
                        label: {
                            show: false
                        },
                        
                        borderWidth: BorderWidth,
                        borderColor: "#2BC1FF",
                        shadowColor: 'rgba(0, 0, 0, 0)' //边框阴影
                    }
                },
                data: [{
                    value: this.yibandata,
                }, 
                {
                    value: all_count-this.yibandata,
                    name: '',
                    itemStyle: placeHolderStyle3
                }
                ]
            }],
            grid: {
                x: 0,
                y: 0,
                x2: 0,
                y2: 0
              },
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
<style lang="scss" scoped>
    .center_echart{
        position: relative;
        top: -10px;
    }
    .show_echart{
        position: relative;
        top: 10px;
        left: -10px;   
    }
    .tishi{
            position: relative;
            top: 13px;
            width: 110px;
            .color_left{
                display: inline-block;
                width: 6px;
                height: 6px;
                border-radius: 50%
            }
            .title{
                margin-left: 8px;
                height: 17px;
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #333333;
                line-height: 17px;
            }
            .title3{
                margin-left: 10px;
                color: #999999;
            }
            .teji{
                background: #F5222D;
            }
            .jinji{
                background: #FFAA22;
            }
            .yiban{
                background: #40A9FF;
            }
        }
</style>