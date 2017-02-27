var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var express = require("express");
var RED = require("node-red");

var conf = require("./conf/node-red-security-conf");
var settings = conf.nodered;
// authMiddleware  places the token for the first time globally so that the node inside the flow can pick it up
var authMiddleware = require("./lib/auth").bind(this,conf);



// Create an Express app
var app = express();
//required by agile not node-red
app.use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json());
app.set('view engine', 'ejs');
// Add a simple route for static content served from 'public'
app.use("/",express.static("public"));

// this part ensures that only the proper agile user sees the node-red editor
// authMiddleware  places the token for the first time globally so that the node inside the flow can pick it up
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

//this middleware rewrites the idm-node credentials to enable fetching the token from the "session"
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
app.use(settings.httpAdminRoot, RED.httpAdmin);


// Serve the http nodes UI from /api
app.use(settings.httpNodeRoot, RED.httpNode);

server.listen(conf.security.port);

// Start the runtime
RED.start();
