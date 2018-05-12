'use strict'
var WebSocketClient = require('websocket').client;
var client = new WebSocketClient();
var author = "b212345678xz01"
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
    
    function sendNumber() {
        if (connection.connected) {
            var number = Math.round(Math.random() * 0xFFFFFF);
            connection.sendUTF(number.toString());
            setTimeout(sendNumber, 1000);
        }
    }
    sendWelcomePing();
});
 
client.connect('wss://node-db-api.run.aws-usw02-pr.ice.predix.io/wsinit');

