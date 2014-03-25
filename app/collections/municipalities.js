define(['jquery', 'underscore', 'backbone', 'app'], function($, _, Backbone, app) {
  "use strict";

  return Backbone.Collection.extend(
    { // Instance properties
      model: Backbone.Model.extend({
        initialize: function(){

        }
      }),

      comparator: 'name',

      // Let's load from a static file
      url: app.root + 'app/data/municipalities.json',
    },
    { // Class properties
      type: "municipalities"
    }
  );
});
