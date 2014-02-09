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
          //console.log(el);
        },

        tagName: "div",
        className: "voluntaryWorkItem row",

        render: function() {
          var data = this.model.toJSON();
          var typeId = data.links.type;
          var municipalityId = data.links.municipality;

          data.municipality = this.model.collection.getLinkedItem('municipalities', municipalityId);
          data.type = this.model.collection.getLinkedItem('types', typeId);

          data.iconUrl = app.imgRoot + 'icons/' + data.type.name.toLowerCase().replace("ö", "o").replace("ä", "a") + '.png';

          console.log(data);

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
        this.addLinkedItems(data.linked);
        return data.voluntary_works;
      },
      addLinkedItems: function(data) {
        // See if linkedItems metadata already exists, otherwise init
        if (!this.hasOwnProperty('linkedItems')) {
          this['linkedItems'] = {};
        }

        var linkedItems = this['linkedItems'];
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
        this['linkedItems'] = linkedItems;
      },
      getLinkedItem: function(key, id) {
        return this.linkedItems[key][id];
      }
    })


  };


});