'use strict';

const socketIo = require("socket.io");
const ChannelService = require('./ChannelService');
const UserService = require('./UserService');

const User = require('../model/User');
const Message = require('../model/Message');
const SYSTEM_USER = new User(-1, 'system'); // messages from system to users

module.exports = class NearbyService {
  constructor(server) {
    this.server = server;
    this.channelService = new ChannelService();
    this.userService = new UserService();
    this.channelService.createJoin(-1, 'North-pole', SYSTEM_USER);
  }

  start() {
    this.io = socketIo(this.server);
    this.io.on('connect', (socket) => {
      this.userService.userConnected(socket);
      this.listen(socket);
    });
    return this;
  }

  /*============================================================================
    All the Socket.IO event handlers are defined here
  ============================================================================*/
  listen(socket) {
    socket.on('search', r => {
      console.log("[NearbyService] *search*");
      let channels = this.channelService.search(r,
        this.userService.getUserChannels(socket));
      this.send(socket, 'searchResponse', channels);
    });

    socket.on('joinChannel', r => {
      console.log("[NearbyService] *joinChannel*");
      let ch = this.channelService.createJoin(socket.id, r.channel, r.user,
        r.position);
      let upper = ch.name.toUpperCase();
      // inform the users of the room that a new user is joining
      this.sendChannel(upper, r.user.alias + ' joined the conversation');
      socket.join(upper); // link the socket to the new channel room
      this.userService.joinChannel(socket, upper);
      this.userService.hidrateUser(socket, r.user);
      this.send(socket, 'joinedChannel', ch); // inform the user
    });

    socket.on('leaveChannel', r => {
      console.log("[NearbyService] *leaveChannel*");
      this.leaveChannel(socket, r.channel.name.toUpperCase(), r.user);
    });

    socket.on('message', r => {
      console.log("[NearbyService] *message*");
      const upper = r.channel.toUpperCase();
      let ch = this.channelService.getChannel(upper);
      if (ch) {
        let msg = this.sendChannel(upper, r.message, r.user);
        ch.addMessage(msg);
      }
    });

    socket.on('updateUser', u => {
      console.log("[NearbyService] *updateUser*");
      let user = this.userService.hidrateUser(socket, u);
      this.send(socket, 'userUpdated', user);
    });

    socket.on('disconnect', () => {
      console.log("[NearbyService] *disconnect*");
      let user = this.userService.getUser(socket);

      this.userService.getUserChannels(socket).forEach(upper => {
        this.leaveChannel(socket, upper, user);
      });
      this.userService.userDisconnected(socket);
    });
  }

  /*============================================================================
    Helper methods
  ============================================================================*/
  send(socket, message, res, err) {
    socket.emit(message, {
      data: res,
      error: err
    });
  }

  sendChannel(channel, content, user = SYSTEM_USER) {
    let msg = new Message(user, channel, content);
    this.io.to(channel).emit('message', {
      data: msg
    });
    return msg;
  }

  leaveChannel(socket, upper, user) {
    socket.leave(upper);
    this.userService.leaveChannel(socket, upper);
    let ch = this.channelService.leaveChannel(socket.id, upper, user);
    if (ch) this.sendChannel(upper, user.alias + ' left the conversation');
  }
}
