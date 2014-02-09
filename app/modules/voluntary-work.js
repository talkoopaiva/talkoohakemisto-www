define(function(require, exports, module) {
  "use strict";

  var $ = require("jquery");
  var _ = require("underscore");
  var Backbone = require("backbone");
  var app = require("app");

  var VoluntaryWorkModel = Backbone.Model.extend({
    defaults: {
      name: 'Talkoo XYZ'
    }
  });

  module.exports = {

    Views: {
      // HERE GO ALL THE CHANGING VIEW COMPONENTS OF THE UI

      Form: Backbone.View.extend({
        initialize: function() { },

        tagName: "div",

        render: function() {
          this.$el.html( this.template( this ) );
          return this;
        },

        template: require("ldsh!../templates/voluntary-work-form")
      }),

      Item: Backbone.View.extend({
        initialize: function(el) {
          console.log(el);
        },

        tagName: "div",
        className: "voluntaryWorkItem row",

        render: function() {
          var data = this.model.toJSON();
          console.log(data);
          var typeId = data.links.type;
          var municipalityId = data.links.municipality;

          this.$el.html( this.template( data ) );
          return this;
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

    Model: VoluntaryWorkModel,

    Collection: Backbone.Collection.extend({
      model: VoluntaryWorkModel,
      url: function() {
        return app.api + "voluntary_works";
      },
      parse: function(data) {
        return data.voluntary_works;
      }
    })


  };


});