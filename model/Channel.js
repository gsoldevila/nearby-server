'use strict';

const MAX_MESSAGES = 28;

module.exports = class Channel {
  constructor(name, creator, position) {
    this.name = name;
    this.timestamp = Date.now();
    this.creator = creator;
    this.position = position;
    if (this.position) this.position.distance = 0;
    this.users = new Set(); // user IDs
    this.messages = [];
  }

  addMessage(message) {
    this.messages.push(message);
    if (this.messages.length > MAX_MESSAGES) this.messages.shift();
  }
}
