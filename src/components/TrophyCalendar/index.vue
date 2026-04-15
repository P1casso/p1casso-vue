<template>
  <a-card style="width: 100%; border-radius: 16px; overflow: hidden">
    <div style="font-size: 20px; color: black; font-weight: bold; text-align: center; padding-bottom: 1%">奖杯统计</div>
    <div class="year-container">
      <a-button @click="prevYear">前一年</a-button>
      <div class="year-text">{{ year }}年</div>
      <a-button :disabled="this.checkNextYear" @click="nextYear">下一年</a-button>
    </div>
    <div style="padding-top: 3%">
      <a-row :gutter="[16, 24]">
        <a-col v-for="(month, index) in dataList" :key="index" :xs="12" :sm="8" :md="6" :lg="4">
          <a-card
            :body-style="{ padding: '12px' }"
            style="border-radius: 16px; text-align: center; background: rgba(240, 240, 240, 0.5)"
            :class="{
              'empty-month': month.platinum === 0 && month.gold === 0 && month.silver === 0 && month.bronze === 0,
            }"
          >
            <!-- 月份 -->
            <div style="font-size: 18px; font-weight: 600; margin-bottom: 8px">{{ month.month }}月</div>
            <!-- 白金卡 -->
            <div class="platinum-box" :class="{ active: month.platinum !== 0 }">
              <img src="../../../src/assets/icons/40-platinum.png" style="height: 35px" />
              <div style="font-size: 20px; font-weight: bold; margin-top: 6px">{{ month.platinum }}</div>
            </div>

            <!-- 金银铜 -->
            <div style="display: flex; justify-content: center; gap: 30px">
              <div style="text-align: center">
                <img src="../../../src/assets/icons/40-bronze.png" style="width: 20px" />
                <div style="font-weight: 600">{{ month.bronze }}</div>
              </div>
              <div style="text-align: center">
                <img src="../../../src/assets/icons/40-silver.png" style="width: 20px" />
                <div style="font-weight: 600">{{ month.silver }}</div>
              </div>
              <div style="text-align: center">
                <img src="../../../src/assets/icons/40-gold.png" style="width: 20px" />
                <div style="font-weight: 600">{{ month.gold }}</div>
              </div>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </a-card>
</template>
<script>
import { ChartCard } from '@/components'
import { getGameCalendar } from '@/api/psn'
import TrophyStatsCardLevel from '@/components/TrophyStatsCard/level.vue'

export default {
  name: 'TrophyCalendar',
  components: { TrophyStatsCardLevel, ChartCard },
  data() {
    return {
      year: new Date().getFullYear(),
      // year: 2024,
      dataList: [],
    }
  },
  created() {
    this.getDate()
  },
  computed: {
    checkNextYear() {
      return new Date().getFullYear() === this.year
    },
  },
  methods: {
    getDate() {
      getGameCalendar(this.year).then((res) => {
        this.dataList = res.data
      })
    },
    nextYear() {
      this.year++
      this.getDate()
    },
    prevYear() {
      this.year--
      this.getDate()
    },
  },
}
</script>

<style scoped lang="less">
.year-container {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  gap: 20px; /* 三个元素之间的间距 */
}

.year-text {
  font-weight: bold;
  font-size: 18px;
}
.active-card {
  border: 2px solid #1890ff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}
/* 高亮卡片效果 */
.active-card {
  border: 2px solid #1890ff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.platinum-box {
  border-radius: 16px;
  padding: 8px 0;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: white;
}
.platinum-box.active {
  background: rgba(230, 245, 255, 0.8);
  box-shadow: 0 0 8px rgba(80, 140, 255, 0.4);
}

.empty-month {
  filter: grayscale(80%);
  opacity: 0.6;
  transition: 0.3s;
}
</style>
