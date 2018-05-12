var express = require('express');
// var https = require('https');
var http = require('http');

app = express();
//var appSecure = https.createServer(ssl.getSSLOptions());
port = process.env.PORT || 3003;

var routes = require('./publicroutes');
routes(app);

