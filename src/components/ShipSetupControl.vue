<template>
  <div class="ship-setup-control">
    <div class="ship-setup-control__vue">
      <div
        v-for="item in deck"
        :key="item"
        class="ship-setup-control__deck"
      ></div>
    </div>
    <div class="ship-setup-control__btns">
      <button
        type="button"
        class="ship-setup-control__btn"
        :disabled="removeDisabled"
        @click="remove"
      >
        &#8722;
      </button>
      <button
        type="button"
        class="ship-setup-control__btn"
        :disabled="appendDisabled"
        @click="append"
      >
        +
      </button>
    </div>
    <div class="ship-setup-control__status">
      ({{ available }} / {{ total }})
    </div>
  </div>
</template>

<script>
export default {
  name: "ShipSetupControl",
  props: {
    name: String,
    deck: Number,
    available: Number,
    total: Number,
  },
  computed: {
    appendDisabled() {
      return this.available <= 0;
    },
    removeDisabled() {
      return this.available >= this.total;
    },
  },

  methods: {
    append() {
      this.$emit("appendShip", this.name, this.deck, this.available - 1);
    },
    remove() {
      this.$emit("removeShip", this.name, this.available + 1);
    },
  },
};
</script>

<style lang="scss" scoped>
.ship-setup-control {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  &__vue {
    display: flex;
    width: 124px;
    margin-right: 10px;
  }
  &__deck {
    flex-shrink: 0;
    width: 30px;
    height: 30px;
    margin-right: 1px;
    background-color: $color-sub;
  }
  &__status {
    color: $text-color-muted;
  }
  &__btns {
    display: flex;
    margin-right: 10px;
  }
  &__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    padding: 0;
    color: #ffffff;
    font-size: 1.4rem;
    line-height: 1;
    border: none;
    background-color: #78909c;
    margin-right: 1px;
    cursor: pointer;
    &:hover {
      background-color: #546e7a;
    }
    &:focus {
      outline: none;
    }
    &:active {
      background-color: #37474f;
    }
    &[disabled] {
      background-color: $color-disabled;
      cursor: default;
    }
  }
}
</style>
