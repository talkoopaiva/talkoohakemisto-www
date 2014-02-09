define(function(require, exports, module) {
  "use strict";

  var $ = require("jquery");
  var _ = require("underscore");
  var Backbone = require("backbone");
  var app = require("app");


  module.exports = {
    Collection: Backbone.Collection.extend({
      url: function() {
        return app.api + "voluntary_works/" + this.id + "/?callback=?";
      }
    }),

    Views: {
      // HERE GO ALL THE CHANGING VIEW COMPONENTS OF THE UI

      Item: Backbone.View.extend({
        initialize: function() { },

        tagName: "li",

        render: function() {
          this.$el.html(  )
        },

        template: require("ldsh!../templates/voluntary-work-item")
      }),

      List: Backbone.View.extend({
        template: require("ldsh!../templates/voluntary-work-list"),

        serialize: function() {
          return { users: this.collection };
        },

        beforeRender: function() { },
        afterRender: function() { },
        initialize: function() { }

      }),

      Details: Backbone.View.extend({
        initialize: function() {},

        template: require("ldsh!../templates/voluntary-work-details")
      })

    },

    Model: Backbone.Model.extend({
      defaults: {
        title: ''
      }
    })


  };


});