'use strict';

var serialport = require('serialport');
var events = require('events');

// COM port configuration

var gestureDriver = function gestureDriver() {
    this._gestureBaudRate = 115200;
    this._gesturePort;
    this._eventEmitter = new events.EventEmitter();
    this._bufferSerial = [];
    this._bufferWord;
    this._startFound = false;
};

gestureDriver.prototype.autoDetect = function autoDetect() {
    var that = this;

    serialport.list(function (err, ports) {
        ports.forEach(function (port) {
            console.log({ "port": port.comName, "VendorId_ProductId": port.pnpId, "manufacturer": port.manufacturer });
            if (port.pnpId === "FTDIBUS\\VID_0403+PID_6001+ANZ1S8W9A\\0000") {
                console.log("Port found!");
                that.open(port.comName);
            }
            else {
                console.log("This port is not compatible with the gesture vote application!");
            }
        });
    });
};

gestureDriver.prototype.open = function (portComName) {
    var that = this;

    this._gesturePort = new serialport(portComName, { autoOpen: false, baudRate: this._gestureBaudRate });
    this._gesturePort.on('open', function () { console.log(portComName + " is opened @" + that._gestureBaudRate + " bauds") });
    this._gesturePort.on('error', function () { });


    this._bufferSerial.splice(0, this._bufferSerial.length);
    this._startFound = false;

    this._gesturePort.on('data', function (data) {
        for (var i = 0; i < data.length; i++) {
            if (that._startFound) {
                if (data[i] === 62) {
                    for (var j = 0; j < that._bufferSerial.length; j++) {
                        that._bufferWord += String.fromCharCode(that._bufferSerial[j]);
                    }
                    that._eventHandler(that._bufferWord);
                    that._startFound = false;
                    that._bufferSerial.splice(0, that._bufferSerial.length);
                    that._bufferWord = "";
                }
                else {
                    that._bufferSerial.push(data[i]);
                }
            }
            else {
                if (data[i] === 60) {
                    that._startFound = true;
                }
            }
        }
    });
    this._gesturePort.on('close', function () { console.log() });
    this._gesturePort.on('disconnect', function () { });
    this._gesturePort.open();
}

gestureDriver.prototype._eventHandler = function eventHandler(word) {
    switch (word) {
        case 'overOn_1':
            this._eventEmitter.emit('overOn', {sensor : 1});
            console.log('overOn_1');
            break;
        case 'overOn_2':
            this._eventEmitter.emit('overOn', {sensor : 2});
            console.log('overOn_2');
            break;
        case 'overOn_3':
            this._eventEmitter.emit('overOn', {sensor : 3});
            console.log('overOn_3');
            break;
        case 'overOn_4':
            this._eventEmitter.emit('overOn', {sensor : 4});
            console.log('overOn_4');
            break;
        case 'overOn_5':
            this._eventEmitter.emit('overOn', {sensor : 5});
            console.log('overOn_5');
            break;
        case 'overOff_1':
            this._eventEmitter.emit('overOff', {sensor : 1});
            console.log('overOff_1');
            break;
        case 'overOff_2':
            this._eventEmitter.emit('overOff', {sensor : 2});
            console.log('overOff_2');
            break;
        case 'overOff_3':
            this._eventEmitter.emit('overOff', {sensor : 3});
            console.log('overOff_3');
            break;
        case 'overOff_4':
            this._eventEmitter.emit('overOff', {sensor : 4});
            console.log('overOff_4');
            break;
        case 'overOff_5':
            this._eventEmitter.emit('overOff', {sensor : 5});
            console.log('overOff_5');
            break;
        case 'click_1':
            this._eventEmitter.emit('click', {sensor : 1});
            console.log('click_1');
            break;
        case 'click_2':
            this._eventEmitter.emit('click', {sensor : 2});
            console.log('click_2');
            break;
        case 'click_3':
            this._eventEmitter.emit('click', {sensor : 3});
            console.log('click_3');
            break;
        case 'click_4':
            this._eventEmitter.emit('click', {sensor : 4});
            console.log('click_4');
            break;
        case 'click_5':
            this._eventEmitter.emit('click', {sensor : 5});
            console.log('click_5');
            break;
    }
}



module.exports = gestureDriver;