/*
* Use this file to add any batch job or sync job you might wanna run after a server reboot, normal or otherwise
*/
'use strict';
exports.startup = function(app) {
    // Set up logon 
    console.log("2. Async Setup :  Salesforce authorization");
    require('./controllers/iotcontroller').cloudlogin()

}