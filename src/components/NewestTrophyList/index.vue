<template>
  <a-card style="width: 100%; border-radius: 16px">
    <div style="font-size: 20px; font-weight: bold; color: black; text-align: center">最新的奖杯</div>
    <a-list class="my-list" item-layout="vertical">
      <a-list-item v-for="(item, index) in listData" :key="index">
        <a-list-item-meta >
          <template slot="title">
            <div class="meta-wrapper">
              <div class="meta-title">{{ item.trophyName }}（{{item.trophyTitleName}}）</div>
              <div class="meta-lines">
                <div class="meta-sub">{{ item.trophyDetail }}</div>
                <div class="meta-sub">{{ item.earnedDateTime }}</div>
              </div>
            </div>
          </template>
          <img slot="avatar" style="width: 64px" :src="item.trophyIconUrl" />
        </a-list-item-meta>
        <template slot="extra">
              <img style="width: 50px; padding-top: 15%" :src="item.trophyTitleIconUrl" />
        </template>
      </a-list-item>
    </a-list>
  </a-card>
</template>
<script>
import { getLastTrophy } from '@/api/psn'

export default {
  name: 'NewestTrophyList',
  data() {
    return {
      listData: [],
    }
  },
  created() {
    getLastTrophy().then((res) => {
      this.listData = res.data
    })
  },
  methods: {},
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
  line-height: 12px;
}
.my-list .ant-list-item-meta-content {
  flex: initial !important;
  padding-top: 3px !important;
}
.my-list .ant-list-item-meta {
  margin-bottom: 0;
}

</style>
