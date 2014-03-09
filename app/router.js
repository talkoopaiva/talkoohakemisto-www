define(function(require, exports, module) {
  "use strict";

  var app = require("app");

  // External dependencies.
  var Backbone = require("backbone");

  var VoluntaryWork = require("modules/voluntary-work");
  var Types = require("modules/types");
  var Municipalities = require("modules/municipalities");

  // Defining the application router.
  module.exports = Backbone.Router.extend({
    initialize: function() {

      this.voluntaryWorks = new VoluntaryWork.Collection();
      this.types = new Types.Collection();
      this.municipalities = new Municipalities.Collection();

      this.views = {

      };
    },

    routes: {
      "": "list",
      "list": "list",
      "form": "form",
      "view/:id": "form"
    },

    list: function() {

      // Empty existing itemlist
      //$('ul.itemList').html('');
      if (!this.views.voluntaryWorkList) {
        this.views.voluntaryWorkList = new VoluntaryWork.Views.List({collection: this.voluntaryWorks});
        console.log('list route created');
      } else {
        this.views.voluntaryWorkList.show();
        console.log('list route displayed');
      }
    },

    form: function(id) {
      // If "id" is not present, new item creation is triggered

      console.log('form route triggered');
      var collection = this.voluntaryWorks;

      var renderForm = function(router) {
        $('#voluntaryWorkDetails').empty();

        var constructs = {
          collection: router.voluntaryWorks,
          linkedItems: {
            types: router.types,
            municipalities: router.municipalities
          }
        };

        var modelFetched = $.Deferred();

        // If id -> then it's edit, so we have to fetch model
        if (id) {
          // TODO: first look in the collection
          constructs.model = new VoluntaryWork.Model({id: id});
          $.when(constructs.model.fetch()).then(modelFetched.resolve, modelFetched.reject);
        } else {
          modelFetched.resolve();
        }

        // TODO: handle REJECT case (in case API error)!
        modelFetched.then(function() {
          var itemView = new VoluntaryWork.Views.Form(constructs).render();
          // TODO: DOM manipulation should be done in View instead of router
          $('#voluntaryWorkDetails').html(itemView.$el);
        });

        $('#voluntaryWorkList').hide();
        $('#voluntaryWorkDetails').show();
      };

      var router = this;
      if (this.municipalities.length < 1 || this.types.length < 1) {
        $.when(this.municipalities.fetch(), this.types.fetch()).done(function() {
          renderForm(router);
        });
      } else {
        renderForm(router);
      }
    }
  });
});