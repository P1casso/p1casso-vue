<template>
  <div>
    <a-spin :spinning="spinning">
      <a-card :loading="loading" title="明细">
        <div class="salesCard">
          <a-table :columns="columns" :dataSource="this.dataList" size="middle" bordered>
            <span slot="icon" slot-scope="text, record, index">
              <span v-if="record.earned === 1">
                <img style="width: 50px; height: 50px; filter: grayscale(100%)" :src="record.trophyiconurl" />
              </span>
              <span v-else-if="record.earned === 0">
                <img style="width: 50px; height: 50px" :src="record.trophyiconurl" />
              </span>
            </span>
            <span slot="earned" slot-scope="text, record, index">
              <span v-if="record.earned === 0">
                <a-tag color="green"> 已获得</a-tag>
              </span>
              <span v-else-if="record.earned === 1">
                <a-tag color="orange"> 未获得</a-tag>
              </span>
            </span>
          </a-table>
        </div>
      </a-card>
    </a-spin>
  </div>
</template>

<script>
import { ChartCard } from '@/components'
import { baseMixin } from '@/store/app-mixin'
import request from '@/utils/request'

export default {
  name: 'Analysis',
  mixins: [baseMixin],
  components: { ChartCard },
  data() {
    return {
      loading: false,
      spinning: false,
      bronze: 0,
      silver: 0,
      gold: 0,
      platinum: 0,
      dataList: [],
      trophyGroup: {},
      columns: [
        {
          title: '',
          dataIndex: 'trophyiconurl',
          key: 'trophyiconurl',
          align: 'center',
          scopedSlots: { customRender: 'icon' },
        },
        {
          title: '奖杯',
          dataIndex: 'trophyname',
          key: 'trophyname',
          align: 'center',
        },
        {
          title: '奖杯内容',
          dataIndex: 'trophydetail',
          key: 'trophydetail',
          align: 'center',
        },
        {
          title: '状态',
          dataIndex: 'earned',
          key: 'earned',
          align: 'center',
          scopedSlots: { customRender: 'earned' },
        },
        {
          title: '获取时间',
          dataIndex: 'earneddatetime',
          key: 'earneddatetime',
          align: 'center',
        },
      ],
      query: {
        npCommunicationId: null,
        groupId: null,
      },
    }
  },
  created() {
    this.query.npCommunicationId = this.$route.query.id
    this.query.groupId = this.$route.query.groupId
    this.getTrophyListByNpCommunicationId()
    //this.getTrophyGroup()
  },
  methods: {
    // getTrophyGroup() {
    //   request({
    //     url: '/ps/trophy_group/' + this.id,
    //     method: 'GET',
    //   }).then((res) => {
    //     this.trophyGroup = res.data
    //   })
    // },

    getTrophyListByNpCommunicationId() {
      request({
        url: '/ps/trophy/list',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: this.query,
      }).then((res) => {
        this.dataList = res.data
      })
    },
  },
}
</script>

<style lang="less" scoped>
.container {
  padding-top: 55%;
}

.trophy {
  float: left;
  width: 25%;
  text-align: center;
}

.trophy-count {
  padding-top: 5%;
}
</style>
