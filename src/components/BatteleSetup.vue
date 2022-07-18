<template>
  <div class="battele-setup">
    <template v-for="ship in ships" :key="ship.id">
      <ship-setup-vue
        :class="[{ active: active === ship.id }, { error: ship.error }]"
        :deck="ship.deck"
        :axisX="ship.axisX + 1"
        :axisY="ship.axisY + 1"
        :orientation="ship.orientation"
        @click="setActive(ship.id)"
      />
    </template>
  </div>
</template>

<script>
import ShipSetupVue from "@components/ShipSetupVue.vue";

export default {
  name: "BatteleSetup",
  components: {
    ShipSetupVue,
  },
  props: {
    ships: Array,
    active: [Number, String],
  },
  methods: {
    setActive(id) {
      this.$emit("setActive", id);
    },
  },
};
</script>

<style lang="scss" scoped>
.battele-setup {
  display: grid;
  grid-auto-rows: 1fr;
  grid-template-columns: repeat(10, 40px);
  grid-template-rows: repeat(10, 40px);
  gap: 0px 0px;
  .ship-setup-vue {
    background-color: lighten($color-sucess, 15%);
    transition: background-color 0.2s ease-in-out, opacity 0.2s ease-in-out;
    cursor: pointer;
    &.error {
      background-color: lighten($color-error, 20%);
    }
    &.active {
      background-color: $color-sucess;
      z-index: 10;
      &.error {
        background-color: $color-error;
      }
    }
  }
}
</style>
