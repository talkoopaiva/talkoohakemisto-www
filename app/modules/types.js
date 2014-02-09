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
      }
    }),

    Model: Backbone.Model.extend({
        initialize: function(){
            console.log("fetch");
            this.fetch({ url: app.api + "types" }).complete(function() {
              console.log("types fetched");
            });
        }
    })
  };
});