# Startup instructions : 

#
# NODE JS BASED DATA INTERCHANGE LAYER FOR RAS pi DASH PROJECT
#


# TO START WEBSOCKETS AND CONNECT TO RAS PI IN NETWORK
1. You need to have Node JS installed . 
2. Do "npm install" if this is a first time or else "npm start" to trigger server

# TO USE SALESFORCE CONNECTOR

1. For safety no hardcoded account details are persisted. 
2. Please login to salesforce externally and obtain access token
3. Use the api '/iot/setSecret' to set the token and also to replace existing token

# TO SET NEW SERVER STARTUP TASKS : 

1. We allow you to setup server tasks and timers on startup. please use startup.js to control such sequeunces at your risk.


#Important Note : This code is for demonstration purpose only. Please modify with extreme caution.
# MEGATHON : 11 MAY 2018 
# TEAM : DECATHRON 

