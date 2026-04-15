<template>
  <a-card>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="日期">
              <a-date-picker v-model="queryParam.date" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-button type="primary" @click="handleSearch">查询</a-button>
            <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="handleAdd">新建</a-button>
      <a-button style="margin-left: 8px" icon="line-chart" @click="showChart">趋势图</a-button>
    </div>

    <a-table
      :columns="columns"
      :dataSource="dataSource"
      bordered
      :pagination="pagination"
      @change="handlePageChange"
      :loading="loading"
    >
      <span slot="date" slot-scope="text">{{ text }}</span>
      <span slot="amount" slot-scope="text">{{ text }} 元</span>
      <span slot="operation" slot-scope="text, record">
        <a-button type="primary" @click="handleEdit(record)">编辑</a-button>
        <a-divider type="vertical" />
        <a-popconfirm title="确定删除该记录吗？" ok-text="是" cancel-text="否" @confirm="handleDelete(record.id)">
          <a-button type="danger">删除</a-button>
        </a-popconfirm>
      </span>
    </a-table>

    <a-modal
      :title="modalTitle"
      :width="640"
      :visible="visible"
      :confirmLoading="confirmLoading"
      @cancel="handleModalCancel"
      @ok="handleModalOk"
    >
      <a-spin :spinning="confirmLoading">
        <a-form v-bind="formLayout">
          <a-form-item label="日期">
            <a-date-picker v-model="editData.date" style="width: 100%" />
          </a-form-item>
          <a-form-item label="金额">
            <a-input-number v-model="editData.amount" :precision="2" :min="0" style="width: 100%" />
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>

    <a-modal title="投资周统计趋势" :width="900" :visible="chartVisible" @cancel="chartVisible = false" :footer="null">
      <div ref="chartRef" style="width: 100%; height: 400px"></div>
    </a-modal>
  </a-card>
</template>

<script>
import {
  getWeeklyStatisticsList,
  createWeeklyStatistics,
  updateWeeklyStatistics,
  deleteWeeklyStatistics,
} from '@/api/investment'
import moment from 'moment'
import * as echarts from 'echarts'

export default {
  name: 'WeeklyStatistics',
  data() {
    this.formLayout = {
      labelCol: { xs: { span: 24 }, sm: { span: 7 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 13 } },
    }
    return {
      visible: false,
      chartVisible: false,
      confirmLoading: false,
      modalTitle: '新建',
      isEdit: false,
      loading: false,
      queryParam: {
        date: null,
      },
      editData: {
        id: null,
        date: null,
        amount: 0,
      },
      columns: [
        {
          title: '序号',
          dataIndex: 'index',
          key: 'index',
          align: 'center',
          width: 80,
          customRender: (text, record, index) => {
            const pageSize = this.pagination.pageSize || 10
            return (this.pagination.current - 1) * pageSize + index + 1
          },
        },
        {
          title: '日期',
          dataIndex: 'date',
          key: 'date',
          align: 'center',
          scopedSlots: { customRender: 'date' },
        },
        {
          title: '金额',
          dataIndex: 'amount',
          key: 'amount',
          align: 'center',
          scopedSlots: { customRender: 'amount' },
        },
        {
          title: '操作',
          dataIndex: 'operation',
          align: 'center',
          width: 200,
          scopedSlots: { customRender: 'operation' },
        },
      ],
      dataSource: [],
      pagination: {
        current: 1,
        pageSize: 100,
        total: 0,
      },
    }
  },
  methods: {
    moment,
    handlePageChange(pagination) {
      this.pagination = { ...this.pagination, ...pagination }
      this.loadData()
    },
    handleSearch() {
      this.pagination.current = 1
      this.loadData()
    },
    handleReset() {
      this.queryParam = { date: null }
      this.pagination.current = 1
      this.loadData()
    },
    handleAdd() {
      this.modalTitle = '新建'
      this.isEdit = false
      this.editData = {
        id: null,
        date: null,
        amount: 0,
      }
      this.visible = true
    },
    handleEdit(record) {
      this.modalTitle = '编辑'
      this.isEdit = true
      this.editData = {
        ...record,
        date: record.date ? moment(record.date) : null,
      }
      this.visible = true
    },
    handleModalCancel() {
      this.visible = false
    },
    handleModalOk() {
      this.confirmLoading = true
      const submitData = {
        ...this.editData,
        date: this.editData.date ? this.editData.date.format('YYYY-MM-DD') : null,
      }
      const action = this.isEdit ? updateWeeklyStatistics(submitData) : createWeeklyStatistics(submitData)
      action
        .then((res) => {
          if (res.code === 200) {
            this.visible = false
            this.$message.success(this.isEdit ? '修改成功' : '添加成功')
            this.loadData()
          } else {
            this.$message.error(res.message || '操作失败')
          }
        })
        .catch((err) => {
          this.$message.error(err.message || '操作失败')
        })
        .finally(() => {
          this.confirmLoading = false
        })
    },
    handleDelete(id) {
      deleteWeeklyStatistics(id)
        .then((res) => {
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.loadData()
          } else {
            this.$message.error(res.message || '删除失败')
          }
        })
        .catch((err) => {
          this.$message.error(err.message || '删除失败')
        })
    },
    loadData() {
      this.loading = true
      const body = {
        date: this.queryParam.date
          ? this.queryParam.date.format
            ? this.queryParam.date.format('YYYY-MM-DD')
            : this.queryParam.date
          : null,
        page: this.pagination.current,
        pageSize: this.pagination.pageSize,
      }
      getWeeklyStatisticsList(body)
        .then((res) => {
          if (res.code === 200) {
            this.dataSource = res.data.records || []
            this.pagination.total = res.data.total || 0
          } else {
            this.$message.error(res.message || '加载数据失败')
          }
        })
        .catch((err) => {
          this.$message.error(err.message || '加载数据失败')
        })
        .finally(() => {
          this.loading = false
        })
    },
    showChart() {
      this.chartVisible = true
      this.$nextTick(() => {
        this.loadChartData()
      })
    },
    loadChartData() {
      getWeeklyStatisticsList({ page: -1, pageSize: -1 })
        .then((res) => {
          if (res.code === 200) {
            const allData = res.data.records || []
            this.initChart(allData)
          }
        })
        .catch(() => {})
    },
    initChart(dataSource) {
      if (!this.$refs.chartRef) return
      const chart = echarts.init(this.$refs.chartRef)
      const sortedData = [...dataSource].sort((a, b) => new Date(a.date) - new Date(b.date))
      const xData = sortedData.map((item) => item.date)
      const yData = sortedData.map((item) => item.amount)
      const option = {
        tooltip: {
          trigger: 'axis',
          formatter: '{b}<br/>金额: {c} 元',
        },
        xAxis: {
          type: 'category',
          data: xData,
          axisLabel: {
            rotate: 45,
          },
        },
        yAxis: {
          type: 'value',
          name: '金额(元)',
        },
        series: [
          {
            name: '金额',
            type: 'line',
            data: yData,
            smooth: true,
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(24, 144, 255, 0.4)' },
                { offset: 1, color: 'rgba(24, 144, 255, 0.1)' },
              ]),
            },
            lineStyle: {
              color: '#1890ff',
              width: 2,
            },
            itemStyle: {
              color: '#1890ff',
            },
          },
        ],
        grid: {
          left: '3%',
          right: '4%',
          bottom: '12%',
          containLabel: true,
        },
      }
      chart.setOption(option)
      window.addEventListener('resize', () => chart.resize())
    },
  },
  created() {
    this.loadData()
  },
}
</script>

<style scoped></style>
