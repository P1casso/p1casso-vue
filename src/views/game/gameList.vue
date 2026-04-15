<template>
  <a-card>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="4" :sm="24">
            <a-form-item label="游戏名称">
              <a-input v-model="queryParam.name" placeholder="" :allowClear="true" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item label="游戏平台">
              <a-select v-model="queryParam.gamesPlatform" placeholder="请选择" default-value="0" :allowClear="true">
                <a-select-option value="0">Steam</a-select-option>
                <a-select-option value="1">PS5</a-select-option>
                <a-select-option value="3">XBOX</a-select-option>
                <a-select-option value="7">Switch</a-select-option>
                <a-select-option value="4">Epic</a-select-option>
                <a-select-option value="5">EA</a-select-option>
                <a-select-option value="6">暴雪</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-button type="primary" @click="this.getGamePlanList">查询</a-button>
            <a-button style="margin-left: 8px" @click="() => (this.queryParam = {})">重置</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="addButtonClick()">新建</a-button>
    </div>

    <a-table :columns="columns" :dataSource="dataSource" bordered :pagination="pagination" @change="handlePageChange">
      <span slot="isPlatinum" slot-scope="text, record, index">
        <span v-if="text === '1'">
          <a-tag color="green"> 是</a-tag>
        </span>
        <span v-else-if="text === '0'">
          <a-tag color="orange"> 否</a-tag>
        </span>
        <span v-else> / </span>
      </span>
      <span slot="isPlanPlatinum" slot-scope="text, record, index">
        <span v-if="text === '1'">
          <a-tag color="green"> 是</a-tag>
        </span>
        <span v-else-if="text === '0'">
          <a-tag color="orange"> 否</a-tag>
        </span>
        <span v-else> / </span>
      </span>
      <span slot="platinumDate" slot-scope="text, record, index">

        <span v-if="record.gamesPlatform == '7'">/</span>
        <span v-else>{{text}}</span>
      </span>

      <span slot="gamesPlatform" slot-scope="text, record, index">
        <span v-if="text == 0" style="color: green; font-weight: bolder">
          <img src="../../../src/assets/icons/steam.svg" alt="SVG Image" style="width: 32px; height: 32px" />
        </span>
        <span v-else-if="text == 1" style="color: red">
          <img src="../../../src/assets/icons/PS5.svg" alt="SVG Image" style="width: 32px; height: 32px" />
        </span>
        <span v-else-if="text == 3" style="color: red">
          <img src="../../../src/assets/icons/xbox.svg" alt="SVG Image" style="width: 32px; height: 32px" />
        </span>
        <span v-else-if="text == 4" style="color: red">
          <img src="../../../src/assets/icons/epic.svg" alt="SVG Image" style="width: 32px; height: 32px" />
        </span>
        <span v-else-if="text == 6" style="color: red">
          <img src="../../../src/assets/icons/battle-net.svg" alt="SVG Image" style="width: 32px; height: 32px" />
        </span>
        <span v-else-if="text == 7" style="color: red">
          <img src="../../../src/assets/icons/switch.svg" alt="SVG Image" style="width: 32px; height: 32px" />
        </span>
      </span>
      <span slot="operation" slot-scope="text, record, index">
        <span>
          <a-button type="primary" @click="editButtonClick(index, '编辑')">编辑</a-button>
          <span style="margin-right: 10px"></span>
          <a-popconfirm title="确定删除该记录吗？" ok-text="是" cancel-text="否" @confirm="deleteGame(record.id)">
            <a-button type="danger">删除</a-button>
          </a-popconfirm>
        </span>
      </span>
    </a-table>

    <a-modal
      :title="this.modalTitle"
      :width="640"
      :visible="visible"
      :confirmLoading="loading"
      @cancel="modalCancel"
      @ok="editAndAddGame"
    >
      <a-spin :spinning="loading">
        <a-form v-bind="formLayout">
          <a-form-item label="游戏名称">
            <a-input v-model:value="editData.name" />
          </a-form-item>
          <a-form-item label="游戏平台">
            <a-select v-model="editData.gamesPlatform">
              <a-select-option value="0">Steam</a-select-option>
              <a-select-option value="1">PS5</a-select-option>
              <a-select-option value="3">XBOX</a-select-option>
              <a-select-option value="7">Switch</a-select-option>
              <a-select-option value="4">Epic</a-select-option>
              <a-select-option value="5">EA</a-select-option>
              <a-select-option value="6">暴雪</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="开始游玩日期">
            <a-date-picker v-model:value="editData.playStartDate" />
          </a-form-item>
          <a-form-item label="通关日期">
            <a-date-picker v-model:value="editData.dateOfClearance" />
          </a-form-item>
          <a-form-item label="全成就/白金日期">
            <a-date-picker v-if="editData.gamesPlatform === '7'" disabled />
            <a-date-picker v-else v-model:value="editData.platinumDate" />
          </a-form-item>

          <a-form-item label="是否打算全成就/白金">
            <a-select v-if="editData.gamesPlatform === '7'" disabled />
            <a-select v-else v-model="editData.isPlanPlatinum">
              <a-select-option value="0">否</a-select-option>
              <a-select-option value="1">是</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="是否全成就/白金">
            <a-select v-if="editData.gamesPlatform === '7'" disabled />
            <a-select v-else v-model="editData.isPlatinum">
              <a-select-option value="0">否</a-select-option>
              <a-select-option value="1">是</a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
  </a-card>
</template>

<script>
import { Ellipsis, STable } from '@/components'
import request from '@/utils/request'

export default {
  name: 'gameList',
  components: { Ellipsis, STable },
  data() {
    this.formLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 },
      },
    }
    return {
      deleteConfirmVisible: false,
      deleteId: null,
      visible: false,
      loading: false,
      queryParam: {
        name: '',
        gamesPlatform: '',
      },
      editData: {
        id: null,
        name: null,
        gamesPlatform: null,
        playStartDate: null,
        dateOfClearance: null,
        isPlanPlatinum: null,
        platinumDate: null,
        isPlatinum: null,
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
          },
        },
        {
          title: '游戏名称',
          dataIndex: 'name',
          key: 'name',
          align: 'center',
        },
        {
          title: '游戏平台',
          dataIndex: 'gamesPlatform',
          key: 'gamesPlatform',
          align: 'center',
          scopedSlots: { customRender: 'gamesPlatform' },
        },
        {
          title: '开始游玩日期',
          dataIndex: 'playStartDate',
          key: 'playStartDate',
          align: 'center',
        },
        {
          title: '通关日期',
          dataIndex: 'dateOfClearance',
          key: 'dateOfClearance',
          align: 'center',
        },
        {
          title: '是否计划全成就/白金',
          dataIndex: 'isPlanPlatinum',
          key: 'isPlanPlatinum',
          align: 'center',
          scopedSlots: { customRender: 'isPlanPlatinum' },
        },
        {
          title: '是否全成就/白金',
          dataIndex: 'isPlatinum',
          key: 'isPlatinum',
          align: 'center',
          scopedSlots: { customRender: 'isPlatinum' },
        },
        {
          title: '全成就/白金日期',
          dataIndex: 'platinumDate',
          key: 'platinumDate',
          align: 'center',
          scopedSlots: { customRender: 'platinumDate' },
        },
        {
          title: '操作',
          dataIndex: 'operation',
          align: 'center',
          scopedSlots: { customRender: 'operation' },
        },
      ],
      dataSource: [],
      modalTitle: null,
      pagination: {
        current: 1,
      },
    }
  },
  methods: {
    handlePageChange(e) {
      this.pagination = e
    },

    editButtonClick(index, title) {
      this.modalTitle = title
      this.editData = {
        ...this.dataSource[10 * (this.pagination.current - 1) + index],
      }
      this.visible = true
    },

    modalCancel() {
      this.visible = false
    },

    getGamePlanList() {
      console.log(this.queryParam)
      request({
        url: '/game/plan_list',
        method: 'POST',
        data: JSON.stringify(this.queryParam),
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
      }).then((res) => {
        this.dataSource = res.data
      })
    },

    addButtonClick() {
      this.modalTitle = '新建'
      this.editData = {
        id: null,
        name: null,
        gamesPlatform: null,
        dateOfClearance: null,
        isPlanPlatinum: null,
        isPlatinum: null,
      }
      this.visible = true
    },

    editAndAddGame() {
      if (this.editData.id === null) {
        request({
          url: '/game/add/plan',
          method: 'POST',
          data: JSON.stringify(this.editData),
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
          },
        }).then((res) => {
          if (res.code === 200) {
            this.visible = false
            this.$message.success('添加成功')
            this.getGamePlanList()
          } else {
            this.$message.error(res.message)
          }
        })
      } else {
        request({
          url: '/game/edit/plan',
          method: 'POST',
          data: JSON.stringify(this.editData),
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
          },
        }).then((res) => {
          if (res.code === 200) {
            this.visible = false
            this.getGamePlanList()
            this.$message.success('修改成功')
          } else {
            this.$message.error(res.message)
          }
        })
      }
    },

    deleteGame(id) {
      request({
        url: '/game/plan/delete/' + id,
        method: 'POST',
      }).then((res) => {
        if (res.code === 200) {
          this.deleteConfirmVisible = false
          this.getGamePlanList()
          this.$message.success('删除成功')
        } else {
          this.$message.error(res.message)
        }
      })
    },
  },

  created() {
    this.getGamePlanList()
  },
}
</script>

<style scoped></style>
