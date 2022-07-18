<template>
  <div class="battele-play">
    <div
      v-for="(area, key) in areas"
      :data-key="key"
      :class="['battele-play__area', area.status, { shot: area.shot }]"
      :key="key"
      @click="shot(key)"
    ></div>
  </div>
</template>

<script>
export default {
  name: "BattelePlay",
  props: {
    areas: Object,
  },
  methods: {
    shot(key) {
      this.$emit("shotKey", key);
    },
  },
};
</script>

<style lang="scss" scoped>
.battele-play {
  display: grid;
  grid-auto-rows: 1fr;
  grid-template-columns: repeat(10, 40px);
  grid-template-rows: repeat(10, 40px);
  gap: 0px 0px;
  &__area {
    display: flex;
    align-items: center;
    justify-content: center;
    color: $text-color-muted;
    transition: background-color 0.2s ease-in-out;
    cursor: pointer;
    &:before {
      content: "X";
      font-size: 1.2rem;
      opacity: 0;
      transition: opacity 0.2s ease-in-out;
    }
    &.filled {
      background-color: $color-sub;
    }
    &.shot {
      background-color: rgba($color: $color-sub, $alpha: 0.1);
      cursor: default;
      &:before {
        opacity: 1;
      }
      &.filled {
        color: $color-disabled;
        background-color: $color-main;
      }
    }
  }
  &--vue {
    .battele-play__area {
      cursor: default;
      &.filled {
        background-color: $color-sub;
      }
    }
  }
}
</style>
