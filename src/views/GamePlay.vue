<template>
  <div class="game-play">
    <div class="game-play__head">
      <h1 class="page-title">Game Play</h1>
    </div>
    <div class="game-play__container">
      <div class="game-play__box">
        <div class="game-play__status">
          <ship-play-status
            v-for="ship in user.ships"
            :areas="ship.areas"
            :status="ship.status"
            :key="ship.id"
          />
        </div>
        <battele-field>
          <template #default>
            <battele-play :areas="user.areas" class="battele-play--vue" />
          </template>
        </battele-field>
      </div>
      <div class="game-play__dec">
        <div class="game-turn">
          <div class="game-turn__info">
            <p class="game-turn__name">player last turn</p>
            <p :class="['game-turn__text', game.user.status]">
              {{ game.user.key }} - {{ game.user.status }}
            </p>
          </div>
          <p class="game-turn__step">Turn {{ game.turn }}</p>
          <p class="game-turn__player">player's turn</p>
          <div class="game-turn__info">
            <p class="game-turn__name">bot last turn</p>
            <p :class="['game-turn__text', game.opponent.status]">
              {{ game.opponent.key }} - {{ game.opponent.status }}
            </p>
          </div>
        </div>
      </div>
      <div class="game-play__box">
        <battele-field class="battele-field--reverce">
          <template #default>
            <battele-play :areas="opponent.areas" @shot-key="shot" />
          </template>
        </battele-field>
        <div class="game-play__status">
          <ship-play-status
            class="ship-play-status--reverce"
            v-for="ship in opponent.ships"
            :areas="ship.areas"
            :status="ship.status"
            :key="ship.id"
          />
        </div>
      </div>
    </div>
    <div class="game-play__foot">
      <button
        class="btn btn--main"
        type="button"
        @click="this.$router.push({ name: 'create' })"
      >
        New Game
      </button>
      <button class="btn btn--main" type="button" disabled>Save Game</button>
      <button class="btn btn--main" type="button" disabled>Load Game</button>
    </div>
  </div>
  <modal-complete :class="{ active: game.complete }" :message="message" />
</template>

<script>
import ShipPlayStatus from "@components/ShipPlayStatus";
import BatteleField from "@components/BatteleField";
import BattelePlay from "@components/BattelePlay";
import ModalComplete from "@components/ModalComplete";

import { axisLegend } from "@enum";

export default {
  name: "GamePlay",
  components: {
    ShipPlayStatus,
    BatteleField,
    BattelePlay,
    ModalComplete,
  },
  data() {
    return {
      game: {
        turn: 0,
        key: null,
        status: null,
        complete: false,
        user: {
          key: null,
          status: null,
        },
        opponent: {
          key: null,
          status: null,
        },
      },
      user: {},
      opponent: {},
      message: null,
    };
  },
  methods: {
    setGameSate() {
      this.game.turn += 1;
      this.setTurn(this.opponent, this.game.key);
      this.setTurnInfo(this.game.user);
      this.setRandomShot(this.user);
      this.setTurn(this.user, this.game.key);
      this.setTurnInfo(this.game.opponent);
    },

    setTurn(target, key) {
      this.game.status = "miss";
      target.areas[key].shot = true;
      if (target.areas[key].status === "filled") {
        this.setShipStatus(target, key);
        this.checkShipStatus(target);
        this.checkGameStatus(target);
      }
    },
    setTurnInfo(player) {
      player.key = this.game.key;
      player.status = this.game.status;
    },

    setShipStatus(target, key) {
      target.ships.forEach((ship) => {
        ship.areas.forEach((area) => {
          if (area.key === key) {
            area.shot = true;
            ship.status = "damaged";
            this.game.status = "damaged";
          }
        });
      });
    },
    checkShipStatus(target) {
      target.ships.forEach((ship) => {
        if (ship.areas.every((area) => area.shot)) {
          ship.status = "destroyed";
        }
      });
    },
    checkGameStatus(target) {
      if (target.ships.every((ship) => ship.status === "destroyed")) {
        this.game.complete = true;
        switch (target.name) {
          case "user":
            this.message = "You've lost, try again.";
            break;
          case "opponent":
            this.message = "Congratulations, you win !!!";
            break;
        }
      }
    },

    setRandomShot(target) {
      const x = Math.floor(Math.random() * 10);
      const y = Math.floor(Math.random() * 10);
      const key = axisLegend[x].x + axisLegend[y].y;
      if (target.areas[key].shot === false) {
        this.game.key = key;
      }
    },

    shot(key) {
      if (this.opponent.areas[key].shot === false) {
        this.game.key = key;
        this.setGameSate();
      }
    },
  },
  mounted() {
    this.user = this.$store.getters.GET_USER;
    this.opponent = this.$store.getters.GET_OPPONENT;
  },
};
</script>

<style lang="scss" scoped>
.game-play {
  padding: 40px 0 80px;
  &__head {
    margin-bottom: 20px;
    text-align: center;
  }
  &__container {
    display: flex;
    justify-content: center;
  }
  &__dec {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 160px;
  }
  &__box {
    display: flex;
  }
  &__status {
    padding: 30px 0 0;
    @include respond(screen-xxl) {
      padding: 50px 0;
    }
  }
  &__foot {
    display: flex;
    justify-content: center;
    padding: 40px 0;
    .btn {
      margin: 0 10px;
    }
  }
}

.game-turn {
  padding: 20px 0;
  text-align: center;
  &__info {
    margin: 20px 0;
    padding: 10px 0;
    border-top: 1px solid $color-disabled;
    border-bottom: 1px solid $color-disabled;
    color: $text-color-muted;
    font-size: 0.8rem;
  }
  &__text {
    font-weight: 600;
    &.miss {
      color: $color-sub;
    }
    &.damaged {
      color: $color-main;
    }
    &.destroyed {
      color: $color-main-active;
    }
  }
  &__step {
    font-size: 1.2rem;
    font-weight: 600;
    @include respond(screen-xxl) {
      font-size: 1.4rem;
    }
  }
  &__player {
    font-size: 1rem;
    @include respond(screen-xxl) {
      font-size: 1.2rem;
    }
  }
}
</style>
