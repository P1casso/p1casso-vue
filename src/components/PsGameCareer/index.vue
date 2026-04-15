<template>
  <a-card style="width: 100%; border-radius: 16px; overflow: hidden">
    <div style="font-size: 20px; color: black; font-weight: bold; text-align: center; padding-bottom: 1%">生涯统计</div>
      <a-col :span="24" style="height: 70%; padding-top: 3%; align-items: center">
        <div class="trophy">
          <img style="height: 50px" src="../../../src/assets/icons/fast-time.png" />
          <div>游戏总时长</div>
          <div style="text-align: center; font-size: 20px; font-weight: bold">{{ this.playTime }}</div>
        </div>
        <div class="trophy">
          <img style="height: 50px" src="../../../src/assets/icons/1k.png" class="trophy-image" alt="白金" />
          <div>游戏总数</div>
          <div style="font-size: 20px; font-weight: bold">{{ this.gameNum }}</div>
        </div>
        <div class="trophy">
          <img style="height: 50px" src="../../../src/assets/icons/platinum-comic.png" class="trophy-image" alt="白金" />
          <div>白金数量</div>
          <div style="font-size: 20px; font-weight: bold">{{ this.platinumNum }}</div>
        </div>
      </a-col>

  </a-card>
</template>
<script>
import { getGameCareer } from '@/api/psn'

export default {
  name: 'psGameCareer',
  data() {
    return {
      playTime: '',
      gameNum: 0,
      platinumNum: 0,
    }
  },
  created() {
    getGameCareer().then((res) => {
      this.playTime = res.data.playTime
      this.gameNum = res.data.gameNum
      this.platinumNum = res.data.platinumNum
    })
  },
}
</script>

<style scoped lang="less">
.trophy {
  float: left;
  width: 33%;
  text-align: center;
}
</style>
