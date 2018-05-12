

var express = require('express');
// var https = require('https');
var http = require('http');
var bodyParser = require('body-parser');

app = express();
//var appSecure = https.createServer(ssl.getSSLOptions());
port = process.env.PORT || 3003;
// var app = http.createServer();
var server = http.createServer(app).listen(port);

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

var routes = require('./publicroutes');
routes(app);
var devID = abcxyz123rt;


var WebSocketClient = require('websocket').client;
var client = new WebSocketClient();

client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
});
 
client.on('connect', function(connection) {
    console.log('WebSocket Client Connected');
    connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
    });
connection.on('close', function() {
        console.log('echo-protocol Connection Closed');
    });
connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log("Received: '" + message.utf8Data + "'");
        }
    });
    
   const emitClick = function () {
        if (connection.connected) {
            var msg = {};
	    msg.type = "IOT";
            msg.author = devID
            msg.payload = {timestamp : new Date().getTime()}
            connection.sendUTF(JSON.stringify(msg));
            //setTimeout(sendNumber, 1000);
        }
    }
    // sendNumber();
});
client.connect('wss://node-db-api.run.aws-usw02-pr.ice.predix.io/wsinit');
// GPIO 
const Gpio = require('onoff').Gpio;
const button = new Gpio(17, 'in', 'rising' , {debounceTimeout: 10});
button.watch(function (err, value) {
	console.log(err);
  console.log(value);
});
 


