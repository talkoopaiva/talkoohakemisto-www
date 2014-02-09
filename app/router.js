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
      "form": "form"
    },

    index: function() {

      console.log("Welcome to your / route.");
      var singleWork = new VoluntaryWork.Model({
        title: "Töölön torin siivous"
      });



    },

    list: function() {
      console.log('list route triggered');

      // Empty existing itemlist
      //$('ul.itemList').html('');

      if($('ul.itemList > li').length < 1) {
        this.voluntaryWorks.fetch({
          success: function(items) {
            items.forEach(function(item) {
              var itemView = new VoluntaryWork.Views.Item({model: item}).render();
              $('ul.itemList').append(itemView.$el);
            });
          }
        });
      }

      $('#voluntaryWorkList').show();
      $('#voluntaryWorkDetails').hide();

    },

    form: function() {
      if (this.municipalities.length < 1 || this.types.length < 1) {
        var ctx = this;
        $.when(this.municipalities.fetch(), this.types.fetch()).done(function() {
          renderForm(ctx);
        });
      }

      var renderForm = function(ctx) {
        $('#voluntaryWorkDetails').empty();

        var data = {types: ctx.types.toJSON(), municipalities: ctx.municipalities.toJSON()};

        var itemView = new VoluntaryWork.Views.Form({model: data}).render();

        $('#voluntaryWorkDetails').append(itemView.$el);

        $('#voluntaryWorkList').hide();
        $('#voluntaryWorkDetails').show();
      }
    }
  });
});