define(['module', 'underscore', 'backbone', 'jquery', 'app', 'hbs!../templates/listitem'],
        function(module, _, Backbone, $, app, template) {
  module.exports = Backbone.Layout.extend({
    template: template,
    serialize: function() {
      // TODO: create icon URL based on the WorkType
      // Generate URL to details view
      return this.model.toJSON();
    }
  });
});
