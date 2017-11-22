'use strict';

module.exports = class Position {
  constructor(latitude = 90.0000, longitude = 0.0000, accuracy = 0) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.accuracy = accuracy;
  }
}
