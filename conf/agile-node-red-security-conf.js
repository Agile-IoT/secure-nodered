module.exports = {
  "security": {
    clientId: "MyAgileClient2",
    clientSecret: "Ultrasecretstuff",
    userid: "any",
    idmNodeType: "idm-token",
    port: 1880
  },
  "idm": {
    userInfoUrl: "http://agile-security:3000/oauth2/api/userinfo"
  },
  "nodered_integration": { //this is used to login over the browser with node-red admin
    username: "admin",
    password: "password", //the proper hash of this password goes in nodered.adminAuth.users[0].password
    client_id: "node-red-editor"
  },
  "nodered": {
    httpAdminRoot: "/red/",
    httpNodeRoot: "/api/",
    userDir: "/opt/secure-nodered/.nodered/",
    adminAuth: {
      type: "credentials",
      users: [{
        username: "admin",
        password: "$2a$08$zZWtXTja0fB1pzD4sHCMyOCMYz2Z6dNbM6tl8sJogENOMcxWV9DN.",
        permissions: "*"
      }]
    },
    functionGlobalContext: {} // enables global context
  }
};
