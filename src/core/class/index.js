class Ship {
  constructor(id, name, deck, axisX, axisY, areas, orientation, status, error) {
    this.id = id;
    this.name = name; // battleship || cruiser || destroyer || boat;
    this.deck = deck;
    this.axisX = axisX || 0;
    this.axisY = axisY || 0;
    this.areas = areas || []; // new ShipArea;
    this.orientation = orientation || "hr"; // hr || vr;
    this.status = status || "whole"; // whole || injured || destroyed;
    this.error = error || false;
  }
}

class ShipArea {
  constructor(key, axisX, axisY, shot, status) {
    this.key = key || null;
    this.axisX = axisX || null;
    this.axisY = axisY || null;
    this.shot = shot || false;
    this.status = status || "empty"; // frontier, empty, filled
  }
}

export { Ship, ShipArea };
