<template>
  <a-card>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="12">
            <a-form-item label="皮肤名称">
              <a-input v-model="skinName" placeholder="" />
            </a-form-item>
          </a-col>
          <div class="table-operator">
            <a-button type="primary" icon="search" @click="getListeningSkinList">查询</a-button>
            <a-button type="primary" icon="plus" @click="insertModel.visible = true">新建</a-button>
          </div>
        </a-row>
      </a-form>
    </div>

    <a-table :columns="columns" :dataSource="dataSource" bordered :rowKey="(record) => record.id">
      <span slot="skinIconUrl" slot-scope="text, record, index">
        <img :src="text" alt="SVG Image" style="width: 60px; height: 60px" />
      </span>
      <span slot="rarity" slot-scope="text, record, index">
        <span v-if="text === '军规级'">
          <a-tag color="#4b69ff">军规级</a-tag>
        </span>
        <span v-else-if="text === '受限'">
          <a-tag color="#8847ff">受限</a-tag>
        </span>
        <span v-else-if="text === '保密'">
          <a-tag color="#d32ce6">保密</a-tag>
        </span>
        <span v-else-if="text === '隐秘'">
          <a-tag color="#eb4b4b">隐秘</a-tag>
        </span>
      </span>
      <span slot="operation" slot-scope="text, record, index">
        <span>
          <a-popconfirm title="确定删除该记录吗？" ok-text="是" cancel-text="否" @confirm="deleteSkin(record.id)">
            <a-button type="danger">删除</a-button>
          </a-popconfirm>
        </span>
      </span>
    </a-table>

    <a-modal
      title="新建监听"
      :width="300"
      :visible="insertModel.visible"
      :confirmLoading="insertModel.confirmLoading"
      @cancel="insertModelCancel"
      @ok="insertListening"
    >
      <a-row>
        <a-col :span="24">
          <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="皮肤id">
            <a-input v-model="skinId" name="skinId" />
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-modal>
  </a-card>
</template>

<script>
import request from '@/utils/request'
import { addTrackSkin, deleteTrackingSkin, getListeningSkinList } from '@/api/csSink'

export default {
  name: 'SkinTracking',
  data() {
    return {
      skinName: '',
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      skinId: '',
      form: this.$form.createForm(this),
      insertModel: {
        visible: false,
        confirmLoading: false,
      },
      columns: [
        {
          title: '皮肤名称',
          dataIndex: 'skinName',
          key: 'skinName',
          align: 'center',
        },
        {
          title: '图片',
          dataIndex: 'skinIconUrl',
          key: 'skinIconUrl',
          align: 'center',
          scopedSlots: { customRender: 'skinIconUrl' },
        },
        {
          title: '类别',
          dataIndex: 'category',
          key: 'category',
          align: 'center',
        },
        {
          title: '磨损',
          dataIndex: 'exterior',
          key: 'exterior',
          align: 'center',
        },
        {
          title: '类别',
          dataIndex: 'quality',
          key: 'quality',
          align: 'center',
        },
        {
          title: '品质',
          dataIndex: 'rarity',
          key: 'rarity',
          align: 'center',
          scopedSlots: { customRender: 'rarity' },
        },
        {
          title: '操作',
          dataIndex: 'operation',
          align: 'center',
          scopedSlots: { customRender: 'operation' },
        },
      ],
      dataSource: [],
    }
  },
  methods: {
    getListeningSkinList() {
      let params = {}
      if (!_.isEmpty(this.skinName)) {
        params.skinName = this.skinName
      }
      getListeningSkinList(params).then((res) => {
        this.dataSource = res.data.records
      })
    },

    insertModelCancel() {
      this.insertModel.visible = false
      this.skinId = ''
    },

    insertListening(e) {
      e.preventDefault()
      this.form.validateFields((errors) => {
        if (!errors) {
          addTrackSkin.then((res) => {
            if (res.code === 200) {
              this.$message.success('新增成功')
              this.insertModelCancel()
              this.getListeningSkinList()
            } else {
              this.$message.error(res.message)
            }
          })
        }
      })
    },

    //删除监听的皮肤
    deleteSkin(id) {
      deleteTrackingSkin(id).then((res) => {
        if (res.code === 200) {
          this.$message.success('删除成功')
          this.getListeningSkinList()
        } else {
          this.$message.error('删除失败：' + res.message)
        }
      })
    },
  },

  created() {
    this.getListeningSkinList()
  },
}
</script>

<style lang="scss" scoped></style>
