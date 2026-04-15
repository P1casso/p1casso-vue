<template>
  <a-spin :spinning="spinning">
    <a-card :loading="loading" title="日志列表">
      <div class="salesCard">
        <a-table :dataSource="dataSource" :columns="columns" bordered :rowKey="(dataSource) => dataSource.id">
          <span slot="type" slot-scope="text, record, index">
            <span v-if="record.type === '0'">
              <a-tag color="blue"> 操作开始</a-tag>
            </span>
            <span v-else-if="record.type === '1'">
              <a-tag color="green"> 操作完成</a-tag>
            </span>
            <span v-else-if="record.type === '3'">
              <a-tag color="orange"> 操作失败</a-tag>
            </span>
          </span>
        </a-table>
      </div>
    </a-card>
  </a-spin>
</template>
<script>
import request from '@/utils/request'

export default {
  name: 'log',
  data() {
    return {
      spinning: false,
      columns: [
        {
          title: '日志类型',
          dataIndex: 'type',
          key: 'type',
          align: 'center',
          scopedSlots: { customRender: 'type' },
        },
        {
          title: '信息',
          dataIndex: 'message',
          key: 'message',
          align: 'center',
        },
        {
          title: '时间',
          dataIndex: 'createTime',
          key: 'createTime',
          align: 'center',
        },
      ],
      dataSource: [],
    }
  },

  created() {
    this.getDate()
  },

  methods: {
    getDate() {
      request({
        url: '/log/list',
        method: 'GET',
      }).then((res) => {
        this.dataSource = res.data
      })
    },
  },
}
</script>

<style scoped lang="less"></style>
