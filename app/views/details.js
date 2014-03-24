define(['module', 'underscore', 'backbone', 'jquery', 'app', 'views/listitem', 'hbars!templates/details'],
        function(module, _, Backbone, $, app, ItemView, template) {
  module.exports = Backbone.Layout.extend({
    template: template,

    initialize: function(options) {
      this.suggestions = options.suggestions;
    },

    serialize: function() {
      var data = this.model.toJSON();

      // Show only organization if isset
      if (data.organization) {
        data.organizer = data.organization;
        delete data.organization;
      }
      return data;
    },

    afterRender: function() {
      var view = this;
      var currentModel = this.model;

      // Load with it's own time...
      this.suggestions.fetched().then(function() {
        _.chain(view.suggestions.models).sample(5).each(function(model) {
          // Don't show the same item in suggestions
          if (model === currentModel) {
            return true;
          }
          // Insert a nested View into this View.
          view.insertView("#other-talkoot", new ItemView({ model: model })).render();
        });
      });
    },

  });
});
