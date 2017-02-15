'use strict';

// Import app modules (Server: Http, Express / Utils : Path,Morgan / Interfaces: Serialport, Socket.io)

var express = require('express');
var http = require('http');
var path = require('path');
var logger = require('morgan');
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

var GestureDriver = require('./lib/gesture-driver');
var gestureController = new GestureDriver();



httpServer.listen(app.get('port'), function () {
  gestureController.autoDetect();
  console.log('Example app listening on port ' + app.get('port') + ' !');
});

io.on('connection', function (socket) {
  gestureController._eventEmitter.on('overOn', function (param) {
    socket.emit('overOn', param);
  });
  gestureController._eventEmitter.on('overOff', function (param) {
    socket.emit('overOff', param);
  });
  gestureController._eventEmitter.on('click', function (param) {
    socket.emit('click', param);
  });
});