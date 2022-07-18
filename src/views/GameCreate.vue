<template>
  <div class="game-create">
    <div class="game-create__head">
      <h1 class="page-title">New Game</h1>
    </div>
    <div class="game-create__box">
      <div class="game-create__control">
        <div class="game-create__list">
          <ship-setup-control
            v-for="(type, name) in shipsTypes"
            v-bind="type"
            :name="name"
            :key="type.deck"
            @append="append"
            @remove="remove"
          />
        </div>
        <div class="game-create__btns">
          <button
            type="button"
            class="btn btn--main"
            @click="setSetupRandom(user)"
          >
            random
          </button>
          <button
            type="button"
            class="btn btn--main"
            @click="createGame"
            :disabled="!isReady"
          >
            play
          </button>
        </div>
        <div class="game-create__info">
          <ul>
            <li>Ctrl - rotate ship</li>
            <li>arrow - move ship</li>
          </ul>
        </div>
      </div>
      <battele-field>
        <template #default>
          <battele-setup
            :ships="user.ships"
            :active="active"
            @set-active="setShipActive"
          />
        </template>
      </battele-field>
    </div>
  </div>
</template>

<script>
import ShipSetupControl from "@components/ShipSetupControl";
import BatteleField from "@components/BatteleField";
import BatteleSetup from "@components/BatteleSetup";

import { axisLegend } from "@enum";
import { Ship, ShipArea, Area } from "@class";

export default {
  name: "GameCreate",
  components: {
    ShipSetupControl,
    BatteleField,
    BatteleSetup,
  },
  data() {
    return {
      active: null,
      counter: 0,
      user: {
        name: "user",
        areas: {},
        ships: [],
      },
      opponent: {
        name: "opponent",
        areas: {},
        ships: [],
      },
      shipsTypes: {
        battleship: {
          deck: 4,
          available: 1,
          total: 1,
        },
        cruiser: {
          deck: 3,
          available: 2,
          total: 2,
        },
        destroyer: {
          deck: 2,
          available: 3,
          total: 3,
        },
        boat: {
          deck: 1,
          available: 4,
          total: 4,
        },
      },
    };
  },
  computed: {
    isReady() {
      if (this.user.ships.length === 10) {
        return this.user.ships.every((ship) => !ship.error);
      } else {
        return false;
      }
    },
  },
  methods: {
    createGame() {
      this.createAreas(this.opponent);
      this.setSetupRandom(this.opponent);
      this.prepareData(this.user);
      this.prepareData(this.opponent);
      this.$store.dispatch("SET_USER", this.user);
      this.$store.dispatch("SET_OPPONENT", this.opponent);
      this.$router.push({ name: "play" });
    },

    getKey(x, y) {
      if (axisLegend[x] && axisLegend[y]) {
        return axisLegend[x].x + axisLegend[y].y;
      } else {
        return null;
      }
    },
    resetSetup(player) {
      this.counter = 0;
      player.ships.forEach((ship) => this.clearAreas(player, ship));
      player.ships = [];
      for (const key in this.shipsTypes) {
        this.shipsTypes[key].available = this.shipsTypes[key].total;
      }
    },
    setSetupRandom(player) {
      this.resetSetup(player);
      for (const key in this.shipsTypes) {
        for (let i = 0; i < this.shipsTypes[key].total; i++) {
          this.counter += 1;
          this.shipsTypes[key].available -= 1;
          const ship = this.createShip(
            this.counter,
            key,
            this.shipsTypes[key].deck
          );
          player.ships.push(ship);
          this.setShipPositionRandom(player, ship);
        }
      }
      this.active = this.counter;
    },
    prepareData(player) {
      player.ships.forEach((ship) => {
        ship.areas = ship.areas.filter((area) => area.status === "filled");
      });
    },

    setPosition(ship, x, y) {
      ship.axisX = x;
      ship.axisY = y;
    },
    setPositionRandom(ship) {
      let choices = ["hr", "vr"];
      ship.orientation = choices[Math.floor(Math.random() * choices.length)];
      ship.axisX = Math.floor(Math.random() * 10);
      ship.axisY = Math.floor(Math.random() * 10);
    },
    checkPosition(player) {
      player.ships.forEach((ship) => {
        ship.error = ship.areas.some((area) => {
          const filled = area.status === "filled";
          const length = area.key
            ? player.areas[area.key].ships.length > 1
            : false;
          if ((!area.key && filled) || (area.key && filled && length)) {
            return true;
          }
        });
      });
    },

    createAreas(player) {
      for (let x = 0; x < axisLegend.length; x++) {
        for (let y = 0; y < axisLegend.length; y++) {
          player.areas[this.getKey(x, y)] = new Area();
        }
      }
    },
    setAreas(player, ship) {
      ship.areas.forEach((area) => {
        if (area.key) {
          if (player.areas[area.key].ships.length === 0) {
            player.areas[area.key].status = area.status;
          }
          player.areas[area.key].ships.push(ship.id);
        }
      });
    },
    clearAreas(player, ship) {
      ship.areas.forEach((area) => {
        if (area.key) {
          player.areas[area.key].ships.splice(
            player.areas[area.key].ships.findIndex((item) => item === ship.id),
            1
          );
          if (player.areas[area.key].ships.length === 0) {
            player.areas[area.key].status = "empty";
          }
        }
      });
    },

    createShip(id, name, deck) {
      const areas = [];
      for (let i = 0; i < deck * 3 + 6; i++) {
        areas.push(new ShipArea());
      }
      return new Ship(id, name, deck, 0, 0, areas);
    },
    appendShip(player, name, deck) {
      this.counter += 1;
      this.active = this.counter;
      const ship = this.createShip(this.counter, name, deck);
      player.ships.push(ship);
      this.setShipAreas(ship);
      this.setAreas(player, ship);
      this.checkPosition(player);
    },
    removeShip(player, name) {
      for (let i = player.ships.length - 1; i >= 0; i--) {
        if (player.ships[i].name === name) {
          this.clearAreas(player, player.ships[i]);
          player.ships.splice(i, 1);
          this.checkPosition(player);
          return;
        }
      }
    },
    setShipActive(id) {
      this.active = id;
    },
    setShipAreas(ship) {
      const n = [-1, 0, 1];
      switch (ship.orientation) {
        case "hr":
          for (let i = 0; i < ship.deck; i++) {
            if (this.getKey(ship.axisX + i, ship.axisY)) {
              ship.areas[i].axisX = ship.axisX + i;
              ship.areas[i].axisY = ship.axisY;
              ship.areas[i].status = "filled";
              ship.areas[i].key = this.getKey(ship.axisX + i, ship.axisY);
            } else {
              this.resetShipArea(ship.areas[i], "filled");
            }
            if (this.getKey(ship.axisX + i, ship.axisY - 1)) {
              ship.areas[i + ship.deck].axisX = ship.axisX + i;
              ship.areas[i + ship.deck].axisY = ship.axisY - 1;
              ship.areas[i + ship.deck].status = "frontier";
              ship.areas[i + ship.deck].key = this.getKey(
                ship.axisX + i,
                ship.axisY - 1
              );
            } else {
              this.resetShipArea(ship.areas[i + ship.deck]);
            }
            if (this.getKey(ship.axisX + i, ship.axisY + 1)) {
              ship.areas[i + ship.deck * 2].axisX = ship.axisX + i;
              ship.areas[i + ship.deck * 2].axisY = ship.axisY + 1;
              ship.areas[i + ship.deck * 2].status = "frontier";
              ship.areas[i + ship.deck * 2].key = this.getKey(
                ship.axisX + i,
                ship.axisY + 1
              );
            } else {
              this.resetShipArea(ship.areas[i + ship.deck * 2]);
            }
          }
          for (let i = 0; i < 3; i++) {
            if (this.getKey(ship.axisX - 1, ship.axisY + n[i])) {
              ship.areas[ship.deck * 3 + i].axisX = ship.axisX - 1;
              ship.areas[ship.deck * 3 + i].axisY = ship.axisY + n[i];
              ship.areas[ship.deck * 3 + i].status = "frontier";
              ship.areas[ship.deck * 3 + i].key = this.getKey(
                ship.axisX - 1,
                ship.axisY + n[i]
              );
            } else {
              this.resetShipArea(ship.areas[ship.deck * 3 + i]);
            }
          }
          for (let i = 0; i < 3; i++) {
            if (this.getKey(ship.axisX + ship.deck, ship.axisY + n[i])) {
              ship.areas[ship.deck * 3 + 3 + i].axisX = ship.axisX + ship.deck;
              ship.areas[ship.deck * 3 + 3 + i].axisY = ship.axisY + n[i];
              ship.areas[ship.deck * 3 + 3 + i].status = "frontier";
              ship.areas[ship.deck * 3 + 3 + i].key = this.getKey(
                ship.axisX + ship.deck,
                ship.axisY + n[i]
              );
            } else {
              this.resetShipArea(ship.areas[ship.deck * 3 + 3 + i]);
            }
          }
          break;
        case "vr":
          for (let i = 0; i < ship.deck; i++) {
            if (this.getKey(ship.axisX, ship.axisY + i)) {
              ship.areas[i].axisX = ship.axisX;
              ship.areas[i].axisY = ship.axisY + i;
              ship.areas[i].status = "filled";
              ship.areas[i].key = this.getKey(ship.axisX, ship.axisY + i);
            } else {
              this.resetShipArea(ship.areas[i], "filled");
            }
            if (this.getKey(ship.axisX - 1, ship.axisY + i)) {
              ship.areas[i + ship.deck].axisX = ship.axisX - 1;
              ship.areas[i + ship.deck].axisY = ship.axisY + i;
              ship.areas[i + ship.deck].status = "frontier";
              ship.areas[i + ship.deck].key = this.getKey(
                ship.axisX - 1,
                ship.axisY + i
              );
            } else {
              this.resetShipArea(ship.areas[i + ship.deck]);
            }
            if (this.getKey(ship.axisX + 1, ship.axisY + i)) {
              ship.areas[i + ship.deck * 2].axisX = ship.axisX + 1;
              ship.areas[i + ship.deck * 2].axisY = ship.axisY + i;
              ship.areas[i + ship.deck * 2].status = "frontier";
              ship.areas[i + ship.deck * 2].key = this.getKey(
                ship.axisX + 1,
                ship.axisY + i
              );
            } else {
              this.resetShipArea(ship.areas[i + ship.deck * 2]);
            }
          }
          for (let i = 0; i < 3; i++) {
            if (this.getKey(ship.axisX + n[i], ship.axisY - 1)) {
              ship.areas[ship.deck * 3 + i].axisX = ship.axisX + n[i];
              ship.areas[ship.deck * 3 + i].axisY = ship.axisY - 1;
              ship.areas[ship.deck * 3 + i].status = "frontier";
              ship.areas[ship.deck * 3 + i].key = this.getKey(
                ship.axisX + n[i],
                ship.axisY - 1
              );
            } else {
              this.resetShipArea(ship.areas[ship.deck * 3 + i]);
            }
          }
          for (let i = 0; i < 3; i++) {
            if (this.getKey(ship.axisX + n[i], ship.axisY + ship.deck)) {
              ship.areas[ship.deck * 3 + 3 + i].axisX = ship.axisX + n[i];
              ship.areas[ship.deck * 3 + 3 + i].axisY = ship.axisY + ship.deck;
              ship.areas[ship.deck * 3 + 3 + i].status = "frontier";
              ship.areas[ship.deck * 3 + 3 + i].key = this.getKey(
                ship.axisX + n[i],
                ship.axisY + ship.deck
              );
            } else {
              this.resetShipArea(ship.areas[ship.deck * 3 + 3 + i]);
            }
          }
          break;
      }
    },
    resetShipArea(area, status) {
      area.axisX = null;
      area.axisY = null;
      area.status = status || "empty";
      area.key = null;
    },
    setShipPosition(player, ship, x, y) {
      this.clearAreas(player, ship);
      this.setPosition(ship, x, y);
      this.setShipAreas(ship);
      this.setAreas(player, ship);
      this.checkPosition(player);
    },
    setShipPositionRandom(player, ship) {
      this.clearAreas(player, ship);
      this.setPositionRandom(ship);
      this.setShipAreas(ship);
      this.setAreas(player, ship);
      this.checkPosition(player);
      if (ship.error) {
        this.setShipPositionRandom(player, ship);
      }
    },

    append(name, deck, available) {
      this.shipsTypes[name].available = available;
      this.appendShip(this.user, name, deck);
    },
    remove(name, available) {
      this.shipsTypes[name].available = available;
      this.removeShip(this.user, name);
    },

    rotate(ship) {
      switch (ship.orientation) {
        case "hr":
          if (ship.axisY + ship.deck <= 10) {
            ship.orientation = "vr";
            this.setShipPosition(this.user, ship, ship.axisX, ship.axisY);
          }
          break;
        case "vr":
          if (ship.axisX + ship.deck <= 10) {
            ship.orientation = "hr";
            this.setShipPosition(this.user, ship, ship.axisX, ship.axisY);
          }
          break;
      }
    },
    move(ship, direction) {
      switch (direction) {
        case "up":
          if (ship.axisX > 0) {
            this.setShipPosition(this.user, ship, ship.axisX - 1, ship.axisY);
          }
          break;
        case "down":
          if (ship.orientation === "hr" && ship.axisX + ship.deck <= 9) {
            this.setShipPosition(this.user, ship, ship.axisX + 1, ship.axisY);
          }
          if (ship.orientation === "vr" && ship.axisX < 9) {
            this.setShipPosition(this.user, ship, ship.axisX + 1, ship.axisY);
          }
          break;
        case "left":
          if (ship.axisY > 0) {
            this.setShipPosition(this.user, ship, ship.axisX, ship.axisY - 1);
          }
          break;
        case "right":
          if (ship.orientation === "hr" && ship.axisY < 9) {
            this.setShipPosition(this.user, ship, ship.axisX, ship.axisY + 1);
          }
          if (ship.orientation === "vr" && ship.axisY + ship.deck <= 9) {
            this.setShipPosition(this.user, ship, ship.axisX, ship.axisY + 1);
          }
          break;
      }
    },
    keydown(event) {
      if (this.active) {
        const ship = this.user.ships.find((item) => item.id === this.active);
        switch (event.key) {
          case "Control":
            this.rotate(ship);
            break;
          case "ArrowLeft":
            this.move(ship, "left");
            break;
          case "ArrowRight":
            this.move(ship, "right");
            break;
          case "ArrowUp":
            this.move(ship, "up");
            break;
          case "ArrowDown":
            this.move(ship, "down");
            break;
        }
      }
    },
  },
  mounted() {
    document.addEventListener("keydown", this.keydown);
  },
  unmounted() {
    document.removeEventListener("keydown", this.keydown);
  },
  created() {
    this.createAreas(this.user);
  },
};
</script>

<style lang="scss" scoped>
.game-create {
  padding: 40px 0 80px;
  &__head {
    margin-bottom: 20px;
    text-align: center;
  }
  &__box {
    display: flex;
    justify-content: center;
    margin-bottom: 40px;
  }
  &__control {
    padding: 30px 0;
    margin-right: 30px;
    @include respond(screen-xxl) {
      padding: 50px 0;
      margin-right: 40px;
    }
  }
  &__list {
    margin-bottom: 30px;
    @include respond(screen-xxl) {
      margin-bottom: 40px;
    }
  }
  &__btns {
    display: flex;
    justify-content: center;
    margin: 0 -5px 20px;
    @include respond(screen-xxl) {
      margin: 0 -10px 30px;
    }
    .btn {
      width: 105px;
      margin: 0 5px;
      @include respond(screen-xxl) {
        width: 116px;
        margin: 0 10px;
      }
    }
  }
}
</style>
