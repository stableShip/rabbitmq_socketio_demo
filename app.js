"use strict"


/**
 * http 服务器配置
 * @type {*|exports|module.exports}
 */
var express = require("express");
var app = express();
var path = require("path");
var mqtt = require('mqtt');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');

// 配置mqtt客户端
var client = mqtt.connect('mqtt://localhost:1883');

// express配置
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public'), {maxAge: 86400000}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function (req, res) {
    res.render("index");
})


app.post("/login", function (req, res) {
    // todo  根据username生成token,返回客户端,客户端使用token连接socketio服务器
    var userName = req.body.userName;
    var token = jwt.sign({name: userName}, 'socketIoSecret');
    res.send(token);
})

app.post("/message/post", function (req, res) {
    // todo 消息格式验证
    // todo 将消息publish给mqtt服务器
    var message = {
        from: req.body.from,
        to: req.body.to || "",
        message: req.body.message
    }
    client.publish('test', JSON.stringify(message), {qos: 1, retain: true});
    res.send(200);
})

module.exports = app;