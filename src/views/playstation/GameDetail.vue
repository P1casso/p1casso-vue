<template>
  <div>
    <div style="text-align: center">
      <img :src="this.item.trophyTitleIconUrl" style="width: 100px" alt="trophyTitleIconUrl" />
      <div style="font-size: 25px; padding-top: 1%; color: black; font-weight: bold">
        {{ this.item.trophyTitleName }}
      </div>
    </div>
    <div style="padding-top: 2%">
      <a-card class="card">
        <a-row>
          <a-col :sm="6" :xs="24">
            <info title="首次游玩" :value="this.item.firstPlayedDateTime" :bordered="true" />
          </a-col>
          <a-col :sm="6" :xs="24">
            <info title="最后一次游玩" :value="this.item.lastPlayedDateTime" :bordered="true" />
          </a-col>
          <a-col :sm="6" :xs="24">
            <info title="游玩次数" :value="this.item.playCount" :bordered="true" />
          </a-col>
          <a-col :sm="6" :xs="24">
            <info title="游玩时常" :value="this.item.playDuration" />
          </a-col>
        </a-row>
      </a-card>
    </div>
    <div style="padding-top: 2%">
      <a-card class="card">
        <a-row>
          <a-col :sm="6" :xs="24">
            <TrophyInfo :img="platinumImg" :value="`${this.item.earnedPlatinum}/${this.item.definedPlatinum}`" />
          </a-col>
          <a-col :sm="6" :xs="24">
            <TrophyInfo :img="goldImg" :value="`${this.item.earnedGold}/${this.item.definedGold}`" />
          </a-col>
          <a-col :sm="6" :xs="24">
            <TrophyInfo :img="silverImg" :value="`${this.item.earnedSilver}/${this.item.definedSilver}`" />
          </a-col>
          <a-col :sm="6" :xs="24">
            <TrophyInfo :img="bronzeImg" :value="`${this.item.earnedBronze}/${this.item.definedBronze}`" />
          </a-col>
        </a-row>
      </a-card>
    </div>
    <div style="display: flex; flex-direction: column; align-items: center; padding-top: 3%">
      <!-- 标题靠左 -->
      <div style="font-size: 25px; color: black; width: 70%; text-align: left">奖杯组</div>

      <!-- 内容居中 -->
      <div style="padding-top: 1%; width: 70%">
        <a-collapse expandIconPosition="right" v-model="activeKey">
          <a-collapse-panel v-for="(item, index) in group" :key="item.trophyGroupId">
            <!-- 折叠面板头部 -->
            <template slot="header">
              <div style="display: flex; align-items: center">
                <img :src="item.trophyGroupIconUrl" alt="icon" style="width: 40px" />
                <div style="display: flex; flex-direction: column; padding-left: 8px">
                  <div>{{ item.trophyGroupName }}</div>
                  <div>
                    <img :src="platinumImg" width="10px" />{{ item.earnedPlatinum }}/{{ item.definedPlatinum }} &nbsp;
                    <img :src="goldImg" width="10px" />{{ item.earnedGold }}/{{ item.definedGold }} &nbsp;
                    <img :src="silverImg" width="10px" />{{ item.earnedSilver }}/{{ item.definedSilver }} &nbsp;
                    <img :src="bronzeImg" width="10px" />{{ item.earnedBronze }}/{{ item.definedBronze }}
                  </div>
                </div>
              </div>
            </template>
            <!-- 每个 panel 自己管理 tab -->
            <a-tabs v-model="activeKeys[index]">
              <a-tab-pane key="1" tab="全部">
                <trophy-list :data-list="getFilteredList(item.trophyList, '1')" />
              </a-tab-pane>
              <a-tab-pane key="2" tab="未获得">
                <trophy-list :data-list="getFilteredList(item.trophyList, '2')" />
              </a-tab-pane>
              <a-tab-pane key="3" tab="已获得">
                <trophy-list :data-list="getFilteredList(item.trophyList, '3')" />
              </a-tab-pane>
            </a-tabs>
          </a-collapse-panel>
        </a-collapse>
      </div>
    </div>
  </div>
</template>
<script>
import Info from '@/components/Info/Info.vue'
import TrophyInfo from '@/components/Info/TrophyInfo.vue'
import { getTrophyListByNpCommunicationId } from '@/api/psn'
import { Collapse } from 'ant-design-vue'
import Vue from 'vue'
import TrophyList from '@/components/TrophyList/index.vue'

Vue.use(Collapse)
export default {
  name: 'GameDetail',
  components: { TrophyList, TrophyInfo, Info, Collapse },
  data() {
    return {
      item: {},
      group: [],
      platinumImg: require('../../assets/icons/40-platinum.png'),
      goldImg: require('../../assets/icons/40-gold.png'),
      silverImg: require('../../assets/icons/40-silver.png'),
      bronzeImg: require('../../assets/icons/40-bronze.png'),
      activeKey: 'default',
      activeKeys: [],
    }
  },
  mounted() {
    // 初始化每个 panel 的 tab 为 “全部”
  },
  methods: {
    // 根据 tab key 筛选
    getFilteredList(list, tabKey) {
      if (!Array.isArray(list)) return []
      let filtered
      if (tabKey === '2') {
        filtered = list.filter((t) => t.earned === 1)
      } else if (tabKey === '3') {
        // 已获得
        filtered = list.filter((t) => t.earned === 0)
        // 仅已获得排序：最近获得的在前
        filtered.sort((a, b) => {
          const timeA = a.earnedDateTime ? new Date(a.earnedDateTime).getTime() : 0
          const timeB = b.earnedDateTime ? new Date(b.earnedDateTime).getTime() : 0
          return timeB - timeA
        })
      } else {
        // 全部
        filtered = list
      }
      // 全部
      return filtered
    },
  },
  created() {
    //获取传来的params
    this.item = this.$route.params
    getTrophyListByNpCommunicationId(this.item.npCommunicationId).then((res) => {
      if (res.code === 200) {
        this.group = res.data
        this.activeKeys = this.group.map(() => '1')
      }
    })
  },
}
</script>

<style>
.card {
  border-radius: 16px;
  width: 50%;
  margin: 0 auto;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}
.my-list .ant-list-item-meta-content {
  flex: initial !important;
  padding-top: 3px !important;
}
.my-list .ant-list-item-meta {
  margin-bottom: 0;
}
</style>
