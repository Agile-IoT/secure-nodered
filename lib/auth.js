var createError = require('http-errors');
var idmClient = require('./idm-client');

module.exports = function (config, req, res, next) {

  //curl -H "Content-type: application/json" -d '{"username":"admin","password":"password","scope":"", "client_id":"node-red-editor", "grant_type":"password"}' http://localhost:8000/red/auth/token
  //var url_parts = url.parse(req.url, true);
  var token = req.query.token;
  if (!token) {
    res.status(401);
    res.send("authentication required. No token found in query parameters.");
  } else {
    idmClient.profileFromIDM(config.idm, token, function (error, user) {
      if (error) {
        console.log("error when getting profile " + JSON.stringify(error));
        res.status(error.statusCode);
        return res.send(error.message);
      } else if (user) {
        if (config.security.userid ==="any" || user.id === config.security.userid) {
          //this is the place to set the token for the first time globally
          global.token = token;
          next();
        } else {
          res.status(403);
          console.log("user found "+user.id);
          res.send("User attempting to access this application is not allowed");
        }
      }
    });
  }

  //console.log("previous authorization header "+req.headers.authorization + " path "+ req.path);

};
