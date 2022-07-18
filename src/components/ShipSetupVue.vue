<template>
  <div
    class="ship-setup-vue"
    :style="{
      gridArea: `${axisX} / ${axisY} / ${endX} / ${endY}`,
    }"
  ></div>
</template>

<script>
export default {
  name: "ShipSetupVue",
  props: {
    deck: Number,
    axisX: Number,
    axisY: Number,
    orientation: String,
  },
  data() {
    return {};
  },
  computed: {
    endX() {
      return this.orientation === "hr" ? this.axisX + this.deck : this.axisX;
    },
    endY() {
      return this.orientation === "vr" ? this.axisY + this.deck : this.axisY;
    },
  },
  methods: {},
};
</script>

<style lang="scss" scoped></style>
