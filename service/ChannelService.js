'use strict';

const geolib = require('geolib');
const User = require('../model/User');
const Channel = require('../model/Channel');

const NORTH_POLE = {
  latitude: 90.0000,
  longitude: 0.0000,
  accuracy: 0
};

module.exports = class ChannelService {
  constructor() {
    this.CHANNELS = new Map(); // uppercaseChannel => Channel
  }

  search(searchRequest, userChannels) {
    console.log('Search: %s', JSON.stringify(searchRequest));
    let nearbyChannels = [];
    let searchUpper = searchRequest.text ?
      searchRequest.text.toUpperCase() : '';
    let searchRangeKm = searchRequest.range * 1000;

    for (let [upper, channel] of this.CHANNELS) {
      if (!upper.includes(searchUpper)) continue;
      let distance = geolib.getDistance(channel.position, searchRequest.position ||
        NORTH_POLE);
      if (searchRangeKm < 0 || distance <= searchRangeKm) {
        let match = {
          ...channel,
          users: undefined,
          online: userChannels.has(upper)
        };
        match.position.distance = distance;
        nearbyChannels.push(match);
      }
    }
    return nearbyChannels;
  }

  getChannel(uppercaseChannel) {
    return this.CHANNELS.get(uppercaseChannel);
  }

  createJoin(clientId, name, creator, position = NORTH_POLE) {
    // first, add the channel to the "datasource"
    let uppercaseChannel = name.toUpperCase();
    let channel = this.CHANNELS.get(uppercaseChannel);
    if (!channel) {
      channel = new Channel(name, creator, position);
      this.CHANNELS.set(uppercaseChannel, channel);
    }

    // second, register the user (socketId) in the channel
    channel.users.add(clientId);

    // create an enriched copy of the channel
    return {
      ...channel,
      online: true, // flag the channel as online
      users: undefined // remove this server-side-only property
    };
  }

  leaveChannel(clientId, uppercaseChannel, user) {
    let channel = this.CHANNELS.get(uppercaseChannel);
    if (channel) {

      channel.users.delete(clientId);
      if (channel.users.size == 0) {
        this.CHANNELS.delete(uppercaseChannel);
        channel = undefined;
      }
    }

    return channel;
  }
}
