define(['module', 'underscore', 'backbone', 'jquery', 'app', 'views/listitem', 'hbs!../templates/list'],
        function(module, _, Backbone, $, app, ItemView, template) {
  module.exports = Backbone.Layout.extend({
    template: template,
    addView: function(model, render) {
      // Insert a nested View into this View.
      var view = this.insertView("#talkoot", new ItemView({ model: model }));

      // Only trigger render if it not inserted inside `beforeRender`.
      if (render !== false) {
        view.render();
      }
    },

    beforeRender: function() {
      this.collection.each(function(model) {
        this.addView(model, false);
      }, this);
    },

    initialize: function() {
      this.listenTo(this.collection, "add", this.addView);
    }
  });
});
