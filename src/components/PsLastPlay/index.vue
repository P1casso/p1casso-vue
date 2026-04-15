<template>
  <a-card style="width: 100%; border-radius: 16px">
    <div style="font-size: 20px; font-weight: bold; color: black; text-align: center; padding-bottom: 5%">最近游玩</div>
    <a-list item-layout="vertical" :split="false">
      <a-list-item v-for="(item, index) in listData" :key="index">
        <a-list-item-meta>
          <!-- 自定义标题区域 -->
          <template slot="title">
            <div class="meta-wrapper">
              <div class="meta-title">{{ item.trophyTitleName }}</div>
              <div class="meta-lines">
                <div class="meta-sub">游玩时长：{{ item.playDuration }}</div>
                <div class="meta-sub">最后游玩：{{ item.lastPlayedDateTime }}</div>
              </div>
            </div>
          </template>
          <img slot="avatar" style="width: 64px; border-radius: 12px" :src="item.trophyTitleIconUrl" />
        </a-list-item-meta>
      </a-list-item>
    </a-list>
  </a-card>
</template>

<script>
import { getLastPlay } from '@/api/psn'
import { flex } from 'stylelint-order/rules/shorthandData'

export default {
  name: 'PsLastPlay',
  methods: {
    flex() {
      return flex
    },
  },
  data() {
    return {
      listData: [],
    }
  },
  created() {
    getLastPlay().then((res) => {
      this.listData = res.data || []
    })
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
}

.meta-sub {
  font-size: 12px;
  color: #8c8c8c;
  line-height: 16px;
}
</style>
