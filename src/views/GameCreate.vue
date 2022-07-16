<template>
  <div class="game-create">
    <div class="game-create__head">
      <h1 class="page-title">Set ships position</h1>
    </div>
    <div class="game-create__box">
      <div class="game-create__control">
        <div class="game-create__list">
          <ship-setup-control
            v-for="(type, name) in shipsTypes"
            v-bind="type"
            :name="name"
            :key="type.deck"
            @append-ship="appendShip"
            @remove-ship="removeShip"
          />
        </div>
        <div class="game-create__btns">
          <button type="button" class="btn btn--main" @click="setSetupRandom">
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
            :ships="ships"
            :active="active"
            @set-active="setActive"
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
import { Ship, ShipArea } from "@class";

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
      ships: [],
      areas: {},
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
      let gameReady = true;
      if (this.ships.length === 10) {
        this.ships.forEach((ship) => {
          if (ship.error === true) {
            gameReady = false;
            return;
          }
        });
      } else {
        gameReady = false;
      }
      return gameReady;
    },
  },
  methods: {
    createGame() {},
    setActive(id) {
      this.active = id;
    },
    getKey(x, y) {
      if (axisLegend[x] && axisLegend[y]) {
        return axisLegend[x].x + axisLegend[y].y;
      } else {
        return null;
      }
    },
    getIndex(key, id) {
      return this.areas[key].ships.findIndex((item) => item === id);
    },
    setSetupRandom() {
      this.resetSetup();
      for (const key in this.shipsTypes) {
        for (let i = 0; i < this.shipsTypes[key].total; i++) {
          this.counter += 1;
          this.shipsTypes[key].available -= 1;
          const ship = this.createShip(
            this.counter,
            key,
            this.shipsTypes[key].deck
          );
          this.ships.push(ship);
          this.setShipRandom(ship);
        }
      }
      this.active = this.counter;
    },
    resetSetup() {
      this.ships.forEach((ship) => this.clearAreas(ship));
      this.ships = [];
      this.counter = 0;
      for (const key in this.shipsTypes) {
        this.shipsTypes[key].available = this.shipsTypes[key].total;
      }
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
    movePosition(ship, x, y) {
      this.clearAreas(ship);
      this.setPosition(ship, x, y);
      this.setShipAreas(ship);
      this.setAreas(ship);
      this.checkPosition();
    },
    checkPosition() {
      this.ships.forEach((ship) => {
        let hasError = false;
        ship.areas.forEach((area) => {
          if (!area.key && area.status === "filled") {
            hasError = true;
            return;
          }
          if (
            area.key &&
            area.status === "filled" &&
            this.areas[area.key].ships.length > 1
          ) {
            hasError = true;
            return;
          }
        });
        ship.error = hasError;
      });
    },
    createAreas() {
      for (let x = 0; x < axisLegend.length; x++) {
        for (let y = 0; y < axisLegend.length; y++) {
          this.areas[this.getKey(x, y)] = {
            status: "empty",
            shot: false,
            ships: [],
          };
        }
      }
    },
    setAreas(ship) {
      ship.areas.forEach((area) => {
        if (area.key) {
          this.areas[area.key].status = area.status;
          this.areas[area.key].ships.push(ship.id);
        }
      });
    },
    clearAreas(ship) {
      ship.areas.forEach((area) => {
        if (area.key) {
          this.areas[area.key].ships.splice(
            this.getIndex(area.key, ship.id),
            1
          );
          if (this.areas[area.key].ships.length === 0) {
            this.areas[area.key].status = "empty";
          }
        }
      });
    },
    createShip(id, name, deck) {
      const shipAreas = [];
      for (let i = 0; i < deck * 3 + 6; i++) {
        shipAreas.push(new ShipArea());
      }
      return new Ship(id, name, deck, 0, 0, shipAreas);
    },
    appendShip(name, deck, available) {
      this.counter += 1;
      this.active = this.counter;
      this.shipsTypes[name].available = available;
      const ship = this.createShip(this.counter, name, deck);
      this.ships.push(ship);
      this.setShipAreas(ship);
      this.setAreas(ship);
      this.checkPosition();
    },
    removeShip(name, available) {
      this.shipsTypes[name].available = available;
      for (let i = this.ships.length - 1; i >= 0; i--) {
        if (this.ships[i].name === name) {
          this.clearAreas(this.ships[i]);
          this.ships.splice(i, 1);
          this.checkPosition();
          return;
        }
      }
    },
    resetShipArea(area, status) {
      area.axisX = null;
      area.axisY = null;
      area.status = status || "empty";
      area.key = null;
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
    setShipRandom(ship) {
      this.clearAreas(ship);
      this.setPositionRandom(ship);
      this.setShipAreas(ship);
      this.setAreas(ship);
      this.checkPosition();
      if (ship.error) {
        this.setShipRandom(ship);
      }
    },
    rotateShip(ship) {
      switch (ship.orientation) {
        case "hr":
          if (ship.axisY + ship.deck <= 10) {
            ship.orientation = "vr";
            this.movePosition(ship, ship.axisX, ship.axisY);
          }
          break;
        case "vr":
          if (ship.axisX + ship.deck <= 10) {
            ship.orientation = "hr";
            this.movePosition(ship, ship.axisX, ship.axisY);
          }
          break;
      }
    },
    moveShip(ship, direction) {
      switch (direction) {
        case "left":
          if (ship.axisX > 0) {
            this.movePosition(ship, ship.axisX - 1, ship.axisY);
          }
          break;
        case "right":
          if (ship.orientation === "hr" && ship.axisX + ship.deck <= 9) {
            this.movePosition(ship, ship.axisX + 1, ship.axisY);
          }
          if (ship.orientation === "vr" && ship.axisX < 9) {
            this.movePosition(ship, ship.axisX + 1, ship.axisY);
          }
          break;
        case "up":
          if (ship.axisY > 0) {
            this.movePosition(ship, ship.axisX, ship.axisY - 1);
          }
          break;
        case "down":
          if (ship.orientation === "hr" && ship.axisY < 9) {
            this.movePosition(ship, ship.axisX, ship.axisY + 1);
          }
          if (ship.orientation === "vr" && ship.axisY + ship.deck <= 9) {
            this.movePosition(ship, ship.axisX, ship.axisY + 1);
          }
          break;
      }
    },
    keydown(event) {
      if (this.active) {
        const ship = this.ships.find((item) => item.id === this.active);
        switch (event.key) {
          case "Control":
            this.rotateShip(ship);
            break;
          case "ArrowLeft":
            this.moveShip(ship, "left");
            break;
          case "ArrowRight":
            this.moveShip(ship, "right");
            break;
          case "ArrowUp":
            this.moveShip(ship, "up");
            break;
          case "ArrowDown":
            this.moveShip(ship, "down");
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
    this.createAreas();
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
    padding: 50px 0;
    margin-right: 40px;
  }
  &__list {
    margin-bottom: 40px;
  }
  &__btns {
    display: flex;
    justify-content: center;
    margin: 0 -10px 30px;
    .btn {
      width: 116px;
      margin: 0 10px;
    }
  }
}
</style>
