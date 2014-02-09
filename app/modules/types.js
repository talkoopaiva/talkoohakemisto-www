define(function(require, exports, module) {
  "use strict";

  var $ = require("jquery");
  var _ = require("underscore");
  var Backbone = require("backbone");
  var app = require("app");

  module.exports = {
    Collection: Backbone.Collection.extend({
      url: function() {
        return app.api + "types";
      },
      parse: function(data) {
        return data.types;
      },
      model: Backbone.Model.extend({
        initialize: function(){

        }
      })
    })
  };
});