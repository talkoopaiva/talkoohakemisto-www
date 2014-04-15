define(['module', 'underscore', 'backbone', 'jquery', 'app', 'views/listitem', 'hbars!templates/list'],
        function(module, _, Backbone, $, app, ItemView, template) {
  module.exports = Backbone.Layout.extend({
    template: template,
    addView: function(model) {
      // Insert a nested View into this View.
      var view = this.insertView("#talkoot", new ItemView({ model: model }));
    },

    beforeRender: function() {
      this.collection.each(function(model) {
        this.addView(model);
      }, this);
    },

    afterRender: function() {
      this.listenTo(this.collection, "add", this.addView);
    }
  });
});
