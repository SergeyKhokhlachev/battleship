<template>
  <div class="start-view">
    <button
      class="start-view__btn btn btn--main"
      type="button"
      @click="this.$router.push({ name: 'create' })"
    >
      New Game
    </button>
    <button
      class="start-view__btn btn btn--main"
      type="button"
      :disabled="!load"
      @click="this.$router.push({ name: 'create' })"
    >
      Load Game
    </button>
  </div>
</template>

<script>
export default {
  name: "StartView",
  data() {
    return {
      load: false,
    };
  },
};
</script>

<style lang="scss" scoped>
.start-view {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  &__btn {
    width: 100%;
    max-width: 180px;
    margin-bottom: 30px;
    padding: 14px 20px;
  }
}
</style>
