define(['require', 'module', 'underscore', 'jquery', 'backbone', 'layoutmanager'],
  function(require, module, _, $, Backbone, Layout) {
  "use strict";

  // Enable Backbone Events for the app module
  var app = _.extend({}, Backbone.Events);

  // The root path to run the application through.
  app.root = "/";

  app.imgRoot = app.root + "app/img/";

  // API endpoint.
  var localhostPattern = /(localhost|0\.0\.0\.0|127\.0\.0\.1|192\.168\.)/;
  if (localhostPattern.test(window.location.href)) {
    //app.api = "http://xdsl-250-35.nebulazone.fi:5000/";
    app.api = "http://localhost:1337/";
  } else {
    app.api = "https://talkoohakemisto-api.herokuapp.com/";
  }

  app.helpers = {
    generateTypeIconUrl: function(name) {
      return app.imgRoot + 'icons/' + name.toLowerCase().replace("ö", "o").replace("ä", "a") + '.png';
    }
  };

  // Set app object as module output
  module.exports = app;

  /** APP WIDE CONFIGURATIONS **/

  Backbone.Layout.configure({
    manage: true,
    el: false
  });

  // This is for IE8
  if (!window.console) {
    window.console = {
      log: function() {},
      warn: function() {},
      error: function() {}
    };
  }

});
