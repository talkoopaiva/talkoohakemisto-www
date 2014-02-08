define(function(require, exports, module) {
  "use strict";

  // External dependencies.
  //var Backbone = require("backbone");

  var VoluntaryWork = require("components/voluntary-work/index");

  require("collectionCache");
  require("bootstrap");

  // Defining the application router.
  module.exports = Backbone.Router.extend({
    initialize: function() {
      // Set up the voluntaryWorks.
      this.voluntaryWorks = new VoluntaryWork.Collection();

      // Use main layout and set Views.
      var Layout = Backbone.Layout.extend({
        el: "main",

        template: require("ldsh!./templates/main"),

        views: {
          ".voluntaryWorks": new VoluntaryWork.Views.List({ collection: this.voluntaryWorks })
        }
      });
      
      // Render to the page.
      new Layout().render();
    },

    routes: {
      "": "index"
    },

    index: function() {
      // Reset the state and render.
      this.reset();
      console.log("Welcome to your / route.");
    },

    // Shortcut for building a url.
    go: function() {
      return this.navigate(_.toArray(arguments).join("/"), true);
    },

    reset: function() {
      // Reset collections to initial state.
      if (this.voluntaryWorks.length) {
        this.voluntaryWorks.reset();
      }

      // Reset active model.
      app.active = false;
      this.commits.repo = false;
    }
  });
});
