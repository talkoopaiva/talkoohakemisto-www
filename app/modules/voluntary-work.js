define(function(require, exports, module) {
  "use strict";

  var $ = require("jquery");
  var _ = require("underscore");
  var Backbone = require("backbone");
  var app = require("app");

  var generateTypeIconUrl = function(name) {
    return app.imgRoot + 'icons/' + name.toLowerCase().replace("ö", "o").replace("ä", "a") + '.png';
  };

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
        className: "voluntary-work-form container",

        render: function() {
          var data = this.model;
          _.each(data.types, function(v,k) {
            data.types[k]['iconUrl'] = generateTypeIconUrl(v.name);
          });

          this.$el.html( this.template( data ) );
          return this;
        },

        events: {
          "click #save-voluntary-work": "handleForm",
          "click .vw-type": "selectImage"
        },

        selectImage: function(element) {
          $('.vw-type').removeClass('selected').css("background-color", "white");
          $(element.target).toggleClass('selected', true).css("background-color", "red");
        },

        handleForm: function() {
          //form-type-
          console.log($("#form-name").val());
          console.log($("#form-description").val());
          console.log($("#form-municipality").val());
          console.log($("#form-address").val());
          console.log($("#form-realname").val());
          console.log($("#form-email").val());

          var name = $("#form-name").val();

          var VoluntaryWorkModel = Backbone.Model.extend({
            defaults: {

            }
          });

          var VoluntaryWorkCollection = Backbone.Collection.extend({
            model: VoluntaryWorkModel,
            url: app.api + 'voluntary_works'
          });

          var vwcol = new VoluntaryWorkCollection();

          var ok = vwcol.create({voluntary_works: [{
              "name": $("#form-name").val(),
              "description": $("#form-description").val(),
              "links": {
                "municipality": parseInt($("#form-municipality").val()),
                "type": $('.vw-type.selected').data('type-id')
              },
              "contact_email": $("#form-email").val(),
              "street_address": $("#form-address").val(),
              "organizer": $("#form-realname").val()
          }]});

          console.log(ok);

        },

        template: require("ldsh!../templates/voluntary-work-form")
      }),

      Item: Backbone.View.extend({
        initialize: function(el) {
          //console.log(el);
        },

        tagName: "li",
        className: "voluntaryWorkItem row",

        render: function() {
          var data = this.model.toJSON();
          var typeId = data.links.type;
          var municipalityId = data.links.municipality;

          data.municipality = this.model.collection.getLinkedItem('municipalities', municipalityId);
          data.type = this.model.collection.getLinkedItem('types', typeId);

          data.iconUrl = generateTypeIconUrl(data.type.name);

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


});