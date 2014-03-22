define(['module', 'underscore', 'backbone', 'jquery', 'app', 'views/listitem', 'hbs!../templates/details'],
        function(module, _, Backbone, $, app, ItemView, template) {
  module.exports = Backbone.Layout.extend({
    template: template,
    serialize: function() {
      // TODO: create icon URL based on the WorkType
      // Generate URL to details view
      return this.model.toJSON();
    },
    addView: function(model, render) {
      // Insert a nested View into this View.
      var view = this.insertView("#other-talkoot", new ItemView({ model: model }));

      // Only trigger render if it not inserted inside `beforeRender`.
      if (render !== false) {
        view.render();
      }
    },

    beforeRender: function() {
      var currentModel = this.model;
      _.chain(this.suggestions.models).sample(5).each(function(model) {
        // Don't show the same item in suggestions
        if (model === currentModel) {
          return true;
        }
        this.addView(model, false);
      }, this);
    },

    initialize: function() {
      //this.listenTo(this.suggestions, "add", this.addView);
      //this.model.on("change", this.render());
    }
  });
});
