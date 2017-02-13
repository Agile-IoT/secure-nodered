module.exports = {
   "security":{
      clientId : "clientId",
      clientSecret : "secret",
      userid : "bob!@!agile-local",
      port : 8000
    },
    "nodered":{ 
      httpAdminRoot:"/red",
      httpNodeRoot: "/api",
      userDir:"./.nodered/",
      functionGlobalContext: { }    // enables global context
    }
};
