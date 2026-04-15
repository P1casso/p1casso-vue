<template>
  <a-card>
    <div style="font-size: 20px; color: black; font-weight: bold">游戏库</div>
    <a-card style="width: 100%" :bordered="false">
      <a-list class="my-list" item-layout="vertical" :split="false">
        <a-list-item v-for="(item, index) in dataSource" :key="index">
          <a-list-item-meta>
            <!-- 自定义标题区域 -->
            <template slot="title">
              <div class="meta-wrapper">
                <div class="meta-title" style="cursor: pointer" @click="jumpToGame(item)">
                  {{ item.trophyTitleName }}
                </div>
                <div class="meta-lines">
                  <div class="meta-sub">游玩时长：{{ item.playDuration }}</div>
                  <div class="meta-sub">最后游玩：{{ item.lastPlayedDateTime }}</div>
                </div>
              </div>
            </template>
            <template slot="avatar">
              <div style="padding-top: 15%">
                <img style="width: 80px; border-radius: 12px" :src="item.trophyTitleIconUrl" />
              </div>
            </template>
            <template slot="description">
              <a-progress
                :percent="
                  parseInt(
                    (
                      ((item.earnedPlatinum + item.earnedGold + item.earnedSilver + item.earnedBronze) /
                        (item.definedPlatinum + item.definedGold + item.definedSilver + item.definedBronze)) *
                      100
                    ).toFixed(0)
                  )
                "
                style="width: calc(70vw - 160px)"
            /></template>
          </a-list-item-meta>
          <template slot="extra">
            <div style="padding-top: 25%">
              <div style="text-align: center">
                <img
                  v-if="item.earnedPlatinum === item.definedPlatinum"
                  src="../../../src/assets/icons/40-platinum.png"
                  style="width: 30px"
                />
                <img
                  v-else
                  src="../../../src/assets/icons/40-platinum.png"
                  style="width: 30px; filter: grayscale(100%)"
                />
              </div>
              <div style="padding-bottom: 10px">
                {{ item.earnedPlatinum + item.earnedGold + item.earnedSilver + item.earnedBronze }}🏆 /
                {{ item.definedPlatinum + item.definedGold + item.definedSilver + item.definedBronze }}🏆
              </div>
            </div>
          </template>
        </a-list-item>
      </a-list>
    </a-card>
  </a-card>
</template>
<script>
import { getGameList } from '@/api/psn'

export default {
  name: 'GameList',
  data() {
    return {
      dataSource: [],
    }
  },
  created() {
    getGameList().then((res) => {
      if (res.code === 200) {
        this.dataSource = res.data
      }
    })
  },
  methods: {
    jumpToGame(item) {
      this.$router.push({
        name: 'GameDetails',
        params: item,
      })
      console.log()
    },
  },
}
</script>

<style>
.meta-wrapper {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-top: 1%;
}

.meta-title {
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;
}

.meta-lines {
  display: flex;
  flex-direction: column;
  gap: 1px;
  width: 100%; /* 关键点：内容区域扩展 */
}

.meta-progress {
  width: 100%; /* 进度条跟随容器宽度 */
  margin-top: 8px;
}

.meta-sub {
  font-size: 12px;
  color: #8c8c8c;
  line-height: 16px;
}

.my-list .ant-list-item-meta-content {
  flex: initial !important;
  padding-top: 3px !important;
}

.my-list .ant-list-item-meta {
  margin-bottom: 0;
}
</style>
