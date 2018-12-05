/*******************************************************************************
 *Copyright (C) 2017 UNI Passau, FBK.
 *All rights reserved. This program and the accompanying materials
 *are made available under the terms of the Eclipse Public License v1.0
 *which accompanies this distribution, and is available at
 *http://www.eclipse.org/legal/epl-v10.html
 *
 *Contributors:
 *    UNI Passau, FBK - initial API and implementation
 ******************************************************************************/
var createError = require('http-errors');
var request = require('request');

var profileFromIDM = function (conf, accessToken, done) {
  var options = {
    url: conf.userInfoUrl,
    headers: {
      'Authorization': 'bearer ' + accessToken,
      'User-Agent': 'user-agent',
      'Content-type': 'application/json'
    }
  };
  request.get(options, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      try {
        var user = JSON.parse(body);
        return done(null, user);
      } catch (e) {
        return done(createError(500, "unexpected result from IDM userinfo endpoint " + body + e), null);
      }
    } else if (!error) {
      return done(createError(response.statusCode, body), null);
    } else {
      return done(createError(500, "unexpected error. response from idm " + error), null);
    }
  });
};

module.exports = {
  profileFromIDM: profileFromIDM
};
