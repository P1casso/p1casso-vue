<template>
  <a-card>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="日期">
              <a-select :default-value="selectData1.map(item => item.item)[0]" style="width: 120px"
                        @change="handleSelectChange">
                <a-select-option v-for="data in selectData1.map(item => item.item)" :key="data">
                  {{ data }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

        </a-row>
      </a-form>
    </div>
    <div id="echart"></div>
  </a-card>
</template>
<script>

export default {
  name: 'PhysicalDataCompare',
  data() {
    return {
      myChart: null,
      selectData: ['体重', '胸围'],
      selectData1: [
        {
          item: '体重',
          value: 0
        },
        {
          item: '胸围',
          value: 1
        },
        {
          item: '左臂围',
          value: 2
        },
        {
          item: '右臂围',
          value: 3
        },
        {
          item: '左大腿围',
          value: 4
        },
        {
          item: '右大腿围',
          value: 5
        },
        {
          item: '左小腿围',
          value: 6
        },
        {
          item: '右小腿围',
          value: 7
        },
        {
          item: '体脂率',
          value: 8
        },
        {
          item: '内脂',
          value: 9
        },
        {
          item: '肌肉量',
          value: 10
        },
        {
          item: 'BMI',
          value: 11
        },
        {
          item: '身体含水量',
          value: 12
        },
        {
          item: '基础代谢',
          value: 13
        }
      ],
      option: {
        title: {
          show: true,
          text: '双柱状图',
          padding: [10, 5, 5, 5],
          textStyle: {
            fontFamily: 'Microsoft YaHei',
            fontWeight: 400
          },
          left: 'center',
          top: 'top'
        },
        legend: {
          show: true,
          orient: 'horizontal',
          icon: 'inherit',
          itemGap: 15,
          padding: [70, 5, 5, 5],
          left: 'center',
          top: 'top'
        },
        xAxis: {
          nameLocation: 'end',
          nameRotate: 0,
          type: 'value',
          axisLine: {
            show: true,
            symbol: 'none',
            symbolSize: [10, 15],
            lineStyle: {
              width: 2
            }
          },
          axisTick: {
            show: false,
            length: 5,
            inside: false,
            alignWithLabel: false,
            lineStyle: {
              width: 2
            }
          },
          nameTextStyle: {
            fontSize: 16,
            padding: [0, 0, 0, 0],
            fontWeight: 400,
            fontFamily: 'Microsoft YaHei'
          },
          splitLine: {
            show: false,
            lineStyle: {
              type: 'solid',
              width: 1
            }
          },
          axisLabel: {
            margin: 8,
            fontSize: 16,
            fontWeight: 400,
            fontFamily: 'Microsoft YaHei'
          }
        },
        yAxis: {
          show: true,
          nameLocation: 'end',
          nameRotate: 0,
          position: 'left',
          boundaryGap: false,
          type: 'category',
          axisLine: {
            show: true,
            symbol: 'none',
            symbolSize: [10, 15],
            symbolOffset: [0, 0],
            lineStyle: {
              type: 'solid',
              width: 2
            }
          },
          axisTick: {
            show: false,
            length: 5,
            inside: false,
            alignWithLabel: false,
            lineStyle: {
              width: 2
            }
          },
          nameTextStyle: {
            fontSize: 16,
            padding: [0, 0, 0, 0],
            fontWeight: 400,
            fontFamily: 'Microsoft YaHei'
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'solid',
              width: 1
            }
          },
          axisLabel: {
            rotate: 0,
            margin: 8,
            fontSize: 16,
            fontWeight: 400,
            fontFamily: 'Microsoft YaHei',
            formatter: '{value}'
          },
          data: ['a']
        },
        tooltip: {
          show: true,
          trigger: 'item',
          axisPointer: {
            type: 'shadow'
          },
          formatter: function(params){
            if(Array.isArray(params)){
              let arr = []
              params.forEach((re,i)=>{
                arr.push(re.seriesName +' : '+ re.value+'')
              })
              return arr.join('')
            }else{
              return params.seriesName +' : '+ (Array.isArray(params.value)?(params.value[params.value.length-1]+''):(params.value+''))
            }
          }

        },
        toolbox: {
          show: true,
          orient: 'horizontal',
          showTitle: true,
          feature: {
            saveAsImage: {
              show: true
            },
            restore: {
              show: false
            },
            dataView: {
              show: false
            },
            magicType: {
              show: false,
              type: ['line', 'bar', 'stack']
            }
          },
          left: 'right',
          top: 'top'
        },
        animation: false,
        grid: {
          left: 10,
          top: 60,
          right: 60,
          bottom: 10,
          containLabel: true
        },
        series: []
      },
      query: this.$route.query
    }
  },
  methods: {
    handleSelectChange(value) {
      let index = this.selectData1.map(item => item.item).indexOf(value)
      this.drawChart(index)
    },


    drawChart(index) {
      this.option.series = []
      this.query.forEach(item => {
        let data
        switch (index) {
          case 0:
            data = item.weight
            break
          case 1:
            data = item.chestCircumference
            break
          case 2:
            data = item.leftArmCircumference
            break
          case 3:
            data = item.rightArmCircumference
            break
          case 4:
            data = item.leftThighCircumference
            break
          case 5:
            data = item.rightThighCircumference
            break
          case 6:
            data = item.leftCalfCircumference
            break
          case 7:
            data = item.rightCalfCircumference
            break
          case 8:
            data = item.bodyFatPercentage
            break
          case 9:
            data = item.visceralFat
            break
          case 10:
            data = item.muscleMass
            break
          case 11:
            data = item.bmi
            break
          case 12:
            data = item.bodyWater
            break
          case 13:
            data = item.basalMetabolicRate
            break
        }
        let series = {
          name: item.measurementTime,
          barWidth: '20%',
          type: 'bar',
          data: [data],
          label: {
            show: true,
            position:'inside',
            fontSize: 14,
            borderWidth: 0,
            padding: [5, 5, 5, 5],
            borderRadius: [0, 0, 0, 0],
            formatter: '{a}  {c}'
          }
        }
        this.option.series.push(series)
      })
      // 基于准备好的dom，初始化echarts实例
      this.myChart = this.$echarts.init(document.getElementById('echart'))
      // 使用刚指定的配置项和数据显示图表。
      this.myChart.setOption(this.option)
    }
  },
  mounted() {
    this.drawChart(0)
  },
  created() {
    let query = this.$route.query
    console.log(query)

    //
    try {


    } catch (e) {

      this.$router.push({
        name: 'BodyData'
      })
    }
  }
}
</script>


<style lang="less" scoped>
#echart {
  width: 100%;
  height: 600px;
}
</style>