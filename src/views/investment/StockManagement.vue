<template>
  <a-card>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="股票名称">
              <a-input v-model="queryParam.name" placeholder="" :allowClear="true" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
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
          <a-form-item label="股票名称">
            <a-input v-model="editData.name" />
          </a-form-item>
          <a-form-item label="股票简称">
            <a-input v-model="editData.shortName" />
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
  </a-card>
</template>

<script>
import { getStockList, createStock, updateStock, deleteStock } from '@/api/stock'

export default {
  name: 'StockManagement',
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
      queryParam: {
        stockId: '',
      },
      editData: {
        id: null,
        stockId: '',
        stockName: '',
        stockCode: '',
        remark: '',
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
          title: 'ID',
          dataIndex: 'id',
          key: 'id',
          align: 'center',
        },
        {
          title: '股票名称',
          dataIndex: 'name',
          key: 'name',
          align: 'center',
        },
        {
          title: '股票简称',
          dataIndex: 'shortName',
          key: 'shortName',
          align: 'center',
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
        pageSize: 10,
        total: 0,
      },
    }
  },
  methods: {
    handlePageChange(pagination) {
      this.pagination = { ...this.pagination, ...pagination }
      this.loadData()
    },
    handleSearch() {
      this.pagination.current = 1
      this.loadData()
    },
    handleReset() {
      this.queryParam = { stockId: '' }
      this.pagination.current = 1
      this.loadData()
    },
    handleAdd() {
      this.modalTitle = '新建'
      this.isEdit = false
      this.editData = {
        id: null,
        stockId: '',
        stockName: '',
        stockCode: '',
        remark: '',
      }
      this.visible = true
    },
    handleEdit(record) {
      this.modalTitle = '编辑'
      this.isEdit = true
      this.editData = { ...record }
      this.visible = true
    },
    handleModalCancel() {
      this.visible = false
    },
    handleModalOk() {
      this.confirmLoading = true
      const action = this.isEdit ? updateStock(this.editData) : createStock(this.editData)
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
      deleteStock(id)
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
      getStockList({ ...this.queryParam, ...this.pagination })
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
  },
  created() {
    this.loadData()
  },
}
</script>

<style scoped></style>
