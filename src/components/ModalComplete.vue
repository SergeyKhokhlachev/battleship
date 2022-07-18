<template>
  <div class="modal-complete">
    <div class="modal-complete__box">
      <h2 class="page-title">Game Over</h2>
      <p class="modal-complete__message">{{ message }}</p>
      <div class="modal-complete__btn">
        <button
          class="btn btn--main"
          type="button"
          @click="this.$router.push({ name: 'create' })"
        >
          New Game
        </button>
        <button class="btn btn--main" type="button" disabled>Load Game</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ModalComplete",
  props: {
    message: String,
  },
};
</script>

<style lang="scss" scoped>
.modal-complete {
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: rgba($color: #000000, $alpha: 0.3);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease-in-out;
  &__box {
    width: 80%;
    max-width: 460px;
    padding: 40px;
    text-align: center;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 4px rgba($color: #000000, $alpha: 0.25);
  }
  &__message {
    margin: 6px 0 50px;
    font-size: 1.2rem;
  }
  &__btn {
    display: flex;
    justify-content: center;
    .btn {
      margin: 0 10px;
    }
  }
  &.active {
    opacity: 1;
    visibility: visible;
  }
}
</style>
