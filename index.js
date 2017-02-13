var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var express = require("express");
var RED = require("node-red");

var conf = require("./conf/node-red-security-conf");

// Create an Express app
var app = express();

app.use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json());

// Add a simple route for static content served from 'public'
app.use("/",express.static("public"));

// Create a server
var server = http.createServer(app);

// Create the settings object - see default settings.js file for other options
var settings = conf.nodered;

// Initialise the runtime with a server and settings
RED.init(server,settings);

var deployURL = settings.httpAdminRoot.match(path.sep + "$") ? settings.httpAdminRoot : settings.httpAdminRoot + path.sep;
deployURL += "flows";

app.post(deployURL, function(req, res, next) {
    if(req.body && req.body.flows) {
        var flows = req.body.flows;
        for(var n in flows) {
            var node = flows[n];
            if(conf.security && node.type === conf.security.idmNodeType) {
                // deployment is differential, so always create
                // the object, if it does not exist
                if(!node.credentials)
                    req.body.flows[n].credentials = {};

                // set clientId and clientSecret in the flow
                req.body.flows[n].credentials.clientId = conf.security.clientId;
                req.body.flows[n].credentials.clientSecret = conf.security.clientSecret;
            }
        }
    }
    next();
});

// Serve the editor UI from /red
app.use(settings.httpAdminRoot,RED.httpAdmin);


// Serve the http nodes UI from /api
app.use(settings.httpNodeRoot,RED.httpNode);

server.listen(conf.security.port);

// Start the runtime
RED.start();
