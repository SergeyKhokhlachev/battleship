class Ship {
  constructor(id, name, deck, axisX, axisY, areas, orientation, status, error) {
    this.id = id;
    this.name = name; // battleship || cruiser || destroyer || boat;
    this.deck = deck;
    this.axisX = axisX || 0;
    this.axisY = axisY || 0;
    this.areas = areas || []; // new ShipArea;
    this.orientation = orientation || "vr"; // hr || vr;
    this.status = status || "hidden"; // hidden || damaged || destroyed;
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

class Area {
  constructor(status, shot, ships) {
    this.status = status || "empty";
    this.shot = shot || false;
    this.ships = ships || [];
  }
}

export { Ship, ShipArea, Area };
