<template>
  <a-card>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="股票名称">
              <a-select
                allowClear
                v-model="queryParam.stockId"
                show-search
                placeholder="请选择股票"
                :filter-option="filterOption"
                @change="handleChange"
              >
                <a-select-option v-for="stock in stockList" :key="stock.id" :value="stock.id">
                  {{ stock.shortName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="交易日期">
              <a-date-picker v-model="queryParam.tradeDate" style="width: 100%" />
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
    </div>

    <a-table
      :columns="columns"
      :dataSource="dataSource"
      bordered
      :pagination="pagination"
      @change="handlePageChange"
      :loading="loading"
    >
      <span slot="amount" slot-scope="text"> {{ text }} 元 </span>
      <span slot="stockName" slot-scope="text, record">
        {{ getStockName(text) }}
      </span>
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
          <a-form-item label="股票">
            <a-select show-search placeholder="请选择股票" :filter-option="filterOption" @change="addHandleChange">
              <a-select-option v-for="stock in stockList" :key="stock.id" :value="stock.id">
                {{ stock.shortName }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="交易日期">
            <a-date-picker v-model="editData.tradeDate" style="width: 100%" />
          </a-form-item>
          <a-form-item label="金额">
            <a-input-number v-model="editData.amount" :precision="4" :min="0" style="width: 100%" />
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
  </a-card>
</template>

<script>
import { getInvestmentList, createInvestment, updateInvestment, deleteInvestment } from '@/api/investment'
import { getStockList } from '@/api/stock'
import moment from 'moment'

export default {
  name: 'InvestmentRecords',
  data() {
    this.formLayout = {
      labelCol: { xs: { span: 24 }, sm: { span: 7 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 13 } },
    }
    return {
      visible: false,
      confirmLoading: false,
      modalTitle: '新建',
      isEdit: false,
      loading: false,
      stockList: [],
      queryParam: {
        stockId: undefined,
        tradeDate: null,
      },
      editData: {
        id: null,
        stockId: undefined,
        tradeDate: null,
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
          title: '股票名称',
          dataIndex: 'stockName',
          key: 'stockName',
          align: 'center',
          scopedSlots: { customRender: 'stockName' },
        },
        {
          title: '交易日期',
          dataIndex: 'tradeDate',
          key: 'tradeDate',
          align: 'center',
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
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    handleChange(value) {
      this.queryParam.stockId = value
    },
    addHandleChange(value) {
      console.log(value)
      this.editData.stockId = value
    },
    getStockName(id) {
      const stock = this.stockList.find((s) => s.stockId === id)
      return stock ? stock.name : id
    },
    handlePageChange(pagination) {
      this.pagination = { ...this.pagination, ...pagination }
      this.loadData()
    },
    handleSearch() {
      this.pagination.current = 1
      this.loadData()
    },
    handleReset() {
      this.queryParam = { stockId: undefined, tradeDate: null }
      this.pagination.current = 1
      this.loadData()
    },
    handleAdd() {
      this.modalTitle = '新建'
      this.isEdit = false
      this.editData = {
        id: null,
        stockId: undefined,
        tradeDate: null,
        amount: 0,
      }
      this.visible = true
    },
    handleEdit(record) {
      this.modalTitle = '编辑'
      this.isEdit = true
      this.editData = {
        ...record,
        tradeDate: record.tradeDate ? moment(record.tradeDate) : null,
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
        tradeDate: this.editData.tradeDate ? this.editData.tradeDate.format('YYYY-MM-DD') : null,
      }
      const action = this.isEdit ? updateInvestment(submitData) : createInvestment(submitData)
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
      deleteInvestment(id)
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
        stockId: this.queryParam.stockId,
        tradeDate: this.queryParam.tradeDate
          ? this.queryParam.tradeDate.format
            ? this.queryParam.tradeDate.format('YYYY-MM-DD')
            : this.queryParam.tradeDate
          : null,
        page: this.pagination.current,
        pageSize: this.pagination.pageSize,
      }
      // 调用改造后的 API：请求体传查询参数，分页放在 URL 的查询参数中
      getInvestmentList(body)
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
    loadStockList() {
      getStockList({ pageSize: 1000 })
        .then((res) => {
          if (res.code === 200) {
            this.stockList = res.data.records || []
          }
        })
        .catch(() => {})
    },
  },
  created() {
    this.loadData()
    this.loadStockList()
  },
}
</script>

<style scoped></style>
