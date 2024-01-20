<template>
  <a-card>
    <div class='table-page-search-wrapper'>
      <a-form layout='inline'>
        <a-row :gutter='48'>
          <a-col :md='4' :sm='24'>
            <a-form-item label='游戏名称'>
              <a-input v-model='queryParam.id' placeholder='' />
            </a-form-item>
          </a-col>
          <a-col :md='4' :sm='24'>
            <a-form-item label='游戏平台'>
              <a-select v-model='queryParam.status' placeholder='请选择' default-value='0'>
                <a-select-option value='0'>Steam</a-select-option>
                <a-select-option value='1'>PS5</a-select-option>
                <a-select-option value='3'>XBOX</a-select-option>
                <a-select-option value='4'>Epic</a-select-option>
                <a-select-option value='5'>EA</a-select-option>
                <a-select-option value='6'>暴雪</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <!--          <a-col :md='6' :sm='24'>-->
          <!--            <a-form-item label='更新日期'>-->
          <!--              <a-date-picker v-model='queryParam.date' style='width: 100%' placeholder='请输入更新日期' />-->
          <!--            </a-form-item>-->
          <!--          </a-col>-->
          <a-col :md='6' :sm='24'>
            <a-button type='primary' @click='this.getGamePlanList'>查询</a-button>
            <a-button style='margin-left: 8px' @click='() => this.queryParam = {}'>重置</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class='table-operator'>
      <a-button type='primary' icon='plus' @click='addButtonClick()'>新建</a-button>
    </div>


    <a-table
      :columns='columns'
      :dataSource='dataSource'
      bordered
      :pagination='pagination'
      @change='handlePageChange'
    >
      <span slot='isPlatinum' slot-scope='text, record, index'>
        <span v-if='text == 1' style='color: green;font-weight: bolder'>
          <a-tag color='#00CD00'>是</a-tag>
        </span>
        <span v-else-if='text == 0' style='color: red;'>
          <a-tag color='#FF0000'>否</a-tag>
        </span>
      </span>
      <span slot='gamesPlatform' slot-scope='text, record, index'>
        <span v-if='text == 0' style='color: green;font-weight: bolder'>
       <img src='../../../src/assets/icons/steam.svg' alt='SVG Image' style='width: 32px;height: 32px'>
        </span>
        <span v-else-if='text == 1' style='color: red;'>
       <img src='../../../src/assets/icons/PS5.svg' alt='SVG Image' style='width: 32px;height: 32px'>
        </span>
         <span v-else-if='text == 3' style='color: red;'>
       <img src='../../../src/assets/icons/xbox.svg' alt='SVG Image' style='width: 32px;height: 32px'>
        </span>
        <span v-else-if='text == 4' style='color: red;'>
       <img src='../../../src/assets/icons/epic.svg' alt='SVG Image' style='width: 32px;height: 32px'>
        </span>
        <span v-else-if='text == 6' style='color: red;'>
          <img src='../../../src/assets/icons/battle-net.svg' alt='SVG Image' style='width: 32px;height: 32px'>
        </span>
        </span>

    </a-table>

    <a-modal
      :title='this.modalTitle'
      :width='640'
      :visible='visible'
      :confirmLoading='loading'
      @cancel='modalCancel'
      @ok='editAndAddGame'
    >
      <a-spin :spinning='loading'>
        <a-form v-bind='formLayout'>

          <a-form-item label='游戏名称'>
            <a-input v-model:value='editData.name' />
          </a-form-item>
          <a-form-item label='游戏平台'>
            <a-select v-model='editData.gamesPlatform'>
              <a-select-option value='0'>Steam</a-select-option>
              <a-select-option value='1'>PS5</a-select-option>
              <a-select-option value='3'>XBOX</a-select-option>
              <a-select-option value='4'>Epic</a-select-option>
              <a-select-option value='5'>EA</a-select-option>
              <a-select-option value='6'>暴雪</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label='开始游玩日期'>
            <a-date-picker v-model:value='editData.playStartDate' />
          </a-form-item>
          <a-form-item label='通关日期'>
            <a-date-picker v-model:value='editData.dateOfClearance' />
          </a-form-item>
          <a-form-item label='全成就/白金日期'>
            <a-date-picker v-model:value='editData.platinumDate' />
          </a-form-item>

          <a-form-item label='是否打算全成就/白金'>
            <a-select
              v-model='editData.isPlanPlatinum'
            >
              <a-select-option value='0'>否</a-select-option>
              <a-select-option value='1'>是</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label='是否全成就/白金'>
            <a-select
              v-model='editData.isPlatinum'
            >
              <a-select-option value='0'>否</a-select-option>
              <a-select-option value='1'>是</a-select-option>
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
import { exchangeCodeForAccessToken1, exchangeNpssoForCode } from '@/api/psn-api'
import { exchangeRefreshTokenForAuthTokens } from 'psn-api'


export default {
  name: 'gameList',
  components: { Ellipsis, STable },
  data() {
    this.formLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      }
    }
    return {
      visible: false,
      loading: false,
      queryParam: {
        id: null,
        status: null,
        date: null
      },
      editData: {
        id: null,
        name: null,
        gamesPlatform: null,
        playStartDate: null,
        dateOfClearance: null,
        isPlanPlatinum: null,
        platinumDate: null,
        isPlatinum: null
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
              let newVar = (this.pagination.current - 1) * this.pagination.pageSize + index + 1
              return newVar
            }

          }
        },
        {
          title: '游戏名称',
          dataIndex: 'name',
          key: 'name',
          align: 'center'

        },
        {
          title: '游戏平台',
          dataIndex: 'gamesPlatform',
          key: 'gamesPlatform',
          align: 'center',
          scopedSlots: { customRender: 'gamesPlatform' }
        },
        {
          title: '开始游玩日期',
          dataIndex: 'playStartDate',
          key: 'playStartDate',
          align: 'center'
        },
        {
          title: '通关日期',
          dataIndex: 'dateOfClearance',
          key: 'dateOfClearance',
          align: 'center'
        },
        {
          title: '是否计划全成就/白金',
          dataIndex: 'isPlanPlatinum',
          key: 'isPlanPlatinum',
          align: 'center',
          customRender: (text) => {
            if (text == 1) {
              return '是'
            }
            if (text == 0) {
              return '否'
            }
          }
        },
        {
          title: '是否全成就/白金',
          dataIndex: 'isPlatinum',
          key: 'isPlatinum',
          align: 'center',
          scopedSlots: { customRender: 'isPlatinum' }

        },
        {
          title: '全成就/白金日期',
          dataIndex: 'platinumDate',
          key: 'platinumDate',
          align: 'center'
        },
        {
          title: '操作',
          dataIndex: 'operation',
          align: 'center',
          customRender: (text, record, index) => {
            return (
              <span>
  <a-button type="primary" onClick={() => this.editButtonClick(index, '编辑')}>编辑</a-button>
  <span style={{ marginRight: '10px' }}></span>
  <a-button type="danger" onClick={() => this.deleteButtonClick(record.id)}>删除</a-button>
</span>

            )
          }
        }
      ],
      dataSource: [],
      modalTitle: null,
      pagination: {
        current: 1
      }
    }
  },
  methods: {
    handlePageChange(e) {

      this.pagination = e
    },

    editButtonClick(index, title) {
      this.modalTitle = title
      this.editData = { ...this.dataSource[10 * (this.pagination.current - 1) + index] }
      this.visible = true
    },

    modalCancel() {
      this.visible = false
    },

    getGamePlanList() {
      request({
        url: '/game/plan_list',
        method: 'GET'
      }).then(res => {
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
        isPlatinum: null
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
            'Content-Type': 'application/json;charset=UTF-8'
          }
        }).then(res => {
          if (res.code === 200) {
            this.visible = false
            this.getGamePlanList()
          }
        })
      } else {
        request({
          url: '/game/edit/plan',
          method: 'POST',
          data: JSON.stringify(this.editData),
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        }).then(res => {
          if (res.code === 200) {
            this.visible = false
            this.getGamePlanList()
          }
        })
      }
    },
    deleteButtonClick(id) {
      // request({
      //   url: '/game/plan/delete/' + id,
      //   method: 'POST'
      // }).then(res => {
      //   if (res.code === 200) {
      //     this.visible = false
      //     this.getGamePlanList()
      //   }
      // })
    },
    async loginToPSN() {
      let accessCode = await exchangeNpssoForCode()
      console.log('accessCode')
      console.log(accessCode)
      let authorization = await exchangeCodeForAccessToken1(accessCode)
      console.log('authorization')
      console.log(authorization)
      exchangeRefreshTokenForAuthTokens
      // const queryString = new URLSearchParams({
      //   access_type: "offline",
      //   client_id: "09515159-7237-4370-9b40-3806e67c0891",
      //   redirect_uri: "com.scee.psxandroid.scecompcall://redirect",
      //   response_type: "code",
      //   scope: "psn:mobile.v2.core psn:clientapp"
      // }).toString();
      //
      // const requestUrl = `/sony/api/authz/v3/oauth/authorize?${queryString}`;
      // const { headers: responseHeaders } = await fetch(requestUrl, {
      //   headers: {
      //     Cookie: `npsso=q06uE7HQgxrCxO2t4OSnzlEUTEwgwbkHYtykGz8z8iGgXLh5RdIiB9d8KRd5bTNI`
      //   },
      //   redirect: "manual"
      // });
    }

  },

  created() {
    this.getGamePlanList()
    this.loginToPSN()
  }

}
</script>

<style scoped>

</style>