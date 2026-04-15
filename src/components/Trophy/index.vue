<template>
  <div class="centered-box-outer">
    <div class="centered-box-inner">
      <img v-if="imgSrc" :src="imgSrc" alt="inner" :class="earned === 0 ? 'earned' : 'no-earned'" />
      <slot v-else />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Trophy',
  props: {
    earned: { type: Number, required: true },
    imgSrc: {
      type: String,
      default: '',
      require: true,
    },
  },
}
</script>

<style scoped>
.earned {
  border: 3px solid #61bf19;
}
.no-earned {
  border: 3px solid #cecfcf;
  opacity: 0.75;
}
.centered-box-outer {
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  overflow: hidden;
  background-color: #292b2d;
}

.centered-box-inner {
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.centered-box-inner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
</style>
