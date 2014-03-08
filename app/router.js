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
      console.log('form route triggered');
      var collection = this.voluntaryWorks;

      var renderForm = function(router) {
        $('#voluntaryWorkDetails').empty();

        var model = {};
        if (id) {
          var item = new VoluntaryWork.Model({id: id});
          $.when(item.fetch()).then(function() {
            model = item.toJSON();
            model.types = router.types.toJSON();
            model.municipalities = router.municipalities.toJSON();
            var itemView = new VoluntaryWork.Views.Form({model: model, collection: router.voluntaryWorks}).render();
            console.log('model', model);
          });
        }



        $('#voluntaryWorkDetails').append(itemView.$el);

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