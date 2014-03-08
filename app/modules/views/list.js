define(function(require, exports, module) {

  var $ = require("jquery");
  var _ = require("underscore");
  var Backbone = require("backbone");
  var app = require("app");
  var VoluntaryWork = require("modules/voluntary-work");
  var ItemView = require("modules/views/item");

  module.exports = Backbone.View.extend({    //template: require("ldsh!../templates/voluntary-work-list"),

    serialize: function() {
      return { users: this.collection };
    },

    beforeRender: function() { },
    afterRender: function() { },
    initialize: function() {
      // Listen for events and refetch if something changed
      var view = this;
      this.update(function() {
        // TODO: this should be fixed!
        view.collection.on('itemAdded', function() {
          view.update.call(view);
        });
        view.show();
      });
    },
    update: function(after) {
      var view = this;
      console.log('updating (fetching)');
      this.collection.fetch({
        success: function(items) {
          view.render();
          if (after) {
            after();
          }
        }
      });
    },
    addOne: function(item) {
      var itemView = new ItemView({model: item}).render();
      $('ul.itemList').append(itemView.$el);
    },
    render: function() {
      var $itemList = $('ul.itemList').empty();
      this.collection.forEach(this.addOne);
      // Scroll window to the top once list updated
      window.scrollTo(0,0);
    },
    show: function() {
      $('#voluntaryWorkDetails').hide();
      $('#voluntaryWorkList').show();
    },
    hide: function() {
      $('#voluntaryWorkList').hide();
    }

  });


});
