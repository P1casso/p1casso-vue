<template>
  <div>
    <a-spin :spinning='spinning'>
      <a-row :gutter='24'>
        <a-col :sm='24' :md='12' :xl='6' :style="{ marginBottom: '24px' }">
          <chart-card :loading='loading' title='奖杯统计'>
            <div slot='content'>
              <div class='trophy'>
                <img
                  src='https://psnprofiles.com/lib/img/icons/40-platinum.png'
                  alt='白金'
                />
                <p class='trophy-count'>{{ this.platinum }}</p>
              </div>
              <div class='trophy'>
                <img src='https://psnprofiles.com/lib/img/icons/40-gold.png' />
                <p class='trophy-count'>{{ this.gold }}</p>
              </div>
              <div class='trophy'>
                <img
                  src='https://psnprofiles.com/lib/img/icons/40-silver.png'
                />
                <p class='trophy-count'>{{ this.silver }}</p>
              </div>
              <div class='trophy'>
                <img
                  src='https://psnprofiles.com/lib/img/icons/40-bronze.png'
                />
                <p class='trophy-count'>{{ this.bronze }}</p>
              </div>
            </div>
          </chart-card>
        </a-col>
      </a-row>

      <a-card
        :loading='loading'
        :title="1234567"
      >
        <div class='table-page-search-wrapper'>
          <a-form layout='inline'>
            <a-row :gutter='48'>
              <a-col :md='12' :sm='24'>
                <a-button type='primary' @click='refreshPage'
                >刷新页面
                </a-button>
                <a-button
                  type='primary'
                  style='margin-left: 8px'
                  @click='updateTrophySummary($event)'
                >更新奖杯统计数据
                </a-button>
                <a-button
                  type='primary'
                  style='margin-left: 8px'
                  @click='updateTrophyTitle($event)'
                >更新游戏列表
                </a-button>
                <a-button
                  type='primary'
                  style='margin-left: 8px'
                  @click='updateTrophyList($event)'
                >更新奖杯列表
                </a-button>
              </a-col>
            </a-row>
          </a-form>
        </div>

        <div class='salesCard'>
          <a-table
            :dataSource='dataSource'
            :columns='columns'
            bordered
            :rowKey='(dataSource) => dataSource.id'
          >
            <span slot='imgUrl' slot-scope='text, record, index'>
              <img style='width: 50px; height: 50px' :src='record.imgUrl' />
            </span>
            <span slot='platform' slot-scope='text, record, index'>
              <span v-if="text === 'PS4'">
                <img
                  style='width: 50px; height: 50px'
                  src='../../../src/assets/icons/icons8-ps4-50.svg'
                />
              </span>
              <span v-else-if="text === 'PS5'">
                <img
                  style='width: 50px; height: 50px'
                  src='../../../src/assets/icons/icons8-ps5-50.svg'
                />
              </span>
            </span>
            <span slot='isPlatinum' slot-scope='text, record, index'>
              <span v-if='text === 1'>
                <img
                  style='width: 50px; height: 50px'
                  src='https://psnprofiles.com/lib/img/icons/40-platinum.png'
                />
              </span>
              <span v-else-if='text === 0'>
                <img
                  style='width: 50px; height: 50px; filter: grayscale(100%)'
                  src='https://psnprofiles.com/lib/img/icons/40-platinum.png'
                />
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
      dataSource: [],
      pagination: {
        current: 1
      },
      columns: [
        {
          title: '游戏名称',
          dataIndex: 'name',
          key: 'name',
          align: 'left'
        },
        {
          title: '白金状态',
          dataIndex: 'isPlatinum',
          key: 'isPlatinum',
          scopedSlots: { customRender: 'isPlatinum' },
          align: 'center'
          // https://psnprofiles.com/lib/img/icons/40-platinum.png
        },
        {
          title: '平台',
          dataIndex: 'platform',
          key: 'platform',
          align: 'center',
          scopedSlots: { customRender: 'platform' }
        },
        {
          title: '铜',
          dataIndex: 'definedBronze',
          key: 'definedBronze',
          align: 'center'
        },
        {
          title: '银',
          dataIndex: 'definedSilver',
          key: 'definedSilver',
          align: 'center'
        },
        {
          title: '金',
          dataIndex: 'definedGold',
          key: 'definedGold',
          align: 'center'
        },
        {
          title: '白金',
          dataIndex: 'definedPlatinum',
          key: 'definedPlatinum',
          align: 'center'
        },
        {
          title: '操作',
          dataIndex:
            'operation',
          align:
            'center',
          customRender:
            (text, record) => {
              console.log(record)
              return (
                <span>
                  <a-button type="primary" onClick={() => this.getTrophyDetails(record.id)}>奖杯明细</a-button>
                </span>
              )
            }
        }
      ],
      bronze: 0,
      silver: 0,
      gold: 0,
      platinum: 0
    }
  },
  created() {
    this.getTableDate()
    this.getTrophyStatistics()
  },
  methods: {

    getTrophyDetails(id) {
      this.$router.push(
        {
          path: '/game/trophy_details',
          query: { id: id }
        })
    },

    /**
     *更新奖杯列表
     */
    updateTrophyList(e) {
      request({
        url: '/ps/trophy/update',
        method: 'GET'
      }).then((res) => {
        if (res.code === 200) {
          this.$message.success('已加入更新队列，数据更新可能需要几分钟')
        }
      })
      e.target.blur()
    },

    getTrophyStatistics() {
      request({
        url: '/ps/trophy_statistics',
        method: 'GET'
      }).then((res) => {
        this.bronze = res.data.bronze
        this.silver = res.data.silver
        this.gold = res.data.gold
        this.platinum = res.data.platinum
      })
    },

    updateTrophySummary(e) {
      this.spinning = true
      request({
        url: '/ps/refresh_trophy_statistics',
        method: 'GET'
      }).then((res) => {
        this.spinning = false
        if (res.code === 200) {
          this.$message.success('更新成功')
          this.getTrophyStatistics()
        } else {
          this.$message.error('更新失败')
        }
      })
      e.target.blur()
    },

    getTableDate() {
      request({
        url: '/ps/game_list',
        method: 'GET'
      }).then((res) => {
        res.data.forEach((item) => {
          if (item.id !== '0') {
            if (item.parentId === '0') {
              delete item.parentId
            }
            this.dataSource.push(item)
          }
        })
      })
    },

    updateTrophyTitle(e) {
      request({
        url: '/ps/trophy_titles',
        method: 'GET'
      }).then((res) => {
        if (res.code === 200) {
          this.$message.success('已加入更新队列，数据更新可能需要几分钟')
        }
      })
      e.target.blur()
    },

    refreshPage() {
      this.$router.go(0)
    }
  }
}
</script>

<style lang='less' scoped>
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
