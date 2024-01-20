<template>
  <a-table bordered :columns='columns' :data-source='data'>
  </a-table>
</template>

<script>
import { getNeedMonitorList } from '@/api/setting'

export default {
  name: 'NeedMonitor',
  data() {
    return {
      columns: [
        {
          title: '主键Id',
          dataIndex: 'id',
          key: 'id',
          align: 'center'
        },
        {
          title: '饰品Id',
          dataIndex: 'ornamentsId',
          key: 'ornamentsId',
          align: 'center'
        }

      ],
      data: []
    }
  },
  methods: {
    getData() {
      getNeedMonitorList().then(res => {
        console.log(res)
      })
    }
  },

  created() {
    this.getData()
  }
}
</script>

<style scoped>

</style>