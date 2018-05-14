var express = require('express');
// var https = require('https');
var http = require('http');

app = express();
//var appSecure = https.createServer(ssl.getSSLOptions());
port = process.env.PORT || 3003;
var server = http.createServer(app).listen(port);


var routes = require('./routes/publicroutes');
routes(app);


var ws = require('./webSocket');
console.log('Node server is now primed at port : ' + port);
console.log("Houston, we are go for startup sequence");
console.log("1. Async Trigger :  message exchange via websocket");
ws.startWebSocketServer(server);
require('./startup').startup();
console.log("asychronous triggers complete . Ready to rock and roll")
