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

  _.extend(Backbone.Collection.prototype, {
    'url': function() {
      return this.constructor.type ? (app.api + this.constructor.type) : null;
    }
  });

  _.extend(Backbone.Model.prototype, {
    'urlRoot': function() {
      return this.constructor.type ? (app.api + this.constructor.type) : null;
    }
  });

  var oldSync = Backbone.sync;
  Backbone.sync = function(method, model, options) {
    var methodMap = {
      'create': 'POST',
      'update': 'PUT',
      'patch':  'PUT', // PATCH implementation is quite complex in jsonapi - however PUT might work fine
      'delete': 'DELETE',
      'read':   'GET'
    };

    // If model is neither collection nor bb model, or passed settings are unsupported, use original Backbone.sync
    var modelIsFake = typeof model !== "object" || ( !(model instanceof Backbone.Model) && !(model instanceof Backbone.Collection) );
    if (modelIsFake || options.data || options.emulateHTTP || options.emulateJSON) {
      return oldSync.apply(this, arguments);
    }

    var type = methodMap[method];
    var params = {type: type, dataType: 'json'};

    // Ensure that we have a URL.
    if (!options.url) {
      params.url = _.result(model, 'url') || urlError();
    }

    // If collectionName was defined, URL is not needed
    // However, if that wasn't defined, try to guess the collectionName
    var collectionName = model.constructor.type || (function() {
      var url = _.result(model, 'url') || urlError();

      // remove possible app.api path from the beginning
      if (url.indexOf(app.api) === 0) {
        url = url.substring(app.api.length);
      }

      var name = url.replace(/^\/?(\w+)\/?.*$/, "$1");

      return name || urlError();
    }());

    // transform data to fit jsonapi.org spec
    var toJSONApi = function(attributes, model) {
      attributes = attributes || model.toJSON(options);


      _.each(attributes, function(val, key) {
        // if some part is an object with an id, send just the plain id
        if (val.id) {
          attributes[key] = val.id;
        }
      });

      // Wrap data into array and object
      var result = {};
      result[collectionName] = [attributes];

      return result;
    };

    // transform data from jsonapi-endpoint to fit Backbone directly
    var fromJSONApi = function(data, model) {
      if (!data) {
        return data;
      } else if (!data[collectionName] || data[collectionName].length === 0) {
        return;
      }

      var coll = data[collectionName];

      // If linked items are passed in the response, populate them automatically
      if (!_.isEmpty(data.linked)) {
        // Index linked items for faster query
        var linked = {};
        _.each(data.linked, function(coll, key) {
          linked[key] = _.indexBy(coll, 'id');
        });

        var links = data.links;
        _.each(coll, function(item) {
          _.each(item.links, function(id, name) {
            var collectionName = links[collectionName + '.' + name].type;
            // TODO: perhaps new model should be created at this spot
            // another way would be to replace the "linked" attribute's values
            item[name] = linked[collectionName][id];
          });
          // Every linked item is generated -> remove linked
          delete item.links;
        });
      }

      if (!_.isEmpty(data.meta)) {
        // TODO: also store the meta data into the model / collection
      }

      if (model instanceof Backbone.Collection) {
        return coll;
      } else {
        return coll[0];
      }
    };

    if (method === 'create' || method === 'update') {
      params.contentType = 'application/vnd.api+json';
      params.data = JSON.stringify( toJSONApi( options.attrs, model ) );
    } else if (method === 'patch') {
      arams.contentType = 'application/json-patch+json';
      // FIX: patch syntax is very different!
      params.data = JSON.stringify( toJSONApi( options.attrs, model ) );
    }

    // If something's going to be done with the response, transform it to Backbone format
    if (options.success) {
      var success = options.success;
      options.success = function(data) {
        arguments[0] = fromJSONApi(data, model);
        success.apply(this, arguments);
      };
    }

    // Don't process data on a non-GET request.
    if (params.type !== 'GET') {
      params.processData = false;
    }

    // If we're sending a `PATCH` request, and we're in an old Internet Explorer
    // that still has ActiveX enabled by default, override jQuery to use that
    // for XHR instead. Remove this line when jQuery supports `PATCH` on IE8.
    if (params.type === 'PATCH' && noXhrPatch) {
      params.xhr = function() {
        return new ActiveXObject("Microsoft.XMLHTTP");
      };
    }

    var xhr = options.xhr = Backbone.ajax(_.extend(params, options));
    model.trigger('request', model, xhr, options);
    return xhr;
  };

  // This is for IE8
  if (!window.console) {
    window.console = {
      log: function() {},
      warn: function() {},
      error: function() {}
    };
  }

  // Load non-critical dependencies, such as possible jquery plugins aso.
  require(['bootstrap']);

});
