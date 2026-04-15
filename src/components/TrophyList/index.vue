<template>
  <a-list :bordered="true">
    <a-list-item
      v-for="(trophy, index) in dataList"
      :key="index"
      :class="trophy.earnedDateTime !== null ? 'earned-item' : null"
    >
      <a-list-item-meta :description="trophy.trophyDetail">
        <div slot="title" style="color: #4486c6">{{ trophy.trophyName }}</div>
        <trophy slot="avatar" :img-src="trophy.trophyIconUrl" :bg-color="'#61bf19'" :earned="trophy.earned" />
      </a-list-item-meta>
      <div class="list-content" v-if="trophy.earnedDateTime!=null">
        <div class="list-content-item separator left" style="padding-top: 5px">
            <p style="color: #579428; font-size: 15px">{{ trophy.earnedDateTime }}</p>
        </div>
      </div>
      <div class="list-content">
        <div class="list-content-item separator left" style="padding-top: 5px; padding-right: 10px">
          <div style="width: 40px">
            <img style="width: 40px" v-if="trophy.trophyType === 0" src="../../../src/assets/icons/ultraRare.svg" />
            <img style="width: 40px" v-if="trophy.trophyType === 1" src="../../../src/assets/icons/veryRare.svg" />
            <img style="width: 40px" v-if="trophy.trophyType === 2" src="../../../src/assets/icons/rare.svg" />
            <img style="width: 40px" v-else src="../../../src/assets/icons/common.svg" />
            <p>{{ trophy.trophyEarnedRate.toFixed(2) }}%</p>
          </div>
        </div>
        <div class="list-content-item separator left">
          <img
            style="width: 35px"
            v-if="trophy.trophyType === 'platinum'"
            src="../../../src/assets/icons/40-platinum.png"
          />
          <img style="width: 35px" v-if="trophy.trophyType === 'gold'" src="../../../src/assets/icons/40-gold.png" />
          <img
            style="width: 35px"
            v-if="trophy.trophyType === 'silver'"
            src="../../../src/assets/icons/40-silver.png"
          />
          <img
            style="width: 35px"
            v-if="trophy.trophyType === 'bronze'"
            src="../../../src/assets/icons/40-bronze.png"
          />
        </div>
      </div>
    </a-list-item>
  </a-list>
</template>
<script>
import Trophy from '@/components/Trophy/index.vue'

export default {
  name: 'TrophyList',
  components: { Trophy },
  props: {
    dataList: {
      type: Array,
      required: true,
    },
  },
}
</script>

<style lang="less" scoped>
.list-content-item {
  color: rgba(0, 0, 0, 0.45);
  display: inline-block;
  vertical-align: middle;
  font-size: 14px;
  span {
    line-height: 20px;
  }
  p {
    margin-bottom: 0;
    line-height: 22px;
  }
}

.earned-item {
  background-color: #ecf8ea;
}

.no-earned-item {
  opacity: 0.7;
  transition: opacity 0.3s;
}

.no-earned-item:hover {
  opacity: 1;
}
</style>
