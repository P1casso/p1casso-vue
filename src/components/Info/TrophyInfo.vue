<template>
  <div class="header-info">
    <img style="width: 25px" :src="img" alt="img" />
    <p>{{ value }}</p>
    <em v-if="bordered" />
  </div>
</template>

<script>
export default {
  name: 'TrophyInfo',
  props: {
    img: {
      type: String ,
      required: true,
    },
    value: {
      type: String,
      default: '',
    },
    bordered: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="less" scoped>
@import '~ant-design-vue/es/style/themes/default.less';

.header-info {
  position: relative;
  text-align: center;
  & > p {
    padding-top: 10px;
    margin: 0;
    font-size: 20px;
    line-height: 20px;
  }
  & > em {
    position: absolute;
    top: 0;
    right: 0;
    width: 1px;
    height: 56px;
    background-color: @border-color-split;
  }
}
</style>
