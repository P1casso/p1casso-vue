<template>
  <div>
    <a-row :gutter="16">
      <a-col :span="8">
        <div>
          <trophy-stats-card />
        </div>
        <div style="padding-top: 3%">
          <ps-game-career />
        </div>
        <div style="padding-top: 3%">
          <ps-last-play />
        </div>
      </a-col>

      <a-col :span="16">
        <div>
          <TrophyCalendar />
        </div>
        <div style="padding-top: 1%">
          <newest-trophy-list />
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import PsGameCareer from '@/components/PsGameCareer/index.vue'
import PsLastPlay from '@/components/PsLastPlay/index.vue'
import TrophyCalendar from '@/components/TrophyCalendar/index.vue'
import TrophyStatsCard from '@/components/TrophyStatsCard/index.vue'
import RarestTrophy from '@/components/NewestTrophyList/index.vue'
import TrophyList from '@/components/NewestTrophyList/index.vue'
import NewestTrophyList from '@/components/NewestTrophyList/index.vue'

export default {
  name: 'psGame',
  components: { NewestTrophyList, TrophyList, RarestTrophy, TrophyStatsCard, TrophyCalendar, PsLastPlay, PsGameCareer },
  data() {
    return {
      socket: null,
      loading: false,
      spinning: false,
    }
  },
}
</script>

<style lang="less" scoped>
.parent {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(5, 1fr);
  gap: 8px;
}

.div2 {
  grid-column-start: 1;
  grid-row-start: 2;
}

.div3 {
  grid-column-start: 1;
  grid-row-start: 3;
}

.div4 {
  grid-column: span 3 / span 3;
  grid-row: span 3 / span 3;
  grid-column-start: 2;
  grid-row-start: 1;
}
.div5 {
  grid-column: span 3 / span 3;
  grid-row: span 2 / span 2;
  grid-column-start: 2;
  grid-row-start: 4;
}
</style>
