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
          <p class="game-turn__step">Turn {{ game.turn }}</p>
          <p class="game-turn__player">{{ player }}</p>
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
  </div>
</template>

<script>
import ShipPlayStatus from "@components/ShipPlayStatus";
import BatteleField from "@components/BatteleField";
import BattelePlay from "@components/BattelePlay";

export default {
  name: "GamePlay",
  components: {
    ShipPlayStatus,
    BatteleField,
    BattelePlay,
  },
  data() {
    return {
      game: {
        active: "user",
        turn: 0,
        last: {
          key: null,
          status: null,
          result: "",
        },
      },
      user: {},
      opponent: {},
    };
  },
  computed: {
    player() {
      return this.game.active === "user" ? "player's turn" : "bot's turn";
    },
  },
  methods: {
    setShipStatus(player, key) {
      player.ships.forEach((ship) => {
        ship.areas.forEach((area) => {
          if (area.key === key) {
            area.shot = true;
            ship.status = "damaged";
          }
        });
      });
    },
    updateShipStatus(player) {
      player.ships.forEach((ship) => {
        if (ship.areas.every((area) => area.shot)) {
          ship.status = "destroyed";
        }
      });
    },
    setTurn(player, key) {
      if (player.areas[key].shot === false) {
        this.game.turn += 1;
        player.areas[key].shot = true;
        if (player.areas[key].status === "filled") {
          this.setShipStatus(player, key);
          this.updateShipStatus(player);
        }
      }
    },
    shot(key) {
      this.setTurn(this.opponent, key);
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
    padding: 50px 0;
  }
}

.game-turn {
  padding: 20px 0;
  text-align: center;
  &__step {
    font-size: 1.4rem;
    font-weight: 600;
  }
  &__player {
    font-size: 1.2rem;
  }
}
</style>
