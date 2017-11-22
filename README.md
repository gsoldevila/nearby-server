## Nearby server
Nearby allows creating spontaneous, ephemeral conversation channels, based on user location. The `nearby server` component holds the server-side logic, and works in conjunction with [nearby client](https://github.com/gsoldevila/nearby-client).

### Features
- Conversation channels are geolocalized and open (no access control).
- Thus, the application allows searching for conversation channels nearby.
- Conversation channels are ephemeral, i.e. when the last user leaves a channel, the channel disappears.
- When disconnecting from the server (e.g. client application stops running), users will automatically leave their open conversations.

The server component is written in ES6 and relies on [Socket.io](https://socket.io/) for the client - server communication.

### Installation
In order to install and run *Nearby*, please clone this repository and run:
```bash
$ sudo npm install -g pm2
$ npm install
$ npm run dev
```

This will spin-up a `nearby server` instance, allowing to manage it with the [PM2](http://pm2.keymetrics.io/) process manager.

This server will be listening on port `16969` of the host machine. Please refer to [ecosystem.config.js](https://github.com/gsoldevila/nearby-server/blob/master/ecosystem.config.js) if you want to configure it differently.

Once the server is running, you can proceed to intall and launch the [nearby client](https://github.com/gsoldevila/nearby-client).

### Roadmap
- Migrate datasource: in-memory => Redis database.
- Delegate channel filtering to [Georadius](https://redis.io/commands/georadius).
- Deploy in the cloud.
