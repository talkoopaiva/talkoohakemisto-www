define(function(require, exports, module) {
  "use strict";

  // External dependencies.
  var _ = require("underscore");
  var $ = require("jquery");
  var Backbone = require("backbone");
  var Layout = require("layoutmanager");

  // TODO: use requre.js correctly to set "jquery" as a dependency to "bootstrap"
  $().ready(function() {
    require("bootstrap");
  });

  // Alias the module for easier identification.
  var app = module.exports;

  // The root path to run the application through.
  app.root = "/";

  app.imgRoot = app.root + "app/img/";

  // API endpoint.
  var localhostPattern = /(localhost|0\.0\.0\.0|127\.0\.0\.1)/;
  if (localhostPattern.test(window.location.href)) {
    app.api = "http://192.168.1.101:5000/";
  } else {
    app.api = "https://talkoohakemisto-api.herokuapp.com/";
  }

  app.helpers = {
    generateTypeIconUrl: function(name) {
      return app.imgRoot + 'icons/' + name.toLowerCase().replace("ö", "o").replace("ä", "a") + '.png';
    }
  };

  /* TAKEN FROM GITHUB-VIEWER by Albert
  // Useful defaults for GitHub Viewer.
  _.extend(Backbone.Collection.prototype, {
    cache: true,

    initialize: function(models, options) {
      // Automatically extend in passed options.
      _.extend(this, options);

      // Listen for request and sync events to control the `isRequest` flag.
      this.on({
        request: function() {
          this.isRequest = true;
        },

        sync: function() {
          this.isRequest = false;
        }
      });

      // By default the collection is not in a request.
      this.isRequest = false;
    },

    parse: function(obj) {
      // Safety check ensuring only valid data is used.
      if (obj.data.message !== "Not Found") {
        return obj.data;
      }

      return this.models;
    }
  });*/
});
