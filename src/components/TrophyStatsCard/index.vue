<template>
  <a-card style="width: 100%; border-radius: 16px; overflow: hidden">
    <a-row class="center-row">
      <!-- 左侧 30% -->
      <a-col :span="6" class="center-col">
        <trophy-stats-card-level :trophy-level="this.trophyLevel" :tier="this.tier" />
      </a-col>
      <!-- 右侧 70% -->
      <a-col :span="18" class="progress">
        <a-row style="height: 100%">
          <!-- 上部 20% -->
          <a-col :span="24" style="height: 30%; text-align: right; width: 90%; float: right">
            <div style="float: left">等级进度</div>
            <div style="float: right">{{ this.trophyPoint }} / {{ this.trophyLevelNextPoint }}</div>

            <a-progress :percent="this.progress" size="small" />
          </a-col>

          <!-- 下部 80% -->
          <a-col :span="24" style="height: 70%">
            <!--            <div slot="content">-->
            <div style="padding-top: 5%">
              <div class="trophy">
                <img src="../../../src/assets/icons/40-platinum.png" class="trophy-image" alt="白金" />
                <p class="trophy-count">{{ this.platinum }}</p>
              </div>
              <div class="trophy">
                <img src="../../../src/assets/icons/40-gold.png" class="trophy-image" alt="金" />
                <p class="trophy-count">{{ this.gold }}</p>
              </div>
              <div class="trophy">
                <img src="../../../src/assets/icons/40-silver.png" class="trophy-image" alt="银" />
                <p class="trophy-count">{{ this.silver }}</p>
              </div>
              <div class="trophy">
                <img src="../../../src/assets/icons/40-bronze.png" class="trophy-image" alt="铜" />
                <p class="trophy-count">{{ this.bronze }}</p>
              </div>
            </div>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
    <a-divider />
    <a-row>
      <a-col :span="24">
        <div style="display: flex; justify-content: space-between; align-items: center">
          <div style="font-size: 18px; padding-left: 3%; font-weight: bold">状态：{{ this.syncProgress }}</div>
          <div style="padding-right: 3%"><a-button type="primary" @click="startSync">同步</a-button></div>
        </div>
      </a-col>
    </a-row>
  </a-card>
</template>
<script>
import { ChartCard } from '@/components'
import { getTrophySummary } from '@/api/psn'
import TrophyStatsCardLevel from '@/components/TrophyStatsCard/level.vue'
import request from '@/utils/request'

export default {
  name: 'TrophyStatsCard',
  components: { TrophyStatsCardLevel, ChartCard },
  data() {
    return {
      bronze: 0,
      silver: 0,
      gold: 0,
      platinum: 0,
      trophyLevel: 0,
      progress: 0,
      trophyPoint: 0,
      trophyLevelNextPoint: 0,
      tier: '1',
      taskId: 'task-' + Date.now(),
      syncProgress: '未同步',
    }
  },
  created() {
    getTrophySummary().then((res) => {
      this.bronze = res.data.bronze
      this.silver = res.data.silver
      this.gold = res.data.gold
      this.platinum = res.data.platinum
      this.trophyLevel = parseInt(res.data.trophyLevel)
      this.progress = parseInt(res.data.progress)
      this.trophyPoint = res.data.trophyPoint
      this.trophyLevelNextPoint = res.data.trophyLevelNextPoint
      this.tier = res.data.tier
    })
  },
  methods: {
    getTierImage(tier) {
      // 使用 require 动态导入本地图片
      return require(`../../../src/assets/tier/${tier}.png`)
    },
    startSync() {
      this.closeSocketIfExist()
      let wsUrl = ''
      // 判断环境
      if (process.env.NODE_ENV === 'development') {
        wsUrl = process.env.VUE_APP_WS_API
      } else {
        const host = window.location.host
        wsUrl = `ws://${host}/ws/progress`
      }
      this.socket = new WebSocket(wsUrl)
      this.socket.onopen = () => {
        return request({
          url: `/sync/start/${this.taskId}`,
          method: 'POST',
        }).then((res) => {
          if (res.code !== 200) {
            this.$message.error(res.message)
          }
        })
      }
      this.socket.onmessage = (event) => {
        this.syncProgress = event.data
      }
    },
    closeSocketIfExist() {
      if (this.socket) {
        this.socket.close()
        this.socket = null
      }
    },
  },
  beforeDestroy() {
    this.closeSocketIfExist()
  },
}
</script>

<style scoped lang="less">
.trophy {
  float: left;
  width: 25%;
  text-align: center;
  padding-left: 8%;
}

.trophy-image {
  width: 40px;
}

.trophy-count {
  padding-top: 5%;
}
.center-col {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  //height: 100%;            /* 父容器需要有高度时才有效 */
}
.center-row {
  display: flex;
  align-items: center; /* 垂直居中 */
}
</style>
