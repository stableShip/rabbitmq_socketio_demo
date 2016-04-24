"use strict"

var mosca = require('mosca')


var pubsubsettings = {
    type: 'amqp',
    json: false,
    amqp: require('amqp'),
    exchange: 'ascolatore5672'
};

var moscaSettings = {
    port: 1883,
    backend: pubsubsettings,
    persistence: {
        factory: mosca.persistence.Mongo,
        url: "mongodb://localhost:27017/mosca"
    }
};


var server = new mosca.Server(moscaSettings);

server.on('error', function(err){
    console.log(err);
});

server.on('ready', function(){
    console.log('Mosca server is up and running');
});
server.on('published', function(packet, client) {
    console.log('Published', packet.payload.toString());
});

server.on('delivered', function(packet, client) {
    console.log('delivered', packet.payload.toString(), client);
});