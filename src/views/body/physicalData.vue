<template>
  <a-card>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="日期">
              <a-range-picker v-model:value="queryParam.date" />
            </a-form-item>
          </a-col>

        </a-row>
      </a-form>
    </div>
    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="addButtonClick()">新建</a-button>
      <a-button type="primary" icon="stock" @click="compare()" :disabled="!compareButtonDisable">比较</a-button>
    </div>

    <a-table
      :columns="columns"
      :dataSource="dataSource"
      rowKey="id"
      bordered
      :pagination="pagination"
      @change="handlePageChange"
      :row-selection="{  onChange: onSelectChange }"
    >
      <template slot="action" slot-scope="text, record, index">
        <a @click="editButtonClick(index, '编辑')">编辑</a>
        <a-divider type="vertical" />
        <a-popconfirm
          title="确定删除改条码吗？"
          ok-text="是"
          cancel-text="否"
          @confirm="deleteData(record.id)"
        >
          <a href="#">删除</a>
        </a-popconfirm>

      </template>
    </a-table>

    <a-modal
      :title="this.modalTitle"
      :width="1200"
      :visible="visible"
      :confirmLoading="loading"
      @cancel="modalCancel"
      @ok="insertOrEditDate"
    >
      <a-form-model ref="form">

        <a-row>
          <a-col :span="8">
            <a-form-model-item label="测量时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="measurementTime">
              <a-date-picker v-model:value="editData.measurementTime" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="体重" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="weight">
              <a-input v-model="editData.weight" placeholder="请输入体重"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="胸围" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="chestCircumference">
              <a-input v-model="editData.chestCircumference" placeholder="请输入胸围"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="左臂围" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="leftArmCircumference">
              <a-input v-model="editData.leftArmCircumference" placeholder="请输入臂围"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="右臂围" :labelCol="labelCol" :wrapperCol="wrapperCol"
                               prop="rightArmCircumference">
              <a-input v-model="editData.rightArmCircumference" placeholder="请输入臂围"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="左大腿围" :labelCol="labelCol" :wrapperCol="wrapperCol"
                               prop="leftThighCircumference">
              <a-input v-model="editData.leftThighCircumference" placeholder="请输入大腿围"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="右大腿围" :labelCol="labelCol" :wrapperCol="wrapperCol"
                               prop="rightThighCircumference">
              <a-input v-model="editData.rightThighCircumference" placeholder="请输入大腿围"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="左小腿围" :labelCol="labelCol" :wrapperCol="wrapperCol"
                               prop="leftCalfCircumference">
              <a-input v-model="editData.leftCalfCircumference" placeholder="请输入小腿围"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="右小腿围" :labelCol="labelCol" :wrapperCol="wrapperCol"
                               prop="rightCalfCircumference">
              <a-input v-model="editData.rightCalfCircumference" placeholder="请输入小腿围"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="体脂率" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="bodyFatPercentage">
              <a-input v-model="editData.bodyFatPercentage" placeholder="请输入体脂率"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="内脂" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="visceralFat">
              <a-input v-model="editData.visceralFat" placeholder="请输入内脂"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="肌肉量" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="muscleMass">
              <a-input v-model="editData.muscleMass" placeholder="请输入肌肉量"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="BMI" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="bmi">
              <a-input v-model="editData.bmi" placeholder="请输入BMI"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="身体含水量" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="bodyWater">
              <a-input v-model="editData.bodyWater" placeholder="请输入身体含水量"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="基础代谢" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="basalMetabolicRate">
              <a-input v-model="editData.basalMetabolicRate" placeholder="请输入基础代谢"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-modal>
  </a-card>
</template>
<script>

import { addBodyData, deleteBodyData, editBodyData, getBodyData } from '@/api/bodyData'
import { message } from 'ant-design-vue'

export default {
  components: {},
  name: 'physicalData',
  data() {
    return {
      selectedRowKeys: 0,
      selectedRows: [],
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      modalTitle: '',
      editData: {
        id: '',
        measurementTime: '',
        weight: 0,
        chestCircumference: 0,
        leftArmCircumference: 0,
        rightArmCircumference: 0,
        leftThighCircumference: 0,
        rightThighCircumference: 0,
        leftCalfCircumference: 0,
        rightCalfCircumference: 0,
        bodyFatPercentage: 0,
        visceralFat: 0,
        muscleMass: 0,
        bmi: 0,
        bodyWater: 0,
        basalMetabolicRate: 0
      },
      visible: false,
      loading: false,
      queryParam: {
        date: null
      },
      columns: [
        {
          title: '序号',
          dataIndex: 'index',
          key: 'index',
          align: 'center',
          customRender: (text, record, index) => {
            if (!this.pagination.pageSize) {
              return index + 1
            } else {
              return (this.pagination.current - 1) * this.pagination.pageSize + index + 1
            }
          }
        },
        {
          title: '测量时间',
          dataIndex: 'measurementTime',
          key: 'measurementTime',
          align: 'center'
        },
        {
          title: '体重',
          dataIndex: 'weight',
          key: 'weight',
          align: 'center',
          customRender: (text) => {
            if (text) {
              return text + 'KG'
            } else {
              return '/'
            }
          }
        },
        {
          title: '胸围',
          dataIndex: 'chestCircumference',
          key: 'chestCircumference',
          align: 'center',
          customRender: (text) => {
            if (text) {
              return text + 'CM'
            } else {
              return '/'
            }
          }
        },
        {
          title: '左臂围',
          dataIndex: 'leftArmCircumference',
          key: 'leftArmCircumference',
          align: 'center',
          customRender: (text) => {
            if (text) {
              return text + 'CM'
            } else {
              return '/'
            }
          }
        },
        {
          title: '右臂围',
          dataIndex: 'rightArmCircumference',
          key: 'rightArmCircumference',
          align: 'center',
          customRender: (text) => {
            if (text) {
              return text + 'CM'
            } else {
              return '/'
            }
          }
        },
        {
          title: '左大腿围',
          dataIndex: 'leftThighCircumference',
          key: 'leftThighCircumference',
          align: 'center',
          customRender: (text) => {
            if (text) {
              return text + 'CM'
            } else {
              return '/'
            }
          }
        },
        {
          title: '右大腿围',
          dataIndex: 'rightThighCircumference',
          key: 'rightThighCircumference',
          align: 'center',
          customRender: (text) => {
            if (text) {
              return text + 'CM'
            } else {
              return '/'
            }
          }
        },
        {
          title: '左小腿围',
          dataIndex: 'leftCalfCircumference',
          key: 'leftCalfCircumference',
          align: 'center',
          customRender: (text) => {
            if (text) {
              return text + 'CM'
            } else {
              return '/'
            }
          }
        },
        {
          title: '右小腿围',
          dataIndex: 'rightCalfCircumference',
          key: 'rightCalfCircumference',
          align: 'center',
          customRender: (text) => {
            if (text) {
              return text + 'CM'
            } else {
              return '/'
            }
          }
        },
        {
          title: '体脂率',
          dataIndex: 'bodyFatPercentage',
          key: 'bodyFatPercentage',
          align: 'center',
          customRender: (text) => {
            if (text) {
              return text + '%'
            } else {
              return '/'
            }
          }
        },
        {
          title: '内脂',
          dataIndex: 'visceralFat',
          key: 'visceralFat',
          align: 'center',
          customRender: (text) => {
            if (text) {
              return text
            } else {
              return '/'
            }
          }
        },
        {
          title: '肌肉量',
          dataIndex: 'muscleMass',
          key: 'muscleMass',
          align: 'center',
          customRender: (text) => {
            if (text) {
              return text + 'KG'
            } else {
              return '/'
            }
          }
        },
        {
          title: 'BMI',
          dataIndex: 'bmi',
          key: 'bmi',
          align: 'center',
          customRender: (text) => {
            if (text) {
              return text
            } else {
              return '/'
            }
          }
        },
        {
          title: '身体含水量',
          dataIndex: 'bodyWater',
          key: 'bodyWater',
          align: 'center',
          customRender: (text) => {
            if (text) {
              return text + 'kg'
            } else {
              return '/'
            }
          }
        },
        {
          title: '基础代谢',
          dataIndex: 'basalMetabolicRate',
          key: 'basalMetabolicRate',
          align: 'center',
          customRender: (text) => {
            if (text) {
              return text + 'KCAL'
            } else {
              return '/'
            }
          }
        },
        {
          title: '操作',
          dataIndex: 'operation',
          align: 'center',
          scopedSlots: { customRender: 'action' }
          // customRender: (text, record, index) => {
          //   return (
          //     <span>
          //       <a-button type="primary" onClick={() => this.editButtonClick(index, '编辑')}>编辑</a-button>
          //       <span style={{ marginRight: '10px' }}></span>
          //       <a-button type="danger" onClick={() => this.openDeleteConfirmButton(record.id)}>删除</a-button>
          //     </span>
          //   )
          // }
        }

      ],
      dataSource: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10
      }

    }
  },

  computed: {
    compareButtonDisable() {
      return this.selectedRowKeys >= 2
    }
  },

  created() {
    this.loadData()
  },
  methods: {
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys.length
      this.selectedRows = selectedRows
    },

    deleteData(id) {
      deleteBodyData(id).then(res => {
        if (res.code === 200) {
          message.success('删除成功')
          this.loadData()
        } else {
          message.error('删除失败')
        }

      })
    },

    editButtonClick(index) {
      this.modalTitle = '编辑'
      this.editData = {
        ...this.dataSource[10 * (this.pagination.current - 1) + index]
      }
      this.visible = true
    },

    //换页
    handlePageChange(e) {
      this.pagination = e
      this.loadData()
    },

    //加载数据
    loadData() {
      let parameter = {
        pageSize: this.pagination.pageSize,
        pageNo: this.pagination.current
      }
      getBodyData(parameter).then(res => {
        if (res.code === 200) {
          this.dataSource = res.data.records
          this.pagination.total = res.data.total
        }
      })
    },

    modalCancel() {
      this.visible = false
    },

    addButtonClick() {
      this.modalTitle = '新增'
      this.visible = true
    },

    insertOrEditDate() {
      if (this.editData.id === '') {
        addBodyData(this.editData).then(res => {
          if (res.code === 200) {
            this.visible = false
            message.success('新建成功')
            this.loadData()
          } else {
            message.error('新建失败')
          }
        })
      } else {
        editBodyData(this.editData).then(res => {
          if (res.code === 200) {
            this.visible = false
            this.loadData()
            message.success('修改成功')
          } else {
            message.error('修改失败')
          }
        })
      }
      this.editData = Object.assign({}, this.$options.data().editData)
    },
    compare() {
      this.$router.push({
        name: 'PhysicalDataCompare',
        query: this.selectedRows
      })
    }
  }
}
</script>


<style scoped lang="less">
</style>