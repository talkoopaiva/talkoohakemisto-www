define(['module', 'underscore', 'backbone', 'jquery', 'app', 'hbars!templates/listitem', 'templates/helpers/iconUrl'],
        function(module, _, Backbone, $, app, template, iconUrl) {
  module.exports = Backbone.Layout.extend({

    template: template,

    serialize: function() {
      var data = this.model.toJSON();

      // Generate URL to details view
      data.detailsPage = app.root + 'view/' + this.model.id;

      return data;
    }

  });
});
