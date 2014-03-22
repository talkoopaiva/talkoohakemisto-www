define(['module', 'underscore', 'backbone', 'jquery', 'app', 'hbs!../templates/listitem'],
        function(module, _, Backbone, $, app, template) {
  module.exports = Backbone.Layout.extend({
    template: function(data) {
      return template(data);
    }
  });
});
