"use strict"

var mqtt = require('mqtt');

var client = mqtt.connect('mqtt://localhost:1883');

//client.subscribe('presence');
var num = 0;
setInterval(function () {
    var message = {to: num++}
    client.publish('test', JSON.stringify(message), {qos: 1, retain: true});
}, 1000);