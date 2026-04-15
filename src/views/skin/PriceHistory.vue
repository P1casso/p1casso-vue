<template>
  <a-card>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="12">
            <a-form-item label="皮肤">
              <a-select
                ref="select"
                v-model:value="skinId"
                show-search
                :filter-option="filterOption"
                @change="selectSkin"
              >
                <a-select-option v-for="item in selectOption" :key="item.id" :value="item.id">
                  {{ item.skinName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div ref="chart" style="height: 400px; width: 100%" />
  </a-card>
</template>

<script>
import { getListeningSkinList, getPriceHistoryById } from '@/api/csSink'
import * as echarts from 'echarts'

export default {
  name: 'PriceHistory',
  data() {
    return {
      skinId: '',
      selectOption: [],
      chart: null,
    }
  },
  mounted() {
    this.$nextTick(() => {
      let dom = this.$refs.chart
      this.chart = echarts.init(dom)
      window.addEventListener('resize', () => {
        if (this.chart) this.chart.resize()
      })
      // 如果 skinId 已有值，可以初始化一次图表
      if (this.skinId) {
        this.selectSkin(this.skinId)
      }
    })
  },
  created() {
    this.getSelectOption()
  },
  methods: {
    // 获取下拉选项
    getSelectOption() {
      const params = { pageNo: -1, pageSize: -1 }
      getListeningSkinList(params).then((res) => {
        if (res.code === 200) {
          this.selectOption = res.data.records
          if (this.selectOption.length > 0) {
            this.skinId = this.selectOption[0].id
            this.selectSkin(this.skinId)
          }
        }
      })
    },

    // 搜索筛选
    filterOption(input, option) {
      const text = option.componentOptions.children[0].text
      return text.toLowerCase().includes(input.toLowerCase())
    },

    // 选择皮肤加载折线数据
    selectSkin(skinId) {
      getPriceHistoryById(skinId).then((res) => {
        if (res.code === 200) {
          const data = res.data
          const date = data.map((item) => item.recordTime)
          const values = data.map((item) => item.price)
          this.renderChart(date, values)
        }
      })
    },

    // 绘制图表
    renderChart(date, data) {
      const total = date.length
      if (total === 0) return
      if (this.chart) this.chart.resize()

      // 计算 dataZoom 起始百分比
      const timestamps = date.map((d) => new Date(d).getTime())
      const daySpan = (timestamps[total - 1] - timestamps[0]) / (1000 * 3600 * 24)
      const avgPerDay = total / Math.max(daySpan, 1)
      const daysToShow = 7
      const pointsToShow = Math.round(daysToShow * avgPerDay)
      const startPercent = Math.max(0, ((total - pointsToShow) / total) * 100)

      const option = {
        tooltip: {
          trigger: 'axis',
          formatter: (params) => {
            const p = params[0]
            const index = p.dataIndex
            return `${date[index]}<br/>${p.marker} ${p.seriesName} &nbsp;&nbsp;&nbsp;<strong>${p.data}</strong>`
          },
        },
        title: {
          left: 'center',
          text: '价格变化趋势',
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: date.map((d) => d.slice(0, 10)),
        },
        grid: {
          left: '3%',
          right: '3%',
          containLabel: true,
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '100%'],
        },
        dataZoom: [
          {
            type: 'inside',
            start: startPercent,
            end: 100,
          },
          {
            start: startPercent,
            end: 100,
          },
        ],
        series: [
          {
            name: '价格',
            type: 'line',
            symbol: 'circle',
            sampling: 'lttb',
            itemStyle: {
              color: 'rgb(255, 70, 131)',
            },
            data: data,
          },
        ],
      }
      this.chart.setOption(option)
    },
  },
}
</script>

<style scoped lang="less"></style>
