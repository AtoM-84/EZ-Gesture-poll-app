'use strict';

// Import app modules (Server: Http, Express / Utils : Path,Morgan / Interfaces: Serialport, Socket.io)

var express = require('express');
var http = require('http');
var path = require('path');
var logger = require('morgan');
var serialport = require('serialport');
var socket_io = require('socket.io');

// Instantiate App, server and websockets

var app = express();
var httpServer = http.createServer(app);
var io = socket_io.listen(httpServer);

// Import controller modules

var routes = require('./routes/index');
var vote = require('./routes/vote');

// Set express parameters (view renderer, port, path to views and static contents and libs)

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/scripts/jquery', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use('/scripts/d3', express.static(path.join(__dirname, 'node_modules/d3/build')));

// Set scripts to run when requesting subpath

app.use('/', routes);
app.use('/vote', vote);

// Server starting and port listening

httpServer.listen(app.get('port'), function () {
  console.log('Example app listening on port ' + app.get('port') + ' !');
});

// COM port configuration

var gesturePortNumber = undefined;
var gestureBaudRate = 115200;
var gesturePort;



serialport.list(function (err, ports) {
  ports.forEach(function (port) {
    console.log({ "port": port.comName, "VendorId_ProductId": port.pnpId, "manufacturer": port.manufacturer });
    if (port.pnpId === "FTDIBUS\\VID_0403+PID_6001+ANZ1S8W9A\\0000") {
      console.log("Port found!");
      gesturePortNumber = port.comName;
      gesturePort = new serialport(gesturePortNumber, { baudRate: gestureBaudRate });
      gesturePort.on('open', function () { console.log(gesturePortNumber + " is opened @" + gestureBaudRate + " bauds") })
      gesturePort.on('data', function (data) {
        console.log('Data: ' + data);

      });
    }
    else {
      console.log("This port is not compatible with the gesture vote application!");
    }
  });
});




io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});