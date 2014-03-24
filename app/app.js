define(['require', 'module', 'underscore', 'jquery', 'backbone', 'layoutmanager'],
  function(require, module, _, $, Backbone, Layout) {
  "use strict";

  // Enable Backbone Events for the app module
  var app = _.extend({}, Backbone.Events);

  // The root path to run the application through.
  app.root = "/";

  app.imgRoot = app.root + "app/img/";

  // API endpoint.
  var localhostPattern = /(localhost|0\.0\.0\.0|127\.0\.0\.1|192\.168\.|\.local)/;
  if (localhostPattern.test(window.location.href)) {
    //app.api = "http://xdsl-250-35.nebulazone.fi:5000/";
    //app.api = app.root + "sample-responses/";
    app.api = "http://jaffatron.com:5000/";
  } else {
    app.api = "https://talkoohakemisto-api.herokuapp.com/";
  }

  app.helpers = {
    generateTypeIconUrl: function(name) {
      return app.imgRoot + 'icons/' + name.toLowerCase().replace("ö", "o").replace("ä", "a") + '.png';
    },

    // Detect if XHR CORS is supported
    // http://j.mp/1jwl6hB
    supportsCors: (function() {
      var xhr = new XMLHttpRequest();
      if ("withCredentials" in xhr) {
        // Supports CORS
        return true;
      } else if (typeof XDomainRequest != "undefined") {
        // IE
        // Also API and site protocols have to match
        return (app.api.indexOf(location.protocol) === 0 || app.api[0] === '/') && 'XDomainRequest';
      }
      return false;
    }())
  };

  // Set app object as module output
  module.exports = app;

  /** APP WIDE CONFIGURATIONS **/

  Backbone.Layout.configure({
    manage: true,
    el: false
  });

  // Common extensions for model & collection
  var extensions = {
    initialize: function(models, options) {

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

      // Model is fetched whenever it has been loaded from the server
      // Every time load occurs .parse() is invoked (even on save)
      var oldParse = this.parse;
      this.hasFetched = false;
      this.parse = function() {
        this.hasFetched = true;
        return oldParse.apply(this, arguments);
      };

      // This is the same as fetch() but executes only once and every time returns the same response
      // a la Cache
      this.fetched = _.once(function(options) {
        if ( (this instanceof Backbone.Model && this.id && (this.hasFetched || this.collection && this.collection.hasFetched) ) ||
                (this instanceof Backbone.Collection && this.models.length > 0 && this.hasFetched) ) {
          // Return deferred similar to what .fetch() would have returned
          // TODO: verify that the structure is really correct (esp. this?)
          return new $.Deferred().resolveWith(this, [this.toJSON(), "success"]);
        }
        return this.fetch.call(this, options);
      });

    },
  };

  // Extend Collection prototype
  _.extend(Backbone.Collection.prototype, _.extend({
    url: function() {
      return this.constructor.type ? (app.api + this.constructor.type) : null;
    }
  }, extensions));

  // Extend Model prototype
  _.extend(Backbone.Model.prototype, _.extend({
    urlRoot: function() {
      return this.constructor.type ? (app.api + this.constructor.type) : null;
    }
  }, extensions));

  var oldSync = Backbone.sync;
  Backbone.sync = function(method, model, options) {
    var methodMap = {
      'create': 'POST',
      'update': 'POST',
      'patch':  'POST', // PATCH implementation is quite complex in jsonapi - however PUT might work fine
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
      var links = {};

      _.each(attributes, function(val, key) {
        // if some part is an object with an id, send just the plain id
        if (val.id) {
          attributes[key] = val.id;
          // Also, the API seems to demand then in the links-object
          links[key] = val.id;
        }
      });

      _.each(model.links, function(plural, singular) {
        if (_.has(attributes, singular)) {
          // If any linked fields are found, gather them
          links[singular] = attributes[singular];
          // Delete links from the root
          delete attributes[singular];
        }
        // TODO: add handling for one-to-many relationships
      });

      if (!_.isEmpty(links)) {
        attributes.links = links;
      }

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
            var fieldName = links[collectionName + '.' + name].type;
            // TODO: perhaps new model should be created at this spot
            // another way would be to replace the "linked" attribute's values
            item[name] = linked[fieldName][id];
          });
          // Every linked item is generated -> remove linked
          delete item.links;
        });
      }

      if (!_.isEmpty(data.meta)) {
        // Store the meta data into the model / collection
        model.meta = data.meta;
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
      // TODO: implement patch syntax that jsonapi depands
      // Until then use PUT/POST instead
      params.contentType = 'application/vnd.api+json';
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

    _.extend(params, options);

    // If we're sending a `PATCH` request, and we're in an old Internet Explorer
    // that still has ActiveX enabled by default, override jQuery to use that
    // for XHR instead. Remove this line when jQuery supports `PATCH` on IE8.
    // if (params.type === 'PATCH' && noXhrPatch) {
    //   params.xhr = function() {
    //     return new ActiveXObject("Microsoft.XMLHTTP");
    //   };
    // }

    // IE sucks at CORS so we need to do some ritual dance
    if (app.helpers.supportsCors === 'XDomainRequest' ) {
      if ( method === 'read' ) {
        options.type = 'GET';
      } else {
        options.type = 'POST';
      }
      options.contentType = 'text/plain';

    } else if ( app.helpers.supportsCors === false && ['create', 'read'].indexOf(method) !== -1 ) {
      // We can do JSONP for only viewing and creating
      params.dataType = 'jsonp';
      params.type = 'GET';
      if (method === 'create') {
        params.url = params.url + '/create';
        params.data = {"data": params.data};
      }
      delete params.processData;
      delete params.type;
      delete params.contentType;
    }

    var xhr = options.xhr = Backbone.ajax(params);
    model.trigger('request', model, xhr, options);
    return xhr;
  };

  // This is for IE8
  if (!window.console) {
    window.console = {
      log: $.noop,
      warn: $.noop,
      error: $.noop
    };
  }

  // Load non-critical dependencies, such as possible jquery plugins aso.
  require(['bootstrap']);

});
