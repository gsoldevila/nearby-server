'use strict';

const http = require('http');
const express = require('express');
const PORT = process.env.PORT || 10000; // server port

const app = express();
const server = http.Server(app);
server.listen(PORT);
//require('./socketIoServer')(server);
const NearbyService = require('./service/NearbyService');
const nearbyServer = new NearbyService(server).start();
console.log('Nearby-server started (port %s)', PORT);
