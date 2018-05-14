module.exports = function (app) {

    app.route('/iot/ping/:devid')
        .get(function (req, res) {
            var devid = req.params.devid;
            var msg = {}
            msg.device = devid;
            msg.time = new Date().getTime();
            //  msg.payload = 'Pinged ' + devid;

            require('../controllers/iotcontroller').broadcastPing(msg); // change
            res.status(200);
            res.send('Message received');
        });

    app.route('/iot/setSecret/:secret')
        .get(function (req, res) {
            var devappkey = req.params.secret;
            try {
                require('../controllers/iotcontroller').setAppKey(devappkey);
                res.status(200);
            }
            catch (e) {
                console.log(e)
                res.status(500);
            }
            res.send();
        });

    app.route('/iot/setApproval')
        .post(function (req, res) {
            //  console.log(req);
            res.status(200);
            res.send();
        })
        .get(function (req, res) {
            // console.log(req);
            res.status(200);
            res.send();
        });
}
