<template>
  <div id="main">
    <div id="myChartChina" :style="{float:'left',width: '65%', height: '490px'}"></div>
    <div id="bingtu" :style="{float:'right',width: '30%', height: '490px'}"></div>
  </div>  
</template>

<script>
import { getChinaMap } from '@/axios/api';

export default {
  name: 'dashboard',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      mapData: [],
      topData: []
    }
  },
  mounted(){
    this.getMap();
    //this.drawLine();
  },
  methods: {
    drawLine(){
        // 基于准备好的dom，初始化echarts实例
        var myChartContainer = document.getElementById('myChartChina');       
        var myChartChina = this.$echarts.init(myChartContainer); 

        var option = {
            title : {
                text: '人员地域分布（人）',
                subtext: '数据来自实时统计'
            },
            tooltip : {
                trigger: 'item'
            },
            // legend: {
            //     x:'right',
            //     selectedMode:false,
            //     data:['北京','上海','广东']
            // },
            dataRange: {
                orient: 'horizontal',
                min: 0,
                max: this.topData[0].value,
                text:['高','低'],           // 文本，默认为数值文本
                splitNumber:0
            },
            series : [
                {
                    name: '人员分布',
                    type: 'map',
                    mapType: 'china',
                    zoom: 1.2, 
                    mapLocation: {
                        x: 'left'
                    },
                    selectedMode : 'multiple',
                    itemStyle:{
                        normal:{label:{show:true}},
                        emphasis:{label:{show:true}}
                    },
                    data: this.mapData
                }
            ],
            animation: false
        };
       myChartChina.setOption(option);
   
        //饼状图
       var myBingtu = this.$echarts.init(document.getElementById('bingtu')); 
       var option1 = {
            title : {
                text: '人员分布比例',
                subtext: '实时统计',
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            calculable : true,
            series : [
                {
                    name:'人员统计',
                    type:'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data:this.topData
                }
            ]
        };
     
        myBingtu.setOption(option1);
    },
    getMap(){
      var _this = this
      getChinaMap().then(res => {
          //控制跳转
          if(res.returnCode == '1111'){
            _this.mapData = res.result
            _this.topData = res.tops
            console.log(res.result)
            this.drawLine()
            
          }else if(res.returnCode == '0000'){
            this.$message.warning(res.returnMessage);
          }else{
            this.$message.error(res.message);
          }
        })

    },
  }
}
</script>

<style scoped>
/* 面包屑 */

.crumb {
  height: 36px;
  line-height: 36px;
}
</style>
