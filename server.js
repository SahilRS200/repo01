const Gpio = require('onoff').Gpio;
var ledR = new Gpio(23, 'out');
var ledY = new Gpio(27, 'out');
var ledG = new Gpio(22, 'out');
var interval= null;
ledR.writeSync(0);
ledY.writeSync(0);
ledG.writeSync(1);
var interval = null;
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
var devID = "abcxyz123rt";
var emitClick;
var disableClick = false;
var blinkerInterval= null;

var blinkLEDSend = function() {
clearInterval(blinkerInterval);
	ledR.writeSync(1);
	ledY.writeSync(0);
	ledG.writeSync(0)
}
var blinkLEDAck = function() {
clearInterval(blinkerInterval);
	ledR.writeSync(0);
	ledY.writeSync(1);
	ledG.writeSync(0)
}
var blinkLEDAckf = function() {
clearInterval(blinkerInterval);
	ledR.writeSync(1);
	ledY.writeSync(0);
	ledG.writeSync(1);
}

var blinkLEDAprf = function() {
clearInterval(blinkerInterval);
	ledR.writeSync(0);
	ledY.writeSync(1);
	ledG.writeSync(1)
}

var blinkLEDApr = function() {
clearInterval(blinkerInterval);
	ledR.writeSync(0);
	ledY.writeSync(0);
	ledG.writeSync(1);
}
var blinkLEDAprt = function() {
	ledR.writeSync(0);
	ledY.writeSync(0);
	ledG.writeSync(1);
	blinkerInterval = setInterval(function(){
		ledG.writeSync(ledG.readSync()^1)
	},500);
}



var WebSocketClient = require('websocket').client;
var client = new WebSocketClient();

client.on('connectFailed', function(error) {
clearInterval(blinkerInterval);
    console.log('Connect Error: ' + error.toString());
	ledR.writeSync(1);
	ledY.writeSync(1);
	ledG.writeSync(1);
});
 
client.on('connect', function(connection) {
clearInterval(interval); console.log('reconnected'); disableClick = false ; blinkLEDApr();
clearInterval(blinkerInterval);
    console.log('WebSocket Client Connected');
    connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
    });

connection.on('close', function() {
clearInterval(blinkerInterval);
        console.log('echo-protocol Connection Closed');
	ledR.writeSync(1);
	ledY.writeSync(0);
	ledG.writeSync(0);
	
	interval = setInterval(function(){
		console.log('reconnect');
	ledR.writeSync(1);
	ledY.writeSync(1);
	ledG.writeSync(1);
		client.connect('wss://node-db-api.run.aws-usw02-pr.ice.predix.io/wsinit');
		} , 10000)
    });
connection.on('message', function(message) {
	
        if (message.type === 'utf8') {
            console.log("Received: '" + message.utf8Data + "'");
		var messagedata = JSON.parse(message.utf8Data);
		if(messagedata.type === 'ACKNOWLEDGED') {disableClick=true ; blinkLEDAck() }
		else if(messagedata.type === 'APPROVED') {disableClick=false ; blinkLEDApr() }
		else if(messagedata.type === 'ACKNOWLEDGE-FAIL') {disableClick=false ; blinkLEDAckf() }
		else if(messagedata.type === 'APPROVED-FAIL') {disableClick=false ; blinkLEDAprf() }
		else if(messagedata.type === 'APPROVED-TIMEOUT') {disableClick=false ; blinkLEDAprt() }	
		
        }
    });
    
emitClick = function () {
clearInterval(blinkerInterval);
        if (connection.connected) {
            var msg = {};
	    msg.type = "IOT";
            msg.author = devID
            msg.payload = {timestamp : new Date().getTime()}
	    //msg.payload = devID + " pinged";
		console.log(JSON.stringify(msg));
            connection.sendUTF(JSON.stringify(msg));
		disableClick=true ; blinkLEDSend()
            //setTimeout(sendNumber, 1000);
        }
    }
    // sendNumber();
});
client.connect('wss://node-db-api.run.aws-usw02-pr.ice.predix.io/wsinit');
// GPIO 

const button = new Gpio(17, 'in', 'rising' , {debounceTimeout: 100});
button.watch(function (err, value) {
	// console.log(err);
  console.log(value);
if(value === 1 && !disableClick){emitClick()}
});
 


