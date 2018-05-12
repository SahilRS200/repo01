'use strict'
module.exports = function (app) {
    app.route('/click')
    .get(function(req,res) {
        //var devid = req.params.devid;
        //require('../models/VIPL/cricApiModel').broadcastPing(devid);
        const devID = DX108V5N8M1N0OP;
        res.status(200);
        res.send('Message received');
    });

    app.route('/test')
    .get(function (req, res) {
        res.status(200);
        res.send("Api is running ok");
    })
    ;
}