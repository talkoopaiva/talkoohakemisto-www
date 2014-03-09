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
        //console.log('list route created');
      } else {
        this.views.voluntaryWorkList.show();
        //console.log('list route displayed');
      }
    },

    form: function(id) {
      // If "id" is not present, new item creation is triggered

      console.log('form route triggered');
      var collection = this.voluntaryWorks;

      $('#voluntaryWorkDetails').empty();

      var router = this;
      var constructs = {
        collection: router.voluntaryWorks,
        linkedItems: {
          types: router.types,
          municipalities: router.municipalities
        }
      };

      var dependencies = [];

      // If id -> then it's edit, so we have to fetch model
      if (id) {
        // TODO: first look in the collection
        constructs.model = new VoluntaryWork.Model({id: id});
        dependencies.push(constructs.model.fetch());
      }

      if (this.municipalities.length < 1) {
        dependencies.push(this.municipalities.fetch());
      }

      if (this.types.length < 1) {
        dependencies.push(this.types.fetch());
      }

      $.when.apply(this, dependencies).done(function() {
        var itemView = new VoluntaryWork.Views.Form(constructs).render();

        // TODO: DOM manipulation should be done in View instead of router
        $('#voluntaryWorkDetails').html(itemView.$el);
      });

      $('#voluntaryWorkList').hide();
      $('#voluntaryWorkDetails').show();

    }

  });
});