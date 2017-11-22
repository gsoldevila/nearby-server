'use strict';

const User = require('../model/User');
const Channel = require('../model/Channel');

module.exports = class UserService {
  constructor() {
    this.SOCKET_USER = new Map(); // socket.id => User
    this.SOCKET_CHANNELS = new Map(); // socket.id => Set<uppercaseChannel>
  }

  getUser(socket) {
    return this.SOCKET_USER.get(socket.id);
  }

  alias(socket) {
    let user = this.SOCKET_USER.get(socket.id);
    return user ? user.alias : 'somebody';
  }

  getUserChannels(socket) {
    return this.SOCKET_CHANNELS.get(socket.id);
  }

  createUser(socket, data) {
    let user = new User(Date.now(), data.alias, data.firstName, data.lastName);
    this.SOCKET_USER.set(socket.id, user);
    return user;
  }

  userConnected(socket) {
    this.SOCKET_CHANNELS.set(socket.id, new Set());
    console.log('User connected (%s users online)', this.SOCKET_CHANNELS.size);
  }

  hidrateUser(socket, user) {
    if (user) {
      if (!user.id) user.id = Date.now();
      this.SOCKET_USER.set(socket.id, user);
    }
    return user;
  }

  joinChannel(socket, uppercaseChannel) {
    let channels = this.SOCKET_CHANNELS.get(socket.id);
    if (channels) channels.add(uppercaseChannel);
  }

  leaveChannel(socket, uppercaseChannel) {
    let channels = this.SOCKET_CHANNELS.get(socket.id);
    if (channels) channels.delete(uppercaseChannel);
  }

  userDisconnected(socket) {
    console.log(this.alias(socket) + ' left (%s users online)', this.SOCKET_CHANNELS
      .size);
    this.SOCKET_CHANNELS.delete(socket.id);
    this.SOCKET_USER.delete(socket.id);
  }
}
