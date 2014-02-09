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
      "": "index",
      "list": "list"
    },

    index: function() {

      console.log("Welcome to your / route.");
      var singleWork = new VoluntaryWork.Model({
        title: "Töölön torin siivous"
      });
      var types = new Types.Model();
      var municipalities = new Municipalities.Model();

      setTimeout(continueExecution, 2000);

      function continueExecution()
      {
        console.log(types.toJSON());
        console.log(municipalities.toJSON());
      }
    },

    list: function() {
      console.log('list route triggered');

      // Empty existing itemlist
      $('ul.itemList').html('');

      this.voluntaryWorks.fetch({
        success: function(items) {
          items.forEach(function(item) {
            var itemView = new VoluntaryWork.Views.Item({model: item}).render();
            $('ul.itemList').append(itemView.$el);
          });
        }
      });

      $('#voluntaryWorkList').show();
      $('#voluntaryWorkDetails').hide();



      console.log(this.voluntaryWorks);

    }
  });
});