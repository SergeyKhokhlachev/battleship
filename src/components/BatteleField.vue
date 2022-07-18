<template>
  <div class="battele-field">
    <div class="battele-field__legend battele-field__legend--axisX">
      <div v-for="item in axis" :key="item" class="battele-field__cell">
        {{ item.y }}
      </div>
    </div>
    <div class="battele-field__legend battele-field__legend--axisY">
      <div v-for="item in axis" :key="item" class="battele-field__cell">
        {{ item.x }}
      </div>
    </div>
    <div class="battele-field__wrap">
      <div class="battele-field__table">
        <div v-for="item in 100" class="battele-field__cell" :key="item"></div>
      </div>
      <div class="battele-field__vue">
        <slot name="default"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import { axisLegend } from "@enum";

export default {
  name: "BatteleField",
  data() {
    return {
      axis: axisLegend,
    };
  },
};
</script>

<style lang="scss" scoped>
.battele-field {
  display: grid;
  grid-auto-rows: 1fr;
  grid-template-columns: repeat(11, 30px);
  grid-template-rows: repeat(11, 30px);
  gap: 0px 0px;
  @include respond(screen-xxl) {
    grid-template-columns: repeat(11, 40px);
    grid-template-rows: repeat(11, 40px);
  }
  &__wrap {
    position: relative;
    grid-column: 2 / 12;
    grid-row: 2 / 12;
    outline: 1px solid $color-sub;
  }
  &__legend {
    &--axisX {
      display: flex;
      justify-content: space-between;
      grid-column: 2 / 12;
      grid-row: 1 / 1;
    }
    &--axisY {
      grid-column: 1 / 1;
      grid-row: 2 / 12;
    }
  }
  &__cell {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 30px;
    height: 30px;
    @include respond(screen-xxl) {
      width: 40px;
      height: 40px;
    }
  }
  &__table {
    display: grid;
    grid-auto-rows: 1fr;
    grid-template-columns: repeat(10, 30px);
    grid-template-rows: repeat(10, 30px);
    gap: 0;
    @include respond(screen-xxl) {
      grid-template-columns: repeat(10, 40px);
      grid-template-rows: repeat(10, 40px);
    }
    .battele-field__cell {
      outline: 1px solid rgba($color: $color-sub, $alpha: 0.1);
    }
  }
  &__vue {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
  &--reverce {
    .battele-field__wrap {
      grid-column: 1 / 11;
      grid-row: 2 / 12;
    }
    .battele-field__legend {
      &--axisX {
        grid-column: 1 / 11;
        grid-row: 1 / 1;
      }
      &--axisY {
        grid-column: 11 / 12;
        grid-row: 2 / 12;
      }
    }
  }
}
</style>
