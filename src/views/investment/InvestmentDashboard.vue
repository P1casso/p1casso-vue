<template>
  <a-card :bordered="false" class="dashboard-card">
    <template #title>
      <span class="dashboard-title">投资统计报表</span>
    </template>
    <template #extra>
      <a-button type="primary" @click="showUpdateModal">更新市值</a-button>
    </template>

    <a-row :gutter="24" class="stat-cards">
      <a-col :xs="24" :sm="12" :lg="6">
        <div class="stat-card principal">
          <div class="stat-icon">
            <a-icon type="wallet" />
          </div>
          <div class="stat-content">
            <div class="stat-label">本金</div>
            <div class="stat-value">¥ {{ formatNumber(statistics.principal) }}</div>
          </div>
        </div>
      </a-col>
      <a-col :xs="24" :sm="12" :lg="6">
        <div class="stat-card market-value">
          <div class="stat-icon">
            <a-icon type="line-chart" />
          </div>
          <div class="stat-content">
            <div class="stat-label">当前市值</div>
            <div class="stat-value">¥ {{ formatNumber(statistics.marketValue) }}</div>
          </div>
        </div>
      </a-col>
      <a-col :xs="24" :sm="12" :lg="6">
        <div class="stat-card profit" :class="{ negative: statistics.profit < 0 }">
          <div class="stat-icon">
            <a-icon :type="statistics.profit >= 0 ? 'rise' : 'fall'" />
          </div>
          <div class="stat-content">
            <div class="stat-label">盈亏</div>
            <div class="stat-value">
              {{ statistics.profit >= 0 ? '+' : '' }}¥ {{ formatNumber(statistics.profit) }}
            </div>
          </div>
        </div>
      </a-col>
      <a-col :xs="24" :sm="12" :lg="6">
        <div class="stat-card profit-rate" :class="{ negative: statistics.profitRate < 0 }">
          <div class="stat-icon">
            <a-icon type="percentage" />
          </div>
          <div class="stat-content">
            <div class="stat-label">收益率</div>
            <div class="stat-value">
              {{ statistics.profitRate >= 0 ? '+' : '' }}{{ statistics.profitRate.toFixed(2) }}%
            </div>
          </div>
        </div>
      </a-col>
    </a-row>

    <a-row :gutter="24" class="chart-section">
      <a-col :span="24">
        <div class="chart-container">
          <div class="chart-title">收益趋势</div>
          <div ref="profitChartRef" style="width: 100%; height: 350px"></div>
        </div>
      </a-col>
    </a-row>

    <a-modal title="更新当前市值" :visible="updateModalVisible" @ok="handleUpdateMarketValue" @cancel="updateModalVisible = false" :confirmLoading="loading">
      <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="当前市值">
          <a-input-number v-model="newMarketValue" :precision="2" :min="0" style="width: 100%" placeholder="请输入当前市值" />
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script>
import { getStatistics, getCurrentMarketValue, updateCurrentMarketValue, getWeeklyStatisticsList } from '@/api/investment'
import * as echarts from 'echarts'

export default {
  name: 'InvestmentDashboard',
  data() {
    return {
      loading: false,
      updateModalVisible: false,
      newMarketValue: 0,
      statistics: {
        principal: 0,
        marketValue: 0,
        profit: 0,
        profitRate: 0,
      },
    }
  },
  methods: {
    formatNumber(num) {
      if (num == null) return '0.00'
      return Number(num).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    },
    showUpdateModal() {
      this.newMarketValue = this.statistics.marketValue || 0
      this.updateModalVisible = true
    },
    handleUpdateMarketValue() {
      if (this.newMarketValue == null || this.newMarketValue < 0) {
        this.$message.warning('请输入有效的市值')
        return
      }
      this.loading = true
      updateCurrentMarketValue(this.newMarketValue)
        .then((res) => {
          if (res.code === 200) {
            this.$message.success('市值更新成功')
            this.updateModalVisible = false
            this.loadData()
          } else {
            this.$message.error(res.message || '更新失败')
          }
        })
        .catch((err) => {
          this.$message.error(err.message || '更新失败')
        })
        .finally(() => {
          this.loading = false
        })
    },
    loadData() {
      getStatistics()
        .then((res) => {
          if (res.code === 200) {
            this.statistics = {
              principal: res.data.principal || 0,
              marketValue: res.data.marketValue || 0,
              profit: res.data.profit || 0,
              profitRate: res.data.profitRate || 0,
            }
          }
        })
        .catch(() => {})
    },
    loadProfitTrend() {
      getWeeklyStatisticsList({ page: 1, pageSize: 100 })
        .then((res) => {
          if (res.code === 200) {
            const records = res.data.records || []
            this.initChart(records)
          }
        })
        .catch(() => {})
    },
    initChart(records) {
      if (!this.$refs.profitChartRef) return
      const chart = echarts.init(this.$refs.profitChartRef)

      const sortedData = [...records].sort((a, b) => new Date(a.date) - new Date(b.date))
      const xData = sortedData.map((item) => item.date)
      const yData = sortedData.map((item) => item.amount)

      const option = {
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: '#e8e8e8',
          borderWidth: 1,
          textStyle: {
            color: '#333',
          },
          formatter: (params) => {
            const item = params[0]
            return `${item.name}<br/>金额: ¥ ${this.formatNumber(item.value)}`
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '10%',
          top: '10%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: xData,
          axisLine: {
            lineStyle: {
              color: '#e8e8e8',
            },
          },
          axisLabel: {
            color: '#666',
            rotate: 45,
          },
        },
        yAxis: {
          type: 'value',
          name: '金额 (元)',
          nameTextStyle: {
            color: '#666',
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            color: '#666',
            formatter: (value) => {
              if (value >= 10000) {
                return (value / 10000).toFixed(1) + 'w'
              }
              return value
            },
          },
          splitLine: {
            lineStyle: {
              color: '#f0f0f0',
            },
          },
        },
        series: [
          {
            name: '金额',
            type: 'line',
            data: yData,
            smooth: true,
            symbol: 'circle',
            symbolSize: 8,
            lineStyle: {
              color: '#1890ff',
              width: 3,
            },
            itemStyle: {
              color: '#1890ff',
              borderWidth: 2,
              borderColor: '#fff',
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
                { offset: 1, color: 'rgba(24, 144, 255, 0.05)' },
              ]),
            },
          },
        ],
      }
      chart.setOption(option)
      window.addEventListener('resize', () => chart.resize())
    },
  },
  created() {
    this.loadData()
  },
  mounted() {
    this.loadProfitTrend()
  },
}
</script>

<style scoped>
.dashboard-card {
  background: #f0f2f5;
}

.dashboard-title {
  font-size: 18px;
  font-weight: 600;
}

.stat-cards {
  margin-bottom: 24px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 20px 24px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin-bottom: 16px;
  transition: all 0.3s;
}

.stat-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin-right: 16px;
}

.stat-card.principal .stat-icon {
  background: linear-gradient(135deg, #1890ff 0%, #69c0ff 100%);
  color: #fff;
}

.stat-card.market-value .stat-icon {
  background: linear-gradient(135deg, #722ed1 0%, #b37feb 100%);
  color: #fff;
}

.stat-card.profit .stat-icon {
  background: linear-gradient(135deg, #52c41a 0%, #95de64 100%);
  color: #fff;
}

.stat-card.profit.negative .stat-icon {
  background: linear-gradient(135deg, #f5222d 0%, #ff7875 100%);
  color: #fff;
}

.stat-card.profit-rate .stat-icon {
  background: linear-gradient(135deg, #fa8c16 0%, #ffd591 100%);
  color: #fff;
}

.stat-card.profit-rate.negative .stat-icon {
  background: linear-gradient(135deg, #f5222d 0%, #ff7875 100%);
  color: #fff;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 14px;
  color: #8c8c8c;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #262626;
}

.chart-section {
  margin-top: 16px;
}

.chart-container {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.chart-title {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 16px;
  padding-left: 12px;
  border-left: 4px solid #1890ff;
}
</style>
