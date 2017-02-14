var http = require('http');
var express = require("express");
var RED = require("node-red");
var conf = require("./conf/node-red-security-conf");
var settings = conf.nodered;
var authMiddleware = require("./lib/auth").bind(this,conf);



// Create an Express app
var app = express();
//required by agile not node-red
app.set('view engine', 'ejs');
// Add a simple route for static content served from 'public'
app.use("/",express.static("public"));

//app.use("/red-agile",authMiddleware, express.static("client"));
app.use("/red-agile",authMiddleware, function (req, res, next){
    res.render('index', {
      "user": conf.nodered_integration.username,
      "password": conf.nodered_integration.password,
      "client_id": conf.nodered_integration.client_id,
      "path" : settings.httpAdminRoot
    });
});


// Create a server
var server = http.createServer(app);
// Create the settings object - see default settings.js file for other options

settings.httpAdminAuth = settings.httpAdminAuth || settings.httpAuth;

// Initialise the runtime with a server and settings
RED.init(server,settings);

// Serve the editor UI from /red
app.use(settings.httpAdminRoot, RED.httpAdmin);

// Serve the http nodes UI from /api
app.use(settings.httpNodeRoot, RED.httpNode);

server.listen(conf.security.port);

// Start the runtime
RED.start();
