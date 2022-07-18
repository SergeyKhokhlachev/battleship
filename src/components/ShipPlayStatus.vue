<template>
  <div :class="['ship-play-status', status]">
    <div class="ship-play-status__box">
      <template v-for="area in areas" :key="area.key">
        <div
          v-if="area.status === 'filled'"
          :class="['ship-play-status__area', { shot: area.shot }]"
        ></div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: "ShipPlayStatus",
  props: {
    areas: Array,
    status: String,
  },
  computed: {},
};
</script>

<style lang="scss" scoped>
.ship-play-status {
  display: flex;
  align-items: center;
  width: 100px;
  margin-bottom: 10px;
  &__box {
    display: flex;
  }
  &__area {
    width: 20px;
    height: 20px;
    margin-right: 1px;
    background-color: $color-sub;
  }
  &.damaged {
    .ship-play-status__area {
      &.shot {
        background-color: $color-main;
      }
    }
  }
  &.destroyed {
    .ship-play-status__area {
      &.shot {
        background-color: $color-main-active;
      }
    }
  }
  &--reverce {
    justify-content: flex-end;
  }
}
</style>
