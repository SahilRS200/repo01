'use strict';
const url = require('url');
const URLSearchParams = url.URLSearchParams;
const axios = require('axios');
const broadcast = require('../webSocket');
var appKey = null;

exports.setAppKey = function (data) {
    console.log("app key set");
    appKey = data;
}
var deviceMap = {
    abcxyz123rt: {
        DeviceName: 'Coffee Machine',
        StockType: ['Milk', 'Coffee beans'],
        DeviceLocation: 'Deloitte Tower 1' // , nth Floor
        // timestamp 
        // account
    },
    defklc123tt: {
        DeviceName: 'Printer',
        StockType: ['Ink', 'Paper']
    },
    d1485xz34yy: {
        DeviceName: 'Vending Machine',
        StockType: ['Chips', 'Biscuits']
    }

}
const getRandomAppendix = function () {
    return Math.floor(Math.random() * 20);

}
const broadcastPing = function (data) {
    console.log('in broad');
    var msg = {}
    msg.type = "BROADCAST"
    msg.author = "IOT"
    msg.payload = {
        device: data.author,
        time: data.time
    };
    broadcast.serverSentEvent(JSON.stringify(msg));
}

// cloud gives ok - amber 
// cloud posts approved - green
// 1. Does axios post to salesforce - amber , else red and green
// 2. Gets 
var queuedSockets = {};
const authorizeCloud = function (data, wsocket) {
    var msg = {}
    msg.type = "ACKNOWLEDGE-FAIL";
    msg.payload = "";
    msg.author = "SERVER";
    //console.log('in ack');
    if (wsocket) { wsocket.send(JSON.stringify(msg)); }
    else {console.log('.. Async Error : Auto login .. work in progress')}
    return;
    //var url = new URL('');
    // var params = new URLSearchParams();
    // params.append('grant_type', 'password');
    // params.append('client_id', '3MVG9d8..z.hDcPL2WFWAz3krOmUhzGUzcMrnW9xuj4CGH.0QdDplSbCEOKXTx44ZddfkQ0JDZ8BMK_cU2_hr');
    // params.append('client_secret', 6992475379054915849);
    // params.append('username', '');
    // params.append('password', '');
    // var url = "https://login.salesforce.com/services/oauth2/token";
    // axios.post(url, params, {
    //     headers: {
    //         'Content-Type': 'application/x-www-form-urlencoded'
    //     }
    // })
    //     .then(function (response) {
    //         appKey = response.data.access_token;
    //         console.log(" ..  Async Response :  Salesforce authorization successful");
    //         if (data && wsocket) { notifyCloud(data, wsocket); }
    //     })
    //     .catch(function (error) {
    //         console.log(error);
    //         var msg = {}
    //         msg.type = "ACKNOWLEDGE-FAIL";
    //         msg.payload = "";
    //         msg.author = "SERVER";
    //         console.log('in ack');
    //         if (wsocket) { wsocket.send(JSON.stringify(msg)); }
    //     })


}
const notifyCloud = function (data, wsocket) {
    if (!appKey) { authorizeCloud(data, wsocket); return; }
    const salesforceurl = "https://aguhamajumder-dev-ed.my.salesforce.com/services/apexrest/IOT";
    var index = getRandomAppendix();
    var time = new Date().getTime();
    var devObj = deviceMap[data.author];
    var postDat = {
        acc: `ACC_${Math.floor(time / 10000)}`,
        name: `${devObj.DeviceName} ${index}`,
        loc: `${devObj.DeviceLocation} , Floor ${(index + 3) % 7}`,
        stock: `${devObj.StockType[index % 2]}`,
        millis: time
    }
    if (appKey) {
        var instance = axios.create();
        instance.defaults.headers.common['Authorization'] = `Bearer ${appKey}`
        axios.post(salesforceurl, postDat)
            .then(function (response) {
                // return amber
                console.log(response.data);
                var KeyTrack = response.data; // set Time-out
                queuedSockets[KeyTrack] = wsocket;
                var msg = {}
                msg.type = "ACKNOWLEDGED";
                msg.payload = "";
                msg.author = "SERVER";
                console.log('in ack');
                wsocket.send(JSON.stringify(msg));

            })
            .catch(function (error) {
                var msg = {}
                msg.type = "ACKNOWLEDGE-FAIL";
                msg.payload = "";
                msg.author = "SERVER";
                console.log('in ack');
                wsocket.send(JSON.stringify(msg));
                // return red and green
            })

    }


}
exports.processPing = function (data, wsocket) {
    //data = JSON.parse(data);
    console.log('in process');
    var devid = data.author;
    var timeRecv = data.payload.timestamp;

    broadcastPing(data);
    // setTimeout(function () {
    //     var msg = {}
    //     msg.type = "ACKNOWLEDGED";
    //     msg.payload = "";
    //     msg.author = "SERVER";
    //     console.log('in ack');
    //     wsocket.send(JSON.stringify(msg));
    // }, 5000);
    //getToken()
    notifyCloud(data, wsocket);

    setTimeout(function () {
        console.log('in appr');
        var msg = {};
        msg.type = "APPROVED-TIMEOUT";
        msg.payload = "";
        msg.author = "SERVER";
        wsocket.send(JSON.stringify(msg));
    }, 60000)

}
exports.cloudlogin = function () {
    authorizeCloud();
    //authorizeCloud();
}
exports.broadcastPing = broadcastPing;
