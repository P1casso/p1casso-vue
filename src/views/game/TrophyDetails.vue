<template>
  <div>
    <a-spin :spinning="spinning">
      <a-row :gutter="24">
        <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
          <chart-card :loading="loading" title="奖杯">
            <div slot="content">
              <div class="trophy">
                <img
                  src="https://psnprofiles.com/lib/img/icons/40-platinum.png"
                  alt="白金"
                />
                <p class="trophy-count">
                  {{ this.trophyGroup.earnedplatinum }}/{{this.trophyGroup.definedplatinum }}
                </p>
              </div>
              <div class="trophy">
                <img src="https://psnprofiles.com/lib/img/icons/40-gold.png" />
                <p class="trophy-count">
                  {{ this.trophyGroup.earnedgold }}/{{this.trophyGroup.definedgold }}
                </p>
              </div>
              <div class="trophy">
                <img
                  src="https://psnprofiles.com/lib/img/icons/40-silver.png"
                />
                <p class="trophy-count">
                  {{ this.trophyGroup.earnedsilver }}/{{this.trophyGroup.definedsilver }}
                </p>
              </div>
              <div class="trophy">
                <img
                  src="https://psnprofiles.com/lib/img/icons/40-bronze.png"
                />
                <p class="trophy-count">
                  {{ this.trophyGroup.earnedbronze }}/{{this.trophyGroup.definedbronze }}
                </p>
              </div>
            </div>
          </chart-card>
        </a-col>
      </a-row>

      <a-card
        :loading="loading"
        :title="$t('dashboard.analysis.online-top-search')"
      >
        <div class="salesCard">
          <a-table
            :columns="columns"
            :dataSource="this.dataList"
            size="middle"
            bordered
          >
            <span slot="icon" slot-scope="text, record, index">
              <span v-if="record.earned === 1">
                <img
                  style="width: 50px; height: 50px; filter: grayscale(100%)"
                  :src="record.trophyiconurl"
                />
              </span>
              <span v-else-if="record.earned === 0">
                <img
                  style="width: 50px; height: 50px"
                  :src="record.trophyiconurl"
                />
              </span>
            </span>
          </a-table>
        </div>
      </a-card>
    </a-spin>
  </div>
</template>

<script>
import { ChartCard } from "@/components";
import { baseMixin } from "@/store/app-mixin";
import request from "@/utils/request";

export default {
  name: "Analysis",
  mixins: [baseMixin],
  components: { ChartCard },
  data() {
    return {
      id: null,
      loading: false,
      spinning: false,
      bronze: 0,
      silver: 0,
      gold: 0,
      platinum: 0,
      dataList: [],
      trophyGroup: {},
      columns: [
        {
          title: "",
          dataIndex: "trophyiconurl",
          key: "trophyiconurl",
          align: "center",
          scopedSlots: { customRender: "icon" },
        },
        {
          title: "奖杯",
          dataIndex: "trophyname",
          key: "trophyname",
          align: "center",
        },
        {
          title: "奖杯内容",
          dataIndex: "trophydetail",
          key: "trophydetail",
          align: "center",
        },
      ],
    };
  },
  created() {
    this.id = this.$route.query.id;
    this.getTrophyListByNpCommunicationId();
    this.getTrophyGroup();
  },
  methods: {
    getTrophyGroup() {
      request({
        url: "/ps/trophy_group/" + this.id,
        method: "GET",
      }).then((res) => {
        this.trophyGroup = res.data;
      });
    },

    getTrophyListByNpCommunicationId() {
      request({
        url: "/ps/trophy/trophy_list/" + this.id,
        method: "GET",
      }).then((res) => {
        this.dataList = res.data;
      });
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  padding-top: 55%;
}

.trophy {
  float: left;
  width: 25%;
  text-align: center;
}

.trophy-count {
  padding-top: 5%;
}
</style>
