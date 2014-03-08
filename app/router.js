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
      /*
      var VoluntaryWorkListLayout = Backbone.Layout.extend({
        el: "voluntaryWorkList",

        template: require("ldsh!./templates/voluntary-work-list")


        , views: {
          ".voluntaryWorkList": new VoluntaryWork.Views.List({ collection: this.voluntaryWorks })
        }
      });*/

      //new VoluntaryWorkListLayout().render();
    },

    routes: {
      "": "list",
      "list": "list",
      "form": "form",
      "view": "view"
    },

    index: function() {

      console.log("Welcome to your / route.");
      var singleWork = new VoluntaryWork.Model({
        title: "Töölön torin siivous"
      });



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

    form: function() {
      //console.log('form route triggered');

      var renderForm = function(router) {
        $('#voluntaryWorkDetails').empty();

        var data = {types: router.types.toJSON(), municipalities: router.municipalities.toJSON(), voluntaryWorks: router.voluntaryWorks};

        var itemView = new VoluntaryWork.Views.Form({model: data}).render();

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