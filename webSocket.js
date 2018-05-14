'use strict';

//var app = require('../server').getCurrentServerApp();
var Websocket = require('ws');
var wserver;
var keepaliveInterval = null;

var websocketVerify = function (info, cb) {
    console.log(info.req.headers['sec-websocket-protocol']);
    // var security = require('../../security');
    // cb(security.verifyToken(info.req.headers['sec-websocket-protocol']));
    cb(true);

    // VULNERABLE
}
var startKeepAliveTimer = function () {
    keepaliveInterval = setInterval(function () {
        //console.log('pinging');
        console.log(`Server is sending handshake to all ${wserver.clients.size} client(s)`);
        wserver.clients.forEach(function (e) {
            e.ping(function () {
          //      console.log('pinged');
            })
        })
    }, 45000);
}

var broadCastMsg = function (msg, author, self) {
    //console.log(`in broadcast ${msg}`);
    wserver.clients.forEach(e => {
        if (Object.is(e, self)) {
            // console.log("in is loop");
            //continue;
        }
        else if (author) {
            var msgB = {};
            msgB.type = "BROADCAST"
            msgB.author = author
            msgB.payload = msg
            e.send(JSON.stringify(msgB));
        }
        else { e.send(msg); }
    });
}
const sendStringMessage = function (msg, wsocket) {
    wsocket.send(msg);
}

exports.startWebSocketServer = function (server) {
    var connections = {}
    wserver = new Websocket.Server({
        verifyClient: websocketVerify,
        server: server,
        path: '/wsinit'
    });
    console.log(".. Async Response :  Websocket ready for connections");
    wserver.on('connection', function (wsocket) {
        //console.log(wsocket);
        // wsocket.send('Hi there, I am a WebSocket server');
        if (typeof keepaliveInterval !== 'undefined') {
            startKeepAliveTimer();
        }
        broadCastMsg('we have a new member', 'SERVER');
       // LiveScore.sendLatest(wsocket);
        var iotctl;
        try {
            iotctl = require('./controllers/iotcontroller');
        }
        catch (err) {
            console.log(err);
        }
        // LiveScore.startLiveScoreAPI();
        wsocket.on('message', function (msg) {
            try {
                var payload = JSON.parse(msg);
                console.log(payload.msg);
                if (payload.type === 'IOT') {
                    console.log('intercepted iot');

                    iotctl.processPing(payload, wsocket);
                }
                else if (payload.type === 'BROADCAST') {
                    broadCastMsg(payload.msg, payload.author);
                }
                else {
                    try { require('./websocketaction').mapActionToMethod(payload, wsocket); }
                    catch (e) {
                        console.log(e);
                        wsocket.send(JSON.stringify({ err: "Incorrect action" }));
                    }
                }
            }
            catch (e) {
                console.log(e);
                wsocket.send(JSON.stringify({ err: "Incorrect json" }));
            }
        });
    });
}

exports.serverSentEvent = function (msg) {
    broadCastMsg(msg)
}


