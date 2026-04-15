<template>
  <div class="level">
    <img :src="getTierImage(tier)" alt="tier" />
    <div class="level-text" style="">Lv.{{ this.trophyLevel }}</div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TrophyStatsCardLevel',
  props: {
    tier: {
      type: String,
      default: '1',
    },
    trophyLevel: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  data() {
    return {}
  },
  methods: {
    getTierImage(tier) {
      // 使用 require 动态导入本地图片
      return require(`../../../src/assets/tier/${tier}.png`)
    },
  },
})
</script>

<style scoped lang="less">
.level {
  //height: 100px;
  display: flex;
  flex-direction: column; /* 让图片和文字上下排列 */
  //justify-content: center; /* 垂直居中 */
  align-items: center; /* 水平居中 */
}
.level-text {
  font-size: 25px;
  font-weight: bold;
}

.level img {
  width: 55px; /* 可根据需要调整大小 */
  height: 55px;
  object-fit: contain;
}
</style>
