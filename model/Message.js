'use strict';

module.exports = class Message {
  constructor(author, channel, content, timestamp = Date.now()) {
    this.author = author;
    this.channel = channel;
    this.content = content;
    this.timestamp = timestamp;
  }
}
