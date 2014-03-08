define(function(require, exports, module) {
  "use strict";

  var $ = require("jquery");
  var _ = require("underscore");
  var Backbone = require("backbone");
  var app = require("app");

  var VoluntaryWorkModel = Backbone.Model.extend({
    url: function() {
      return app.api + "voluntary_works/" + this.id;
    },
    parse: function(data) {
      if (data.hasOwnProperty('voluntary_works')) {
        console.log('fetched', data.voluntary_works[0]);
        return data.voluntary_works[0];
      } else {
        return data;
      }
    },
    defaults: {
      name: ''
    },
  });

  var VoluntaryWork = {

    Views: {
      // HERE GO ALL THE CHANGING VIEW COMPONENTS OF THE UI

      "Form": require('modules/views/form'),

      "Item": require('modules/views/item'),

      "List": require('modules/views/list'),

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
        this.addLinkedItems(data.linked);
        return data.voluntary_works;
      },
      addLinkedItems: function(data) {
        // See if linkedItems metadata already exists, otherwise init
        if (!this.hasOwnProperty('linkedItems')) {
          this.linkedItems = {};
        }

        var linkedItems = this.linkedItems;
        _.each(data, function(val, key) {
          // See if linked items with this key already exists, otherwise create
          if (!linkedItems.hasOwnProperty(key)) {
            linkedItems[key] = {};
          }
          // Iterate over linked items and add them to metadata
          _.each(val, function(item) {
            linkedItems[key][item.id] = item;
          });
        });
        // Update stored linked items
        this.linkedItems = linkedItems;
      },
      getLinkedItem: function(key, id) {
        return this.linkedItems[key][id];
      }
    })

  };

  module.exports = VoluntaryWork;

});