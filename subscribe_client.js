"use strict"
var mqtt = require('mqtt');

var app = require("./app");
var io = require("./io");

// 启动http服务器
var server = app.listen(app.get("port"), function () {
    console.log("server listen in ", app.get("port"))
})

// 启动socketio服务器
io.listen(server, {'pingInterval': 10000});

// 连接mqtt服务器
var client = mqtt.connect('mqtt://localhost:1883',{clientId:'1',clean:true});

// 监听 test topic
client.subscribe('test',{qos:1});

client.on('message', function (topic, data) {
    // todo 将数据解析,根据to 发送给某个用户, 或者便利发送给所有人
    data = JSON.parse(data.toString())
    if(!data.to) {
        io.broadcast(data);
    }else{
        io.privateChat(data);
    }
});