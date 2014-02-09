define(function(require, exports, module) {
  "use strict";

  var app = require("app");

  var Collection = Backbone.Collection.extend({
    url: function() {
      return app.api + "voluntary_works/" + this.id + "/?callback=?";
    }
  });

  module.exports = Collection;
});
